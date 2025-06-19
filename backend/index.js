const express = require('express');
const mongoose = require('mongoose');
const User = require('./UserModel');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const uri = 'mongodb://localhost:27017/QLTV'; // Đúng tên database chứa collection NGUOIDUNG

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Kết nối MongoDB thành công!');
})
.catch((err) => {
  console.error('Kết nối MongoDB thất bại:', err);
});

app.use(express.json());

// API mẫu
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong từ backend!' });
});

// API đăng nhập
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
  }
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
    }
    // Đăng nhập thành công
    res.json({ message: 'Đăng nhập thành công!', user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server backend đang chạy tại http://localhost:${PORT}`);
}); 