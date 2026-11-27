import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CustomerPortal from './components/CustomerPortal';
import CareStaffDashboard from './components/CareStaffDashboard';
import WarehouseDashboard from './components/WarehouseDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import StaffLoginModal from './components/StaffLoginModal';
import ToastContainer, { toast, confirmModal } from './components/ToastNotification';
import FloatingContactWidget from './components/FloatingContactWidget';

import { apiService } from './apiService';
import { parseCustomerUrl, getPathForCustomerTab, applyPageSEO } from './seoManager';
import { 
  INITIAL_PETS, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_PROMOTIONS,
  INITIAL_REORDER_PROPOSALS,
  INITIAL_USERS,
  INITIAL_SUPPLIERS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS
} from './mockData';

const STAFF_ROLES = ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'];
const LEGACY_MOCK_ORDER_IDS = new Set(['ORD-001', 'ORD-002']);
const LEGACY_MOCK_LOG_IDS = new Set(['log-1', 'log-2', 'log-3']);
const isMongoObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id || ''));

const normalizeServiceList = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .filter((s) => s && s.category !== 'Khách Sạn & Lưu Trú')
    .map((s) =>
      s.category === 'Khoa Sinh Sản' || s.category === 'Khám Bệnh'
        ? { ...s, category: 'Khám Bệnh & Trị Liệu' }
        : s
    );
};

const getSupplierCategoryOverrides = () => {
  try {
    const raw = localStorage.getItem('petcare_supplier_category_overrides');
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const normalizeProductList = (list, suppliersList = []) => {
  if (!Array.isArray(list)) return [];
  const supById = new Map(
    (Array.isArray(suppliersList) ? suppliersList : []).map((s) => [s.id, s])
  );
  return list.filter(Boolean).map((p) => {
    const unitPrice = Number(p.unitPrice) || 0;
    const costPrice = Number(p.costPrice) || Math.round(unitPrice * 0.65);
    const resolvedSupName =
      p.supplier?.name ||
      (p.supplierId && supById.get(p.supplierId)?.name) ||
      p.supplierName ||
      'Chưa phân bổ NCC';
    return {
      ...p,
      unitPrice,
      costPrice,
      currentStock: Number(p.currentStock ?? 0),
      minStockLevel: Number(p.minStockLevel ?? 10),
      maxStockLevel: Number(p.maxStockLevel ?? 100),
      supplierId: p.supplierId || p.supplier?.id || null,
      supplierName: resolvedSupName,
    };
  });
};

const normalizeSupplierList = (list, productsList = [], overrides = getSupplierCategoryOverrides()) => {
  if (!Array.isArray(list)) return [];
  const prods = Array.isArray(productsList) ? productsList : [];
  return list.filter(Boolean).map((s) => {
    const linkedProducts = prods.filter(
      (p) =>
        (p.supplierId && p.supplierId === s.id) ||
        (p.supplier?.id && p.supplier.id === s.id) ||
        (p.supplierName && s.name && p.supplierName.toLowerCase() === s.name.toLowerCase())
    );
    const derivedCategories = Array.from(
      new Set(linkedProducts.map((p) => p.category).filter(Boolean))
    ).join(', ');
    const customOverride = overrides?.[s.id] || overrides?.[s.name];
    return {
      ...s,
      productCategories:
        (customOverride && String(customOverride).trim()) ||
        (s.productCategories && String(s.productCategories).trim()) ||
        derivedCategories ||
        'Chưa gán sản phẩm',
      linkedSkuCount: linkedProducts.length,
      linkedStockUnits: linkedProducts.reduce((sum, p) => sum + (Number(p.currentStock) || 0), 0),
    };
  });
};

const normalizePetList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean).map((p) => ({
    ...p,
    ownerName: p.owner?.fullName || p.ownerName || 'Khách hàng',
    ownerPhone: p.owner?.phone || p.ownerPhone || '',
    ownerEmail: p.owner?.email || p.ownerEmail || '',
  }));
};

const normalizeAppointmentList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean).map((a) => {
    const rawDate = a.appointmentDate || a.createdAt || '';
    const dateStr =
      typeof rawDate === 'string' && rawDate.includes('T')
        ? rawDate.split('T')[0]
        : rawDate instanceof Date
          ? rawDate.toISOString().split('T')[0]
          : String(rawDate || '');
    const resolvedPrice = Number(a.totalPrice ?? a.price ?? a.service?.price) || 0;
    return {
      ...a,
      rawAppointmentDate: rawDate,
      appointmentDate: dateStr,
      petName: a.pet?.name || a.petName || 'Thú cưng',
      species: a.pet?.species || a.species || 'Chó',
      customerName: a.customer?.fullName || a.customerName || 'Khách hàng',
      customerPhone: a.customer?.phone || a.customerPhone || '',
      serviceName: a.service?.name || a.serviceName || 'Dịch vụ chăm sóc',
      serviceCategory: a.service?.category || a.serviceCategory || 'Spa & Grooming',
      price: resolvedPrice,
      totalPrice: resolvedPrice,
      staffName: a.staff?.fullName || a.staffName || null,
    };
  });
};

const normalizeOrderList = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .filter((o) => o && !LEGACY_MOCK_ORDER_IDS.has(o.id))
    .map((o) => {
      const rawItems = Array.isArray(o.items)
        ? o.items
        : Array.isArray(o.rawItems)
          ? o.rawItems
          : [];
      const itemsText = Array.isArray(o.items)
        ? o.items
            .map((it) => `${it.product?.name || it.name || 'Sản phẩm'} x ${it.quantity}`)
            .join(', ')
        : String(o.items || 'Sản phẩm Pet Shop');
      const totalUnitsSold =
        rawItems.length > 0
          ? rawItems.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
          : (itemsText.match(/x\s*(\d+)/gi) || []).reduce(
              (sum, m) => sum + (parseInt(m.replace(/[^0-9]/g, ''), 10) || 0),
              0
            );
      const amount = Number(o.totalAmount ?? o.total) || 0;
      const formattedDate = o.createdAt
        ? new Date(o.createdAt).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : o.date || '';
      return {
        ...o,
        rawItems,
        items: itemsText,
        totalUnitsSold,
        customerName: o.customer?.fullName || o.customerName || 'Khách mua hàng',
        phone: o.customer?.phone || o.phone || '',
        total: amount,
        totalAmount: amount,
        date: formattedDate,
      };
    });
};

const normalizeProposalList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean).map((prop) => {
    const unitPrice = Number(prop.product?.unitPrice ?? prop.unitPrice ?? 0);
    const costPrice =
      Number(prop.product?.costPrice ?? prop.costPrice) || Math.round(unitPrice * 0.65);
    return {
      ...prop,
      productName: prop.product?.name || prop.productName || 'Sản phẩm kho',
      sku: prop.product?.sku || prop.sku || 'SKU',
      category: prop.product?.category || prop.category || 'Thức ăn',
      currentStock: Number(prop.product?.currentStock ?? prop.currentStock ?? 0),
      minStockLevel: Number(prop.product?.minStockLevel ?? prop.minStockLevel ?? 10),
      maxStockLevel: Number(prop.product?.maxStockLevel ?? prop.maxStockLevel ?? 100),
      unitPrice,
      costPrice,
      suggestedSupplier:
        prop.product?.supplier?.name || prop.suggestedSupplier || 'Chưa phân bổ NCC',
      suggestedOrderDate:
        prop.suggestedOrderDate ||
        (prop.createdAt ? String(prop.createdAt).split('T')[0] : new Date().toISOString().split('T')[0]),
    };
  });
};

const getUrlPortalConfig = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const search = typeof window !== 'undefined' ? window.location.search.toLowerCase() : '';
  const port = typeof window !== 'undefined' ? window.location.port : '3000';

  if (path.startsWith('/admin') || path.startsWith('/staff') || search.includes('portal=admin') || port === '3001' || port === '3002') {
    return {
      portalMode: 'STAFF',
      isStaffUrl: true
    };
  }
  return {
    portalMode: 'CUSTOMER',
    isStaffUrl: false
  };
};

