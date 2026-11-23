const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../src/middleware/auth');
const { validatePortalAccess, validateStrongPassword } = require('../src/services/authService');

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
