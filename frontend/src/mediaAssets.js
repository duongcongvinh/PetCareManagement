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

// 3. REAL PHOTOGRAPHS MATCHING ALL 24 SERVICES (100% visually distinct, HTTP 200 verified)
export const SERVICE_IMAGES = {
  // Spa & Grooming (8 gói)
  s1: pexels(19145873, 640),  // Spa Grooming Trọn Gói (Black Poodle blow-drying in salon)
  s4: pexels(19145882, 640),  // Tắm Dưỡng Lông Thảo Dược & Khử Mùi (Shih Tzu bath)
  s5: pexels(6816870, 640),   // Cắt Tỉa Tạo Kiểu Nghệ Thuật (Scissors styling Yorkie)
  s6: pexels(39166817, 640),  // Nhuộm Lông Hữu Cơ & Tạo Kiểu (Fluffy wet white dog)
  s7: pexels(6235113, 640),   // Cạo Vôi Răng Siêu Âm (Vet dental exam)
  s8: pexels(6816851, 640),   // Vệ Sinh Toàn Diện: Cắt Móng, Mài Móng (Cat nail grinding)
  s25: pexels(6222967, 640),  // Tắm Sục Ozone Nano Kháng Khuẩn (Yorkie in white bath tub)
  s26: pexels(8498543, 640),  // Gỡ Rối Lông Chuyên Sâu & Ủ Collagen (Brushing long cream coat)

  // Y Tế & Tiêm Phòng (6 gói)
  s2: pexels(7469213, 640),   // Tiêm Vắc Xin 5 Trong 1 Cho Chó (Brown dog syringe vaccine)
  s11: pexels(39550277, 640), // Tiêm Vắc Xin 4 Bệnh Cho Mèo (Vet examining orange tabby cat)
  s12: pexels(28644464, 640), // Tiêm Phòng Bệnh Dại Định Kỳ (Vet holding Frenchie puppy)
  s27: pexels(39550290, 640), // Tiêm Vắc Xin 7 Bệnh Cho Chó (Vets examining Shiba Inu)
  s28: pexels(6816857, 640),  // Tiêm Vắc Xin Phòng Giảm Bạch Cầu Mèo (Cat vaccination)
  s29: pexels(6816865, 640),  // Gắn Microchip Định Danh Quốc Tế ISO (Vet close-up procedure)

  // Khám Bệnh, Trị Liệu & Sinh Sản (10 gói)
  s3: pexels(5732461, 640),   // Khám Sức Khỏe Tổng Quát & Ống Nghe (Dog in doctor coat)
  s13: pexels(28644631, 640), // Tẩy Giun Sán & Nhỏ Gáy Phòng Ve Rận (Vet checking beige cat)
  s14: pexels(6816838, 640),  // Trị Liệu Nấm Da & Phục Hồi Lông (White Persian cat coat care)
  s30: pexels(7020055, 640),  // Xét Nghiệm Máu Sinh Hóa 14 Chỉ Số (Lab dropper vials)
  s15: pexels(6235114, 640),  // Siêu Âm Thai Kỹ Thuật Số Doppler (Vet & German Shepherd)
  s16: pexels(18859864, 640), // Gói Hộ Sinh Đỡ Đẻ & Hồi Sức Sơ Sinh 24/7 (Newborn puppies)
  s17: pexels(7121954, 640),  // Phẫu Thuật Mổ Đẻ Cấp Cứu Vô Trùng (Surgical team & anesthesia)
  s18: pexels(6235238, 640),  // Triệt Sản Mèo/Chó Cái Công Nghệ Minilap (Vet & Pomeranian)
  s19: pexels(6816862, 640),  // Thiến Chó Đực / Mèo Đực An Toàn (Post-op cat paw bandage)
  s20: pexels(33394245, 640), // Phẫu Thuật Cấp Cứu Viêm Tử Cung Tích Mủ (Vet meds & syringes)
};

