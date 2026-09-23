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
