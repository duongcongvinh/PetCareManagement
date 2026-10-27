import React, { useState } from 'react';
import { 
  LayoutDashboard, Brain, Calendar, Package, Check, X, Sparkles, TrendingUp, 
  DollarSign, Users, Tag, Building2, FileText, Plus, AlertCircle, Shield, PawPrint, Edit, Trash2,
  Sun, CloudRain, Gift, CloudSun, Compass, ShieldAlert, ShoppingBag
} from 'lucide-react';

import { INITIAL_USERS, INITIAL_SUPPLIERS, INITIAL_PROMOTIONS, INITIAL_PETS, INITIAL_SERVICES, FIVE_YEAR_HISTORICAL_DATA, PRODUCT_SEASONAL_FORECASTS, FIVE_YEAR_ORDER_HISTORY } from '../mockData';
import { apiService } from '../apiService';

export default function AdminDashboard({ 
  activeTab, 
  appointments = [], 
  products = [], 
  services = INITIAL_SERVICES, 
  users = INITIAL_USERS,
  onAddUser,
  reorderProposals = [], 
  onApproveProposal, 
  onRejectProposal,
  onTriggerAI,
  customerOrders = [],
  onUpdateOrderStatus
}) {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [promotions, setPromotions] = useState(INITIAL_PROMOTIONS);
  const [serviceList, setServiceList] = useState(services);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    password: 'password123'
  });

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserData.fullName || !newUserData.email) {
      alert('Vui lòng nhập đầy đủ Họ tên và Email!');
      return;
    }
    if (onAddUser) {
      await onAddUser(newUserData);
    }
    alert(`✅ Đã tạo thành công tài khoản [${newUserData.fullName}] với vai trò ${newUserData.role}!`);
    setShowAddUserModal(false);
    setNewUserData({
      fullName: '',
      email: '',
      phone: '',
      role: 'CUSTOMER',
      password: 'password123'
    });
  };

  const handleConfirmOrder = (orderId) => {
    onUpdateOrderStatus(orderId, 'CONFIRMED');
    alert(`✅ Đã xác nhận đơn hàng ${orderId}!`);
  };

  // 5-Year Weather & Seasonality AI State
  const [selectedYearFilter, setSelectedYearFilter] = useState('ALL');
  const [selectedProdFilter, setSelectedProdFilter] = useState('ALL');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState('ALL');
  const [seasonalAIResult, setSeasonalAIResult] = useState(null);
  const [isProcessingSeasonalAI, setIsProcessingSeasonalAI] = useState(false);

  const [orderHistoryForecast, setOrderHistoryForecast] = useState(null);
  const [isProcessingOrderHistory, setIsProcessingOrderHistory] = useState(false);

  const handleRunOrderHistoryAI = async () => {
    setIsProcessingOrderHistory(true);
    try {
      const res = await apiService.triggerOrderHistoryForecast(FIVE_YEAR_ORDER_HISTORY);
      if (res && res.status === 'success') {
        setOrderHistoryForecast(res);
        alert(`🤖 [FastAPI Order Analysis Engine]: Đã phân tích ${res.totalOrdersAnalyzed} đơn hàng thành công!`);
      } else {
        alert(`Lỗi từ AI Backend: ${res?.detail || 'Không xác định'}. Vui lòng kiểm tra lại server Python!`);
      }
    } catch (err) {
      console.log('Error analyzing order history', err);
      alert('Có lỗi khi kết nối với AI Backend! ' + err.message);
    }
    setIsProcessingOrderHistory(false);
  };

  const DEFAULT_FORECASTS = [
    { year: 2026, month: 9, predicted_revenue: 195000000, predicted_spa_demand: 520, predicted_product_demand: 830, season_type: 'RAINY_SEASON', weather_factor_notes: '🌧️ Mùa Mưa (>300mm): Scikit-Learn dự báo nhu cầu Tiêm phòng, Khám da liễu & Cát Tofu tăng +35%.' },
    { year: 2026, month: 10, predicted_revenue: 188000000, predicted_spa_demand: 500, predicted_product_demand: 810, season_type: 'RAINY_SEASON', weather_factor_notes: '🌧️ Mùa Mưa (>300mm): Scikit-Learn dự báo nhu cầu Khám bệnh da liễu & Tiêm phòng vắc-xin tăng +35%.' },
    { year: 2026, month: 11, predicted_revenue: 182000000, predicted_spa_demand: 485, predicted_product_demand: 790, season_type: 'RAINY_SEASON', weather_factor_notes: '🌧️ Mùa Mưa (>300mm): Scikit-Learn dự báo tiêu thụ Cát đậu nành Tofu sấy tăng +40%.' },
    { year: 2026, month: 12, predicted_revenue: 260000000, predicted_spa_demand: 720, predicted_product_demand: 1150, season_type: 'HOLIDAY_TET', weather_factor_notes: '🧧 Dịp Lễ Tết & Mùa Du Lịch: Scikit-Learn dự báo Lưu trú & Làm đẹp Tết tăng vọt +80%.' },
    { year: 2027, month: 1, predicted_revenue: 285000000, predicted_spa_demand: 790, predicted_product_demand: 1260, season_type: 'HOLIDAY_TET', weather_factor_notes: '🧧 Dịp Lễ Tết & Mùa Du Lịch: Scikit-Learn dự báo Đỉnh doanh thu cao nhất năm cho Khách sạn Thú cưng.' },
    { year: 2027, month: 2, predicted_revenue: 240000000, predicted_spa_demand: 660, predicted_product_demand: 1050, season_type: 'HOLIDAY_TET', weather_factor_notes: '🧧 Dịp Lễ Tết & Mùa Du Lịch: Scikit-Learn dự báo Nhu cầu Spa Grooming đầu xuân tăng +65%.' }
  ];

  const handleRunSeasonalAI = async () => {
    setIsProcessingSeasonalAI(true);
    try {
      const res = await apiService.triggerSeasonalForecast(FIVE_YEAR_HISTORICAL_DATA);
      if (res && res.seasonal_forecasts) {
        setSeasonalAIResult(res);
        alert('🤖 [FastAPI Scikit-Learn ML Engine]: Đã huấn luyện RandomForestRegressor thành công trên 60 tháng dữ liệu!');
      }
    } catch (err) {
      console.log('Using fallback seasonal analysis');
    }
    setIsProcessingSeasonalAI(false);
  };

  const displayForecasts = seasonalAIResult ? seasonalAIResult.seasonal_forecasts : DEFAULT_FORECASTS;

  // Modals
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Forms
  const [newUser, setNewUser] = useState({ fullName: '', email: '', phone: '', role: 'CUSTOMER' });
  const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '' });
  const [newPromo, setNewPromo] = useState({ code: '', name: '', discountPercent: 10, applicableTo: 'Tất cả' });
  const [newService, setNewService] = useState({ name: '', description: '', durationMinutes: 45, price: 200000, category: 'Spa & Grooming' });

  const totalRevenue = appointments.reduce((sum, a) => sum + (a.price || 200000), 0) + 2150000;
  const draftProposals = reorderProposals.filter(p => p.status === 'DRAFT');

  // Handlers
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email) return alert('Vui lòng nhập đủ thông tin!');
    setUsers([...users, { ...newUser, id: 'u-' + Date.now(), status: 'ACTIVE', createdAt: new Date().toISOString().split('T')[0] }]);
    setNewUser({ fullName: '', email: '', phone: '', role: 'CUSTOMER' });
    setShowAddUserModal(false);
    alert('✅ Đã tạo tài khoản mới thành công!');
  };

  const handleCreateSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name) return alert('Vui lòng nhập tên nhà cung cấp!');
    setSuppliers([...suppliers, { ...newSupplier, id: 'sup-' + Date.now() }]);
    setNewSupplier({ name: '', contactPerson: '', phone: '', email: '', address: '' });
    setShowAddSupplierModal(false);
    alert('✅ Đã thêm nhà cung cấp mới thành công!');
  };

  const handleCreatePromo = (e) => {
    e.preventDefault();
    if (!newPromo.code) return alert('Vui lòng nhập mã khuyến mãi!');
    setPromotions([...promotions, { 
      ...newPromo, 
      id: 'promo-' + Date.now(), 
      code: newPromo.code.toUpperCase(),
      startDate: '2026-08-01',
      endDate: '2026-09-30',
      status: 'ACTIVE' 
    }]);
    setNewPromo({ code: '', name: '', discountPercent: 10, applicableTo: 'Tất cả' });
    setShowAddPromoModal(false);
    alert('✅ Đã tạo chương trình khuyến mãi mới thành công!');
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    if (!newService.name) return alert('Vui lòng nhập tên dịch vụ!');
    setServiceList([...serviceList, {
      ...newService,
      id: 's-' + Date.now(),
      durationMinutes: parseInt(newService.durationMinutes),
      price: parseFloat(newService.price),
      status: 'ACTIVE'
    }]);
    setNewService({ name: '', description: '', durationMinutes: 45, price: 200000, category: 'Spa & Grooming' });
    setShowAddServiceModal(false);
    alert('✅ Đã thêm dịch vụ Spa/Y tế mới thành công!');
  };

  const validAdminTabs = ['overview', 'ai-forecasting', 'accounts-admin', 'customers-admin', 'pets-admin', 'services-admin', 'appointments-all', 'catalog', 'inventory-admin', 'orders-admin'];
  const currentTab = validAdminTabs.includes(activeTab) ? activeTab : 'overview';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. BÁO CÁO TỔNG QUAN HỆ THỐNG */}
      {(currentTab === 'overview') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Báo Cáo Tổng Quan Hệ Thống (Admin Executive Dashboard)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Theo dõi KPI doanh thu, hiệu suất ca hẹn, tồn kho & đơn khuyến nghị từ AI</p>
          </div>

          {/* KPI CARDS */}
          <div className="grid-4">
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>Doanh Thu Hệ Thống</span>
                <DollarSign size={18} color="#38ef7d" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38ef7d', marginTop: '0.4rem' }}>
                {totalRevenue.toLocaleString('vi-VN')} đ
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>↑ +18.5% so với tháng trước</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>Tổng Số Lịch Hẹn</span>
                <Calendar size={18} color="#00f2fe" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00f2fe', marginTop: '0.4rem' }}>
                {appointments.length} ca
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Spa Grooming & Tiêm phòng</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>Sản Phẩm Kho</span>
                <Package size={18} color="#60a5fa" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.4rem' }}>
                {products.length} mã
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>
                {products.filter(p => p.currentStock <= p.minStockLevel).length} sp vi phạm ngưỡng minStock
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', fontSize: '0.8rem' }}>
                <span>Đề Xuất AI Chờ Duyệt</span>
                <Brain size={18} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.4rem' }}>
                {draftProposals.length} đơn
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>Cần Admin duyệt nhập hàng</div>
            </div>
          </div>

          {/* VISUAL CHART SIMULATION */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#00f2fe" /> Biểu Đồ Phân Tích Doanh Thu & Nhu Cầu Tiêu Thụ Kho (6 Tháng)
              </h3>
              <span className="badge badge-info">FastAPI AI Time-Series Algorithm</span>
            </div>

            <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem 0', borderBottom: '1px solid var(--border-glass)' }}>
              {[
                { month: 'Tháng 3', rev: 40, demand: 30 },
                { month: 'Tháng 4', rev: 55, demand: 45 },
                { month: 'Tháng 5', rev: 70, demand: 60 },
                { month: 'Tháng 6', rev: 65, demand: 55 },
                { month: 'Tháng 7', rev: 85, demand: 75 },
                { month: 'Tháng 8 (AI Forecast)', rev: 100, demand: 90, forecast: true },
              ].map((bar, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', width: '100%', justifyContent: 'center', height: '100%' }}>
                    <div 
                      style={{ 
                        width: '35%', 
                        height: `${bar.rev}%`, 
                        background: bar.forecast ? 'var(--accent-gradient)' : 'rgba(0, 242, 254, 0.4)', 
                        borderRadius: '4px 4px 0 0' 
                      }} 
                    />
                    <div 
                      style={{ 
                        width: '35%', 
                        height: `${bar.demand}%`, 
                        background: bar.forecast ? 'var(--accent-emerald)' : 'rgba(56, 239, 125, 0.4)', 
                        borderRadius: '4px 4px 0 0' 
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: bar.forecast ? '#00f2fe' : 'var(--text-muted)', marginTop: '8px', fontWeight: bar.forecast ? 700 : 400 }}>
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. QUẢN LÝ TÀI KHOẢN */}
      {currentTab === 'accounts-admin' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#00f2fe" /> Quản Lý Tài Khoản & Phân Quyền Hệ Thống
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Quản lý người dùng, gán role (CUSTOMER, CARE_STAFF, WAREHOUSE_STAFF, ADMIN)</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
              <Plus size={16} /> Thêm Tài Khoản Mới
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Vai Trò (Role)</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.fullName}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '---'}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'CARE_STAFF' ? 'badge-info' : u.role === 'WAREHOUSE_STAFF' ? 'badge-pending' : 'badge-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td><span className="badge badge-success">{u.status || 'ACTIVE'}</span></td>
                    <td>{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. QUẢN LÝ KHÁCH HÀNG */}
      {currentTab === 'customers-admin' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#ff8e53" /> Danh Sách Quản Lý Khách Hàng
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Thông tin liên hệ, tổng số thú cưng sở hữu và lịch sử mua hàng</p>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Khách Hàng</th>
                  <th>Email Liên Hệ</th>
                  <th>Số Điện Thoại</th>
                  <th>Số Lượng Thú Cưng</th>
                  <th>Trạng Thái Tài Khoản</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === 'CUSTOMER').map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.fullName}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone || '0934567890'}</td>
                    <td><span className="badge badge-info">{INITIAL_PETS.filter(p => p.ownerId === c.id).length || 1} bé</span></td>
                    <td><span className="badge badge-success">Đang Hoạt Động</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. QUẢN LÝ THÚ CƯNG (ADMIN VIEW) */}
      {currentTab === 'pets-admin' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PawPrint size={20} color="#34d399" /> Danh Mục Quản Lý Thú Cưng Hệ Thống
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tra cứu hồ sơ sức khỏe, loài, giống, tuổi và chủ sở hữu</p>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Bé</th>
                  <th>Loài / Giống</th>
                  <th>Tuổi / Cân Nặng</th>
                  <th>Chủ Sở Hữu</th>
                  <th>Tiền Sử Y Tế / Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_PETS.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.species} ({p.breed})</td>
                    <td>{p.ageMonths} tháng • {p.weightKg} kg</td>
                    <td>{p.ownerName} ({p.ownerPhone})</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.medicalHistory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. QUẢN LÝ DỊCH VỤ (CRUD) */}
      {currentTab === 'services-admin' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#60a5fa" /> Danh Mục Quản Lý Dịch Vụ Spa & Khám Thú Y
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Cập nhật đơn giá, thời lượng thực hiện và mô tả dịch vụ</p>
            </div>
            <button className="btn btn-coral" onClick={() => setShowAddServiceModal(true)}>
              <Plus size={16} /> Thêm Dịch Vụ Mới
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Dịch Vụ</th>
                  <th>Danh Mục</th>
                  <th>Thời Lượng</th>
                  <th>Đơn Giá</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {serviceList.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td><span className="badge badge-info">{s.category}</span></td>
                    <td>{s.durationMinutes} phút</td>
                    <td><strong style={{ color: '#34d399' }}>{s.price.toLocaleString('vi-VN')} đ</strong></td>
                    <td><span className="badge badge-success">ACTIVE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. QUẢN LÝ LỊCH HẸN & NHẬT KÝ CHĂM SÓC */}
      {currentTab === 'appointments-all' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#00f2fe" /> Quản Lý Tất Cả Lịch Hẹn & Hồ Sơ Chăm Sóc Thú Cưng
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Điều phối nhân viên chăm sóc, theo dõi tiến độ ca làm và nhật ký y tế</p>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Thú Cưng / Chủ Hẹn</th>
                  <th>Dịch Vụ</th>
                  <th>Ngày & Slot Giờ</th>
                  <th>Nhân Viên Phụ Trách</th>
                  <th>Trạng Thái Ca</th>
                  <th>Nhật Ký Chăm Sóc</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.petName}</strong> ({a.species})
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chủ: {a.customerName}</div>
                    </td>
                    <td>{a.serviceName}</td>
                    <td>{a.appointmentDate} ({a.timeSlot})</td>
                    <td>{a.staffName || 'Chưa phân công'}</td>
                    <td>
                      <span className={`badge ${a.status === 'COMPLETED' ? 'badge-success' : a.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-pending'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ color: a.careSummary ? '#34d399' : 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                      {a.careSummary || 'Đang chờ hoàn thành...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. QUẢN LÝ ĐƠN HÀNG KHÁCH ĐẶT */}
      {currentTab === 'orders-admin' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} color="#ff8e53" /> Quản Lý Đơn Hàng Khách Đặt
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Xác nhận và theo dõi trạng thái các đơn đặt hàng thức ăn & phụ kiện của khách</p>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Sản Phẩm Đặt</th>
                  <th>Tổng Tiền</th>
                  <th>Ngày Đặt</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.map(order => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <div><strong>{order.customerName}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                    </td>
                    <td style={{ maxWidth: 200 }}>{order.items}</td>
                    <td><strong style={{ color: '#34d399' }}>{order.total.toLocaleString('vi-VN')} đ</strong></td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`badge ${order.status === 'PENDING' ? 'badge-pending' : 'badge-success'}`}>
                        {order.status === 'PENDING' ? 'Chờ Xác Nhận' : 'Đã Xác Nhận'}
                      </span>
                    </td>
                    <td>
                      {order.status === 'PENDING' && (
                        <button className="btn btn-emerald" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleConfirmOrder(order.id)}>
                          <Check size={14} /> Xác Nhận
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. AI FORECASTING & DỰ BÁO MÙA VỤ 3-5 NĂM */}
      {(currentTab === 'ai-forecasting') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)', border: '1px solid rgba(56, 239, 125, 0.4)', boxShadow: '0 8px 32px rgba(56, 239, 125, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38ef7d', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Brain size={26} color="#38ef7d" /> Phân Tích Lịch Sử Giao Dịch & Đề Xuất Nhập Hàng Tương Lai
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                  Sử dụng mô hình học máy (Machine Learning) đọc toàn bộ {FIVE_YEAR_ORDER_HISTORY.length} đơn hàng mua/bán trong 5 năm qua để dự báo nhu cầu.
                </p>
              </div>

              <button className="btn btn-emerald" onClick={handleRunOrderHistoryAI} disabled={isProcessingOrderHistory} style={{ padding: '0.65rem 1.25rem', borderRadius: '12px' }}>
                <Sparkles size={18} /> {isProcessingOrderHistory ? 'Đang Xử Lý AI...' : 'Khởi Chạy Phân Tích AI'}
              </button>
            </div>

            {orderHistoryForecast && (
              <div className="animate-fade-in">
                {/* METRICS */}
                <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>💰 Tổng Doanh Thu 5 Năm</div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
                      {orderHistoryForecast.totalRevenue.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '8px' }}>📦 Tổng Chi Phí Nhập Hàng</div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171' }}>
                      {orderHistoryForecast.totalImportCost.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                  <div style={{ background: 'rgba(56, 239, 125, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(56, 239, 125, 0.3)' }}>
                    <div style={{ fontSize: '0.82rem', color: '#38ef7d', marginBottom: '8px', fontWeight: 700 }}>📈 Dự Báo Doanh Thu Tháng Tới</div>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38ef7d' }}>
                      {orderHistoryForecast.predictedRevenueNextMonth.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                </div>

                {/* STRATEGIC ADVICE */}
                <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)', marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.85rem' }}>🧭 Khuyến Nghị Chiến Lược Doanh Nghiệp</h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, color: '#fde68a', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {orderHistoryForecast.strategicAdvice.map((adv, idx) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>

                {/* PRODUCT RECOMMENDATIONS */}
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>Danh Sách Sản Phẩm Cần Nhập Trong Tháng Tới (AI Suggested)</h4>
                <div className="grid-2">
                  {orderHistoryForecast.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>{rec.productName}</div>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tiêu thụ TB/Tháng: </span>
                          <strong style={{ color: '#cbd5e1' }}>{rec.historicalAvgMonthly} sp</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI Dự báo Tới: </span>
                          <strong style={{ color: '#00f2fe' }}>{rec.predictedNextMonthDemand} sp</strong>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(56, 239, 125, 0.1)', padding: '0.65rem', borderRadius: '8px', color: '#38ef7d', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
                        👉 Đề xuất nhập thêm: +{rec.suggestedImportQty} sản phẩm
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        {rec.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          
          
          {/* SECTION A: 5-YEAR SEASONAL WEATHER ANALYSIS CHART */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CloudSun size={24} color="#ff8e53" /> Mô Hình AI Phân Tích Mùa Vụ & Thời Tiết (2022 - 2026)
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Chuỗi thời gian 60 tháng lịch sử kết hợp biến số Nhiệt độ (°C), Lượng mưa (mm) & Mùa cao điểm
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lọc Năm:</span>
                {['ALL', '2022', '2023', '2024', '2025', '2026'].map(y => (
                  <button
                    key={y}
                    onClick={() => setSelectedYearFilter(y)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: selectedYearFilter === y ? '1px solid #00f2fe' : '1px solid var(--border-light)',
                      background: selectedYearFilter === y ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                      color: selectedYearFilter === y ? '#00f2fe' : 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {y === 'ALL' ? 'Tất cả 5 Năm' : y}
                  </button>
                ))}
              </div>
            </div>

            {/* BAR CHART SIMULATION FOR 5-YEAR SEASONAL DATA */}
            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Biểu đồ Doanh Thu & Sản Lượng Tiêu Thụ Theo Mùa Vụ</span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff6b35' }}>
                    <Sun size={14} /> ☀️ Nắng Nóng (T4-T8)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                    <CloudRain size={14} /> 🌧️ Mùa Mưa (T9-T11)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                    <Gift size={14} /> 🧧 Lễ Tết (T12-T2)
                  </span>
                </div>
              </div>

              <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                {FIVE_YEAR_HISTORICAL_DATA.filter(d => selectedYearFilter === 'ALL' || d.year.toString() === selectedYearFilter).slice(-24).map((d, idx) => {
                  const maxRev = 200000000;
                  const heightPercent = Math.min(100, Math.max(15, (d.revenue / maxRev) * 100));
                  const isSummer = d.seasonType === 'HOT_SUMMER';
                  const isRainy = d.seasonType === 'RAINY_SEASON';

                  const barBg = isSummer 
                    ? 'linear-gradient(180deg, #ff6b35 0%, #ff8e53 100%)' 
                    : isRainy 
                    ? 'linear-gradient(180deg, #00f2fe 0%, #4facfe 100%)' 
                    : 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)';

                  return (
                    <div key={idx} style={{ flex: 1, minWidth: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }} title={`${d.label}: ${d.revenue.toLocaleString('vi-VN')}đ | ${d.avgTempC}°C | ${d.rainfallMm}mm`}>
                      <div 
                        style={{ 
                          width: '85%', 
                          height: `${heightPercent}%`, 
                          background: barBg, 
                          borderRadius: '6px 6px 0 0',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s ease'
                        }} 
                      />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WEATHER IMPACT INSIGHTS GRID */}
            <div className="grid-3" style={{ marginTop: '1.25rem' }}>
              <div className="glass-card" style={{ borderLeft: '4px solid #ff6b35' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#ff6b35', marginBottom: '0.4rem' }}>
                  <Sun size={18} /> ☀️ Nhu Cầu Tiêu Thụ Mùa Nắng Nóng (T4 - T8)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Nhiệt độ 35°C - 39°C kích thích nhu cầu mua sắm các sản phẩm làm mát & Dưỡng da thú cưng tăng <strong>+48.5%</strong>. Khối lượng tiêu thụ gấp 2.1 lần bình thường.
                </div>
              </div>

              <div className="glass-card" style={{ borderLeft: '4px solid #38bdf8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem' }}>
                  <CloudRain size={18} /> 🌧️ Nhu Cầu Tiêu Thụ Mùa Mưa (T9 - T11)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Độ ẩm cao {'>'}85% làm gia tăng các ca bệnh ngoài da, ve rận & nấm da thú cưng <strong>+35%</strong>. Nhu cầu sấy sưởi & Cát đậu nành Tofu hút ẩm tăng <strong>+40%</strong>.
                </div>
              </div>

              <div className="glass-card" style={{ borderLeft: '4px solid #fbbf24' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#fbbf24', marginBottom: '0.4rem' }}>
                  <Gift size={18} /> 🧧 Nhu Cầu Tiêu Thụ Mùa Lễ Tết (T12 - T2)
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Mùa du lịch & Tết Nguyên Đán tạo bùng nổ nhu cầu mua sắm thực phẩm và phụ kiện thú cưng. Doanh số Thức ăn Hạt Royal Canin dự báo tăng vọt <strong>+75%</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: AI MACHINE LEARNING 6-MONTH PREDICTION RESULTS (PREMIUM GRID CARDS) */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)', border: '1px solid rgba(0, 242, 254, 0.4)', boxShadow: '0 8px 32px rgba(0, 242, 254, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Brain size={26} color="#00f2fe" /> Kết Quả Dự Báo Machine Learning (Scikit-Learn RandomForest ML - 6 Tháng Tới)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                  {seasonalAIResult ? seasonalAIResult.summary : 'Dự báo đầu ra từ mô hình Scikit-Learn RandomForestRegressor huấn luyện trên 60 tháng dữ liệu lịch sử.'}
                </p>
              </div>

              <button className="btn btn-emerald" onClick={handleRunSeasonalAI} disabled={isProcessingSeasonalAI} style={{ padding: '0.65rem 1.25rem', borderRadius: '12px' }}>
                <Sparkles size={18} /> {isProcessingSeasonalAI ? 'Đang Học Máy Scikit-Learn...' : 'Chạy Mô Hình ML Mới'}
              </button>
            </div>

            {/* GRID 3x2 CARDS */}
            <div className="grid-3">
              {displayForecasts.map((f, idx) => {
                const isSummer = f.season_type === 'HOT_SUMMER';
                const isRainy = f.season_type === 'RAINY_SEASON';

                const cardBorderColor = isSummer ? '#ff6b35' : isRainy ? '#00f2fe' : '#fbbf24';
                const cardHeaderBg = isSummer 
                  ? 'rgba(255, 107, 53, 0.15)' 
                  : isRainy 
                  ? 'rgba(0, 242, 254, 0.15)' 
                  : 'rgba(251, 191, 36, 0.15)';

                return (
                  <div 
                    key={idx} 
                    className="glass-card animate-fade-in"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justify: 'space-between',
                      border: `1px solid ${cardBorderColor}`,
                      borderRadius: '16px',
                      padding: '1.25rem',
                      background: 'rgba(15, 23, 42, 0.85)',
                      boxShadow: `0 4px 20px ${cardBorderColor}22`
                    }}
                  >
                    <div>
                      {/* CARD HEADER */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ background: cardHeaderBg, padding: '0.4rem 0.85rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', border: `1px solid ${cardBorderColor}` }}>
                          Tháng {f.month}/{f.year}
                        </div>

                        <div>
                          {isSummer ? (
                            <span className="badge badge-coral" style={{ background: '#ff6b35', color: '#ffffff', fontWeight: 700, padding: '0.4rem 0.75rem', borderRadius: '20px' }}>
                              <Sun size={13} /> ☀️ Nắng Nóng
                            </span>
                          ) : isRainy ? (
                            <span className="badge badge-info" style={{ background: '#00f2fe', color: '#0f172a', fontWeight: 800, padding: '0.4rem 0.75rem', borderRadius: '20px' }}>
                              <CloudRain size={13} /> 🌧️ Mùa Mưa
                            </span>
                          ) : (
                            <span className="badge badge-warning" style={{ background: '#fbbf24', color: '#0f172a', fontWeight: 800, padding: '0.4rem 0.75rem', borderRadius: '20px' }}>
                              <Gift size={13} /> 🧧 Dịp Lễ Tết
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CARD METRICS GRID */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                        
                        {/* DOANH THU */}
                        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>💰 Doanh Thu Dự Báo:</span>
                          <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                            {f.predicted_revenue.toLocaleString('vi-VN')} đ
                          </strong>
                        </div>

                        {/* CA SPA & VẬT PHẨM */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>✂️ Ca Spa Grooming</div>
                            <strong style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>{f.predicted_spa_demand} ca</strong>
                          </div>

                          <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>📦 Vật Phẩm Bán Ra</div>
                            <strong style={{ fontSize: '1.15rem', fontWeight: 800, color: '#c084fc' }}>{f.predicted_product_demand} sp</strong>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* WEATHER INSIGHT NOTE BOX */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                      <strong style={{ color: cardBorderColor }}>Ghi Chú AI: </strong>
                      {f.weather_factor_notes}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C: PRODUCT-LEVEL SEASONAL AI REORDER PLAN FOR SHOP OWNER */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)', border: '1px solid #ff6b35', boxShadow: '0 8px 32px rgba(255, 107, 53, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ff6b35', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={26} color="#ff6b35" /> AI Phân Tích & Báo Nhập Hàng Theo Từng Sản Phẩm & Mùa Vụ
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                  Học dữ liệu 5 năm lịch sử của từng mặt hàng ➔ Lọc nhu cầu theo mùa ➔ Báo cho Chủ cửa hàng lượng & ngày cần nhập
                </p>
              </div>

              {/* FILTERS DROPDOWN */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '6px' }}>Mùa Vụ:</span>
                  <select 
                    value={selectedSeasonFilter} 
                    onChange={e => setSelectedSeasonFilter(e.target.value)}
                    className="form-control" 
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', borderRadius: '10px', width: 'auto' }}
                  >
                    <option value="ALL">Tất Cả Mùa Vụ</option>
                    <option value="HOT_SUMMER">☀️ Mùa Nắng Nóng (T4-T8)</option>
                    <option value="RAINY_SEASON">🌧️ Mùa Mưa (T9-T11)</option>
                    <option value="HOLIDAY_TET">🧧 Dịp Lễ Tết (T12-T2)</option>
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '6px' }}>Sản Phẩm:</span>
                  <select 
                    value={selectedProdFilter} 
                    onChange={e => setSelectedProdFilter(e.target.value)}
                    className="form-control" 
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', borderRadius: '10px', width: 'auto' }}
                  >
                    <option value="ALL">Tất Cả Sản Phẩm</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT FORECAST CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {PRODUCT_SEASONAL_FORECASTS
                .filter(pf => selectedSeasonFilter === 'ALL' || pf.peakSeasonType === selectedSeasonFilter)
                .filter(pf => selectedProdFilter === 'ALL' || pf.productId === selectedProdFilter)
                .map((pf, idx) => {
                  const isSummer = pf.peakSeasonType === 'HOT_SUMMER';
                  const isRainy = pf.peakSeasonType === 'RAINY_SEASON';
                  const badgeBg = isSummer ? '#ff6b35' : isRainy ? '#00f2fe' : '#fbbf24';
                  const badgeTextColor = isSummer ? '#ffffff' : '#0f172a';

                  return (
                    <div 
                      key={idx} 
                      className="glass-card animate-fade-in" 
                      style={{ 
                        padding: '1.25rem', 
                        background: 'rgba(15, 23, 42, 0.9)', 
                        borderLeft: `5px solid ${badgeBg}`,
                        borderRadius: '14px',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        borderRight: '1px solid rgba(255,255,255,0.08)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{pf.productName}</h4>
                            <span className="badge" style={{ background: badgeBg, color: badgeTextColor, fontWeight: 800, fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: '15px' }}>
                              {pf.peakSeasonLabel}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                            Mã SKU: <strong>{pf.sku}</strong> | Danh mục: <span style={{ color: '#38bdf8' }}>{pf.category}</span> | Nhà cung cấp: <strong>{pf.suggestedSupplier}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tiêu thụ 5 năm</div>
                            <strong style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>{pf.historicalAvgSales5Year}</strong>
                          </div>
                          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dự báo mùa cao điểm</div>
                            <strong style={{ fontSize: '1.15rem', color: '#34d399', fontWeight: 800 }}>{pf.predictedMonthlyDemand}</strong>
                          </div>
                          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: '#ff6b35' }}>Khuyên nhập kho</div>
                            <strong style={{ fontSize: '1.3rem', color: '#ff6b35', fontWeight: 800 }}>+{pf.suggestedReorderQty} sp</strong>
                          </div>
                        </div>
                      </div>

                      {/* AI EXECUTE ADVICE BOX FOR SHOP OWNER */}
                      <div style={{ background: 'rgba(255, 107, 53, 0.1)', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1px solid rgba(255, 107, 53, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#ffedd5', flex: 1, minWidth: 280, lineHeight: '1.5' }}>
                          {pf.aiAdviceForOwner}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#fdba74', fontWeight: 700, background: 'rgba(0,0,0,0.3)', padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,107,53,0.2)' }}>
                          📅 Ngày nhập kho tối ưu: <strong>{pf.suggestedOrderDate}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* SECTION D: SHOP OWNER STRATEGIC AI RECOMMENDATIONS */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                  <Compass size={22} /> Khuyến Nghị Chiến Lược AI Cho Chủ Cửa Hàng (Shop Owner Executive Summary)
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Phân tích dự báo 6 tháng tới dựa trên quy luật mùa vụ 5 năm & xu hướng thời tiết thực tế
                </p>
              </div>

              <button className="btn btn-cyan" onClick={handleRunSeasonalAI} disabled={isProcessingSeasonalAI}>
                <Brain size={16} /> {isProcessingSeasonalAI ? 'Đang Phân Tích...' : 'Khởi Chạy AI Dự Báo Thời Tiết'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
                <div style={{ fontWeight: 800, color: '#38ef7d', fontSize: '0.92rem', marginBottom: '4px' }}>
                  📌 1. Đề Xuất Điểm Đặt Hàng Mùa Nắng Nóng (T4 - T8)
                </div>
                <div style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  Dự báo sức mua các sản phẩm sữa tắm và phụ kiện làm mát sẽ tăng <strong>+52%</strong>. Hệ thống AI tự động nâng Điểm đặt hàng (Reorder Point) lên 30% để đảm bảo lượng tồn kho an toàn, tránh đứt gãy cung ứng.
                </div>
              </div>

              <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
                <div style={{ fontWeight: 800, color: '#00f2fe', fontSize: '0.92rem', marginBottom: '4px' }}>
                  📌 2. Kế Hoạch Tích Trữ Kho Hàng Mùa Mưa (T9 - T11)
                </div>
                <div style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  Chuẩn bị bước vào mùa mưa với lượng mưa lớn, nhu cầu Cát đậu nành Tofu & Thuốc trị nấm tăng vọt. Đề xuất phát đơn nhập hàng trước <strong>20 ngày</strong> tới Nhà cung cấp để nhận chiết khấu thương mại <strong>12%</strong> theo khối lượng (Bulk Discount).
                </div>
              </div>

              <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
                <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.92rem', marginBottom: '4px' }}>
                  📌 3. Quản Trị Hàng Tồn Kho Mùa Lễ Tết (T12 - T2)
                </div>
                <div style={{ fontSize: '0.83rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                  Nhu cầu mua sắm thức ăn hạt và khay vệ sinh dự kiến lấp đầy 100% công suất kho từ 15/12. Khuyến nghị phát đơn nhập hàng ngay từ ngày 01/12 để khóa giá nhập (Lock-in Price), tránh tình trạng nhà cung cấp tăng giá dịp cuối năm.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: REORDER PROPOSALS APPROVAL TABLE */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#00f2fe" /> Bảng Phê Duyệt Đề Xuất Nhập Kho AI (Reorder Plan Approval)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Đơn đề xuất nhập hàng tự động kích hoạt khi số lượng tồn kho vi phạm ngưỡng an toàn
                </p>
              </div>

              <button className="btn btn-emerald" onClick={onTriggerAI}>
                <Brain size={16} /> Kiểm Tra Tồn Kho AI
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reorderProposals.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Chưa có đề xuất nhập hàng nào từ AI. Bấm "Kiểm Tra Tồn Kho AI" để quét sản phẩm.
                </div>
              ) : (
                reorderProposals.map((prop) => (
                  <div key={prop.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{prop.productName}</h4>
                        <span className={`badge ${prop.status === 'APPROVED' ? 'badge-success' : prop.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}`}>
                          {prop.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        SKU: {prop.sku} | Tồn hiện tại: <strong style={{ color: '#f87171' }}>{prop.currentStock}</strong> | Safety Stock: {prop.safetyStock || 10}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginTop: '4px' }}>
                        🏢 Nhà Cung Cấp: {prop.suggestedSupplier || 'Royal Canin Việt Nam'}
                      </div>
                      <div style={{ fontSize: '0.83rem', color: '#38ef7d', marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                        🤖 {prop.reason}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lượng cần</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38ef7d' }}>+{prop.suggestedQuantity} sp</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ngày nhập: {prop.suggestedOrderDate || '2026-08-23'}</div>
                      </div>

                      {prop.status === 'DRAFT' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-emerald" onClick={() => onApproveProposal(prop.id)}>
                            <Check size={16} /> Phê Duyệt
                          </button>
                          <button className="btn btn-danger" onClick={() => onRejectProposal(prop.id)}>
                            <X size={16} /> Từ Chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={18} color="#00f2fe" /> Bảng Dữ Liệu Lịch Sử Đơn Hàng (Mock 5 Năm)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tổng số {FIVE_YEAR_ORDER_HISTORY.length} đơn hàng mua vào và bán ra</p>
              </div>
            </div>

            <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Loại Đơn</th>
                    <th>Ngày Giao Dịch</th>
                    <th>Giá Trị</th>
                    <th>Chi Tiết Mặt Hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {FIVE_YEAR_ORDER_HISTORY.slice().reverse().slice(0, 100).map(order => (
                    <tr key={order.id}>
                      <td><strong style={{ color: '#00f2fe' }}>{order.id}</strong></td>
                      <td>
                        <span className={`badge ${order.type === 'IMPORT' ? 'badge-danger' : 'badge-success'}`}>
                          {order.type === 'IMPORT' ? 'NHẬP HÀNG' : 'BÁN HÀNG'}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td><strong style={{ color: order.type === 'IMPORT' ? '#f87171' : '#34d399' }}>
                        {order.type === 'IMPORT' ? '-' : '+'}{order.totalAmount.toLocaleString('vi-VN')} đ
                      </strong></td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Đang hiển thị 100 giao dịch gần nhất (tổng số: {FIVE_YEAR_ORDER_HISTORY.length})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. QUẢN LÝ KHUYẾN MÃI & QUẢN LÝ NHÀ CUNG CẤP */}
      {(currentTab === 'catalog') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={18} color="#ff9966" /> Quản Lý Chương Trình Khuyến Mãi (Promotions)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã voucher giảm giá cho dịch vụ spa và đơn hàng vật phẩm</p>
              </div>
              <button className="btn btn-coral" onClick={() => setShowAddPromoModal(true)}>
                <Plus size={16} /> Tạo Mã Giảm Giá
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Mã Voucher</th>
                    <th>Tên Chương Trình</th>
                    <th>Mức Giảm (%)</th>
                    <th>Phạm Vi Áp Dụng</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map(p => (
                    <tr key={p.id}>
                      <td><strong style={{ color: '#00f2fe', letterSpacing: '0.5px' }}>{p.code}</strong></td>
                      <td>{p.name}</td>
                      <td><strong style={{ color: '#38ef7d' }}>{p.discountPercent}%</strong></td>
                      <td>{p.applicableTo}</td>
                      <td><span className="badge badge-success">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={18} color="#60a5fa" /> Quản Lý Nhà Cung Cấp (Suppliers)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Danh sách đối tác cung ứng thức ăn hạt, phụ kiện & thuốc thú y</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAddSupplierModal(true)}>
                <Plus size={16} /> Thêm Nhà Cung Cấp
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tên Nhà Cung Cấp</th>
                    <th>Người Đại Diện</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Địa Chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.contactPerson}</td>
                      <td>{s.phone}</td>
                      <td>{s.email}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. QUẢN LÝ KHO HÀNG (ADMIN INVENTORY VIEW) */}
      {currentTab === 'inventory-admin' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="#60a5fa" /> Danh Mục Quản Lý Hàng Hóa & Tồn Kho (Admin View)
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Theo dõi số lượng tồn, ngưỡng an toàn và cảnh báo thiếu hàng</p>
            </div>
            {onAddProduct && (
              <button className="btn btn-emerald" onClick={() => onAddProduct({ name: 'Sản Phẩm Mới ' + Math.floor(Math.random()*100), category: 'Thức ăn', unitPrice: 150000, currentStock: 25, minStockLevel: 10, maxStockLevel: 100 })}>
                <Plus size={16} /> Thêm Sản Phẩm Mới
              </button>
            )}
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tên Sản Phẩm</th>
                  <th>Mã SKU</th>
                  <th>Danh Mục</th>
                  <th>Đơn Giá Bán</th>
                  <th>Tồn Kho Hiện Tại</th>
                  <th>Ngưỡng An Toàn</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const isLow = p.currentStock <= p.minStockLevel;
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td><span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.sku}</span></td>
                      <td><span className="badge badge-info">{p.category}</span></td>
                      <td><strong style={{ color: '#34d399' }}>{p.unitPrice.toLocaleString('vi-VN')} đ</strong></td>
                      <td>
                        <strong style={{ color: isLow ? '#f87171' : '#38ef7d', fontSize: '1rem' }}>
                          {p.currentStock} sp
                        </strong>
                      </td>
                      <td>{p.minStockLevel} - {p.maxStockLevel} sp</td>
                      <td>
                        <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                          {isLow ? '⚠️ SẮP HẾT HÀNG' : 'ĐỦ TỒN KHO'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL THÊM TÀI KHOẢN */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Thêm Tài Khoản Mới</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input className="form-control" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" className="form-control" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input className="form-control" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phân Quyền Role</label>
                  <select className="form-control" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="CUSTOMER">Khách Hàng (CUSTOMER)</option>
                    <option value="CARE_STAFF">Nhân Viên Chăm Sóc (CARE_STAFF)</option>
                    <option value="WAREHOUSE_STAFF">Nhân Viên Kho (WAREHOUSE_STAFF)</option>
                    <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM DỊCH VỤ */}
      {showAddServiceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Thêm Dịch Vụ Spa / Y Tế Mới</h3>
            <form onSubmit={handleCreateService}>
              <div className="form-group">
                <label>Tên Dịch Vụ *</label>
                <input className="form-control" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Danh Mục</label>
                  <select className="form-control" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                    <option value="Spa & Grooming">Spa & Grooming</option>
                    <option value="Y Tế & Tiêm Phòng">Y Tế & Tiêm Phòng</option>
                    <option value="Khám Bệnh">Khám Bệnh</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Đơn Giá (đ) *</label>
                  <input type="number" className="form-control" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Thời Lượng (phút)</label>
                <input type="number" className="form-control" value={newService.durationMinutes} onChange={e => setNewService({ ...newService, durationMinutes: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Mô Tả Dịch Vụ</label>
                <textarea className="form-control" rows={3} value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddServiceModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Lưu Dịch Vụ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM KHUYẾN MÃI */}
      {showAddPromoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Tạo Mã Khuyến Mãi Mới</h3>
            <form onSubmit={handleCreatePromo}>
              <div className="form-group">
                <label>Mã Voucher (Code) *</label>
                <input className="form-control" value={newPromo.code} onChange={e => setNewPromo({ ...newPromo, code: e.target.value })} placeholder="VD: SUMMERSALE20" required style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label>Tên Chương Trình *</label>
                <input className="form-control" value={newPromo.name} onChange={e => setNewPromo({ ...newPromo, name: e.target.value })} placeholder="VD: Khuyến Mãi Mùa Hè" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Mức Giảm (%) *</label>
                  <input type="number" min="1" max="100" className="form-control" value={newPromo.discountPercent} onChange={e => setNewPromo({ ...newPromo, discountPercent: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Áp Dụng Cho</label>
                  <select className="form-control" value={newPromo.applicableTo} onChange={e => setNewPromo({ ...newPromo, applicableTo: e.target.value })}>
                    <option value="Tất cả">Tất cả dịch vụ & đơn hàng</option>
                    <option value="Spa & Grooming">Dịch vụ Spa & Grooming</option>
                    <option value="Vật phẩm & Thức ăn">Vật phẩm & Thức ăn</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddPromoModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-coral">Tạo Mã Khuyến Mãi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM NHÀ CUNG CẤP */}
      {showAddSupplierModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Thêm Nhà Cung Cấp Mới</h3>
            <form onSubmit={handleCreateSupplier}>
              <div className="form-group">
                <label>Tên Công Ty / Nhà Cung Cấp *</label>
                <input className="form-control" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} placeholder="VD: Công ty TNHH Pet Care VN" required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Người Đại Diện</label>
                  <input className="form-control" value={newSupplier.contactPerson} onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })} placeholder="Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input className="form-control" value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} placeholder="028..." />
                </div>
              </div>
              <div className="form-group">
                <label>Email Liên Hệ</label>
                <input type="email" className="form-control" value={newSupplier.email} onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })} placeholder="contact@..." />
              </div>
              <div className="form-group">
                <label>Địa Chỉ Kho / Văn Phòng</label>
                <input className="form-control" value={newSupplier.address} onChange={e => setNewSupplier({ ...newSupplier, address: e.target.value })} placeholder="KCN..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSupplierModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Nhà Cung Cấp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM TÀI KHOẢN MỚI */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#00f2fe" /> Thêm Tài Khoản Mới Vào Hệ Thống
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }} onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Họ và Tên Người Dùng *</label>
                <input 
                  className="form-control" 
                  value={newUserData.fullName} 
                  onChange={e => setNewUserData({ ...newUserData, fullName: e.target.value })} 
                  placeholder="Ví dụ: Hoàng Văn Bảo" 
                  required 
                />
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Email Đăng Nhập *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={newUserData.email} 
                    onChange={e => setNewUserData({ ...newUserData, email: e.target.value })} 
                    placeholder="email@petcare.com" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Số Điện Thoại</label>
                  <input 
                    className="form-control" 
                    value={newUserData.phone} 
                    onChange={e => setNewUserData({ ...newUserData, phone: e.target.value })} 
                    placeholder="0912345678" 
                  />
                </div>
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Vai Trò (Role) *</label>
                  <select 
                    className="form-control" 
                    value={newUserData.role} 
                    onChange={e => setNewUserData({ ...newUserData, role: e.target.value })}
                  >
                    <option value="CUSTOMER">Khách Hàng (CUSTOMER)</option>
                    <option value="CARE_STAFF">Nhân Viên Spa (CARE_STAFF)</option>
                    <option value="WAREHOUSE_STAFF">Nhân Viên Kho (WAREHOUSE_STAFF)</option>
                    <option value="ADMIN">Quản Trị Viên (ADMIN)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>Mật Khẩu Khởi Tạo *</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={newUserData.password} 
                    onChange={e => setNewUserData({ ...newUserData, password: e.target.value })} 
                    placeholder="Nhập mật khẩu..." 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
