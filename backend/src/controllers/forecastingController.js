const forecastingService = require('../services/forecastingService');

const getProposals = async (req, res) => {
  try {
    const proposals = await forecastingService.getAllProposals();
    return res.json(proposals);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách đề xuất nhập hàng.' });
  }
};

const triggerAIForecast = async (req, res) => {
  try {
    const createdCount = await forecastingService.triggerForecastEngine();
    return res.json({
      message: `Đã chạy Module AI Dự báo! Tạo mới ${createdCount} đề xuất nhập kho thông minh.`,
    });
  } catch (error) {
    console.error('Trigger AI forecast error:', error);
    return res.status(500).json({ message: 'Lỗi khi khởi chạy mô hình AI dự báo.' });
  }
};

const seasonalForecast = async (req, res) => {
  try {
    const result = await forecastingService.runSeasonalForecast(req.body);
    return res.json(result);
  } catch (error) {
    console.error('Seasonal AI proxy error:', error.message);
    return res
      .status(error.statusCode || 502)
      .json({ message: error.message || 'Không thể kết nối AI Forecasting Engine.' });
  }
};

const orderHistoryForecast = async (req, res) => {
  try {
    const result = await forecastingService.runOrderHistoryForecast(req.body);
    return res.json(result);
  } catch (error) {
    console.error('Order history AI proxy error:', error.message);
    return res
      .status(error.statusCode || 502)
      .json({ message: error.message || 'Không thể phân tích lịch sử đơn hàng từ AI Engine.' });
  }
};

const inventoryRiskForecast = async (req, res) => {
  try {
    const result = await forecastingService.runInventoryRiskForecast(req.body);
    return res.json(result);
  } catch (error) {
    console.error('Inventory risk AI proxy error:', error.message);
    return res
      .status(error.statusCode || 502)
      .json({ message: error.message || 'Không thể tính toán rủi ro tồn kho từ AI Engine.' });
  }
};

const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { proposal } = await forecastingService.updateProposal(id, status);

    return res.json({
      message:
        status === 'APPROVED'
          ? `Đã duyệt đề xuất nhập kho thành công! Đã tự động nhập ${proposal.suggestedQuantity} ${proposal.product?.name || 'sản phẩm'} vào hệ thống.`
          : 'Đã từ chối đề xuất nhập kho.',
      proposal,
    });
  } catch (error) {
    console.error('Update proposal error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi khi cập nhật trạng thái đề xuất.' });
  }
};

module.exports = {
  getProposals,
  triggerAIForecast,
  seasonalForecast,
  orderHistoryForecast,
  inventoryRiskForecast,
  updateProposalStatus,
};
