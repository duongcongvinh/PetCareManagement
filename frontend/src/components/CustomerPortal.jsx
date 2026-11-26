import React, { useState, useEffect } from 'react';
import ReproductionClinic from './ReproductionClinic';
import BrandLogo from './BrandLogo';
import HomeLandingPage from './HomeLandingPage';
import AboutUsSection from './AboutUsSection';
import AddressMapPicker from './AddressMapPicker';
import PayOSEmbeddedBox from './PayOSEmbeddedBox';
import CustomerReviewSection from './CustomerReviewSection';
import { apiService } from '../apiService';
import { 
  PawPrint, Calendar, ShoppingBag, Plus, Minus, Trash2, Clock, ShieldCheck, HeartHandshake, 
  Truck, Award, Sparkles, Tag, Search, Filter, Star, ShoppingCart, CheckCircle, ArrowRight, ArrowLeft, 
  PhoneCall, Mail, MapPin, Heart, Zap, User, Edit3, Lock, CreditCard, QrCode, Copy, Check, AlertCircle, RefreshCw, X,
  Gift, RotateCcw, Flame, Activity
} from 'lucide-react';
import { toast, confirmModal } from './ToastNotification';
import { CONTACT_INFO, openZaloQrModal } from '../contactConfig';
import { HERO_IMAGES, FALLBACK_IMAGES, getPetAvatar, getServiceImage, getProductImage, getProductFallbackImage } from '../mediaAssets';

const getCategoryVisual = (category) => {
  switch (category) {
    case 'Thức ăn':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #fff7ed 0%, #ffedd5 55%, #fed7aa 100%)',
        accent: '#ea580c',
        badgeBg: '#fff7ed',
        badgeColor: '#c2410c',
        emoji: '🥣'
      };
    case 'Bánh thưởng':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #fefce8 0%, #fef08a 55%, #fde047 100%)',
        accent: '#ca8a04',
        badgeBg: '#fef9c3',
        badgeColor: '#854d0e',
        emoji: '🍖'
      };
    case 'Cát vệ sinh':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #f0fdf4 0%, #dcfce7 55%, #bbf7d0 100%)',
        accent: '#16a34a',
        badgeBg: '#dcfce7',
        badgeColor: '#15803d',
        emoji: '📦'
      };
    case 'Phụ kiện':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #eff6ff 0%, #dbeafe 55%, #bfdbfe 100%)',
        accent: '#2563eb',
        badgeBg: '#dbeafe',
        badgeColor: '#1d4ed8',
        emoji: '🎾'
      };
    case 'Mỹ phẩm Spa':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #faf5ff 0%, #f3e8ff 55%, #e9d5ff 100%)',
        accent: '#9333ea',
        badgeBg: '#f3e8ff',
        badgeColor: '#7e22ce',
        emoji: '🧴'
      };
    case 'Dinh dưỡng':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #fdf2f8 0%, #fce7f3 55%, #fbcfe8 100%)',
        accent: '#db2777',
        badgeBg: '#fce7f3',
        badgeColor: '#be185d',
        emoji: '💊'
      };
    case 'Y tế':
      return {
        bg: 'radial-gradient(circle at 50% 35%, #ecfeff 0%, #cffafe 55%, #a5f3fc 100%)',
        accent: '#0891b2',
        badgeBg: '#cffafe',
        badgeColor: '#0e7490',
        emoji: '🏥'
      };
    default:
      return {
        bg: 'radial-gradient(circle at 50% 35%, #f8fafc 0%, #f1f5f9 55%, #e2e8f0 100%)',
        accent: '#ea580c',
        badgeBg: '#f1f5f9',
        badgeColor: '#475569',
        emoji: '🛍️'
      };
  }
};

const getProductBrand = (p) => {
  if (!p) return 'Petzera Mall';
  if (p.brand && String(p.brand).trim()) return String(p.brand).trim();
  if (!p.name) return 'Petzera Mall';
  const n = p.name;
  if (n.includes('Royal Canin')) return 'Royal Canin';
  if (n.includes('6 Free')) return 'ANF 6 Free';
  if (n.includes('SmartHeart')) return 'SmartHeart';
  if (n.includes('Monge')) return 'Monge Italy';
  if (n.includes('Snappy Tom')) return 'Snappy Tom';
  if (n.includes('Zenith')) return 'Zenith Korea';
  if (n.includes('Wanpy')) return 'Wanpy';
  if (n.includes('JerHigh')) return 'JerHigh';
  if (n.includes('Bowwow')) return 'Bowwow Korea';
  if (n.includes('Predogen')) return 'Dr. Kyan Predogen';
  if (n.includes('Precaten')) return 'Dr. Kyan Precaten';
  if (n.includes('Esbilac')) return 'PetAg Esbilac';
  if (n.includes('KMR')) return 'PetAg KMR';
  if (n.includes('Touchdog')) return 'Touchdog';
  if (n.includes('Petkit')) return 'Petkit Smart';
  if (n.includes('Pian Pian')) return 'Pian Pian';
  if (n.includes('New Comfort')) return 'Flexi Germany';
  if (n.includes('Forcan')) return 'Forcans Korea';
  if (n.includes('Orijen')) return 'Orijen Canada';
  if (n.includes('Whiskas')) return 'Whiskas';
  if (n.includes('Me-O')) return 'Me-O';
  if (n.includes('Pedigree')) return 'Pedigree';
  if (n.includes('Orgo')) return 'Orgo Dental';
  if (n.includes('Ciao')) return 'Inaba Ciao';
  if (n.includes('Cature')) return 'Cature Tofu';
  if (n.includes('Kit Cat')) return 'Kit Cat';
  if (n.includes('Lapaw')) return 'Lapaw';
  if (n.includes('Best')) return "Cat's Best";
  if (n.includes('SOS')) return 'SOS Japan';
  if (n.includes('Joyce')) return 'Joyce & Dolls';
  if (n.includes('Yu Hương')) return 'Yu Taiwan';
  if (n.includes('Davis')) return 'Davis USA';
  if (n.includes('Bioline')) return 'Bioline Germany';
  if (n.includes('Virbac')) return 'Virbac France';
  if (n.includes('GimCat')) return 'GimCat Germany';
  if (n.includes('Nourse')) return 'Nourse Vet';
  if (n.includes('Wild Salmon')) return 'Wild Alaskan';
  if (n.includes('Bio-Calci') || n.includes('Bio-Flora') || n.includes('Bio-Gentadrop')) return 'Bio-Pharm';
  if (n.includes('Probiotic')) return 'Probiotic Pet';
  if (n.includes('Frontline')) return 'Frontline Plus';
  if (n.includes('NexGard')) return 'NexGard Spectra';
  if (n.includes('Revolution')) return 'Revolution Plus';
  if (n.includes('Bravecto')) return 'Bravecto MSD';
  if (n.includes('Fungikur')) return 'Fungikur Vet';
  if (n.includes('Eye-Envy')) return 'Eye-Envy USA';
  if (n.includes('Advocate')) return 'Advocate Bayer';
  if (n.includes('Taste of the Wild')) return 'Taste of the Wild';
  if (n.includes('Greenies')) return 'Greenies USA';
  if (n.includes('Goodies')) return 'Goodies';
  if (n.includes('Temptations')) return 'Temptations';
  if (n.includes('Kong Classic')) return 'KONG USA';
  if (n.includes('TropiClean')) return 'TropiClean USA';
  if (n.includes('Pet Naturals')) return 'Pet Naturals USA';
  if (n.includes('Acana')) return 'Acana Canada';
  if (n.includes('Natural Core')) return 'Natural Core';
  if (n.includes('Catseye')) return 'Catseye Korea';
  if (n.includes('Ganador')) return 'Ganador France';
  if (n.includes("King's Pet")) return "King's Pet";
  if (n.includes('Nekko')) return 'Nekko Japan';
  if (n.includes('Sheba')) return 'Sheba Japan';
  if (n.includes("Hill's")) return "Hill's USA";
  if (n.includes('Whimzees')) return 'Whimzees';
  if (n.includes('Budle')) return "Budle'Budle Korea";
  if (n.includes('Furminator')) return 'FURminator USA';
  if (n.includes('PlaqueOff')) return 'ProDen PlaqueOff';
  if (n.includes('Sanpet')) return 'Sanpet Vet';
  if (n.includes('Drontal')) return 'Drontal Elanco';
  return 'Petzera Mall';
};

const getProductRichDetails = (p) => {
  if (!p) return { summary: '', highlights: [], usage: '', origin: 'Chính hãng nhập khẩu', targetPet: 'Chó & Mèo' };
  const n = (p.name || '').toLowerCase();
  const cat = p.category || '';

  const targetPet =
    (p.targetPet && String(p.targetPet).trim()) ||
    (n.includes('chó') && n.includes('mèo') ? 'Chó & Mèo mọi lứa tuổi'
    : n.includes('mèo con') || n.includes('kitten') ? 'Mèo con từ 2 – 12 tháng tuổi'
    : n.includes('mèo') || cat === 'Cát vệ sinh' ? 'Mèo mọi giống loài'
    : n.includes('chó con') || n.includes('puppy') ? 'Chó con & cún đang phát triển'
    : n.includes('chó') || n.includes('cún') ? 'Chó trưởng thành / giống nhỏ'
    : 'Chó & Mèo thú cưng');

  const origin =
    (p.origin && String(p.origin).trim()) ||
    (n.includes('royal canin') ? 'Pháp / Hàn Quốc (Royal Canin chính hãng)'
    : n.includes('6 free') || n.includes('forcan') ? 'Hàn Quốc (Nhập khẩu chính ngạch)'
    : n.includes('predogen') || n.includes('precaten') ? 'Việt Nam — Công thức dinh dưỡng Dr. Kyan'
    : n.includes('orijen') ? 'Canada (Champion Petfoods)'
    : n.includes('flexi') || n.includes('new comfort') || n.includes('best') || n.includes('bioline') ? 'Đức (Tiêu chuẩn Châu Âu)'
    : n.includes('davis') || n.includes('salmon') ? 'Hoa Kỳ (USA)'
    : n.includes('frontline') ? 'Pháp (Boehringer Ingelheim)'
    : n.includes('drontal') ? 'Đức (Elanco Animal Health)'
    : n.includes('ciao') ? 'Nhật Bản (Inaba Foods)'
    : 'Phân phối chính hãng bởi Petzera');

  const applyCustom = (base) => ({
    ...base,
    summary: (p.description && String(p.description).trim()) || base.summary,
    usage: (p.usageGuide && String(p.usageGuide).trim()) || base.usage,
  });

  if (cat === 'Thức ăn') {
    return applyCustom({
      summary: `${p.name} cung cấp nguồn đạm chất lượng cao, vitamin và khoáng chất cân bằng giúp thú cưng tiêu hóa tốt, hạn chế mùi phân, nuôi dưỡng da khỏe và bộ lông bóng mượt mỗi ngày.`,
      highlights: [
        'Hàm lượng protein & chất béo cân bằng theo khuyến nghị bác sĩ thú y.',
        'Hỗ trợ hệ tiêu hóa khỏe mạnh nhờ chất xơ hòa tan & Prebiotic tự nhiên.',
        'Bổ sung Omega-3, Omega-6 và kẽm giúp lông mềm mượt, giảm rụng lông.',
        n.includes('tặng') ? 'Ưu đãi đặc biệt đi kèm quà tặng Pate dinh dưỡng chính hãng.' : 'Hạt giòn thơm tự nhiên, kích thích vị giác ngay cả với bé kén ăn.'
      ],
      usage: 'Cho ăn trực tiếp theo khẩu phần khuyến nghị theo cân nặng trên bao bì, luôn chuẩn bị sẵn nước sạch bên cạnh. Đóng kín miệng túi sau khi mở và bảo quản nơi khô ráo thoáng mát.',
      origin,
      targetPet
    });
  }
  if (cat === 'Dinh dưỡng') {
    return applyCustom({
      summary: `${p.name} là giải pháp bổ sung vi chất, canxi, đạm dễ hấp thu hoặc lợi khuẩn đường ruột thiết yếu giúp thú cưng phục hồi thể lực nhanh, tăng đề kháng và phát triển khung xương vững chắc.`,
      highlights: [
        'Công thức dễ hấp thu, thân thiện với hệ tiêu hóa nhạy cảm của chó mèo nhỏ.',
        'Hỗ trợ tăng sức đề kháng, phát triển chiều cao, răng chắc và lông bóng khỏe.',
        'Phù hợp cho bé biếng ăn, thú cưng sau sinh, sau ốm hoặc giai đoạn cai sữa.',
        n.includes('tặng') ? 'Đi kèm quà tặng khuyến mãi hấp dẫn từ chương trình VPet\'s / Petzera.' : 'An toàn sử dụng hằng ngày theo đúng liều lượng khuyến nghị.'
      ],
      usage: n.includes('sữa bột')
        ? 'Pha 1–2 muỗng sữa bột với nước ấm khoảng 40°C, khuấy tan đều và cho bé uống khi còn ấm. Đậy chặt nắp lon sau khi sử dụng.'
        : 'Cho ăn trực tiếp hoặc trộn đều vào thức ăn hằng ngày theo liều lượng tương ứng cân nặng trên bao bì sản phẩm.',
      origin,
      targetPet
    });
  }
  if (cat === 'Bánh thưởng') {
    return applyCustom({
      summary: `${p.name} là món snack thưởng thơm ngon làm từ nguyên liệu chọn lọc, lý tưởng dùng khi huấn luyện, gắn kết tình cảm và hỗ trợ vệ sinh răng miệng hằng ngày.`,
      highlights: [
        'Nguyên liệu tự nhiên giàu đạm, không chất bảo quản độc hại hay phẩm màu tổng hợp.',
        'Kích thích vị giác, hỗ trợ huấn luyện phản xạ và giảm stress cho thú cưng.',
        'Giúp làm sạch mảng bám răng và giảm hôi miệng hiệu quả.',
        'Đóng gói tiện lợi, dễ dàng mang theo khi đi dạo hoặc du lịch.'
      ],
      usage: 'Dùng làm phần thưởng giữa các bữa ăn chính (không thay thế hoàn toàn bữa chính). Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.',
      origin,
      targetPet
    });
  }
  if (cat === 'Cát vệ sinh') {
    return applyCustom({
      summary: `${p.name} có khả năng thấm hút vượt trội, vón cục nhanh trong vài giây và khóa chặt mùi hôi khó chịu, giữ không gian sống của gia đình luôn sạch sẽ và không bụi mịn.`,
      highlights: [
        'Thấm hút tức thì, vón cục chắc tay không vỡ vụn khi xúc dọn.',
        'Công nghệ khử mùi tự nhiên, hạn chế tối đa mùi amoniac khó chịu.',
        '99% không bụi, an toàn cho đường hô hấp và bàn chân nhạy cảm của mèo.',
        'Tiết kiệm lượng cát tiêu hao, dễ phân hủy thân thiện môi trường.'
      ],
      usage: 'Đổ lớp cát dày khoảng 5–7cm vào khay vệ sinh. Dọn bỏ phần cát vón mỗi ngày và bổ sung thêm cát mới định kỳ.',
      origin,
      targetPet
    });
  }
  if (cat === 'Mỹ phẩm Spa') {
    return applyCustom({
      summary: `${p.name} là dòng sản phẩm chăm sóc lông da & vệ sinh chuyên dụng được nhiều phòng khám thú y và Spa Grooming tin dùng nhờ độ an toàn cao, dịu nhẹ và hiệu quả rõ rệt.`,
      highlights: [
        'Công thức pH cân bằng riêng cho làn da nhạy cảm của chó mèo, không gây kích ứng.',
        'Hỗ trợ làm sạch sâu, khử mùi hôi lâu dài và chăm sóc bộ lông mềm mượt.',
        'Thiết kế tiện dụng, dễ thao tác ngay tại nhà như ở Spa chuyên nghiệp.',
        'Sản phẩm chính hãng kiểm định rõ ràng, nguồn gốc minh bạch.'
      ],
      usage: n.includes('lược')
        ? 'Chải nhẹ nhàng theo chiều mọc của lông để gỡ rối và lấy lông rụng; nhấn nút bấm mặt sau để đẩy sạch lớp lông bám trên răng lược.'
        : n.includes('dung dịch') || n.includes('xịt')
          ? 'Lắc đều trước khi sử dụng, xịt một lượng vừa đủ vào vị trí cần hướng dẫn đi vệ sinh hoặc khu vực cần khử mùi.'
          : 'Làm ướt toàn bộ lông bằng nước ấm, thoa đều sữa tắm và massage nhẹ 3–5 phút rồi xả sạch, sấy khô hoàn toàn.',
      origin,
      targetPet
    });
  }
  if (cat === 'Y tế') {
    return applyCustom({
      summary: `${p.name} là sản phẩm thú y chính hãng giúp phòng ngừa và điều trị hiệu quả ký sinh trùng (ve rận, bọ chét, giun sán), bảo vệ sức khỏe toàn diện cho thú cưng và cả gia đình.`,
      highlights: [
        'Hiệu quả nhanh, phổ tác động rộng giúp bảo vệ bé suốt nhiều tuần liền.',
        'Được bác sĩ thú y khuyên dùng định kỳ trong phác đồ phòng bệnh chuẩn.',
        'An toàn khi sử dụng đúng liều theo cân nặng thực tế của thú cưng.',
        'Cam kết hàng chính hãng nguyên hộp, hạn sử dụng dài.'
      ],
      usage: 'Sử dụng đúng liều lượng theo cân nặng của chó/mèo và lặp lại định kỳ theo hướng dẫn bác sĩ thú y. Không dùng cho thú cưng dưới độ tuổi khuyến nghị trên hộp.',
      origin,
      targetPet
    });
  }
  return applyCustom({
    summary: `${p.name} được thiết kế chắc chắn, thẩm mỹ cao và an toàn tuyệt đối cho thú cưng, mang lại trải nghiệm thoải mái khi nghỉ ngơi, vui chơi hay di chuyển cùng chủ nuôi.`,
    highlights: [
      'Chất liệu cao cấp, bền bỉ, không góc cạnh sắc nhọn và thân thiện với thú cưng.',
      'Kiểu dáng hiện đại, dễ dàng vệ sinh lau rửa sau khi sử dụng.',
      'Kích thước chuẩn, tối ưu sự thoải mái cho chó mèo trong mọi hoạt động.',
      'Bảo hành đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất.'
    ],
    usage: 'Kiểm tra kích thước phù hợp với cân nặng của bé trước khi dùng. Vệ sinh định kỳ bằng khăn ẩm hoặc dung dịch vệ sinh thú cưng dịu nhẹ.',
    origin,
    targetPet
  });
};

const isReproductiveService = (s) => {
  if (!s) return false;
  const cat = (s.category || '').toLowerCase();
  const n = (s.name || '').toLowerCase();
  return (
    cat.includes('sinh sản') ||
    n.includes('siêu âm thai') ||
    n.includes('doppler') ||
    n.includes('đỡ đẻ') ||
    n.includes('hộ sinh') ||
    n.includes('mổ đẻ') ||
    n.includes('c-section') ||
    n.includes('triệt sản') ||
    n.includes('minilap') ||
    n.includes('thiến') ||
    n.includes('viêm tử cung') ||
    n.includes('pyometra')
  );
};

