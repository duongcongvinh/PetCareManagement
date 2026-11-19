import React from 'react';
import { 
  LayoutDashboard, Calendar, PawPrint, Package, Brain, ShoppingBag, Users, Settings, Tag, Shield, Building2, FileText, CheckSquare, Activity
} from 'lucide-react';

export default function Sidebar({ activeRole, activeTab, onTabChange }) {
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
        return [
          { id: 'queue', label: 'Ca Hẹn Cần Làm', icon: Calendar },
          { id: 'pets-logs', label: 'Nhật Ký Chăm Sóc', icon: PawPrint },
        ];
      case 'WAREHOUSE_STAFF':
        return [
          { id: 'inventory', label: 'Quản Lý Tồn Kho', icon: Package },
          { id: 'process-orders', label: 'Xử Lý Nhập Hàng AI', icon: CheckSquare },
          { id: 'suppliers', label: 'Nhà Cung Cấp', icon: Users },
          { id: 'ai-reorder', label: 'Đề Xuất Kho AI', icon: Brain },
        ];
      case 'ADMIN':
      default:
        return [
          { id: 'overview', label: 'Báo Cáo Tổng Quan', icon: LayoutDashboard },
          { id: 'ai-forecasting', label: 'Trung Tâm Phân Tích AI', icon: Brain },
          { id: 'accounts-admin', label: 'Quản Lý Tài Khoản', icon: Shield },
          { id: 'customers-admin', label: 'Quản Lý Khách Hàng', icon: Users },
          { id: 'pets-admin', label: 'Quản Lý Thú Cưng', icon: PawPrint },
          { id: 'services-admin', label: 'Quản Lý Dịch Vụ', icon: FileText },
          { id: 'appointments-all', label: 'Quản Lý Ca Hẹn', icon: Calendar },
          { id: 'catalog', label: 'KM & Nhà Cung Cấp', icon: Tag },
          { id: 'inventory-admin', label: 'Quản Lý Kho Hàng', icon: Package },
          { id: 'orders-admin', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="glass-panel" style={{ width: 260, borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 'calc(100vh - 65px)' }}>
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        MENU CHỨC NĂNG ({activeRole === 'CARE_STAFF' ? 'NHÂN VIÊN SPA' : activeRole === 'WAREHOUSE_STAFF' ? 'NHÂN VIÊN KHO' : activeRole === 'ADMIN' ? 'QUẢN TRỊ ADMIN' : 'KHÁCH HÀNG'})
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
              background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
              color: isActive ? '#00f2fe' : 'var(--text-main)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon size={17} color={isActive ? '#00f2fe' : 'var(--text-muted)'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
