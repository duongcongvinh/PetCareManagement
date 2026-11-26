const { PrismaClient } = require('@prisma/client');
const { DEFAULT_SERVICES } = require('../src/config/defaultServices');
const { ensureDefaultOperationalData } = require('../src/config/defaultOperationalData');
const { ensureDefaultReviews } = require('../src/services/reviewService');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // Dọn dẹp dữ liệu cũ (giữ nguyên User để không mất tài khoản tự tạo)
  await prisma.reorderProposal.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.serviceCatalog.deleteMany();
  await prisma.pet.deleteMany();

  // 1. Services (24 dịch vụ thuộc 3 chuyên mục chuẩn từ defaultServices.js)
  const createdServices = [];
  for (const item of DEFAULT_SERVICES) {
    const { legacyNames, ...serviceData } = item;
    const created = await prisma.serviceCatalog.create({ data: serviceData });
    createdServices.push(created);
  }
  console.log(`✅ Services seeded (${createdServices.length} services across 3 categories)`);

  // 2. Users, Suppliers, Products & Pets (đồng bộ tập dữ liệu vận hành mở rộng)
  const opRes = await ensureDefaultOperationalData(prisma);
  console.log(`✅ Operational data seeded (${opRes.usersTotal} users, ${opRes.suppliersTotal} suppliers, ${opRes.productsAdded} products)`);

  // 3. Appointments đa trạng thái (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
  const customer1 = await prisma.user.findUnique({ where: { email: 'khachhang@gmail.com' } });
  const customer2 = await prisma.user.findUnique({ where: { email: 'khachhang2@gmail.com' } });
  const careStaff = await prisma.user.findUnique({ where: { email: 'care@petcare.com' } });
  const allPets = await prisma.pet.findMany();
  const findPet = (name) => allPets.find((p) => p.name === name) || allPets[0];

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  if (customer1 && careStaff && allPets.length > 0 && createdServices.length >= 16) {
    await prisma.appointment.createMany({
      data: [
        {
          petId: findPet('LuLu').id,
          customerId: customer1.id,
          staffId: careStaff.id,
          serviceId: createdServices[0].id,
          appointmentDate: today,
          timeSlot: '09:00 - 10:00',
          status: 'IN_PROGRESS',
          totalPrice: createdServices[0].price,
          notes: 'Bé hơi nhát, nhờ cắt ngắn bớt lông quanh mắt',
        },
        {
          petId: findPet('Miu Miu').id,
          customerId: customer1.id,
          serviceId: createdServices[8].id,
          appointmentDate: tomorrow,
          timeSlot: '14:00 - 15:00',
          status: 'PENDING',
          totalPrice: createdServices[8].price,
          notes: 'Tiêm nhắc lại vắc xin định kỳ hằng năm',
        },
        {
          petId: findPet('Kem').id,
          customerId: customer1.id,
          staffId: careStaff.id,
          serviceId: createdServices[6].id,
          appointmentDate: yesterday,
          timeSlot: '10:00 - 11:00',
          status: 'COMPLETED',
          totalPrice: createdServices[6].price,
          notes: 'Bé Corgi rụng lông nhiều mùa nóng',
          careSummary: 'Đã tắm sục Ozone Nano, chải bỏ lông chết và dưỡng ẩm da. Bé ngoan, lông mượt.',
        },
        {
          petId: findPet('Bé Bông').id,
          customerId: (customer2 || customer1).id,
          staffId: careStaff.id,
          serviceId: createdServices[14].id,
          appointmentDate: yesterday,
          timeSlot: '15:00 - 16:00',
          status: 'COMPLETED',
          totalPrice: createdServices[14].price,
          notes: 'Khám sức khỏe tổng quát định kỳ 6 tháng',
          careSummary: 'Nhịp tim, phổi và siêu âm ổ bụng hoàn toàn bình thường. Cân nặng đạt chuẩn.',
        },
      ],
    });
  }
  console.log('✅ Appointments seeded');

  // 4. Reorder Proposals (AI Generated)
  const lowStockProducts = await prisma.product.findMany({
    where: { sku: { in: ['RC-MINI-2KG', 'SOS-SHAMPOO-530', 'RC-INDOOR27-2KG', 'NEXGARD-SPECTRA-M'] } },
  });
  for (const prod of lowStockProducts) {
    await prisma.reorderProposal.create({
      data: {
        productId: prod.id,
        suggestedQuantity: Math.max(20, prod.maxStockLevel - prod.currentStock),
        reason: `AI Forecast: Tồn kho hiện tại (${prod.currentStock}) đã thủng ngưỡng an toàn (${prod.minStockLevel}). Đề xuất nhập bổ sung ngay.`,
        confidenceScore: 0.94,
        status: 'DRAFT',
      },
    });
  }
  console.log(`✅ Reorder Proposals (AI) seeded (${lowStockProducts.length} drafts)`);

  // 5. Reviews (12 đánh giá khách hàng)
  const revRes = await ensureDefaultReviews(prisma);
  console.log(`✅ Reviews seeded (+${revRes.seededCount} reviews)`);
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
