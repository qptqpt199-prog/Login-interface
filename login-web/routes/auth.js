const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// ĐĂNG KÝ
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải từ 6 ký tự trở lên.' });
    }

    const existed = await User.findOne({ $or: [{ username }, { email }] });
    if (existed) {
      return res.status(400).json({ success: false, message: 'Username hoặc email đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // mã hoá mật khẩu
    const newUser = await User.create({ username, email, password: hashedPassword });

    req.session.userId = newUser._id;
    req.session.username = newUser.username;

    return res.json({ success: true, message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
});

// ĐĂNG NHẬP
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Sai mật khẩu.' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    return res.json({ success: true, message: 'Đăng nhập thành công!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
});

// ĐĂNG XUẤT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP
router.get('/me', (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, username: req.session.username });
});

module.exports = router;
