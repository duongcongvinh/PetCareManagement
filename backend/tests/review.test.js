const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DEFAULT_REVIEWS,
  validateReviewPayload,
  computeReviewStats,
} = require('../src/services/reviewService');

test('validateReviewPayload chấp nhận đánh giá hợp lệ và chặn sao/nội dung sai chuẩn', () => {
  const ok = validateReviewPayload({
    targetType: 'service',
    targetName: 'Spa Grooming Trọn Gói',
    rating: 5,
    comment: 'Dịch vụ rất tốt, bé thơm mượt!',
  });
  assert.equal(ok.targetType, 'SERVICE');
  assert.equal(ok.rating, 5);

  assert.throws(() => validateReviewPayload({ targetType: 'INVALID', rating: 5, comment: 'Rất tốt luôn!' }), /không hợp lệ/i);
  assert.throws(() => validateReviewPayload({ targetType: 'SERVICE', rating: 0, comment: 'Rất tốt luôn!' }), /từ 1 đến 5/i);
  assert.throws(() => validateReviewPayload({ targetType: 'PRODUCT', rating: 6, comment: 'Rất tốt luôn!' }), /từ 1 đến 5/i);
  assert.throws(() => validateReviewPayload({ targetType: 'GENERAL', rating: 5, comment: 'Tốt' }), /tối thiểu 5 ký tự/i);
});

test('computeReviewStats tính đúng điểm trung bình và phân bố số sao', () => {
  const empty = computeReviewStats([]);
  assert.equal(empty.averageRating, 0);
  assert.equal(empty.totalCount, 0);

  const stats = computeReviewStats(DEFAULT_REVIEWS);
  assert.equal(stats.totalCount, 12);
  assert.equal(stats.averageRating, 4.8);
  assert.equal(stats.distribution[5], 10);
  assert.equal(stats.distribution[4], 2);
  assert.equal(stats.distribution[1], 0);
});
