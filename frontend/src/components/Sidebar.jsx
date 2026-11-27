import React from 'react';
import {
  LayoutDashboard, BarChart3, Calendar, PawPrint, Package, Brain, ShoppingBag, Users, Tag, Shield, FileText, CheckSquare, Activity, TrendingUp, Building2, Settings, History, Sparkles, ChevronLeft
} from 'lucide-react';

export default function Sidebar({
  activeRole,
  activeTab,
  onTabChange,
  pendingProposalsCount = 0,
  pendingOrdersCount = 0,
  currentUser,
  isCollapsed = false,
  onToggleCollapse
}) {
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

  // Dedicated Executive Midnight-Slate Sidebar for ADMIN actor (8 standardized modules)
  if (activeRole === 'ADMIN') {
    const adminGroups = [
      {
        label: 'Điều hành',
        items: [
          { id: 'overview', label: 'Tổng Quan Hệ Thống', icon: LayoutDashboard },
          { id: 'reports-admin', label: 'Thống Kê & Báo Cáo', icon: BarChart3 },
        ],
      },
      {
        label: 'Kho hàng & Dịch vụ',
        items: [
          { id: 'catalog-admin', label: 'Quản Lý Kho & Dịch Vụ', icon: Package },
          { id: 'approve-proposals', label: 'Phê Duyệt Nhập Hàng', icon: CheckSquare, badgeCount: pendingProposalsCount },
          { id: 'suppliers-admin', label: 'Quản Lý Nhà Cung Cấp', icon: Building2 },
        ],
      },
      {
        label: 'Nhân sự & Bảo mật',
        items: [
          { id: 'accounts-admin', label: 'Quản Lý Tài Khoản', icon: Users },
          { id: 'roles-admin', label: 'Phân Quyền Người Dùng', icon: Shield },
        ],
      },
      {
        label: 'Hệ thống',
        items: [
          { id: 'system-settings', label: 'Cấu Hình & Nhật Ký', icon: Settings },
        ],
      },
    ];

    const allAdminIds = adminGroups.flatMap((g) => g.items.map((i) => i.id));
    const effectiveTab = allAdminIds.includes(activeTab) ? activeTab : 'overview';

    return (
      <aside
        className={`staff-sidebar admin-sidebar${isCollapsed ? ' is-collapsed' : ''}`}
        aria-label="Menu quản trị Admin"
      >
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="admin-sidebar-edge-toggle"
            title={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
            aria-label={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
            aria-expanded={!isCollapsed}
          >
            <ChevronLeft size={15} className="admin-sidebar-edge-icon" />
          </button>
        )}

        {isCollapsed ? (
          <div
            className="admin-sidebar-compact-emblem staff-sidebar-header"
            title={`Administrator — ${currentUser?.email || 'Petzera Admin'}`}
          >
            <Shield size={19} color="#c4b5fd" />
          </div>
        ) : (
          <div className="admin-sidebar-brand-card staff-sidebar-header">
            <div className="admin-sidebar-role-tag">
              <Shield size={12} />
              <span>ADMINISTRATOR</span>
            </div>
            <div className="admin-sidebar-role-title">Trung Tâm Điều Hành</div>
            <div className="admin-sidebar-role-sub">
              {currentUser?.email || 'Quản trị toàn hệ thống Petzera'}
            </div>
          </div>
        )}

        <nav className="admin-sidebar-nav">
          {adminGroups.map((group, groupIdx) => (
            <div key={group.label} className="admin-sidebar-group">
              {isCollapsed ? (
                groupIdx > 0 && <div className="admin-sidebar-compact-divider staff-sidebar-header" />
              ) : (
                <div className="admin-sidebar-group-label staff-sidebar-header">
                  {group.label}
                </div>
              )}
              <div className="admin-sidebar-group-items">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = effectiveTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`admin-nav-item${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsed ? `${item.label}${item.badgeCount > 0 ? ` (${item.badgeCount})` : ''}` : undefined}
                    >
                      <span className="admin-nav-item-main">
                        <span className="admin-nav-icon">
                          <Icon size={18} />
                        </span>
                        {!isCollapsed && <span className="admin-nav-label">{item.label}</span>}
                      </span>
                      {item.badgeCount > 0 && (
                        <span
                          className={`admin-nav-badge${isCollapsed ? ' is-compact' : ''}`}
                          title={`${item.badgeCount} phiếu đang chờ phê duyệt`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                      {isCollapsed && (
                        <span className="admin-nav-tooltip" role="tooltip">
                          {item.label}
                          {item.badgeCount > 0 ? ` (${item.badgeCount})` : ''}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {isCollapsed ? (
          <div
            className="admin-sidebar-footer-compact staff-sidebar-header"
            title="RBAC & AI Forecasting v2 đang hoạt động"
          >
            <span className="admin-sidebar-status-dot" />
          </div>
        ) : (
          <div className="admin-sidebar-footer staff-sidebar-header">
            <div className="admin-sidebar-status-row">
              <span className="admin-sidebar-status-dot" />
              <span>RBAC &amp; AI Forecasting v2</span>
            </div>
            <div className="admin-sidebar-status-meta">
              <Sparkles size={12} />
              <span>8 phân hệ quản trị chuẩn hóa</span>
            </div>
          </div>
        )}
      </aside>
    );
  }

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
        <div style={{ fontSize: '0.98rem', fontWeight: 800, marginTop: '2px' }}>
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
