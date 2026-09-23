const prisma = require('../config/prisma');

const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: { supplier: true },
    orderBy: { name: 'asc' },
  });
};

const createNewProduct = async ({
  name,
  category,
  sku,
  unitPrice,
  costPrice,
  currentStock,
  minStockLevel,
  maxStockLevel,
  supplierId,
}) => {
  const product = await prisma.product.create({
    data: {
      name,
      category,
      sku,
      unitPrice: parseFloat(unitPrice),
      costPrice: parseFloat(costPrice),
      currentStock: parseInt(currentStock || 0),
      minStockLevel: parseInt(minStockLevel || 10),
      maxStockLevel: parseInt(maxStockLevel || 100),
      supplierId: supplierId || null,
    },
  });

  if (product.currentStock > 0) {
    await prisma.stockTransaction.create({
      data: {
        productId: product.id,
        type: 'IN',
        quantity: product.currentStock,
        note: 'Khởi tạo số lượng kho ban đầu',
      },
    });
  }

  return product;
};

const updateProductStock = async (id, { type, quantity, note }) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error('Sản phẩm không tồn tại.');
  }

  let newStock = product.currentStock;
  const changeQty = parseInt(quantity);

  if (type === 'IN') {
    newStock += changeQty;
  } else if (type === 'OUT') {
    if (product.currentStock < changeQty) {
      throw new Error('Số lượng xuất vượt quá tồn kho hiện tại!');
    }
    newStock -= changeQty;
  } else if (type === 'ADJUSTMENT') {
    newStock = changeQty;
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { currentStock: newStock },
  });

  await prisma.stockTransaction.create({
    data: {
      productId: id,
      type,
      quantity: changeQty,
      note: note || 'Cập nhật kho thủ công',
    },
  });

  return updatedProduct;
};

const getLowStockProducts = async () => {
  const allProducts = await prisma.product.findMany({ include: { supplier: true } });
  return allProducts.filter((p) => p.currentStock <= p.minStockLevel);
};

const getAllSuppliers = async () => {
  return await prisma.supplier.findMany({ orderBy: { name: 'asc' } });
};

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProductStock,
  getLowStockProducts,
  getAllSuppliers,
};
