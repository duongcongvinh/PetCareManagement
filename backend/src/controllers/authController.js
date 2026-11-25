const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { identifier, email, password, confirmPassword, fullName, phone } = req.body;
    const accountId = (identifier || email || phone || '').trim();

    if (!accountId || !password || !fullName) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Họ tên, Email hoặc Số điện thoại và Mật khẩu!' });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu nhập lại không khớp!' });
    }

    // Đăng ký công khai ngoài trang khách luôn ép vai trò CUSTOMER và yêu cầu mật khẩu mạnh
    const result = await authService.registerUser({
      identifier: accountId,
      email,
      password,
      fullName,
      phone,
      role: 'CUSTOMER',
      requireStrongPassword: true,
    });
    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi server khi đăng ký tài khoản.' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, email, phone, password, portal } = req.body;
    const accountId = (identifier || email || phone || '').trim();

    if (!accountId || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập Email hoặc Số điện thoại và Mật khẩu!' });
    }

    const result = await authService.loginUser({ identifier: accountId, password, portal });
    return res.json({
      message: 'Đăng nhập thành công!',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(error.statusCode || 401).json({ message: error.message || 'Lỗi server khi đăng nhập.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    return res.json(users);
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ message: 'Lỗi server khi tải danh sách người dùng.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { identifier, email, password, fullName, phone, role } = req.body;
    const accountId = (identifier || email || phone || '').trim();
    if (!accountId || !password || !fullName) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Họ tên, Email hoặc Số điện thoại và Mật khẩu!' });
    }
    const result = await authService.registerUser({ identifier: accountId, email, password, fullName, phone, role });
    return res.status(201).json({
      message: 'Tạo tài khoản người dùng thành công!',
      user: result.user,
    });
  } catch (error) {
    console.error('createUser error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi server khi tạo người dùng.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, password } = req.body;
    const updated = await authService.updateUserProfile(req.user.id, { fullName, phone, address, password });
    return res.json({ message: 'Cập nhật thông tin thành công!', user: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật thông tin.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, role, status, password } = req.body;
    const updated = await authService.updateUserById(id, { fullName, phone, role, status, password });
    return res.json({ message: 'Cập nhật tài khoản thành công!', user: updated });
  } catch (error) {
    console.error('updateUser error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi server khi cập nhật tài khoản.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await authService.deleteUserById(id);
    return res.json({ message: 'Xóa tài khoản thành công!' });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(400).json({ message: error.message || 'Lỗi server khi xóa tài khoản.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { identifier, email, phone, portal } = req.body;
    const result = await authService.requestPasswordReset({
      identifier,
      email,
      phone,
      portal: portal || 'CUSTOMER',
    });
    return res.json(result);
  } catch (error) {
    console.error('forgotPassword error:', error);
    return res.status(400).json({ message: error.message || 'Không thể gửi yêu cầu khôi phục mật khẩu.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { identifier, email, phone, otp, newPassword, confirmPassword, portal } = req.body;
    const result = await authService.resetPasswordWithOtp({
      identifier,
      email,
      phone,
      otp,
      newPassword,
      confirmPassword,
      portal: portal || 'CUSTOMER',
    });
    return res.json(result);
  } catch (error) {
    console.error('resetPassword error:', error);
    return res.status(400).json({ message: error.message || 'Không thể đặt lại mật khẩu.' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
};
