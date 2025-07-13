const mongoose = require('mongoose');

const phieuMuonSachSchema = new mongoose.Schema({
  ID_phieu: { type: String, required: true, unique: true },
  ID_nguoi_dung: { type: String, required: true },
  ngay_muon: { type: String },
  ngay_tra_du_kien: { type: String },
  ngay_tra_thuc_te: { type: String },
  trang_thai: { type: String },
  sach_muon: { type: Array }
}, {
  collection: 'PHIEUMUONSACH'
});

module.exports = mongoose.model('PhieuMuonSach', phieuMuonSachSchema); 