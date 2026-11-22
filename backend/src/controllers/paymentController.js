const { PayOS } = require('@payos/node');

// In-memory cache of payOS payment statuses (kept in sync by both Webhook & payOS API polling)
const payosTransactions = new Map();

const getPayOSClient = () => {
  const clientId = (process.env.PAYOS_CLIENT_ID || '').trim();
  const apiKey = (process.env.PAYOS_API_KEY || '').trim();
  const checksumKey = (process.env.PAYOS_CHECKSUM_KEY || '').trim();

  if (!clientId || !apiKey || !checksumKey) {
    throw new Error('Hệ thống chưa cấu hình đủ khóa PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY.');
  }

  return new PayOS({ clientId, apiKey, checksumKey });
};

const buildVietQrImageUrl = ({ bin, accountNumber, amount, description, accountName }) => {
  if (!bin || !accountNumber) return '';
  const params = new URLSearchParams();
  if (amount) params.set('amount', String(amount));
  if (description) params.set('addInfo', description);
  if (accountName) params.set('accountName', accountName);
  return `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.png?${params.toString()}`;
};

const createPayOSPayment = async (req, res) => {
  try {
    const payOS = getPayOSClient();
    const {
      amount,
      items = [],
      buyerName,
      buyerPhone,
      buyerAddress,
      origin,
    } = req.body || {};

    const cleanAmount = Math.round(Number(amount) || 0);
    if (cleanAmount < 2000) {
      return res.status(400).json({ message: 'Số tiền thanh toán payOS tối thiểu là 2.000 đ.' });
    }

    // Unique positive numeric orderCode required by payOS
    const orderCode = Number(`${String(Date.now()).slice(-7)}${Math.floor(10 + Math.random() * 89)}`);
    // payOS requires description <= 25 ASCII chars for VietQR bank compatibility
    const description = `PETZERA ${orderCode}`.slice(0, 25);

    const baseFrontendUrl = (origin || process.env.FRONTEND_URL || 'https://petzera.id.vn').replace(/\/+$/, '');
    const formattedItems = Array.isArray(items) && items.length > 0
      ? items.map((item) => ({
          name: String(item.name || 'San pham Petzera').slice(0, 80),
          quantity: Math.max(1, Number(item.quantity) || 1),
          price: Math.max(0, Math.round(Number(item.unitPrice || item.price) || 0)),
        }))
      : [{ name: 'Don hang Petzera', quantity: 1, price: cleanAmount }];

    const PAYOS_TTL_SECONDS = 10 * 60; // 10 phút
    const expiredAt = Math.floor(Date.now() / 1000) + PAYOS_TTL_SECONDS;

    const paymentData = {
      orderCode,
      amount: cleanAmount,
      description,
      buyerName: buyerName ? String(buyerName).slice(0, 80) : undefined,
      buyerPhone: buyerPhone ? String(buyerPhone).slice(0, 30) : undefined,
      buyerAddress: buyerAddress ? String(buyerAddress).slice(0, 180) : undefined,
      items: formattedItems,
      expiredAt,
      returnUrl: `${baseFrontendUrl}/thanh-toan?payos=success&orderCode=${orderCode}`,
      cancelUrl: `${baseFrontendUrl}/thanh-toan?payos=cancel&orderCode=${orderCode}`,
    };

    const paymentLink = await payOS.paymentRequests.create(paymentData);

    const qrImageUrl = buildVietQrImageUrl({
      bin: paymentLink.bin,
      accountNumber: paymentLink.accountNumber,
      amount: paymentLink.amount || cleanAmount,
      description: paymentLink.description || description,
      accountName: paymentLink.accountName || '',
    });

    const record = {
      orderCode,
      paymentLinkId: paymentLink.paymentLinkId,
      amount: paymentLink.amount || cleanAmount,
      description: paymentLink.description || description,
      bin: paymentLink.bin || '',
      accountNumber: paymentLink.accountNumber || '',
      accountName: paymentLink.accountName || '',
      checkoutUrl: paymentLink.checkoutUrl,
      qrCode: paymentLink.qrCode,
      qrImageUrl,
      status: paymentLink.status || 'PENDING',
      expiresAt: expiredAt * 1000,
      createdAt: Date.now(),
    };

    payosTransactions.set(orderCode, record);

    return res.json({
      status: 'ok',
      data: record,
    });
  } catch (error) {
    console.error('createPayOSPayment error:', error);
    return res.status(500).json({
      message: error.message || 'Không thể khởi tạo giao dịch thanh toán payOS.',
    });
  }
};

