<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left side with image and text -->
      <div class="login-left">
        <div class="login-header">
          <h1>HỆ THỐNG QUẢN LÝ THƯ VIỆN</h1>
        </div>
        <div class="login-image">
          <img src="@/assets/logo.jpg" alt="Library Logo" />
        </div>
        <div class="login-footer">
          <p>TRUNG TÂM HỌC LIỆU - PHÁT TRIỂN DẠI VÀ HỌC</p>
        </div>
      </div>

      <!-- Right side with register form -->
      <div class="login-right">
        <div class="form-container">
          <h2>Đăng ký</h2>
          <form @submit.prevent="register">
            <div class="form-group">
              <label for="username">Tên đăng nhập</label>
              <input 
                id="username"
                v-model="username" 
                type="text" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <input 
                id="password"
                v-model="password" 
                type="password" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Nhập lại mật khẩu</label>
              <input 
                id="confirmPassword"
                v-model="confirmPassword" 
                type="password" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="ho_ten">Họ và tên</label>
              <input 
                id="ho_ten"
                v-model="ho_ten" 
                type="text" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email"
                v-model="email" 
                type="email" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="dia_chi">Địa chỉ</label>
              <input 
                id="dia_chi"
                v-model="dia_chi" 
                type="text" 
                required 
              />
            </div>
            <button type="submit" class="login-btn">Đăng ký</button>
          </form>
          <div class="register-link">
            <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios'

const router = useRouter();
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const ho_ten = ref('');
const email = ref('');
const dia_chi = ref('');

const register = async () => {
  if (!username.value || !password.value || !confirmPassword.value || 
      !ho_ten.value || !email.value || !dia_chi.value) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu nhập lại không khớp!');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert('Email không hợp lệ!');
    return;
  }
  
  try {
    const response = await api.post('/auth/register', {
      username: username.value,
      password: password.value,
      ho_ten: ho_ten.value,
      email: email.value,
      dia_chi: dia_chi.value
    });

    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    router.push('/login');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert('Lỗi kết nối server! Vui lòng thử lại sau.');
    }
    console.error('Lỗi khi đăng ký:', error);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;500&display=swap');

.login-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.login-container {
  display: flex;
  width: 900px;
  max-width: 95vw;
  background: transparent;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: rgba(81, 98, 171, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.login-header h1 {
  font-family: 'Merriweather', serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.login-image img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid white;
  margin-bottom: 30px;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.login-footer p {
  font-family: 'Merriweather', serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.5px;
}

.login-right {
  flex: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 40px;
  max-height: 100vh;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 350px;
  padding: 20px 0;
}

.form-container h2 {
  font-family: 'Merriweather', serif;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 35px;
  text-align: center;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  font-family: 'Roboto', sans-serif;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 10px;
  background-color: #f0f4f8;
  font-size: 16px;
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 130, 190, 0.5);
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(110deg, #6C82BE 0%, #A072D1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 5px 15px rgba(138, 100, 212, 0.3);
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(138, 100, 212, 0.4);
}

.register-link {
  text-align: center;
  margin-top: 25px;
}

.register-link p {
  color: #666;
  font-size: 14px;
}

.register-link a {
  color: #6C82BE;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 820px) {
  .login-container {
    flex-direction: column;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  .login-left {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
