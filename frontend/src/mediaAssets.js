// Real, high-resolution photography library (Pexels) mapped 1-to-1 to Petopia avatars, pets, services & products

const pexels = (id, width = 640) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const HERO_IMAGES = {
  spaBanner: pexels(7210748, 720),       // Groomer working with fluffy white dog
  shopBanner: pexels(28426509, 720),     // British Shorthair cat indoors
  reproBanner: pexels(6235114, 520),     // Vet ultrasound examination on dog
};

export const FALLBACK_IMAGES = {
  user: pexels(1564123, 300),
  pet: pexels(30810890, 400),
  service: pexels(19145873, 640),
  product: pexels(8434635, 640),
};

// 1. REAL HUMAN PORTRAIT AVATARS (USERS / STAFF / CUSTOMERS)
export const USER_AVATARS = {
  'u-1': pexels(4069205, 300),   // Nguyễn Văn Admin
  'u-2': pexels(6235238, 300),   // Trần Thị Chăm Sóc (Care Staff / Vet)
  'u-3': pexels(24906117, 300),  // Lê Văn Kho (Warehouse Staff)
  'u-4': pexels(1564123, 300),   // Phạm Minh Anh (Customer)
  'u-5': pexels(6235234, 300),   // Hoàng Thị Yến (Customer)
};

export const getUserAvatar = (user) => {
  if (!user) return FALLBACK_IMAGES.user;
  if (user.avatar) return user.avatar;
  if (user.id && USER_AVATARS[user.id]) return USER_AVATARS[user.id];
  if (user.role === 'ADMIN') return USER_AVATARS['u-1'];
  if (user.role === 'CARE_STAFF') return USER_AVATARS['u-2'];
  if (user.role === 'WAREHOUSE_STAFF') return USER_AVATARS['u-3'];
  return USER_AVATARS['u-4'];
};

// 2. REAL BREED-MATCHED PET AVATARS
export const PET_AVATARS = {
  p1: pexels(9920575, 420),   // LuLu - Poodle nâu
  p2: pexels(14311615, 420),  // Miu Miu - Mèo Anh Lông Ngắn
  p3: pexels(20680840, 420),  // Bé Bông - Phốc Sóc (Pomeranian)
};

export const getPetAvatar = (pet) => {
  if (!pet) return FALLBACK_IMAGES.pet;
  if (pet.avatar) return pet.avatar;
  if (pet.id && PET_AVATARS[pet.id]) return PET_AVATARS[pet.id];

  const breed = (pet.breed || '').toLowerCase();
  const species = (pet.species || '').toLowerCase();

  if (breed.includes('poodle')) return pexels(29477518, 420);
  if (breed.includes('pomeranian') || breed.includes('phốc sóc')) return pexels(27969548, 420);
  if (breed.includes('anh') || breed.includes('british')) return pexels(17089872, 420);
  if (breed.includes('scottish')) return pexels(30936336, 420);
  if (species.includes('mèo') || species.includes('cat')) return pexels(17089872, 420);
  if (species.includes('chó') || species.includes('dog')) return pexels(30810890, 420);
  return pexels(29582994, 420);
};

// 3. REAL PHOTOGRAPHS MATCHING ALL 20 SERVICES
export const SERVICE_IMAGES = {
  // Spa & Grooming
  s1: pexels(19145873, 640),  // Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt)
  s4: pexels(19145882, 640),  // Tắm Dưỡng Lông Thảo Dược & Khử Mùi
  s5: pexels(19145869, 640),  // Cắt Tỉa Tạo Kiểu Nghệ Thuật
  s6: pexels(19145862, 640),  // Nhuộm Lông Hữu Cơ & Tạo Kiểu
  s7: pexels(6235113, 640),   // Cạo Vôi Răng Siêu Âm (Vet dental exam)
  s8: pexels(19145875, 640),  // Vệ Sinh Toàn Diện: Cắt Mài Móng

  // Khách Sạn & Lưu Trú
  s9: pexels(20898436, 640),  // Khách Sạn Thú Cưng VIP (Dog resting in cozy bed)
  s10: pexels(37443358, 640), // Trông Giữ Trong Ngày (Pet Daycare)

  // Y Tế & Tiêm Phòng
  s2: pexels(7469213, 640),   // Tiêm Vắc Xin 5 Trong 1 Cho Chó
  s11: pexels(7303957, 640),  // Tiêm Vắc Xin 4 Bệnh Cho Mèo
  s12: pexels(28644464, 640), // Tiêm Phòng Bệnh Dại Định Kỳ

  // Khám Bệnh & Trị Liệu
  s3: pexels(5732461, 640),   // Khám Sức Khỏe Tổng Quát & Ống Nghe
  s13: pexels(28644631, 640), // Tẩy Giun Sán & Nhỏ Gáy Phòng Ve Rận
  s14: pexels(19145891, 640), // Trị Liệu Nấm Da & Phục Hồi Lông

  // Khoa Sinh Sản (VPet's Standard)
  s15: pexels(6235114, 640),  // Siêu Âm Thai Kỹ Thuật Số Doppler
  s16: pexels(18859864, 640), // Gói Hộ Sinh Đỡ Đẻ & Hồi Sức Sơ Sinh 24/7
  s17: pexels(7121954, 640),  // Phẫu Thuật Mổ Đẻ Cấp Cứu Vô Trùng (C-Section)
  s18: pexels(6235238, 640),  // Triệt Sản Mèo/Chó Cái Công Nghệ Minilap
  s19: pexels(28644631, 640), // Thiến Chó Đực / Mèo Đực An Toàn
  s20: pexels(33394245, 640), // Phẫu Thuật Cấp Cứu Viêm Tử Cung Tích Mủ
};

