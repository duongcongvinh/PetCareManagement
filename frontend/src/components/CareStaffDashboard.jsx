import React, { useState } from 'react';
import {
  Calendar, CheckCircle2, Clock, PlayCircle, FileText,
  PawPrint, Search, Tag, Sparkles, TrendingUp, ShieldAlert,
  Plus, Edit3, Trash2, X, Check, Package, ShoppingBag, DollarSign, AlertTriangle, Send, Star, MessageSquare, Truck, CreditCard, MapPin
} from 'lucide-react';
import { getPetAvatar, getServiceImage, getProductImage, FALLBACK_IMAGES } from '../mediaAssets';
import { toast, confirmModal } from './ToastNotification';
import ServiceOrderHistoryPanel from './ServiceOrderHistoryPanel';
import ImagePickerField from './ImagePickerField';

export default function CareStaffDashboard({
  appointments = [],
  pets = [],
  services = [],
  promotions = [],
  products = [],
  orders = [],
  users = [],
  reviews = [],
  activeTab = 'queue',
  onUpdateStatus,
  onCancelAppointment,
  onReplyReview,
  onDeleteReview,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddPromotion,
  onUpdatePromotion,
  onTogglePromotion,
  onDeletePromotion,
  onAddPet,
  onUpdatePet,
  onDeletePet,
  onUpdateOrderStatus,
  onRequestRestock
}) {
  // 1. Appointments state
  const [selectedApp, setSelectedApp] = useState(null);
  const [careSummary, setCareSummary] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [showCancelledApps, setShowCancelledApps] = useState(false);

  // 2. Services state
  const getEmptyServiceForm = () => ({
    name: '',
    category: 'Spa & Grooming',
    durationMinutes: 45,
    price: 200000,
    image: '',
    targetPet: 'Chó & Mèo mọi lứa tuổi',
    standard: '',
    description: '',
    processSteps: '',
    prepNote: '',
    status: 'ACTIVE',
  });

  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCatFilter, setServiceCatFilter] = useState('ALL');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(getEmptyServiceForm);

  // 3. Promotions state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoForm, setPromoForm] = useState({
    code: '',
    name: '',
    discountPercent: 10,
    applicableTo: 'Tất cả dịch vụ & đơn hàng',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    status: 'ACTIVE'
  });

  // 4. Pets state (Thêm mới / Sửa đầy đủ / Xóa hồ sơ thú cưng tại quầy)
  const [petSearch, setPetSearch] = useState('');
  const [selectedPetDetail, setSelectedPetDetail] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [showCreatePetModal, setShowCreatePetModal] = useState(false);
  const [petMedicalForm, setPetMedicalForm] = useState({
    name: '',
    species: 'Chó',
    breed: '',
    weightKg: '',
    ageMonths: '',
    ownerName: '',
    ownerPhone: '',
    medicalHistory: ''
  });

  // 6. Warehouse view & Orders management state
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');

  const validTabs = ['queue', 'orders-mgmt', 'history-logs', 'services', 'promotions', 'pets-logs', 'reports'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'queue';

  // Filtered appointments
  const filteredApps = appointments.filter(a => {
    if (!appSearch.trim()) return true;
    const q = appSearch.toLowerCase();
    return (
      (a.petName || '').toLowerCase().includes(q) ||
      (a.customerName || '').toLowerCase().includes(q) ||
      (a.serviceName || '').toLowerCase().includes(q)
    );
  });
  const pendingApps = filteredApps.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const inProgressApps = filteredApps.filter(a => a.status === 'IN_PROGRESS');
  const completedApps = filteredApps.filter(a => a.status === 'COMPLETED');
  const cancelledApps = filteredApps.filter(a => a.status === 'CANCELLED');

  // Filtered services
  const serviceCategories = ['ALL', 'Spa & Grooming', 'Y Tế & Tiêm Phòng', 'Khám Bệnh & Trị Liệu'];
  const filteredServices = services.filter(s => {
    const matchCat = serviceCatFilter === 'ALL' || s.category === serviceCatFilter;
    const matchQ = !serviceSearch.trim() || s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || (s.description || '').toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCat && matchQ;
  });

  // Filtered pets
  const filteredPets = pets.filter(p =>
    (p.name || '').toLowerCase().includes(petSearch.toLowerCase()) ||
    (p.breed || '').toLowerCase().includes(petSearch.toLowerCase()) ||
    (p.species || '').toLowerCase().includes(petSearch.toLowerCase()) ||
    (p.ownerName || '').toLowerCase().includes(petSearch.toLowerCase())
  );

  // Filtered warehouse products
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);
  const filteredProducts = products.filter(p => {
    const matchQ = !warehouseSearch.trim() ||
      (p.name || '').toLowerCase().includes(warehouseSearch.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(warehouseSearch.toLowerCase());
    const matchFilter = warehouseFilter === 'ALL' ? true : warehouseFilter === 'LOW' ? p.currentStock <= p.minStockLevel : p.category === warehouseFilter;
    return matchQ && matchFilter;
  });

  // Report KPIs
  const serviceRevenue = appointments.filter(a => a.status !== 'CANCELLED').reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const orderRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalRevenue = serviceRevenue + orderRevenue;

  // Filtered Orders for Quản Lý Đơn Đặt Hàng tab
  const pendingOrdersList = orders.filter(o => o.status === 'PENDING');
  const readyToShipOrdersList = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PAID');
  const deliveredOrdersList = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED');
  const cancelledOrdersList = orders.filter(o => o.status === 'CANCELLED');

  const filteredManagedOrders = [...orders]
    .filter(o => {
      const matchStatus = orderStatusFilter === 'ALL' ? true : o.status === orderStatusFilter;
      const pm = (o.paymentMethod || '').toLowerCase();
      const matchPay =
        orderPaymentFilter === 'ALL'
          ? true
          : orderPaymentFilter === 'ONLINE'
            ? pm.includes('online') || pm.includes('payos') || pm.includes('vietqr') || pm.includes('chuyển khoản')
            : pm.includes('cod') || pm.includes('tiền mặt');
      const q = orderSearch.trim().toLowerCase();
      const matchQ =
        !q ||
        (o.id || '').toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.phone || '').toLowerCase().includes(q) ||
        (o.address || '').toLowerCase().includes(q) ||
        (o.items || '').toLowerCase().includes(q);
      return matchStatus && matchPay && matchQ;
    })
    .sort((a, b) => {
      const rank = { PENDING: 0, PAID: 1, CONFIRMED: 2, DELIVERED: 3, COMPLETED: 3, CANCELLED: 4 };
      const ra = rank[a.status] ?? 5;
      const rb = rank[b.status] ?? 5;
      if (ra !== rb) return ra - rb;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });

  // Handlers
  const handleCompleteAppointment = (id) => {
    onUpdateStatus(id, 'COMPLETED', careSummary);
    setSelectedApp(null);
    setCareSummary('');
    toast.success('Đã hoàn thành ca hẹn và lưu nhật ký chăm sóc!', 'Quản Lý Lịch Hẹn');
  };

  const openCreateService = () => {
    setEditingService(null);
    setServiceForm(getEmptyServiceForm());
    setShowServiceModal(true);
  };

  const openEditService = (svc) => {
    setEditingService(svc);
    setServiceForm({
      name: svc.name || '',
      category: svc.category || 'Spa & Grooming',
      durationMinutes: svc.durationMinutes || 45,
      price: svc.price || 200000,
      image: svc.image || '',
      targetPet: svc.targetPet || 'Chó & Mèo mọi lứa tuổi',
      standard: svc.standard || '',
      description: svc.description || '',
      processSteps: svc.processSteps || '',
      prepNote: svc.prepNote || '',
      status: svc.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });
    setShowServiceModal(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) {
      toast.warning('Vui lòng nhập tên dịch vụ!', 'Thiếu Thông Tin');
      return;
    }
    if ((Number(serviceForm.price) || 0) <= 0) {
      toast.warning('Đơn giá dịch vụ phải lớn hơn 0 đ!', 'Giá Không Hợp Lệ');
      return;
    }
    const payload = {
      ...serviceForm,
      name: serviceForm.name.trim(),
      durationMinutes: Math.max(10, Number(serviceForm.durationMinutes) || 45),
      price: Number(serviceForm.price) || 0,
      image: (serviceForm.image || '').trim(),
      targetPet: (serviceForm.targetPet || '').trim(),
      standard: (serviceForm.standard || '').trim(),
      description: (serviceForm.description || '').trim(),
      processSteps: (serviceForm.processSteps || '').trim(),
      prepNote: (serviceForm.prepNote || '').trim(),
      status: serviceForm.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    };
    if (editingService) {
      if (onUpdateService) onUpdateService(editingService.id, payload);
      toast.success(`Đã cập nhật dịch vụ "${payload.name}"!`, 'Quản Lý Dịch Vụ');
    } else {
      if (onAddService) onAddService(payload);
      toast.success(`Đã thêm dịch vụ mới "${payload.name}"!`, 'Quản Lý Dịch Vụ');
    }
    setShowServiceModal(false);
  };

  const handleDeleteServiceClick = async (svc) => {
    const ok = await confirmModal(
      `Bạn có chắc muốn xóa dịch vụ "${svc.name}" khỏi danh mục?`,
      'Xác Nhận Xóa Dịch Vụ',
      { type: 'danger', confirmText: 'Xóa Dịch Vụ', cancelText: 'Hủy' }
    );
    if (ok && onDeleteService) {
      onDeleteService(svc.id);
      toast.info(`Đã xóa dịch vụ "${svc.name}".`, 'Quản Lý Dịch Vụ');
    }
  };

  const openCreatePromo = () => {
    setEditingPromo(null);
    setPromoForm({
      code: '',
      name: '',
      discountPercent: 10,
      applicableTo: 'Tất cả dịch vụ & đơn hàng',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'ACTIVE'
    });
    setShowPromoModal(true);
  };

  const openEditPromo = (promo) => {
    setEditingPromo(promo);
    setPromoForm({
      code: promo.code || '',
      name: promo.name || '',
      discountPercent: promo.discountPercent ?? 10,
      applicableTo: promo.applicableTo || 'Tất cả dịch vụ & đơn hàng',
      startDate: promo.startDate || new Date().toISOString().split('T')[0],
      endDate: promo.endDate || '2026-12-31',
      status: promo.status || 'ACTIVE'
    });
    setShowPromoModal(true);
  };

  const handleSavePromo = (e) => {
    e.preventDefault();
    if (!promoForm.code.trim() || !promoForm.name.trim()) {
      toast.warning('Vui lòng nhập đầy đủ mã voucher và tên chương trình!', 'Thiếu Thông Tin');
      return;
    }
    if (promoForm.startDate && promoForm.endDate && promoForm.endDate < promoForm.startDate) {
      toast.warning('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!', 'Thời Hạn Chưa Hợp Lệ');
      return;
    }
    const payload = {
      ...promoForm,
      code: promoForm.code.trim().toUpperCase(),
      name: promoForm.name.trim(),
      discountPercent: Math.min(100, Math.max(1, Number(promoForm.discountPercent) || 10)),
    };
    if (editingPromo) {
      if (onUpdatePromotion) {
        onUpdatePromotion(editingPromo.id, payload);
      }
    } else if (onAddPromotion) {
      onAddPromotion(payload);
    }
    setEditingPromo(null);
    setPromoForm({
      code: '',
      name: '',
      discountPercent: 10,
      applicableTo: 'Tất cả dịch vụ & đơn hàng',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'ACTIVE'
    });
    setShowPromoModal(false);
  };

  const handleDeletePromoClick = async (promo) => {
    const ok = await confirmModal(
      `Bạn có chắc muốn xóa chương trình khuyến mãi "${promo.code}"?`,
      'Xác Nhận Xóa Khuyến Mãi',
      { type: 'danger', confirmText: 'Xóa', cancelText: 'Hủy' }
    );
    if (ok && onDeletePromotion) {
      onDeletePromotion(promo.id);
    }
  };

  const openCreatePetStaff = () => {
    const firstCustomer = users.find(u => u.role === 'CUSTOMER');
    setEditingPet(null);
    setPetMedicalForm({
      name: '',
      species: 'Chó',
      breed: '',
      weightKg: '',
      ageMonths: '',
      ownerId: firstCustomer?.id || 'u-4',
      ownerName: firstCustomer?.fullName || 'Khách vãng lai tại quầy',
      ownerPhone: firstCustomer?.phone || '',
      medicalHistory: ''
    });
    setShowCreatePetModal(true);
  };

  const openEditPet = (pet) => {
    setShowCreatePetModal(false);
    setEditingPet(pet);
    setPetMedicalForm({
      name: pet.name || '',
      species: pet.species || 'Chó',
      breed: pet.breed || '',
      weightKg: pet.weightKg ?? '',
      ageMonths: pet.ageMonths ?? '',
      ownerName: pet.ownerName || '',
      ownerPhone: pet.ownerPhone || '',
      medicalHistory: pet.medicalHistory || ''
    });
  };

  const handleSavePetMedical = (e) => {
    e.preventDefault();
    if (!petMedicalForm.name.trim()) {
      toast.warning('Vui lòng nhập tên thú cưng!', 'Thiếu Thông Tin');
      return;
    }
    const payload = {
      name: petMedicalForm.name.trim(),
      species: petMedicalForm.species || 'Chó',
      breed: (petMedicalForm.breed || '').trim(),
      weightKg: petMedicalForm.weightKg !== '' ? parseFloat(petMedicalForm.weightKg) : null,
      ageMonths: petMedicalForm.ageMonths !== '' ? parseInt(petMedicalForm.ageMonths, 10) : null,
      medicalHistory: (petMedicalForm.medicalHistory || '').trim()
    };

    if (editingPet) {
      if (onUpdatePet) onUpdatePet(editingPet.id, payload);
      toast.success(`Đã cập nhật hồ sơ & y bạ cho bé ${payload.name}!`, 'Hồ Sơ Thú Cưng');
      setEditingPet(null);
    } else if (showCreatePetModal) {
      if (onAddPet) {
        onAddPet({
          ...payload,
          ownerId: petMedicalForm.ownerId || 'u-4',
          ownerName: (petMedicalForm.ownerName || '').trim() || 'Khách tại quầy',
          ownerPhone: (petMedicalForm.ownerPhone || '').trim()
        });
      }
      toast.success(`Đã tạo hồ sơ thú cưng "${payload.name}" tại quầy!`, 'Hồ Sơ Thú Cưng');
      setShowCreatePetModal(false);
    }
  };

  const handleDeletePetStaff = async (pet) => {
    const ok = await confirmModal(
      `Bạn có chắc chắn muốn xóa hồ sơ thú cưng "${pet.name}" (${pet.species}${pet.breed ? ` - ${pet.breed}` : ''})?`,
      'Xác Nhận Xóa Hồ Sơ Thú Cưng',
      { type: 'danger', confirmText: 'Xóa Hồ Sơ', cancelText: 'Hủy' }
    );
    if (ok && onDeletePet) {
      onDeletePet(pet.id);
    }
  };

  const handleCancelAppStaff = async (app) => {
    const ok = await confirmModal(
      `Xác nhận hủy ca hẹn [${app.serviceName || app.service?.name}] của bé ${app.petName || app.pet?.name} vào khung giờ ${app.timeSlot}?`,
      'Xác Nhận Hủy Lịch Hẹn',
      { type: 'danger', confirmText: 'Hủy Lịch Hẹn', cancelText: 'Giữ Lại' }
    );
    if (ok && onCancelAppointment) {
      onCancelAppointment(app.id);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ==================== 1A. QUẢN LÝ ĐƠN ĐẶT HÀNG ==================== */}
      {currentTab === 'orders-mgmt' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={22} color="#ea580c" /> Quản Lý Đơn Đặt Hàng
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tiếp nhận, xác nhận đơn mua sản phẩm Pet Shop, bàn giao vận chuyển và cập nhật hoàn tất giao hàng
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', borderRadius: '12px', padding: '0.5rem 0.9rem', border: '1px solid #cbd5e1', minWidth: 280 }}>
              <Search size={16} color="#64748b" style={{ marginRight: '8px' }} />
              <input
                type="text"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Tìm mã đơn, khách hàng, SĐT, sản phẩm..."
                style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.85rem', outline: 'none', width: '100%' }}
              />
            </div>
          </div>

          {/* 4 KPI CARDS */}
          <div className="grid-4">
            <div className="glass-panel" onClick={() => setOrderStatusFilter('PENDING')} style={{ padding: '1.15rem', borderLeft: '4px solid #f59e0b', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Chờ Xác Nhận</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>{pendingOrdersList.length}</div>
              <div style={{ fontSize: '0.73rem', color: '#92400e', marginTop: '2px' }}>Cần nhân viên xử lý ngay</div>
            </div>
            <div className="glass-panel" onClick={() => setOrderStatusFilter('CONFIRMED')} style={{ padding: '1.15rem', borderLeft: '4px solid #0284c7', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Đã Xác Nhận / Thanh Toán</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>{readyToShipOrdersList.length}</div>
              <div style={{ fontSize: '0.73rem', color: '#0369a1', marginTop: '2px' }}>Đang đóng gói &amp; giao hàng</div>
            </div>
            <div className="glass-panel" onClick={() => setOrderStatusFilter('DELIVERED')} style={{ padding: '1.15rem', borderLeft: '4px solid #059669', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Đã Giao Hoàn Tất</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>{deliveredOrdersList.length}</div>
              <div style={{ fontSize: '0.73rem', color: '#047857', marginTop: '2px' }}>Giao thành công tới khách</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Doanh Thu Đơn Hợp Lệ</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#7c3aed', marginTop: '6px' }}>
                {orderRevenue.toLocaleString('vi-VN')} đ
              </div>
              <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                {orders.length} đơn ({cancelledOrdersList.length} đơn hủy)
              </div>
            </div>
          </div>

          {/* FILTER BAR + ORDERS TABLE */}
          <div className="glass-panel" style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: `Tất cả (${orders.length})` },
                  { id: 'PENDING', label: `Chờ xác nhận (${pendingOrdersList.length})` },
                  { id: 'PAID', label: `Đã thanh toán (${orders.filter(o => o.status === 'PAID').length})` },
                  { id: 'CONFIRMED', label: `Đã xác nhận (${orders.filter(o => o.status === 'CONFIRMED').length})` },
                  { id: 'DELIVERED', label: `Đã giao hàng (${deliveredOrdersList.length})` },
                  { id: 'CANCELLED', label: `Đã hủy (${cancelledOrdersList.length})` },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(f.id)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '18px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: orderStatusFilter === f.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                      background: orderStatusFilter === f.id ? '#e0f2fe' : '#ffffff',
                      color: orderStatusFilter === f.id ? '#0369a1' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <select
                className="form-control"
                style={{ width: 'auto', padding: '0.42rem 0.8rem', fontSize: '0.82rem' }}
                value={orderPaymentFilter}
                onChange={e => setOrderPaymentFilter(e.target.value)}
              >
                <option value="ALL">Mọi hình thức thanh toán</option>
                <option value="ONLINE">Online (payOS / VietQR)</option>
                <option value="COD">Tiền Mặt COD</option>
              </select>
            </div>

            <div className="table-container" style={{ maxHeight: '620px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Mã Đơn &amp; Ngày Đặt</th>
                    <th>Khách Hàng &amp; Địa Chỉ</th>
                    <th>Chi Tiết Sản Phẩm</th>
                    <th>Thanh Toán &amp; Giao Hàng</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Không có đơn đặt hàng nào phù hợp bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredManagedOrders.map(order => (
                      <tr key={order.id} style={{ background: order.status === 'PENDING' ? '#fffbeb' : 'transparent' }}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <strong style={{ color: '#0f172a' }}>{order.id}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{order.date}</div>
                        </td>
                        <td style={{ maxWidth: 220 }}>
                          <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{order.customerName}</strong>
                          {order.phone && <div style={{ fontSize: '0.75rem', color: '#475569' }}>{order.phone}</div>}
                          {order.address && (
                            <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '3px', marginTop: '2px' }}>
                              <MapPin size={11} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{order.address}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ maxWidth: 280, fontSize: '0.83rem', color: '#1e293b', lineHeight: 1.45 }}>{order.items}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CreditCard size={12} /> {order.paymentMethod || 'Tiền Mặt COD'}
                          </div>
                          <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Truck size={12} /> {order.shippingMethod || 'Tiêu Chuẩn'}
                          </div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <strong style={{ color: order.status === 'CANCELLED' ? '#94a3b8' : '#059669', textDecoration: order.status === 'CANCELLED' ? 'line-through' : 'none' }}>
                            {Number(order.total || 0).toLocaleString('vi-VN')} đ
                          </strong>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className={`badge ${
                            order.status === 'PENDING'
                              ? 'badge-pending'
                              : order.status === 'CONFIRMED'
                                ? 'badge-info'
                                : order.status === 'CANCELLED'
                                  ? 'badge-danger'
                                  : 'badge-success'
                          }`}>
                            {order.status === 'PENDING'
                              ? 'Chờ xác nhận'
                              : order.status === 'CONFIRMED'
                                ? 'Đã xác nhận'
                                : order.status === 'PAID'
                                  ? 'Đã thanh toán'
                                  : order.status === 'CANCELLED'
                                    ? 'Đã hủy'
                                    : 'Đã giao hàng'}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {order.status === 'PENDING' && onUpdateOrderStatus ? (
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button
                                type="button"
                                className="btn btn-emerald"
                                style={{ padding: '0.36rem 0.7rem', fontSize: '0.76rem' }}
                                onClick={() => {
                                  onUpdateOrderStatus(order.id, 'CONFIRMED');
                                  toast.success(`Đã xác nhận đơn hàng ${order.id}!`, 'Quản Lý Đơn Đặt Hàng');
                                }}
                              >
                                <Check size={13} /> Xác Nhận
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                style={{ padding: '0.36rem 0.58rem', fontSize: '0.75rem' }}
                                onClick={async () => {
                                  const ok = await confirmModal(
                                    `Xác nhận hủy đơn hàng ${order.id} của khách "${order.customerName}"?`,
                                    'Xác Nhận Hủy Đơn Hàng',
                                    { type: 'danger', confirmText: 'Hủy Đơn', cancelText: 'Giữ Lại' }
                                  );
                                  if (ok) {
                                    onUpdateOrderStatus(order.id, 'CANCELLED');
                                    toast.info(`Đã hủy đơn hàng ${order.id}.`, 'Quản Lý Đơn Đặt Hàng');
                                  }
                                }}
                                title="Hủy đơn hàng"
                              >
                                <X size={13} /> Hủy
                              </button>
                            </div>
                          ) : (order.status === 'CONFIRMED' || order.status === 'PAID') && onUpdateOrderStatus ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: '0.36rem 0.72rem', fontSize: '0.76rem' }}
                              onClick={() => {
                                onUpdateOrderStatus(order.id, 'DELIVERED');
                                toast.success(`Đã cập nhật đơn ${order.id} sang Đã giao hàng!`, 'Quản Lý Đơn Đặt Hàng');
                              }}
                            >
                              <Truck size={13} /> Đã Giao Hàng
                            </button>
                          ) : order.status === 'CANCELLED' ? (
                            <span style={{ fontSize: '0.76rem', color: '#dc2626', fontWeight: 600 }}>Đã hủy</span>
                          ) : (
                            <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>✓ Hoàn tất</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 1B. LỊCH SỬ DỊCH VỤ ĐÃ LÀM & SẢN PHẨM ĐÃ MUA ==================== */}
      {currentTab === 'history-logs' && (
        <ServiceOrderHistoryPanel
          appointments={appointments}
          orders={orders}
          services={services}
          onUpdateOrderStatus={onUpdateOrderStatus}
          accentColor="#0284c7"
        />
      )}

      {/* ==================== 1. QUẢN LÝ LỊCH HẸN ==================== */}
      {currentTab === 'queue' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={22} color="#0284c7" /> Quản Lý Lịch Hẹn Chăm Sóc
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tiếp nhận lịch hẹn từ khách hàng, cập nhật tiến độ thực hiện và ghi nhận nhật ký chăm sóc
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className={showCancelledApps ? 'btn btn-danger' : 'btn btn-secondary'}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                onClick={() => setShowCancelledApps(prev => !prev)}
              >
                {showCancelledApps ? 'Ẩn Lịch Đã Hủy' : `Lịch Đã Hủy (${cancelledApps.length})`}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', borderRadius: '12px', padding: '0.5rem 0.9rem', border: '1px solid #cbd5e1', minWidth: 260 }}>
                <Search size={16} color="#64748b" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  placeholder="Tìm tên bé, chủ nuôi, dịch vụ..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* KPI STRIP */}
          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chờ Tiếp Nhận</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>{pendingApps.length}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #0284c7' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Đang Thực Hiện</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>{inProgressApps.length}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Đã Hoàn Thành</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>{completedApps.length}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tổng Ca Hẹn</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>{appointments.length}</div>
            </div>
          </div>

          {/* 3-COLUMN KANBAN WORKFLOW */}
          <div className="grid-3">
            {/* PENDING */}
            <div className="glass-panel" style={{ padding: '1.15rem', background: '#fffbeb', borderColor: '#fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid #fde68a' }}>
                <span style={{ fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
                  <Clock size={16} /> Chờ Tiếp Nhận ({pendingApps.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {pendingApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1rem', color: '#92400e', fontSize: '0.84rem', opacity: 0.75 }}>
                    Không có ca hẹn nào chờ tiếp nhận.
                  </div>
                ) : (
                  pendingApps.map(app => (
                    <div key={app.id} className="glass-card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                        <span className="badge badge-pending">{app.timeSlot}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '2px' }}>
                        Dịch vụ: <strong>{app.serviceName || app.service?.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Ngày: {app.appointmentDate} • Chủ: {app.customerName || 'Khách hàng'}
                      </div>
                      {app.notes && (
                        <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: '6px', background: '#fef3c7', padding: '6px 8px', borderRadius: '8px' }}>
                          ⚠️ {app.notes}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            onUpdateStatus(app.id, 'IN_PROGRESS', 'Bắt đầu tiếp nhận và thực hiện dịch vụ');
                            toast.info(`Đã tiếp nhận bé ${app.petName || 'thú cưng'}!`, 'Bắt Đầu Ca Hẹn');
                          }}
                        >
                          <PlayCircle size={15} /> Tiếp Nhận
                        </button>
                        {onCancelAppointment && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ padding: '0.5rem 0.7rem', fontSize: '0.78rem' }}
                            onClick={() => handleCancelAppStaff(app)}
                            title="Hủy ca hẹn & giải phóng khung giờ"
                          >
                            <X size={14} /> Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* IN_PROGRESS */}
            <div className="glass-panel" style={{ padding: '1.15rem', background: '#f0f9ff', borderColor: '#bae6fd' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid #bae6fd' }}>
                <span style={{ fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
                  <PlayCircle size={16} /> Đang Thực Hiện ({inProgressApps.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {inProgressApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1rem', color: '#0369a1', fontSize: '0.84rem', opacity: 0.75 }}>
                    Hiện chưa có bé nào đang làm dịch vụ.
                  </div>
                ) : (
                  inProgressApps.map(app => (
                    <div key={app.id} className="glass-card" style={{ padding: '1rem', borderColor: '#7dd3fc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                        <span className="badge badge-info">{app.timeSlot}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '2px' }}>
                        Dịch vụ: <strong>{app.serviceName || app.service?.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                        Phụ trách: {app.staffName || 'Nhân viên hiện tại'}
                      </div>
                      <button
                        type="button"
                        className="btn btn-emerald"
                        style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.82rem' }}
                        onClick={() => {
                          setSelectedApp(app);
                          setCareSummary(app.careSummary || 'Đã hoàn thành quy trình chăm sóc, bé ngoan và thể trạng ổn định.');
                        }}
                      >
                        <CheckCircle2 size={15} /> Hoàn Thành & Viết Nhật Ký
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COMPLETED */}
            <div className="glass-panel" style={{ padding: '1.15rem', background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid #a7f3d0' }}>
                <span style={{ fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}>
                  <CheckCircle2 size={16} /> Đã Hoàn Thành ({completedApps.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '540px', overflowY: 'auto' }}>
                {completedApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.75rem 1rem', color: '#047857', fontSize: '0.84rem', opacity: 0.75 }}>
                    Chưa có ca hẹn nào hoàn tất.
                  </div>
                ) : (
                  completedApps.map(app => (
                    <div key={app.id} className="glass-card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                        <span className="badge badge-success">Hoàn thành</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{app.serviceName || app.service?.name}</div>
                      <div style={{ fontSize: '0.77rem', color: '#065f46', marginTop: '6px', fontStyle: 'italic', background: '#d1fae5', padding: '6px 8px', borderRadius: '8px' }}>
                        📝 {app.careSummary || 'Đã hoàn tất đúng quy trình.'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* CANCELLED APPOINTMENTS PANEL (TOGGLED) */}
          {showCancelledApps && (
            <div className="glass-panel" style={{ padding: '1.25rem', borderColor: '#fecaca', background: '#fef2f2' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.85rem' }}>
                🚫 Danh Sách Ca Hẹn Đã Hủy ({cancelledApps.length})
              </h3>
              {cancelledApps.length === 0 ? (
                <div style={{ fontSize: '0.84rem', color: '#7f1d1d', opacity: 0.8 }}>Chưa có lịch hẹn nào bị hủy.</div>
              ) : (
                <div className="grid-3" style={{ gap: '0.85rem' }}>
                  {cancelledApps.map(app => (
                    <div key={app.id} className="glass-card" style={{ padding: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                        <span className="badge badge-danger">ĐÃ HỦY</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>{app.serviceName || app.service?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        {app.appointmentDate} ({app.timeSlot}) • Chủ: {app.customerName || 'Khách hàng'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ==================== 2. QUẢN LÝ DỊCH VỤ ==================== */}
      {currentTab === 'services' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={21} color="#0284c7" /> Quản Lý Danh Mục Dịch Vụ ({filteredServices.length})
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Thêm mới, chỉnh sửa đơn giá, thời lượng và quản lý danh mục dịch vụ Spa, Tiêm phòng & Khám bệnh trị liệu
              </p>
            </div>
            <button type="button" className="btn btn-coral" onClick={openCreateService}>
              <Plus size={16} /> Thêm Dịch Vụ Mới
            </button>
          </div>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {serviceCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setServiceCatFilter(cat)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: serviceCatFilter === cat ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: serviceCatFilter === cat ? '#e0f2fe' : '#ffffff',
                    color: serviceCatFilter === cat ? '#0369a1' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {cat === 'ALL' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid #cbd5e1', minWidth: 220 }}>
              <Search size={15} color="#64748b" style={{ marginRight: '6px' }} />
              <input
                type="text"
                value={serviceSearch}
                onChange={e => setServiceSearch(e.target.value)}
                placeholder="Tìm tên dịch vụ..."
                style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Dịch Vụ</th>
                  <th>Danh Mục</th>
                  <th>Thời Lượng</th>
                  <th>Đơn Giá</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={getServiceImage(s)}
                          alt={s.name}
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.service; }}
                          style={{ width: 48, height: 48, borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{s.name}</strong>
                            {s.status === 'INACTIVE' && (
                              <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '1px 7px' }}>Tạm ngưng</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b', maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{s.category}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{s.durationMinutes || 45} phút</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#ea580c' }}>
                        {Number(s.price).toLocaleString('vi-VN')} đ
                      </strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <button type="button" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }} onClick={() => openEditService(s)}>
                          <Edit3 size={13} /> Sửa
                        </button>
                        <button type="button" className="btn btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }} onClick={() => handleDeleteServiceClick(s)}>
                          <Trash2 size={13} /> Xóa
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

      {/* ==================== 3. QUẢN LÝ CHƯƠNG TRÌNH KHUYẾN MÃI ==================== */}
      {currentTab === 'promotions' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={21} color="#ea580c" /> Quản Lý Chương Trình Khuyến Mãi
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Tạo mã giảm giá voucher, bật/tắt trạng thái áp dụng cho khách hàng khi thanh toán & đặt lịch
              </p>
            </div>
            <button type="button" className="btn btn-coral" onClick={openCreatePromo}>
              <Plus size={16} /> Tạo Chương Trình Khuyến Mãi
            </button>
          </div>

          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #ea580c' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Tổng Chương Trình</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{promotions.length}</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Đang Kích Hoạt</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {promotions.filter(p => p.status === 'ACTIVE').length}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid #0284c7' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Mức Ưu Đãi Cao Nhất</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                {promotions.length > 0 ? Math.max(...promotions.map(p => Number(p.discountPercent) || 0)) : 0}%
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã Voucher</th>
                  <th>Tên Chương Trình</th>
                  <th>Mức Giảm</th>
                  <th>Phạm Vi Áp Dụng</th>
                  <th>Thời Hạn</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map(p => {
                  const isActive = p.status === 'ACTIVE';
                  return (
                    <tr key={p.id}>
                      <td>
                        <span style={{ background: '#fff7ed', color: '#ea580c', border: '1px dashed #fdba74', padding: '4px 10px', borderRadius: '8px', fontWeight: 900, fontSize: '0.84rem', letterSpacing: '0.5px' }}>
                          {p.code}
                        </span>
                      </td>
                      <td><strong>{p.name}</strong></td>
                      <td><strong style={{ color: '#059669', fontSize: '1rem' }}>-{p.discountPercent}%</strong></td>
                      <td>{p.applicableTo}</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>{p.startDate} → {p.endDate}</td>
                      <td>
                        <span className={`badge ${isActive ? 'badge-success' : 'badge-pending'}`}>
                          {isActive ? 'Đang chạy' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'nowrap' }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
                            onClick={() => openEditPromo(p)}
                          >
                            <Edit3 size={13} /> Sửa
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
                            onClick={() => onTogglePromotion && onTogglePromotion(p.id)}
                          >
                            {isActive ? 'Tạm dừng' : 'Kích hoạt'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                            onClick={() => handleDeletePromoClick(p)}
                            title="Xóa khuyến mãi"
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
      )}

      {/* ==================== 4. QUẢN LÝ HỒ SƠ THÚ CƯNG ==================== */}
      {currentTab === 'pets-logs' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PawPrint size={21} color="#ea580c" /> Quản Lý Hồ Sơ Thú Cưng & Y Bạ ({filteredPets.length})
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Tra cứu hồ sơ sức khỏe, dị ứng, cập nhật cân nặng / bệnh án và lịch sử chăm sóc của từng bé
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.5rem 0.85rem', border: '1px solid #cbd5e1', minWidth: 230 }}>
                <Search size={15} color="#64748b" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  value={petSearch}
                  onChange={e => setPetSearch(e.target.value)}
                  placeholder="Tìm tên bé, giống, chủ nuôi..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                />
              </div>
              <button type="button" className="btn btn-coral" onClick={openCreatePetStaff}>
                <Plus size={16} /> Thêm Hồ Sơ Thú Cưng
              </button>
            </div>
          </div>

          <div className="grid-3">
            {filteredPets.map(p => (
              <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.65rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <img
                        src={getPetAvatar(p)}
                        alt={p.name}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGES.pet; }}
                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fed7aa', flexShrink: 0 }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a' }}>{p.name}</h4>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Chủ: <strong>{p.ownerName || 'Khách hàng'}</strong></div>
                      </div>
                    </div>
                    <span className="badge badge-info">{p.species}</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '4px' }}>
                    Giống: <strong>{p.breed || 'Chưa rõ'}</strong> • Tuổi: <strong>{p.ageMonths ? `${p.ageMonths} tháng` : '--'}</strong> • Nặng: <strong>{p.weightKg ? `${p.weightKg} kg` : '--'}</strong>
                  </div>

                  <div style={{ marginTop: '0.5rem', background: '#fffbeb', border: '1px solid #fde68a', padding: '0.7rem', borderRadius: '10px', fontSize: '0.79rem' }}>
                    <div style={{ fontWeight: 700, color: '#b45309', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldAlert size={14} /> Tiền sử y tế / Lưu ý:
                    </div>
                    <div style={{ color: '#475569', lineHeight: 1.45 }}>
                      {p.medicalHistory || 'Không ghi nhận bệnh lý đặc biệt. Bé khỏe mạnh.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.25rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '0.45rem', fontSize: '0.76rem' }} onClick={() => setSelectedPetDetail(p)}>
                    Lịch Sử
                  </button>
                  <button type="button" className="btn btn-primary" style={{ flex: 1.2, padding: '0.45rem', fontSize: '0.76rem' }} onClick={() => openEditPet(p)}>
                    <Edit3 size={13} /> Sửa / Y Bạ
                  </button>
                  <button type="button" className="btn btn-danger" style={{ padding: '0.45rem 0.6rem', fontSize: '0.76rem' }} onClick={() => handleDeletePetStaff(p)} title="Xóa hồ sơ thú cưng">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 5. BÁO CÁO & THỐNG KÊ ==================== */}
      {currentTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={22} color="#059669" /> Báo Cáo & Thống Kê Hoạt Động
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Tổng hợp doanh thu dịch vụ, đơn hàng bán lẻ và hiệu suất phục vụ khách hàng
            </p>
          </div>

          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                <span>Tổng Doanh Thu</span>
                <DollarSign size={17} color="#059669" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '6px' }}>
                {totalRevenue.toLocaleString('vi-VN')} đ
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>Dịch vụ + Đơn hàng Pet Shop</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                <span>Ca Hẹn Đã Phục Vụ</span>
                <Calendar size={17} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', marginTop: '6px' }}>
                {appointments.length} ca
              </div>
              <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '2px' }}>{completedApps.length} ca đã hoàn thành</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #ea580c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                <span>Đơn Hàng Cửa Hàng</span>
                <ShoppingBag size={17} color="#ea580c" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ea580c', marginTop: '6px' }}>
                {orders.length} đơn
              </div>
              <div style={{ fontSize: '0.74rem', color: '#d97706', marginTop: '2px' }}>
                {orders.filter(o => o.status === 'PENDING').length} đơn chờ xác nhận
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                <span>Đánh Giá Hài Lòng</span>
                <Sparkles size={17} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', marginTop: '6px' }}>
                {reviews.length > 0
                  ? `${(reviews.reduce((s, r) => s + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)} / 5 ★`
                  : '5.0 / 5 ★'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                {reviews.length} đánh giá từ khách hàng
              </div>
            </div>
          </div>

          {/* 6-MONTH LIGHT THEME CHART */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Biểu Đồ Doanh Thu Dịch Vụ & Bán Lẻ (6 Tháng Gần Nhất)
              </h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', fontWeight: 700 }}>
                <span style={{ color: '#ea580c' }}>■ Doanh thu Spa & Y tế</span>
                <span style={{ color: '#0284c7' }}>■ Doanh thu Pet Shop</span>
              </div>
            </div>
            <div style={{ height: 190, display: 'flex', alignItems: 'flex-end', gap: '1.25rem', padding: '1rem 0.5rem 0.5rem 0.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              {[
                { month: 'Tháng 3', spa: 48, shop: 38 },
                { month: 'Tháng 4', spa: 62, shop: 52 },
                { month: 'Tháng 5', spa: 74, shop: 64 },
                { month: 'Tháng 6', spa: 82, shop: 71 },
                { month: 'Tháng 7', spa: 79, shop: 69 },
                { month: 'Tháng 8', spa: 94, shop: 85 },
              ].map((bar, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', width: '100%', justifyContent: 'center', height: '100%' }}>
                    <div style={{ width: '32%', maxWidth: 26, height: `${bar.spa}%`, background: 'linear-gradient(180deg, #ff6b35 0%, #fb923c 100%)', borderRadius: '6px 6px 0 0' }} />
                    <div style={{ width: '32%', maxWidth: 26, height: `${bar.shop}%`, background: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 100%)', borderRadius: '6px 6px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginTop: '8px' }}>{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER REVIEWS & STAFF REPLY PANEL */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={19} color="#f59e0b" /> Đánh Giá Từ Khách Hàng &amp; Phản Hồi ({reviews.length})
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Theo dõi nhận xét thực tế từ khách hàng và gửi lời cảm ơn / giải đáp trực tiếp lên website
            </p>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', fontSize: '0.86rem' }}>
                Chưa có đánh giá nào từ khách hàng.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {reviews.map((rev) => {
                  const draft = replyDrafts[rev.id] !== undefined ? replyDrafts[rev.id] : (rev.staffReply || '');
                  return (
                    <div key={rev.id} className="glass-card" style={{ padding: '1rem 1.15rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div>
                          <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>{rev.customerName}</strong>
                          {rev.petName && <span style={{ fontSize: '0.78rem', color: '#64748b' }}> • {rev.petName}</span>}
                          <span style={{ fontSize: '0.76rem', color: '#ea580c', fontWeight: 700, marginLeft: '8px' }}>
                            [{rev.targetName}]
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ display: 'inline-flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={13} fill={s <= (Number(rev.rating) || 5) ? '#f59e0b' : 'none'} color="#f59e0b" />
                            ))}
                          </span>
                          {onDeleteReview && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem' }}
                              onClick={async () => {
                                const ok = await confirmModal('Xác nhận xóa đánh giá này?', 'Xóa Đánh Giá', { type: 'danger', confirmText: 'Xóa', cancelText: 'Hủy' });
                                if (ok) onDeleteReview(rev.id);
                              }}
                              title="Xóa đánh giá"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0 0 0.65rem 0', lineHeight: 1.55 }}>{rev.comment}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          className="form-control"
                          style={{ flex: 1, fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                          value={draft}
                          onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [rev.id]: e.target.value }))}
                          placeholder="Nhập phản hồi chính thức từ Petzera Care..."
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                          onClick={() => onReplyReview && onReplyReview(rev.id, draft)}
                        >
                          <Send size={13} /> {rev.staffReply ? 'Cập Nhật' : 'Phản Hồi'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 6. QUẢN LÝ KHO (GÓC NHÌN NHÂN VIÊN) ==================== */}
      {currentTab === 'warehouse-view' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={21} color="#0284c7" /> Tra Cứu Tồn Kho & Phối Hợp Nhập Hàng
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Kiểm tra nhanh vật tư Spa, thức ăn và gửi yêu cầu bổ sung hàng sang bộ phận Quản Lý Kho
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setWarehouseFilter(warehouseFilter === 'LOW' ? 'ALL' : 'LOW')}
                className={`btn ${warehouseFilter === 'LOW' ? 'btn-coral' : 'btn-danger'}`}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              >
                <AlertTriangle size={14} /> Sắp Hết Hàng ({lowStockProducts.length})
              </button>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid #cbd5e1', minWidth: 220 }}>
                <Search size={15} color="#64748b" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  value={warehouseSearch}
                  onChange={e => setWarehouseSearch(e.target.value)}
                  placeholder="Tìm sản phẩm, SKU..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá Bán</th>
                  <th>Tồn Kho / Tối Thiểu</th>
                  <th>Trạng Thái</th>
                  <th>Phối Hợp Kho</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isLow = p.currentStock <= p.minStockLevel;
                  return (
                    <tr key={p.id} style={{ background: isLow ? '#fef2f2' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES.product; }}
                            style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'contain', background: '#ffffff', padding: '2px', border: '1px solid #e2e8f0', flexShrink: 0 }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.88rem' }}>{p.name}</strong>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>SKU: {p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{p.category}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{Number(p.unitPrice).toLocaleString('vi-VN')} đ</td>
                      <td>
                        <strong style={{ color: isLow ? '#dc2626' : '#059669', fontSize: '1rem' }}>{p.currentStock}</strong>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}> / min {p.minStockLevel}</span>
                      </td>
                      <td>
                        <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                          {isLow ? 'Cần nhập thêm' : 'Sẵn hàng'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.38rem 0.75rem', fontSize: '0.76rem' }}
                          onClick={() => {
                            if (onRequestRestock) {
                              onRequestRestock(p);
                            } else {
                              toast.success(`Đã gửi yêu cầu bổ sung "${p.name}" tới Quản lý kho!`, 'Yêu Cầu Nhập Kho');
                            }
                          }}
                        >
                          <Send size={13} /> Báo Nhập Hàng
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== MODAL: HOÀN THÀNH CA HẸN ==================== */}
      {selectedApp && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedApp(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Hoàn Thành Dịch Vụ: {selectedApp.petName || selectedApp.pet?.name}
              </h3>
              <button type="button" onClick={() => setSelectedApp(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f0f9ff', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '0.86rem', color: '#0369a1', fontWeight: 700 }}>Dịch vụ: {selectedApp.serviceName || selectedApp.service?.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Chủ nuôi: {selectedApp.customerName || 'Khách hàng'} • {selectedApp.timeSlot}</div>
            </div>

            <div className="form-group">
              <label>Nhật Ký Chăm Sóc / Ghi Chú Sức Khỏe (Care Summary)</label>
              <textarea
                className="form-control"
                rows={4}
                value={careSummary}
                onChange={e => setCareSummary(e.target.value)}
                placeholder="Nhập tình trạng lông da, phản ứng của bé và dặn dò chủ nuôi..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Hủy</button>
              <button type="button" className="btn btn-emerald" onClick={() => handleCompleteAppointment(selectedApp.id)}>
                <CheckCircle2 size={16} /> Lưu & Hoàn Thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / SỬA DỊCH VỤ ==================== */}
      {showServiceModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowServiceModal(false); }}>
          <div
            className="modal-content animate-fade-in"
            style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem 1.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                  Cập nhật hình ảnh, giá niêm yết, đối tượng áp dụng & quy trình thực hiện chuẩn Petzera
                </p>
              </div>
              <button type="button" onClick={() => setShowServiceModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveService}>
              {/* 1. Hình ảnh dịch vụ */}
              <ImagePickerField
                label="Hình Ảnh Minh Họa Dịch Vụ (Tải từ máy hoặc dán URL)"
                value={serviceForm.image}
                fallbackPreview={editingService ? getServiceImage(editingService) : ''}
                onChange={(img) => setServiceForm(prev => ({ ...prev, image: img }))}
                aspect="service"
                helperText="Khuyên dùng ảnh ngang (tỷ lệ 16:10 / 3:2) rõ nét về dịch vụ Spa, Tiêm phòng hoặc Khám thú y."
              />

              {/* 2. Thông tin cơ bản */}
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                1. Thông Tin Dịch Vụ & Định Giá
              </div>

              <div className="form-group">
                <label>Tên Dịch Vụ *</label>
                <input
                  className="form-control"
                  value={serviceForm.name}
                  onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="VD: Spa Grooming Trọn Gói Cắt Tỉa & Tắm Thảo Dược 7 Bước"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.85rem' }}>
                <div className="form-group">
                  <label>Danh Mục *</label>
                  <select className="form-control" value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}>
                    <option value="Spa & Grooming">Spa & Grooming</option>
                    <option value="Y Tế & Tiêm Phòng">Y Tế & Tiêm Phòng</option>
                    <option value="Khám Bệnh & Trị Liệu">Khám Bệnh & Trị Liệu (gồm Sinh Sản)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Đơn Giá Niêm Yết (VNĐ) *</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    className="form-control"
                    value={serviceForm.price}
                    onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thời Lượng (phút) *</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    className="form-control"
                    value={serviceForm.durationMinutes}
                    onChange={e => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.85rem' }}>
                <div className="form-group">
                  <label>Đối Tượng Thú Cưng</label>
                  <select className="form-control" value={serviceForm.targetPet} onChange={e => setServiceForm({ ...serviceForm, targetPet: e.target.value })}>
                    <option value="Chó & Mèo mọi lứa tuổi">Chó & Mèo mọi lứa tuổi</option>
                    <option value="Chỉ dành cho Chó (mọi giống & cân nặng)">Chỉ dành cho Chó</option>
                    <option value="Chỉ dành cho Mèo (mọi giống & độ tuổi)">Chỉ dành cho Mèo</option>
                    <option value="Chó / Mèo con từ 2 – 12 tháng tuổi">Chó / Mèo con (2–12 tháng)</option>
                    <option value="Chó / Mèo sinh sản & hậu phẫu">Chó / Mèo sinh sản</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tiêu Chuẩn / Phụ Trách</label>
                  <input
                    className="form-control"
                    value={serviceForm.standard}
                    onChange={e => setServiceForm({ ...serviceForm, standard: e.target.value })}
                    placeholder="VD: Master Groomer • Vô trùng 100%"
                  />
                </div>
                <div className="form-group">
                  <label>Trạng Thái Tiếp Nhận</label>
                  <select className="form-control" value={serviceForm.status} onChange={e => setServiceForm({ ...serviceForm, status: e.target.value })}>
                    <option value="ACTIVE">✓ Đang tiếp nhận đặt lịch</option>
                    <option value="INACTIVE">⏸ Tạm ngưng dịch vụ</option>
                  </select>
                </div>
              </div>

              {/* 3. Mô tả, quy trình & lưu ý */}
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0.85rem 0 0.6rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                2. Mô Tả, Quy Trình & Lưu Ý Cho Khách Hàng
              </div>

              <div className="form-group">
                <label>Mô Tả Chi Tiết Dịch Vụ</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={serviceForm.description}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Mô tả lợi ích nổi bật, thuốc/mỹ phẩm sử dụng và quyền lợi khách hàng nhận được..."
                />
              </div>

              <div className="form-group">
                <label>Quy Trình Thực Hiện (mỗi bước 1 dòng — hiển thị thành từng bước trên trang dịch vụ)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={serviceForm.processSteps}
                  onChange={e => setServiceForm({ ...serviceForm, processSteps: e.target.value })}
                  placeholder={'Kiểm tra da lông, tai móng và tư vấn kiểu dáng phù hợp\nTắm thảo dược khử mùi và massage thư giãn\nSấy chải phồng lông, cắt tỉa tạo kiểu chuẩn form\nXịt dưỡng mượt lông và bàn giao kèm sổ theo dõi'}
                />
              </div>

              <div className="form-group">
                <label>Lưu Ý Chuẩn Bị Cho Chủ Nuôi</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={serviceForm.prepNote}
                  onChange={e => setServiceForm({ ...serviceForm, prepNote: e.target.value })}
                  placeholder="VD: Không cho bé ăn quá no trước giờ tắm 1 tiếng; mang theo sổ tiêm phòng nếu có..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.15rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowServiceModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">{editingService ? 'Lưu Thay Đổi' : 'Thêm Dịch Vụ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: TẠO / SỬA KHUYẾN MÃI ==================== */}
      {showPromoModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowPromoModal(false); setEditingPromo(null); } }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {editingPromo ? 'Chỉnh Sửa Chương Trình Khuyến Mãi' : 'Tạo Chương Trình Khuyến Mãi'}
              </h3>
              <button type="button" onClick={() => { setShowPromoModal(false); setEditingPromo(null); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSavePromo}>
              <div className="form-group">
                <label>Mã Voucher *</label>
                <input className="form-control" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} placeholder="Nhập mã giảm giá (VD: PET20)" required style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label>Tên Chương Trình *</label>
                <input className="form-control" value={promoForm.name} onChange={e => setPromoForm({ ...promoForm, name: e.target.value })} placeholder="Nhập tên chương trình khuyến mãi" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Mức Giảm (%) *</label>
                  <input type="number" min="1" max="100" className="form-control" value={promoForm.discountPercent} onChange={e => setPromoForm({ ...promoForm, discountPercent: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phạm Vi Áp Dụng</label>
                  <select className="form-control" value={promoForm.applicableTo} onChange={e => setPromoForm({ ...promoForm, applicableTo: e.target.value })}>
                    <option value="Tất cả dịch vụ & đơn hàng">Tất cả dịch vụ & đơn hàng</option>
                    <option value="Spa & Grooming">Spa & Grooming</option>
                    <option value="Y Tế & Tiêm Phòng">Y Tế & Tiêm Phòng</option>
                    <option value="Khám Bệnh & Trị Liệu">Khám Bệnh, Trị Liệu & Sinh Sản</option>
                    <option value="Vật phẩm & Thức ăn">Vật phẩm & Thức ăn</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Ngày Bắt Đầu</label>
                  <input type="date" className="form-control" value={promoForm.startDate} onChange={e => setPromoForm({ ...promoForm, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ngày Kết Thúc</label>
                  <input type="date" className="form-control" value={promoForm.endDate} onChange={e => setPromoForm({ ...promoForm, endDate: e.target.value })} />
                </div>
              </div>
              {editingPromo && (
                <div className="form-group">
                  <label>Trạng Thái Chương Trình</label>
                  <select className="form-control" value={promoForm.status} onChange={e => setPromoForm({ ...promoForm, status: e.target.value })}>
                    <option value="ACTIVE">Đang chạy (Kích hoạt)</option>
                    <option value="PAUSED">Tạm dừng</option>
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowPromoModal(false); setEditingPromo(null); }}>Hủy</button>
                <button type="submit" className="btn btn-coral">{editingPromo ? 'Lưu Thay Đổi' : 'Tạo Khuyến Mãi'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: THÊM / CẬP NHẬT HỒ SƠ & Y BẠ THÚ CƯNG ==================== */}
      {(editingPet || showCreatePetModal) && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setEditingPet(null); setShowCreatePetModal(false); } }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {editingPet ? `Cập Nhật Hồ Sơ & Y Bạ: ${editingPet.name}` : 'Thêm Hồ Sơ Thú Cưng Mới Tại Quầy'}
              </h3>
              <button type="button" onClick={() => { setEditingPet(null); setShowCreatePetModal(false); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSavePetMedical}>
              <div className="form-group">
                <label>Tên Thú Cưng *</label>
                <input className="form-control" value={petMedicalForm.name} onChange={e => setPetMedicalForm({ ...petMedicalForm, name: e.target.value })} placeholder="VD: LuLu" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Loài</label>
                  <select className="form-control" value={petMedicalForm.species} onChange={e => setPetMedicalForm({ ...petMedicalForm, species: e.target.value })}>
                    <option value="Chó">Chó 🐶</option>
                    <option value="Mèo">Mèo 🐱</option>
                    <option value="Khác">Khác 🐰</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giống (Breed)</label>
                  <input className="form-control" value={petMedicalForm.breed} onChange={e => setPetMedicalForm({ ...petMedicalForm, breed: e.target.value })} placeholder="VD: Poodle, Anh Lông Ngắn..." />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Tuổi (tháng)</label>
                  <input type="number" min="0" className="form-control" value={petMedicalForm.ageMonths} onChange={e => setPetMedicalForm({ ...petMedicalForm, ageMonths: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cân Nặng (kg)</label>
                  <input type="number" min="0" step="0.1" className="form-control" value={petMedicalForm.weightKg} onChange={e => setPetMedicalForm({ ...petMedicalForm, weightKg: e.target.value })} />
                </div>
              </div>
              {showCreatePetModal && (
                <div className="grid-2">
                  <div className="form-group">
                    <label>Chủ Nuôi (Khách Hàng)</label>
                    <input className="form-control" value={petMedicalForm.ownerName} onChange={e => setPetMedicalForm({ ...petMedicalForm, ownerName: e.target.value })} placeholder="Họ tên chủ nuôi" />
                  </div>
                  <div className="form-group">
                    <label>SĐT Chủ Nuôi</label>
                    <input className="form-control" value={petMedicalForm.ownerPhone} onChange={e => setPetMedicalForm({ ...petMedicalForm, ownerPhone: e.target.value })} placeholder="09xxxxxxxx" />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label>Tiền Sử Y Tế / Dị Ứng / Ghi Chú Chăm Sóc</label>
                <textarea className="form-control" rows={3} value={petMedicalForm.medicalHistory} onChange={e => setPetMedicalForm({ ...petMedicalForm, medicalHistory: e.target.value })} placeholder="Ghi nhận mũi tiêm, dị ứng sữa tắm, lưu ý hành vi..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setEditingPet(null); setShowCreatePetModal(false); }}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editingPet ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: LỊCH SỬ THÚ CƯNG ==================== */}
      {selectedPetDetail && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedPetDetail(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PawPrint size={20} color="#ea580c" /> Lịch Sử Chăm Sóc: {selectedPetDetail.name}
              </h3>
              <button type="button" onClick={() => setSelectedPetDetail(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}>
              <div>Giống: <strong>{selectedPetDetail.breed}</strong> ({selectedPetDetail.species}) • Chủ: <strong>{selectedPetDetail.ownerName || 'Khách hàng'}</strong></div>
              <div style={{ marginTop: '4px', color: '#b45309' }}>⚠️ Bệnh sử: {selectedPetDetail.medicalHistory || 'Bé khỏe mạnh, không ghi nhận dị ứng.'}</div>
            </div>

            <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {appointments.filter(a => a.petId === selectedPetDetail.id || a.petName === selectedPetDetail.name).length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.25rem', fontSize: '0.85rem' }}>
                  Chưa có lịch sử ca hẹn nào cho bé này.
                </div>
              ) : (
                appointments.filter(a => a.petId === selectedPetDetail.id || a.petName === selectedPetDetail.name).map(a => (
                  <div key={a.id} className="glass-card" style={{ padding: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700 }}>
                      <span>{a.serviceName}</span>
                      <span className={`badge ${a.status === 'COMPLETED' ? 'badge-success' : 'badge-info'}`}>{a.status}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>Ngày: {a.appointmentDate} ({a.timeSlot})</div>
                    {a.careSummary && (
                      <div style={{ fontSize: '0.78rem', color: '#059669', fontStyle: 'italic', marginTop: '4px' }}>
                        📝 {a.careSummary}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedPetDetail(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
