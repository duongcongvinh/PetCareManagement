const appointmentService = require('../services/appointmentService');

const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByUser(req.user);
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách lịch hẹn.' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { petId, serviceId, appointmentDate, totalPrice, timeSlot, notes } = req.body;
    const customerId = req.user.id;

    if (!petId || !serviceId || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đặt lịch!' });
    }

    const appointment = await appointmentService.createNewAppointment(
      { petId, serviceId, appointmentDate, totalPrice, timeSlot, notes },
      customerId
    );

    return res.status(201).json({
      message: 'Đặt lịch hẹn thành công!',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi khi tạo lịch hẹn.' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, careSummary, staffId } = req.body;

    const updated = await appointmentService.updateAppointmentStatus(
      id,
      { status, careSummary, staffId },
      req.user
    );

    return res.json({
      message: 'Cập nhật trạng thái lịch hẹn thành công!',
      appointment: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái lịch hẹn.' });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await appointmentService.rescheduleAppointment(id, req.body, req.user);
    return res.json({
      message: 'Đổi lịch hẹn thành công!',
      appointment: updated,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi khi đổi lịch hẹn.' });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const cancelled = await appointmentService.cancelAppointment(id, req.user);
    return res.json({
      message: 'Hủy lịch hẹn thành công!',
      appointment: cancelled,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi khi hủy lịch hẹn.' });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await appointmentService.getAllServices();
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh mục dịch vụ.' });
  }
};

const createService = async (req, res) => {
  try {
    const service = await appointmentService.createNewService(req.body);
    return res.status(201).json({
      message: 'Tạo dịch vụ mới thành công!',
      service,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi khi tạo dịch vụ.' });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await appointmentService.updateService(req.params.id, req.body);
    return res.json({
      message: 'Cập nhật dịch vụ thành công!',
      service,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi khi cập nhật dịch vụ.' });
  }
};

const deleteService = async (req, res) => {
  try {
    await appointmentService.deleteService(req.params.id);
    return res.json({ message: 'Xóa dịch vụ thành công!' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi khi xóa dịch vụ.' });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateStatus,
  rescheduleAppointment,
  cancelAppointment,
  getServices,
  createService,
  updateService,
  deleteService,
};
