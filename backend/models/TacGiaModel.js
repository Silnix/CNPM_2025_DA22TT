const mongoose = require('mongoose');

const tacGiaSchema = new mongoose.Schema({
  ID_tac_gia: { type: String, required: true, unique: true },
  ten_tac_gia: { type: String, required: true },
  quoc_tich: { type: String },
  ngay_sinh: { type: String },
  tieu_su: { type: String },
  anh_dai_dien: { type: String }
}, {
  collection: 'TACGIA'
});

module.exports = mongoose.model('TacGia', tacGiaSchema); 