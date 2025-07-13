const express = require('express');
const router = express.Router();
const PhieuMuonSach = require('../models/PhieuMuonSachModel');
const MuonTra = require('../models/MuonTraModel');
const Book = require('../models/BookModel');
const { generateNewId } = require('../utils/helpers');

/**
 * @swagger
 * /api/borrow-tickets:
 *   post:
 *     summary: Tạo phiếu mượn sách mới
 *     tags:
 *       - Borrow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_sach:
 *                 type: string
 *               ID_nguoi_dung:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo phiếu mượn thành công
 *       400:
 *         description: Sách đã hết hoặc lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy sách
 */
// CRUD Phiếu mượn sách
router.post('/', async (req, res) => {
  try {
    const { ID_sach, ID_nguoi_dung } = req.body;
    const book = await Book.findOne({ ID: ID_sach });

    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    if (book.so_luong <= 0) {
      return res.status(400).json({ message: 'Sách đã hết, không thể mượn!' });
    }

    // Trừ số lượng sách
    book.so_luong -= 1;
    await book.save();

    // Sinh ID_phieu mới
    const lastTicket = await PhieuMuonSach.findOne().sort({ ID_phieu: -1 });
    const newId = generateNewId('PM', lastTicket);

    // Tính ngày trả dự kiến (2 tuần sau ngày mượn)
    const ngayMuon = new Date();
    const ngayTraDuKien = new Date(ngayMuon);
    ngayTraDuKien.setDate(ngayMuon.getDate() + 14); // Thêm 14 ngày (2 tuần)

    // Lưu phiếu mượn
    const ticket = new PhieuMuonSach({
      ID_phieu: newId,
      ID_nguoi_dung,
      ngay_muon: ngayMuon.toISOString().slice(0,10),
      ngay_tra_du_kien: ngayTraDuKien.toISOString().slice(0,10),
      trang_thai: 'Đang mượn',
      sach_muon: [ID_sach]
    });
    await ticket.save();

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi thêm phiếu mượn', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-tickets:
 *   get:
 *     summary: Lấy danh sách tất cả phiếu mượn
 *     tags:
 *       - Borrow
 *     responses:
 *       200:
 *         description: Danh sách phiếu mượn
 *       500:
 *         description: Lỗi server
 */
router.get('/', async (req, res) => {
  try {
    const tickets = await PhieuMuonSach.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu mượn', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-tickets/{id}:
 *   get:
 *     summary: Lấy thông tin phiếu mượn theo ID
 *     tags:
 *       - Borrow
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID phiếu mượn
 *     responses:
 *       200:
 *         description: Thông tin phiếu mượn
 *       404:
 *         description: Không tìm thấy phiếu mượn
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', async (req, res) => {
  try {
    const ticket = await PhieuMuonSach.findOne({ ID_phieu: req.params.id });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy phiếu mượn', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-tickets/{id}:
 *   put:
 *     summary: Cập nhật phiếu mượn (trả sách)
 *     tags:
 *       - Borrow
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID phiếu mượn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trang_thai:
 *                 type: string
 *                 enum: [Đang mượn, Đã trả]
 *               ngay_tra:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy phiếu mượn
 *       400:
 *         description: Lỗi dữ liệu
 */
router.put('/:id', async (req, res) => {
  try {
    // Cập nhật phiếu mượn (ví dụ: cập nhật trạng thái đã trả, ngày trả...)
    const ticket = await PhieuMuonSach.findOneAndUpdate({ ID_phieu: req.params.id }, req.body, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

    // Nếu trạng thái cập nhật là "Đã trả" thì lưu vào bảng MUON_TRA và tăng số lượng sách
    if (req.body.trang_thai === 'Đã trả') {
      // Tăng số lượng sách khi trả
      for (const sachId of ticket.sach_muon) {
        const book = await Book.findOne({ ID: sachId });
        if (book) {
          book.so_luong += 1;
          await book.save();
        }
      }

      // Sinh ID_muon_tra mới
      const lastMuonTra = await MuonTra.findOne().sort({ ID_muon_tra: -1 });
      const newId = generateNewId('MT', lastMuonTra);

      // Lưu từng cuốn sách vào bảng MUON_TRA
      for (const sachId of ticket.sach_muon) {
        const book = await Book.findOne({ ID: sachId });
        const muonTra = new MuonTra({
          ID_muon_tra: newId,
          ID_phieu: ticket.ID_phieu,
          ID_nguoi_dung: ticket.ID_nguoi_dung,
          ID_sach: sachId,
          ten_sach: book ? book.ten_sach : '',
          ngay_muon: ticket.ngay_muon,
          ngay_tra_du_kien: ticket.ngay_tra_du_kien,
          ngay_tra: req.body.ngay_tra || new Date().toISOString().slice(0,10),
          trang_thai: 'Đã trả'
        });
        await muonTra.save();
      }
    }

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật phiếu mượn', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-tickets/{id}:
 *   delete:
 *     summary: Xóa phiếu mượn
 *     tags:
 *       - Borrow
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID phiếu mượn
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy phiếu mượn
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await PhieuMuonSach.findOneAndDelete({ ID_phieu: req.params.id });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json({ message: 'Đã xóa phiếu mượn thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa phiếu mượn', error: err.message });
  }
});

/**
 * @swagger
 * /api/borrow-tickets/user/{id}:
 *   get:
 *     summary: Lấy danh sách phiếu mượn theo người dùng
 *     tags:
 *       - Borrow
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Danh sách phiếu mượn của người dùng
 *       500:
 *         description: Lỗi server
 */
router.get('/user/:id', async (req, res) => {
  try {
    const tickets = await PhieuMuonSach.find({ ID_nguoi_dung: req.params.id });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy phiếu mượn theo user', error: err.message });
  }
});

module.exports = router; 