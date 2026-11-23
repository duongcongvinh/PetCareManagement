import React from 'react';
import {
  MapPin, Clock, PhoneCall, Mail, Navigation, Copy, Calendar, ShieldCheck,
  HeartHandshake, Sparkles, Activity, ShoppingBag, Award, CheckCircle, ArrowRight
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { CONTACT_INFO, openZaloQrModal } from '../contactConfig';
import { toast } from './ToastNotification';

export default function AboutUsSection({
  isFullPage = false,
  onTabChange,
  onOpenBooking,
  onCopyText
}) {
  const copyAddress = () => {
    if (onCopyText) {
      onCopyText(CONTACT_INFO.address, 'địa chỉ cửa hàng Petzera');
      return;
    }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(CONTACT_INFO.address).catch(() => {});
    }
    toast.success(`Đã sao chép địa chỉ: ${CONTACT_INFO.address}`, 'Sao Chép Thành Công');
  };

  const pillars = [
    {
      icon: Sparkles,
      color: '#ea580c',
      bg: '#ffedd5',
      title: 'Spa & Grooming Chuẩn 5★',
      desc: 'Quy trình tắm dưỡng 7 bước, cắt tỉa tạo kiểu Teddy/Boo bằng mỹ phẩm chính hãng SOS & Davis, phòng riêng không gây stress.'
    },
    {
      icon: Activity,
      color: '#e11d48',
      bg: '#ffe4e6',
      title: 'Khoa Sinh Sản & Thú Y 24/7',
      desc: 'Bác sĩ trực xuyên đêm cho siêu âm Doppler, đỡ đẻ, phẫu thuật cấp cứu sản khoa và triệt sản vi phẫu Minilap hồi phục nhanh.'
    },
    {
      icon: HeartHandshake,
      color: '#0284c7',
      bg: '#e0f2fe',
      title: 'Khách Sạn VIP Camera 24/7',
      desc: 'Phòng lưu trú điều hòa khử khuẩn UV mỗi ngày, chế độ ăn riêng biệt và camera theo dõi trực tuyến bất kỳ lúc nào.'
    },
    {
      icon: ShoppingBag,
      color: '#059669',
      bg: '#d1fae5',
      title: 'Pet Shop Chính Hãng & Giao 2H',
      desc: 'Phân phối chính hãng Royal Canin, ANF, Dr. Kyan, Cát đậu nành Tofu — kiểm soát tồn kho thông minh và giao hỏa tốc nội thành TP.HCM.'
    }
  ];

  const stats = [
    { value: '5.000+', label: 'Bé cưng đã chăm sóc', color: '#ea580c' },
    { value: '24/7', label: 'Mở cửa & Cấp cứu xuyên đêm', color: '#059669' },
    { value: '4.9/5★', label: 'Đánh giá hài lòng thực tế', color: '#d97706' },
    { value: '100%', label: 'Sản phẩm chính hãng', color: '#0284c7' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isFullPage ? '2rem' : '1.5rem' }}>
      {/* ==================== 1. HERO STORY (FULL PAGE /gioi-thieu) ==================== */}
      {isFullPage && (
        <section
          className="glass-panel animate-fade-in"
          style={{
            padding: '2.25rem',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #ecfdf5 100%)',
            border: '1px solid #fed7aa',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #fed7aa', color: '#ea580c', fontSize: '0.74rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', marginBottom: '0.9rem' }}>
                <Award size={14} /> VỀ CHÚNG TÔI • PETZERA FLAGSHIP 24/7
              </div>
              <h1 style={{ fontSize: 'clamp(1.65rem, 3vw, 2.35rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.22, marginBottom: '0.9rem' }}>
                Nơi Mọi Bé Cưng Được Yêu Thương &amp; Chăm Sóc{' '}
                <span style={{ color: '#ea580c' }}>Toàn Diện 24/7</span>
              </h1>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.72, marginBottom: '1rem' }}>
                <strong>Petzera</strong> được xây dựng với sứ mệnh mang đến trải nghiệm chăm sóc thú cưng minh bạch, tận tâm và chuẩn y khoa ngay tại trung tâm TP. Hồ Chí Minh. Từ <strong>Spa Grooming 5★</strong>, <strong>Khoa Sinh Sản &amp; Cấp cứu Thú y 24/7</strong>, <strong>Khách sạn thú cưng VIP</strong> cho đến <strong>Pet Shop chính hãng</strong> — tất cả được kết nối mượt mà trên một nền tảng đặt lịch không trùng giờ hiện đại.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.35rem' }}>
                {[
                  'Đội ngũ Bác sĩ Thú y & Master Groomer chuyên môn cao',
                  'Bảng giá niêm yết công khai, không phát sinh chi phí ẩn',
                  'Hỗ trợ cấp cứu & tiếp nhận lịch hẹn liên tục 24/7'
                ].map((pt, idx) => (
                  <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', background: '#ffffff', padding: '5px 11px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <CheckCircle size={14} color="#059669" /> {pt}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-coral btn-sheen"
                  style={{ borderRadius: '12px', padding: '0.78rem 1.4rem', fontWeight: 800 }}
                  onClick={() => {
                    if (onOpenBooking) onOpenBooking();
                    else if (onTabChange) onTabChange('booking');
                  }}
                >
                  <Calendar size={17} /> Đặt Lịch Ngay (24/7)
                </button>
                <a
                  href={CONTACT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ borderRadius: '12px', padding: '0.78rem 1.25rem', fontWeight: 800, textDecoration: 'none' }}
                >
                  <Navigation size={16} color="#ea580c" /> Chỉ Đường Đến Petzera
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.15rem' }}>
                  <BrandLogo variant="stacked" size="md" subtitle="SPA • THÚ Y 24/7 • PET SHOP" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {stats.map((st, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', borderRadius: '14px', padding: '0.9rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '1.45rem', fontWeight: 900, color: st.color }}>{st.value}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '2px' }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 2. HỆ SINH THÁI 4 DỊCH VỤ CỐT LÕI (FULL PAGE) ==================== */}
      {isFullPage && (
        <section className="glass-panel" style={{ padding: '1.85rem' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 1.5rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              HỆ SINH THÁI CHĂM SÓC THÚ CƯNG
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
              4 Trụ Cột Dịch Vụ Tại Petzera
            </h2>
          </div>
          <div className="grid-4">
            {pillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="home-pillar-card">
                  <div style={{ width: 46, height: 46, borderRadius: '14px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                    <IconComp size={23} />
                  </div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== 3. GIỚI THIỆU & ĐỊA CHỈ FLAGSHIP + BẢN ĐỒ TRỰC TIẾP ==================== */}
      <section
        className={`glass-panel ${isFullPage ? '' : 'reveal-on-scroll'}`}
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
          border: '1px solid #fed7aa'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.4rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isFullPage ? 'ĐỊA CHỈ CỬA HÀNG & BẢN ĐỒ CHỈ ĐƯỜNG' : 'VỀ CHÚNG TÔI • ĐỊA CHỈ FLAGSHIP'}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px', marginBottom: '4px' }}>
              {isFullPage ? 'Ghé Thăm Petzera Trực Tiếp 24/7' : 'Về Chúng Tôi & Địa Chỉ Cửa Hàng Tại TP. Hồ Chí Minh'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, maxWidth: 680 }}>
              {isFullPage
                ? 'Không gian sạch sẽ chuẩn y khoa, bãi giữ xe rộng rãi và đội ngũ bác sĩ thú y — Master Groomer sẵn sàng đón bé cưng bất cứ lúc nào.'
                : 'Hệ thống Spa Grooming 5★, Khoa Sinh Sản Thú Y trực 24/7 và Pet Shop chính hãng — luôn mở cửa chào đón bạn cùng bé cưng mọi khung giờ.'}
            </p>
          </div>
          {!isFullPage && onTabChange && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ borderRadius: '12px', fontSize: '0.82rem', fontWeight: 800 }}
              onClick={() => {
                onTabChange('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Xem Thêm Về Chúng Tôi <ArrowRight size={15} />
            </button>
          )}
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'stretch' }}>
          {/* LEFT: OFFICIAL ADDRESS & CONTACT DETAILS */}
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', padding: '4px 10px', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 800 }}>
                  <MapPin size={13} /> CƠ SỞ CHÍNH TP. HỒ CHÍ MINH
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 800 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} /> Mở cửa 24/7
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '0.9rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Địa chỉ cửa hàng</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', lineHeight: 1.45 }}>
                    {CONTACT_INFO.address}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem', borderRadius: '8px', flexShrink: 0 }}
                  title="Sao chép địa chỉ"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    <Clock size={14} color="#059669" /> Giờ hoạt động
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#047857', lineHeight: 1.4 }}>
                    24/7 (00:00 – 24:00)
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>Tất cả các ngày, cả Lễ &amp; Tết</div>
                </div>

                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    <PhoneCall size={14} color="#ea580c" /> Hotline &amp; Cấp cứu
                  </div>
                  <a href={`tel:${CONTACT_INFO.phoneRaw}`} style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ea580c', textDecoration: 'none' }}>
                    {CONTACT_INFO.phoneDisplay}
                  </a>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={11} /> {CONTACT_INFO.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px' }}>🚗 Chỗ đậu xe máy &amp; ô tô</span>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px' }}>🩺 Bác sĩ trực cấp cứu đêm</span>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px' }}>⚡ Giao hỏa tốc 2H nội thành</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-coral btn-sheen"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '12px', fontSize: '0.84rem', fontWeight: 800, textDecoration: 'none' }}
              >
                <Navigation size={15} /> Chỉ Đường Google Maps
              </a>
              <button
                type="button"
                className="btn btn-emerald"
                style={{ flex: 1, justifyContent: 'center', borderRadius: '12px', fontSize: '0.84rem', fontWeight: 800 }}
                onClick={() => {
                  if (onOpenBooking) onOpenBooking();
                  else if (onTabChange) onTabChange('booking');
                }}
              >
                <Calendar size={15} /> Đặt Lịch Ghé Thăm
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}
                onClick={openZaloQrModal}
              >
                💬 Zalo
              </button>
            </div>
          </div>

          {/* RIGHT: EMBEDDED INTERACTIVE GOOGLE MAP */}
          <div style={{ background: '#ffffff', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', minHeight: 340, position: 'relative' }}>
            <iframe
              title="Bản đồ cửa hàng Petzera - Số 12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP. Hồ Chí Minh"
              src={CONTACT_INFO.googleMapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', flex: 1, minHeight: 300, border: 0, display: 'block' }}
              allowFullScreen
            />
            <div style={{ padding: '0.7rem 1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.78rem' }}>
              <span style={{ color: '#334155', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={15} color="#059669" /> Petzera Flagship • 12 Nguyễn Văn Bảo, P. Hạnh Thông
              </span>
              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ea580c', fontWeight: 800, textDecoration: 'none' }}
              >
                Mở bản đồ lớn ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
