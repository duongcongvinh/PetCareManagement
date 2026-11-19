// Mock Data mapping 1-to-1 with the 29 Use Cases from the Use Case Diagram
import { USER_AVATARS, PET_AVATARS, SERVICE_IMAGES, PRODUCT_IMAGES } from './mediaAssets';

export const INITIAL_USERS = [
  { id: 'u-1', fullName: 'Nguyễn Văn Admin', email: 'admin@petcare.com', phone: '0901234567', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-01-10' },
  { id: 'u-2', fullName: 'Trần Thị Chăm Sóc', email: 'care@petcare.com', phone: '0912345678', role: 'CARE_STAFF', status: 'ACTIVE', createdAt: '2026-02-15' },
  { id: 'u-3', fullName: 'Lê Văn Kho', email: 'warehouse@petcare.com', phone: '0923456789', role: 'WAREHOUSE_STAFF', status: 'ACTIVE', createdAt: '2026-03-01' },
  { id: 'u-4', fullName: 'Phạm Minh Anh', email: 'khachhang@gmail.com', phone: '0934567890', role: 'CUSTOMER', status: 'ACTIVE', createdAt: '2026-04-12' },
  { id: 'u-5', fullName: 'Hoàng Thị Yến', email: 'khachhang2@gmail.com', phone: '0945678901', role: 'CUSTOMER', status: 'ACTIVE', createdAt: '2026-05-20' },
].map((u) => ({ ...u, avatar: USER_AVATARS[u.id] }));

export const INITIAL_SERVICES = [
  {
    id: 's1',
    name: 'Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt 7 bước)',
    description: 'Vệ sinh tai, cắt mài móng, vắt tuyến hôi, tắm thảo dược sấy chải phồng lông và cắt tỉa tạo kiểu chuyên nghiệp theo form chuẩn.',
    durationMinutes: 60,
    durationMinutes: 60,
    price: 250000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's4',
    name: 'Tắm Dưỡng Lông Thảo Dược & Khử Mùi Hôi Sinh Học',
    description: 'Liệu trình tắm sấy bằng tinh chất tràm trà & dầu dừa nguyên chất, loại bỏ 99% vi khuẩn, khử mùi hôi cơ thể và giảm ngứa da hiệu quả.',
    durationMinutes: 45,
    price: 200000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's5',
    name: 'Cắt Tỉa Tạo Kiểu Nghệ Thuật (Style Hàn Quốc / Teddy / Sư Tử)',
    description: 'Cắt tỉa tạo dáng đầu tròn Teddy Bear, mặt cáo hoặc bờm sư tử bởi Master Groomer đạt chứng chỉ quốc tế.',
    durationMinutes: 75,
    price: 320000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's6',
    name: 'Nhuộm Lông Hữu Cơ Thảo Dược An Toàn (Tai, Đuôi & 4 Chân)',
    description: 'Sử dụng thuốc nhuộm chiết xuất 100% thảo mộc tự nhiên từ thực vật, an toàn tuyệt đối khi thú cưng liếm lông, giữ màu bền 2-3 tháng.',
    durationMinutes: 40,
    price: 180000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's7',
    name: 'Cạo Vôi Răng Siêu Âm Không Gây Mê & Đánh Bóng Men Răng',
    description: 'Loại bỏ hoàn toàn mảng bám ố vàng và cao răng cứng đầu, khử sạch mùi hôi miệng, bảo vệ nướu chắc khỏe không gây đau đớn.',
    durationMinutes: 45,
    price: 280000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's8',
    name: 'Vệ Sinh Toàn Diện: Cắt Móng, Mài Móng & Vắt Tuyến Hôi',
    description: 'Vệ sinh làm sạch ráy tai, cắt và dũa mài móng êm ái, vắt tuyến mồ hôi đáy hậu môn giúp bé nhẹ nhõm, không còn trượt cọ mông.',
    durationMinutes: 25,
    price: 100000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's9',
    name: 'Khách Sạn Thú Cưng VIP (Phòng Điều Hòa 24/7 & Camera Trực Tuyến)',
    description: 'Phòng suite riêng biệt có máy lạnh, đệm ngủ êm ái, lọc không khí ion âm, camera riêng cấp tài khoản cho chủ theo dõi bé 24/7, kèm 2 bữa ăn cao cấp.',
    durationMinutes: 1440,
    price: 200000,
    category: 'Khách Sạn & Lưu Trú',
    status: 'ACTIVE'
  },
  {
    id: 's10',
    name: 'Dịch Vụ Trông Giữ Trong Ngày (Pet Daycare & Sân Chơi Vận Động)',
    description: 'Gửi bé vui chơi giao lưu tại công viên cát nhân tạo, tương tác cùng huấn luyện viên, thích hợp khi chủ đi làm hoặc bận rộn cả ngày.',
    durationMinutes: 480,
    price: 120000,
    category: 'Khách Sạn & Lưu Trú',
    status: 'ACTIVE'
  },
  {
    id: 's2',
    name: 'Tiêm Vắc Xin 5 Trong 1 Cho Chó (Vanguard Plus 5/CV-L)',
    description: 'Vắc xin nhập khẩu chính hãng Vanguard Plus, bảo vệ chó cưng khỏi 5 bệnh truyền nhiễm nguy hiểm nhất kèm cấp sổ tiêm chủng.',
    durationMinutes: 30,
    price: 180000,
    category: 'Y Tế & Tiêm Phòng',
    status: 'ACTIVE'
  },
  {
    id: 's11',
    name: 'Tiêm Vắc Xin 4 Bệnh Cho Mèo (Purevax RCPCH Nhập Khẩu Pháp)',
    description: 'Phòng ngừa bệnh giảm bạch cầu FPV, viêm mũi khí quản, Calicivirus và Chlamydia ở mèo con và mèo trưởng thành.',
    durationMinutes: 30,
    price: 260000,
    category: 'Y Tế & Tiêm Phòng',
    status: 'ACTIVE'
  },
  {
    id: 's12',
    name: 'Tiêm Phòng Bệnh Dại Định Kỳ & Cấp Sổ Chứng Nhận Quốc Tế',
    description: 'Vắc xin phòng dại Rabisin đạt chuẩn WHO, cấp chứng nhận tiêm phòng hợp chuẩn lưu hành và xuất cảnh thú cưng.',
    durationMinutes: 20,
    price: 120000,
    category: 'Y Tế & Tiêm Phòng',
    status: 'ACTIVE'
  },
  {
    id: 's3',
    name: 'Khám Sức Khỏe Tổng Quát & Siêu Âm Ổ Bụng Chẩn Đoán',
    description: 'Đo điện tim, siêu âm kiểm tra gan thận ruột, soi tai mũi họng, xét nghiệm tầm soát ký sinh trùng máu và tư vấn chế độ ăn.',
    durationMinutes: 45,
    price: 300000,
    category: 'Khám Bệnh & Trị Liệu',
    status: 'ACTIVE'
  },
  {
    id: 's13',
    name: 'Tẩy Giun Sán Định Kỳ & Nhỏ Gáy Phòng Trị Ve Rận Bọ Chét',
    description: 'Uống thuốc xổ giun Drontal Plus kết hợp nhỏ gáy Frontline / Revolution phòng trị ve, rận, bọ chét và giun tim trong 30 ngày.',
    durationMinutes: 25,
    price: 150000,
    category: 'Khám Bệnh & Trị Liệu',
    status: 'ACTIVE'
  },
  {
    id: 's14',
    name: 'Trị Liệu Nấm Da, Xông Hơi Khí Dung & Phục Hồi Lông Hư Tổn',
    description: 'Liệu pháp ánh sáng xanh kháng khuẩn kết hợp ngâm bồn thuốc thảo mộc đặc trị nấm kẽ chân, viêm da dị ứng và vảy gàu ở chó mèo.',
    durationMinutes: 50,
    price: 220000,
    category: 'Khám Bệnh & Trị Liệu',
    status: 'ACTIVE'
  },
  {
    id: 's15',
    name: 'Siêu Âm Thai Kỹ Thuật Số Doppler & Dự Sinh Chuẩn Xác',
    description: 'Chẩn đoán thai sớm từ ngày thứ 21. Đếm túi thai, đo nhịp tim thai bằng máy Doppler chuyên dụng và dự đoán ngày sinh chính xác.',
    durationMinutes: 25,
    price: 150000,
    category: 'Khoa Sinh Sản',
    status: 'ACTIVE'
  },
  {
    id: 's16',
    name: 'Gói Hộ Sinh Đỡ Đẻ & Hồi Sức Sơ Sinh An Toàn 24/7',
    description: 'Bác sĩ thú y trực tiếp theo dõi gò tử cung, hỗ trợ thế thai khó sinh, cắt rốn tiệt trùng và kích thở lồng ấp sơ sinh.',
    durationMinutes: 120,
    price: 350000,
    category: 'Khoa Sinh Sản',
    status: 'ACTIVE'
  },
  {
    id: 's17',
    name: 'Phẫu Thuật Mổ Đẻ Cấp Cứu Vô Trùng (C-Section)',
    description: 'Mổ lấy thai cấp cứu vô trùng khi khó sinh, suy thai hoặc kẹt xương chậu. Gây mê bay hơi Isoflurane an toàn tuyệt đối cho mẹ & con.',
    durationMinutes: 60,
    price: 850000,
    category: 'Khoa Sinh Sản',
    status: 'ACTIVE'
  },
  {
    id: 's18',
    name: 'Triệt Sản Mèo Cái / Chó Cái Công Nghệ Minilap Thẩm Mỹ',
    description: 'Cắt tử cung buồng trứng đường rạch vi phẫu siêu nhỏ 1-1.5cm, khâu chỉ tự tiêu nội bì, không sẹo lồi, hồi phục nhanh sau 24h.',
    durationMinutes: 45,
    price: 450000,
    category: 'Khoa Sinh Sản',
    status: 'ACTIVE'
  },
  {
    id: 's19',
    name: 'Thiến Chó Đực / Mèo Đực An Toàn & Kháng Khuẩn',
    description: 'Tiểu phẫu thiến 15 phút an toàn nhẹ nhàng, loại trừ nguy cơ ung thư tinh hoàn và kiểm soát triệt để hành vi xịt nước tiểu hôi đánh dấu.',
    durationMinutes: 25,
    price: 280000,
    category: 'Khoa Sinh Sản',
    status: 'ACTIVE'
  },
  {
    id: 's20',
    name: 'Phẫu Thuật Cấp Cứu Viêm Tử Cung Tích Mủ (Pyometra)',
    description: 'Giải phóng ổ mủ trong tử cung cho thú cưng bị biến chứng do tiêm thuốc tránh thai dạo hoặc rối loạn nội tiết tố, cứu sống nhiễm trùng máu.',
    durationMinutes: 75,
    price: 900000,
    category: 'Khoa Sinh Sản',
    status: 'ACTIVE'
  }
].map((s) => ({ ...s, image: SERVICE_IMAGES[s.id] }));

export const INITIAL_PETS = [
  {
    id: 'p1',
    name: 'LuLu',
    species: 'Chó',
    breed: 'Poodle',
    ageMonths: 18,
    weightKg: 4.5,
    medicalHistory: 'Đã tiêm phòng dại 3 mũi, tẩy giun định kỳ',
    ownerId: 'u-4',
    ownerName: 'Phạm Minh Anh',
    ownerPhone: '0934567890'
  },
  {
    id: 'p2',
    name: 'Miu Miu',
    species: 'Mèo',
    breed: 'Anh Lông Ngắn',
    ageMonths: 12,
    weightKg: 3.8,
    medicalHistory: 'Khỏe mạnh, da nhạy cảm với xà phòng hóa chất',
    ownerId: 'u-4',
    ownerName: 'Phạm Minh Anh',
    ownerPhone: '0934567890'
  },
  {
    id: 'p3',
    name: 'Bé Bông',
    species: 'Chó',
    breed: 'Phốc Sóc (Pomeranian)',
    ageMonths: 8,
    weightKg: 2.2,
    medicalHistory: 'Đã hoàn thành 2 mũi vắc xin 5in1',
    ownerId: 'u-5',
    ownerName: 'Hoàng Thị Yến',
    ownerPhone: '0945678901'
  }
].map((p) => ({ ...p, avatar: PET_AVATARS[p.id] }));

export const INITIAL_APPOINTMENTS = [
  {
    id: 'app-101',
    petId: 'p1',
    petName: 'LuLu',
    species: 'Chó (Poodle)',
    customerId: 'u-4',
    customerName: 'Phạm Minh Anh',
    customerPhone: '0934567890',
    serviceId: 's1',
    serviceName: 'Spa Grooming Trọn Gói',
    price: 250000,
    appointmentDate: '2026-08-20',
    timeSlot: '09:00 - 10:00',
    status: 'IN_PROGRESS', // Use Case 8: Theo dõi trạng thái dịch vụ (PENDING -> IN_PROGRESS -> COMPLETED)
    notes: 'Bé hơi nhát, nhờ tắm nhẹ tay và vắt tuyến hôi giúp em.',
    careSummary: 'Đã tắm sấy xong, cạo lông chân mượt mà. Bé ngoan.',
    staffName: 'Trần Thị Chăm Sóc'
  },
  {
    id: 'app-102',
    petId: 'p2',
    petName: 'Miu Miu',
    species: 'Mèo (Anh Lông Ngắn)',
    customerId: 'u-4',
    customerName: 'Phạm Minh Anh',
    customerPhone: '0934567890',
    serviceId: 's2',
    serviceName: 'Tiêm Vắc Xin 5 Trong 1',
    price: 180000,
    appointmentDate: '2026-08-21',
    timeSlot: '14:00 - 15:00',
    status: 'PENDING',
    notes: 'Tiêm vắc xin định kỳ năm thứ 2.',
    careSummary: null,
    staffName: null
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Công ty TNHH Thức Ăn Thú Cưng Royal Canin',
    contactPerson: 'Đặng Quốc Huy',
    phone: '02838990011',
    email: 'contact@royalcanin.vn',
    address: 'KCN Tân Bình, TP.HCM',
    productCategories: 'Thức ăn hạt, Pate'
  },
  {
    id: 'sup-2',
    name: 'Nhà Phân Phối Dụng Cụ & Mỹ Phẩm Thú Y VetCare',
    contactPerson: 'Vũ Thị Hồng',
    phone: '02837778899',
    email: 'sales@vetcare.com',
    address: 'Quận 7, TP.HCM',
    productCategories: 'Mỹ phẩm Spa, Thuốc thú y'
  }
];

export const INITIAL_PRODUCTS = [
  // 1. THỨC ĂN HẠT & PATE (Food)
  {
    id: 'prod-1',
    name: 'Hạt Royal Canin Mini Adult Cho Chó Nhỏ (2kg)',
    category: 'Thức ăn',
    sku: 'RC-MINI-2KG',
    unitPrice: 320000,
    costPrice: 240000,
    currentStock: 28,
    minStockLevel: 15,
    maxStockLevel: 80,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-4',
    name: 'Pate Mèo Whiskas Vị Cá Biển & Cá Hồi (85g)',
    category: 'Thức ăn',
    sku: 'PATE-WHIS-85G',
    unitPrice: 22000,
    costPrice: 15000,
    currentStock: 85,
    minStockLevel: 25,
    maxStockLevel: 200,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-7',
    name: 'Hạt Thức Ăn Mèo Me-O Vị Cá Ngừ Đại Dương (1.2kg)',
    category: 'Thức ăn',
    sku: 'MEO-TUNA-1.2KG',
    unitPrice: 95000,
    costPrice: 65000,
    currentStock: 42,
    minStockLevel: 15,
    maxStockLevel: 90,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-10',
    name: 'Pate Cho Chó Con Pedigree Vị Thịt Bò Sốt Đậm Đà (130g)',
    category: 'Thức ăn',
    sku: 'PEDIGREE-BEEF-130G',
    unitPrice: 28000,
    costPrice: 18000,
    currentStock: 64,
    minStockLevel: 20,
    maxStockLevel: 150,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-11',
    name: 'Hạt Dinh Dưỡng Cao Cấp Orijen Six Fish Không Độn Ngũ Cốc (1.8kg)',
    category: 'Thức ăn',
    sku: 'ORIJEN-6FISH-1.8KG',
    unitPrice: 680000,
    costPrice: 510000,
    currentStock: 16,
    minStockLevel: 10,
    maxStockLevel: 50,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-12',
    name: 'Hạt Mèo Hỗ Trợ Đào Thải Búi Lông Royal Canin Hairball Care (2kg)',
    category: 'Thức ăn',
    sku: 'RC-HAIRBALL-2KG',
    unitPrice: 385000,
    costPrice: 290000,
    currentStock: 22,
    minStockLevel: 12,
    maxStockLevel: 60,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-13',
    name: 'Hạt Chó Poodle Con Dưới 10 Tháng Royal Canin Poodle Puppy (1.5kg)',
    category: 'Thức ăn',
    sku: 'RC-POODLE-PUPPY-1.5',
    unitPrice: 295000,
    costPrice: 220000,
    currentStock: 35,
    minStockLevel: 15,
    maxStockLevel: 70,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },

  // 2. BÁNH THƯỞNG & SNACK (Treats)
  {
    id: 'prod-8',
    name: 'Xương Gặm Sạch Răng & Bổ Sung Canxi Orgo Cho Cún (Gói 90g)',
    category: 'Bánh thưởng',
    sku: 'ORGO-BONE-90G',
    unitPrice: 45000,
    costPrice: 28000,
    currentStock: 55,
    minStockLevel: 20,
    maxStockLevel: 120,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-9',
    name: 'Bánh Thưởng Ức Gà Sấy Khô Freeze-Dried Nguyên Chất Petopia (100g)',
    category: 'Bánh thưởng',
    sku: 'FREEZE-CHICKEN-100G',
    unitPrice: 85000,
    costPrice: 52000,
    currentStock: 48,
    minStockLevel: 15,
    maxStockLevel: 100,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-14',
    name: 'Thanh Thịt Bò Jerky Dạng Que Mềm Cho Chó (Gói 12 que)',
    category: 'Bánh thưởng',
    sku: 'BEEF-JERKY-12P',
    unitPrice: 65000,
    costPrice: 40000,
    currentStock: 38,
    minStockLevel: 15,
    maxStockLevel: 90,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-15',
    name: 'Súp Thưởng Cho Mèo Ciao Churu Vị Gà & Sò Điệp (Gói 4 tuýp)',
    category: 'Bánh thưởng',
    sku: 'CIAO-CHURU-4P',
    unitPrice: 42000,
    costPrice: 26000,
    currentStock: 90,
    minStockLevel: 30,
    maxStockLevel: 250,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-16',
    name: 'Bánh Quy Sữa Dê Giòn Tan Bổ Sung Men Tiêu Hóa (Hũ 200g)',
    category: 'Bánh thưởng',
    sku: 'GOAT-MILK-BISCUIT-200',
    unitPrice: 58000,
    costPrice: 35000,
    currentStock: 30,
    minStockLevel: 12,
    maxStockLevel: 80,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },

  // 3. CÁT VỆ SINH & KHAY CÁT (Cat Litter)
  {
    id: 'prod-2',
    name: 'Cát Vệ Sinh Mèo Đậu Nành Tofu Tự Nhiên Khử Mùi 6L',
    category: 'Cát vệ sinh',
    sku: 'CAT-TOFU-6L',
    unitPrice: 110000,
    costPrice: 75000,
    currentStock: 52,
    minStockLevel: 20,
    maxStockLevel: 120,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-17',
    name: 'Cát Đất Sét Bentonite Tự Nhiên Hương Cà Phê Siêu Vón Cục 8L',
    category: 'Cát vệ sinh',
    sku: 'BENTONITE-COFFEE-8L',
    unitPrice: 85000,
    costPrice: 52000,
    currentStock: 65,
    minStockLevel: 25,
    maxStockLevel: 150,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-18',
    name: 'Cát Gỗ Sinh Học Hữu Cơ Khử Mùi Cat\'s Best Original 5L (Nhập Đức)',
    category: 'Cát vệ sinh',
    sku: 'CATS-BEST-5L',
    unitPrice: 195000,
    costPrice: 140000,
    currentStock: 24,
    minStockLevel: 10,
    maxStockLevel: 60,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },

  // 4. PHỤ KIỆN, ĐỒ CHƠI & LƯU TRÚ (Accessories & Toys)
  {
    id: 'prod-6',
    name: 'Chuồng Nệm Lưu Trú & Giường Ấm Thú Cưng Bọc Lông Nhung',
    category: 'Phụ kiện',
    sku: 'PET-BED-HOTEL',
    unitPrice: 350000,
    costPrice: 220000,
    currentStock: 18,
    minStockLevel: 8,
    maxStockLevel: 40,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-19',
    name: 'Trụ Cào Móng Dây Thừng Sisal Tự Nhiên Có Quả Chuông Cho Mèo',
    category: 'Phụ kiện',
    sku: 'SCRATCHING-POST-BELL',
    unitPrice: 190000,
    costPrice: 120000,
    currentStock: 25,
    minStockLevel: 10,
    maxStockLevel: 50,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-20',
    name: 'Balo Phi Hành Gia Trong Suốt Thông Khí Vận Chuyển Thú Cưng',
    category: 'Phụ kiện',
    sku: 'ASTRONAUT-BAG-CLEAR',
    unitPrice: 290000,
    costPrice: 185000,
    currentStock: 15,
    minStockLevel: 8,
    maxStockLevel: 40,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-21',
    name: 'Khay Vệ Sinh Mèo Thành Cao Chống Văng Kèm Xẻng Xúc Tiện Lợi',
    category: 'Phụ kiện',
    sku: 'LITTER-BOX-HIGH',
    unitPrice: 165000,
    costPrice: 105000,
    currentStock: 20,
    minStockLevel: 10,
    maxStockLevel: 45,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-22',
    name: 'Dây Dắt Kèm Áo Yếm Ngực Phản Quang Chống Giật (Size M)',
    category: 'Phụ kiện',
    sku: 'HARNESS-REFLECT-M',
    unitPrice: 120000,
    costPrice: 75000,
    currentStock: 32,
    minStockLevel: 12,
    maxStockLevel: 70,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-23',
    name: 'Bát Ăn Đôi Inox Chống Trượt Đế Silicon Hình Tai Mèo Đáng Yêu',
    category: 'Phụ kiện',
    sku: 'BOWL-DOUBLE-INOX',
    unitPrice: 85000,
    costPrice: 50000,
    currentStock: 40,
    minStockLevel: 15,
    maxStockLevel: 80,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-24',
    name: 'Cần Câu Mèo Gắn Lông Vũ & Chuông Lắc Vận Động Dẻo Dai',
    category: 'Phụ kiện',
    sku: 'CAT-TOY-FEATHER',
    unitPrice: 35000,
    costPrice: 18000,
    currentStock: 75,
    minStockLevel: 25,
    maxStockLevel: 150,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },

  // 5. MỸ PHẨM SPA & DƯỠNG LÔNG (Grooming & Spa)
  {
    id: 'prod-3',
    name: 'Sữa Tắm Dưỡng Lông SOS Mềm Mượt & Lưu Hương Cho Chó Mèo 530ml',
    category: 'Mỹ phẩm Spa',
    sku: 'SOS-SHAMPOO-530',
    unitPrice: 150000,
    costPrice: 95000,
    currentStock: 38,
    minStockLevel: 12,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-25',
    name: 'Sữa Tắm Khử Mùi & Trị Viêm Nấm Da Davis Benzoyl Peroxide 355ml',
    category: 'Mỹ phẩm Spa',
    sku: 'DAVIS-BENZOYL-355',
    unitPrice: 280000,
    costPrice: 190000,
    currentStock: 14,
    minStockLevel: 8,
    maxStockLevel: 40,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-26',
    name: 'Xịt Khử Mùi Hôi Chuồng Trại & Kháng Khuẩn Không Khí Bioline 500ml',
    category: 'Mỹ phẩm Spa',
    sku: 'BIOLINE-DEODOR-500',
    unitPrice: 115000,
    costPrice: 72000,
    currentStock: 28,
    minStockLevel: 10,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-27',
    name: 'Lược Chải Lông Tự Động Đẩy Lông Rụng Bằng Nút Bấm Thông Minh',
    category: 'Mỹ phẩm Spa',
    sku: 'BRUSH-AUTO-BUTTON',
    unitPrice: 95000,
    costPrice: 58000,
    currentStock: 35,
    minStockLevel: 12,
    maxStockLevel: 80,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },

  // 6. DINH DƯỠNG & VITAMIN (Supplements)
  {
    id: 'prod-28',
    name: 'Gel Dinh Dưỡng Nourse Nutri-Gel 120g Phục Hồi Thể Lực Nhanh',
    category: 'Dinh dưỡng',
    sku: 'NOURSE-GEL-120G',
    unitPrice: 145000,
    costPrice: 95000,
    currentStock: 30,
    minStockLevel: 12,
    maxStockLevel: 70,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-29',
    name: 'Viên Uống Canxi Nano Bổ Sung Xương Khớp Chắc Khỏe Bio-Calci (100 viên)',
    category: 'Dinh dưỡng',
    sku: 'BIO-CALCI-100',
    unitPrice: 160000,
    costPrice: 105000,
    currentStock: 34,
    minStockLevel: 15,
    maxStockLevel: 80,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-30',
    name: 'Dầu Cá Hồi Tự Nhiên Nguyên Chất Wild Salmon Oil Hỗ Trợ Lông Mượt (250ml)',
    category: 'Dinh dưỡng',
    sku: 'SALMON-OIL-250ML',
    unitPrice: 210000,
    costPrice: 145000,
    currentStock: 22,
    minStockLevel: 10,
    maxStockLevel: 50,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-31',
    name: 'Men Tiêu Hóa Vi Sinh Đường Ruột Hỗ Trợ Hấp Thu Probiotic Pet (Hộp 30 gói)',
    category: 'Dinh dưỡng',
    sku: 'PROBIOTIC-PET-30P',
    unitPrice: 135000,
    costPrice: 88000,
    currentStock: 40,
    minStockLevel: 15,
    maxStockLevel: 90,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },

  // 7. Y TẾ & THUỐC THÚ Y (Healthcare)
  {
    id: 'prod-5',
    name: 'Thuốc Nhỏ Gáy Phòng Trị Ve Rận & Bọ Chét Frontline Plus Cho Mèo/Cún',
    category: 'Y tế',
    sku: 'FRONTLINE-PLUS',
    unitPrice: 180000,
    costPrice: 120000,
    currentStock: 26,
    minStockLevel: 10,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-32',
    name: 'Thuốc Xổ Giun Sán Định Kỳ Cho Chó Mèo Drontal Plus (Vỉ 6 viên)',
    category: 'Y tế',
    sku: 'DRONTAL-PLUS-6T',
    unitPrice: 160000,
    costPrice: 105000,
    currentStock: 35,
    minStockLevel: 12,
    maxStockLevel: 90,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  }
].map((p) => ({ ...p, image: PRODUCT_IMAGES[p.id] }));

// PRODUCT-LEVEL 5-YEAR SEASONAL FORECASTS FOR SHOP OWNER
export const PRODUCT_SEASONAL_FORECASTS = [
  {
    productId: 'prod-3',
    productName: 'Sữa Tắm Dưỡng Lông SOS Cho Chó Mèo 530ml',
    sku: 'SOS-SHAMPOO-530',
    category: 'Mỹ phẩm Spa',
    peakSeasonType: 'HOT_SUMMER',
    peakSeasonLabel: '☀️ Mùa Nắng Nóng (T4 - T8)',
    historicalAvgSales5Year: '145 chai/tháng',
    predictedMonthlyDemand: '210 chai/tháng',
    suggestedReorderQty: 45,
    suggestedOrderDate: '2026-03-25 (Trước mùa 10 ngày)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🔥 BÁO CHỦ: Nhiệt độ mùa hè dự báo vọt lên 38°C. Nhu cầu tắm làm mát tăng 120%. Cần nhập 45 chai Sữa tắm SOS để tránh cháy hàng ca Spa.'
  },
  {
    productId: 'prod-4',
    productName: 'Pate Mèo Whiskas Vị Cá Biển (85g)',
    sku: 'PATE-WHIS-85G',
    category: 'Thức ăn',
    peakSeasonType: 'HOT_SUMMER',
    peakSeasonLabel: '☀️ Mùa Nắng Nóng (T4 - T8)',
    historicalAvgSales5Year: '280 hộp/tháng',
    predictedMonthlyDemand: '420 hộp/tháng',
    suggestedReorderQty: 150,
    suggestedOrderDate: '2026-04-05 (Đầu mùa hè)',
    suggestedSupplier: 'Royal Canin Việt Nam (Mr. Đặng Quốc Huy)',
    aiAdviceForOwner: '🔥 BÁO CHỦ: Nắng nóng làm mèo biếng ăn hạt khô, nhu cầu Pate ướt giải nhiệt tăng 55%. Đề xuất nhập thêm 150 hộp Pate Cá Biển.'
  },
  {
    productId: 'prod-2',
    productName: 'Cát Vệ Sinh Mèo Đậu Nành Tofu 6L',
    sku: 'CAT-TOFU-6L',
    category: 'Phụ kiện',
    peakSeasonType: 'RAINY_SEASON',
    peakSeasonLabel: '🌧️ Mùa Mưa (T9 - T11)',
    historicalAvgSales5Year: '160 túi/tháng',
    predictedMonthlyDemand: '240 túi/tháng',
    suggestedReorderQty: 80,
    suggestedOrderDate: '2026-08-20 (Trước mùa mưa 10 ngày)',
    suggestedSupplier: 'Royal Canin Việt Nam (Mr. Đặng Quốc Huy)',
    aiAdviceForOwner: '🌧️ BÁO CHỦ: Mùa mưa độ ẩm >85%, mèo đi vệ sinh trong nhà tăng 80%. Nhập 80 túi Cát Tofu trước 20/08 để nhận chiết khấu NCC 12%.'
  },
  {
    productId: 'prod-5',
    productName: 'Thuốc Trị Nấm & Ve Rận Frontline Plus',
    sku: 'FRONTLINE-PLUS',
    category: 'Y tế',
    peakSeasonType: 'RAINY_SEASON',
    peakSeasonLabel: '🌧️ Mùa Mưa (T9 - T11)',
    historicalAvgSales5Year: '65 hộp/tháng',
    predictedMonthlyDemand: '115 hộp/tháng',
    suggestedReorderQty: 40,
    suggestedOrderDate: '2026-08-25 (Đầu mùa mưa)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🌧️ BÁO CHỦ: Mùa mưa nấm da & ve rận bùng phát mạnh +150%. Nhập ngay 40 hộp Thuốc Trị Nấm Frontline phục vụ khám y tế.'
  },
  {
    productId: 'prod-1',
    productName: 'Hạt Royal Canin Mini Adult (2kg)',
    sku: 'RC-MINI-2KG',
    category: 'Thức ăn',
    peakSeasonType: 'HOLIDAY_TET',
    peakSeasonLabel: '🧧 Mùa Lễ Tết (T12 - T2)',
    historicalAvgSales5Year: '220 bao/tháng',
    predictedMonthlyDemand: '390 bao/tháng',
    suggestedReorderQty: 75,
    suggestedOrderDate: '2026-11-25 (Trước Tết 1 tháng)',
    suggestedSupplier: 'Royal Canin Việt Nam (Mr. Đặng Quốc Huy)',
    aiAdviceForOwner: '🧧 BÁO CHỦ: Nhu cầu mua Hạt tích trữ làm quà Tết & gửi lưu trú tăng 110%. Nhập 75 bao Hạt Royal Canin trước ngày 25/11.'
  },
  {
    productId: 'prod-6',
    productName: 'Chuồng Nệm Lưu Trú & Giường Ấm Thú Cưng',
    sku: 'PET-BED-HOTEL',
    category: 'Phụ kiện',
    peakSeasonType: 'HOLIDAY_TET',
    peakSeasonLabel: '🧧 Mùa Lễ Tết (T12 - T2)',
    historicalAvgSales5Year: '30 cái/tháng',
    predictedMonthlyDemand: '70 cái/tháng',
    suggestedReorderQty: 25,
    suggestedOrderDate: '2026-11-30 (Trước đợt lưu trú Tết)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🧧 BÁO CHỦ: Nhu cầu mua nệm lưu trú giữ ấm mùa Tết tăng 110%. Đề xuất tính toán điểm đặt hàng (Reorder Point) và nhập thêm 25 Nệm Lưu Trú.'
  },
  {
    productId: 'prod-7',
    productName: 'Vắc Xin 7 Bệnh Vanguard Plus 5/CV-L (Chó)',
    sku: 'VAC-VANGUARD-7',
    category: 'Y tế',
    peakSeasonType: 'RAINY_SEASON',
    peakSeasonLabel: '🌧️ Mùa Mưa (T9 - T11)',
    historicalAvgSales5Year: '45 liều/tháng',
    predictedMonthlyDemand: '95 liều/tháng',
    suggestedReorderQty: 30,
    suggestedOrderDate: '2026-08-22 (Đầu mùa mưa)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🌧️ BÁO CHỦ: Tốc độ tiêu thụ Vắc xin mùa mưa có xu hướng tăng đột biến +35%. Đề xuất nhập thêm 30 liều dự phòng đứt gãy chuỗi cung ứng.'
  },
  {
    productId: 'prod-8',
    productName: 'Thuốc Kháng Sinh Kháng Viêm Baytril 5% (100ml)',
    sku: 'BAYTRIL-5-100',
    category: 'Y tế',
    peakSeasonType: 'RAINY_SEASON',
    peakSeasonLabel: '🌧️ Mùa Mưa (T9 - T11)',
    historicalAvgSales5Year: '20 chai/tháng',
    predictedMonthlyDemand: '48 chai/tháng',
    suggestedReorderQty: 20,
    suggestedOrderDate: '2026-08-25 (Đầu mùa mưa)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🌧️ BÁO CHỦ: Tỷ lệ chó mèo bị viêm đường hô hấp & tiêu chảy tăng 130% khi trời mưa kéo dài. Nhập ngay 20 chai Thuốc Kháng Sinh Baytril.'
  },
  {
    productId: 'prod-10',
    productName: 'Bộ Kìm Cắt Móng & Đèn UV Soi Nấm Da Chuyên Dụng',
    sku: 'UV-FUNGUS-LAMP',
    category: 'Dụng cụ Y tế',
    peakSeasonType: 'RAINY_SEASON',
    peakSeasonLabel: '🌧️ Mùa Mưa (T9 - T11)',
    historicalAvgSales5Year: '12 bộ/tháng',
    predictedMonthlyDemand: '32 bộ/tháng',
    suggestedReorderQty: 10,
    suggestedOrderDate: '2026-08-28 (Trị bệnh nấm da)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🌧️ BÁO CHỦ: Nhu cầu soi chẩn đoán nấm da chó mèo tại phòng khám tăng cao mùa mưa. Nhập thêm 10 bộ Đèn UV Soi Nấm Da.'
  },
  {
    productId: 'prod-11',
    productName: 'Bơm Tiêm Vắc Xin Y Tế Vô Trùng 3ml (Hộp 100 cái)',
    sku: 'SYRINGE-3ML-100',
    category: 'Dụng cụ Y tế',
    peakSeasonType: 'HOLIDAY_TET',
    peakSeasonLabel: '🧧 Mùa Lễ Tết (T12 - T2)',
    historicalAvgSales5Year: '35 hộp/tháng',
    predictedMonthlyDemand: '75 hộp/tháng',
    suggestedReorderQty: 25,
    suggestedOrderDate: '2026-11-20 (Dịp tiêm ngừa cuối năm)',
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng)',
    aiAdviceForOwner: '🧧 BÁO CHỦ: Đợt tiêm ngừa vắc xin tổng kiểm tra sức khỏe trước Tết khiến tiêu thụ bơm tiêm vô trùng tăng 115%. Nhập thêm 25 hộp Bơm Tiêm 3ml.'
  }
];

