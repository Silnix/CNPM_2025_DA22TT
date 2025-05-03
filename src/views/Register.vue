<template>
  <div class="login-container">
    <!-- Left: Logo or Illustration -->
    <div class="login-left">
      <img src="../assets/logo.svg" alt="Logo" />
    </div>

    <!-- Right: Register Form -->
    <div class="login-right">
      <h2>Đăng ký</h2>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
        <input v-model="password" type="password" placeholder="Mật khẩu" required />
        <input v-model="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" required />
        <button type="submit">Đăng ký</button>
      </form>

      <!-- Link to Login -->
      <div class="login-footer">
        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const register = () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu nhập lại không khớp!');
    return;
  }

  alert(`Tạo tài khoản thành công!\nTên đăng nhập: ${username.value}`);
  // Có thể thêm router.push('/login') nếu muốn chuyển hướng sau khi đăng ký
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.login-left {
  flex: 1;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-left img {
  max-width: 70%;
  height: auto;
}

.login-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  background-color: #ffffff;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.05);
}

.login-right h2 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #333;
}

.login-right form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-right input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.login-right button {
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-right button:hover {
  background-color: #33976b;
}

.login-footer {
  margin-top: 1rem;
  text-align: center;
}

.login-footer a {
  color: #42b883;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
