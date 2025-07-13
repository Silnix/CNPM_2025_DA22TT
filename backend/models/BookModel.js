const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  ten_sach: { type: String, required: true },
  tac_gia: { type: String, required: true },
  nam_xuat_ban: { type: Number },
  ngon_ngu: { type: String },
  trang_thai: { type: String },
  vi_tri: { type: String },
  id_nguoi_them: { type: String },
  ngay_them: { type: String },
  anh_bia: { type: String },
  danh_muc: { type: String },
  ID_danh_muc: { type: String },
  so_luong: { type: Number }
}, {
  collection: 'SACH'
});

module.exports = mongoose.model('Book', bookSchema); 