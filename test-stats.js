const axios = require('axios');

async function testStats() {
  try {
    console.log('🔄 Đang test các API thống kê...');
    
    // 1. Test thống kê tổng quan
    console.log('\n📊 1. Thống kê tổng quan...');
    const overviewRes = await axios.get('http://localhost:5000/api/stats/overview');
    console.log('✅ Thống kê tổng quan:', overviewRes.data);
    
    // 2. Test thống kê đăng ký theo tháng
    console.log('\n📈 2. Thống kê đăng ký theo tháng...');
    const registrationRes = await axios.get('http://localhost:5000/api/stats/registrations');
    console.log('✅ Thống kê đăng ký:', registrationRes.data);
    
    // 3. Test thống kê mượn sách theo tháng
    console.log('\n📚 3. Thống kê mượn sách theo tháng...');
    const borrowRes = await axios.get('http://localhost:5000/api/stats/borrows');
    console.log('✅ Thống kê mượn sách:', borrowRes.data);
    
    // 4. Test thống kê sách theo danh mục
    console.log('\n📂 4. Thống kê sách theo danh mục...');
    const categoryRes = await axios.get('http://localhost:5000/api/stats/books-by-category');
    console.log('✅ Thống kê sách theo danh mục:', categoryRes.data);
    
    console.log('\n🎉 Tất cả API thống kê hoạt động bình thường!');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response ? error.response.data : error.message);
  }
}

// Chạy test
testStats(); 