const getServiceRichDetails = (s) => {
  if (!s) return { steps: [], prepNote: '', targetPet: 'Chó & Mèo', standard: 'Chuẩn Petzera 5★' };
  const cat = (s.category || '').toLowerCase();
  const n = (s.name || '').toLowerCase();

  const parseCustomSteps = (raw) => {
    if (!raw || !String(raw).trim()) return null;
    const lines = String(raw)
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*(?:bước\s*\d+\s*[:.-]?|\d+\s*[.)-]|\-|\•)\s*/i, '').trim())
      .filter(Boolean);
    if (lines.length === 0) return null;
    return lines.map((line, idx) => {
      const sepIdx = line.indexOf(':');
      if (sepIdx > 0 && sepIdx < 60) {
        return { title: line.slice(0, sepIdx).trim(), desc: line.slice(sepIdx + 1).trim() };
      }
      return { title: `Bước ${idx + 1}`, desc: line };
    });
  };

  const applyCustomService = (base) => ({
    targetPet: (s.targetPet && String(s.targetPet).trim()) || base.targetPet,
    standard: (s.standard && String(s.standard).trim()) || base.standard,
    steps: parseCustomSteps(s.processSteps) || base.steps,
    prepNote: (s.prepNote && String(s.prepNote).trim()) || base.prepNote,
  });

  if (isReproductiveService(s)) {
    return applyCustomService({
      targetPet: n.includes('đực') ? 'Chó đực / Mèo đực từ 6 tháng tuổi trở lên' : 'Chó cái / Mèo cái cần khám thai, hộ sinh hoặc triệt sản',
      standard: 'Phòng phẫu thuật vô trùng áp lực dương • Gây mê bay hơi Isoflurane',
      steps: [
        { title: 'Thăm khám lâm sàng & xét nghiệm tiền mê', desc: 'Bác sĩ thú y kiểm tra nhịp tim, thân nhiệt, xét nghiệm máu cơ bản và đánh giá thể trạng trước khi tiến hành.' },
        { title: 'Chuẩn bị vô trùng & thiết bị chuyên khoa', desc: 'Sát khuẩn dụng cụ 100%, chuẩn bị máy siêu âm Doppler / hệ thống gây mê bay hơi Isoflurane và lồng ấp ICU.' },
        { title: 'Thực hiện thủ thuật / liệu trình chuyên sâu', desc: 'Bác sĩ CKI trực tiếp thực hiện theo phác đồ an toàn tối đa, theo dõi sinh hiệu liên tục suốt quá trình.' },
        { title: 'Hồi sức hậu phẫu & dặn dò chăm sóc tại nhà', desc: 'Chăm sóc tỉnh mê trong phòng ấm, cấp đơn thuốc hậu phẫu và hướng dẫn chế độ dinh dưỡng phục hồi.' }
      ],
      prepNote: n.includes('phẫu thuật') || n.includes('triệt sản') || n.includes('thiến') || n.includes('mổ đẻ')
        ? 'Nên cho bé nhịn ăn 6–8 tiếng trước giờ phẫu thuật (vẫn có thể uống ít nước). Đưa bé trong lồng vận chuyển kín gió và báo bác sĩ nếu bé có tiền sử dị ứng thuốc.'
        : 'Đem theo sổ tiêm phòng / ngày phối giống gần nhất để bác sĩ chẩn đoán và dự sinh chuẩn xác nhất.'
    });
  }
  if (cat.includes('tiêm') || cat.includes('y tế') || cat.includes('khám')) {
    return applyCustomService({
      targetPet: 'Chó & Mèo ở mọi giai đoạn phát triển',
      standard: 'Vắc xin nhập khẩu bảo quản dây chuyền lạnh 2–8°C • Sổ theo dõi thú y',
      steps: [
        { title: 'Khám sàng lọc thể trạng tổng quát', desc: 'Đo thân nhiệt, nghe tim phổi, kiểm tra niêm mạc và hỏi tiền sử bệnh lý để đảm bảo bé đủ điều kiện.' },
        { title: 'Tư vấn phác đồ & xác nhận nguồn thuốc', desc: 'Bác sĩ tư vấn loại vắc xin / liệu trình phù hợp nhất, kiểm tra tem nhãn và hạn sử dụng ngay trước mặt chủ nuôi.' },
        { title: 'Tiến hành tiêm phòng / điều trị nhẹ nhàng', desc: 'Thực hiện thao tác chuẩn y khoa, giảm tối đa cảm giác đau và căng thẳng cho thú cưng.' },
        { title: 'Theo dõi sau tiêm & hẹn lịch nhắc mũi', desc: 'Theo dõi phản ứng sau tiêm 15–20 phút, dán tem vào sổ tiêm chủng và lưu lịch nhắc tái khám trên hệ thống.' }
      ],
      prepNote: 'Không nên tắm cho bé trong vòng 5–7 ngày sau khi tiêm vắc xin. Chỉ tiêm khi bé hoàn toàn khỏe mạnh, ăn uống bình thường và đã tẩy giun trước đó.'
    });
  }
  return applyCustomService({
    targetPet: 'Chó & Mèo mọi giống loài (Poodle, Corgi, Phốc Sóc, Mèo Anh...)',
    standard: 'Mỹ phẩm Spa hữu cơ dịu nhẹ • Dụng cụ khử khuẩn UV sau mỗi lượt khách',
    steps: [
      { title: 'Tiếp nhận & kiểm tra tình trạng lông da', desc: 'Cân đo, kiểm tra độ rối lông, tình trạng da nhạy cảm và ghi nhận yêu cầu tạo kiểu riêng từ chủ nuôi.' },
      { title: 'Vệ sinh cơ bản toàn diện', desc: 'Nhổ lông tai, vệ sinh ráy tai, cắt mài móng tròn êm ái và vắt tuyến hôi sạch sẽ.' },
      { title: 'Tắm dưỡng thảo dược & sấy chải tạo phồng', desc: 'Tắm 2 lần bằng sữa tắm phù hợp loại lông, massage thư giãn, sấy ấm và chải tơi bung lông.' },
      { title: 'Cắt tỉa tạo kiểu & bàn giao Nhật ký Spa', desc: 'Groomer cắt tỉa chuẩn form, xịt dưỡng thơm lâu và lưu Nhật ký chăm sóc (Care Summary) gửi chủ nuôi.' }
    ],
    prepNote: 'Nên đưa bé đến trước giờ hẹn 5–10 phút và cho bé đi vệ sinh nhẹ trước khi vào Spa để bé thoải mái nhất trong suốt liệu trình.'
  });
};

