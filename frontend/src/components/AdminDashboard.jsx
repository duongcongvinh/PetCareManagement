import React, { useState } from 'react';
import {
  Shield, Users, Plus, Search, Edit3, Trash2, Lock, Unlock, Check, X, RefreshCw,
  LayoutDashboard, BarChart3, DollarSign, AlertTriangle, CheckSquare, Building2, Settings,
  Phone, Mail, MapPin, Download, Brain, Clock, TrendingUp, Calendar, ShoppingBag,
  FileText, Activity, ArrowRight, Sparkles, Layers, List, LayoutGrid, CheckCircle2,
  XCircle, Package, PawPrint, Star, Tag, PieChart, Scissors, ArrowUpDown
} from 'lucide-react';
import { getProductImage, getServiceImage, FALLBACK_IMAGES } from '../mediaAssets';
import { toast, confirmModal } from './ToastNotification';

const STANDARD_PRODUCT_CATEGORIES = [
  'Thức ăn',
  'Dinh dưỡng',
  'Bánh thưởng',
  'Cát vệ sinh',
  'Mỹ phẩm Spa',
  'Phụ kiện',
  'Y tế',
  'Dụng cụ Y tế',
];

const STANDARD_SERVICE_CATEGORIES = [
  'Spa & Grooming',
  'Y Tế & Tiêm Phòng',
  'Khám Bệnh & Trị Liệu',
];

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
  // Quản lý kho
  { id: 'uc-wh-inv', group: 'Quản lý kho', label: 'Quản lý kho (Nhập / Xuất / Tồn kho)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: false },
  { id: 'uc-wh-products', group: 'Quản lý kho', label: 'Quản lý sản phẩm (Thêm / Sửa / Xóa)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: false },
  { id: 'uc-wh-ai', group: 'Quản lý kho', label: 'Dự báo nhu cầu (AI)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: true },
  { id: 'uc-wh-prop', group: 'Quản lý kho', label: 'Lập đề xuất nhập hàng', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: false },
  // Admin
  { id: 'uc-admin-overview', group: 'Admin', label: 'Xem tổng quan & Báo cáo toàn hệ thống', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-catalog', group: 'Admin', label: 'Quản lý kho sản phẩm & Danh mục dịch vụ', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-acc', group: 'Admin', label: 'Quản lý tài khoản', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-role', group: 'Admin', label: 'Phân quyền người dùng (RBAC)', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-approve', group: 'Admin', label: 'Phê duyệt kế hoạch nhập hàng', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
  { id: 'uc-admin-supplier', group: 'Admin', label: 'Quản lý nhà cung cấp', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: true, ADMIN: true },
  { id: 'uc-admin-config', group: 'Admin', label: 'Cấu hình hệ thống & Nhật ký hoạt động', CUSTOMER: false, CARE_STAFF: false, WAREHOUSE_STAFF: false, ADMIN: true },
];

const ROLE_META = {
  CUSTOMER: {
    label: 'Khách hàng',
    badge: 'badge-success',
    color: '#059669',
    softBg: '#ecfdf5',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  CARE_STAFF: {
    label: 'Nhân viên',
    badge: 'badge-info',
    color: '#0284c7',
    softBg: '#f0f9ff',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
  },
  WAREHOUSE_STAFF: {
    label: 'Quản lý kho',
    badge: 'badge-pending',
    color: '#d97706',
    softBg: '#fffbeb',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  ADMIN: {
    label: 'Admin',
    badge: 'badge-danger',
    color: '#6d28d9',
    softBg: '#f5f3ff',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
  },
};

const GROUP_BADGE_STYLES = {
  'Khách hàng': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  'Nhân viên': { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
  'Quản lý kho': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  'Admin': { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
};

const AUDIT_CATEGORY_META = {
  SECURITY: { label: 'Phân quyền', dot: '#dc2626', badge: 'badge-danger' },
  INVENTORY: { label: 'Nhập kho', dot: '#d97706', badge: 'badge-pending' },
  ACCOUNT: { label: 'Tài khoản', dot: '#0284c7', badge: 'badge-info' },
  SYSTEM: { label: 'Hệ thống', dot: '#059669', badge: 'badge-success' },
};

const DEFAULT_SYSTEM_CONFIG = {
  storeName: 'Petzera Pet Care & Smart AI Platform',
  hotline: '0348 639 603',
  supportEmail: 'hello@petzera.vn',
  openHours: 'Mở cửa 24/7 (00:00 - 24:00 • Cả Lễ & Tết)',
  freeShipThreshold: 500000,
  expressShipFee: 30000,
  aiConfidenceLevel: '95', // 90 | 95 | 99
  defaultLeadTimeDays: 4,
  safetyStockRatio: 20,
  autoLowStockAlert: true,
};

const getInitials = (text, fallback = 'PZ') => {
  const parts = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ==================== REAL-DATA REPORTING HELPERS ====================
const DAY_MS = 24 * 60 * 60 * 1000;

const REPORT_PERIODS = [
  { id: 'ALL', label: 'Toàn thời gian' },
  { id: 'TODAY', label: 'Hôm nay' },
  { id: 'LAST_7D', label: '7 ngày qua' },
  { id: 'LAST_30D', label: '30 ngày qua' },
  { id: 'THIS_MONTH', label: 'Tháng này' },
  { id: 'THIS_YEAR', label: 'Năm nay' },
];

const parseDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const str = String(value);
  const viMatch = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (viMatch) {
    const timeMatch = str.match(/(\d{1,2}):(\d{2})/);
    return new Date(
      Number(viMatch[3]),
      Number(viMatch[2]) - 1,
      Number(viMatch[1]),
      timeMatch ? Number(timeMatch[1]) : 0,
      timeMatch ? Number(timeMatch[2]) : 0
    );
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getAppointmentDate = (a) =>
  parseDateValue(a?.rawAppointmentDate) || parseDateValue(a?.appointmentDate) || parseDateValue(a?.createdAt);

const getOrderDate = (o) => parseDateValue(o?.createdAt) || parseDateValue(o?.date);

const getReviewDate = (r) => parseDateValue(r?.createdAt);

const getPeriodRange = (period, now = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (period) {
    case 'TODAY':
      return { start: today, end: new Date(today.getTime() + DAY_MS), prevStart: new Date(today.getTime() - DAY_MS), prevEnd: today };
    case 'LAST_7D': {
      const end = new Date(today.getTime() + DAY_MS);
      const start = new Date(end.getTime() - 7 * DAY_MS);
      return { start, end, prevStart: new Date(start.getTime() - 7 * DAY_MS), prevEnd: start };
    }
    case 'LAST_30D': {
      const end = new Date(today.getTime() + DAY_MS);
      const start = new Date(end.getTime() - 30 * DAY_MS);
      return { start, end, prevStart: new Date(start.getTime() - 30 * DAY_MS), prevEnd: start };
    }
    case 'THIS_MONTH':
      return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1), prevStart: new Date(y, m - 1, 1), prevEnd: new Date(y, m, 1) };
    case 'THIS_YEAR':
      return { start: new Date(y, 0, 1), end: new Date(y + 1, 0, 1), prevStart: new Date(y - 1, 0, 1), prevEnd: new Date(y, 0, 1) };
    default:
      return null;
  }
};

const isWithin = (date, start, end) => !!date && date >= start && date < end;

const buildTimeBuckets = (period, now, datedRecords) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayLabel = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  const buckets = [];

  if (period === 'TODAY' || period === 'LAST_7D') {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(today.getTime() - i * DAY_MS);
      buckets.push({ key: start.toISOString(), label: dayLabel(start), start, end: new Date(start.getTime() + DAY_MS) });
    }
    return buckets;
  }

  if (period === 'LAST_30D') {
    const end = new Date(today.getTime() + DAY_MS);
    for (let i = 5; i >= 0; i--) {
      const bEnd = new Date(end.getTime() - i * 5 * DAY_MS);
      const bStart = new Date(bEnd.getTime() - 5 * DAY_MS);
      buckets.push({ key: bStart.toISOString(), label: `${dayLabel(bStart)}`, start: bStart, end: bEnd });
    }
    return buckets;
  }

  if (period === 'THIS_MONTH') {
    const y = now.getFullYear();
    const m = now.getMonth();
    const monthEnd = new Date(y, m + 1, 1);
    let cursor = new Date(y, m, 1);
    let idx = 1;
    while (cursor < monthEnd) {
      const next = new Date(Math.min(cursor.getTime() + 7 * DAY_MS, monthEnd.getTime()));
      buckets.push({ key: cursor.toISOString(), label: `Tuần ${idx}`, start: cursor, end: next });
      cursor = next;
      idx += 1;
    }
    return buckets;
  }

  // THIS_YEAR → 12 tháng của năm hiện tại; ALL → các tháng có dữ liệu thực tế (tối đa 12 tháng gần nhất)
  if (period === 'THIS_YEAR') {
    const y = now.getFullYear();
    for (let mi = 0; mi < 12; mi++) {
      buckets.push({ key: `${y}-${mi}`, label: `T${mi + 1}`, start: new Date(y, mi, 1), end: new Date(y, mi + 1, 1) });
    }
    return buckets;
  }

  const validDates = datedRecords.filter(Boolean);
  const earliest = validDates.length > 0 ? new Date(Math.min(...validDates.map((d) => d.getTime()))) : now;
  const latest = validDates.length > 0 ? new Date(Math.max(now.getTime(), ...validDates.map((d) => d.getTime()))) : now;
  let startMonth = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  const endMonth = new Date(latest.getFullYear(), latest.getMonth(), 1);
  const monthsSpan = (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + (endMonth.getMonth() - startMonth.getMonth()) + 1;
  if (monthsSpan > 12) {
    startMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - 11, 1);
  } else if (monthsSpan < 6) {
    startMonth = new Date(endMonth.getFullYear(), endMonth.getMonth() - 5, 1);
  }
  let cursor = startMonth;
  while (cursor <= endMonth) {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    buckets.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: `T${cursor.getMonth() + 1}/${String(cursor.getFullYear()).slice(-2)}`,
      start: cursor,
      end: next,
    });
    cursor = next;
  }
  return buckets;
};

const formatCompactVnd = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tr`;
  if (Math.abs(n) >= 1e3) return `${Math.round(n / 1e3).toLocaleString('vi-VN')}K`;
  return `${Math.round(n).toLocaleString('vi-VN')}`;
};

const formatVnd = (value) => `${(Number(value) || 0).toLocaleString('vi-VN')} đ`;

const formatDisplayDate = (value) => {
  const d = parseDateValue(value);
  if (!d) return '—';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadCsv = (filename, rows) => {
  const csvContent = '\uFEFF' + rows.map((r) => r.map(csvCell).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const APPOINTMENT_STATUS_LABELS = {
  PENDING: 'Chờ tiếp nhận',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang thực hiện',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const ORDER_STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  PAID: 'Đã thanh toán',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED: 'Đang giao',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

export default function AdminDashboard({
  activeTab = 'overview',
  onTabChange,
  currentUser,
  users = [],
  pets = [],
  appointments = [],
  products = [],
  services = [],
  orders = [],
  promotions = [],
  reviews = [],
  reorderProposals = [],
  suppliers = [],
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
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
  onCreateProposal,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddAuditLog,
  onClearAuditLogs
}) {
  // Overview & Reports interactive UI state
  const [overviewFeedTab, setOverviewFeedTab] = useState('appointments');
  const [reportPeriod, setReportPeriod] = useState('ALL');
  const [reportChartMode, setReportChartMode] = useState('TIME'); // 'TIME' | 'CATEGORY'
  const [reportTableMode, setReportTableMode] = useState('TRANSACTIONS'); // 'TRANSACTIONS' | 'INVENTORY'

  // Catalog (Inventory & Services) state
  const [catalogSubTab, setCatalogSubTab] = useState('products'); // 'products' | 'services'
  const [catalogProdSearch, setCatalogProdSearch] = useState('');
  const [catalogProdStockFilter, setCatalogProdStockFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'OUT' | 'SAFE'
  const [catalogProdCatFilter, setCatalogProdCatFilter] = useState('ALL');
  const [catalogProdSort, setCatalogProdSort] = useState('DEFAULT');
  const [catalogProdView, setCatalogProdView] = useState('table');

  const [showAdminProductModal, setShowAdminProductModal] = useState(false);
  const [editingAdminProduct, setEditingAdminProduct] = useState(null);
  const [adminProductForm, setAdminProductForm] = useState({
    name: '',
    sku: '',
    category: 'Thức ăn',
    unitPrice: 150000,
    costPrice: 100000,
    currentStock: 20,
    minStockLevel: 10,
    maxStockLevel: 100,
    supplierName: suppliers[0]?.name || 'Royal Canin Việt Nam',
  });

  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [adminStockForm, setAdminStockForm] = useState({
    type: 'IN',
    quantity: 10,
    minStockLevel: 10,
    maxStockLevel: 100,
    note: '',
  });

  const [catalogSvcSearch, setCatalogSvcSearch] = useState('');
  const [catalogSvcCatFilter, setCatalogSvcCatFilter] = useState('ALL');
  const [catalogSvcSort, setCatalogSvcSort] = useState('DEFAULT');
  const [catalogSvcView, setCatalogSvcView] = useState('table');

  const [showAdminServiceModal, setShowAdminServiceModal] = useState(false);
  const [editingAdminService, setEditingAdminService] = useState(null);
  const [adminServiceForm, setAdminServiceForm] = useState({
    name: '',
    category: 'Spa & Grooming',
    durationMinutes: 45,
    price: 200000,
    description: '',
  });

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
  const [supplierViewMode, setSupplierViewMode] = useState('table');
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
    'reports-admin',
    'catalog-admin',
    'accounts-admin',
    'roles-admin',
    'approve-proposals',
    'suppliers-admin',
    'system-settings'
  ];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'overview';

  // Computed metrics (100% từ dữ liệu MongoDB thật, tự cập nhật khi props thay đổi)
  const activeAppointments = appointments.filter(a => a.status !== 'CANCELLED');
  const activeOrders = orders.filter(o => o.status !== 'CANCELLED');
  const serviceRevenue = activeAppointments.reduce((sum, a) => sum + (Number(a.price ?? a.totalPrice) || 0), 0);
  const orderRevenue = activeOrders.reduce((sum, o) => sum + (Number(o.total ?? o.totalAmount) || 0), 0);
  const totalRevenue = serviceRevenue + orderRevenue;
  const spaSharePct = totalRevenue > 0 ? Math.round((serviceRevenue / totalRevenue) * 100) : 0;
  const shopSharePct = totalRevenue > 0 ? 100 - spaSharePct : 0;
  const totalTransactionsCount = activeAppointments.length + activeOrders.length;
  const avgOrderValue = totalTransactionsCount > 0 ? Math.round(totalRevenue / totalTransactionsCount) : 0;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);
  const draftProposals = reorderProposals.filter(p => p.status === 'DRAFT');
  const approvedProposals = reorderProposals.filter(p => p.status === 'APPROVED');
  const completedProposals = reorderProposals.filter(p => p.status === 'COMPLETED');
  const rejectedProposals = reorderProposals.filter(p => p.status === 'REJECTED');

  const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
  const inProgressAppointments = appointments.filter(a => a.status === 'IN_PROGRESS').length;
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;
  const completedRate = appointments.length > 0 ? Math.round((completedAppointments / appointments.length) * 100) : 0;

  const customerCount = users.filter(u => u.role === 'CUSTOMER').length;
  const careStaffCount = users.filter(u => u.role === 'CARE_STAFF').length;
  const warehouseStaffCount = users.filter(u => u.role === 'WAREHOUSE_STAFF').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const internalCount = users.filter(u => u.role !== 'CUSTOMER').length;
  const lockedCount = users.filter(u => u.status === 'LOCKED').length;

  // Reviews & Pets metrics
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length)
    : 0;
  const unrepliedReviewsCount = reviews.filter(r => !r.staffReply).length;
  const dogCount = pets.filter(p => String(p.species || '').toLowerCase().includes('chó')).length;
  const catCount = pets.filter(p => String(p.species || '').toLowerCase().includes('mèo')).length;
  const otherPetCount = Math.max(0, pets.length - dogCount - catCount);

  // Inventory valuation & category breakdown
  const totalInventoryUnits = products.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0);
  const inventoryCostValue = products.reduce((sum, p) => {
    const unitCost = Number(p.costPrice) || Math.round((Number(p.unitPrice) || 0) * 0.65);
    return sum + (Number(p.currentStock) || 0) * unitCost;
  }, 0);
  const inventoryRetailValue = products.reduce((sum, p) => {
    return sum + (Number(p.currentStock) || 0) * (Number(p.unitPrice) || 0);
  }, 0);
  const estimatedMarginPct = inventoryRetailValue > 0
    ? (((inventoryRetailValue - inventoryCostValue) / inventoryRetailValue) * 100)
    : 0;

  const productCategoryStats = Object.values(
    products.reduce((acc, p) => {
      const cat = p.category || 'Khác';
      if (!acc[cat]) {
        acc[cat] = {
          category: cat,
          skuCount: 0,
          totalStock: 0,
          retailValue: 0,
          costValue: 0,
          lowStockCount: 0,
        };
      }
      const stock = Number(p.currentStock) || 0;
      const unitPrice = Number(p.unitPrice) || 0;
      const unitCost = Number(p.costPrice) || Math.round(unitPrice * 0.65);
      acc[cat].skuCount += 1;
      acc[cat].totalStock += stock;
      acc[cat].retailValue += stock * unitPrice;
      acc[cat].costValue += stock * unitCost;
      if (stock <= (Number(p.minStockLevel) || 0)) acc[cat].lowStockCount += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.retailValue - a.retailValue);

  const serviceCategoryStats = STANDARD_SERVICE_CATEGORIES.map((cat) => {
    const catServices = services.filter((s) => s.category === cat);
    const avgPrice =
      catServices.length > 0
        ? Math.round(catServices.reduce((s, item) => s + (Number(item.price) || 0), 0) / catServices.length)
        : 0;
    const catServiceIds = new Set(catServices.map((s) => s.id));
    const catServiceNames = new Set(catServices.map((s) => s.name));
    const matchedAppointments = appointments.filter(
      (a) => catServiceIds.has(a.serviceId) || catServiceNames.has(a.serviceName) || a.serviceCategory === cat
    );
    const catRevenue = matchedAppointments
      .filter((a) => a.status !== 'CANCELLED')
      .reduce((sum, a) => sum + (Number(a.price ?? a.totalPrice) || 0), 0);
    return {
      category: cat,
      count: catServices.length,
      avgPrice,
      bookedCount: matchedAppointments.length,
      revenue: catRevenue,
    };
  });

  // ==================== REAL-TIME PERIOD ANALYTICS (100% LIVE MONGODB DATA) ====================
  const nowRef = new Date();
  const activePeriodMeta = REPORT_PERIODS.find((p) => p.id === reportPeriod) || REPORT_PERIODS[0];
  const periodRange = getPeriodRange(reportPeriod, nowRef);

  const periodAppointments = periodRange
    ? activeAppointments.filter((a) => isWithin(getAppointmentDate(a), periodRange.start, periodRange.end))
    : activeAppointments;
  const periodOrders = periodRange
    ? activeOrders.filter((o) => isWithin(getOrderDate(o), periodRange.start, periodRange.end))
    : activeOrders;

  const periodServiceRevenue = periodAppointments.reduce(
    (sum, a) => sum + (Number(a.price ?? a.totalPrice) || 0),
    0
  );
  const periodOrderRevenue = periodOrders.reduce(
    (sum, o) => sum + (Number(o.total ?? o.totalAmount) || 0),
    0
  );
  const periodTotalRevenue = periodServiceRevenue + periodOrderRevenue;
  const periodSpaPct = periodTotalRevenue > 0 ? Math.round((periodServiceRevenue / periodTotalRevenue) * 100) : 0;
  const periodShopPct = periodTotalRevenue > 0 ? 100 - periodSpaPct : 0;
  const periodTxCount = periodAppointments.length + periodOrders.length;
  const periodAvgTxValue = periodTxCount > 0 ? Math.round(periodTotalRevenue / periodTxCount) : 0;
  const periodUnitsSold = periodOrders.reduce((sum, o) => {
    if (Number(o.totalUnitsSold) > 0) return sum + Number(o.totalUnitsSold);
    if (Array.isArray(o.rawItems) && o.rawItems.length > 0) {
      return sum + o.rawItems.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
    }
    return sum + 1;
  }, 0);

  let periodGrowthPct = null;
  if (periodRange && periodRange.prevStart && periodRange.prevEnd) {
    const prevAppRev = activeAppointments
      .filter((a) => isWithin(getAppointmentDate(a), periodRange.prevStart, periodRange.prevEnd))
      .reduce((s, a) => s + (Number(a.price ?? a.totalPrice) || 0), 0);
    const prevOrdRev = activeOrders
      .filter((o) => isWithin(getOrderDate(o), periodRange.prevStart, periodRange.prevEnd))
      .reduce((s, o) => s + (Number(o.total ?? o.totalAmount) || 0), 0);
    const prevTotal = prevAppRev + prevOrdRev;
    if (prevTotal > 0) {
      periodGrowthPct = ((periodTotalRevenue - prevTotal) / prevTotal) * 100;
    }
  }

  const allDatedTransactions = [
    ...activeAppointments.map(getAppointmentDate),
    ...activeOrders.map(getOrderDate),
  ].filter(Boolean);

  const timeBuckets = buildTimeBuckets(reportPeriod, nowRef, allDatedTransactions);
  const timeChartRows = timeBuckets.map((b) => {
    const bApps = activeAppointments.filter((a) => isWithin(getAppointmentDate(a), b.start, b.end));
    const bOrds = activeOrders.filter((o) => isWithin(getOrderDate(o), b.start, b.end));
    const spaRev = bApps.reduce((s, a) => s + (Number(a.price ?? a.totalPrice) || 0), 0);
    const shopRev = bOrds.reduce((s, o) => s + (Number(o.total ?? o.totalAmount) || 0), 0);
    return {
      key: b.key,
      label: b.label,
      primaryValue: spaRev,
      secondaryValue: shopRev,
      total: spaRev + shopRev,
      txCount: bApps.length + bOrds.length,
    };
  });

  const categoryChartRows = [
    ...productCategoryStats.slice(0, 6).map((cat) => ({
      key: `prod-${cat.category}`,
      label: cat.category.length > 12 ? cat.category.slice(0, 11) + '…' : cat.category,
      fullLabel: `Kho: ${cat.category}`,
      primaryValue: cat.costValue,
      secondaryValue: cat.retailValue,
      total: cat.retailValue,
      txCount: cat.skuCount,
    })),
    ...serviceCategoryStats.map((svc) => ({
      key: `svc-${svc.category}`,
      label: svc.category.split('&')[0].trim(),
      fullLabel: `DV: ${svc.category}`,
      primaryValue: svc.revenue,
      secondaryValue: svc.avgPrice * svc.count,
      total: Math.max(svc.revenue, svc.avgPrice * svc.count),
      txCount: svc.count,
    })),
  ];

  const activeChartRows = reportChartMode === 'CATEGORY' ? categoryChartRows : timeChartRows;
  const chartMaxVal = Math.max(
    100000,
    ...activeChartRows.map((r) => Math.max(r.primaryValue || 0, r.secondaryValue || 0))
  );
  const peakTimeRow = timeChartRows.reduce(
    (best, row) => (row.total > 0 && (!best || row.total > best.total) ? row : best),
    null
  );

  // Unified Real Transaction Ledger (Appointments + Orders) sorted newest-first
  const transactionLedgerRows = [
    ...appointments
      .filter((a) => !periodRange || isWithin(getAppointmentDate(a), periodRange.start, periodRange.end))
      .map((a) => {
        const d = getAppointmentDate(a);
        return {
          id: `APP-${a.id}`,
          code: `#LH-${String(a.id).slice(-6).toUpperCase()}`,
          type: 'SERVICE',
          typeLabel: 'Lịch hẹn Spa/Thú y',
          dateObj: d,
          dateDisplay: d ? formatDisplayDate(d) + (a.timeSlot ? ` (${a.timeSlot})` : '') : a.appointmentDate || '—',
          customerName: a.customerName || 'Khách hàng',
          summary: `${a.serviceName || 'Dịch vụ'} — Bé ${a.petName || 'Thú cưng'}`,
          amount: Number(a.price ?? a.totalPrice) || 0,
          status: a.status || 'PENDING',
          statusLabel: APPOINTMENT_STATUS_LABELS[a.status] || a.status || 'Chờ tiếp nhận',
        };
      }),
    ...orders
      .filter((o) => !periodRange || isWithin(getOrderDate(o), periodRange.start, periodRange.end))
      .map((o) => {
        const d = getOrderDate(o);
        return {
          id: `ORD-${o.id}`,
          code: `#DH-${String(o.id).slice(-6).toUpperCase()}`,
          type: 'ORDER',
          typeLabel: 'Đơn hàng Pet Shop',
          dateObj: d,
          dateDisplay: o.date || (d ? formatDisplayDate(d) : '—'),
          customerName: o.customerName || 'Khách mua hàng',
          summary: o.items || 'Sản phẩm Pet Shop',
          amount: Number(o.total ?? o.totalAmount) || 0,
          status: o.status || 'PENDING',
          statusLabel: ORDER_STATUS_LABELS[o.status] || o.status || 'Chờ xác nhận',
        };
      }),
  ].sort((a, b) => (b.dateObj ? b.dateObj.getTime() : 0) - (a.dateObj ? a.dateObj.getTime() : 0));

  const estimateProposalCost = (prop) => {
    const matched = products.find((p) => p.id === prop.productId || p.sku === prop.sku);
    const unitCost =
      Number(matched?.costPrice) ||
      Number(prop.costPrice) ||
      Math.round((Number(matched?.unitPrice || prop.unitPrice) || 150000) * 0.65);
    return (Number(prop.suggestedQuantity) || 0) * unitCost;
  };

  const fulfilledProposals = reorderProposals.filter(
    (p) => p.status === 'APPROVED' || p.status === 'COMPLETED'
  );
  const pendingBudgetTotal = draftProposals.reduce((sum, prop) => sum + estimateProposalCost(prop), 0);
  const approvedBudgetTotal = fulfilledProposals.reduce((sum, prop) => sum + estimateProposalCost(prop), 0);

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQ =
      !q ||
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q);
    return matchRole && matchQ;
  });

  const filteredProposals = reorderProposals.filter((p) => {
    if (proposalFilter === 'ALL') return true;
    if (proposalFilter === 'APPROVED') return p.status === 'APPROVED' || p.status === 'COMPLETED';
    return p.status === proposalFilter;
  });

  const getSupplierLinkedStats = (sup) => {
    const linked = products.filter(
      (p) =>
        (p.supplierId && p.supplierId === sup.id) ||
        (p.supplier?.id && p.supplier.id === sup.id) ||
        (p.supplierName && sup.name && p.supplierName.toLowerCase() === sup.name.toLowerCase())
    );
    const derivedCats = Array.from(new Set(linked.map((p) => p.category).filter(Boolean)));
    const explicitCats = String(sup.productCategories || '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && t !== 'Chưa gán sản phẩm');
    const categories = explicitCats.length > 0 ? explicitCats : derivedCats;
    return {
      skuCount: linked.length,
      stockUnits: linked.reduce((s, p) => s + (Number(p.currentStock) || 0), 0),
      categories: categories.length > 0 ? categories : ['Chưa gán sản phẩm'],
    };
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const q = supplierSearch.trim().toLowerCase();
    if (!q) return true;
    const stats = getSupplierLinkedStats(s);
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.contactPerson || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      stats.categories.join(', ').toLowerCase().includes(q)
    );
  });

  const uniqueSupplierCategories = Array.from(
    new Set(
      [
        ...products.map((p) => p.category).filter(Boolean),
        ...suppliers
          .flatMap((s) => String(s.productCategories || '').split(','))
          .map((c) => c.trim())
          .filter((c) => c && c !== 'Chưa gán sản phẩm'),
      ]
    )
  );

  // Merge live session Audit Logs with genuine timestamped MongoDB records so logs are 100% real
  const derivedDatabaseAuditLogs = [
    ...reorderProposals.slice(0, 12).map((prop) => {
      const d = parseDateValue(prop.updatedAt || prop.createdAt);
      const statusAction =
        prop.status === 'APPROVED' || prop.status === 'COMPLETED'
          ? 'Đã phê duyệt đề xuất nhập kho AI'
          : prop.status === 'REJECTED'
            ? 'Từ chối đề xuất nhập kho'
            : 'Hệ thống AI khởi tạo đề xuất nhập kho';
      return {
        id: `db-prop-${prop.id}`,
        sortTime: d ? d.getTime() : 0,
        time: d
          ? `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • ${formatDisplayDate(d)}`
          : prop.suggestedOrderDate || 'Hệ thống',
        category: 'INVENTORY',
        actor: prop.status === 'DRAFT' ? 'AI Forecasting Engine' : 'Quản trị Admin',
        action: statusAction,
        detail: `${prop.productName} (SKU: ${prop.sku}) — Đề xuất +${prop.suggestedQuantity} sp.`,
      };
    }),
    ...appointments.slice(0, 10).map((app) => {
      const d = parseDateValue(app.createdAt || app.rawAppointmentDate || app.appointmentDate);
      return {
        id: `db-app-${app.id}`,
        sortTime: d ? d.getTime() : 0,
        time: d
          ? `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • ${formatDisplayDate(d)}`
          : app.appointmentDate || 'Hệ thống',
        category: 'SYSTEM',
        actor: app.customerName || 'Khách hàng',
        action: `Lịch hẹn dịch vụ (${APPOINTMENT_STATUS_LABELS[app.status] || app.status})`,
        detail: `${app.serviceName} cho bé "${app.petName}" — ${formatVnd(app.price ?? app.totalPrice)}.`,
      };
    }),
    ...orders.slice(0, 10).map((ord) => {
      const d = getOrderDate(ord);
      return {
        id: `db-ord-${ord.id}`,
        sortTime: d ? d.getTime() : 0,
        time: ord.date || (d ? formatDisplayDate(d) : 'Hệ thống'),
        category: 'INVENTORY',
        actor: ord.customerName || 'Khách mua hàng',
        action: `Đơn hàng Pet Shop (${ORDER_STATUS_LABELS[ord.status] || ord.status})`,
        detail: `Đơn #${String(ord.id).slice(-6)} — ${ord.items} (${formatVnd(ord.total ?? ord.totalAmount)}).`,
      };
    }),
    ...users.slice(0, 8).map((u) => {
      const d = parseDateValue(u.createdAt);
      return {
        id: `db-usr-${u.id}`,
        sortTime: d ? d.getTime() : 0,
        time: d ? formatDisplayDate(d) : u.createdAt || 'Hệ thống',
        category: 'ACCOUNT',
        actor: u.fullName || u.email,
        action: `Tài khoản ${ROLE_META[u.role]?.label || u.role} đang hoạt động`,
        detail: `Email/SĐT: ${u.email} • Trạng thái: ${u.status === 'LOCKED' ? 'Đang khóa' : 'Hoạt động'}.`,
      };
    }),
  ].sort((a, b) => b.sortTime - a.sortTime);

  const combinedAuditLogs = [
    ...auditLogs.map((l) => ({
      ...l,
      sortTime: parseDateValue(l.createdAt)?.getTime() || Date.now(),
    })),
    ...derivedDatabaseAuditLogs,
  ];

  const filteredAuditLogs = combinedAuditLogs.filter((log) =>
    auditFilter === 'ALL' ? true : log.category === auditFilter
  );

  const todayLabel = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const zScoreValue =
    systemConfig.aiConfidenceLevel === '99'
      ? '2.33'
      : systemConfig.aiConfidenceLevel === '90'
        ? '1.28'
        : '1.65';

  // Handlers: Executive & Detailed CSV Reports Export (100% Real Data)
  const handleExportReportCSV = () => {
    const rows = [
      ['Chi So He Thong Thuc Te', 'Gia Tri'],
      ['Ky Thong Ke', activePeriodMeta.label],
      ['Doanh Thu Thuc Te Trong Ky (VND)', periodTotalRevenue],
      ['Doanh Thu Dich Vu Spa & Thu Y (VND)', periodServiceRevenue],
      ['Doanh Thu Ban Le Pet Shop (VND)', periodOrderRevenue],
      ['Tong Doanh Thu Luy Ke He Thong (VND)', totalRevenue],
      ['Dinh Gia Ban Le Hang Ton Kho (VND)', inventoryRetailValue],
      ['Tong Gia Von Hang Ton Kho (VND)', inventoryCostValue],
      ['Bien Loi Nhuan Gop Kho Du Kien (%)', estimatedMarginPct.toFixed(1)],
      ['Tong So SKU San Pham', products.length],
      ['Tong Don Vi Ton Kho', totalInventoryUnits],
      ['San Pham Cham Nguong Canh Bao', lowStockProducts.length],
      ['Tong Goi Dich Vu Cham Soc', services.length],
      ['Tong Tai Khoan Nguoi Dung', users.length],
      ['Tong Ho So Thu Cung', pets.length],
      ['Tong Lich Hen Dich Vu', appointments.length],
      ['Tong Don Hang Pet Shop', orders.length],
      ['Diem Danh Gia Trung Binh', reviews.length > 0 ? avgRating.toFixed(2) : 'Chua co'],
      ['De Xuat Nhap Hang Cho Duyet', draftProposals.length],
      ['Ngan Sach De Xuat Cho Duyet (VND)', pendingBudgetTotal],
      ['Nha Cung Cap Doi Tac', suppliers.length],
    ];
    downloadCsv(`Petzera_BaoCao_TongHop_ThucTe_${new Date().toISOString().split('T')[0]}.csv`, rows);
    if (onAddAuditLog) {
      onAddAuditLog('SYSTEM', 'Xuất báo cáo tổng hợp thực tế', 'Đã xuất file CSV tổng hợp toàn bộ số liệu thực tế từ hệ thống.');
    }
    toast.success('Đã xuất file báo cáo tổng hợp thực tế CSV thành công!', 'Thống Kê & Báo Cáo');
  };

  const handleExportDetailedReportCSV = () => {
    if (reportTableMode === 'INVENTORY') {
      const header = ['Ma SKU', 'Ten San Pham', 'Danh Muc', 'Nha Cung Cap', 'Ton Kho', 'Gia Von (VND)', 'Gia Ban Le (VND)', 'Tong Gia Tri Ban Le (VND)', 'Bien Gop (%)'];
      const bodyRows = products.map((p) => {
        const stock = Number(p.currentStock) || 0;
        const retail = Number(p.unitPrice) || 0;
        const cost = Number(p.costPrice) || Math.round(retail * 0.65);
        const margin = retail > 0 ? (((retail - cost) / retail) * 100).toFixed(1) : '0.0';
        return [p.sku, p.name, p.category || '', p.supplierName || '', stock, cost, retail, stock * retail, margin];
      });
      downloadCsv(`Petzera_DinhGia_TonKho_SKU_${new Date().toISOString().split('T')[0]}.csv`, [header, ...bodyRows]);
      toast.success('Đã xuất bảng định giá & biên lợi nhuận từng SKU thành công!', 'Thống Kê & Báo Cáo');
      return;
    }

    const header = ['Ma Giao Dich', 'Phan Loai', 'Ngay Gio', 'Khach Hang', 'Noi Dung Chi Tiet', 'Trang Thai', 'Gia Tri (VND)'];
    const bodyRows = transactionLedgerRows.map((tx) => [
      tx.code,
      tx.typeLabel,
      tx.dateDisplay,
      tx.customerName,
      tx.summary,
      tx.statusLabel,
      tx.amount,
    ]);
    downloadCsv(`Petzera_SoGiaoDich_ThucTe_${reportPeriod}_${new Date().toISOString().split('T')[0]}.csv`, [header, ...bodyRows]);
    if (onAddAuditLog) {
      onAddAuditLog('SYSTEM', 'Xuất sổ giao dịch chi tiết CSV', `Xuất ${transactionLedgerRows.length} giao dịch thực tế (${activePeriodMeta.label}).`);
    }
    toast.success(`Đã xuất sổ giao dịch chi tiết (${activePeriodMeta.label})!`, 'Thống Kê & Báo Cáo');
  };

  // Handlers: Accounts
  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({ fullName: '', email: '', phone: '', role: 'CARE_STAFF', password: '' });
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
      if (!userForm.password.trim()) {
        toast.warning('Vui lòng nhập mật khẩu khởi tạo cho tài khoản mới!', 'Thiếu Mật Khẩu');
        return;
      }
      if (onAddUser) {
        const created = await onAddUser({
          fullName: userForm.fullName.trim(),
          email: userForm.email.trim(),
          phone: userForm.phone.trim(),
          role: userForm.role,
          password: userForm.password
        });
        if (!created) return;
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

  // ==================== CATALOG: INVENTORY & SERVICES COMPUTED + HANDLERS ====================
  const outOfStockProducts = products.filter(p => (Number(p.currentStock) || 0) <= 0);
  const safeStockProducts = products.filter(p => (Number(p.currentStock) || 0) > (Number(p.minStockLevel) || 0));
  const avgServicePrice = services.length > 0
    ? Math.round(services.reduce((s, svc) => s + (Number(svc.price) || 0), 0) / services.length)
    : 0;

  const allProductCategories = Array.from(
    new Set([...STANDARD_PRODUCT_CATEGORIES, ...products.map(p => p.category).filter(Boolean)])
  );

  const filteredCatalogProducts = products
    .filter(p => {
      const stock = Number(p.currentStock) || 0;
      const min = Number(p.minStockLevel) || 0;
      if (catalogProdStockFilter === 'LOW' && stock > min) return false;
      if (catalogProdStockFilter === 'OUT' && stock > 0) return false;
      if (catalogProdStockFilter === 'SAFE' && stock <= min) return false;
      if (catalogProdCatFilter !== 'ALL' && p.category !== catalogProdCatFilter) return false;
      const q = catalogProdSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        String(p.name || '').toLowerCase().includes(q) ||
        String(p.sku || '').toLowerCase().includes(q) ||
        String(p.category || '').toLowerCase().includes(q) ||
        String(p.supplierName || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (catalogProdSort === 'STOCK_ASC') return (Number(a.currentStock) || 0) - (Number(b.currentStock) || 0);
      if (catalogProdSort === 'STOCK_DESC') return (Number(b.currentStock) || 0) - (Number(a.currentStock) || 0);
      if (catalogProdSort === 'PRICE_DESC') return (Number(b.unitPrice) || 0) - (Number(a.unitPrice) || 0);
      if (catalogProdSort === 'PRICE_ASC') return (Number(a.unitPrice) || 0) - (Number(b.unitPrice) || 0);
      return 0;
    });

  const filteredCatalogServices = services
    .filter(s => {
      if (catalogSvcCatFilter !== 'ALL' && s.category !== catalogSvcCatFilter) return false;
      const q = catalogSvcSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        String(s.name || '').toLowerCase().includes(q) ||
        String(s.description || '').toLowerCase().includes(q) ||
        String(s.category || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (catalogSvcSort === 'PRICE_ASC') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (catalogSvcSort === 'PRICE_DESC') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (catalogSvcSort === 'DURATION_ASC') return (Number(a.durationMinutes) || 0) - (Number(b.durationMinutes) || 0);
      return 0;
    });

  const openCreateAdminProduct = () => {
    setEditingAdminProduct(null);
    setAdminProductForm({
      name: '',
      sku: '',
      category: 'Thức ăn',
      unitPrice: 150000,
      costPrice: 100000,
      currentStock: 20,
      minStockLevel: 10,
      maxStockLevel: 100,
      supplierName: suppliers[0]?.name || 'Royal Canin Việt Nam',
    });
    setShowAdminProductModal(true);
  };

  const openEditAdminProduct = (prod) => {
    setEditingAdminProduct(prod);
    setAdminProductForm({
      name: prod.name || '',
      sku: prod.sku || '',
      category: prod.category || 'Thức ăn',
      unitPrice: Number(prod.unitPrice) || 0,
      costPrice: Number(prod.costPrice) || Math.round((Number(prod.unitPrice) || 0) * 0.65),
      currentStock: Number(prod.currentStock) || 0,
      minStockLevel: Number(prod.minStockLevel) || 10,
      maxStockLevel: Number(prod.maxStockLevel) || 100,
      supplierName: prod.supplierName || suppliers[0]?.name || 'Royal Canin Việt Nam',
    });
    setShowAdminProductModal(true);
  };

  const handleSaveAdminProduct = async (e) => {
    e.preventDefault();
    if (!adminProductForm.name.trim()) {
      toast.warning('Vui lòng nhập tên sản phẩm!', 'Thiếu Thông Tin');
      return;
    }
    if (editingAdminProduct) {
      if (onUpdateProduct) await onUpdateProduct(editingAdminProduct.id, adminProductForm);
    } else {
      if (onAddProduct) await onAddProduct(adminProductForm);
    }
    setShowAdminProductModal(false);
    setEditingAdminProduct(null);
  };

  const handleDeleteAdminProduct = async (prod) => {
    const ok = await confirmModal(
      `Bạn có chắc chắn muốn xóa sản phẩm "${prod.name}" (SKU: ${prod.sku}) khỏi kho hàng?`,
      'Xác Nhận Xóa Sản Phẩm',
      { type: 'danger', confirmText: 'Xóa Sản Phẩm', cancelText: 'Hủy' }
    );
    if (ok && onDeleteProduct) {
      await onDeleteProduct(prod.id);
    }
  };

  const openAdminStockModal = (prod, defaultType = 'IN') => {
    setStockModalProduct(prod);
    setAdminStockForm({
      type: defaultType,
      quantity: defaultType === 'ADJUSTMENT' ? (Number(prod.currentStock) || 0) : 10,
      minStockLevel: Number(prod.minStockLevel) || 10,
      maxStockLevel: Number(prod.maxStockLevel) || 100,
      note: '',
    });
  };

  const handleSubmitAdminStock = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    const rawQty = parseInt(adminStockForm.quantity, 10);
    if (Number.isNaN(rawQty) || rawQty < 0) {
      toast.warning('Số lượng không hợp lệ (không được nhỏ hơn 0)!', 'Giao Dịch Kho');
      return;
    }
    if ((adminStockForm.type === 'IN' || adminStockForm.type === 'OUT') && rawQty <= 0) {
      toast.warning('Số lượng Nhập / Xuất kho phải lớn hơn 0!', 'Giao Dịch Kho');
      return;
    }
    if (adminStockForm.type === 'OUT' && rawQty > (Number(stockModalProduct.currentStock) || 0)) {
      toast.error(
        `Số lượng xuất (${rawQty}) vượt quá tồn kho hiện tại (${stockModalProduct.currentStock} sp)!`,
        'Không Đủ Tồn Kho'
      );
      return;
    }
    const thresholds = adminStockForm.type === 'ADJUSTMENT'
      ? {
          minStockLevel: Math.max(0, parseInt(adminStockForm.minStockLevel, 10) || 0),
          maxStockLevel: Math.max(1, parseInt(adminStockForm.maxStockLevel, 10) || 100),
        }
      : {};
    if (onUpdateStock) {
      await onUpdateStock(stockModalProduct.id, adminStockForm.type, rawQty, adminStockForm.note, thresholds);
    }
    setStockModalProduct(null);
  };

  const handleQuickCreateProposalFromAdmin = (prod) => {
    if (!onCreateProposal) return;
    const suggestedQty = Math.max(15, (Number(prod.maxStockLevel) || 80) - (Number(prod.currentStock) || 0));
    onCreateProposal({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      currentStock: prod.currentStock,
      minStockLevel: prod.minStockLevel,
      suggestedQuantity: suggestedQty,
      suggestedSupplier: prod.supplierName || suppliers[0]?.name || 'Royal Canin Việt Nam',
      reason: `Đề xuất nhập bổ sung trực tiếp từ Admin (${currentUser?.fullName || 'Admin'}): Tồn hiện tại ${prod.currentStock} sp (ngưỡng tối thiểu ${prod.minStockLevel} sp).`,
    });
  };

  const openCreateAdminService = () => {
    setEditingAdminService(null);
    setAdminServiceForm({
      name: '',
      category: 'Spa & Grooming',
      durationMinutes: 45,
      price: 200000,
      description: '',
    });
    setShowAdminServiceModal(true);
  };

  const openEditAdminService = (svc) => {
    setEditingAdminService(svc);
    setAdminServiceForm({
      name: svc.name || '',
      category: svc.category || 'Spa & Grooming',
      durationMinutes: Number(svc.durationMinutes) || 45,
      price: Number(svc.price) || 200000,
      description: svc.description || '',
    });
    setShowAdminServiceModal(true);
  };

  const handleSaveAdminService = async (e) => {
    e.preventDefault();
    if (!adminServiceForm.name.trim()) {
      toast.warning('Vui lòng nhập tên gói dịch vụ!', 'Thiếu Thông Tin');
      return;
    }
    const payload = {
      name: adminServiceForm.name.trim(),
      category: adminServiceForm.category || 'Spa & Grooming',
      durationMinutes: Math.max(5, parseInt(adminServiceForm.durationMinutes, 10) || 45),
      price: Math.max(0, parseFloat(adminServiceForm.price) || 0),
      description: adminServiceForm.description.trim(),
    };
    if (editingAdminService) {
      if (onUpdateService) await onUpdateService(editingAdminService.id, payload);
      if (onAddAuditLog) {
        onAddAuditLog('SYSTEM', 'Cập nhật dịch vụ chăm sóc', `Cập nhật gói "${payload.name}" (${payload.category}, ${payload.price.toLocaleString('vi-VN')}đ).`);
      }
      toast.success(`Đã cập nhật dịch vụ "${payload.name}"!`, 'Quản Lý Dịch Vụ');
    } else {
      if (onAddService) await onAddService(payload);
      if (onAddAuditLog) {
        onAddAuditLog('SYSTEM', 'Thêm gói dịch vụ mới', `Thêm mới "${payload.name}" (${payload.category}, ${payload.price.toLocaleString('vi-VN')}đ).`);
      }
      toast.success(`Đã thêm gói dịch vụ mới "${payload.name}"!`, 'Quản Lý Dịch Vụ');
    }
    setShowAdminServiceModal(false);
    setEditingAdminService(null);
  };

  const handleDeleteAdminService = async (svc) => {
    const ok = await confirmModal(
      `Bạn có chắc chắn muốn xóa gói dịch vụ "${svc.name}" khỏi danh mục hệ thống?`,
      'Xác Nhận Xóa Dịch Vụ',
      { type: 'danger', confirmText: 'Xóa Dịch Vụ', cancelText: 'Hủy' }
    );
    if (ok && onDeleteService) {
      await onDeleteService(svc.id);
      if (onAddAuditLog) {
        onAddAuditLog('SYSTEM', 'Xóa dịch vụ chăm sóc', `Đã xóa gói dịch vụ "${svc.name}".`);
      }
      toast.info(`Đã xóa gói dịch vụ "${svc.name}".`, 'Quản Lý Dịch Vụ');
    }
  };

  const handleExportInventoryCSV = () => {
    const header = ['SKU', 'Ten San Pham', 'Danh Muc', 'Nha Cung Cap', 'Gia Von (VND)', 'Gia Ban Le (VND)', 'Ton Hien Tai', 'Min Stock', 'Max Stock', 'Trang Thai'];
    const rows = products.map(p => {
      const stock = Number(p.currentStock) || 0;
      const min = Number(p.minStockLevel) || 0;
      const status = stock <= 0 ? 'Het hang' : stock <= min ? 'Can nhap them' : 'An toan';
      return [
        p.sku,
        `"${String(p.name || '').replace(/"/g, '""')}"`,
        `"${p.category || ''}"`,
        `"${p.supplierName || 'Petzera'}"`,
        Number(p.costPrice) || Math.round((Number(p.unitPrice) || 0) * 0.65),
        Number(p.unitPrice) || 0,
        stock,
        min,
        Number(p.maxStockLevel) || 100,
        status,
      ];
    });
    const csvContent = '\uFEFF' + [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Petzera_DanhMuc_TonKho_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Đã xuất bảng kiểm kê tồn kho & sản phẩm CSV!', 'Quản Lý Kho & Dịch Vụ');
  };

  const handleExportServicesCSV = () => {
    const header = ['Ten Goi Dich Vu', 'Chuyen Muc', 'Thoi Luong (Phut)', 'Gia Niem Yet (VND)', 'Mo Ta'];
    const rows = services.map(s => [
      `"${String(s.name || '').replace(/"/g, '""')}"`,
      `"${s.category || ''}"`,
      Number(s.durationMinutes) || 45,
      Number(s.price) || 0,
      `"${String(s.description || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Petzera_BangGia_DichVu_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Đã xuất bảng giá danh mục dịch vụ CSV!', 'Quản Lý Kho & Dịch Vụ');
  };

  return (
    <div className="admin-view animate-fade-in">

      {/* ==================== 1. TỔNG QUAN HỆ THỐNG (TRANG CHỦ ADMIN) ==================== */}
      {currentTab === 'overview' && (
        <>
          {/* Executive Admin Home Hero Banner */}
          <section className="admin-hero-header">
            <div className="admin-hero-content">
              <div className="admin-hero-eyebrow">
                <Sparkles size={12} />
                <span>TRANG CHỦ QUẢN TRỊ PETZERA • {todayLabel}</span>
              </div>
              <h1 className="admin-hero-title">
                Xin chào, {currentUser?.fullName || 'Quản Trị Viên'}
              </h1>
              <p className="admin-hero-sub">
                Bức tranh tổng thể toàn bộ hệ sinh thái Petzera — kết nối khách hàng, hồ sơ thú cưng, dịch vụ Spa &amp; Thú y, cửa hàng Pet Shop, nhân sự phân quyền RBAC và kho hàng AI.
              </p>
            </div>

            <div className="admin-hero-actions">
              {draftProposals.length > 0 && (
                <button
                  type="button"
                  className="btn admin-btn-ghost-dark"
                  onClick={() => onTabChange && onTabChange('approve-proposals')}
                >
                  <CheckSquare size={16} />
                  <span>Duyệt {draftProposals.length} đề xuất</span>
                </button>
              )}
              <button
                type="button"
                className="btn btn-coral"
                onClick={() => onTabChange && onTabChange('reports-admin')}
              >
                <BarChart3 size={16} />
                <span>Xem Thống Kê &amp; Báo Cáo</span>
              </button>
            </div>
          </section>

          {/* 4 System-Wide Snapshot Tiles */}
          <div className="admin-kpi-grid">
            <div
              className="admin-kpi-card is-clickable"
              onClick={() => onTabChange && onTabChange('accounts-admin')}
            >
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Người Dùng &amp; Nhân Sự</div>
                  <div className="admin-kpi-value" style={{ marginTop: '0.4rem' }}>
                    {users.length}
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#64748b', marginLeft: '6px' }}>tài khoản</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                  <Users size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span><strong>{customerCount}</strong> khách • <strong>{internalCount}</strong> nội bộ</span>
                <span style={{ color: '#6d28d9', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  Quản lý <ArrowRight size={12} />
                </span>
              </div>
            </div>

            <div
              className="admin-kpi-card is-clickable"
              onClick={() => {
                setCatalogSubTab('services');
                onTabChange && onTabChange('catalog-admin');
              }}
            >
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Dịch Vụ &amp; Lịch Hẹn</div>
                  <div className="admin-kpi-value" style={{ color: '#0284c7', marginTop: '0.4rem' }}>
                    {appointments.length}
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#64748b', marginLeft: '6px' }}>ca hẹn</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                  <Calendar size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span><strong>{services.length}</strong> gói dịch vụ (3 chuyên mục)</span>
                <span style={{ color: '#0284c7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  Xem dịch vụ <ArrowRight size={12} />
                </span>
              </div>
            </div>

            <div
              className="admin-kpi-card is-clickable"
              onClick={() => {
                setCatalogSubTab('products');
                onTabChange && onTabChange('catalog-admin');
              }}
            >
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Pet Shop &amp; Tồn Kho</div>
                  <div className="admin-kpi-value" style={{ color: '#059669', marginTop: '0.4rem' }}>
                    {products.length}
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#64748b', marginLeft: '6px' }}>sản phẩm</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <Package size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span><strong>{orders.length}</strong> đơn hàng • <strong>{totalInventoryUnits}</strong> tồn kho</span>
                <span style={{ color: lowStockProducts.length > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>
                  {lowStockProducts.length} cảnh báo
                </span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Thú Cưng &amp; Hài Lòng</div>
                  <div className="admin-kpi-value" style={{ color: '#d97706', marginTop: '0.4rem' }}>
                    {reviews.length > 0 ? avgRating.toFixed(1) : '—'}
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b', marginLeft: '4px' }}>★</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginLeft: '6px' }}>({reviews.length})</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
                  <PawPrint size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span><strong>{pets.length}</strong> hồ sơ thú cưng ({dogCount} chó, {catCount} mèo)</span>
              </div>
            </div>
          </div>

          {/* System Modules Directory Hub (All 7 Functional Domains of Petzera) */}
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="admin-panel-title">
                  <LayoutDashboard size={18} color="#4f46e5" />
                  <span>Bản Đồ Các Phân Hệ Quản Trị</span>
                </div>
                <div className="admin-panel-sub">
                  Truy cập nhanh và theo dõi trạng thái thời gian thực của toàn bộ các phân hệ thuộc quyền Admin
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                Đồng bộ tự động từ MongoDB
              </span>
            </div>

            <div className="admin-panel-body">
              <div className="admin-module-grid">
                {[
                  {
                    tab: 'reports-admin',
                    title: 'Thống Kê & Báo Cáo',
                    desc: `Doanh thu thực tế ${formatVnd(totalRevenue)} (${totalTransactionsCount} GD) • Định giá kho ${formatCompactVnd(inventoryRetailValue)} đ.`,
                    metric: totalRevenue > 0 ? `${spaSharePct}% Spa / ${shopSharePct}% Shop` : `${products.length} SKU • ${services.length} DV`,
                    cta: 'Mở báo cáo',
                    icon: BarChart3,
                    color: '#4f46e5',
                    soft: '#eef2ff',
                    border: '#c7d2fe',
                  },
                  {
                    tab: 'catalog-admin',
                    title: 'Quản Lý Kho & Dịch Vụ',
                    desc: `Quản trị ${products.length} sản phẩm tồn kho (${totalInventoryUnits.toLocaleString('vi-VN')} đv) và ${services.length} gói dịch vụ chăm sóc & thú y.`,
                    metric: lowStockProducts.length > 0 ? `${lowStockProducts.length} SP cảnh báo tồn` : 'Kho & Dịch vụ ổn định',
                    cta: 'Quản lý danh mục',
                    icon: Package,
                    color: '#0d9488',
                    soft: '#f0fdfa',
                    border: '#99f6e4',
                  },
                  {
                    tab: 'accounts-admin',
                    title: 'Quản Lý Tài Khoản',
                    desc: `${adminCount} Admin, ${careStaffCount} Nhân viên, ${warehouseStaffCount} Quản lý kho & ${customerCount} Khách hàng.`,
                    metric: lockedCount > 0 ? `${lockedCount} TK bị khóa` : '100% đang hoạt động',
                    cta: 'Quản lý TK',
                    icon: Users,
                    color: '#0284c7',
                    soft: '#f0f9ff',
                    border: '#bae6fd',
                  },
                  {
                    tab: 'roles-admin',
                    title: 'Phân Quyền Người Dùng (RBAC)',
                    desc: `Kiểm soát ${rbacMatrix.length} Use Case phân tách chặt chẽ cổng Khách hàng & Cổng nội bộ.`,
                    metric: '4 vai trò chuẩn hóa',
                    cta: 'Cấu hình RBAC',
                    icon: Shield,
                    color: '#6d28d9',
                    soft: '#f5f3ff',
                    border: '#ddd6fe',
                  },
                  {
                    tab: 'approve-proposals',
                    title: 'Phê Duyệt Nhập Hàng AI',
                    desc: `Ngân sách chờ duyệt: ${formatVnd(pendingBudgetTotal)} • Đã duyệt nhập kho: ${fulfilledProposals.length} phiếu.`,
                    metric: draftProposals.length > 0 ? `${draftProposals.length} phiếu chờ duyệt` : 'Không có tồn đọng',
                    cta: 'Thẩm định',
                    icon: CheckSquare,
                    color: '#ea580c',
                    soft: '#fff7ed',
                    border: '#fed7aa',
                  },
                  {
                    tab: 'suppliers-admin',
                    title: 'Quản Lý Nhà Cung Cấp',
                    desc: `${suppliers.length} đối tác chính hãng cung ứng ${uniqueSupplierCategories.length} nhóm hàng cho Pet Shop & Spa.`,
                    metric: `Lead-time ${systemConfig.defaultLeadTimeDays} ngày`,
                    cta: 'Danh mục NCC',
                    icon: Building2,
                    color: '#059669',
                    soft: '#ecfdf5',
                    border: '#a7f3d0',
                  },
                  {
                    tab: 'system-settings',
                    title: 'Cấu Hình & Nhật Ký Hệ Thống',
                    desc: `AI tin cậy ${systemConfig.aiConfidenceLevel}% (Z=${zScoreValue}) • Freeship từ ${Number(systemConfig.freeShipThreshold).toLocaleString('vi-VN')}đ.`,
                    metric: `${combinedAuditLogs.length} bản ghi Audit`,
                    cta: 'Thiết lập',
                    icon: Settings,
                    color: '#334155',
                    soft: '#f1f5f9',
                    border: '#cbd5e1',
                  },
                ].map(mod => {
                  const ModIcon = mod.icon;
                  return (
                    <button
                      key={mod.tab}
                      type="button"
                      className="admin-module-card"
                      onClick={() => onTabChange && onTabChange(mod.tab)}
                    >
                      <div className="admin-module-card-head">
                        <div style={{ minWidth: 0 }}>
                          <div className="admin-module-card-title">{mod.title}</div>
                          <div className="admin-module-card-desc">{mod.desc}</div>
                        </div>
                        <div
                          className="admin-kpi-icon-box"
                          style={{ background: mod.soft, color: mod.color, border: `1px solid ${mod.border}` }}
                        >
                          <ModIcon size={18} />
                        </div>
                      </div>
                      <div className="admin-module-card-foot">
                        <span style={{ color: '#475569' }}>{mod.metric}</span>
                        <span style={{ color: mod.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {mod.cta} <ArrowRight size={13} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live System Feed (Appointments / Orders / Reviews) + Action Center */}
          <div className="admin-grid-analytics">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Activity size={18} color="#0284c7" />
                    <span>Dữ Liệu Hoạt Động Toàn Cửa Hàng</span>
                  </div>
                  <div className="admin-panel-sub">
                    Theo dõi nhanh lịch hẹn dịch vụ, đơn hàng bán lẻ và đánh giá mới nhất từ khách hàng
                  </div>
                </div>
                <div className="admin-pill-group">
                  {[
                    { id: 'appointments', label: 'Lịch hẹn', count: appointments.length },
                    { id: 'orders', label: 'Đơn hàng', count: orders.length },
                    { id: 'reviews', label: 'Đánh giá', count: reviews.length },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`admin-pill-btn${overviewFeedTab === tab.id ? ' is-active' : ''}`}
                      onClick={() => setOverviewFeedTab(tab.id)}
                    >
                      <span>{tab.label}</span>
                      <span className="admin-pill-count">{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {overviewFeedTab === 'appointments' && (
                  appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.84rem' }}>
                      Chưa có lịch hẹn dịch vụ nào trong hệ thống.
                    </div>
                  ) : (
                    appointments.slice(0, 4).map(app => (
                      <div key={app.id} className="admin-feed-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                          <div className="admin-kpi-icon-box" style={{ width: 38, height: 38, background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                            <Calendar size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {app.serviceName || app.service?.name || 'Dịch vụ chăm sóc'} — {app.petName || app.pet?.name || 'Thú cưng'}
                            </strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                              Khách: <strong style={{ color: '#334155' }}>{app.customerName || 'Khách hàng'}</strong> • {app.appointmentDate} ({app.timeSlot})
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                            {(Number(app.price ?? app.totalPrice) || 0).toLocaleString('vi-VN')} đ
                          </div>
                          <span
                            className={`badge ${app.status === 'COMPLETED' ? 'badge-success' : app.status === 'CANCELLED' ? 'badge-danger' : app.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-pending'}`}
                            style={{ fontSize: '0.68rem', padding: '2px 7px', marginTop: '3px' }}
                          >
                            {app.status === 'COMPLETED' ? 'Hoàn thành' : app.status === 'IN_PROGRESS' ? 'Đang thực hiện' : app.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ tiếp nhận'}
                          </span>
                        </div>
                      </div>
                    ))
                  )
                )}

                {overviewFeedTab === 'orders' && (
                  orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.84rem' }}>
                      Chưa có đơn hàng Pet Shop nào.
                    </div>
                  ) : (
                    orders.slice(0, 4).map(ord => (
                      <div key={ord.id} className="admin-feed-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                          <div className="admin-kpi-icon-box" style={{ width: 38, height: 38, background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>
                            <ShoppingBag size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              #{ord.id} • {ord.customerName || 'Khách mua hàng'}
                            </strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {ord.items || 'Sản phẩm Pet Shop'} • {ord.date || 'Hôm nay'}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#059669', fontVariantNumeric: 'tabular-nums' }}>
                            {(Number(ord.total ?? ord.totalAmount) || 0).toLocaleString('vi-VN')} đ
                          </div>
                          <span
                            className={`badge ${ord.status === 'COMPLETED' || ord.status === 'PAID' || ord.status === 'CONFIRMED' ? 'badge-success' : ord.status === 'CANCELLED' ? 'badge-danger' : 'badge-pending'}`}
                            style={{ fontSize: '0.68rem', padding: '2px 7px', marginTop: '3px' }}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )
                )}

                {overviewFeedTab === 'reviews' && (
                  reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.84rem' }}>
                      Chưa có đánh giá nào từ khách hàng.
                    </div>
                  ) : (
                    reviews.slice(0, 4).map(rev => (
                      <div key={rev.id} className="admin-feed-row">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', minWidth: 0 }}>
                          <div className="admin-kpi-icon-box" style={{ width: 38, height: 38, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
                            <Star size={16} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{rev.customerName}</strong>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b' }}>{'★'.repeat(Number(rev.rating) || 5)}</span>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• {rev.targetName}</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              “{rev.comment}”
                            </div>
                          </div>
                        </div>
                        <span className={`badge ${rev.staffReply ? 'badge-success' : 'badge-pending'}`} style={{ fontSize: '0.68rem', flexShrink: 0 }}>
                          {rev.staffReply ? 'Đã phản hồi' : 'Chờ phản hồi'}
                        </span>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

            {/* Action Center: Pending AI Proposals + Low Stock */}
            <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <CheckSquare size={17} color="#ea580c" />
                    <span>Cần Admin Phê Duyệt</span>
                    <span className="badge badge-pending" style={{ padding: '2px 8px' }}>{draftProposals.length}</span>
                  </div>
                  <div className="admin-panel-sub">Đề xuất nhập kho ưu tiên từ AI &amp; Quản lý kho</div>
                </div>
                <button
                  type="button"
                  className="admin-icon-action"
                  onClick={() => onTabChange && onTabChange('approve-proposals')}
                >
                  Tất cả <ArrowRight size={13} />
                </button>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {draftProposals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1rem', color: '#64748b' }}>
                    <CheckCircle2 size={30} color="#10b981" style={{ marginBottom: '0.45rem' }} />
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                      Tất cả đề xuất nhập hàng đã được xử lý!
                    </div>
                  </div>
                ) : (
                  draftProposals.slice(0, 3).map(prop => {
                    const matched = products.find(p => p.id === prop.productId || p.sku === prop.sku);
                    return (
                      <div key={prop.id} className="admin-feed-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                          <img
                            src={getProductImage(matched || { name: prop.productName, category: 'Thức ăn' })}
                            alt={prop.productName}
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                            style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'contain', background: '#ffffff', padding: '3px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prop.productName}
                            </strong>
                            <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                              <strong style={{ color: '#059669' }}>+{prop.suggestedQuantity} sp</strong> • <strong style={{ color: '#ea580c' }}>{estimateProposalCost(prop).toLocaleString('vi-VN')} đ</strong>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-emerald"
                          style={{ padding: '0.38rem 0.72rem', fontSize: '0.75rem', borderRadius: '9px', flexShrink: 0 }}
                          onClick={() => onApproveProposal && onApproveProposal(prop.id)}
                        >
                          <Check size={13} /> Duyệt
                        </button>
                      </div>
                    );
                  })
                )}

                {/* Quick System Health Strip inside Action Center */}
                <div style={{ marginTop: 'auto', padding: '0.8rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.76rem' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>
                    Khuyến mãi đang mở: <strong style={{ color: '#059669' }}>{promotions.filter(p => p.status === 'ACTIVE').length} mã</strong>
                  </span>
                  <span style={{ color: '#475569', fontWeight: 600 }}>
                    Đánh giá chờ trả lời: <strong style={{ color: unrepliedReviewsCount > 0 ? '#d97706' : '#059669' }}>{unrepliedReviewsCount}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ecosystem Content Overview + Recent Audit Logs */}
          <div className="admin-grid-2">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Layers size={17} color="#059669" />
                    <span>Tổng Quan Nội Dung Hệ Sinh Thái</span>
                  </div>
                  <div className="admin-panel-sub">Cơ cấu chuyên mục dịch vụ chuẩn hóa và ưu đãi hiện hành</div>
                </div>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
                  {serviceCategoryStats.map(cat => (
                    <div key={cat.category} className="admin-eco-box">
                      <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#64748b' }}>{cat.category}</div>
                      <div style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0f172a' }}>{cat.count} gói</div>
                      <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                        Giá TB: <strong>{cat.avgPrice.toLocaleString('vi-VN')}đ</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 800, color: '#334155', marginBottom: '0.55rem' }}>
                    <Tag size={14} color="#ea580c" /> Chương Trình Khuyến Mãi Đang Hoạt Động
                  </div>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {promotions.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Chưa có mã khuyến mãi nào.</span>
                    ) : (
                      promotions.map(promo => (
                        <span
                          key={promo.id}
                          className={`badge ${promo.status === 'ACTIVE' ? 'badge-coral' : 'badge-info'}`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {promo.code} (-{promo.discountPercent}%)
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Clock size={17} color="#6d28d9" />
                    <span>Nhật Ký Hoạt Động Gần Đây</span>
                  </div>
                  <div className="admin-panel-sub">Sự kiện thực tế từ cơ sở dữ liệu &amp; thao tác quản trị mới nhất</div>
                </div>
                <button
                  type="button"
                  className="admin-icon-action"
                  onClick={() => onTabChange && onTabChange('system-settings')}
                >
                  Chi tiết <ArrowRight size={13} />
                </button>
              </div>

              <div className="admin-panel-body">
                {combinedAuditLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.84rem' }}>
                    Chưa có hoạt động nào được ghi nhận.
                  </div>
                ) : (
                  <div className="admin-timeline">
                    {combinedAuditLogs.slice(0, 4).map(log => {
                      const meta = AUDIT_CATEGORY_META[log.category] || AUDIT_CATEGORY_META.SYSTEM;
                      return (
                        <div key={log.id} className="admin-timeline-item">
                          <span className="admin-timeline-dot" style={{ background: meta.dot, boxShadow: `0 0 0 3px ${meta.dot}22` }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                              <strong style={{ fontSize: '0.83rem', color: '#0f172a' }}>{log.action}</strong>
                              <span style={{ fontSize: '0.71rem', color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 600 }}>{log.time}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <span style={{ fontWeight: 700, color: '#334155' }}>{log.actor}</span> — {log.detail}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== 1B. THỐNG KÊ & BÁO CÁO HỆ THỐNG (100% LIVE MONGODB DATA) ==================== */}
      {currentTab === 'reports-admin' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)', color: '#ffffff' }}>
                <BarChart3 size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Thống Kê &amp; Báo Cáo Hệ Thống</h1>
                <p className="admin-page-subtitle">
                  Tổng hợp số liệu thực tế thời gian thực từ cơ sở dữ liệu MongoDB: doanh thu lịch hẹn &amp; đơn hàng, định giá tồn kho và hiệu suất vận hành
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={handleExportDetailedReportCSV}>
                <FileText size={15} /> Xuất Bảng Chi Tiết CSV
              </button>
              <button type="button" className="btn admin-btn-indigo" onClick={handleExportReportCSV}>
                <Download size={15} /> Xuất Báo Cáo Tổng Hợp CSV
              </button>
            </div>
          </div>

          {/* Real-Time Period Filter Bar */}
          <div className="admin-panel" style={{ padding: '0.75rem 1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Kỳ dữ liệu thực tế:</span>
                <div className="admin-pill-group">
                  {REPORT_PERIODS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setReportPeriod(p.id)}
                      className={`admin-pill-btn${reportPeriod === p.id ? ' is-active' : ''}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>
                ● Tự động cập nhật khi có đơn hàng, lịch hẹn hoặc biến động kho mới
              </span>
            </div>
          </div>

          {/* 4 Live Financial & Operational KPI Cards */}
          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Doanh Thu ({activePeriodMeta.label})</div>
                  <div className="admin-kpi-value" style={{ color: '#059669', marginTop: '0.35rem' }} title={formatVnd(periodTotalRevenue)}>
                    {periodTotalRevenue >= 10000000 ? `${formatCompactVnd(periodTotalRevenue)} đ` : formatVnd(periodTotalRevenue)}
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <DollarSign size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>TB giao dịch: <strong style={{ color: '#0f172a' }}>{formatVnd(periodAvgTxValue)}</strong></span>
                <span style={{ color: '#059669', fontWeight: 700 }}>{periodTxCount} GD</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Cơ Cấu Spa &amp; Pet Shop</div>
                  <div className="admin-kpi-value" style={{ color: '#4f46e5', marginTop: '0.35rem' }}>
                    {periodSpaPct}%
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', margin: '0 4px' }}>/</span>
                    <span style={{ color: '#059669' }}>{periodShopPct}%</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                  <TrendingUp size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Spa: <strong>{formatCompactVnd(periodServiceRevenue)}đ</strong> • Shop: <strong>{formatCompactVnd(periodOrderRevenue)}đ</strong></span>
                {periodGrowthPct !== null ? (
                  <span style={{ color: periodGrowthPct >= 0 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                    {periodGrowthPct >= 0 ? '+' : ''}{periodGrowthPct.toFixed(1)}%
                  </span>
                ) : (
                  <span style={{ color: '#64748b', fontWeight: 700 }}>{periodUnitsSold} SP bán</span>
                )}
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Định Giá Hàng Tồn Kho</div>
                  <div className="admin-kpi-value" style={{ color: '#0284c7', marginTop: '0.35rem' }} title={formatVnd(inventoryRetailValue)}>
                    {formatCompactVnd(inventoryRetailValue)} đ
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                  <Package size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Giá vốn: <strong>{formatCompactVnd(inventoryCostValue)} đ</strong></span>
                <span style={{ color: '#059669', fontWeight: 800 }}>Biên ~{estimatedMarginPct.toFixed(1)}%</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Hiệu Suất &amp; Đánh Giá</div>
                  <div className="admin-kpi-value" style={{ color: '#d97706', marginTop: '0.35rem' }}>
                    {reviews.length > 0 ? `${avgRating.toFixed(1)} / 5.0 ★` : 'Chưa có ★'}
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
                  <Star size={19} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Hoàn thành lịch hẹn: <strong>{completedRate}%</strong></span>
                <span>{reviews.length} đánh giá</span>
              </div>
            </div>
          </div>

          {/* Interactive Real-Data Revenue & Category Valuation Chart */}
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="admin-panel-title">
                  <TrendingUp size={18} color="#4f46e5" />
                  <span>
                    {reportChartMode === 'TIME'
                      ? `Biểu Đồ Doanh Thu Thực Tế Theo Thời Gian (${activePeriodMeta.label})`
                      : 'Biểu Đồ Định Giá Tồn Kho & Doanh Thu Theo Danh Mục Thực Tế'}
                  </span>
                </div>
                <div className="admin-panel-sub">
                  {reportChartMode === 'TIME'
                    ? 'Tổng hợp trực tiếp từ lịch hẹn dịch vụ và đơn hàng thực tế đã phát sinh trong cơ sở dữ liệu'
                    : 'Đối chiếu giá vốn / giá trị bán lẻ tồn kho các nhóm sản phẩm và quy mô từng chuyên mục dịch vụ'}
                </div>
              </div>

              <div className="admin-pill-group">
                <button
                  type="button"
                  onClick={() => setReportChartMode('TIME')}
                  className={`admin-pill-btn${reportChartMode === 'TIME' ? ' is-active' : ''}`}
                >
                  Theo thời gian thực tế
                </button>
                <button
                  type="button"
                  onClick={() => setReportChartMode('CATEGORY')}
                  className={`admin-pill-btn${reportChartMode === 'CATEGORY' ? ' is-active' : ''}`}
                >
                  Theo danh mục kho &amp; DV
                </button>
              </div>
            </div>

            <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '4px 10px', borderRadius: '999px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '2px', background: '#4f46e5' }} />
                    {reportChartMode === 'TIME' ? 'Dịch vụ Spa & Thú y' : 'Giá vốn kho / Doanh thu DV'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '2px', background: '#059669' }} />
                    {reportChartMode === 'TIME' ? 'Bán lẻ Pet Shop' : 'Giá trị bán lẻ kho / Niêm yết DV'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>Giao dịch kỳ này: <strong style={{ color: '#0f172a' }}>{periodTxCount} GD ({periodUnitsSold} SP bán lẻ)</strong></span>
                  {reportChartMode === 'TIME' && peakTimeRow && (
                    <span>
                      Mốc cao nhất: <strong style={{ color: '#4f46e5' }}>{peakTimeRow.label} ({formatVnd(peakTimeRow.total)})</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="admin-report-chart-frame">
                <div className="admin-chart-gridlines">
                  <div className="admin-chart-gridline"><span>{formatCompactVnd(chartMaxVal)}</span></div>
                  <div className="admin-chart-gridline"><span>{formatCompactVnd(chartMaxVal * 0.75)}</span></div>
                  <div className="admin-chart-gridline"><span>{formatCompactVnd(chartMaxVal * 0.5)}</span></div>
                  <div className="admin-chart-gridline"><span>{formatCompactVnd(chartMaxVal * 0.25)}</span></div>
                  <div className="admin-chart-gridline"><span>0</span></div>
                </div>

                {activeChartRows.map((bar) => {
                  const pPct = bar.primaryValue > 0 ? Math.max(5, Math.round((bar.primaryValue / chartMaxVal) * 100)) : 2;
                  const sPct = bar.secondaryValue > 0 ? Math.max(5, Math.round((bar.secondaryValue / chartMaxVal) * 100)) : 2;
                  return (
                    <div key={bar.key} className="admin-chart-col">
                      <div className="admin-chart-bars">
                        <div
                          className="admin-chart-bar admin-chart-bar-spa"
                          style={{ height: `${pPct}%`, opacity: bar.primaryValue > 0 ? 1 : 0.28 }}
                        >
                          <span className="admin-chart-bar-tip">
                            {reportChartMode === 'TIME' ? 'Spa' : 'Vốn/Thu'}: {formatVnd(bar.primaryValue)}
                          </span>
                        </div>
                        <div
                          className="admin-chart-bar admin-chart-bar-shop"
                          style={{ height: `${sPct}%`, opacity: bar.secondaryValue > 0 ? 1 : 0.28 }}
                        >
                          <span className="admin-chart-bar-tip">
                            {reportChartMode === 'TIME' ? 'Shop' : 'Bán lẻ'}: {formatVnd(bar.secondaryValue)}
                          </span>
                        </div>
                      </div>
                      <span className="admin-chart-xlabel" title={bar.fullLabel || bar.label}>{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2-Column Breakdown: Real Revenue Composition Donut + Product Category Valuation */}
          <div className="admin-grid-2">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <PieChart size={18} color="#6d28d9" />
                    <span>Cơ Cấu Doanh Thu &amp; Danh Mục Dịch Vụ</span>
                  </div>
                  <div className="admin-panel-sub">Tỷ trọng nguồn thu thực tế ({activePeriodMeta.label}) và hiệu quả 3 nhóm dịch vụ</div>
                </div>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="admin-donut-wrap">
                  <div className="admin-donut-svg-box">
                    <svg viewBox="0 0 120 120" width="146" height="146" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                      {periodTotalRevenue > 0 && (
                        <>
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="14"
                            strokeDasharray={`${(periodShopPct / 100) * 289} 289`}
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="14"
                            strokeDasharray={`${(periodSpaPct / 100) * 289} 289`}
                            strokeDashoffset={-((periodShopPct / 100) * 289)}
                          />
                        </>
                      )}
                    </svg>
                    <div className="admin-donut-center">
                      <span style={{ fontSize: '0.67rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tổng thu</span>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', marginTop: '2px' }}>
                        {formatCompactVnd(periodTotalRevenue)} đ
                      </strong>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 185, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '11px', background: '#eef2ff', border: '1px solid #c7d2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#4338ca' }}>Dịch Vụ Spa &amp; Thú Y</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#312e81' }}>{formatVnd(periodServiceRevenue)}</div>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4f46e5' }}>{periodSpaPct}%</span>
                    </div>

                    <div style={{ padding: '0.65rem 0.85rem', borderRadius: '11px', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#047857' }}>Bán Lẻ Pet Shop</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#065f46' }}>{formatVnd(periodOrderRevenue)}</div>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>{periodShopPct}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  {serviceCategoryStats.map((cat, idx) => {
                    const colors = ['#4f46e5', '#0284c7', '#059669'];
                    const pct = services.length > 0 ? Math.round((cat.count / services.length) * 100) : 0;
                    return (
                      <div key={cat.category} className="admin-stat-bar-row">
                        <div className="admin-stat-bar-head">
                          <strong style={{ color: '#0f172a' }}>{cat.category}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            <strong>{cat.count}</strong> gói • <strong>{cat.bookedCount}</strong> ca đặt • Thu <strong style={{ color: '#059669' }}>{formatVnd(cat.revenue)}</strong>
                          </span>
                        </div>
                        <div className="admin-stat-bar-track">
                          <div className="admin-stat-bar-fill" style={{ width: `${pct}%`, background: colors[idx % colors.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Package size={18} color="#0284c7" />
                    <span>Thống Kê Danh Mục Hàng Hóa &amp; Tồn Kho</span>
                  </div>
                  <div className="admin-panel-sub">
                    Tổng cộng {products.length} SKU • {totalInventoryUnits.toLocaleString('vi-VN')} đơn vị tồn kho thực tế
                  </div>
                </div>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {productCategoryStats.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.84rem' }}>
                    Chưa có sản phẩm nào trong kho hàng.
                  </div>
                ) : (
                  productCategoryStats.map((cat, idx) => {
                    const palette = ['#4f46e5', '#059669', '#0284c7', '#d97706', '#ec4899'];
                    const sharePct = inventoryRetailValue > 0 ? Math.round((cat.retailValue / inventoryRetailValue) * 100) : 0;
                    return (
                      <div key={cat.category} className="admin-stat-bar-row">
                        <div className="admin-stat-bar-head">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <strong style={{ color: '#0f172a' }}>{cat.category}</strong>
                            <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '1px 7px', borderRadius: '999px' }}>
                              {cat.skuCount} SKU
                            </span>
                            {cat.lowStockCount > 0 && (
                              <span style={{ fontSize: '0.69rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '1px 6px', borderRadius: '999px' }}>
                                {cat.lowStockCount} thấp
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                            {formatCompactVnd(cat.retailValue)} đ ({sharePct}%)
                          </span>
                        </div>
                        <div className="admin-stat-bar-track">
                          <div className="admin-stat-bar-fill" style={{ width: `${Math.max(4, sharePct)}%`, background: palette[idx % palette.length] }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Tồn kho hiện có: <strong>{cat.totalStock.toLocaleString('vi-VN')}</strong> sp</span>
                          <span>Giá vốn: <strong>{formatCompactVnd(cat.costValue)} đ</strong></span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 2-Column Operational & Customer Satisfaction Reports */}
          <div className="admin-grid-2">
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Activity size={17} color="#059669" />
                    <span>Báo Cáo Trạng Thái Vận Hành &amp; Nhập Kho</span>
                  </div>
                  <div className="admin-panel-sub">Tình trạng thực tế của lịch hẹn, đơn hàng Pet Shop và đề xuất nhập kho AI</div>
                </div>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.65rem' }}>
                  <div className="admin-eco-box">
                    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#0369a1' }}>Lịch Hẹn ({appointments.length})</div>
                    <div style={{ fontSize: '0.77rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                      <span>• Chờ nhận: <strong>{pendingAppointments}</strong></span>
                      <span>• Đang làm: <strong style={{ color: '#0284c7' }}>{inProgressAppointments}</strong></span>
                      <span>• Hoàn thành: <strong style={{ color: '#059669' }}>{completedAppointments}</strong></span>
                      <span>• Đã hủy: <strong style={{ color: '#dc2626' }}>{cancelledAppointments}</strong></span>
                    </div>
                  </div>

                  <div className="admin-eco-box">
                    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#047857' }}>Đơn Pet Shop ({orders.length})</div>
                    <div style={{ fontSize: '0.77rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                      <span>• Chờ xử lý: <strong style={{ color: '#d97706' }}>{pendingOrdersCount}</strong></span>
                      <span>• Đã TT / Giao: <strong style={{ color: '#0284c7' }}>{orders.filter(o => ['PAID', 'CONFIRMED', 'SHIPPED'].includes(o.status)).length}</strong></span>
                      <span>• Hoàn tất: <strong style={{ color: '#059669' }}>{orders.filter(o => o.status === 'COMPLETED').length}</strong></span>
                      <span>• Đã hủy: <strong style={{ color: '#dc2626' }}>{orders.filter(o => o.status === 'CANCELLED').length}</strong></span>
                    </div>
                  </div>

                  <div className="admin-eco-box">
                    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#c2410c' }}>Đề Xuất AI ({reorderProposals.length})</div>
                    <div style={{ fontSize: '0.77rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                      <span>• Chờ duyệt: <strong style={{ color: '#d97706' }}>{draftProposals.length}</strong></span>
                      <span>• Đã duyệt nhập: <strong style={{ color: '#059669' }}>{fulfilledProposals.length}</strong></span>
                      <span>• Đã từ chối: <strong style={{ color: '#dc2626' }}>{rejectedProposals.length}</strong></span>
                      <span>• SP tồn thấp: <strong style={{ color: '#dc2626' }}>{lowStockProducts.length}</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.8rem 0.95rem', borderRadius: '12px', background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#9a3412' }}>Ngân Sách Đề Xuất Nhập Kho Chờ Duyệt</div>
                    <div style={{ fontSize: '1.12rem', fontWeight: 800, color: '#ea580c', fontVariantNumeric: 'tabular-nums' }}>
                      {formatVnd(pendingBudgetTotal)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.42rem 0.8rem', fontSize: '0.77rem' }}
                    onClick={() => onTabChange && onTabChange('approve-proposals')}
                  >
                    Mở Phê Duyệt →
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Star size={17} color="#d97706" />
                    <span>Thống Kê Đánh Giá &amp; Tệp Khách Hàng</span>
                  </div>
                  <div className="admin-panel-sub">Phân bố điểm sao thực tế và cơ cấu hồ sơ thú cưng trên hệ thống</div>
                </div>
              </div>

              <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviews.filter(r => Math.round(Number(r.rating) || 0) === star).length;
                    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem' }}>
                        <span style={{ width: 34, fontWeight: 800, color: '#d97706' }}>{star} ★</span>
                        <div className="admin-stat-bar-track" style={{ flex: 1 }}>
                          <div className="admin-stat-bar-fill" style={{ width: `${pct}%`, background: star >= 4 ? '#f59e0b' : star === 3 ? '#94a3b8' : '#ef4444' }} />
                        </div>
                        <span style={{ width: 68, textAlign: 'right', color: '#64748b', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <div className="admin-eco-box">
                    <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#64748b' }}>Chó cưng</span>
                    <strong style={{ fontSize: '1.12rem', color: '#0f172a' }}>{dogCount} bé</strong>
                  </div>
                  <div className="admin-eco-box">
                    <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#64748b' }}>Mèo cưng</span>
                    <strong style={{ fontSize: '1.12rem', color: '#0f172a' }}>{catCount} bé</strong>
                  </div>
                  <div className="admin-eco-box">
                    <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#64748b' }}>Loài khác</span>
                    <strong style={{ fontSize: '1.12rem', color: '#0f172a' }}>{otherPetCount} bé</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Switchable Real-Time Financial & Inventory Audit Table */}
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="admin-panel-title">
                  <FileText size={17} color="#4f46e5" />
                  <span>
                    {reportTableMode === 'TRANSACTIONS'
                      ? `Sổ Giao Dịch Thực Tế (${transactionLedgerRows.length} giao dịch — ${activePeriodMeta.label})`
                      : `Bảng Định Giá Vốn, Giá Bán & Biên Lợi Nhuận Thực Tế (${products.length} SKU)`}
                  </span>
                </div>
                <div className="admin-panel-sub">
                  Dữ liệu truy xuất trực tiếp từ MongoDB phục vụ đối chiếu doanh thu, kế toán và kiểm kê kho hàng
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div className="admin-pill-group">
                  <button
                    type="button"
                    onClick={() => setReportTableMode('TRANSACTIONS')}
                    className={`admin-pill-btn${reportTableMode === 'TRANSACTIONS' ? ' is-active' : ''}`}
                  >
                    <span>Giao dịch thực tế</span>
                    <span className="admin-pill-count">{transactionLedgerRows.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTableMode('INVENTORY')}
                    className={`admin-pill-btn${reportTableMode === 'INVENTORY' ? ' is-active' : ''}`}
                  >
                    <span>Định giá từng SKU</span>
                    <span className="admin-pill-count">{products.length}</span>
                  </button>
                </div>
                <button type="button" className="admin-icon-action" onClick={handleExportDetailedReportCSV}>
                  <Download size={13} /> Tải CSV
                </button>
              </div>
            </div>

            {reportTableMode === 'TRANSACTIONS' ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã GD</th>
                      <th>Phân Loại</th>
                      <th>Thời Gian</th>
                      <th>Khách Hàng</th>
                      <th>Nội Dung Giao Dịch</th>
                      <th>Trạng Thái</th>
                      <th style={{ textAlign: 'right' }}>Giá Trị Thực Tế</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionLedgerRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                          Chưa có giao dịch lịch hẹn hoặc đơn hàng nào trong kỳ <strong>{activePeriodMeta.label}</strong>. Khi khách đặt lịch hoặc mua hàng, giao dịch sẽ tự động hiển thị tại đây.
                        </td>
                      </tr>
                    ) : (
                      transactionLedgerRows.map((tx) => (
                        <tr key={tx.id}>
                          <td><strong style={{ color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{tx.code}</strong></td>
                          <td>
                            <span
                              className={`badge ${tx.type === 'SERVICE' ? 'badge-info' : 'badge-success'}`}
                              style={{ fontSize: '0.71rem' }}
                            >
                              {tx.typeLabel}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                            {tx.dateDisplay}
                          </td>
                          <td><strong style={{ color: '#1e293b' }}>{tx.customerName}</strong></td>
                          <td style={{ fontSize: '0.82rem', color: '#475569', maxWidth: 320 }}>{tx.summary}</td>
                          <td>
                            <span
                              className={`badge ${['COMPLETED', 'PAID', 'CONFIRMED'].includes(tx.status) ? 'badge-success' : tx.status === 'CANCELLED' ? 'badge-danger' : 'badge-pending'}`}
                              style={{ fontSize: '0.71rem' }}
                            >
                              {tx.statusLabel}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: tx.status === 'CANCELLED' ? '#94a3b8' : '#059669', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                            {formatVnd(tx.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã SKU</th>
                      <th>Tên Sản Phẩm</th>
                      <th>Danh Mục &amp; NCC</th>
                      <th style={{ textAlign: 'right' }}>Tồn Hiện Tại</th>
                      <th style={{ textAlign: 'right' }}>Giá Vốn</th>
                      <th style={{ textAlign: 'right' }}>Giá Bán Lẻ</th>
                      <th style={{ textAlign: 'right' }}>Tổng Trị Giá Tồn</th>
                      <th style={{ textAlign: 'right' }}>Biên Gộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                          Chưa có sản phẩm nào trong kho hàng.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => {
                        const stock = Number(p.currentStock) || 0;
                        const min = Number(p.minStockLevel) || 0;
                        const retail = Number(p.unitPrice) || 0;
                        const cost = Number(p.costPrice) || Math.round(retail * 0.65);
                        const margin = retail > 0 ? (((retail - cost) / retail) * 100) : 0;
                        return (
                          <tr key={p.id}>
                            <td><strong style={{ color: '#475569', fontSize: '0.8rem' }}>{p.sku}</strong></td>
                            <td><strong style={{ color: '#0f172a' }}>{p.name}</strong></td>
                            <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              <span style={{ fontWeight: 700, color: '#0284c7' }}>{p.category}</span> • {p.supplierName || 'Chưa phân bổ NCC'}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: stock <= min ? '#dc2626' : '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                              {stock} sp
                            </td>
                            <td style={{ textAlign: 'right', color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
                              {formatVnd(cost)}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                              {formatVnd(retail)}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: '#4f46e5', fontVariantNumeric: 'tabular-nums' }}>
                              {formatVnd(stock * retail)}
                            </td>
                            <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                                +{margin.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== 1C. QUẢN LÝ KHO & DỊCH VỤ HỆ THỐNG ==================== */}
      {currentTab === 'catalog-admin' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)', color: '#ffffff' }}>
                <Package size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Quản Lý Kho &amp; Dịch Vụ Hệ Thống</h1>
                <p className="admin-page-subtitle">
                  Quản trị tập trung danh mục hàng hóa Pet Shop, kiểm soát nhập/xuất/tồn kho và chuẩn hóa bảng giá dịch vụ chăm sóc &amp; thú y
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {catalogSubTab === 'products' ? (
                <>
                  <button type="button" className="btn btn-secondary" onClick={handleExportInventoryCSV}>
                    <Download size={15} /> Xuất Tồn Kho CSV
                  </button>
                  <button type="button" className="btn admin-btn-indigo" onClick={openCreateAdminProduct}>
                    <Plus size={16} /> Thêm Sản Phẩm Mới
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-secondary" onClick={handleExportServicesCSV}>
                    <Download size={15} /> Xuất Bảng Giá CSV
                  </button>
                  <button type="button" className="btn admin-btn-indigo" onClick={openCreateAdminService}>
                    <Plus size={16} /> Thêm Gói Dịch Vụ
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Unified 4-Card KPI Strip (Products + Stock Health + Services) */}
          <div className="admin-kpi-grid">
            <div
              className="admin-kpi-card is-clickable"
              onClick={() => {
                setCatalogSubTab('products');
                setCatalogProdStockFilter('ALL');
              }}
              style={catalogSubTab === 'products' ? { borderColor: '#6366f1' } : undefined}
            >
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Danh Mục Sản Phẩm Kho</div>
                  <div className="admin-kpi-value" style={{ color: '#4f46e5', marginTop: '0.35rem' }}>
                    {products.length}
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b', marginLeft: '5px' }}>SKU</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                  <Package size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Tổng tồn: <strong>{totalInventoryUnits.toLocaleString('vi-VN')}</strong> sản phẩm</span>
                <span>{allProductCategories.length} nhóm hàng</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Định Giá Hàng Tồn Kho</div>
                  <div className="admin-kpi-value" style={{ color: '#059669', fontSize: '1.42rem', marginTop: '0.38rem' }}>
                    {(inventoryRetailValue / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Triệu đ
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Giá vốn: <strong>{(inventoryCostValue / 1000000).toFixed(1)} Tr</strong></span>
                <span style={{ color: '#059669', fontWeight: 800 }}>Biên gộp ~{estimatedMarginPct.toFixed(1)}%</span>
              </div>
            </div>

            <div
              className="admin-kpi-card is-clickable"
              onClick={() => {
                setCatalogSubTab('products');
                setCatalogProdStockFilter('LOW');
              }}
            >
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Cảnh Báo Chạm Min / Hết</div>
                  <div
                    className="admin-kpi-value"
                    style={{ color: lowStockProducts.length > 0 ? '#dc2626' : '#0284c7', marginTop: '0.35rem' }}
                  >
                    {lowStockProducts.length}
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b', marginLeft: '5px' }}>sản phẩm</span>
                  </div>
                </div>
                <div
                  className="admin-kpi-icon-box"
                  style={
                    lowStockProducts.length > 0
                      ? { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
                      : { background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }
                  }
                >
                  <AlertTriangle size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Hết hàng: <strong style={{ color: outOfStockProducts.length > 0 ? '#dc2626' : '#475569' }}>{outOfStockProducts.length}</strong></span>
                <span style={{ color: '#ea580c', fontWeight: 700 }}>Lọc nhanh →</span>
              </div>
            </div>

            <div
              className="admin-kpi-card is-clickable"
              onClick={() => setCatalogSubTab('services')}
              style={catalogSubTab === 'services' ? { borderColor: '#0284c7' } : undefined}
            >
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Dịch Vụ Chăm Sóc &amp; Thú Y</div>
                  <div className="admin-kpi-value" style={{ color: '#0284c7', marginTop: '0.35rem' }}>
                    {services.length}
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b', marginLeft: '5px' }}>gói</span>
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                  <Scissors size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot">
                <span>Giá TB: <strong>{avgServicePrice.toLocaleString('vi-VN')} đ</strong></span>
                <span>3 chuyên mục chuẩn</span>
              </div>
            </div>
          </div>

          {/* Segmented Mode Switcher: Kho Hàng & Sản Phẩm vs Dịch Vụ Chăm Sóc */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
            <div className="admin-segment-switcher" role="tablist" aria-label="Chuyển đổi Kho sản phẩm và Dịch vụ chăm sóc">
              <button
                type="button"
                role="tab"
                aria-selected={catalogSubTab === 'products'}
                className={`admin-segment-tab${catalogSubTab === 'products' ? ' is-active' : ''}`}
                onClick={() => setCatalogSubTab('products')}
              >
                <Package size={16} />
                <span>Kho Hàng &amp; Sản Phẩm Pet Shop</span>
                <span className="admin-segment-badge">{products.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={catalogSubTab === 'services'}
                className={`admin-segment-tab${catalogSubTab === 'services' ? ' is-active' : ''}`}
                onClick={() => setCatalogSubTab('services')}
              >
                <Scissors size={16} />
                <span>Dịch Vụ Chăm Sóc &amp; Thú Y</span>
                <span className="admin-segment-badge">{services.length}</span>
              </button>
            </div>

            <span style={{ fontSize: '0.77rem', color: '#64748b', fontWeight: 600 }}>
              Mọi thay đổi được đồng bộ tức thì tới Cổng Khách hàng (/), Nhân viên &amp; Quản lý kho
            </span>
          </div>

          {/* ==================== SUB-TAB A: KHO HÀNG & SẢN PHẨM ==================== */}
          {catalogSubTab === 'products' && (
            <div className="admin-panel">
              <div className="admin-toolbar">
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div className="admin-pill-group">
                    {[
                      { id: 'ALL', label: 'Tất cả', count: products.length },
                      { id: 'LOW', label: 'Sắp hết / ≤ Min', count: lowStockProducts.length },
                      { id: 'OUT', label: 'Hết hàng', count: outOfStockProducts.length },
                      { id: 'SAFE', label: 'An toàn', count: safeStockProducts.length },
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCatalogProdStockFilter(f.id)}
                        className={`admin-pill-btn${catalogProdStockFilter === f.id ? ' is-active' : ''}`}
                      >
                        <span>{f.label}</span>
                        <span className="admin-pill-count">{f.count}</span>
                      </button>
                    ))}
                  </div>

                  <select
                    className="form-control"
                    value={catalogProdCatFilter}
                    onChange={e => setCatalogProdCatFilter(e.target.value)}
                    style={{ width: 'auto', minWidth: 165, padding: '0.45rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px' }}
                    aria-label="Lọc danh mục sản phẩm"
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    {allProductCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    className="form-control"
                    value={catalogProdSort}
                    onChange={e => setCatalogProdSort(e.target.value)}
                    style={{ width: 'auto', minWidth: 175, padding: '0.45rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px' }}
                    aria-label="Sắp xếp sản phẩm"
                  >
                    <option value="DEFAULT">Sắp xếp: Mặc định</option>
                    <option value="STOCK_ASC">Tồn kho: Thấp → Cao</option>
                    <option value="STOCK_DESC">Tồn kho: Cao → Thấp</option>
                    <option value="PRICE_DESC">Giá bán: Cao → Thấp</option>
                    <option value="PRICE_ASC">Giá bán: Thấp → Cao</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <div className="admin-search-box" style={{ minWidth: 200, flex: '1 1 210px' }}>
                    <Search size={15} color="#64748b" />
                    <input
                      type="text"
                      value={catalogProdSearch}
                      onChange={e => setCatalogProdSearch(e.target.value)}
                      placeholder="Tìm tên SP, mã SKU, nhà cung cấp..."
                    />
                    {catalogProdSearch && (
                      <button
                        type="button"
                        onClick={() => setCatalogProdSearch('')}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}
                        aria-label="Xóa tìm kiếm sản phẩm"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="admin-pill-group">
                    <button
                      type="button"
                      className={`admin-pill-btn${catalogProdView === 'table' ? ' is-active' : ''}`}
                      onClick={() => setCatalogProdView('table')}
                    >
                      <List size={14} /> Bảng
                    </button>
                    <button
                      type="button"
                      className={`admin-pill-btn${catalogProdView === 'grid' ? ' is-active' : ''}`}
                      onClick={() => setCatalogProdView('grid')}
                    >
                      <LayoutGrid size={14} /> Thẻ
                    </button>
                  </div>
                </div>
              </div>

              {catalogProdView === 'table' ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sản Phẩm &amp; Mã SKU</th>
                        <th>Danh Mục</th>
                        <th style={{ textAlign: 'right' }}>Giá Bán &amp; Giá Vốn</th>
                        <th style={{ width: 210 }}>Tồn Kho &amp; Định Mức</th>
                        <th>Trạng Thái</th>
                        <th style={{ textAlign: 'right' }}>Thao Tác Quản Trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCatalogProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2.75rem 1rem', color: '#64748b' }}>
                            Không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại.
                          </td>
                        </tr>
                      ) : (
                        filteredCatalogProducts.map(prod => {
                          const stock = Number(prod.currentStock) || 0;
                          const min = Math.max(1, Number(prod.minStockLevel) || 10);
                          const max = Math.max(min + 1, Number(prod.maxStockLevel) || 100);
                          const fillPct = Math.min(100, Math.round((stock / max) * 100));
                          const retail = Number(prod.unitPrice) || 0;
                          const cost = Number(prod.costPrice) || Math.round(retail * 0.65);
                          const margin = retail > 0 ? Math.round(((retail - cost) / retail) * 100) : 0;
                          const isOut = stock <= 0;
                          const isLow = !isOut && stock <= min;

                          return (
                            <tr key={prod.id}>
                              <td>
                                <div className="admin-cell-identity">
                                  <img
                                    src={getProductImage(prod)}
                                    alt={prod.name}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                                    style={{ width: 46, height: 46, borderRadius: '11px', objectFit: 'contain', background: '#ffffff', padding: '3px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                  />
                                  <div style={{ minWidth: 0 }}>
                                    <strong style={{ color: '#0f172a', fontSize: '0.87rem', display: 'block' }}>{prod.name}</strong>
                                    <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                      <span>SKU: <strong style={{ color: '#475569' }}>{prod.sku}</strong></span>
                                      <span>• NCC: {prod.supplierName || 'Royal Canin Việt Nam'}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{prod.category || 'Thức ăn'}</span>
                              </td>
                              <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                                  {retail.toLocaleString('vi-VN')} đ
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                  Vốn: {cost.toLocaleString('vi-VN')}đ <span style={{ color: '#059669', fontWeight: 700 }}>(+{margin}%)</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
                                  <strong style={{ color: isOut || isLow ? '#dc2626' : '#0f172a' }}>{stock} sp</strong>
                                  <span style={{ color: '#64748b', fontSize: '0.71rem' }}>Min {min} • Max {max}</span>
                                </div>
                                <div className="admin-mini-bar" style={{ height: 6 }}>
                                  <div
                                    style={{
                                      width: `${fillPct}%`,
                                      background: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981',
                                    }}
                                  />
                                </div>
                              </td>
                              <td>
                                {isOut ? (
                                  <span className="admin-status-pill admin-status-locked">
                                    <span className="dot" /> Hết hàng
                                  </span>
                                ) : isLow ? (
                                  <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                                    Cần nhập thêm
                                  </span>
                                ) : (
                                  <span className="admin-status-pill admin-status-active">
                                    <span className="dot" /> Đủ hàng
                                  </span>
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.38rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                                  <button
                                    type="button"
                                    className="admin-icon-action is-ok"
                                    onClick={() => openAdminStockModal(prod, 'IN')}
                                    title="Nhập kho / Xuất kho / Kiểm kê"
                                  >
                                    <ArrowUpDown size={13} /> Kho
                                  </button>
                                  {(isOut || isLow) && onCreateProposal && (
                                    <button
                                      type="button"
                                      className="admin-icon-action is-warn"
                                      onClick={() => handleQuickCreateProposalFromAdmin(prod)}
                                      title="Lập nhanh phiếu đề xuất nhập hàng"
                                    >
                                      <Plus size={13} /> Đề xuất
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="admin-icon-action"
                                    onClick={() => openEditAdminProduct(prod)}
                                    title="Chỉnh sửa thông tin sản phẩm"
                                  >
                                    <Edit3 size={13} /> Sửa
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-icon-action is-danger"
                                    onClick={() => handleDeleteAdminProduct(prod)}
                                    title="Xóa sản phẩm"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-panel-body">
                  {filteredCatalogProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                      Không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại.
                    </div>
                  ) : (
                    <div className="admin-catalog-grid">
                      {filteredCatalogProducts.map(prod => {
                        const stock = Number(prod.currentStock) || 0;
                        const min = Math.max(1, Number(prod.minStockLevel) || 10);
                        const max = Math.max(min + 1, Number(prod.maxStockLevel) || 100);
                        const fillPct = Math.min(100, Math.round((stock / max) * 100));
                        const retail = Number(prod.unitPrice) || 0;
                        const cost = Number(prod.costPrice) || Math.round(retail * 0.65);
                        const isOut = stock <= 0;
                        const isLow = !isOut && stock <= min;

                        return (
                          <div key={prod.id} className="admin-catalog-card">
                            <div className="admin-catalog-card-media" style={{ background: '#ffffff', padding: '0.85rem' }}>
                              <img
                                src={getProductImage(prod)}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                              />
                              <span className="badge badge-info" style={{ position: 'absolute', top: 10, left: 10, fontSize: '0.69rem' }}>
                                {prod.category || 'Thức ăn'}
                              </span>
                              <span
                                className={`badge ${isOut ? 'badge-danger' : isLow ? 'badge-pending' : 'badge-success'}`}
                                style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.69rem' }}
                              >
                                Tồn: {stock}
                              </span>
                            </div>

                            <div className="admin-catalog-card-body">
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>SKU: {prod.sku}</div>
                              <strong style={{ fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.35 }}>{prod.name}</strong>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto' }}>
                                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4f46e5', fontVariantNumeric: 'tabular-nums' }}>
                                  {retail.toLocaleString('vi-VN')} đ
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                  Vốn: {cost.toLocaleString('vi-VN')}đ
                                </span>
                              </div>
                              <div className="admin-mini-bar" style={{ height: 6 }}>
                                <div style={{ width: `${fillPct}%`, background: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981' }} />
                              </div>
                            </div>

                            <div className="admin-catalog-card-foot">
                              <button type="button" className="admin-icon-action is-ok" onClick={() => openAdminStockModal(prod, 'IN')}>
                                <ArrowUpDown size={13} /> Nhập/Xuất
                              </button>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button type="button" className="admin-icon-action" onClick={() => openEditAdminProduct(prod)}>
                                  <Edit3 size={13} /> Sửa
                                </button>
                                <button type="button" className="admin-icon-action is-danger" onClick={() => handleDeleteAdminProduct(prod)}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================== SUB-TAB B: DỊCH VỤ CHĂM SÓC & THÚ Y ==================== */}
          {catalogSubTab === 'services' && (
            <>
              {/* 3 Standardized Service Category Overview Cards */}
              <div className="admin-kpi-grid-3">
                {serviceCategoryStats.map((cat, idx) => {
                  const accents = [
                    { color: '#4f46e5', soft: '#eef2ff', border: '#c7d2fe' },
                    { color: '#0284c7', soft: '#f0f9ff', border: '#bae6fd' },
                    { color: '#059669', soft: '#ecfdf5', border: '#a7f3d0' },
                  ][idx % 3];
                  const isSelected = catalogSvcCatFilter === cat.category;
                  return (
                    <div
                      key={cat.category}
                      className="admin-kpi-card is-clickable"
                      onClick={() => setCatalogSvcCatFilter(isSelected ? 'ALL' : cat.category)}
                      style={isSelected ? { borderColor: accents.color, boxShadow: `0 0 0 2px ${accents.color}22` } : undefined}
                    >
                      <div className="admin-kpi-top">
                        <div>
                          <span className="badge" style={{ background: accents.soft, color: accents.color, border: `1px solid ${accents.border}`, marginBottom: '0.4rem' }}>
                            {cat.category}
                          </span>
                          <div className="admin-kpi-value" style={{ fontSize: '1.42rem' }}>
                            {cat.count} <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>gói dịch vụ</span>
                          </div>
                        </div>
                        <div className="admin-kpi-icon-box" style={{ background: accents.soft, color: accents.color, border: `1px solid ${accents.border}` }}>
                          <Scissors size={18} />
                        </div>
                      </div>
                      <div className="admin-kpi-foot">
                        <span>Giá TB: <strong>{cat.avgPrice.toLocaleString('vi-VN')} đ</strong></span>
                        <span style={{ color: accents.color, fontWeight: 700 }}>{cat.bookedCount} lượt đặt</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="admin-panel">
                <div className="admin-toolbar">
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="admin-pill-group">
                      {[
                        { id: 'ALL', label: 'Tất cả', count: services.length },
                        ...STANDARD_SERVICE_CATEGORIES.map(c => ({
                          id: c,
                          label: c,
                          count: services.filter(s => s.category === c).length,
                        })),
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCatalogSvcCatFilter(tab.id)}
                          className={`admin-pill-btn${catalogSvcCatFilter === tab.id ? ' is-active' : ''}`}
                        >
                          <span>{tab.label}</span>
                          <span className="admin-pill-count">{tab.count}</span>
                        </button>
                      ))}
                    </div>

                    <select
                      className="form-control"
                      value={catalogSvcSort}
                      onChange={e => setCatalogSvcSort(e.target.value)}
                      style={{ width: 'auto', minWidth: 175, padding: '0.45rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px' }}
                      aria-label="Sắp xếp dịch vụ"
                    >
                      <option value="DEFAULT">Sắp xếp: Mặc định</option>
                      <option value="PRICE_ASC">Giá dịch vụ: Thấp → Cao</option>
                      <option value="PRICE_DESC">Giá dịch vụ: Cao → Thấp</option>
                      <option value="DURATION_ASC">Thời lượng: Ngắn → Dài</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <div className="admin-search-box" style={{ minWidth: 200, flex: '1 1 210px' }}>
                      <Search size={15} color="#64748b" />
                      <input
                        type="text"
                        value={catalogSvcSearch}
                        onChange={e => setCatalogSvcSearch(e.target.value)}
                        placeholder="Tìm tên gói dịch vụ, quy trình..."
                      />
                      {catalogSvcSearch && (
                        <button
                          type="button"
                          onClick={() => setCatalogSvcSearch('')}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}
                          aria-label="Xóa tìm kiếm dịch vụ"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="admin-pill-group">
                      <button
                        type="button"
                        className={`admin-pill-btn${catalogSvcView === 'table' ? ' is-active' : ''}`}
                        onClick={() => setCatalogSvcView('table')}
                      >
                        <List size={14} /> Bảng
                      </button>
                      <button
                        type="button"
                        className={`admin-pill-btn${catalogSvcView === 'grid' ? ' is-active' : ''}`}
                        onClick={() => setCatalogSvcView('grid')}
                      >
                        <LayoutGrid size={14} /> Thẻ
                      </button>
                    </div>
                  </div>
                </div>

                {catalogSvcView === 'table' ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Gói Dịch Vụ Chăm Sóc</th>
                          <th>Chuyên Mục</th>
                          <th>Thời Lượng</th>
                          <th style={{ textAlign: 'right' }}>Giá Niêm Yết</th>
                          <th style={{ textAlign: 'center' }}>Lượt Đặt</th>
                          <th>Trạng Thái</th>
                          <th style={{ textAlign: 'right' }}>Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCatalogServices.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.75rem 1rem', color: '#64748b' }}>
                              Không tìm thấy gói dịch vụ nào phù hợp.
                            </td>
                          </tr>
                        ) : (
                          filteredCatalogServices.map(svc => {
                            const bookedCount = appointments.filter(a => a.serviceId === svc.id || a.serviceName === svc.name).length;
                            const catBadge = svc.category === 'Spa & Grooming'
                              ? { bg: '#eef2ff', color: '#4f46e5', border: '#c7d2fe' }
                              : svc.category === 'Y Tế & Tiêm Phòng'
                                ? { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' }
                                : { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
                            return (
                              <tr key={svc.id}>
                                <td style={{ maxWidth: 420 }}>
                                  <div className="admin-cell-identity">
                                    <img
                                      src={getServiceImage(svc)}
                                      alt={svc.name}
                                      referrerPolicy="no-referrer"
                                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.service; }}
                                      style={{ width: 54, height: 42, borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                                    />
                                    <div style={{ minWidth: 0 }}>
                                      <strong style={{ color: '#0f172a', fontSize: '0.88rem', display: 'block' }}>{svc.name}</strong>
                                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {svc.description || 'Quy trình chăm sóc tiêu chuẩn thú y Petzera'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge" style={{ background: catBadge.bg, color: catBadge.color, border: `1px solid ${catBadge.border}`, fontSize: '0.72rem' }}>
                                    {svc.category}
                                  </span>
                                </td>
                                <td style={{ whiteSpace: 'nowrap', color: '#475569', fontWeight: 600 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={13} color="#64748b" /> {svc.durationMinutes || 45} phút
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                                  {(Number(svc.price) || 0).toLocaleString('vi-VN')} đ
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                                  {bookedCount} ca
                                </td>
                                <td>
                                  <span className="admin-status-pill admin-status-active">
                                    <span className="dot" /> Đang phục vụ
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                    <button type="button" className="admin-icon-action" onClick={() => openEditAdminService(svc)}>
                                      <Edit3 size={13} /> Sửa
                                    </button>
                                    <button type="button" className="admin-icon-action is-danger" onClick={() => handleDeleteAdminService(svc)} title="Xóa dịch vụ">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-panel-body">
                    {filteredCatalogServices.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                        Không tìm thấy gói dịch vụ nào phù hợp.
                      </div>
                    ) : (
                      <div className="admin-catalog-grid">
                        {filteredCatalogServices.map(svc => {
                          const bookedCount = appointments.filter(a => a.serviceId === svc.id || a.serviceName === svc.name).length;
                          return (
                            <div key={svc.id} className="admin-catalog-card">
                              <div className="admin-catalog-card-media">
                                <img
                                  src={getServiceImage(svc)}
                                  alt={svc.name}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.service; }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span className="badge badge-info" style={{ position: 'absolute', top: 10, left: 10, fontSize: '0.69rem', background: 'rgba(15, 23, 42, 0.78)', color: '#ffffff', border: 'none' }}>
                                  {svc.category}
                                </span>
                                <span className="badge" style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.94)', color: '#0f172a' }}>
                                  <Clock size={11} /> {svc.durationMinutes || 45} phút
                                </span>
                              </div>

                              <div className="admin-catalog-card-body">
                                <strong style={{ fontSize: '0.94rem', color: '#0f172a', lineHeight: 1.35 }}>{svc.name}</strong>
                                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, flex: 1 }}>
                                  {svc.description || 'Quy trình chăm sóc tiêu chuẩn thú y Petzera.'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem' }}>
                                  <span style={{ fontSize: '1.06rem', fontWeight: 800, color: '#059669', fontVariantNumeric: 'tabular-nums' }}>
                                    {(Number(svc.price) || 0).toLocaleString('vi-VN')} đ
                                  </span>
                                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b' }}>
                                    {bookedCount} ca đã đặt
                                  </span>
                                </div>
                              </div>

                              <div className="admin-catalog-card-foot">
                                <span className="admin-status-pill admin-status-active" style={{ padding: '0.2rem 0.58rem', fontSize: '0.7rem' }}>
                                  <span className="dot" /> Hoạt động
                                </span>
                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                  <button type="button" className="admin-icon-action" onClick={() => openEditAdminService(svc)}>
                                    <Edit3 size={13} /> Sửa
                                  </button>
                                  <button type="button" className="admin-icon-action is-danger" onClick={() => handleDeleteAdminService(svc)}>
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ==================== 2. QUẢN LÝ TÀI KHOẢN ==================== */}
      {currentTab === 'accounts-admin' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff' }}>
                <Users size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Quản Lý Tài Khoản Hệ Thống</h1>
                <p className="admin-page-subtitle">
                  Tạo mới, chỉnh sửa thông tin, khóa/mở khóa và quản lý tài khoản người dùng trên toàn hệ thống
                </p>
              </div>
            </div>
            <button type="button" className="btn admin-btn-indigo" onClick={openCreateUser}>
              <Plus size={16} /> Thêm Tài Khoản Mới
            </button>
          </div>

          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Tổng Tài Khoản</div>
                  <div className="admin-kpi-value" style={{ color: '#4f46e5', marginTop: '0.35rem' }}>{users.length}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                  <Users size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Đồng bộ trực tiếp MongoDB</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Khách Hàng</div>
                  <div className="admin-kpi-value" style={{ color: '#059669', marginTop: '0.35rem' }}>{customerCount}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Cổng khách hàng (/)</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Nhân Viên &amp; Kho</div>
                  <div className="admin-kpi-value" style={{ color: '#0284c7', marginTop: '0.35rem' }}>
                    {users.filter(u => u.role === 'CARE_STAFF' || u.role === 'WAREHOUSE_STAFF').length}
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                  <Shield size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Đội ngũ vận hành nội bộ</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Tài Khoản Bị Khóa</div>
                  <div className="admin-kpi-value" style={{ color: lockedCount > 0 ? '#dc2626' : '#64748b', marginTop: '0.35rem' }}>
                    {lockedCount}
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <Lock size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>{lockedCount === 0 ? 'Tất cả đang hoạt động' : 'Đang hạn chế đăng nhập'}</span></div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-toolbar">
              <div className="admin-pill-group">
                {[
                  { id: 'ALL', label: 'Tất cả', count: users.length },
                  { id: 'ADMIN', label: 'Admin', count: users.filter(u => u.role === 'ADMIN').length },
                  { id: 'CARE_STAFF', label: 'Nhân viên', count: users.filter(u => u.role === 'CARE_STAFF').length },
                  { id: 'WAREHOUSE_STAFF', label: 'Quản lý kho', count: users.filter(u => u.role === 'WAREHOUSE_STAFF').length },
                  { id: 'CUSTOMER', label: 'Khách hàng', count: customerCount },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoleFilter(r.id)}
                    className={`admin-pill-btn${roleFilter === r.id ? ' is-active' : ''}`}
                  >
                    <span>{r.label}</span>
                    <span className="admin-pill-count">{r.count}</span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>
                  Hiển thị {filteredUsers.length} / {users.length}
                </span>
                <div className="admin-search-box">
                  <Search size={15} color="#64748b" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên, email, số điện thoại..."
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}
                      aria-label="Xóa từ khóa tìm kiếm"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Người Dùng</th>
                    <th>Tài Khoản (Email / SĐT)</th>
                    <th>Số Điện Thoại</th>
                    <th>Vai Trò</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Tạo</th>
                    <th style={{ textAlign: 'right' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                        Không tìm thấy tài khoản nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const meta = ROLE_META[u.role] || ROLE_META.CUSTOMER;
                      const isLocked = u.status === 'LOCKED';
                      const isSelf = currentUser && (u.id === currentUser.id || u.email === currentUser.email);
                      return (
                        <tr key={u.id} className={isLocked ? 'is-locked' : undefined}>
                          <td>
                            <div className="admin-cell-identity">
                              <div className="admin-row-avatar" style={{ background: meta.gradient }}>
                                {getInitials(u.fullName)}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{u.fullName}</strong>
                                  {isSelf && (
                                    <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '1px 6px', borderRadius: '6px' }}>
                                      Bạn
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: '#334155', fontWeight: 500 }}>{u.email}</td>
                          <td style={{ color: '#475569', fontVariantNumeric: 'tabular-nums' }}>{u.phone || '—'}</td>
                          <td>
                            <span
                              className="badge"
                              style={{ background: meta.softBg, color: meta.color, border: `1px solid ${meta.color}33` }}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-status-pill ${isLocked ? 'admin-status-locked' : 'admin-status-active'}`}>
                              <span className="dot" />
                              {isLocked ? 'Đang khóa' : 'Hoạt động'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.81rem', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                            {u.createdAt || '2026-01-01'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                              <button
                                type="button"
                                className="admin-icon-action"
                                onClick={() => openEditUser(u)}
                                title="Chỉnh sửa thông tin"
                              >
                                <Edit3 size={13} /> Sửa
                              </button>
                              <button
                                type="button"
                                className={`admin-icon-action ${isLocked ? 'is-ok' : 'is-warn'}`}
                                onClick={() => {
                                  if (currentUser && u.id === currentUser.id) {
                                    toast.warning('Không thể tự khóa tài khoản Admin đang đăng nhập!', 'Bảo Vệ Hệ Thống');
                                    return;
                                  }
                                  onToggleUserStatus && onToggleUserStatus(u.id);
                                }}
                                title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                              >
                                {isLocked ? <Unlock size={13} /> : <Lock size={13} />}
                                {isLocked ? 'Mở khóa' : 'Khóa'}
                              </button>
                              <button
                                type="button"
                                className="admin-icon-action is-danger"
                                onClick={() => handleDeleteUserClick(u)}
                                title="Xóa tài khoản"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================== 3. PHÂN QUYỀN NGƯỜI DÙNG (RBAC) ==================== */}
      {currentTab === 'roles-admin' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)', color: '#ffffff' }}>
                <Shield size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Phân Quyền Người Dùng (RBAC)</h1>
                <p className="admin-page-subtitle">
                  Gán vai trò truy cập cho từng tài khoản và quản lý ma trận quyền hạn chi tiết theo 4 nhóm vai trò
                </p>
              </div>
            </div>
          </div>

          <div className="admin-kpi-grid">
            {[
              { key: 'CUSTOMER', title: 'Khách hàng', desc: 'Đặt lịch, quản lý thú cưng, mua sắm', color: '#059669', soft: '#ecfdf5', border: '#a7f3d0' },
              { key: 'CARE_STAFF', title: 'Nhân viên', desc: 'Lịch hẹn, dịch vụ, KM, thú cưng, báo cáo', color: '#0284c7', soft: '#f0f9ff', border: '#bae6fd' },
              { key: 'WAREHOUSE_STAFF', title: 'Quản lý kho', desc: 'Nhập/xuất/tồn, sản phẩm, dự báo AI, đề xuất nhập', color: '#d97706', soft: '#fffbeb', border: '#fde68a' },
              { key: 'ADMIN', title: 'Admin', desc: 'Tổng quan, TK, RBAC, duyệt nhập, NCC, cấu hình', color: '#6d28d9', soft: '#f5f3ff', border: '#ddd6fe' },
            ].map(r => {
              const roleUsersCount = users.filter(u => u.role === r.key).length;
              const permCount = rbacMatrix.filter(row => !!row[r.key]).length;
              const permPct = Math.round((permCount / rbacMatrix.length) * 100);
              return (
                <div key={r.key} className="admin-kpi-card">
                  <div className="admin-kpi-top">
                    <div>
                      <span
                        className="badge"
                        style={{ background: r.soft, color: r.color, border: `1px solid ${r.border}`, marginBottom: '0.45rem' }}
                      >
                        {r.title}
                      </span>
                      <div style={{ fontSize: '1.26rem', fontWeight: 800, color: '#0f172a' }}>
                        {roleUsersCount} <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>tài khoản</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: r.color, fontVariantNumeric: 'tabular-nums' }}>
                        {permCount}/{rbacMatrix.length}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>quyền bật</div>
                    </div>
                  </div>
                  <div>
                    <div className="admin-mini-bar" style={{ marginBottom: '0.45rem' }}>
                      <div style={{ width: `${permPct}%`, background: r.color }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 1: Assign Roles */}
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="admin-panel-title">
                  <Users size={17} color="#4f46e5" />
                  <span>1. Gán &amp; Thay Đổi Vai Trò Tài Khoản</span>
                </div>
                <div className="admin-panel-sub">
                  Chọn vai trò mới để cập nhật quyền truy cập ngay lập tức cho tài khoản tương ứng
                </div>
              </div>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>
                {users.length} tài khoản
              </span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Người Dùng</th>
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
                        <td>
                          <div className="admin-cell-identity">
                            <div className="admin-row-avatar" style={{ background: meta.gradient, width: 32, height: 32, fontSize: '0.72rem' }}>
                              {getInitials(u.fullName)}
                            </div>
                            <strong style={{ color: '#0f172a' }}>{u.fullName}</strong>
                          </div>
                        </td>
                        <td style={{ color: '#475569' }}>{u.email}</td>
                        <td>
                          <span className="badge" style={{ background: meta.softBg, color: meta.color, border: `1px solid ${meta.color}33` }}>
                            {meta.label}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <select
                              className="form-control"
                              disabled={isSelf}
                              value={u.role}
                              onChange={(e) => {
                                if (onUpdateUserRole) {
                                  onUpdateUserRole(u.id, e.target.value);
                                }
                              }}
                              style={{
                                padding: '0.42rem 0.78rem',
                                fontSize: '0.82rem',
                                maxWidth: 235,
                                borderRadius: '10px',
                                cursor: isSelf ? 'not-allowed' : 'pointer',
                                opacity: isSelf ? 0.65 : 1,
                              }}
                            >
                              <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
                              <option value="CARE_STAFF">Nhân viên (CARE_STAFF)</option>
                              <option value="WAREHOUSE_STAFF">Quản lý kho (WAREHOUSE_STAFF)</option>
                              <option value="ADMIN">Admin (ADMIN)</option>
                            </select>
                            {isSelf && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: '#6d28d9', background: '#f5f3ff', padding: '3px 8px', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                                <Lock size={11} /> Phiên hiện tại
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: RBAC Matrix */}
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="admin-panel-title">
                  <Layers size={17} color="#6d28d9" />
                  <span>2. Ma Trận Phân Quyền Chức Năng (RBAC Permission Matrix)</span>
                </div>
                <div className="admin-panel-sub">
                  Bật/tắt quyền truy cập chi tiết theo từng Use Case của 4 nhóm vai trò
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', borderRadius: '10px' }} onClick={handleResetRbac}>
                  <RefreshCw size={14} /> Khôi Phục Mặc Định
                </button>
                <button type="button" className="btn admin-btn-indigo" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }} onClick={handleSaveRbac}>
                  <Check size={15} /> Lưu Cấu Hình Quyền
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 140 }}>Phân Hệ</th>
                    <th>Chức Năng (Use Case)</th>
                    {['CUSTOMER', 'CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].map(rk => (
                      <th key={rk} style={{ textAlign: 'center', width: 128 }}>
                        <div style={{ color: ROLE_META[rk].color }}>{ROLE_META[rk].label}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', marginTop: '2px' }}>
                          {rbacMatrix.filter(r => !!r[rk]).length}/{rbacMatrix.length}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rbacMatrix.map(row => {
                    const gStyle = GROUP_BADGE_STYLES[row.group] || { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
                    return (
                      <tr key={row.id}>
                        <td>
                          <span
                            className="badge"
                            style={{
                              fontSize: '0.71rem',
                              background: gStyle.bg,
                              color: gStyle.color,
                              border: `1px solid ${gStyle.border}`,
                            }}
                          >
                            {row.group}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{row.label}</strong>
                        </td>
                        {['CUSTOMER', 'CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].map(roleKey => {
                          const isChecked = !!row[roleKey];
                          const isCoreProtected = roleKey === 'ADMIN' && (row.id === 'uc-admin-acc' || row.id === 'uc-admin-role');
                          return (
                            <td key={roleKey} style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={isChecked}
                                aria-label={`${row.label} — ${ROLE_META[roleKey].label}`}
                                title={isCoreProtected ? 'Quyền quản trị cốt lõi được bảo vệ' : isChecked ? 'Đang bật — bấm để tắt' : 'Đang tắt — bấm để bật'}
                                onClick={() => handleTogglePermission(row.id, roleKey)}
                                className={`admin-switch${isChecked ? ' is-on' : ''}${isCoreProtected ? ' is-locked' : ''}`}
                                style={isChecked ? { background: ROLE_META[roleKey].color } : undefined}
                              >
                                <span className="admin-switch-thumb">
                                  {isCoreProtected && <Lock size={10} color={ROLE_META[roleKey].color} />}
                                </span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================== 4. PHÊ DUYỆT KẾ HOẠCH NHẬP HÀNG ==================== */}
      {currentTab === 'approve-proposals' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#ffffff' }}>
                <CheckSquare size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Phê Duyệt Kế Hoạch Nhập Hàng Thông Minh</h1>
                <p className="admin-page-subtitle">
                  Thẩm định ngân sách, kiểm tra căn cứ AI Dự báo từ bộ phận Quản lý kho và phê duyệt đơn nhập hàng
                </p>
              </div>
            </div>
            {draftProposals.length > 0 && (
              <button type="button" className="btn btn-emerald" onClick={handleApproveAllDrafts}>
                <Check size={16} /> Phê Duyệt Tất Cả ({draftProposals.length})
              </button>
            )}
          </div>

          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Chờ Admin Duyệt</div>
                  <div className="admin-kpi-value" style={{ color: '#d97706', marginTop: '0.35rem' }}>{draftProposals.length}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
                  <Clock size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Phiếu đang chờ phê duyệt</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Ngân Sách Chờ Duyệt</div>
                  <div className="admin-kpi-value" style={{ color: '#ea580c', marginTop: '0.38rem' }} title={formatVnd(pendingBudgetTotal)}>
                    {pendingBudgetTotal >= 10000000 ? `${formatCompactVnd(pendingBudgetTotal)} đ` : formatVnd(pendingBudgetTotal)}
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Tính theo giá vốn thực tế từng SKU</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Đã Duyệt &amp; Nhập Kho</div>
                  <div className="admin-kpi-value" style={{ color: '#059669', marginTop: '0.35rem' }}>{fulfilledProposals.length}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Giá trị nhập: <strong>{formatCompactVnd(approvedBudgetTotal)} đ</strong></span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Tổng Phiếu Đề Xuất</div>
                  <div className="admin-kpi-value" style={{ color: '#6d28d9', marginTop: '0.35rem' }}>{reorderProposals.length}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                  <Package size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Đã từ chối: <strong>{rejectedProposals.length}</strong> phiếu</span></div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-toolbar">
              <div className="admin-pill-group">
                {[
                  { id: 'ALL', label: 'Tất cả', count: reorderProposals.length },
                  { id: 'DRAFT', label: 'Chờ duyệt', count: draftProposals.length },
                  { id: 'APPROVED', label: 'Đã duyệt & Nhập kho', count: fulfilledProposals.length },
                  { id: 'REJECTED', label: 'Đã từ chối', count: rejectedProposals.length },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setProposalFilter(f.id)}
                    className={`admin-pill-btn${proposalFilter === f.id ? ' is-active' : ''}`}
                  >
                    <span>{f.label}</span>
                    <span className="admin-pill-count">{f.count}</span>
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>
                Hiển thị {filteredProposals.length} phiếu đề xuất
              </span>
            </div>

            <div className="admin-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              {filteredProposals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.75rem 1rem', color: '#64748b' }}>
                  <CheckSquare size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, color: '#334155' }}>Không có phiếu đề xuất nhập hàng nào trong mục này.</div>
                </div>
              ) : (
                filteredProposals.map(prop => {
                  const matchedProd = products.find(p => p.id === prop.productId || p.sku === prop.sku);
                  const estCost = estimateProposalCost(prop);
                  const minStock = Math.max(1, Number(matchedProd?.minStockLevel ?? prop.minStockLevel) || 10);
                  const curStock = Math.max(0, Number(matchedProd?.currentStock ?? prop.currentStock) || 0);
                  const stockRatio = Math.min(100, Math.round((curStock / minStock) * 100));
                  const accentColor = prop.status === 'COMPLETED' || prop.status === 'APPROVED'
                    ? '#059669'
                    : prop.status === 'REJECTED'
                      ? '#dc2626'
                      : '#f59e0b';

                  return (
                    <div
                      key={prop.id}
                      className="admin-proposal-card"
                      style={{ borderLeft: `4px solid ${accentColor}` }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', minWidth: 0 }}>
                        <img
                          src={getProductImage(matchedProd || { name: prop.productName, category: 'Thức ăn' })}
                          alt={prop.productName}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                          style={{
                            width: 66,
                            height: 66,
                            borderRadius: '14px',
                            objectFit: 'contain',
                            background: '#ffffff',
                            padding: '4px',
                            border: '1px solid #e2e8f0',
                            flexShrink: 0,
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                            <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{prop.productName}</strong>
                            <span
                              className={`badge ${prop.status === 'APPROVED' || prop.status === 'COMPLETED' ? 'badge-success' : prop.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}`}
                            >
                              {prop.status === 'DRAFT'
                                ? 'Chờ Admin duyệt'
                                : prop.status === 'APPROVED' || prop.status === 'COMPLETED'
                                  ? 'Đã duyệt & Cộng tồn kho'
                                  : 'Đã từ chối'}
                            </span>
                            {prop.confidenceScore && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  color: '#0369a1',
                                  background: '#f0f9ff',
                                  border: '1px solid #bae6fd',
                                  padding: '2px 9px',
                                  borderRadius: '999px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Brain size={11} /> AI {(prop.confidenceScore * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.55rem' }}>
                            <span>SKU: <strong style={{ color: '#334155' }}>{prop.sku}</strong></span>
                            <span>NCC: <strong style={{ color: '#334155' }}>{matchedProd?.supplierName || prop.suggestedSupplier || 'Chưa phân bổ NCC'}</strong></span>
                            <span>Tồn kho thực tế: <strong style={{ color: curStock <= minStock ? '#dc2626' : '#059669' }}>{curStock}</strong> / min {minStock}</span>
                          </div>

                          {/* Stock deficit indicator */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', maxWidth: 320, marginBottom: '0.6rem' }}>
                            <div className="admin-mini-bar" style={{ height: 6, flex: 1 }}>
                              <div
                                style={{
                                  width: `${stockRatio}%`,
                                  background: stockRatio <= 50 ? '#ef4444' : stockRatio < 100 ? '#f59e0b' : '#10b981',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
                              {stockRatio}% ngưỡng an toàn
                            </span>
                          </div>

                          <div
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              padding: '0.55rem 0.8rem',
                              fontSize: '0.8rem',
                              color: '#334155',
                              lineHeight: 1.45,
                            }}
                          >
                            {prop.reason}
                          </div>
                        </div>
                      </div>

                      <div className="admin-proposal-finance">
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.71rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Số lượng đề xuất
                          </div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669', lineHeight: 1.25, fontVariantNumeric: 'tabular-nums' }}>
                            +{prop.suggestedQuantity} sp
                          </div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ea580c', marginTop: '3px', fontVariantNumeric: 'tabular-nums' }}>
                            Dự chi: {estCost.toLocaleString('vi-VN')} đ
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                            Ngày đặt: {prop.suggestedOrderDate || 'Hôm nay'}
                          </div>
                        </div>

                        {prop.status === 'DRAFT' && (
                          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: '0.45rem 0.8rem', fontSize: '0.78rem', borderRadius: '10px' }}
                              onClick={() => onRejectProposal && onRejectProposal(prop.id)}
                            >
                              <XCircle size={14} /> Từ Chối
                            </button>
                            <button
                              type="button"
                              className="btn btn-emerald"
                              style={{ padding: '0.45rem 0.9rem', fontSize: '0.79rem', borderRadius: '10px' }}
                              onClick={() => onApproveProposal && onApproveProposal(prop.id)}
                            >
                              <Check size={15} /> Phê Duyệt
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
        </>
      )}

      {/* ==================== 5. QUẢN LÝ NHÀ CUNG CẤP ==================== */}
      {currentTab === 'suppliers-admin' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff' }}>
                <Building2 size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Quản Lý Danh Mục Nhà Cung Cấp</h1>
                <p className="admin-page-subtitle">
                  Quản lý hồ sơ đối tác cung ứng thức ăn, phụ kiện, mỹ phẩm Spa và vật tư thú y chính hãng
                </p>
              </div>
            </div>
            <button type="button" className="btn admin-btn-indigo" onClick={openCreateSupplier}>
              <Plus size={16} /> Thêm Nhà Cung Cấp
            </button>
          </div>

          <div className="admin-kpi-grid-3">
            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Tổng Đối Tác NCC</div>
                  <div className="admin-kpi-value" style={{ color: '#0284c7', marginTop: '0.35rem' }}>{suppliers.length}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                  <Building2 size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Đang hợp tác cung ứng</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">Nhóm Hàng Cung Ứng</div>
                  <div className="admin-kpi-value" style={{ color: '#6d28d9', marginTop: '0.35rem' }}>
                    {uniqueSupplierCategories.length}
                  </div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                  <Layers size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Danh mục sản phẩm chủ lực</span></div>
            </div>

            <div className="admin-kpi-card">
              <div className="admin-kpi-top">
                <div>
                  <div className="admin-kpi-label">SKU Đang Quản Lý</div>
                  <div className="admin-kpi-value" style={{ color: '#059669', marginTop: '0.35rem' }}>{products.length}</div>
                </div>
                <div className="admin-kpi-icon-box" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                  <Package size={18} />
                </div>
              </div>
              <div className="admin-kpi-foot"><span>Lead-time chuẩn: {systemConfig.defaultLeadTimeDays} ngày</span></div>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-toolbar">
              <div className="admin-search-box" style={{ minWidth: 200, flex: '1 1 230px', maxWidth: 380 }}>
                <Search size={15} color="#64748b" />
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={e => setSupplierSearch(e.target.value)}
                  placeholder="Tìm tên NCC, người đại diện, SĐT, mặt hàng..."
                />
                {supplierSearch && (
                  <button
                    type="button"
                    onClick={() => setSupplierSearch('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: 0 }}
                    aria-label="Xóa từ khóa tìm nhà cung cấp"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>
                  {filteredSuppliers.length} đối tác
                </span>
                <div className="admin-pill-group">
                  <button
                    type="button"
                    className={`admin-pill-btn${supplierViewMode === 'table' ? ' is-active' : ''}`}
                    onClick={() => setSupplierViewMode('table')}
                    title="Dạng bảng"
                  >
                    <List size={14} /> Bảng
                  </button>
                  <button
                    type="button"
                    className={`admin-pill-btn${supplierViewMode === 'grid' ? ' is-active' : ''}`}
                    onClick={() => setSupplierViewMode('grid')}
                    title="Dạng thẻ"
                  >
                    <LayoutGrid size={14} /> Thẻ
                  </button>
                </div>
              </div>
            </div>

            {supplierViewMode === 'table' ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nhà Cung Cấp</th>
                      <th>Người Đại Diện</th>
                      <th>Thông Tin Liên Hệ</th>
                      <th>Địa Chỉ</th>
                      <th>Mặt Hàng &amp; SKU Thực Tế</th>
                      <th style={{ textAlign: 'right' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                          Không tìm thấy nhà cung cấp phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map(sup => {
                        const supStats = getSupplierLinkedStats(sup);
                        return (
                          <tr key={sup.id}>
                            <td>
                              <div className="admin-cell-identity">
                                <div className="admin-row-avatar" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' }}>
                                  {getInitials(sup.name, 'NC')}
                                </div>
                                <div>
                                  <strong style={{ color: '#0f172a', fontSize: '0.88rem', display: 'block' }}>{sup.name}</strong>
                                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                                    {supStats.skuCount} SKU • {supStats.stockUnits.toLocaleString('vi-VN')} sp tồn
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 600, color: '#334155' }}>{sup.contactPerson || 'Bộ phận kinh doanh'}</td>
                            <td>
                              <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Phone size={12} /> {sup.phone || '—'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                                <Mail size={12} /> {sup.email || '—'}
                              </div>
                            </td>
                            <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={12} /> {sup.address || 'TP. Hồ Chí Minh'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                {supStats.categories.map((tag, i) => (
                                  <span key={i} className="badge badge-info" style={{ fontSize: '0.71rem', padding: '0.2rem 0.58rem' }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="admin-icon-action" onClick={() => openEditSupplier(sup)}>
                                  <Edit3 size={13} /> Sửa
                                </button>
                                <button type="button" className="admin-icon-action is-danger" onClick={() => handleDeleteSupplierClick(sup)} title="Xóa nhà cung cấp">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-panel-body">
                {filteredSuppliers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                    Không tìm thấy nhà cung cấp phù hợp.
                  </div>
                ) : (
                  <div className="admin-grid-2">
                    {filteredSuppliers.map(sup => {
                      const supStats = getSupplierLinkedStats(sup);
                      return (
                        <div
                          key={sup.id}
                          style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '15px',
                            padding: '1.1rem 1.2rem',
                            background: '#fafbff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div className="admin-cell-identity">
                              <div className="admin-row-avatar" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' }}>
                                {getInitials(sup.name, 'NC')}
                              </div>
                              <div>
                                <strong style={{ color: '#0f172a', fontSize: '0.94rem', display: 'block' }}>{sup.name}</strong>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  Đại diện: {sup.contactPerson || 'Bộ phận kinh doanh'} • <strong style={{ color: '#059669' }}>{supStats.skuCount} SKU</strong>
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button type="button" className="admin-icon-action" onClick={() => openEditSupplier(sup)}>
                                <Edit3 size={13} />
                              </button>
                              <button type="button" className="admin-icon-action is-danger" onClick={() => handleDeleteSupplierClick(sup)}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#475569' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Phone size={13} color="#0284c7" /> {sup.phone || '—'}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Mail size={13} color="#64748b" /> {sup.email || '—'}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color="#64748b" /> {sup.address || 'TP. Hồ Chí Minh'}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {supStats.categories.map((tag, i) => (
                              <span key={i} className="badge badge-info" style={{ fontSize: '0.71rem', padding: '0.2rem 0.58rem' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== 6. CẤU HÌNH HỆ THỐNG & NHẬT KÝ HOẠT ĐỘNG ==================== */}
      {currentTab === 'system-settings' && (
        <>
          <div className="admin-page-head">
            <div className="admin-page-title-row">
              <div className="admin-page-icon" style={{ background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)', color: '#ffffff' }}>
                <Settings size={21} />
              </div>
              <div>
                <h1 className="admin-page-title">Cấu Hình Hệ Thống &amp; Nhật Ký Hoạt Động</h1>
                <p className="admin-page-subtitle">
                  Thiết lập tham số vận hành cửa hàng, tùy chỉnh thuật toán AI Dự báo nhập kho và tra cứu nhật ký hệ thống
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSystemConfig} className="admin-grid-2">
            {/* Store & Operations Config */}
            <div className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Settings size={17} color="#0284c7" />
                    <span>1. Thông Số Cửa Hàng &amp; Vận Hành</span>
                  </div>
                  <div className="admin-panel-sub">Thông tin thương hiệu, liên hệ và chính sách giao hàng</div>
                </div>
              </div>

              <div className="admin-panel-body">
                <div className="form-group">
                  <label>Tên Hệ Thống / Thương Hiệu</label>
                  <input
                    className="form-control"
                    value={systemConfig.storeName}
                    onChange={e => setSystemConfig({ ...systemConfig, storeName: e.target.value })}
                  />
                </div>
                <div className="admin-grid-2" style={{ gap: '0.85rem' }}>
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
                <div className="admin-grid-2" style={{ gap: '0.85rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Ngưỡng Freeship</label>
                    <div className="admin-input-unit-wrap">
                      <input
                        type="number"
                        className="form-control"
                        value={systemConfig.freeShipThreshold}
                        onChange={e => setSystemConfig({ ...systemConfig, freeShipThreshold: Number(e.target.value) })}
                      />
                      <span className="admin-input-unit">VNĐ</span>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Phí Giao Hỏa Tốc 2H</label>
                    <div className="admin-input-unit-wrap">
                      <input
                        type="number"
                        className="form-control"
                        value={systemConfig.expressShipFee}
                        onChange={e => setSystemConfig({ ...systemConfig, expressShipFee: Number(e.target.value) })}
                      />
                      <span className="admin-input-unit">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Demand Forecasting Parameters */}
            <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="admin-panel-head">
                <div>
                  <div className="admin-panel-title">
                    <Brain size={17} color="#059669" />
                    <span>2. Tham Số Thuật Toán AI Dự Báo &amp; Nhập Hàng</span>
                  </div>
                  <div className="admin-panel-sub">Cấu hình mức tin cậy Z-Score, Lead-time và tồn kho an toàn</div>
                </div>
              </div>

              <div className="admin-panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
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

                  <div className="admin-grid-2" style={{ gap: '0.85rem' }}>
                    <div className="form-group">
                      <label>Lead-Time Giao Hàng Mặc Định</label>
                      <div className="admin-input-unit-wrap">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="form-control"
                          value={systemConfig.defaultLeadTimeDays}
                          onChange={e => setSystemConfig({ ...systemConfig, defaultLeadTimeDays: Number(e.target.value) })}
                        />
                        <span className="admin-input-unit">ngày</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Hệ Số Dự Phòng Safety Stock</label>
                      <div className="admin-input-unit-wrap">
                        <input
                          type="number"
                          min="5"
                          max="100"
                          className="form-control"
                          value={systemConfig.safetyStockRatio}
                          onChange={e => setSystemConfig({ ...systemConfig, safetyStockRatio: Number(e.target.value) })}
                        />
                        <span className="admin-input-unit">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Live AI Policy Preview */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0.75rem 0.95rem',
                      marginBottom: '0.9rem',
                      fontSize: '0.77rem',
                      color: '#475569',
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span>Công thức áp dụng: <strong style={{ color: '#0f172a' }}>ROP = D̄ × {systemConfig.defaultLeadTimeDays} + ({zScoreValue} × σ × √{systemConfig.defaultLeadTimeDays})</strong></span>
                    <span style={{ color: '#059669', fontWeight: 800 }}>Độ phủ {systemConfig.aiConfidenceLevel}%</span>
                  </div>

                  {/* Styled Toggle Switch */}
                  <div
                    className={`admin-setting-toggle${systemConfig.autoLowStockAlert ? ' is-enabled' : ''}`}
                    onClick={() => setSystemConfig({ ...systemConfig, autoLowStockAlert: !systemConfig.autoLowStockAlert })}
                  >
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: systemConfig.autoLowStockAlert ? '#166534' : '#334155' }}>
                        Tự động cảnh báo tồn kho thấp
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Gợi ý tạo phiếu đề xuất khi tồn kho chạm hoặc thấp hơn minStock
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!systemConfig.autoLowStockAlert}
                      className={`admin-switch${systemConfig.autoLowStockAlert ? ' is-on' : ''}`}
                      style={systemConfig.autoLowStockAlert ? { background: '#059669', flexShrink: 0 } : { flexShrink: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSystemConfig({ ...systemConfig, autoLowStockAlert: !systemConfig.autoLowStockAlert });
                      }}
                    >
                      <span className="admin-switch-thumb" />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <button type="submit" className="btn admin-btn-indigo">
                    <Check size={16} /> Lưu Toàn Bộ Cấu Hình
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* SYSTEM AUDIT LOGS */}
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <div className="admin-panel-title">
                  <Clock size={18} color="#6d28d9" />
                  <span>3. Nhật Ký Hoạt Động Hệ Thống (Audit Logs)</span>
                </div>
                <div className="admin-panel-sub">
                  Ghi nhận lịch sử thay đổi tài khoản, phân quyền, phê duyệt nhập kho và cấu hình
                </div>
              </div>
              {onClearAuditLogs && auditLogs.length > 0 && (
                <button type="button" className="admin-icon-action is-danger" onClick={onClearAuditLogs}>
                  <Trash2 size={13} /> Xóa nhật ký
                </button>
              )}
            </div>

            <div className="admin-toolbar">
              <div className="admin-pill-group">
                {[
                  { id: 'ALL', label: 'Tất cả', count: combinedAuditLogs.length },
                  { id: 'ACCOUNT', label: 'Tài khoản', count: combinedAuditLogs.filter(l => l.category === 'ACCOUNT').length },
                  { id: 'SECURITY', label: 'Phân quyền', count: combinedAuditLogs.filter(l => l.category === 'SECURITY').length },
                  { id: 'INVENTORY', label: 'Kho & Đơn hàng', count: combinedAuditLogs.filter(l => l.category === 'INVENTORY').length },
                  { id: 'SYSTEM', label: 'Hệ thống & Lịch hẹn', count: combinedAuditLogs.filter(l => l.category === 'SYSTEM').length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAuditFilter(tab.id)}
                    className={`admin-pill-btn${auditFilter === tab.id ? ' is-active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span className="admin-pill-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>
                {filteredAuditLogs.length} bản ghi
              </span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
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
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                        Chưa có bản ghi nhật ký nào.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map(log => {
                      const meta = AUDIT_CATEGORY_META[log.category] || AUDIT_CATEGORY_META.SYSTEM;
                      return (
                        <tr key={log.id}>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                            {log.time}
                          </td>
                          <td>
                            <span className={`badge ${meta.badge}`}>
                              {log.category}
                            </span>
                          </td>
                          <td><strong style={{ color: '#0f172a' }}>{log.actor}</strong></td>
                          <td><strong style={{ color: '#1e293b' }}>{log.action}</strong></td>
                          <td style={{ fontSize: '0.83rem', color: '#475569' }}>{log.detail}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================== MODAL: THÊM / SỬA TÀI KHOẢN ==================== */}
      {showUserModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowUserModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-page-icon" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff' }}>
                  <Shield size={19} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
                    {editingUser ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {editingUser ? 'Cập nhật thông tin hồ sơ, vai trò hoặc đặt lại mật khẩu' : 'Khởi tạo tài khoản nội bộ hoặc khách hàng mới trên hệ thống'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setShowUserModal(false)} className="admin-modal-close" aria-label="Đóng hộp thoại">
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

              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
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
                    style={editingUser ? { opacity: 0.7, cursor: 'not-allowed', background: '#f8fafc' } : undefined}
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

              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
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
                    placeholder={editingUser ? 'Để trống nếu không đổi' : 'Nhập mật khẩu (VD: 123456)'}
                    required={!editingUser}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Hủy</button>
                <button type="submit" className="btn admin-btn-indigo">
                  <Check size={15} /> {editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / SỬA NHÀ CUNG CẤP ==================== */}
      {showSupplierModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSupplierModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 540 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-page-icon" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#ffffff' }}>
                  <Building2 size={19} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
                    {editingSupplier ? 'Cập Nhật Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Lưu trữ thông tin liên hệ và danh mục sản phẩm cung ứng chính hãng
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setShowSupplierModal(false)} className="admin-modal-close" aria-label="Đóng hộp thoại">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier}>
              <div className="form-group">
                <label>Tên Nhà Cung Cấp *</label>
                <input
                  className="form-control"
                  value={supplierForm.name}
                  onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="Nhập tên công ty / nhà cung cấp"
                  required
                />
              </div>
              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
                <div className="form-group">
                  <label>Người Đại Diện</label>
                  <input
                    className="form-control"
                    value={supplierForm.contactPerson}
                    onChange={e => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    placeholder="Họ tên người phụ trách"
                  />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input
                    className="form-control"
                    value={supplierForm.phone}
                    onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    placeholder="Số điện thoại liên hệ"
                  />
                </div>
              </div>
              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={supplierForm.email}
                    onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    placeholder="Email đối tác"
                  />
                </div>
                <div className="form-group">
                  <label>Mặt Hàng Cung Ứng</label>
                  <input
                    className="form-control"
                    value={supplierForm.productCategories}
                    onChange={e => setSupplierForm({ ...supplierForm, productCategories: e.target.value })}
                    placeholder="VD: Thức ăn hạt, Pate, Y tế"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Địa Chỉ</label>
                <input
                  className="form-control"
                  value={supplierForm.address}
                  onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  placeholder="Địa chỉ trụ sở / kho hàng"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>Hủy</button>
                <button type="submit" className="btn admin-btn-indigo">
                  <Check size={15} /> {editingSupplier ? 'Lưu Thay Đổi' : 'Thêm Nhà Cung Cấp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / SỬA SẢN PHẨM KHO ==================== */}
      {showAdminProductModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAdminProductModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 580 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-page-icon" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)', color: '#ffffff' }}>
                  <Package size={19} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
                    {editingAdminProduct ? 'Cập Nhật Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Kho'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Đồng bộ trực tiếp với Cửa hàng Pet Shop và hệ thống dự báo tồn kho AI
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setShowAdminProductModal(false)} className="admin-modal-close" aria-label="Đóng hộp thoại">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAdminProduct}>
              <div className="form-group">
                <label>Tên Sản Phẩm *</label>
                <input
                  className="form-control"
                  value={adminProductForm.name}
                  onChange={e => setAdminProductForm({ ...adminProductForm, name: e.target.value })}
                  placeholder="VD: Hạt Royal Canin Indoor 27 (2kg)"
                  required
                />
              </div>

              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
                <div className="form-group">
                  <label>Mã SKU (để trống tự sinh)</label>
                  <input
                    className="form-control"
                    value={adminProductForm.sku}
                    onChange={e => setAdminProductForm({ ...adminProductForm, sku: e.target.value })}
                    placeholder="VD: RC-INDOOR-2KG"
                  />
                </div>
                <div className="form-group">
                  <label>Danh Mục *</label>
                  <select
                    className="form-control"
                    value={adminProductForm.category}
                    onChange={e => setAdminProductForm({ ...adminProductForm, category: e.target.value })}
                  >
                    {allProductCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
                <div className="form-group">
                  <label>Giá Bán Lẻ Niêm Yết *</label>
                  <div className="admin-input-unit-wrap">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      className="form-control"
                      value={adminProductForm.unitPrice}
                      onChange={e => setAdminProductForm({ ...adminProductForm, unitPrice: e.target.value })}
                      required
                    />
                    <span className="admin-input-unit">VNĐ</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Giá Vốn Nhập Kho *</label>
                  <div className="admin-input-unit-wrap">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      className="form-control"
                      value={adminProductForm.costPrice}
                      onChange={e => setAdminProductForm({ ...adminProductForm, costPrice: e.target.value })}
                      required
                    />
                    <span className="admin-input-unit">VNĐ</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.8rem' }}>
                <div className="form-group">
                  <label>Tồn Kho Hiện Tại</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={adminProductForm.currentStock}
                    onChange={e => setAdminProductForm({ ...adminProductForm, currentStock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ngưỡng Min Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={adminProductForm.minStockLevel}
                    onChange={e => setAdminProductForm({ ...adminProductForm, minStockLevel: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Định Mức Max Stock</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={adminProductForm.maxStockLevel}
                    onChange={e => setAdminProductForm({ ...adminProductForm, maxStockLevel: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nhà Cung Cấp Đối Tác</label>
                <select
                  className="form-control"
                  value={adminProductForm.supplierName}
                  onChange={e => setAdminProductForm({ ...adminProductForm, supplierName: e.target.value })}
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  {!suppliers.some(s => s.name === adminProductForm.supplierName) && (
                    <option value={adminProductForm.supplierName}>{adminProductForm.supplierName}</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdminProductModal(false)}>Hủy</button>
                <button type="submit" className="btn admin-btn-indigo">
                  <Check size={15} /> {editingAdminProduct ? 'Lưu Sản Phẩm' : 'Thêm Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: NHẬP / XUẤT / KIỂM KÊ TỒN KHO ==================== */}
      {stockModalProduct && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setStockModalProduct(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 510 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-page-icon" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)', color: '#ffffff' }}>
                  <ArrowUpDown size={19} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    Điều Chỉnh Giao Dịch Kho
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {stockModalProduct.name} (SKU: <strong>{stockModalProduct.sku}</strong>)
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setStockModalProduct(null)} className="admin-modal-close" aria-label="Đóng hộp thoại">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitAdminStock}>
              <div className="admin-tx-type-grid">
                <button
                  type="button"
                  className={`admin-tx-type-btn${adminStockForm.type === 'IN' ? ' is-in' : ''}`}
                  onClick={() => setAdminStockForm({ ...adminStockForm, type: 'IN', quantity: 10 })}
                >
                  <span>+ Nhập Kho</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Tăng tồn thực tế</span>
                </button>
                <button
                  type="button"
                  className={`admin-tx-type-btn${adminStockForm.type === 'OUT' ? ' is-out' : ''}`}
                  onClick={() => setAdminStockForm({ ...adminStockForm, type: 'OUT', quantity: 1 })}
                >
                  <span>− Xuất Kho</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Xuất nội bộ / hủy</span>
                </button>
                <button
                  type="button"
                  className={`admin-tx-type-btn${adminStockForm.type === 'ADJUSTMENT' ? ' is-adj' : ''}`}
                  onClick={() => setAdminStockForm({ ...adminStockForm, type: 'ADJUSTMENT', quantity: Number(stockModalProduct.currentStock) || 0 })}
                >
                  <span>= Kiểm Kê</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Chốt số thực tế</span>
                </button>
              </div>

              <div className="form-group">
                <label>
                  {adminStockForm.type === 'IN'
                    ? 'Số Lượng Nhập Thêm *'
                    : adminStockForm.type === 'OUT'
                      ? 'Số Lượng Xuất Kho *'
                      : 'Số Tồn Kho Thực Tế Sau Kiểm Kê *'}
                </label>
                <input
                  type="number"
                  min={adminStockForm.type === 'ADJUSTMENT' ? 0 : 1}
                  className="form-control"
                  value={adminStockForm.quantity}
                  onChange={e => setAdminStockForm({ ...adminStockForm, quantity: e.target.value })}
                  required
                />
              </div>

              {adminStockForm.type === 'ADJUSTMENT' && (
                <div className="admin-grid-2" style={{ gap: '0.85rem' }}>
                  <div className="form-group">
                    <label>Ngưỡng Min Stock</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={adminStockForm.minStockLevel}
                      onChange={e => setAdminStockForm({ ...adminStockForm, minStockLevel: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Định Mức Max Stock</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={adminStockForm.maxStockLevel}
                      onChange={e => setAdminStockForm({ ...adminStockForm, maxStockLevel: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Live stock delta preview */}
              <div style={{ padding: '0.75rem 0.95rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: '#475569' }}>Tồn hiện tại: <strong>{stockModalProduct.currentStock} sp</strong></span>
                <span style={{ color: '#0f172a', fontWeight: 800 }}>
                  Sau giao dịch:{' '}
                  <strong style={{ color: '#059669' }}>
                    {adminStockForm.type === 'IN'
                      ? (Number(stockModalProduct.currentStock) || 0) + (parseInt(adminStockForm.quantity, 10) || 0)
                      : adminStockForm.type === 'OUT'
                        ? Math.max(0, (Number(stockModalProduct.currentStock) || 0) - (parseInt(adminStockForm.quantity, 10) || 0))
                        : Math.max(0, parseInt(adminStockForm.quantity, 10) || 0)}{' '}
                    sp
                  </strong>
                </span>
              </div>

              <div className="form-group">
                <label>Ghi Chú / Chứng Từ Giao Dịch (lưu vào Nhật Ký Hệ Thống)</label>
                <input
                  className="form-control"
                  value={adminStockForm.note}
                  onChange={e => setAdminStockForm({ ...adminStockForm, note: e.target.value })}
                  placeholder="VD: Nhập bổ sung lô hàng mới từ NCC / Kiểm kê định kỳ"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStockModalProduct(null)}>Hủy</button>
                <button type="submit" className="btn btn-emerald">
                  <Check size={15} /> Xác Nhận Cập Nhật Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / SỬA GÓI DỊCH VỤ CHĂM SÓC ==================== */}
      {showAdminServiceModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAdminServiceModal(false); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 540 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-page-icon" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)', color: '#ffffff' }}>
                  <Scissors size={19} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
                    {editingAdminService ? 'Chỉnh Sửa Gói Dịch Vụ' : 'Thêm Gói Dịch Vụ Chăm Sóc Mới'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Hiển thị trực tiếp tại trang Đặt Lịch Dịch Vụ của khách hàng &amp; quầy Nhân viên
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setShowAdminServiceModal(false)} className="admin-modal-close" aria-label="Đóng hộp thoại">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAdminService}>
              <div className="form-group">
                <label>Tên Gói Dịch Vụ *</label>
                <input
                  className="form-control"
                  value={adminServiceForm.name}
                  onChange={e => setAdminServiceForm({ ...adminServiceForm, name: e.target.value })}
                  placeholder="VD: Spa Grooming Trọn Gói (Cắt tỉa & Tắm mượt 7 bước)"
                  required
                />
              </div>

              <div className="admin-grid-2" style={{ gap: '0.9rem' }}>
                <div className="form-group">
                  <label>Chuyên Mục Dịch Vụ *</label>
                  <select
                    className="form-control"
                    value={adminServiceForm.category}
                    onChange={e => setAdminServiceForm({ ...adminServiceForm, category: e.target.value })}
                  >
                    {STANDARD_SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Thời Lượng Thực Hiện *</label>
                  <div className="admin-input-unit-wrap">
                    <input
                      type="number"
                      min="5"
                      step="5"
                      className="form-control"
                      value={adminServiceForm.durationMinutes}
                      onChange={e => setAdminServiceForm({ ...adminServiceForm, durationMinutes: e.target.value })}
                      required
                    />
                    <span className="admin-input-unit">phút</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Giá Niêm Yết Công Khai *</label>
                <div className="admin-input-unit-wrap">
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    className="form-control"
                    value={adminServiceForm.price}
                    onChange={e => setAdminServiceForm({ ...adminServiceForm, price: e.target.value })}
                    required
                  />
                  <span className="admin-input-unit">VNĐ</span>
                </div>
              </div>

              <div className="form-group">
                <label>Mô Tả Quy Trình &amp; Quyền Lợi Khách Hàng</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={adminServiceForm.description}
                  onChange={e => setAdminServiceForm({ ...adminServiceForm, description: e.target.value })}
                  placeholder="Mô tả chi tiết các bước thực hiện, sản phẩm sử dụng hoặc cam kết an toàn..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.15rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAdminServiceModal(false)}>Hủy</button>
                <button type="submit" className="btn admin-btn-indigo">
                  <Check size={15} /> {editingAdminService ? 'Lưu Dịch Vụ' : 'Tạo Gói Dịch Vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
