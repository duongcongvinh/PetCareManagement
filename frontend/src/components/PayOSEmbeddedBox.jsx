import React, { useEffect, useRef, useState } from 'react';
import { usePayOS } from '@payos/payos-checkout';
import { RefreshCw, X, ShieldCheck, Copy, Smartphone, QrCode, CheckCircle2, Clock } from 'lucide-react';

const TOTAL_TTL_SECONDS = 10 * 60; // 10 phút

export default function PayOSEmbeddedBox({
  checkoutUrl,
  orderCode,
  amount,
  currentTotal,
  expiresAt,
  accountNumber,
  accountName,
  description,
  onCopyText,
  onSuccess,
  onCancel,
  onExpireAndRegenerate,
  onRefreshAmount,
  onCheckStatusNow,
  checkingStatus = false,
  regenerating = false,
}) {
  const callbacksRef = useRef({ onSuccess, onCancel, onExpireAndRegenerate });
  callbacksRef.current = { onSuccess, onCancel, onExpireAndRegenerate };

  const targetExpireMsRef = useRef(expiresAt || Date.now() + TOTAL_TTL_SECONDS * 1000);
  const expiredTriggeredRef = useRef(false);

  const calcRemaining = (targetMs) => Math.max(0, Math.ceil((targetMs - Date.now()) / 1000));
  const [secondsLeft, setSecondsLeft] = useState(() => calcRemaining(targetExpireMsRef.current));

  // Reset countdown mỗi khi có orderCode mới
  useEffect(() => {
    const nextExpireMs = expiresAt || Date.now() + TOTAL_TTL_SECONDS * 1000;
    targetExpireMsRef.current = nextExpireMs;
    expiredTriggeredRef.current = false;
    setSecondsLeft(calcRemaining(nextExpireMs));

    const tick = setInterval(() => {
      const rem = calcRemaining(targetExpireMsRef.current);
      setSecondsLeft(rem);
      if (rem <= 0 && !expiredTriggeredRef.current) {
        expiredTriggeredRef.current = true;
        clearInterval(tick);
        if (callbacksRef.current.onExpireAndRegenerate) {
          callbacksRef.current.onExpireAndRegenerate();
        }
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [orderCode, expiresAt]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const isAlmostExpired = secondsLeft <= 60;
  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / TOTAL_TTL_SECONDS) * 100));

  const containerId = 'payos-embedded-container';

  useEffect(() => {
    if (!checkoutUrl) return;
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = '';

    const returnUrl = `${window.location.origin}/thanh-toan?payos=success&orderCode=${orderCode}`;
    const { open, exit } = usePayOS({
      RETURN_URL: returnUrl,
      ELEMENT_ID: containerId,
      CHECKOUT_URL: checkoutUrl,
      embedded: true,
      onSuccess: (event) => {
        if (callbacksRef.current.onSuccess) callbacksRef.current.onSuccess(event);
      },
      onCancel: (event) => {
        if (callbacksRef.current.onCancel) callbacksRef.current.onCancel(event);
      },
      onExit: (event) => {
        if (callbacksRef.current.onCancel) callbacksRef.current.onCancel(event);
      },
    });

    open();

    const injectedIframe = el?.querySelector('iframe');
    if (injectedIframe) {
      injectedIframe.style.border = 'none';
      injectedIframe.style.display = 'block';
      injectedIframe.style.background = '#ffffff';
    }

    return () => {
      try {
        exit();
      } catch (e) {}
      const cleanupEl = document.getElementById(containerId);
      if (cleanupEl) cleanupEl.innerHTML = '';
    };
  }, [checkoutUrl, orderCode]);

  const amountMismatch =
    typeof currentTotal === 'number' && Math.round(currentTotal) !== Math.round(amount || 0);

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #fffaf5 55%, #f8fafc 100%)',
        border: '1.5px solid #fed7aa',
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: '0 12px 32px -12px rgba(234, 88, 12, 0.18), 0 4px 12px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Warning banner if total changed */}
      {amountMismatch && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '12px',
            padding: '0.65rem 0.9rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#92400e',
          }}
        >
          <span>
            ⚠️ Tổng tiền đã đổi sang <strong>{currentTotal.toLocaleString('vi-VN')} đ</strong> (mã QR hiện tại:{' '}
            <strong>{Number(amount || 0).toLocaleString('vi-VN')} đ</strong>).
          </span>
          <button
            type="button"
            onClick={onRefreshAmount}
            style={{
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '5px 11px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Cập nhật mã QR
          </button>
        </div>
      )}

      {/* Premium 2-column split: Snug QR Frame (Left) + Payment Guide & Details (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}
      >
        {/* LEFT: Official payOS Embedded QR Frame (tightly framed, no wasted side space) */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '0.55rem',
            boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            id={containerId}
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '365px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#ffffff',
            }}
          />
        </div>

        {/* RIGHT: Live Payment Details, Steps & Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.9rem',
          }}
        >
          {/* Live Status & Amount */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '0.55rem',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#047857',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block',
                  }}
                />
                {regenerating ? 'Đang tạo mã QR mới...' : 'Đang chờ thanh toán'}
              </span>

              <span
                title="Tự động hủy mã cũ và tạo mã QR mới sau 10 phút"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: isAlmostExpired ? '#fef2f2' : '#eff6ff',
                  border: isAlmostExpired ? '1px solid #fecaca' : '1px solid #bfdbfe',
                  color: isAlmostExpired ? '#dc2626' : '#1d4ed8',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <Clock size={12} /> {mins}:{secs}
              </span>
            </div>

            {/* Thin countdown bar */}
            <div style={{ height: '4px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: isAlmostExpired ? '#ef4444' : 'linear-gradient(90deg, #ff6b35 0%, #10b981 100%)',
                  transition: 'width 0.9s linear',
                }}
              />
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                marginBottom: '0.85rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Số tiền cần thanh toán
              </div>
              <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ff6b35', lineHeight: 1.2, marginTop: '2px' }}>
                {Number(amount || 0).toLocaleString('vi-VN')} đ
              </div>

              {(accountNumber || description) && (
                <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.79rem' }}>
                  {accountName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ color: '#64748b' }}>Chủ TK:</span>
                      <strong style={{ color: '#0f172a', textAlign: 'right' }}>{accountName}</strong>
                    </div>
                  )}
                  {accountNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#64748b' }}>Số TK:</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <strong style={{ color: '#0284c7' }}>{accountNumber}</strong>
                        {onCopyText && (
                          <button
                            type="button"
                            onClick={() => onCopyText(accountNumber, 'Số tài khoản')}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '2px 5px', cursor: 'pointer', color: '#475569', display: 'inline-flex' }}
                            title="Sao chép số tài khoản"
                          >
                            <Copy size={12} />
                          </button>
                        )}
                      </span>
                    </div>
                  )}
                  {description && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#64748b' }}>Nội dung:</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <strong style={{ color: '#047857', background: '#ecfdf5', padding: '1px 6px', borderRadius: '5px' }}>{description}</strong>
                        {onCopyText && (
                          <button
                            type="button"
                            onClick={() => onCopyText(description, 'Nội dung chuyển khoản')}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '2px 5px', cursor: 'pointer', color: '#475569', display: 'inline-flex' }}
                            title="Sao chép nội dung"
                          >
                            <Copy size={12} />
                          </button>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3 Quick Visual Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 24, height: 24, borderRadius: '8px', background: '#fff7ed', color: '#ea580c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Smartphone size={13} />
                </span>
                <span>Mở App ngân hàng bất kỳ (MB, VCB, Techcombank, ACB...)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 24, height: 24, borderRadius: '8px', background: '#eff6ff', color: '#0284c7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <QrCode size={13} />
                </span>
                <span>Quét mã VietQR bên trái (tự điền đúng số tiền)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 24, height: 24, borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={13} />
                </span>
                <span>Chờ <strong>2–5 giây</strong> — đơn hàng tự xác nhận thành công</span>
              </div>
            </div>
          </div>

          {/* Footer Security & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                disabled={checkingStatus}
                onClick={onCheckStatusNow}
                style={{
                  flex: 1,
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: checkingStatus ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: checkingStatus ? 0.7 : 1,
                }}
              >
                <RefreshCw size={14} className={checkingStatus ? 'animate-spin' : ''} />
                {checkingStatus ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái'}
              </button>

              <button
                type="button"
                onClick={() => onCancel && onCancel()}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  borderRadius: '10px',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                <X size={14} /> Hủy mã
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', color: '#64748b' }}>
              <ShieldCheck size={13} color="#059669" />
              <span>Bảo mật bởi cổng thanh toán <strong>payOS VietQR</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
