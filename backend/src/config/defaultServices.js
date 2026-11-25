// Danh mục 18 dịch vụ chuẩn Petzera (3 chuyên mục: Spa & Grooming, Y Tế & Tiêm Phòng, Khám Bệnh & Trị Liệu [đã gộp Khoa Sinh Sản])
// Dùng chung cho seed.js & auto-sync startup (cả local và production)

const DEFAULT_SERVICES = [
  // 1. SPA & GROOMING (6 gói)
  {
    name: 'Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt 7 bước)',
    legacyNames: ['Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt)'],
    description: 'Vệ sinh tai, cắt mài móng, vắt tuyến hôi, tắm thảo dược sấy chải phồng lông và cắt tỉa tạo kiểu chuyên nghiệp theo form chuẩn.',
    durationMinutes: 60,
    price: 250000,
    category: 'Spa & Grooming',
  },
  {
    name: 'Tắm Dưỡng Lông Thảo Dược & Khử Mùi Hôi Sinh Học',
    description: 'Liệu trình tắm sấy bằng tinh chất tràm trà & dầu dừa nguyên chất, loại bỏ 99% vi khuẩn, khử mùi hôi cơ thể và giảm ngứa da hiệu quả.',
    durationMinutes: 45,
    price: 200000,
    category: 'Spa & Grooming',
  },
  {
    name: 'Cắt Tỉa Tạo Kiểu Nghệ Thuật (Style Hàn Quốc / Teddy / Sư Tử)',
    description: 'Cắt tỉa tạo dáng đầu tròn Teddy Bear, mặt cáo hoặc bờm sư tử bởi Master Groomer đạt chứng chỉ quốc tế.',
    durationMinutes: 75,
    price: 320000,
    category: 'Spa & Grooming',
  },
  {
    name: 'Nhuộm Lông Hữu Cơ Thảo Dược An Toàn (Tai, Đuôi & 4 Chân)',
    description: 'Sử dụng thuốc nhuộm chiết xuất 100% thảo mộc tự nhiên từ thực vật, an toàn tuyệt đối khi thú cưng liếm lông, giữ màu bền 2-3 tháng.',
    durationMinutes: 40,
    price: 180000,
    category: 'Spa & Grooming',
  },
  {
    name: 'Cạo Vôi Răng Siêu Âm Không Gây Mê & Đánh Bóng Men Răng',
    description: 'Loại bỏ hoàn toàn mảng bám ố vàng và cao răng cứng đầu, khử sạch mùi hôi miệng, bảo vệ nướu chắc khỏe không gây đau đớn.',
    durationMinutes: 45,
    price: 280000,
    category: 'Spa & Grooming',
  },
  {
    name: 'Vệ Sinh Toàn Diện: Cắt Móng, Mài Móng & Vắt Tuyến Hôi',
    description: 'Vệ sinh làm sạch ráy tai, cắt và dũa mài móng êm ái, vắt tuyến mồ hôi đáy hậu môn giúp bé nhẹ nhõm, không còn trượt cọ mông.',
    durationMinutes: 25,
    price: 100000,
    category: 'Spa & Grooming',
  },

  // 2. Y TẾ & TIÊM PHÒNG (3 gói)
  {
    name: 'Tiêm Vắc Xin 5 Trong 1 Cho Chó (Vanguard Plus 5/CV-L)',
    legacyNames: ['Tiêm Vắc Xin 5 Trong 1'],
    description: 'Vắc xin nhập khẩu chính hãng Vanguard Plus, bảo vệ chó cưng khỏi 5 bệnh truyền nhiễm nguy hiểm nhất kèm cấp sổ tiêm chủng.',
    durationMinutes: 30,
    price: 180000,
    category: 'Y Tế & Tiêm Phòng',
  },
  {
    name: 'Tiêm Vắc Xin 4 Bệnh Cho Mèo (Purevax RCPCH Nhập Khẩu Pháp)',
    description: 'Phòng ngừa bệnh giảm bạch cầu FPV, viêm mũi khí quản, Calicivirus và Chlamydia ở mèo con và mèo trưởng thành.',
    durationMinutes: 30,
    price: 260000,
    category: 'Y Tế & Tiêm Phòng',
  },
  {
    name: 'Tiêm Phòng Bệnh Dại Định Kỳ & Cấp Sổ Chứng Nhận Quốc Tế',
    description: 'Vắc xin phòng dại Rabisin đạt chuẩn WHO, cấp chứng nhận tiêm phòng hợp chuẩn lưu hành và xuất cảnh thú cưng.',
    durationMinutes: 20,
    price: 120000,
    category: 'Y Tế & Tiêm Phòng',
  },

  // 3. KHÁM BỆNH & TRỊ LIỆU (9 gói = 3 gói Khám/Trị liệu + 6 gói Khoa Sinh Sản gộp chung)
  {
    name: 'Khám Sức Khỏe Tổng Quát & Siêu Âm Ổ Bụng Chẩn Đoán',
    legacyNames: ['Khám Sức Khỏe Tổng Quát'],
    description: 'Đo điện tim, siêu âm kiểm tra gan thận ruột, soi tai mũi họng, xét nghiệm tầm soát ký sinh trùng máu và tư vấn chế độ ăn.',
    durationMinutes: 45,
    price: 300000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Tẩy Giun Sán Định Kỳ & Nhỏ Gáy Phòng Trị Ve Rận Bọ Chét',
    description: 'Uống thuốc xổ giun Drontal Plus kết hợp nhỏ gáy Frontline / Revolution phòng trị ve, rận, bọ chét và giun tim trong 30 ngày.',
    durationMinutes: 25,
    price: 150000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Trị Liệu Nấm Da, Xông Hơi Khí Dung & Phục Hồi Lông Hư Tổn',
    description: 'Liệu pháp ánh sáng xanh kháng khuẩn kết hợp ngâm bồn thuốc thảo mộc đặc trị nấm kẽ chân, viêm da dị ứng và vảy gàu ở chó mèo.',
    durationMinutes: 50,
    price: 220000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Siêu Âm Thai Kỹ Thuật Số Doppler & Dự Sinh Chuẩn Xác',
    description: 'Chẩn đoán thai sớm từ ngày thứ 21. Đếm túi thai, đo nhịp tim thai bằng máy Doppler chuyên dụng và dự đoán ngày sinh chính xác.',
    durationMinutes: 25,
    price: 150000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Gói Hộ Sinh Đỡ Đẻ & Hồi Sức Sơ Sinh An Toàn 24/7',
    description: 'Bác sĩ thú y trực tiếp theo dõi gò tử cung, hỗ trợ thế thai khó sinh, cắt rốn tiệt trùng và kích thở lồng ấp sơ sinh.',
    durationMinutes: 120,
    price: 350000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Phẫu Thuật Mổ Đẻ Cấp Cứu Vô Trùng (C-Section)',
    description: 'Mổ lấy thai cấp cứu vô trùng khi khó sinh, suy thai hoặc kẹt xương chậu. Gây mê bay hơi Isoflurane an toàn tuyệt đối cho mẹ & con.',
    durationMinutes: 60,
    price: 850000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Triệt Sản Mèo Cái / Chó Cái Công Nghệ Minilap Thẩm Mỹ',
    description: 'Cắt tử cung buồng trứng đường rạch vi phẫu siêu nhỏ 1-1.5cm, khâu chỉ tự tiêu nội bì, không sẹo lồi, hồi phục nhanh sau 24h.',
    durationMinutes: 45,
    price: 450000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Thiến Chó Đực / Mèo Đực An Toàn & Kháng Khuẩn',
    description: 'Tiểu phẫu thiến 15 phút an toàn nhẹ nhàng, loại trừ nguy cơ ung thư tinh hoàn và kiểm soát triệt để hành vi xịt nước tiểu hôi đánh dấu.',
    durationMinutes: 25,
    price: 280000,
    category: 'Khám Bệnh & Trị Liệu',
  },
  {
    name: 'Phẫu Thuật Cấp Cứu Viêm Tử Cung Tích Mủ (Pyometra)',
    description: 'Giải phóng ổ mủ trong tử cung cho thú cưng bị biến chứng do tiêm thuốc tránh thai dạo hoặc rối loạn nội tiết tố, cứu sống nhiễm trùng máu.',
    durationMinutes: 75,
    price: 900000,
    category: 'Khám Bệnh & Trị Liệu',
  },
];

