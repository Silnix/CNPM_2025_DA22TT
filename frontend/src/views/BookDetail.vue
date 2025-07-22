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
        <p><b>Trạng thái:</b> 
          <span v-if="(book.so_luong_thuc_te ?? book.so_luong) > 0" style="color:green">Có sẵn</span>
          <span v-else style="color:red">Hết sách</span>
        </p>
        <p v-if="book.mo_ta"><b>Mô tả:</b> {{ book.mo_ta }}</p>
        <button v-if="book.so_luong_thuc_te > 0" @click="muonSach">Mượn sách</button>
        <div v-else class="out-of-stock">Hết sách</div>
        <div v-if="message" class="message">{{ message }}</div>
      </div>
    </div>
    <div class="suggest-section">
      <h3>Gợi ý sách khác</h3>
      <div v-if="loadingSuggestions" class="loading">Đang tải gợi ý...</div>
      <div v-else-if="suggestedBooks.length === 0" class="loading">Không có sách gợi ý.</div>
      <div v-else class="suggest-grid">
        <div v-for="book in suggestedBooks" :key="book.ID" class="suggest-card" @click="goToBookDetail(book.ID)">
          <img :src="book.anh_bia || defaultCover" alt="Bìa sách" class="suggest-cover" />
          <div class="suggest-title">{{ book.ten_sach }}</div>
          <div class="suggest-author">{{ book.tac_gia }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Đang tải thông tin sách...</div>
  <div v-if="showConfirm" class="modal-overlay">
    <div class="modal-dialog">
      <p>{{ confirmMessage }}</p>
      <button @click="muonSachCallback()">Xác nhận</button>
      <button @click="showConfirm = false">Hủy</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios'

const route = useRoute();
const router = useRouter();
const book = ref(null);
const message = ref('');
const defaultCover = 'https://res.cloudinary.com/demo/image/upload/v1690000000/default_book_cover.png';
const suggestedBooks = ref([]);
const loadingSuggestions = ref(true);
const showConfirm = ref(false);
const confirmMessage = ref('');
let muonSachCallback = null;

const fetchBook = async () => {
  try {
    const res = await api.get(`/books/${route.params.id}/available`);
    book.value = res.data;
  } catch (err) {
    book.value = null;
  }
};

const muonSach = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user && user.ID ? user.ID : null;
  if (!userId) {
    message.value = 'Bạn cần đăng nhập để mượn sách!';
    return;
  }
  // Lấy danh sách phiếu mượn của user
  try {
    const res = await api.get(`/books/borrowed/${userId}`);
    const daMuon = res.data.some(ticket => ticket.sach_muon.ID === book.value.ID && ticket.trang_thai === 'Đang mượn');
    if (daMuon) {
      confirmMessage.value = 'Bạn đã mượn cuốn này rồi. Bạn có chắc muốn mượn thêm một cuốn nữa không?';
      showConfirm.value = true;
      muonSachCallback = () => thucHienMuonSach(userId);
      return;
    }
    await thucHienMuonSach(userId);
  } catch (err) {
    message.value = 'Có lỗi xảy ra khi kiểm tra phiếu mượn!';
  }
};

const thucHienMuonSach = async (userId) => {
  try {
    const res = await api.post('/books/borrow', {
      ID_nguoi_dung: userId,
      ID_sach: book.value.ID
    });
    message.value = 'Mượn sách thành công! Ngày trả dự kiến: ' + res.data.ngay_tra_du_kien;
    book.value.so_luong_thuc_te -= 1;
  } catch (err) {
    message.value = err.response?.data?.message || 'Có lỗi xảy ra khi mượn sách!';
  }
  showConfirm.value = false;
};

const trangThai = computed(() => book.value && book.value.so_luong_thuc_te > 0 ? 'Có sẵn' : 'Đang mượn/hết sách');

const fetchSuggestions = async () => {
  loadingSuggestions.value = true;
  try {
    const res = await api.get('/books');
    // Lọc bỏ sách hiện tại, ép kiểu ID khi so sánh
    const otherBooks = res.data.filter(b => String(b.ID) !== String(route.params.id));
    suggestedBooks.value = otherBooks.sort(() => 0.5 - Math.random()).slice(0, 4);
  } catch (err) {
    suggestedBooks.value = [];
  } finally {
    loadingSuggestions.value = false;
  }
};

onMounted(() => {
  fetchBook();
  fetchSuggestions();
});
watch(() => route.params.id, () => {
  fetchBook();
  fetchSuggestions();
});

const goToBookDetail = (id) => {
  router.push({ name: 'BookDetail', params: { id } });
};

function getImageUrl(anh_bia) {
  if (!anh_bia) return '';
  const match = anh_bia.match(/drive\.google\.com\/file\/d\/([\w-]+)\/view/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return anh_bia;
}
</script>

<style scoped>
.book-detail {
  max-width: 1100px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}
.book-layout {
  display: flex;
  align-items: flex-start;
  gap: 2.5rem;
}
.book-img {
  max-width: 200px;
  min-width: 140px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
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
  margin-bottom: 1.2rem;
  font-size: 2.1rem;
  font-weight: 700;
  text-align: left;
}
.info p {
  margin: 0.5rem 0;
  font-size: 1.13rem;
  color: #333;
  text-align: left;
  line-height: 1.6;
}
button {
  padding: 0.7rem 2.2rem;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.08rem;
  margin-top: 1.3rem;
  font-weight: 600;
  transition: background 0.2s;
}
button:hover {
  background: #1769aa;
}
.out-of-stock {
  color: #dc3545;
  font-weight: bold;
  margin-top: 1.2rem;
}
.message {
  margin-top: 1rem;
  color: #2196f3;
}
.suggest-section {
  margin-top: 48px;
}
.suggest-section h3 {
  margin-bottom: 20px;
  font-size: 1.22rem;
  color: #ff9800;
  font-weight: 700;
  letter-spacing: 1px;
}
.suggest-grid {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
}
.suggest-card {
  background: #fafbfc;
  border: 1.5px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 14px 10px 10px 10px;
  width: 160px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, border 0.2s;
}
.suggest-card:hover {
  box-shadow: 0 4px 16px rgba(33,150,243,0.13);
  border: 1.5px solid #2196f3;
}
.suggest-cover {
  width: 90px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #f5f5f5;
}
.suggest-title {
  font-weight: bold;
  font-size: 1.05rem;
  margin-bottom: 3px;
  color: #222;
  text-align: center;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.suggest-author {
  font-size: 0.93rem;
  color: #888;
  text-align: center;
  margin-bottom: 2px;
}
.loading {
  color: #888;
  font-style: italic;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-dialog {
  background: #fff;
  border-radius: 8px;
  padding: 2rem 2.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  text-align: center;
}
.modal-dialog button {
  margin: 0 1rem;
  padding: 0.6rem 1.8rem;
  border: none;
  border-radius: 5px;
  background: #2196f3;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-dialog button:last-child {
  background: #aaa;
}
@media (max-width: 900px) {
  .book-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .book-detail {
    padding: 1.2rem;
  }
  .info {
    align-items: center;
  }
  h2, .info p {
    text-align: center;
  }
  .suggest-grid {
    gap: 14px;
  }
}
</style> 