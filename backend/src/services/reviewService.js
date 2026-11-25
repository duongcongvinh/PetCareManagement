const prisma = require('../config/prisma');

const VALID_TARGET_TYPES = ['SERVICE', 'PRODUCT', 'GENERAL'];

const DEFAULT_REVIEWS = [
  {
    targetType: 'SERVICE',
    targetId: 's1',
    targetName: 'Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt 7 bước)',
    customerName: 'Phạm Minh Anh',
    petName: 'Bé LuLu • Toy Poodle 2 tuổi',
    rating: 5,
    comment:
      'Đặt lịch online chọn đúng khung giờ nên đưa bé tới không phải chờ. Các bạn Groomer tỉa form Teddy cực xinh, bé thơm mềm cả tuần mà giá niêm yết rõ ràng!',
    staffReply: 'Cảm ơn chị Minh Anh và bé LuLu đã tin yêu Petzera! Hẹn gặp bé ở lịch spa tháng tới ạ 🐾',
  },
  {
    targetType: 'SERVICE',
    targetId: 's15',
    targetName: 'Siêu Âm Thai Kỹ Thuật Số Doppler & Dự Sinh Chuẩn Xác',
    customerName: 'Hoàng Thị Yến',
    petName: 'Bé Miu Miu • Mèo Anh Lông Ngắn',
    rating: 5,
    comment:
      'Cảm ơn đội ngũ bác sĩ Petzera đã siêu âm chuẩn xác và trực hộ sinh lúc nửa đêm cho bé Miu mẹ tròn con vuông 4 bé mèo con khỏe mạnh. Bác sĩ hướng dẫn chăm sau sinh siêu tận tâm.',
    staffReply: 'Chúc mừng gia đình bé Miu Miu đón 4 thiên thần nhỏ khỏe mạnh! Petzera luôn trực 24/7 đồng hành cùng mẹ con bé ạ.',
  },
  {
    targetType: 'PRODUCT',
    targetId: 'vp-1',
    targetName: 'Thức ăn cho chó trưởng thành Mini Adult | Royal Canin (2kg) + TẶNG 1 Pate',
    customerName: 'Nguyễn Quốc Bảo',
    petName: 'Bé Max • Golden Retriever',
    rating: 5,
    comment:
      'Đặt thức ăn hạt Royal Canin trên Pet Shop chỉ chưa tới 2 tiếng shipper đã giao tận cửa, còn được tặng thêm gói pate và áp mã giảm giá. Hàng chính hãng date mới, sẽ ủng hộ dài lâu!',
    staffReply: 'Cảm ơn anh Bảo đã ủng hộ Petzera Super Shop! Chúc bé Max luôn ăn ngon khỏe mạnh ạ.',
  },
  {
    targetType: 'SERVICE',
    targetId: 's2',
    targetName: 'Tiêm Vắc Xin 5 Trong 1 Cho Chó (Vanguard Plus 5/CV-L)',
    customerName: 'Lê Ngọc Hân',
    petName: 'Bé Bông • Phốc Sóc',
    rating: 5,
    comment:
      'Bác sĩ kiểm tra tem nhãn vắc xin ngay trước mặt chủ nuôi, tiêm rất nhẹ tay nên bé Bông không khóc chút nào. Sổ tiêm và lịch nhắc mũi được lưu gọn gàng.',
    staffReply: null,
  },
  {
    targetType: 'PRODUCT',
    targetId: 'prod-2',
    targetName: 'Cát Vệ Sinh Mèo Đậu Nành Tofu 6L',
    customerName: 'Trần Gia Huy',
    petName: 'Bé Mochi • Mèo Munchkin',
    rating: 4,
    comment:
      'Cát đậu nành vón cục nhanh, gần như không bụi và mùi dễ chịu. Giao hàng nhanh đóng gói chắc chắn, rất hài lòng.',
    staffReply: null,
  },
];

const validateReviewPayload = ({ targetType = 'GENERAL', targetName, rating, comment }) => {
  const normalizedType = String(targetType || 'GENERAL').toUpperCase();
  if (!VALID_TARGET_TYPES.includes(normalizedType)) {
    throw new Error('Loại đối tượng đánh giá không hợp lệ (SERVICE, PRODUCT hoặc GENERAL).');
  }
  const numRating = Number(rating);
  if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    throw new Error('Số sao đánh giá phải là số nguyên từ 1 đến 5.');
  }
  const cleanComment = String(comment || '').trim();
  if (cleanComment.length < 5) {
    throw new Error('Vui lòng nhập nội dung đánh giá tối thiểu 5 ký tự.');
  }
  if (cleanComment.length > 1000) {
    throw new Error('Nội dung đánh giá tối đa 1000 ký tự.');
  }
  return {
    targetType: normalizedType,
    targetName: String(targetName || 'Trải nghiệm tại Petzera').trim(),
    rating: numRating,
    comment: cleanComment,
  };
};

const computeReviewStats = (reviews = []) => {
  const totalCount = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (totalCount === 0) {
    return { averageRating: 0, totalCount: 0, distribution };
  }
  let sum = 0;
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    sum += star;
    distribution[star] = (distribution[star] || 0) + 1;
  }
  return {
    averageRating: Number((sum / totalCount).toFixed(1)),
    totalCount,
    distribution,
  };
};

const ensureDefaultReviews = async (prismaClient = prisma) => {
  const count = await prismaClient.review.count();
  if (count > 0) {
    return { seededCount: 0, existingCount: count };
  }
  await prismaClient.review.createMany({ data: DEFAULT_REVIEWS });
  return { seededCount: DEFAULT_REVIEWS.length, existingCount: 0 };
};

const getReviews = async ({ targetType, targetId } = {}) => {
  const where = {};
  if (targetType && VALID_TARGET_TYPES.includes(String(targetType).toUpperCase())) {
    where.targetType = String(targetType).toUpperCase();
  }
  if (targetId) {
    where.targetId = String(targetId);
  }
  const items = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return {
    reviews: items,
    stats: computeReviewStats(items),
  };
};

const createReview = async (payload, user) => {
  const validated = validateReviewPayload(payload);
  return await prisma.review.create({
    data: {
      targetType: validated.targetType,
      targetId: payload.targetId ? String(payload.targetId) : null,
      targetName: validated.targetName,
      appointmentId: payload.appointmentId ? String(payload.appointmentId) : null,
      customerId: user?.id || null,
      customerName: (payload.customerName || user?.fullName || 'Khách hàng Petzera').trim(),
      petName: payload.petName ? String(payload.petName).trim() : null,
      rating: validated.rating,
      comment: validated.comment,
    },
  });
};

const replyToReview = async (id, staffReply) => {
  const cleanReply = String(staffReply || '').trim();
  if (!cleanReply) {
    throw new Error('Vui lòng nhập nội dung phản hồi cho khách hàng.');
  }
  return await prisma.review.update({
    where: { id },
    data: { staffReply: cleanReply },
  });
};

const deleteReview = async (id, user) => {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Không tìm thấy đánh giá cần xóa.');
  }
  const isPrivileged = user && ['ADMIN', 'CARE_STAFF'].includes(user.role);
  const isOwner = user && existing.customerId && existing.customerId === user.id;
  if (!isPrivileged && !isOwner) {
    throw new Error('Bạn không có quyền xóa đánh giá này.');
  }
  return await prisma.review.delete({ where: { id } });
};

module.exports = {
  DEFAULT_REVIEWS,
  validateReviewPayload,
  computeReviewStats,
  ensureDefaultReviews,
  getReviews,
  createReview,
  replyToReview,
  deleteReview,
};