export const getServiceImage = (service) => {
  if (!service) return FALLBACK_IMAGES.service;
  if (service.image) return service.image;
  if (service.id && SERVICE_IMAGES[service.id]) return SERVICE_IMAGES[service.id];

  const name = (service.name || '').toLowerCase();
  const cat = (service.category || '').toLowerCase();

  if (name.includes('siêu âm')) return SERVICE_IMAGES.s15;
  if (name.includes('đỡ đẻ') || name.includes('hộ sinh')) return SERVICE_IMAGES.s16;
  if (name.includes('mổ đẻ') || name.includes('phẫu thuật')) return SERVICE_IMAGES.s17;
  if (name.includes('triệt sản') || name.includes('thiến')) return SERVICE_IMAGES.s18;
  if (name.includes('răng')) return SERVICE_IMAGES.s7;
  if (name.includes('móng')) return SERVICE_IMAGES.s8;
  if (name.includes('tắm')) return SERVICE_IMAGES.s4;
  if (name.includes('cắt tỉa')) return SERVICE_IMAGES.s5;
  if (name.includes('vắc xin') && name.includes('mèo')) return SERVICE_IMAGES.s11;
  if (name.includes('vắc xin') || name.includes('tiêm')) return SERVICE_IMAGES.s2;
  if (name.includes('khách sạn')) return SERVICE_IMAGES.s9;
  if (name.includes('trông giữ') || name.includes('daycare')) return SERVICE_IMAGES.s10;
  if (cat.includes('sinh sản')) return SERVICE_IMAGES.s15;
  if (cat.includes('khách sạn')) return SERVICE_IMAGES.s9;
  if (cat.includes('tiêm') || cat.includes('khám')) return SERVICE_IMAGES.s3;
  return SERVICE_IMAGES.s1;
};

// 4. REAL PHOTOGRAPHS MATCHING ALL 32 PRODUCTS
export const PRODUCT_IMAGES = {
  // Thức ăn hạt & Pate
  'prod-1': pexels(8434635, 600),   // Hạt Royal Canin Mini Adult 2kg (bát hạt chó)
  'prod-4': pexels(16629910, 600),  // Pate Mèo Whiskas Vị Cá Biển & Cá Hồi (mèo ăn pate)
  'prod-7': pexels(18418977, 600),  // Hạt Thức Ăn Mèo Me-O Cá Ngừ (mèo & bát hạt)
  'prod-10': pexels(5732997, 600),  // Pate Chó Con Pedigree Thịt Bò (chó ăn bát thức ăn)
  'prod-11': pexels(34952074, 600), // Hạt Dinh Dưỡng Orijen Six Fish (cận cảnh hạt cao cấp)
  'prod-12': pexels(30745582, 600), // Hạt Mèo Royal Canin Hairball Care (mèo ăn hạt khô)
  'prod-13': pexels(8434676, 600),  // Hạt Chó Poodle Con Puppy (cún con ăn hạt)

  // Bánh thưởng & Snack
  'prod-8': pexels(30582967, 600),  // Xương Gặm Sạch Răng Orgo (cún gặm xương)
  'prod-9': pexels(34952073, 600),  // Bánh Thưởng Ức Gà Sấy Khô Freeze-Dried
  'prod-14': pexels(16571601, 600), // Thanh Thịt Bò Jerky Dạng Que
  'prod-15': pexels(8121115, 600),  // Súp Thưởng Cho Mèo Ciao Churu (mèo thưởng thức snack)
  'prod-16': pexels(8121154, 600),  // Bánh Quy Sữa Dê Hình Xương (bánh quy xương)

  // Cát vệ sinh
  'prod-2': pexels(13705506, 600),  // Cát Vệ Sinh Mèo Đậu Nành Tofu 6L
  'prod-17': pexels(30644026, 600), // Cát Đất Sét Bentonite Hương Cà Phê 8L
  'prod-18': pexels(14920870, 600), // Cát Gỗ Sinh Học Hữu Cơ Cat's Best 5L (viên nén gỗ)

  // Phụ kiện, Đồ chơi & Lưu trú
  'prod-6': pexels(11060021, 600),  // Chuồng Nệm Lưu Trú & Giường Ấm Bọc Nhung
  'prod-19': pexels(15813470, 600), // Trụ Cào Móng Dây Thừng Sisal Cho Mèo
  'prod-20': pexels(7533352, 600),  // Balo Phi Hành Gia Vận Chuyển Thú Cưng
  'prod-21': pexels(28042328, 600), // Khay Vệ Sinh Mèo & Phụ Kiện Mèo
  'prod-22': pexels(15637651, 600), // Dây Dắt Kèm Áo Yếm Ngực Phản Quang
  'prod-23': pexels(8434633, 600),  // Bát Ăn Đôi Inox Chống Trượt
  'prod-24': pexels(29928678, 600), // Cần Câu Mèo Gắn Lông Vũ & Chuông

  // Mỹ phẩm Spa & Dưỡng lông
  'prod-3': pexels(19145888, 600),  // Sữa Tắm Dưỡng Lông SOS 530ml
  'prod-25': pexels(29653139, 600), // Sữa Tắm Khử Mùi & Trị Nấm Davis 355ml
  'prod-26': pexels(6825488, 600),  // Xịt Khử Mùi Hôi Chuồng Trại Bioline 500ml
  'prod-27': pexels(8498543, 600),  // Lược Chải Lông Tự Động Đẩy Lông Rụng

  // Dinh dưỡng & Vitamin
  'prod-28': pexels(4021798, 600),  // Gel Dinh Dưỡng Nourse Nutri-Gel 120g (tuýp gel)
  'prod-29': pexels(17604755, 600), // Viên Uống Canxi Nano Bio-Calci (lọ viên uống)
  'prod-30': pexels(15897780, 600), // Dầu Cá Hồi Tự Nhiên Wild Salmon Oil 250ml
  'prod-31': pexels(17820706, 600), // Men Tiêu Hóa Vi Sinh Probiotic Pet

  // Y tế & Thuốc thú y
  'prod-5': pexels(7020055, 600),   // Thuốc Nhỏ Gáy Phòng Trị Ve Rận Frontline Plus (ống nhỏ giọt)
  'prod-32': pexels(12672390, 600), // Thuốc Xổ Giun Sán Drontal Plus (vỉ viên)
};

