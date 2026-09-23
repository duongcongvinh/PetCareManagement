const prisma = require('../config/prisma');

const createNewOrder = async (items, customerId) => {
  if (!items || !items.length) {
    throw new Error('Đơn hàng phải chứa ít nhất 1 sản phẩm!');
  }

  let totalAmount = 0;
  const orderItemsData = [];

  // Kiểm tra và tính tiền từng sản phẩm
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      throw new Error(`Sản phẩm mã ID ${item.productId} không tồn tại.`);
    }
    if (product.currentStock < item.quantity) {
      throw new Error(
        `Sản phẩm "${product.name}" chỉ còn ${product.currentStock} trong kho (bạn đặt ${item.quantity}).`
      );
    }

    totalAmount += product.unitPrice * item.quantity;
    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.unitPrice,
    });
  }

  // Đảm bảo tính toàn vẹn giao dịch (Transaction)
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId,
        totalAmount,
        status: 'PAID',
        items: {
          create: orderItemsData,
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Trừ số lượng kho & tạo nhật ký xuất kho
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { decrement: item.quantity } },
      });

      await tx.stockTransaction.create({
        data: {
          productId: item.productId,
          type: 'OUT',
          quantity: item.quantity,
          note: `Xuất kho tự động cho Đơn hàng #${order.id.slice(-6)}`,
        },
      });
    }

    return order;
  });

  return result;
};

const getOrdersByUser = async (user) => {
  const where = user.role === 'CUSTOMER' ? { customerId: user.id } : {};
  return await prisma.order.findMany({
    where,
    include: {
      customer: { select: { fullName: true, phone: true, email: true } },
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  createNewOrder,
  getOrdersByUser,
};
