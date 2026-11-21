import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, ShoppingBag, Clock, ShieldCheck, HeartHandshake, Truck, Award, Sparkles, Tag,
  Star, ShoppingCart, CheckCircle, ArrowRight, PhoneCall, Zap, Copy, Gift, Flame, Activity,
  Play, Pause, Volume2, VolumeX, Maximize2, Film, X
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { CONTACT_INFO, openZaloQrModal } from '../contactConfig';
import {
  HERO_IMAGES,
  HERO_VIDEOS,
  FALLBACK_IMAGES,
  getServiceImage,
  getProductImage,
  getProductFallbackImage
} from '../mediaAssets';

/**
 * Animated number counter hook (smooth ease-out cubic)
 */
function useCountUp(target, duration = 1200, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let rafId = null;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Number((target * eased).toFixed(decimals)));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [target, duration, decimals]);
  return val;
}

/**
 * Reusable Video + Cinematic Ken Burns Fallback Player
 */
function CinemaVideoBackground({ reel, isPlaying = true, isMuted = true, className = '' }) {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    setIsVideoReady(false);
    const v = videoRef.current;
    if (!v) return;
    v.load();
    if (isPlaying) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }, [reel.id]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (isPlaying) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isPlaying, isMuted]);

  return (
    <div className={`cinema-video-layer ${className}`}>
      {/* Always-ready Ken Burns cinematic poster underneath */}
      <img
        src={reel.poster}
        alt={reel.title}
        className={`cinema-poster-kenburns ${isPlaying ? 'is-animating' : ''}`}
        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
      />
      {/* Real HTML5 MP4 video cross-fading smoothly once ready */}
      <video
        ref={videoRef}
        key={reel.id}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        poster={reel.poster}
        onCanPlay={() => setIsVideoReady(true)}
        onPlaying={() => setIsVideoReady(true)}
        onError={() => setIsVideoReady(false)}
        className={`cinema-video-element ${isVideoReady ? 'is-ready' : ''}`}
      >
        {reel.sources.map((src, idx) => {
          const url = typeof src === 'string' ? src : src.url;
          const mime = typeof src === 'string' ? (src.endsWith('.webm') ? 'video/webm' : 'video/mp4') : src.type;
          return <source key={idx} src={url} type={mime} />;
        })}
      </video>
    </div>
  );
}

/**
 * Interactive Hover-Play Reel Card for the Video Lookbook section
 */