const REMOVED_HOTEL_CATEGORIES = ['Khách Sạn & Lưu Trú'];

const normalizeName = (str) => String(str || '').trim().toLowerCase();

const isRemovedHotelService = (svc) => {
  if (!svc) return false;
  if (REMOVED_HOTEL_CATEGORIES.includes(svc.category)) return true;
  const cat = normalizeName(svc.category);
  const name = normalizeName(svc.name);
  return (
    cat.includes('khách sạn') ||
    cat.includes('lưu trú') ||
    name.includes('khách sạn') ||
    name.includes('lưu trú') ||
    name.includes('trông giữ trong ngày') ||
    name.includes('pet daycare') ||
    name.includes('cat condo') ||
    name.includes('vip suite') ||
    name.includes('royal penthouse')
  );
};

/**
 * Đồng bộ an toàn (idempotent) 18 gói dịch vụ chuẩn thuộc 3 chuyên mục vào MongoDB:
 * 1. Gộp danh mục cũ 'Khám Bệnh' và 'Khoa Sinh Sản' vào 'Khám Bệnh & Trị Liệu'.
 * 2. Dọn bỏ các gói 'Khách Sạn & Lưu Trú' không còn sử dụng (chỉ xóa khi không có lịch hẹn tham chiếu để tránh vỡ dữ liệu).
 * 3. Tạo bổ sung / cập nhật các dịch vụ chuẩn còn thiếu mà không làm hỏng ObjectId lịch hẹn hiện hữu.
 */
