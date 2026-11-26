import React from 'react';
import {
  LayoutDashboard, Calendar, PawPrint, Package, Brain, ShoppingBag, Users, Tag, Shield, FileText, CheckSquare, Activity, TrendingUp, Building2, Settings, History
} from 'lucide-react';

export default function Sidebar({ activeRole, activeTab, onTabChange, pendingProposalsCount = 0, pendingOrdersCount = 0 }) {
  const getRoleTheme = (role) => {
    switch (role) {
      case 'CARE_STAFF':
        return {
          title: 'NHÂN VIÊN',
          subtitle: 'Vận hành & Chăm sóc',
          accent: '#0284c7',
          softBg: '#e0f2fe',
          border: '#7dd3fc',
          badgeBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        };
      case 'WAREHOUSE_STAFF':
        return {
          title: 'QUẢN LÝ KHO',
          subtitle: 'Tồn kho & Dự báo AI',
          accent: '#d97706',
          softBg: '#fef3c7',
          border: '#fcd34d',
          badgeBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        };
      case 'ADMIN':
      default:
        return {
          title: 'QUẢN TRỊ ADMIN',
          subtitle: 'Điều hành & Kiểm soát',
          accent: '#7c3aed',
          softBg: '#f3e8ff',
          border: '#d8b4fe',
          badgeBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        };
    }
  };

  // Menu phân chia 1-1 theo sơ đồ Use Case tổng quát của hệ thống
  const getNavItems = () => {
    switch (activeRole) {
      case 'CUSTOMER':
        return [
          { id: 'pets', label: 'Hồ Sơ Thú Cưng', icon: PawPrint },
          { id: 'reproduction', label: 'Khoa Sinh Sản', icon: Activity },
          { id: 'booking', label: 'Đặt Lịch Dịch Vụ', icon: Calendar },
          { id: 'shop', label: 'Mua Sắm Vật Phẩm', icon: ShoppingBag },
          { id: 'history', label: 'Tiến Độ & Lịch Hẹn', icon: LayoutDashboard },
        ];
      case 'CARE_STAFF':
        // Các chức năng vận hành & lịch sử của Actor Nhân viên
        return [
          { id: 'queue', label: 'Quản Lý Lịch Hẹn', icon: Calendar },
          { id: 'orders-mgmt', label: 'Quản Lý Đơn Đặt Hàng', icon: ShoppingBag, badgeCount: pendingOrdersCount },
          { id: 'history-logs', label: 'Lịch Sử Dịch Vụ & Đơn Hàng', icon: History },
          { id: 'services', label: 'Quản Lý Dịch Vụ', icon: FileText },
          { id: 'promotions', label: 'Chương Trình Khuyến Mãi', icon: Tag },
          { id: 'pets-logs', label: 'Quản Lý Hồ Sơ Thú Cưng', icon: PawPrint },
          { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: TrendingUp },
        ];
      case 'WAREHOUSE_STAFF':
        // 4 Use Case khớp 1-1 sơ đồ Use Case tổng quát của Actor Quản lý kho
        return [
          { id: 'inventory', label: 'Quản Lý Kho (Nhập/Xuất/Tồn)', icon: Package },
          { id: 'products-mgmt', label: 'Quản Lý Sản Phẩm', icon: ShoppingBag },
          { id: 'demand-forecast', label: 'Dự Báo Nhu Cầu (AI)', icon: Brain },
          { id: 'reorder-proposals', label: 'Lập Đề Xuất Nhập Hàng', icon: CheckSquare, badgeCount: pendingProposalsCount },
        ];
      case 'ADMIN':
      default:
        // 6 Use Case của Actor Admin
        return [
          { id: 'overview', label: 'Tổng Quan & Thống Kê', icon: LayoutDashboard },
          { id: 'accounts-admin', label: 'Quản Lý Tài Khoản', icon: Users },
          { id: 'roles-admin', label: 'Phân Quyền Người Dùng', icon: Shield },
          { id: 'approve-proposals', label: 'Phê Duyệt Nhập Hàng', icon: CheckSquare, badgeCount: pendingProposalsCount },
          { id: 'suppliers-admin', label: 'Quản Lý Nhà Cung Cấp', icon: Building2 },
          { id: 'system-settings', label: 'Cấu Hình & Nhật Ký', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();
  const theme = getRoleTheme(activeRole);
  const effectiveActiveTab = navItems.some((item) => item.id === activeTab)
    ? activeTab
    : navItems[0]?.id;

  return (
    <aside className="staff-sidebar">
      <div
        className="staff-sidebar-header"
        style={{
          background: theme.badgeBg,
          color: '#ffffff',
          borderRadius: '14px',
          padding: '0.9rem 1rem',
          marginBottom: '0.75rem',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
        }}
      >
        <div style={{ fontSize: '0.68rem', fontWeight: 700, opacity: 0.85, letterSpacing: '0.6px' }}>
          VAI TRÒ HỆ THỐNG
        </div>
        <div style={{ fontSize: '0.98rem', fontWeight: 900, marginTop: '2px' }}>
          {theme.title}
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>
          {theme.subtitle}
        </div>
      </div>

      <div
        className="staff-sidebar-header"
        style={{
          padding: '0 0.5rem 0.35rem 0.5rem',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
        }}
      >
        CHỨC NĂNG PHÂN QUYỀN
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = effectiveActiveTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              padding: '0.78rem 0.95rem',
              borderRadius: '12px',
              border: isActive ? `1.5px solid ${theme.border}` : '1.5px solid transparent',
              background: isActive ? theme.softBg : 'transparent',
              color: isActive ? theme.accent : '#334155',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <Icon size={17} color={isActive ? theme.accent : '#64748b'} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </span>
            {item.badgeCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '1px 7px',
                  borderRadius: '12px',
                  flexShrink: 0,
                }}
              >
                {item.badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
