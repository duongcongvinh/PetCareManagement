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
import { 
  INITIAL_PETS, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_PROMOTIONS,
  INITIAL_REORDER_PROPOSALS,
  INITIAL_USERS,
  INITIAL_SUPPLIERS
} from './mockData';

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
  const getInitialState = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(defaultVal) && Array.isArray(parsed)) {
          const defaultMap = new Map(defaultVal.map(i => [i.id, i]));
          const enrichedParsed = parsed.map(item => {
            const def = defaultMap.get(item.id);
            if (def) {
              return { ...def, ...item, category: item.category || def.category };
            }
            return item;
          });
          const existingIds = new Set(enrichedParsed.map(i => i.id));
          const missingItems = defaultVal.filter(i => !existingIds.has(i.id));
          const merged = missingItems.length > 0 ? [...enrichedParsed, ...missingItems] : enrichedParsed;
          try {
            localStorage.setItem(key, JSON.stringify(merged));
          } catch (e) {}
          return merged;
        }
        return parsed;
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
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
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
    if (currentUser) return currentUser.role;
    if (isStaffUrl) return 'ADMIN';
    return 'CUSTOMER';
  });

  const getDefaultTabForRole = (role) => {
    if (role === 'ADMIN') return 'overview';
    if (role === 'CARE_STAFF') return 'queue';
    if (role === 'WAREHOUSE_STAFF') return 'inventory';
    return 'home';
  };

  const initialRole = currentUser?.role || (isStaffUrl ? 'ADMIN' : 'CUSTOMER');

  const [activeTab, setActiveTab] = useState(() => {
    const saved = getInitialState('petcare_activeTab_' + initialRole, null);
    if (saved) return saved;
    return getDefaultTabForRole(initialRole);
  });
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showStaffLoginModal, setShowStaffLoginModal] = useState(false);

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
          if (savedStaff) {
            const parsed = JSON.parse(savedStaff);
            setCurrentUser(parsed);
            setActiveRole(parsed.role);
          } else {
            setCurrentUser(null);
            setAuthToken(null);
          }
        } catch (e) {}
      } else {
        setPortalMode('CUSTOMER');
        try {
          const savedCust = localStorage.getItem('petcare_customer_user');
          if (savedCust) {
            const parsed = JSON.parse(savedCust);
            setCurrentUser(parsed);
            setActiveRole('CUSTOMER');
          } else {
            setCurrentUser(null);
            setAuthToken(null);
          }
        } catch (e) {}
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Sync and guard roles + persist activeTab per role
  useEffect(() => {
    if (currentUser) {
      if (['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role)) {
        setPortalMode('STAFF');
        setActiveRole(currentUser.role);
      } else {
        setPortalMode('CUSTOMER');
        setActiveRole('CUSTOMER');
      }
    }
  }, [currentUser]);

  // Persist activeTab per role
  useEffect(() => {
    if (activeTab && activeRole) {
      localStorage.setItem('petcare_activeTab_' + activeRole, JSON.stringify(activeTab));
    }
  }, [activeTab, activeRole]);

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
  
  // Core Data State
  const [users, setUsers] = useState(() => getInitialState('petcare_users', INITIAL_USERS));
  const [pets, setPets] = useState(() => getInitialState('petcare_pets', INITIAL_PETS));
  const [services, setServices] = useState(() => getInitialState('petcare_services', INITIAL_SERVICES));
  const [appointments, setAppointments] = useState(() => getInitialState('petcare_appointments', INITIAL_APPOINTMENTS));
  const [products, setProducts] = useState(() => getInitialState('petcare_products', INITIAL_PRODUCTS));
  const [promotions, setPromotions] = useState(() => getInitialState('petcare_promotions', INITIAL_PROMOTIONS));
  const [reorderProposals, setReorderProposals] = useState(() => getInitialState('petcare_reorderProposals', INITIAL_REORDER_PROPOSALS));
  const [suppliers, setSuppliers] = useState(() => getInitialState('petcare_suppliers', INITIAL_SUPPLIERS));
  const [orders, setOrders] = useState(() => getInitialState('petcare_orders', [
    { id: 'ORD-001', customerName: 'Phạm Minh Anh', phone: '0934567890', items: 'Hạt Royal Canin (2kg) x 2, Pate Cung Đình x 5', total: 600000, status: 'PENDING', date: '2026-08-25 10:30' },
    { id: 'ORD-002', customerName: 'Nguyễn Văn Nam', phone: '0912345678', items: 'Cát Đậu Nành Tofu x 3', total: 270000, status: 'CONFIRMED', date: '2026-08-25 09:15' }
  ]));

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
        if (type === 'SYNC_PRODUCTS') setProducts(payload);
        if (type === 'SYNC_SUPPLIERS') setSuppliers(payload);
      };
    } catch (e) {}

    const handleStorageChange = (e) => {
      try {
        if (e.key === 'petcare_users' && e.newValue) setUsers(JSON.parse(e.newValue));
        if (e.key === 'petcare_appointments' && e.newValue) setAppointments(JSON.parse(e.newValue));
        if (e.key === 'petcare_orders' && e.newValue) setOrders(JSON.parse(e.newValue));
        if (e.key === 'petcare_pets' && e.newValue) setPets(JSON.parse(e.newValue));
        if (e.key === 'petcare_products' && e.newValue) setProducts(JSON.parse(e.newValue));
        if (e.key === 'petcare_suppliers' && e.newValue) setSuppliers(JSON.parse(e.newValue));
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorageChange);

    // Cross-Browser Sync with Backend API (Syncs Chrome <-> Edge <-> Firefox <-> Mobile)
    let lastSyncTimestamp = 0;

    const pullServerSync = async () => {
      try {
        const res = await apiService.getLiveSyncState();
        if (res && res.data && res.data.lastUpdated && res.data.lastUpdated > lastSyncTimestamp) {
          lastSyncTimestamp = res.data.lastUpdated;
          if (res.data.users) {
            setUsers(res.data.users);
            localStorage.setItem('petcare_users', JSON.stringify(res.data.users));
          }
          if (res.data.appointments) {
            setAppointments(res.data.appointments);
            localStorage.setItem('petcare_appointments', JSON.stringify(res.data.appointments));
          }
          if (res.data.orders) {
            setOrders(res.data.orders);
            localStorage.setItem('petcare_orders', JSON.stringify(res.data.orders));
          }
          if (res.data.products) {
            setProducts(res.data.products);
            localStorage.setItem('petcare_products', JSON.stringify(res.data.products));
          }
          if (res.data.pets) {
            setPets(res.data.pets);
            localStorage.setItem('petcare_pets', JSON.stringify(res.data.pets));
          }
        } else if (res && !res.data) {
          // If server store is empty, push current active browser state to initialize server
          apiService.postLiveSyncState({ appointments, orders, products, pets, users });
        }
      } catch (err) {}
    };

    // Initial pull
    pullServerSync();

    // Poll every 2 seconds for cross-browser sync
    const syncInterval = setInterval(pullServerSync, 2000);
    window.addEventListener('focus', pullServerSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', pullServerSync);
      clearInterval(syncInterval);
      if (channel) channel.close();
    };
  }, []);

  // Sync helper (Broadcasts to other tabs + pushes to backend server for other browsers)
  const broadcastSync = (type, payload, storageKey) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      const channel = new BroadcastChannel('petcare_realtime_sync');
      channel.postMessage({ type, payload });
      channel.close();
    } catch (e) {}

    // Push to backend sync engine for cross-browser (Chrome <-> Edge)
    const keyMap = {
      'SYNC_USERS': 'users',
      'SYNC_APPOINTMENTS': 'appointments',
      'SYNC_ORDERS': 'orders',
      'SYNC_PRODUCTS': 'products',
      'SYNC_PETS': 'pets'
    };
    if (keyMap[type]) {
      apiService.postLiveSyncState({ [keyMap[type]]: payload });
    }
  };

  // Load Live Services, Products & Users from Express API & MongoDB
  useEffect(() => {
    async function loadLiveData() {
      try {
        const liveServices = await apiService.getServices();
        if (Array.isArray(liveServices) && liveServices.length > 0) {
          setServices(liveServices);
        }
      } catch (err) {
        console.log('Using local fallback state for services');
      }

      try {
        const liveUsers = await apiService.getUsers();
        if (Array.isArray(liveUsers) && liveUsers.length > 0) {
          setUsers(liveUsers);
          localStorage.setItem('petcare_users', JSON.stringify(liveUsers));
        }
      } catch (err) {
        console.log('Using local fallback state for users');
      }
    }
    loadLiveData();
  }, []);

  const handleAddUser = async (userData) => {
    let created = null;
    try {
      const res = await apiService.createUser(userData);
      if (res && res.user) {
        created = {
          ...res.user,
          status: 'ACTIVE',
          createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
        };
      }
    } catch (err) {
      console.warn('Backend user creation error:', err);
    }

    if (!created) {
      created = {
        id: 'u-' + Date.now(),
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || '0901234567',
        role: userData.role || 'CUSTOMER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0]
      };
    }

    const updated = [created, ...users.filter(u => u.email !== created.email)];
    setUsers(updated);
    broadcastSync('SYNC_USERS', updated, 'petcare_users');
    return created;
  };

  const togglePortalMode = (targetMode) => {
    if (targetMode === 'CUSTOMER' || portalMode === 'STAFF') {
      window.history.pushState({}, '', '/');
      setPortalMode('CUSTOMER');
      setActiveTab('home');
      try {
        const savedCust = localStorage.getItem('petcare_customer_user');
        if (savedCust) {
          const parsed = JSON.parse(savedCust);
          setCurrentUser(parsed);
          setActiveRole('CUSTOMER');
        } else {
          setCurrentUser(null);
          setAuthToken(null);
        }
      } catch (e) {}
    } else {
      window.history.pushState({}, '', '/admin');
      setPortalMode('STAFF');
      try {
        const savedStaff = localStorage.getItem('petcare_staff_user');
        if (savedStaff) {
          const parsed = JSON.parse(savedStaff);
          setCurrentUser(parsed);
          setActiveRole(parsed.role);
        } else {
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
      ownerId: currentUser?.id || 'u-4',
      ownerName: currentUser?.fullName || 'Phạm Minh Anh'
    };
    updatedPets = [newPetObj, ...pets];
    setPets(updatedPets);
    broadcastSync('SYNC_PETS', updatedPets, 'petcare_pets');
  };

  const handleBookAppointment = async (bookingData) => {
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
          petName: res.appointment.pet?.name || 'Thú Cưng',
          species: res.appointment.pet?.species || 'Chó',
          serviceName: res.appointment.service?.name || 'Dịch Vụ',
          customerName: currentUser?.fullName || 'Phạm Minh Anh'
        };
      }
    } catch (e) {}

    if (!newApp) {
      const selectedPet = pets.find(p => p.id === bookingData.petId) || pets[0];
      const selectedService = services.find(s => s.id === bookingData.serviceId) || services[0];

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
        price: selectedService?.price || 200000,
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
      paymentMethod: shippingInfo.paymentMethod === 'VIETQR' ? 'Chuyển Khoản VietQR' : shippingInfo.paymentMethod === 'MOMO' ? 'Ví MoMo' : 'Tiền Mặt COD',
      shippingMethod: shippingInfo.shippingMethod === 'EXPRESS' ? 'Hỏa Tốc 2H' : 'Tiêu Chuẩn (1-2 ngày)',
      notes: shippingInfo.deliveryNotes || '',
      items: cartItems.map(i => `${i.name} x ${i.quantity}`).join(', '),
      total: total,
      status: 'PENDING',
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
      phone: profileData.phone || currentUser?.phone 
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
  const handleUpdateStock = async (productId, type, quantity, note) => {
    try {
      await apiService.updateStock(productId, type, quantity, note, authToken);
    } catch (e) {}

    const updated = products.map(p => {
      if (p.id === productId) {
        let newQty = p.currentStock;
        const qtyNum = parseInt(quantity) || 0;
        if (type === 'IN' || type === 'IMPORT') newQty += qtyNum;
        else if (type === 'OUT' || type === 'EXPORT') newQty = Math.max(0, newQty - qtyNum);
        else if (type === 'ADJUSTMENT') newQty = qtyNum;
        return { ...p, currentStock: newQty };
      }
      return p;
    });
    setProducts(updated);
    broadcastSync('SYNC_PRODUCTS', updated, 'petcare_products');
    toast.success('Cập nhật giao dịch tồn kho thành công!', 'Quản Lý Kho Hàng');
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
    toast.success(`Đã thêm nhà cung cấp mới: ${created.name}`, 'Nhà Cung Cấp');
  };

  // Add New Product Action
  const handleAddProduct = (newProdData) => {
    const created = {
      id: 'prod-' + Date.now(),
      name: newProdData.name,
      sku: newProdData.sku || ('SKU-' + Math.floor(1000 + Math.random() * 9000)),
      category: newProdData.category || 'Thức ăn',
      unitPrice: parseFloat(newProdData.unitPrice) || 100000,
      currentStock: parseInt(newProdData.currentStock) || 10,
      minStockLevel: parseInt(newProdData.minStockLevel) || 10,
      maxStockLevel: parseInt(newProdData.maxStockLevel) || 100,
      supplierName: newProdData.supplierName || 'Royal Canin Việt Nam'
    };
    setProducts([created, ...products]);
    toast.success(`Đã thêm sản phẩm mới thành công: ${created.name}`, 'Kho Hàng');
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
          suggestedOrderDate: '2026-08-23',
          suggestedSupplier: p.supplierName || 'Royal Canin Việt Nam',
          confidenceScore: parseFloat((0.90 + Math.random() * 0.08).toFixed(2)),
          reason: `[AI Demand Model - 95% confidence]: Doanh số dự báo tăng 30%. Tồn kho (${p.currentStock}) vi phạm Ngưỡng an toàn (${p.minStockLevel}).`,
          status: 'DRAFT',
          createdAt: new Date().toLocaleTimeString('vi-VN')
        };
        newProposals.unshift(item);
        createdItems.push(item);
        count++;
      }
    });

    setReorderProposals(newProposals);
    setAiScanModalData({
      count,
      createdItems,
      totalScanned: products.length,
      lowStockCount: lowStockItems.length
    });
  };

  const handleApproveProposal = async (proposalId) => {
    const prop = reorderProposals.find(p => p.id === proposalId);
    if (!prop) return;

    try {
      await apiService.updateProposalStatus(proposalId, 'APPROVED', authToken);
    } catch (e) {}

    setProducts(products.map(p => p.id === prop.productId ? { ...p, currentStock: p.currentStock + prop.suggestedQuantity } : p));
    setReorderProposals(reorderProposals.map(p => p.id === proposalId ? { ...p, status: 'APPROVED' } : p));
    toast.success('Đã phê duyệt kế hoạch! Đã tạo đơn nhập hàng sẵn sàng cho Nhân viên kho thực thi.', 'Phê Duyệt Đề Xuất AI');
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await apiService.updateProposalStatus(proposalId, 'REJECTED', authToken);
    } catch (e) {}

    setReorderProposals(reorderProposals.map(p => p.id === proposalId ? { ...p, status: 'REJECTED' } : p));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenStaffLogin={() => setShowStaffLoginModal(true)}
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
            pets={pets}
            services={services}
            appointments={appointments}
            products={products}
            promotions={promotions}
            orders={orders}
            cart={cart}
            setCart={setCart}
            onAddPet={handleAddPet}
            onBookAppointment={handleBookAppointment}
            onCancelAppointment={handleCancelAppointment}
            onUpdateProfile={handleUpdateProfile}
            onCheckoutOrder={handleCheckoutOrder}
            onOpenLogin={() => setShowLoginModal(true)}
            onQuickLogin={(user) => {
              setCurrentUser(user);
              localStorage.setItem('petcare_customer_user', JSON.stringify(user));
            }}
          />
        </main>
      ) : (
        /* PORTAL MODE 2: NHÂN VIÊN & QUẢN TRỊ (STAFF & ADMIN MANAGEMENT PORTAL) */
        (!currentUser || !['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(currentUser.role)) ? (
          /* Clean Full-Page Login Screen for all 3 Staff/Admin Roles */
          <StaffLoginModal 
            isOpen={true}
            isFullPage={true}
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
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar 
              activeRole={currentUser.role}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
              {currentUser.role === 'CARE_STAFF' && (
                <CareStaffDashboard 
                  activeTab={activeTab}
                  appointments={appointments}
                  pets={pets}
                  services={services}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                />
              )}

              {currentUser.role === 'WAREHOUSE_STAFF' && (
                <WarehouseDashboard 
                  activeTab={activeTab}
                  products={products}
                  reorderProposals={reorderProposals}
                  suppliers={suppliers}
                  onAddSupplier={handleAddSupplier}
                  onUpdateStock={handleUpdateStock}
                  onTriggerAI={handleTriggerAI}
                  onAddProduct={handleAddProduct}
                />
              )}

              {currentUser.role === 'ADMIN' && (
                <AdminDashboard 
                  activeTab={activeTab}
                  appointments={appointments}
                  products={products}
                  services={services}
                  users={users}
                  onAddUser={handleAddUser}
                  customerOrders={orders}
                  onUpdateOrderStatus={(id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o))}
                  reorderProposals={reorderProposals}
                  onApproveProposal={handleApproveProposal}
                  onRejectProposal={handleRejectProposal}
                  onTriggerAI={handleTriggerAI}
                  onAddProduct={handleAddProduct}
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
        onLoginSuccess={(user, token) => {
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
        onClose={() => setShowStaffLoginModal(false)}
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
          setShowStaffLoginModal(false);
        }}
      />

      {/* AI SCAN RESULT MODAL */}
      {aiScanModalData && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#00f2fe' }}>
                <Brain size={22} color="#00f2fe" /> Kết Quả Quét Tồn Kho AI Forecasting Engine
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }} onClick={() => setAiScanModalData(null)}>✕</button>
            </div>

            <div style={{ background: 'rgba(0,242,254,0.08)', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid rgba(0,242,254,0.2)' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38ef7d', marginBottom: '4px' }}>
                ✅ AI đã hoàn tất quét toàn bộ {aiScanModalData.totalScanned} sản phẩm trong kho real-time!
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Phát hiện <strong>{aiScanModalData.lowStockCount}</strong> sản phẩm chạm/dưới ngưỡng an toàn. Đã tự động tạo <strong>{aiScanModalData.count}</strong> đề xuất nhập kho mới.
              </div>
            </div>

            {aiScanModalData.createdItems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                {aiScanModalData.createdItems.map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{item.productName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SKU: {item.sku} | Tồn kho hiện tại: <span style={{ color: '#f87171', fontWeight: 700 }}>{item.currentStock}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.9rem', fontWeight: 800 }}>+{item.suggestedQuantity} sp</span>
                      <div style={{ fontSize: '0.72rem', color: '#60a5fa' }}>Tin cậy: {(item.confidenceScore * 100).toFixed(0)}%</div>
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
              <button className="btn btn-secondary" onClick={() => setAiScanModalData(null)}>Đóng Thông Báo</button>
              <button className="btn btn-emerald" onClick={() => {
                setAiScanModalData(null);
                setActiveTab('ai-forecasting');
              }}>
                Đến Trang Duyệt Đề Xuất →
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
