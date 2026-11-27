const prisma = require('../config/prisma');

const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://localhost:8000').replace(/\/+$/, '');

const callAIService = async (path, payload) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${AI_SERVICE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.detail || data.message || `AI service trả về lỗi HTTP ${res.status}`);
      err.statusCode = res.status;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
};

const getAllProposals = async () => {
  return await prisma.reorderProposal.findMany({
    include: {
      product: {
        include: { supplier: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const triggerForecastEngine = async () => {
  const products = await prisma.product.findMany({
    include: { supplier: true },
  });

  // Lấy lịch sử bán 30 ngày gần nhất từ Order thực tế trong MongoDB (nếu có)
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  let recentOrders = [];
  try {
    recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: since30d } },
      include: { items: true },
    });
  } catch (e) {
    recentOrders = [];
  }

  const dailySalesByProduct = new Map();
  const nowMs = Date.now();
  for (const order of recentOrders) {
    const dayIndex = Math.min(
      29,
      Math.max(0, 29 - Math.floor((nowMs - new Date(order.createdAt).getTime()) / (24 * 60 * 60 * 1000)))
    );
    for (const item of order.items || []) {
      if (!dailySalesByProduct.has(item.productId)) {
        dailySalesByProduct.set(item.productId, new Array(30).fill(0));
      }
      dailySalesByProduct.get(item.productId)[dayIndex] += Number(item.quantity) || 0;
    }
  }

  let aiProposals = null;
  try {
    const aiPayload = {
      products: products.map((p) => ({
        product_id: p.id,
        sku: p.sku,
        product_name: p.name,
        current_stock: p.currentStock,
        min_stock_level: p.minStockLevel,
        max_stock_level: p.maxStockLevel,
        lead_time_days: 5,
        unit_price: p.unitPrice,
        cost_price: Math.round((p.unitPrice || 0) * 0.65),
        category: p.category,
        supplier_name: p.supplier?.name || 'Royal Canin Việt Nam',
        historical_sales_30d: dailySalesByProduct.get(p.id) || [],
      })),
    };
    aiProposals = await callAIService('/api/forecast/predict', aiPayload);
  } catch (err) {
    console.warn('AI service /predict unavailable, using deterministic ROP fallback:', err.message);
  }

  const candidates = Array.isArray(aiProposals)
    ? aiProposals.map((item) => ({
        productId: item.product_id,
        suggestedQuantity: item.suggested_quantity,
        reason: item.reason,
        confidenceScore: item.confidence_score,
      }))
    : products
        .filter((p) => p.currentStock <= p.minStockLevel + 5)
        .map((prod) => ({
          productId: prod.id,
          suggestedQuantity: Math.max(prod.maxStockLevel - prod.currentStock, 10),
          reason: `AI ROP Engine: Tồn kho hiện tại (${prod.currentStock}) ≤ Ngưỡng an toàn (${prod.minStockLevel}). Đề xuất nhập bù về định mức tối đa (${prod.maxStockLevel}).`,
          confidenceScore: 0.92,
        }));

  let createdCount = 0;
  for (const cand of candidates) {
    const existing = await prisma.reorderProposal.findFirst({
      where: { productId: cand.productId, status: 'DRAFT' },
    });

    if (!existing) {
      await prisma.reorderProposal.create({
        data: {
          productId: cand.productId,
          suggestedQuantity: cand.suggestedQuantity,
          reason: cand.reason,
          confidenceScore: parseFloat(cand.confidenceScore) || 0.92,
          status: 'DRAFT',
        },
      });
      createdCount++;
    }
  }

  return createdCount;
};

const runSeasonalForecast = async (payload) => {
  return await callAIService('/api/forecast/multi-year-seasonal', payload);
};

const runOrderHistoryForecast = async (payload) => {
  return await callAIService('/api/forecast/order-history-predict', payload);
};

const runInventoryRiskForecast = async (payload) => {
  return await callAIService('/api/forecast/predict', payload);
};

const updateProposal = async (id, status) => {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new Error('Trạng thái phải là APPROVED hoặc REJECTED.');
  }

  const proposal = await prisma.reorderProposal.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!proposal) {
    throw new Error('Đề xuất không tồn tại.');
  }

  const updated = await prisma.reorderProposal.update({
    where: { id },
    data: { status },
  });

  if (status === 'APPROVED') {
    await prisma.product.update({
      where: { id: proposal.productId },
      data: { currentStock: { increment: proposal.suggestedQuantity } },
    });

    await prisma.stockTransaction.create({
      data: {
        productId: proposal.productId,
        type: 'IN',
        quantity: proposal.suggestedQuantity,
        note: `Nhập kho theo Đơn đề xuất AI đã duyệt #${proposal.id.slice(-6)}`,
      },
    });
  }

  return { updated, proposal };
};

const createManualProposal = async ({ productId, suggestedQuantity, reason, confidenceScore }) => {
  if (!productId || !/^[0-9a-fA-F]{24}$/.test(String(productId))) {
    throw new Error('Mã sản phẩm không hợp lệ.');
  }
  return await prisma.reorderProposal.create({
    data: {
      productId,
      suggestedQuantity: Math.max(1, parseInt(suggestedQuantity, 10) || 15),
      reason: reason || 'Đề xuất nhập kho bổ sung.',
      confidenceScore: parseFloat(confidenceScore) || 0.95,
      status: 'DRAFT',
    },
    include: {
      product: {
        include: { supplier: true },
      },
    },
  });
};

const deleteProposal = async (id) => {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id || ''))) {
    throw new Error('Mã phiếu đề xuất không hợp lệ.');
  }
  return await prisma.reorderProposal.delete({ where: { id } });
};

module.exports = {
  getAllProposals,
  triggerForecastEngine,
  runSeasonalForecast,
  runOrderHistoryForecast,
  runInventoryRiskForecast,
  updateProposal,
  createManualProposal,
  deleteProposal,
};
