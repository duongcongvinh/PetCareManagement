const prisma = require('../config/prisma');

const getAppointmentsByUser = async (user) => {
  let where = {};
  if (user.role === 'CUSTOMER') {
    where.customerId = user.id;
  } else if (user.role === 'CARE_STAFF') {
    where.OR = [{ staffId: user.id }, { staffId: null }];
  }

  return await prisma.appointment.findMany({
    where,
    include: {
      pet: true,
      customer: { select: { fullName: true, phone: true, email: true } },
      staff: { select: { fullName: true } },
      service: true,
    },
    orderBy: { appointmentDate: 'desc' },
  });
};

const createNewAppointment = async ({ petId, serviceId, appointmentDate, timeSlot, notes }, customerId) => {
  const targetDate = new Date(appointmentDate);

  // Kiểm tra trùng slot giờ của cùng dịch vụ trong ngày
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingSlot = await prisma.appointment.findFirst({
    where: {
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      timeSlot,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
    },
  });

  if (existingSlot) {
    throw new Error(
      `Khung giờ ${timeSlot} ngày ${new Date(appointmentDate).toLocaleDateString('vi-VN')} đã có khách đặt. Vui lòng chọn khung giờ khác!`
    );
  }

  return await prisma.appointment.create({
    data: {
      petId,
      customerId,
      serviceId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      notes,
      status: 'PENDING',
    },
    include: { pet: true, service: true },
  });
};

const updateAppointmentStatus = async (id, { status, careSummary, staffId }, user) => {
  const dataToUpdate = {};
  if (status) dataToUpdate.status = status;
  if (careSummary) dataToUpdate.careSummary = careSummary;
  if (staffId) dataToUpdate.staffId = staffId;
  if (user.role === 'CARE_STAFF' && !dataToUpdate.staffId) {
    dataToUpdate.staffId = user.id;
  }

  return await prisma.appointment.update({
    where: { id },
    data: dataToUpdate,
    include: { pet: true, service: true, customer: true, staff: true },
  });
};

const cancelAppointment = async (id, user) => {
  const app = await prisma.appointment.findUnique({ where: { id } });
  if (!app) {
    throw new Error('Lịch hẹn không tồn tại.');
  }
  if (user.role === 'CUSTOMER' && app.customerId !== user.id) {
    throw new Error('Bạn không có quyền hủy lịch hẹn này.');
  }
  if (app.status !== 'PENDING') {
    throw new Error('Chỉ có thể hủy ca hẹn khi đang ở trạng thái chờ tiếp nhận (PENDING).');
  }
  return await prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { pet: true, service: true },
  });
};

const getAllServices = async () => {
  return await prisma.serviceCatalog.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const createNewService = async ({ name, description, durationMinutes, price, category }) => {
  return await prisma.serviceCatalog.create({
    data: {
      name,
      description,
      durationMinutes: parseInt(durationMinutes || 45),
      price: parseFloat(price),
      category: category || 'Spa',
    },
  });
};

const deleteService = async (id) => {
  return await prisma.serviceCatalog.delete({ where: { id } });
};

module.exports = {
  getAppointmentsByUser,
  createNewAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAllServices,
  createNewService,
  deleteService,
};