export const getServiceImage = (service) => {
  if (!service) return FALLBACK_IMAGES.service;
  if (service.image) return service.image;
  if (service.id && SERVICE_IMAGES[service.id]) return SERVICE_IMAGES[service.id];

  const name = (service.name || '').toLowerCase();
  const cat = (service.category || '').toLowerCase();

  // Exact 1-to-1 matching for all 24 MongoDB live services (specific checks BEFORE generic fallbacks!)
  if (name.includes('trọn gói') || name.includes('7 bước')) return SERVICE_IMAGES.s1;
  if (name.includes('tắm dưỡng') || name.includes('khử mùi hôi')) return SERVICE_IMAGES.s4;
  if (name.includes('tạo kiểu nghệ thuật') || name.includes('teddy')) return SERVICE_IMAGES.s5;
  if (name.includes('nhuộm')) return SERVICE_IMAGES.s6;
  if (name.includes('vôi răng') || name.includes('răng')) return SERVICE_IMAGES.s7;
  if (name.includes('móng') || name.includes('tuyến hôi')) return SERVICE_IMAGES.s8;
  if (name.includes('ozone') || name.includes('tắm sục')) return SERVICE_IMAGES.s25;
  if (name.includes('gỡ rối') || name.includes('collagen')) return SERVICE_IMAGES.s26;

  if (name.includes('7 bệnh') || name.includes('recombitek')) return SERVICE_IMAGES.s27;
  if (name.includes('5 trong 1') || name.includes('vanguard')) return SERVICE_IMAGES.s2;
  if (name.includes('giảm bạch cầu') || name.includes('viêm phúc mạc')) return SERVICE_IMAGES.s28;
  if (name.includes('4 bệnh') || name.includes('purevax')) return SERVICE_IMAGES.s11;
  if (name.includes('bệnh dại') || name.includes('rabisin')) return SERVICE_IMAGES.s12;
  if (name.includes('microchip') || name.includes('hộ chiếu')) return SERVICE_IMAGES.s29;

  if (name.includes('xét nghiệm máu') || name.includes('sinh hóa')) return SERVICE_IMAGES.s30;
  if (name.includes('siêu âm thai') || name.includes('doppler')) return SERVICE_IMAGES.s15;
  if (name.includes('đỡ đẻ') || name.includes('hộ sinh')) return SERVICE_IMAGES.s16;
  if (name.includes('viêm tử cung') || name.includes('pyometra')) return SERVICE_IMAGES.s20;
  if (name.includes('mổ đẻ') || name.includes('c-section')) return SERVICE_IMAGES.s17;
  if (name.includes('thiến')) return SERVICE_IMAGES.s19;
  if (name.includes('triệt sản') || name.includes('minilap')) return SERVICE_IMAGES.s18;
  if (name.includes('nấm da') || name.includes('xông hơi')) return SERVICE_IMAGES.s14;
  if (name.includes('tẩy giun') || name.includes('ve rận')) return SERVICE_IMAGES.s13;
  if (name.includes('tổng quát') || name.includes('ổ bụng')) return SERVICE_IMAGES.s3;

  // Generic fallbacks for any newly created custom services
  if (name.includes('cắt tỉa')) return SERVICE_IMAGES.s5;
  if (name.includes('phẫu thuật')) return SERVICE_IMAGES.s17;
  if (name.includes('vắc xin') && name.includes('mèo')) return SERVICE_IMAGES.s11;
  if (name.includes('vắc xin') || name.includes('tiêm')) return SERVICE_IMAGES.s2;
  if (name.includes('siêu âm')) return SERVICE_IMAGES.s3;
  if (cat.includes('sinh sản')) return SERVICE_IMAGES.s15;
  if (cat.includes('tiêm') || cat.includes('khám')) return SERVICE_IMAGES.s3;
  return SERVICE_IMAGES.s1;
};