export const getProductImage = (product) => {
  if (!product) return FALLBACK_IMAGES.product;
  if (product.image) return product.image;
  if (product.id && PRODUCT_IMAGES[product.id]) return PRODUCT_IMAGES[product.id];

  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (name.includes('pate')) return PRODUCT_IMAGES['prod-4'];
  if (name.includes('xương')) return PRODUCT_IMAGES['prod-8'];
  if (name.includes('bánh') || name.includes('súp thưởng')) return PRODUCT_IMAGES['prod-16'];
  if (name.includes('cát gỗ')) return PRODUCT_IMAGES['prod-18'];
  if (name.includes('cát') || name.includes('khay vệ sinh')) return PRODUCT_IMAGES['prod-2'];
  if (name.includes('chuồng') || name.includes('nệm') || name.includes('giường')) return PRODUCT_IMAGES['prod-6'];
  if (name.includes('cào móng')) return PRODUCT_IMAGES['prod-19'];
  if (name.includes('balo')) return PRODUCT_IMAGES['prod-20'];
  if (name.includes('dây dắt') || name.includes('yếm')) return PRODUCT_IMAGES['prod-22'];
  if (name.includes('bát')) return PRODUCT_IMAGES['prod-23'];
  if (name.includes('cần câu') || name.includes('đồ chơi')) return PRODUCT_IMAGES['prod-24'];
  if (name.includes('sữa tắm')) return PRODUCT_IMAGES['prod-3'];
  if (name.includes('xịt')) return PRODUCT_IMAGES['prod-26'];
  if (name.includes('lược')) return PRODUCT_IMAGES['prod-27'];
  if (name.includes('dầu cá')) return PRODUCT_IMAGES['prod-30'];
  if (name.includes('canxi') || name.includes('vitamin')) return PRODUCT_IMAGES['prod-29'];
  if (name.includes('nhỏ gáy') || name.includes('ve rận')) return PRODUCT_IMAGES['prod-5'];
  if (name.includes('giun')) return PRODUCT_IMAGES['prod-32'];

  if (cat.includes('thức ăn')) return PRODUCT_IMAGES['prod-1'];
  if (cat.includes('bánh thưởng')) return PRODUCT_IMAGES['prod-16'];
  if (cat.includes('cát')) return PRODUCT_IMAGES['prod-2'];
  if (cat.includes('phụ kiện')) return PRODUCT_IMAGES['prod-6'];
  if (cat.includes('mỹ phẩm')) return PRODUCT_IMAGES['prod-3'];
  if (cat.includes('dinh dưỡng')) return PRODUCT_IMAGES['prod-29'];
  if (cat.includes('y tế')) return PRODUCT_IMAGES['prod-5'];

  return FALLBACK_IMAGES.product;
};
