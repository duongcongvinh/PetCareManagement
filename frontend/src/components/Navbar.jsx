import React from 'react';
import { User, LogOut, Shield, ShoppingBag, PhoneCall, Home, Calendar, Heart, Clock, UserCheck, Activity } from 'lucide-react';
import { CONTACT_INFO } from '../contactConfig';
import BrandLogo from './BrandLogo';

export default function Navbar({ 
  currentUser, 
  onOpenLogin, 
  onOpenStaffLogin,
  onLogout, 
  portalMode, 
  onSwitchPortalMode, 
  activeTab,
  onTabChange,
  activeRole,
  cartCount = 0 
}) {
  const getRoleDisplayName = (r) => {
    switch (r) {
      case 'CARE_STAFF': return 'Nhân Viên';
      case 'WAREHOUSE_STAFF': return 'Quản Lý Kho';
      case 'ADMIN': return 'Admin';
      case 'CUSTOMER':
      default:
        return 'Khách Hàng';
    }
  };

  const getWorkspaceTitle = (r) => {
    switch (r) {
      case 'CARE_STAFF': return '💈 KHU VỰC LÀM VIỆC: NHÂN VIÊN';
      case 'WAREHOUSE_STAFF': return '📦 KHU VỰC LÀM VIỆC: QUẢN LÝ KHO';
      case 'ADMIN': return '🛡️ KHU VỰC QUẢN TRỊ: ADMIN HỆ THỐNG';
      default: return 'KHU VỰC QUẢN TRỊ';
    }
  };

  const isStaffUser = currentUser && ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role);
  const isCustomer = !currentUser || currentUser.role === 'CUSTOMER';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* 1. Petzera Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>🎁 ĐƠN ĐẦU TẠI APP</span>
          <span>Ưu đãi giảm ngay 50.000đ khi đặt lịch hoặc mua hàng online lần đầu!</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>⚡ Giao Hàng Nhanh 2H</span>
          <span>•</span>
          <a 
            href={`tel:${CONTACT_INFO.phoneRaw}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', textDecoration: 'none' }}
            title="Gọi ngay Hotline tư vấn"
          >
            <PhoneCall size={14} /> Hotline: <strong>{CONTACT_INFO.phoneDisplay}</strong>
          </a>
        </div>
      </div>

      {/* 2. Main Light Theme Header */}
      <header className="petzera-main-header">
        
        {/* Brand Logo (Semantic anchor, never steals page H1) */}
        <a
          href={portalMode === 'CUSTOMER' ? '/' : '/admin'}
          aria-label="Trang chủ Petzera"
          className="petzera-brand-link"
          style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('home');
          }}
        >
          <BrandLogo
            size="md"
            subtitle={portalMode === 'CUSTOMER' ? 'SPA • THÚ Y 24/7 • PET SHOP' : 'QUẢN TRỊ & DỰ BÁO KHO AI'}
          />
        </a>

        {/* Customer Main Navigation Tabs vs Staff Role Badge */}
        {portalMode === 'CUSTOMER' ? (
          <nav className="customer-nav-tabs" aria-label="Điều hướng chính">
            {[
              { id: 'home', path: '/', label: 'Trang Chủ', icon: Home },
              { id: 'reproduction', path: '/khoa-sinh-san', label: 'Khoa Sinh Sản', icon: Activity, isSpecial: true },
              { id: 'booking', path: '/dich-vu-spa', label: 'Dịch Vụ Spa', icon: Calendar },
              { id: 'shop', path: '/cua-hang', label: 'Cửa Hàng', icon: ShoppingBag },
              { id: 'pets', path: '/thu-cung', label: 'Thú Cưng', icon: Heart },
              { id: 'history', path: '/lich-hen', label: 'Tiến Độ & Lịch Hẹn', icon: Clock }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive =
                activeTab === tab.id ||
                (tab.id === 'shop' && activeTab === 'product-detail') ||
                (tab.id === 'booking' && activeTab === 'service-detail');
              return (
                <a
                  key={tab.id}
                  href={tab.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onTabChange(tab.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    textDecoration: 'none',
                    background: isActive ? 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : tab.isSpecial ? '#ea580c' : '#475569',
                    boxShadow: isActive ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <IconComp size={14} color={isActive ? '#ffffff' : tab.isSpecial ? '#ea580c' : undefined} aria-hidden="true" />
                  {tab.label}
                  {tab.isSpecial && !isActive && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '0px',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      padding: '1px 5px',
                      borderRadius: '8px',
                      lineHeight: '1'
                    }}>
                      HOT
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        ) : !isStaffUser ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(2, 132, 199, 0.08)', 
            padding: '0.45rem 1.1rem', 
            borderRadius: '24px', 
            border: '1px solid rgba(2, 132, 199, 0.25)' 
          }}>
            <Shield size={16} color="#0284c7" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1' }}>
              🔒 CỔNG XÁC THỰC NỘI BỘ (CHƯA ĐĂNG NHẬP)
            </span>
          </div>
        ) : (
          /* Role Header Badge in Staff Mode */
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: activeRole === 'ADMIN' ? 'rgba(168, 85, 247, 0.1)' : activeRole === 'CARE_STAFF' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
            padding: '0.45rem 1.1rem', 
            borderRadius: '24px', 
            border: `1px solid ${activeRole === 'ADMIN' ? '#c084fc' : activeRole === 'CARE_STAFF' ? '#38bdf8' : '#fbbf24'}` 
          }}>
            <UserCheck size={16} color={activeRole === 'ADMIN' ? '#9333ea' : activeRole === 'CARE_STAFF' ? '#0284c7' : '#d97706'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: activeRole === 'ADMIN' ? '#7e22ce' : activeRole === 'CARE_STAFF' ? '#0369a1' : '#b45309' }}>
              {getWorkspaceTitle(activeRole)}
            </span>
          </div>
        )}

        {/* Quick Search & User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Cart Badge Button (Customer View -> Dedicated /gio-hang Page) */}
          {portalMode === 'CUSTOMER' && (
            <button 
              type="button"
              className="btn btn-secondary" 
              style={{
                padding: '0.55rem',
                borderRadius: '50%',
                position: 'relative',
                background: activeTab === 'cart' ? '#ff6b35' : '#fff7ed',
                border: activeTab === 'cart' ? '1px solid #ff6b35' : '1px solid #ffedd5'
              }} 
              onClick={() => {
                onTabChange('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Xem trang Giỏ hàng"
              aria-label="Mở trang giỏ hàng"
            >
              <ShoppingBag size={18} color={activeTab === 'cart' ? '#ffffff' : '#ea580c'} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -3, right: -3, background: activeTab === 'cart' ? '#0f172a' : '#ff6b35', color: '#fff', fontSize: '0.68rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,107,53,0.4)' }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Auth */}
          {isStaffUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f8fafc', padding: '0.35rem 0.9rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.fullName}</div>
                <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 800 }}>
                  {getRoleDisplayName(currentUser.role)}
                </div>
              </div>
              <button 
                onClick={onLogout} 
                style={{ 
                  background: '#fee2e2', 
                  border: '1px solid #fca5a5', 
                  color: '#dc2626', 
                  cursor: 'pointer', 
                  marginLeft: '0.3rem', 
                  padding: '0.25rem 0.65rem',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} 
                title="Đăng xuất"
              >
                <span>Đăng xuất</span>
                <LogOut size={13} />
              </button>
            </div>
          ) : portalMode === 'STAFF' ? (
            <button className="btn btn-secondary" onClick={() => onSwitchPortalMode('CUSTOMER')} style={{ borderRadius: '20px', fontSize: '0.82rem', padding: '0.45rem 0.95rem', border: '1px solid #cbd5e1' }}>
              ← Quay lại Trang Khách
            </button>
          ) : currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f8fafc', padding: '0.35rem 0.9rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.fullName}</div>
                <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 800 }}>
                  Khách Hàng
                </div>
              </div>
              <button 
                onClick={onLogout} 
                style={{ 
                  background: '#fee2e2', 
                  border: '1px solid #fca5a5', 
                  color: '#dc2626', 
                  cursor: 'pointer', 
                  marginLeft: '0.4rem', 
                  padding: '0.25rem 0.65rem',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} 
                title="Đăng xuất"
              >
                <span>Đăng xuất</span>
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button className="btn btn-coral" onClick={onOpenLogin} style={{ borderRadius: '20px', fontSize: '0.82rem', padding: '0.5rem 1.05rem', whiteSpace: 'nowrap' }}>
              <User size={15} />
              Đăng Nhập
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
