<template>
  <div class="borrow-request">
    <h2>Lập Phiếu Mượn Sách</h2>
    <form @submit.prevent="submitRequest">
      <div class="form-group">
        <label>Chọn sách muốn mượn:</label>
        <select v-model="selectedBookId" required>
          <option value="">-- Chọn sách --</option>
          <option v-for="book in availableBooks" :key="book.ID" :value="book.ID">
            {{ book.ten_sach }} ({{ book.tac_gia }})
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Ngày mượn:</label>
        <input type="date" v-model="ngayMuon" required />
      </div>
      <div class="form-group">
        <label>Ngày trả dự kiến:</label>
        <input type="date" v-model="ngayTraDuKien" required />
      </div>
      <button type="submit">Gửi yêu cầu mượn</button>
    </form>
    <div v-if="message" :class="{'success': success, 'error': !success}" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const availableBooks = ref([]);
const selectedBookId = ref('');
const ngayMuon = ref('');
const ngayTraDuKien = ref('');
const message = ref('');
const success = ref(false);

const fetchAvailableBooks = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/books');
    availableBooks.value = res.data.filter(book => book.trang_thai === 'Có sẵn');
  } catch (err) {
    availableBooks.value = [];
  }
};

const submitRequest = async () => {
  if (!selectedBookId.value || !ngayMuon.value || !ngayTraDuKien.value) {
    message.value = 'Vui lòng nhập đầy đủ thông tin.';
    success.value = false;
    return;
  }
  try {
    // Lấy userId từ localStorage (giả định đã lưu khi đăng nhập)
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.ID || userInfo.id || userInfo._id || 'U001';
    const payload = {
      ID_phieu: 'PM' + Date.now(),
      ID_nguoi_dung: userId,
      ngay_muon: ngayMuon.value,
      ngay_tra_du_kien: ngayTraDuKien.value,
      trang_thai: 'dang_muon',
      sach_muon: [selectedBookId.value]
    };
    await axios.post('http://localhost:5000/api/borrow-tickets', payload);
    message.value = 'Gửi yêu cầu mượn sách thành công!';
    success.value = true;
    // Reset form
    selectedBookId.value = '';
    ngayMuon.value = '';
    ngayTraDuKien.value = '';
    fetchAvailableBooks();
  } catch (err) {
    message.value = 'Gửi yêu cầu thất bại!';
    success.value = false;
  }
};

onMounted(() => {
  fetchAvailableBooks();
});
</script>

<style scoped>
.borrow-request {
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
select, input[type="date"] {
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