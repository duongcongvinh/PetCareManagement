import React from 'react';
import { PawPrint, User, LogOut, Shield, Search, ShoppingBag, PhoneCall, Home, Calendar, Heart, Clock, ArrowRight, UserCheck } from 'lucide-react';

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
      case 'CARE_STAFF': return 'Nhân Viên Spa';
      case 'WAREHOUSE_STAFF': return 'Nhân Viên Kho';
      case 'ADMIN': return 'Quản Trị Admin';
      case 'CUSTOMER':
      default:
        return 'Khách Hàng';
    }
  };

  const getWorkspaceTitle = (r) => {
    switch (r) {
      case 'CARE_STAFF': return '💈 KHU VỰC LÀM VIỆC: NHÂN VIÊN SPA';
      case 'WAREHOUSE_STAFF': return '📦 KHU VỰC LÀM VIỆC: NHÂN VIÊN KHO';
      case 'ADMIN': return '🛡️ KHU VỰC QUẢN TRỊ: ADMIN HỆ THỐNG';
      default: return 'KHU VỰC QUẢN TRỊ';
    }
  };

  const isStaffUser = currentUser && ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role);
  const isCustomer = !currentUser || currentUser.role === 'CUSTOMER';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* 1. Petopia Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>🎁 ĐƠN ĐẦU TẠI APP</span>
          <span>Ưu đãi giảm ngay 50.000đ khi đặt lịch hoặc mua hàng online lần đầu!</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>⚡ Giao Hàng Nhanh 2H</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PhoneCall size={14} /> Hotline: <strong>076 240 9021</strong> (8:00 - 21:00)
          </span>
        </div>
      </div>

      {/* 2. Main Light Theme Header */}
      <header style={{ 
        background: 'var(--bg-nav)', 
        borderBottom: '1px solid var(--border-light)', 
        padding: '0.85rem 2.2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        zIndex: 100 
      }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', cursor: 'pointer' }} onClick={() => onTabChange('home')}>
          <div style={{ 
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)', 
            padding: '0.65rem 0.8rem', 
            borderRadius: '16px', 
            display: 'flex', 
            color: '#ffffff', 
            boxShadow: '0 6px 18px rgba(255,107,53,0.35)' 
          }}>
            <PawPrint size={25} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              color: '#0f172a',
              letterSpacing: '-0.5px' 
            }}>
              PETOPIA
            </h1>
            <p style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700 }}>CHĂM SÓC THÚ CƯNG & DỰ BÁO KHO AI</p>
          </div>
        </div>

        {/* Customer Main Navigation Tabs vs Staff Role Badge */}
        {portalMode === 'CUSTOMER' ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
            {[
              { id: 'home', label: 'Trang Chủ', icon: Home },
              { id: 'booking', label: 'Dịch Vụ Spa', icon: Calendar },
              { id: 'shop', label: 'Cửa Hàng', icon: ShoppingBag },
              { id: 'pets', label: 'Thú Cưng', icon: Heart },
              { id: 'history', label: 'Tiến Độ & Lịch Hẹn', icon: Clock }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    boxShadow: isActive ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <IconComp size={14} />
                  {tab.label}
                </button>
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
          
          {/* Cart Badge Button (Customer View) */}
          {portalMode === 'CUSTOMER' && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.55rem', borderRadius: '50%', position: 'relative', background: '#fff7ed', border: '1px solid #ffedd5' }} 
              onClick={() => onTabChange('shop')}
              title="Giỏ hàng"
            >
              <ShoppingBag size={18} color="#ea580c" />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -3, right: -3, background: '#ff6b35', color: '#fff', fontSize: '0.68rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,107,53,0.4)' }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Auth */}
          {isStaffUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f8fafc', padding: '0.3rem 0.75rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 2px 10px rgba(2,132,199,0.3)' }}>
                {currentUser.fullName ? currentUser.fullName.charAt(0) : 'S'}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.fullName}</div>
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
          ) : portalMode === 'STAFF' ? (
            <button className="btn btn-secondary" onClick={() => onSwitchPortalMode('CUSTOMER')} style={{ borderRadius: '20px', fontSize: '0.82rem', padding: '0.45rem 0.95rem', border: '1px solid #cbd5e1' }}>
              ← Quay lại Trang Khách
            </button>
          ) : currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f8fafc', padding: '0.3rem 0.75rem', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 2px 10px rgba(255,107,53,0.3)' }}>
                {currentUser.fullName ? currentUser.fullName.charAt(0) : 'C'}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{currentUser.fullName}</div>
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => onSwitchPortalMode('STAFF')} style={{ borderRadius: '20px', fontSize: '0.82rem', padding: '0.45rem 0.95rem', border: '1px solid #cbd5e1' }}>
                <Shield size={15} color="#475569" />
                Cổng Quản Trị
              </button>
              <button className="btn btn-coral" onClick={onOpenLogin} style={{ borderRadius: '20px', fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}>
                <User size={15} />
                Đăng Nhập Khách
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
