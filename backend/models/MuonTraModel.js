const mongoose = require('mongoose');

const muonTraSchema = new mongoose.Schema({
  ID_muon_tra: { type: String, required: true, unique: true },
  ID_phieu: { type: String, required: true },
  ID_nguoi_dung: { type: String, required: true },
  ID_sach: { type: String, required: true },
  ten_sach: { type: String },
  ngay_muon: { type: String },
  ngay_tra_du_kien: { type: String },
  ngay_tra: { type: String },
  trang_thai: { type: String }
}, {
  collection: 'MUON_TRA'
});

module.exports = mongoose.model('MuonTra', muonTraSchema); 