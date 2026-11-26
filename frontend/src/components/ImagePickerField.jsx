import React, { useRef, useState } from 'react';
import { Upload, Link2, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Reusable Image Picker supporting both:
 * 1) Local file upload (auto-resized & compressed via Canvas to keep MongoDB & localStorage fast/light)
 * 2) Direct image URL input (https://...)
 * With real-time visual preview, size badge, and reset button.
 */
const compressImageFile = (file, maxDim = 800, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh.'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Định dạng ảnh không hợp lệ.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const ImagePickerField = ({
  label = 'Hình Ảnh Minh Họa',
  value = '',
  fallbackPreview = '',
  onChange,
  aspect = 'product', // 'product' (square contain) | 'service' (landscape cover)
  helperText = 'Hỗ trợ tải ảnh trực tiếp từ máy (JPG, PNG, WEBP — tự động tối ưu dung lượng) hoặc dán link URL ảnh.',
}) => {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [imgBroken, setImgBroken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const previewSrc = value || fallbackPreview;
  const hasPreview = Boolean(previewSrc && !imgBroken);
  const isDataUrl = typeof value === 'string' && value.startsWith('data:image/');
  const approxKb = isDataUrl ? Math.round((value.length * 3) / 4 / 1024) : null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn đúng tệp hình ảnh (JPG, PNG, WEBP, GIF).');
      e.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Dung lượng ảnh gốc tối đa 10MB.');
      e.target.value = '';
      return;
    }
    try {
      setIsProcessing(true);
      const compressed = await compressImageFile(file, aspect === 'service' ? 960 : 760, 0.82);
      setImgBroken(false);
      onChange(compressed);
    } catch (err) {
      setUploadError(err.message || 'Không thể xử lý hình ảnh.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleUrlChange = (e) => {
    setUploadError('');
    setImgBroken(false);
    onChange(e.target.value);
  };

  const handleClear = () => {
    setUploadError('');
    setImgBroken(false);
    onChange('');
  };

  const boxWidth = aspect === 'service' ? 156 : 116;
  const boxHeight = aspect === 'service' ? 104 : 116;

  return (
    <div
      className="form-group"
      style={{
        background: '#f8fafc',
        border: '1px dashed #cbd5e1',
        borderRadius: '14px',
        padding: '0.9rem 1rem',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <label style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
          <ImageIcon size={15} color="#ea580c" /> {label}
        </label>
        {value ? (
          <span style={{ fontSize: '0.73rem', fontWeight: 700, color: imgBroken ? '#dc2626' : '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {imgBroken ? (
              <><AlertCircle size={13} /> Link ảnh không tải được</>
            ) : isDataUrl ? (
              <><CheckCircle2 size={13} /> Đã tải ảnh từ máy (~{approxKb} KB)</>
            ) : (
              <><CheckCircle2 size={13} /> Đã gắn link URL ảnh</>
            )}
          </span>
        ) : (
          <span style={{ fontSize: '0.73rem', color: '#64748b' }}>
            {fallbackPreview ? 'Đang hiển thị ảnh hiện tại' : 'Chưa có ảnh — tải ảnh hoặc dán URL để xem trước'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Live Preview Box — chỉ hiện ảnh khi có ảnh, ngược lại hiện khung trống chọn ảnh */}
        {hasPreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            title="Nhấn để đổi ảnh từ máy tính"
            style={{
              width: boxWidth,
              height: boxHeight,
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              background: '#ffffff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              position: 'relative',
              padding: aspect === 'product' ? '6px' : 0,
            }}
          >
            <img
              src={previewSrc}
              alt="Xem trước hình ảnh"
              referrerPolicy="no-referrer"
              onError={() => setImgBroken(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: aspect === 'service' ? 'cover' : 'contain',
                display: 'block',
              }}
            />
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            title="Nhấn để tải ảnh từ máy tính"
            style={{
              width: boxWidth,
              height: boxHeight,
              borderRadius: '12px',
              border: '1.5px dashed #cbd5e1',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '0.5rem' }}>
              <ImageIcon size={24} style={{ display: 'block', margin: '0 auto 4px' }} />
              <span style={{ fontSize: '0.71rem', fontWeight: 600 }}>Chọn ảnh</span>
            </div>
          </div>
        )}

        {/* Controls: Upload Button + URL Input */}
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.42rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: '#ffffff',
                border: '1px solid #fdba74',
                color: '#c2410c',
              }}
            >
              <Upload size={14} /> {isProcessing ? 'Đang xử lý...' : 'Tải Ảnh Từ Máy'}
            </button>
            {value && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                style={{
                  padding: '0.42rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#dc2626',
                  borderColor: '#fecaca',
                  background: '#fef2f2',
                }}
              >
                <Trash2 size={14} /> Xóa Ảnh
              </button>
            )}
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Link2 size={14} color="#64748b" style={{ position: 'absolute', left: 10, pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-control"
              value={isDataUrl ? '' : value}
              onChange={handleUrlChange}
              placeholder={isDataUrl ? 'Đang dùng ảnh tải từ máy (dán URL mới để thay thế)' : 'Hoặc dán đường dẫn ảnh (https://...)'}
              style={{ paddingLeft: '2rem', fontSize: '0.82rem', background: '#ffffff' }}
            />
          </div>

          {uploadError ? (
            <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>{uploadError}</div>
          ) : (
            <div style={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.4 }}>{helperText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePickerField;
