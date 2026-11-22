import React, { useState } from 'react';
import { Shield, Lock, Mail, UserCheck, AlertCircle, Package, Briefcase } from 'lucide-react';
import { apiService } from '../apiService';
import BrandLogo from './BrandLogo';

const STAFF_ROLES = ['CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'];
const ROLE_LABELS = {
  CARE_STAFF: 'Nhân Viên',
  WAREHOUSE_STAFF: 'Quản Lý Kho',
  ADMIN: 'Admin',
};

export default function StaffLoginModal({ isOpen = true, onClose, onLoginSuccess, isFullPage = false, users = [] }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (targetRole) => {
    setSelectedRole(targetRole);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const raw = account.trim();
    const lower = raw.toLowerCase();
    const cleanedPhone = raw.replace(/[\s.-]/g, '');

    if (!raw || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.login(raw, password, 'STAFF');

      if (res && res.user && res.token) {
        if (!STAFF_ROLES.includes(res.user.role)) {
          setErrorMessage('Email/Số điện thoại hoặc mật khẩu không chính xác.');
          return;
        }

        if (res.user.role !== selectedRole) {
          setErrorMessage(
            `Tài khoản này thuộc vai trò ${ROLE_LABELS[res.user.role] || res.user.role}. Vui lòng chọn đúng vai trò ở trên.`
          );
          return;
        }

        const matchedLocal = users.find(
          (u) =>
            (u.email && u.email.toLowerCase() === (res.user.email || '').toLowerCase()) ||
            (u.phone && res.user.phone && u.phone.replace(/[\s.-]/g, '') === res.user.phone.replace(/[\s.-]/g, ''))
        );
        if (matchedLocal && matchedLocal.status === 'LOCKED') {
          setErrorMessage('Tài khoản này đang bị khóa. Vui lòng liên hệ Admin.');
          return;
        }

        const userItem = {
          ...res.user,
          status: 'ACTIVE',
          createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        };
        onLoginSuccess(userItem, res.token);
        if (onClose) onClose();
        return;
      }

      setErrorMessage((res && res.message) || 'Email/Số điện thoại hoặc mật khẩu không chính xác.');
      return;
    } catch (err) {
      console.warn('Backend staff login unavailable:', err);
      // Fallback chỉ khi chạy offline không có backend
      const matched = users.find(
        (u) =>
          STAFF_ROLES.includes(u.role) &&
          ((u.email && u.email.toLowerCase() === lower) ||
            (u.phone && u.phone.replace(/[\s.-]/g, '') === cleanedPhone))
      );

      if (!matched) {
        setErrorMessage('Không thể kết nối máy chủ xác thực hoặc tài khoản không tồn tại.');
        return;
      }
      if (matched.role !== selectedRole) {
        setErrorMessage(
          `Tài khoản này thuộc vai trò ${ROLE_LABELS[matched.role] || matched.role}. Vui lòng chọn đúng vai trò ở trên.`
        );
        return;
      }
      if (matched.status === 'LOCKED') {
        setErrorMessage('Tài khoản này đang bị khóa. Vui lòng liên hệ Admin.');
        return;
      }
      onLoginSuccess(matched, 'mock-staff-jwt-token-2026');
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  const loginCard = (
    <div
      className="modal-content animate-fade-in"
      style={{
        maxWidth: 490,
        width: '100%',
        border: '1px solid #e2e8f0',
        boxShadow: '0 24px 60px -15px rgba(15, 23, 42, 0.25)',
        borderRadius: '24px',
        background: '#ffffff',
        padding: '2rem',
      }}
    >
      {/* Header Brand Logo & Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <BrandLogo variant="stacked" size="sm" subtitle="CỔNG QUẢN TRỊ & VẬN HÀNH NỘI BỘ" />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', marginBottom: '0.55rem' }}>
          <Shield size={13} /> BẢO MẬT PHÂN QUYỀN RBAC
        </div>
        <h3 style={{ fontSize: '1.32rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
          Đăng Nhập Hệ Thống Nội Bộ
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
          Chọn vai trò và nhập tài khoản Nhân viên, Quản lý kho hoặc Admin
        </p>
      </div>

      {/* Staff Role Selector (không tự điền tài khoản / mật khẩu) */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.9rem', borderRadius: '14px', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <UserCheck size={14} color="#0284c7" /> Chọn Vai Trò Đăng Nhập:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <button
            type="button"
            className="btn"
            style={{
              fontSize: '0.8rem',
              padding: '0.55rem 0.85rem',
              background: selectedRole === 'CARE_STAFF' ? '#e0f2fe' : '#ffffff',
              border: selectedRole === 'CARE_STAFF' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
              color: '#0369a1',
              fontWeight: 700,
              borderRadius: '10px',
              justifyContent: 'space-between',
            }}
            onClick={() => handleSelectRole('CARE_STAFF')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} /> Nhân Viên (Lịch hẹn, Dịch vụ, KM, Thú cưng, Báo cáo)
            </span>
          </button>

          <button
            type="button"
            className="btn"
            style={{
              fontSize: '0.8rem',
              padding: '0.55rem 0.85rem',
              background: selectedRole === 'WAREHOUSE_STAFF' ? '#fef3c7' : '#ffffff',
              border: selectedRole === 'WAREHOUSE_STAFF' ? '1.5px solid #d97706' : '1px solid #cbd5e1',
              color: '#b45309',
              fontWeight: 700,
              borderRadius: '10px',
              justifyContent: 'space-between',
            }}
            onClick={() => handleSelectRole('WAREHOUSE_STAFF')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={14} /> Quản Lý Kho (Nhập/Xuất/Tồn, Dự báo AI, Đề xuất nhập)
            </span>
          </button>

          <button
            type="button"
            className="btn"
            style={{
              fontSize: '0.8rem',
              padding: '0.55rem 0.85rem',
              background: selectedRole === 'ADMIN' ? '#f3e8ff' : '#ffffff',
              border: selectedRole === 'ADMIN' ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
              color: '#6d28d9',
              fontWeight: 700,
              borderRadius: '10px',
              justifyContent: 'space-between',
            }}
            onClick={() => handleSelectRole('ADMIN')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} /> Admin (Tổng quan, Tài khoản, Phân quyền, Duyệt nhập, NCC, Cấu hình)
            </span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '0.85rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px', display: 'block' }}>
            Email hoặc Số Điện Thoại *
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px' }}
              placeholder="Nhập email hoặc số điện thoại"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px', display: 'block' }}>
            Mật Khẩu *
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              className="form-control"
              style={{ paddingLeft: '36px' }}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.78rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Đang Xác Thực...' : 'Đăng Nhập Vào Hệ Thống'}
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
          <a href="/" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>
            ← Quay lại Trang Khách Hàng
          </a>
        </div>
      )}
    </div>
  );

  if (isFullPage) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 105px)',
          background:
            'radial-gradient(circle at 15% 20%, rgba(2, 132, 199, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(124, 58, 237, 0.12) 0%, transparent 45%), #f8fafc',
          padding: '2.5rem 1rem',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {loginCard}
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            fontSize: '0.78rem',
            color: '#64748b',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span>🔒 Phân quyền RBAC 4 vai trò</span>
          <span>•</span>
          <span>⚡ MongoDB + Prisma ORM</span>
          <span>•</span>
          <span>🤖 AI Dự báo nhu cầu kho</span>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)' }}>
      {loginCard}
    </div>
  );
}
