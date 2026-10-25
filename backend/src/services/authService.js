const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const registerUser = async ({ email, password, fullName, phone, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email này đã tồn tại trên hệ thống.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role && ['CUSTOMER', 'CARE_STAFF', 'WAREHOUSE_STAFF', 'ADMIN'].includes(role)
    ? role
    : 'CUSTOMER';

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      phone: phone || null,
      role: userRole,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
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

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Email hoặc mật khẩu không chính xác.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không chính xác.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET || 'super_secret_petcare_jwt_key_2026',
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
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
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return users.map(u => ({
    ...u,
    status: 'ACTIVE',
    createdAt: u.createdAt ? u.createdAt.toISOString().split('T')[0] : '2026-01-01'
  }));
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
};
