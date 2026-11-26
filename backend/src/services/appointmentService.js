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

const createNewAppointment = async (
  { petId, serviceId, appointmentDate, totalPrice, timeSlot, notes },
  customerId
) => {
  const targetDate = new Date(appointmentDate);
  const service = await prisma.serviceCatalog.findUnique({ where: { id: serviceId } });

  // Kiểm tra trùng khung giờ (Slot Lock) trong cùng ngày
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
      appointmentDate: targetDate,
      totalPrice: totalPrice !== undefined && totalPrice !== null ? parseFloat(totalPrice) : service?.price || 0,
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

const rescheduleAppointment = async (
  id,
  { appointmentDate, totalPrice, timeSlot, notes },
  user
) => {
  const existing = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true },
  });
  if (!existing) {
    throw new Error('Lịch hẹn không tồn tại.');
  }
  if (user.role === 'CUSTOMER' && existing.customerId !== user.id) {
    throw new Error('Bạn không có quyền chỉnh sửa lịch hẹn này.');
  }
  const editableStatuses = user.role === 'CUSTOMER' ? ['PENDING'] : ['PENDING', 'CONFIRMED'];
  if (!editableStatuses.includes(existing.status)) {
    throw new Error('Chỉ có thể đổi lịch khi ca hẹn chưa bắt đầu thực hiện.');
  }

  const nextDate = appointmentDate ? new Date(appointmentDate) : existing.appointmentDate;
  const nextSlot = timeSlot || existing.timeSlot;

  const startOfDay = new Date(nextDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(nextDate);
  endOfDay.setHours(23, 59, 59, 999);

  const conflict = await prisma.appointment.findFirst({
    where: {
      id: { not: id },
      appointmentDate: { gte: startOfDay, lte: endOfDay },
      timeSlot: nextSlot,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
    },
  });

  if (conflict) {
    throw new Error(
      `Khung giờ ${nextSlot} ngày ${nextDate.toLocaleDateString('vi-VN')} đã có khách đặt. Vui lòng chọn giờ khác!`
    );
  }

  const dataToUpdate = {
    appointmentDate: nextDate,
    timeSlot: nextSlot,
  };
  if (notes !== undefined) dataToUpdate.notes = notes;
  if (totalPrice !== undefined && totalPrice !== null) dataToUpdate.totalPrice = parseFloat(totalPrice);

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
  const cancellableStatuses = user.role === 'CUSTOMER' ? ['PENDING'] : ['PENDING', 'CONFIRMED'];
  if (!cancellableStatuses.includes(app.status)) {
    throw new Error('Chỉ có thể hủy ca hẹn khi đang chờ tiếp nhận (PENDING / CONFIRMED).');
  }
  return await prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { pet: true, service: true },
  });
};

const getAllServices = async () => {
  return await prisma.serviceCatalog.findMany({
    orderBy: { createdAt: 'asc' },
  });
};

const createNewService = async ({
  name,
  description,
  durationMinutes,
  price,
  category,
  image,
  targetPet,
  standard,
  processSteps,
  prepNote,
  status,
}) => {
  return await prisma.serviceCatalog.create({
    data: {
      name,
      description,
      durationMinutes: parseInt(durationMinutes || 45, 10),
      price: parseFloat(price),
      category: category || 'Spa & Grooming',
      image: image ? String(image).trim() : null,
      targetPet: targetPet ? String(targetPet).trim() : null,
      standard: standard ? String(standard).trim() : null,
      processSteps: processSteps ? String(processSteps).trim() : null,
      prepNote: prepNote ? String(prepNote).trim() : null,
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    },
  });
};

const updateService = async (
  id,
  { name, description, durationMinutes, price, category, image, targetPet, standard, processSteps, prepNote, status }
) => {
  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (durationMinutes !== undefined) data.durationMinutes = parseInt(durationMinutes, 10);
  if (price !== undefined) data.price = parseFloat(price);
  if (category !== undefined) data.category = category;
  if (image !== undefined) data.image = image ? String(image).trim() : null;
  if (targetPet !== undefined) data.targetPet = targetPet ? String(targetPet).trim() : null;
  if (standard !== undefined) data.standard = standard ? String(standard).trim() : null;
  if (processSteps !== undefined) data.processSteps = processSteps ? String(processSteps).trim() : null;
  if (prepNote !== undefined) data.prepNote = prepNote ? String(prepNote).trim() : null;
  if (status !== undefined) data.status = status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

  return await prisma.serviceCatalog.update({
    where: { id },
    data,
  });
};

const deleteService = async (id) => {
  return await prisma.serviceCatalog.delete({ where: { id } });
};

module.exports = {
  getAppointmentsByUser,
  createNewAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  getAllServices,
  createNewService,
  updateService,
  deleteService,
};