// Use Case 18: Quản lý chương trình khuyến mãi (Promotions)
export const INITIAL_PROMOTIONS = [
  {
    id: 'promo-1',
    code: 'SPA10OFF',
    name: 'Giảm 10% Cho Dịch Vụ Spa Lần Đầu',
    discountPercent: 10,
    applicableTo: 'Spa & Grooming',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    status: 'ACTIVE'
  },
  {
    id: 'promo-2',
    code: 'PETLOVER20',
    name: 'Ưu Đãi Mùa Hè - Giảm 20k Đơn Hàng Vật Phẩm',
    discountPercent: 15,
    applicableTo: 'Vật phẩm & Thức ăn',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    status: 'ACTIVE'
  }
];

// Use Case 23: Đề xuất kế hoạch nhập hàng thông minh (Sub-usecases 23.1 -> 23.5)
export const INITIAL_REORDER_PROPOSALS = [
  {
    id: 'prop-201',
    productId: 'prod-1',
    productName: 'Hạt Royal Canin Mini Adult (2kg)',
    sku: 'RC-MINI-2KG',
    // 23.1 Kiểm tra tồn kho
    currentStock: 8,
    minStockLevel: 15,
    safetyStock: 12,
    // 23.2 Tính lượng cần nhập
    suggestedQuantity: 35,
    // 23.3 Đề xuất thời điểm nhập
    suggestedOrderDate: '2026-08-22',
    leadTimeDays: 4,
    // 23.4 Đề xuất nhà cung cấp
    suggestedSupplier: 'Royal Canin Việt Nam (Mr. Đặng Quốc Huy - 02838990011)',
    confidenceScore: 0.94,
    // 23.5 Tạo đề xuất nhập hàng
    reason: 'AI Model (94% confidence): Doanh số dự báo tăng 30% trong 2 tuần tới. Tồn kho hiện tại (8) đã vi phạm Ngưỡng an toàn (15).',
    status: 'DRAFT', // 24. Phê duyệt kế hoạch nhập hàng (DRAFT -> APPROVED | REJECTED)
    createdAt: '2026-08-19 14:30'
  },
  {
    id: 'prop-202',
    productId: 'prod-3',
    productName: 'Sữa Tắm Dưỡng Lông SOS Cho Chó Mèo 530ml',
    sku: 'SOS-SHAMPOO-530',
    currentStock: 5,
    minStockLevel: 12,
    safetyStock: 10,
    suggestedQuantity: 25,
    suggestedOrderDate: '2026-08-21',
    leadTimeDays: 3,
    suggestedSupplier: 'Nhà Phân Phối VetCare (Ms. Vũ Thị Hồng - 02837778899)',
    confidenceScore: 0.96,
    reason: 'AI Model (96% confidence): Tồn kho nguy cấp (5/12). Lịch hẹn Spa cuối tuần tăng cao dẫn tới nguy cơ đứt nguồn cung.',
    status: 'DRAFT',
    createdAt: '2026-08-19 15:10'
  }
];

