const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../src/middleware/auth');
const {
  validatePortalAccess,
  validateStrongPassword,
  validatePasswordForRegistration,
  maskIdentifier,
  createOtpEntry,
  verifyAndConsumeOtp,
} = require('../src/services/authService');

const SECRET = process.env.JWT_SECRET || 'super_secret_petcare_jwt_key_2026';

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('Từ chối (401) khi thiếu Authorization token', () => {
  const req = { headers: {} };
  const res = createMockRes();
  let nextCalled = false;

  authenticateToken(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('Từ chối (403) khi token không hợp lệ', () => {
  const req = { headers: { authorization: 'Bearer invalid.token.here' } };
  const res = createMockRes();
  let nextCalled = false;

  authenticateToken(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('Cho phép đi tiếp và gắn req.user khi token hợp lệ', () => {
  const token = jwt.sign({ userId: 'u1', role: 'ADMIN' }, SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createMockRes();
  let nextCalled = false;

  authenticateToken(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.user.role, 'ADMIN');
});

test('RBAC: Chặn (403) khi CUSTOMER truy cập quyền ADMIN', () => {
  const req = { user: { role: 'CUSTOMER' } };
  const res = createMockRes();
  let nextCalled = false;

  authorizeRoles('ADMIN')(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('RBAC: Cho phép WAREHOUSE_STAFF truy cập chức năng kho', () => {
  const req = { user: { role: 'WAREHOUSE_STAFF' } };
  const res = createMockRes();
  let nextCalled = false;

  authorizeRoles('ADMIN', 'WAREHOUSE_STAFF')(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
});

test('Portal Isolation: Chặn ADMIN và nhân viên đăng nhập tại Cổng Khách Hàng (401 chung, không lộ role)', () => {
  for (const role of ['ADMIN', 'CARE_STAFF', 'WAREHOUSE_STAFF']) {
    assert.throws(
      () => validatePortalAccess(role, 'CUSTOMER'),
      (err) => err && err.statusCode === 401 && err.message === 'Email/Số điện thoại hoặc mật khẩu không chính xác.'
    );
  }
  assert.doesNotThrow(() => validatePortalAccess('CUSTOMER', 'CUSTOMER'));
});

test('Portal Isolation: Chặn CUSTOMER đăng nhập tại Cổng Nội Bộ (401 chung, không lộ thông tin)', () => {
  assert.throws(
    () => validatePortalAccess('CUSTOMER', 'STAFF'),
    (err) => err && err.statusCode === 401 && err.message === 'Email/Số điện thoại hoặc mật khẩu không chính xác.'
  );
  for (const role of ['ADMIN', 'CARE_STAFF', 'WAREHOUSE_STAFF']) {
    assert.doesNotThrow(() => validatePortalAccess(role, 'STAFF'));
  }
});

test('Password Strength: Chặn mật khẩu yếu khi đăng ký (dưới 8 ký tự, thiếu hoa/thường/số/ký tự đặc biệt)', () => {
  assert.throws(() => validateStrongPassword('Ab1!567'), /ít nhất 8 ký tự/i);
  assert.throws(() => validateStrongPassword('abcdef1!'), /chữ hoa/i);
  assert.throws(() => validateStrongPassword('ABCDEF1!'), /chữ thường/i);
  assert.throws(() => validateStrongPassword('Abcdefg!'), /chữ số/i);
  assert.throws(() => validateStrongPassword('Abcdef12'), /ký tự đặc biệt/i);
  assert.doesNotThrow(() => validateStrongPassword('Petzera@1'));
  assert.doesNotThrow(() => validateStrongPassword('Abcd123!'));
});

test('Admin tạo tài khoản nội bộ (Nhân viên/Quản lý kho/Admin) không bị ràng buộc độ dài 8 ký tự', () => {
  assert.throws(() => validatePasswordForRegistration('', false), /nhập mật khẩu/i);
  assert.throws(() => validatePasswordForRegistration('   ', false), /nhập mật khẩu/i);
  assert.doesNotThrow(() => validatePasswordForRegistration('123456', false));
  assert.doesNotThrow(() => validatePasswordForRegistration('1234', false));
  assert.doesNotThrow(() => validatePasswordForRegistration('staff', false));
  // Đăng ký công khai ngoài cổng khách hàng vẫn giữ ràng buộc mật khẩu mạnh
  assert.throws(() => validatePasswordForRegistration('123456', true), /ít nhất 8 ký tự/i);
  assert.doesNotThrow(() => validatePasswordForRegistration('Petzera@1', true));
});

test('Forgot Password OTP: Tạo mã 6 số, xác thực 1 lần, khóa sau 5 lần sai và chặn mã hết hạn', () => {
  assert.equal(maskIdentifier({ type: 'email', value: 'khachhang@gmail.com' }), 'kh***@gmail.com');
  assert.equal(maskIdentifier({ type: 'phone', value: '0934567890' }), '093****890');

  const key = 'TEST_CUSTOMER:user-1';
  const now = 1_700_000_000_000;
  const entry = createOtpEntry(key, 'user-1', now);
  assert.match(entry.otp, /^\d{6}$/);

  // Nhập sai OTP -> báo còn số lần thử
  assert.throws(() => verifyAndConsumeOtp(key, '000000', now + 1000), /còn 4 lần thử/i);

  // Nhập đúng OTP -> thành công & hủy mã (dùng 1 lần)
  const consumed = verifyAndConsumeOtp(key, entry.otp, now + 2000);
  assert.equal(consumed.userId, 'user-1');
  assert.throws(() => verifyAndConsumeOtp(key, entry.otp, now + 3000), /không tồn tại hoặc đã được sử dụng/i);

  // Mã hết hạn quá 5 phút -> bị chặn
  const expEntry = createOtpEntry(key, 'user-1', now);
  assert.throws(() => verifyAndConsumeOtp(key, expEntry.otp, now + 6 * 60 * 1000), /hết hạn/i);

  // Nhập sai quá 5 lần -> tự hủy mã
  createOtpEntry(key, 'user-1', now);
  for (let i = 0; i < 4; i += 1) {
    assert.throws(() => verifyAndConsumeOtp(key, '999999', now + 1000), /không chính xác/i);
  }
  assert.throws(() => verifyAndConsumeOtp(key, '999999', now + 1000), /quá 5 lần/i);
});
