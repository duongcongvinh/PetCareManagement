const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+?84)[0-9]{8,10}$/;
const STAFF_ROLES = ['ADMIN', 'CARE_STAFF', 'WAREHOUSE_STAFF'];

const GENERIC_LOGIN_ERROR = 'Email/Số điện thoại hoặc mật khẩu không chính xác.';

const validatePortalAccess = (role, portal) => {
  if (!portal) return;
  const normalizedPortal = String(portal).toUpperCase();
  if (normalizedPortal === 'CUSTOMER' && role !== 'CUSTOMER') {
    const err = new Error(GENERIC_LOGIN_ERROR);
    err.statusCode = 401;
    throw err;
  }
  if (normalizedPortal === 'STAFF' && !STAFF_ROLES.includes(role)) {
    const err = new Error(GENERIC_LOGIN_ERROR);
    err.statusCode = 401;
    throw err;
  }
};

const parseAccountIdentifier = (rawInput) => {
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

const registerUser = async ({ identifier, email, password, fullName, phone, role }) => {
  const parsed = parseAccountIdentifier(identifier || email || phone);
  if (parsed.type === 'invalid') {
    throw new Error('Vui lòng nhập đúng định dạng Email hoặc Số điện thoại (VD: 0901234567).');
  }

  if (!password || String(password).length < 8) {
    throw new Error('Mật khẩu đăng ký phải có ít nhất 8 ký tự.');
  }

  const storedEmail = parsed.value;
  const storedPhone = parsed.type === 'phone' ? parsed.value : (phone ? phone.trim() : null);

  const existingUser = await prisma.user.findFirst({
    where: parsed.type === 'phone'
      ? { OR: [{ email: storedEmail }, { phone: storedPhone }] }
      : { email: storedEmail },
  });
  if (existingUser) {
    throw new Error(
      parsed.type === 'phone'
        ? 'Số điện thoại này đã tồn tại trên hệ thống.'
        : 'Email này đã tồn tại trên hệ thống.'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role && ['CUSTOMER', 'CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(role)
    ? role
    : 'CUSTOMER';

  const newUser = await prisma.user.create({
    data: {
      email: storedEmail,
      password: hashedPassword,
      fullName: fullName.trim(),
      phone: storedPhone,
      role: userRole,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, fullName: newUser.fullName },
    process.env.JWT_SECRET || 'super_secret_petcare_jwt_key_2026',
    { expiresIn: '7d' }
  );

  return { token, user: newUser };
};

const loginUser = async ({ identifier, email, password, portal }) => {
  const raw = (identifier || email || '').trim();
  const cleanedPhone = raw.replace(/[\s.-]/g, '');
  const normalizedPhone = cleanedPhone.startsWith('+84')
    ? '0' + cleanedPhone.slice(3)
    : cleanedPhone.startsWith('84') && cleanedPhone.length >= 10
      ? '0' + cleanedPhone.slice(2)
      : cleanedPhone;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: raw.toLowerCase() },
        { email: raw },
        { email: normalizedPhone },
        { phone: raw },
        { phone: normalizedPhone },
      ],
    },
  });

  if (!user) {
    throw new Error('Email/Số điện thoại hoặc mật khẩu không chính xác.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email/Số điện thoại hoặc mật khẩu không chính xác.');
  }

  // Tách biệt chặt chẽ Cổng Khách Hàng (CUSTOMER) và Cổng Nội Bộ (STAFF/ADMIN) — không lộ role/trạng thái
  validatePortalAccess(user.role, portal);

  if (user.status === 'LOCKED') {
    const err = new Error('Tài khoản này đang bị khóa. Vui lòng liên hệ Admin.');
    err.statusCode = 403;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET || 'super_secret_petcare_jwt_key_2026',
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, status: userWithoutPassword.status || 'ACTIVE' } };
};

const getUserProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      pets: true,
    },
  });
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return users.map(u => ({
    ...u,
    status: u.status || 'ACTIVE',
    createdAt: u.createdAt ? u.createdAt.toISOString().split('T')[0] : '2026-01-01'
  }));
};

const updateUserProfile = async (userId, { fullName, phone, password }) => {
  const data = {};
  if (fullName) data.fullName = fullName;
  if (phone) data.phone = phone;
  if (password) data.password = await bcrypt.hash(password, 10);

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

const updateUserById = async (userId, { fullName, phone, role, status, password }) => {
  const data = {};
  if (fullName !== undefined && fullName.trim()) data.fullName = fullName.trim();
  if (phone !== undefined) data.phone = phone ? phone.trim() : null;
  if (role && ['CUSTOMER', 'CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(role)) {
    data.role = role;
  }
  if (status && ['ACTIVE', 'LOCKED'].includes(status)) {
    data.status = status;
  }
  if (password && password.trim()) {
    data.password = await bcrypt.hash(password.trim(), 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return {
    ...updated,
    status: updated.status || 'ACTIVE',
    createdAt: updated.createdAt ? updated.createdAt.toISOString().split('T')[0] : '2026-01-01',
  };
};

const deleteUserById = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  validatePortalAccess,
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  updateUserById,
  deleteUserById,
};
