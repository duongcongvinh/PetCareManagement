// Mock Data mapping 1-to-1 with the 29 Use Cases from the Use Case Diagram

export const INITIAL_USERS = [
  { id: 'u-1', fullName: 'Nguyễn Văn Admin', email: 'admin@petcare.com', phone: '0901234567', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-01-10' },
  { id: 'u-2', fullName: 'Trần Thị Chăm Sóc', email: 'care@petcare.com', phone: '0912345678', role: 'CARE_STAFF', status: 'ACTIVE', createdAt: '2026-02-15' },
  { id: 'u-3', fullName: 'Lê Văn Kho', email: 'warehouse@petcare.com', phone: '0923456789', role: 'WAREHOUSE_STAFF', status: 'ACTIVE', createdAt: '2026-03-01' },
  { id: 'u-4', fullName: 'Phạm Minh Anh', email: 'khachhang@gmail.com', phone: '0934567890', role: 'CUSTOMER', status: 'ACTIVE', createdAt: '2026-04-12' },
  { id: 'u-5', fullName: 'Hoàng Thị Yến', email: 'khachhang2@gmail.com', phone: '0945678901', role: 'CUSTOMER', status: 'ACTIVE', createdAt: '2026-05-20' },
];

export const INITIAL_SERVICES = [
  {
    id: 's1',
    name: 'Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt)',
    description: 'Vệ sinh tai, cắt móng, vắt tuyến hôi, tắm sấy & cắt tỉa tạo kiểu chuyên nghiệp.',
    durationMinutes: 60,
    price: 250000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  },
  {
    id: 's2',
    name: 'Tiêm Vắc Xin 5 Trong 1',
    description: 'Phòng ngừa các bệnh truyền nhiễm nguy hiểm cho chó mèo kèm sổ theo dõi sức khỏe.',
    durationMinutes: 30,
    price: 180000,
    category: 'Y Tế & Tiêm Phòng',
    status: 'ACTIVE'
  },
  {
    id: 's3',
    name: 'Khám Sức Khỏe Tổng Quát',
    description: 'Siêu âm, xét nghiệm máu cơ bản, kiểm tra răng miệng & tư vấn dinh dưỡng.',
    durationMinutes: 45,
    price: 300000,
    category: 'Khám Bệnh',
    status: 'ACTIVE'
  },
  {
    id: 's4',
    name: 'Tắm Dưỡng Lông Thảo Dược & Khử Mùi',
    description: 'Giải pháp trị nấm ngứa, phục hồi lông xơ rối với tinh dầu thiên nhiên.',
    durationMinutes: 45,
    price: 200000,
    category: 'Spa & Grooming',
    status: 'ACTIVE'
  }
];

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
];

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
  {
    id: 'prod-1',
    name: 'Hạt Royal Canin Mini Adult (2kg)',
    category: 'Thức ăn',
    sku: 'RC-MINI-2KG',
    unitPrice: 320000,
    costPrice: 240000,
    currentStock: 8,
    minStockLevel: 15,
    maxStockLevel: 80,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-2',
    name: 'Cát Vệ Sinh Mèo Đậu Nành Tofu 6L',
    category: 'Phụ kiện',
    sku: 'CAT-TOFU-6L',
    unitPrice: 110000,
    costPrice: 75000,
    currentStock: 45,
    minStockLevel: 20,
    maxStockLevel: 120,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-3',
    name: 'Sữa Tắm Dưỡng Lông SOS Cho Chó Mèo 530ml',
    category: 'Mỹ phẩm Spa',
    sku: 'SOS-SHAMPOO-530',
    unitPrice: 150000,
    costPrice: 95000,
    currentStock: 5,
    minStockLevel: 12,
    maxStockLevel: 50,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-4',
    name: 'Pate Mèo Whiskas Vị Cá Biển (85g)',
    category: 'Thức ăn',
    sku: 'PATE-WHIS-85G',
    unitPrice: 22000,
    costPrice: 15000,
    currentStock: 60,
    minStockLevel: 25,
    maxStockLevel: 200,
    supplierId: 'sup-1',
    supplierName: 'Royal Canin Việt Nam'
  },
  {
    id: 'prod-5',
    name: 'Thuốc Trị Nấm & Ve Rận Frontline Plus',
    category: 'Y tế',
    sku: 'FRONTLINE-PLUS',
    unitPrice: 180000,
    costPrice: 120000,
    currentStock: 4,
    minStockLevel: 10,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-6',
    name: 'Chuồng Nệm Lưu Trú & Giường Ấm Thú Cưng',
    category: 'Phụ kiện',
    sku: 'PET-BED-HOTEL',
    unitPrice: 450000,
    costPrice: 310000,
    currentStock: 3,
    minStockLevel: 8,
    maxStockLevel: 40,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-7',
    name: 'Vắc Xin 7 Bệnh Vanguard Plus 5/CV-L (Chó)',
    category: 'Y tế',
    sku: 'VAC-VANGUARD-7',
    unitPrice: 240000,
    costPrice: 165000,
    currentStock: 6,
    minStockLevel: 15,
    maxStockLevel: 80,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-8',
    name: 'Thuốc Kháng Sinh Kháng Viêm Baytril 5% (100ml)',
    category: 'Y tế',
    sku: 'BAYTRIL-5-100',
    unitPrice: 310000,
    costPrice: 220000,
    currentStock: 3,
    minStockLevel: 10,
    maxStockLevel: 50,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-9',
    name: 'Thuốc Xổ Giun Định Kỳ Drontal Plus (Vỉ 6 viên)',
    category: 'Y tế',
    sku: 'DRONTAL-PLUS',
    unitPrice: 160000,
    costPrice: 105000,
    currentStock: 25,
    minStockLevel: 12,
    maxStockLevel: 90,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-10',
    name: 'Bộ Kìm Cắt Móng & Đèn UV Soi Nấm Da Chuyên Dụng',
    category: 'Dụng cụ Y tế',
    sku: 'UV-FUNGUS-LAMP',
    unitPrice: 280000,
    costPrice: 185000,
    currentStock: 2,
    minStockLevel: 5,
    maxStockLevel: 30,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-11',
    name: 'Bơm Tiêm Vắc Xin Y Tế Vô Trùng 3ml (Hộp 100 cái)',
    category: 'Dụng cụ Y tế',
    sku: 'SYRINGE-3ML-100',
    unitPrice: 120000,
    costPrice: 75000,
    currentStock: 12,
    minStockLevel: 20,
    maxStockLevel: 100,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-12',
    name: 'Loa Chống Liếm Vết Phẫu Thuật Elizabeth Collar (Size M)',
    category: 'Dụng cụ Y tế',
    sku: 'ELIZABETH-COLLAR-M',
    unitPrice: 65000,
    costPrice: 38000,
    currentStock: 15,
    minStockLevel: 10,
    maxStockLevel: 50,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-13',
    name: 'Dung Dịch Rửa Tai Trị Viêm Bioline Ear Care (50ml)',
    category: 'Y tế',
    sku: 'BIOLINE-EAR-50',
    unitPrice: 95000,
    costPrice: 60000,
    currentStock: 4,
    minStockLevel: 12,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-14',
    name: 'Siro Bổ Gan & Hỗ Trợ Độc Tố Megaderm Nutri-Plus Gel',
    category: 'Y tế',
    sku: 'NUTRI-PLUS-GEL',
    unitPrice: 195000,
    costPrice: 130000,
    currentStock: 18,
    minStockLevel: 10,
    maxStockLevel: 70,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-15',
    name: 'Vắc Xin Phòng Bệnh Dại Rabisin (Lọ 1 liều)',
    category: 'Y tế',
    sku: 'VAC-RABISIN-1',
    unitPrice: 120000,
    costPrice: 75000,
    currentStock: 8,
    minStockLevel: 20,
    maxStockLevel: 100,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-16',
    name: 'Vắc Xin Mèo 4 Bệnh Purevax RCPCH (Hộp 10 liều)',
    category: 'Y tế',
    sku: 'VAC-PUREVAX-CAT',
    unitPrice: 290000,
    costPrice: 210000,
    currentStock: 5,
    minStockLevel: 15,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-17',
    name: 'Que Test Nhanh Bệnh Parvo & Carre Ở Chó (Hộp 10 bộ)',
    category: 'Dụng cụ Y tế',
    sku: 'TEST-KIT-PARVO',
    unitPrice: 450000,
    costPrice: 320000,
    currentStock: 3,
    minStockLevel: 10,
    maxStockLevel: 40,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-18',
    name: 'Que Test Nhanh Bệnh Giảm Bạch Cầu Mèo FPV (Hộp 10 bộ)',
    category: 'Dụng cụ Y tế',
    sku: 'TEST-KIT-FPV-CAT',
    unitPrice: 420000,
    costPrice: 290000,
    currentStock: 2,
    minStockLevel: 8,
    maxStockLevel: 35,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-19',
    name: 'Thuốc Nhỏ Mắt Trị Viêm & Loét Giác Mạc Tobramycin (10ml)',
    category: 'Y tế',
    sku: 'TOBRAMYCIN-EYE',
    unitPrice: 85000,
    costPrice: 50000,
    currentStock: 7,
    minStockLevel: 12,
    maxStockLevel: 50,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-20',
    name: 'Thuốc Trị Viêm Tai Dùng Cho Chó Mèo Surolan Otic (15ml)',
    category: 'Y tế',
    sku: 'SUROLAN-15ML',
    unitPrice: 210000,
    costPrice: 145000,
    currentStock: 4,
    minStockLevel: 10,
    maxStockLevel: 45,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-21',
    name: 'Viên Canxi Hỗ Trợ Xương Khớp Chó Mèo Phos-Calci (100 viên)',
    category: 'Y tế',
    sku: 'PHOS-CALCI-100',
    unitPrice: 175000,
    costPrice: 110000,
    currentStock: 22,
    minStockLevel: 15,
    maxStockLevel: 80,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-22',
    name: 'Bột Cầm Máu & Sát Trùng Vết Thương Kwik Stop Powder (14g)',
    category: 'Dụng cụ Y tế',
    sku: 'KWIK-STOP-14G',
    unitPrice: 260000,
    costPrice: 175000,
    currentStock: 3,
    minStockLevel: 8,
    maxStockLevel: 30,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-23',
    name: 'Thuốc Trị Tiêu Chảy & Đường Ruột Smecta Vet (Hộp 20 gói)',
    category: 'Y tế',
    sku: 'SMECTA-VET-20',
    unitPrice: 135000,
    costPrice: 85000,
    currentStock: 9,
    minStockLevel: 15,
    maxStockLevel: 60,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-24',
    name: 'Bộ Dao Phẫu Thuật & Ban Ca Y Tế Vô Trùng (Bộ 5 món)',
    category: 'Dụng cụ Y tế',
    sku: 'SURGICAL-KIT-5',
    unitPrice: 380000,
    costPrice: 250000,
    currentStock: 2,
    minStockLevel: 5,
    maxStockLevel: 25,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-25',
    name: 'Huyết Thanh Kháng Thể Đa Năng Polyserum (20ml)',
    category: 'Y tế',
    sku: 'POLYSERUM-20ML',
    unitPrice: 320000,
    costPrice: 220000,
    currentStock: 4,
    minStockLevel: 10,
    maxStockLevel: 40,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  },
  {
    id: 'prod-26',
    name: 'Máy Xông Khí Định Trị Hô Hấp Thú Y Cầm Tay',
    category: 'Dụng cụ Y tế',
    sku: 'NEBULIZER-VET-HAND',
    unitPrice: 680000,
    costPrice: 480000,
    currentStock: 1,
    minStockLevel: 3,
    maxStockLevel: 15,
    supplierId: 'sup-2',
    supplierName: 'Nhà Phân Phối VetCare'
  }
];

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
