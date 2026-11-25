// Real, high-resolution photography library (Pexels) mapped 1-to-1 to Petzera avatars, pets, services & products

const pexels = (id, width = 640) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const HERO_IMAGES = {
  spaBanner: pexels(7210748, 960),       // Groomer working with fluffy white dog
  shopBanner: pexels(28426509, 960),     // British Shorthair cat indoors
  reproBanner: pexels(6235114, 960),     // Vet ultrasound examination on dog
  heroMain: pexels(7210748, 1200),       // Flagship hero: fluffy white dog spa grooming
  heroGolden: pexels(30810890, 900),     // Flagship hero collage: smiling Golden Retriever
  heroCat: pexels(28426509, 900),        // Flagship hero collage: British Shorthair cat
  heroPoodle: pexels(29477518, 600),     // Review pet avatar: adorable Toy Poodle
  heroBritishCat: pexels(17089872, 600), // Review pet avatar: British Shorthair cat
};

// 100% verified pet-only HD stock videos (Pexels Dog Grooming/Bathing/Brushing & Wikimedia Cat/Dog)
// paired with visually verified HD Pexels pet photography posters
export const HERO_VIDEOS = [
  {
    id: 'reel-spa',
    tag: '✂️ Spa & Tắm Sấy 5★',
    badge: 'LIVE HD • SPA & GROOMING',
    title: 'Tắm Sấy Thảo Dược & Cắt Tỉa Nghệ Thuật',
    subtitle: 'Quy trình Spa 7 bước an toàn tuyệt đối bởi Master Groomer — sạch thơm mềm mượt cả tuần.',
    duration: '0:15',
    sources: [
      { url: 'https://videos.pexels.com/video-files/4498305/4498305-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
      { url: 'https://videos.pexels.com/video-files/4498307/4498307-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
      { url: 'https://videos.pexels.com/video-files/5998471/5998471-hd_1920_1080_30fps.mp4', type: 'video/mp4' }
    ],
    poster: pexels(7210748, 1200)
  },
  {
    id: 'reel-dog',
    tag: '🐶 Chăm Sóc Cún Cưng',
    badge: 'LIVE HD • CHẢI LÔNG & THÚ Y',
    title: 'Nâng Niu Từng Khoảnh Khắc Cùng Cún Yêu',
    subtitle: 'Chải dưỡng mượt lông, tiêm phòng vắc xin & khám sức khỏe thú y toàn diện 24/7.',
    duration: '0:14',
    sources: [
      { url: 'https://videos.pexels.com/video-files/5732525/5732525-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
      { url: 'https://videos.pexels.com/video-files/5998471/5998471-hd_1920_1080_30fps.mp4', type: 'video/mp4' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/2015-11-11_Labradoodle_Berlin.webm', type: 'video/webm' }
    ],
    poster: pexels(30810890, 1200)
  },
  {
    id: 'reel-cat',
    tag: '🐱 Thế Giới Mèo Cưng',
    badge: 'LIVE HD • CHĂM SÓC MÈO 5★',
    title: 'Không Gian Êm Ái & Dinh Dưỡng Chuẩn Nhật',
    subtitle: 'Spa dịu nhẹ cho mèo, Khoa Sinh Sản hộ sinh 24/7 & thức ăn hạt Royal Canin chính hãng.',
    duration: '0:12',
    sources: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/2022-10-18_LJUBLJANA_Doma_CARNIVORA_Felis_catus_DOMA%C4%8CA_MA%C4%8CKA_2.webm', type: 'video/webm' },
      { url: 'https://videos.pexels.com/video-files/4585193/4585193-hd_1920_1080_25fps.mp4', type: 'video/mp4' },
      { url: 'https://videos.pexels.com/video-files/4585193/4585193-hd_1920_1080_30fps.mp4', type: 'video/mp4' }
    ],
    poster: pexels(28426509, 1200)
  }
];

export const FALLBACK_IMAGES = {
  user: pexels(29582994, 300),
  pet: pexels(30810890, 400),
  service: pexels(19145873, 640),
  product: pexels(8434635, 640),
};

// 1. CUTE REAL PET AVATARS FOR USER PROFILES (NO HUMAN FACES)
export const USER_AVATARS = {
  'u-1': pexels(30810890, 300),  // Nguyễn Văn Admin (Golden Retriever)
  'u-2': pexels(29477518, 300),  // Trần Thị Chăm Sóc (Toy Poodle)
  'u-3': pexels(30936336, 300),  // Lê Văn Kho (Scottish Fold Cat)
  'u-4': pexels(29582994, 300),  // Phạm Minh Anh (Cún con giữa đồng hoa cúc)
  'u-5': pexels(17089872, 300),  // Hoàng Thị Yến (Mèo Anh Lông Ngắn)
};

export const getUserAvatar = (user) => {
  if (!user) return FALLBACK_IMAGES.user;
  if (user.id && USER_AVATARS[user.id]) return USER_AVATARS[user.id];
  if (user.avatar) return user.avatar;
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

// 3. REAL PHOTOGRAPHS MATCHING ALL 18 SERVICES
export const SERVICE_IMAGES = {
  // Spa & Grooming
  s1: pexels(19145873, 640),  // Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt)
  s4: pexels(19145882, 640),  // Tắm Dưỡng Lông Thảo Dược & Khử Mùi
  s5: pexels(19145869, 640),  // Cắt Tỉa Tạo Kiểu Nghệ Thuật
  s6: pexels(19145862, 640),  // Nhuộm Lông Hữu Cơ & Tạo Kiểu
  s7: pexels(6235113, 640),   // Cạo Vôi Răng Siêu Âm (Vet dental exam)
  s8: pexels(19145875, 640),  // Vệ Sinh Toàn Diện: Cắt Mài Móng

  // Y Tế & Tiêm Phòng
  s2: pexels(7469213, 640),   // Tiêm Vắc Xin 5 Trong 1 Cho Chó
  s11: pexels(7303957, 640),  // Tiêm Vắc Xin 4 Bệnh Cho Mèo
  s12: pexels(28644464, 640), // Tiêm Phòng Bệnh Dại Định Kỳ

  // Khám Bệnh, Trị Liệu & Sinh Sản
  s3: pexels(5732461, 640),   // Khám Sức Khỏe Tổng Quát & Ống Nghe
  s13: pexels(28644631, 640), // Tẩy Giun Sán & Nhỏ Gáy Phòng Ve Rận
  s14: pexels(19145891, 640), // Trị Liệu Nấm Da & Phục Hồi Lông
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

  if (name.includes('siêu âm thai') || name.includes('doppler')) return SERVICE_IMAGES.s15;
  if (name.includes('đỡ đẻ') || name.includes('hộ sinh')) return SERVICE_IMAGES.s16;
  if (name.includes('viêm tử cung') || name.includes('pyometra')) return SERVICE_IMAGES.s20;
  if (name.includes('mổ đẻ') || name.includes('c-section')) return SERVICE_IMAGES.s17;
  if (name.includes('thiến')) return SERVICE_IMAGES.s19;
  if (name.includes('triệt sản') || name.includes('minilap')) return SERVICE_IMAGES.s18;
  if (name.includes('phẫu thuật')) return SERVICE_IMAGES.s17;
  if (name.includes('răng')) return SERVICE_IMAGES.s7;
  if (name.includes('móng')) return SERVICE_IMAGES.s8;
  if (name.includes('nhuộm')) return SERVICE_IMAGES.s6;
  if (name.includes('nấm da') || name.includes('xông hơi')) return SERVICE_IMAGES.s14;
  if (name.includes('tẩy giun') || name.includes('ve rận')) return SERVICE_IMAGES.s13;
  if (name.includes('tắm dưỡng')) return SERVICE_IMAGES.s4;
  if (name.includes('cắt tỉa')) return SERVICE_IMAGES.s5;
  if (name.includes('bệnh dại')) return SERVICE_IMAGES.s12;
  if (name.includes('vắc xin') && name.includes('mèo')) return SERVICE_IMAGES.s11;
  if (name.includes('vắc xin') || name.includes('tiêm')) return SERVICE_IMAGES.s2;
  if (name.includes('siêu âm')) return SERVICE_IMAGES.s3;
  if (cat.includes('sinh sản')) return SERVICE_IMAGES.s15;
  if (cat.includes('tiêm') || cat.includes('khám')) return SERVICE_IMAGES.s3;
  return SERVICE_IMAGES.s1;
};

// 4. REAL PRODUCT PACKAGING PHOTOGRAPHS MATCHING ALL 44 PRODUCTS (Google Search verified packshots)
export const PRODUCT_IMAGES = {
  // 12 Sản phẩm đồng bộ từ VPet's (vpets.vn/san-pham)
  'vp-1': 'https://product.hstatic.net/1000217401/product/11_1__de311d7853be40148552c73d9876b76a.png',
  'vp-2': 'https://cdn.royalcanin-weshare-online.io/rVb4yIEBBKJuub5q4uF0/v53/2522020012-kitten-dry-packshot-b1-med-res',
  'vp-3': 'https://pethouse.com.vn/wp-content/uploads/2023/01/ANF-6-free-thuc-an-hat-huu-co-cho-meo-truong-thanh-2kg-2.jpg',
  'vp-4': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/307/433/products/sua-bot-cho-cho-dr-kyan-predogen-lon-400g-cutepets3-jpeg.jpg?v=1792036487077',
  'vp-5': 'https://petchicvietnam.com/wp-content/uploads/2020/05/Precaten-400g.jpg',
  'vp-6': 'https://lovingcatsworldwide.com/cdn/shop/files/touchdog-r-surface-control-reversible-thick-cushioned-travel-sporty-water-resistant-fashion-pet-dog-mat-bed-930209.jpg?v=1770058848&width=1946',
  'vp-7': 'https://product.hstatic.net/1000238938/product/long-van-chuyen-hang-khong__1__87910b9756e5422697a5b96c1fda07c4_1024x1024.jpg',
  'vp-8': 'https://product.hstatic.net/200000264739/product/luoc_chai_long_co_nut_bam_cleanpet_s_cho_cho_meo_1_1e1f60bbbc7e43be891c1549a8808aea_master.jpg',
  'vp-9': 'https://i5.walmartimages.com/seo/Flexi-New-Comfort-Extra-Small-Tape-Retractable-Dog-Leash-10-ft-Pink-For-Dogs-up-to-26-lbs_f63f6025-3e0f-4f4c-a8ba-4b4e0506f4d5.6aa05b8dad3e966f237f127262473ca4.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
  'vp-10': 'https://down-vn.img.susercontent.com/file/8e826cf7932ed3096dff7704ee5468f3',
  'vp-11': 'https://www.phukienthucungdep.com/upload/images/%C4%91%E1%BB%93%20ch%C6%A1i%20m%C3%A8o/chuot-do-choi-cho-meo-1.jpg',
  'vp-12': 'https://cdn-img-v2.mybota.vn/uploadv2/web/12/12107/product/2019/10/31/02/59/1572490741_huong-dan-vs-han-quoc.jpg?v=4',

  // Thức ăn hạt & Pate
  'prod-1': 'https://product.hstatic.net/1000217401/product/11_1__de311d7853be40148552c73d9876b76a.png',
  'prod-4': 'https://happypaws.vn/wp-content/uploads/WHISKAS-1.png',
  'prod-7': 'https://petzonebd.com/wp-content/uploads/2022/02/me-o-tuna-adult-cat-food-1-2kg.webp',
  'prod-10': 'https://www.petexpress.com.ph/cdn/shop/files/10216184PedigreeAdultBeefChunksinGravyWDF-B_1000x.png?v=1791774688',
  'prod-11': 'https://apac.orijenpetfoods.com/dw/image/v2/bfdw_prd/on/demandware.static/-/Sites-orijen-ap-master-catalog/en/dw88da7cb2/2023/SIX%20FISH/ORIJEN%20Six%20Fish%20Dog%20Front%20Right%2011.4kg%20APAC.png?sw=450',
  'prod-12': 'https://marspetcareaprimocdn.petcare.global/c07c5431-0801-4119-9d41-b2490007dcc8/c07c5431-0801-4119-9d41-b2490007dcc8_DownloadAsJpg.jpg',
  'prod-13': 'https://image.makewebcdn.com/makeweb/m_1920x0/EymvaO4rg/RC_Dog/Royal_canin_poodle_puppy_2sizes.jpg',

  // Bánh thưởng & Snack
  'prod-8': 'https://www.petmart.vn/wp-content/uploads/2019/04/Xuong-Canxi-cho-cho-VEGEBRAND-Orgo-Calcium-Bone.jpg',
  'prod-9': 'https://petkingdomucung.vn/wp-content/uploads/2024/04/goi-dung-thu-uc-ga-say-kho-long-do-trung-vien-catnip-rau-cu-cho-cho-meo-goi-20g.jpg',
  'prod-14': 'https://media.istockphoto.com/id/504820137/vi/anh/th%E1%BB%8Bt-b%C3%B2-kh%C3%B4-jerky.jpg?s=612x612&w=0&k=20&c=YAEu5z2rvHiaBjbS_yLegqUIubS-TPm5lXGgt4CR-yg=',
  'prod-15': 'https://i.ebayimg.com/images/g/X60AAeSwh5lp28qc/s-l400.jpg',
  'prod-16': 'https://doggyman.com.vn/uploads/source/uploads/products/san-pham-cho-cho/thuc-an/82289-banh-quy-vi-sua-580g-doggyman-00.jpg',

  // Cát vệ sinh
  'prod-2': 'https://bizweb.dktcdn.net/100/412/667/collections/cat-dau-nanh-6l-tofu-cat-litter-6l-1.png?v=1646366428203',
  'prod-17': 'https://bizweb.dktcdn.net/100/091/443/products/1-027152b6-e380-4e1a-ab33-e656b723bfdf.jpg',
  'prod-18': 'https://media.zooplus.com/bilder/2/400/20342_pla_catsbest_original_5l_hs_01_2.jpg?width=400&format=webp',

  // Phụ kiện, Đồ chơi & Lưu trú
  'prod-6': 'https://bizweb.dktcdn.net/thumb/large/100/307/433/products/nha-dem-ni-hinh-nha-mai-ngoi-nem-cho-thu-cung-cutepets-3-bff9be0b-ec18-4ce7-b300-e8f44243950b.jpg',
  'prod-19': 'https://product.hstatic.net/200000657865/product/2_cf9c9dc8a37d4569a7f2f6b0775fca3d.jpg',
  'prod-20': 'https://fexafkqzpbzjcupvbfhe.supabase.co/storage/v1/object/public/product-images/products/a711d9d4-5417-475d-a287-87c85ca31eac/2b1e59dd-4f42-4c3b-8d6b-b00307d98be3/balo-cho-ch-m-o-phi-h-nh-gia-h-nh-m-t-m-o-paddy-pe.jpg',
  'prod-21': 'https://cdn.cunstores.com/2023/11/khay-ve-sinh-thanh-cao-01.webp',
  'prod-22': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/092/840/products/bo-day-dat-yem-police-3.jpg',
  'prod-23': 'https://www.petmart.vn/wp-content/uploads/2013/03/bat-an-doi-cho-cho-meo-trang-men-inox-super-design-double-round-bowls.jpg',
  'prod-24': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/092/840/products/can-cau-long-vu-gan-chuong.jpg',

  // Mỹ phẩm Spa & Dưỡng lông
  'prod-3': 'https://suatamsos.com/wp-content/uploads/2022/12/z4548197394245_d1a442ce4159960bb9d8ef5ae10d6e3a-400x400.png',
  'prod-25': 'https://happypaws.vn/wp-content/uploads/davis-benzoyl-peroxide-shampoo-355ml-viem-da-mun-mu-ba-nhon.jpg',
  'prod-26': 'https://www.biolinepet.com/wp-content/uploads/2023/01/Bioline%EF%BC%882046%EF%BC%89%E6%8A%91%E8%8F%8C%EF%BC%88%E6%B6%88%E6%AF%92%EF%BC%89%E9%99%A4%E8%87%AD%E5%96%B7%E5%89%82500ml-1.jpg',
  'prod-27': 'https://product.hstatic.net/200000264739/product/luoc_chai_long_co_nut_bam_cleanpet_s_cho_cho_meo_1_1e1f60bbbc7e43be891c1549a8808aea_master.jpg',

  // Dinh dưỡng & Vitamin
  'prod-28': 'https://www.vietpet.net/wp-content/uploads/2018/10/kem-bo-sung-canxi-cho-cho-meo-nourse-nutritional-gel-calcium.jpg',
  'prod-29': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/307/433/products/canxi-nano.jpg',
  'prod-30': 'https://wholisticpetorganics.com/cdn/shop/files/WildAlaskanSalmonOilBottle-4.png?v=1790969746',
  'prod-31': 'https://cpcpetcare.com/wp-content/uploads/2023/08/Dr-CPC-men-tieu-hoa-1.png',

  // Y tế & Thuốc thú y
  'prod-5': 'https://frontline.com.vn/sites/default/files/2024-12/Frontline%20Plus%20cat%20packaging-min.jpg',
  'prod-32': 'https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/5a549b46-f5e0-49e2-8855-15b8a38ef148/drontal-plus-for-dogs-package-with-tablet-desktop-update.jpg?w=1600&q=75&auto=format',
};

export const getProductFallbackImage = (product) => {
  const cat = (product?.category || '').toLowerCase();
  if (cat.includes('thức ăn') || cat.includes('bánh thưởng')) return pexels(8434635, 600);
  if (cat.includes('cát')) return pexels(13705506, 600);
  if (cat.includes('phụ kiện')) return pexels(11060021, 600);
  if (cat.includes('mỹ phẩm')) return pexels(19145888, 600);
  if (cat.includes('dinh dưỡng')) return pexels(15897780, 600);
  if (cat.includes('y tế')) return pexels(7020055, 600);
  return FALLBACK_IMAGES.product;
};

export const getProductImage = (product) => {
  if (!product) return FALLBACK_IMAGES.product;
  if (product.image) return product.image;
  if (product.id && PRODUCT_IMAGES[product.id]) return PRODUCT_IMAGES[product.id];

  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (name.includes('sữa bột') || name.includes('predogen')) return PRODUCT_IMAGES['vp-4'];
  if (name.includes('precaten')) return PRODUCT_IMAGES['vp-5'];
  if (name.includes('lồng vận chuyển') || name.includes('balo')) return PRODUCT_IMAGES['prod-20'];
  if (name.includes('dung dịch') || name.includes('forcan') || name.includes('xịt')) return PRODUCT_IMAGES['prod-26'];
  if (name.includes('pate')) return PRODUCT_IMAGES['prod-4'];
  if (name.includes('xương')) return PRODUCT_IMAGES['prod-8'];
  if (name.includes('bánh') || name.includes('súp thưởng')) return PRODUCT_IMAGES['prod-16'];
  if (name.includes('cát gỗ')) return PRODUCT_IMAGES['prod-18'];
  if (name.includes('cát') || name.includes('khay vệ sinh')) return PRODUCT_IMAGES['prod-2'];
  if (name.includes('chuồng') || name.includes('nệm') || name.includes('giường')) return PRODUCT_IMAGES['prod-6'];
  if (name.includes('cào móng')) return PRODUCT_IMAGES['prod-19'];
  if (name.includes('dây dắt') || name.includes('yếm')) return PRODUCT_IMAGES['prod-22'];
  if (name.includes('bát')) return PRODUCT_IMAGES['prod-23'];
  if (name.includes('cần câu') || name.includes('đồ chơi') || name.includes('chuột')) return PRODUCT_IMAGES['prod-24'];
  if (name.includes('sữa tắm')) return PRODUCT_IMAGES['prod-3'];
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
