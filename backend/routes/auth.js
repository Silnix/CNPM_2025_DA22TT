const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const { generateNewId } = require('../utils/helpers');

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Thiếu thông tin
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu
 */
// API đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
  }
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
    }
    // Đăng nhập thành công
    res.json({ 
      message: 'Đăng nhập thành công!', 
      loai: user.loai,
      user: {
        ID: user.ID,
        username: user.username,
        ho_ten: user.ho_ten,
        email: user.email,
        dia_chi: user.dia_chi,
        loai: user.loai
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               ho_ten:
 *                 type: string
 *               dia_chi:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thiếu thông tin
 *       409:
 *         description: Username hoặc email đã tồn tại
 */
// API đăng ký
router.post('/register', async (req, res) => {
  try {
    const { username, password, ho_ten, dia_chi, email } = req.body;
    if (!username || !password || !ho_ten || !dia_chi || !email) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }
    // Kiểm tra username hoặc email đã tồn tại
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username hoặc email đã tồn tại!' });
    }
    // Lấy user cuối cùng để sinh ID mới
    const lastUser = await User.findOne().sort({ ID: -1 });
    const newId = generateNewId('U', lastUser);
    
    const newUser = new User({
      ID: newId,
      username,
      password,
      ho_ten,
      dia_chi,
      email,
      loai: 2, // Mặc định là người dùng thường (loại 2)
    });
    await newUser.save();
    console.log('Đã lưu user mới vào database:', newUser);
    res.status(201).json({ message: 'Đăng ký thành công!', user: newUser });
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error: err.message });
  }
});

module.exports = router; 