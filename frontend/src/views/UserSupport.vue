<template>
  <div class="user-support">
    <h2>Gửi Yêu Cầu Hỗ Trợ</h2>
    <form @submit.prevent="submitSupport">
      <div class="form-group">
        <label>Tiêu đề:</label>
        <input v-model="title" type="text" required placeholder="Nhập tiêu đề yêu cầu..." />
      </div>
      <div class="form-group">
        <label>Nội dung:</label>
        <textarea v-model="content" rows="5" required placeholder="Nhập nội dung cần hỗ trợ..."></textarea>
      </div>
      <button type="submit">Gửi yêu cầu</button>
    </form>
    <div v-if="message" :class="{'success': success, 'error': !success}" class="message">{{ message }}</div>
    <div class="contact-info">
      <h3>Hoặc liên hệ trực tiếp:</h3>
      <p>Email: khoadangphan307@gmail.com</p>
      <p>Hotline: 0867570650 </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/axios';

const title = ref('');
const content = ref('');
const message = ref('');
const success = ref(false);

const submitSupport = async () => {
  if (!title.value || !content.value) {
    message.value = 'Vui lòng nhập đầy đủ thông tin.';
    success.value = false;
    return;
  }
  try {
    await api.post('/support', { title: title.value, content: content.value });
    message.value = 'Gửi yêu cầu hỗ trợ thành công! Chúng tôi sẽ phản hồi sớm nhất.';
    success.value = true;
    title.value = '';
    content.value = '';
  } catch (err) {
    message.value = 'Gửi yêu cầu thất bại!';
    success.value = false;
  }
};
</script>

<style scoped>
.user-support {
  max-width: 500px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}
.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
label {
  font-weight: 500;
}
input[type="text"], textarea {
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
.contact-info {
  margin-top: 2rem;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
}
.contact-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #007bff;
}
</style> 