export default function App() {
  const getDeletedProductIds = () => {
    try {
      const saved = localStorage.getItem('petcare_deleted_product_ids');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getInitialState = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed !== null && parsed !== undefined) return parsed;
      }
      return defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const urlConfig = getUrlPortalConfig();
  const isStaffUrl = urlConfig.isStaffUrl;

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storageKey = isStaffUrl ? 'petcare_staff_user' : 'petcare_customer_user';
      const tokenKey = isStaffUrl ? 'petcare_staff_token' : 'petcare_customer_token';
      const saved = localStorage.getItem(storageKey);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const isValidForPortal = isStaffUrl
        ? parsed && STAFF_ROLES.includes(parsed.role)
        : parsed && parsed.role === 'CUSTOMER';
      if (!isValidForPortal) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(tokenKey);
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    try {
      const storageKey = isStaffUrl ? 'petcare_staff_token' : 'petcare_customer_token';
      return localStorage.getItem(storageKey) || null;
    } catch (e) {
      return null;
    }
  });
  
  // Portal Navigation State ('CUSTOMER' or 'STAFF')
  const [portalMode, setPortalMode] = useState(() => isStaffUrl ? 'STAFF' : 'CUSTOMER');

  const [activeRole, setActiveRole] = useState(() => {
    if (isStaffUrl) return currentUser && STAFF_ROLES.includes(currentUser.role) ? currentUser.role : 'ADMIN';
    return 'CUSTOMER';
  });

  const ROLE_VALID_TABS = {
    ADMIN: ['overview', 'reports-admin', 'catalog-admin', 'accounts-admin', 'roles-admin', 'approve-proposals', 'suppliers-admin', 'system-settings'],
    CARE_STAFF: ['queue', 'orders-mgmt', 'history-logs', 'services', 'promotions', 'pets-logs', 'reports'],
    WAREHOUSE_STAFF: ['inventory', 'products-mgmt', 'demand-forecast', 'reorder-proposals'],
    CUSTOMER: ['home', 'about', 'booking', 'service-detail', 'cart', 'shop', 'product-detail', 'checkout', 'pets', 'history', 'profile', 'reproduction'],
  };

  const getDefaultTabForRole = (role) => {
    if (role === 'ADMIN') return 'overview';
    if (role === 'CARE_STAFF') return 'queue';
    if (role === 'WAREHOUSE_STAFF') return 'inventory';
    return 'home';
  };

  const getSafeTabForRole = (role, candidate) => {
    const valid = ROLE_VALID_TABS[role] || [];
    if (candidate && valid.includes(candidate)) return candidate;
    return getDefaultTabForRole(role);
  };

  const initialRole = currentUser?.role || (isStaffUrl ? 'ADMIN' : 'CUSTOMER');

  const initialParsedUrl =
    !isStaffUrl && typeof window !== 'undefined'
      ? parseCustomerUrl(window.location.pathname)
      : { tab: null, productId: null, serviceId: null };

  const [selectedProductId, setSelectedProductId] = useState(() => initialParsedUrl.productId);
  const [selectedServiceId, setSelectedServiceId] = useState(() => initialParsedUrl.serviceId);

  const [activeTab, setActiveTab] = useState(() => {
    if (!isStaffUrl && typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/') {
      return getSafeTabForRole(initialRole, initialParsedUrl.tab);
    }
    const saved = getInitialState('petcare_activeTab_' + initialRole, null);
    return getSafeTabForRole(initialRole, saved);
  });

  const handleOpenProductDetail = (product) => {
    if (!product) return;
    setSelectedProductId(product.id);
    setActiveTab('product-detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenServiceDetail = (service) => {
    if (!service) return;
    setSelectedServiceId(service.id);
    setActiveTab('service-detail');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showStaffLoginModal, setShowStaffLoginModal] = useState(false);
  const [profileModalSignal, setProfileModalSignal] = useState(0);
  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('petcare_admin_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleToggleAdminSidebar = () => {
    setAdminSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('petcare_admin_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Persistent shopping cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('petcare_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('petcare_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Handle URL path changes & Admin URL detection (/admin)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const isStaff = path.startsWith('/admin') || path.startsWith('/staff') || window.location.search.includes('portal=admin');
      
      if (isStaff) {
        setPortalMode('STAFF');
        try {
          const savedStaff = localStorage.getItem('petcare_staff_user');
          const savedStaffToken = localStorage.getItem('petcare_staff_token');
          const parsed = savedStaff ? JSON.parse(savedStaff) : null;
          if (parsed && STAFF_ROLES.includes(parsed.role)) {
            setCurrentUser(parsed);
            setAuthToken(savedStaffToken || null);
            setActiveRole(parsed.role);
          } else {
            localStorage.removeItem('petcare_staff_user');
            localStorage.removeItem('petcare_staff_token');
            setCurrentUser(null);
            setAuthToken(null);
          }
        } catch (e) {}
      } else {
        setPortalMode('CUSTOMER');
        const parsedUrl = parseCustomerUrl(window.location.pathname);
        setSelectedProductId(parsedUrl.productId);
        setSelectedServiceId(parsedUrl.serviceId);
        setActiveTab(parsedUrl.tab);
        try {
          const savedCust = localStorage.getItem('petcare_customer_user');
          const savedCustToken = localStorage.getItem('petcare_customer_token');
          const parsed = savedCust ? JSON.parse(savedCust) : null;
          if (parsed && parsed.role === 'CUSTOMER') {
            setCurrentUser(parsed);
            setAuthToken(savedCustToken || null);
            setActiveRole('CUSTOMER');
          } else {
            localStorage.removeItem('petcare_customer_user');
            localStorage.removeItem('petcare_customer_token');
            setCurrentUser(null);
            setAuthToken(null);
            setActiveRole('CUSTOMER');
          }
        } catch (e) {}
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Sync and strictly isolate Customer portal (/) vs Internal portal (/admin, /staff)
  useEffect(() => {
    if (!currentUser) return;
    const { isStaffUrl: onStaffPath } = getUrlPortalConfig();
    if (STAFF_ROLES.includes(currentUser.role)) {
      if (!onStaffPath) {
        try {
          localStorage.removeItem('petcare_customer_user');
          localStorage.removeItem('petcare_customer_token');
        } catch (e) {}
        setCurrentUser(null);
        setAuthToken(null);
        setPortalMode('CUSTOMER');
        setActiveRole('CUSTOMER');
        return;
      }
      setPortalMode('STAFF');
      setActiveRole(currentUser.role);
    } else {
      if (onStaffPath) {
        try {
          localStorage.removeItem('petcare_staff_user');
          localStorage.removeItem('petcare_staff_token');
        } catch (e) {}
        setCurrentUser(null);
        setAuthToken(null);
        setPortalMode('STAFF');
        setActiveRole('ADMIN');
        return;
      }
      setPortalMode('CUSTOMER');
      setActiveRole('CUSTOMER');
    }
  }, [currentUser]);

  // Ensure activeTab always belongs to current activeRole, persist valid tab & sync SEO URL
  useEffect(() => {
    if (!activeRole) return;
    const safeTab = getSafeTabForRole(activeRole, activeTab);
    if (safeTab !== activeTab) {
      setActiveTab(safeTab);
      return;
    }
    localStorage.setItem('petcare_activeTab_' + activeRole, JSON.stringify(safeTab));

    if (portalMode === 'CUSTOMER' && typeof window !== 'undefined') {
      const targetPath = getPathForCustomerTab(safeTab, selectedProductId, selectedServiceId);
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (currentPath !== targetPath && !currentPath.startsWith('/admin') && !currentPath.startsWith('/staff')) {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, [activeTab, activeRole, portalMode, selectedProductId, selectedServiceId]);

  // Persist authenticated user session across page refreshes (F5)
  useEffect(() => { 
    if (currentUser) {
      try {
        if (['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role)) {
          localStorage.setItem('petcare_staff_user', JSON.stringify(currentUser));
        } else {
          localStorage.setItem('petcare_customer_user', JSON.stringify(currentUser));
        }
      } catch (e) {}
    }
  }, [currentUser]);

  useEffect(() => { 
    if (authToken) {
      try {
        if (currentUser && ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role)) {
          localStorage.setItem('petcare_staff_token', authToken);
        } else {
          localStorage.setItem('petcare_customer_token', authToken);
        }
      } catch (e) {}
    }
  }, [authToken]);
  
  // Core Data State — đồng bộ 100% dữ liệu thật trực tiếp từ MongoDB (chỉ fallback khi offline)
  const [users, setUsers] = useState(() => {
    const raw = getInitialState('petcare_users', []);
    return Array.isArray(raw) ? raw : [];
  });
  const [pets, setPets] = useState(() => {
    const raw = getInitialState('petcare_pets', []);
    return Array.isArray(raw) ? normalizePetList(raw.filter((p) => isMongoObjectId(p?.id))) : [];
  });
  const [services, setServices] = useState(() => {
    const raw = getInitialState('petcare_services', []);
    return Array.isArray(raw) ? normalizeServiceList(raw.filter((s) => isMongoObjectId(s?.id))) : [];
  });
  const [appointments, setAppointments] = useState(() => {
    const raw = getInitialState('petcare_appointments', []);
    return Array.isArray(raw) ? normalizeAppointmentList(raw.filter((a) => isMongoObjectId(a?.id))) : [];
  });
  const [products, setProducts] = useState(() => {
    const raw = getInitialState('petcare_products', []);
    return Array.isArray(raw) ? normalizeProductList(raw.filter((p) => isMongoObjectId(p?.id))) : [];
  });
  const [promotions, setPromotions] = useState(() => getInitialState('petcare_promotions', INITIAL_PROMOTIONS));
  const [reorderProposals, setReorderProposals] = useState(() => {
    const raw = getInitialState('petcare_reorderProposals', []);
    return Array.isArray(raw) ? normalizeProposalList(raw.filter((p) => isMongoObjectId(p?.id))) : [];
  });
  const [suppliers, setSuppliers] = useState(() => {
    const raw = getInitialState('petcare_suppliers', []);
    return Array.isArray(raw) ? normalizeSupplierList(raw.filter((s) => isMongoObjectId(s?.id))) : [];
  });
  const [reviews, setReviews] = useState(() => {
    const raw = getInitialState('petcare_reviews', []);
    return Array.isArray(raw) ? raw.filter((r) => isMongoObjectId(r?.id)) : [];
  });
  const [orders, setOrders] = useState(() => {
    const raw = getInitialState('petcare_orders', []);
    return Array.isArray(raw) ? normalizeOrderList(raw) : [];
  });

  // Dynamic On-Page SEO: title, meta description, canonical, robots & JSON-LD Schema
  useEffect(() => {
    const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
    const selectedService = selectedServiceId ? services.find(s => s.id === selectedServiceId) : null;
    applyPageSEO({ portalMode, activeRole, activeTab, selectedProduct, selectedService, services, products });
  }, [portalMode, activeRole, activeTab, selectedProductId, selectedServiceId, services, products]);

  const [auditLogs, setAuditLogs] = useState(() => {
    const raw = getInitialState('petcare_audit_logs', []);
    if (!Array.isArray(raw)) return [];
    return raw.filter((entry) => entry && !LEGACY_MOCK_LOG_IDS.has(entry.id));
  });

  const authRef = useRef({ token: authToken, user: currentUser });
  authRef.current = { token: authToken, user: currentUser };
  const productsRef = useRef(products);
  productsRef.current = products;

  // Sync helper (Broadcasts to other tabs + pushes shared live state to backend sync engine)
  const broadcastSync = useCallback((type, payload, storageKey) => {
    try {
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      }
      const channel = new BroadcastChannel('petcare_realtime_sync');
      channel.postMessage({ type, payload });
      channel.close();
    } catch (e) {}

    const keyMap = {
      SYNC_APPOINTMENTS: 'appointments',
      SYNC_ORDERS: 'orders',
      SYNC_PRODUCTS: 'products',
      SYNC_SERVICES: 'services',
      SYNC_SUPPLIERS: 'suppliers',
      SYNC_PROMOTIONS: 'promotions',
      SYNC_PETS: 'pets',
      SYNC_REVIEWS: 'reviews',
      SYNC_AUDIT_LOGS: 'auditLogs',
    };
    if (keyMap[type]) {
      const syncBody = { [keyMap[type]]: payload };
      if (type === 'SYNC_PRODUCTS') {
        syncBody.deletedProductIds = getDeletedProductIds();
      }
      if (type === 'SYNC_SUPPLIERS') {
        syncBody.supplierCategoryOverrides = getSupplierCategoryOverrides();
      }
      apiService.postLiveSyncState(syncBody);
    }
  }, []);

  const handleAddAuditLog = (category, action, detail) => {
    const now = new Date();
    const entry = {
      id: 'log-' + Date.now() + Math.random().toString(36).slice(2, 5),
      time:
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
        ' • ' +
        now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      createdAt: now.toISOString(),
      category: category || 'SYSTEM',
      actor: authRef.current.user?.fullName || currentUser?.fullName || 'Hệ thống Petzera',
      action,
      detail,
    };
    setAuditLogs((prev) => {
      const cleaned = prev.filter((item) => item && !LEGACY_MOCK_LOG_IDS.has(item.id));
      const next = [entry, ...cleaned].slice(0, 100);
      broadcastSync('SYNC_AUDIT_LOGS', next, 'petcare_audit_logs');
      return next;
    });
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    broadcastSync('SYNC_AUDIT_LOGS', [], 'petcare_audit_logs');
    toast.info('Đã xóa các bản ghi nhật ký thao tác phiên hiện tại.', 'Nhật Ký Hệ Thống');
  };

  // Master Live MongoDB Synchronizer — Single Source of Truth for all metrics & tables
  const syncLiveDatabase = useCallback(async () => {
    const { token, user } = authRef.current;

    // 1. Public MongoDB collections (Users, Services, Products, Suppliers, Reviews) + Shared Live State
    const [
      usersRes,
      servicesRes,
      productsRes,
      suppliersRes,
      reviewsRes,
      liveSyncRes,
    ] = await Promise.all([
      apiService.getUsers().catch(() => null),
      apiService.getServices().catch(() => null),
      apiService.getProducts().catch(() => null),
      apiService.getSuppliers().catch(() => null),
      apiService.getReviews().catch(() => null),
      apiService.getLiveSyncState().catch(() => null),
    ]);

    const sharedData = liveSyncRes && liveSyncRes.data ? liveSyncRes.data : null;
    if (sharedData && sharedData.supplierCategoryOverrides) {
      try {
        const mergedOverrides = {
          ...getSupplierCategoryOverrides(),
          ...sharedData.supplierCategoryOverrides,
        };
        localStorage.setItem('petcare_supplier_category_overrides', JSON.stringify(mergedOverrides));
      } catch (e) {}
    }

    if (Array.isArray(usersRes)) {
      setUsers(usersRes);
      try { localStorage.setItem('petcare_users', JSON.stringify(usersRes)); } catch (e) {}
    }

    if (Array.isArray(servicesRes)) {
      const cleanedServices = normalizeServiceList(servicesRes);
      setServices(cleanedServices);
      try { localStorage.setItem('petcare_services', JSON.stringify(cleanedServices)); } catch (e) {}
    }

    const rawSuppliers = Array.isArray(suppliersRes) ? suppliersRes : null;
    const rawProducts = Array.isArray(productsRes) ? productsRes : null;

    if (rawProducts) {
      const normProducts = normalizeProductList(rawProducts, rawSuppliers || []);
      setProducts(normProducts);
      try { localStorage.setItem('petcare_products', JSON.stringify(normProducts)); } catch (e) {}

      if (rawSuppliers) {
        const normSuppliers = normalizeSupplierList(rawSuppliers, normProducts);
        setSuppliers(normSuppliers);
        try { localStorage.setItem('petcare_suppliers', JSON.stringify(normSuppliers)); } catch (e) {}
      }
    } else if (rawSuppliers) {
      const normSuppliers = normalizeSupplierList(rawSuppliers, productsRef.current || []);
      setSuppliers(normSuppliers);
      try { localStorage.setItem('petcare_suppliers', JSON.stringify(normSuppliers)); } catch (e) {}
    }

    if (reviewsRes && Array.isArray(reviewsRes.reviews)) {
      setReviews(reviewsRes.reviews);
      try { localStorage.setItem('petcare_reviews', JSON.stringify(reviewsRes.reviews)); } catch (e) {}
    }

    if (sharedData && Array.isArray(sharedData.promotions)) {
      setPromotions(sharedData.promotions);
      try { localStorage.setItem('petcare_promotions', JSON.stringify(sharedData.promotions)); } catch (e) {}
    }

    if (sharedData && Array.isArray(sharedData.auditLogs)) {
      const cleanSharedLogs = sharedData.auditLogs.filter((l) => l && !LEGACY_MOCK_LOG_IDS.has(l.id));
      setAuditLogs((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(cleanSharedLogs)) return prev;
        try { localStorage.setItem('petcare_audit_logs', JSON.stringify(cleanSharedLogs)); } catch (e) {}
        return cleanSharedLogs;
      });
    }

    // 2. Authenticated MongoDB collections (Pets, Appointments, Orders, AI Reorder Proposals)
    const guestSessionOrders =
      sharedData && Array.isArray(sharedData.orders)
        ? normalizeOrderList(sharedData.orders).filter((o) => !isMongoObjectId(o.id))
        : [];

    if (token) {
      const canReadProposals = user && ['ADMIN', 'WAREHOUSE_STAFF'].includes(user.role);
      const [petsRes, appointmentsRes, ordersRes, proposalsRes] = await Promise.all([
        apiService.getPets(token).catch(() => null),
        apiService.getAppointments(token).catch(() => null),
        apiService.getOrders(token).catch(() => null),
        canReadProposals ? apiService.getProposals(token).catch(() => null) : Promise.resolve(null),
      ]);

      // If user has an old offline mock token, clear it cleanly so they authenticate with a real JWT
      if (
        token === 'mock-staff-jwt-token-2026' &&
        appointmentsRes &&
        (appointmentsRes._httpStatus === 401 || appointmentsRes._httpStatus === 403)
      ) {
        try {
          localStorage.removeItem('petcare_staff_user');
          localStorage.removeItem('petcare_staff_token');
        } catch (e) {}
        setCurrentUser(null);
        setAuthToken(null);
        return;
      }

      if (Array.isArray(petsRes)) {
        const normPets = normalizePetList(petsRes);
        setPets(normPets);
        try { localStorage.setItem('petcare_pets', JSON.stringify(normPets)); } catch (e) {}
      }

      if (Array.isArray(appointmentsRes)) {
        const normApps = normalizeAppointmentList(appointmentsRes);
        setAppointments(normApps);
        try { localStorage.setItem('petcare_appointments', JSON.stringify(normApps)); } catch (e) {}
      }

      if (Array.isArray(ordersRes)) {
        const dbOrders = normalizeOrderList(ordersRes);
        const dbIds = new Set(dbOrders.map((o) => o.id));
        const mergedOrders = [
          ...guestSessionOrders.filter((go) => !dbIds.has(go.id)),
          ...dbOrders,
        ];
        setOrders(mergedOrders);
        try { localStorage.setItem('petcare_orders', JSON.stringify(mergedOrders)); } catch (e) {}
      }

      if (canReadProposals && Array.isArray(proposalsRes)) {
        const normProps = normalizeProposalList(proposalsRes);
        setReorderProposals(normProps);
        try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(normProps)); } catch (e) {}
      }
    } else if (guestSessionOrders.length > 0) {
      setOrders(guestSessionOrders);
      try { localStorage.setItem('petcare_orders', JSON.stringify(guestSessionOrders)); } catch (e) {}
    }
  }, []);

  const refreshUsersFromServer = async () => {
    await syncLiveDatabase();
  };

  // Real-time Multi-Tab BroadcastChannel, Storage Sync & MongoDB Live Polling (every 3s + on focus)
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('petcare_realtime_sync');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_USERS' && Array.isArray(payload)) setUsers(payload);
        if (type === 'SYNC_APPOINTMENTS' && Array.isArray(payload)) setAppointments(normalizeAppointmentList(payload));
        if (type === 'SYNC_ORDERS' && Array.isArray(payload)) setOrders(normalizeOrderList(payload));
        if (type === 'SYNC_PETS' && Array.isArray(payload)) setPets(normalizePetList(payload));
        if (type === 'SYNC_PRODUCTS' && Array.isArray(payload)) setProducts(normalizeProductList(payload));
        if (type === 'SYNC_SERVICES' && Array.isArray(payload)) setServices(normalizeServiceList(payload));
        if (type === 'SYNC_PROMOTIONS' && Array.isArray(payload)) setPromotions(payload);
        if (type === 'SYNC_SUPPLIERS' && Array.isArray(payload)) setSuppliers(payload);
        if (type === 'SYNC_PROPOSALS' && Array.isArray(payload)) setReorderProposals(normalizeProposalList(payload));
        if (type === 'SYNC_REVIEWS' && Array.isArray(payload)) setReviews(payload);
        if (type === 'SYNC_AUDIT_LOGS' && Array.isArray(payload)) {
          setAuditLogs(payload.filter((l) => l && !LEGACY_MOCK_LOG_IDS.has(l.id)));
        }
        // Immediately re-pull authoritative MongoDB state whenever another tab signals a change
        syncLiveDatabase();
      };
    } catch (e) {}

    const handleStorageChange = (e) => {
      try {
        if (e.key === 'petcare_promotions' && e.newValue) setPromotions(JSON.parse(e.newValue));
        if (e.key === 'petcare_audit_logs' && e.newValue) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAuditLogs(parsed.filter((l) => l && !LEGACY_MOCK_LOG_IDS.has(l.id)));
        }
        syncLiveDatabase();
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncLiveDatabase);

    syncLiveDatabase();
    const syncInterval = setInterval(syncLiveDatabase, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncLiveDatabase);
      clearInterval(syncInterval);
      if (channel) channel.close();
    };
  }, [syncLiveDatabase]);

  // Re-sync immediately whenever auth session, portal mode, or active tab changes
  useEffect(() => {
    syncLiveDatabase();
  }, [authToken, currentUser?.id, currentUser?.role, portalMode, activeTab, syncLiveDatabase]);

  const handleAddUser = async (userData) => {
    const { _alreadySavedInDb, ...cleanData } = userData || {};
    let created = null;

    if (_alreadySavedInDb) {
      created = {
        ...cleanData,
        status: cleanData.status || 'ACTIVE',
        createdAt: cleanData.createdAt || new Date().toISOString().split('T')[0],
      };
    } else {
      try {
        const res = await apiService.createUser(cleanData);
        if (res && res.user) {
          created = {
            ...res.user,
            status: res.user.status || 'ACTIVE',
            createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          };
        } else if (res && res.message) {
          toast.error(res.message, 'Không Thể Tạo Tài Khoản');
          return null;
        }
      } catch (err) {
        console.warn('Backend user creation error:', err);
      }

      if (!created) {
        created = {
          id: 'u-' + Date.now(),
          fullName: cleanData.fullName,
          email: cleanData.email,
          phone: cleanData.phone || '',
          role: cleanData.role || 'CUSTOMER',
          status: 'ACTIVE',
          createdAt: new Date().toISOString().split('T')[0]
        };
      }
    }

    setUsers(prev => {
      const updated = [created, ...prev.filter(u => u.id !== created.id && u.email !== created.email)];
      broadcastSync('SYNC_USERS', updated, 'petcare_users');
      return updated;
    });
    await refreshUsersFromServer();
    handleAddAuditLog('ACCOUNT', 'Tạo tài khoản mới', `Tạo tài khoản "${created.fullName}" (${created.email}) với vai trò ${created.role}.`);
    return created;
  };

  const handleUpdateUser = async (userId, updates) => {
    const target = users.find(u => u.id === userId);
    try {
      const res = await apiService.updateUser(userId, updates, authToken);
      if (res && (res._httpStatus === 401 || res._httpStatus === 403)) {
        toast.warning('Phiên đăng nhập Admin đã cũ. Vui lòng Đăng xuất rồi Đăng nhập lại để lưu thay đổi!', 'Yêu Cầu Đăng Nhập Lại');
        return;
      }
    } catch (err) {
      console.warn('Backend updateUser error:', err);
    }

    const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    setUsers(updated);
    broadcastSync('SYNC_USERS', updated, 'petcare_users');
    await refreshUsersFromServer();
    if (target) {
      handleAddAuditLog('ACCOUNT', 'Cập nhật tài khoản', `Cập nhật thông tin tài khoản "${updates.fullName || target.fullName}" (${target.email}).`);
    }
  };

  const handleDeleteUser = async (userId) => {
    const target = users.find(u => u.id === userId);
    try {
      const res = await apiService.deleteUser(userId, authToken);
      if (res && (res._httpStatus === 401 || res._httpStatus === 403)) {
        toast.warning('Phiên đăng nhập Admin đã cũ. Vui lòng Đăng xuất rồi Đăng nhập lại để xóa tài khoản!', 'Yêu Cầu Đăng Nhập Lại');
        return;
      }
    } catch (err) {
      console.warn('Backend deleteUser error:', err);
    }

    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    broadcastSync('SYNC_USERS', updated, 'petcare_users');
    await refreshUsersFromServer();
    if (target) {
      handleAddAuditLog('ACCOUNT', 'Xóa tài khoản', `Đã xóa tài khoản "${target.fullName}" (${target.email}).`);
      toast.info(`Đã xóa tài khoản "${target.fullName}".`, 'Quản Lý Tài Khoản');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    const target = users.find(u => u.id === userId);
    try {
      const res = await apiService.updateUser(userId, { role: newRole }, authToken);
      if (res && (res._httpStatus === 401 || res._httpStatus === 403)) {
        toast.warning('Phiên đăng nhập Admin đã cũ. Vui lòng Đăng xuất rồi Đăng nhập lại để đổi quyền!', 'Yêu Cầu Đăng Nhập Lại');
        return;
      }
    } catch (err) {
      console.warn('Backend updateUserRole error:', err);
    }

    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updated);
    broadcastSync('SYNC_USERS', updated, 'petcare_users');
    await refreshUsersFromServer();
    if (target) {
      handleAddAuditLog('SECURITY', 'Thay đổi vai trò người dùng', `Đổi quyền "${target.fullName}" từ ${target.role} sang ${newRole}.`);
      toast.success(`Đã đổi vai trò của "${target.fullName}" sang ${newRole}!`, 'Phân Quyền Người Dùng');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    const target = users.find(u => u.id === userId);
    const nextStatus = target?.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    try {
      const res = await apiService.updateUser(userId, { status: nextStatus }, authToken);
      if (res && (res._httpStatus === 401 || res._httpStatus === 403)) {
        toast.warning('Phiên đăng nhập Admin đã cũ. Vui lòng Đăng xuất rồi Đăng nhập lại để khóa/mở khóa!', 'Yêu Cầu Đăng Nhập Lại');
        return;
      }
    } catch (err) {
      console.warn('Backend toggleUserStatus error:', err);
    }

    const updated = users.map(u => u.id === userId ? { ...u, status: nextStatus } : u);
    setUsers(updated);
    broadcastSync('SYNC_USERS', updated, 'petcare_users');
    await refreshUsersFromServer();
    if (target) {
      handleAddAuditLog('ACCOUNT', nextStatus === 'LOCKED' ? 'Khóa tài khoản' : 'Mở khóa tài khoản', `Tài khoản "${target.fullName}" (${target.email}) → ${nextStatus}.`);
      toast.info(
        nextStatus === 'LOCKED'
          ? `Đã khóa tài khoản "${target.fullName}".`
          : `Đã mở khóa tài khoản "${target.fullName}".`,
        'Trạng Thái Tài Khoản'
      );
    }
  };

  const togglePortalMode = (targetMode) => {
    if (targetMode === 'CUSTOMER' || portalMode === 'STAFF') {
      window.history.pushState({}, '', '/');
      setPortalMode('CUSTOMER');
      setActiveTab('home');
      try {
        const savedCust = localStorage.getItem('petcare_customer_user');
        const savedCustToken = localStorage.getItem('petcare_customer_token');
        const parsed = savedCust ? JSON.parse(savedCust) : null;
        if (parsed && parsed.role === 'CUSTOMER') {
          setCurrentUser(parsed);
          setAuthToken(savedCustToken || null);
          setActiveRole('CUSTOMER');
        } else {
          localStorage.removeItem('petcare_customer_user');
          localStorage.removeItem('petcare_customer_token');
          setCurrentUser(null);
          setAuthToken(null);
          setActiveRole('CUSTOMER');
        }
      } catch (e) {}
    } else {
      window.history.pushState({}, '', '/admin');
      setPortalMode('STAFF');
      try {
        const savedStaff = localStorage.getItem('petcare_staff_user');
        const savedStaffToken = localStorage.getItem('petcare_staff_token');
        const parsed = savedStaff ? JSON.parse(savedStaff) : null;
        if (parsed && STAFF_ROLES.includes(parsed.role)) {
          setCurrentUser(parsed);
          setAuthToken(savedStaffToken || null);
          setActiveRole(parsed.role);
        } else {
          localStorage.removeItem('petcare_staff_user');
          localStorage.removeItem('petcare_staff_token');
          setCurrentUser(null);
          setAuthToken(null);
        }
      } catch (e) {}
    }
  };

  const handleLogout = () => {
    const path = window.location.pathname.toLowerCase();
    const isStaff = path.startsWith('/admin') || path.startsWith('/staff') || portalMode === 'STAFF';

    if (isStaff) {
      try {
        localStorage.removeItem('petcare_staff_user');
        localStorage.removeItem('petcare_staff_token');
      } catch (e) {}
      setCurrentUser(null);
      setAuthToken(null);
      setActiveRole('ADMIN');
      setActiveTab('overview');
    } else {
      try {
        localStorage.removeItem('petcare_customer_user');
        localStorage.removeItem('petcare_customer_token');
        localStorage.removeItem('petcare_cart');
      } catch (e) {}
      setCurrentUser(null);
      setAuthToken(null);
      setCart([]);
      setActiveRole('CUSTOMER');
      setActiveTab('home');
    }
  };

  // 1. Customer Actions
  const handleAddPet = async (petData) => {
    let createdPet = null;
    try {
      const res = await apiService.createPet(petData, authToken);
      if (res && (res.id || res.pet?.id)) {
        createdPet = res.pet || res;
      }
    } catch (e) {}

    if (createdPet) {
      const updatedPets = normalizePetList([createdPet, ...pets]);
      setPets(updatedPets);
      broadcastSync('SYNC_PETS', updatedPets, 'petcare_pets');
      handleAddAuditLog('SYSTEM', 'Thêm hồ sơ thú cưng', `Đã thêm hồ sơ bé "${createdPet.name}" (${createdPet.species}).`);
      await syncLiveDatabase();
      return;
    }

    const newPetObj = {
      ...petData,
      id: 'p-' + Date.now(),
      ownerId: petData.ownerId || currentUser?.id || 'u-guest',
      ownerName: petData.ownerName || currentUser?.fullName || 'Khách hàng',
      ownerPhone: petData.ownerPhone || currentUser?.phone || '',
    };
    const updatedPets = [newPetObj, ...pets];
    setPets(updatedPets);
    broadcastSync('SYNC_PETS', updatedPets, 'petcare_pets');
  };

  const handleBookAppointment = async (bookingData) => {
    const selectedService = services.find(s => s.id === bookingData.serviceId) || services[0];

    const isConflict = appointments.some(a =>
      a.appointmentDate === bookingData.appointmentDate &&
      a.timeSlot === bookingData.timeSlot &&
      ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status)
    );

    if (isConflict) {
      return { error: `Khung giờ ${bookingData.timeSlot} ngày ${bookingData.appointmentDate} đã có khách khác đặt trùng. Vui lòng chọn giờ khác!` };
    }

    let newApp;
    try {
      const res = await apiService.createAppointment(bookingData, authToken);
      if (res && res.appointment) {
        newApp = normalizeAppointmentList([
          {
            ...res.appointment,
            appointmentDate: bookingData.appointmentDate,
            totalPrice: bookingData.totalPrice ?? res.appointment.totalPrice ?? selectedService?.price ?? 200000,
            customerName: currentUser?.fullName || 'Khách hàng',
          },
        ])[0];
      } else if (res && res.message && !res.appointment && res.message.includes('đã có khách')) {
        return { error: res.message };
      }
    } catch (e) {}

    if (!newApp) {
      const selectedPet = pets.find(p => p.id === bookingData.petId) || pets[0];
      const computedPrice = bookingData.totalPrice ?? selectedService?.price ?? 200000;

      newApp = {
        id: 'app-' + Date.now(),
        petId: selectedPet?.id || bookingData.petId || 'p-guest',
        petName: selectedPet?.name || 'Thú cưng',
        species: selectedPet?.species || 'Chó',
        customerId: currentUser?.id || 'u-guest',
        customerName: currentUser?.fullName || 'Khách hàng',
        customerPhone: currentUser?.phone || '',
        serviceId: selectedService?.id || bookingData.serviceId || 's-guest',
        serviceName: selectedService?.name || 'Dịch vụ chăm sóc',
        serviceCategory: selectedService?.category || 'Spa & Grooming',
        price: computedPrice,
        totalPrice: computedPrice,
        appointmentDate: bookingData.appointmentDate,
        createdAt: new Date().toISOString(),
        timeSlot: bookingData.timeSlot,
        status: 'PENDING',
        notes: bookingData.notes || '',
        careSummary: null,
        staffName: null,
      };
    }

    const updated = [newApp, ...appointments.filter((a) => a.id !== newApp.id)];
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
    handleAddAuditLog(
      'SYSTEM',
      'Đặt lịch hẹn dịch vụ mới',
      `Khách "${newApp.customerName}" đặt gói "${newApp.serviceName}" (${Number(newApp.totalPrice || 0).toLocaleString('vi-VN')}đ) ngày ${newApp.appointmentDate}.`
    );
    await syncLiveDatabase();
    return { success: true };
  };

  const handleCheckoutOrder = async (cartItems, total, shippingInfo = {}) => {
    const validMongoItems = Array.isArray(cartItems)
      ? cartItems
          .filter((item) => isMongoObjectId(item.id) && Number(item.quantity) > 0)
          .map((item) => ({ productId: item.id, quantity: Number(item.quantity) }))
      : [];

    if (authToken && validMongoItems.length > 0 && validMongoItems.length === cartItems.length) {
      try {
        const res = await apiService.createOrder(validMongoItems, authToken);
        if (res && res._ok && res.order) {
          const createdOrder = normalizeOrderList([
            {
              ...res.order,
              customerName: shippingInfo.recipientName || currentUser?.fullName || res.order.customer?.fullName || 'Khách mua hàng',
              phone: shippingInfo.recipientPhone || currentUser?.phone || '',
              address: shippingInfo.deliveryAddress || '',
            },
          ])[0];
          const updatedOrders = [createdOrder, ...orders.filter((o) => o.id !== createdOrder.id)];
          setOrders(updatedOrders);
          handleAddAuditLog(
            'INVENTORY',
            'Phát sinh đơn hàng Pet Shop',
            `Đơn #${createdOrder.id.slice(-6)} — ${createdOrder.items} (${Number(createdOrder.total).toLocaleString('vi-VN')}đ).`
          );
          await syncLiveDatabase();
          return;
        }
      } catch (e) {}
    }

    // Fallback for unauthenticated guest storefront checkout
    const newOrder = normalizeOrderList([
      {
        id: shippingInfo.orderId || 'ORD-LIVE-' + Date.now().toString().slice(-6),
        customerId: currentUser?.id || 'u-guest',
        customerName: shippingInfo.recipientName || currentUser?.fullName || 'Khách vãng lai',
        phone: shippingInfo.recipientPhone || currentUser?.phone || '',
        address: shippingInfo.deliveryAddress || 'TP. Hồ Chí Minh',
        paymentMethod: shippingInfo.paymentMethod === 'PAYOS' ? 'Thanh Toán Online (payOS)' : 'Tiền Mặt COD',
        shippingMethod: shippingInfo.shippingMethod === 'EXPRESS' ? 'Hỏa Tốc 2H' : 'Tiêu Chuẩn (1-2 ngày)',
        notes: shippingInfo.deliveryNotes || '',
        rawItems: cartItems.map((i) => ({ productId: i.id, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice })),
        items: cartItems.map((i) => `${i.name} x ${i.quantity}`).join(', '),
        total: Number(total) || 0,
        totalAmount: Number(total) || 0,
        status: shippingInfo.status || 'PENDING',
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
      },
    ])[0];

    const updatedProducts = products.map((p) => {
      const cartItem = cartItems.find((item) => item.id === p.id);
      if (cartItem) {
        return { ...p, currentStock: Math.max(0, p.currentStock - cartItem.quantity) };
      }
      return p;
    });
    const updatedOrders = [newOrder, ...orders];
    setProducts(updatedProducts);
    setOrders(updatedOrders);
    broadcastSync('SYNC_PRODUCTS', updatedProducts, 'petcare_products');
    broadcastSync('SYNC_ORDERS', updatedOrders, 'petcare_orders');
    handleAddAuditLog(
      'INVENTORY',
      'Đơn hàng khách vãng lai',
      `Đơn #${newOrder.id} — ${newOrder.items} (${Number(newOrder.total).toLocaleString('vi-VN')}đ).`
    );
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    // Map UI workflow statuses to MongoDB OrderStatus enum (PENDING | PAID | SHIPPED | COMPLETED | CANCELLED)
    const BACKEND_ORDER_STATUS = { CONFIRMED: 'PAID', DELIVERED: 'COMPLETED', SHIPPING: 'SHIPPED' };
    const backendStatus = BACKEND_ORDER_STATUS[nextStatus] || nextStatus;
    if (isMongoObjectId(orderId) && authToken && ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'].includes(backendStatus)) {
      try {
        await apiService.updateOrderStatus(orderId, backendStatus, authToken);
      } catch (e) {}
    }
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: isMongoObjectId(orderId) ? backendStatus : nextStatus } : o));
    setOrders(updated);
    broadcastSync('SYNC_ORDERS', updated, 'petcare_orders');
    handleAddAuditLog('INVENTORY', 'Cập nhật trạng thái đơn hàng', `Đơn hàng #${String(orderId).slice(-6)} → ${nextStatus}.`);
    await syncLiveDatabase();
  };

  // Customer Reviews & Ratings Handlers (MongoDB + Real-time Sync)
  const handleAddReview = async (reviewData) => {
    let created = null;
    try {
      const res = await apiService.createReview(reviewData, authToken);
      if (res && res._ok && res.review) {
        created = res.review;
      } else if (res && !res._ok && res.message) {
        return { error: res.message };
      }
    } catch (e) {}

    if (!created) {
      created = {
        id: 'rev-' + Date.now(),
        targetType: reviewData.targetType || 'GENERAL',
        targetId: reviewData.targetId || null,
        targetName: reviewData.targetName || 'Trải nghiệm tại Petzera',
        appointmentId: reviewData.appointmentId || null,
        customerId: currentUser?.id || 'u-guest',
        customerName: currentUser?.fullName || 'Khách hàng Petzera',
        petName: reviewData.petName || null,
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment || '',
        staffReply: null,
        createdAt: new Date().toISOString(),
      };
    }

    const updated = [created, ...reviews.filter((r) => r.id !== created.id)];
    setReviews(updated);
    broadcastSync('SYNC_REVIEWS', updated, 'petcare_reviews');
    handleAddAuditLog('SYSTEM', 'Đánh giá mới từ khách hàng', `${created.customerName} đánh giá ${created.rating}★ cho "${created.targetName}".`);
    await syncLiveDatabase();
    toast.success('Cảm ơn bạn đã gửi đánh giá cho Petzera! ⭐', 'Đánh Giá Thành Công');
    return { success: true, review: created };
  };

  const handleReplyReview = async (reviewId, staffReply) => {
    const cleanReply = String(staffReply || '').trim();
    if (!cleanReply) return;
    try {
      await apiService.replyReview(reviewId, cleanReply, authToken);
    } catch (e) {}
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, staffReply: cleanReply } : r));
    setReviews(updated);
    broadcastSync('SYNC_REVIEWS', updated, 'petcare_reviews');
    await syncLiveDatabase();
    toast.success('Đã gửi phản hồi tới đánh giá của khách hàng!', 'Phản Hồi Đánh Giá');
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await apiService.deleteReview(reviewId, authToken);
    } catch (e) {}
    const updated = reviews.filter((r) => r.id !== reviewId);
    setReviews(updated);
    broadcastSync('SYNC_REVIEWS', updated, 'petcare_reviews');
    await syncLiveDatabase();
    toast.info('Đã xóa đánh giá.', 'Đánh Giá Khách Hàng');
  };

  const handleRescheduleAppointment = async (appId, updates) => {
    const target = appointments.find((a) => a.id === appId);
    if (!target) return { error: 'Không tìm thấy lịch hẹn cần đổi!' };

    const isConflict = appointments.some(
      (a) =>
        a.id !== appId &&
        a.appointmentDate === updates.appointmentDate &&
        a.timeSlot === updates.timeSlot &&
        ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status)
    );
    if (isConflict) {
      return { error: `Khung giờ ${updates.timeSlot} ngày ${updates.appointmentDate} đã có khách đặt. Vui lòng chọn giờ khác!` };
    }

    try {
      const res = await apiService.rescheduleAppointment(appId, updates, authToken);
      if (res && res.message && !res.appointment && res.message.includes('đã có khách')) {
        return { error: res.message };
      }
    } catch (e) {}

    const updated = appointments.map((a) =>
      a.id === appId
        ? {
            ...a,
            appointmentDate: updates.appointmentDate || a.appointmentDate,
            timeSlot: updates.timeSlot || a.timeSlot,
            notes: updates.notes !== undefined ? updates.notes : a.notes,
          }
        : a
    );
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
    await syncLiveDatabase();
    toast.success('Đã đổi lịch hẹn thành công!', 'Đổi Lịch Hẹn');
    return { success: true };
  };

  const handleCancelAppointment = async (appId) => {
    const target = appointments.find((a) => a.id === appId);
    try {
      await apiService.cancelAppointment(appId, authToken);
    } catch (e) {}

    const updated = appointments.map((a) => (a.id === appId ? { ...a, status: 'CANCELLED' } : a));
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
    if (target) {
      handleAddAuditLog('SYSTEM', 'Hủy lịch hẹn dịch vụ', `Đã hủy ca hẹn "${target.serviceName}" ngày ${target.appointmentDate}.`);
    }
    await syncLiveDatabase();
    toast.success('Đã hủy ca hẹn thành công. Khung giờ đã được giải phóng!', 'Hủy Ca Hẹn');
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const res = await apiService.updateProfile(profileData, authToken);
      if (res && res.user) {
        setCurrentUser(res.user);
        const storageKey = ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(res.user.role)
          ? 'petcare_staff_user'
          : 'petcare_customer_user';
        localStorage.setItem(storageKey, JSON.stringify(res.user));
        await syncLiveDatabase();
        toast.success('Cập nhật hồ sơ thông tin cá nhân thành công!', 'Hồ Sơ Cá Nhân');
        return { success: true };
      }
    } catch (e) {}

    const updatedUser = {
      ...currentUser,
      fullName: profileData.fullName || currentUser?.fullName,
      phone: profileData.phone !== undefined ? profileData.phone : currentUser?.phone,
      address: profileData.address !== undefined ? profileData.address : currentUser?.address,
    };
    setCurrentUser(updatedUser);
    const storageKey = ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(updatedUser.role)
      ? 'petcare_staff_user'
      : 'petcare_customer_user';
    localStorage.setItem(storageKey, JSON.stringify(updatedUser));
    toast.success('Cập nhật hồ sơ thông tin cá nhân thành công!', 'Hồ Sơ Cá Nhân');
    return { success: true };
  };

  // 2. Care Staff Actions
  const handleUpdateAppointmentStatus = async (appId, newStatus, summary) => {
    const target = appointments.find((a) => a.id === appId);
    try {
      await apiService.updateAppointmentStatus(appId, newStatus, summary, authToken);
    } catch (e) {}

    const updated = appointments.map((a) => {
      if (a.id === appId) {
        return {
          ...a,
          status: newStatus,
          careSummary: summary || a.careSummary,
          staffName: currentUser?.fullName || 'Nhân viên chăm sóc',
        };
      }
      return a;
    });
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
    if (target) {
      handleAddAuditLog('SYSTEM', 'Cập nhật tiến độ ca hẹn', `Ca "${target.serviceName}" (${target.petName}) → ${newStatus}.`);
    }
    await syncLiveDatabase();
  };

  // 3. Warehouse & Inventory Actions
  const handleUpdateStock = async (productId, type, quantity, note, thresholds = {}) => {
    const parsedQty = parseInt(quantity, 10);
    const qtyNum = Number.isNaN(parsedQty) ? 0 : Math.max(0, parsedQty);
    try {
      await apiService.updateStock(productId, type, qtyNum, note, authToken, thresholds);
    } catch (e) {}

    const target = products.find((p) => p.id === productId);
    const updated = products.map((p) => {
      if (p.id === productId) {
        let newQty = p.currentStock;
        if (type === 'IN' || type === 'IMPORT') newQty += qtyNum;
        else if (type === 'OUT' || type === 'EXPORT') newQty = Math.max(0, newQty - qtyNum);
        else if (type === 'ADJUSTMENT') newQty = qtyNum;
        return {
          ...p,
          currentStock: newQty,
          ...(thresholds.minStockLevel !== undefined ? { minStockLevel: thresholds.minStockLevel } : {}),
          ...(thresholds.maxStockLevel !== undefined ? { maxStockLevel: thresholds.maxStockLevel } : {}),
        };
      }
      return p;
    });
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    if (target) {
      const actionLabel = type === 'ADJUSTMENT' ? 'Điều chỉnh tồn kho' : type === 'OUT' ? 'Xuất kho' : 'Nhập kho';
      handleAddAuditLog(
        'INVENTORY',
        actionLabel,
        `${actionLabel} "${target.name}" (${target.sku}): ${type === 'ADJUSTMENT' ? `${target.currentStock} → ${qtyNum}` : `${type === 'OUT' ? '-' : '+'}${qtyNum}`}${note ? ` — ${note}` : ''}.`
      );
    }
    await syncLiveDatabase();
    toast.success(
      type === 'ADJUSTMENT'
        ? `Đã điều chỉnh tồn kho "${target?.name || ''}" về ${qtyNum} sản phẩm!`
        : 'Cập nhật giao dịch tồn kho thành công!',
      type === 'ADJUSTMENT' ? 'Điều Chỉnh Tồn Kho' : 'Quản Lý Kho Hàng'
    );
  };

  const handleDeleteProduct = async (productId) => {
    const target = products.find((p) => p.id === productId);
    try {
      await apiService.deleteProduct(productId, authToken);
    } catch (e) {}

    const nextDeletedIds = Array.from(new Set([...getDeletedProductIds(), productId]));
    try { localStorage.setItem('petcare_deleted_product_ids', JSON.stringify(nextDeletedIds)); } catch (e) {}

    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    if (target) {
      handleAddAuditLog('INVENTORY', 'Xóa sản phẩm khỏi kho', `Đã xóa "${target.name}" (SKU: ${target.sku}).`);
      toast.info(`Đã xóa sản phẩm "${target.name}" khỏi kho hàng.`, 'Quản Lý Kho Hàng');
    }
    await syncLiveDatabase();
  };

  const handleAddSupplier = async (supData) => {
    let created = null;
    try {
      const res = await apiService.createSupplier(supData, authToken);
      if (res && res.supplier) created = res.supplier;
      else if (res && res.id) created = res;
    } catch (e) {}

    if (!created) {
      created = { ...supData, id: 'sup-' + Date.now() };
    }

    if (supData.productCategories) {
      try {
        const overrides = { ...getSupplierCategoryOverrides(), [created.id]: supData.productCategories };
        localStorage.setItem('petcare_supplier_category_overrides', JSON.stringify(overrides));
      } catch (e) {}
    }

    const normCreated = normalizeSupplierList([{ ...created, productCategories: supData.productCategories }], products)[0];
    const updated = [normCreated, ...suppliers.filter((s) => s.id !== normCreated.id)];
    setSuppliers(updated);
    broadcastSync('SYNC_SUPPLIERS', updated, 'petcare_suppliers');
    handleAddAuditLog('SYSTEM', 'Thêm nhà cung cấp', `Đã thêm đối tác "${normCreated.name}".`);
    await syncLiveDatabase();
    toast.success(`Đã thêm nhà cung cấp mới: ${normCreated.name}`, 'Nhà Cung Cấp');
  };

  const handleUpdateSupplier = async (supplierId, updates) => {
    if (isMongoObjectId(supplierId) && authToken) {
      try {
        await apiService.updateSupplier(supplierId, updates, authToken);
      } catch (e) {}
    }
    if (updates.productCategories !== undefined) {
      try {
        const overrides = { ...getSupplierCategoryOverrides(), [supplierId]: updates.productCategories };
        localStorage.setItem('petcare_supplier_category_overrides', JSON.stringify(overrides));
      } catch (e) {}
    }
    const updated = suppliers.map((s) => (s.id === supplierId ? { ...s, ...updates } : s));
    setSuppliers(updated);
    broadcastSync('SYNC_SUPPLIERS', updated, 'petcare_suppliers');
    handleAddAuditLog('SYSTEM', 'Cập nhật nhà cung cấp', `Cập nhật thông tin đối tác "${updates.name || supplierId}".`);
    await syncLiveDatabase();
  };

  const handleDeleteSupplier = async (supplierId) => {
    const target = suppliers.find((s) => s.id === supplierId);
    if (isMongoObjectId(supplierId) && authToken) {
      try {
        await apiService.deleteSupplier(supplierId, authToken);
      } catch (e) {}
    }
    try {
      const overrides = { ...getSupplierCategoryOverrides() };
      delete overrides[supplierId];
      localStorage.setItem('petcare_supplier_category_overrides', JSON.stringify(overrides));
    } catch (e) {}

    const updated = suppliers.filter((s) => s.id !== supplierId);
    setSuppliers(updated);
    broadcastSync('SYNC_SUPPLIERS', updated, 'petcare_suppliers');
    if (target) {
      handleAddAuditLog('SYSTEM', 'Xóa nhà cung cấp', `Đã xóa đối tác "${target.name}".`);
      toast.info(`Đã xóa nhà cung cấp "${target.name}".`, 'Nhà Cung Cấp');
    }
    await syncLiveDatabase();
  };

  // Services, Promotions & Pet Medical Handlers
  const handleAddService = async (svcData) => {
    const cleanPayload = {
      name: (svcData.name || '').trim(),
      category: svcData.category || 'Spa & Grooming',
      durationMinutes: Number(svcData.durationMinutes) || 45,
      price: Number(svcData.price) || 0,
      description: (svcData.description || '').trim(),
      image: svcData.image ? String(svcData.image).trim() : '',
      customImage: Boolean(svcData.image && String(svcData.image).trim()),
      targetPet: (svcData.targetPet || '').trim(),
      standard: (svcData.standard || '').trim(),
      processSteps: (svcData.processSteps || '').trim(),
      prepNote: (svcData.prepNote || '').trim(),
      status: svcData.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    };

    let created = null;
    try {
      const res = await apiService.createService(cleanPayload, authToken);
      if (res && res.service && res.service.id) created = { ...cleanPayload, ...res.service };
      else if (res && res.id) created = { ...cleanPayload, ...res };
    } catch (e) {}

    if (!created) {
      created = { ...cleanPayload, id: 's-' + Date.now() };
    }
    const updated = normalizeServiceList([created, ...services.filter((s) => s.id !== created.id)]);
    setServices(updated);
    broadcastSync('SYNC_SERVICES', updated, 'petcare_services');
    await syncLiveDatabase();
  };

  const handleUpdateService = async (serviceId, updates) => {
    const cleanUpdates = {
      ...updates,
      name: updates.name !== undefined ? String(updates.name).trim() : undefined,
      durationMinutes: updates.durationMinutes !== undefined ? (Number(updates.durationMinutes) || 45) : undefined,
      price: updates.price !== undefined ? (Number(updates.price) || 0) : undefined,
      description: updates.description !== undefined ? String(updates.description).trim() : undefined,
      image: updates.image !== undefined ? String(updates.image || '').trim() : undefined,
      customImage: updates.image !== undefined ? Boolean(String(updates.image || '').trim()) : undefined,
      targetPet: updates.targetPet !== undefined ? String(updates.targetPet || '').trim() : undefined,
      standard: updates.standard !== undefined ? String(updates.standard || '').trim() : undefined,
      processSteps: updates.processSteps !== undefined ? String(updates.processSteps || '').trim() : undefined,
      prepNote: updates.prepNote !== undefined ? String(updates.prepNote || '').trim() : undefined,
      status: updates.status !== undefined ? (updates.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE') : undefined,
    };
    try {
      await apiService.updateService(serviceId, cleanUpdates, authToken);
    } catch (e) {}
    const updated = normalizeServiceList(services.map((s) => (s.id === serviceId ? { ...s, ...cleanUpdates } : s)));
    setServices(updated);
    broadcastSync('SYNC_SERVICES', updated, 'petcare_services');
    await syncLiveDatabase();
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await apiService.deleteService(serviceId, authToken);
    } catch (e) {}
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    broadcastSync('SYNC_SERVICES', updated, 'petcare_services');
    await syncLiveDatabase();
  };

  const handleAddPromotion = (promoData) => {
    const created = {
      ...promoData,
      id: 'promo-' + Date.now(),
      status: promoData.status || 'ACTIVE',
    };
    const updated = [created, ...promotions];
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    handleAddAuditLog('SYSTEM', 'Tạo mã khuyến mãi mới', `Tạo mã ${created.code} (-${created.discountPercent}%).`);
    toast.success(`Đã tạo mã khuyến mãi ${created.code} (-${created.discountPercent}%)!`, 'Khuyến Mãi');
  };

  const handleUpdatePromotion = (promoId, updates) => {
    const updated = promotions.map((p) => (p.id === promoId ? { ...p, ...updates } : p));
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    handleAddAuditLog('SYSTEM', 'Chỉnh sửa chương trình khuyến mãi', `Cập nhật mã ${updates.code || promoId} (-${updates.discountPercent ?? ''}%).`);
    toast.success(`Đã cập nhật chương trình khuyến mãi "${updates.code || ''}"!`, 'Khuyến Mãi');
  };

  const handleTogglePromotion = (promoId) => {
    const updated = promotions.map((p) => (p.id === promoId ? { ...p, status: p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : p));
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    toast.info('Đã cập nhật trạng thái chương trình khuyến mãi.', 'Khuyến Mãi');
  };

  const handleDeletePromotion = (promoId) => {
    const updated = promotions.filter((p) => p.id !== promoId);
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    toast.info('Đã xóa chương trình khuyến mãi.', 'Khuyến Mãi');
  };

  const handleUpdatePet = async (petId, updates) => {
    try {
      await apiService.updatePet(petId, updates, authToken);
    } catch (e) {}
    const updated = pets.map((p) => (p.id === petId ? { ...p, ...updates } : p));
    setPets(updated);
    broadcastSync('SYNC_PETS', updated, 'petcare_pets');
    await syncLiveDatabase();
  };

  const handleDeletePet = async (petId) => {
    const target = pets.find((p) => p.id === petId);
    try {
      await apiService.deletePet(petId, authToken);
    } catch (e) {}
    const updated = pets.filter((p) => p.id !== petId);
    setPets(updated);
    broadcastSync('SYNC_PETS', updated, 'petcare_pets');
    if (target) {
      handleAddAuditLog('SYSTEM', 'Xóa hồ sơ thú cưng', `Đã xóa hồ sơ bé "${target.name}".`);
      toast.info(`Đã xóa hồ sơ thú cưng "${target.name}".`, 'Hồ Sơ Thú Cưng');
    }
    await syncLiveDatabase();
  };

  const handleUpdateProposal = (proposalId, updates) => {
    const updated = reorderProposals.map((p) => (p.id === proposalId ? { ...p, ...updates } : p));
    setReorderProposals(updated);
    broadcastSync('SYNC_PROPOSALS', updated, 'petcare_reorderProposals');
    toast.success('Đã cập nhật phiếu đề xuất nhập hàng!', 'Đề Xuất Nhập Hàng');
  };

  const handleDeleteProposal = async (proposalId) => {
    const target = reorderProposals.find((p) => p.id === proposalId);
    if (isMongoObjectId(proposalId) && authToken) {
      try {
        await apiService.deleteProposal(proposalId, authToken);
      } catch (e) {}
    }
    const updated = reorderProposals.filter((p) => p.id !== proposalId);
    setReorderProposals(updated);
    broadcastSync('SYNC_PROPOSALS', updated, 'petcare_reorderProposals');
    await syncLiveDatabase();
    toast.info(`Đã xóa phiếu đề xuất${target ? ` "${target.productName}"` : ''}.`, 'Đề Xuất Nhập Hàng');
  };

  const handleCreateProposal = async (propData) => {
    let created = null;
    if (isMongoObjectId(propData.productId) && authToken) {
      try {
        const res = await apiService.createProposal(
          {
            productId: propData.productId,
            suggestedQuantity: parseInt(propData.suggestedQuantity, 10) || 20,
            reason: propData.reason || 'Đề xuất nhập kho bổ sung.',
            confidenceScore: propData.confidenceScore || 0.95,
          },
          authToken
        );
        if (res && res._ok && res.proposal) {
          created = normalizeProposalList([res.proposal])[0];
        }
      } catch (e) {}
    }

    if (!created) {
      created = {
        id: 'prop-' + Date.now().toString().slice(-5),
        productId: propData.productId,
        productName: propData.productName,
        sku: propData.sku || 'SKU',
        currentStock: propData.currentStock ?? 0,
        minStockLevel: propData.minStockLevel ?? 10,
        safetyStock: 12,
        suggestedQuantity: parseInt(propData.suggestedQuantity, 10) || 20,
        suggestedOrderDate: propData.suggestedOrderDate || new Date().toISOString().split('T')[0],
        suggestedSupplier: propData.suggestedSupplier || 'Chưa phân bổ NCC',
        confidenceScore: propData.confidenceScore || 0.95,
        reason: propData.reason || 'Đề xuất nhập hàng mới.',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      };
    }

    const updated = [created, ...reorderProposals.filter((p) => p.id !== created.id)];
    setReorderProposals(updated);
    broadcastSync('SYNC_PROPOSALS', updated, 'petcare_reorderProposals');
    handleAddAuditLog('INVENTORY', 'Lập phiếu đề xuất nhập kho', `Đề xuất nhập +${created.suggestedQuantity} "${created.productName}".`);
    await syncLiveDatabase();
    toast.success(`Đã lập phiếu đề xuất nhập +${created.suggestedQuantity} ${created.productName}!`, 'Đề Xuất Nhập Hàng');
  };

  const handleRequestRestock = (product) => {
    const suggestedQty = Math.max(15, (product.maxStockLevel || 60) - product.currentStock);
    handleCreateProposal({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      currentStock: product.currentStock,
      minStockLevel: product.minStockLevel,
      suggestedQuantity: suggestedQty,
      suggestedSupplier: product.supplierName || suppliers[0]?.name || 'Chưa phân bổ NCC',
      reason: `Yêu cầu nhập bổ sung từ bộ phận Nhân viên (${currentUser?.fullName || 'Nhân viên'}). Tồn kho hiện tại: ${product.currentStock} sp.`,
    });
  };

  // Add & Update Product Actions
  const handleAddProduct = async (newProdData) => {
    const trimmedImage = newProdData.image ? String(newProdData.image).trim() : '';
    const matchedSup = suppliers.find(
      (s) => s.id === newProdData.supplierId || (s.name && s.name === newProdData.supplierName)
    );
    const payload = {
      name: newProdData.name.trim(),
      sku: (newProdData.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000)).trim().toUpperCase(),
      category: newProdData.category || 'Thức ăn',
      unitPrice: parseFloat(newProdData.unitPrice) || 100000,
      costPrice: parseFloat(newProdData.costPrice) || Math.round((parseFloat(newProdData.unitPrice) || 100000) * 0.65),
      currentStock: Math.max(0, parseInt(newProdData.currentStock, 10) || 0),
      minStockLevel: Math.max(0, parseInt(newProdData.minStockLevel, 10) || 10),
      maxStockLevel: Math.max(1, parseInt(newProdData.maxStockLevel, 10) || 100),
      supplierId: matchedSup?.id || undefined,
      supplierName: newProdData.supplierName || matchedSup?.name || 'Chưa phân bổ NCC',
      image: trimmedImage,
      customImage: Boolean(trimmedImage),
      brand: (newProdData.brand || '').trim(),
      unit: (newProdData.unit || '').trim(),
      targetPet: (newProdData.targetPet || '').trim(),
      origin: (newProdData.origin || '').trim(),
      expiryDate: (newProdData.expiryDate || '').trim(),
      description: (newProdData.description || '').trim(),
      usageGuide: (newProdData.usageGuide || '').trim(),
      status: newProdData.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    };

    let created = null;
    try {
      const res = await apiService.createProduct(payload, authToken);
      if (res && res.id) {
        created = normalizeProductList([{ ...payload, ...res }], suppliers)[0];
      } else if (res && !res._ok && res.message) {
        toast.error(res.message, 'Không Thể Thêm Sản Phẩm');
        return;
      }
    } catch (e) {}

    if (!created) {
      created = { ...payload, id: 'prod-' + Date.now() };
    }
    const updated = [created, ...products.filter((p) => p.id !== created.id)];
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    handleAddAuditLog('INVENTORY', 'Thêm sản phẩm mới', `Thêm "${created.name}" (SKU: ${created.sku}, giá ${Number(created.unitPrice).toLocaleString('vi-VN')}đ).`);
    await syncLiveDatabase();
    toast.success(`Đã thêm sản phẩm mới thành công: ${created.name}`, 'Quản Lý Sản Phẩm');
  };

  const handleUpdateProduct = async (productId, updates) => {
    const hasImageField = updates.image !== undefined;
    const trimmedImage = hasImageField ? String(updates.image || '').trim() : undefined;
    const matchedSup = suppliers.find(
      (s) => s.id === updates.supplierId || (s.name && s.name === updates.supplierName)
    );
    const payload = {
      ...updates,
      name: updates.name ? updates.name.trim() : undefined,
      sku: updates.sku ? updates.sku.trim().toUpperCase() : undefined,
      unitPrice: updates.unitPrice !== undefined ? parseFloat(updates.unitPrice) || 0 : undefined,
      costPrice: updates.costPrice !== undefined ? parseFloat(updates.costPrice) || 0 : undefined,
      currentStock: updates.currentStock !== undefined ? Math.max(0, parseInt(updates.currentStock, 10) || 0) : undefined,
      minStockLevel: updates.minStockLevel !== undefined ? Math.max(0, parseInt(updates.minStockLevel, 10) || 0) : undefined,
      maxStockLevel: updates.maxStockLevel !== undefined ? Math.max(1, parseInt(updates.maxStockLevel, 10) || 100) : undefined,
      supplierId: matchedSup?.id || updates.supplierId,
      image: trimmedImage,
      customImage: hasImageField ? Boolean(trimmedImage) : undefined,
      brand: updates.brand !== undefined ? String(updates.brand || '').trim() : undefined,
      unit: updates.unit !== undefined ? String(updates.unit || '').trim() : undefined,
      targetPet: updates.targetPet !== undefined ? String(updates.targetPet || '').trim() : undefined,
      origin: updates.origin !== undefined ? String(updates.origin || '').trim() : undefined,
      expiryDate: updates.expiryDate !== undefined ? String(updates.expiryDate || '').trim() : undefined,
      description: updates.description !== undefined ? String(updates.description || '').trim() : undefined,
      usageGuide: updates.usageGuide !== undefined ? String(updates.usageGuide || '').trim() : undefined,
      status: updates.status !== undefined ? (updates.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE') : undefined,
    };

    try {
      await apiService.updateProduct(productId, payload, authToken);
    } catch (e) {}

    const updated = products.map((p) => (p.id === productId ? { ...p, ...payload } : p));
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    handleAddAuditLog('INVENTORY', 'Cập nhật sản phẩm', `Cập nhật thông tin sản phẩm "${payload.name || productId}" (SKU: ${payload.sku || ''}).`);
    await syncLiveDatabase();
    toast.success(`Đã cập nhật thông tin sản phẩm "${payload.name || ''}"!`, 'Quản Lý Sản Phẩm');
  };

  // 4. AI Forecasting & Reorder Proposal Actions
  const [aiScanModalData, setAiScanModalData] = useState(null);

  const handleTriggerAI = async () => {
    const prevIds = new Set(reorderProposals.map((p) => p.id));
    let backendTriggered = false;
    try {
      const trigRes = await apiService.triggerAIForecast(authToken);
      if (trigRes && trigRes._ok) {
        backendTriggered = true;
      }
    } catch (e) {}

    const lowStockItems = products.filter((p) => p.currentStock <= p.minStockLevel + 5);

    if (backendTriggered && authToken) {
      const freshProposalsRes = await apiService.getProposals(authToken).catch(() => null);
      if (Array.isArray(freshProposalsRes)) {
        const normProps = normalizeProposalList(freshProposalsRes);
        const createdItems = normProps.filter((p) => !prevIds.has(p.id));
        setReorderProposals(normProps);
        broadcastSync('SYNC_PROPOSALS', normProps, 'petcare_reorderProposals');
        if (createdItems.length > 0) {
          handleAddAuditLog('INVENTORY', 'AI quét dự báo tồn kho', `AI phát hiện ${lowStockItems.length} SP rủi ro và tạo ${createdItems.length} đề xuất nhập hàng mới.`);
        }
        setAiScanModalData({
          count: createdItems.length,
          createdItems,
          totalScanned: products.length,
          lowStockCount: lowStockItems.length,
        });
        return;
      }
    }

    let count = 0;
    const newProposals = [...reorderProposals];
    const createdItems = [];

    lowStockItems.forEach((p) => {
      if (!newProposals.some((prop) => prop.productId === p.id && prop.status === 'DRAFT')) {
        const qty = p.maxStockLevel - p.currentStock;
        const item = {
          id: 'prop-' + Date.now() + Math.random().toString(36).slice(2, 6),
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          currentStock: p.currentStock,
          minStockLevel: p.minStockLevel,
          safetyStock: 12,
          suggestedQuantity: Math.max(qty, 15),
          suggestedOrderDate: new Date().toISOString().split('T')[0],
          suggestedSupplier: p.supplierName || suppliers[0]?.name || 'Chưa phân bổ NCC',
          confidenceScore: parseFloat((0.90 + Math.random() * 0.08).toFixed(2)),
          reason: `[AI Demand Model - 95% confidence]: Tồn kho (${p.currentStock}) chạm ngưỡng an toàn (${p.minStockLevel}).`,
          status: 'DRAFT',
          createdAt: new Date().toISOString(),
        };
        newProposals.unshift(item);
        createdItems.push(item);
        count++;
      }
    });

    setReorderProposals(newProposals);
    broadcastSync('SYNC_PROPOSALS', newProposals, 'petcare_reorderProposals');
    setAiScanModalData({
      count,
      createdItems,
      totalScanned: products.length,
      lowStockCount: lowStockItems.length,
    });
  };

  const handleApproveProposal = async (proposalId) => {
    const target = reorderProposals.find((p) => p.id === proposalId);
    try {
      await apiService.updateProposalStatus(proposalId, 'APPROVED', authToken);
    } catch (e) {}

    const updated = reorderProposals.map((p) => (p.id === proposalId ? { ...p, status: 'APPROVED' } : p));
    setReorderProposals(updated);
    broadcastSync('SYNC_PROPOSALS', updated, 'petcare_reorderProposals');
    if (target) {
      handleAddAuditLog(
        'INVENTORY',
        'Phê duyệt & nhập kho đề xuất AI',
        `Duyệt nhập +${target.suggestedQuantity} "${target.productName}" (SKU: ${target.sku}) — tồn kho tự động cộng thêm.`
      );
    }
    await syncLiveDatabase();
    toast.success(
      `Đã phê duyệt phiếu đề xuất và cộng +${target?.suggestedQuantity || 0} sản phẩm vào tồn kho thực tế!`,
      'Phê Duyệt Đề Xuất Nhập Hàng'
    );
  };

  const handleExecuteProposalInbound = async (proposal) => {
    // Note: Backend updateProposal('APPROVED') already increments MongoDB stock; only increment manually if offline/non-Mongo proposal
    if (!isMongoObjectId(proposal.id)) {
      const updatedProducts = products.map((p) =>
        p.id === proposal.productId ? { ...p, currentStock: p.currentStock + proposal.suggestedQuantity } : p
      );
      setProducts(updatedProducts);
      broadcastSync('SYNC_PRODUCTS', updatedProducts, 'petcare_products');
    }
    const updatedProposals = reorderProposals.map((p) =>
      p.id === proposal.id ? { ...p, status: 'COMPLETED' } : p
    );
    setReorderProposals(updatedProposals);
    broadcastSync('SYNC_PROPOSALS', updatedProposals, 'petcare_reorderProposals');
    handleAddAuditLog('INVENTORY', 'Xác nhận hoàn tất nhập kho', `Hoàn tất chứng từ nhập +${proposal.suggestedQuantity} "${proposal.productName}".`);
    await syncLiveDatabase();
    toast.success(`Đã xác nhận hoàn tất nhập kho +${proposal.suggestedQuantity} "${proposal.productName}"!`, 'Nhập Kho Thành Công');
  };

  const handleRejectProposal = async (proposalId) => {
    const target = reorderProposals.find((p) => p.id === proposalId);
    try {
      await apiService.updateProposalStatus(proposalId, 'REJECTED', authToken);
    } catch (e) {}

    const updated = reorderProposals.map((p) => (p.id === proposalId ? { ...p, status: 'REJECTED' } : p));
    setReorderProposals(updated);
    broadcastSync('SYNC_PROPOSALS', updated, 'petcare_reorderProposals');
    if (target) {
      handleAddAuditLog('INVENTORY', 'Từ chối đề xuất nhập hàng', `Từ chối phiếu nhập "${target.productName}" (+${target.suggestedQuantity} sp).`);
    }
    await syncLiveDatabase();
    toast.info('Đã từ chối phiếu đề xuất nhập hàng.', 'Đề Xuất Nhập Hàng');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenStaffLogin={() => setShowStaffLoginModal(true)}
        onOpenProfile={() => setProfileModalSignal(s => s + 1)}
        onLogout={handleLogout}
        portalMode={portalMode}
        onSwitchPortalMode={togglePortalMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRole={activeRole}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        adminSidebarCollapsed={adminSidebarCollapsed}
        onToggleAdminSidebar={handleToggleAdminSidebar}
      />

      {/* PORTAL MODE 1: KHÁCH HÀNG (CUSTOMER PORTAL) */}
      {portalMode === 'CUSTOMER' ? (
        <main className="main-app-container">
          <CustomerPortal 
            currentUser={currentUser}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedProductId={selectedProductId}
            onOpenProductDetail={handleOpenProductDetail}
            selectedServiceId={selectedServiceId}
            onOpenServiceDetail={handleOpenServiceDetail}
            pets={pets}
            services={services}
            appointments={appointments}
            products={products}
            promotions={promotions}
            orders={orders}
            reviews={reviews}
            cart={cart}
            setCart={setCart}
            onAddPet={handleAddPet}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            onBookAppointment={handleBookAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
            onCancelAppointment={handleCancelAppointment}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            onUpdateProfile={handleUpdateProfile}
            profileModalSignal={profileModalSignal}
            onCheckoutOrder={handleCheckoutOrder}
            onOpenLogin={() => setShowLoginModal(true)}
            onQuickLogin={(user) => {
              if (!user || user.role !== 'CUSTOMER') return;
              setCurrentUser(user);
              localStorage.setItem('petcare_customer_user', JSON.stringify(user));
            }}
          />
        </main>
      ) : (
        /* PORTAL MODE 2: NHÂN VIÊN, QUẢN LÝ KHO & ADMIN (INTERNAL WORKSPACE) */
        (!currentUser || !['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role)) ? (
          /* Clean Full-Page Login Screen for all 3 Staff/Admin Roles */
          <StaffLoginModal 
            isOpen={true}
            isFullPage={true}
            users={users}
            onLoginSuccess={(user, token) => {
              try {
                localStorage.setItem('petcare_staff_user', JSON.stringify(user));
                if (token) localStorage.setItem('petcare_staff_token', token);
              } catch (e) {}
              setCurrentUser(user);
              if (token) setAuthToken(token);
              setActiveRole(user.role);
              setPortalMode('STAFF');
              if (user.role === 'CARE_STAFF') setActiveTab('queue');
              else if (user.role === 'WAREHOUSE_STAFF') setActiveTab('inventory');
              else setActiveTab('overview');
            }}
          />
        ) : (
          /* Authorized Workspace for Logged-In Role (CARE_STAFF, WAREHOUSE_STAFF, or ADMIN) */
          <div className={`staff-workspace-shell${currentUser.role === 'ADMIN' ? ` admin-workspace-shell${adminSidebarCollapsed ? ' is-sidebar-collapsed' : ''}` : ''}`}>
            <Sidebar 
              activeRole={currentUser.role}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              pendingProposalsCount={reorderProposals.filter(p => p.status === 'DRAFT').length}
              pendingOrdersCount={orders.filter(o => o.status === 'PENDING').length}
              currentUser={currentUser}
              isCollapsed={currentUser.role === 'ADMIN' ? adminSidebarCollapsed : false}
              onToggleCollapse={currentUser.role === 'ADMIN' ? handleToggleAdminSidebar : undefined}
            />

            <main className={`staff-main-content${currentUser.role === 'ADMIN' ? ' admin-main-content' : ''}`}>
              {currentUser.role === 'CARE_STAFF' && (
                <CareStaffDashboard 
                  activeTab={activeTab}
                  appointments={appointments}
                  pets={pets}
                  services={services}
                  promotions={promotions}
                  products={products}
                  orders={orders}
                  reviews={reviews}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                  onCancelAppointment={handleCancelAppointment}
                  onReplyReview={handleReplyReview}
                  onDeleteReview={handleDeleteReview}
                  onAddService={handleAddService}
                  onUpdateService={handleUpdateService}
                  onDeleteService={handleDeleteService}
                  onAddPromotion={handleAddPromotion}
                  onUpdatePromotion={handleUpdatePromotion}
                  onTogglePromotion={handleTogglePromotion}
                  onDeletePromotion={handleDeletePromotion}
                  onAddPet={handleAddPet}
                  onUpdatePet={handleUpdatePet}
                  onDeletePet={handleDeletePet}
                  users={users}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onRequestRestock={handleRequestRestock}
                />
              )}

              {currentUser.role === 'WAREHOUSE_STAFF' && (
                <WarehouseDashboard 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  authToken={authToken}
                  products={products}
                  orders={orders}
                  reorderProposals={reorderProposals}
                  suppliers={suppliers}
                  onAddSupplier={handleAddSupplier}
                  onUpdateStock={handleUpdateStock}
                  onTriggerAI={handleTriggerAI}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onApproveProposal={handleApproveProposal}
                  onRejectProposal={handleRejectProposal}
                  onCreateProposal={handleCreateProposal}
                  onUpdateProposal={handleUpdateProposal}
                  onDeleteProposal={handleDeleteProposal}
                  onExecuteProposalInbound={handleExecuteProposalInbound}
                />
              )}

              {currentUser.role === 'ADMIN' && (
                <AdminDashboard 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  currentUser={currentUser}
                  users={users}
                  pets={pets}
                  appointments={appointments}
                  products={products}
                  services={services}
                  orders={orders}
                  promotions={promotions}
                  reviews={reviews}
                  reorderProposals={reorderProposals}
                  suppliers={suppliers}
                  auditLogs={auditLogs}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  onUpdateUserRole={handleUpdateUserRole}
                  onToggleUserStatus={handleToggleUserStatus}
                  onApproveProposal={handleApproveProposal}
                  onRejectProposal={handleRejectProposal}
                  onAddSupplier={handleAddSupplier}
                  onUpdateSupplier={handleUpdateSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onUpdateStock={handleUpdateStock}
                  onCreateProposal={handleCreateProposal}
                  onAddService={handleAddService}
                  onUpdateService={handleUpdateService}
                  onDeleteService={handleDeleteService}
                  onAddAuditLog={handleAddAuditLog}
                  onClearAuditLogs={handleClearAuditLogs}
                />
              )}
            </main>
          </div>
        )
      )}

      {/* CUSTOMER LOGIN MODAL */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onAddUser={handleAddUser}
        users={users}
        onLoginSuccess={(user, token) => {
          if (!user || user.role !== 'CUSTOMER') {
            toast.error('Email/Số điện thoại hoặc mật khẩu không chính xác.', 'Đăng Nhập Thất Bại');
            return;
          }
          try {
            localStorage.setItem('petcare_customer_user', JSON.stringify(user));
            if (token) localStorage.setItem('petcare_customer_token', token);
          } catch (e) {}
          setCurrentUser(user);
          if (token) setAuthToken(token);
          setPortalMode('CUSTOMER');
          setActiveRole('CUSTOMER');
          setActiveTab('home');
        }}
      />

      {/* STAFF LOGIN MODAL (Overlay) */}
      <StaffLoginModal 
        isOpen={showStaffLoginModal}
        isFullPage={false}
        users={users}
        onClose={() => setShowStaffLoginModal(false)}
        onLoginSuccess={(user, token) => {
          if (!user || !STAFF_ROLES.includes(user.role)) return;
          if (!getUrlPortalConfig().isStaffUrl) {
            window.history.pushState({}, '', '/admin');
          }
          try {
            localStorage.setItem('petcare_staff_user', JSON.stringify(user));
            if (token) localStorage.setItem('petcare_staff_token', token);
          } catch (e) {}
          setCurrentUser(user);
          if (token) setAuthToken(token);
          setActiveRole(user.role);
          setPortalMode('STAFF');
          if (user.role === 'CARE_STAFF') setActiveTab('queue');
          else if (user.role === 'WAREHOUSE_STAFF') setActiveTab('inventory');
          else setActiveTab('overview');
          setShowStaffLoginModal(false);
        }}
      />

      {/* AI SCAN RESULT MODAL */}
      {aiScanModalData && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setAiScanModalData(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7' }}>
                <Brain size={22} color="#0284c7" /> Kết Quả Quét Tồn Kho AI Forecasting Engine
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.2rem 0.55rem' }} onClick={() => setAiScanModalData(null)}>✕</button>
            </div>

            <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                ✅ AI đã hoàn tất quét toàn bộ {aiScanModalData.totalScanned} sản phẩm trong kho!
              </div>
              <div style={{ fontSize: '0.84rem', color: '#334155' }}>
                Phát hiện <strong>{aiScanModalData.lowStockCount}</strong> sản phẩm chạm/dưới ngưỡng an toàn. Đã tự động lập <strong>{aiScanModalData.count}</strong> đề xuất nhập kho mới.
              </div>
            </div>

            {aiScanModalData.createdItems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                {aiScanModalData.createdItems.map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{item.productName}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>SKU: {item.sku} | Tồn hiện tại: <span style={{ color: '#dc2626', fontWeight: 700 }}>{item.currentStock}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.88rem', fontWeight: 800 }}>+{item.suggestedQuantity} sp</span>
                      <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>Tin cậy: {(item.confidenceScore * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
                Các sản phẩm thiếu hụt trước đó đã có trong danh sách đề xuất chờ duyệt!
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setAiScanModalData(null)}>Đóng</button>
              <button className="btn btn-emerald" onClick={() => {
                setAiScanModalData(null);
                setActiveTab('reorder-proposals');
              }}>
                Đến Trang Đề Xuất Nhập Hàng →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTONS: GỌI ĐIỆN, CHAT ZALO & FACEBOOK */}
      {portalMode === 'CUSTOMER' && (
        <FloatingContactWidget 
          onOpenBooking={() => setActiveTab('booking')}
        />
      )}

      {/* GLOBAL TOAST & CONFIRMATION CONTAINER */}
      <ToastContainer />
    </div>
  );
}
