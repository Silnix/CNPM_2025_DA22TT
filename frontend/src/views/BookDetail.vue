<template>
  <div class="book-detail" v-if="book">
    <div class="book-layout">
      <img v-if="book.anh_bia" :src="getImageUrl(book.anh_bia)" alt="Ảnh bìa sách" class="book-img" />
      <div class="info">
        <h2>{{ book.ten_sach }}</h2>
        <p><b>Tác giả:</b> {{ book.tac_gia }}</p>
        <p><b>Năm xuất bản:</b> {{ book.nam_xuat_ban }}</p>
        <p><b>Ngôn ngữ:</b> {{ book.ngon_ngu }}</p>
        <p><b>Thể loại:</b> {{ book.danh_muc }}</p>
        <p><b>Trạng thái:</b> <span :style="{color: book.so_luong_thuc_te > 0 ? 'green' : 'red'}">{{ trangThai }}</span></p>
        <p v-if="book.mo_ta"><b>Mô tả:</b> {{ book.mo_ta }}</p>
        <button v-if="book.so_luong_thuc_te > 0" @click="muonSach">Mượn sách</button>
        <div v-else class="out-of-stock">Hết sách</div>
        <div v-if="message" class="message">{{ message }}</div>
      </div>
    </div>
  </div>
  <div v-else>Đang tải thông tin sách...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const book = ref(null);
const message = ref('');

const fetchBook = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/books/${route.params.id}/available`);
    book.value = res.data;
  } catch (err) {
    book.value = null;
  }
};

const muonSach = async () => {
  try {
    // Lấy ID_nguoi_dung từ localStorage (hoặc store nếu có)
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user && user.ID ? user.ID : null;
    if (!userId) {
      message.value = 'Bạn cần đăng nhập để mượn sách!';
      return;
    }
    const res = await axios.post('http://localhost:5000/api/borrow-tickets', {
      ID_sach: book.value.ID,
      ID_nguoi_dung: userId
    });
    if (res && res.status === 201) {
      message.value = 'Mượn sách thành công!';
      book.value.so_luong_thuc_te -= 1;
    } else {
      message.value = 'Có lỗi xảy ra khi mượn sách!';
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      message.value = err.response.data.message;
    } else {
      message.value = 'Có lỗi xảy ra khi mượn sách!';
    }
    // KHÔNG giảm số lượng nếu lỗi!
  }
};

const trangThai = computed(() => book.value && book.value.so_luong_thuc_te > 0 ? 'Có sẵn' : 'Đang mượn/hết sách');

function getImageUrl(anh_bia) {
  if (!anh_bia) return '';
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
  max-width: 800px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.09);
  padding: 2rem 2.5rem;
}
.book-layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}
.book-img {
  max-width: 180px;
  min-width: 120px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  object-fit: cover;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
h2 {
  color: #2d3a4b;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: left;
}
.info p {
  margin: 0.4rem 0;
  font-size: 1.08rem;
  color: #333;
  text-align: left;
}
button {
  padding: 0.6rem 2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1.2rem;
  transition: background 0.2s;
}
button:hover {
  background: #0056b3;
}
.out-of-stock {
  color: #dc3545;
  font-weight: bold;
  margin-top: 1.2rem;
}
.message {
  margin-top: 1rem;
  color: #007bff;
}
@media (max-width: 700px) {
  .book-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .book-detail {
    padding: 1rem;
  }
  .info {
    align-items: center;
  }
  h2, .info p {
    text-align: center;
  }
}
</style> 