import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, Calendar, Clock, ShieldCheck, Award, Sparkles, 
  AlertTriangle, CheckCircle, PhoneCall, ArrowRight, Activity, 
  ChevronDown, ChevronUp, Info, Check, Heart, Stethoscope, Flame
} from 'lucide-react';
import { toast } from './ToastNotification';
import { CONTACT_INFO } from '../contactConfig';
import { getServiceImage, FALLBACK_IMAGES } from '../mediaAssets';

const computeTimeline = (species, dateStr) => {
  if (!dateStr) return null;
  const mating = new Date(dateStr);
  const today = new Date();

  // Average gestation days
  const avgDays = species === 'DOG' ? 63 : 65;
  const minDays = species === 'DOG' ? 58 : 63;
  const maxDays = species === 'DOG' ? 68 : 67;

  const dueDate = new Date(mating);
  dueDate.setDate(dueDate.getDate() + avgDays);

  const minDueDate = new Date(mating);
  minDueDate.setDate(minDueDate.getDate() + minDays);

  const maxDueDate = new Date(mating);
  maxDueDate.setDate(maxDueDate.getDate() + maxDays);

  const diffTime = today - mating;
  const currentDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const currentWeek = Math.floor(currentDays / 7) + 1;
  const remainingDays = Math.max(0, avgDays - currentDays);

  // Milestones
  const ultrasoundDate = new Date(mating);
  ultrasoundDate.setDate(ultrasoundDate.getDate() + 28);

  const xrayDate = new Date(mating);
  xrayDate.setDate(xrayDate.getDate() + 48);

  const nestPrepDate = new Date(mating);
  nestPrepDate.setDate(nestPrepDate.getDate() + 56);

  return {
    avgDays,
    currentDays,
    currentWeek,
    remainingDays,
    dueDate: dueDate.toLocaleDateString('vi-VN'),
    dueDateRange: `${minDueDate.toLocaleDateString('vi-VN')} - ${maxDueDate.toLocaleDateString('vi-VN')}`,
    ultrasoundDate: ultrasoundDate.toLocaleDateString('vi-VN'),
    xrayDate: xrayDate.toLocaleDateString('vi-VN'),
    nestPrepDate: nestPrepDate.toLocaleDateString('vi-VN'),
    progressPercent: Math.min(100, Math.round((currentDays / avgDays) * 100))
  };
};

