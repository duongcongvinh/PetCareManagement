import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, PlayCircle, AlertCircle, FileText } from 'lucide-react';

export default function CareStaffDashboard({ appointments, onUpdateStatus }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [careSummary, setCareSummary] = useState('');

  const handleUpdate = (id, newStatus) => {
    onUpdateStatus(id, newStatus, careSummary);
    setSelectedApp(null);
    setCareSummary('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Bàn Làm Việc Nhân Viên Chăm Sóc (Care Staff)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tiếp nhận thú cưng, thực hiện dịch vụ Spa/Y tế và ghi lại nhật ký chăm sóc</p>
      </div>

      {/* PIPELINE COLUMNS */}
      <div className="grid-3">
        {/* PENDING */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <span style={{ fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> Chờ Tiếp Nhận ({appointments.filter(a => a.status === 'PENDING').length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {appointments.filter(a => a.status === 'PENDING').map(app => (
              <div key={app.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#00f2fe' }}>{app.timeSlot}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dịch vụ: {app.serviceName || app.service?.name || 'Dịch Vụ'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chủ: {app.customerName || app.customer?.fullName || 'Khách Hàng'}</div>
                {app.notes && <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>Lưu ý: {app.notes}</div>}
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }}
                  onClick={() => onUpdateStatus(app.id, 'IN_PROGRESS', 'Bắt đầu làm dịch vụ')}
                >
                  <PlayCircle size={14} /> Tiếp Nhận & Bắt Đầu
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* IN_PROGRESS */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <span style={{ fontWeight: 800, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlayCircle size={16} /> Đang Thực Hiện ({appointments.filter(a => a.status === 'IN_PROGRESS').length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {appointments.filter(a => a.status === 'IN_PROGRESS').map(app => (
              <div key={app.id} className="glass-card" style={{ borderColor: 'rgba(96, 165, 250, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>{app.timeSlot}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dịch vụ: {app.serviceName || app.service?.name || 'Dịch Vụ'}</div>
                <div style={{ fontSize: '0.8rem', color: '#38ef7d', marginTop: '4px' }}>Nhân viên phụ trách: {app.staffName || app.staff?.fullName || 'Bạn'}</div>
                
                <button 
                  className="btn btn-emerald" 
                  style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    setSelectedApp(app);
                    setCareSummary(app.careSummary || 'Đã hoàn thành dịch vụ tốt, bé khỏe mạnh.');
                  }}
                >
                  <CheckCircle2 size={14} /> Hoàn Thành & Viết Nhật Ký
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <span style={{ fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Đã Hoàn Thành ({appointments.filter(a => a.status === 'COMPLETED').length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {appointments.filter(a => a.status === 'COMPLETED').map(app => (
              <div key={app.id} className="glass-card" style={{ opacity: 0.9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{app.petName || app.pet?.name || 'Thú Cưng'}</strong>
                  <span className="badge badge-success">COMPLETED</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dịch vụ: {app.serviceName || app.service?.name || 'Dịch Vụ'}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                  📝 Ghi chú: "{app.careSummary}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL HOÀN THÀNH DỊCH VỤ */}
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
                📝 Ghi Chú Nhật Ký Chăm Sóc / Tình Trạng Sức Khỏe Bé
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
    </div>
  );
}
