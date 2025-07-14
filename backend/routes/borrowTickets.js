const express = require('express');
const router = express.Router();
const PhieuMuonSach = require('../models/PhieuMuonSachModel');

// Lấy danh sách phiếu mượn
router.get('/', async (req, res) => {
  try {
    const tickets = await PhieuMuonSach.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Tạo phiếu mượn mới
router.post('/', async (req, res) => {
  try {
    const newTicket = new PhieuMuonSach(req.body);
    await newTicket.save();
    res.status(201).json({ message: 'Tạo phiếu mượn thành công!', ticket: newTicket });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Cập nhật phiếu mượn
router.put('/:id', async (req, res) => {
  try {
    const updated = await PhieuMuonSach.findOneAndUpdate({ ID_phieu: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json({ message: 'Cập nhật thành công', ticket: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Xóa phiếu mượn
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PhieuMuonSach.findOneAndDelete({ ID_phieu: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    res.json({ message: 'Xóa thành công', ticket: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router; 