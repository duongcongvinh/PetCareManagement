import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldAlert, Info, X, 
  ShoppingCart, Lock, Calendar, Sparkles, HelpCircle 
} from 'lucide-react';

// Global Event Dispatchers for Toasts & Confirmations
export const toast = {
  success: (message, title = 'Thành công', options = {}) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('petcare_toast', {
        detail: { id: Date.now() + Math.random(), type: 'success', title, message, ...options }
      }));
    }
  },
  warning: (message, title = 'Cảnh báo', options = {}) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('petcare_toast', {
        detail: { id: Date.now() + Math.random(), type: 'warning', title, message, ...options }
      }));
    }
  },
  error: (message, title = 'Lỗi', options = {}) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('petcare_toast', {
        detail: { id: Date.now() + Math.random(), type: 'error', title, message, ...options }
      }));
    }
  },
  info: (message, title = 'Thông báo', options = {}) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('petcare_toast', {
        detail: { id: Date.now() + Math.random(), type: 'info', title, message, ...options }
      }));
    }
  }
};

export const confirmModal = (message, title = 'Xác Nhận Hành Động', options = {}) => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('petcare_confirm_modal', {
        detail: {
          title,
          message,
          confirmText: options.confirmText || 'Xác Nhận',
          cancelText: options.cancelText || 'Hủy Bỏ',
          type: options.type || 'warning',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        }
      }));
    } else {
      resolve(false);
    }
  });
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [newToast, ...prev].slice(0, 5));

      // Auto dismiss after 3.8s
      const duration = newToast.duration || 3800;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, duration);
    };

    const handleConfirmEvent = (e) => {
      setConfirmState(e.detail);
    };

    window.addEventListener('petcare_toast', handleToastEvent);
    window.addEventListener('petcare_confirm_modal', handleConfirmEvent);

    return () => {
      window.removeEventListener('petcare_toast', handleToastEvent);
      window.removeEventListener('petcare_confirm_modal', handleConfirmEvent);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          color: '#059669',
          bgGradient: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.95) 100%)',
          borderColor: '#6ee7b7',
          shadow: '0 12px 30px rgba(5, 150, 105, 0.18)',
          iconBg: 'rgba(5, 150, 105, 0.15)'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: '#ea580c',
          bgGradient: 'linear-gradient(135deg, rgba(255, 247, 237, 0.97) 0%, rgba(255, 237, 213, 0.97) 100%)',
          borderColor: '#fdba74',
          shadow: '0 12px 30px rgba(234, 88, 12, 0.2)',
          iconBg: 'rgba(234, 88, 12, 0.15)'
        };
      case 'error':
        return {
          icon: ShieldAlert,
          color: '#dc2626',
          bgGradient: 'linear-gradient(135deg, rgba(254, 242, 242, 0.97) 0%, rgba(254, 226, 226, 0.97) 100%)',
          borderColor: '#fca5a5',
          shadow: '0 12px 30px rgba(220, 38, 38, 0.18)',
          iconBg: 'rgba(220, 38, 38, 0.15)'
        };
      case 'info':
      default:
        return {
          icon: Info,
          color: '#0284c7',
          bgGradient: 'linear-gradient(135deg, rgba(240, 249, 255, 0.97) 0%, rgba(224, 242, 254, 0.97) 100%)',
          borderColor: '#7dd3fc',
          shadow: '0 12px 30px rgba(2, 132, 199, 0.18)',
          iconBg: 'rgba(2, 132, 199, 0.15)'
        };
    }
  };

  return (
    <>
      {/* 1. TOAST NOTIFICATIONS STACK (TOP-RIGHT) */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 24, 
          right: 24, 
          zIndex: 999999, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          pointerEvents: 'none',
          maxWidth: '440px',
          width: 'calc(100vw - 48px)'
        }}
      >
        {toasts.map((item) => {
          const config = getTypeStyles(item.type);
          const IconComp = item.customIcon || config.icon;

          return (
            <div
              key={item.id}
              className="toast-card-enter"
              style={{
                pointerEvents: 'auto',
                background: config.bgGradient,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1.5px solid ${config.borderColor}`,
                borderRadius: '16px',
                padding: '1rem 1.15rem',
                boxShadow: config.shadow,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div 
                  style={{ 
                    width: 38, 
                    height: 38, 
                    borderRadius: '50%', 
                    background: config.iconBg, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <IconComp size={20} color={config.color} strokeWidth={2.5} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {item.title}
                    </h5>
                    <button
                      onClick={() => removeToast(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px', lineHeight: 1.45, fontWeight: 500 }}>
                    {item.message}
                  </p>

                  {item.actionText && (
                    <button
                      onClick={() => {
                        if (item.onAction) item.onAction();
                        removeToast(item.id);
                      }}
                      style={{
                        marginTop: '8px',
                        background: config.color,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      {item.actionText}
                    </button>
                  )}
                </div>
              </div>

              {/* Countdown Progress Bar */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '3px',
                  background: config.color,
                  width: '100%',
                  animation: 'toastCountdown 3.8s linear forwards'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 2. MODERN CONFIRMATION MODAL (REPLACES BROWSER CONFIRM) */}
      {confirmState && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999999 }}>
          <div 
            className="modal-content animate-fade-in" 
            style={{ 
              maxWidth: 460, 
              padding: '2rem', 
              borderRadius: '20px', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              textAlign: 'center'
            }}
          >
            <div 
              style={{ 
                width: 58, 
                height: 58, 
                borderRadius: '50%', 
                background: confirmState.type === 'danger' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              {confirmState.type === 'danger' ? (
                <ShieldAlert size={30} color="#dc2626" />
              ) : (
                <HelpCircle size={30} color="#d97706" />
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
              {confirmState.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, marginBottom: '1.75rem' }}>
              {confirmState.message}
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '12px' }}
                onClick={() => {
                  if (confirmState.onCancel) confirmState.onCancel();
                  setConfirmState(null);
                }}
              >
                {confirmState.cancelText}
              </button>

              <button 
                type="button" 
                className={confirmState.type === 'danger' ? 'btn btn-danger' : 'btn btn-coral'}
                style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '12px', fontWeight: 800 }}
                onClick={() => {
                  if (confirmState.onConfirm) confirmState.onConfirm();
                  setConfirmState(null);
                }}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
