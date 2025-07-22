const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://phandangkhoawork:JiKMnFFWopw3Hac4@qltv.tl6vupn.mongodb.net/QLTV?retryWrites=true&w=majority';
    await mongoose.connect(uri); // Không cần truyền options nữa
    console.log('✅ Kết nối MongoDB thành công!');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

