const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       500:
 *         description: Lỗi server
 */
// API kiểm tra danh sách users (để debug)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Không trả về password
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách users', error: err.message });
  }
});

/**
 * @swagger
 * /api/users/readers:
 *   get:
 *     summary: Lấy danh sách độc giả (người dùng loại 2)
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Danh sách độc giả
 *       500:
 *         description: Lỗi server
 */
// API lấy danh sách users loại 2 (độc giả)
router.get('/readers', async (req, res) => {
  try {
    const readers = await User.find({ loai: 2 }).select('-password');
    res.json({ count: readers.length, users: readers });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách độc giả', error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
// API lấy thông tin user theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ ID: req.params.id }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ho_ten:
 *                 type: string
 *               dia_chi:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
// API cập nhật thông tin user
router.put('/:id', async (req, res) => {
  try {
    const { ho_ten, dia_chi, email } = req.body;
    const user = await User.findOneAndUpdate(
      { ID: req.params.id },
      { ho_ten, dia_chi, email },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.json({ message: 'Cập nhật thành công!', user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
// API xóa user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ ID: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({ message: 'Xóa người dùng thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
  }
});

module.exports = router; 