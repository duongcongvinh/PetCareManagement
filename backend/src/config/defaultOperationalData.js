const bcrypt = require('bcryptjs');

// Dữ liệu vận hành chuẩn (idempotent) cho cả local & production MongoDB (không bao giờ ghi đè tài khoản/dữ liệu user đã tạo)

const DEFAULT_USERS = [
  { email: 'admin@petcare.com', fullName: 'Nguyễn Văn Admin', phone: '0901234567', address: 'Số 12 Nguyễn Văn Bảo, P. Hạnh Thông, TP.HCM', role: 'ADMIN' },
  { email: 'care@petcare.com', fullName: 'Trần Thị Chăm Sóc', phone: '0912345678', address: 'Quận Gò Vấp, TP.HCM', role: 'CARE_STAFF' },
  { email: 'bs.minh@petcare.com', fullName: 'BS. Nguyễn Minh Quân', phone: '0918223344', address: 'Quận Phú Nhuận, TP.HCM', role: 'CARE_STAFF' },
  { email: 'groomer.linh@petcare.com', fullName: 'Phạm Thùy Linh (Master Groomer)', phone: '0919556677', address: 'Quận Bình Thạnh, TP.HCM', role: 'CARE_STAFF' },
  { email: 'warehouse@petcare.com', fullName: 'Lê Văn Kho', phone: '0923456789', address: 'Quận Tân Bình, TP.HCM', role: 'WAREHOUSE_STAFF' },
  { email: 'kho.tuan@petcare.com', fullName: 'Đỗ Anh Tuấn (Thủ Kho)', phone: '0928776655', address: 'TP. Thủ Đức, TP.HCM', role: 'WAREHOUSE_STAFF' },
  { email: 'khachhang@gmail.com', fullName: 'Phạm Minh Anh', phone: '0934567890', address: '125 Phan Văn Trị, P. 7, Gò Vấp, TP.HCM', role: 'CUSTOMER' },
  { email: 'khachhang2@gmail.com', fullName: 'Hoàng Thị Yến', phone: '0945678901', address: '48 Nguyễn Kiệm, Phú Nhuận, TP.HCM', role: 'CUSTOMER' },
  { email: 'nguyenvannam@gmail.com', fullName: 'Nguyễn Văn Nam', phone: '0978112233', address: '210 Lê Văn Sỹ, Quận 3, TP.HCM', role: 'CUSTOMER' },
  { email: 'tranmyhanh@gmail.com', fullName: 'Trần Mỹ Hạnh', phone: '0965443322', address: '88 Điện Biên Phủ, Bình Thạnh, TP.HCM', role: 'CUSTOMER' },
];

const DEFAULT_SUPPLIERS = [
  { name: 'Công ty TNHH Thức Ăn Thú Cưng Royal Canin', contactPerson: 'Đặng Quốc Huy', phone: '02838990011', email: 'contact@royalcanin.vn', address: 'KCN Tân Bình, TP.HCM' },
  { name: 'Nhà Phân Phối Dụng Cụ & Mỹ Phẩm Thú Y VetCare', contactPerson: 'Vũ Thị Hồng', phone: '02837778899', email: 'sales@vetcare.com', address: 'Quận 7, TP.HCM' },
  { name: 'PetFoods Asia — Phân Phối ANF & Orijen Chính Hãng', contactPerson: 'Lý Thành Đạt', phone: '02836661122', email: 'b2b@petfoodsasia.vn', address: 'Quận 1, TP.HCM' },
  { name: 'Phụ Kiện Thông Minh Petkit & Touchdog Việt Nam', contactPerson: 'Nguyễn Thảo Vy', phone: '02835554433', email: 'partner@petkitvn.com', address: 'TP. Thủ Đức, TP.HCM' },
  { name: 'Dược Thú Y & Dinh Dưỡng Dr. Kyan — Bio-Pharm', contactPerson: 'BS. Trần Hoàng Phúc', phone: '02834449988', email: 'supply@drkyan.vn', address: 'Quận 10, TP.HCM' },
  { name: 'Kho Cát Vệ Sinh Hữu Cơ Tofu & Cat\'s Best Miền Nam', contactPerson: 'Phan Minh Trí', phone: '02839997766', email: 'order@cattofu.vn', address: 'Quận 12, TP.HCM' },
];