function VideoReelCard({ reel, onOpenLightbox }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className="video-reel-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onOpenLightbox(reel)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenLightbox(reel); } }}
      aria-label={`Xem video ${reel.title}`}
    >
      <CinemaVideoBackground reel={reel} isPlaying={isHovering} isMuted={true} />
      <div className="video-reel-scrim" />

      {/* Top Tag + Duration */}
      <div className="video-reel-top">
        <span className="video-reel-badge">
          <span className="home-live-dot" style={{ width: 6, height: 6 }} /> {reel.badge}
        </span>
        <span className="video-reel-duration">{reel.duration}</span>
      </div>

      {/* Center Play Pulse Button */}
      <div className={`video-reel-play-btn ${isHovering ? 'is-hover' : ''}`}>
        <Play size={22} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
      </div>

      {/* Bottom Caption */}
      <div className="video-reel-bottom">
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fed7aa', marginBottom: '3px' }}>
          {reel.tag}
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.3, marginBottom: '4px' }}>
          {reel.title}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.86)', lineHeight: 1.45, margin: 0 }}>
          {reel.subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HomeLandingPage({
  services = [],
  products = [],
  onTabChange,
  setSelectedServiceCategory,
  setSelectedCategory,
  setSearchQuery,
  openServiceDetail,
  openProductDetail,
  handleAddToCart,
  handleCopyText,
  setBookingForm,
  setShowBookingModal,
  getProductBrand
}) {
  // Cinematic Splash Intro (shows once per browser session, skippable immediately, replayable)
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('petzera_intro_seen');
    } catch {
      return false;
    }
  });
  const [splashClosing, setSplashClosing] = useState(false);

  // Hero Cinema Video State
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [heroMuted, setHeroMuted] = useState(true);
  const [lightboxReel, setLightboxReel] = useState(null);
  const [lightboxMuted, setLightboxMuted] = useState(false);

  // Subtle 3D Mouse Parallax offset for Floating Glass Cards in Hero
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Animated Counters
  const clientsCount = useCountUp(5000, 1400, 0);
  const ratingCount = useCountUp(4.9, 1300, 1);

  const activeReel = HERO_VIDEOS[activeReelIdx] || HERO_VIDEOS[0];

  // Fast 1.05s Luxury Brand Splash Curtain
  useEffect(() => {
    if (!showSplash) return;
    try { sessionStorage.setItem('petzera_intro_seen', '1'); } catch {}
    const t1 = setTimeout(() => setSplashClosing(true), 950);
    const t2 = setTimeout(() => { setShowSplash(false); setSplashClosing(false); }, 1480);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showSplash]);

  // Auto-cycle Hero Video Reel every 10s when playing
  useEffect(() => {
    if (!heroPlaying || lightboxReel) return;
    const timer = setInterval(() => {
      setActiveReelIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [heroPlaying, lightboxReel]);

  // Scroll-Triggered Staggered Reveal Animations (IntersectionObserver)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.reveal-on-scroll');
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: normX * 12, y: normY * 10 });
  };

  const handleHeroMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  const triggerReplayIntro = () => {
    setSplashClosing(false);
    setShowSplash(true);
  };

  // Curated Featured Services (Spa, Hotel, Reproduction, Checkup)
  const featuredServices = (() => {
    const preferredIds = ['s1', 's9', 's15', 's3'];
    const picked = preferredIds.map(id => services.find(s => s.id === id)).filter(Boolean);
    const rest = services.filter(s => !picked.some(p => p.id === s.id));
    return [...picked, ...rest].slice(0, 4);
  })();

  const featuredProducts = products.slice(0, 4);

  const quickCategories = [
    {
      title: 'Spa & Grooming',
      sub: 'Cắt tỉa • Tắm mượt',
      emoji: '✂️',
      bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      border: '#fed7aa',
      action: () => { setSelectedServiceCategory('Spa & Grooming'); onTabChange('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      title: 'Khoa Sinh Sản',
      sub: 'Hộ sinh • Siêu âm 24/7',
      emoji: '🏥',
      badge: 'HOT',
      bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
      border: '#fecdd3',
      action: () => { onTabChange('reproduction'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      title: 'Khách Sạn VIP',
      sub: 'Điều hòa • Camera 24/7',
      emoji: '🏨',
      bg: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
      border: '#fde047',
      action: () => { setSelectedServiceCategory('Khách Sạn & Lưu Trú'); onTabChange('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      title: 'Tiêm Phòng & Thú Y',
      sub: 'Vắc xin • Khám bệnh',
      emoji: '💉',
      bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      border: '#bae6fd',
      action: () => { setSelectedServiceCategory('Y Tế & Tiêm Phòng'); onTabChange('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      title: 'Thức Ăn Hạt',
      sub: 'Royal Canin • ANF',
      emoji: '🥣',
      bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      border: '#a7f3d0',
      action: () => { setSelectedCategory('Thức ăn'); setSearchQuery(''); onTabChange('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      title: 'Phụ Kiện & Cát',
      sub: 'Đồ chơi • Vận chuyển',
      emoji: '🎾',
      bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      border: '#ddd6fe',
      action: () => { setSelectedCategory('Phụ kiện'); setSearchQuery(''); onTabChange('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  ];

  const customerReviews = [
    {
      petName: 'Bé LuLu • Toy Poodle 2 tuổi',
      serviceTag: 'Spa Grooming Trọn Gói',
      photo: HERO_IMAGES.heroPoodle,
      quote: 'Đặt lịch online chọn đúng khung giờ nên đưa bé tới không phải chờ. Các bạn Groomer tỉa form Teddy cực xinh, bé thơm mềm cả tuần mà giá niêm yết rõ ràng!'
    },
    {
      petName: 'Bé Miu Miu • Mèo Anh Lông Ngắn',
      serviceTag: 'Khoa Sinh Sản & Siêu Âm Thai',
      photo: HERO_IMAGES.heroBritishCat,
      quote: 'Cảm ơn đội ngũ bác sĩ Petzera đã trực hộ sinh lúc nửa đêm cho bé Miu mẹ tròn con vuông 4 bé mèo con khỏe mạnh. Bác sĩ hướng dẫn chăm sau sinh siêu tận tâm.'
    },
    {
      petName: 'Bé Max • Golden Retriever',
      serviceTag: 'Mua Royal Canin & Sữa Predogen',
      photo: HERO_IMAGES.heroGolden,
      quote: 'Đặt thức ăn hạt Royal Canin trên Pet Shop chỉ chưa tới 2 tiếng shipper đã giao tận cửa, còn được tặng thêm gói pate và áp mã giảm 20%. Sẽ ủng hộ dài lâu!'
    }
  ];

  const partnerBrands = [
    { label: 'Royal Canin', query: 'Royal Canin' },
    { label: 'ANF 6 Free', query: '6 Free' },
    { label: 'Dr. Kyan', query: 'Predogen' },
    { label: 'Orijen Canada', query: 'Orijen' },
    { label: 'Flexi Germany', query: 'New Comfort' },
    { label: 'Inaba Ciao', query: 'Ciao' },
    { label: 'Frontline Plus', query: 'Frontline' },
    { label: "Cat's Best", query: 'Best' }
  ];

  const marqueeItems = [
    '✨ SPA GROOMING 7 BƯỚC CHUẨN 5★',
    '🏥 KHOA SINH SẢN & HỘ SINH CẤP CỨU 24/7',
    '⚡ GIAO HỎA TỐC 2 GIỜ • FREESHIP TỪ 500K',
    '🎁 NHẬP MÃ PETLOVER20 GIẢM NGAY 20%',
    '🛡️ 100% CHÍNH HÃNG ROYAL CANIN • ANF • DR. KYAN',
    '🏨 KHÁCH SẠN VIP CAMERA TRỰC TUYẾN 24/7'
  ];

  return (
    <>
      {/* LUXURY BRAND INTRO SPLASH CURTAIN (~1s, click anywhere to skip) */}
      {showSplash && (
        <div
          className={`petzera-intro-curtain ${splashClosing ? 'is-closing' : ''}`}
          onClick={() => { setSplashClosing(true); setTimeout(() => setShowSplash(false), 380); }}
          title="Chạm để bỏ qua intro"
        >
          <div className="petzera-intro-orb orb-1" />
          <div className="petzera-intro-orb orb-2" />
          <div className="petzera-intro-card">
            <div className="petzera-intro-ring">
              <BrandLogo variant="stacked" size="lg" subtitle="SPA • THÚ Y 24/7 • PET SHOP" />
            </div>
            <p className="petzera-intro-tagline">
              Chăm Sóc Toàn Diện — Nâng Niu Từng Khoảnh Khắc Cùng Bé Cưng
            </p>
            <div className="petzera-intro-progress-track">
              <div className="petzera-intro-progress-bar" />
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '2.65rem' }}>

        {/* SECTION 1: FULL-BLEED CINEMATIC VIDEO HERO STAGE */}
        <section
          className="cinema-hero-stage"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Full-Bleed Live Looping Pet Video Background */}
          <CinemaVideoBackground reel={activeReel} isPlaying={heroPlaying} isMuted={heroMuted} />

          {/* Editorial Warm Directional Scrim for High-Contrast Typography */}
          <div className="cinema-hero-scrim" />

          {/* Animated Drifting Ambient Sparkles & Glow Orbs */}
          <div className="cinema-particles" aria-hidden="true">
            <span className="cinema-sparkle s1">✦</span>
            <span className="cinema-sparkle s2">🐾</span>
            <span className="cinema-sparkle s3">✦</span>
            <span className="cinema-sparkle s4">✨</span>
            <span className="cinema-sparkle s5">🐾</span>
          </div>

          {/* Hero Foreground Grid */}
          <div className="cinema-hero-content">
            {/* LEFT: Kinetic Headline, Value Prop, Glowing CTAs, Live Counters */}
            <div className="cinema-hero-left">
              <div className="cinema-eyebrow-pill hero-stagger-1">
                <span className="home-live-dot" aria-hidden="true" />
                <span>{activeReel.badge}</span>
                <span style={{ opacity: 0.5 }}>•</span>
                <span>PETZERA FLAGSHIP</span>
              </div>

              <h1 className="cinema-hero-h1 hero-stagger-2">
                Chăm Sóc Toàn Diện —{' '}
                <span className="cinema-shimmer-text">Nâng Niu Từng Khoảnh Khắc</span>{' '}
                Cùng Bé Cưng
              </h1>

              <p className="cinema-hero-desc hero-stagger-3">
                {activeReel.subtitle} Đặt lịch <strong>Spa Grooming 5★</strong> không trùng slot,{' '}
                <strong>Khoa Sinh Sản 24/7</strong> và mua sắm <strong>{products.length}+ sản phẩm chính hãng</strong> giao nhanh 2H.
              </p>

              {/* Glowing CTA Row */}
              <div className="hero-stagger-4" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-coral btn-sheen"
                  style={{ padding: '0.92rem 1.7rem', fontSize: '0.95rem', borderRadius: '14px' }}
                  onClick={() => {
                    setSelectedServiceCategory('ALL');
                    onTabChange('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Calendar size={18} /> Đặt Lịch Spa &amp; Khám Ngay
                </button>

                <button
                  type="button"
                  className="btn cinema-glass-btn"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    onTabChange('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <ShoppingBag size={18} color="#fdba74" /> Khám Phá Pet Shop
                </button>

                <button
                  type="button"
                  className="cinema-play-cinema-btn"
                  onClick={() => setLightboxReel(activeReel)}
                  title="Xem Video Toàn Màn Hình"
                >
                  <span className="cinema-play-pulse-dot">
                    <Play size={13} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
                  </span>
                  <span>Xem Video HD</span>
                </button>
              </div>

              {/* Animated Count-Up Live KPIs */}
              <div className="cinema-hero-kpis hero-stagger-5">
                <div>
                  <div className="cinema-kpi-num">
                    {clientsCount.toLocaleString('vi-VN')}<span>+</span>
                  </div>
                  <div className="cinema-kpi-label">Chủ nuôi tin tưởng</div>
                </div>
                <div className="cinema-kpi-divider">
                  <div className="cinema-kpi-num">
                    {ratingCount.toFixed(1)}<span style={{ color: '#fbbf24' }}>/5★</span>
                  </div>
                  <div className="cinema-kpi-label">Đánh giá hài lòng</div>
                </div>
                <div className="cinema-kpi-divider">
                  <div className="cinema-kpi-num">
                    24<span style={{ color: '#38bdf8' }}>/7</span>
                  </div>
                  <div className="cinema-kpi-label">Bác sĩ &amp; Hộ sinh trực</div>
                </div>
              </div>
            </div>

            {/* RIGHT: 3D Mouse-Parallax Floating Glass Cards + Live Video Controls */}
            <div className="cinema-hero-right">
              {/* Top Floating Glass Card (Parallax layer 1) */}
              <div
                className="cinema-float-card cinema-float-1"
                style={{ transform: `translate3d(${parallax.x * 0.9}px, ${parallax.y * 0.9}px, 0)` }}
              >
                <div className="cinema-float-icon" style={{ background: 'linear-gradient(135deg, #ff6b35, #f59e0b)' }}>
                  <Zap size={18} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff' }}>Giao Hỏa Tốc 2 Giờ</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>Freeship đơn từ 500.000đ</div>
                </div>
              </div>

              {/* Middle Floating Glass Card with Mini Pet Preview (Parallax layer 2) */}
              <div
                className="cinema-float-card cinema-float-2"
                style={{ transform: `translate3d(${parallax.x * -0.7}px, ${parallax.y * -0.7}px, 0)` }}
              >
                <img
                  src={HERO_IMAGES.heroMain}
                  alt="Spa Grooming 5 sao Petzera"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                  style={{ width: 52, height: 52, borderRadius: '14px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.8)', flexShrink: 0 }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#fde68a', fontWeight: 800 }}>
                    <Sparkles size={12} /> ƯU ĐÃI HÔM NAY
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff' }}>Giảm 20% Mã PETLOVER20</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Tặng kèm Pate cho đơn thức ăn</div>
                </div>
              </div>

              {/* Bottom Floating Shield Card (Parallax layer 3) */}
              <div
                className="cinema-float-card cinema-float-3"
                style={{ transform: `translate3d(${parallax.x * 0.55}px, ${parallax.y * 0.6}px, 0)` }}
              >
                <div className="cinema-float-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <ShieldCheck size={18} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#ffffff' }}>100% Chính Hãng</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>Royal Canin • ANF • VPet&apos;s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cinema Reel Switcher + Playback Toolbar */}
          <div className="cinema-hero-toolbar">
            <div className="cinema-reel-pills">
              {HERO_VIDEOS.map((reel, idx) => {
                const isActive = idx === activeReelIdx;
                return (
                  <button
                    key={reel.id}
                    type="button"
                    className={`cinema-reel-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveReelIdx(idx);
                      setHeroPlaying(true);
                    }}
                  >
                    <span>{reel.tag}</span>
                    {isActive && heroPlaying && <span className="cinema-reel-progress" key={`prog-${reel.id}`} />}
                  </button>
                );
              })}
            </div>

            <div className="cinema-player-controls">
              <button
                type="button"
                className="cinema-ctrl-btn"
                onClick={() => setHeroPlaying((p) => !p)}
                title={heroPlaying ? 'Tạm dừng video' : 'Phát video'}
                aria-label={heroPlaying ? 'Tạm dừng video' : 'Phát video'}
              >
                {heroPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                type="button"
                className="cinema-ctrl-btn"
                onClick={() => setHeroMuted((m) => !m)}
                title={heroMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                aria-label={heroMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {heroMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                type="button"
                className="cinema-ctrl-btn"
                onClick={() => setLightboxReel(activeReel)}
                title="Mở toàn màn hình"
                aria-label="Mở video toàn màn hình"
              >
                <Maximize2 size={15} />
              </button>
              <button
                type="button"
                className="cinema-ctrl-btn"
                style={{ width: 'auto', padding: '0 0.7rem', gap: '5px', fontSize: '0.72rem', fontWeight: 800 }}
                onClick={triggerReplayIntro}
                title="Xem lại hiệu ứng mở màn"
              >
                <Sparkles size={13} /> Intro
              </button>
            </div>
          </div>
        </section>

        {/* INFINITE SMOOTH MARQUEE TICKER RIBBON */}
        <div className="home-marquee-wrapper" aria-label="Ưu đãi nổi bật Petzera">
          <div className="home-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((text, idx) => (
              <span key={idx} className="home-marquee-item">
                {text}
                <span className="home-marquee-dot" aria-hidden="true">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 2: QUICK EXPLORE CATEGORY STRIP */}
        <section className="reveal-on-scroll">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                KHÁM PHÁ NHANH
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                Bạn Đang Tìm Gì Cho Bé Cưng Hôm Nay?
              </h2>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
              Chọn nhanh danh mục để xem bảng giá &amp; đặt ngay
            </span>
          </div>

          <div className="home-category-grid">
            {quickCategories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                className="home-category-card"
                onClick={cat.action}
              >
                {cat.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '2px 7px',
                      borderRadius: '999px'
                    }}
                  >
                    {cat.badge}
                  </span>
                )}
                <div
                  className="home-category-icon-well"
                  style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                >
                  {cat.emoji}
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{cat.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>{cat.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE VIDEO LOOKBOOK — KHOẢNH KHẮC THỰC TẾ TẠI PETZERA */}
        <section className="glass-panel reveal-on-scroll" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.45rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PETZERA CINEMA REELS
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', color: '#0f172a' }}>
                <Film color="#ff6b35" size={22} /> Trải Nghiệm Thực Tế Qua Video Sống Động
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Di chuột vào từng khung hình để xem trước chuyển động, bấm vào để thưởng thức toàn màn hình
              </p>
            </div>
            <button
              type="button"
              className="btn btn-coral btn-sheen"
              style={{ borderRadius: '12px' }}
              onClick={() => setLightboxReel(HERO_VIDEOS[0])}
            >
              <Play size={15} fill="#ffffff" /> Xem Bộ Sưu Tập Video
            </button>
          </div>

          <div className="grid-3">
            {HERO_VIDEOS.map((reel) => (
              <VideoReelCard key={reel.id} reel={reel} onOpenLightbox={(r) => setLightboxReel(r)} />
            ))}
          </div>
        </section>

        {/* SECTION 4: SIGNATURE SPECIALTY SPOTLIGHT — KHOA SINH SẢN VPET'S 24/7 */}
        <section className="home-repro-spotlight reveal-on-scroll">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>🏥 CHUYÊN KHOA MŨI NHỌN</span>
              <span style={{ fontSize: '0.76rem', color: '#9a3412', fontWeight: 800, letterSpacing: '0.04em' }}>
                CHUẨN BỆNH VIỆN THÚ Y VPET&apos;S
              </span>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.65rem' }}>
              Khoa Sinh Sản, Siêu Âm Thai &amp; Hộ Sinh Cấp Cứu 24/7
            </h2>

            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.15rem' }}>
              Đồng hành trọn vẹn cùng mẹ bầu chó mèo từ ngày đầu phối giống đến lúc lâm bồn an toàn với trang thiết bị siêu âm Doppler hiện đại và bác sĩ trực cấp cứu suốt đêm.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.45rem' }}>
              {[
                'Siêu âm Doppler từ ngày 21',
                'Đỡ đẻ & Mổ đẻ vô trùng C-Section',
                'Triệt sản Minilap không sẹo từ 280K'
              ].map((item, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.88)',
                    border: '1px solid #fed7aa',
                    borderRadius: '999px',
                    padding: '0.35rem 0.8rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#9a3412',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <CheckCircle size={13} color="#ea580c" /> {item}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-coral btn-sheen"
                style={{ padding: '0.8rem 1.45rem', fontSize: '0.9rem', borderRadius: '14px' }}
                onClick={() => {
                  onTabChange('reproduction');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Khám Phá Khoa Sinh Sản &amp; Tính Ngày Dự Sinh <ArrowRight size={16} />
              </button>
              <a
                href={`tel:${CONTACT_INFO.phoneRaw}`}
                className="btn"
                style={{
                  background: '#ffffff',
                  color: '#dc2626',
                  border: '1.5px solid #fecaca',
                  padding: '0.78rem 1.25rem',
                  fontSize: '0.88rem',
                  borderRadius: '14px'
                }}
              >
                <PhoneCall size={15} /> Cấp Cứu 24/7: {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          <div
            onClick={() => { onTabChange('reproduction'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '4px solid #ffffff', boxShadow: '0 18px 38px rgba(234, 88, 12, 0.18)', minHeight: '240px', background: '#fff7ed', cursor: 'pointer' }}
          >
            <img
              src={HERO_IMAGES.reproBanner}
              alt="Bác sĩ thú y siêu âm và kiểm tra thai cho thú cưng tại Khoa Sinh Sản Petzera"
              className="home-collage-img"
              style={{ height: '260px' }}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                padding: '0.7rem 0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>🩺 Công Cụ Tính Ngày Dự Sinh</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Miễn phí • Chính xác cho Chó &amp; Mèo</div>
              </div>
              <span className="badge badge-coral" style={{ fontSize: '0.72rem' }}>Thử Ngay</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: DỊCH VỤ NỔI BẬT (4 CURATED SERVICES) */}
        <section className="glass-panel reveal-on-scroll" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                DỊCH VỤ ĐƯỢC ĐẶT NHIỀU NHẤT
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', color: '#0f172a' }}>
                <Sparkles color="#ff6b35" size={22} /> Spa Grooming, Khách Sạn VIP &amp; Thú Y 5★
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Niêm yết giá minh bạch, đặt lịch khóa slot real-time, không lo chờ đợi
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ borderRadius: '12px' }}
              onClick={() => {
                setSelectedServiceCategory('ALL');
                onTabChange('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Xem Tất Cả {services.length} Dịch Vụ <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-4">
            {featuredServices.map(s => (
              <div key={s.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0, overflow: 'hidden', borderRadius: '18px' }}>
                <div>
                  <div
                    onClick={() => openServiceDetail(s)}
                    title="Bấm để xem chi tiết dịch vụ"
                    style={{ position: 'relative', height: 178, overflow: 'hidden', background: '#f1f5f9', cursor: 'pointer' }}
                  >
                    <img
                      src={getServiceImage(s)}
                      alt={s.name}
                      className="media-card-img"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                    />
                    <span className="badge badge-info" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)', fontSize: '0.7rem' }}>
                      {s.category}
                    </span>
                    <span style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', background: 'rgba(255,255,255,0.94)', padding: '3px 9px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} color="#ea580c" /> {s.durationMinutes >= 60 ? `${Math.floor(s.durationMinutes / 60)}h${s.durationMinutes % 60 ? ` ${s.durationMinutes % 60}p` : ''}` : `${s.durationMinutes}p`}
                    </span>
                  </div>

                  <div style={{ padding: '1.1rem 1.15rem 0 1.15rem' }}>
                    <h3
                      onClick={() => openServiceDetail(s)}
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        margin: '0 0 0.45rem 0',
                        lineHeight: 1.4,
                        color: '#0f172a',
                        cursor: 'pointer',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {s.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.95rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {s.description}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0.85rem 1.15rem 1.15rem 1.15rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Giá niêm yết</span>
                    <strong style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ea580c' }}>{s.price.toLocaleString('vi-VN')} đ</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '0.48rem 0.6rem', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => openServiceDetail(s)}>
                      Chi Tiết
                    </button>
                    <button
                      type="button"
                      className="btn btn-coral btn-sheen"
                      style={{ flex: 1.15, padding: '0.48rem 0.7rem', fontSize: '0.78rem', borderRadius: '10px' }}
                      onClick={() => {
                        setBookingForm(prev => ({ ...prev, serviceId: s.id }));
                        setShowBookingModal(true);
                      }}
                    >
                      Đặt Lịch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: SIÊU DEAL PET SHOP + VOUCHER STRIP + PARTNER BRANDS */}
        <section className="glass-panel reveal-on-scroll" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PETZERA SUPER SHOP • HÀNG CHÍNH HÃNG
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', color: '#0f172a' }}>
                <Flame color="#ff6b35" size={22} /> Sản Phẩm Bán Chạy &amp; Quà Tặng Hấp Dẫn
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Thức ăn hạt, sữa bột, cát vệ sinh và phụ kiện nhập khẩu kèm nhiều ưu đãi độc quyền
              </p>
            </div>
            <button
              type="button"
              className="btn btn-coral btn-sheen"
              style={{ borderRadius: '12px' }}
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                onTabChange('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Xem Tất Cả {products.length} Sản Phẩm <ArrowRight size={16} />
            </button>
          </div>

          {/* Interactive Voucher Tickets */}
          <div className="home-voucher-grid">
            <div className="home-voucher-ticket" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Tag size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a' }}>Giảm 10% Toàn Shop</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Mã: <strong style={{ color: '#ea580c' }}>SPA10OFF</strong> • Không giới hạn</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.42rem 0.78rem', fontSize: '0.75rem', borderRadius: '10px', flexShrink: 0 }}
                onClick={() => handleCopyText('SPA10OFF', 'mã giảm giá 10%')}
              >
                <Copy size={13} /> Lưu Mã
              </button>
            </div>

            <div className="home-voucher-ticket" style={{ background: 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)', borderColor: '#fcd34d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Gift size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a' }}>Giảm Sốc 20% Đơn Mới</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Mã: <strong style={{ color: '#b45309' }}>PETLOVER20</strong> • Áp tại Giỏ hàng</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.42rem 0.78rem', fontSize: '0.75rem', borderRadius: '10px', flexShrink: 0 }}
                onClick={() => handleCopyText('PETLOVER20', 'mã giảm giá 20%')}
              >
                <Copy size={13} /> Lưu Mã
              </button>
            </div>

            <div className="home-voucher-ticket" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)', borderColor: '#6ee7b7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a' }}>Freeship Hỏa Tốc 2H</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Tự động miễn phí cho đơn từ 500.000đ</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-emerald"
                style={{ padding: '0.42rem 0.78rem', fontSize: '0.75rem', borderRadius: '10px', flexShrink: 0 }}
                onClick={() => {
                  onTabChange('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Mua Ngay
              </button>
            </div>
          </div>

          {/* 4 Bestselling Products Grid */}
          <div className="grid-4">
            {featuredProducts.map(p => (
              <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '18px', padding: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '4px' }}>
                    <span className="badge" style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', fontSize: '0.68rem', padding: '2px 8px' }}>
                      {getProductBrand(p)}
                    </span>
                    <span style={{ background: '#ff6b35', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                      -15%
                    </span>
                  </div>

                  <div
                    onClick={() => openProductDetail(p)}
                    title="Xem chi tiết sản phẩm"
                    style={{
                      background: '#ffffff',
                      height: 185,
                      borderRadius: '14px',
                      overflow: 'hidden',
                      margin: '0.35rem 0 0.7rem 0',
                      border: '1px solid #e2e8f0',
                      position: 'relative',
                      padding: '10px',
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
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(255,255,255,0.92)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2px 7px', fontSize: '0.66rem', fontWeight: 700, color: '#0f172a' }}>
                      ⚡ Giao 2H
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={12} fill="#f59e0b" /> 4.9 <span style={{ color: '#94a3b8', fontWeight: 500 }}>(140+)</span>
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>Sẵn {p.currentStock} sp</span>
                  </div>

                  <h3
                    onClick={() => openProductDetail(p)}
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: 800,
                      margin: '0.2rem 0 0.35rem 0',
                      lineHeight: 1.38,
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}
                  >
                    {p.name}
                  </h3>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.55rem 0 0.75rem 0' }}>
                    <span style={{ fontSize: '1.18rem', fontWeight: 900, color: '#ea580c' }}>
                      {p.unitPrice.toLocaleString('vi-VN')} đ
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      {Math.round(p.unitPrice * 1.15).toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '0.48rem 0.5rem', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => openProductDetail(p)}>
                      Chi Tiết
                    </button>
                    <button type="button" className="btn btn-coral btn-sheen" style={{ flex: 1.15, padding: '0.48rem 0.6rem', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => handleAddToCart(p)}>
                      <ShoppingCart size={14} /> Thêm Giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Genuine Partner Brands Bar */}
          <div className="home-brands-strip">
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Thương hiệu phân phối chính hãng:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {partnerBrands.map((brand) => (
                <button
                  key={brand.label}
                  type="button"
                  className="home-brand-pill"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery(brand.query);
                    onTabChange('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: TẠI SAO CHỌN PETZERA & ĐÁNH GIÁ THỰC TẾ */}
        <section className="reveal-on-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 1.75rem auto' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                CAM KẾT CHẤT LƯỢNG PETZERA
              </span>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                Vì Sao 5.000+ Chủ Nuôi Luôn Tin Chọn Petzera?
              </h2>
            </div>

            <div className="grid-4">
              {[
                {
                  icon: Clock,
                  color: '#0284c7',
                  bg: '#e0f2fe',
                  title: 'Đặt Lịch Real-Time',
                  desc: 'Khóa trùng khung giờ tự động, theo dõi trực tiếp tiến độ chăm sóc của bé ngay trên web.'
                },
                {
                  icon: HeartHandshake,
                  color: '#ea580c',
                  bg: '#ffedd5',
                  title: 'Bác Sĩ & Master Groomer',
                  desc: 'Đội ngũ chuyên môn cao, thao tác dịu nhẹ không gây stress, nâng niu cả các bé nhát nước.'
                },
                {
                  icon: ShieldCheck,
                  color: '#059669',
                  bg: '#d1fae5',
                  title: '100% Chính Hãng & Minh Bạch',
                  desc: 'Giá công khai từng hạng mục, sản phẩm có tem nhãn chuẩn, cam kết hoàn tiền 200% nếu hàng giả.'
                },
                {
                  icon: Truck,
                  color: '#7c3aed',
                  bg: '#ede9fe',
                  title: 'Giao Hỏa Tốc 2H & Đổi Trả 7 Ngày',
                  desc: 'Đóng gói chống sốc kỹ lưỡng, giao nhanh nội thành trong 2 giờ, miễn phí ship từ 500.000đ.'
                }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="home-pillar-card">
                    <div style={{ width: 48, height: 48, borderRadius: '14px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem' }}>
                      <IconComp size={24} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authentic Customer Testimonials (Using Cute Pet Photos Only) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  CẢM NHẬN TỪ KHÁCH HÀNG
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                  Hàng Nghìn Bé Cưng Hạnh Phúc Mỗi Tháng
                </h2>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fefce8', border: '1px solid #fde047', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, color: '#a16207' }}>
                <Award size={15} color="#ca8a04" /> 4.9 / 5.0 Điểm Hài Lòng Thực Tế
              </div>
            </div>

            <div className="grid-3">
              {customerReviews.map((rev, idx) => (
                <div key={idx} className="home-review-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                        <Star size={14} fill="#f59e0b" />
                        <Star size={14} fill="#f59e0b" />
                        <Star size={14} fill="#f59e0b" />
                        <Star size={14} fill="#f59e0b" />
                        <Star size={14} fill="#f59e0b" />
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '999px' }}>
                        ✓ Đã trải nghiệm
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.9rem', borderTop: '1px solid #f1f5f9' }}>
                    <img
                      src={rev.photo}
                      alt={rev.petName}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.pet; }}
                      style={{ width: 46, height: 46, borderRadius: '14px', objectFit: 'cover', border: '2px solid #fed7aa', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{rev.petName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#ea580c', fontWeight: 700 }}>{rev.serviceTag}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: BOTTOM CONVERSION CTA BANNER */}
        <section className="home-bottom-cta reveal-on-scroll">
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', padding: '0.32rem 0.85rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              ✨ ĐẶT LỊCH NHANH TRONG 30 GIÂY
            </span>
            <h2 style={{ fontSize: 'clamp(1.45rem, 2.5vw, 2rem)', fontWeight: 900, lineHeight: 1.24, marginBottom: '0.55rem' }}>
              Sẵn Sàng Mang Đến Trải Nghiệm 5★ Cho Bé Cưng Của Bạn?
            </h2>
            <p style={{ fontSize: '0.92rem', opacity: 0.94, lineHeight: 1.6, margin: 0 }}>
              Đặt lịch Spa Grooming, khám sức khỏe định kỳ hoặc nhắn ngay Zalo để bác sĩ thú y Petzera tư vấn hoàn toàn miễn phí.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn"
              style={{
                background: '#ffffff',
                color: '#ea580c',
                padding: '0.88rem 1.55rem',
                fontSize: '0.94rem',
                fontWeight: 900,
                borderRadius: '14px',
                boxShadow: '0 10px 26px rgba(15, 23, 42, 0.16)'
              }}
              onClick={() => setShowBookingModal(true)}
            >
              <Calendar size={18} /> Đặt Lịch Hẹn Ngay
            </button>

            <button
              type="button"
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(6px)',
                padding: '0.86rem 1.35rem',
                fontSize: '0.9rem',
                borderRadius: '14px'
              }}
              onClick={openZaloQrModal}
            >
              💬 Chat Zalo Tư Vấn
            </button>

            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              className="btn"
              style={{
                background: 'rgba(15, 23, 42, 0.22)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                padding: '0.86rem 1.25rem',
                fontSize: '0.9rem',
                borderRadius: '14px'
              }}
            >
              <PhoneCall size={16} /> {CONTACT_INFO.phoneDisplay}
            </a>
          </div>
        </section>

      </div>

      {/* FULLSCREEN CINEMA VIDEO LIGHTBOX MODAL (Sibling outside any transformed section) */}
      {lightboxReel && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxReel(null); }}
        >
          <div className="cinema-lightbox-box">
            <div className="cinema-lightbox-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="video-reel-badge">
                  <span className="home-live-dot" style={{ width: 6, height: 6 }} /> {lightboxReel.badge}
                </span>
                <strong style={{ color: '#ffffff', fontSize: '0.98rem' }}>{lightboxReel.title}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="cinema-ctrl-btn"
                  onClick={() => setLightboxMuted((m) => !m)}
                  title={lightboxMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                >
                  {lightboxMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  type="button"
                  className="cinema-ctrl-btn"
                  onClick={() => setLightboxReel(null)}
                  title="Đóng video"
                  aria-label="Đóng trình phát video"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="cinema-lightbox-stage">
              <CinemaVideoBackground reel={lightboxReel} isPlaying={true} isMuted={lightboxMuted} />
            </div>

            <div className="cinema-lightbox-footer">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {HERO_VIDEOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`cinema-reel-pill ${r.id === lightboxReel.id ? 'is-active' : ''}`}
                    onClick={() => setLightboxReel(r)}
                  >
                    {r.tag}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-coral btn-sheen"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.84rem', borderRadius: '10px' }}
                onClick={() => {
                  setLightboxReel(null);
                  setShowBookingModal(true);
                }}
              >
                <Calendar size={15} /> Đặt Lịch Trải Nghiệm Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
