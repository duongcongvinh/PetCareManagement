import React, { useState, useMemo } from 'react';
import {
  History, Calendar, ShoppingBag, Search, CheckCircle2, Clock,
  DollarSign, Download, Check, Truck, User, PawPrint, CreditCard, MapPin, Filter
} from 'lucide-react';
import { toast } from './ToastNotification';

const ORDER_STATUS_META = {
  DELIVERED: { label: 'Đã giao hàng', badge: 'badge-success' },
  COMPLETED: { label: 'Hoàn thành', badge: 'badge-success' },
  PAID: { label: 'Đã thanh toán', badge: 'badge-success' },
  CONFIRMED: { label: 'Đã xác nhận', badge: 'badge-info' },
  SHIPPED: { label: 'Đang giao hàng', badge: 'badge-info' },
  PENDING: { label: 'Chờ xác nhận', badge: 'badge-pending' },
  CANCELLED: { label: 'Đã hủy', badge: 'badge-danger' },
};

const APP_STATUS_META = {
  COMPLETED: { label: 'Hoàn thành', badge: 'badge-success' },
  IN_PROGRESS: { label: 'Đang thực hiện', badge: 'badge-info' },
  CONFIRMED: { label: 'Đã xác nhận', badge: 'badge-info' },
  PENDING: { label: 'Chờ tiếp nhận', badge: 'badge-pending' },
  CANCELLED: { label: 'Đã hủy', badge: 'badge-danger' },
};

