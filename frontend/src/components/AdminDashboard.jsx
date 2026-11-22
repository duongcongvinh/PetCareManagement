import React, { useState } from 'react';
import {
  Shield, Users, Plus, Search, Edit3, Trash2, Lock, Check, X, RefreshCw,
  LayoutDashboard, DollarSign, AlertTriangle, CheckSquare, Building2, Settings,
  Phone, Mail, MapPin, Download, Brain, Clock, TrendingUp, Calendar, ShoppingBag,
  FileText, Activity, ArrowRight
} from 'lucide-react';
import { INITIAL_USERS, INITIAL_SUPPLIERS } from '../mockData';
import { getProductImage, FALLBACK_IMAGES } from '../mediaAssets';
import { toast, confirmModal } from './ToastNotification';

// Ma trận phân quyền RBAC mặc định khớp 1-1 sơ đồ Use Case tổng quát (đã bổ sung đầy đủ quyền Admin)
const DEFAULT_RBAC_MATRIX = [
  // Khách hàng
  { id: 'uc-cust-book', group: 'Khách hàng', label: 'Quản lý lịch hẹn cá nhân', CUSTOMER: true, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: false },
  { id: 'uc-cust-profile', group: 'Khách hàng', label: 'Quản lý thông tin cá nhân', CUSTOMER: true, CARE_STAFF: true, WAREHOUSE_STAFF: true, ADMIN: true },
  { id: 'uc-cust-pets', group: 'Khách hàng', label: 'Quản lý thú cưng cá nhân', CUSTOMER: true, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: false },
  { id: 'uc-cust-search', group: 'Khách hàng', label: 'Tìm kiếm thông tin dịch vụ & sản phẩm', CUSTOMER: true, CARE_STAFF: true, WAREHOUSE_STAFF: true, ADMIN: true },
  // Nhân viên
  { id: 'uc-staff-app', group: 'Nhân viên', label: 'Quản lý lịch hẹn', CUSTOMER: false, CARE_STAFF: true, WAREHOUSE_STAFF: false, ADMIN: false },
  { id: 'uc-staff-svc', group: 'Nhân viên', label: 'Quản lý dịch vụ', CUSTOMER: false, CARE_STAFF: true, WAREHOUSE_STAFF: false, ADMIN: false },
  { id: 'uc-staff-promo', group: 'Nhân viên', label: 'Quản lý chương trình khuyến mãi', CUSTOMER: false, CARE_STAFF: true, WAREHOUSE_STAFF: false, ADMIN: false },
  { id: 'uc-staff-pets', group: 'Nhân viên', label: 'Quản lý hồ sơ thú cưng', CUSTOMER: false, CARE_STAFF: true, WAREHOUSE_STAFF: false, ADMIN: false },
  { id: 'uc-staff-report', group: 'Nhân viên', label: 'Báo cáo, thống kê vận hành', CUSTOMER: false, CARE_STAFF: true, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-staff-wh', group: 'Nhân viên', label: 'Tra cứu & báo nhập kho', CUSTOMER: false, CARE_STAFF: true, WAREHOUSE_STAFF: true, ADMIN: false },
  // Quản lý kho
  { id: 'uc-wh-inv', group: 'Quản lý kho', label: 'Quản lý kho (Nhập / Xuất / Tồn kho)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: false },
  { id: 'uc-wh-ai', group: 'Quản lý kho', label: 'Dự báo nhu cầu (AI)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: true },
  { id: 'uc-wh-prop', group: 'Quản lý kho', label: 'Lập đề xuất nhập hàng', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: false },
  // Admin
  { id: 'uc-admin-overview', group: 'Admin', label: 'Xem tổng quan & Báo cáo toàn hệ thống', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-acc', group: 'Admin', label: 'Quản lý tài khoản', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-role', group: 'Admin', label: 'Phân quyền người dùng (RBAC)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-approve', group: 'Admin', label: 'Phê duyệt kế hoạch nhập hàng', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-supplier', group: 'Admin', label: 'Quản lý nhà cung cấp', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: true },
  { id: 'uc-admin-config', group: 'Admin', label: 'Cấu hình hệ thống & Nhật ký hoạt động', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
];

const ROLE_META = {
  CUSTOMER: { label: 'Khách hàng', badge: 'badge-success', color: '#059669' },
  CARE_STAFF: { label: 'Nhân viên', badge: 'badge-info', color: '#0284c7' },
  WAREHOUSE_STAFF: { label: 'Quản lý kho', badge: 'badge-pending', color: '#d97706' },
  ADMIN: { label: 'Admin', badge: 'badge-danger', color: '#7c3aed' },
};

const DEFAULT_SYSTEM_CONFIG = {
  storeName: 'Petzera Pet Care & Smart AI Platform',
  hotline: '0348 639 603',
  supportEmail: 'hello@petzera.vn',
  openHours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
  freeShipThreshold: 500000,
  expressShipFee: 30000,
  aiConfidenceLevel: '95', // 90 | 95 | 99
  defaultLeadTimeDays: 4,
  safetyStockRatio: 20,
  autoLowStockAlert: true,
};

export default function AdminDashboard({
  activeTab = 'overview',
  onTabChange,
  currentUser,
  users = INITIAL_USERS,
  appointments = [],
  products = [],
  services = [],
  orders = [],
  promotions = [],
  reorderProposals = [],
  suppliers = INITIAL_SUPPLIERS,
  auditLogs = [],
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onUpdateUserRole,
  onToggleUserStatus,
  onApproveProposal,
  onRejectProposal,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onAddAuditLog,
  onClearAuditLogs
}) {
  // Accounts filter & modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'CARE_STAFF',
    password: 'password123'
  });

  // RBAC state (auto-merge new default rows if old matrix exists in localStorage)
  const [rbacMatrix, setRbacMatrix] = useState(() => {
    try {
      const saved = localStorage.getItem('petcare_rbac_matrix');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map(r => r.id));
          const missing = DEFAULT_RBAC_MATRIX.filter(r => !existingIds.has(r.id));
          return [...parsed, ...missing];
        }
      }
    } catch (e) {}
    return DEFAULT_RBAC_MATRIX;
  });

  // Proposals approval filter
  const [proposalFilter, setProposalFilter] = useState('ALL');

  // Suppliers state
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    productCategories: 'Thức ăn hạt, Pate'
  });

  // System Settings & Audit Log filter state
  const [systemConfig, setSystemConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('petcare_system_config');
      if (saved) return { ...DEFAULT_SYSTEM_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SYSTEM_CONFIG;
  });
  const [auditFilter, setAuditFilter] = useState('ALL');

  const validTabs = [
    'overview',
    'accounts-admin',
    'roles-admin',
    'approve-proposals',
    'suppliers-admin',
    'system-settings'
  ];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'overview';

  // Computed metrics
  const serviceRevenue = appointments
    .filter(a => a.status !== 'CANCELLED')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const orderRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalRevenue = serviceRevenue + orderRevenue;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);
  const draftProposals = reorderProposals.filter(p => p.status === 'DRAFT');
  const approvedProposals = reorderProposals.filter(p => p.status === 'APPROVED');
  const completedProposals = reorderProposals.filter(p => p.status === 'COMPLETED');

  const estimateProposalCost = (prop) => {
    const matched = products.find(p => p.id === prop.productId || p.sku === prop.sku);
    const unitCost = matched?.costPrice || Math.round((matched?.unitPrice || 150000) * 0.65);
    return (Number(prop.suggestedQuantity) || 0) * unitCost;
  };

  const pendingBudgetTotal = draftProposals.reduce((sum, prop) => sum + estimateProposalCost(prop), 0);

  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQ = !q ||
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q);
    return matchRole && matchQ;
  });

  const filteredProposals = reorderProposals.filter(p =>
    proposalFilter === 'ALL' ? true : p.status === proposalFilter
  );

  const filteredSuppliers = suppliers.filter(s => {
    const q = supplierSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.contactPerson || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      (s.productCategories || '').toLowerCase().includes(q)
    );
  });

  const filteredAuditLogs = auditLogs.filter(log =>
    auditFilter === 'ALL' ? true : log.category === auditFilter
  );

  // Handlers: Overview CSV Export
  const handleExportReportCSV = () => {
    const rows = [
      ['Chi So He Thong', 'Gia Tri'],
      ['Tong Doanh Thu (VND)', totalRevenue],
      ['Doanh Thu Dich Vu Spa (VND)', serviceRevenue],
      ['Doanh Thu Ban Le Pet Shop (VND)', orderRevenue],
      ['Tong Tai Khoan Nguoi Dung', users.length],
      ['Tong Lich Hen Cham Soc', appointments.length],
      ['Tong Don Hang Ban Le', orders.length],
      ['San Pham Ton Kho Thap', lowStockProducts.length],
      ['De Xuat Nhap Hang Cho Duyet', draftProposals.length],
      ['Nha Cung Cap Doi Tac', suppliers.length]
    ];
    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Petzera_BaoCao_HeThong_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (onAddAuditLog) {
      onAddAuditLog('SYSTEM', 'Xuất báo cáo tổng hợp', 'Đã xuất file CSV tổng hợp doanh thu & vận hành toàn hệ thống.');
    }
    toast.success('Đã xuất file báo cáo tổng hợp CSV thành công!', 'Báo Cáo Hệ Thống');
  };

  // Handlers: Accounts
  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({ fullName: '', email: '', phone: '', role: 'CARE_STAFF', password: 'password123' });
    setShowUserModal(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setUserForm({
      fullName: u.fullName || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'CUSTOMER',
      password: ''
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.email.trim()) {
      toast.warning('Vui lòng nhập đầy đủ Họ tên và Tài khoản (Email/SĐT)!', 'Thiếu Thông Tin');
      return;
    }

    if (editingUser) {
      if (onUpdateUser) {
        onUpdateUser(editingUser.id, {
          fullName: userForm.fullName.trim(),
          phone: userForm.phone.trim(),
          role: userForm.role,
          ...(userForm.password ? { password: userForm.password } : {})
        });
      }
      toast.success(`Đã cập nhật tài khoản "${userForm.fullName}"!`, 'Quản Lý Tài Khoản');
    } else {
      if (onAddUser) {
        await onAddUser({
          fullName: userForm.fullName.trim(),
          email: userForm.email.trim(),
          phone: userForm.phone.trim(),
          role: userForm.role,
          password: userForm.password || 'password123'
        });
      }
      toast.success(`Đã tạo tài khoản "${userForm.fullName}" (${ROLE_META[userForm.role]?.label})!`, 'Quản Lý Tài Khoản');
    }

    setShowUserModal(false);
  };

  const handleDeleteUserClick = async (u) => {
    if (currentUser && (u.id === currentUser.id || u.email === currentUser.email)) {
      toast.warning('Không thể tự xóa tài khoản Admin đang đăng nhập!', 'Bảo Vệ Hệ Thống');
      return;
    }
    const ok = await confirmModal(
      `Bạn có chắc chắn muốn xóa tài khoản "${u.fullName}" (${u.email})?`,
      'Xác Nhận Xóa Tài Khoản',
      { type: 'danger', confirmText: 'Xóa Tài Khoản', cancelText: 'Hủy' }
    );
    if (ok && onDeleteUser) {
      onDeleteUser(u.id);
    }
  };

  // Handlers: RBAC
  const handleTogglePermission = (permId, roleKey) => {
    if (roleKey === 'ADMIN' && (permId === 'uc-admin-acc' || permId === 'uc-admin-role')) {
      toast.warning('Không thể tắt quyền quản trị cốt lõi của vai trò Admin!', 'Bảo Vệ Phân Quyền');
      return;
    }
    setRbacMatrix(prev =>
      prev.map(row => row.id === permId ? { ...row, [roleKey]: !row[roleKey] } : row)
    );
  };

  const handleSaveRbac = () => {
    try {
      localStorage.setItem('petcare_rbac_matrix', JSON.stringify(rbacMatrix));
    } catch (e) {}
    if (onAddAuditLog) {
      onAddAuditLog('SECURITY', 'Cập nhật ma trận phân quyền RBAC', 'Lưu cấu hình phân quyền 4 vai trò trên hệ thống.');
    }
    toast.success('Đã lưu cấu hình ma trận phân quyền RBAC thành công!', 'Phân Quyền Người Dùng');
  };

  const handleResetRbac = () => {
    setRbacMatrix(DEFAULT_RBAC_MATRIX);
    try {
      localStorage.setItem('petcare_rbac_matrix', JSON.stringify(DEFAULT_RBAC_MATRIX));
    } catch (e) {}
    if (onAddAuditLog) {
      onAddAuditLog('SECURITY', 'Khôi phục RBAC mặc định', 'Đặt lại ma trận phân quyền theo sơ đồ Use Case chuẩn.');
    }
    toast.info('Đã khôi phục phân quyền mặc định theo sơ đồ Use Case.', 'Phân Quyền Người Dùng');
  };

  // Handlers: Bulk Approve Proposals
  const handleApproveAllDrafts = async () => {
    if (draftProposals.length === 0) return;
    const ok = await confirmModal(
      `Phê duyệt toàn bộ ${draftProposals.length} phiếu đề xuất nhập hàng đang chờ (ước tính ${pendingBudgetTotal.toLocaleString('vi-VN')} đ)?`,
      'Phê Duyệt Hàng Loạt',
      { type: 'warning', confirmText: 'Phê Duyệt Tất Cả', cancelText: 'Hủy' }
    );
    if (ok && onApproveProposal) {
      draftProposals.forEach(prop => onApproveProposal(prop.id));
    }
  };

  // Handlers: Suppliers CRUD
  const openCreateSupplier = () => {
    setEditingSupplier(null);
    setSupplierForm({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      productCategories: 'Thức ăn hạt, Pate'
    });
    setShowSupplierModal(true);
  };

  const openEditSupplier = (sup) => {
    setEditingSupplier(sup);
    setSupplierForm({
      name: sup.name || '',
      contactPerson: sup.contactPerson || '',
      phone: sup.phone || '',
      email: sup.email || '',
      address: sup.address || '',
      productCategories: sup.productCategories || ''
    });
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    if (!supplierForm.name.trim()) {
      toast.warning('Vui lòng nhập tên nhà cung cấp!', 'Thiếu Thông Tin');
      return;
    }
    if (editingSupplier) {
      if (onUpdateSupplier) onUpdateSupplier(editingSupplier.id, supplierForm);
      toast.success(`Đã cập nhật thông tin đối tác "${supplierForm.name}"!`, 'Nhà Cung Cấp');
    } else {
      if (onAddSupplier) onAddSupplier(supplierForm);
    }
    setShowSupplierModal(false);
  };

  const handleDeleteSupplierClick = async (sup) => {
    const ok = await confirmModal(
      `Bạn có chắc muốn xóa nhà cung cấp "${sup.name}" khỏi danh mục đối tác?`,
      'Xác Nhận Xóa Nhà Cung Cấp',
      { type: 'danger', confirmText: 'Xóa Đối Tác', cancelText: 'Hủy' }
    );
    if (ok && onDeleteSupplier) {
      onDeleteSupplier(sup.id);
    }
  };

  // Handlers: System Settings
  const handleSaveSystemConfig = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('petcare_system_config', JSON.stringify(systemConfig));
    } catch (err) {}
    if (onAddAuditLog) {
      onAddAuditLog(
        'SYSTEM',
        'Cập nhật cấu hình hệ thống & AI',
        `Độ tin cậy AI: ${systemConfig.aiConfidenceLevel}% • Lead-time: ${systemConfig.defaultLeadTimeDays} ngày • Freeship từ ${Number(systemConfig.freeShipThreshold).toLocaleString('vi-VN')}đ.`
      );
    }
    toast.success('Đã lưu cấu hình cửa hàng & tham số AI Dự báo thành công!', 'Cấu Hình Hệ Thống');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ==================== 1. TỔNG QUAN & THỐNG KÊ HỆ THỐNG ==================== */}
      {currentTab === 'overview' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={22} color="#7c3aed" /> Tổng Quan & Báo Cáo Toàn Hệ Thống
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Trung tâm giám sát doanh thu, vận hành Spa, tình trạng kho và các đề xuất nhập hàng cần phê duyệt
              </p>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleExportReportCSV}>
              <Download size={16} /> Xuất Báo Cáo CSV
            </button>
          </div>

          {/* 4 EXECUTIVE KPI CARDS */}
          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                <span>TỔNG DOANH THU</span>
                <DollarSign size={17} color="#059669" />
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#059669', marginTop: '6px' }}>
                {totalRevenue.toLocaleString('vi-VN')} đ
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Spa: {serviceRevenue.toLocaleString('vi-VN')}đ • Shop: {orderRevenue.toLocaleString('vi-VN')}đ
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                <span>TÀI KHOẢN HỆ THỐNG</span>
                <Users size={17} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#7c3aed', marginTop: '6px' }}>
                {users.length} người dùng
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                {users.filter(u => u.role === 'CUSTOMER').length} khách • {users.filter(u => u.role !== 'CUSTOMER').length} nội bộ
              </div>
            </div>

            <div
              className="glass-panel"
              onClick={() => onTabChange && onTabChange('approve-proposals')}
              style={{ padding: '1.2rem', borderLeft: '4px solid #ea580c', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                <span>PHIẾU CHỜ PHÊ DUYỆT</span>
                <CheckSquare size={17} color="#ea580c" />
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ea580c', marginTop: '6px' }}>
                {draftProposals.length} đề xuất
              </div>
              <div style={{ fontSize: '0.74rem', color: '#ea580c', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Dự trù: {pendingBudgetTotal.toLocaleString('vi-VN')} đ <ArrowRight size={12} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.2rem', borderLeft: `4px solid ${lowStockProducts.length > 0 ? '#dc2626' : '#0284c7'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                <span>CẢNH BÁO TỒN KHO</span>
                <AlertTriangle size={17} color={lowStockProducts.length > 0 ? '#dc2626' : '#0284c7'} />
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: 900, color: lowStockProducts.length > 0 ? '#dc2626' : '#0284c7', marginTop: '6px' }}>
                {lowStockProducts.length} / {products.length} SP
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Chạm/dưới ngưỡng an toàn minStock
              </div>
            </div>
          </div>

          {/* CHART + OPERATIONAL SUMMARY */}
          <div className="grid-2">
            <div className="glass-panel" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={18} color="#7c3aed" /> Tăng Trưởng Doanh Thu 6 Tháng
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.74rem', fontWeight: 700 }}>
                  <span style={{ color: '#7c3aed' }}>■ Dịch vụ Spa</span>
                  <span style={{ color: '#059669' }}>■ Pet Shop</span>
                </div>
              </div>
              <div style={{ height: 195, display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0.5rem 0.5rem 0.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                {[
                  { month: 'T3', spa: 48, shop: 38 },
                  { month: 'T4', spa: 62, shop: 52 },
                  { month: 'T5', spa: 74, shop: 64 },
                  { month: 'T6', spa: 82, shop: 71 },
                  { month: 'T7', spa: 79, shop: 69 },
                  { month: 'T8', spa: 94, shop: 85 },
                ].map((bar, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', width: '100%', justifyContent: 'center', height: '100%' }}>
                      <div style={{ width: '36%', maxWidth: 22, height: `${bar.spa}%`, background: 'linear-gradient(180deg, #7c3aed 0%, #a78bfa 100%)', borderRadius: '6px 6px 0 0' }} />
                      <div style={{ width: '36%', maxWidth: 22, height: `${bar.shop}%`, background: 'linear-gradient(180deg, #059669 0%, #34d399 100%)', borderRadius: '6px 6px 0 0' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginTop: '6px' }}>{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={18} color="#0284c7" /> Chỉ Số Vận Hành Toàn Cửa Hàng
              </h3>
              <div className="grid-2" style={{ gap: '0.85rem' }}>
                <div style={{ background: '#f0f9ff', padding: '0.9rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} /> Lịch Hẹn Dịch Vụ
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>{appointments.length} ca</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                    Hoàn thành: {appointments.filter(a => a.status === 'COMPLETED').length} ca
                  </div>
                </div>
                <div style={{ background: '#fff7ed', padding: '0.9rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <div style={{ fontSize: '0.74rem', color: '#c2410c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShoppingBag size={14} /> Đơn Hàng Shop
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ea580c', marginTop: '4px' }}>{orders.length} đơn</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                    Chờ xác nhận: {orders.filter(o => o.status === 'PENDING').length} đơn
                  </div>
                </div>
                <div style={{ background: '#ecfdf5', padding: '0.9rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={14} /> Danh Mục Dịch Vụ
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>{services.length} gói</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                    KM đang chạy: {promotions.filter(p => p.status === 'ACTIVE').length} mã
                  </div>
                </div>
                <div style={{ background: '#faf5ff', padding: '0.9rem', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: '0.74rem', color: '#6d28d9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Building2 size={14} /> Nhà Cung Cấp
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7c3aed', marginTop: '4px' }}>{suppliers.length} đối tác</div>
                  <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                    AI độ tin cậy: {systemConfig.aiConfidenceLevel}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTION PANELS: PENDING PROPOSALS + RECENT AUDIT LOGS */}
          <div className="grid-2">
            <div className="glass-panel" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Đề Xuất Nhập Hàng Cần Admin Duyệt ({draftProposals.length})
                </h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
                  onClick={() => onTabChange && onTabChange('approve-proposals')}
                >
                  Xem tất cả →
                </button>
              </div>
              {draftProposals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.84rem' }}>
                  Tất cả đề xuất nhập hàng đã được xử lý!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {draftProposals.slice(0, 3).map(prop => (
                    <div key={prop.id} className="glass-card" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>{prop.productName}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Đề xuất: <strong style={{ color: '#059669' }}>+{prop.suggestedQuantity} sp</strong> • Dự trù: <strong>{estimateProposalCost(prop).toLocaleString('vi-VN')} đ</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-emerald"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', flexShrink: 0 }}
                        onClick={() => onApproveProposal && onApproveProposal(prop.id)}
                      >
                        <Check size={13} /> Duyệt
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Nhật Ký Hoạt Động Gần Đây
                </h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
                  onClick={() => onTabChange && onTabChange('system-settings')}
                >
                  Chi tiết →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{log.action}</strong>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.actor} — {log.detail}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== 2. QUẢN LÝ TÀI KHOẢN ==================== */}
      {currentTab === 'accounts-admin' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={22} color="#7c3aed" /> Quản Lý Tài Khoản Hệ Thống
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tạo mới, chỉnh sửa thông tin, khóa/mở khóa và xóa tài khoản người dùng trên toàn hệ thống
              </p>
            </div>
            <button type="button" className="btn btn-coral" onClick={openCreateUser}>
              <Plus size={16} /> Thêm Tài Khoản Mới
            </button>
          </div>

          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tổng Tài Khoản</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>{users.length}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Khách Hàng</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {users.filter(u => u.role === 'CUSTOMER').length}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #0284c7' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Nhân Viên & Quản Lý Kho</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                {users.filter(u => u.role === 'CARE_STAFF' || u.role === 'WAREHOUSE_STAFF').length}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #dc2626' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tài Khoản Bị Khóa</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {users.filter(u => u.status === 'LOCKED').length}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'ADMIN', label: 'Admin' },
                  { id: 'CARE_STAFF', label: 'Nhân viên' },
                  { id: 'WAREHOUSE_STAFF', label: 'Quản lý kho' },
                  { id: 'CUSTOMER', label: 'Khách hàng' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoleFilter(r.id)}
                    style={{
                      padding: '0.38rem 0.85rem',
                      borderRadius: '18px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: roleFilter === r.id ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                      background: roleFilter === r.id ? '#f3e8ff' : '#ffffff',
                      color: roleFilter === r.id ? '#6d28d9' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid #cbd5e1', minWidth: 240 }}>
                <Search size={15} color="#64748b" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên, email, số điện thoại..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
                />
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Tài Khoản (Email / SĐT)</th>
                    <th>Số Điện Thoại</th>
                    <th>Vai Trò</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Tạo</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const meta = ROLE_META[u.role] || ROLE_META.CUSTOMER;
                    const isLocked = u.status === 'LOCKED';
                    return (
                      <tr key={u.id} style={{ background: isLocked ? '#fef2f2' : 'transparent' }}>
                        <td><strong style={{ color: '#0f172a' }}>{u.fullName}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || '---'}</td>
                        <td><span className={`badge ${meta.badge}`}>{meta.label}</span></td>
                        <td>
                          <span className={`badge ${isLocked ? 'badge-danger' : 'badge-success'}`}>
                            {isLocked ? 'Đang khóa' : 'Hoạt động'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{u.createdAt || '2026-01-01'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                              onClick={() => openEditUser(u)}
                              title="Chỉnh sửa thông tin"
                            >
                              <Edit3 size={13} /> Sửa
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem', color: isLocked ? '#059669' : '#d97706' }}
                              onClick={() => {
                                if (currentUser && u.id === currentUser.id) {
                                  toast.warning('Không thể tự khóa tài khoản Admin đang đăng nhập!', 'Bảo Vệ Hệ Thống');
                                  return;
                                }
                                onToggleUserStatus && onToggleUserStatus(u.id);
                              }}
                              title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            >
                              <Lock size={13} /> {isLocked ? 'Mở khóa' : 'Khóa'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.76rem' }}
                              onClick={() => handleDeleteUserClick(u)}
                              title="Xóa tài khoản"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================== 3. PHÂN QUYỀN NGƯỜI DÙNG (RBAC) ==================== */}
      {currentTab === 'roles-admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={22} color="#7c3aed" /> Phân Quyền Người Dùng (RBAC)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Gán vai trò truy cập cho từng tài khoản và quản lý ma trận quyền hạn theo 4 nhóm người dùng
            </p>
          </div>

          <div className="grid-4">
            {[
              { key: 'CUSTOMER', title: 'Khách hàng', desc: 'Đặt lịch, quản lý thú cưng, mua sắm', color: '#059669', bg: '#ecfdf5' },
              { key: 'CARE_STAFF', title: 'Nhân viên', desc: 'Lịch hẹn, dịch vụ, KM, thú cưng, báo cáo', color: '#0284c7', bg: '#f0f9ff' },
              { key: 'WAREHOUSE_STAFF', title: 'Quản lý kho', desc: 'Nhập/xuất/tồn, dự báo AI, đề xuất nhập', color: '#d97706', bg: '#fffbeb' },
              { key: 'ADMIN', title: 'Admin', desc: 'Tổng quan, TK, RBAC, duyệt nhập, NCC, cấu hình', color: '#7c3aed', bg: '#faf5ff' },
            ].map(r => (
              <div key={r.key} className="glass-panel" style={{ padding: '1.15rem', background: r.bg, borderColor: `${r.color}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: r.color, fontSize: '1rem' }}>{r.title}</strong>
                  <span style={{ background: '#ffffff', color: r.color, fontWeight: 900, fontSize: '0.85rem', padding: '2px 10px', borderRadius: '14px', border: `1px solid ${r.color}40` }}>
                    {users.filter(u => u.role === r.key).length} TK
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '6px', lineHeight: 1.45 }}>{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              1. Gán & Thay Đổi Vai Trò Tài Khoản
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Chọn vai trò mới để cấp quyền truy cập ngay lập tức cho tài khoản tương ứng
            </p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Tài Khoản</th>
                    <th>Vai Trò Hiện Tại</th>
                    <th>Thay Đổi Vai Trò (Gán Quyền)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const meta = ROLE_META[u.role] || ROLE_META.CUSTOMER;
                    const isSelf = currentUser && (u.id === currentUser.id || u.email === currentUser.email);
                    return (
                      <tr key={u.id}>
                        <td><strong>{u.fullName}</strong></td>
                        <td style={{ color: '#475569' }}>{u.email}</td>
                        <td><span className={`badge ${meta.badge}`}>{meta.label}</span></td>
                        <td>
                          <select
                            className="form-control"
                            disabled={isSelf}
                            value={u.role}
                            onChange={(e) => {
                              if (onUpdateUserRole) {
                                onUpdateUserRole(u.id, e.target.value);
                              }
                            }}
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', maxWidth: 220, cursor: isSelf ? 'not-allowed' : 'pointer' }}
                          >
                            <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                            <option value="CARE_STAFF">Nhân viên (CARE_STAFF)</option>
                            <option value="WAREHOUSE_STAFF">Quản lý kho (WAREHOUSE_STAFF)</option>
                            <option value="ADMIN">Admin (ADMIN)</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a' }}>
                  2. Ma Trận Phân Quyền Chức Năng (RBAC Permission Matrix)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Cấu hình quyền truy cập chi tiết theo từng Use Case của 4 nhóm vai trò
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }} onClick={handleResetRbac}>
                  <RefreshCw size={14} /> Khôi Phục Mặc Định
                </button>
                <button type="button" className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }} onClick={handleSaveRbac}>
                  <Check size={15} /> Lưu Cấu Hình Quyền
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nhóm</th>
                    <th>Chức Năng (Use Case)</th>
                    <th style={{ textAlign: 'center' }}>Khách hàng</th>
                    <th style={{ textAlign: 'center' }}>Nhân viên</th>
                    <th style={{ textAlign: 'center' }}>Quản lý kho</th>
                    <th style={{ textAlign: 'center' }}>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {rbacMatrix.map(row => (
                    <tr key={row.id}>
                      <td><span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{row.group}</span></td>
                      <td><strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{row.label}</strong></td>
                      {['CUSTOMER', 'CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].map(roleKey => (
                        <td key={roleKey} style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={!!row[roleKey]}
                            onChange={() => handleTogglePermission(row.id, roleKey)}
                            style={{ width: 17, height: 17, accentColor: ROLE_META[roleKey].color, cursor: 'pointer' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. PHÊ DUYỆT KẾ HOẠCH NHẬP HÀNG ==================== */}
      {currentTab === 'approve-proposals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={22} color="#ea580c" /> Phê Duyệt Kế Hoạch Nhập Hàng Thông Minh
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Thẩm định ngân sách, kiểm tra căn cứ AI Dự báo từ bộ phận Quản lý kho và phê duyệt đơn nhập hàng
              </p>
            </div>
            {draftProposals.length > 0 && (
              <button type="button" className="btn btn-emerald" onClick={handleApproveAllDrafts}>
                <Check size={16} /> Phê Duyệt Tất Cả ({draftProposals.length})
              </button>
            )}
          </div>

          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Đang Chờ Admin Duyệt</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>{draftProposals.length}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #ea580c' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Ngân Sách Dự Kiến (Chờ Duyệt)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea580c', marginTop: '6px' }}>
                {pendingBudgetTotal.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Đã Duyệt Chờ Kho Nhập</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>{approvedProposals.length}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.1rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Đã Nhập Kho Hoàn Tất</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>{completedProposals.length}</div>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `Tất cả (${reorderProposals.length})` },
              { id: 'DRAFT', label: `Chờ duyệt (${draftProposals.length})` },
              { id: 'APPROVED', label: `Đã duyệt (${approvedProposals.length})` },
              { id: 'COMPLETED', label: `Đã nhập kho (${completedProposals.length})` },
              { id: 'REJECTED', label: `Đã từ chối (${reorderProposals.filter(p => p.status === 'REJECTED').length})` },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setProposalFilter(f.id)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '18px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: proposalFilter === f.id ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                  background: proposalFilter === f.id ? '#f3e8ff' : '#ffffff',
                  color: proposalFilter === f.id ? '#6d28d9' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredProposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                Không có phiếu đề xuất nhập hàng nào trong mục này.
              </div>
            ) : (
              filteredProposals.map(prop => {
                const matchedProd = products.find(p => p.id === prop.productId || p.sku === prop.sku);
                const estCost = estimateProposalCost(prop);
                return (
                  <div
                    key={prop.id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderLeft: `4px solid ${prop.status === 'COMPLETED' ? '#7c3aed' : prop.status === 'APPROVED' ? '#059669' : prop.status === 'REJECTED' ? '#dc2626' : '#f59e0b'}`
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.9rem', flex: 1, minWidth: 290, alignItems: 'flex-start' }}>
                      <img
                        src={getProductImage(matchedProd || { name: prop.productName, category: 'Thức ăn' })}
                        alt={prop.productName}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                        style={{ width: 58, height: 58, borderRadius: '12px', objectFit: 'contain', background: '#ffffff', padding: '3px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{prop.productName}</strong>
                          <span className={`badge ${prop.status === 'COMPLETED' ? 'badge-info' : prop.status === 'APPROVED' ? 'badge-success' : prop.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}`}>
                            {prop.status === 'DRAFT' ? 'Chờ Admin duyệt' : prop.status === 'APPROVED' ? 'Đã duyệt • Chờ nhập kho' : prop.status === 'COMPLETED' ? 'Đã nhập kho' : 'Đã từ chối'}
                          </span>
                          {prop.confidenceScore && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '2px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Brain size={11} /> AI {(prop.confidenceScore * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.79rem', color: '#64748b' }}>
                          SKU: <strong>{prop.sku}</strong> • Tồn lúc lập: <strong style={{ color: '#dc2626' }}>{prop.currentStock}</strong> (min {prop.minStockLevel}) • NCC: <strong>{prop.suggestedSupplier || 'Royal Canin Việt Nam'}</strong>
                        </div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.55rem 0.75rem', fontSize: '0.8rem', color: '#334155', marginTop: '6px' }}>
                          {prop.reason}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Số lượng đề xuất</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>+{prop.suggestedQuantity} sp</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ea580c' }}>
                          Dự chi: {estCost.toLocaleString('vi-VN')} đ
                        </div>
                        <div style={{ fontSize: '0.71rem', color: '#64748b' }}>Ngày đặt: {prop.suggestedOrderDate || 'Hôm nay'}</div>
                      </div>

                      {prop.status === 'DRAFT' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          <button type="button" className="btn btn-emerald" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => onApproveProposal && onApproveProposal(prop.id)}>
                            <Check size={15} /> Phê Duyệt
                          </button>
                          <button type="button" className="btn btn-danger" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }} onClick={() => onRejectProposal && onRejectProposal(prop.id)}>
                            <X size={14} /> Từ Chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==================== 5. QUẢN LÝ NHÀ CUNG CẤP ==================== */}
      {currentTab === 'suppliers-admin' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={22} color="#0284c7" /> Quản Lý Danh Mục Nhà Cung Cấp ({filteredSuppliers.length})
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Quản lý hồ sơ đối tác cung ứng thức ăn, phụ kiện, mỹ phẩm Spa và vật tư thú y chính hãng
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid #cbd5e1', minWidth: 220 }}>
                <Search size={15} color="#64748b" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={e => setSupplierSearch(e.target.value)}
                  placeholder="Tìm tên NCC, liên hệ, mặt hàng..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
                />
              </div>
              <button type="button" className="btn btn-coral" onClick={openCreateSupplier}>
                <Plus size={16} /> Thêm Nhà Cung Cấp
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Nhà Cung Cấp</th>
                  <th>Người Đại Diện</th>
                  <th>Thông Tin Liên Hệ</th>
                  <th>Địa Chỉ</th>
                  <th>Mặt Hàng Cung Ứng</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map(sup => (
                  <tr key={sup.id}>
                    <td><strong style={{ color: '#0f172a' }}>{sup.name}</strong></td>
                    <td>{sup.contactPerson || 'Bộ phận kinh doanh'}</td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {sup.phone || '---'}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {sup.email || '---'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {sup.address || 'TP. Hồ Chí Minh'}
                      </span>
                    </td>
                    <td><span className="badge badge-info">{sup.productCategories || 'Thức ăn & Vật tư'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }} onClick={() => openEditSupplier(sup)}>
                          <Edit3 size={13} /> Sửa
                        </button>
                        <button type="button" className="btn btn-danger" style={{ padding: '0.35rem 0.6rem', fontSize: '0.76rem' }} onClick={() => handleDeleteSupplierClick(sup)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 6. CẤU HÌNH HỆ THỐNG & NHẬT KÝ HOẠT ĐỘNG ==================== */}
      {currentTab === 'system-settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={22} color="#7c3aed" /> Cấu Hình Hệ Thống & Nhật Ký Hoạt Động
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Thiết lập tham số vận hành cửa hàng, tùy chỉnh thuật toán AI Dự báo nhập kho và kiểm tra nhật ký hệ thống
            </p>
          </div>

          <form onSubmit={handleSaveSystemConfig} className="grid-2">
            {/* Store & Operations Config */}
            <div className="glass-panel" style={{ padding: '1.4rem' }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings size={17} color="#0284c7" /> 1. Thông Số Cửa Hàng & Vận Hành
              </h3>
              <div className="form-group">
                <label>Tên Hệ Thống / Thương Hiệu</label>
                <input
                  className="form-control"
                  value={systemConfig.storeName}
                  onChange={e => setSystemConfig({ ...systemConfig, storeName: e.target.value })}
                />
              </div>
              <div className="grid-2" style={{ gap: '0.85rem' }}>
                <div className="form-group">
                  <label>Hotline Hỗ Trợ</label>
                  <input
                    className="form-control"
                    value={systemConfig.hotline}
                    onChange={e => setSystemConfig({ ...systemConfig, hotline: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Liên Hệ</label>
                  <input
                    className="form-control"
                    value={systemConfig.supportEmail}
                    onChange={e => setSystemConfig({ ...systemConfig, supportEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Giờ Hoạt Động</label>
                <input
                  className="form-control"
                  value={systemConfig.openHours}
                  onChange={e => setSystemConfig({ ...systemConfig, openHours: e.target.value })}
                />
              </div>
              <div className="grid-2" style={{ gap: '0.85rem' }}>
                <div className="form-group">
                  <label>Ngưỡng Freeship (VNĐ)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={systemConfig.freeShipThreshold}
                    onChange={e => setSystemConfig({ ...systemConfig, freeShipThreshold: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Phí Giao Hỏa Tốc 2H (VNĐ)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={systemConfig.expressShipFee}
                    onChange={e => setSystemConfig({ ...systemConfig, expressShipFee: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* AI Demand Forecasting Parameters */}
            <div className="glass-panel" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Brain size={18} color="#059669" /> 2. Tham Số Thuật Toán AI Dự Báo & Nhập Hàng
                </h3>
                <div className="form-group">
                  <label>Mức Độ Tin Cậy Thống Kê (Service Level / Z-Score)</label>
                  <select
                    className="form-control"
                    value={systemConfig.aiConfidenceLevel}
                    onChange={e => setSystemConfig({ ...systemConfig, aiConfidenceLevel: e.target.value })}
                  >
                    <option value="90">90% (Z = 1.28 — Tối ưu vốn tồn kho)</option>
                    <option value="95">95% (Z = 1.65 — Cân bằng tiêu chuẩn • Khuyên dùng)</option>
                    <option value="99">99% (Z = 2.33 — An toàn tối đa chống đứt hàng)</option>
                  </select>
                </div>
                <div className="grid-2" style={{ gap: '0.85rem' }}>
                  <div className="form-group">
                    <label>Lead-Time Giao Hàng Mặc Định (ngày)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      className="form-control"
                      value={systemConfig.defaultLeadTimeDays}
                      onChange={e => setSystemConfig({ ...systemConfig, defaultLeadTimeDays: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hệ Số Dự Phòng Safety Stock (%)</label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      className="form-control"
                      value={systemConfig.safetyStockRatio}
                      onChange={e => setSystemConfig({ ...systemConfig, safetyStockRatio: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.84rem', fontWeight: 700, color: '#166534' }}>
                  <input
                    type="checkbox"
                    checked={!!systemConfig.autoLowStockAlert}
                    onChange={e => setSystemConfig({ ...systemConfig, autoLowStockAlert: e.target.checked })}
                    style={{ width: 17, height: 17, accentColor: '#059669' }}
                  />
                  Tự động cảnh báo & gợi ý tạo phiếu đề xuất khi tồn kho chạm minStock
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} /> Lưu Toàn Bộ Cấu Hình
                </button>
              </div>
            </div>
          </form>

          {/* SYSTEM AUDIT LOGS */}
          <div className="glass-panel" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={18} color="#7c3aed" /> 3. Nhật Ký Hoạt Động Hệ Thống (Audit Logs)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Ghi nhận lịch sử thay đổi tài khoản, phân quyền, phê duyệt nhập kho và cấu hình
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'ACCOUNT', label: 'Tài khoản' },
                  { id: 'SECURITY', label: 'Phân quyền' },
                  { id: 'INVENTORY', label: 'Duyệt nhập kho' },
                  { id: 'SYSTEM', label: 'Hệ thống' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAuditFilter(tab.id)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '16px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      border: auditFilter === tab.id ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                      background: auditFilter === tab.id ? '#f3e8ff' : '#ffffff',
                      color: auditFilter === tab.id ? '#6d28d9' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
                {onClearAuditLogs && auditLogs.length > 0 && (
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }} onClick={onClearAuditLogs}>
                    Xóa nhật ký
                  </button>
                )}
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Thời Gian</th>
                    <th>Phân Loại</th>
                    <th>Người Thực Hiện</th>
                    <th>Hành Động</th>
                    <th>Chi Tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>Chưa có bản ghi nhật ký nào.</td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#64748b' }}>{log.time}</td>
                        <td>
                          <span className={`badge ${log.category === 'SECURITY' ? 'badge-danger' : log.category === 'INVENTORY' ? 'badge-pending' : log.category === 'ACCOUNT' ? 'badge-info' : 'badge-success'}`}>
                            {log.category}
                          </span>
                        </td>
                        <td><strong>{log.actor}</strong></td>
                        <td><strong>{log.action}</strong></td>
                        <td style={{ fontSize: '0.83rem', color: '#475569' }}>{log.detail}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / SỬA TÀI KHOẢN ==================== */}
      {showUserModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowUserModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#7c3aed" /> {editingUser ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
              </h3>
              <button type="button" onClick={() => setShowUserModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input
                  className="form-control"
                  value={userForm.fullName}
                  onChange={e => setUserForm({ ...userForm, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Email hoặc SĐT đăng nhập *</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!!editingUser}
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="Nhập email hoặc số điện thoại"
                    required
                    style={editingUser ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
                  />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input
                    className="form-control"
                    value={userForm.phone}
                    onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Vai Trò (Role) *</label>
                  <select
                    className="form-control"
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                    <option value="CARE_STAFF">Nhân viên (CARE_STAFF)</option>
                    <option value="WAREHOUSE_STAFF">Quản lý kho (WAREHOUSE_STAFF)</option>
                    <option value="ADMIN">Admin (ADMIN)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{editingUser ? 'Mật Khẩu Mới (tùy chọn)' : 'Mật Khẩu Khởi Tạo *'}</label>
                  <input
                    type="password"
                    className="form-control"
                    value={userForm.password}
                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUser ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'}
                    required={!editingUser}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / SỬA NHÀ CUNG CẤP ==================== */}
      {showSupplierModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSupplierModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#0284c7" /> {editingSupplier ? 'Cập Nhật Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}
              </h3>
              <button type="button" onClick={() => setShowSupplierModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveSupplier}>
              <div className="form-group">
                <label>Tên Nhà Cung Cấp *</label>
                <input className="form-control" value={supplierForm.name} onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })} placeholder="Nhập tên công ty / nhà cung cấp" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Người Đại Diện</label>
                  <input className="form-control" value={supplierForm.contactPerson} onChange={e => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })} placeholder="Họ tên người phụ trách" />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input className="form-control" value={supplierForm.phone} onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })} placeholder="Số điện thoại liên hệ" />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={supplierForm.email} onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })} placeholder="Email đối tác" />
                </div>
                <div className="form-group">
                  <label>Mặt Hàng Cung Ứng</label>
                  <input className="form-control" value={supplierForm.productCategories} onChange={e => setSupplierForm({ ...supplierForm, productCategories: e.target.value })} placeholder="VD: Thức ăn hạt, Pate, Y tế" />
                </div>
              </div>
              <div className="form-group">
                <label>Địa Chỉ</label>
                <input className="form-control" value={supplierForm.address} onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })} placeholder="Địa chỉ trụ sở / kho hàng" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">{editingSupplier ? 'Lưu Thay Đổi' : 'Thêm Nhà Cung Cấp'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