const getPayOSPaymentStatus = async (req, res) => {
  try {
    const orderCode = Number(req.params.orderCode);
    if (!orderCode || Number.isNaN(orderCode)) {
      return res.status(400).json({ message: 'Mã đơn hàng payOS không hợp lệ.' });
    }

    const cached = payosTransactions.get(orderCode);
    if (cached && cached.status === 'PAID') {
      return res.json({ status: 'ok', data: cached });
    }

    const payOS = getPayOSClient();
    const info = await payOS.paymentRequests.get(orderCode);
    const liveStatus = info.status || 'PENDING';

    const merged = {
      ...(cached || {}),
      orderCode,
      amount: info.amount || cached?.amount || 0,
      amountPaid: info.amountPaid || 0,
      amountRemaining: info.amountRemaining ?? info.amount ?? 0,
      status: liveStatus,
      transactions: info.transactions || [],
      updatedAt: Date.now(),
    };
    payosTransactions.set(orderCode, merged);

    return res.json({ status: 'ok', data: merged });
  } catch (error) {
    console.error('getPayOSPaymentStatus error:', error);
    return res.status(500).json({
      message: error.message || 'Không thể kiểm tra trạng thái thanh toán payOS.',
    });
  }
};

const cancelPayOSPayment = async (req, res) => {
  try {
    const orderCode = Number(req.params.orderCode);
    if (!orderCode || Number.isNaN(orderCode)) {
      return res.status(400).json({ message: 'Mã đơn hàng payOS không hợp lệ.' });
    }

    const payOS = getPayOSClient();
    const reason = (req.body && req.body.reason) || 'Khach hang huy thanh toan';
    let cancelled = null;
    try {
      cancelled = await payOS.paymentRequests.cancel(orderCode, String(reason).slice(0, 100));
    } catch (cancelErr) {
      // Nếu đơn đã hết hạn hoặc đã hủy sẵn trên payOS thì vẫn coi như hủy xong
      console.warn(`cancelPayOSPayment notice for #${orderCode}:`, cancelErr.message);
    }
    const cached = payosTransactions.get(orderCode) || { orderCode };
    const updated = { ...cached, status: cancelled?.status || 'CANCELLED', updatedAt: Date.now() };
    payosTransactions.set(orderCode, updated);

    return res.json({ status: 'ok', data: updated });
  } catch (error) {
    console.error('cancelPayOSPayment error:', error);
    return res.status(500).json({
      message: error.message || 'Không thể hủy giao dịch payOS.',
    });
  }
};

const handlePayOSWebhook = async (req, res) => {
  try {
    const body = req.body || {};

    // PayOS connectivity verification test when configuring Webhook URL in dashboard
    if (!body.data || body.data.orderCode === 123 || body.data.description === 'VQRIO123') {
      return res.status(200).json({ error: 0, message: 'Webhook endpoint ready', data: null });
    }

    const payOS = getPayOSClient();
    const verified = await payOS.webhooks.verify(body);

    const orderCode = Number(verified.orderCode);
    const isPaid = body.code === '00' || body.success === true || verified.code === '00';

    if (orderCode && isPaid) {
      const existing = payosTransactions.get(orderCode) || { orderCode };
      payosTransactions.set(orderCode, {
        ...existing,
        orderCode,
        amount: verified.amount || existing.amount,
        amountPaid: verified.amount || existing.amount,
        amountRemaining: 0,
        status: 'PAID',
        paidAt: new Date().toISOString(),
        reference: verified.reference,
      });
      console.log(`✅ [payOS Webhook] Order #${orderCode} PAID (${verified.amount} VND)`);
    }

    return res.status(200).json({ error: 0, message: 'Webhook verified', data: verified });
  } catch (error) {
    console.error('handlePayOSWebhook verification failed:', error.message);
    return res.status(400).json({ error: -1, message: error.message || 'Invalid webhook signature' });
  }
};

module.exports = {
  createPayOSPayment,
  getPayOSPaymentStatus,
  cancelPayOSPayment,
  handlePayOSWebhook,
};
