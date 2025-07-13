const express = require('express');
const router = express.Router();
const MuonTra = require('../models/MuonTraModel');

/**
 * @swagger
 * /api/borrow-returns:
 *   post:
 *     summary: Thêm mượn trả mới
 *     tags:
 *       - Return
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_muon_tra:
 *                 type: string
 *               ID_phieu:
 *                 type: string
 *               ID_nguoi_dung:
 *                 type: string
 *               ID_sach:
 *                 type: string
 *               ten_sach:
 *                 type: string
 *               ngay_muon:
 *                 type: string
 *               ngay_tra_du_kien:
 *                 type: string
 *               ngay_tra:
 *                 type: string
 *               trang_thai:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm mượn trả thành công
 *       400:
 *         description: Lỗi dữ liệu
 */
// CRUD Mượn trả
router.post('/', async (req, res) => {
  try {
    const borrowReturn = new MuonTra(req.body);
    await borrowReturn.save();
    res.status(201).json(borrowReturn);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm mượn trả', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-returns:
 *   get:
 *     summary: Lấy danh sách tất cả mượn trả
 *     tags:
 *       - Return
 *     responses:
 *       200:
 *         description: Danh sách mượn trả
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const borrowReturns = await MuonTra.find();
    res.json(borrowReturns);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách mượn trả', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-returns/{id}:
 *   get:
 *     summary: Lấy thông tin mượn trả theo ID
 *     tags:
 *       - Return
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mượn trả
 *     responses:
 *       200:
 *         description: Thông tin mượn trả
 *       404:
 *         description: Không tìm thấy mượn trả
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', async (req, res) => {
  try {
    const borrowReturn = await MuonTra.findOne({ ID_muon_tra: req.params.id });
    if (!borrowReturn) return res.status(404).json({ message: 'Không tìm thấy mượn trả' });
    res.json(borrowReturn);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy mượn trả', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-returns/{id}:
 *   put:
 *     summary: Cập nhật thông tin mượn trả
 *     tags:
 *       - Return
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mượn trả
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ngay_tra:
 *                 type: string
 *               trang_thai:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy mượn trả
 *       400:
 *         description: Lỗi dữ liệu
 */
router.put('/:id', async (req, res) => {
  try {
    const borrowReturn = await MuonTra.findOneAndUpdate({ ID_muon_tra: req.params.id }, req.body, { new: true });
    if (!borrowReturn) return res.status(404).json({ message: 'Không tìm thấy mượn trả' });
    res.json(borrowReturn);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật mượn trả', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-returns/{id}:
 *   delete:
 *     summary: Xóa mượn trả
 *     tags:
 *       - Return
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mượn trả
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy mượn trả
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', async (req, res) => {
  try {
    const borrowReturn = await MuonTra.findOneAndDelete({ ID_muon_tra: req.params.id });
    if (!borrowReturn) return res.status(404).json({ message: 'Không tìm thấy mượn trả' });
    res.json({ message: 'Đã xóa mượn trả thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa mượn trả', error: err.message });
  }
});

module.exports = router; 