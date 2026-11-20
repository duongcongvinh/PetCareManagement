const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // Dọn dẹp dữ liệu cũ nếu có
  await prisma.reorderProposal.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.serviceCatalog.deleteMany();
  await prisma.pet.deleteMany();

  // 1. Password Hashing
  const passwordHash = await bcrypt.hash('123456', 10);

  // 2. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@petcare.com' },
    update: {},
    create: {
      email: 'admin@petcare.com',
      password: passwordHash,
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      role: 'ADMIN',
    },
  });

  const careStaff = await prisma.user.upsert({
    where: { email: 'care@petcare.com' },
    update: {},
    create: {
      email: 'care@petcare.com',
      password: passwordHash,
      fullName: 'Trần Thị Chăm Sóc',
      phone: '0912345678',
      role: 'CARE_STAFF',
    },
  });

  const warehouseStaff = await prisma.user.upsert({
    where: { email: 'warehouse@petcare.com' },
    update: {},
    create: {
      email: 'warehouse@petcare.com',
      password: passwordHash,
      fullName: 'Lê Văn Kho',
      phone: '0923456789',
      role: 'WAREHOUSE_STAFF',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'khachhang@gmail.com' },
    update: {},
    create: {
      email: 'khachhang@gmail.com',
      password: passwordHash,
      fullName: 'Phạm Minh Anh',
      phone: '0934567890',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Users seeded');

  // 3. Pets
  const pet1 = await prisma.pet.create({
    data: {
      name: 'LuLu',
      species: 'Chó',
      breed: 'Poodle',
      ageMonths: 18,
      weightKg: 4.5,
      medicalHistory: 'Đã tiêm phòng dại 3 mũi, tẩy giun tháng trước',
      ownerId: customer1.id,
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Miu Miu',
      species: 'Mèo',
      breed: 'Anh Lông Ngắn',
      ageMonths: 12,
      weightKg: 3.8,
      medicalHistory: 'Khỏe mạnh, nhạy cảm với xà phòng có mùi nồng',
      ownerId: customer1.id,
    },
  });

  console.log('✅ Pets seeded');

  // 4. Services
  const service1 = await prisma.serviceCatalog.create({
    data: {
      name: 'Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt)',
      description: 'Vệ sinh tai, cắt móng, vắt tuyến hôi, tắm sấy & cắt tỉa tạo kiểu chuyên nghiệp.',
      durationMinutes: 60,
      price: 250000,
      category: 'Spa & Grooming',
    },
  });

  const service2 = await prisma.serviceCatalog.create({
    data: {
      name: 'Tiêm Vắc Xin 5 Trong 1',
      description: 'Phòng ngừa các bệnh truyền nhiễm nguy hiểm ở chó mèo kèm sổ theo dõi.',
      durationMinutes: 30,
      price: 180000,
      category: 'Y Tế & Tiêm Phòng',
    },
  });

  const service3 = await prisma.serviceCatalog.create({
    data: {
      name: 'Khám Sức Khỏe Tổng Quát',
      description: 'Siêu âm, xét nghiệm máu cơ bản, kiểm tra răng miệng & tư vấn dinh dưỡng.',
      durationMinutes: 45,
      price: 300000,
      category: 'Khám Bệnh',
    },
  });

  const service4 = await prisma.serviceCatalog.create({
    data: {
      name: 'Siêu Âm Thai Kỹ Thuật Số Doppler & Dự Sinh Chuẩn Xác',
      description: 'Chẩn đoán thai sớm từ ngày thứ 21. Đếm túi thai, đo nhịp tim thai bằng máy Doppler chuyên dụng và dự đoán ngày sinh chính xác.',
      durationMinutes: 25,
      price: 150000,
      category: 'Khoa Sinh Sản',
    },
  });

  const service5 = await prisma.serviceCatalog.create({
    data: {
      name: 'Gói Hộ Sinh Đỡ Đẻ & Hồi Sức Sơ Sinh An Toàn 24/7',
      description: 'Bác sĩ thú y trực tiếp theo dõi gò tử cung, hỗ trợ thế thai khó sinh, cắt rốn tiệt trùng và kích thở lồng ấp sơ sinh.',
      durationMinutes: 120,
      price: 350000,
      category: 'Khoa Sinh Sản',
    },
  });

  const service6 = await prisma.serviceCatalog.create({
    data: {
      name: 'Phẫu Thuật Mổ Đẻ Cấp Cứu Vô Trùng (C-Section)',
      description: 'Mổ lấy thai cấp cứu vô trùng khi khó sinh, suy thai hoặc kẹt xương chậu. Gây mê bay hơi Isoflurane an toàn tuyệt đối cho mẹ & con.',
      durationMinutes: 60,
      price: 850000,
      category: 'Khoa Sinh Sản',
    },
  });

  const service7 = await prisma.serviceCatalog.create({
    data: {
      name: 'Triệt Sản Mèo Cái / Chó Cái Công Nghệ Minilap Thẩm Mỹ',
      description: 'Cắt tử cung buồng trứng đường rạch vi phẫu siêu nhỏ 1-1.5cm, khâu chỉ tự tiêu nội bì, không sẹo lồi, hồi phục nhanh sau 24h.',
      durationMinutes: 45,
      price: 450000,
      category: 'Khoa Sinh Sản',
    },
  });

  const service8 = await prisma.serviceCatalog.create({
    data: {
      name: 'Thiến Chó Đực / Mèo Đực An Toàn & Kháng Khuẩn',
      description: 'Tiểu phẫu thiến 15 phút an toàn nhẹ nhàng, loại trừ nguy cơ ung thư tinh hoàn và kiểm soát triệt để hành vi xịt nước tiểu hôi đánh dấu.',
      durationMinutes: 25,
      price: 280000,
      category: 'Khoa Sinh Sản',
    },
  });

  const service9 = await prisma.serviceCatalog.create({
    data: {
      name: 'Phẫu Thuật Cấp Cứu Viêm Tử Cung Tích Mủ (Pyometra)',
      description: 'Giải phóng ổ mủ trong tử cung cho thú cưng bị biến chứng do tiêm thuốc tránh thai dạo hoặc rối loạn nội tiết tố, cứu sống nhiễm trùng máu.',
      durationMinutes: 75,
      price: 900000,
      category: 'Khoa Sinh Sản',
    },
  });

  console.log('✅ Services seeded');

  // 5. Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Công ty TNHH Thức Ăn Thú Cưng Royal Canin',
      contactPerson: 'Đặng Quốc Huy',
      phone: '02838990011',
      email: 'contact@royalcanin.vn',
      address: 'KCN Tân Bình, TP.HCM',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Nhà Phân Phối Dụng Cụ Thú Y VetCare',
      contactPerson: 'Vũ Thị Hồng',
      phone: '02837778899',
      email: 'sales@vetcare.com',
      address: 'Quận 7, TP.HCM',
    },
  });

  // 6. Products
  const prod1 = await prisma.product.create({
    data: {
      name: 'Hạt Royal Canin Mini Adult (2kg)',
      category: 'Thức ăn',
      sku: 'RC-MINI-2KG',
      unitPrice: 320000,
      costPrice: 240000,
      currentStock: 8,
      minStockLevel: 15,
      maxStockLevel: 80,
      supplierId: supplier1.id,
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Cát Vệ Sinh Mèo Đậu Nành Tofu 6L',
      category: 'Phụ kiện',
      sku: 'CAT-TOFU-6L',
      unitPrice: 110000,
      costPrice: 75000,
      currentStock: 45,
      minStockLevel: 20,
      maxStockLevel: 120,
      supplierId: supplier1.id,
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Sữa Tắm Dưỡng Lông SOS Cho Chó Mèo 530ml',
      category: 'Mỹ phẩm Spa',
      sku: 'SOS-SHAMPOO-530',
      unitPrice: 150000,
      costPrice: 95000,
      currentStock: 5,
      minStockLevel: 12,
      maxStockLevel: 50,
      supplierId: supplier2.id,
    },
  });

  // 12 Sản phẩm đồng bộ từ VPet's (https://vpets.vn/san-pham/)
  const vpetsProducts = [
    { name: 'Thức ăn cho chó trưởng thành Mini Adult | Royal Canin (2kg) + TẶNG 1 Pate', category: 'Thức ăn', sku: 'VP-RC-MINI-2KG', unitPrice: 322000, costPrice: 245000, currentStock: 32, minStockLevel: 12, maxStockLevel: 80, supplierId: supplier1.id },
    { name: 'Thức ăn cho mèo con Kitten | Royal Canin (2kg) + TẶNG 2 Pate', category: 'Thức ăn', sku: 'VP-RC-KITTEN-2KG', unitPrice: 408000, costPrice: 315000, currentStock: 26, minStockLevel: 10, maxStockLevel: 70, supplierId: supplier1.id },
    { name: 'Thức ăn cho mèo trưởng thành 6 Free Natural (2kg) + TẶNG 1 Pate', category: 'Thức ăn', sku: 'VP-6FREE-CAT-2KG', unitPrice: 540000, costPrice: 410000, currentStock: 18, minStockLevel: 10, maxStockLevel: 50, supplierId: supplier1.id },
    { name: 'Sữa bột cho chó Predogen (lon 400g) + TẶNG 1 Xúc xích', category: 'Dinh dưỡng', sku: 'VP-PREDOGEN-400G', unitPrice: 195000, costPrice: 140000, currentStock: 28, minStockLevel: 10, maxStockLevel: 60, supplierId: supplier2.id },
    { name: 'Sữa bột cho mèo Precaten (lon 400g) + TẶNG 1 Pate mèo con', category: 'Dinh dưỡng', sku: 'VP-PRECATEN-400G', unitPrice: 195000, costPrice: 140000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierId: supplier2.id },
    { name: 'Giường ngủ cho thú cưng | Touchdog', category: 'Phụ kiện', sku: 'VP-TOUCHDOG-BED', unitPrice: 661000, costPrice: 480000, currentStock: 12, minStockLevel: 6, maxStockLevel: 35, supplierId: supplier2.id },
    { name: 'Lồng vận chuyển hàng không cho chó mèo A1103 Pian Pian (Size L)', category: 'Phụ kiện', sku: 'VP-PIANPIAN-A1103-L', unitPrice: 411000, costPrice: 295000, currentStock: 15, minStockLevel: 8, maxStockLevel: 40, supplierId: supplier2.id },
    { name: 'Lược chải lông cho thú cưng có nút bấm', category: 'Mỹ phẩm Spa', sku: 'VP-BRUSH-BTN', unitPrice: 380000, costPrice: 265000, currentStock: 20, minStockLevel: 10, maxStockLevel: 50, supplierId: supplier2.id },
    { name: 'Dây dắt tự động dây tròn XS New Comfort', category: 'Phụ kiện', sku: 'VP-FLEXI-XS-COMFORT', unitPrice: 380000, costPrice: 270000, currentStock: 22, minStockLevel: 10, maxStockLevel: 50, supplierId: supplier2.id },
    { name: 'Yếm ren đeo cổ cao cấp cho thú cưng (Màu hồng)', category: 'Phụ kiện', sku: 'VP-LACE-COLLAR-PINK', unitPrice: 90000, costPrice: 55000, currentStock: 35, minStockLevel: 12, maxStockLevel: 80, supplierId: supplier2.id },
    { name: 'Đồ chơi chuột chút chít cho thú cưng', category: 'Phụ kiện', sku: 'VP-SQUEAKY-MOUSE', unitPrice: 25000, costPrice: 12000, currentStock: 80, minStockLevel: 25, maxStockLevel: 200, supplierId: supplier2.id },
    { name: 'Dung dịch hướng dẫn đi vệ sinh Good Puppy Forcan (80ml)', category: 'Mỹ phẩm Spa', sku: 'VP-FORCAN-PUPPY-80ML', unitPrice: 143000, costPrice: 95000, currentStock: 29, minStockLevel: 12, maxStockLevel: 70, supplierId: supplier2.id },
  ];
  await prisma.product.createMany({ data: vpetsProducts });

  console.log('✅ Products & Suppliers seeded');

  // 7. Appointments
  await prisma.appointment.create({
    data: {
      petId: pet1.id,
      customerId: customer1.id,
      staffId: careStaff.id,
      serviceId: service1.id,
      appointmentDate: new Date(),
      timeSlot: '09:00 - 10:00',
      status: 'IN_PROGRESS',
      notes: 'Bé hơi nhát, nhờ cắt ngắn bớt lông quanh mắt',
    },
  });

  // 8. Reorder Proposals (AI Generated Mock)
  await prisma.reorderProposal.create({
    data: {
      productId: prod1.id,
      suggestedQuantity: 35,
      reason: 'AI Forecast: Nhu cầu tiêu thụ dự kiến tăng 30% trong 2 tuần tới. Tồn kho hiện tại (8) đã thủng ngưỡng an toàn (15).',
      confidenceScore: 0.94,
      status: 'DRAFT',
    },
  });

  await prisma.reorderProposal.create({
    data: {
      productId: prod3.id,
      suggestedQuantity: 25,
      reason: 'AI Forecast: Tồn kho nguy cấp (5/12). Lịch hẹn Spa cuối tuần tăng cao dẫn tới nguy cơ hết hàng trong 3 ngày.',
      confidenceScore: 0.96,
      status: 'DRAFT',
    },
  });

  console.log('✅ Reorder Proposals (AI) seeded');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
