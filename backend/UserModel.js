const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loai_nguoi_dung: { type: Number, required: true }
}, {
  collection: 'NGUOIDUNG'
});

module.exports = mongoose.model('User', userSchema); 