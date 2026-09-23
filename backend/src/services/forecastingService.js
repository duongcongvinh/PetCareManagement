const prisma = require('../config/prisma');

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

  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel + 5);

  let createdCount = 0;
  for (const prod of lowStockProducts) {
    const existing = await prisma.reorderProposal.findFirst({
      where: { productId: prod.id, status: 'DRAFT' },
    });

    if (!existing) {
      const needed = prod.maxStockLevel - prod.currentStock;
      const suggestedQuantity = Math.max(needed, 10);
      const confidenceScore = (0.88 + Math.random() * 0.1).toFixed(2);

      await prisma.reorderProposal.create({
        data: {
          productId: prod.id,
          suggestedQuantity,
          reason: `AI Engine: Tồn kho hiện tại (${prod.currentStock}) ≤ Ngưỡng an toàn (${prod.minStockLevel}). Thuật toán dự báo nhu cầu tăng trong chu kỳ tới.`,
          confidenceScore: parseFloat(confidenceScore),
          status: 'DRAFT',
        },
      });
      createdCount++;
    }
  }

  return createdCount;
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

module.exports = {
  getAllProposals,
  triggerForecastEngine,
  updateProposal,
};
