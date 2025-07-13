const express = require('express');
const router = express.Router();
const DanhMuc = require('../models/DanhMucModel');

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Thêm danh mục mới
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_danh_muc:
 *                 type: string
 *               ten_danh_muc:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm danh mục thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
// CRUD Danh mục
router.post('/', async (req, res) => {
  try {
    const category = new DanhMuc(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm danh mục', error: err.message });
  }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const categories = await DanhMuc.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục', error: err.message });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await DanhMuc.findOne({ ID_danh_muc: req.params.id });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh mục', error: err.message });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật thông tin danh mục
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_danh_muc:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       400:
 *         description: Lỗi dữ liệu
 */
router.put('/:id', async (req, res) => {
  try {
    const category = await DanhMuc.findOneAndUpdate({ ID_danh_muc: req.params.id }, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật danh mục', error: err.message });
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', async (req, res) => {
  try {
    const category = await DanhMuc.findOneAndDelete({ ID_danh_muc: req.params.id });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: err.message });
  }
});

module.exports = router; 