export default function CustomerPortal({ 
  currentUser,
  activeTab, 
  onTabChange,
  selectedProductId,
  onOpenProductDetail,
  selectedServiceId,
  onOpenServiceDetail,
  pets, 
  services, 
  appointments, 
  products, 
  promotions = [],
  orders = [],
  reviews = [],
  cart: propsCart,
  setCart: propsSetCart,
  onAddPet, 
  onUpdatePet,
  onDeletePet,
  onBookAppointment, 
  onRescheduleAppointment,
  onCancelAppointment,
  onAddReview,
  onDeleteReview,
  onUpdateProfile,
  profileModalSignal = 0,
  onCheckoutOrder,
  onOpenLogin,
  onQuickLogin
}) {
  const [showAddPet, setShowAddPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ appointmentDate: '', timeSlot: '09:00 - 10:00', notes: '' });
  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [appReviewForm, setAppReviewForm] = useState({ rating: 5, comment: '' });
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (profileModalSignal > 0 && currentUser) {
      setShowProfileModal(true);
    }
  }, [profileModalSignal, currentUser]);

  const openCartPage = () => {
    if (onTabChange) onTabChange('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product) => {
    if (!product) return;
    setDetailQuantity(1);
    if (onOpenProductDetail) {
      onOpenProductDetail(product);
    } else if (onTabChange) {
      onTabChange('product-detail');
    }
  };

  const openServiceDetail = (service) => {
    if (!service) return;
    if (onOpenServiceDetail) {
      onOpenServiceDetail(service);
    } else if (onTabChange) {
      onTabChange('service-detail');
    }
  };

  useEffect(() => {
    setDetailQuantity(1);
  }, [selectedProductId]);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  // Shop & Service Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('ALL');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [historyAppQuery, setHistoryAppQuery] = useState('');
  const [historyAppStatus, setHistoryAppStatus] = useState('ALL');
  const [historyOrderQuery, setHistoryOrderQuery] = useState('');
  const [historyOrderStatus, setHistoryOrderStatus] = useState('ALL');

  // Cart State (fallback internal if not passed from App)
  const [internalCart, setInternalCart] = useState([]);
  const cart = propsCart !== undefined ? propsCart : internalCart;
  const setCart = propsSetCart || setInternalCart;

  // Selected Cart Item IDs for Selective Checkout (chọn sản phẩm bất kỳ để thanh toán)
  const [selectedCartIds, setSelectedCartIds] = useState(() => {
    try {
      const saved = localStorage.getItem('petcare_selected_cart_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return (propsCart || []).map(i => i.id);
  });

  useEffect(() => {
    try {
      localStorage.setItem('petcare_selected_cart_ids', JSON.stringify(selectedCartIds));
    } catch (e) {}
  }, [selectedCartIds]);

  // Keep selectedCartIds in sync when items are removed from cart
  useEffect(() => {
    const validIds = new Set(cart.map(i => i.id));
    setSelectedCartIds(prev => {
      const cleaned = prev.filter(id => validIds.has(id));
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, [cart]);

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    recipientName: currentUser?.fullName || '',
    recipientPhone: currentUser?.phone || '',
    deliveryAddress: '',
    deliveryCoords: null,
    deliveryNotes: '',
    shippingMethod: 'STANDARD', // 'STANDARD' (0 đ) or 'EXPRESS' (30.000 đ)
    paymentMethod: 'COD', // 'COD', 'VIETQR', 'MOMO'
  });
  const [showMapPicker, setShowMapPicker] = useState(true);

  // Unique Order Code for VietQR/MoMo & Order Completion Receipt (Step 3)
  const [tempOrderCode, setTempOrderCode] = useState(() => 'ORD-' + Math.floor(100000 + Math.random() * 900000));
  const [completedOrderReceipt, setCompletedOrderReceipt] = useState(null);

  // payOS Embedded Inline Checkout State (hiển thị trực tiếp ngay trên trang /thanh-toan)
  const [payosEmbedded, setPayosEmbedded] = useState(null);
  const [payosLoading, setPayosLoading] = useState(false);
  const [payosChecking, setPayosChecking] = useState(false);
  const [payosVerifyingReturn, setPayosVerifyingReturn] = useState(false);

  useEffect(() => {
    if (activeTab !== 'checkout' && completedOrderReceipt) {
      setCompletedOrderReceipt(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (currentUser) {
      setCheckoutForm(prev => ({
        ...prev,
        recipientName: prev.recipientName || currentUser.fullName || '',
        recipientPhone: prev.recipientPhone || currentUser.phone || '',
        deliveryAddress: prev.deliveryAddress || currentUser.address || ''
      }));
    }
  }, [currentUser]);

  // New Pet State
  const [newPet, setNewPet] = useState({ name: '', species: 'Chó', breed: '', ageMonths: '', weightKg: '', medicalHistory: '' });

  // Khung giờ hoạt động liên tục 24/7 (00:00 - 24:00) theo múi giờ địa phương
  const getLocalTodayStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatHourSlot = (hour) => {
    const start = String(hour).padStart(2, '0');
    const end = String((hour + 1) % 24).padStart(2, '0');
    return `${start}:00 - ${end}:00`;
  };

  const BOOKING_TIME_SLOT_GROUPS = [
    { label: '🌅 Ca Sáng (06:00 - 12:00)', hours: [6, 7, 8, 9, 10, 11] },
    { label: '☀️ Ca Chiều (12:00 - 18:00)', hours: [12, 13, 14, 15, 16, 17] },
    { label: '🌆 Ca Tối (18:00 - 22:00)', hours: [18, 19, 20, 21] },
    { label: '🌙 Ca Đêm Trực 24/7 (22:00 - 06:00)', hours: [22, 23, 0, 1, 2, 3, 4, 5] }
  ];

  const getSlotStatus = (hour, dateStr) => {
    const slotValue = formatHourSlot(hour);
    const todayStr = getLocalTodayStr();

    if (dateStr === todayStr) {
      const currH = new Date().getHours();
      if (hour < currH) {
        return { value: slotValue, disabled: true, statusText: 'Đã qua giờ' };
      }
    }

    const isBooked = appointments.some((a) =>
      a.appointmentDate === dateStr &&
      a.timeSlot === slotValue &&
      ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status)
    );
    if (isBooked) return { value: slotValue, disabled: true, statusText: 'Đã có lịch - Khóa slot' };

    return { value: slotValue, disabled: false, statusText: 'Còn trống' };
  };

  const findNextAvailableSlot = (dateStr) => {
    const orderedHours = Array.from({ length: 24 }, (_, h) => h);
    for (const h of orderedHours) {
      const st = getSlotStatus(h, dateStr);
      if (!st.disabled) return st.value;
    }
    return '09:00 - 10:00';
  };

  // Booking Form State
  const [bookingForm, setBookingForm] = useState(() => {
    const todayStr = getLocalTodayStr();
    const currH = new Date().getHours();
    return {
      petId: '',
      serviceId: services[0]?.id || '',
      appointmentDate: todayStr,
      timeSlot: formatHourSlot(currH),
      notes: ''
    };
  });

  const matchesCurrentUser = (recordId, recordName, recordPhone) => {
    if (!currentUser) return false;
    if (recordId && currentUser.id && recordId === currentUser.id) return true;
    const uPhone = (currentUser.phone || '').trim();
    if (uPhone && recordPhone && recordPhone.trim() === uPhone) return true;
    const uName = (currentUser.fullName || '').trim().toLowerCase();
    if (uName && recordName && recordName.trim().toLowerCase() === uName) return true;
    return false;
  };

  const myPets = currentUser
    ? pets.filter(p => matchesCurrentUser(p.ownerId, p.ownerName, p.ownerPhone))
    : [];
  const myAppointments = currentUser
    ? appointments
        .filter(a => matchesCurrentUser(a.customerId, a.customerName, a.customerPhone))
        .sort((a, b) => String(b.appointmentDate || '').localeCompare(String(a.appointmentDate || '')))
    : [];
  const myOrders = currentUser
    ? orders
        .filter(o => matchesCurrentUser(o.customerId, o.customerName, o.phone))
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    : [];

  const filteredMyAppointments = myAppointments.filter((app) => {
    const matchStatus = historyAppStatus === 'ALL' ? true : app.status === historyAppStatus;
    const q = historyAppQuery.trim().toLowerCase();
    const matchQ =
      !q ||
      (app.petName || '').toLowerCase().includes(q) ||
      (app.serviceName || '').toLowerCase().includes(q) ||
      (app.careSummary || '').toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const filteredMyOrders = myOrders.filter((order) => {
    const matchStatus = historyOrderStatus === 'ALL' ? true : order.status === historyOrderStatus;
    const q = historyOrderQuery.trim().toLowerCase();
    const matchQ =
      !q ||
      (order.id || '').toLowerCase().includes(q) ||
      (order.items || '').toLowerCase().includes(q) ||
      (order.paymentMethod || '').toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  // Always ensure petId is populated with a valid pet
  useEffect(() => {
    if (myPets.length > 0 && (!bookingForm.petId || !myPets.some(p => p.id === bookingForm.petId))) {
      setBookingForm(prev => ({ ...prev, petId: myPets[0].id }));
    }
  }, [myPets, bookingForm.petId]);

  // Tự động chọn khung giờ trống gần nhất khi đổi ngày hoặc mở modal đặt lịch 24/7
  useEffect(() => {
    if (!showBookingModal) return;
    const selectedHour = parseInt((bookingForm.timeSlot || '').slice(0, 2), 10);
    const currentStatus = Number.isNaN(selectedHour)
      ? { disabled: true }
      : getSlotStatus(selectedHour, bookingForm.appointmentDate);
    if (currentStatus.disabled) {
      const nextSlot = findNextAvailableSlot(bookingForm.appointmentDate);
      if (nextSlot && nextSlot !== bookingForm.timeSlot) {
        setBookingForm(prev => ({ ...prev, timeSlot: nextSlot }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBookingModal, bookingForm.appointmentDate, appointments]);

  const openCreatePetModal = () => {
    setEditingPet(null);
    setNewPet({ name: '', species: 'Chó', breed: '', ageMonths: '', weightKg: '', medicalHistory: '' });
    setShowAddPet(true);
  };

  const openEditPetModal = (pet) => {
    setEditingPet(pet);
    setNewPet({
      name: pet.name || '',
      species: pet.species || 'Chó',
      breed: pet.breed || '',
      ageMonths: pet.ageMonths ?? '',
      weightKg: pet.weightKg ?? '',
      medicalHistory: pet.medicalHistory || ''
    });
    setShowAddPet(true);
  };

  const handleDeletePetClick = async (pet) => {
    const ok = await confirmModal(
      `Bạn có chắc chắn muốn xóa hồ sơ thú cưng "${pet.name}" (${pet.species}${pet.breed ? ` - ${pet.breed}` : ''})?`,
      'Xác Nhận Xóa Hồ Sơ Thú Cưng',
      { type: 'danger', confirmText: 'Xóa Hồ Sơ', cancelText: 'Hủy' }
    );
    if (ok && onDeletePet) {
      onDeletePet(pet.id);
    }
  };

  const handleCreatePetSubmit = (e) => {
    e.preventDefault();
    if (!newPet.name.trim()) {
      toast.warning('Vui lòng nhập tên thú cưng của bạn!', 'Thiếu Thông Tin');
      return;
    }
    const payload = {
      ...newPet,
      name: newPet.name.trim(),
      breed: (newPet.breed || '').trim(),
      ageMonths: newPet.ageMonths !== '' ? parseInt(newPet.ageMonths, 10) : null,
      weightKg: newPet.weightKg !== '' ? parseFloat(newPet.weightKg) : null,
      medicalHistory: (newPet.medicalHistory || '').trim()
    };
    if (editingPet) {
      if (onUpdatePet) onUpdatePet(editingPet.id, payload);
      toast.success(`Đã cập nhật hồ sơ thú cưng "${payload.name}"!`, 'Hồ Sơ Thú Cưng');
    } else {
      onAddPet(payload);
      toast.success('Hồ sơ thú cưng đã được tạo thành công!', 'Thú Cưng Petzera');
    }
    setEditingPet(null);
    setNewPet({ name: '', species: 'Chó', breed: '', ageMonths: '', weightKg: '', medicalHistory: '' });
    setShowAddPet(false);
  };

  const openRescheduleModal = (app) => {
    setEditingAppointment(app);
    setRescheduleForm({
      appointmentDate: String(app.appointmentDate || getLocalTodayStr()).slice(0, 10),
      timeSlot: app.timeSlot || '09:00 - 10:00',
      notes: app.notes || ''
    });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!editingAppointment || !onRescheduleAppointment) return;
    const payload = {
      appointmentDate: rescheduleForm.appointmentDate,
      timeSlot: rescheduleForm.timeSlot,
      notes: rescheduleForm.notes
    };
    const res = await onRescheduleAppointment(editingAppointment.id, payload);
    if (res && res.error) {
      toast.error(res.error, 'Không Thể Đổi Lịch');
    } else {
      setEditingAppointment(null);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const resolvedPetId = bookingForm.petId || (myPets[0] ? myPets[0].id : (pets[0] ? pets[0].id : 'p1'));
    const resolvedServiceId = bookingForm.serviceId || (services[0] ? services[0].id : 's1');

    const finalForm = {
      petId: resolvedPetId,
      serviceId: resolvedServiceId,
      appointmentDate: bookingForm.appointmentDate,
      timeSlot: bookingForm.timeSlot,
      notes: bookingForm.notes || '',
    };

    const result = await onBookAppointment(finalForm);
    if (result && result.error) {
      toast.error(result.error, 'Không Thể Đặt Lịch');
    } else {
      toast.success(
        'Đặt lịch hẹn thành công! Đã gửi xác nhận tới hệ thống chăm sóc thú cưng.',
        '🎉 Đặt Lịch Thành Công'
      );
      setShowBookingModal(false);
    }
  };

  // Reset cart when user logs out
  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      setSelectedCartIds([]);
    }
  }, [currentUser]);

  // Cart Selection Helpers (chọn sản phẩm bất kỳ để thanh toán)
  const selectedCartItems = cart.filter(item => selectedCartIds.includes(item.id));
  const selectedTotalQty = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const allCartSelected = cart.length > 0 && selectedCartItems.length === cart.length;

  const toggleSelectCartItem = (productId) => {
    setSelectedCartIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAllCart = () => {
    if (allCartSelected) {
      setSelectedCartIds([]);
    } else {
      setSelectedCartIds(cart.map(item => item.id));
    }
  };

  const handleRemoveSelectedItems = async () => {
    if (selectedCartItems.length === 0) return;
    const confirmed = await confirmModal(
      `Bạn có chắc chắn muốn xóa ${selectedCartItems.length} sản phẩm đã chọn khỏi giỏ hàng?`,
      'Xóa Sản Phẩm Đã Chọn?',
      { type: 'danger', confirmText: 'Xóa Mục Đã Chọn', cancelText: 'Hủy' }
    );
    if (confirmed) {
      const removeSet = new Set(selectedCartIds);
      setCart(cart.filter(item => !removeSet.has(item.id)));
      setSelectedCartIds([]);
      toast.info(`Đã xóa ${selectedCartItems.length} sản phẩm khỏi giỏ hàng.`, 'Giỏ Hàng');
    }
  };

  // Cart Management Functions
  const handleAddToCart = (product, quantity = 1, options = {}) => {
    const { selectOnly = false } = options || {};
    if (!currentUser) {
      toast.warning(
        'Vui lòng đăng nhập tài khoản khách hàng để thêm sản phẩm vào giỏ hàng và mua sắm!',
        'Yêu Cầu Đăng Nhập',
        {
          actionText: '🔐 Đăng Nhập Ngay',
          onAction: () => {
            if (onOpenLogin) onOpenLogin();
          }
        }
      );
      if (onOpenLogin) onOpenLogin();
      return false;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity + quantity > product.currentStock) {
        toast.warning(`Số lượng mua vượt quá tồn kho hiện có (${product.currentStock} sản phẩm).`, 'Tồn Kho Giới Hạn');
        return false;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    if (selectOnly) {
      setSelectedCartIds([product.id]);
    } else {
      setSelectedCartIds(prev => (prev.includes(product.id) ? prev : [...prev, product.id]));
    }

    toast.success(`Đã thêm "${product.name}" vào giỏ hàng Petzera!`, '🛒 Đã Thêm Giỏ Hàng', {
      actionText: 'Xem Giỏ Hàng',
      onAction: () => openCartPage()
    });
    return true;
  };

  const updateCartQuantity = (productId, delta) => {
    const existing = cart.find(item => item.id === productId);
    if (!existing) return;
    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      removeCartItem(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && newQty > product.currentStock) {
      toast.warning(`Số lượng vượt quá tồn kho hiện có (${product.currentStock} sp)!`, 'Tồn Kho Giới Hạn');
      return;
    }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const removeCartItem = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(cart.filter(i => i.id !== productId));
    setSelectedCartIds(prev => prev.filter(id => id !== productId));
    if (item) {
      toast.info(`Đã bỏ "${item.name}" khỏi giỏ hàng.`, 'Cập Nhật Giỏ Hàng');
    }
  };

  const handleClearCart = async () => {
    if (cart.length === 0) return;
    const confirmed = await confirmModal(
      'Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?',
      'Dọn Sạch Giỏ Hàng?',
      { type: 'danger', confirmText: 'Xóa Toàn Bộ', cancelText: 'Hủy' }
    );
    if (confirmed) {
      setCart([]);
      setSelectedCartIds([]);
      toast.info('Đã xóa tất cả sản phẩm trong giỏ hàng.', 'Giỏ Hàng');
    }
  };

  // Proceed from Cart Page to Dedicated Checkout Page (chỉ thanh toán các sản phẩm đã tích chọn)
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.warning('Giỏ hàng của bạn đang trống! Hãy chọn sản phẩm trước khi thanh toán.', 'Giỏ Hàng Rỗng');
      return;
    }
    if (selectedCartItems.length === 0) {
      toast.warning('Vui lòng tích chọn ít nhất 1 sản phẩm trong giỏ hàng để thanh toán!', 'Chưa Chọn Sản Phẩm');
      return;
    }
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập tài khoản khách hàng để tiến hành thanh toán!', 'Yêu Cầu Đăng Nhập', {
        actionText: '🔐 Đăng Nhập Ngay',
        onAction: () => onOpenLogin && onOpenLogin()
      });
      if (onOpenLogin) onOpenLogin();
      return;
    }
    setCompletedOrderReceipt(null);
    onTabChange('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info(`Đã chuyển ${selectedTotalQty} sản phẩm đã chọn đến trang thanh toán!`, 'Trang Thanh Toán');
  };

  const applyPromoCode = (codeOverride) => {
    const code = (codeOverride || promoCode).toUpperCase().trim();
    const matchedPromo = promotions.find(
      (p) => String(p.code || '').toUpperCase().trim() === code
    );
    if (matchedPromo) {
      if (matchedPromo.status !== 'ACTIVE') {
        toast.warning(`Mã ${matchedPromo.code} hiện đang tạm dừng áp dụng.`, 'Mã Khuyến Mãi');
        return;
      }
      const pct = Number(matchedPromo.discountPercent) || 10;
      setDiscountPercent(pct);
      setPromoCode(matchedPromo.code.toUpperCase());
      toast.success(`Áp dụng mã ${matchedPromo.code} thành công! Giảm ${pct}% tổng hóa đơn.`, '🎁 Mã Khuyến Mãi');
      return;
    }
    if (code === 'SPA10OFF') {
      setDiscountPercent(10);
      setPromoCode('SPA10OFF');
      toast.success('Áp dụng mã SPA10OFF thành công! Giảm 10% tổng hóa đơn.', '🎁 Mã Khuyến Mãi');
    } else if (code === 'PETLOVER20') {
      setDiscountPercent(20);
      setPromoCode('PETLOVER20');
      toast.success('Áp dụng mã PETLOVER20 thành công! Giảm 20% tổng hóa đơn.', '🎁 Mã Khuyến Mãi');
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết lượt sử dụng.', 'Mã Giảm Giá');
    }
  };

  const handleCopyText = (text, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}: ${text}`, 'Sao Chép Thành Công');
    }
  };

  const finalizeOrderSuccess = (receiptSummary, { paidViaPayOS = false } = {}) => {
    const finalReceipt = {
      ...receiptSummary,
      paymentStatus: paidViaPayOS ? 'PAID' : 'PENDING',
    };

    onCheckoutOrder(finalReceipt.items, finalReceipt.grandTotal, {
      orderId: finalReceipt.orderId,
      recipientName: finalReceipt.recipientName,
      recipientPhone: finalReceipt.recipientPhone,
      deliveryAddress: finalReceipt.deliveryAddress,
      deliveryNotes: finalReceipt.deliveryNotes,
      shippingMethod: finalReceipt.shippingMethod,
      paymentMethod: finalReceipt.paymentMethod,
      status: paidViaPayOS ? 'PAID' : 'PENDING',
    });

    const orderedIds = new Set(finalReceipt.items.map(item => item.id));
    setCompletedOrderReceipt(finalReceipt);
    setPayosEmbedded(null);
    try { localStorage.removeItem('petcare_pending_payos'); } catch (e) {}
    setCart(prev => prev.filter(item => !orderedIds.has(item.id)));
    setSelectedCartIds([]);
    setDiscountPercent(0);
    setPromoCode('');
    setTempOrderCode('ORD-' + Math.floor(100000 + Math.random() * 900000));

    toast.success(
      paidViaPayOS
        ? `Thanh toán Online thành công mã đơn ${finalReceipt.orderId}! Đã nhận ${finalReceipt.grandTotal.toLocaleString('vi-VN')} đ.`
        : `Đặt hàng thành công mã đơn ${finalReceipt.orderId}! Tổng thanh toán: ${finalReceipt.grandTotal.toLocaleString('vi-VN')} đ.`,
      paidViaPayOS ? '✅ THANH TOÁN ONLINE THÀNH CÔNG' : '🎉 ĐẶT HÀNG THÀNH CÔNG',
      { duration: 6000 }
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi cổng payOS chuyển hướng người dùng quay lại PETZERA (?payos=success|cancel&orderCode=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const payosFlag = params.get('payos');
    const returnedCode = params.get('orderCode');
    const isCancelParam = params.get('cancel') === 'true' || params.get('status') === 'CANCELLED';
    if (!payosFlag || !returnedCode) return;

    window.history.replaceState({}, '', '/thanh-toan');

    if (payosFlag === 'cancel' || isCancelParam) {
      apiService.cancelPayOSPayment(returnedCode).catch(() => {});
      try { localStorage.removeItem('petcare_pending_payos'); } catch (e) {}
      toast.info('Bạn đã hủy thanh toán trên cổng payOS. Giỏ hàng vẫn được giữ nguyên!', 'Thanh Toán Đã Hủy');
      return;
    }

    if (payosFlag === 'success') {
      setPayosVerifyingReturn(true);
      (async () => {
        try {
          // Kiểm tra trạng thái giao dịch thật từ API payOS (thử tối đa 3 lần phòng độ trễ mạng 1-2s)
          let verifiedStatus = 'PENDING';
          for (let attempt = 0; attempt < 3; attempt++) {
            const res = await apiService.getPayOSStatus(returnedCode);
            verifiedStatus = res?.data?.status || 'PENDING';
            if (verifiedStatus === 'PAID') break;
            await new Promise((r) => setTimeout(r, 1200));
          }

          const savedRaw = localStorage.getItem('petcare_pending_payos');
          const saved = savedRaw ? JSON.parse(savedRaw) : null;

          if (verifiedStatus === 'PAID') {
            if (saved && String(saved.orderCode) === String(returnedCode) && saved.pendingOrder) {
              finalizeOrderSuccess(saved.pendingOrder, { paidViaPayOS: true });
            } else {
              toast.success(`Thanh toán Online thành công cho mã giao dịch #${returnedCode}!`, '✅ Đã Thanh Toán');
            }
          } else {
            toast.warning('Giao dịch chưa hoàn tất trên cổng thanh toán. Vui lòng kiểm tra lại.', 'Chưa Xác Nhận Thanh Toán');
          }
        } catch (err) {
          toast.error('Không thể xác minh kết quả thanh toán lúc này.', 'Lỗi Xác Minh');
        } finally {
          setPayosVerifyingReturn(false);
        }
      })();
    }
  }, []);

  // Kiểm tra trạng thái giao dịch payOS đang nhúng trực tiếp
  const checkEmbeddedPayOSStatus = async (sessionOverride = null, { silent = false } = {}) => {
    const active = sessionOverride || payosEmbedded;
    if (!active?.orderCode) return;
    if (!silent) setPayosChecking(true);
    try {
      const res = await apiService.getPayOSStatus(active.orderCode);
      const status = res?.data?.status;
      if (status === 'PAID') {
        finalizeOrderSuccess(active.pendingOrder, { paidViaPayOS: true });
      } else if (status === 'EXPIRED') {
        handleExpireAndRegeneratePayOS(active);
      } else if (status === 'CANCELLED') {
        setPayosEmbedded(null);
        try { localStorage.removeItem('petcare_pending_payos'); } catch (e) {}
        toast.info('Giao dịch thanh toán online đã bị hủy.', 'Thanh Toán Online');
      } else if (!silent) {
        toast.info('Hệ thống chưa nhận được chuyển khoản. Bạn vui lòng quét mã QR phía trên nhé!', 'Đang Chờ Thanh Toán');
      }
    } catch (err) {
      if (!silent) toast.warning('Chưa thể kiểm tra trạng thái lúc này.', 'Thanh Toán Online');
    } finally {
      if (!silent) setPayosChecking(false);
    }
  };

  // Tự động kiểm tra trạng thái mỗi 3 giây khi khung payOS nhúng đang mở
  useEffect(() => {
    if (!payosEmbedded?.orderCode) return;
    const timer = setInterval(() => {
      checkEmbeddedPayOSStatus(payosEmbedded, { silent: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [payosEmbedded]);

  const handleCancelEmbeddedPayOS = async () => {
    if (payosEmbedded?.orderCode) {
      apiService.cancelPayOSPayment(payosEmbedded.orderCode, 'Khach hang huy thanh toan').catch(() => {});
    }
    setPayosEmbedded(null);
    try { localStorage.removeItem('petcare_pending_payos'); } catch (e) {}
    toast.info('Đã hủy mã QR thanh toán hiện tại.', 'Thanh Toán Online');
  };

  // Sau 10 phút chưa thanh toán: kiểm tra lần cuối -> hủy mã cũ -> tự động tạo mã QR mới
  const handleExpireAndRegeneratePayOS = async (sessionOverride = null) => {
    const active = sessionOverride || payosEmbedded;
    if (!active?.orderCode) return;

    setPayosLoading(true);
    try {
      // Kiểm tra lần cuối đề phòng khách vừa chuyển khoản đúng giây cuối
      try {
        const latest = await apiService.getPayOSStatus(active.orderCode);
        if (latest?.data?.status === 'PAID') {
          finalizeOrderSuccess(active.pendingOrder, { paidViaPayOS: true });
          return;
        }
      } catch (e) {}

      // 1. Hủy mã cũ trên payOS
      await apiService.cancelPayOSPayment(active.orderCode, 'Het han 10 phut chua thanh toan').catch(() => {});

      // Bảo vệ hạn mức đơn payOS nếu người dùng treo tab quá lâu (> 3 lần tự gia hạn = 40 phút)
      const nextRenewCount = (active.autoRenewCount || 0) + 1;
      if (nextRenewCount > 3) {
        setPayosEmbedded(null);
        try { localStorage.removeItem('petcare_pending_payos'); } catch (e) {}
        toast.warning('Mã QR đã hết hạn. Khi nào sẵn sàng thanh toán, hãy bấm "Tạo Mã QR Thanh Toán Tại Đây" nhé!', 'Mã QR Hết Hạn');
        return;
      }

      // 2. Tự động tạo mã QR mới với thông tin & số tiền hiện tại
      const freshAmount = grandTotal >= 2000 ? grandTotal : active.amount;
      const freshItems = selectedCartItems.length > 0 ? selectedCartItems : (active.pendingOrder?.items || []);
      const res = await apiService.createPayOSPayment({
        amount: freshAmount,
        items: freshItems,
        buyerName: active.pendingOrder?.recipientName || checkoutForm.recipientName.trim(),
        buyerPhone: active.pendingOrder?.recipientPhone || checkoutForm.recipientPhone.trim(),
        buyerAddress: active.pendingOrder?.deliveryAddress || checkoutForm.deliveryAddress.trim(),
        origin: window.location.origin,
      });

      if (res && res._ok && res.data && res.data.checkoutUrl) {
        const updatedPending = {
          ...(active.pendingOrder || {}),
          items: freshItems,
          grandTotal: freshAmount,
          orderId: `PAYOS-${res.data.orderCode}`,
          payosOrderCode: res.data.orderCode,
        };
        try {
          localStorage.setItem(
            'petcare_pending_payos',
            JSON.stringify({ orderCode: res.data.orderCode, pendingOrder: updatedPending })
          );
        } catch (err) {}
        setPayosEmbedded({
          checkoutUrl: res.data.checkoutUrl,
          orderCode: res.data.orderCode,
          amount: res.data.amount || freshAmount,
          expiresAt: res.data.expiresAt || Date.now() + 10 * 60 * 1000,
          accountNumber: res.data.accountNumber || '',
          accountName: res.data.accountName || '',
          description: res.data.description || '',
          autoRenewCount: nextRenewCount,
          pendingOrder: updatedPending,
        });
        toast.info(
          `Mã QR #${active.orderCode} đã hết hạn (10 phút) — đã tự hủy và tạo mã QR mới #${res.data.orderCode}!`,
          '🔄 Đã Tạo Mã QR Mới'
        );
      } else {
        setPayosEmbedded(null);
        toast.warning('Mã QR đã hết hạn 10 phút. Vui lòng bấm tạo lại mã mới!', 'Hết Hạn Thanh Toán');
      }
    } catch (err) {
      setPayosEmbedded(null);
      toast.warning('Mã QR đã hết hạn 10 phút. Vui lòng bấm tạo lại mã mới!', 'Hết Hạn Thanh Toán');
    } finally {
      setPayosLoading(false);
    }
  };

  // Final Order Submission from Checkout Page (COD đặt ngay, Thanh Toán Online nhúng trực tiếp cổng payOS ngay tại trang)
  const handleFinalPlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (selectedCartItems.length === 0) {
      toast.warning('Chưa có sản phẩm nào được chọn để thanh toán!', 'Chưa Chọn Sản Phẩm');
      onTabChange(cart.length > 0 ? 'cart' : 'shop');
      return;
    }
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để hoàn tất đặt hàng!', 'Yêu Cầu Đăng Nhập', {
        actionText: '🔐 Đăng Nhập Ngay',
        onAction: () => onOpenLogin && onOpenLogin()
      });
      if (onOpenLogin) onOpenLogin();
      return;
    }
    if (!checkoutForm.recipientName.trim()) {
      toast.warning('Vui lòng nhập họ và tên người nhận hàng!', 'Thiếu Thông Tin');
      return;
    }
    if (!checkoutForm.recipientPhone.trim()) {
      toast.warning('Vui lòng nhập số điện thoại người nhận hàng!', 'Thiếu Thông Tin');
      return;
    }
    if (!checkoutForm.deliveryAddress.trim()) {
      toast.warning('Vui lòng nhập địa chỉ giao hàng cụ thể!', 'Thiếu Thông Tin');
      return;
    }

    const orderId = tempOrderCode;
    const orderedItemsSnapshot = selectedCartItems.map(item => ({ ...item }));
    const receiptSummary = {
      orderId,
      items: orderedItemsSnapshot,
      subtotal: cartSubtotal,
      discountPercent,
      discountAmount,
      shippingFee,
      grandTotal,
      recipientName: checkoutForm.recipientName.trim(),
      recipientPhone: checkoutForm.recipientPhone.trim(),
      deliveryAddress: checkoutForm.deliveryAddress.trim(),
      deliveryNotes: checkoutForm.deliveryNotes.trim(),
      shippingMethod: checkoutForm.shippingMethod,
      paymentMethod: checkoutForm.paymentMethod,
      createdAt: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
    };

    // Nếu chọn Thanh Toán Online -> gọi Backend tạo link payOS rồi nhúng trực tiếp ngay tại mục 3 trên trang /thanh-toan
    if (checkoutForm.paymentMethod === 'PAYOS') {
      if (grandTotal < 2000) {
        toast.warning('Cổng thanh toán online yêu cầu giá trị tối thiểu 2.000 đ.', 'Số Tiền Không Hợp Lệ');
        return;
      }
      // Nếu đang có phiên cũ chưa thanh toán, hủy trước để tạo mã mới sạch sẽ
      if (payosEmbedded?.orderCode) {
        apiService.cancelPayOSPayment(payosEmbedded.orderCode).catch(() => {});
      }
      setPayosLoading(true);
      try {
        const res = await apiService.createPayOSPayment({
          amount: grandTotal,
          items: orderedItemsSnapshot,
          buyerName: receiptSummary.recipientName,
          buyerPhone: receiptSummary.recipientPhone,
          buyerAddress: receiptSummary.deliveryAddress,
          origin: window.location.origin,
        });

        if (res && res._ok && res.data && res.data.checkoutUrl) {
          const pendingOrder = {
            ...receiptSummary,
            orderId: `PAYOS-${res.data.orderCode}`,
            payosOrderCode: res.data.orderCode,
          };
          try {
            localStorage.setItem(
              'petcare_pending_payos',
              JSON.stringify({ orderCode: res.data.orderCode, pendingOrder })
            );
          } catch (err) {}
          setPayosEmbedded({
            checkoutUrl: res.data.checkoutUrl,
            orderCode: res.data.orderCode,
            amount: res.data.amount || grandTotal,
            expiresAt: res.data.expiresAt || Date.now() + 10 * 60 * 1000,
            accountNumber: res.data.accountNumber || '',
            accountName: res.data.accountName || '',
            description: res.data.description || '',
            autoRenewCount: 0,
            pendingOrder,
          });
          toast.success('Đã tạo mã QR thanh toán trực tiếp ngay tại trang! Quét mã để hoàn tất.', '⚡ Thanh Toán Online');
          return;
        }
        toast.error((res && res.message) || 'Không thể khởi tạo cổng thanh toán online. Vui lòng thử lại!', 'Lỗi Thanh Toán');
      } catch (err) {
        toast.error('Không kết nối được tới máy chủ thanh toán.', 'Lỗi Kết Nối');
      } finally {
        setPayosLoading(false);
      }
      return;
    }

    // Thanh toán COD
    finalizeOrderSuccess(receiptSummary, { paidViaPayOS: false });
  };

  // Filter & Sort Products (hide INACTIVE products on public shop)
  const visibleProducts = products.filter(p => p.status !== 'INACTIVE');
  const filteredProducts = visibleProducts.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchQuery =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.unitPrice - b.unitPrice;
    if (sortBy === 'PRICE_HIGH') return b.unitPrice - a.unitPrice;
    return 0;
  });

  // Filter Services by Category & Search Keyword (hide INACTIVE services on public booking)
  const filteredServices = services.filter(s => {
    if (s.status === 'INACTIVE') return false;
    const matchCat = selectedServiceCategory === 'ALL' || s.category === selectedServiceCategory;
    const q = serviceSearchQuery.trim().toLowerCase();
    const matchQ =
      !q ||
      (s.name || '').toLowerCase().includes(q) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  // Geo-fencing kiểm tra phạm vi Giao Hỏa Tốc 2H (chỉ áp dụng Nội Thành TP.HCM <= 20 km)
  const expressEligibility = (() => {
    const STORE_HCMC = { lat: 10.822159, lng: 106.687451 }; // Petzera Flagship - Số 12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP.HCM
    const MAX_INNER_HCMC_KM = 20;

    const normalizeText = (str) =>
      (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd');

    const normalizedAddr = normalizeText(checkoutForm.deliveryAddress);
    const suburbanKeywords = ['cu chi', 'can gio', 'binh chanh', 'hoc mon', 'nha be'];
    const isSuburbanHcmc = suburbanKeywords.some((kw) => normalizedAddr.includes(kw));

    const calcDistanceKm = (lat1, lng1, lat2, lng2) => {
      const toRad = (deg) => (deg * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    if (checkoutForm.deliveryCoords && typeof checkoutForm.deliveryCoords.lat === 'number') {
      const distKm = calcDistanceKm(
        STORE_HCMC.lat,
        STORE_HCMC.lng,
        checkoutForm.deliveryCoords.lat,
        checkoutForm.deliveryCoords.lng
      );
      if (isSuburbanHcmc) {
        return {
          eligible: false,
          distanceKm: distKm,
          reason: `Huyện ngoại thành TP.HCM (cách ~${distKm.toFixed(1)} km) chưa hỗ trợ giao hỏa tốc 2H.`,
        };
      }
      if (distKm <= MAX_INNER_HCMC_KM) {
        return {
          eligible: true,
          distanceKm: distKm,
          reason: `Nội thành TP.HCM (cách Petzera ~${distKm.toFixed(1)} km) — hỗ trợ giao nhanh trong 120 phút.`,
        };
      }
      return {
        eligible: false,
        distanceKm: distKm,
        reason: `Vị trí ngoài nội thành TP.HCM (cách ~${Math.round(distKm).toLocaleString('vi-VN')} km) — chỉ áp dụng Giao Hàng Tiêu Chuẩn.`,
      };
    }

    if (!normalizedAddr.trim()) {
      return {
        eligible: false,
        distanceKm: null,
        reason: 'Vui lòng nhập hoặc chọn địa chỉ nội thành TP.HCM trên bản đồ để bật Hỏa Tốc 2H.',
      };
    }

    if (isSuburbanHcmc) {
      return {
        eligible: false,
        distanceKm: null,
        reason: 'Khu vực ngoại thành TP.HCM chưa hỗ trợ Hỏa Tốc 2H — chỉ áp dụng Giao Hàng Tiêu Chuẩn.',
      };
    }

    const innerHcmcKeywords = [
      'ho chi minh', 'tp.hcm', 'tphcm', 'tp hcm', 'sai gon', 'saigon',
      'quan 1', 'quan 3', 'quan 4', 'quan 5', 'quan 6', 'quan 7', 'quan 8',
      'quan 10', 'quan 11', 'quan 12', 'binh thanh', 'phu nhuan', 'tan binh',
      'tan phu', 'go vap', 'hanh thong', 'binh tan', 'thu duc'
    ];
    const isInnerHcmc = innerHcmcKeywords.some((kw) => normalizedAddr.includes(kw));

    if (isInnerHcmc) {
      return {
        eligible: true,
        distanceKm: null,
        reason: 'Địa chỉ thuộc nội thành TP.HCM — hỗ trợ giao nhanh trong 120 phút (Miễn phí từ 500k).',
      };
    }

    return {
      eligible: false,
      distanceKm: null,
      reason: 'Địa chỉ ngoài nội thành TP.HCM — chỉ hỗ trợ Giao Hàng Tiêu Chuẩn (1 - 2 Ngày).',
    };
  })();

  // Tự động chuyển về Giao Hàng Tiêu Chuẩn nếu khách đổi sang địa chỉ ngoài nội thành TP.HCM
  useEffect(() => {
    if (!expressEligibility.eligible && checkoutForm.shippingMethod === 'EXPRESS') {
      setCheckoutForm((prev) => ({ ...prev, shippingMethod: 'STANDARD' }));
    }
  }, [expressEligibility.eligible, checkoutForm.shippingMethod]);

  // Financial calculations (chỉ tính trên các sản phẩm đã tích chọn)
  const cartSubtotal = selectedCartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round(cartSubtotal * discountPercent / 100);
  const shippingFee = checkoutForm.shippingMethod === 'EXPRESS' && expressEligibility.eligible
    ? (selectedCartItems.length === 0 || cartSubtotal >= 500000 ? 0 : 30000) 
    : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. TRANG CHỦ PETZERA LANDING PAGE (home tab) */}
      {(activeTab === 'home' || !activeTab) && (
        <HomeLandingPage
          services={services}
          products={products}
          reviews={reviews}
          currentUser={currentUser}
          myPets={myPets}
          onTabChange={onTabChange}
          setSelectedServiceCategory={setSelectedServiceCategory}
          setSelectedCategory={setSelectedCategory}
          setSearchQuery={setSearchQuery}
          openServiceDetail={openServiceDetail}
          openProductDetail={openProductDetail}
          handleAddToCart={handleAddToCart}
          handleCopyText={handleCopyText}
          setBookingForm={setBookingForm}
          setShowBookingModal={setShowBookingModal}
          getProductBrand={getProductBrand}
          onAddReview={onAddReview}
          onDeleteReview={onDeleteReview}
          onOpenLogin={onOpenLogin}
        />
      )}

      {/* 1B. TRANG GIỚI THIỆU & ĐỊA CHỈ CỬA HÀNG (/gioi-thieu) */}
      {activeTab === 'about' && (
        <AboutUsSection
          isFullPage={true}
          onTabChange={onTabChange}
          onOpenBooking={() => setShowBookingModal(true)}
          onCopyText={handleCopyText}
        />
      )}

      {/* 2. THÚ CƯNG CỦA TÔI TAB (pets tab) */}
      {activeTab === 'pets' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản Lý Hồ Sơ Thú Cưng</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Theo dõi giống, tuổi, cân nặng và tiền sử y tế của bé</p>
            </div>
            {currentUser && (
              <button className="btn btn-coral" onClick={openCreatePetModal}>
                <Plus size={16} /> Thêm Thú Cưng Mới
              </button>
            )}
          </div>

          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Heart size={48} color="#ff8e53" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vui lòng đăng nhập</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Bạn cần đăng nhập để quản lý hồ sơ thú cưng của mình.</p>
              <button className="btn btn-coral" onClick={onOpenLogin}>
                Đăng Nhập Khách Hàng Ngay
              </button>
            </div>
          ) : myPets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Bạn chưa có thú cưng nào. Hãy thêm thú cưng để dễ dàng đặt lịch!</p>
            </div>
          ) : (
            <div className="grid-3">
              {myPets.map((pet) => (
                <div key={pet.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <img
                      src={getPetAvatar(pet)}
                      alt={pet.name}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.pet; }}
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffedd5', boxShadow: '0 6px 18px rgba(255,107,53,0.25)', flexShrink: 0 }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{pet.name}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600 }}>{pet.species} • {pet.breed || 'Chưa rõ giống'}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Tuổi:</strong> {pet.ageMonths ? `${pet.ageMonths} tháng` : 'Chưa cập nhật'}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Cân nặng:</strong> {pet.weightKg ? `${pet.weightKg} kg` : 'Chưa cập nhật'}</div>
                    <div style={{ marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <strong>Tiền sử y tế:</strong> {pet.medicalHistory || 'Chưa có ghi chú đặc biệt.'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <button className="btn btn-emerald" style={{ width: '100%' }} onClick={() => {
                      setBookingForm(prev => ({ ...prev, petId: pet.id }));
                      setShowBookingModal(true);
                    }}>
                      <Calendar size={16} /> Đặt Lịch Cho {pet.name}
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}
                        onClick={() => openEditPetModal(pet)}
                      >
                        <Edit3 size={14} /> Sửa Hồ Sơ
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleDeletePetClick(pet)}
                        title="Xóa hồ sơ thú cưng"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2.5 KHOA SINH SẢN & HỘ SINH THÚ CƯNG (THEO CHUẨN VPETS.VN) */}
      {activeTab === 'reproduction' && (
        <ReproductionClinic 
          onBookService={(serviceId) => {
            setBookingForm(prev => ({ ...prev, serviceId }));
            setShowBookingModal(true);
          }}
          services={services}
        />
      )}

      {/* 3. DỊCH VỤ & ĐẶT LỊCH TAB (booking tab) */}
      {activeTab === 'booking' && (
        <div>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dịch Vụ Spa, Tiêm Phòng &amp; Khám Thú Y Petzera</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Xem bảng giá công khai, chọn khung giờ và đặt lịch hẹn giữ chỗ không trùng slot</p>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#ff6b35', fontWeight: 700, background: '#fff7ed', padding: '4px 12px', borderRadius: '14px', border: '1px solid #ffedd5' }}>
              {filteredServices.length} dịch vụ chuyên nghiệp
            </span>
          </div>

          {/* Service Category Filter Pills + Keyword Search Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem', background: '#ffffff', padding: '1rem 1.15rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '0.55rem 0.95rem', border: '1.5px solid #e2e8f0', maxWidth: 460 }}>
              <Search size={17} color="#ea580c" style={{ marginRight: '8px', flexShrink: 0 }} />
              <input
                type="text"
                value={serviceSearchQuery}
                onChange={e => setServiceSearchQuery(e.target.value)}
                placeholder="Tìm dịch vụ Spa, tiêm phòng, khám bệnh, siêu âm, triệt sản..."
                style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.88rem', outline: 'none', width: '100%', fontWeight: 500 }}
              />
              {serviceSearchQuery && (
                <button type="button" onClick={() => setServiceSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                  <X size={15} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: '🌟 Tất Cả Dịch Vụ' },
                { id: 'Spa & Grooming', label: '✂️ Spa & Grooming' },
                { id: 'Y Tế & Tiêm Phòng', label: '💉 Tiêm Phòng & Vắc Xin' },
                { id: 'Khám Bệnh & Trị Liệu', label: '🩺 Khám Bệnh, Trị Liệu & Sinh Sản' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedServiceCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: selectedServiceCategory === cat.id ? '1px solid #ff6b35' : '1px solid var(--border-light)',
                    background: selectedServiceCategory === cat.id ? '#fff7ed' : 'transparent',
                    color: selectedServiceCategory === cat.id ? '#ff6b35' : '#475569',
                    cursor: 'pointer',
                    boxShadow: selectedServiceCategory === cat.id ? '0 2px 8px rgba(255, 107, 53, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🐾</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Hiện chưa có dịch vụ phù hợp
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.15rem' }}>
                Bạn có thể xem toàn bộ danh mục dịch vụ của Petzera hoặc liên hệ Hotline 24/7 để được tư vấn ngay.
              </p>
              <button type="button" className="btn btn-coral" onClick={() => { setSelectedServiceCategory('ALL'); setServiceSearchQuery(''); }}>
                Xem Tất Cả Dịch Vụ
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {filteredServices.map((s) => (
                <div key={s.id} className="glass-panel glass-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <div>
                    <div
                      onClick={() => openServiceDetail(s)}
                      title="Bấm để xem chi tiết dịch vụ"
                      style={{ position: 'relative', height: 195, overflow: 'hidden', background: '#f1f5f9', cursor: 'pointer' }}
                    >
                      <img
                        src={getServiceImage(s)}
                        alt={s.name}
                        className="media-card-img"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                      />
                      <span className="badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)', color: '#0f172a', fontWeight: 800, fontSize: '0.75rem', padding: '4px 11px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        {s.category === 'Spa & Grooming' ? '✂️ Spa & Grooming' :
                         s.category === 'Y Tế & Tiêm Phòng' ? '💉 Tiêm Phòng' :
                         isReproductiveService(s) ? '🩺 Khám & Sinh Sản' : '🩺 Khám Bệnh & Trị Liệu'}
                      </span>
                      <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(15,23,42,0.82)', color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
                        {s.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div style={{ padding: '1.35rem 1.5rem 0 1.5rem' }}>
                      <h3
                        onClick={() => openServiceDetail(s)}
                        style={{ fontSize: '1.18rem', fontWeight: 800, marginBottom: '0.55rem', color: '#0f172a', lineHeight: 1.4, cursor: 'pointer' }}
                      >
                        {s.name}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.1rem', lineHeight: '1.55' }}>{s.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem 1.35rem 1.5rem', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="#64748b" /> Thời gian: {s.durationMinutes || 45} phút
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openServiceDetail(s)}>
                        Xem Chi Tiết
                      </button>
                      <button type="button" className="btn btn-coral" onClick={() => {
                        if (!currentUser) {
                          toast.warning('Vui lòng đăng nhập để tiến hành đặt lịch dịch vụ!', 'Yêu Cầu Đăng Nhập', {
                            actionText: '🔐 Đăng Nhập Ngay',
                            onAction: () => onOpenLogin && onOpenLogin()
                          });
                          onOpenLogin();
                          return;
                        }
                        setBookingForm(prev => ({ ...prev, serviceId: s.id }));
                        setShowBookingModal(true);
                      }}>
                        Đăng Ký Đặt Lịch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3.5. TRANG CHI TIẾT DỊCH VỤ RIÊNG (/dich-vu/:id) */}
      {activeTab === 'service-detail' && (() => {
        const ds = services.find(item => item.id === selectedServiceId) || services[0];
        if (!ds) {
          return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Không tìm thấy dịch vụ</h1>
              <button type="button" className="btn btn-coral" onClick={() => onTabChange('booking')}>
                <ArrowLeft size={16} /> Quay Lại Danh Sách Dịch Vụ
              </button>
            </div>
          );
        }

        const svcInfo = getServiceRichDetails(ds);
        const durationText = `${ds.durationMinutes || 45} phút`;
        const relatedServices = services
          .filter(item => item.id !== ds.id && item.category === ds.category)
          .concat(services.filter(item => item.id !== ds.id && item.category !== ds.category))
          .slice(0, 3);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Top Breadcrumb & Back Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#ffffff', padding: '0.9rem 1.35rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#64748b' }}>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); onTabChange('home'); }}
                  style={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}
                >
                  Trang Chủ
                </a>
                <span>/</span>
                <a
                  href="/dich-vu-spa"
                  onClick={(e) => { e.preventDefault(); onTabChange('booking'); }}
                  style={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}
                >
                  Dịch Vụ Spa &amp; Thú Y
                </a>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedServiceCategory(ds.category);
                    onTabChange('booking');
                  }}
                  style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.84rem' }}
                >
                  {ds.category}
                </button>
                <span>/</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{ds.name}</span>
              </nav>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderRadius: '10px' }}
                onClick={() => onTabChange('booking')}
              >
                <ArrowLeft size={15} /> Quay Lại Danh Sách Dịch Vụ
              </button>
            </div>

            {/* Main 2-Column Service Hero */}
            <article className="glass-panel" style={{ padding: '2rem', borderRadius: '22px' }}>
              <div className="grid-2" style={{ gap: '2.25rem', alignItems: 'start' }}>
                {/* Left Column: Large Service Image + Trust Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ position: 'relative', height: 390, background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)' }}>
                    <img
                      src={getServiceImage(ds)}
                      alt={ds.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                    />
                    <span className="badge" style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.95)', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', padding: '5px 13px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
                      {ds.category}
                    </span>
                    <span style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(15,23,42,0.84)', color: '#ffffff', fontSize: '0.84rem', fontWeight: 800, padding: '6px 13px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px', backdropFilter: 'blur(4px)' }}>
                      <Clock size={14} color="#fb923c" /> {durationText}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.76rem', fontWeight: 700, color: '#15803d' }}>
                      <ShieldCheck size={18} style={{ display: 'block', margin: '0 auto 5px' }} /> Vô Trùng 100%
                    </div>
                    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.76rem', fontWeight: 700, color: '#c2410c' }}>
                      <Award size={18} style={{ display: 'block', margin: '0 auto 5px' }} /> Bác Sĩ &amp; Master
                    </div>
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.76rem', fontWeight: 700, color: '#0369a1' }}>
                      <Clock size={18} style={{ display: 'block', margin: '0 auto 5px' }} /> Khóa Slot Đúng Giờ
                    </div>
                  </div>
                </div>

                {/* Right Column: Title, Price, Specs & Book CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-info">{ds.category}</span>
                    <span className="badge badge-success">✓ Đang tiếp nhận đặt lịch</span>
                  </div>

                  <h1 style={{ fontSize: '1.72rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.32, margin: 0 }}>
                    {ds.name}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.86rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#d97706', fontWeight: 800 }}>
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ marginLeft: '4px' }}>4.9 / 5</span>
                    </span>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span style={{ color: '#475569' }}>100% giá công khai minh bạch</span>
                  </div>

                  <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.65, margin: 0 }}>
                    {ds.description}
                  </p>

                  {/* Transparent Price Box */}
                  <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1.5px solid #fed7aa', borderRadius: '18px', padding: '1.15rem 1.35rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9a3412', marginBottom: '2px' }}>
                      GIÁ NIÊM YẾT TRỌN GÓI
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ea580c' }}>
                        {Number(ds.price).toLocaleString('vi-VN')} đ
                      </strong>
                      <span style={{ fontSize: '0.84rem', color: '#059669', fontWeight: 700 }}>
                        • Không phát sinh chi phí ẩn
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #fdba74', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', color: '#9a3412', fontWeight: 700 }}>
                        🎁 Giảm 10% khi đặt lịch online lần đầu: <strong>SPA10OFF</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText('SPA10OFF', 'Mã Giảm Giá')}
                        style={{ background: '#ffffff', color: '#ea580c', border: '1px solid #fdba74', borderRadius: '8px', padding: '3px 10px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Sao Chép Mã
                      </button>
                    </div>
                  </div>

                  {/* Specs Card */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem 1.15rem', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Thời lượng dự kiến:</span>
                      <strong style={{ color: '#0f172a' }}>{durationText}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Đối tượng phù hợp:</span>
                      <strong style={{ color: '#0f172a', textAlign: 'right' }}>{svcInfo.targetPet}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Tiêu chuẩn thực hiện:</span>
                      <strong style={{ color: '#0284c7', textAlign: 'right' }}>{svcInfo.standard}</strong>
                    </div>
                  </div>

                  {/* Primary Booking CTA */}
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn btn-coral"
                      style={{ flex: 1, minWidth: 220, padding: '1rem 1.25rem', fontSize: '0.98rem', fontWeight: 800, borderRadius: '14px' }}
                      onClick={() => {
                        if (!currentUser) {
                          toast.warning('Vui lòng đăng nhập để tiến hành đặt lịch dịch vụ!', 'Yêu Cầu Đăng Nhập', {
                            actionText: '🔐 Đăng Nhập Ngay',
                            onAction: () => onOpenLogin && onOpenLogin()
                          });
                          if (onOpenLogin) onOpenLogin();
                          return;
                        }
                        setBookingForm(prev => ({ ...prev, serviceId: ds.id }));
                        setShowBookingModal(true);
                      }}
                    >
                      <Calendar size={18} /> Đăng Ký Đặt Lịch Dịch Vụ Này
                    </button>
                  </div>

                  {/* Quick Consultation Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '0.8rem 1rem', fontSize: '0.83rem' }}>
                    <span style={{ color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PhoneCall size={15} /> Cần bác sĩ tư vấn tình trạng của bé trước?
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ background: '#0284c7', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.78rem' }}>
                        Gọi {CONTACT_INFO.phoneDisplay}
                      </a>
                      <a href={CONTACT_INFO.zaloLink} onClick={openZaloQrModal} style={{ background: '#0068FF', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.78rem' }}>
                        💬 Chat Zalo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Step-by-Step Protocol & Preparation Notes */}
            <section className="glass-panel" style={{ padding: '2rem', borderRadius: '22px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="#059669" /> Quy Trình Thực Hiện Chuẩn Petzera ({durationText})
              </h2>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                {svcInfo.steps.map((step, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1rem 1.15rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 100%)', color: '#ffffff', fontWeight: 900, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a', display: 'block', marginBottom: '3px' }}>{step.title}</strong>
                      <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '1rem 1.25rem', fontSize: '0.88rem', color: '#78350f', lineHeight: 1.65 }}>
                <strong>📌 Lưu ý chuẩn bị trước khi đưa bé đến:</strong> {svcInfo.prepNote}
              </div>
            </section>

            {/* Customer Reviews for this Service */}
            <CustomerReviewSection
              reviews={reviews.filter(
                (r) =>
                  r.targetType === 'SERVICE' &&
                  (r.targetId === ds.id ||
                    (r.targetName || '').trim().toLowerCase() === (ds.name || '').trim().toLowerCase())
              )}
              targetType="SERVICE"
              targetId={ds.id}
              targetName={ds.name}
              currentUser={currentUser}
              myPets={myPets}
              onAddReview={onAddReview}
              onDeleteReview={onDeleteReview}
              onOpenLogin={onOpenLogin}
              title={`Đánh Giá Dịch Vụ`}
              subtitle={`Cảm nhận của khách hàng đã trải nghiệm "${ds.name}"`}
            />

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <section className="glass-panel" style={{ padding: '2rem', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Dịch Vụ Khác Tại Petzera
                  </h2>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }} onClick={() => onTabChange('booking')}>
                    Xem tất cả dịch vụ <ArrowRight size={15} />
                  </button>
                </div>

                <div className="grid-3" style={{ gap: '1.25rem' }}>
                  {relatedServices.map(rel => (
                    <div
                      key={rel.id}
                      className="glass-card"
                      onClick={() => openServiceDetail(rel)}
                      style={{ padding: 0, overflow: 'hidden', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div style={{ position: 'relative', height: 150, overflow: 'hidden', background: '#f1f5f9' }}>
                          <img
                            src={getServiceImage(rel)}
                            alt={rel.name}
                            className="media-card-img"
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                          />
                          <span className="badge badge-info" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)' }}>
                            {rel.category}
                          </span>
                        </div>
                        <div style={{ padding: '1rem 1.15rem 0.5rem 1.15rem' }}>
                          <strong style={{ fontSize: '0.96rem', color: '#0f172a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                            {rel.name}
                          </strong>
                        </div>
                      </div>
                      <div style={{ padding: '0.75rem 1.15rem 1rem 1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#ea580c' }}>{Number(rel.price).toLocaleString('vi-VN')} đ</strong>
                        <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>Xem chi tiết →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      })()}

      {/* 4. CỬA HÀNG PETZERA SHOP TAB (shop tab) */}
      {activeTab === 'shop' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* PETZERA SHOP HERO PROMO BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 45%, #c2410c 100%)',
            borderRadius: '24px',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(234, 88, 12, 0.25)'
          }}>
            {/* Ambient decorative glowing shapes */}
            <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.22)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, backdropFilter: 'blur(8px)', marginBottom: '0.85rem' }}>
                  <Flame size={14} color="#ffd166" />
                  <span>SIÊU HỘI MUA SẮM THÚ CƯNG 2026</span>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }}></span>
                  <span style={{ color: '#fef08a' }}>GIẢM TỚI 35%</span>
                </div>

                <h1 style={{ fontSize: '2.1rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 0.6rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  Cửa Hàng Vật Phẩm Petzera Super Shop
                </h1>
                <p style={{ fontSize: '0.95rem', opacity: 0.95, lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  Hơn 30+ dòng thức ăn Royal Canin, súp thưởng Ciao, cát đậu nành hữu cơ & mỹ phẩm chăm sóc lông chính hãng 100%. Giao hỏa tốc 2 giờ nội thành!
                </p>

                {/* Trust Badges */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <Truck size={15} /> Giao Hỏa Tốc 2H
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <ShieldCheck size={15} /> 100% Chính Hãng
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <Gift size={15} /> Quà Tặng Đơn Trên 300K
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.16)', padding: '5px 12px', borderRadius: '12px' }}>
                    <RotateCcw size={15} /> Đổi Trả Trong 7 Ngày
                  </div>
                </div>
              </div>

              {/* Right: Quick Vouchers + Cart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: 270 }}>
                {/* Voucher 1 */}
                <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px dashed rgba(255,255,255,0.5)', borderRadius: '16px', padding: '0.75rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 700 }}>Mã Giảm 10% Toàn Đơn</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.5px' }}>SPA10OFF</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopyText('SPA10OFF', 'Mã Giảm Giá')}
                    style={{ background: '#ffffff', color: '#ea580c', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                  >
                    Sao Chép
                  </button>
                </div>

                {/* Voucher 2 */}
                <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px dashed rgba(255,255,255,0.5)', borderRadius: '16px', padding: '0.75rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 700 }}>Mã Giảm 20% Khách VIP</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.5px' }}>PETLOVER20</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCopyText('PETLOVER20', 'Mã Giảm Giá')}
                    style={{ background: '#ffffff', color: '#ea580c', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                  >
                    Sao Chép
                  </button>
                </div>

                {/* Cart Action Button -> Dedicated /gio-hang Page */}
                <button 
                  type="button"
                  onClick={() => openCartPage()}
                  style={{ background: '#ffffff', color: '#ea580c', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s ease' }}
                >
                  <ShoppingCart size={18} /> Xem Giỏ Hàng ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
                </button>
              </div>
            </div>
          </div>

          {/* SHOP CONTROL BAR: SEARCH, SORT & CATEGORIES */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Row: Search Input + Live Counter + Sort Select */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '14px', padding: '0.6rem 1rem', border: '1.5px solid #e2e8f0', flex: '1', minWidth: '280px', maxWidth: '480px', transition: 'border-color 0.2s' }}>
                <Search size={18} color="#ea580c" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên hạt, pate, phụ kiện, SKU..." 
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.9rem', outline: 'none', width: '100%', fontWeight: 500 }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status and Sort Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, background: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  Hiển thị <strong style={{ color: '#ea580c' }}>{filteredProducts.length}</strong> / {products.length} sản phẩm
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Sắp xếp:</span>
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                    style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', borderRadius: '12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#0f172a', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="DEFAULT">⭐ Mặc định (Gợi ý)</option>
                    <option value="PRICE_LOW">💵 Giá: Thấp đến Cao</option>
                    <option value="PRICE_HIGH">💎 Giá: Cao đến Thấp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row: Category Navigation Chips */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              {[
                { id: 'ALL', label: '🌟 Tất Cả' },
                { id: 'Thức ăn', label: '🥣 Thức Ăn' },
                { id: 'Bánh thưởng', label: '🍖 Bánh Thưởng' },
                { id: 'Cát vệ sinh', label: '📦 Cát Vệ Sinh' },
                { id: 'Phụ kiện', label: '🎾 Phụ Kiện' },
                { id: 'Mỹ phẩm Spa', label: '🧴 Mỹ Phẩm' },
                { id: 'Dinh dưỡng', label: '💊 Dinh Dưỡng' },
                { id: 'Y tế', label: '🏥 Y Tế' }
              ].map(cat => {
                const isActive = selectedCategory === cat.id;
                const count = cat.id === 'ALL' ? visibleProducts.length : visibleProducts.filter(p => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.55rem 1.05rem',
                      borderRadius: '24px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: isActive ? '1.5px solid #ff6b35' : '1px solid #e2e8f0',
                      background: isActive ? 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 4px 14px rgba(255, 107, 53, 0.35)' : '0 2px 6px rgba(0,0,0,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '0.72rem',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 800
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRODUCT CARDS GRID */}
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {filteredProducts.map((p) => {
              const isLowStock = p.currentStock <= p.minStockLevel;
              const visual = getCategoryVisual(p.category);
              const brand = getProductBrand(p);
              const savingAmount = Math.round(p.unitPrice * 0.15);

              return (
                <div 
                  key={p.id} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: '22px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Top Header of Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ 
                      background: visual.badgeBg, 
                      color: visual.badgeColor, 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      padding: '3px 10px', 
                      borderRadius: '14px', 
                      border: '1px solid ' + visual.accent + '33',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {visual.emoji} {p.category}
                    </span>

                    {isLowStock ? (
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 800, padding: '3px 9px', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Flame size={12} /> Sắp hết: {p.currentStock} sp
                      </span>
                    ) : (
                      <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        ✓ Sẵn hàng ({p.currentStock})
                      </span>
                    )}
                  </div>

                  {/* Product Real Photo Showcase (Clickable -> Xem Chi Tiết) */}
                  <div
                    onClick={() => openProductDetail(p)}
                    title="Bấm để xem chi tiết sản phẩm"
                    style={{ 
                      background: '#ffffff', 
                      height: 195, 
                      borderRadius: '16px', 
                      margin: '0.5rem 0 0.85rem 0', 
                      border: '1px solid #e2e8f0',
                      position: 'relative',
                      overflow: 'hidden',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="media-card-img"
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getProductFallbackImage(p);
                      }}
                    />

                    {/* Brand Badge */}
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(6px)', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 9px', borderRadius: '20px', letterSpacing: '0.3px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {brand}
                    </div>

                    {/* Discount Ribbon */}
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Zap size={11} fill="#fff" /> -15%
                    </div>

                    {/* Delivery Tag */}
                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.95)', color: '#0f172a', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
                      ⚡ Giao 2h
                    </div>

                    {/* Quick Detail Hint Badge */}
                    <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(2,132,199,0.9)', color: '#ffffff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(2,132,199,0.25)' }}>
                      Xem chi tiết
                    </div>
                  </div>

                  {/* Product Details */}
                  <div>
                    {/* Rating and Social Proof */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 6px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>4.9</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: '2px' }}>(140+ đánh giá)</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '1px 6px', borderRadius: '6px' }}>
                        250+ đã bán
                      </span>
                    </div>

                    {/* Product Name (Clickable -> Xem Chi Tiết) */}
                    <h4
                      onClick={() => openProductDetail(p)}
                      title={p.name}
                      style={{ 
                        fontSize: '1.06rem', 
                        fontWeight: 800, 
                        color: '#0f172a', 
                        margin: '0.3rem 0',
                        lineHeight: '1.4',
                        minHeight: '44px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      {p.name}
                    </h4>

                    {/* SKU info + quick link */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.6rem' }}>
                      <span>Mã SKU: <span style={{ fontWeight: 600 }}>{p.sku}</span></span>
                      <button
                        type="button"
                        onClick={() => openProductDetail(p)}
                        style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer', padding: 0 }}
                      >
                        Chi tiết →
                      </button>
                    </div>

                    {/* Price Section */}
                    <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '12px', marginBottom: '0.85rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea580c' }}>
                          {p.unitPrice.toLocaleString('vi-VN')} đ
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          {Math.round(p.unitPrice * 1.15).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                        🎉 Tiết kiệm ngay {savingAmount.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      type="button"
                      className="btn btn-secondary" 
                      style={{ 
                        flex: 1, 
                        padding: '0.6rem 0.5rem', 
                        fontSize: '0.82rem', 
                        fontWeight: 700,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }} 
                      disabled={p.currentStock <= 0} 
                      onClick={() => handleAddToCart(p)}
                    >
                      <ShoppingCart size={15} /> Thêm Giỏ
                    </button>
                    <button 
                      type="button"
                      className="btn btn-coral" 
                      style={{ 
                        flex: 1, 
                        padding: '0.6rem 0.5rem', 
                        fontSize: '0.82rem', 
                        fontWeight: 800,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 100%)',
                        boxShadow: '0 4px 10px rgba(255, 107, 53, 0.25)'
                      }} 
                      disabled={p.currentStock <= 0} 
                      onClick={() => {
                        const added = handleAddToCart(p, 1, { selectOnly: true });
                        if (added) {
                          setCompletedOrderReceipt(null);
                          onTabChange('checkout');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    >
                      <Zap size={15} fill="#fff" /> Mua Ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.5. TRANG CHI TIẾT SẢN PHẨM RIÊNG (/san-pham/:id) */}
      {activeTab === 'product-detail' && (() => {
        const dp = products.find(item => item.id === selectedProductId) || products[0];
        if (!dp) {
          return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Không tìm thấy sản phẩm</h1>
              <button type="button" className="btn btn-coral" onClick={() => onTabChange('shop')}>
                <ArrowLeft size={16} /> Quay Lại Cửa Hàng
              </button>
            </div>
          );
        }

        const dVisual = getCategoryVisual(dp.category);
        const dBrand = getProductBrand(dp);
        const dInfo = getProductRichDetails(dp);
        const dOriginalPrice = Math.round(dp.unitPrice * 1.15);
        const dSaving = Math.round(dp.unitPrice * 0.15);
        const relatedProducts = products
          .filter(item => item.id !== dp.id && item.category === dp.category)
          .slice(0, 4);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Top Breadcrumb & Back Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#ffffff', padding: '0.9rem 1.35rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.84rem', color: '#64748b' }}>
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); onTabChange('home'); }}
                  style={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}
                >
                  Trang Chủ
                </a>
                <span>/</span>
                <a
                  href="/cua-hang"
                  onClick={(e) => { e.preventDefault(); onTabChange('shop'); }}
                  style={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}
                >
                  Cửa Hàng
                </a>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(dp.category);
                    onTabChange('shop');
                  }}
                  style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.84rem' }}
                >
                  {dp.category}
                </button>
                <span>/</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{dp.name}</span>
              </nav>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderRadius: '10px' }}
                onClick={() => onTabChange('shop')}
              >
                <ArrowLeft size={15} /> Quay Lại Cửa Hàng
              </button>
            </div>

            {/* Main 2-Column Product Hero Card */}
            <article className="glass-panel" style={{ padding: '2rem', borderRadius: '22px' }}>
              <div className="grid-2" style={{ gap: '2.25rem', alignItems: 'start' }}>
                {/* Left Column: Large Crisp Studio Image + Guarantees */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ position: 'relative', height: 410, background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(15, 23, 42, 0.05)' }}>
                    <img
                      src={getProductImage(dp)}
                      alt={dp.name}
                      referrerPolicy="no-referrer"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getProductFallbackImage(dp);
                      }}
                    />
                    <span style={{ position: 'absolute', top: 14, left: 14, background: '#0f172a', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px' }}>
                      {dBrand}
                    </span>
                    <span style={{ position: 'absolute', top: 14, right: 14, background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 900, padding: '5px 12px', borderRadius: '14px', boxShadow: '0 4px 12px rgba(239,68,68,0.35)' }}>
                      GIẢM 15%
                    </span>
                  </div>

                  {/* Trust Guarantee Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#15803d' }}>
                      <ShieldCheck size={18} style={{ display: 'block', margin: '0 auto 5px' }} /> Chính Hãng 100%
                    </div>
                    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#c2410c' }}>
                      <Truck size={18} style={{ display: 'block', margin: '0 auto 5px' }} /> Giao Hỏa Tốc 2H
                    </div>
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#0369a1' }}>
                      <RotateCcw size={18} style={{ display: 'block', margin: '0 auto 5px' }} /> Đổi Trả 7 Ngày
                    </div>
                  </div>
                </div>

                {/* Right Column: Title, Price, Voucher, Specs, Quantity & Buy CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: dVisual.badgeBg, color: dVisual.badgeColor, fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '14px' }}>
                      {dVisual.emoji} {dp.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      Mã SKU: <strong style={{ color: '#0f172a' }}>{dp.sku}</strong>
                    </span>
                  </div>

                  <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.32, margin: 0 }}>
                    {dp.name}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.86rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 800 }}>
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <Star size={15} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ marginLeft: '4px' }}>4.9</span>
                    </span>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span style={{ color: '#475569' }}>140+ đánh giá</span>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>250+ đã bán</span>
                  </div>

                  {/* Price & Voucher Box */}
                  <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1.5px solid #fed7aa', borderRadius: '18px', padding: '1.15rem 1.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ea580c' }}>
                        {dp.unitPrice.toLocaleString('vi-VN')} đ
                      </strong>
                      <span style={{ fontSize: '1.08rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                        {dOriginalPrice.toLocaleString('vi-VN')} đ
                      </span>
                      <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
                        Tiết kiệm {dSaving.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #fdba74', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.82rem', color: '#9a3412', fontWeight: 700 }}>
                        🎁 Mã giảm thêm 10% đơn hàng: <strong>SPA10OFF</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText('SPA10OFF', 'Mã Giảm Giá')}
                        style={{ background: '#ffffff', color: '#ea580c', border: '1px solid #fdba74', borderRadius: '8px', padding: '3px 10px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Sao Chép Mã
                      </button>
                    </div>
                  </div>

                  {/* Specs Card */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem 1.15rem', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Tình trạng kho:</span>
                      <strong style={{ color: dp.currentStock > 0 ? '#059669' : '#dc2626' }}>
                        {dp.currentStock > 0 ? `✓ Sẵn hàng (${dp.currentStock} sản phẩm)` : 'Tạm hết hàng'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Thương hiệu:</span>
                      <strong style={{ color: '#0f172a', textAlign: 'right' }}>{dBrand}</strong>
                    </div>
                    {dp.unit && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <span style={{ color: '#64748b' }}>Quy cách / ĐVT:</span>
                        <strong style={{ color: '#0f172a', textAlign: 'right' }}>{dp.unit}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Phù hợp cho:</span>
                      <strong style={{ color: '#0f172a', textAlign: 'right' }}>{dInfo.targetPet}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Xuất xứ:</span>
                      <strong style={{ color: '#0f172a', textAlign: 'right' }}>{dInfo.origin}</strong>
                    </div>
                    {dp.expiryDate && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <span style={{ color: '#64748b' }}>Hạn sử dụng:</span>
                        <strong style={{ color: '#059669', textAlign: 'right' }}>{dp.expiryDate}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ color: '#64748b' }}>Nhà phân phối:</span>
                      <strong style={{ color: '#0284c7', textAlign: 'right' }}>{dp.supplierName || 'Petzera Official'}</strong>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.4rem 0' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>Số lượng đặt mua:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <button
                        type="button"
                        onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                        style={{ width: 38, height: 38, borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 900, fontSize: '1.15rem', color: '#0f172a' }}>
                        {detailQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDetailQuantity(q => Math.min(Math.max(1, dp.currentStock), q + 1))}
                        disabled={detailQuantity >= dp.currentStock}
                        style={{ width: 38, height: 38, borderRadius: '10px', border: '1px solid #cbd5e1', background: detailQuantity >= dp.currentStock ? '#f1f5f9' : '#ffffff', cursor: detailQuantity >= dp.currentStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Action CTA Buttons */}
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={dp.currentStock <= 0}
                      style={{ flex: 1, minWidth: 170, padding: '0.95rem 1rem', fontSize: '0.95rem', fontWeight: 800, borderRadius: '14px' }}
                      onClick={() => handleAddToCart(dp, detailQuantity)}
                    >
                      <ShoppingCart size={18} /> Thêm Vào Giỏ Hàng
                    </button>
                    <button
                      type="button"
                      className="btn btn-coral"
                      disabled={dp.currentStock <= 0}
                      style={{ flex: 1, minWidth: 200, padding: '0.95rem 1rem', fontSize: '0.95rem', fontWeight: 800, borderRadius: '14px' }}
                      onClick={() => {
                        const added = handleAddToCart(dp, detailQuantity, { selectOnly: true });
                        if (added) {
                          setCompletedOrderReceipt(null);
                          onTabChange('checkout');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    >
                      <Zap size={18} fill="#fff" /> Mua Ngay ({(dp.unitPrice * detailQuantity).toLocaleString('vi-VN')} đ)
                    </button>
                  </div>

                  {/* Quick Vet/Shop Consultation Box */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '0.8rem 1rem', fontSize: '0.83rem' }}>
                    <span style={{ color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PhoneCall size={15} /> Cần tư vấn chọn khẩu phần / size cho bé?
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ background: '#0284c7', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.78rem' }}>
                        Gọi {CONTACT_INFO.phoneDisplay}
                      </a>
                      <a href={CONTACT_INFO.zaloLink} onClick={openZaloQrModal} style={{ background: '#0068FF', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.78rem' }}>
                        💬 Chat Zalo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Detailed Product Information & Usage Section */}
            <section className="glass-panel" style={{ padding: '2rem', borderRadius: '22px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
                Mô Tả &amp; Công Dụng Chi Tiết Sản Phẩm
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                {dInfo.summary}
              </p>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                Điểm Nổi Bật
              </h3>
              <div className="grid-2" style={{ gap: '0.85rem', marginBottom: '1.25rem' }}>
                {dInfo.highlights.map((hl, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.88rem', color: '#334155', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <CheckCircle size={17} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '1rem 1.25rem', fontSize: '0.88rem', color: '#78350f', lineHeight: 1.65 }}>
                <strong>📌 Hướng dẫn sử dụng &amp; bảo quản:</strong> {dInfo.usage}
              </div>
            </section>

            {/* Customer Reviews for this Product */}
            <CustomerReviewSection
              reviews={reviews.filter(
                (r) =>
                  r.targetType === 'PRODUCT' &&
                  (r.targetId === dp.id ||
                    (r.targetName || '').trim().toLowerCase() === (dp.name || '').trim().toLowerCase())
              )}
              targetType="PRODUCT"
              targetId={dp.id}
              targetName={dp.name}
              currentUser={currentUser}
              myPets={myPets}
              onAddReview={onAddReview}
              onDeleteReview={onDeleteReview}
              onOpenLogin={onOpenLogin}
              title="Đánh Giá Sản Phẩm"
              subtitle={`Nhận xét từ khách hàng đã mua "${dp.name}"`}
            />

            {/* Related Products Grid */}
            {relatedProducts.length > 0 && (
              <section className="glass-panel" style={{ padding: '2rem', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Sản Phẩm Tương Tự Trong Danh Mục "{dp.category}"
                  </h2>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                    onClick={() => {
                      setSelectedCategory(dp.category);
                      onTabChange('shop');
                    }}
                  >
                    Xem tất cả {dp.category} <ArrowRight size={15} />
                  </button>
                </div>

                <div className="grid-4" style={{ gap: '1.25rem' }}>
                  {relatedProducts.map(rel => (
                    <div
                      key={rel.id}
                      className="glass-card"
                      onClick={() => openProductDetail(rel)}
                      style={{ padding: '1rem', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div style={{ height: 145, background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '10px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img
                            src={getProductImage(rel)}
                            alt={rel.name}
                            referrerPolicy="no-referrer"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getProductFallbackImage(rel);
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40 }}>
                          {rel.name}
                        </div>
                      </div>
                      <div style={{ marginTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1rem', color: '#ea580c' }}>{rel.unitPrice.toLocaleString('vi-VN')} đ</strong>
                        <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700 }}>Xem →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      })()}

      {/* 4.8. DEDICATED TRANG GIỎ HÀNG RIÊNG (/gio-hang) */}
      {activeTab === 'cart' && (() => {
        const totalQty = cart.reduce((s, i) => s + i.quantity, 0);
        const freeShipGoal = 500000;
        const missingForFreeShip = Math.max(0, freeShipGoal - cartSubtotal);
        const freeShipPercent = Math.min(100, Math.round((cartSubtotal / freeShipGoal) * 100));
        const suggestedItems = products.filter(p => !cart.some(c => c.id === p.id)).slice(0, 4);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Top Header & 3-Step E-Commerce Stepper */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1.25rem 1.75rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
              <div>
                <button
                  type="button"
                  onClick={() => onTabChange('shop')}
                  style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', padding: 0 }}
                >
                  <ArrowLeft size={16} /> Tiếp Tục Mua Sắm Tại Cửa Hàng
                </button>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                  <ShoppingCart size={24} color="#ff6b35" /> Giỏ Hàng Của Bạn ({totalQty} sản phẩm)
                </h1>
              </div>

              {/* 3-Step Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6b35', fontWeight: 800 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 900 }}>1</span>
                  <span>1. Giỏ Hàng</span>
                </div>
                <div style={{ width: 24, height: 2, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontWeight: 600 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem' }}>2</span>
                  <span>2. Thanh Toán</span>
                </div>
                <div style={{ width: 24, height: 2, background: '#e2e8f0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontWeight: 600 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem' }}>3</span>
                  <span>3. Hoàn Tất</span>
                </div>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '22px' }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1.5px solid #fed7aa' }}>
                  <ShoppingBag size={40} color="#ff6b35" />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Giỏ hàng của bạn đang trống!
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 460, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                  Hãy dạo quanh cửa hàng Petzera Super Shop để chọn thức ăn hạt Royal Canin, sữa bột dinh dưỡng, cát vệ sinh và phụ kiện chính hãng cho bé cưng nhé.
                </p>
                <button
                  type="button"
                  className="btn btn-coral"
                  onClick={() => onTabChange('shop')}
                  style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem', fontWeight: 800, borderRadius: '14px' }}
                >
                  Khám Phá Cửa Hàng Ngay <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
                {/* LEFT COLUMN: Free-Ship Progress + Cart Items List */}
                <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Free Express Shipping Progress Bar */}
                  <div className="glass-panel" style={{ padding: '1.15rem 1.35rem', borderRadius: '16px', background: missingForFreeShip === 0 ? '#ecfdf5' : '#fffbeb', borderColor: missingForFreeShip === 0 ? '#a7f3d0' : '#fde68a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 700, color: missingForFreeShip === 0 ? '#047857' : '#92400e', marginBottom: '0.55rem' }}>
                      <span>
                        {missingForFreeShip === 0
                          ? '🎉 Chúc mừng! Đơn hàng của bạn được MIỄN PHÍ giao hỏa tốc 2H!'
                          : `⚡ Mua thêm ${missingForFreeShip.toLocaleString('vi-VN')} đ để được Miễn phí giao hỏa tốc 2H`}
                      </span>
                      <span>{freeShipPercent}%</span>
                    </div>
                    <div style={{ height: 7, background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${freeShipPercent}%`, height: '100%', background: missingForFreeShip === 0 ? '#059669' : 'linear-gradient(90deg, #ff6b35 0%, #f59e0b 100%)', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>

                  {/* Cart Items Panel */}
                  <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={allCartSelected}
                          onChange={toggleSelectAllCart}
                          style={{ width: 19, height: 19, accentColor: '#ff6b35', cursor: 'pointer' }}
                        />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          Chọn Tất Cả ({selectedCartItems.length}/{cart.length} loại • {selectedTotalQty} món)
                        </h2>
                      </label>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {selectedCartItems.length > 0 && selectedCartItems.length < cart.length && (
                          <button
                            type="button"
                            onClick={handleRemoveSelectedItems}
                            style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#ea580c', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 11px', borderRadius: '10px' }}
                          >
                            <Trash2 size={14} /> Xóa Đã Chọn ({selectedCartItems.length})
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleClearCart}
                          style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 11px', borderRadius: '10px' }}
                        >
                          <Trash2 size={14} /> Xóa Toàn Bộ Giỏ
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {cart.map((item) => {
                        const isSelected = selectedCartIds.includes(item.id);
                        return (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            background: isSelected ? '#fffaf5' : '#f8fafc',
                            padding: '1rem 1.15rem',
                            borderRadius: '16px',
                            border: isSelected ? '1.5px solid #fdba74' : '1px solid #e2e8f0',
                            opacity: isSelected ? 1 : 0.72,
                            transition: 'all 0.18s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: 240 }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectCartItem(item.id)}
                              aria-label={`Chọn thanh toán ${item.name}`}
                              style={{ width: 20, height: 20, accentColor: '#ff6b35', cursor: 'pointer', flexShrink: 0 }}
                            />
                            <div
                              onClick={() => openProductDetail(item)}
                              title="Xem chi tiết sản phẩm"
                              style={{ width: 78, height: 78, borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                            >
                              <img
                                src={getProductImage(item)}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProductFallbackImage(item); }}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', background: '#f0f9ff', padding: '2px 8px', borderRadius: '8px', display: 'inline-block', marginBottom: '4px' }}>
                                {item.category || 'Sản phẩm'} • SKU: {item.sku}
                              </span>
                              <h3
                                onClick={() => openProductDetail(item)}
                                style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', cursor: 'pointer', lineHeight: 1.35 }}
                              >
                                {item.name}
                              </h3>
                              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                Đơn giá: <strong style={{ color: '#0f172a' }}>{item.unitPrice.toLocaleString('vi-VN')} đ</strong> • Kho còn: {item.currentStock} sp
                              </div>
                            </div>
                          </div>

                          {/* Quantity Stepper + Line Total + Delete */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, -1)}
                                style={{ width: 32, height: 32, borderRadius: '9px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Giảm số lượng"
                              >
                                <Minus size={14} />
                              </button>
                              <span style={{ fontWeight: 900, fontSize: '1rem', minWidth: 26, textAlign: 'center', color: '#0f172a' }}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, 1)}
                                disabled={item.quantity >= item.currentStock}
                                style={{ width: 32, height: 32, borderRadius: '9px', border: '1px solid #cbd5e1', background: item.quantity >= item.currentStock ? '#f1f5f9' : '#ffffff', cursor: item.quantity >= item.currentStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Tăng số lượng"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: 105 }}>
                              <strong style={{ color: isSelected ? '#ea580c' : '#94a3b8', fontSize: '1.08rem', display: 'block' }}>
                                {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                              </strong>
                              <button
                                type="button"
                                onClick={() => removeCartItem(item.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, padding: 0, marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              >
                                <Trash2 size={13} /> Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Sticky Order Summary & Voucher */}
                <div style={{ position: 'sticky', top: '96px' }}>
                  <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px', boxShadow: 'var(--shadow-soft)' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', paddingBottom: '0.9rem', marginBottom: '1.15rem', borderBottom: '1px solid var(--border-light)' }}>
                      🧾 Tóm Tắt Đơn Hàng
                    </h2>

                    {/* Voucher Input & Chips */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Mã giảm giá / Voucher Petzera
                      </label>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value)}
                          placeholder="Nhập mã (VD: SPA10OFF)"
                          style={{ textTransform: 'uppercase', fontSize: '0.85rem', padding: '0.6rem 0.85rem' }}
                        />
                        <button type="button" className="btn btn-secondary" onClick={() => applyPromoCode()} style={{ whiteSpace: 'nowrap', padding: '0.6rem 1rem' }}>
                          Áp Dụng
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => applyPromoCode('SPA10OFF')}
                          style={{ background: '#f0fdf4', border: '1px dashed #22c55e', color: '#15803d', padding: '3px 9px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          🏷️ SPA10OFF (-10%)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPromoCode('PETLOVER20')}
                          style={{ background: '#fef3c7', border: '1px dashed #f59e0b', color: '#b45309', padding: '3px 9px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          🏷️ PETLOVER20 (-20%)
                        </button>
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Đã chọn ({selectedTotalQty} sản phẩm):</span>
                        <strong style={{ color: '#0f172a' }}>{cartSubtotal.toLocaleString('vi-VN')} đ</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Giao hàng tiêu chuẩn:</span>
                        <strong style={{ color: '#059669' }}>MIỄN PHÍ</strong>
                      </div>
                      {discountPercent > 0 && selectedCartItems.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                          <span>Giảm giá ({discountPercent}%):</span>
                          <strong>-{discountAmount.toLocaleString('vi-VN')} đ</strong>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', marginTop: '0.2rem' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>TỔNG TẠM TÍNH:</span>
                        <strong style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ff6b35' }}>
                          {(cartSubtotal - discountAmount).toLocaleString('vi-VN')} đ
                        </strong>
                      </div>
                    </div>

                    {selectedCartItems.length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#ea580c', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '0.6rem 0.85rem', marginBottom: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                        Hãy tích chọn ít nhất 1 sản phẩm ở bên trái để thanh toán.
                      </div>
                    )}

                    {/* Primary CTA */}
                    <button
                      type="button"
                      className="btn btn-coral"
                      onClick={handleProceedToCheckout}
                      disabled={selectedCartItems.length === 0}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 800,
                        borderRadius: '14px',
                        marginBottom: '0.75rem',
                        opacity: selectedCartItems.length === 0 ? 0.5 : 1,
                        cursor: selectedCartItems.length === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Tiến Hành Thanh Toán ({selectedTotalQty}) <ArrowRight size={18} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onTabChange('shop')}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', fontWeight: 700, borderRadius: '14px' }}
                    >
                      Tiếp Tục Mua Sắm
                    </button>

                    <div style={{ marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.76rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} color="#059669" /> Cam kết 100% sản phẩm chính hãng
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RotateCcw size={14} color="#0284c7" /> Đổi trả miễn phí trong 7 ngày
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PhoneCall size={14} color="#ea580c" /> Hotline hỗ trợ: <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ color: '#ea580c', fontWeight: 800, textDecoration: 'none' }}>{CONTACT_INFO.phoneDisplay}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Best-Sellers Below Cart */}
            {suggestedItems.length > 0 && (
              <section className="glass-panel" style={{ padding: '1.75rem', borderRadius: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Gợi Ý Sản Phẩm Bán Chạy Cho Bé Cưng
                  </h2>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }} onClick={() => onTabChange('shop')}>
                    Xem tất cả <ArrowRight size={15} />
                  </button>
                </div>

                <div className="grid-4" style={{ gap: '1.15rem' }}>
                  {suggestedItems.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div
                          onClick={() => openProductDetail(item)}
                          style={{ height: 140, background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '10px', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProductFallbackImage(item); }}
                          />
                        </div>
                        <div
                          onClick={() => openProductDetail(item)}
                          style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38, cursor: 'pointer' }}
                        >
                          {item.name}
                        </div>
                      </div>
                      <div style={{ marginTop: '0.75rem' }}>
                        <strong style={{ fontSize: '1rem', color: '#ea580c', display: 'block', marginBottom: '0.5rem' }}>
                          {item.unitPrice.toLocaleString('vi-VN')} đ
                        </strong>
                        <button
                          type="button"
                          className="btn btn-coral"
                          style={{ width: '100%', padding: '0.48rem', fontSize: '0.8rem' }}
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart size={14} /> Thêm Vào Giỏ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      })()}

      {/* 5. DEDICATED TRANG THANH TOÁN PETZERA (/thanh-toan + Bước 3 Hoàn Tất) */}
      {activeTab === 'checkout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Top Breadcrumb & 3-Step Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', padding: '1.25rem 1.75rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
            <div>
              <button 
                type="button"
                onClick={() => {
                  setCompletedOrderReceipt(null);
                  openCartPage();
                }}
                style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', padding: 0 }}
              >
                <ArrowLeft size={16} /> Quay Lại Giỏ Hàng
              </button>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <ShoppingCart size={24} color="#ff6b35" /> {completedOrderReceipt ? 'Đặt Hàng Thành Công!' : 'Thanh Toán Đơn Hàng An Toàn'}
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {completedOrderReceipt
                  ? 'Cảm ơn bạn đã tin tưởng Petzera! Đơn hàng của bạn đang được bộ phận kho tiếp nhận & đóng gói.'
                  : 'Vui lòng điền thông tin người nhận, chọn phương thức vận chuyển và hoàn tất thanh toán'}
              </p>
            </div>

            {/* Dynamic 3-Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setCompletedOrderReceipt(null);
                  openCartPage();
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
              >
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>✓</span>
                <span>1. Giỏ Hàng</span>
              </button>
              <div style={{ width: 24, height: 2, background: completedOrderReceipt ? '#10b981' : '#ff6b35' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: completedOrderReceipt ? '#10b981' : '#ff6b35', fontWeight: 800 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: completedOrderReceipt ? '#d1fae5' : '#ffedd5', color: completedOrderReceipt ? '#059669' : '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                  {completedOrderReceipt ? '✓' : '2'}
                </span>
                <span>2. Thanh Toán</span>
              </div>
              <div style={{ width: 24, height: 2, background: completedOrderReceipt ? '#10b981' : '#e2e8f0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: completedOrderReceipt ? '#059669' : '#94a3b8', fontWeight: completedOrderReceipt ? 800 : 600 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: completedOrderReceipt ? '#d1fae5' : '#f1f5f9', color: completedOrderReceipt ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                  {completedOrderReceipt ? '✓' : '3'}
                </span>
                <span>3. Hoàn Tất</span>
              </div>
            </div>
          </div>

          {payosVerifyingReturn ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '22px', maxWidth: 640, width: '100%', margin: '0 auto' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <RefreshCw size={32} color="#059669" className="animate-spin" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Đang Xác Nhận Thanh Toán Online...
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Hệ thống đang đối chiếu giao dịch trực tiếp với cổng thanh toán payOS. Vui lòng đợi trong giây lát!
              </p>
            </div>
          ) : completedOrderReceipt ? (
            /* STEP 3: ORDER CONFIRMATION RECEIPT */
            <div className="glass-panel" style={{ padding: '2.25rem', borderRadius: '22px', maxWidth: 820, width: '100%', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle size={40} color="#059669" />
                </div>
                <span className="badge badge-success" style={{ marginBottom: '0.6rem', fontSize: '0.8rem' }}>
                  MÃ ĐƠN HÀNG: {completedOrderReceipt.orderId}
                </span>
                <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0' }}>
                  Cảm Ơn Bạn Đã Đặt Hàng Tại Petzera!
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                  Thời gian đặt: <strong>{completedOrderReceipt.createdAt}</strong> • Nhân viên sẽ sớm liên hệ xác nhận giao hàng.
                </p>
              </div>

              {/* Order Recipient & Payment Info */}
              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem', fontSize: '0.86rem' }}>
                  <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#ea580c" /> Thông Tin Giao Hàng
                  </h3>
                  <div style={{ color: '#334155', lineHeight: 1.65 }}>
                    <div><strong>Người nhận:</strong> {completedOrderReceipt.recipientName}</div>
                    <div><strong>Điện thoại:</strong> {completedOrderReceipt.recipientPhone}</div>
                    <div><strong>Địa chỉ:</strong> {completedOrderReceipt.deliveryAddress}</div>
                    {completedOrderReceipt.deliveryNotes && (
                      <div><strong>Ghi chú:</strong> {completedOrderReceipt.deliveryNotes}</div>
                    )}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem', fontSize: '0.86rem' }}>
                  <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={16} color="#0284c7" /> Thanh Toán &amp; Vận Chuyển
                  </h3>
                  <div style={{ color: '#334155', lineHeight: 1.65 }}>
                    <div>
                      <strong>Thanh toán:</strong>{' '}
                      {completedOrderReceipt.paymentMethod === 'PAYOS'
                        ? 'Thanh Toán Online (ĐÃ THANH TOÁN ✅)'
                        : 'Tiền Mặt Khi Nhận Hàng (COD)'}
                    </div>
                    <div>
                      <strong>Vận chuyển:</strong>{' '}
                      {completedOrderReceipt.shippingMethod === 'EXPRESS' ? 'Hỏa Tốc Petzera 2H' : 'Giao Hàng Tiêu Chuẩn (1-2 ngày)'}
                    </div>
                    <div>
                      <strong>Tổng thanh toán:</strong>{' '}
                      <strong style={{ color: '#ea580c', fontSize: '1.05rem' }}>
                        {completedOrderReceipt.grandTotal.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items Receipt List */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Sản Phẩm Đã Đặt ({completedOrderReceipt.items.reduce((s, i) => s + i.quantity, 0)} món)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {completedOrderReceipt.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', background: '#ffffff', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.86rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <img
                          src={getProductImage(item)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProductFallbackImage(item); }}
                          style={{ width: 42, height: 42, objectFit: 'contain', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '2px' }}
                        />
                        <div>
                          <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {item.unitPrice.toLocaleString('vi-VN')} đ × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <strong style={{ color: '#059669', whiteSpace: 'nowrap' }}>
                        {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-coral"
                  style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', fontWeight: 800, borderRadius: '14px' }}
                  onClick={() => {
                    setCompletedOrderReceipt(null);
                    onTabChange('history');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Clock size={17} /> Theo Dõi Đơn Hàng Của Tôi
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 1.5rem', fontSize: '0.92rem', fontWeight: 700, borderRadius: '14px' }}
                  onClick={() => {
                    setCompletedOrderReceipt(null);
                    onTabChange('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Tiếp Tục Mua Sắm <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : selectedCartItems.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid #ffedd5' }}>
                <ShoppingBag size={40} color="#ff6b35" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                {cart.length > 0 ? 'Chưa Chọn Sản Phẩm Để Thanh Toán' : 'Giỏ Hàng Của Bạn Đang Trống'}
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                {cart.length > 0
                  ? `Bạn đang có ${cart.length} sản phẩm trong giỏ hàng. Hãy quay lại Giỏ Hàng để tích chọn sản phẩm muốn thanh toán nhé!`
                  : 'Hiện tại không có sản phẩm nào để tiến hành thanh toán. Hãy ghé qua Cửa Hàng Petzera để lựa chọn thức ăn, đồ dùng và đồ chơi cho bé cưng!'}
              </p>
              <button
                className="btn btn-coral"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
                onClick={() => (cart.length > 0 ? openCartPage() : onTabChange('shop'))}
              >
                {cart.length > 0 ? 'Quay Lại Giỏ Hàng Chọn Sản Phẩm' : 'Khám Phá Cửa Hàng Ngay'} <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleFinalPlaceOrder} className="checkout-layout-grid">
              
              {/* LEFT COLUMN: Recipient Information, Shipping, Payment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Recipient Information & Interactive Map Address Picker */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={20} color="#ea580c" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          1. Thông Tin Nhận Hàng
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                          Điền thông tin liên hệ và ghim địa chỉ giao hàng chính xác trên bản đồ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 1: Recipient Name & Phone (Full-width balanced 2 columns) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Họ và tên người nhận <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                          type="text"
                          required
                          className="form-control"
                          style={{ paddingLeft: '38px' }}
                          placeholder="Nhập họ và tên người nhận"
                          value={checkoutForm.recipientName}
                          onChange={e => setCheckoutForm({ ...checkoutForm, recipientName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Số điện thoại liên hệ <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <PhoneCall size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                          type="tel"
                          required
                          className="form-control"
                          style={{ paddingLeft: '38px' }}
                          placeholder="VD: 0348 639 603"
                          value={checkoutForm.recipientPhone}
                          onChange={e => setCheckoutForm({ ...checkoutForm, recipientPhone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Detailed Delivery Address + Interactive Map Picker */}
                  <div style={{ marginBottom: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                        Địa chỉ nhận hàng chi tiết <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowMapPicker(prev => !prev)}
                        style={{
                          background: showMapPicker ? '#eff6ff' : '#fff7ed',
                          border: showMapPicker ? '1px solid #bfdbfe' : '1px solid #fed7aa',
                          color: showMapPicker ? '#1d4ed8' : '#ea580c',
                          borderRadius: '999px',
                          padding: '3px 11px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <MapPin size={13} />
                        {showMapPicker ? 'Thu gọn bản đồ' : 'Chọn địa chỉ trên bản đồ'}
                      </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} color="#ff6b35" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        required
                        className="form-control"
                        style={{ paddingLeft: '38px' }}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố (hoặc chọn trên bản đồ bên dưới)"
                        value={checkoutForm.deliveryAddress}
                        onChange={e => setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value, deliveryCoords: null })}
                      />
                    </div>

                    {checkoutForm.deliveryCoords && (
                      <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '999px' }}>
                        <CheckCircle size={13} /> Đã ghim tọa độ bản đồ: {checkoutForm.deliveryCoords.lat.toFixed(5)}, {checkoutForm.deliveryCoords.lng.toFixed(5)}
                      </div>
                    )}

                    {showMapPicker && (
                      <AddressMapPicker
                        value={checkoutForm.deliveryAddress}
                        coords={checkoutForm.deliveryCoords}
                        onSelectAddress={({ address, lat, lng }) =>
                          setCheckoutForm(prev => ({
                            ...prev,
                            deliveryAddress: address,
                            deliveryCoords: { lat, lng },
                          }))
                        }
                      />
                    )}
                  </div>

                  {/* Row 3: Delivery Notes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Ghi chú đơn hàng <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Tùy chọn)</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="VD: Gọi trước khi giao 15 phút, giao cổng sau..."
                      value={checkoutForm.deliveryNotes}
                      onChange={e => setCheckoutForm({ ...checkoutForm, deliveryNotes: e.target.value })}
                      style={{ resize: 'vertical', minHeight: '68px' }}
                    />
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                      {[
                        '📞 Gọi trước 15 phút',
                        '🏢 Giao giờ hành chính',
                        '📦 Gửi lễ tân / bảo vệ',
                        '🐾 Hàng thú cưng nhẹ tay'
                      ].map((chip, idx) => {
                        const alreadyAdded = (checkoutForm.deliveryNotes || '').includes(chip);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              if (alreadyAdded) return;
                              const newNotes = checkoutForm.deliveryNotes ? `${checkoutForm.deliveryNotes}, ${chip}` : chip;
                              setCheckoutForm({ ...checkoutForm, deliveryNotes: newNotes });
                            }}
                            style={{
                              background: alreadyAdded ? '#fff7ed' : '#f8fafc',
                              border: alreadyAdded ? '1px solid #fdba74' : '1px solid #e2e8f0',
                              borderRadius: '999px',
                              padding: '4px 10px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: alreadyAdded ? '#ea580c' : '#475569',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {alreadyAdded ? '✓ ' : '+ '}{chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Method */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#0f172a' }}>
                    <Truck size={20} color="#ff6b35" /> 2. Phương Thức Vận Chuyển
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {/* Option: Standard */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, shippingMethod: 'STANDARD' })}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.shippingMethod === 'STANDARD' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.shippingMethod === 'STANDARD' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                          type="radio" 
                          name="shippingMethod" 
                          checked={checkoutForm.shippingMethod === 'STANDARD'} 
                          onChange={() => setCheckoutForm({ ...checkoutForm, shippingMethod: 'STANDARD' })}
                          style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            🚚 Giao Hàng Tiêu Chuẩn (1 - 2 Ngày)
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Miễn phí vận chuyển toàn quốc cho đơn hàng Petzera
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>MIỄN PHÍ (0 đ)</span>
                    </label>

                    {/* Option: Express (chỉ bật khi địa chỉ thuộc nội thành TP.HCM) */}
                    <label
                      onClick={() => {
                        if (!expressEligibility.eligible) {
                          toast.warning(expressEligibility.reason, 'Không Hỗ Trợ Hỏa Tốc 2H');
                          return;
                        }
                        setCheckoutForm({ ...checkoutForm, shippingMethod: 'EXPRESS' });
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        borderRadius: '14px',
                        border: checkoutForm.shippingMethod === 'EXPRESS' && expressEligibility.eligible
                          ? '2px solid #ff6b35'
                          : '1px solid #e2e8f0',
                        background: !expressEligibility.eligible
                          ? '#f8fafc'
                          : checkoutForm.shippingMethod === 'EXPRESS'
                            ? '#fff7ed'
                            : '#ffffff',
                        opacity: expressEligibility.eligible ? 1 : 0.68,
                        cursor: expressEligibility.eligible ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="shippingMethod"
                          disabled={!expressEligibility.eligible}
                          checked={checkoutForm.shippingMethod === 'EXPRESS' && expressEligibility.eligible}
                          onChange={() => {
                            if (expressEligibility.eligible) {
                              setCheckoutForm({ ...checkoutForm, shippingMethod: 'EXPRESS' });
                            }
                          }}
                          style={{ accentColor: '#ff6b35', width: 18, height: 18, cursor: expressEligibility.eligible ? 'pointer' : 'not-allowed' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: expressEligibility.eligible ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            ⚡ Hỏa Tốc Petzera 2H (Nội Thành TP.HCM)
                            {expressEligibility.eligible ? (
                              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '10px', fontWeight: 800 }}>
                                ✓ HỖ TRỢ
                              </span>
                            ) : (
                              <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '10px', fontWeight: 800 }}>
                                NGOÀI PHẠM VI
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.79rem', color: expressEligibility.eligible ? '#047857' : '#b45309', marginTop: '2px', fontWeight: expressEligibility.eligible ? 600 : 500 }}>
                            {expressEligibility.reason}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, color: !expressEligibility.eligible ? '#94a3b8' : cartSubtotal >= 500000 ? '#059669' : '#ea580c', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
                        {!expressEligibility.eligible ? 'Không áp dụng' : cartSubtotal >= 500000 ? 'MIỄN PHÍ' : '30.000 đ'}
                      </span>
                    </label>

                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', color: '#0f172a' }}>
                    <CreditCard size={20} color="#ff6b35" /> 3. Phương Thức Thanh Toán
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {/* Method 1: COD */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.paymentMethod === 'COD' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.paymentMethod === 'COD' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        checked={checkoutForm.paymentMethod === 'COD'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                        style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                      />
                      <div style={{ fontSize: '1.4rem' }}>💵</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Kiểm tra sản phẩm tận tay, thanh toán trực tiếp cho nhân viên giao hàng
                        </div>
                      </div>
                    </label>

                    {/* Method 2: Thanh Toán Online (payOS VietQR Tự Động) */}
                    <label 
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'PAYOS' })}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        border: checkoutForm.paymentMethod === 'PAYOS' ? '2px solid #ff6b35' : '1px solid #e2e8f0', 
                        background: checkoutForm.paymentMethod === 'PAYOS' ? '#fff7ed' : '#ffffff', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        checked={checkoutForm.paymentMethod === 'PAYOS'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'PAYOS' })}
                        style={{ accentColor: '#ff6b35', width: 18, height: 18 }}
                      />
                      <div style={{ fontSize: '1.45rem' }}>⚡</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          Thanh Toán Online
                          <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>TỰ ĐỘNG XÁC NHẬN ⭐</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Quét mã QR ngân hàng (VietQR 24/7 qua payOS) — tự động xác nhận ĐÃ THANH TOÁN sau 2–5 giây
                        </div>
                      </div>
                    </label>

                    {/* Online Payment Embedded payOS Box right inside Section 3 */}
                    {checkoutForm.paymentMethod === 'PAYOS' && (
                      payosEmbedded ? (
                        <PayOSEmbeddedBox
                          checkoutUrl={payosEmbedded.checkoutUrl}
                          orderCode={payosEmbedded.orderCode}
                          amount={payosEmbedded.amount}
                          currentTotal={grandTotal}
                          expiresAt={payosEmbedded.expiresAt}
                          accountNumber={payosEmbedded.accountNumber}
                          accountName={payosEmbedded.accountName}
                          description={payosEmbedded.description}
                          onCopyText={handleCopyText}
                          checkingStatus={payosChecking}
                          regenerating={payosLoading}
                          onSuccess={() => finalizeOrderSuccess(payosEmbedded.pendingOrder, { paidViaPayOS: true })}
                          onCancel={handleCancelEmbeddedPayOS}
                          onExpireAndRegenerate={() => handleExpireAndRegeneratePayOS(payosEmbedded)}
                          onRefreshAmount={() => handleFinalPlaceOrder()}
                          onCheckStatusNow={() => checkEmbeddedPayOSStatus(payosEmbedded, { silent: false })}
                        />
                      ) : (
                        <div style={{
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
                          border: '1.5px dashed #10b981',
                          borderRadius: '16px',
                          padding: '1.15rem 1.35rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          fontSize: '0.84rem',
                          color: '#1e293b',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.73rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                              THANH TOÁN ONLINE • VIETQR PAYOS
                            </span>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#047857' }}>
                              🔒 Quét mã trực tiếp ngay tại trang
                            </span>
                          </div>
                          <p style={{ margin: 0, lineHeight: 1.55, color: '#334155' }}>
                            Bấm nút bên dưới (hoặc nút <strong>"Thanh Toán Online Ngay"</strong> bên phải) để tạo mã QR thanh toán chính thức của <strong>payOS</strong> ngay tại đây cho số tiền{' '}
                            <strong style={{ color: '#ea580c' }}>{grandTotal.toLocaleString('vi-VN')} đ</strong> — không cần chuyển trang!
                          </p>
                          <button
                            type="button"
                            disabled={payosLoading}
                            onClick={() => handleFinalPlaceOrder()}
                            className="btn"
                            style={{
                              alignSelf: 'flex-start',
                              padding: '0.65rem 1.25rem',
                              borderRadius: '11px',
                              background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              border: 'none',
                              cursor: payosLoading ? 'wait' : 'pointer',
                              opacity: payosLoading ? 0.7 : 1,
                            }}
                          >
                            <QrCode size={16} /> {payosLoading ? 'Đang tạo mã QR payOS...' : 'Tạo Mã QR Thanh Toán Tại Đây'}
                          </button>
                        </div>
                      )
                    )}

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Sticky Order Summary & Submit Button */}
              <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '18px', boxShadow: 'var(--shadow-soft)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                      🧾 Đơn Hàng Của Bạn
                    </h3>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff6b35', background: '#fff7ed', padding: '3px 10px', borderRadius: '14px' }}>
                      {selectedTotalQty} sản phẩm đã chọn
                    </span>
                  </div>

                  {/* Selected Cart Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px', marginBottom: '1.25rem' }}>
                    {selectedCartItems.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '0.75rem 0.95rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <img
                          src={getProductImage(item)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getProductFallbackImage(item); }}
                          style={{ width: 46, height: 46, borderRadius: '10px', objectFit: 'contain', background: '#ffffff', padding: '2px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, paddingRight: '6px' }}>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {item.unitPrice.toLocaleString('vi-VN')} đ / sp
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button 
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            style={{ width: 26, height: 26, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', minWidth: '18px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            style={{ width: 26, height: 26, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div style={{ textAlign: 'right', minWidth: '85px', marginLeft: '8px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                            {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginTop: '2px' }}
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input & Quick Suggestion Chips */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={promoCode} 
                        onChange={e => setPromoCode(e.target.value)} 
                        placeholder="Mã voucher (SPA10OFF, PETLOVER20)" 
                        style={{ flex: 1, minWidth: 0, textTransform: 'uppercase', fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => applyPromoCode()}
                        style={{ flexShrink: 0, whiteSpace: 'nowrap', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                      >
                        Áp Dụng
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button 
                        type="button"
                        onClick={() => applyPromoCode('SPA10OFF')}
                        style={{ background: '#f0fdf4', border: '1px dashed #22c55e', color: '#15803d', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🏷️ SPA10OFF (-10%)
                      </button>
                      <button 
                        type="button"
                        onClick={() => applyPromoCode('PETLOVER20')}
                        style={{ background: '#fef3c7', border: '1px dashed #f59e0b', color: '#b45309', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        🏷️ PETLOVER20 (-20%)
                      </button>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>Tạm tính hàng hóa:</span>
                      <strong style={{ color: '#0f172a' }}>{cartSubtotal.toLocaleString('vi-VN')} đ</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>Phí giao hàng:</span>
                      <strong style={{ color: shippingFee === 0 ? '#059669' : '#0f172a' }}>
                        {shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString('vi-VN')} đ`}
                      </strong>
                    </div>

                    {discountPercent > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                        <span>Giảm giá khuyến mãi ({discountPercent}%):</span>
                        <strong>-{discountAmount.toLocaleString('vi-VN')} đ</strong>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>TỔNG THANH TOÁN:</span>
                      <strong style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ff6b35' }}>
                        {grandTotal.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  </div>

                  {/* Submit CTA Button */}
                  <button 
                    type="submit" 
                    disabled={payosLoading}
                    className="btn btn-coral" 
                    style={{ 
                      width: '100%', 
                      padding: '1rem', 
                      fontSize: '1.02rem', 
                      fontWeight: 800, 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',
                      opacity: payosLoading ? 0.7 : 1,
                      background: checkoutForm.paymentMethod === 'PAYOS' ? 'linear-gradient(135deg, #059669 0%, #0284c7 100%)' : undefined,
                      boxShadow: checkoutForm.paymentMethod === 'PAYOS' ? '0 4px 20px rgba(5, 150, 105, 0.35)' : '0 4px 20px rgba(255, 107, 53, 0.4)'
                    }}
                  >
                    {payosLoading
                      ? 'Đang Tạo Mã QR payOS...'
                      : checkoutForm.paymentMethod === 'PAYOS'
                        ? (payosEmbedded ? <>Tạo Lại Mã QR Thanh Toán <QrCode size={20} /></> : <>Thanh Toán Online Ngay <QrCode size={20} /></>)
                        : <>Xác Nhận Đặt Hàng &amp; Hoàn Tất <CheckCircle size={20} /></>}
                  </button>

                  {/* Security Reassurance Points */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="#059669" /> 100% Sản phẩm chính hãng Royal Canin, SOS, Tofu
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={14} color="#0284c7" /> Đổi trả miễn phí trong 7 ngày nếu không hài lòng
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PhoneCall size={14} color="#ea580c" /> Hotline hỗ trợ đơn hàng: <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 800 }}>{CONTACT_INFO.phoneDisplay}</a>
                    </div>
                  </div>

                </div>
              </div>

            </form>
          )}

        </div>
      )}

      {/* 6. LỊCH SỬ & TIẾN ĐỘ (history tab) */}
      {activeTab === 'history' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Lịch Sử Lịch Hẹn &amp; Tiến Độ Chăm Sóc Real-time</h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Theo dõi trạng thái tiếp nhận, tiến độ thực hiện và hủy hẹn giữ chỗ khi cần</p>
            </div>
            {currentUser && (
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setShowProfileModal(true)}>
                <Edit3 size={15} color="#38bdf8" /> Quản Lý Thông Tin Cá Nhân
              </button>
            )}
          </div>

          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <Clock size={48} color="#38bdf8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vui lòng đăng nhập</h3>
              <p style={{ color: 'var(--text-muted)' }}>Đăng nhập để xem tiến độ dịch vụ và lịch sử mua hàng của bạn.</p>
            </div>
          ) : (
            <>
              {/* User Profile Mini Banner */}
              <div style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.25)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{currentUser.fullName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {currentUser.email && currentUser.email !== currentUser.phone ? (
                      <>
                        Tài khoản: <strong>{currentUser.email}</strong> • SĐT: <strong>{currentUser.phone || 'Chưa cập nhật'}</strong>
                      </>
                    ) : (
                      <>
                        SĐT tài khoản: <strong>{currentUser.phone || currentUser.email || 'Chưa cập nhật'}</strong>
                      </>
                    )}
                    {currentUser.address && (
                      <div style={{ marginTop: '2px' }}>
                        Địa chỉ: <strong>{currentUser.address}</strong>
                      </div>
                    )}
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }} onClick={() => setShowProfileModal(true)}>
                  Cập Nhật SĐT / Địa Chỉ
                </button>
              </div>

              {/* Summary KPIs for Customer History */}
              <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1rem 1.15rem', borderLeft: '4px solid #059669' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>DỊCH VỤ ĐÃ HOÀN THÀNH</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                    {myAppointments.filter(a => a.status === 'COMPLETED').length} / {myAppointments.length} ca
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    Spa, tiêm phòng &amp; khám bệnh
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '1rem 1.15rem', borderLeft: '4px solid #ea580c' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>ĐƠN HÀNG SẢN PHẨM ĐÃ MUA</div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ea580c', marginTop: '4px' }}>
                    {myOrders.length} đơn hàng
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {myOrders.filter(o => ['DELIVERED', 'PAID', 'COMPLETED'].includes(o.status)).length} đơn đã hoàn tất
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '1rem 1.15rem', borderLeft: '4px solid #0284c7' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>TỔNG CHI TIÊU TÍCH LŨY</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>
                    {(
                      myAppointments.filter(a => a.status !== 'CANCELLED').reduce((s, a) => s + (Number(a.totalPrice || a.price) || 0), 0) +
                      myOrders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + (Number(o.total) || 0), 0)
                    ).toLocaleString('vi-VN')} đ
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    Thành viên thân thiết Petzera
                  </div>
                </div>
              </div>

              {/* Filter Bar for Services History */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  🐾 Lịch Sử Dịch Vụ Đã Làm &amp; Lịch Hẹn ({filteredMyAppointments.length})
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.42rem 0.75rem', border: '1px solid #cbd5e1', minWidth: 210 }}>
                    <Search size={14} color="#64748b" style={{ marginRight: '6px' }} />
                    <input
                      type="text"
                      value={historyAppQuery}
                      onChange={(e) => setHistoryAppQuery(e.target.value)}
                      placeholder="Tìm bé, dịch vụ..."
                      style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.82rem', outline: 'none', width: '100%' }}
                    />
                  </div>
                  <select
                    className="form-control"
                    style={{ width: 'auto', padding: '0.42rem 0.75rem', fontSize: '0.82rem' }}
                    value={historyAppStatus}
                    onChange={(e) => setHistoryAppStatus(e.target.value)}
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="PENDING">Chờ tiếp nhận</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Thú Cưng</th>
                      <th>Dịch Vụ</th>
                      <th>Ngày &amp; Giờ Hẹn</th>
                      <th>Trạng Thái Tiến Độ</th>
                      <th>Nhật Ký Chăm Sóc Tuần Tự</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMyAppointments.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có ca hẹn nào phù hợp.</td></tr>
                    ) : (
                      filteredMyAppointments.map((app) => (
                        <tr key={app.id}>
                          <td><strong>{app.petName}</strong> ({app.species})</td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{app.serviceName}</div>
                            {(app.totalPrice || app.price) ? (
                              <div style={{ fontSize: '0.76rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                                {Number(app.totalPrice || app.price).toLocaleString('vi-VN')} đ
                              </div>
                            ) : null}
                          </td>
                          <td>
                            <div>{app.appointmentDate} ({app.timeSlot})</div>
                          </td>
                          <td>
                            <span className={`badge ${app.status === 'COMPLETED' ? 'badge-success' : app.status === 'IN_PROGRESS' ? 'badge-info' : app.status === 'CANCELLED' ? 'badge-danger' : 'badge-pending'}`}>
                              {app.status === 'COMPLETED'
                                ? 'Hoàn thành'
                                : app.status === 'IN_PROGRESS'
                                  ? 'Đang thực hiện'
                                  : app.status === 'PENDING'
                                    ? 'Chờ tiếp nhận'
                                    : app.status === 'CANCELLED'
                                      ? 'Đã hủy'
                                      : app.status}
                            </span>
                          </td>
                          <td style={{ color: app.careSummary ? '#059669' : 'var(--text-muted)', fontStyle: app.careSummary ? 'italic' : 'normal' }}>
                            {app.careSummary || 'Đang cập nhật từ nhân viên...'}
                          </td>
                          <td>
                            {app.status === 'PENDING' ? (
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.68rem', fontSize: '0.76rem', color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff', whiteSpace: 'nowrap' }}
                                  onClick={() => openRescheduleModal(app)}
                                >
                                  <Edit3 size={12} /> Đổi Lịch
                                </button>
                                <button 
                                  type="button"
                                  className="btn btn-secondary" 
                                  style={{ padding: '0.35rem 0.68rem', fontSize: '0.76rem', color: '#dc2626', borderColor: 'rgba(248, 113, 113, 0.45)', whiteSpace: 'nowrap' }}
                                  onClick={async () => {
                                    const confirmed = await confirmModal(
                                      `Bạn có chắc chắn muốn hủy ca hẹn [${app.serviceName}] cho bé ${app.petName}? Khung giờ sẽ được giải phóng lập tức.`,
                                      'Xác Nhận Hủy Lịch Hẹn',
                                      { type: 'danger', confirmText: 'Hủy Lịch Hẹn', cancelText: 'Giữ Lại Ca Hẹn' }
                                    );
                                    if (confirmed && onCancelAppointment) {
                                      onCancelAppointment(app.id);
                                    }
                                  }}
                                >
                                  Hủy Lịch
                                </button>
                              </div>
                            ) : app.status === 'COMPLETED' ? (() => {
                              const existingRev = reviews.find((r) => r.appointmentId === app.id);
                              if (existingRev) {
                                return (
                                  <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                    <Star size={12} fill="#059669" color="#059669" /> Đã đánh giá {existingRev.rating}★
                                  </span>
                                );
                              }
                              return (
                                <button
                                  type="button"
                                  className="btn btn-coral"
                                  style={{ padding: '0.35rem 0.72rem', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
                                  onClick={() => {
                                    setReviewingAppointment(app);
                                    setAppReviewForm({ rating: 5, comment: '' });
                                  }}
                                >
                                  <Star size={12} fill="#ffffff" /> Đánh Giá
                                </button>
                              );
                            })() : app.status === 'CANCELLED' ? (
                              <span style={{ fontSize: '0.78rem', color: '#f87171' }}>Đã giải phóng</span>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Đang thực hiện</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', margin: '2rem 0 1rem 0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              🛍️ Lịch Sử Sản Phẩm Đã Mua ({filteredMyOrders.length})
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.42rem 0.75rem', border: '1px solid #cbd5e1', minWidth: 210 }}>
                <Search size={14} color="#64748b" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  value={historyOrderQuery}
                  onChange={(e) => setHistoryOrderQuery(e.target.value)}
                  placeholder="Tìm mã đơn, tên sản phẩm..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.82rem', outline: 'none', width: '100%' }}
                />
              </div>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '0.42rem 0.75rem', fontSize: '0.82rem' }}
                value={historyOrderStatus}
                onChange={(e) => setHistoryOrderStatus(e.target.value)}
              >
                <option value="ALL">Tất cả đơn hàng</option>
                <option value="DELIVERED">Đã giao hàng</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Chi Tiết Sản Phẩm Đã Mua</th>
                  <th>Thanh Toán &amp; Giao Hàng</th>
                  <th>Tổng Tiền</th>
                  <th>Ngày Đặt</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredMyOrders.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có đơn hàng nào phù hợp.</td></tr>
                ) : (
                  filteredMyOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td style={{ maxWidth: '320px', fontSize: '0.84rem' }}>{order.items}</td>
                      <td style={{ fontSize: '0.78rem', color: '#475569' }}>
                        <div style={{ fontWeight: 700, color: '#0369a1' }}>{order.paymentMethod || 'Tiền Mặt COD'}</div>
                        <div>{order.shippingMethod || 'Tiêu Chuẩn'}</div>
                      </td>
                      <td style={{ color: '#059669', fontWeight: 800, whiteSpace: 'nowrap' }}>{Number(order.total || 0).toLocaleString('vi-VN')} đ</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748b' }}>{order.date}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className={`badge ${['DELIVERED', 'PAID', 'COMPLETED'].includes(order.status) ? 'badge-success' : order.status === 'CONFIRMED' ? 'badge-info' : order.status === 'CANCELLED' ? 'badge-danger' : 'badge-pending'}`}>
                          {order.status === 'DELIVERED'
                            ? 'Đã giao hàng'
                            : order.status === 'PAID'
                              ? 'Đã thanh toán'
                              : order.status === 'CONFIRMED'
                                ? 'Đã xác nhận'
                                : order.status === 'PENDING'
                                  ? 'Chờ xác nhận'
                                  : order.status === 'CANCELLED'
                                    ? 'Đã hủy'
                                    : order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </>
          )}
        </div>
      )}

      {/* PETZERA FOOTER */}
      <footer className="petzera-footer">
        <div className="grid-4">
          <div>
            <a
              href="/"
              className="petzera-brand-link"
              aria-label="Trang chủ Petzera"
              style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: '0.9rem' }}
              onClick={(e) => {
                e.preventDefault();
                onTabChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <BrandLogo size="md" subtitle="SPA • THÚ Y 24/7 • PET SHOP" />
            </a>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.65', marginBottom: '0.85rem' }}>
              Chăm sóc thú cưng toàn diện — dịch vụ Spa Grooming, Tiêm phòng vắc xin, Khám bệnh &amp; Khoa Sinh Sản 24/7 cùng cửa hàng chính hãng trong một nền tảng thông minh.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '0.73rem', fontWeight: 800, padding: '4px 10px', borderRadius: '999px' }}>
              <ShieldCheck size={13} /> Chứng nhận 100% Chính Hãng
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Khám Phá</h4>
            <nav aria-label="Liên kết nhanh cuối trang" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <a href="/ve-chung-toi" style={{ cursor: 'pointer', color: '#0f172a', fontWeight: 700, textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onTabChange('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>ℹ️ Về Chúng Tôi &amp; Địa Chỉ</a>
              <a href="/khoa-sinh-san" style={{ cursor: 'pointer', color: '#ea580c', fontWeight: 700, textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onTabChange('reproduction'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>🏥 Khoa Sinh Sản (VPet's)</a>
              <a href="/dich-vu-spa" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onTabChange('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Dịch Vụ Spa 24/7</a>
              <a href="/cua-hang" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onTabChange('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Cửa Hàng Vật Phẩm</a>
              <a href="/thu-cung" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onTabChange('pets'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Quản Lý Thú Cưng</a>
            </nav>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Địa Chỉ &amp; Liên Hệ 24/7</h4>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.45 }}
                title="Xem vị trí trên Google Maps"
              >
                <MapPin size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{CONTACT_INFO.address}</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                <Clock size={14} /> {CONTACT_INFO.openHours}
              </div>
              <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ color: '#ea580c', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PhoneCall size={14} /> Hotline 24/7: {CONTACT_INFO.phoneDisplay}
              </a>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <a
                  href={CONTACT_INFO.zaloLink}
                  onClick={openZaloQrModal}
                  style={{
                    background: '#0068FF',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  💬 Zalo QR
                </a>
                <a
                  href={CONTACT_INFO.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #0078ff 0%, #a033ff 100%)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📘 Facebook
                </a>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Email: {CONTACT_INFO.email}</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Cam Kết</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Minh bạch 100% chi phí, hoàn tiền nếu sản phẩm không đúng mô tả. An toàn tuyệt đối cho bé cưng.
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          Petzera © 2026 — Hệ Thống Quản Lý Dịch Vụ Thú Cưng & Dự Báo Kho Thông Minh.
          <span style={{ margin: '0 8px' }}>•</span>
          <a href="/admin" rel="nofollow" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>🔒 Dành Cho Nhân Viên &amp; Quản Trị</a>
        </div>
      </footer>

      {/* MODAL THÊM / SỬA THÚ CƯNG */}
      {showAddPet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingPet ? `Chỉnh Sửa Hồ Sơ: ${editingPet.name}` : 'Tạo Hồ Sơ Thú Cưng Mới'}
            </h3>
            <form onSubmit={handleCreatePetSubmit}>
              <div className="form-group">
                <label>Tên Thú Cưng *</label>
                <input className="form-control" value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} placeholder="VD: LuLu" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Loài</label>
                  <select className="form-control" value={newPet.species} onChange={e => setNewPet({ ...newPet, species: e.target.value })}>
                    <option value="Chó">Chó 🐶</option>
                    <option value="Mèo">Mèo 🐱</option>
                    <option value="Khác">Khác 🐰</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giống (Breed)</label>
                  <input className="form-control" value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} placeholder="VD: Poodle" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Tuổi (tháng)</label>
                  <input type="number" min="0" className="form-control" value={newPet.ageMonths} onChange={e => setNewPet({ ...newPet, ageMonths: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cân nặng (kg)</label>
                  <input type="number" min="0" step="0.1" className="form-control" value={newPet.weightKg} onChange={e => setNewPet({ ...newPet, weightKg: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Tiền sử y tế / Lưu ý dị ứng</label>
                <textarea className="form-control" rows={3} value={newPet.medicalHistory} onChange={e => setNewPet({ ...newPet, medicalHistory: e.target.value })} placeholder="Nhạy cảm với sữa, dị ứng xà phòng..." />
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddPet(false); setEditingPet(null); }}>Hủy</button>
                <button type="submit" className="btn btn-coral">{editingPet ? 'Lưu Thay Đổi' : 'Lưu Hồ Sơ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐỔI LỊCH HẸN (KHÁCH HÀNG SỬA NGÀY / GIỜ / GHI CHÚ KHI PENDING) */}
      {editingAppointment && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditingAppointment(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 500, borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.9rem', color: '#0f172a' }}>
              📅 Đổi Lịch Hẹn: {editingAppointment.petName}
            </h3>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '0.75rem 0.95rem', marginBottom: '1rem', fontSize: '0.84rem', color: '#0369a1' }}>
              Dịch vụ: <strong>{editingAppointment.serviceName}</strong>
            </div>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="grid-2" style={{ gap: '0.85rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Ngày Hẹn Mới *</label>
                  <input
                    type="date"
                    className="form-control"
                    min={getLocalTodayStr()}
                    value={rescheduleForm.appointmentDate}
                    onChange={e => setRescheduleForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Khung Giờ Mới *</label>
                  <select
                    className="form-control"
                    value={rescheduleForm.timeSlot}
                    onChange={e => setRescheduleForm({ ...rescheduleForm, timeSlot: e.target.value })}
                  >
                    {BOOKING_TIME_SLOT_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.hours.map((h) => {
                          const slotVal = formatHourSlot(h);
                          const isSameSlot =
                            rescheduleForm.appointmentDate === String(editingAppointment.appointmentDate || '').slice(0, 10) &&
                            slotVal === editingAppointment.timeSlot;
                          const st = getSlotStatus(h, rescheduleForm.appointmentDate);
                          const disabled = !isSameSlot && st.disabled;
                          return (
                            <option key={slotVal} value={slotVal} disabled={disabled}>
                              {slotVal} ({isSameSlot ? 'Giờ hiện tại' : st.statusText})
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 700, color: '#334155' }}>Ghi Chú Cập Nhật</label>
                <input
                  className="form-control"
                  value={rescheduleForm.notes}
                  onChange={e => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
                  placeholder="Ghi chú mới cho nhân viên..."
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingAppointment(null)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lịch Hẹn Mới</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ĐẶT LỊCH HẸN DỊCH VỤ */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div
            className="modal-content animate-fade-in"
            style={{ maxWidth: 540, borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.15rem', color: '#0f172a' }}>
              Xác Nhận Đặt Lịch Dịch Vụ
            </h3>
            
            {!currentUser ? (
              <div style={{ background: 'rgba(255, 107, 53, 0.06)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid rgba(255, 107, 53, 0.25)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🔐</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Vui Lòng Đăng Nhập Để Đặt Lịch</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Bạn cần đăng nhập hoặc đăng ký tài khoản khách hàng để lưu lịch hẹn và quản lý dịch vụ cho thú cưng của mình.
                </p>
                <button 
                  type="button" 
                  className="btn btn-coral" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem', fontWeight: 800, borderRadius: '12px' }}
                  onClick={() => {
                    setShowBookingModal(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                >
                  🔐 Đăng Nhập / Đăng Ký Tài Khoản
                </button>
              </div>
            ) : myPets.length === 0 ? (
              <div style={{ background: 'rgba(2, 132, 199, 0.06)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid rgba(2, 132, 199, 0.25)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🐶</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Chưa Có Hồ Sơ Thú Cưng</h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Xin chào <strong>{currentUser.fullName}</strong>! Tài khoản của bạn chưa có hồ sơ thú cưng. Vui lòng tạo hồ sơ bé cưng để tiếp tục đặt lịch.
                </p>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem', fontWeight: 800, borderRadius: '12px' }}
                  onClick={() => { 
                    setShowBookingModal(false); 
                    onTabChange('pets'); 
                    setShowAddPet(true); 
                  }}
                >
                  + Thêm Hồ Sơ Thú Cưng Của Bạn
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Chọn Thú Cưng *</label>
                  <select 
                    className="form-control" 
                    value={bookingForm.petId || (myPets[0] ? myPets[0].id : '')} 
                    onChange={e => setBookingForm(prev => ({ ...prev, petId: e.target.value }))}
                  >
                    {myPets.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species}{p.breed ? ` - ${p.breed}` : ''}{p.weightKg ? ` • ${p.weightKg}kg` : ''})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Chọn Dịch Vụ *</label>
                  <select 
                    className="form-control" 
                    value={bookingForm.serviceId || (services[0] ? services[0].id : '')} 
                    onChange={e => setBookingForm(prev => ({ ...prev, serviceId: e.target.value }))}
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.price.toLocaleString('vi-VN')} đ ({s.durationMinutes || 45} phút)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid-2" style={{ gap: '0.85rem' }}>
                  <div className="form-group">
                    <label style={{ fontWeight: 700, color: '#334155' }}>Ngày Hẹn *</label>
                    <input
                      type="date"
                      className="form-control"
                      min={getLocalTodayStr()}
                      value={bookingForm.appointmentDate}
                      onChange={e => setBookingForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontWeight: 700, color: '#334155', marginBottom: 0 }}>Khung Giờ (Lock Slot) *</label>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '1px 7px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                        ● Mở cửa 24/7
                      </span>
                    </div>
                    <select className="form-control" value={bookingForm.timeSlot} onChange={e => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}>
                      {BOOKING_TIME_SLOT_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.hours.map((h) => {
                            const slot = getSlotStatus(h, bookingForm.appointmentDate);
                            return (
                              <option key={slot.value} value={slot.value} disabled={slot.disabled}>
                                {slot.value} ({slot.statusText})
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 700, color: '#334155' }}>Ghi chú dặn dò nhân viên</label>
                  <input
                    className="form-control"
                    value={bookingForm.notes}
                    onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="VD: Bé hơi nhát nước, nhờ tắm nhẹ tay..."
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-emerald" style={{ padding: '0.65rem 1.4rem', fontWeight: 800 }}>
                    Xác Nhận Đặt Lịch
                  </button>
                </div>
              </form>
            )}

            {!currentUser || myPets.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>Đóng</button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL ĐÁNH GIÁ CA HẸN ĐÃ HOÀN THÀNH */}
      {reviewingAppointment && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setReviewingAppointment(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 480, borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" /> Đánh Giá Dịch Vụ Đã Hoàn Thành
            </h3>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '0.75rem 0.95rem', marginBottom: '1rem', fontSize: '0.84rem', color: '#9a3412' }}>
              <div>Dịch vụ: <strong>{reviewingAppointment.serviceName}</strong></div>
              <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>Bé cưng: <strong>{reviewingAppointment.petName}</strong> • Ngày: {reviewingAppointment.appointmentDate}</div>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (appReviewForm.comment.trim().length < 5) {
                  toast.warning('Vui lòng nhập nhận xét tối thiểu 5 ký tự!', 'Nội Dung Quá Ngắn');
                  return;
                }
                if (onAddReview) {
                  const res = await onAddReview({
                    targetType: 'SERVICE',
                    targetId: reviewingAppointment.serviceId,
                    targetName: reviewingAppointment.serviceName,
                    appointmentId: reviewingAppointment.id,
                    petName: `${reviewingAppointment.petName}${reviewingAppointment.species ? ` • ${reviewingAppointment.species}` : ''}`,
                    rating: appReviewForm.rating,
                    comment: appReviewForm.comment.trim(),
                  });
                  if (res && res.error) {
                    toast.error(res.error, 'Không Thể Gửi Đánh Giá');
                    return;
                  }
                }
                setReviewingAppointment(null);
              }}
            >
              <div className="form-group">
                <label style={{ fontWeight: 700, color: '#334155' }}>Chấm Điểm Hài Lòng *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAppReviewForm((prev) => ({ ...prev, rating: s }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Star size={28} fill={s <= appReviewForm.rating ? '#f59e0b' : '#ffffff'} color={s <= appReviewForm.rating ? '#f59e0b' : '#cbd5e1'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ea580c', marginLeft: '6px' }}>
                    {appReviewForm.rating} / 5 sao
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 700, color: '#334155' }}>Nhận Xét Của Bạn *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={appReviewForm.comment}
                  onChange={(e) => setAppReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Chia sẻ trải nghiệm thực tế của bé khi làm dịch vụ..."
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReviewingAppointment(null)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Gửi Đánh Giá</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CẬP NHẬT HỒ SƠ CÁ NHÂN (USE CASE: QUẢN LÝ THÔNG TIN CÁ NHÂN) */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 480 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#ff6b35" /> Cập Nhật Thông Tin Cá Nhân
            </h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (onUpdateProfile) {
                await onUpdateProfile(profileForm);
              }
              setShowProfileModal(false);
            }}>
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input 
                  className="form-control" 
                  value={profileForm.fullName} 
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Tài Khoản Đăng Ký (Email / SĐT định danh)</label>
                <input 
                  className="form-control" 
                  value={currentUser?.email || currentUser?.phone || ''} 
                  disabled 
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tài khoản định danh không thể thay đổi theo quy tắc BR01</span>
              </div>

              <div className="form-group">
                <label>Số Điện Thoại</label>
                <input 
                  className="form-control" 
                  value={profileForm.phone} 
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} 
                  placeholder="VD: 0934567890" 
                />
              </div>

              <div className="form-group">
                <label>Địa Chỉ</label>
                <input 
                  type="text"
                  className="form-control" 
                  value={profileForm.address} 
                  onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} 
                  placeholder="VD: Số 12 Nguyễn Văn Bảo, P. Hạnh Thông, TP.HCM" 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
