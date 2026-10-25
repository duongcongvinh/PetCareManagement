import React, { useState } from 'react';
import { User, Lock, Mail, ShoppingBag } from 'lucide-react';

import { apiService } from '../apiService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onAddUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Vui lòng nhập đầy đủ Email và Mật khẩu!');
    if (isRegister && !fullName) return alert('Vui lòng nhập họ và tên!');

    const nameToUse = fullName || (email.split('@')[0]);

    if (isRegister) {
      try {
        const res = await apiService.register({
          email,
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
          alert('🎉 Chúc mừng bạn đã đăng ký tài khoản thành công!');
          onClose();
          return;
        } else if (res && res.message) {
          alert(res.message);
          return;
        }
      } catch (err) {
        console.warn('Backend register fallback:', err);
      }
    } else {
      try {
        const res = await apiService.login(email, password);
        if (res && res.user) {
          const userItem = {
            ...res.user,
            status: 'ACTIVE',
            createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          };
          onLoginSuccess(userItem, res.token);
          onClose();
          return;
        } else if (res && res.message) {
          alert(res.message);
          return;
        }
      } catch (err) {
        console.warn('Backend login fallback:', err);
      }
    }

    const userObj = {
      id: 'u-' + Date.now(),
      email,
      fullName: nameToUse,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddUser) onAddUser(userObj);
    onLoginSuccess(userObj, 'customer-jwt-token-' + Date.now());
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: 440, borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.2rem', textAlign: 'center', color: '#0f172a' }}>
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
                placeholder="Ví dụ: Nguyễn Văn An" 
                required 
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Email Khách Hàng *</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="nhapemail@gmail.com" 
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
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', borderRadius: '12px', fontWeight: 800, justifyContent: 'center' }}
          >
            {isRegister ? 'Tạo Tài Khoản Khách Hàng' : 'Đăng Nhập Khách Hàng'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button 
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
