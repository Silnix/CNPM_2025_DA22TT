const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/QLTV';
  
  try {
    await mongoose.connect(uri);
    console.log('Kết nối MongoDB thành công!');
  } catch (err) {
    console.error('Kết nối MongoDB thất bại:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 