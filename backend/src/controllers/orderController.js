const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const customerId = req.user.id;

    const order = await orderService.createNewOrder(items, customerId);
    return res.status(201).json({
      message: 'Đặt hàng thành công và kho đã được cập nhật!',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi khi tạo đơn hàng.' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user);
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updated = await orderService.updateOrderStatus(req.params.id, req.body.status);
    return res.json({ message: 'Cập nhật trạng thái đơn hàng thành công!', order: updated });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi cập nhật trạng thái đơn hàng.' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
