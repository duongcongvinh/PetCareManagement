import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Clock, PlayCircle, AlertCircle, FileText, 
  PawPrint, Search, Tag, Sparkles, TrendingUp, User, Heart, ShieldAlert
} from 'lucide-react';

export default function CareStaffDashboard({ 
  appointments = [], 
  pets = [], 
  services = [], 
  promotions = [], 
  activeTab = 'queue', 
  onUpdateStatus 
}) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [careSummary, setCareSummary] = useState('');
  const [petSearch, setPetSearch] = useState('');
  const [selectedPetDetail, setSelectedPetDetail] = useState(null);

  const handleUpdate = (id, newStatus) => {
    onUpdateStatus(id, newStatus, careSummary);
    setSelectedApp(null);
    setCareSummary('');
  };

  const pendingApps = appointments.filter(a => a.status === 'PENDING');
  const inProgressApps = appointments.filter(a => a.status === 'IN_PROGRESS');
  const completedApps = appointments.filter(a => a.status === 'COMPLETED');

  const filteredPets = pets.filter(p => 
    p.name?.toLowerCase().includes(petSearch.toLowerCase()) ||
    p.breed?.toLowerCase().includes(petSearch.toLowerCase()) ||
    p.species?.toLowerCase().includes(petSearch.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* HEADER GREETING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Bàn Làm Việc Nhân Viên Chăm Sóc (Care Staff Portal)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tiếp nhận thú cưng, quản lý hồ sơ y bạ, quy trình spa và ghi nhận nhật ký chăm sóc
          </p>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid-4">
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ca Hẹn Chờ Nhận</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
            {pendingApps.length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Đang Chăm Sóc</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
            {inProgressApps.length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Đã Hoàn Thành</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {completedApps.length}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tổng Hồ Sơ Thú Cưng</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
            {pets.length}
          </div>
        </div>
      </div>

      {/* VIEW 1: QUEUE (CA HẸN CẦN LÀM) */}
      {(activeTab === 'queue' || !activeTab) && (
        <div className="grid-3">
          {/* PENDING */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> Chờ Tiếp Nhận ({pendingApps.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {pendingApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Không có ca hẹn nào chờ tiếp nhận.
                </div>
              ) : (
                pendingApps.map(app => (
                  <div key={app.id} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>{app.timeSlot}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dịch vụ: <strong>{app.serviceName || app.service?.name || 'Dịch Vụ'}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chủ bé: {app.customerName || app.customer?.fullName || 'Khách Hàng'}</div>
                    {app.notes && (
                      <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '4px', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                        ⚠️ Lưu ý: {app.notes}
                      </div>
                    )}
                    
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }}
                      onClick={() => onUpdateStatus(app.id, 'IN_PROGRESS', 'Bắt đầu làm dịch vụ')}
                    >
                      <PlayCircle size={14} /> Tiếp Nhận & Bắt Đầu
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* IN_PROGRESS */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PlayCircle size={16} /> Đang Thực Hiện ({inProgressApps.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {inProgressApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Hiện chưa có bé nào đang làm dịch vụ.
                </div>
              ) : (
                inProgressApps.map(app => (
                  <div key={app.id} className="glass-card" style={{ borderColor: 'rgba(2, 132, 199, 0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>{app.timeSlot}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dịch vụ: <strong>{app.serviceName || app.service?.name}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>
                      Thợ phụ trách: <strong>{app.staffName || 'Bạn'}</strong>
                    </div>
                    
                    <button 
                      className="btn btn-emerald" 
                      style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }}
                      onClick={() => {
                        setSelectedApp(app);
                        setCareSummary(app.careSummary || 'Đã hoàn thành tắm sấy, tỉa lông vệ sinh; thể trạng bé khỏe mạnh.');
                      }}
                    >
                      <CheckCircle2 size={14} /> Hoàn Thành & Viết Nhật Ký
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COMPLETED */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Đã Hoàn Thành ({completedApps.length})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '550px', overflowY: 'auto' }}>
              {completedApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Chưa có ca hẹn nào hoàn tất trong ngày.
                </div>
              ) : (
                completedApps.map(app => (
                  <div key={app.id} className="glass-card" style={{ opacity: 0.95 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                      <span className="badge badge-success">COMPLETED</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dịch vụ: {app.serviceName || app.service?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontStyle: 'italic', background: 'rgba(16,185,129,0.06)', padding: '6px 8px', borderRadius: '6px' }}>
                      📝 <strong>Care Summary:</strong> "{app.careSummary || 'Dịch vụ đã hoàn tất chuẩn quy trình.'}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: QUẢN LÝ HỒ SƠ THÚ CƯNG & Y BẠ (pets-logs) */}
      {activeTab === 'pets-logs' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PawPrint size={20} color="#ff6b35" /> Hồ Sơ Thú Cưng & Y Bạ Chăm Sóc
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Tra cứu nhanh bệnh án, dị ứng và đặc tính hung dữ của bé trước khi làm dịch vụ
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.45rem 0.85rem', border: '1px solid var(--border-light)' }}>
              <Search size={15} color="var(--text-muted)" style={{ marginRight: '6px' }} />
              <input 
                type="text" 
                value={petSearch}
                onChange={e => setPetSearch(e.target.value)}
                placeholder="Tìm tên bé, giống loài..." 
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '180px' }}
              />
            </div>
          </div>

          <div className="grid-3">
            {filteredPets.map(p => (
              <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff8e53' }}>{p.name}</h4>
                  <span className="badge badge-info">{p.species}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Giống loài: <strong>{p.breed || 'Chưa rõ'}</strong></div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Tuổi: <strong>{p.ageMonths ? `${p.ageMonths} tháng` : 'Chưa cập nhật'}</strong> • Cân nặng: <strong>{p.weightKg ? `${p.weightKg} kg` : 'Chưa cân'}</strong>
                </div>
                
                <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.15)', padding: '0.65rem', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={14} /> Tiền sử / Lưu ý sức khỏe:
                  </div>
                  <div style={{ color: p.medicalHistory ? 'var(--text-main)' : 'var(--text-muted)', fontStyle: p.medicalHistory ? 'normal' : 'italic' }}>
                    {p.medicalHistory || 'Không ghi nhận bệnh lý đặc biệt. Bé khỏe mạnh.'}
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.8rem' }}
                  onClick={() => setSelectedPetDetail(p)}
                >
                  Xem Lịch Sử Các Lần Spa Của Bé
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: DANH MỤC DỊCH VỤ & KHUYẾN MÃI (services / promotions) */}
      {activeTab === 'services' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={20} color="#0284c7" /> Bảng Giá Dịch Vụ & Ưu Đãi Áp Dụng
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Thông tin thời lượng tiêu chuẩn và bảng giá dịch vụ spa thú cưng
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            {services.map(s => (
              <div key={s.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">{s.category}</span>
                  <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{s.price.toLocaleString('vi-VN')} đ</strong>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{s.name}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>{s.description}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Thời lượng thực hiện: <strong>{s.durationMinutes} phút</strong>
                </div>
              </div>
            ))}
          </div>

          {/* ACTIVE PROMOTIONS */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={18} color="#f59e0b" /> Chương Trình Khuyến Mãi Đang Kích Hoạt
            </h4>
            <div className="grid-2">
              <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#f59e0b', fontSize: '1rem' }}>COMBO SPA TOÀN DIỆN MÙA HÈ</strong>
                  <span className="badge badge-coral">GIẢM 20%</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Áp dụng cho gói Tắm Spa Bạc Hà + Cắt tỉa tạo kiểu lông hè chống sốc nhiệt cho cún và mèo.
                </p>
              </div>

              <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#10b981', fontSize: '1rem' }}>TRI ÂN KHÁCH HÀNG THÂN THIẾT</strong>
                  <span className="badge badge-success">TẶNG VỆ SINH TAI</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Miễn phí cắt mài móng và vệ sinh tuyến hôi cho thú cưng có từ 3 lần sử dụng dịch vụ trở lên.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: BÁO CÁO NĂNG SUẤT (stats) */}
      {activeTab === 'stats' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#10b981" /> Báo Cáo Năng Suất Làm Việc Cá Nhân
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Thống kê hiệu quả chăm sóc và mức độ hài lòng của khách hàng
          </p>

          <div className="grid-3">
            <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981' }}>{completedApps.length}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>Ca Hẹn Đã Chăm Sóc Thành Công</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tất cả các ca đều có ghi nhận Care Summary đầy đủ</div>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b' }}>4.9 ★</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>Đánh Giá Hài Lòng Trung Bình</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Dựa trên 48 lượt phản hồi của chủ nuôi</div>
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0284c7' }}>100%</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>Đúng Khung Giờ Đã Hẹn (On-Time)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Không phát sinh phản ánh trễ giờ</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HOÀN THÀNH DỊCH VỤ & GHI CARE SUMMARY */}
      {selectedApp && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedApp(null); }}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 520, borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                🎉 Hoàn Thành Dịch Vụ: {selectedApp.petName || selectedApp.pet?.name || 'Thú Cưng'}
              </h3>
              <button 
                onClick={() => setSelectedApp(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>Dịch vụ: {selectedApp.serviceName || selectedApp.service?.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Chủ nuôi: {selectedApp.customerName || 'Khách Hàng'} • Khung giờ: {selectedApp.timeSlot}</div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#334155', fontSize: '0.88rem' }}>
                📝 Ghi Chú Nhật Ký Chăm Sóc / Tình Trạng Sức Khỏe Bé (Care Summary)
              </label>
              <textarea 
                className="form-control" 
                rows={4} 
                value={careSummary} 
                onChange={e => setCareSummary(e.target.value)}
                placeholder="Nhập chi tiết quá trình tắm, cắt tỉa lông, tình trạng da, tai hoặc dặn dò cho chủ bé..."
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Hủy Bỏ</button>
              <button 
                type="button" 
                className="btn btn-emerald" 
                onClick={() => handleUpdate(selectedApp.id, 'COMPLETED')}
              >
                <CheckCircle2 size={16} /> Lưu & Chốt Đơn Hoàn Thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM CHI TIẾT LỊCH SỬ THÚ CƯNG */}
      {selectedPetDetail && (
        <div className="modal-overlay" onClick={() => setSelectedPetDetail(null)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: 550, borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff6b35', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PawPrint size={20} /> Lịch Sử Chăm Sóc Của Bé: {selectedPetDetail.name}
              </h3>
              <button onClick={() => setSelectedPetDetail(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div>Giống: <strong>{selectedPetDetail.breed}</strong> ({selectedPetDetail.species})</div>
              <div>Cân nặng: <strong>{selectedPetDetail.weightKg} kg</strong> • Độ tuổi: <strong>{selectedPetDetail.ageMonths} tháng</strong></div>
              <div style={{ marginTop: '4px', color: '#f59e0b' }}>⚠️ Bệnh sử: {selectedPetDetail.medicalHistory || 'Bé khỏe mạnh, không ghi nhận dị ứng.'}</div>
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {appointments.filter(a => a.petId === selectedPetDetail.id || a.petName === selectedPetDetail.name).length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', fontSize: '0.85rem' }}>
                  Chưa có lịch sử ca hẹn nào được ghi nhận cho bé này.
                </div>
              ) : (
                appointments.filter(a => a.petId === selectedPetDetail.id || a.petName === selectedPetDetail.name).map(a => (
                  <div key={a.id} className="glass-card" style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                      <span>{a.serviceName}</span>
                      <span className="badge badge-success">{a.status}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ngày: {a.appointmentDate} ({a.timeSlot})</div>
                    {a.careSummary && (
                      <div style={{ fontSize: '0.78rem', color: '#10b981', fontStyle: 'italic', marginTop: '4px' }}>
                        📝 {a.careSummary}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPetDetail(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
