const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Email, Mật khẩu và Họ tên!' });
    }

    const result = await authService.registerUser({ email, password, fullName, phone, role });
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập Email và Mật khẩu!' });
    }

    const result = await authService.loginUser({ email, password });
    return res.json({
      message: 'Đăng nhập thành công!',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ message: error.message || 'Lỗi server khi đăng nhập.' });
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
    const { email, password, fullName, phone, role } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Email, Mật khẩu và Họ tên!' });
    }
    const result = await authService.registerUser({ email, password, fullName, phone, role });
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
    const { fullName, phone, password } = req.body;
    const updated = await authService.updateUserProfile(req.user.id, { fullName, phone, password });
    return res.json({ message: 'Cập nhật thông tin thành công!', user: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật thông tin.' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUsers,
  createUser,
  updateProfile,
};
