import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { apiService } from '../apiService';
import { toast } from './ToastNotification';
import BrandLogo from './BrandLogo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+?84)[0-9]{8,10}$/;

const evaluatePasswordRules = (pwd) => {
  const value = String(pwd || '');
  const hasMinLength = value.length >= 8;
  const hasUpperLowerDigit = /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9\s]/.test(value);
  return {
    hasMinLength,
    hasUpperLowerDigit,
    hasSpecialChar,
    isStrong: hasMinLength && hasUpperLowerDigit && hasSpecialChar,
  };
};

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const detectedAccount = accountInput.trim() ? parseAccountInput(accountInput) : null;
  const pwdRules = evaluatePasswordRules(password);
  const hasConfirmInput = confirmPassword.length > 0;
  const isConfirmMatched = hasConfirmInput && confirmPassword === password;

  const handleToggleMode = () => {
    setIsRegister((prev) => !prev);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

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

    if (isRegister) {
      if (!pwdRules.hasMinLength) {
        toast.warning('Mật khẩu đăng ký phải có ít nhất 8 ký tự!', 'Mật Khẩu Chưa Đạt Yêu Cầu');
        return;
      }
      if (!pwdRules.hasUpperLowerDigit) {
        toast.warning('Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số!', 'Mật Khẩu Chưa Đạt Yêu Cầu');
        return;
      }
      if (!pwdRules.hasSpecialChar) {
        toast.warning('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%...)!', 'Mật Khẩu Chưa Đạt Yêu Cầu');
        return;
      }
      if (!confirmPassword) {
        toast.warning('Vui lòng nhập lại mật khẩu để xác nhận!', 'Thiếu Thông Tin');
        return;
      }
      if (password !== confirmPassword) {
        toast.warning('Mật khẩu nhập lại chưa khớp. Vui lòng kiểm tra lại!', 'Mật Khẩu Không Khớp');
        return;
      }
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
          confirmPassword,
          fullName: nameToUse,
          role: 'CUSTOMER'
        });
        if (res && res.user) {
          const userItem = {
            ...res.user,
            status: res.user.status || 'ACTIVE',
            createdAt: res.user.createdAt ? res.user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          };
          if (onAddUser) onAddUser({ ...userItem, _alreadySavedInDb: true });
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

    // ĐĂNG NHẬP KHÁCH HÀNG (Chỉ chấp nhận vai trò CUSTOMER, chặn tài khoản nội bộ)
    try {
      const res = await apiService.login(normalizedId, password, 'CUSTOMER');
      if (res && res.user) {
        if (res.user.role !== 'CUSTOMER') {
          toast.error('Email/Số điện thoại hoặc mật khẩu không chính xác.', 'Đăng Nhập Thất Bại');
          return;
        }
        const userItem = {
          ...res.user,
          status: res.user.status || 'ACTIVE',
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

    // Offline / local fallback: chỉ khớp tài khoản CUSTOMER (tuyệt đối không cho đăng nhập Admin/Staff)
    const matchedUser = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === normalizedId.toLowerCase()) ||
        (u.phone && u.phone.replace(/[\s.-]/g, '') === normalizedId)
    );

    if (matchedUser) {
      if (matchedUser.role !== 'CUSTOMER') {
        toast.error('Email/Số điện thoại hoặc mật khẩu không chính xác.', 'Đăng Nhập Thất Bại');
        return;
      }
      if (matchedUser.status === 'LOCKED') {
        toast.error('Tài khoản này đang bị khóa. Vui lòng liên hệ Admin.', 'Tài Khoản Bị Khóa');
        return;
      }
      onLoginSuccess(matchedUser, 'customer-jwt-token-' + Date.now());
      toast.success(`Xin chào ${matchedUser.fullName}!`, 'Đăng Nhập Thành Công');
      onClose();
      return;
    }

    toast.error('Không thể kết nối máy chủ xác thực hoặc tài khoản không tồn tại.', 'Đăng Nhập Thất Bại');
  };

  const passwordChecklist = [
    { id: 'len', label: 'Ít nhất 8 ký tự', ok: pwdRules.hasMinLength },
    { id: 'mix', label: 'Ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số', ok: pwdRules.hasUpperLowerDigit },
    { id: 'spec', label: 'Ít nhất 1 ký tự đặc biệt (!@#$%...)', ok: pwdRules.hasSpecialChar },
  ];

  const hasPasswordInput = password.length > 0;
  const passwordBorderColor = isRegister
    ? hasPasswordInput
      ? pwdRules.isStrong
        ? '#10b981'
        : '#cbd5e1'
      : '#cbd5e1'
    : '#cbd5e1';

  const confirmBorderColor = hasConfirmInput
    ? isConfirmMatched
      ? '#10b981'
      : '#ef4444'
    : '#cbd5e1';

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 450, borderRadius: '22px', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <BrandLogo variant="stacked" size="sm" subtitle="CHĂM SÓC THÚ CƯNG & PET SHOP" />
        </div>
        <h3 style={{ fontSize: '1.28rem', fontWeight: 800, marginBottom: '0.2rem', textAlign: 'center', color: '#0f172a' }}>
          {isRegister ? 'Đăng Ký Tài Khoản Khách Hàng' : 'Đăng Nhập Khách Hàng'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', marginBottom: '1.15rem' }}>
          Tài khoản mua sắm phụ kiện & đặt lịch chăm sóc thú cưng
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group" style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Họ và Tên <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                className="form-control" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                placeholder="Nhập họ và tên" 
                required 
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: isRegister ? '1.15rem' : '1.05rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Email hoặc Số Điện Thoại <span style={{ color: '#ef4444' }}>*</span>
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

          {/* MẬT KHẨU (Notched Label + Nút hiện/ẩn mật khẩu) */}
          <div style={{ position: 'relative', marginBottom: isRegister ? '0.65rem' : '1rem' }}>
            <label
              htmlFor="petzera-auth-password"
              style={{
                position: 'absolute',
                top: '-9px',
                left: '12px',
                background: '#ffffff',
                padding: '0 6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                zIndex: 1,
                lineHeight: 1.2,
              }}
            >
              Mật khẩu <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                border: `${isRegister && pwdRules.isStrong ? '1.5px' : '1.5px'} solid ${passwordBorderColor}`,
                background: '#ffffff',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <input
                id="petzera-auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isRegister ? 'Nhập mật khẩu' : 'Nhập mật khẩu'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
                style={{
                  flex: 1,
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '0.78rem 0.5rem 0.72rem 0.9rem',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  letterSpacing: !showPassword && password.length > 0 ? '1.5px' : 'normal',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CHECKLIST 3 TIÊU CHÍ MẬT KHẨU (KHI ĐĂNG KÝ) */}
          {isRegister && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                margin: '0.5rem 0 1.15rem 2px',
              }}
            >
              {passwordChecklist.map((item) => {
                const isError = hasPasswordInput && !item.ok;
                const textColor = item.ok ? '#15803d' : isError ? '#dc2626' : '#64748b';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '0.81rem',
                      fontWeight: item.ok ? 600 : 500,
                      color: textColor,
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {item.ok ? (
                      <Check size={15} color="#16a34a" strokeWidth={3} style={{ flexShrink: 0 }} />
                    ) : isError ? (
                      <X size={14} color="#dc2626" strokeWidth={2.75} style={{ flexShrink: 0 }} />
                    ) : (
                      <Check size={15} color="#94a3b8" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    )}
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* NHẬP LẠI MẬT KHẨU (KHI ĐĂNG KÝ) */}
          {isRegister && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <label
                  htmlFor="petzera-auth-confirm-password"
                  style={{
                    position: 'absolute',
                    top: '-9px',
                    left: '12px',
                    background: '#ffffff',
                    padding: '0 6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: hasConfirmInput
                      ? isConfirmMatched
                        ? '#15803d'
                        : '#dc2626'
                      : '#334155',
                    zIndex: 1,
                    lineHeight: 1.2,
                  }}
                >
                  Nhập lại mật khẩu <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    border: `${isConfirmMatched ? '2px' : '1.5px'} solid ${confirmBorderColor}`,
                    background: '#ffffff',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <input
                    id="petzera-auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    required
                    style={{
                      flex: 1,
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      padding: '0.78rem 0.5rem 0.72rem 0.9rem',
                      fontSize: '0.92rem',
                      color: '#0f172a',
                      letterSpacing: !showConfirmPassword && confirmPassword.length > 0 ? '1.5px' : 'normal',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu nhập lại' : 'Hiện mật khẩu nhập lại'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 12px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#64748b',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {hasConfirmInput && !isConfirmMatched && (
                <div style={{ fontSize: '0.76rem', color: '#dc2626', fontWeight: 600, marginTop: '5px', marginLeft: '4px' }}>
                  Mật khẩu nhập lại chưa khớp.
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-coral" 
            style={{ width: '100%', marginTop: '0.35rem', padding: '0.78rem', borderRadius: '12px', fontWeight: 800, justifyContent: 'center' }}
          >
            {isRegister ? 'Tạo Tài Khoản Khách Hàng' : 'Đăng Nhập Khách Hàng'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: '#ff6b35', cursor: 'pointer', fontWeight: 800 }} 
            onClick={handleToggleMode}
          >
            {isRegister ? 'Đăng nhập ngay' : 'Tạo tài khoản mới'}
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
