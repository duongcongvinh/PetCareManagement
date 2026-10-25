import React, { useState } from 'react';
import { Shield, Lock, Mail, UserCheck, AlertCircle } from 'lucide-react';

export default function StaffLoginModal({ isOpen = true, onClose, onLoginSuccess, isFullPage = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEmail = email.toLowerCase().trim();
    let userRole = selectedRole;
    let fullName = 'Nguyễn Văn Admin';

    if (targetEmail.startsWith('warehouse') || targetEmail.startsWith('kho')) {
      userRole = 'WAREHOUSE_STAFF';
      fullName = 'Lê Văn Kho (Warehouse Staff)';
    } else if (targetEmail.startsWith('care') || targetEmail.startsWith('spa')) {
      userRole = 'CARE_STAFF';
      fullName = 'Trần Thị Chăm Sóc (Spa Staff)';
    } else if (targetEmail.startsWith('admin')) {
      userRole = 'ADMIN';
      fullName = 'Nguyễn Văn Admin';
    } else {
      userRole = selectedRole;
      if (selectedRole === 'CARE_STAFF') fullName = 'Trần Thị Chăm Sóc (Spa Staff)';
      else if (selectedRole === 'WAREHOUSE_STAFF') fullName = 'Lê Văn Kho (Warehouse Staff)';
      else fullName = 'Nguyễn Văn Admin';
    }

    const userObj = {
      id: 'staff-' + Date.now(),
      email,
      fullName,
      role: userRole
    };

    onLoginSuccess(userObj, 'mock-staff-jwt-token-2026');
    if (onClose) onClose();
  };

  const fillQuickAccount = (targetEmail, targetRole) => {
    setEmail(targetEmail);
    setPassword('123456');
    setSelectedRole(targetRole);
    setErrorMessage('');
  };

  const loginCard = (
    <div className="modal-content animate-fade-in" style={{ maxWidth: 480, width: '100%', border: '1px solid rgba(255, 255, 255, 0.9)', boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 50px rgba(2, 132, 199, 0.18)', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.97)', backdropFilter: 'blur(20px)', padding: '2rem' }}>
      
      {/* Header Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '18px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', marginBottom: '0.75rem', boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)' }}>
          <Shield size={32} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
          Đăng Nhập Cổng Quản Trị & Nhân Viên
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
          Hệ Thống Quản Lý PetCare (Dành cho Spa, Kho & Admin)
        </p>
      </div>

      {/* Quick Demo Staff Login Buttons */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '14px', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <UserCheck size={14} color="#0284c7" /> Đăng Nhập Nhanh Theo Vai Trò Nhân Viên:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem', background: selectedRole === 'CARE_STAFF' ? '#e0f2fe' : '#ffffff', border: selectedRole === 'CARE_STAFF' ? '1.5px solid #0284c7' : '1px solid #cbd5e1', color: '#0369a1', fontWeight: 700, borderRadius: '8px', justifyContent: 'flex-start' }}
            onClick={() => fillQuickAccount('care@petcare.com', 'CARE_STAFF')}
          >
            💈 Nhân Viên Spa (care@petcare.com)
          </button>

          <button
            type="button"
            className="btn"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem', background: selectedRole === 'WAREHOUSE_STAFF' ? '#fef3c7' : '#ffffff', border: selectedRole === 'WAREHOUSE_STAFF' ? '1.5px solid #d97706' : '1px solid #cbd5e1', color: '#b45309', fontWeight: 700, borderRadius: '8px', justifyContent: 'flex-start' }}
            onClick={() => fillQuickAccount('warehouse@petcare.com', 'WAREHOUSE_STAFF')}
          >
            📦 Nhân Viên Kho (warehouse@petcare.com)
          </button>

          <button
            type="button"
            className="btn"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem', background: selectedRole === 'ADMIN' ? '#f3e8ff' : '#ffffff', border: selectedRole === 'ADMIN' ? '1.5px solid #9333ea' : '1px solid #cbd5e1', color: '#7e22ce', fontWeight: 700, borderRadius: '8px', justifyContent: 'flex-start' }}
            onClick={() => fillQuickAccount('admin@petcare.com', 'ADMIN')}
          >
            🛡️ Quản Trị Admin (admin@petcare.com)
          </button>
        </div>
      </div>

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '0.85rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px', display: 'block' }}>Email Nhân Viên / Admin *</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              className="form-control" 
              style={{ paddingLeft: '36px' }}
              placeholder="Nhập email (vd: admin@petcare.com)..."
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px', display: 'block' }}>Mật Khẩu *</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              className="form-control" 
              style={{ paddingLeft: '36px' }}
              placeholder="Nhập mật khẩu (mẫu: 123456)..."
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-cyan" 
          style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', justifyContent: 'center' }}
        >
          Đăng Nhập Vào Hệ Thống Quản Trị
        </button>
      </form>

      {onClose && !isFullPage && (
        <button 
          type="button"
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '0.75rem', borderRadius: '12px', justifyContent: 'center' }} 
          onClick={onClose}
        >
          Đóng
        </button>
      )}

      {isFullPage && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem' }}>
          <a href="/" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>← Quay lại Trang Khách Hàng (Customer Portal)</a>
        </div>
      )}
    </div>
  );

  if (isFullPage) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 70px)', 
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 15% 20%, rgba(2, 132, 199, 0.28) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(147, 51, 234, 0.28) 0%, transparent 45%), radial-gradient(circle at 50% 50%, #0f172a 0%, #090d16 100%)',
        padding: '3rem 1rem' 
      }}>
        {/* Subtle Dots Pattern Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none'
        }} />

        {/* Ambient Glowing Orbs */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '18%',
          width: '280px',
          height: '280px',
          background: 'rgba(2, 132, 199, 0.18)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12%',
          right: '18%',
          width: '320px',
          height: '320px',
          background: 'rgba(147, 51, 234, 0.18)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        {/* Top Floating Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0.45rem 1.25rem',
          borderRadius: '30px',
          color: '#38bdf8',
          fontSize: '0.82rem',
          fontWeight: 800,
          marginBottom: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 2
        }}>
          ✨ CỔNG QUẢN TRỊ NỘI BỘ PETCARE AI ENGINE v2.0
        </div>

        {/* Center Login Card */}
        <div style={{ zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
          {loginCard}
        </div>

        {/* Bottom Security Info */}
        <div style={{ 
          marginTop: '1.75rem', 
          fontSize: '0.78rem', 
          color: '#94a3b8', 
          textAlign: 'center',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <span>🔒 Phân quyền RBAC 3 lớp</span>
          <span>•</span>
          <span>⚡ Real-time Data Sync PostgreSQL</span>
          <span>•</span>
          <span>🤖 AI Forecasting Enabled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>
      {loginCard}
    </div>
  );
}