// 5-YEAR HISTORICAL DATASET (2022 - 2026) WITH WEATHER & SEASONAL FACTORS
export const FIVE_YEAR_HISTORICAL_DATA = [
  // 2022
  { year: 2022, month: 1, label: 'T1/2022', revenue: 45000000, productsSold: 180, seasonType: 'HOLIDAY_TET', avgTempC: 24, rainfallMm: 15, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2022, month: 2, label: 'T2/2022', revenue: 52000000, productsSold: 210, seasonType: 'HOLIDAY_TET', avgTempC: 26, rainfallMm: 20, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2022, month: 3, label: 'T3/2022', revenue: 38000000, productsSold: 150, seasonType: 'SPRING', avgTempC: 28, rainfallMm: 45, seasonLabel: '🌱 Mùa Xuân' },
  { year: 2022, month: 4, label: 'T4/2022', revenue: 58000000, productsSold: 230, seasonType: 'HOT_SUMMER', avgTempC: 34, rainfallMm: 80, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2022, month: 5, label: 'T5/2022', revenue: 64000000, productsSold: 260, seasonType: 'HOT_SUMMER', avgTempC: 36, rainfallMm: 120, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2022, month: 6, label: 'T6/2022', revenue: 70000000, productsSold: 290, seasonType: 'HOT_SUMMER', avgTempC: 37, rainfallMm: 150, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2022, month: 7, label: 'T7/2022', revenue: 68000000, productsSold: 280, seasonType: 'HOT_SUMMER', avgTempC: 36, rainfallMm: 190, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2022, month: 8, label: 'T8/2022', revenue: 62000000, productsSold: 250, seasonType: 'HOT_SUMMER', avgTempC: 34, rainfallMm: 220, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2022, month: 9, label: 'T9/2022', revenue: 54000000, productsSold: 240, seasonType: 'RAINY_SEASON', avgTempC: 30, rainfallMm: 310, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2022, month: 10, label: 'T10/2022', revenue: 51000000, productsSold: 230, seasonType: 'RAINY_SEASON', avgTempC: 28, rainfallMm: 350, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2022, month: 11, label: 'T11/2022', revenue: 49000000, productsSold: 220, seasonType: 'RAINY_SEASON', avgTempC: 27, rainfallMm: 280, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2022, month: 12, label: 'T12/2022', revenue: 75000000, productsSold: 320, seasonType: 'HOLIDAY_TET', avgTempC: 24, rainfallMm: 30, seasonLabel: '🧧 Mùa Lễ Tết' },

  // 2023
  { year: 2023, month: 1, label: 'T1/2023', revenue: 82000000, productsSold: 350, seasonType: 'HOLIDAY_TET', avgTempC: 25, rainfallMm: 10, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2023, month: 2, label: 'T2/2023', revenue: 60000000, productsSold: 260, seasonType: 'HOLIDAY_TET', avgTempC: 26, rainfallMm: 15, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2023, month: 3, label: 'T3/2023', revenue: 48000000, productsSold: 200, seasonType: 'SPRING', avgTempC: 29, rainfallMm: 40, seasonLabel: '🌱 Mùa Xuân' },
  { year: 2023, month: 4, label: 'T4/2023', revenue: 72000000, productsSold: 310, seasonType: 'HOT_SUMMER', avgTempC: 35, rainfallMm: 90, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2023, month: 5, label: 'T5/2023', revenue: 81000000, productsSold: 360, seasonType: 'HOT_SUMMER', avgTempC: 37, rainfallMm: 130, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2023, month: 6, label: 'T6/2023', revenue: 88000000, productsSold: 390, seasonType: 'HOT_SUMMER', avgTempC: 38, rainfallMm: 160, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2023, month: 7, label: 'T7/2023', revenue: 85000000, productsSold: 380, seasonType: 'HOT_SUMMER', avgTempC: 36, rainfallMm: 200, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2023, month: 8, label: 'T8/2023', revenue: 79000000, productsSold: 340, seasonType: 'HOT_SUMMER', avgTempC: 35, rainfallMm: 240, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2023, month: 9, label: 'T9/2023', revenue: 68000000, productsSold: 310, seasonType: 'RAINY_SEASON', avgTempC: 30, rainfallMm: 330, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2023, month: 10, label: 'T10/2023', revenue: 64000000, productsSold: 290, seasonType: 'RAINY_SEASON', avgTempC: 28, rainfallMm: 370, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2023, month: 11, label: 'T11/2023', revenue: 62000000, productsSold: 280, seasonType: 'RAINY_SEASON', avgTempC: 26, rainfallMm: 290, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2023, month: 12, label: 'T12/2023', revenue: 98000000, productsSold: 420, seasonType: 'HOLIDAY_TET', avgTempC: 24, rainfallMm: 25, seasonLabel: '🧧 Mùa Lễ Tết' },

  // 2024
  { year: 2024, month: 1, label: 'T1/2024', revenue: 110000000, productsSold: 480, seasonType: 'HOLIDAY_TET', avgTempC: 24, rainfallMm: 12, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2024, month: 2, label: 'T2/2024', revenue: 105000000, productsSold: 450, seasonType: 'HOLIDAY_TET', avgTempC: 25, rainfallMm: 18, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2024, month: 3, label: 'T3/2024', revenue: 65000000, productsSold: 290, seasonType: 'SPRING', avgTempC: 29, rainfallMm: 35, seasonLabel: '🌱 Mùa Xuân' },
  { year: 2024, month: 4, label: 'T4/2024', revenue: 95000000, productsSold: 410, seasonType: 'HOT_SUMMER', avgTempC: 36, rainfallMm: 85, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2024, month: 5, label: 'T5/2024', revenue: 108000000, productsSold: 470, seasonType: 'HOT_SUMMER', avgTempC: 38, rainfallMm: 140, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2024, month: 6, label: 'T6/2024', revenue: 115000000, productsSold: 500, seasonType: 'HOT_SUMMER', avgTempC: 39, rainfallMm: 170, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2024, month: 7, label: 'T7/2024', revenue: 112000000, productsSold: 490, seasonType: 'HOT_SUMMER', avgTempC: 37, rainfallMm: 210, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2024, month: 8, label: 'T8/2024', revenue: 102000000, productsSold: 440, seasonType: 'HOT_SUMMER', avgTempC: 35, rainfallMm: 250, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2024, month: 9, label: 'T9/2024', revenue: 88000000, productsSold: 390, seasonType: 'RAINY_SEASON', avgTempC: 30, rainfallMm: 340, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2024, month: 10, label: 'T10/2024', revenue: 84000000, productsSold: 370, seasonType: 'RAINY_SEASON', avgTempC: 28, rainfallMm: 380, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2024, month: 11, label: 'T11/2024', revenue: 82000000, productsSold: 360, seasonType: 'RAINY_SEASON', avgTempC: 26, rainfallMm: 300, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2024, month: 12, label: 'T12/2024', revenue: 130000000, productsSold: 560, seasonType: 'HOLIDAY_TET', avgTempC: 23, rainfallMm: 20, seasonLabel: '🧧 Mùa Lễ Tết' },

  // 2025
  { year: 2025, month: 1, label: 'T1/2025', revenue: 145000000, productsSold: 630, seasonType: 'HOLIDAY_TET', avgTempC: 24, rainfallMm: 15, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2025, month: 2, label: 'T2/2025', revenue: 135000000, productsSold: 590, seasonType: 'HOLIDAY_TET', avgTempC: 25, rainfallMm: 18, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2025, month: 3, label: 'T3/2025', revenue: 88000000, productsSold: 380, seasonType: 'SPRING', avgTempC: 29, rainfallMm: 40, seasonLabel: '🌱 Mùa Xuân' },
  { year: 2025, month: 4, label: 'T4/2025', revenue: 125000000, productsSold: 540, seasonType: 'HOT_SUMMER', avgTempC: 36, rainfallMm: 95, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2025, month: 5, label: 'T5/2025', revenue: 140000000, productsSold: 610, seasonType: 'HOT_SUMMER', avgTempC: 38, rainfallMm: 150, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2025, month: 6, label: 'T6/2025', revenue: 152000000, productsSold: 660, seasonType: 'HOT_SUMMER', avgTempC: 39, rainfallMm: 180, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2025, month: 7, label: 'T7/2025', revenue: 148000000, productsSold: 640, seasonType: 'HOT_SUMMER', avgTempC: 37, rainfallMm: 220, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2025, month: 8, label: 'T8/2025', revenue: 136000000, productsSold: 590, seasonType: 'HOT_SUMMER', avgTempC: 35, rainfallMm: 260, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2025, month: 9, label: 'T9/2025', revenue: 118000000, productsSold: 510, seasonType: 'RAINY_SEASON', avgTempC: 30, rainfallMm: 360, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2025, month: 10, label: 'T10/2025', revenue: 112000000, productsSold: 490, seasonType: 'RAINY_SEASON', avgTempC: 28, rainfallMm: 390, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2025, month: 11, label: 'T11/2025', revenue: 108000000, productsSold: 470, seasonType: 'RAINY_SEASON', avgTempC: 26, rainfallMm: 310, seasonLabel: '🌧️ Mùa Mưa' },
  { year: 2025, month: 12, label: 'T12/2025', revenue: 172000000, productsSold: 750, seasonType: 'HOLIDAY_TET', avgTempC: 23, rainfallMm: 22, seasonLabel: '🧧 Mùa Lễ Tết' },

  // 2026 (T1 -> T8)
  { year: 2026, month: 1, label: 'T1/2026', revenue: 190000000, productsSold: 830, seasonType: 'HOLIDAY_TET', avgTempC: 24, rainfallMm: 10, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2026, month: 2, label: 'T2/2026', revenue: 178000000, productsSold: 780, seasonType: 'HOLIDAY_TET', avgTempC: 25, rainfallMm: 15, seasonLabel: '🧧 Mùa Lễ Tết' },
  { year: 2026, month: 3, label: 'T3/2026', revenue: 115000000, productsSold: 500, seasonType: 'SPRING', avgTempC: 29, rainfallMm: 38, seasonLabel: '🌱 Mùa Xuân' },
  { year: 2026, month: 4, label: 'T4/2026', revenue: 162000000, productsSold: 710, seasonType: 'HOT_SUMMER', avgTempC: 36, rainfallMm: 90, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2026, month: 5, label: 'T5/2026', revenue: 182000000, productsSold: 800, seasonType: 'HOT_SUMMER', avgTempC: 38, rainfallMm: 145, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2026, month: 6, label: 'T6/2026', revenue: 198000000, productsSold: 870, seasonType: 'HOT_SUMMER', avgTempC: 39, rainfallMm: 175, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2026, month: 7, label: 'T7/2026', revenue: 192000000, productsSold: 840, seasonType: 'HOT_SUMMER', avgTempC: 37, rainfallMm: 215, seasonLabel: '☀️ Mùa Nắng Nóng' },
  { year: 2026, month: 8, label: 'T8/2026', revenue: 180000000, productsSold: 790, seasonType: 'HOT_SUMMER', avgTempC: 35, rainfallMm: 255, seasonLabel: '☀️ Mùa Nắng Nóng' }
];

