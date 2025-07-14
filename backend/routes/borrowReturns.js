const express = require('express');
const router = express.Router();
const MuonTra = require('../models/MuonTraModel');

// Lấy danh sách phiếu trả
router.get('/', async (req, res) => {
  try {
    const returns = await MuonTra.find();
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Tạo phiếu trả mới
router.post('/', async (req, res) => {
  try {
    const newReturn = new MuonTra(req.body);
    await newReturn.save();
    res.status(201).json({ message: 'Tạo phiếu trả thành công!', return: newReturn });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Cập nhật phiếu trả
router.put('/:id', async (req, res) => {
  try {
    const updated = await MuonTra.findOneAndUpdate({ ID_muon_tra: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy phiếu trả' });
    res.json({ message: 'Cập nhật thành công', return: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Xóa phiếu trả
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MuonTra.findOneAndDelete({ ID_muon_tra: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy phiếu trả' });
    res.json({ message: 'Xóa thành công', return: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router; 