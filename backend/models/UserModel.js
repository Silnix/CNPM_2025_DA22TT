const mongoose = require('mongoose');

// Schema cho người dùng
// loai: 1 = Admin/Quản trị viên, 2 = Người dùng thường
const userSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ho_ten: { type: String, required: true },
  dia_chi: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  loai: { type: Number, required: true, default: 2 } // Mặc định là người dùng thường (loại 2)
}, {
  collection: 'NGUOIDUNG',
  timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('User', userSchema); 