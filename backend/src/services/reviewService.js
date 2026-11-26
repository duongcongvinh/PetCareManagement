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
  {
    targetType: 'SERVICE',
    targetId: 's5',
    targetName: 'Cắt Tỉa Tạo Kiểu Nghệ Thuật (Style Hàn Quốc / Teddy / Sư Tử)',
    customerName: 'Trần Mỹ Hạnh',
    petName: 'Bé Nâu • Shiba Inu',
    rating: 5,
    comment:
      'Master Groomer tỉa dáng rất khéo, bé Nâu vốn nhát nước nhưng các bạn dỗ dành nhẹ nhàng nên bé hợp tác cực ngoan. Về nhà ai cũng khen đẹp!',
    staffReply: 'Cảm ơn chị Hạnh và bé Nâu đã ghé thăm Petzera! Chúc bé luôn vui khỏe ạ 🧡',
  },
  {
    targetType: 'SERVICE',
    targetId: 's3',
    targetName: 'Khám Sức Khỏe Tổng Quát & Siêu Âm Ổ Bụng Chẩn Đoán',
    customerName: 'Nguyễn Văn Nam',
    petName: 'Bé Max • Golden Retriever',
    rating: 5,
    comment:
      'Bác sĩ Quân khám rất kỹ, giải thích rõ từng chỉ số siêu âm gan thận và kê thực đơn kiểm soát cân nặng hợp lý. Rất yên tâm đưa bé khám định kỳ ở đây.',
    staffReply: null,
  },
  {
    targetType: 'SERVICE',
    targetId: 's18',
    targetName: 'Triệt Sản Mèo Cái / Chó Cái Công Nghệ Minilap Thẩm Mỹ',
    customerName: 'Võ Thị Thanh Trúc',
    petName: 'Bé Bơ • Mèo Ragdoll',
    rating: 5,
    comment:
      'Vết mổ Minilap bé xíu chưa tới 1.5cm, khâu chỉ tự tiêu nên không phải tháo chỉ. Hôm sau bé đã ăn uống đi lại bình thường, bác sĩ còn gọi hỏi thăm mỗi ngày.',
    staffReply: 'Petzera rất vui khi bé Bơ hồi phục nhanh chóng ạ! Chị nhớ cho bé đeo vòng cổ chống liếm đủ 5 ngày nhé.',
  },
  {
    targetType: 'SERVICE',
    targetId: 's25',
    targetName: 'Tắm Sục Ozone Nano Kháng Khuẩn & Thư Giãn Cơ Bắp',
    customerName: 'Phạm Minh Anh',
    petName: 'Bé Kem • Corgi Pembroke',
    rating: 5,
    comment:
      'Lần đầu cho bé Kem thử tắm sục Ozone Nano, da bé giảm ngứa hẳn và lông bồng bềnh cực kỳ mềm. Không gian phòng spa sạch sẽ không hề có mùi hôi.',
    staffReply: null,
  },
  {
    targetType: 'PRODUCT',
    targetId: 'prod-3',
    targetName: 'Sữa Tắm Dưỡng Lông SOS Mềm Mượt & Lưu Hương Cho Chó Mèo 530ml',
    customerName: 'Đặng Khánh Linh',
    petName: 'Bé Kem • Poodle Trắng',
    rating: 5,
    comment:
      'Sữa tắm SOS mùi thơm dịu, nhiều bọt và tắm xong lông bé trắng sáng không bị khô da. Đặt trên web có mã giảm giá nên rẻ hơn mua ngoài.',
    staffReply: null,
  },
  {
    targetType: 'PRODUCT',
    targetId: 'vp-4',
    targetName: 'Sữa bột cho chó Predogen (lon 400g) + TẶNG 1 Xúc xích',
    customerName: 'Lê Hoàng Long',
    petName: 'Bé Cún Con • Corgi 2 tháng',
    rating: 5,
    comment:
      'Sữa Predogen pha nhanh tan, bé uống rất hào hứng và không bị tiêu chảy. Shop còn tặng kèm xúc xích và giao hàng cực nhanh trong 90 phút.',
    staffReply: 'Cảm ơn anh Long đã tin tưởng Petzera Super Shop! Chúc bé Cún hay ăn chóng lớn ạ.',
  },
  {
    targetType: 'PRODUCT',
    targetId: 'prod-40',
    targetName: 'Máy Lọc Nước Tự Động Tuần Hoàn Cho Chó Mèo Petkit Eversweet (2L)',
    customerName: 'Ngô Minh Thư',
    petName: 'Bé Mướp • Mèo Anh Lông Ngắn',
    rating: 4,
    comment:
      'Máy chạy siêu êm gần như không nghe tiếng động, từ lúc mua máy bé mèo chịu uống nước nhiều hơn hẳn. Đóng gói chống sốc rất kỹ.',
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
  const existing = await prismaClient.review.findMany({ select: { customerName: true, targetName: true } });
  const existingKeys = new Set(existing.map((r) => `${r.customerName}::${r.targetName}`.toLowerCase()));
  const missing = DEFAULT_REVIEWS.filter(
    (r) => !existingKeys.has(`${r.customerName}::${r.targetName}`.toLowerCase())
  );
  if (missing.length === 0) {
    return { seededCount: 0, existingCount: existing.length };
  }
  await prismaClient.review.createMany({ data: missing });
  return { seededCount: missing.length, existingCount: existing.length };
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
