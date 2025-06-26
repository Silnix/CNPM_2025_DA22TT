const mongoose = require('mongoose');

const danhMucSchema = new mongoose.Schema({
  ID_danh_muc: { type: String, required: true, unique: true },
  ten_danh_muc: { type: String, required: true },
  mo_ta: { type: String },
  ngay_tao: { type: String }
}, {
  collection: 'DANHMUC'
});

module.exports = mongoose.model('DanhMuc', danhMucSchema); 