const DEFAULT_PRODUCTS = [
  // 12 Sản phẩm VPet's + 32 Sản phẩm cốt lõi + 16 mở rộng + 52 phủ đều 7 nhóm = 112 sản phẩm đồng bộ 1-1 với Frontend
  // --- Nhóm 0: Sản phẩm VPet's ---
  { name: 'Thức ăn cho chó trưởng thành Mini Adult | Royal Canin (2kg) + TẶNG 1 Pate', category: 'Thức ăn', sku: 'VP-RC-MINI-2KG', unitPrice: 322000, costPrice: 245000, currentStock: 32, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 0 },
  { name: 'Thức ăn cho mèo con Kitten | Royal Canin (2kg) + TẶNG 2 Pate', category: 'Thức ăn', sku: 'VP-RC-KITTEN-2KG', unitPrice: 408000, costPrice: 315000, currentStock: 26, minStockLevel: 10, maxStockLevel: 70, supplierIdx: 0 },
  { name: 'Thức ăn cho mèo trưởng thành 6 Free Natural (2kg) + TẶNG 1 Pate', category: 'Thức ăn', sku: 'VP-6FREE-CAT-2KG', unitPrice: 540000, costPrice: 410000, currentStock: 18, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 2 },
  { name: 'Sữa bột cho chó Predogen (lon 400g) + TẶNG 1 Xúc xích', category: 'Dinh dưỡng', sku: 'VP-PREDOGEN-400G', unitPrice: 195000, costPrice: 140000, currentStock: 28, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Sữa bột cho mèo Precaten (lon 400g) + TẶNG 1 Pate mèo con', category: 'Dinh dưỡng', sku: 'VP-PRECATEN-400G', unitPrice: 195000, costPrice: 140000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Giường ngủ cho thú cưng | Touchdog', category: 'Phụ kiện', sku: 'VP-TOUCHDOG-BED', unitPrice: 661000, costPrice: 480000, currentStock: 12, minStockLevel: 6, maxStockLevel: 35, supplierIdx: 3 },
  { name: 'Lồng vận chuyển hàng không cho chó mèo A1103 Pian Pian (Size L)', category: 'Phụ kiện', sku: 'VP-PIANPIAN-A1103-L', unitPrice: 411000, costPrice: 295000, currentStock: 15, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 3 },
  { name: 'Lược chải lông cho thú cưng có nút bấm', category: 'Mỹ phẩm Spa', sku: 'VP-BRUSH-BTN', unitPrice: 380000, costPrice: 265000, currentStock: 20, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 1 },
  { name: 'Dây dắt tự động dây tròn XS New Comfort', category: 'Phụ kiện', sku: 'VP-FLEXI-XS-COMFORT', unitPrice: 380000, costPrice: 270000, currentStock: 22, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 3 },
  { name: 'Yếm ren đeo cổ cao cấp cho thú cưng (Màu hồng)', category: 'Phụ kiện', sku: 'VP-LACE-COLLAR-PINK', unitPrice: 90000, costPrice: 55000, currentStock: 35, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 3 },
  { name: 'Đồ chơi chuột chút chít cho thú cưng', category: 'Phụ kiện', sku: 'VP-SQUEAKY-MOUSE', unitPrice: 25000, costPrice: 12000, currentStock: 80, minStockLevel: 25, maxStockLevel: 200, supplierIdx: 3 },
  { name: 'Dung dịch hướng dẫn đi vệ sinh Good Puppy Forcan (80ml)', category: 'Mỹ phẩm Spa', sku: 'VP-FORCAN-PUPPY-80ML', unitPrice: 143000, costPrice: 95000, currentStock: 29, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 1 },

  // --- Nhóm 1: Thức ăn (18 tổng) ---
  { name: 'Hạt Royal Canin Mini Adult Cho Chó Nhỏ (2kg)', category: 'Thức ăn', sku: 'RC-MINI-2KG', unitPrice: 320000, costPrice: 240000, currentStock: 8, minStockLevel: 15, maxStockLevel: 80, supplierIdx: 0 },
  { name: 'Pate Mèo Whiskas Vị Cá Biển & Cá Hồi (85g)', category: 'Thức ăn', sku: 'PATE-WHIS-85G', unitPrice: 22000, costPrice: 15000, currentStock: 85, minStockLevel: 25, maxStockLevel: 200, supplierIdx: 0 },
  { name: 'Hạt Thức Ăn Mèo Me-O Vị Cá Ngừ Đại Dương (1.2kg)', category: 'Thức ăn', sku: 'MEO-TUNA-1.2KG', unitPrice: 95000, costPrice: 65000, currentStock: 42, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 0 },
  { name: 'Pate Cho Chó Con Pedigree Vị Thịt Bò Sốt Đậm Đà (130g)', category: 'Thức ăn', sku: 'PEDIGREE-BEEF-130G', unitPrice: 28000, costPrice: 18000, currentStock: 64, minStockLevel: 20, maxStockLevel: 150, supplierIdx: 0 },
  { name: 'Hạt Dinh Dưỡng Cao Cấp Orijen Six Fish Không Độn Ngũ Cốc (1.8kg)', category: 'Thức ăn', sku: 'ORIJEN-6FISH-1.8KG', unitPrice: 680000, costPrice: 510000, currentStock: 16, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 2 },
  { name: 'Hạt Mèo Hỗ Trợ Đào Thải Búi Lông Royal Canin Hairball Care (2kg)', category: 'Thức ăn', sku: 'RC-HAIRBALL-2KG', unitPrice: 385000, costPrice: 290000, currentStock: 22, minStockLevel: 12, maxStockLevel: 60, supplierIdx: 0 },
  { name: 'Hạt Chó Poodle Con Dưới 10 Tháng Royal Canin Poodle Puppy (1.5kg)', category: 'Thức ăn', sku: 'RC-POODLE-PUPPY-1.5', unitPrice: 295000, costPrice: 220000, currentStock: 35, minStockLevel: 15, maxStockLevel: 70, supplierIdx: 0 },
  { name: 'Hạt Thức Ăn Chó Con SmartHeart Puppy Vị Bò & Sữa (3kg)', category: 'Thức ăn', sku: 'SH-PUPPY-3KG', unitPrice: 215000, costPrice: 155000, currentStock: 34, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 2 },
  { name: 'Thức Ăn Hạt Cho Mèo Trong Nhà Royal Canin Indoor 27 (2kg)', category: 'Thức ăn', sku: 'RC-INDOOR27-2KG', unitPrice: 435000, costPrice: 335000, currentStock: 7, minStockLevel: 12, maxStockLevel: 60, supplierIdx: 0 },
  { name: 'Pate Lon Cao Cấp Monge Grill Cho Chó Vị Gà Tây & Rau Củ (400g)', category: 'Thức ăn', sku: 'MONGE-TURKEY-400G', unitPrice: 68000, costPrice: 44000, currentStock: 56, minStockLevel: 20, maxStockLevel: 120, supplierIdx: 2 },
  { name: 'Hạt Thức Ăn Chó Giống Trung Bình Royal Canin Medium Adult (4kg)', category: 'Thức ăn', sku: 'RC-MEDIUM-4KG', unitPrice: 585000, costPrice: 450000, currentStock: 18, minStockLevel: 8, maxStockLevel: 50, supplierIdx: 0 },
  { name: 'Hạt Hữu Cơ Cho Chó ANF 6 Free Vị Thịt Vịt & Khoai Lang (2kg)', category: 'Thức ăn', sku: 'ANF-6FREE-DUCK-2KG', unitPrice: 420000, costPrice: 315000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 2 },
  { name: 'Pate Mèo Cao Cấp Snappy Tom Vị Cá Ngừ & Tôm Biển (Lon 400g)', category: 'Thức ăn', sku: 'SNAPPY-TUNA-400G', unitPrice: 38000, costPrice: 24000, currentStock: 72, minStockLevel: 25, maxStockLevel: 180, supplierIdx: 2 },
  { name: 'Hạt Mềm Cho Chó Nhỏ Zenith Vị Thịt Cừu & Gạo Lứt (1.2kg)', category: 'Thức ăn', sku: 'ZENITH-LAMB-1.2KG', unitPrice: 245000, costPrice: 178000, currentStock: 9, minStockLevel: 12, maxStockLevel: 60, supplierIdx: 2 },
  { name: 'Pate Sốt Thịt Cho Mèo Wanpy Creamy Vị Cá Hồi & Gà (Túi 80g)', category: 'Thức ăn', sku: 'WANPY-SALMON-80G', unitPrice: 24000, costPrice: 15000, currentStock: 95, minStockLevel: 30, maxStockLevel: 220, supplierIdx: 2 },

  // --- Nhóm 2: Bánh thưởng (15 tổng) ---
  { name: 'Xương Gặm Sạch Răng & Bổ Sung Canxi Orgo Cho Cún (Gói 90g)', category: 'Bánh thưởng', sku: 'ORGO-BONE-90G', unitPrice: 45000, costPrice: 28000, currentStock: 55, minStockLevel: 20, maxStockLevel: 120, supplierIdx: 2 },
  { name: 'Bánh Thưởng Ức Gà Sấy Khô Freeze-Dried Nguyên Chất Petzera (100g)', category: 'Bánh thưởng', sku: 'FREEZE-CHICKEN-100G', unitPrice: 85000, costPrice: 52000, currentStock: 48, minStockLevel: 15, maxStockLevel: 100, supplierIdx: 2 },
  { name: 'Thanh Thịt Bò Jerky Dạng Que Mềm Cho Chó (Gói 12 que)', category: 'Bánh thưởng', sku: 'BEEF-JERKY-12P', unitPrice: 65000, costPrice: 40000, currentStock: 38, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 2 },
  { name: 'Súp Thưởng Cho Mèo Ciao Churu Vị Gà & Sò Điệp (Gói 4 tuýp)', category: 'Bánh thưởng', sku: 'CIAO-CHURU-4P', unitPrice: 42000, costPrice: 26000, currentStock: 90, minStockLevel: 30, maxStockLevel: 250, supplierIdx: 2 },
  { name: 'Bánh Quy Sữa Dê Giòn Tan Bổ Sung Men Tiêu Hóa (Hũ 200g)', category: 'Bánh thưởng', sku: 'GOAT-MILK-BISCUIT-200', unitPrice: 58000, costPrice: 35000, currentStock: 30, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 2 },
  { name: 'Súp Thưởng Mèo Inaba Ciao Vị Gà & Sò Điệp (Túi 20 thanh)', category: 'Bánh thưởng', sku: 'CIAO-SCALLOP-20P', unitPrice: 175000, costPrice: 122000, currentStock: 9, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 2 },
  { name: 'Bánh Thưởng Sạch Răng Orgo Vị Bạc Hà Cho Chó (Gói 90g)', category: 'Bánh thưởng', sku: 'ORGO-MINT-90G', unitPrice: 55000, costPrice: 34000, currentStock: 48, minStockLevel: 18, maxStockLevel: 100, supplierIdx: 2 },
  { name: 'Que Gặm Sạch Răng Pedigree Dentastix Cho Chó Nhỏ (Gói 7 thanh)', category: 'Bánh thưởng', sku: 'PEDIGREE-DENTA-7P', unitPrice: 62000, costPrice: 41000, currentStock: 46, minStockLevel: 15, maxStockLevel: 110, supplierIdx: 0 },
  { name: 'Súp Thưởng Cho Mèo Wanpy Mix 5 Vị Hải Sản & Thịt Gà (Hộp 25 thanh)', category: 'Bánh thưởng', sku: 'WANPY-SOUP-25P', unitPrice: 145000, costPrice: 98000, currentStock: 34, minStockLevel: 14, maxStockLevel: 85, supplierIdx: 2 },
  { name: 'Xúc Xích Thịt Gà Phô Mai Thưởng Huấn Luyện Chó Mèo (Gói 15 cây)', category: 'Bánh thưởng', sku: 'PET-SAUSAGE-15P', unitPrice: 48000, costPrice: 29000, currentStock: 68, minStockLevel: 20, maxStockLevel: 150, supplierIdx: 2 },
  { name: 'Phô Mai Sấy Khô Freeze-Dried Nguyên Chất Cho Chó Mèo (Hũ 100g)', category: 'Bánh thưởng', sku: 'FREEZE-CHEESE-100G', unitPrice: 92000, costPrice: 58000, currentStock: 29, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 2 },
  { name: 'Cá Hồi Sấy Lạnh Nguyên Miếng Giàu Omega-3 Cho Mèo & Cún (Gói 80g)', category: 'Bánh thưởng', sku: 'FREEZE-SALMON-80G', unitPrice: 118000, costPrice: 78000, currentStock: 8, minStockLevel: 12, maxStockLevel: 65, supplierIdx: 2 },
  { name: 'Bánh Quy Giòn Vị Cá Ngừ & Cỏ Mèo Catnip Cho Mèo (Hũ 120g)', category: 'Bánh thưởng', sku: 'CATNIP-BISCUIT-120G', unitPrice: 54000, costPrice: 33000, currentStock: 41, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 2 },
  { name: 'Thanh Thịt Vịt Sấy Mềm JerHigh Duck Stick Cho Chó (Gói 70g)', category: 'Bánh thưởng', sku: 'JERHIGH-DUCK-70G', unitPrice: 52000, costPrice: 34000, currentStock: 53, minStockLevel: 18, maxStockLevel: 110, supplierIdx: 2 },
  { name: 'Bánh Thưởng Huấn Luyện Bowwow Vị Cá Hồi & Bạc Hà (Gói 100g)', category: 'Bánh thưởng', sku: 'BOWWOW-SALMON-100G', unitPrice: 68000, costPrice: 44000, currentStock: 37, minStockLevel: 14, maxStockLevel: 85, supplierIdx: 2 },

  // --- Nhóm 3: Cát vệ sinh (15 tổng) ---
  { name: 'Cát Vệ Sinh Mèo Đậu Nành Tofu Tự Nhiên Khử Mùi 6L', category: 'Cát vệ sinh', sku: 'CAT-TOFU-6L', unitPrice: 110000, costPrice: 75000, currentStock: 52, minStockLevel: 20, maxStockLevel: 120, supplierIdx: 5 },
  { name: 'Cát Đất Sét Bentonite Tự Nhiên Hương Cà Phê Siêu Vón Cục 8L', category: 'Cát vệ sinh', sku: 'BENTONITE-COFFEE-8L', unitPrice: 85000, costPrice: 52000, currentStock: 65, minStockLevel: 25, maxStockLevel: 150, supplierIdx: 5 },
  { name: 'Cát Gỗ Sinh Học Hữu Cơ Khử Mùi Cat\'s Best Original 5L (Nhập Đức)', category: 'Cát vệ sinh', sku: 'CATS-BEST-5L', unitPrice: 195000, costPrice: 140000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 5 },
  { name: 'Cát Đậu Nành Mèo Cature Tofu Khử Mùi Trà Xanh (6L)', category: 'Cát vệ sinh', sku: 'CATURE-TOFU-GREEN-6L', unitPrice: 135000, costPrice: 92000, currentStock: 42, minStockLevel: 18, maxStockLevel: 100, supplierIdx: 5 },
  { name: 'Cát Khoáng Đất Sét Kit Cat Classic Hương Phấn Em Bé (10L)', category: 'Cát vệ sinh', sku: 'KITCAT-CLAY-10L', unitPrice: 145000, costPrice: 98000, currentStock: 30, minStockLevel: 14, maxStockLevel: 80, supplierIdx: 5 },
  { name: 'Cát Đậu Nành Mèo Tofu Hương Đào Tự Nhiên Xả Bồn Cầu (6L)', category: 'Cát vệ sinh', sku: 'TOFU-PEACH-6L', unitPrice: 115000, costPrice: 78000, currentStock: 48, minStockLevel: 18, maxStockLevel: 120, supplierIdx: 5 },
  { name: 'Cát Đậu Nành Mèo Tofu Than Hoạt Tính Khử Mùi Cực Mạnh (6L)', category: 'Cát vệ sinh', sku: 'TOFU-CHARCOAL-6L', unitPrice: 125000, costPrice: 84000, currentStock: 10, minStockLevel: 16, maxStockLevel: 100, supplierIdx: 5 },
  { name: 'Cát Đậu Nành Mèo Tofu Hương Sữa Bắp Dịu Nhẹ Không Bụi (6L)', category: 'Cát vệ sinh', sku: 'TOFU-CORNMILK-6L', unitPrice: 118000, costPrice: 79000, currentStock: 39, minStockLevel: 15, maxStockLevel: 100, supplierIdx: 5 },
  { name: 'Cát Đậu Nành Mèo Tofu Hương Hoa Oải Hương Thư Giãn (6L)', category: 'Cát vệ sinh', sku: 'TOFU-LAVENDER-6L', unitPrice: 120000, costPrice: 80000, currentStock: 33, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 5 },
  { name: 'Cát Đất Sét Vệ Sinh Mèo Me-O Hương Chanh Tươi Kháng Khuẩn (5L)', category: 'Cát vệ sinh', sku: 'MEO-CLAY-LEMON-5L', unitPrice: 88000, costPrice: 56000, currentStock: 58, minStockLevel: 20, maxStockLevel: 140, supplierIdx: 5 },
  { name: 'Cát Đất Sét Vệ Sinh Mèo Lapaw Hương Táo Xanh Vón Cục Nhanh (8L)', category: 'Cát vệ sinh', sku: 'LAPAW-APPLE-8L', unitPrice: 98000, costPrice: 64000, currentStock: 44, minStockLevel: 18, maxStockLevel: 110, supplierIdx: 5 },
  { name: 'Cát Thủy Tinh Silica Tinh Thể Siêu Hút Ẩm & Khử Mùi 30 Ngày (3.8L)', category: 'Cát vệ sinh', sku: 'SILICA-CRYSTAL-3.8L', unitPrice: 165000, costPrice: 112000, currentStock: 26, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 5 },
  { name: 'Cát Mix Đậu Nành & Đất Sét Bentonite 70/30 Siêu Khô Thoáng (6L)', category: 'Cát vệ sinh', sku: 'MIX-TOFU-CLAY-6L', unitPrice: 132000, costPrice: 89000, currentStock: 36, minStockLevel: 15, maxStockLevel: 95, supplierIdx: 5 },
  { name: 'Cát Gỗ Thông Nén Tự Nhiên An Toàn Cho Mèo Con & Mèo Nhạy Cảm (10L)', category: 'Cát vệ sinh', sku: 'PINE-WOOD-10L', unitPrice: 155000, costPrice: 105000, currentStock: 28, minStockLevel: 12, maxStockLevel: 75, supplierIdx: 5 },
  { name: 'Cát Khoáng Nhật Bản Siêu Ít Bụi Khóa Mùi Amoniac Tức Thì (8L)', category: 'Cát vệ sinh', sku: 'JAPAN-MINERAL-8L', unitPrice: 175000, costPrice: 122000, currentStock: 9, minStockLevel: 14, maxStockLevel: 70, supplierIdx: 5 },

  // --- Nhóm 4: Phụ kiện (18 tổng — gồm 5 VPet's phía trên) ---
  { name: 'Chuồng Nệm Lưu Trú & Giường Ấm Thú Cưng Bọc Lông Nhung', category: 'Phụ kiện', sku: 'PET-BED-HOTEL', unitPrice: 350000, costPrice: 220000, currentStock: 18, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 3 },
  { name: 'Trụ Cào Móng Dây Thừng Sisal Tự Nhiên Có Quả Chuông Cho Mèo', category: 'Phụ kiện', sku: 'SCRATCHING-POST-BELL', unitPrice: 190000, costPrice: 120000, currentStock: 25, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 3 },
  { name: 'Balo Phi Hành Gia Trong Suốt Thông Khí Vận Chuyển Thú Cưng', category: 'Phụ kiện', sku: 'ASTRONAUT-BAG-CLEAR', unitPrice: 290000, costPrice: 185000, currentStock: 15, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 3 },
  { name: 'Khay Vệ Sinh Mèo Thành Cao Chống Văng Kèm Xẻng Xúc Tiện Lợi', category: 'Phụ kiện', sku: 'LITTER-BOX-HIGH', unitPrice: 165000, costPrice: 105000, currentStock: 20, minStockLevel: 10, maxStockLevel: 45, supplierIdx: 3 },
  { name: 'Dây Dắt Kèm Áo Yếm Ngực Phản Quang Chống Giật (Size M)', category: 'Phụ kiện', sku: 'HARNESS-REFLECT-M', unitPrice: 120000, costPrice: 75000, currentStock: 32, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 3 },
  { name: 'Bát Ăn Đôi Inox Chống Trượt Đế Silicon Hình Tai Mèo Đáng Yêu', category: 'Phụ kiện', sku: 'BOWL-DOUBLE-INOX', unitPrice: 85000, costPrice: 50000, currentStock: 40, minStockLevel: 15, maxStockLevel: 80, supplierIdx: 3 },
  { name: 'Cần Câu Mèo Gắn Lông Vũ & Chuông Lắc Vận Động Dẻo Dai', category: 'Phụ kiện', sku: 'CAT-TOY-FEATHER', unitPrice: 35000, costPrice: 18000, currentStock: 75, minStockLevel: 25, maxStockLevel: 150, supplierIdx: 3 },
  { name: 'Máy Lọc Nước Tự Động Tuần Hoàn Cho Chó Mèo Petkit Eversweet (2L)', category: 'Phụ kiện', sku: 'PETKIT-WATER-2L', unitPrice: 590000, costPrice: 430000, currentStock: 4, minStockLevel: 8, maxStockLevel: 25, supplierIdx: 3 },
  { name: 'Máy Cho Ăn Tự Động Hẹn Giờ Thông Minh Wifi (4L)', category: 'Phụ kiện', sku: 'SMART-FEEDER-4L', unitPrice: 890000, costPrice: 660000, currentStock: 9, minStockLevel: 5, maxStockLevel: 25, supplierIdx: 3 },
  { name: 'Áo Hoodie Nỉ Ấm Mùa Đông Cho Chó Mèo (Size S/M)', category: 'Phụ kiện', sku: 'PET-HOODIE-SM', unitPrice: 135000, costPrice: 82000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 3 },
  { name: 'Đệm Gel Làm Mát Tự Động Giải Nhiệt Mùa Hè Cho Chó Mèo (Size L)', category: 'Phụ kiện', sku: 'COOLING-MAT-L', unitPrice: 215000, costPrice: 140000, currentStock: 24, minStockLevel: 10, maxStockLevel: 55, supplierIdx: 3 },
  { name: 'Vòng Cổ Dệt Dù Kèm Chuông & Thẻ Tên Khắc Laser Chống Lạc', category: 'Phụ kiện', sku: 'COLLAR-LASER-TAG', unitPrice: 75000, costPrice: 42000, currentStock: 48, minStockLevel: 18, maxStockLevel: 110, supplierIdx: 3 },
  { name: 'Nhà Cây Cat Tree 3 Tầng Có Trụ Cào Móng & Hang Ngủ Cho Mèo', category: 'Phụ kiện', sku: 'CATTREE-3TIER', unitPrice: 780000, costPrice: 550000, currentStock: 7, minStockLevel: 5, maxStockLevel: 20, supplierIdx: 3 },

  // --- Nhóm 5: Mỹ phẩm Spa (15 tổng — gồm 2 VPet's phía trên) ---
  { name: 'Sữa Tắm Dưỡng Lông SOS Mềm Mượt & Lưu Hương Cho Chó Mèo 530ml', category: 'Mỹ phẩm Spa', sku: 'SOS-SHAMPOO-530', unitPrice: 150000, costPrice: 95000, currentStock: 5, minStockLevel: 12, maxStockLevel: 60, supplierIdx: 1 },
  { name: 'Sữa Tắm Khử Mùi & Trị Viêm Nấm Da Davis Benzoyl Peroxide 355ml', category: 'Mỹ phẩm Spa', sku: 'DAVIS-BENZOYL-355', unitPrice: 280000, costPrice: 190000, currentStock: 14, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 1 },
  { name: 'Xịt Khử Mùi Hôi Chuồng Trại & Kháng Khuẩn Không Khí Bioline 500ml', category: 'Mỹ phẩm Spa', sku: 'BIOLINE-DEODOR-500', unitPrice: 115000, costPrice: 72000, currentStock: 28, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 1 },
  { name: 'Lược Chải Lông Tự Động Đẩy Lông Rụng Bằng Nút Bấm Thông Minh', category: 'Mỹ phẩm Spa', sku: 'BRUSH-AUTO-BUTTON', unitPrice: 95000, costPrice: 58000, currentStock: 35, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 1 },
  { name: 'Dung Dịch Vệ Sinh Tai Kháng Khuẩn Virbac Epi-Otic (125ml)', category: 'Mỹ phẩm Spa', sku: 'VIRBAC-EPIOTIC-125', unitPrice: 245000, costPrice: 172000, currentStock: 22, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 1 },
  { name: 'Nước Hoa Dưỡng Lông Hương Phấn Hoa Dịu Nhẹ Forcans (150ml)', category: 'Mỹ phẩm Spa', sku: 'FORCANS-PERFUME-150', unitPrice: 165000, costPrice: 112000, currentStock: 31, minStockLevel: 12, maxStockLevel: 60, supplierIdx: 1 },
  { name: 'Sữa Tắm Thảo Mộc Kháng Khuẩn & Đuổi Ve Rận Joyce & Dolls (400ml)', category: 'Mỹ phẩm Spa', sku: 'JOYCE-HERBAL-400', unitPrice: 225000, costPrice: 155000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 1 },
  { name: 'Sữa Tắm Dưỡng Trắng & Mềm Lông Yu Hương Hoa Anh Đào Đài Loan (400ml)', category: 'Mỹ phẩm Spa', sku: 'YU-CHERRY-400', unitPrice: 340000, costPrice: 245000, currentStock: 8, minStockLevel: 10, maxStockLevel: 45, supplierIdx: 1 },
  { name: 'Phấn Tắm Khô Làm Sạch Nhanh Không Cần Nước Bioline Cho Mèo (200g)', category: 'Mỹ phẩm Spa', sku: 'BIOLINE-DRYPOWDER-200', unitPrice: 135000, costPrice: 88000, currentStock: 34, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 1 },
  { name: 'Bộ Kìm Bấm Móng Thép Không Gỉ Có Khóa An Toàn Kèm Dũa Móng', category: 'Mỹ phẩm Spa', sku: 'NAIL-CLIPPER-SET', unitPrice: 85000, costPrice: 48000, currentStock: 42, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 1 },
  { name: 'Khăn Tắm Thú Cưng Sợi Microfiber Siêu Thấm Hút (60x100cm)', category: 'Mỹ phẩm Spa', sku: 'MICROFIBER-TOWEL-L', unitPrice: 95000, costPrice: 56000, currentStock: 38, minStockLevel: 14, maxStockLevel: 85, supplierIdx: 1 },
  { name: 'Xịt Dưỡng Gỡ Rối Lông Tinh Dầu Argan & Nha Đam Forcans (300ml)', category: 'Mỹ phẩm Spa', sku: 'FORCANS-DETANGLE-300', unitPrice: 185000, costPrice: 125000, currentStock: 25, minStockLevel: 10, maxStockLevel: 55, supplierIdx: 1 },
  { name: 'Bộ Kem Đánh Răng Bạc Hà Nuốt Được & Bàn Chải Xỏ Ngón Silicon', category: 'Mỹ phẩm Spa', sku: 'DENTAL-KIT-MINT', unitPrice: 110000, costPrice: 68000, currentStock: 32, minStockLevel: 12, maxStockLevel: 75, supplierIdx: 1 },

  // --- Nhóm 6: Dinh dưỡng (15 tổng — gồm 2 VPet's phía trên) ---
  { name: 'Gel Dinh Dưỡng Nourse Nutri-Gel 120g Phục Hồi Thể Lực Nhanh', category: 'Dinh dưỡng', sku: 'NOURSE-GEL-120G', unitPrice: 145000, costPrice: 95000, currentStock: 30, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 4 },
  { name: 'Viên Uống Canxi Nano Bổ Sung Xương Khớp Chắc Khỏe Bio-Calci (100 viên)', category: 'Dinh dưỡng', sku: 'BIO-CALCI-100', unitPrice: 160000, costPrice: 105000, currentStock: 34, minStockLevel: 15, maxStockLevel: 80, supplierIdx: 4 },
  { name: 'Dầu Cá Hồi Tự Nhiên Nguyên Chất Wild Salmon Oil Hỗ Trợ Lông Mượt (250ml)', category: 'Dinh dưỡng', sku: 'SALMON-OIL-250ML', unitPrice: 210000, costPrice: 145000, currentStock: 22, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 4 },
  { name: 'Men Tiêu Hóa Vi Sinh Đường Ruột Hỗ Trợ Hấp Thu Probiotic Pet (Hộp 30 gói)', category: 'Dinh dưỡng', sku: 'PROBIOTIC-PET-30P', unitPrice: 135000, costPrice: 88000, currentStock: 40, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 4 },
  { name: 'Gel Tiêu Búi Lông Cho Mèo GimCat Malt-Soft Extra (50g)', category: 'Dinh dưỡng', sku: 'GIMCAT-MALT-50G', unitPrice: 185000, costPrice: 130000, currentStock: 27, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Viên Nhai Bổ Sung Khớp Glucosamine & Chondroitin Cho Chó Lớn (60 viên)', category: 'Dinh dưỡng', sku: 'JOINT-GLUCOS-60T', unitPrice: 320000, costPrice: 225000, currentStock: 19, minStockLevel: 8, maxStockLevel: 45, supplierIdx: 4 },
  { name: 'Sữa Bột Dinh Dưỡng Esbilac Cho Chó Con Sơ Sinh & Chó Mẹ (Hộp 340g)', category: 'Dinh dưỡng', sku: 'ESBILAC-PUPPY-340G', unitPrice: 465000, costPrice: 350000, currentStock: 16, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 4 },
  { name: 'Sữa Bột Thay Thế Sữa Mẹ KMR Cho Mèo Con Sơ Sinh (Lon 340g)', category: 'Dinh dưỡng', sku: 'KMR-KITTEN-340G', unitPrice: 480000, costPrice: 365000, currentStock: 14, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 4 },
  { name: 'Viên Uống Đẹp Lông Giảm Rụng Lông Biotin & Zinc PetCare (100 viên)', category: 'Dinh dưỡng', sku: 'BIOTIN-ZINC-100T', unitPrice: 175000, costPrice: 118000, currentStock: 36, minStockLevel: 14, maxStockLevel: 80, supplierIdx: 4 },
  { name: 'Gel Dinh Dưỡng Cao Năng Lượng Virbac Nutri-Plus Gel Cho Chó Mèo (120.5g)', category: 'Dinh dưỡng', sku: 'VIRBAC-NUTRIPLUS-120', unitPrice: 245000, costPrice: 175000, currentStock: 8, minStockLevel: 12, maxStockLevel: 55, supplierIdx: 4 },
  { name: 'Men Vi Sinh Tiêu Hóa Bio-Flora Ngừa Tiêu Chảy & Hỗ Trợ Đường Ruột (Hộp 20 gói)', category: 'Dinh dưỡng', sku: 'BIOFLORA-PRO-20P', unitPrice: 120000, costPrice: 76000, currentStock: 45, minStockLevel: 16, maxStockLevel: 95, supplierIdx: 4 },
  { name: 'Viên Uống Bổ Gan Giải Độc & Tăng Cường Miễn Dịch Hepa-Pet (60 viên)', category: 'Dinh dưỡng', sku: 'HEPAPET-LIVER-60T', unitPrice: 230000, costPrice: 158000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Bột Bổ Sung Taurine & L-Lysine Ngừa Cảm Cúm Hô Hấp Cho Mèo (Hũ 120g)', category: 'Dinh dưỡng', sku: 'TAURINE-LYSINE-120G', unitPrice: 195000, costPrice: 132000, currentStock: 29, minStockLevel: 12, maxStockLevel: 65, supplierIdx: 4 },

  // --- Nhóm 7: Y tế (16 tổng) ---
  { name: 'Thuốc Nhỏ Gáy Phòng Trị Ve Rận & Bọ Chét Frontline Plus Cho Mèo/Cún', category: 'Y tế', sku: 'FRONTLINE-PLUS', unitPrice: 180000, costPrice: 120000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Thuốc Xổ Giun Sán Định Kỳ Cho Chó Mèo Drontal Plus (Vỉ 6 viên)', category: 'Y tế', sku: 'DRONTAL-PLUS-6T', unitPrice: 160000, costPrice: 105000, currentStock: 35, minStockLevel: 12, maxStockLevel: 90, supplierIdx: 4 },
  { name: 'Viên Nhai Trị Ve Rận Nội Ngoại Ký Sinh NexGard Spectra (Chó 3.5-7.5kg)', category: 'Y tế', sku: 'NEXGARD-SPECTRA-M', unitPrice: 275000, costPrice: 198000, currentStock: 6, minStockLevel: 12, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Thuốc Nhỏ Mắt Kháng Viêm & Giảm Chảy Nước Mắt Bio-Gentadrop (10ml)', category: 'Y tế', sku: 'BIO-GENTADROP-10ML', unitPrice: 45000, costPrice: 26000, currentStock: 52, minStockLevel: 20, maxStockLevel: 120, supplierIdx: 4 },
  { name: 'Thuốc Nhỏ Gáy Trị Rận Tai, Bọ Chét & Giun Tim Revolution Plus Cho Mèo', category: 'Y tế', sku: 'REVOLUTION-PLUS-CAT', unitPrice: 265000, costPrice: 192000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Viên Nhai Diệt Ve Rận Bảo Vệ 12 Tuần Bravecto Cho Chó (4.5-10kg)', category: 'Y tế', sku: 'BRAVECTO-DOG-M', unitPrice: 540000, costPrice: 410000, currentStock: 6, minStockLevel: 10, maxStockLevel: 40, supplierIdx: 4 },
  { name: 'Xịt Trị Nấm Da, Viêm Da Tiết Bã Miconazole Fungikur Cho Chó Mèo (100ml)', category: 'Y tế', sku: 'FUNGIKUR-SPRAY-100', unitPrice: 165000, costPrice: 112000, currentStock: 31, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 1 },
  { name: 'Kem Bôi Ngoài Da Trị Nấm Kẽ Chân & Hắc Lào Dermacare Pet (Tuýp 20g)', category: 'Y tế', sku: 'DERMACARE-CREAM-20G', unitPrice: 85000, costPrice: 52000, currentStock: 44, minStockLevel: 15, maxStockLevel: 95, supplierIdx: 1 },
  { name: 'Dung Dịch Rửa Mắt Giảm Ố Lông & Kháng Khuẩn Eye-Envy (120ml)', category: 'Y tế', sku: 'EYE-ENVY-120ML', unitPrice: 285000, costPrice: 205000, currentStock: 19, minStockLevel: 8, maxStockLevel: 45, supplierIdx: 1 },
  { name: 'Dung Dịch Sát Khuẩn Vết Thương Không Xót Povidine Pet 10% (100ml)', category: 'Y tế', sku: 'POVIDINE-PET-100ML', unitPrice: 58000, costPrice: 34000, currentStock: 56, minStockLevel: 20, maxStockLevel: 120, supplierIdx: 4 },
  { name: 'Băng Quấn Y Tế Tự Dính Co Giãn Bảo Vệ Vết Thương & Khớp (Cuộn 5cm)', category: 'Y tế', sku: 'VET-WRAP-BANDAGE-5CM', unitPrice: 32000, costPrice: 17000, currentStock: 78, minStockLevel: 25, maxStockLevel: 180, supplierIdx: 1 },
  { name: 'Nhiệt Kế Điện Tử Đầu Mềm Chuyên Dụng Đo Sốt Nhanh Cho Chó Mèo', category: 'Y tế', sku: 'VET-THERMOMETER-PRO', unitPrice: 125000, costPrice: 78000, currentStock: 22, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 1 },
  { name: 'Loa Chống Liếm Vết Thương Elizabeth Nhựa Mềm Viền Nỉ (Size S/M)', category: 'Y tế', sku: 'ELIZABETH-CONE-SM', unitPrice: 65000, costPrice: 36000, currentStock: 40, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 1 },
  { name: 'Bộ Ống Bơm Cho Uống Thuốc & Bú Sữa Đầu Silicon An Toàn (2 đầu thay)', category: 'Y tế', sku: 'PET-PILL-SYRINGE', unitPrice: 42000, costPrice: 22000, currentStock: 64, minStockLevel: 20, maxStockLevel: 140, supplierIdx: 1 },
  { name: 'Que Test Nhanh Virus Parvo & Care (CPV/CDV) Sàng Lọc Tại Nhà (1 test)', category: 'Y tế', sku: 'TEST-CPV-CDV-KIT', unitPrice: 145000, costPrice: 95000, currentStock: 7, minStockLevel: 12, maxStockLevel: 55, supplierIdx: 4 },
  { name: 'Thuốc Tẩy Giun Sán Phổ Rộng Sanpet Cho Chó Mèo Mọi Lứa Tuổi (Vỉ 10 viên)', category: 'Y tế', sku: 'SANPET-DEWORM-10T', unitPrice: 115000, costPrice: 74000, currentStock: 38, minStockLevel: 14, maxStockLevel: 90, supplierIdx: 4 },
  // 28 sản phẩm cân bằng tròn 20 SP/danh mục (7 x 20 = 140 sản phẩm)
  { name: 'Hạt Dinh Dưỡng Cho Chó Trưởng Thành Taste of the Wild Vị Cá Hồi (2kg)', category: 'Thức ăn', sku: 'TOTW-SALMON-2KG', unitPrice: 395000, costPrice: 295000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 2 },
  { name: 'Pate Sốt Kem Cho Mèo Kit Cat Complete Cuisine Vị Gà & Cá Ngừ (Lon 150g)', category: 'Thức ăn', sku: 'KITCAT-PATE-150G', unitPrice: 32000, costPrice: 20000, currentStock: 74, minStockLevel: 25, maxStockLevel: 160, supplierIdx: 2 },
  { name: 'Bánh Thưởng Sạch Răng Cho Chó Greenies Teenie Dental Treats (Gói 170g)', category: 'Bánh thưởng', sku: 'GREENIES-TEENIE-170G', unitPrice: 195000, costPrice: 138000, currentStock: 24, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 2 },
  { name: 'Súp Thưởng Cho Mèo Me-O Creamy Treats Vị Tôm Hùm & Cá Hồi (Gói 4 thanh)', category: 'Bánh thưởng', sku: 'MEO-CREAMY-4P', unitPrice: 36000, costPrice: 22000, currentStock: 88, minStockLevel: 30, maxStockLevel: 200, supplierIdx: 0 },
  { name: 'Gan Bò Sấy Khô Freeze-Dried Bổ Máu Cho Chó Mèo Petzera (Hũ 90g)', category: 'Bánh thưởng', sku: 'FREEZE-LIVER-90G', unitPrice: 98000, costPrice: 62000, currentStock: 34, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 2 },
  { name: 'Thanh Nhai Da Bò Cuộn Thịt Gà Tự Nhiên Goodies Cho Chó (Gói 100g)', category: 'Bánh thưởng', sku: 'GOODIES-CHICK-100G', unitPrice: 56000, costPrice: 35000, currentStock: 52, minStockLevel: 18, maxStockLevel: 110, supplierIdx: 2 },
  { name: 'Bánh Thưởng Hình Cá Nhân Kem Bạc Hà Làm Sạch Răng Mèo Temptations (75g)', category: 'Bánh thưởng', sku: 'TEMPTATIONS-MINT-75G', unitPrice: 64000, costPrice: 41000, currentStock: 45, minStockLevel: 15, maxStockLevel: 100, supplierIdx: 2 },
  { name: 'Cát Đậu Nành Mèo Tofu Hương Cà Phê Khử Mùi Nhanh (6L)', category: 'Cát vệ sinh', sku: 'TOFU-COFFEE-6L', unitPrice: 122000, costPrice: 82000, currentStock: 46, minStockLevel: 18, maxStockLevel: 110, supplierIdx: 5 },
  { name: 'Cát Đậu Nành Mèo Tofu Hương Phấn Em Bé Dịu Nhẹ Không Bụi (6L)', category: 'Cát vệ sinh', sku: 'TOFU-BABY-6L', unitPrice: 118000, costPrice: 79000, currentStock: 40, minStockLevel: 16, maxStockLevel: 100, supplierIdx: 5 },
  { name: 'Cát Đất Sét Bentonite Hương Hoa Hồng Kháng Khuẩn Cho Mèo (8L)', category: 'Cát vệ sinh', sku: 'BENTONITE-ROSE-8L', unitPrice: 89000, costPrice: 55000, currentStock: 60, minStockLevel: 20, maxStockLevel: 140, supplierIdx: 5 },
  { name: 'Cát Hữu Cơ Sắn Dây Cassava Siêu Thấm Hút Không Bết Đáy (6L)', category: 'Cát vệ sinh', sku: 'CASSAVA-LITTER-6L', unitPrice: 148000, costPrice: 99000, currentStock: 32, minStockLevel: 14, maxStockLevel: 85, supplierIdx: 5 },
  { name: 'Cát Khoáng Đất Sét Không Mùi Siêu Khử Khuẩn Cho Mèo Nhạy Cảm (10L)', category: 'Cát vệ sinh', sku: 'UNSCENTED-CLAY-10L', unitPrice: 138000, costPrice: 92000, currentStock: 36, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 5 },
  { name: 'Đồ Chơi Bóng Cao Su Nhồi Bánh Thưởng Thông Minh Kong Classic (Size M)', category: 'Phụ kiện', sku: 'KONG-CLASSIC-M', unitPrice: 245000, costPrice: 168000, currentStock: 28, minStockLevel: 10, maxStockLevel: 65, supplierIdx: 3 },
  { name: 'Thảm Hứng Cát Vệ Sinh 2 Lớp Chống Trượt Tổ Ong Cho Mèo (45x60cm)', category: 'Phụ kiện', sku: 'LITTER-MAT-45X60', unitPrice: 125000, costPrice: 76000, currentStock: 38, minStockLevel: 14, maxStockLevel: 85, supplierIdx: 3 },
  { name: 'Sữa Tắm Dưỡng Lông Mềm Mượt Tinh Dầu Dừa & Yến Mạch TropiClean (355ml)', category: 'Mỹ phẩm Spa', sku: 'TROPICLEAN-OAT-355', unitPrice: 295000, costPrice: 210000, currentStock: 22, minStockLevel: 10, maxStockLevel: 50, supplierIdx: 1 },
  { name: 'Dầu Xả Phục Hồi Lông Xơ Rối & Chống Tĩnh Điện Cho Poodle Forcans (300ml)', category: 'Mỹ phẩm Spa', sku: 'FORCANS-COND-300', unitPrice: 195000, costPrice: 132000, currentStock: 28, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 1 },
  { name: 'Bọt Rửa Chân Sinh Học Kháng Khuẩn Kèm Đầu Cọ Silicon Tự Động (150ml)', category: 'Mỹ phẩm Spa', sku: 'PAW-FOAM-150ML', unitPrice: 118000, costPrice: 74000, currentStock: 42, minStockLevel: 15, maxStockLevel: 90, supplierIdx: 1 },
  { name: 'Kem Dưỡng Ẩm Đệm Chân & Mũi Chống Nứt Nẻ Hữu Cơ Shea Butter (30g)', category: 'Mỹ phẩm Spa', sku: 'PAW-BALM-30G', unitPrice: 125000, costPrice: 78000, currentStock: 35, minStockLevel: 12, maxStockLevel: 75, supplierIdx: 1 },
  { name: 'Găng Tay Cao Su Massage Chải Lông Rụng Êm Ái Cho Chó Mèo', category: 'Mỹ phẩm Spa', sku: 'GROOM-GLOVE-PRO', unitPrice: 68000, costPrice: 38000, currentStock: 56, minStockLevel: 18, maxStockLevel: 120, supplierIdx: 1 },
  { name: 'Sữa Nước Tươi Không Lactose Cho Chó Mèo Pet Own Milk (Hộp 250ml)', category: 'Dinh dưỡng', sku: 'PETOWN-MILK-250ML', unitPrice: 62000, costPrice: 40000, currentStock: 64, minStockLevel: 20, maxStockLevel: 150, supplierIdx: 4 },
  { name: 'Viên Nhai Vitamin Tổng Hợp Tăng Đề Kháng Daily Multi Pet Naturals (60 viên)', category: 'Dinh dưỡng', sku: 'MULTI-VIT-60T', unitPrice: 265000, costPrice: 188000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Bột Canxi Hữu Cơ & Vitamin D3 Hỗ Trợ Xương Răng Cho Chó Mèo Mang Thai (150g)', category: 'Dinh dưỡng', sku: 'CALCI-D3-150G', unitPrice: 185000, costPrice: 125000, currentStock: 30, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 4 },
  { name: 'Gel Dinh Dưỡng Bổ Sung Máu & Sắt Phục Hồi Sau Sinh Ferrovit Pet (60g)', category: 'Dinh dưỡng', sku: 'FERROVIT-GEL-60G', unitPrice: 190000, costPrice: 130000, currentStock: 24, minStockLevel: 10, maxStockLevel: 55, supplierIdx: 4 },
  { name: 'Viên Nhai Hỗ Trợ Đường Tiết Niệu & Ngừa Sỏi Thận Cho Mèo Cranberry Vet (60 viên)', category: 'Dinh dưỡng', sku: 'CRANBERRY-CAT-60T', unitPrice: 285000, costPrice: 202000, currentStock: 20, minStockLevel: 8, maxStockLevel: 50, supplierIdx: 4 },
  { name: 'Thuốc Nhỏ Gáy Phòng Trị Nội Ngoại Ký Sinh Advocate Cho Chó (4-10kg)', category: 'Y tế', sku: 'ADVOCATE-DOG-M', unitPrice: 295000, costPrice: 215000, currentStock: 22, minStockLevel: 10, maxStockLevel: 55, supplierIdx: 4 },
  { name: 'Thuốc Nhỏ Tai Đặc Trị Viêm Tai & Rận Tai Dexoryl Virbac (10g)', category: 'Y tế', sku: 'VIRBAC-DEXORYL-10G', unitPrice: 215000, costPrice: 152000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
  { name: 'Gel Bôi Làm Lành Vết Thương & Chống Nhiễm Trùng Nano Bạc Pet (30g)', category: 'Y tế', sku: 'NANOSILVER-GEL-30G', unitPrice: 95000, costPrice: 58000, currentStock: 44, minStockLevel: 15, maxStockLevel: 95, supplierIdx: 1 },
  { name: 'Bột Điện Giải Oresol Pet Bù Nước & Khoáng Chất Khi Tiêu Chảy (Hộp 10 gói)', category: 'Y tế', sku: 'ORESOL-PET-10P', unitPrice: 75000, costPrice: 44000, currentStock: 58, minStockLevel: 20, maxStockLevel: 130, supplierIdx: 4 },
  // 35 sản phẩm mở rộng tạo chênh lệch tự nhiên (32 | 26 | 21 | 29 | 24 | 23 | 20 = 175 sản phẩm)
  { name: 'Hạt Royal Canin Maxi Adult Cho Chó Giống Lớn (4kg)', category: 'Thức ăn', sku: 'RC-MAXI-4KG', unitPrice: 595000, costPrice: 455000, currentStock: 16, minStockLevel: 8, maxStockLevel: 45, supplierIdx: 0 },
  { name: 'Hạt Royal Canin British Shorthair Cho Mèo Anh Lông Ngắn (2kg)', category: 'Thức ăn', sku: 'RC-BSH-2KG', unitPrice: 465000, costPrice: 355000, currentStock: 22, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 0 },
  { name: 'Hạt Royal Canin Persian Cho Mèo Ba Tư Lông Dài (2kg)', category: 'Thức ăn', sku: 'RC-PERSIAN-2KG', unitPrice: 475000, costPrice: 360000, currentStock: 19, minStockLevel: 8, maxStockLevel: 55, supplierIdx: 0 },
  { name: 'Hạt Dinh Dưỡng Acana Wild Prairie Không Ngũ Cốc Cho Chó (2kg)', category: 'Thức ăn', sku: 'ACANA-PRAIRIE-2KG', unitPrice: 620000, costPrice: 475000, currentStock: 14, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 2 },
  { name: 'Hạt Hữu Cơ Natural Core Eco 1 Thịt Cừu Cho Chó Nhạy Cảm (2kg)', category: 'Thức ăn', sku: 'NATCORE-ECO1-2KG', unitPrice: 385000, costPrice: 285000, currentStock: 25, minStockLevel: 10, maxStockLevel: 65, supplierIdx: 2 },
  { name: 'Hạt Dinh Dưỡng Catseye Mèo Con & Mèo Mẹ Mang Thai (1.5kg)', category: 'Thức ăn', sku: 'CATSEYE-MOM-1.5KG', unitPrice: 215000, costPrice: 152000, currentStock: 34, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 2 },
  { name: 'Hạt Khô Cho Chó Trưởng Thành Ganador Vị Cừu & Gạo (3kg)', category: 'Thức ăn', sku: 'GANADOR-LAMB-3KG', unitPrice: 185000, costPrice: 130000, currentStock: 42, minStockLevel: 15, maxStockLevel: 100, supplierIdx: 2 },
  { name: 'Pate Tươi King\'s Pet Hỗn Hợp Gà & Bí Đỏ Cho Chó Mèo (Lon 380g)', category: 'Thức ăn', sku: 'KINGSPET-PUMP-380G', unitPrice: 48000, costPrice: 30000, currentStock: 68, minStockLevel: 24, maxStockLevel: 160, supplierIdx: 2 },
  { name: 'Pate Mèo Cao Cấp Nekko Jelly Vị Cá Ngừ & Thanh Cua (Gói 70g)', category: 'Thức ăn', sku: 'NEKKO-CRAB-70G', unitPrice: 19000, costPrice: 12000, currentStock: 110, minStockLevel: 35, maxStockLevel: 260, supplierIdx: 2 },
  { name: 'Pate Mèo Sốt Thịt Sheba Vị Cá Hồi & Gà Xé Sợi (Gói 70g)', category: 'Thức ăn', sku: 'SHEBA-SALMON-70G', unitPrice: 23000, costPrice: 15000, currentStock: 92, minStockLevel: 30, maxStockLevel: 220, supplierIdx: 0 },
  { name: 'Hạt Hỗ Trợ Tiết Niệu Royal Canin Urinary S/O Cho Mèo (1.5kg)', category: 'Thức ăn', sku: 'RC-URINARY-1.5KG', unitPrice: 445000, costPrice: 342000, currentStock: 6, minStockLevel: 10, maxStockLevel: 45, supplierIdx: 0 },
  { name: 'Hạt Kiểm Soát Cân Nặng Hill\'s Science Diet Light Cho Chó (2kg)', category: 'Thức ăn', sku: 'HILLS-LIGHT-2KG', unitPrice: 490000, costPrice: 375000, currentStock: 15, minStockLevel: 8, maxStockLevel: 45, supplierIdx: 2 },
  { name: 'Bánh Thưởng Sấy Lạnh Lòng Đỏ Trứng Gà Dưỡng Lông Cho Mèo & Cún (Hũ 100g)', category: 'Bánh thưởng', sku: 'FREEZE-YOLK-100G', unitPrice: 89000, costPrice: 55000, currentStock: 44, minStockLevel: 15, maxStockLevel: 100, supplierIdx: 2 },
  { name: 'Súp Thưởng Dinh Dưỡng Ginboshi Vị Cá Ngừ & Rong Biển (Gói 6 thanh)', category: 'Bánh thưởng', sku: 'GINBOSHI-TUNA-6P', unitPrice: 52000, costPrice: 32000, currentStock: 62, minStockLevel: 20, maxStockLevel: 140, supplierIdx: 2 },
  { name: 'Xương Gặm Sạch Răng Whimzees Hình Cá Sấu Hữu Cơ Cho Chó (Gói 6 cái)', category: 'Bánh thưởng', sku: 'WHIMZEES-CROC-6P', unitPrice: 135000, costPrice: 92000, currentStock: 28, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 2 },
  { name: 'Thịt Gà Khô Cuộn Thanh Khoai Lang Mềm Cho Chó Wanpy (Gói 100g)', category: 'Bánh thưởng', sku: 'WANPY-SWEETPOT-100G', unitPrice: 68000, costPrice: 43000, currentStock: 46, minStockLevel: 16, maxStockLevel: 110, supplierIdx: 2 },
  { name: 'Kẹo Dinh Dưỡng Cỏ Mèo Catnip Gắn Tường Xoay 360 Độ Cho Mèo', category: 'Bánh thưởng', sku: 'CATNIP-WALL-BALL', unitPrice: 38000, costPrice: 20000, currentStock: 75, minStockLevel: 25, maxStockLevel: 160, supplierIdx: 2 },
  { name: 'Bánh Thưởng Sữa Chua Khô Bổ Sung Lợi Khuẩn Cho Chó Con (Hũ 80g)', category: 'Bánh thưởng', sku: 'YOGURT-DROPS-80G', unitPrice: 76000, costPrice: 48000, currentStock: 38, minStockLevel: 14, maxStockLevel: 85, supplierIdx: 2 },
  { name: 'Cát Đậu Nành Mèo Tofu Hạt Nhỏ 1.5mm Hương Matcha Nhật Bản (6L)', category: 'Cát vệ sinh', sku: 'TOFU-MATCHA-6L', unitPrice: 128000, costPrice: 86000, currentStock: 45, minStockLevel: 18, maxStockLevel: 110, supplierIdx: 5 },
  { name: 'Bình Nước Du Lịch Cầm Tay Có Nút Bấm Khóa Chống Rỉ Cho Chó (350ml)', category: 'Phụ kiện', sku: 'TRAVEL-BOTTLE-350ML', unitPrice: 115000, costPrice: 68000, currentStock: 36, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 3 },
  { name: 'Chén Ăn Chống Hóc Hình Mê Cung Giúp Chó Ăn Chậm Tiêu Hóa Tốt', category: 'Phụ kiện', sku: 'SLOW-FEEDER-BOWL', unitPrice: 92000, costPrice: 54000, currentStock: 42, minStockLevel: 15, maxStockLevel: 95, supplierIdx: 3 },
  { name: 'Rọ Mõm Silicon Mỏ Vịt Mềm Thoáng Khí Cho Chó Nhỏ (Size S/M)', category: 'Phụ kiện', sku: 'DUCK-MUZZLE-SM', unitPrice: 78000, costPrice: 44000, currentStock: 30, minStockLevel: 10, maxStockLevel: 70, supplierIdx: 3 },
  { name: 'Tã Lót Vệ Sinh Than Hoạt Tính Siêu Thấm Cho Chó Con (Gói 50 miếng Size M)', category: 'Phụ kiện', sku: 'PEE-PAD-CHARCOAL-50', unitPrice: 145000, costPrice: 95000, currentStock: 50, minStockLevel: 18, maxStockLevel: 120, supplierIdx: 3 },
  { name: 'Túi Xách Vận Chuyển Chó Mèo Vải Lưới Thoáng Khí Gấp Gọn (Size M)', category: 'Phụ kiện', sku: 'MESH-CARRIER-M', unitPrice: 265000, costPrice: 175000, currentStock: 18, minStockLevel: 8, maxStockLevel: 45, supplierIdx: 3 },
  { name: 'Bóng Lăn Tự Động Thông Minh Đèn LED Sạc USB Cho Mèo Chơi Độc Lập', category: 'Phụ kiện', sku: 'SMART-LED-BALL', unitPrice: 155000, costPrice: 98000, currentStock: 29, minStockLevel: 12, maxStockLevel: 70, supplierIdx: 3 },
  { name: 'Áo Mưa Trong Suốt Chống Thấm Có Mũ Trùm Cho Chó Đi Dạo (Size M/L)', category: 'Phụ kiện', sku: 'PET-RAINCOAT-ML', unitPrice: 110000, costPrice: 64000, currentStock: 34, minStockLevel: 12, maxStockLevel: 80, supplierIdx: 3 },
  { name: 'Cây Lăn Bụi & Hút Lông Thú Cưng Tái Sử Dụng Thông Minh Cho Sofa', category: 'Phụ kiện', sku: 'FUR-ROLLER-PRO', unitPrice: 95000, costPrice: 55000, currentStock: 48, minStockLevel: 15, maxStockLevel: 100, supplierIdx: 3 },
  { name: 'Võng Treo Cửa Sổ Kính Hút Chân Không Chịu Lực 15kg Cho Mèo Phơi Nắng', category: 'Phụ kiện', sku: 'CAT-WINDOW-HAMMOCK', unitPrice: 225000, costPrice: 145000, currentStock: 16, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 3 },
  { name: 'Sữa Tắm Tạo Phồng & Mềm Lông Chuyên Dụng Cho Poodle Budle\'Budle (500ml)', category: 'Mỹ phẩm Spa', sku: 'BUDLE-POODLE-500', unitPrice: 315000, costPrice: 225000, currentStock: 20, minStockLevel: 8, maxStockLevel: 50, supplierIdx: 1 },
  { name: 'Khăn Ướt Vệ Sinh Kháng Khuẩn Không Cồn Cho Chó Mèo PetWipes (Gói 80 tờ)', category: 'Mỹ phẩm Spa', sku: 'PET-WIPES-80P', unitPrice: 45000, costPrice: 26000, currentStock: 72, minStockLevel: 25, maxStockLevel: 160, supplierIdx: 1 },
  { name: 'Lược Cào Gỡ Lông Rụng Lớp Lót Furminator Cho Chó Lông Dài (Size M)', category: 'Mỹ phẩm Spa', sku: 'FURMINATOR-COMB-M', unitPrice: 285000, costPrice: 198000, currentStock: 7, minStockLevel: 10, maxStockLevel: 45, supplierIdx: 1 },
  { name: 'Máy Mài Móng Điện Siêu Êm Ít Tiếng Ồn Đèn LED Soi Tủy Cho Chó Mèo', category: 'Mỹ phẩm Spa', sku: 'NAIL-GRINDER-LED', unitPrice: 245000, costPrice: 165000, currentStock: 18, minStockLevel: 8, maxStockLevel: 45, supplierIdx: 1 },
  { name: 'Viên Nhai Giảm Căng Thẳng & Chống Say Xe Quiet Moments Cho Chó Mèo (60 viên)', category: 'Dinh dưỡng', sku: 'CALMING-CHEW-60T', unitPrice: 275000, costPrice: 195000, currentStock: 21, minStockLevel: 8, maxStockLevel: 50, supplierIdx: 4 },
  { name: 'Bột Rong Biển Tự Nhiên PlaqueOff Giảm Mảng Bám & Thơm Miệng (60g)', category: 'Dinh dưỡng', sku: 'PLAQUEOFF-KELP-60G', unitPrice: 365000, costPrice: 268000, currentStock: 15, minStockLevel: 8, maxStockLevel: 40, supplierIdx: 4 },
  { name: 'Dầu Hoa Anh Thảo & Omega 3-6-9 Phục Hồi Da Khô Ngứa Cho Chó Mèo (200ml)', category: 'Dinh dưỡng', sku: 'OMEGA369-SKIN-200ML', unitPrice: 235000, costPrice: 165000, currentStock: 26, minStockLevel: 10, maxStockLevel: 60, supplierIdx: 4 },
];

/**
 * Đồng bộ dữ liệu vận hành mẫu (idempotent) trên startup để cả Local và Production không bị ít dữ liệu:
 * - Bổ sung user demo còn thiếu (KHÔNG ghi đè mật khẩu hay tài khoản user thật đã đăng ký)
 * - Bổ sung nhà cung cấp & sản phẩm còn thiếu theo SKU
 * - Bổ sung thú cưng & lịch hẹn mẫu nếu DB đang ít (< 4 thú cưng / < 4 lịch hẹn)
 */
async function ensureDefaultOperationalData(prisma) {
  const passwordHash = await bcrypt.hash('123456', 10);
  const userMap = new Map();

  for (const u of DEFAULT_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      userMap.set(u.email, existing);
    } else {
      const created = await prisma.user.create({
        data: {
          email: u.email,
          password: passwordHash,
          fullName: u.fullName,
          phone: u.phone,
          address: u.address,
          role: u.role,
          status: 'ACTIVE',
        },
      });
      userMap.set(u.email, created);
    }
  }

  // Suppliers
  const existingSuppliers = await prisma.supplier.findMany();
  const suppliers = [];
  for (const s of DEFAULT_SUPPLIERS) {
    let found = existingSuppliers.find((x) => x.name.toLowerCase() === s.name.toLowerCase());
    if (!found) {
      found = await prisma.supplier.create({ data: s });
    }
    suppliers.push(found);
  }

  // Products (1 query lấy toàn bộ SKU hiện có rồi chỉ chèn SKU còn thiếu -> nhanh & idempotent)
  const existingProducts = await prisma.product.findMany({ select: { sku: true } });
  const existingSkuSet = new Set(existingProducts.map((item) => item.sku));
  let productsAdded = 0;
  for (const p of DEFAULT_PRODUCTS) {
    if (!existingSkuSet.has(p.sku)) {
      const { supplierIdx, ...prodData } = p;
      await prisma.product.create({
        data: {
          ...prodData,
          supplierId: suppliers[supplierIdx]?.id || suppliers[0]?.id || null,
        },
      });
      existingSkuSet.add(p.sku);
      productsAdded += 1;
    }
  }

  // Pets (chỉ bổ sung nếu tổng số thú cưng < 5 để tránh nhân bản)
  const petCount = await prisma.pet.count();
  if (petCount < 5) {
    const cust1 = userMap.get('khachhang@gmail.com');
    const cust2 = userMap.get('khachhang2@gmail.com');
    const cust3 = userMap.get('nguyenvannam@gmail.com');
    const cust4 = userMap.get('tranmyhanh@gmail.com');
    const existingPets = await prisma.pet.findMany();
    const existingPetNames = new Set(existingPets.map((p) => p.name.toLowerCase()));

    const extraPets = [
      { name: 'LuLu', species: 'Chó', breed: 'Poodle', ageMonths: 18, weightKg: 4.5, medicalHistory: 'Đã tiêm phòng dại 3 mũi, tẩy giun định kỳ', ownerId: cust1?.id },
      { name: 'Miu Miu', species: 'Mèo', breed: 'Anh Lông Ngắn', ageMonths: 12, weightKg: 3.8, medicalHistory: 'Khỏe mạnh, nhạy cảm với xà phòng có mùi nồng', ownerId: cust1?.id },
      { name: 'Kem', species: 'Chó', breed: 'Corgi Pembroke', ageMonths: 14, weightKg: 9.2, medicalHistory: 'Đã tiêm đủ 7 bệnh, cần chải lông rụng định kỳ', ownerId: cust1?.id },
      { name: 'Bé Bông', species: 'Chó', breed: 'Phốc Sóc (Pomeranian)', ageMonths: 8, weightKg: 2.2, medicalHistory: 'Đã hoàn thành 2 mũi vắc xin 5in1', ownerId: cust2?.id },
      { name: 'Mochi', species: 'Mèo', breed: 'Scottish Fold', ageMonths: 16, weightKg: 4.1, medicalHistory: 'Đã triệt sản Minilap hồi phục hoàn toàn', ownerId: cust2?.id },
      { name: 'Max', species: 'Chó', breed: 'Golden Retriever', ageMonths: 28, weightKg: 24.5, medicalHistory: 'Khỏe mạnh, đã gắn microchip quốc tế', ownerId: cust3?.id },
      { name: 'Bơ', species: 'Mèo', breed: 'Ragdoll', ageMonths: 10, weightKg: 3.5, medicalHistory: 'Lông dài dễ rối bụng, ăn hạt Royal Canin Indoor', ownerId: cust3?.id },
      { name: 'Nâu', species: 'Chó', breed: 'Shiba Inu', ageMonths: 22, weightKg: 8.8, medicalHistory: 'Hơi nhát người lạ, thích tắm nước ấm', ownerId: cust4?.id },
    ];

    for (const pet of extraPets) {
      if (pet.ownerId && !existingPetNames.has(pet.name.toLowerCase())) {
        await prisma.pet.create({ data: pet });
        existingPetNames.add(pet.name.toLowerCase());
      }
    }
  }

  // Seed lịch sử lịch hẹn dịch vụ phong phú (idempotent: chỉ bổ sung khi DB < 10 lịch hẹn)
  const existingAppCount = await prisma.appointment.count();
  let appointmentsAdded = 0;
  if (existingAppCount < 10) {
    const allPets = await prisma.pet.findMany();
    const allServices = await prisma.serviceCatalog.findMany();
    const care1 = userMap.get('care@petcare.com');
    const care2 = userMap.get('bs.minh@petcare.com') || care1;
    const care3 = userMap.get('groomer.linh@petcare.com') || care1;

    const findPet = (name) => allPets.find((p) => p.name.toLowerCase() === name.toLowerCase()) || allPets[0];
    const findSvc = (kw) => allServices.find((s) => s.name.toLowerCase().includes(kw.toLowerCase())) || allServices[0];

    const seedAppointments = [
      { pet: 'LuLu', svc: 'spa grooming', staff: care3, daysAgo: 2, slot: '09:00 - 10:00', status: 'COMPLETED', notes: 'Tỉa kiểu Teddy giữ lông chân 2cm.', summary: 'Đã cắt tỉa tạo kiểu Teddy hoàn chỉnh, vệ sinh tai & mài móng êm ái.' },
      { pet: 'Kem', svc: 'ozone', staff: care3, daysAgo: 3, slot: '10:00 - 11:00', status: 'COMPLETED', notes: 'Bé rụng lông nhiều mùa nóng.', summary: 'Đã tắm sục Ozone Nano 20 phút, chải sạch lông chết và xịt dưỡng ẩm.' },
      { pet: 'LuLu', svc: 'vôi răng', staff: care2, daysAgo: 6, slot: '15:00 - 16:00', status: 'COMPLETED', notes: 'Kiểm tra răng hàm có mảng bám.', summary: 'Loại bỏ hoàn toàn cao răng siêu âm không gây mê, đánh bóng men răng sáng khỏe.' },
      { pet: 'Miu Miu', svc: 'tắm dưỡng', staff: care1, daysAgo: 10, slot: '14:00 - 15:00', status: 'COMPLETED', notes: 'Da nhạy cảm, dùng thảo dược dịu nhẹ.', summary: 'Tắm thảo dược trà xanh, sấy cách âm ít tiếng ồn, bé cực ngoan.' },
      { pet: 'Kem', svc: '7 bệnh', staff: care2, daysAgo: 14, slot: '10:00 - 11:00', status: 'COMPLETED', notes: 'Tiêm nhắc lại định kỳ hàng năm.', summary: 'Thân nhiệt 38.4°C bình thường, tiêm mũi 7 bệnh Recombitek an toàn.' },
      { pet: 'LuLu', svc: 'tẩy giun', staff: care2, daysAgo: 20, slot: '16:00 - 17:00', status: 'COMPLETED', notes: 'Phòng ve rận định kỳ.', summary: 'Uống Drontal Plus đúng cân nặng và nhỏ gáy Frontline Plus.' },
      { pet: 'Miu Miu', svc: 'khám sức khỏe', staff: care2, daysAgo: 26, slot: '09:00 - 10:00', status: 'COMPLETED', notes: 'Khám định kỳ 6 tháng kiểm tra thận.', summary: 'Siêu âm thận bàng quang sạch không sỏi, tim phổi ổn định.' },
      { pet: 'Bé Bông', svc: 'spa grooming', staff: care3, daysAgo: 5, slot: '10:00 - 11:00', status: 'COMPLETED', notes: 'Tỉa dáng gấu Boo Phốc Sóc.', summary: 'Tỉa form gấu Boo tròn trịa, lông bông mềm thơm dịu.' },
      { pet: 'Mochi', svc: 'triệt sản', staff: care2, daysAgo: 8, slot: '10:00 - 11:00', status: 'COMPLETED', notes: 'Triệt sản Minilap chỉ tự tiêu.', summary: 'Phẫu thuật đường mổ 1.2cm khô ráo, bé tỉnh mê hoàn toàn sau 15 phút.' },
      { pet: 'Mochi', svc: 'giảm bạch cầu', staff: care2, daysAgo: 18, slot: '09:00 - 10:00', status: 'COMPLETED', notes: 'Tiêm tăng cường miễn dịch.', summary: 'Khám sàng lọc khỏe mạnh, tiêm vắc xin đủ liều và dán tem sổ tiêm.' },
      { pet: 'Max', svc: 'khám sức khỏe', staff: care2, daysAgo: 4, slot: '16:00 - 17:00', status: 'COMPLETED', notes: 'Khám tổng quát định kỳ.', summary: 'Tim phổi ổn định, siêu âm gan thận bình thường, cân nặng 24.5kg đạt chuẩn.' },
      { pet: 'Max', svc: 'xét nghiệm máu', staff: care2, daysAgo: 22, slot: '08:00 - 09:00', status: 'COMPLETED', notes: 'Tầm soát 14 chỉ số sinh hóa.', summary: 'Men gan thận trong ngưỡng chuẩn, âm tính ký sinh trùng máu.' },
      { pet: 'Bơ', svc: '4 bệnh', staff: care2, daysAgo: 12, slot: '10:00 - 11:00', status: 'COMPLETED', notes: 'Tiêm Purevax Pháp cho bé Ragdoll.', summary: 'Tiêm Purevax nhẹ nhàng không sưng đau, bé ăn uống bình thường.' },
      { pet: 'Nâu', svc: 'bệnh dại', staff: care2, daysAgo: 7, slot: '11:00 - 12:00', status: 'COMPLETED', notes: 'Tiêm nhắc dại Rabisin.', summary: 'Đã tiêm Rabisin chuẩn WHO và cấp sổ chứng nhận quốc tế.' },
      { pet: 'Nâu', svc: 'cắt tỉa', staff: care3, daysAgo: 0, slot: '15:00 - 16:00', status: 'IN_PROGRESS', notes: 'Tỉa gọn viền lông chân và sấy phồng.', summary: 'Đang tạo kiểu gọn form Hàn Quốc, bé hợp tác rất tốt.' },
      { pet: 'Miu Miu', svc: '4 bệnh', staff: null, daysAgo: -1, slot: '14:00 - 15:00', status: 'PENDING', notes: 'Tiêm nhắc lại định kỳ năm thứ 2.', summary: null },
      { pet: 'Bơ', svc: 'gỡ rối', staff: null, daysAgo: -1, slot: '10:00 - 11:00', status: 'PENDING', notes: 'Gỡ rối lông bụng nhẹ tay không cạo trọc.', summary: null },
      { pet: 'Bé Bông', svc: '7 bệnh', staff: null, daysAgo: -2, slot: '09:00 - 10:00', status: 'PENDING', notes: 'Nhắc lịch tiêm mũi 3 cho bé Bông.', summary: null },
    ];

    for (const item of seedAppointments) {
      const petDoc = findPet(item.pet);
      const svcDoc = findSvc(item.svc);
      if (!petDoc || !svcDoc) continue;
      const appDate = new Date(Date.now() - item.daysAgo * 86400000);
      await prisma.appointment.create({
        data: {
          petId: petDoc.id,
          customerId: petDoc.ownerId,
          staffId: item.staff?.id || null,
          serviceId: svcDoc.id,
          appointmentDate: appDate,
          timeSlot: item.slot,
          status: item.status,
          totalPrice: svcDoc.price,
          notes: item.notes,
          careSummary: item.summary,
        },
      });
      appointmentsAdded += 1;
    }
  }

  // Seed lịch sử đơn hàng sản phẩm đã mua trong MongoDB (idempotent: chỉ bổ sung khi DB < 10 đơn hàng)
  const existingOrderCount = await prisma.order.count();
  let ordersAdded = 0;
  if (existingOrderCount < 10) {
    const allProds = await prisma.product.findMany();
    const bySku = new Map(allProds.map((p) => [p.sku, p]));
    const customers = [
      userMap.get('khachhang@gmail.com'),
      userMap.get('khachhang2@gmail.com'),
      userMap.get('nguyenvannam@gmail.com'),
      userMap.get('tranmyhanh@gmail.com'),
    ].filter(Boolean);

    const seedOrders = [
      { custIdx: 0, status: 'COMPLETED', daysAgo: 1, items: [{ sku: 'VP-RC-MINI-2KG', qty: 2 }, { sku: 'CIAO-SCALLOP-20P', qty: 1 }] },
      { custIdx: 0, status: 'COMPLETED', daysAgo: 4, items: [{ sku: 'SOS-SHAMPOO-530', qty: 2 }, { sku: 'VIRBAC-EPIOTIC-125', qty: 1 }] },
      { custIdx: 0, status: 'COMPLETED', daysAgo: 8, items: [{ sku: 'RC-POODLE-PUPPY-1.5', qty: 2 }, { sku: 'FREEZE-CHICKEN-100G', qty: 2 }] },
      { custIdx: 0, status: 'COMPLETED', daysAgo: 13, items: [{ sku: 'TOFU-PEACH-6L', qty: 3 }, { sku: 'TOFU-CHARCOAL-6L', qty: 2 }] },
      { custIdx: 0, status: 'COMPLETED', daysAgo: 18, items: [{ sku: 'FRONTLINE-PLUS', qty: 2 }, { sku: 'DRONTAL-PLUS-6T', qty: 1 }] },
      { custIdx: 0, status: 'COMPLETED', daysAgo: 25, items: [{ sku: 'CATTREE-3TIER', qty: 1 }, { sku: 'CAT-TOY-FEATHER', qty: 2 }] },
      { custIdx: 0, status: 'PAID', daysAgo: 2, items: [{ sku: 'BRAVECTO-DOG-M', qty: 1 }, { sku: 'EYE-ENVY-120ML', qty: 1 }] },
      { custIdx: 1, status: 'COMPLETED', daysAgo: 6, items: [{ sku: 'KMR-KITTEN-340G', qty: 2 }, { sku: 'PET-PILL-SYRINGE', qty: 2 }] },
      { custIdx: 1, status: 'COMPLETED', daysAgo: 11, items: [{ sku: 'CATS-BEST-5L', qty: 3 }, { sku: 'LITTER-BOX-HIGH', qty: 1 }] },
      { custIdx: 1, status: 'COMPLETED', daysAgo: 17, items: [{ sku: 'REVOLUTION-PLUS-CAT', qty: 2 }, { sku: 'TAURINE-LYSINE-120G', qty: 1 }] },
      { custIdx: 1, status: 'PENDING', daysAgo: 0, items: [{ sku: 'VP-6FREE-CAT-2KG', qty: 1 }, { sku: 'VP-PRECATEN-400G', qty: 2 }] },
      { custIdx: 2, status: 'COMPLETED', daysAgo: 3, items: [{ sku: 'JOINT-GLUCOS-60T', qty: 2 }, { sku: 'NEXGARD-SPECTRA-M', qty: 2 }] },
      { custIdx: 2, status: 'COMPLETED', daysAgo: 9, items: [{ sku: 'RC-MEDIUM-4KG', qty: 2 }, { sku: 'ORIJEN-6FISH-1.8KG', qty: 1 }] },
      { custIdx: 2, status: 'COMPLETED', daysAgo: 15, items: [{ sku: 'COOLING-MAT-L', qty: 1 }, { sku: 'VP-PIANPIAN-A1103-L', qty: 1 }] },
      { custIdx: 2, status: 'SHIPPED', daysAgo: 1, items: [{ sku: 'CATURE-TOFU-GREEN-6L', qty: 3 }, { sku: 'GIMCAT-MALT-50G', qty: 1 }] },
      { custIdx: 3, status: 'COMPLETED', daysAgo: 5, items: [{ sku: 'RC-INDOOR27-2KG', qty: 2 }, { sku: 'MONGE-TURKEY-400G', qty: 4 }] },
      { custIdx: 3, status: 'COMPLETED', daysAgo: 12, items: [{ sku: 'ANF-6FREE-DUCK-2KG', qty: 2 }, { sku: 'PEDIGREE-DENTA-7P', qty: 4 }] },
      { custIdx: 3, status: 'PENDING', daysAgo: 0, items: [{ sku: 'PETKIT-WATER-2L', qty: 1 }, { sku: 'VP-FLEXI-XS-COMFORT', qty: 1 }] },
    ];

    for (const o of seedOrders) {
      const cust = customers[o.custIdx] || customers[0];
      if (!cust) continue;
      const lineItems = [];
      let totalAmount = 0;
      for (const line of o.items) {
        const prod = bySku.get(line.sku);
        if (!prod) continue;
        lineItems.push({ productId: prod.id, quantity: line.qty, unitPrice: prod.unitPrice });
        totalAmount += prod.unitPrice * line.qty;
      }
      if (lineItems.length === 0) continue;
      await prisma.order.create({
        data: {
          customerId: cust.id,
          totalAmount,
          status: o.status,
          createdAt: new Date(Date.now() - o.daysAgo * 86400000),
          items: { create: lineItems },
        },
      });
      ordersAdded += 1;
    }
  }

  return {
    usersTotal: userMap.size,
    suppliersTotal: suppliers.length,
    productsAdded,
    appointmentsAdded,
    ordersAdded,
  };
}

module.exports = {
  DEFAULT_USERS,
  DEFAULT_SUPPLIERS,
  DEFAULT_PRODUCTS,
  ensureDefaultOperationalData,
};
