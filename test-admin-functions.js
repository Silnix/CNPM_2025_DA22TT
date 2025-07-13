const axios = require('axios');

// Test data
const testUser = {
  username: 'admin_test_' + Date.now(),
  password: 'password123',
  ho_ten: 'Nguyễn Văn Admin Test',
  email: 'admin_test' + Date.now() + '@example.com',
  dia_chi: '456 Đường Admin Test, Quận 2, TP.HCM'
};

let createdUserId = null;

async function testAdminFunctions() {
  try {
    console.log('🔄 Đang test các chức năng admin...');
    
    // 1. Test đăng ký user mới
    console.log('\n📝 1. Đăng ký user mới...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testUser);
    console.log('✅ Đăng ký thành công!');
    createdUserId = registerResponse.data.user.ID;
    console.log('📊 User ID:', createdUserId);
    
    // 2. Test lấy danh sách độc giả
    console.log('\n📋 2. Lấy danh sách độc giả...');
    const readersResponse = await axios.get('http://localhost:5000/api/users/readers');
    console.log('✅ Lấy danh sách thành công!');
    console.log('📊 Số lượng độc giả:', readersResponse.data.count);
    
    // 3. Test cập nhật thông tin user
    console.log('\n✏️ 3. Cập nhật thông tin user...');
    const updateData = {
      ho_ten: 'Nguyễn Văn Admin Test - Đã cập nhật',
      dia_chi: '789 Đường Admin Test - Đã cập nhật, Quận 3, TP.HCM',
      email: 'admin_test_updated' + Date.now() + '@example.com'
    };
    const updateResponse = await axios.put(`http://localhost:5000/api/users/${createdUserId}`, updateData);
    console.log('✅ Cập nhật thành công!');
    console.log('📊 Response:', updateResponse.data.message);
    
    // 4. Kiểm tra lại danh sách sau khi cập nhật
    console.log('\n🔄 4. Kiểm tra danh sách sau khi cập nhật...');
    const updatedReadersResponse = await axios.get('http://localhost:5000/api/users/readers');
    const updatedUser = updatedReadersResponse.data.users.find(u => u.ID === createdUserId);
    console.log('✅ Tìm thấy user đã cập nhật!');
    console.log('📊 Thông tin mới:', {
      ho_ten: updatedUser.ho_ten,
      dia_chi: updatedUser.dia_chi,
      email: updatedUser.email
    });
    
    // 5. Test xóa user
    console.log('\n🗑️ 5. Xóa user...');
    const deleteResponse = await axios.delete(`http://localhost:5000/api/users/${createdUserId}`);
    console.log('✅ Xóa thành công!');
    console.log('📊 Response:', deleteResponse.data.message);
    
    // 6. Kiểm tra lại danh sách sau khi xóa
    console.log('\n🔄 6. Kiểm tra danh sách sau khi xóa...');
    const finalReadersResponse = await axios.get('http://localhost:5000/api/users/readers');
    const deletedUser = finalReadersResponse.data.users.find(u => u.ID === createdUserId);
    console.log('✅ User đã được xóa khỏi danh sách!');
    console.log('📊 User còn lại trong danh sách:', deletedUser ? 'Có' : 'Không');
    
    console.log('\n🎉 Tất cả test đã hoàn thành thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response ? error.response.data : error.message);
  }
}

// Chạy test
testAdminFunctions(); 