async function ensureDefaultServices(prisma) {
  await prisma.serviceCatalog.updateMany({
    where: { category: { in: ['Khám Bệnh', 'Khoa Sinh Sản'] } },
    data: { category: 'Khám Bệnh & Trị Liệu' },
  });

  const existing = await prisma.serviceCatalog.findMany();
  let removedCount = 0;

  // Dọn các dịch vụ Khách Sạn & Lưu Trú đã gỡ bỏ (an toàn khi có lịch hẹn cũ tham chiếu)
  for (const svc of existing) {
    if (!isRemovedHotelService(svc)) continue;
    const refCount = await prisma.appointment.count({ where: { serviceId: svc.id } });
    if (refCount === 0) {
      await prisma.serviceCatalog.delete({ where: { id: svc.id } });
      removedCount += 1;
    }
  }

  const remaining = existing.filter((s) => !isRemovedHotelService(s));
  const existingByName = new Map(remaining.map((s) => [normalizeName(s.name), s]));

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of DEFAULT_SERVICES) {
    const { legacyNames = [], ...data } = item;
    const directMatch = existingByName.get(normalizeName(data.name));
    if (directMatch) {
      if (directMatch.category !== data.category) {
        await prisma.serviceCatalog.update({
          where: { id: directMatch.id },
          data: { category: data.category },
        });
        updatedCount += 1;
      }
      continue;
    }

    const legacyMatch = legacyNames
      .map((ln) => existingByName.get(normalizeName(ln)))
      .find(Boolean);

    if (legacyMatch) {
      await prisma.serviceCatalog.update({
        where: { id: legacyMatch.id },
        data: {
          name: data.name,
          description: data.description,
          durationMinutes: data.durationMinutes,
          price: data.price,
          category: data.category,
        },
      });
      existingByName.set(normalizeName(data.name), legacyMatch);
      updatedCount += 1;
      continue;
    }

    const created = await prisma.serviceCatalog.create({ data });
    existingByName.set(normalizeName(created.name), created);
    createdCount += 1;
  }

  return { createdCount, updatedCount, removedCount, totalExpected: DEFAULT_SERVICES.length };
}

module.exports = {
  DEFAULT_SERVICES,
  ensureDefaultServices,
};