// GENERATE 5-YEAR ORDER HISTORY (MOCK)
export const FIVE_YEAR_ORDER_HISTORY = (() => {
  const history = [];
  const startYear = 2022;
  const endYear = 2026; // 5 full years
  let orderId = 1000;

  const productIds = INITIAL_PRODUCTS.map(p => p.id);
  const supplierIds = INITIAL_SUPPLIERS.map(s => s.id);

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const isHighSeason = [1, 2, 6, 7, 12].includes(month); // Tết & Hè

      // Số lượng đơn bán hàng mỗi tháng (120 - 220 đơn) - ĐỒNG BỘ DOANH THU
      const salesOrderCount = isHighSeason ? Math.floor(Math.random() * 50) + 180 : Math.floor(Math.random() * 50) + 120;
      let monthlyRevenue = 0;
      let monthlyProductsSold = 0;

      for (let i = 0; i < salesOrderCount; i++) {
        const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per sale
        const items = [];
        let totalAmount = 0;

        for (let j = 0; j < numItems; j++) {
          const prod = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
          const qty = Math.floor(Math.random() * 3) + 1;
          const price = prod.unitPrice;
          items.push({
            productId: prod.id,
            productName: prod.name,
            quantity: qty,
            unitPrice: price,
            total: qty * price
          });
          totalAmount += qty * price;
          monthlyProductsSold += qty;
        }
        monthlyRevenue += totalAmount;

        history.push({
          id: `SAL-${year}-${String(month).padStart(2, '0')}-${orderId++}`,
          type: 'SALES', // Bán hàng
          date: `${year}-${String(month).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          customerId: 'Walk-in Customer',
          items,
          totalAmount,
          status: 'COMPLETED'
        });
      }

      // Nhập hàng dựa trên khối lượng bán ra (để duy trì tỷ lệ COGS ~45-55%)
      // Ta cần nhập số lượng hàng ~ bằng số hàng bán ra + một chút tồn kho
      const importOrderCount = isHighSeason ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * 2) + 2;
      let remainingQtyToImport = Math.floor(monthlyProductsSold * (Math.random() * 0.2 + 0.9)); // Nhập 90-110% lượng bán ra

      for (let i = 0; i < importOrderCount; i++) {
        const numItems = Math.floor(Math.random() * 5) + 4; // 4-8 items per import
        const items = [];
        let totalAmount = 0;

        for (let j = 0; j < numItems; j++) {
          const prod = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
          // Chia nhỏ lượng cần nhập
          const qty = Math.max(10, Math.floor(remainingQtyToImport / (importOrderCount * numItems)));
          const price = prod.costPrice;
          items.push({
            productId: prod.id,
            productName: prod.name,
            quantity: qty,
            unitPrice: price,
            total: qty * price
          });
          totalAmount += qty * price;
        }

        history.push({
          id: `IMP-${year}-${String(month).padStart(2, '0')}-${orderId++}`,
          type: 'IMPORT', // Nhập hàng
          date: `${year}-${String(month).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          supplierId: supplierIds[Math.floor(Math.random() * supplierIds.length)],
          items,
          totalAmount,
          status: 'COMPLETED'
        });
      }
    }
  }

  // Sắp xếp theo ngày
  return history.sort((a, b) => new Date(a.date) - new Date(b.date));
})();
