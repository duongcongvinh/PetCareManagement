import React, { useState, useMemo } from 'react';
import { Star, MessageSquare, Send, Trash2, CheckCircle, Sparkles, Lock } from 'lucide-react';
import { toast, confirmModal } from './ToastNotification';

const RATING_LABELS = {
  1: 'Rất chưa hài lòng',
  2: 'Cần cải thiện',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Tuyệt vời 5★',
};

const QUICK_TAGS_BY_TYPE = {
  SERVICE: ['Thân thiện & tận tâm', 'Đúng khung giờ hẹn', 'Bé sạch thơm mềm mượt', 'Giá niêm yết rõ ràng'],
  PRODUCT: ['Hàng chính hãng date mới', 'Giao hàng nhanh 2H', 'Đóng gói cẩn thận', 'Bé ăn rất thích'],
  GENERAL: ['Bác sĩ & Groomer tận tâm', 'Đặt lịch dễ dàng', 'Không gian sạch sẽ', 'Sẽ quay lại ủng hộ'],
};

const formatReviewDate = (dateVal) => {
  if (!dateVal) return 'Hôm nay';
  try {
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return 'Hôm nay';
  }
};

export default function CustomerReviewSection({
  reviews = [],
  targetType = 'GENERAL',
  targetId = null,
  targetName = 'Trải nghiệm tại Petzera',
  currentUser = null,
  myPets = [],
  services = [],
  products = [],
  onAddReview,
  onDeleteReview,
  onOpenLogin,
  title = 'Đánh Giá Từ Khách Hàng',
  subtitle = 'Chia sẻ trải nghiệm thực tế của bạn và bé cưng tại Petzera',
  defaultFormOpen = false,
}) {
  const [starFilter, setStarFilter] = useState(0); // 0 = ALL, 1..5
  const [showForm, setShowForm] = useState(defaultFormOpen);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [petName, setPetName] = useState(() => (myPets[0] ? `${myPets[0].name}${myPets[0].breed ? ` • ${myPets[0].breed}` : ''}` : ''));
  const [pickedTarget, setPickedTarget] = useState('GENERAL::Trải nghiệm tổng thể tại Petzera');
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    const total = reviews.length;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of reviews) {
      const s = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      sum += s;
      dist[s] = (dist[s] || 0) + 1;
    }
    return {
      total,
      avg: total > 0 ? Number((sum / total).toFixed(1)) : 5.0,
      dist,
    };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    if (starFilter === 0) return reviews;
    return reviews.filter((r) => Math.round(Number(r.rating) || 0) === starFilter);
  }, [reviews, starFilter]);

  const quickTags = QUICK_TAGS_BY_TYPE[targetType] || QUICK_TAGS_BY_TYPE.GENERAL;
  const activeStar = hoverRating || rating;

  const handleAppendTag = (tag) => {
    setComment((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return `${tag}. `;
      if (trimmed.toLowerCase().includes(tag.toLowerCase())) return prev;
      return `${trimmed} ${tag}.`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để gửi đánh giá cho Petzera!', 'Yêu Cầu Đăng Nhập');
      if (onOpenLogin) onOpenLogin();
      return;
    }
    if (comment.trim().length < 5) {
      toast.warning('Vui lòng nhập nội dung nhận xét tối thiểu 5 ký tự!', 'Nội Dung Quá Ngắn');
      return;
    }

    let resolvedType = targetType;
    let resolvedId = targetId;
    let resolvedName = targetName;

    if (targetType === 'GENERAL' && pickedTarget) {
      const [pType, pIdOrName, pName] = pickedTarget.split('::');
      if (pType === 'SERVICE' || pType === 'PRODUCT') {
        resolvedType = pType;
        resolvedId = pIdOrName;
        resolvedName = pName || targetName;
      } else {
        resolvedType = 'GENERAL';
        resolvedId = null;
        resolvedName = pIdOrName || 'Trải nghiệm tổng thể tại Petzera';
      }
    }

    setSubmitting(true);
    try {
      const res = onAddReview
        ? await onAddReview({
            targetType: resolvedType,
            targetId: resolvedId,
            targetName: resolvedName,
            rating,
            comment: comment.trim(),
            petName: petName.trim() || undefined,
          })
        : { success: true };

      if (res && res.error) {
        toast.error(res.error, 'Không Thể Gửi Đánh Giá');
      } else {
        setComment('');
        setRating(5);
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (rev) => {
    const ok = await confirmModal(
      'Bạn có chắc chắn muốn xóa đánh giá này không?',
      'Xác Nhận Xóa Đánh Giá',
      { type: 'danger', confirmText: 'Xóa Đánh Giá', cancelText: 'Hủy' }
    );
    if (ok && onDeleteReview) {
      onDeleteReview(rev.id);
    }
  };

  return (
    <section className="glass-panel" style={{ padding: '1.85rem', borderRadius: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.35rem' }}>
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            CẢM NHẬN &amp; ĐÁNH GIÁ THỰC TẾ
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 3px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="#ea580c" /> {title} ({stats.total})
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>{subtitle}</p>
        </div>

        <button
          type="button"
          className={showForm ? 'btn btn-secondary' : 'btn btn-coral'}
          style={{ borderRadius: '12px', padding: '0.6rem 1.15rem', fontSize: '0.85rem', fontWeight: 800 }}
          onClick={() => {
            if (!currentUser) {
              toast.info('Vui lòng đăng nhập tài khoản khách hàng để gửi đánh giá!', 'Đăng Nhập Để Đánh Giá');
              if (onOpenLogin) onOpenLogin();
              return;
            }
            setShowForm((prev) => !prev);
          }}
        >
          <Star size={15} fill={showForm ? 'none' : '#ffffff'} /> {showForm ? 'Đóng Form Đánh Giá' : 'Viết Đánh Giá Của Bạn'}
        </button>
      </div>

      {/* Rating Summary + Distribution Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)',
          border: '1px solid #fde68a',
          borderRadius: '16px',
          padding: '1.15rem 1.35rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ea580c', lineHeight: 1.1 }}>
            {stats.total > 0 ? stats.avg.toFixed(1) : '5.0'}
            <span style={{ fontSize: '1rem', color: '#9a3412', fontWeight: 700 }}> / 5</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '6px 0' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={18}
                fill={i <= Math.round(stats.avg) ? '#f59e0b' : 'none'}
                color="#f59e0b"
              />
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#78350f', fontWeight: 700 }}>
            {stats.total > 0 ? `Dựa trên ${stats.total} đánh giá xác thực` : 'Hãy là người đầu tiên đánh giá!'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[5, 4, 3, 2, 1].map((s) => {
            const count = stats.dist[s] || 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStarFilter((prev) => (prev === s ? 0 : s))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  padding: '2px 4px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: starFilter === s ? 800 : 600,
                  color: starFilter === s ? '#ea580c' : '#475569',
                }}
                title={`Lọc đánh giá ${s} sao`}
              >
                <span style={{ width: 32, textAlign: 'right', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                  {s} <Star size={11} fill="#f59e0b" color="#f59e0b" />
                </span>
                <div style={{ flex: 1, height: 7, background: '#fed7aa', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '999px', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ width: 28, textAlign: 'left', color: '#64748b' }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Write Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="animate-fade-in"
          style={{
            background: '#f8fafc',
            border: '1.5px solid #fed7aa',
            borderRadius: '18px',
            padding: '1.35rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.9rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={17} color="#ea580c" /> Gửi Đánh Giá Của Bạn
            </h3>
            {currentUser && (
              <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '3px 10px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                ✓ Đang đăng nhập: {currentUser.fullName}
              </span>
            )}
          </div>

          {/* Interactive Star Picker */}
          <div style={{ marginBottom: '0.95rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Mức độ hài lòng của bạn *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starVal)}
                  aria-label={`Đánh giá ${starVal} sao`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '3px',
                    transform: activeStar >= starVal ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.12s ease',
                  }}
                >
                  <Star
                    size={28}
                    fill={activeStar >= starVal ? '#f59e0b' : '#ffffff'}
                    color={activeStar >= starVal ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
              <span style={{ marginLeft: '6px', fontSize: '0.86rem', fontWeight: 800, color: '#ea580c' }}>
                {RATING_LABELS[activeStar]}
              </span>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '0.85rem', marginBottom: '0.85rem' }}>
            {targetType === 'GENERAL' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Bạn muốn đánh giá hạng mục nào?</label>
                <select
                  className="form-control"
                  value={pickedTarget}
                  onChange={(e) => setPickedTarget(e.target.value)}
                >
                  <option value="GENERAL::Trải nghiệm tổng thể tại Petzera">🌟 Trải nghiệm tổng thể tại Petzera</option>
                  {services.length > 0 && (
                    <optgroup label="✂️ Dịch Vụ Spa & Thú Y">
                      {services.map((s) => (
                        <option key={s.id} value={`SERVICE::${s.id}::${s.name}`}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {products.length > 0 && (
                    <optgroup label="🛍️ Sản Phẩm Pet Shop">
                      {products.slice(0, 15).map((p) => (
                        <option key={p.id} value={`PRODUCT::${p.id}::${p.name}`}>
                          {p.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Tên bé cưng (tùy chọn)</label>
              <input
                className="form-control"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="VD: Bé LuLu • Poodle"
              />
            </div>
          </div>

          {/* Quick Tag Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAppendTag(tag)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fdba74',
                  color: '#c2410c',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + {tag}
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginBottom: '0.9rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Nhận xét chi tiết *</label>
            <textarea
              className="form-control"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng dịch vụ, thái độ phục vụ hoặc sản phẩm..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Hủy
            </button>
            <button type="submit" disabled={submitting} className="btn btn-coral" style={{ fontWeight: 800 }}>
              <Send size={15} /> {submitting ? 'Đang Gửi...' : 'Gửi Đánh Giá'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Pills */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
          {[
            { val: 0, label: `Tất cả (${stats.total})` },
            { val: 5, label: `5 ★ (${stats.dist[5]})` },
            { val: 4, label: `4 ★ (${stats.dist[4]})` },
            { val: 3, label: `3 ★ (${stats.dist[3]})` },
            { val: 2, label: `2 ★ (${stats.dist[2]})` },
            { val: 1, label: `1 ★ (${stats.dist[1]})` },
          ].map((f) => (
            <button
              key={f.val}
              type="button"
              onClick={() => setStarFilter(f.val)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: starFilter === f.val ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                background: starFilter === f.val ? '#fff7ed' : '#ffffff',
                color: starFilter === f.val ? '#ea580c' : '#475569',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Review List */}
      {visibleReviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.88rem' }}>
          {reviews.length === 0
            ? 'Chưa có đánh giá nào cho mục này. Hãy bấm "Viết Đánh Giá Của Bạn" để chia sẻ trải nghiệm nhé!'
            : `Chưa có đánh giá ${starFilter} sao nào.`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {visibleReviews.map((rev) => {
            const isOwn = currentUser && (rev.customerId === currentUser.id || rev.customerName === currentUser.fullName);
            const initial = String(rev.customerName || 'K').trim().charAt(0).toUpperCase();
            return (
              <div
                key={rev.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f59e0b 100%)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {initial}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{rev.customerName}</strong>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '1px 7px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle size={10} /> Đã trải nghiệm
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                        {rev.petName ? <span>{rev.petName} • </span> : null}
                        <span>{formatReviewDate(rev.createdAt)}</span>
                        {targetType === 'GENERAL' && rev.targetName && (
                          <span style={{ color: '#ea580c', fontWeight: 700 }}> • {rev.targetName}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= (Number(rev.rating) || 5) ? '#f59e0b' : 'none'}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                    {isOwn && onDeleteReview && (
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(rev)}
                        title="Xóa đánh giá của bạn"
                        style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '3px 7px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {rev.comment}
                </p>

                {rev.staffReply && (
                  <div
                    style={{
                      background: '#f0f9ff',
                      borderLeft: '3px solid #0284c7',
                      borderRadius: '0 10px 10px 0',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.82rem',
                      color: '#0c4a6e',
                    }}
                  >
                    <strong style={{ color: '#0369a1', display: 'block', marginBottom: '2px', fontSize: '0.76rem' }}>
                      🐾 Phản hồi từ Petzera Care:
                    </strong>
                    {rev.staffReply}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!currentUser && (
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={13} /> Bạn cần đăng nhập tài khoản khách hàng để gửi đánh giá mới.
        </div>
      )}
    </section>
  );
}
