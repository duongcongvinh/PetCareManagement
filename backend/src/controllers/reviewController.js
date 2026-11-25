const reviewService = require('../services/reviewService');

const listReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    const result = await reviewService.getReviews({ targetType, targetId });
    return res.json(result);
  } catch (error) {
    console.error('listReviews error:', error);
    return res.status(500).json({ message: 'Lỗi tải danh sách đánh giá khách hàng.' });
  }
};

const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body, req.user);
    return res.status(201).json({
      message: 'Cảm ơn bạn đã gửi đánh giá cho Petzera!',
      review,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Không thể gửi đánh giá.' });
  }
};

const replyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffReply } = req.body;
    const updated = await reviewService.replyToReview(id, staffReply);
    return res.json({
      message: 'Đã gửi phản hồi tới đánh giá của khách hàng!',
      review: updated,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Không thể gửi phản hồi.' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(id, req.user);
    return res.json({ message: 'Đã xóa đánh giá thành công!' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Không thể xóa đánh giá.' });
  }
};

module.exports = {
  listReviews,
  createReview,
  replyReview,
  deleteReview,
};
