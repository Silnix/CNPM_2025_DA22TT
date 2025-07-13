const express = require('express');
const router = express.Router();
const TacGia = require('../models/TacGiaModel');

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Thêm tác giả mới
 *     tags:
 *       - Author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_tac_gia:
 *                 type: string
 *               ten_tac_gia:
 *                 type: string
 *               ngay_sinh:
 *                 type: string
 *               quoc_gia:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm tác giả thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
// CRUD Tác giả
router.post('/', async (req, res) => {
  try {
    const author = new TacGia(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm tác giả', error: err.message });
  }
});

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Lấy danh sách tất cả tác giả
 *     tags:
 *       - Author
 *     responses:
 *       200:
 *         description: Danh sách tác giả
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const authors = await TacGia.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tác giả', error: err.message });
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Lấy thông tin tác giả theo ID
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tác giả
 *     responses:
 *       200:
 *         description: Thông tin tác giả
 *       404:
 *         description: Không tìm thấy tác giả
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', async (req, res) => {
  try {
    const author = await TacGia.findOne({ ID_tac_gia: req.params.id });
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy tác giả', error: err.message });
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Cập nhật thông tin tác giả
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tác giả
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_tac_gia:
 *                 type: string
 *               ngay_sinh:
 *                 type: string
 *               quoc_gia:
 *                 type: string
 *               mo_ta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy tác giả
 *       400:
 *         description: Lỗi dữ liệu
 */
router.put('/:id', async (req, res) => {
  try {
    const author = await TacGia.findOneAndUpdate({ ID_tac_gia: req.params.id }, req.body, { new: true });
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    res.json(author);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật tác giả', error: err.message });
  }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Xóa tác giả
 *     tags:
 *       - Author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tác giả
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy tác giả
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', async (req, res) => {
  try {
    const author = await TacGia.findOneAndDelete({ ID_tac_gia: req.params.id });
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    res.json({ message: 'Đã xóa tác giả thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa tác giả', error: err.message });
  }
});

module.exports = router; 