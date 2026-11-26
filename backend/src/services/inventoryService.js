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
  image,
  brand,
  unit,
  targetPet,
  origin,
  expiryDate,
  description,
  usageGuide,
  status,
}) => {
  const validSupplierId =
    supplierId && /^[0-9a-fA-F]{24}$/.test(String(supplierId)) ? String(supplierId) : null;

  const product = await prisma.product.create({
    data: {
      name,
      category,
      sku,
      unitPrice: parseFloat(unitPrice),
      costPrice: parseFloat(costPrice),
      currentStock: parseInt(currentStock || 0, 10),
      minStockLevel: parseInt(minStockLevel || 10, 10),
      maxStockLevel: parseInt(maxStockLevel || 100, 10),
      supplierId: validSupplierId,
      image: image ? String(image).trim() : null,
      brand: brand ? String(brand).trim() : null,
      unit: unit ? String(unit).trim() : null,
      targetPet: targetPet ? String(targetPet).trim() : null,
      origin: origin ? String(origin).trim() : null,
      expiryDate: expiryDate ? String(expiryDate).trim() : null,
      description: description ? String(description).trim() : null,
      usageGuide: usageGuide ? String(usageGuide).trim() : null,
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
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

const updateProductStock = async (id, { type, quantity, note, minStockLevel, maxStockLevel }) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new Error('Sản phẩm không tồn tại.');
  }

  let newStock = product.currentStock;
  const changeQty = parseInt(quantity, 10);

  if (Number.isNaN(changeQty) || changeQty < 0) {
    throw new Error('Số lượng tồn kho không hợp lệ (không được âm).');
  }

  if (type === 'IN') {
    if (changeQty <= 0) throw new Error('Số lượng nhập kho phải lớn hơn 0!');
    newStock += changeQty;
  } else if (type === 'OUT') {
    if (changeQty <= 0) throw new Error('Số lượng xuất kho phải lớn hơn 0!');
    if (product.currentStock < changeQty) {
      throw new Error('Số lượng xuất vượt quá tồn kho hiện tại!');
    }
    newStock -= changeQty;
  } else if (type === 'ADJUSTMENT') {
    newStock = changeQty;
  } else {
    throw new Error('Loại giao dịch kho không hợp lệ (chỉ hỗ trợ IN, OUT, ADJUSTMENT).');
  }

  const updateData = { currentStock: newStock };
  if (minStockLevel !== undefined && minStockLevel !== '' && !Number.isNaN(parseInt(minStockLevel, 10))) {
    updateData.minStockLevel = Math.max(0, parseInt(minStockLevel, 10));
  }
  if (maxStockLevel !== undefined && maxStockLevel !== '' && !Number.isNaN(parseInt(maxStockLevel, 10))) {
    updateData.maxStockLevel = Math.max(1, parseInt(maxStockLevel, 10));
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updateData,
  });

  await prisma.stockTransaction.create({
    data: {
      productId: id,
      type,
      quantity: changeQty,
      note:
        note ||
        (type === 'ADJUSTMENT'
          ? `Điều chỉnh tồn kho: ${product.currentStock} → ${newStock}`
          : 'Cập nhật kho thủ công'),
    },
  });

  return updatedProduct;
};

const updateProduct = async (
  id,
  {
    name,
    category,
    sku,
    unitPrice,
    costPrice,
    currentStock,
    minStockLevel,
    maxStockLevel,
    supplierId,
    image,
    brand,
    unit,
    targetPet,
    origin,
    expiryDate,
    description,
    usageGuide,
    status,
  }
) => {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id || ''))) {
    throw new Error('Mã sản phẩm không hợp lệ trong cơ sở dữ liệu.');
  }
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Sản phẩm không tồn tại.');
  }

  const data = {};
  if (name !== undefined && String(name).trim()) data.name = String(name).trim();
  if (category !== undefined && String(category).trim()) data.category = String(category).trim();
  if (sku !== undefined && String(sku).trim()) data.sku = String(sku).trim().toUpperCase();
  if (unitPrice !== undefined && !Number.isNaN(parseFloat(unitPrice))) data.unitPrice = Math.max(0, parseFloat(unitPrice));
  if (costPrice !== undefined && !Number.isNaN(parseFloat(costPrice))) data.costPrice = Math.max(0, parseFloat(costPrice));
  if (currentStock !== undefined && !Number.isNaN(parseInt(currentStock, 10))) data.currentStock = Math.max(0, parseInt(currentStock, 10));
  if (minStockLevel !== undefined && !Number.isNaN(parseInt(minStockLevel, 10))) data.minStockLevel = Math.max(0, parseInt(minStockLevel, 10));
  if (maxStockLevel !== undefined && !Number.isNaN(parseInt(maxStockLevel, 10))) data.maxStockLevel = Math.max(1, parseInt(maxStockLevel, 10));
  if (supplierId !== undefined) {
    data.supplierId = supplierId && /^[0-9a-fA-F]{24}$/.test(String(supplierId)) ? String(supplierId) : null;
  }
  if (image !== undefined) data.image = image ? String(image).trim() : null;
  if (brand !== undefined) data.brand = brand ? String(brand).trim() : null;
  if (unit !== undefined) data.unit = unit ? String(unit).trim() : null;
  if (targetPet !== undefined) data.targetPet = targetPet ? String(targetPet).trim() : null;
  if (origin !== undefined) data.origin = origin ? String(origin).trim() : null;
  if (expiryDate !== undefined) data.expiryDate = expiryDate ? String(expiryDate).trim() : null;
  if (description !== undefined) data.description = description ? String(description).trim() : null;
  if (usageGuide !== undefined) data.usageGuide = usageGuide ? String(usageGuide).trim() : null;
  if (status !== undefined) data.status = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

  return await prisma.product.update({
    where: { id },
    data,
    include: { supplier: true },
  });
};

const deleteProduct = async (id) => {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id || ''))) {
    throw new Error('Mã sản phẩm không hợp lệ trong cơ sở dữ liệu.');
  }
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa.');
  }

  await prisma.orderItem.deleteMany({ where: { productId: id } });
  return await prisma.product.delete({ where: { id } });
};

const getLowStockProducts = async () => {
  const allProducts = await prisma.product.findMany({ include: { supplier: true } });
  return allProducts.filter((p) => p.currentStock <= p.minStockLevel);
};

const getAllSuppliers = async () => {
  return await prisma.supplier.findMany({ orderBy: { name: 'asc' } });
};

const createNewSupplier = async ({ name, contactPerson, phone, email, address }) => {
  return await prisma.supplier.create({
    data: {
      name,
      contactPerson,
      phone,
      email,
      address,
    },
  });
};

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  getLowStockProducts,
  getAllSuppliers,
  createNewSupplier,
};