export default function ServiceOrderHistoryPanel({
  appointments = [],
  orders = [],
  services = [],
  onUpdateOrderStatus,
  accentColor = '#0284c7',
}) {
  const [subTab, setSubTab] = useState('services'); // 'services' | 'orders'

  // Service history filters
  const [serviceQuery, setServiceQuery] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('COMPLETED');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('ALL');

  // Order history filters
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Map serviceId/serviceName -> category
  const serviceCategoryMap = useMemo(() => {
    const map = new Map();
    services.forEach((s) => {
      if (s.id) map.set(s.id, s.category);
      if (s.name) map.set(s.name.toLowerCase(), s.category);
    });
    return map;
  }, [services]);

  const getAppointmentCategory = (app) => {
    if (app.serviceId && serviceCategoryMap.has(app.serviceId)) {
      return serviceCategoryMap.get(app.serviceId);
    }
    const name = (app.serviceName || app.service?.name || '').toLowerCase();
    if (name && serviceCategoryMap.has(name)) return serviceCategoryMap.get(name);
    if (name.includes('vắc xin') || name.includes('tiêm') || name.includes('microchip')) return 'Y Tế & Tiêm Phòng';
    if (
      name.includes('khám') || name.includes('siêu âm') || name.includes('xét nghiệm') ||
      name.includes('tẩy giun') || name.includes('nấm da') || name.includes('đỡ đẻ') ||
      name.includes('mổ đẻ') || name.includes('triệt sản') || name.includes('thiến') || name.includes('viêm tử cung')
    ) {
      return 'Khám Bệnh & Trị Liệu';
    }
    return 'Spa & Grooming';
  };

  // KPI metrics
  const completedApps = useMemo(
    () => appointments.filter((a) => a.status === 'COMPLETED'),
    [appointments]
  );
  const completedServiceRevenue = useMemo(
    () => completedApps.reduce((sum, a) => sum + (Number(a.totalPrice || a.price) || 0), 0),
    [completedApps]
  );
  const totalOrderRevenue = useMemo(
    () => orders.filter((o) => o.status !== 'CANCELLED').reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [orders]
  );
  const deliveredOrPaidOrdersCount = useMemo(
    () => orders.filter((o) => ['DELIVERED', 'PAID', 'COMPLETED'].includes(o.status)).length,
    [orders]
  );
  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'PENDING').length,
    [orders]
  );

  // Filtered appointments sorted newest first
  const filteredAppointments = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase();
    return [...appointments]
      .filter((a) => {
        const matchStatus = serviceStatusFilter === 'ALL' ? true : a.status === serviceStatusFilter;
        const cat = getAppointmentCategory(a);
        const matchCat = serviceCategoryFilter === 'ALL' ? true : cat === serviceCategoryFilter;
        const matchQ =
          !q ||
          (a.id || '').toLowerCase().includes(q) ||
          (a.petName || '').toLowerCase().includes(q) ||
          (a.species || '').toLowerCase().includes(q) ||
          (a.customerName || '').toLowerCase().includes(q) ||
          (a.customerPhone || '').toLowerCase().includes(q) ||
          (a.serviceName || '').toLowerCase().includes(q) ||
          (a.staffName || '').toLowerCase().includes(q) ||
          (a.careSummary || '').toLowerCase().includes(q);
        return matchStatus && matchCat && matchQ;
      })
      .sort((a, b) => String(b.appointmentDate || '').localeCompare(String(a.appointmentDate || '')));
  }, [appointments, serviceQuery, serviceStatusFilter, serviceCategoryFilter, serviceCategoryMap]);

  // Filtered orders sorted newest first
  const filteredOrders = useMemo(() => {
    const q = orderQuery.trim().toLowerCase();
    return [...orders]
      .filter((o) => {
        const matchStatus = orderStatusFilter === 'ALL' ? true : o.status === orderStatusFilter;
        const pm = (o.paymentMethod || '').toLowerCase();
        const matchPayment =
          paymentFilter === 'ALL'
            ? true
            : paymentFilter === 'ONLINE'
              ? pm.includes('online') || pm.includes('payos') || pm.includes('vietqr') || pm.includes('chuyển khoản')
              : pm.includes('cod') || pm.includes('tiền mặt');
        const matchQ =
          !q ||
          (o.id || '').toLowerCase().includes(q) ||
          (o.customerName || '').toLowerCase().includes(q) ||
          (o.phone || '').toLowerCase().includes(q) ||
          (o.address || '').toLowerCase().includes(q) ||
          (o.items || '').toLowerCase().includes(q);
        return matchStatus && matchPayment && matchQ;
      })
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }, [orders, orderQuery, orderStatusFilter, paymentFilter]);

  const handleExportCSV = () => {
    const csvEscape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    let rows;
    let filename;
    if (subTab === 'services') {
      rows = [
        ['Ma Ca', 'Ngay', 'Khung Gio', 'Thu Cung', 'Giong', 'Khach Hang', 'SDT', 'Dich Vu', 'Danh Muc', 'Gia (VND)', 'Phu Trach', 'Trang Thai', 'Nhat Ky Cham Soc'],
        ...filteredAppointments.map((a) => [
          a.id,
          a.appointmentDate,
          a.timeSlot,
          a.petName,
          a.species,
          a.customerName,
          a.customerPhone || '',
          a.serviceName,
          getAppointmentCategory(a),
          Number(a.totalPrice || a.price || 0),
          a.staffName || '',
          APP_STATUS_META[a.status]?.label || a.status,
          a.careSummary || '',
        ]),
      ];
      filename = `Petzera_LichSu_DichVu_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      rows = [
        ['Ma Don', 'Ngay Dat', 'Khach Hang', 'SDT', 'Dia Chi', 'San Pham Da Mua', 'Thanh Toan', 'Giao Hang', 'Tong Tien (VND)', 'Trang Thai'],
        ...filteredOrders.map((o) => [
          o.id,
          o.date,
          o.customerName,
          o.phone || '',
          o.address || '',
          o.items,
          o.paymentMethod || 'Tiền Mặt COD',
          o.shippingMethod || 'Tiêu Chuẩn',
          Number(o.total || 0),
          ORDER_STATUS_META[o.status]?.label || o.status,
        ]),
      ];
      filename = `Petzera_LichSu_DonHang_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const csvContent = '\uFEFF' + rows.map((r) => r.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Đã xuất tệp ${filename} thành công!`, 'Xuất Dữ Liệu Lịch Sử');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={22} color={accentColor} /> Lịch Sử Dịch Vụ Đã Làm &amp; Sản Phẩm Đã Mua
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tra cứu đầy đủ toàn bộ nhật ký dịch vụ chăm sóc đã hoàn thành và lịch sử đơn hàng Pet Shop của khách hàng
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={15} /> Xuất CSV {subTab === 'services' ? 'Dịch Vụ' : 'Đơn Hàng'}
        </button>
      </div>

      {/* 4 KPI SUMMARY CARDS */}
      <div className="grid-4">
        <div
          className="glass-panel"
          onClick={() => setSubTab('services')}
          style={{ padding: '1.15rem', borderLeft: '4px solid #059669', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
            <span>DỊCH VỤ ĐÃ HOÀN THÀNH</span>
            <CheckCircle2 size={17} color="#059669" />
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#059669', marginTop: '5px' }}>
            {completedApps.length} ca
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '3px' }}>
            Doanh thu: <strong>{completedServiceRevenue.toLocaleString('vi-VN')} đ</strong>
          </div>
        </div>

        <div
          className="glass-panel"
          onClick={() => setSubTab('orders')}
          style={{ padding: '1.15rem', borderLeft: '4px solid #ea580c', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
            <span>ĐƠN HÀNG SẢN PHẨM</span>
            <ShoppingBag size={17} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ea580c', marginTop: '5px' }}>
            {orders.length} đơn
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '3px' }}>
            Doanh thu: <strong>{totalOrderRevenue.toLocaleString('vi-VN')} đ</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: `4px solid ${accentColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
            <span>TỔNG DOANH THU LỊCH SỬ</span>
            <DollarSign size={17} color={accentColor} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: accentColor, marginTop: '5px' }}>
            {(completedServiceRevenue + totalOrderRevenue).toLocaleString('vi-VN')} đ
          </div>
          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '3px' }}>
            Tổng hợp Dịch vụ &amp; Pet Shop
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
            <span>TRẠNG THÁI ĐƠN HÀNG</span>
            <Truck size={17} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#7c3aed', marginTop: '5px' }}>
            {deliveredOrPaidOrdersCount} / {orders.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: pendingOrdersCount > 0 ? '#d97706' : '#059669', marginTop: '3px', fontWeight: 600 }}>
            {pendingOrdersCount > 0 ? `${pendingOrdersCount} đơn chờ xác nhận` : 'Tất cả đơn đã xử lý'}
          </div>
        </div>
      </div>

      {/* SUB-TABS SWITCHER */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSubTab('services')}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '12px',
                border: subTab === 'services' ? `1.5px solid ${accentColor}` : '1px solid #e2e8f0',
                background: subTab === 'services' ? accentColor : '#ffffff',
                color: subTab === 'services' ? '#ffffff' : '#334155',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <PawPrint size={16} /> Lịch Sử Dịch Vụ Đã Làm
              <span style={{ background: subTab === 'services' ? 'rgba(255,255,255,0.22)' : '#e2e8f0', padding: '1px 8px', borderRadius: '999px', fontSize: '0.75rem' }}>
                {completedApps.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('orders')}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '12px',
                border: subTab === 'orders' ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                background: subTab === 'orders' ? '#ea580c' : '#ffffff',
                color: subTab === 'orders' ? '#ffffff' : '#334155',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <ShoppingBag size={16} /> Lịch Sử Sản Phẩm Đã Mua
              <span style={{ background: subTab === 'orders' ? 'rgba(255,255,255,0.22)' : '#e2e8f0', padding: '1px 8px', borderRadius: '999px', fontSize: '0.75rem' }}>
                {orders.length}
              </span>
            </button>
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '5px 12px', borderRadius: '999px' }}>
            {subTab === 'services'
              ? `Đang hiển thị ${filteredAppointments.length} / ${appointments.length} ca dịch vụ`
              : `Đang hiển thị ${filteredOrders.length} / ${orders.length} đơn hàng`}
          </span>
        </div>

        {/* ==================== SUB-TAB 1: LỊCH SỬ DỊCH VỤ ĐÃ LÀM ==================== */}
        {subTab === 'services' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '11px', padding: '0.5rem 0.85rem', border: '1px solid #cbd5e1', flex: 1, minWidth: 250 }}>
                <Search size={15} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
                <input
                  type="text"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  placeholder="Tìm theo tên bé, chủ nuôi, SĐT, tên dịch vụ, nhân viên..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Filter size={15} color="#64748b" />
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.48rem 0.8rem', fontSize: '0.82rem' }}
                  value={serviceCategoryFilter}
                  onChange={(e) => setServiceCategoryFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả danh mục (3)</option>
                  <option value="Spa & Grooming">Spa &amp; Grooming</option>
                  <option value="Y Tế & Tiêm Phòng">Y Tế &amp; Tiêm Phòng</option>
                  <option value="Khám Bệnh & Trị Liệu">Khám Bệnh &amp; Trị Liệu</option>
                </select>

                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.48rem 0.8rem', fontSize: '0.82rem' }}
                  value={serviceStatusFilter}
                  onChange={(e) => setServiceStatusFilter(e.target.value)}
                >
                  <option value="COMPLETED">Chỉ dịch vụ đã hoàn thành ({completedApps.length})</option>
                  <option value="ALL">Tất cả trạng thái ({appointments.length})</option>
                  <option value="IN_PROGRESS">Đang thực hiện</option>
                  <option value="PENDING">Chờ tiếp nhận</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="table-container" style={{ maxHeight: '620px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Mã Ca &amp; Ngày</th>
                    <th>Thú Cưng</th>
                    <th>Khách Hàng</th>
                    <th>Dịch Vụ Thực Hiện</th>
                    <th>Chi Phí</th>
                    <th>Nhân Viên &amp; Nhật Ký Chăm Sóc</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Không tìm thấy lịch sử dịch vụ phù hợp bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => {
                      const cat = getAppointmentCategory(app);
                      const statusInfo = APP_STATUS_META[app.status] || { label: app.status, badge: 'badge-info' };
                      return (
                        <tr key={app.id}>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <strong style={{ color: '#0f172a', fontSize: '0.84rem' }}>{app.id}</strong>
                            <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Calendar size={12} color={accentColor} /> {app.appointmentDate}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={11} /> {app.timeSlot}
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: '#0f172a' }}>{app.petName || 'Thú cưng'}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.species || ''}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
                              <User size={13} color="#64748b" /> {app.customerName || 'Khách hàng'}
                            </div>
                            {app.customerPhone && (
                              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{app.customerPhone}</div>
                            )}
                          </td>
                          <td style={{ maxWidth: 260 }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem', lineHeight: 1.35 }}>
                              {app.serviceName}
                            </div>
                            <span className="badge badge-info" style={{ fontSize: '0.68rem', marginTop: '4px', display: 'inline-block' }}>
                              {cat}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontWeight: 800, color: '#059669' }}>
                            {Number(app.totalPrice || app.price || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td style={{ maxWidth: 300 }}>
                            {app.staffName && (
                              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0369a1', marginBottom: '3px' }}>
                                Phụ trách: {app.staffName}
                              </div>
                            )}
                            <div style={{ fontSize: '0.78rem', color: app.careSummary ? '#065f46' : '#64748b', fontStyle: app.careSummary ? 'italic' : 'normal', lineHeight: 1.4 }}>
                              {app.careSummary ? `📝 ${app.careSummary}` : (app.notes || 'Chưa có ghi chú chăm sóc')}
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ==================== SUB-TAB 2: LỊCH SỬ SẢN PHẨM ĐÃ MUA ==================== */}
        {subTab === 'orders' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '11px', padding: '0.5rem 0.85rem', border: '1px solid #cbd5e1', flex: 1, minWidth: 250 }}>
                <Search size={15} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Tìm mã đơn, tên khách hàng, SĐT, sản phẩm đã mua, địa chỉ..."
                  style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.84rem', outline: 'none', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Filter size={15} color="#64748b" />
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.48rem 0.8rem', fontSize: '0.82rem' }}
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả trạng thái ({orders.length})</option>
                  <option value="DELIVERED">Đã giao hàng ({orders.filter(o => o.status === 'DELIVERED').length})</option>
                  <option value="PAID">Đã thanh toán ({orders.filter(o => o.status === 'PAID').length})</option>
                  <option value="CONFIRMED">Đã xác nhận ({orders.filter(o => o.status === 'CONFIRMED').length})</option>
                  <option value="PENDING">Chờ xác nhận ({orders.filter(o => o.status === 'PENDING').length})</option>
                  <option value="CANCELLED">Đã hủy ({orders.filter(o => o.status === 'CANCELLED').length})</option>
                </select>

                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.48rem 0.8rem', fontSize: '0.82rem' }}
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="ALL">Mọi hình thức thanh toán</option>
                  <option value="ONLINE">Online (payOS / VietQR)</option>
                  <option value="COD">Tiền Mặt COD</option>
                </select>
              </div>
            </div>

            <div className="table-container" style={{ maxHeight: '620px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Mã Đơn &amp; Thời Gian</th>
                    <th>Khách Hàng &amp; Địa Chỉ</th>
                    <th>Sản Phẩm Đã Mua</th>
                    <th>Thanh Toán &amp; Giao Hàng</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    {onUpdateOrderStatus && <th>Thao Tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={onUpdateOrderStatus ? 7 : 6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Không tìm thấy đơn hàng nào phù hợp bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const st = ORDER_STATUS_META[order.status] || { label: order.status, badge: 'badge-info' };
                      return (
                        <tr key={order.id}>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <strong style={{ color: '#0f172a' }}>{order.id}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{order.date}</div>
                          </td>
                          <td style={{ maxWidth: 220 }}>
                            <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{order.customerName}</strong>
                            {order.phone && <div style={{ fontSize: '0.74rem', color: '#475569' }}>{order.phone}</div>}
                            {order.address && (
                              <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '3px', marginTop: '2px' }}>
                                <MapPin size={11} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{order.address}</span>
                              </div>
                            )}
                          </td>
                          <td style={{ maxWidth: 290, fontSize: '0.83rem', color: '#1e293b', lineHeight: 1.45 }}>
                            {order.items}
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CreditCard size={12} /> {order.paymentMethod || 'Tiền Mặt COD'}
                            </div>
                            <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Truck size={12} /> {order.shippingMethod || 'Giao Tiêu Chuẩn'}
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontWeight: 800, color: '#059669' }}>
                            {Number(order.total || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <span className={`badge ${st.badge}`}>{st.label}</span>
                          </td>
                          {onUpdateOrderStatus && (
                            <td style={{ whiteSpace: 'nowrap' }}>
                              {order.status === 'PENDING' ? (
                                <button
                                  type="button"
                                  className="btn btn-emerald"
                                  style={{ padding: '0.34rem 0.68rem', fontSize: '0.76rem' }}
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'CONFIRMED');
                                    toast.success(`Đã xác nhận đơn hàng ${order.id}!`, 'Đơn Hàng');
                                  }}
                                >
                                  <Check size={13} /> Xác Nhận
                                </button>
                              ) : order.status === 'CONFIRMED' || order.status === 'PAID' ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{ padding: '0.34rem 0.68rem', fontSize: '0.76rem', color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'DELIVERED');
                                    toast.success(`Đã cập nhật đơn ${order.id} sang Đã giao hàng!`, 'Hoàn Tất Đơn');
                                  }}
                                >
                                  <Truck size={13} /> Đã Giao
                                </button>
                              ) : order.status === 'CANCELLED' ? (
                                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Đã hủy</span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hoàn tất</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
