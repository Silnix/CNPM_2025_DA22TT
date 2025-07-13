const mongoose = require('mongoose');

const phieuMuonSchema = new mongoose.Schema({
  ID_phieu: { type: String, required: true, unique: true },
  ID_nguoi_dung: { type: String, required: true },
  ngay_muon: { type: String, required: true },
  ngay_tra_du_kien: { type: String, required: true },
  trang_thai: { type: String, default: 'Đang mượn' },
  sach_muon: { type: Object, required: true }
}, {
  collection: 'PHIEUMUON'
});

module.exports = mongoose.model('PhieuMuon', phieuMuonSchema); 