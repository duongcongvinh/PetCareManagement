import React, { useState } from 'react';
import { apiService } from '../apiService';
import { toast } from './ToastNotification';
import BrandLogo from './BrandLogo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+?84)[0-9]{8,10}$/;

const parseAccountInput = (rawInput) => {
  const raw = (rawInput || '').trim();
  const cleanedPhone = raw.replace(/[\s.-]/g, '');

  if (EMAIL_REGEX.test(raw)) {
    return { type: 'email', value: raw.toLowerCase() };
  }
  if (PHONE_REGEX.test(cleanedPhone)) {
    const normalizedPhone = cleanedPhone.startsWith('+84')
      ? '0' + cleanedPhone.slice(3)
      : cleanedPhone.startsWith('84') && cleanedPhone.length >= 10
        ? '0' + cleanedPhone.slice(2)
        : cleanedPhone;
    return { type: 'phone', value: normalizedPhone };
  }
  return { type: 'invalid', value: raw };
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onAddUser, users = [] }) {
  const [isRegister, setIsRegister] = useState(false);
  const [accountInput, setAccountInput] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const detectedAccount = accountInput.trim() ? parseAccountInput(accountInput) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedAccount = accountInput.trim();

    if (!trimmedAccount || !password) {
      toast.warning('Vui lòng nhập đầy đủ Email hoặc Số điện thoại và Mật khẩu!', 'Thiếu Thông Tin');
      return;
    }

    const parsed = parseAccountInput(trimmedAccount);
    if (parsed.type === 'invalid') {
      toast.warning(
        'Vui lòng nhập đúng định dạng Email hoặc Số điện thoại!',
        'Tài Khoản Không Hợp Lệ'
      );
      return;
    }

    if (isRegister && !fullName.trim()) {
      toast.warning('Vui lòng nhập họ và tên của bạn!', 'Thiếu Thông Tin');
      return;
    }

    const normalizedId = parsed.value;
    const isPhone = parsed.type === 'phone';
    const nameToUse = fullName.trim() || (isPhone ? `Khách ${normalizedId.slice(-4)}` : normalizedId.split('@')[0]);

    if (isRegister) {
      try {
        const res = await apiService.register({
          identifier: normalizedId,
          email: normalizedId,
          phone: isPhone ? normalizedId : undefined,
          password,
          fullName: nameToUse,
          role: 'CUSTOMER'
        });
        if (res && res.user) {
          const userItem = {
            ...res.user,
            status: 'ACTIVE',
            createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          };
          if (onAddUser) onAddUser(userItem);
          onLoginSuccess(userItem, res.token);
          toast.success(`Chào mừng ${userItem.fullName}! Bạn đã đăng ký tài khoản thành công.`, 'Đăng Ký Thành Công');
          onClose();
          return;
        } else if (res && res.message) {
          toast.error(res.message, 'Không Thể Đăng Ký');
          return;
        }
      } catch (err) {
        console.warn('Backend register fallback:', err);
      }

      // Offline / local fallback: kiểm tra trùng lặp
      const existsLocal = users.find(
        (u) =>
          (u.email && u.email.toLowerCase() === normalizedId.toLowerCase()) ||
          (u.phone && u.phone.replace(/[\s.-]/g, '') === normalizedId)
      );
      if (existsLocal) {
        toast.error(
          isPhone ? 'Số điện thoại này đã được đăng ký!' : 'Email này đã được đăng ký!',
          'Tài Khoản Đã Tồn Tại'
        );
        return;
      }

      const userObj = {
        id: 'u-' + Date.now(),
        email: normalizedId,
        phone: isPhone ? normalizedId : '',
        fullName: nameToUse,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0]
      };

      if (onAddUser) onAddUser(userObj);
      onLoginSuccess(userObj, 'customer-jwt-token-' + Date.now());
      toast.success(`Chào mừng ${userObj.fullName}! Đăng ký tài khoản thành công.`, 'Đăng Ký Thành Công');
      onClose();
      return;
    }

    // ĐĂNG NHẬP (Hỗ trợ cả Email & SĐT)
    try {
      const res = await apiService.login(normalizedId, password);
      if (res && res.user) {
        const userItem = {
          ...res.user,
          status: 'ACTIVE',
          createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
        };
        onLoginSuccess(userItem, res.token);
        toast.success(`Xin chào ${userItem.fullName}!`, 'Đăng Nhập Thành Công');
        onClose();
        return;
      } else if (res && res.message) {
        toast.error(res.message, 'Đăng Nhập Thất Bại');
        return;
      }
    } catch (err) {
      console.warn('Backend login fallback:', err);
    }

    // Offline / local fallback: tìm tài khoản khớp Email hoặc SĐT
    const matchedUser = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === normalizedId.toLowerCase()) ||
        (u.phone && u.phone.replace(/[\s.-]/g, '') === normalizedId)
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser, 'customer-jwt-token-' + Date.now());
      toast.success(`Xin chào ${matchedUser.fullName}!`, 'Đăng Nhập Thành Công');
      onClose();
      return;
    }

    const userObj = {
      id: 'u-' + Date.now(),
      email: normalizedId,
      phone: isPhone ? normalizedId : '',
      fullName: nameToUse,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddUser) onAddUser(userObj);
    onLoginSuccess(userObj, 'customer-jwt-token-' + Date.now());
    toast.success(`Xin chào ${userObj.fullName}!`, 'Đăng Nhập Thành Công');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 440, borderRadius: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <BrandLogo variant="stacked" size="sm" subtitle="CHĂM SÓC THÚ CƯNG & PET SHOP" />
        </div>
        <h3 style={{ fontSize: '1.28rem', fontWeight: 800, marginBottom: '0.2rem', textAlign: 'center', color: '#0f172a' }}>
          {isRegister ? 'Đăng Ký Tài Khoản Khách Hàng' : 'Đăng Nhập Khách Hàng'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', marginBottom: '1.25rem' }}>
          Tài khoản mua sắm phụ kiện & đặt lịch chăm sóc thú cưng
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Họ và Tên *</label>
              <input 
                className="form-control" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                placeholder="Nhập họ và tên" 
                required 
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Email hoặc Số Điện Thoại *
              </label>
              {detectedAccount && detectedAccount.type !== 'invalid' && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '1px 8px',
                  borderRadius: '10px',
                  border: '1px solid #a7f3d0'
                }}>
                  ✓ {detectedAccount.type === 'phone' ? 'Số điện thoại' : 'Email'}
                </span>
              )}
            </div>
            <input 
              type="text"
              inputMode="email"
              className="form-control" 
              value={accountInput} 
              onChange={e => setAccountInput(e.target.value)} 
              placeholder="Nhập email hoặc số điện thoại" 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Mật Khẩu *</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Nhập mật khẩu" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-coral" 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.78rem', borderRadius: '12px', fontWeight: 800, justifyContent: 'center' }}
          >
            {isRegister ? 'Tạo Tài Khoản Khách Hàng' : 'Đăng Nhập Khách Hàng'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer', fontWeight: 800 }} 
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Đăng nhập ngay' : 'Tạo tài khoản mới'}
          </button>
        </div>

        <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ width: '100%', borderRadius: '12px', fontSize: '0.82rem', justifyContent: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1' }}
            onClick={() => {
              onLoginSuccess({
                id: 'u-4',
                email: 'khachhang@gmail.com',
                phone: '0934567890',
                fullName: 'Phạm Minh Anh',
                role: 'CUSTOMER'
              }, 'customer-jwt-token-demo');
              onClose();
            }}
          >
            ⚡ Đăng Nhập Nhanh Mẫu: Phạm Minh Anh (Khách Hàng)
          </button>
        </div>

        <button 
          type="button"
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '0.75rem', borderRadius: '12px', justifyContent: 'center' }} 
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
