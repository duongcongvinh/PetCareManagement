import React, { useState, useEffect } from 'react';
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
  INITIAL_REVIEWS
} from './mockData';

const STAFF_ROLES = ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'];

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

  const mergeWithDefaults = (incoming, defaultVal, deletedIds = []) => {
    if (!Array.isArray(defaultVal) || !Array.isArray(incoming)) return incoming;
    const deletedSet = new Set(Array.isArray(deletedIds) ? deletedIds : []);
    const defaultMap = new Map(defaultVal.map(i => [i.id, i]));
    const enriched = incoming
      .filter(item => !deletedSet.has(item.id))
      .map(item => {
        const def = defaultMap.get(item.id);
        if (def) {
          return {
            ...def,
            ...item,
            category: def.category || item.category,
            image: def.image || item.image,
          };
        }
        return item;
      });
    const existingIds = new Set(enriched.map(i => i.id));
    const missingItems = defaultVal.filter(i => !existingIds.has(i.id) && !deletedSet.has(i.id));
    return missingItems.length > 0 ? [...missingItems, ...enriched] : enriched;
  };

  const getInitialState = (key, defaultVal, deletedIds = []) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(defaultVal) && Array.isArray(parsed)) {
          const merged = mergeWithDefaults(parsed, defaultVal, deletedIds);
          try {
            localStorage.setItem(key, JSON.stringify(merged));
          } catch (e) {}
          return merged;
        }
        return parsed;
      }
      if (Array.isArray(defaultVal) && deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);
        return defaultVal.filter(i => !deletedSet.has(i.id));
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
    ADMIN: ['overview', 'accounts-admin', 'roles-admin', 'approve-proposals', 'suppliers-admin', 'system-settings'],
    CARE_STAFF: ['queue', 'services', 'promotions', 'pets-logs', 'reports'],
    WAREHOUSE_STAFF: ['inventory', 'products-mgmt', 'demand-forecast', 'reorder-proposals'],
    CUSTOMER: ['home', 'about', 'booking', 'service-detail', 'shop', 'product-detail', 'cart', 'checkout', 'pets', 'history', 'profile', 'reproduction'],
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
  
  // Core Data State (users luôn đồng bộ trực tiếp từ MongoDB, không trộn lại INITIAL_USERS mock)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('petcare_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_USERS;
  });
  const [pets, setPets] = useState(() => getInitialState('petcare_pets', INITIAL_PETS));
  const [services, setServices] = useState(() => {
    const raw = getInitialState('petcare_services', INITIAL_SERVICES);
    return Array.isArray(raw)
      ? raw
          .filter((s) => s.category !== 'Khách Sạn & Lưu Trú')
          .map((s) => (s.category === 'Khoa Sinh Sản' || s.category === 'Khám Bệnh' ? { ...s, category: 'Khám Bệnh & Trị Liệu' } : s))
      : INITIAL_SERVICES;
  });
  const [appointments, setAppointments] = useState(() => getInitialState('petcare_appointments', INITIAL_APPOINTMENTS));
  const [products, setProducts] = useState(() => getInitialState('petcare_products', INITIAL_PRODUCTS, getDeletedProductIds()));
  const [promotions, setPromotions] = useState(() => getInitialState('petcare_promotions', INITIAL_PROMOTIONS));
  const [reorderProposals, setReorderProposals] = useState(() => getInitialState('petcare_reorderProposals', INITIAL_REORDER_PROPOSALS));
  const [suppliers, setSuppliers] = useState(() => getInitialState('petcare_suppliers', INITIAL_SUPPLIERS));
  const [reviews, setReviews] = useState(() => getInitialState('petcare_reviews', INITIAL_REVIEWS));
  const [orders, setOrders] = useState(() => getInitialState('petcare_orders', [
    { id: 'ORD-001', customerName: 'Phạm Minh Anh', phone: '0934567890', items: 'Hạt Royal Canin (2kg) x 2, Pate Cung Đình x 5', total: 600000, status: 'PENDING', date: '2026-08-25 10:30' },
    { id: 'ORD-002', customerName: 'Nguyễn Văn Nam', phone: '0912345678', items: 'Cát Đậu Nành Tofu x 3', total: 270000, status: 'CONFIRMED', date: '2026-08-25 09:15' }
  ]));

  // Dynamic On-Page SEO: title, meta description, canonical, robots & JSON-LD Schema
  useEffect(() => {
    const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
    const selectedService = selectedServiceId ? services.find(s => s.id === selectedServiceId) : null;
    applyPageSEO({ portalMode, activeRole, activeTab, selectedProduct, selectedService, services, products });
  }, [portalMode, activeRole, activeTab, selectedProductId, selectedServiceId, services, products]);
  const [auditLogs, setAuditLogs] = useState(() => getInitialState('petcare_audit_logs', [
    { id: 'log-1', time: '09:00 - Hôm nay', category: 'SYSTEM', actor: 'Nguyễn Văn Admin', action: 'Khởi động cấu hình AI Dự báo', detail: 'Thiết lập mức tin cậy 95% (Z = 1.65) và Lead-time mặc định 4 ngày.' },
    { id: 'log-2', time: '09:45 - Hôm nay', category: 'SECURITY', actor: 'Nguyễn Văn Admin', action: 'Cập nhật ma trận RBAC', detail: 'Xác thực phân quyền 4 vai trò: Khách hàng, Nhân viên, Quản lý kho, Admin.' },
    { id: 'log-3', time: '10:20 - Hôm nay', category: 'INVENTORY', actor: 'Lê Văn Kho', action: 'Gửi đề xuất nhập hàng AI', detail: 'Lập 2 phiếu đề xuất nhập hàng chờ Admin phê duyệt (Royal Canin, Sữa tắm SOS).' }
  ]));

  const handleAddAuditLog = (category, action, detail) => {
    const entry = {
      id: 'log-' + Date.now() + Math.random().toString(36).slice(2, 5),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay',
      category: category || 'SYSTEM',
      actor: currentUser?.fullName || 'Nguyễn Văn Admin',
      action,
      detail
    };
    setAuditLogs(prev => {
      const next = [entry, ...prev].slice(0, 80);
      try { localStorage.setItem('petcare_audit_logs', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    try { localStorage.setItem('petcare_audit_logs', JSON.stringify([])); } catch (e) {}
    toast.info('Đã dọn sạch nhật ký hoạt động.', 'Nhật Ký Hệ Thống');
  };

  // Real-time Multi-Tab BroadcastChannel, Storage Sync & Cross-Browser Central Engine
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('petcare_realtime_sync');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_USERS') setUsers(payload);
        if (type === 'SYNC_APPOINTMENTS') setAppointments(payload);
        if (type === 'SYNC_ORDERS') setOrders(payload);
        if (type === 'SYNC_PETS') setPets(payload);
        if (type === 'SYNC_PRODUCTS') setProducts(mergeWithDefaults(payload, INITIAL_PRODUCTS, getDeletedProductIds()));
        if (type === 'SYNC_PROMOTIONS') setPromotions(payload);
        if (type === 'SYNC_SUPPLIERS') setSuppliers(mergeWithDefaults(payload, INITIAL_SUPPLIERS));
        if (type === 'SYNC_REVIEWS') setReviews(payload);
      };
    } catch (e) {}

    const handleStorageChange = (e) => {
      try {
        if (e.key === 'petcare_users' && e.newValue) setUsers(JSON.parse(e.newValue));
        if (e.key === 'petcare_appointments' && e.newValue) setAppointments(JSON.parse(e.newValue));
        if (e.key === 'petcare_orders' && e.newValue) setOrders(JSON.parse(e.newValue));
        if (e.key === 'petcare_pets' && e.newValue) setPets(JSON.parse(e.newValue));
        if (e.key === 'petcare_products' && e.newValue) setProducts(mergeWithDefaults(JSON.parse(e.newValue), INITIAL_PRODUCTS, getDeletedProductIds()));
        if (e.key === 'petcare_promotions' && e.newValue) setPromotions(JSON.parse(e.newValue));
        if (e.key === 'petcare_suppliers' && e.newValue) setSuppliers(mergeWithDefaults(JSON.parse(e.newValue), INITIAL_SUPPLIERS));
        if (e.key === 'petcare_reviews' && e.newValue) setReviews(JSON.parse(e.newValue));
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorageChange);

    // Fetch real users directly from MongoDB (Single Source of Truth)
    const fetchLiveUsers = async () => {
      try {
        const liveUsers = await apiService.getUsers();
        if (Array.isArray(liveUsers)) {
          setUsers(liveUsers);
          localStorage.setItem('petcare_users', JSON.stringify(liveUsers));
        }
      } catch (err) {}
    };

    // Cross-Browser Sync with Backend API (Syncs Chrome <-> Edge <-> Firefox <-> Mobile)
    let lastSyncTimestamp = 0;

    const pullServerSync = async () => {
      await fetchLiveUsers();
      try {
        const res = await apiService.getLiveSyncState();
        if (res && res.data && res.data.lastUpdated && res.data.lastUpdated > lastSyncTimestamp) {
          lastSyncTimestamp = res.data.lastUpdated;
          if (res.data.appointments) {
            setAppointments(res.data.appointments);
            localStorage.setItem('petcare_appointments', JSON.stringify(res.data.appointments));
          }
          if (res.data.orders) {
            setOrders(res.data.orders);
            localStorage.setItem('petcare_orders', JSON.stringify(res.data.orders));
          }
          if (Array.isArray(res.data.deletedProductIds)) {
            const combinedDeleted = Array.from(new Set([...getDeletedProductIds(), ...res.data.deletedProductIds]));
            try { localStorage.setItem('petcare_deleted_product_ids', JSON.stringify(combinedDeleted)); } catch (e) {}
          }
          if (res.data.products) {
            const deletedIds = getDeletedProductIds();
            const mergedProducts = mergeWithDefaults(res.data.products, INITIAL_PRODUCTS, deletedIds);
            setProducts(mergedProducts);
            localStorage.setItem('petcare_products', JSON.stringify(mergedProducts));
            if (JSON.stringify(mergedProducts) !== JSON.stringify(res.data.products)) {
              apiService.postLiveSyncState({ products: mergedProducts, deletedProductIds: deletedIds });
            }
          }
          if (Array.isArray(res.data.promotions)) {
            setPromotions(res.data.promotions);
            localStorage.setItem('petcare_promotions', JSON.stringify(res.data.promotions));
          }
          if (res.data.pets) {
            setPets(res.data.pets);
            localStorage.setItem('petcare_pets', JSON.stringify(res.data.pets));
          }
          if (Array.isArray(res.data.reviews)) {
            setReviews(res.data.reviews);
            localStorage.setItem('petcare_reviews', JSON.stringify(res.data.reviews));
          }
        } else if (res && !res.data) {
          // If server store is empty, push current active browser state to initialize server (excluding users which live in MongoDB)
          apiService.postLiveSyncState({ appointments, orders, products, pets });
        }
      } catch (err) {}
    };

    // Initial pull
    pullServerSync();

    // Poll every 3 seconds for cross-browser sync (including real MongoDB users)
    const syncInterval = setInterval(pullServerSync, 3000);
    window.addEventListener('focus', pullServerSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', pullServerSync);
      clearInterval(syncInterval);
      if (channel) channel.close();
    };
  }, []);

  // Sync helper (Broadcasts to other tabs + pushes non-user state to backend sync engine)
  const broadcastSync = (type, payload, storageKey) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      const channel = new BroadcastChannel('petcare_realtime_sync');
      channel.postMessage({ type, payload });
      channel.close();
    } catch (e) {}

    // Push to backend sync engine for cross-browser (Chrome <-> Edge); users sync directly via MongoDB /api/users
    const keyMap = {
      'SYNC_APPOINTMENTS': 'appointments',
      'SYNC_ORDERS': 'orders',
      'SYNC_PRODUCTS': 'products',
      'SYNC_PROMOTIONS': 'promotions',
      'SYNC_PETS': 'pets',
      'SYNC_REVIEWS': 'reviews'
    };
    if (keyMap[type]) {
      const syncBody = { [keyMap[type]]: payload };
      if (type === 'SYNC_PRODUCTS') {
        syncBody.deletedProductIds = getDeletedProductIds();
      }
      apiService.postLiveSyncState(syncBody);
    }
  };

  const refreshUsersFromServer = async () => {
    try {
      const liveUsers = await apiService.getUsers();
      if (Array.isArray(liveUsers)) {
        setUsers(liveUsers);
        broadcastSync('SYNC_USERS', liveUsers, 'petcare_users');
      }
    } catch (err) {}
  };

  // Refresh MongoDB users immediately when Admin opens accounts/roles/overview tabs
  useEffect(() => {
    if (portalMode === 'STAFF' && ['overview', 'accounts-admin', 'roles-admin'].includes(activeTab)) {
      refreshUsersFromServer();
    }
  }, [portalMode, activeTab]);

  // Load Live Services & Users from Express API & MongoDB
  useEffect(() => {
    async function loadLiveData() {
      try {
        const liveServices = await apiService.getServices();
        if (Array.isArray(liveServices) && liveServices.length > 0) {
          const cleaned = liveServices
            .filter((s) => s.category !== 'Khách Sạn & Lưu Trú')
            .map((s) => (s.category === 'Khoa Sinh Sản' || s.category === 'Khám Bệnh' ? { ...s, category: 'Khám Bệnh & Trị Liệu' } : s));
          setServices(cleaned);
          try { localStorage.setItem('petcare_services', JSON.stringify(cleaned)); } catch (e) {}
        }
      } catch (err) {
        console.log('Using local fallback state for services');
      }

      try {
        const liveRev = await apiService.getReviews();
        if (liveRev && Array.isArray(liveRev.reviews) && liveRev.reviews.length > 0) {
          setReviews(liveRev.reviews);
          try { localStorage.setItem('petcare_reviews', JSON.stringify(liveRev.reviews)); } catch (e) {}
        }
      } catch (err) {}

      await refreshUsersFromServer();
    }
    loadLiveData();
  }, []);

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
    let updatedPets;
    try {
      const res = await apiService.createPet(petData, authToken);
      if (res && res.id) {
        updatedPets = [res, ...pets];
        setPets(updatedPets);
        broadcastSync('SYNC_PETS', updatedPets, 'petcare_pets');
        return;
      }
    } catch (e) {}

    const newPetObj = {
      ...petData,
      id: 'p-' + Date.now(),
      ownerId: petData.ownerId || currentUser?.id || 'u-4',
      ownerName: petData.ownerName || currentUser?.fullName || 'Phạm Minh Anh',
      ownerPhone: petData.ownerPhone || currentUser?.phone || ''
    };
    updatedPets = [newPetObj, ...pets];
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
        newApp = {
          ...res.appointment,
          appointmentDate: bookingData.appointmentDate,
          totalPrice: bookingData.totalPrice ?? res.appointment.totalPrice ?? selectedService?.price ?? 200000,
          price: bookingData.totalPrice ?? res.appointment.totalPrice ?? selectedService?.price ?? 200000,
          petName: res.appointment.pet?.name || 'Thú Cưng',
          species: res.appointment.pet?.species || 'Chó',
          serviceName: res.appointment.service?.name || selectedService?.name || 'Dịch Vụ',
          customerName: currentUser?.fullName || 'Phạm Minh Anh'
        };
      } else if (res && res.message && !res.appointment && res.message.includes('đã có khách')) {
        return { error: res.message };
      }
    } catch (e) {}

    if (!newApp) {
      const selectedPet = pets.find(p => p.id === bookingData.petId) || pets[0];
      const computedPrice = bookingData.totalPrice ?? selectedService?.price ?? 200000;

      newApp = {
        id: 'app-' + Date.now(),
        petId: selectedPet?.id || bookingData.petId || 'p1',
        petName: selectedPet?.name || 'Thú Cưng',
        species: selectedPet?.species || 'Chó',
        customerId: currentUser?.id || 'u-4',
        customerName: currentUser?.fullName || 'Phạm Minh Anh',
        customerPhone: currentUser?.phone || '0934567890',
        serviceId: selectedService?.id || bookingData.serviceId || 's1',
        serviceName: selectedService?.name || 'Dịch Vụ',
        price: computedPrice,
        totalPrice: computedPrice,
        appointmentDate: bookingData.appointmentDate,
        timeSlot: bookingData.timeSlot,
        status: 'PENDING',
        notes: bookingData.notes || '',
        careSummary: null,
        staffName: null
      };
    }

    const updated = [newApp, ...appointments];
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
    return { success: true };
  };

  const handleCheckoutOrder = (cartItems, total, shippingInfo = {}) => {
    const newOrder = {
      id: shippingInfo.orderId || ('ORD-' + Date.now().toString().slice(-6)),
      customerId: currentUser?.id || 'u-4',
      customerName: shippingInfo.recipientName || currentUser?.fullName || 'Phạm Minh Anh',
      phone: shippingInfo.recipientPhone || currentUser?.phone || '0901234567',
      address: shippingInfo.deliveryAddress || 'TP. Hồ Chí Minh',
      paymentMethod: shippingInfo.paymentMethod === 'PAYOS' ? 'Thanh Toán Online (payOS)' : 'Tiền Mặt COD',
      shippingMethod: shippingInfo.shippingMethod === 'EXPRESS' ? 'Hỏa Tốc 2H' : 'Tiêu Chuẩn (1-2 ngày)',
      notes: shippingInfo.deliveryNotes || '',
      items: cartItems.map(i => `${i.name} x ${i.quantity}`).join(', '),
      total: total,
      status: shippingInfo.status || 'PENDING',
      date: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
    };
    
    // Deduct stock
    const updatedProducts = products.map(p => {
      const cartItem = cartItems.find(item => item.id === p.id);
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
        customerId: currentUser?.id || 'u-4',
        customerName: currentUser?.fullName || 'Khách hàng Petzera',
        petName: reviewData.petName || null,
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment || '',
        staffReply: null,
        createdAt: new Date().toISOString()
      };
    }

    const updated = [created, ...reviews];
    setReviews(updated);
    broadcastSync('SYNC_REVIEWS', updated, 'petcare_reviews');
    toast.success('Cảm ơn bạn đã gửi đánh giá cho Petzera! ⭐', 'Đánh Giá Thành Công');
    return { success: true, review: created };
  };

  const handleReplyReview = async (reviewId, staffReply) => {
    const cleanReply = String(staffReply || '').trim();
    if (!cleanReply) return;
    try {
      await apiService.replyReview(reviewId, cleanReply, authToken);
    } catch (e) {}
    const updated = reviews.map(r => (r.id === reviewId ? { ...r, staffReply: cleanReply } : r));
    setReviews(updated);
    broadcastSync('SYNC_REVIEWS', updated, 'petcare_reviews');
    toast.success('Đã gửi phản hồi tới đánh giá của khách hàng!', 'Phản Hồi Đánh Giá');
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await apiService.deleteReview(reviewId, authToken);
    } catch (e) {}
    const updated = reviews.filter(r => r.id !== reviewId);
    setReviews(updated);
    broadcastSync('SYNC_REVIEWS', updated, 'petcare_reviews');
    toast.info('Đã xóa đánh giá.', 'Đánh Giá Khách Hàng');
  };

  const handleRescheduleAppointment = async (appId, updates) => {
    const target = appointments.find(a => a.id === appId);
    if (!target) return { error: 'Không tìm thấy lịch hẹn cần đổi!' };

    const isConflict = appointments.some(a =>
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

    const updated = appointments.map(a =>
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
    toast.success('Đã đổi lịch hẹn thành công!', 'Đổi Lịch Hẹn');
    return { success: true };
  };

  const handleCancelAppointment = async (appId) => {
    try {
      await apiService.cancelAppointment(appId, authToken);
    } catch (e) {}

    const updated = appointments.map(a => {
      if (a.id === appId) {
        return { ...a, status: 'CANCELLED' };
      }
      return a;
    });
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
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
        toast.success('Cập nhật hồ sơ thông tin cá nhân thành công!', 'Hồ Sơ Cá Nhân');
        return { success: true };
      }
    } catch (e) {}

    const updatedUser = { 
      ...currentUser, 
      fullName: profileData.fullName || currentUser?.fullName, 
      phone: profileData.phone !== undefined ? profileData.phone : currentUser?.phone,
      address: profileData.address !== undefined ? profileData.address : currentUser?.address
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
    try {
      await apiService.updateAppointmentStatus(appId, newStatus, summary, authToken);
    } catch (e) {}

    const updated = appointments.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: newStatus,
          careSummary: summary || a.careSummary,
          staffName: currentUser?.fullName || 'Trần Thị Chăm Sóc'
        };
      }
      return a;
    });
    setAppointments(updated);
    broadcastSync('SYNC_APPOINTMENTS', updated, 'petcare_appointments');
  };

  // 3. Warehouse Actions
  const handleUpdateStock = async (productId, type, quantity, note, thresholds = {}) => {
    const parsedQty = parseInt(quantity, 10);
    const qtyNum = Number.isNaN(parsedQty) ? 0 : Math.max(0, parsedQty);
    try {
      await apiService.updateStock(productId, type, qtyNum, note, authToken, thresholds);
    } catch (e) {}

    const target = products.find(p => p.id === productId);
    const updated = products.map(p => {
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
    toast.success(
      type === 'ADJUSTMENT'
        ? `Đã điều chỉnh tồn kho "${target?.name || ''}" về ${qtyNum} sản phẩm!`
        : 'Cập nhật giao dịch tồn kho thành công!',
      type === 'ADJUSTMENT' ? 'Điều Chỉnh Tồn Kho' : 'Quản Lý Kho Hàng'
    );
  };

  const handleDeleteProduct = async (productId) => {
    const target = products.find(p => p.id === productId);
    try {
      await apiService.deleteProduct(productId, authToken);
    } catch (e) {}

    const nextDeletedIds = Array.from(new Set([...getDeletedProductIds(), productId]));
    try { localStorage.setItem('petcare_deleted_product_ids', JSON.stringify(nextDeletedIds)); } catch (e) {}

    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    if (target) {
      handleAddAuditLog('INVENTORY', 'Xóa sản phẩm khỏi kho', `Đã xóa "${target.name}" (SKU: ${target.sku}).`);
      toast.info(`Đã xóa sản phẩm "${target.name}" khỏi kho hàng.`, 'Quản Lý Kho Hàng');
    }
  };

  const handleAddSupplier = async (supData) => {
    let created;
    try {
      const res = await apiService.createSupplier(supData, authToken);
      if (res && res.supplier) created = res.supplier;
    } catch (e) {}

    if (!created) {
      created = {
        ...supData,
        id: 'sup-' + Date.now()
      };
    }
    const updated = [created, ...suppliers];
    setSuppliers(updated);
    broadcastSync('SYNC_SUPPLIERS', updated, 'petcare_suppliers');
    handleAddAuditLog('SYSTEM', 'Thêm nhà cung cấp', `Đã thêm đối tác "${created.name}".`);
    toast.success(`Đã thêm nhà cung cấp mới: ${created.name}`, 'Nhà Cung Cấp');
  };

  const handleUpdateSupplier = (supplierId, updates) => {
    const updated = suppliers.map(s => s.id === supplierId ? { ...s, ...updates } : s);
    setSuppliers(updated);
    broadcastSync('SYNC_SUPPLIERS', updated, 'petcare_suppliers');
    handleAddAuditLog('SYSTEM', 'Cập nhật nhà cung cấp', `Cập nhật thông tin đối tác "${updates.name || supplierId}".`);
  };

  const handleDeleteSupplier = (supplierId) => {
    const target = suppliers.find(s => s.id === supplierId);
    const updated = suppliers.filter(s => s.id !== supplierId);
    setSuppliers(updated);
    broadcastSync('SYNC_SUPPLIERS', updated, 'petcare_suppliers');
    if (target) {
      handleAddAuditLog('SYSTEM', 'Xóa nhà cung cấp', `Đã xóa đối tác "${target.name}".`);
      toast.info(`Đã xóa nhà cung cấp "${target.name}".`, 'Nhà Cung Cấp');
    }
  };

  // Services, Promotions & Pet Medical Handlers (Care Staff)
  const handleAddService = async (svcData) => {
    let created = null;
    try {
      const res = await apiService.createService(svcData, authToken);
      if (res && res.service && res.service.id) created = res.service;
      else if (res && res.id) created = res;
    } catch (e) {}

    if (!created) {
      created = { ...svcData, id: 's-' + Date.now(), status: 'ACTIVE' };
    }
    const updated = [created, ...services];
    setServices(updated);
    try { localStorage.setItem('petcare_services', JSON.stringify(updated)); } catch (e) {}
  };

  const handleUpdateService = async (serviceId, updates) => {
    try {
      await apiService.updateService(serviceId, updates, authToken);
    } catch (e) {}
    const updated = services.map(s => s.id === serviceId ? { ...s, ...updates } : s);
    setServices(updated);
    try { localStorage.setItem('petcare_services', JSON.stringify(updated)); } catch (e) {}
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await apiService.deleteService(serviceId, authToken);
    } catch (e) {}
    const updated = services.filter(s => s.id !== serviceId);
    setServices(updated);
    try { localStorage.setItem('petcare_services', JSON.stringify(updated)); } catch (e) {}
  };

  const handleAddPromotion = (promoData) => {
    const created = {
      ...promoData,
      id: 'promo-' + Date.now(),
      status: promoData.status || 'ACTIVE'
    };
    const updated = [created, ...promotions];
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    toast.success(`Đã tạo mã khuyến mãi ${created.code} (-${created.discountPercent}%)!`, 'Khuyến Mãi');
  };

  const handleUpdatePromotion = (promoId, updates) => {
    const updated = promotions.map(p => p.id === promoId ? { ...p, ...updates } : p);
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    handleAddAuditLog('SYSTEM', 'Chỉnh sửa chương trình khuyến mãi', `Cập nhật mã ${updates.code || promoId} (-${updates.discountPercent ?? ''}%).`);
    toast.success(`Đã cập nhật chương trình khuyến mãi "${updates.code || ''}"!`, 'Khuyến Mãi');
  };

  const handleTogglePromotion = (promoId) => {
    const updated = promotions.map(p => p.id === promoId ? { ...p, status: p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : p);
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    toast.info('Đã cập nhật trạng thái chương trình khuyến mãi.', 'Khuyến Mãi');
  };

  const handleDeletePromotion = (promoId) => {
    const updated = promotions.filter(p => p.id !== promoId);
    setPromotions(updated);
    broadcastSync('SYNC_PROMOTIONS', updated, 'petcare_promotions');
    toast.info('Đã xóa chương trình khuyến mãi.', 'Khuyến Mãi');
  };

  const handleUpdatePet = async (petId, updates) => {
    try {
      await apiService.updatePet(petId, updates, authToken);
    } catch (e) {}
    const updated = pets.map(p => p.id === petId ? { ...p, ...updates } : p);
    setPets(updated);
    broadcastSync('SYNC_PETS', updated, 'petcare_pets');
  };

  const handleDeletePet = async (petId) => {
    const target = pets.find(p => p.id === petId);
    try {
      await apiService.deletePet(petId, authToken);
    } catch (e) {}
    const updated = pets.filter(p => p.id !== petId);
    setPets(updated);
    broadcastSync('SYNC_PETS', updated, 'petcare_pets');
    if (target) {
      toast.info(`Đã xóa hồ sơ thú cưng "${target.name}".`, 'Hồ Sơ Thú Cưng');
    }
  };

  const handleUpdateProposal = (proposalId, updates) => {
    const updated = reorderProposals.map(p => (p.id === proposalId ? { ...p, ...updates } : p));
    setReorderProposals(updated);
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(updated)); } catch (e) {}
    toast.success('Đã cập nhật phiếu đề xuất nhập hàng!', 'Đề Xuất Nhập Hàng');
  };

  const handleDeleteProposal = (proposalId) => {
    const target = reorderProposals.find(p => p.id === proposalId);
    const updated = reorderProposals.filter(p => p.id !== proposalId);
    setReorderProposals(updated);
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(updated)); } catch (e) {}
    toast.info(`Đã xóa phiếu đề xuất${target ? ` "${target.productName}"` : ''}.`, 'Đề Xuất Nhập Hàng');
  };

  const handleCreateProposal = (propData) => {
    const newItem = {
      id: 'prop-' + Date.now().toString().slice(-5),
      productId: propData.productId,
      productName: propData.productName,
      sku: propData.sku || 'SKU',
      currentStock: propData.currentStock ?? 0,
      minStockLevel: propData.minStockLevel ?? 10,
      safetyStock: 12,
      suggestedQuantity: parseInt(propData.suggestedQuantity, 10) || 20,
      suggestedOrderDate: propData.suggestedOrderDate || new Date().toISOString().split('T')[0],
      suggestedSupplier: propData.suggestedSupplier || 'Royal Canin Việt Nam',
      confidenceScore: propData.confidenceScore || 0.95,
      reason: propData.reason || 'Đề xuất nhập hàng mới.',
      status: 'DRAFT',
      createdAt: new Date().toLocaleTimeString('vi-VN')
    };
    const updated = [newItem, ...reorderProposals];
    setReorderProposals(updated);
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(updated)); } catch (e) {}
    toast.success(`Đã lập phiếu đề xuất nhập +${newItem.suggestedQuantity} ${newItem.productName}!`, 'Đề Xuất Nhập Hàng');
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
      suggestedSupplier: product.supplierName || 'Royal Canin Việt Nam',
      reason: `Yêu cầu nhập bổ sung từ bộ phận Nhân viên (${currentUser?.fullName || 'Nhân viên'}). Tồn kho hiện tại: ${product.currentStock} sp.`
    });
  };

  // Add & Update Product Actions
  const handleAddProduct = async (newProdData) => {
    const payload = {
      name: newProdData.name.trim(),
      sku: (newProdData.sku || ('SKU-' + Math.floor(1000 + Math.random() * 9000))).trim().toUpperCase(),
      category: newProdData.category || 'Thức ăn',
      unitPrice: parseFloat(newProdData.unitPrice) || 100000,
      costPrice: parseFloat(newProdData.costPrice) || Math.round((parseFloat(newProdData.unitPrice) || 100000) * 0.65),
      currentStock: Math.max(0, parseInt(newProdData.currentStock, 10) || 0),
      minStockLevel: Math.max(0, parseInt(newProdData.minStockLevel, 10) || 10),
      maxStockLevel: Math.max(1, parseInt(newProdData.maxStockLevel, 10) || 100),
      supplierName: newProdData.supplierName || 'Royal Canin Việt Nam'
    };

    let created = null;
    try {
      const res = await apiService.createProduct(payload, authToken);
      if (res && res.id) {
        created = { ...payload, ...res };
      }
    } catch (e) {}

    if (!created) {
      created = { ...payload, id: 'prod-' + Date.now() };
    }
    const updated = [created, ...products];
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    handleAddAuditLog('INVENTORY', 'Thêm sản phẩm mới', `Thêm "${created.name}" (SKU: ${created.sku}, giá ${Number(created.unitPrice).toLocaleString('vi-VN')}đ).`);
    toast.success(`Đã thêm sản phẩm mới thành công: ${created.name}`, 'Quản Lý Sản Phẩm');
  };

  const handleUpdateProduct = async (productId, updates) => {
    const payload = {
      ...updates,
      name: updates.name ? updates.name.trim() : undefined,
      sku: updates.sku ? updates.sku.trim().toUpperCase() : undefined,
      unitPrice: updates.unitPrice !== undefined ? (parseFloat(updates.unitPrice) || 0) : undefined,
      costPrice: updates.costPrice !== undefined ? (parseFloat(updates.costPrice) || 0) : undefined,
      currentStock: updates.currentStock !== undefined ? Math.max(0, parseInt(updates.currentStock, 10) || 0) : undefined,
      minStockLevel: updates.minStockLevel !== undefined ? Math.max(0, parseInt(updates.minStockLevel, 10) || 0) : undefined,
      maxStockLevel: updates.maxStockLevel !== undefined ? Math.max(1, parseInt(updates.maxStockLevel, 10) || 100) : undefined,
    };

    try {
      await apiService.updateProduct(productId, payload, authToken);
    } catch (e) {}

    const updated = products.map(p => (p.id === productId ? { ...p, ...payload } : p));
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    handleAddAuditLog('INVENTORY', 'Cập nhật sản phẩm', `Cập nhật thông tin sản phẩm "${payload.name || productId}" (SKU: ${payload.sku || ''}).`);
    toast.success(`Đã cập nhật thông tin sản phẩm "${payload.name || ''}"!`, 'Quản Lý Sản Phẩm');
  };

  // 4. AI Forecasting & Reorder Proposal Actions
  const [aiScanModalData, setAiScanModalData] = useState(null);

  const handleTriggerAI = async () => {
    try {
      await apiService.triggerAIForecast(authToken);
    } catch (e) {}

    const lowStockItems = products.filter(p => p.currentStock <= p.minStockLevel + 5);
    let count = 0;
    const newProposals = [...reorderProposals];
    const createdItems = [];

    lowStockItems.forEach(p => {
      if (!newProposals.some(prop => prop.productId === p.id && prop.status === 'DRAFT')) {
        const qty = p.maxStockLevel - p.currentStock;
        const item = {
          id: 'prop-' + Date.now() + Math.random().toString(36).substr(2, 4),
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          currentStock: p.currentStock,
          minStockLevel: p.minStockLevel,
          safetyStock: 12,
          suggestedQuantity: Math.max(qty, 15),
          suggestedOrderDate: new Date().toISOString().split('T')[0],
          suggestedSupplier: p.supplierName || 'Royal Canin Việt Nam',
          confidenceScore: parseFloat((0.90 + Math.random() * 0.08).toFixed(2)),
          reason: `[AI Demand Model - 95% confidence]: Doanh số dự báo tăng 30%. Tồn kho (${p.currentStock}) vi phạm ngưỡng an toàn (${p.minStockLevel}).`,
          status: 'DRAFT',
          createdAt: new Date().toLocaleTimeString('vi-VN')
        };
        newProposals.unshift(item);
        createdItems.push(item);
        count++;
      }
    });

    setReorderProposals(newProposals);
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(newProposals)); } catch (e) {}
    setAiScanModalData({
      count,
      createdItems,
      totalScanned: products.length,
      lowStockCount: lowStockItems.length
    });
  };

  const handleApproveProposal = async (proposalId) => {
    try {
      await apiService.updateProposalStatus(proposalId, 'APPROVED', authToken);
    } catch (e) {}

    const target = reorderProposals.find(p => p.id === proposalId);
    const updated = reorderProposals.map(p => p.id === proposalId ? { ...p, status: 'APPROVED' } : p);
    setReorderProposals(updated);
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(updated)); } catch (e) {}
    if (target) {
      handleAddAuditLog('INVENTORY', 'Phê duyệt đề xuất nhập hàng', `Duyệt nhập +${target.suggestedQuantity} "${target.productName}" (SKU: ${target.sku}).`);
    }
    toast.success('Đã duyệt phiếu đề xuất! Bộ phận Kho có thể bấm "Xác Nhận Nhập Kho" khi hàng về.', 'Phê Duyệt Đề Xuất Nhập Hàng');
  };

  const handleExecuteProposalInbound = (proposal) => {
    const updatedProducts = products.map(p =>
      p.id === proposal.productId ? { ...p, currentStock: p.currentStock + proposal.suggestedQuantity } : p
    );
    const updatedProposals = reorderProposals.map(p =>
      p.id === proposal.id ? { ...p, status: 'COMPLETED' } : p
    );
    setProducts(updatedProducts);
    setReorderProposals(updatedProposals);
    broadcastSync('SYNC_PRODUCTS', updatedProducts, 'petcare_products');
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(updatedProposals)); } catch (e) {}
    handleAddAuditLog('INVENTORY', 'Xác nhận nhập kho thực tế', `Đã nhập kho +${proposal.suggestedQuantity} "${proposal.productName}".`);
    toast.success(`Đã nhập kho thực tế +${proposal.suggestedQuantity} "${proposal.productName}"!`, 'Nhập Kho Thành Công');
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await apiService.updateProposalStatus(proposalId, 'REJECTED', authToken);
    } catch (e) {}

    const target = reorderProposals.find(p => p.id === proposalId);
    const updated = reorderProposals.map(p => p.id === proposalId ? { ...p, status: 'REJECTED' } : p);
    setReorderProposals(updated);
    try { localStorage.setItem('petcare_reorderProposals', JSON.stringify(updated)); } catch (e) {}
    if (target) {
      handleAddAuditLog('INVENTORY', 'Từ chối đề xuất nhập hàng', `Từ chối phiếu nhập "${target.productName}" (+${target.suggestedQuantity} sp).`);
    }
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
          <div className="staff-workspace-shell">
            <Sidebar 
              activeRole={currentUser.role}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              pendingProposalsCount={reorderProposals.filter(p => p.status === 'DRAFT').length}
            />

            <main className="staff-main-content">
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
                  onUpdateOrderStatus={(id, status) => {
                    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
                    setOrders(updated);
                    broadcastSync('SYNC_ORDERS', updated, 'petcare_orders');
                  }}
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
                  appointments={appointments}
                  products={products}
                  services={services}
                  orders={orders}
                  promotions={promotions}
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
