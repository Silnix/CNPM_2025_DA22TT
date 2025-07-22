<template>
  <div class="user-settings">
    <div class="profile-card">
      <div class="avatar-section">
        <img :src="user.avatar || defaultAvatar" alt="avatar" class="avatar" />
        <input type="file" @change="onAvatarChange" id="avatarInput" style="display:none" />
        <button type="button" class="avatar-btn" @click="chooseAvatar">Đổi ảnh</button>
      </div>
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label>Họ tên:</label>
          <input v-model="user.ho_ten" type="text" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="user.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Số điện thoại:</label>
          <input v-model="user.sdt" type="text" />
        </div>
        <div class="form-group">
          <label>Địa chỉ:</label>
          <input v-model="user.dia_chi" type="text" />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
      <div v-if="message" :class="{'success': success, 'error': !success}" class="message">{{ message }}</div>
    </div>

    <div class="password-card">
      <h3>Đổi mật khẩu</h3>
      <form @submit.prevent="changePassword" class="password-form">
        <div class="form-group">
          <label>Mật khẩu cũ:</label>
          <input v-model="oldPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>Mật khẩu mới:</label>
          <input v-model="newPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>Xác nhận mật khẩu mới:</label>
          <input v-model="confirmPassword" type="password" required />
        </div>
        <button type="submit">Đổi mật khẩu</button>
      </form>
      <div v-if="pwMessage" :class="{'success': pwSuccess, 'error': !pwSuccess}" class="message">{{ pwMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const defaultAvatar = '/src/assets/logo.jpg';
const user = ref({ ho_ten: '', email: '', dia_chi: '', sdt: '', avatar: '', ID: '' });
const message = ref('');
const success = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const pwMessage = ref('');
const pwSuccess = ref(false);

const localUser = JSON.parse(localStorage.getItem('user') || '{}');
const userId = localUser.ID || localUser.id || localUser._id || '';

const fetchUserInfo = async () => {
  if (!userId) return;
  try {
    const res = await api.get(`/users/${userId}`);
    user.value = res.data;
  } catch (err) {
    message.value = 'Không lấy được thông tin tài khoản!';
    success.value = false;
  }
};

const updateProfile = async () => {
  try {
    await api.put(`/users/${userId}`, user.value);
    message.value = 'Cập nhật thông tin thành công!';
    success.value = true;
    localStorage.setItem('user', JSON.stringify(user.value));
  } catch (err) {
    message.value = 'Cập nhật thất bại!';
    success.value = false;
  }
};

const changePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    pwMessage.value = 'Vui lòng nhập đầy đủ thông tin.';
    pwSuccess.value = false;
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    pwMessage.value = 'Mật khẩu mới và xác nhận không khớp!';
    pwSuccess.value = false;
    return;
  }
  try {
    await api.put(`/users/${userId}/change-password`, {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    });
    pwMessage.value = 'Đổi mật khẩu thành công!';
    pwSuccess.value = true;
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (err) {
    pwMessage.value = 'Đổi mật khẩu thất bại!';
    pwSuccess.value = false;
  }
};

const chooseAvatar = () => {
  document.getElementById('avatarInput').click();
};

const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    user.value.avatar = evt.target.result;
  };
  reader.readAsDataURL(file);
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.user-settings {
  max-width: 900px;
  margin: 2rem auto;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}
.profile-card, .password-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
  min-width: 340px;
  flex: 1 1 340px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
  margin-bottom: 0.5rem;
}
.avatar-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  font-size: 1rem;
}
.profile-form, .password-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
label {
  font-weight: 500;
}
input, select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
button[type="submit"] {
  padding: 0.6rem 2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
.message {
  margin-top: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 4px;
  font-weight: 500;
}
.success {
  background: #e6ffed;
  color: #1a7f37;
  border: 1px solid #b7eb8f;
}
.error {
  background: #fff1f0;
  color: #cf1322;
  border: 1px solid #ffa39e;
}
</style> 