export default function ReproductionClinic({ onBookService, services = [] }) {
  // Calculator state
  const [petSpecies, setPetSpecies] = useState('DOG'); // 'DOG' or 'CAT'
  const [matingDate, setMatingDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 20);
    return today.toISOString().split('T')[0];
  });
  const [calcResult, setCalcResult] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 20);
    return computeTimeline('DOG', today.toISOString().split('T')[0]);
  });

  // Active FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Active Tab in Medical Articles
  const [activeArticleTab, setActiveArticleTab] = useState('warning');

  // Calculate Pregnancy Timeline
  const calculatePregnancy = () => {
    if (!matingDate) {
      toast.warning('Vui lòng chọn ngày phối giống của bé cưng!', 'Thiếu Thông Tin');
      return;
    }
    const res = computeTimeline(petSpecies, matingDate);
    setCalcResult(res);
  };

  // Run calculation silently on species toggle
  useEffect(() => {
    if (matingDate) {
      setCalcResult(computeTimeline(petSpecies, matingDate));
    }
  }, [petSpecies]);

  // Specialized services list matching VPet's offering
  const reproductiveServices = [
    {
      id: 's15',
      name: 'Siêu Âm Thai Kỹ Thuật Số Doppler & Dự Sinh Chuẩn Xác',
      category: 'Khoa Sinh Sản',
      durationMinutes: 25,
      price: 150000,
      badge: 'Bác Sĩ CKI',
      description: 'Chẩn đoán thai sớm từ ngày thứ 21. Đếm số lượng túi thai, đo nhịp tim thai bằng máy Doppler chuyên dụng và dự đoán ngày sinh chính xác.',
      features: ['Đo túi ối & tim thai Doppler', 'Ước tính số lượng con sơ bộ', 'Cấp ảnh in siêu âm & tư vấn dinh dưỡng mẹ']
    },
    {
      id: 's16',
      name: 'Gói Hộ Sinh Đỡ Đẻ & Hồi Sức Sơ Sinh An Toàn 24/7',
      category: 'Khoa Sinh Sản',
      durationMinutes: 120,
      price: 350000,
      badge: 'Trực 24/7 Cấp Cứu',
      description: 'Đội ngũ bác sĩ thú y theo dõi sát cơn co bóp tử cung, hỗ trợ chỉnh thế thai cho các giống khó sinh (Poodle, Bulldog), cắt rốn tiệt trùng và lồng sưởi ấm.',
      features: ['Bác sĩ trực tiếp hộ sinh', 'Hút nhớt mũi họng & kích thở sơ sinh', 'Lồng ấp ấm nhiệt độ chuẩn ICU']
    },
    {
      id: 's17',
      name: 'Phẫu Thuật Mổ Đẻ Cấp Cứu Vô Trùng (C-Section)',
      category: 'Khoa Sinh Sản',
      durationMinutes: 60,
      price: 850000,
      badge: 'Cấp Cứu Khẩn Cấp',
      description: 'Phẫu thuật lấy thai khẩn cấp khi thú cưng bị kẹt thai, kiệt sức hoặc suy thai. Sử dụng máy gây mê bay hơi Isoflurane an toàn tuyệt đối cho mẹ & bé con.',
      features: ['Phòng mổ áp lực dương vô trùng', 'Gây mê bay hơi Isoflurane an toàn', 'Kiểm tra sinh hiệu sơ sinh liên tục']
    },
    {
      id: 's18',
      name: 'Triệt Sản Mèo Cái / Chó Cái Công Nghệ Minilap Thẩm Mỹ',
      category: 'Khoa Sinh Sản',
      durationMinutes: 45,
      price: 450000,
      badge: 'Công Nghệ Minilap',
      description: 'Cắt bỏ tử cung & buồng trứng qua đường rạch vi phẫu siêu nhỏ 1-1.5cm. Khâu chỉ tự tiêu thẩm mỹ nội bì, không cần cắt chỉ, giảm đau 80%, hồi phục sau 24h.',
      features: ['Đường mổ nhỏ < 1.5cm không để sẹo', 'Chỉ tự tiêu không cần tái khám cắt chỉ', 'Tặng vòng cổ chống liếm & thuốc hậu phẫu']
    },
    {
      id: 's19',
      name: 'Thiến Chó Đực / Mèo Đực An Toàn & Kháng Khuẩn',
      category: 'Khoa Sinh Sản',
      durationMinutes: 25,
      price: 280000,
      badge: 'Nhanh Chóng 15 Phút',
      description: 'Thủ thuật thiến nhẹ nhàng giúp phòng ngừa ung thư tinh hoàn, phì đại tuyến tiền liệt, dứt điểm tật xịt nước tiểu hôi đánh dấu và đi hoang động dục.',
      features: ['Tiểu phẫu nhẹ nhàng, mau khô vết mổ', 'Kháng sinh chống viêm tác dụng kéo dài', 'Ổn định tâm lý & tính tình thân thiện hơn']
    },
    {
      id: 's20',
      name: 'Phẫu Thuật Cấp Cứu Viêm Tử Cung Tích Mủ (Pyometra)',
      category: 'Khoa Sinh Sản',
      durationMinutes: 75,
      price: 900000,
      badge: 'Điều Trị Khẩn Cấp',
      description: 'Cấp cứu giải phóng ổ mủ trong tử cung cho chó mèo cái bị biến chứng do tiêm thuốc tránh thai dạo hoặc rối loạn nội tiết tố tuổi già.',
      features: ['Phẫu thuật cắt lọc toàn bộ tử cung mủ', 'Hồi sức truyền dịch & xét nghiệm máu chuyên sâu', 'Tỷ lệ cứu sống thành công > 98%']
    }
  ];

  // Clinical FAQs
  const faqs = [
    {
      q: 'Triệt sản Minilap là gì? Có đau và để lại sẹo không?',
      a: 'Triệt sản Minilap là kỹ thuật vi phẫu xâm lấn tối thiểu độc quyền chuẩn Bệnh viện Thú y. Bác sĩ rạch một đường nhỏ chỉ từ 1 – 1.5cm ở đường trắng giữa bụng để bộc lộ buồng trứng và tử cung. Sau phẫu thuật, vết mổ được khâu bằng chỉ tự tiêu nội bì giấu mối chỉ, hoàn toàn không đau rát, không để lại sẹo xấu và thú cưng có thể chạy nhảy nhẹ nhàng sau 24 giờ.'
    },
    {
      q: 'Chó và mèo mang thai bao nhiêu ngày thì đẻ? Khi nào nên đi siêu âm?',
      a: 'Thời gian mang thai trung bình của chó là 58 – 68 ngày (khoảng 9 tuần, trung bình 63 ngày). Mèo mang thai từ 63 – 67 ngày (khoảng 65 ngày). Thời điểm vàng để đưa bé đi siêu âm là từ ngày thứ 25 – 30 sau khi phối giống để xác định túi thai và nhịp tim. Đến ngày 45 – 50, nên chụp X-quang để đếm chính xác số lượng xương con, chuẩn bị cho ngày sinh.'
    },
    {
      q: 'Tại sao tuyệt đối KHÔNG NÊN tiêm thuốc tránh thai cho chó mèo?',
      a: 'Thuốc tránh thai thú cưng (chứa hormone Progestin/Medroxyprogesterone acetate) phá vỡ chu kỳ sinh học, kích thích nội mạc tử cung tăng sinh bọng nước và tích mủ. Hơn 85% các ca chó mèo được tiêm thuốc tránh thai đều bị Viêm Tử Cung Tích Mủ (Pyometra) nguy kịch đến tính mạng chỉ sau 1 – 3 tháng, buộc phải mổ cắt bỏ tử cung khẩn cấp. Triệt sản ngoại khoa là giải pháp an toàn và nhân đạo duy nhất!'
    },
    {
      q: 'Dấu hiệu nào cho thấy thú cưng mẹ sắp sinh và cần gọi cấp cứu?',
      a: `Các dấu hiệu sắp sinh: Thú cưng mẹ cào ổ, bỏ ăn, liếm bộ phận sinh dục nhiều, sữa bắt đầu tiết ra và đặc biệt là thân nhiệt trực tràng giảm xuống dưới 37.5°C trong vòng 24h trước khi sinh. Hãy gọi CẤP CỨU NGAY (Hotline ${CONTACT_INFO.phoneDots}) nếu: Bé rặn mạnh liên tục quá 30 phút mà con không ra; Thai bị mắc kẹt nửa người; Ra dịch xanh đen/chảy máu nhiều trước khi sinh con đầu tiên; hoặc khoảng cách giữa 2 con quá 2 giờ.`
    },
    {
      q: 'Sau khi mổ đẻ, chó mèo mẹ có thể cho con bú ngay không?',
      a: 'Hoàn toàn có thể! Nhờ sử dụng công nghệ gây mê bay hơi Isoflurane hiện đại, thuốc mê nhanh chóng đào thải qua đường hô hấp trong vòng 10-15 phút sau khi tắt máy. Chó mèo mẹ tỉnh táo hoàn toàn, không bị ức chế phản xạ tiết sữa và có thể tiếp nhận đàn con bú ngay tại phòng hậu phẫu.'
    }
  ];

  const handleBookRepro = (serviceId) => {
    if (onBookService) {
      onBookService(serviceId);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 1. TOP BREADCRUMB & EMERGENCY ALERT BAR */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', 
        border: '1px solid #fecdd3', 
        borderRadius: '16px', 
        padding: '0.85rem 1.4rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
            <Flame size={14} /> CẤP CỨU SẢN KHOA 24/7
          </span>
          <span style={{ fontSize: '0.88rem', color: '#9f1239', fontWeight: 700 }}>
            Túc trực hộ sinh, mổ đẻ cấp cứu & hồi sức sơ sinh xuyên đêm
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a 
            href={`tel:${CONTACT_INFO.phoneRaw}`} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#e11d48', 
              color: '#ffffff', 
              padding: '0.45rem 1rem', 
              borderRadius: '20px', 
              textDecoration: 'none', 
              fontSize: '0.82rem', 
              fontWeight: 800, 
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)' 
            }}
          >
            <PhoneCall size={14} /> Hotline: {CONTACT_INFO.phoneDots}
          </a>
        </div>
      </div>

      {/* 2. HERO CLINIC SHOWCASE BANNER */}
      <div className="repro-hero-banner" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #fed7aa 100%)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid #fed7aa',
        boxShadow: '0 10px 30px rgba(234, 88, 12, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="repro-hero-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', 
                color: '#ffffff', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                letterSpacing: '0.5px' 
              }}>
                CHUYÊN KHOA SẢN & HỘ SINH THÚ Y
              </span>
              <span style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 700 }}>
                PHÒNG KHÁM CHẤT LƯỢNG CAO
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: '1.25', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
              Khoa Sinh Sản Thú Cưng <br />
              <span style={{ color: '#ea580c', background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Đỡ Đẻ, Mổ Đẻ & Triệt Sản Minilap An Toàn
              </span>
            </h1>

            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.65', marginBottom: '1.75rem', maxWidth: '580px' }}>
              Đồng hành toàn diện từ theo dõi thai kỳ, siêu âm Doppler, đỡ đẻ chuyên nghiệp 24/7 đến phẫu thuật triệt sản vi phẫu Minilap không sẹo, bảo vệ sức khỏe sinh sản tối đa cho chó mèo của bạn.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-coral" 
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.92rem' }}
                onClick={() => handleBookRepro('s15')}
              >
                <Calendar size={17} /> Đặt Lịch Siêu Âm / Khám Thai
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem', background: '#ffffff', borderColor: '#fdba74' }}
                onClick={() => {
                  const el = document.getElementById('pregnancy-calculator-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Activity size={17} color="#ea580c" /> Máy Tính Ngày Dự Sinh
              </button>
            </div>
          </div>

          {/* Right Highlight Visual Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '18px', border: '1px solid #fed7aa', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ea580c' }}>3.500+</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Ca Hộ Sinh & Triệt Sản</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Đỡ đẻ an toàn các giống khó</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '18px', border: '1px solid #fed7aa', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0284c7' }}>1 - 1.5cm</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Vết Mổ Minilap Siêu Nhỏ</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Chỉ tự tiêu, không cần cắt chỉ</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '18px', border: '1px solid #fed7aa', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>100%</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Gây Mê Isoflurane</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Bay hơi an toàn cho chó mèo con</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '18px', border: '1px solid #fed7aa', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#e11d48' }}>24/7</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Trực Cấp Cứu Sản Khoa</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Túc trực xuyên đêm nhận ca khó</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE PREGNANCY CALCULATOR (TIỆN ÍCH DỰ BÁO NGÀY SINH) */}
      <div id="pregnancy-calculator-section" className="glass-panel" style={{ padding: '2.2rem', borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                🧮 TIỆN ÍCH Y KHOA ĐỘC QUYỀN
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Theo chuẩn sinh học WSAVA</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
              Công Cụ Tính Ngày Dự Sinh & Lịch Trình Khám Thai Thú Cưng
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Nhập ngày phối giống để hệ thống tính toán ngày chuyển dạ dự kiến và các mốc thời gian vàng cần đưa bé đi siêu âm / chụp X-quang.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="repro-calc-form">
          {/* Species Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              1. Loại Thú Cưng *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPetSpecies('DOG')}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: petSpecies === 'DOG' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                  background: petSpecies === 'DOG' ? '#fff7ed' : '#ffffff',
                  color: petSpecies === 'DOG' ? '#ea580c' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                🐶 Chó (58 - 68 ngày)
              </button>
              <button
                type="button"
                onClick={() => setPetSpecies('CAT')}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: petSpecies === 'CAT' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: petSpecies === 'CAT' ? '#f0f9ff' : '#ffffff',
                  color: petSpecies === 'CAT' ? '#0284c7' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                🐱 Mèo (63 - 67 ngày)
              </button>
            </div>
          </div>

          {/* Mating Date Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              2. Ngày Phối Giống / Ngày Thụ Thai *
            </label>
            <input 
              type="date" 
              value={matingDate}
              onChange={(e) => setMatingDate(e.target.value)}
              className="form-control"
              style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0f172a' }}
            />
          </div>

          {/* Calculate Button */}
          <div>
            <button 
              type="button"
              className="btn btn-coral" 
              onClick={calculatePregnancy}
              style={{ height: '44px', padding: '0 1.5rem', whiteSpace: 'nowrap' }}
            >
              Tính Lịch Thai Kỳ ➔
            </button>
          </div>
        </div>

        {/* Results Display */}
        {calcResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Stat Banner */}
            <div className="repro-calc-stats">
              <div>
                <div style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: 800, textTransform: 'uppercase' }}>
                  NGÀY DỰ KIẾN SINH (CHUẨN XÁC NHẤT)
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c' }}>
                  {calcResult.dueDate}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>
                  Khoảng an toàn: {calcResult.dueDateRange}
                </div>
              </div>

              <div style={{ borderLeft: '1px solid #fdba74', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TUẦN THAI KỲ HIỆN TẠI</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  Tuần {calcResult.currentWeek} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>({calcResult.currentDays} ngày)</span>
                </div>
              </div>

              <div style={{ borderLeft: '1px solid #fdba74', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>THỜI GIAN CÒN LẠI</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                  {calcResult.remainingDays} ngày nữa
                </div>
              </div>

              <div style={{ borderLeft: '1px solid #fdba74', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TIẾN TRÌNH THAI KỲ</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c' }}>
                  {calcResult.progressPercent}%
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '6px', overflow: 'hidden', marginTop: '4px' }}>
                  <div style={{ width: `${calcResult.progressPercent}%`, background: '#ea580c', height: '100%', borderRadius: '10px' }} />
                </div>
              </div>
            </div>

            {/* 4 Critical Clinical Milestones */}
            <div className="grid-4" style={{ gap: '1rem' }}>
              {/* Milestone 1 */}
              <div className="glass-card" style={{ borderColor: calcResult.currentDays >= 25 && calcResult.currentDays <= 35 ? '#ea580c' : '#e2e8f0', background: calcResult.currentDays >= 25 && calcResult.currentDays <= 35 ? '#fff7ed' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-coral" style={{ fontSize: '0.72rem' }}>MỐC 1 (NGÀY 25 - 30)</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ea580c' }}>{calcResult.ultrasoundDate}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Siêu Âm Thai Doppler
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                  Xác nhận tim thai đập, kiểm tra số lượng túi ối, phát hiện sớm nguy cơ thai tiêu biến hoặc thai lưu.
                </p>
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem' }}
                  onClick={() => handleBookRepro('s15')}
                >
                  Đặt Lịch Siêu Âm
                </button>
              </div>

              {/* Milestone 2 */}
              <div className="glass-card" style={{ borderColor: calcResult.currentDays >= 45 && calcResult.currentDays <= 52 ? '#0284c7' : '#e2e8f0', background: calcResult.currentDays >= 45 && calcResult.currentDays <= 52 ? '#f0f9ff' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>MỐC 2 (NGÀY 45 - 50)</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>{calcResult.xrayDate}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Chụp X-Quang Đếm Con
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                  Bộ xương thai đã cốt hóa hoàn chỉnh. Chụp X-quang giúp đếm chính xác số lượng con & đo kích thước sọ so với khung chậu.
                </p>
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem' }}
                  onClick={() => handleBookRepro('s15')}
                >
                  Khám & Chụp X-Quang
                </button>
              </div>

              {/* Milestone 3 */}
              <div className="glass-card" style={{ borderColor: '#e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>MỐC 3 (NGÀY 55 - 60)</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>{calcResult.nestPrepDate}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Làm Ổ & Bổ Sung Canxi
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                  Chuẩn bị chuồng ổ ấm áp, cách ly khu vực yên tĩnh, bổ sung canxi nano chống hạ canxi huyết tiền sản & hậu sản.
                </p>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, paddingTop: '0.4rem' }}>
                  ✓ Tư vấn dinh dưỡng miễn phí
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="glass-card" style={{ borderColor: '#fca5a5', background: '#fff1f2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>MỐC 4 (NGÀY 58 - DỰ SINH)</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626' }}>{calcResult.dueDate}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.4rem' }}>
                  Đo Thân Nhiệt & Trực Hộ Sinh
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#7f1d1d', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                  Đo thân nhiệt trực tràng 2 lần/ngày. Thân nhiệt rớt xuống dưới 37.5°C là dấu hiệu sinh trong vòng 12 - 24 giờ.
                </p>
                <button 
                  type="button"
                  className="btn btn-coral" 
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem', background: '#e11d48' }}
                  onClick={() => handleBookRepro('s16')}
                >
                  Đăng Ký Gói Đỡ Đẻ 24/7
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. CORE SERVICES GRID (BẢNG DỊCH VỤ CHUYÊN KHOA SẢN & TRIỆT SẢN) */}
      <div className="glass-panel" style={{ padding: '2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <span className="badge badge-coral" style={{ marginBottom: '0.5rem' }}>
              🌟 BẢNG GIÁ NIÊM YẾT MINH BẠCH
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              Các Dịch Vụ Mũi Nhọn Của Khoa Sinh Sản Petopia
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Được thực hiện trực tiếp bởi đội ngũ Bác sĩ chuyên khoa Ngoại Sản Thú Y với hệ thống trang thiết bị nhập khẩu.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '12px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
              ✓ Cam kết không phát sinh chi phí
            </span>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {reproductiveServices.map((service) => (
            <div 
              key={service.id} 
              className="glass-card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                borderRadius: '18px',
                border: '1.5px solid #e2e8f0',
                padding: 0,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: 175, overflow: 'hidden', background: '#f1f5f9' }}>
                  <img
                    src={getServiceImage(service)}
                    alt={service.name}
                    className="media-card-img"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                  />
                  <span className="badge badge-info" style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.72rem', background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {service.badge}
                  </span>
                </div>

                <div style={{ padding: '1.25rem 1.4rem 0 1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Khoa Sinh Sản</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ea580c' }}>
                      {service.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.55rem', lineHeight: '1.4' }}>
                    {service.name}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.9rem', lineHeight: '1.5' }}>
                    {service.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                    {service.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                        <Check size={13} color="#059669" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem 1.3rem 1.4rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {service.durationMinutes} phút
                </span>
                <button 
                  type="button"
                  className="btn btn-coral" 
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                  onClick={() => handleBookRepro(service.id)}
                >
                  Đăng Ký Đặt Lịch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MEDICAL WARNINGS & EVIDENCE-BASED CLINICAL KNOWLEDGE (THEO VPETS) */}
      <div className="glass-panel" style={{ padding: '2.2rem', borderRadius: '22px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <span className="badge badge-danger">
              ⚠️ GÓC Y KHOA CHUYÊN MÔN
            </span>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Khuyến cáo trực tiếp từ Bác sĩ Thú y</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Cẩm Nang Sức Khỏe Sinh Sản & Cảnh Báo Lâm Sàng
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Những thông tin khoa học quan trọng mà mọi chủ nuôi cần nắm vững để bảo vệ tính mạng thú cưng.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'warning', label: '🚨 Cảnh Báo Tiêm Thuốc Tránh Thai', icon: AlertTriangle, color: '#dc2626' },
            { id: 'signs', label: '🚑 5 Dấu Hiệu Khó Sinh Cần Mổ Gấp', icon: Activity, color: '#ea580c' },
            { id: 'process', label: '🔬 Quy Trình Triệt Sản Minilap 5 Bước', icon: ShieldCheck, color: '#059669' },
            { id: 'care', label: '🍼 Dinh Dưỡng Mang Thai & Hậu Sản', icon: Heart, color: '#0284c7' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeArticleTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveArticleTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '12px',
                  border: isActive ? `1.5px solid ${tab.color}` : '1px solid #cbd5e1',
                  background: isActive ? '#f8fafc' : 'transparent',
                  color: isActive ? tab.color : '#475569',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={isActive ? tab.color : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Cảnh báo tiêm thuốc tránh thai (Bài viết nổi tiếng của VPet's) */}
        {activeArticleTab === 'warning' && (
          <div className="animate-fade-in" style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '18px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: '#e11d48', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#9f1239' }}>
                  Hiểm Họa Tử Vong Khi Tiêm Thuốc Tránh Thai / Triệt Sản Tạm Thời Ở Chó Mèo
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#be123c', fontWeight: 600 }}>
                  Nghiên cứu lâm sàng và khuyến cáo từ Hiệp Hội Thú Y Động Vật Đồng Hành Thế Giới (WSAVA)
                </div>
              </div>
            </div>

            <div className="repro-article-grid" style={{ color: '#4c0519', fontSize: '0.88rem', lineHeight: '1.65' }}>
              <div>
                <p style={{ marginBottom: '0.75rem' }}>
                  Nhiều chủ nuôi vì tiết kiệm chi phí ban đầu hoặc sợ phẫu thuật nên đã chọn cách <strong>tiêm thuốc tránh thai dạo</strong> (thường là dẫn xuất Progestin tổng hợp Medroxyprogesterone Acetate). Đây là quyết định cực kỳ nguy hiểm có thể cướp đi sinh mạng của bé cưng bất cứ lúc nào!
                </p>
                <h4 style={{ fontWeight: 800, color: '#881337', margin: '0.6rem 0' }}>
                  Hậu quả y khoa nghiêm trọng:
                </h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li><strong>Viêm tử cung tích mủ cấp tính (Pyometra):</strong> Thuốc làm dày thành tử cung và tăng tiết dịch ồ ạt, đóng kín cổ tử cung tạo môi trường cho vi khuẩn E.coli phát triển. Tử cung chứa đầy mủ độc có thể vỡ bất cứ lúc nào, gây viêm phúc mạc và sốc nhiễm trùng máu.</li>
                  <li><strong>U nang buồng trứng & Ung thư tuyến vú:</strong> Tỷ lệ phát triển khối u ác tính tăng hơn 400% sau 2 mũi tiêm.</li>
                  <li><strong>Thai dị tật hoặc lưu thai vĩnh viễn:</strong> Nếu tiêm đúng thời điểm bé đã thụ thai, thuốc sẽ ngăn cản quá trình chuyển dạ, khiến thai chết lưu mục nát trong bụng mẹ.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #fecdd3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    💡 LỜI KHUYÊN TỪ BÁC SĨ CHUYÊN KHOA
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.55' }}>
                    Tuyệt đối nói <strong>"KHÔNG"</strong> với việc tiêm thuốc tránh thai dạo. Giải pháp văn minh, an toàn và bảo vệ sức khỏe trọn đời cho thú cưng chính là <strong>Triệt Sản Thẩm Mỹ Minilap</strong> tại bệnh viện uy tín.
                  </div>
                </div>
                <button 
                  className="btn btn-coral" 
                  style={{ width: '100%', marginTop: '1rem', background: '#e11d48' }}
                  onClick={() => handleBookRepro('s18')}
                >
                  Đặt Lịch Triệt Sản Minilap An Toàn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 5 dấu hiệu khó sinh */}
        {activeArticleTab === 'signs' && (
          <div className="animate-fade-in" style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '18px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#9a3412', marginBottom: '1rem' }}>
              5 Tình Huống Chuyển Dạ Bất Thường Cần Đưa Đi Cấp Cứu Mổ Đẻ Ngay Lập Tức
            </h3>
            
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #fed7aa' }}>
                <strong style={{ color: '#ea580c', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
                  1. Rặn mạnh liên tục quá 30 - 45 phút không ra con
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Cơn gò tử cung mạnh mẽ nhưng không đẩy được thai nhi ra ngoài. Đây là dấu hiệu thai quá to, ngôi thai ngược hoặc xương chậu hẹp. Cần can thiệp phẫu thuật ngay để tránh ngạt thai.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #fed7aa' }}>
                <strong style={{ color: '#ea580c', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
                  2. Chảy dịch xanh đen (Lochia) hoặc máu tươi trước con đầu tiên
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Dịch màu xanh đậm xuất hiện trước khi con chào đời chứng tỏ nhau thai đã bong non. Con non bị cắt đứt nguồn oxy và sẽ ngạt thở tử vong trong vòng 20 - 30 phút nếu không mổ bắt con khẩn cấp.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #fed7aa' }}>
                <strong style={{ color: '#ea580c', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
                  3. Khoảng cách giữa 2 con sinh ra quá 2 - 3 giờ
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Nếu mẹ đã sinh được một số bé nhưng sau 2 giờ không thấy sinh tiếp trong khi bụng vẫn còn thai và bắt đầu có dấu hiệu mệt lả, tử cung đã bị đờ trơ cơ hoặc kẹt thai tiếp theo.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid #fed7aa' }}>
                <strong style={{ color: '#ea580c', display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>
                  4. Con non bị kẹt ở cửa âm đạo nửa người
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Đầu hoặc chân của con đã thò ra nhưng mẹ không thể đẩy tiếp. Không nên tự ý dùng tay giật mạnh vì có thể làm gãy cổ hoặc rách tầng sinh môn của mẹ. Cần bác sĩ hỗ trợ xoay thai ngay.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#c2410c', fontWeight: 800 }}>
                🚨 Khi phát hiện 1 trong 5 dấu hiệu trên, hãy gọi ngay Hotline Cấp Cứu: <strong>{CONTACT_INFO.phoneDots}</strong> để bác sĩ chuẩn bị sẵn phòng mổ áp lực dương!
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Quy trình 5 bước triệt sản Minilap */}
        {activeArticleTab === 'process' && (
          <div className="animate-fade-in" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '18px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534', marginBottom: '1.25rem' }}>
              Quy Trình Triệt Sản Minilap An Toàn 5 Bước Chuẩn Y Khoa Quốc Tế
            </h3>

            <div className="repro-process-grid">
              {[
                { step: '01', title: 'Khám Tiền Mê', desc: 'Xét nghiệm máu kiểm tra chức năng gan thận & đông máu trước phẫu thuật.' },
                { step: '02', title: 'Gây Mê Isoflurane', desc: 'Máy gây mê bay hơi theo dõi nhịp thở & SpO2 an toàn cho tim mạch.' },
                { step: '03', title: 'Đường Mổ Minilap', desc: 'Đường rạch vi phẫu < 1.5cm, cầm máu điện cực, không rách mô cơ.' },
                { step: '04', title: 'Khâu Chỉ Tự Tiêu', desc: 'Khâu thẩm mỹ nội bì giấu chỉ. Không đau rát, không cần quay lại cắt chỉ.' },
                { step: '05', title: 'Hồi Sức & Theo Dõi', desc: 'Lồng sưởi nhiệt ấm áp, bé tỉnh táo hoàn toàn sau 15 phút, về nhà trong ngày.' }
              ].map((st, idx) => (
                <div key={idx} style={{ background: '#ffffff', borderRadius: '14px', padding: '1rem', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a', marginBottom: '4px' }}>{st.step}</div>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a', marginBottom: '4px' }}>{st.title}</strong>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dinh dưỡng mang thai */}
        {activeArticleTab === 'care' && (
          <div className="animate-fade-in" style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '18px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0369a1', marginBottom: '1rem' }}>
              Chế Độ Dinh Dưỡng Khoa Học Cho Chó Mèo Mang Thai & Sau Sinh
            </h3>

            <div className="grid-3" style={{ gap: '1rem' }}>
              <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '14px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Giai đoạn 1: Tuần 1 - 4
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Giữ Chế Độ Ăn Chuẩn</h4>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Không nên cho ăn quá nhiều vì dễ gây béo phì, làm hẹp đường sinh sản sau này. Bổ sung Axit Folic & Omega 3 giúp phôi thai làm tổ chắc chắn.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '14px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Giai đoạn 2: Tuần 5 - 9
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Tăng Năng Lượng & Canxi</h4>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Thai nhi phát triển vượt bậc. Chuyển sang thức ăn hạt cho thú cưng mẹ mang bầu (như Royal Canin Mother & Babycat/Starter). Chia nhỏ thành 4-5 bữa/ngày.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '14px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Giai đoạn 3: Sau Sinh & Nuôi Con
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Kích Sữa & Bù Nước</h4>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Bổ sung nước luộc thịt ấm, pate dinh dưỡng, sữa dê tiệt trùng và Canxi hữu cơ để phòng chống co giật do hạ canxi huyết cấp tính trong lúc tiết sữa.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. FAQ ACCORDION (CÂU HỎI THƯỜNG GẶP TẠI KHOA SINH SẢN VẬT NUÔI) */}
      <div className="glass-panel" style={{ padding: '2.2rem', borderRadius: '22px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>
            💬 GIẢI ĐÁP THẮC MẮC CHUYÊN SÂU
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Câu Hỏi Thường Gặp Về Sinh Sản & Triệt Sản Thú Cưng
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px', 
                  overflow: 'hidden', 
                  background: isOpen ? '#f8fafc' : '#ffffff',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.4rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#ea580c', fontWeight: 900 }}>Q:</span> {faq.q}
                  </strong>
                  {isOpen ? <ChevronUp size={18} color="#ea580c" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.4rem 1.25rem 1.4rem', fontSize: '0.88rem', color: '#475569', lineHeight: '1.65' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. BOTTOM CONTACT & EMERGENCY BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        borderRadius: '22px',
        padding: '2.2rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)'
      }}>
        <div>
          <span style={{ background: '#ea580c', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
            HỆ THỐNG PHÒNG KHÁM SẢN KHOA PETOPIA
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.4rem' }}>
            Cần Hỗ Trợ Ca Khó Sinh Hoặc Đặt Lịch Triệt Sản Thẩm Mỹ?
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '600px' }}>
            Đội ngũ Bác sĩ Sản Thú Y túc trực 24/7 để tiếp nhận các ca cấp cứu chuyển dạ, mổ lấy thai khẩn cấp và tư vấn chăm sóc mẹ bầu hoàn toàn miễn phí.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href={`tel:${CONTACT_INFO.phoneRaw}`}
            style={{
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#ffffff',
              padding: '0.75rem 1.4rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
            }}
          >
            <PhoneCall size={16} /> Cấp Cứu: {CONTACT_INFO.phoneDots}
          </a>
          <button
            type="button"
            className="btn btn-coral"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem' }}
            onClick={() => handleBookRepro('s15')}
          >
            <Calendar size={16} /> Đăng Ký Lịch Khám Ngay
          </button>
        </div>
      </div>

    </div>
  );
}