// 4. REAL PRODUCT PACKAGING PHOTOGRAPHS MATCHING ALL 175 PRODUCTS (100% unique verified packshots)
export const PRODUCT_IMAGES = {
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
  'prod-1': 'https://product.hstatic.net/200000263355/product/z6630814392636_af0be846d4c58fc774625084c742c5cb_5029c8da229446dcabdb1d83ef4281bb.jpg',
  'prod-4': 'https://happypaws.vn/wp-content/uploads/WHISKAS-1.png',
  'prod-7': 'https://petzonebd.com/wp-content/uploads/2022/02/me-o-tuna-adult-cat-food-1-2kg.webp',
  'prod-10': 'https://www.petexpress.com.ph/cdn/shop/files/10216184PedigreeAdultBeefChunksinGravyWDF-B_1000x.png?v=1791774688',
  'prod-11': 'https://apac.orijenpetfoods.com/dw/image/v2/bfdw_prd/on/demandware.static/-/Sites-orijen-ap-master-catalog/en/dw88da7cb2/2023/SIX%20FISH/ORIJEN%20Six%20Fish%20Dog%20Front%20Right%2011.4kg%20APAC.png?sw=450',
  'prod-12': 'https://marspetcareaprimocdn.petcare.global/c07c5431-0801-4119-9d41-b2490007dcc8/c07c5431-0801-4119-9d41-b2490007dcc8_DownloadAsJpg.jpg',
  'prod-13': 'https://image.makewebcdn.com/makeweb/m_1920x0/EymvaO4rg/RC_Dog/Royal_canin_poodle_puppy_2sizes.jpg',
  'prod-8': 'https://www.petmart.vn/wp-content/uploads/2019/04/Xuong-Canxi-cho-cho-VEGEBRAND-Orgo-Calcium-Bone.jpg',
  'prod-9': 'https://petkingdomucung.vn/wp-content/uploads/2024/04/goi-dung-thu-uc-ga-say-kho-long-do-trung-vien-catnip-rau-cu-cho-cho-meo-goi-20g.jpg',
  'prod-14': 'https://happypaws.vn/wp-content/uploads/33AE52C1-EAFA-4DFF-830F-0174FA8E6B66.jpeg',
  'prod-15': 'https://i.ebayimg.com/images/g/X60AAeSwh5lp28qc/s-l400.jpg',
  'prod-16': 'https://doggyman.com.vn/uploads/source/uploads/products/san-pham-cho-cho/thuc-an/82289-banh-quy-vi-sua-580g-doggyman-00.jpg',
  'prod-2': 'https://bizweb.dktcdn.net/100/412/667/collections/cat-dau-nanh-6l-tofu-cat-litter-6l-1.png?v=1646366428203',
  'prod-17': 'https://bizweb.dktcdn.net/100/091/443/products/1-027152b6-e380-4e1a-ab33-e656b723bfdf.jpg',
  'prod-18': 'https://media.zooplus.com/bilder/2/400/20342_pla_catsbest_original_5l_hs_01_2.jpg?width=400&format=webp',
  'prod-6': 'https://bizweb.dktcdn.net/thumb/large/100/307/433/products/nha-dem-ni-hinh-nha-mai-ngoi-nem-cho-thu-cung-cutepets-3-bff9be0b-ec18-4ce7-b300-e8f44243950b.jpg',
  'prod-19': 'https://product.hstatic.net/200000657865/product/2_cf9c9dc8a37d4569a7f2f6b0775fca3d.jpg',
  'prod-20': 'https://fexafkqzpbzjcupvbfhe.supabase.co/storage/v1/object/public/product-images/products/a711d9d4-5417-475d-a287-87c85ca31eac/2b1e59dd-4f42-4c3b-8d6b-b00307d98be3/balo-cho-ch-m-o-phi-h-nh-gia-h-nh-m-t-m-o-paddy-pe.jpg',
  'prod-21': 'https://cdn.cunstores.com/2023/11/khay-ve-sinh-thanh-cao-01.webp',
  'prod-22': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/092/840/products/bo-day-dat-yem-police-3.jpg',
  'prod-23': 'https://www.petmart.vn/wp-content/uploads/2013/03/bat-an-doi-cho-cho-meo-trang-men-inox-super-design-double-round-bowls.jpg',
  'prod-24': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/092/840/products/can-cau-long-vu-gan-chuong.jpg',
  'prod-3': 'https://suatamsos.com/wp-content/uploads/2022/12/z4548197394245_d1a442ce4159960bb9d8ef5ae10d6e3a-400x400.png',
  'prod-25': 'https://happypaws.vn/wp-content/uploads/davis-benzoyl-peroxide-shampoo-355ml-viem-da-mun-mu-ba-nhon.jpg',
  'prod-26': 'https://www.biolinepet.com/wp-content/uploads/2023/01/Bioline%EF%BC%882046%EF%BC%89%E6%8A%91%E8%8F%8C%EF%BC%88%E6%B6%88%E6%AF%92%EF%BC%89%E9%99%A4%E8%87%AD%E5%96%B7%E5%89%82500ml-1.jpg',
  'prod-27': 'https://product.hstatic.net/1000217401/product/30_3d269259412e4293b31e1f8186de62fc.png',
  'prod-28': 'https://www.vietpet.net/wp-content/uploads/2018/10/kem-bo-sung-canxi-cho-cho-meo-nourse-nutritional-gel-calcium.jpg',
  'prod-29': 'https://bizweb.dktcdn.net/thumb/1024x1024/100/307/433/products/canxi-nano.jpg',
  'prod-30': 'https://wholisticpetorganics.com/cdn/shop/files/WildAlaskanSalmonOilBottle-4.png?v=1790969746',
  'prod-31': 'https://cpcpetcare.com/wp-content/uploads/2023/08/Dr-CPC-men-tieu-hoa-1.png',
  'prod-5': 'https://frontline.com.vn/sites/default/files/2024-12/Frontline%20Plus%20cat%20packaging-min.jpg',
  'prod-32': 'https://assets.elanco.com/8e0bf1c2-1ae4-001f-9257-f2be3c683fb1/5a549b46-f5e0-49e2-8855-15b8a38ef148/drontal-plus-for-dogs-package-with-tablet-desktop-update.jpg?w=1600&q=75&auto=format',
  'prod-33': 'https://product.hstatic.net/1000238938/product/a586c8017e864034897ae2c84b6dc027_7fe1b85070da4bd8800c8979920a1538.jpg',
  'prod-34': 'https://happypaws.vn/wp-content/uploads/royal-canin-inoor-for-cat.png',
  'prod-35': 'https://product.hstatic.net/200000263355/product/z5518900737543_d328549c7e3a3b4bf0cf4ce9f2086e32_3f1494fe6f024630921aa23398f33cfd.jpg',
  'prod-36': 'https://cdn.hstatic.net/products/1000217401/churu_oil_chicken__1__89e1212c2ad4490fade8285c74e185f2.png',
  'prod-37': 'https://product.hstatic.net/200000263355/product/z5276831116693_4fda3b25097e6a0a7f8799229f8b7711_64946d02468c466ba4326bc5f6760239.jpg',
  'prod-38': 'https://product.hstatic.net/1000217401/product/221_2647b580119e4fe5bdeda4487ecead0d.png',
  'prod-39': 'https://happypaws.vn/wp-content/uploads/cat-ve-sinh-1.png',
  'prod-40': 'https://product.hstatic.net/200000263355/product/z4668411044311_40f2850ff2ee4d52ca75156e2189d666_70ecd8f20ab24922b573a5c497b322fe.jpg',
  'prod-41': 'https://cdn.hstatic.net/products/1000217401/bb222628aac6452f8e9ba2c1d5ec764b_6c58c168b5674a63b9e1440e80c7d328.png',
  'prod-42': 'https://product.hstatic.net/200000263355/product/z4385740914668_489132be6b576bd23f380addb489e396_062c64bb42e844bfbd74ed4f9f93ce19.jpg',
  'prod-43': 'https://product.hstatic.net/1000238938/product/217e7111846c4bcd88149157bb7ede1f_99202a2a3d924a1c8f33f4c0de1c7f8a.png',
  'prod-44': 'https://product.hstatic.net/200000263355/product/z4415300328271_22a3f73c8562a30b659a8281e2ea2acc_7b242c0d798b44b4bc285e6e9acbac63.jpg',
  'prod-45': 'https://www.petmart.vn/wp-content/uploads/2023/04/gel-dinh-duong-cho-meo-tri-tieu-bui-long-gimcat-malt-soft-extra.jpg',
  'prod-46': 'https://www.petmart.vn/wp-content/uploads/2020/12/nuoc-suc-mieng-ho-tro-xuong-khop-cho-cho-tropiclean-dental-health-hip-joint.jpg',
  'prod-47': 'https://product.hstatic.net/1000217401/product/26_4e4badabe9a54b238e04cc0409945264.png',
  'prod-48': 'https://product.hstatic.net/200000263355/product/mzaa3891_198950acb635488d91dd40fb99441dc6.jpg',
  'prod-49': 'https://product.hstatic.net/200000263355/product/z4538150180379_c1b43ba9ad17624791ae7115eb09e980_b2f83459b82b4378884574866cb86859.jpg',
  'prod-50': 'https://happypaws.vn/wp-content/uploads/ANF-Korean-6-Free-Duck.png',
  'prod-51': 'https://happypaws.vn/wp-content/uploads/Snappytom-lamb-lon.jpg',
  'prod-52': 'https://cdn.hstatic.net/products/1000217401/1bf4661e4b534afaaa1a219d986e9fd4_df34970b27d44c0a8ca43284b6161575.png',
  'prod-53': 'https://product.hstatic.net/1000217401/product/324_514d73eeb5084d4aa7ca538417c89104.png',
  'prod-54': 'https://cdn.hstatic.net/products/200000263355/12_2a0ddcb717b14ac4b71d2ad85f37682b.png',
  'prod-55': 'https://product.hstatic.net/200000263355/product/z5251197714200_2d90e82994795b2df09771ffbb5119b5_055cd6f2564b4f0c9b7a2336247401a1.jpg',
  'prod-56': 'https://happypaws.vn/wp-content/uploads/bowwow-80-cay-xuc-xich-pho-mai-va-bap.jpg',
  'prod-57': 'https://product.hstatic.net/1000238938/product/f0cea98a1eb794094ee710e7d5fee1e8_41a6986dfc424132a7a35c081b7ced16.jpg',
  'prod-58': 'https://product.hstatic.net/200000263355/product/z6103789028279_5b825e7a2b9e81df6291014086437334_c91674d246514d9dbc3ddd316d874b74.jpg',
  'prod-59': 'https://product.hstatic.net/1000217401/product/313_e4242f9e1fa4418ca2fa03e51b25471f.png',
  'prod-60': 'https://www.petmart.vn/wp-content/uploads/2020/10/banh-thuong-cho-cho-vi-thit-vit-jerhigh-duck-stick-.jpg',
  'prod-61': 'https://product.hstatic.net/200000263355/product/z4448466146442_cb1d65411a6dd001f40612b7ef2ece4d_7c33bde3684a4a0a91ac4255e31acdb2.jpg',
  'prod-62': 'https://cdn.hstatic.net/products/1000217401/a80a1aca21db4be7833c2cfbcb1e9aa7_798288a9c48648b899bee83c2f8c4a31.png',
  'prod-63': 'https://product.hstatic.net/1000217401/product/222_10736dc6a04c4b08af24d47591f09b3c.png',
  'prod-64': 'https://cdn.hstatic.net/products/200000263355/436_aa5d64d15ab043c18ec1b77b03be0736.png',
  'prod-65': 'https://product.hstatic.net/1000238938/product/1fb284d0ef3d4ec1a97089a32293bad9_15bf0987c1a547448db871f7b027eaab.png',
  'prod-66': 'https://product.hstatic.net/1000217401/product/251_804a0aae4ca843f0a302d05e4eb9b5a1.png',
  'prod-67': 'https://cdn.hstatic.net/products/1000217401/34b03b96d0c747099eaad01f555eaa6f_8b6838fd15f84d5bba849c6357615cbf.png',
  'prod-68': 'https://happypaws.vn/wp-content/uploads/cat_thuy_tinh_cac_vi.jpg',
  'prod-69': 'https://product.hstatic.net/1000217401/product/262_f55916a1692d4e09805b1a2fa0ca51e3.png',
  'prod-70': 'https://www.petmart.vn/wp-content/uploads/2023/05/cat-ve-sinh-cho-meo-go-thong-iris-mnc-50.jpg',
  'prod-71': 'https://cdn.hstatic.net/products/1000217401/petfive_large_11kg_35b94e9f18934cf290f726bcaf1236c3.png',
  'prod-72': 'https://www.petmart.vn/wp-content/uploads/2020/12/nem-cho-cho-meo-hinh-vuong-hoa-tiet-tho-cam-elite.jpg',
  'prod-73': 'https://product.hstatic.net/200000263355/product/vn-11134207-7ras8-m0u19obqjh5b74_8543fd08afe945849de49843a359df20.jpg',
  'prod-74': 'https://product.hstatic.net/1000217401/product/106_3847516468e844b4981e9caaba8dc918.png',
  'prod-75': 'https://www.petmart.vn/wp-content/uploads/2019/09/sua-tam-cho-cho-diet-khuan-joyce-dolls-102-anti-bacterium-formula.jpg',
  'prod-76': 'https://product.hstatic.net/200000263355/product/z5892172748737_af0239f965dc69729b860ccc5d131671_cfacd1755c2c47dc9704108a302a0f50.jpg',
  'prod-77': 'https://product.hstatic.net/200000263355/product/z5543554419667_fb6748f352e9baf6071e1eb7024e76e8_d65b09660259476e89618c6d55abc916.jpg',
  'prod-78': 'https://www.petmart.vn/wp-content/uploads/2020/10/kem-bam-mong-cho-meo-dele-q022-pet-nail-clipper.jpg',
  'prod-79': 'https://product.hstatic.net/1000217401/product/167_2392df257c9540149c61a727a7a56322.png',
  'prod-80': 'https://happypaws.vn/wp-content/uploads/shampoo-long-ngan-new.gif',
  'prod-81': 'https://product.hstatic.net/200000263355/product/bmfw4456_072094a52ec145debda6457fae666bc4.jpg',
  'prod-82': 'https://product.hstatic.net/200000263355/product/ebc88122e7fc4eac9076259bdf481066_18b62e67aaca42b4a22c519ccdec7255.jpg',
  'prod-83': 'https://product.hstatic.net/200000263355/product/saaw5251_dfbffa155c854522abfef49b68792828.jpg',
  'prod-84': 'https://product.hstatic.net/1000217401/product/9_5adf719bc46145a499c86c4998a6eb0e.png',
  'prod-85': 'https://happypaws.vn/wp-content/uploads/virbac-nutri-plus-gel-dinh-duong-tong-hop.jpg',
  'prod-86': 'https://cdn.hstatic.net/products/200000263355/416_9fdb1a7f081f46308b548ae4c4164387.png',
  'prod-87': 'https://www.petmart.vn/wp-content/uploads/2016/01/thuoc-bo-sung-vitamin-tong-hop-cho-cho-vegebrand-fruit-vitamin.jpg',
  'prod-88': 'https://cdn.hstatic.net/products/1000217401/d45b0b97a6cb41ab93b3f916cfb62249_66fae88175ec4f65a548f36401170b95.png',
  'prod-89': 'https://happypaws.vn/wp-content/uploads/Revolution-26-den-7.5kg-nho-gay-tri-ky-sinh.jpg',
  'prod-90': 'https://happypaws.vn/wp-content/uploads/Nexgard-vien-nhai-trị-ve-rạn-ghẻ-cho-chó-4-10KG.jpg',
  'prod-91': 'https://happypaws.vn/wp-content/uploads/Alkin-Fungikür-Spray-50ml-xit-chuyen-tri-nam-vay-gau.jpg',
  'prod-92': 'https://product.hstatic.net/1000238938/product/z4973763338598_93e052575fde7a371253a19bccc65a9a_120559cc45804732a7bbeb450339da91.jpg',
  'prod-93': 'https://happypaws.vn/wp-content/uploads/Lee-Webster-Tear-Stain-dug-dich-ve-sinh-mat.jpg',
  'prod-94': 'https://happypaws.vn/wp-content/uploads/davis-miconazole-shampoo-355ml-nhiem-trung-da-do-nam.jpg',
  'prod-95': 'https://cdn.hstatic.net/products/1000217401/920d8da8be4e49fbbc2ddefe63444931_fe9c5c6e64df4e06b675e482b196d80e.png',
  'prod-96': 'https://product.hstatic.net/1000217401/product/51_acf3045f7ea548d1b7111ad68feff7fd.png',
  'prod-97': 'https://cdn.hstatic.net/products/1000217401/_2023_cm_1717153398_08f07f47_progressive_e921162cda66459ca3201fc8626f7d00.jpg',
  'prod-98': 'https://happypaws.vn/wp-content/uploads/1A330B61-45A4-46AE-BC4A-8A235FBFA255.jpeg',
  'prod-99': 'https://www.petmart.vn/wp-content/uploads/2013/02/thuoc-nho-gay-tri-ve-ran-cho-cho-40-60kg-merial-frontline-plus.jpg',
  'prod-100': 'https://product.hstatic.net/1000238938/product/bdbe0c5355284aefac0a16db7dc3e082_dda1b06d20e54187be7a3a0352aafd0a.jpg',
  'prod-101': 'https://product.hstatic.net/1000238938/product/b0acfc1b9f04440e83a44b44a624567b_276e209dcb19436fa7a7852e60edbb92.png',
  'prod-102': 'https://happypaws.vn/wp-content/uploads/kitcat-miếng-Grilled-Tuna-Fiber-1.png',
  'prod-103': 'https://happypaws.vn/wp-content/uploads/Feline-Greenies-Dental-Treat-Catnip.jpg',
  'prod-104': 'https://product.hstatic.net/1000217401/product/75_2325bb57610d4a668d6588270afaabc8.png',
  'prod-105': 'https://www.petmart.vn/wp-content/uploads/2023/03/banh-thuong-cho-meo-thit-that-fairy-chef-freeze-dried-raw-6in1.jpg',
  'prod-106': 'https://product.hstatic.net/200000263355/product/hleu5254_da3feb3f05fa4438ab7632925cd6793b.jpg',
  'prod-107': 'https://happypaws.vn/wp-content/uploads/Temptations-Blissful-Catnip-Flavor.jpg',
  'prod-108': 'https://happypaws.vn/wp-content/uploads/Lumi-Cat-Litter.png',
  'prod-109': 'https://product.hstatic.net/1000217401/product/277_dd00d0634f854956ab758f4782a46879.png',
  'prod-110': 'https://product.hstatic.net/1000217401/product/cat_ve_sinh_80e507b851b849528cd081d8fca1c0db.png',
  'prod-111': 'https://product.hstatic.net/1000217401/product/280_8b93ae53017742d9b87280d728c8845f.png',
  'prod-112': 'https://product.hstatic.net/1000217401/product/236_3a3189110e1e44fa9d6ab0c8ab28638c.png',
  'prod-113': 'https://cdn.hstatic.net/products/200000263355/279_0bfce5ed8f5148e69ff390ac2d288c87.png',
  'prod-114': 'https://product.hstatic.net/1000217401/product/141_4197227080ee432680dd349227708e0b.png',
  'prod-115': 'https://product.hstatic.net/200000263355/product/z5686021406325_7c9ac2dc1cf32fb41f767566250d9856_033604b76f4a4c1c93644be562cdab15.jpg',
  'prod-116': 'https://product.hstatic.net/1000238938/product/61e7b6dcf3bc4bee8776b01a86216021_0c408b1b0eed4ae4b26eb4ece94b5fb6.jpg',
  'prod-117': 'https://product.hstatic.net/1000238938/product/52ad520aca854edcbf3f83d4b49ff721_86de1fce533e4f2d9cdfd9dc6199bd3d.jpg',
  'prod-118': 'https://www.petmart.vn/wp-content/uploads/2020/10/Xit-duong-long-cho-cho-meo-Joyce-Dolls-PetSkin-Nourishing-Fluid.jpg',
  'prod-119': 'https://product.hstatic.net/200000263355/product/z4440533237687_dd2068397ebf25f3fd2e30a20541285b_1214d92c683c4074841b72de89e2313c.jpg',
  'prod-120': 'https://cdn.hstatic.net/products/1000217401/kit_cat_singapore__1__9555ecb99f2247bc93aee0cd133f3b74.png',
  'prod-121': 'https://happypaws.vn/wp-content/uploads/Daily-Best-for-Dog-60-vien-tong-hop-vitamin.jpg',
  'prod-122': 'https://happypaws.vn/wp-content/uploads/Calcium-Phosphorus-50-vien-canxi.jpg',
  'prod-123': 'https://product.hstatic.net/1000217401/product/107_cb428180f5d1452fb88cba475b113fd4.png',
  'prod-124': 'https://cdn.hstatic.net/products/1000217401/s_n_ph_m_m_i__-_2026-04-07t164147.523_b913e05d037d47908344831a9569357f.png',
  'prod-125': 'https://product.hstatic.net/1000217401/product/1_c976724192f449cd914a1ba6e13bb791.png',
  'prod-126': 'https://product.hstatic.net/1000217401/product/140_e50cec263fe54c0b9b5fdcc0372a2113.png',
  'prod-127': 'https://product.hstatic.net/200000263355/product/tjfy2022_2046c6fa923c41fa86b4f94b4563b2ee.jpg',
  'prod-128': 'https://product.hstatic.net/1000217401/product/99_630f75bb557b4cfc878bc4841b3dbb06.png',
  'prod-129': 'https://product.hstatic.net/200000263355/product/z4538150177291_ad65dbd3ef3ed464a5fb52c3dfa9db6f_92d6fd7cd2404b1c83ee3710a82832dc.jpg',
  'prod-130': 'https://product.hstatic.net/200000263355/product/z4538204761959_1d6bbc950efaf79b0ae486a31f0410d6_4f75a51c077246d9a5a1a570f5afc8e9.jpg',
  'prod-131': 'https://product.hstatic.net/200000263355/product/z4538204753387_ffd6ce706b820674c43e8be1d5394f24_fd08fe064590462e8b32b9388f3891c0.jpg',
  'prod-132': 'https://product.hstatic.net/200000263355/product/rrqp2344_a67a81fcd1f1447f89ba92d428ca8ae3.jpg',
  'prod-133': 'https://happypaws.vn/wp-content/uploads/thuc-an-natural-core-c3-bene-3012-cho-meo-thit-ga-ca-hoi.jpg',
  'prod-134': 'https://product.hstatic.net/1000238938/product/truong_thanh_thit_ga_c5646f8a45e7490db25aa1e23e9558db.jfif',
  'prod-135': 'https://happypaws.vn/wp-content/uploads/ganador-adult.png',
  'prod-136': 'https://product.hstatic.net/200000263355/product/z5955054043862_f81b3508e557725d8c72ecaf224c0791_e753909d66dd4d8dbe7716e1f2bfe5a9.jpg',
  'prod-137': 'https://happypaws.vn/wp-content/uploads/nekko-tuna-kanikama.png',
  'prod-138': 'https://product.hstatic.net/1000217401/product/79_b83f339443dd4c3ea71da25707b060dd.png',
  'prod-139': 'https://product.hstatic.net/1000217401/product/64_dedf0ff8ea1943f9bfdcd76449511d7c.png',
  'prod-140': 'https://product.hstatic.net/200000263355/product/z4476630050651_1aef44b3f680f9ae676f6273325733d2_192ecb76becd47528145d198a71c38eb.jpg',
  'prod-141': 'https://product.hstatic.net/200000263355/product/z6103786274860_41daff9518bf6dcb7fc6b86b3fbea9f2_a3e3a372d05843c7943eec4bea3446ad.jpg',
  'prod-142': 'https://cdn.hstatic.net/products/200000263355/37_6fabcbe041b04f508ba3aba252e96bb2.png',
  'prod-143': 'https://cdn.hstatic.net/products/200000263355/409_604da9895a9947f0838fa6495b97564f.png',
  'prod-144': 'https://www.petmart.vn/wp-content/uploads/2023/04/thit-ga-cuon-thanh-sua-cho-cho-bowwow-hansang-tteokgalbi-chicken.jpg',
  'prod-145': 'https://product.hstatic.net/1000217401/product/119_11974701baed4ed2be9a4732dfbca427.png',
  'prod-146': 'https://cdn.hstatic.net/products/1000217401/673dc41884c34d96b4affd3790720c51_a47944bcfbae416fb458b5fbe1404d9e.png',
  'prod-147': 'https://cdn.hstatic.net/products/1000238938/45c7b2b6269d40818fd85fef8fa31a11_72d700e8b57a4d83ad51b0bbe0ac6386.jpg',
  'prod-148': 'https://product.hstatic.net/200000263355/product/z4668410209345_c656e370a3b732dc046c74a3dbadfeba_f23744bb3c3e4b0280edfbb5d66b4b70.jpg',
  'prod-149': 'https://product.hstatic.net/200000263355/product/0f92ca1666554ed7919837a66a5122f9_b81a44aad9f84c1b955cc78c6b619842.jpg',
  'prod-150': 'https://product.hstatic.net/200000263355/product/z4440536177095_b4c33a0914607988703ed02cea2f9b3a_5390b6df1406455a977509489e5252b8.jpg',
  'prod-151': 'https://happypaws.vn/wp-content/uploads/potty-Pads-50-pads-cam.png',
  'prod-152': 'https://product.hstatic.net/1000238938/product/09e184cca0b24c159093b7ec5d0cabf5_bd41909e11db4a548a3120714d4a9fbf.jpg',
  'prod-153': 'https://product.hstatic.net/1000217401/product/5a3ed77714f545099eb30e696bee4bf8_e08e6fcf80e84f988bdd2de9ed8679c1.jpg',
  'prod-154': 'https://cdn.hstatic.net/products/200000263355/337_24fd28bb9c814ae8a6df6a6dbf9111fe.png',
  'prod-155': 'https://product.hstatic.net/200000263355/product/z5607356100938_a96872000d85b5f43478aea97c6eaa88_f358ab0d922a4c4588402e50f2de2c38.jpg',
  'prod-156': 'https://product.hstatic.net/200000263355/product/z5607357281295_eb6da0801b13d1d293a8d890f3ea98b9_1c5a59b8487b4443a38357f899b6d027.jpg',
  'prod-157': 'https://product.hstatic.net/200000263355/product/z4431903017736_bfe04d31bb94d73285da38744f86a90e_a563a8d0e42245dfb78ab7fe5766a273.jpg',
  'prod-158': 'https://happypaws.vn/wp-content/uploads/Bioion-Pet-Wet-Wipes-Khan-uot-danh-cho-thu-cung-bioion.jpg',
  'prod-159': 'https://www.petmart.vn/wp-content/uploads/2019/10/luoc-chai-long-rung-cho-cho-meo-furminator-edsheddingtool.jpg',
  'prod-160': 'https://cdn.hstatic.net/products/1000238938/b9a6431bec444437abd317c5616fe212_e442d00718354123a23bc5451ddc026f.jpg',
  'prod-161': 'https://www.petmart.vn/wp-content/uploads/2023/04/gel-dinh-duong-cho-meo-ho-tro-mien-dich-gimcat-multi-vitamin-paste.jpg',
  'prod-162': 'https://www.petmart.vn/wp-content/uploads/2017/09/bot-dinh-duong-cho-cho-kich-thich-tieu-hoa-vegebrand-help-digestion-nutrition-powder.jpg',
  'prod-163': 'https://www.petmart.vn/wp-content/uploads/2026/03/dau-ca-cho-meo-wild-caught-omega-3-fish-oil-for-cats1.jpg',
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
