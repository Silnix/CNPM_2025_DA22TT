const axios = require('axios');

// Test data
const testUser = {
  username: 'testuser_' + Date.now(),
  password: 'password123',
  ho_ten: 'Nguyễn Văn Test',
  email: 'test' + Date.now() + '@example.com',
  dia_chi: '123 Đường Test, Quận 1, TP.HCM'
};

async function testRegister() {
  try {
    console.log('🔄 Đang test đăng ký...');
    console.log('📝 Dữ liệu test:', testUser);
    
    // Test đăng ký
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testUser);
    console.log('✅ Đăng ký thành công!');
    console.log('📊 Response:', registerResponse.data);
    
    // Test kiểm tra danh sách users
    console.log('\n🔄 Đang kiểm tra danh sách users...');
    const usersResponse = await axios.get('http://localhost:5000/api/users');
    console.log('📊 Tổng số users:', usersResponse.data.count);
    console.log('👥 Danh sách users:', usersResponse.data.users);
    
    // Test đăng nhập với user vừa tạo
    console.log('\n🔄 Đang test đăng nhập...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Đăng nhập thành công!');
    console.log('📊 Response:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response ? error.response.data : error.message);
  }
}

// Chạy test
testRegister(); 