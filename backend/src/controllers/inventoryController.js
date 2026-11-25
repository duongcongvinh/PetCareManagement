const inventoryService = require('../services/inventoryService');

const getProducts = async (req, res) => {
  try {
    const products = await inventoryService.getAllProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm kho.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await inventoryService.createNewProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Lỗi khi tạo sản phẩm mới.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await inventoryService.updateProduct(id, req.body);
    return res.json({
      message: 'Cập nhật thông tin sản phẩm thành công!',
      product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi khi cập nhật sản phẩm.' });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity, note, minStockLevel, maxStockLevel } = req.body; // type: 'IN' | 'OUT' | 'ADJUSTMENT'

    const updatedProduct = await inventoryService.updateProductStock(id, {
      type,
      quantity,
      note,
      minStockLevel,
      maxStockLevel,
    });
    return res.json({
      message: 'Cập nhật tồn kho thành công!',
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi khi cập nhật tồn kho.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await inventoryService.deleteProduct(id);
    return res.json({ message: 'Xóa sản phẩm khỏi kho thành công!' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi khi xóa sản phẩm.' });
  }
};

const getLowStockAlerts = async (req, res) => {
  try {
    const products = await inventoryService.getLowStockProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm sắp hết.' });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await inventoryService.getAllSuppliers();
    return res.json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà cung cấp.' });
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplier = await inventoryService.createNewSupplier(req.body);
    return res.status(201).json({
      message: 'Thêm nhà cung cấp mới thành công!',
      supplier,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi thêm nhà cung cấp mới.' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getLowStockAlerts,
  getSuppliers,
  createSupplier,
};
