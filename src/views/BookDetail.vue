<template>
  <div class="book-detail" v-if="book">
    <h2>{{ book.ten_sach }}</h2>
    <img v-if="book.anh_bia" :src="getImageUrl(book.anh_bia)" alt="Ảnh bìa sách" class="book-img" />
    <div class="info">
      <p><b>Tác giả:</b> {{ book.tac_gia }}</p>
      <p><b>Năm xuất bản:</b> {{ book.nam_xuat_ban }}</p>
      <p><b>Ngôn ngữ:</b> {{ book.ngon_ngu }}</p>
      <p><b>Thể loại:</b> {{ book.danh_muc }}</p>
      <p><b>Trạng thái:</b> {{ book.trang_thai }}</p>
      <p><b>Số lượng còn lại:</b> {{ soLuongConLai }}</p>
    </div>
    <button v-if="soLuongConLai > 0" @click="muonSach">Mượn sách</button>
    <div v-else class="out-of-stock">Hết sách</div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
  <div v-else>Đang tải thông tin sách...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const book = ref(null);
const message = ref('');
const soLuongConLai = ref(0);

const fetchBook = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/books/${route.params.id}`);
    book.value = res.data;
    // Tính số lượng còn lại: so_luong - số lượng đã mượn (nếu có trường này)
    soLuongConLai.value = (book.value.so_luong || 0) - (book.value.da_muon || 0);
  } catch (err) {
    book.value = null;
  }
};

const muonSach = async () => {
  // Logic gửi yêu cầu mượn sách (có thể mở modal hoặc chuyển sang trang mượn)
  message.value = 'Chức năng mượn sách sẽ được xử lý ở trang lập phiếu mượn!';
};

function getImageUrl(anh_bia) {
  if (!anh_bia) return '';
  // Nếu là link Google Drive
  const match = anh_bia.match(/drive\.google\.com\/file\/d\/([\w-]+)\/view/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return anh_bia;
}

onMounted(() => {
  fetchBook();
});
</script>

<style scoped>
.book-detail {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}
.book-img {
  max-width: 200px;
  margin-bottom: 1rem;
  border-radius: 8px;
}
.info p {
  margin: 0.3rem 0;
}
button {
  padding: 0.6rem 2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
.out-of-stock {
  color: #dc3545;
  font-weight: bold;
  margin-top: 1rem;
}
.message {
  margin-top: 1rem;
  color: #007bff;
}
</style> 