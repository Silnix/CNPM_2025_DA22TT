<template>
  <div class="search-page">
    <div class="search-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'lookup' }]" 
        @click="activeTab = 'lookup'"
      >
        Tra cứu sách
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'borrow' }]" 
        @click="activeTab = 'borrow'"
      >
        Mượn sách
      </button>
    </div>
    <div class="search-container">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm sách theo tên, tác giả, thể loại..."
          @keyup.enter="performSearch"
        />
        <button class="search-icon-btn" @click="performSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
    </div>
    
    <div v-if="activeTab === 'lookup'" class="search-results">
      <p v-if="!results.length && hasSearched">Không tìm thấy kết quả nào.</p>
      <div v-else class="book-list">
        <div v-for="book in results" :key="book._id" class="book-item" @click="goToDetail(book)">
          <img :src="book.anh_bia || require('@/assets/logo.jpg')" alt="Ảnh bìa" class="book-cover" />
          <div class="book-title">{{ book.ten_sach }}</div>
        </div>
      </div>
    </div>

    <!-- Bảng quản lý mượn sách -->
    <div v-if="activeTab === 'borrow'" class="borrow-table-section">
      <h3>Danh sách mượn sách</h3>
      <button @click="fetchBorrowList" style="margin-bottom:10px">Làm mới</button>
      <table class="borrow-table">
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>ID người mượn</th>
            <th>Ngày mượn</th>
            <th>Ngày trả dự kiến</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in borrowList" :key="item._id || item.id_muon_tra">
            <td>{{ item.ten_sach }}</td>
            <td>{{ item.id_nguoi_dung }}</td>
            <td>{{ item.ngay_muon }}</td>
            <td>
              <span :class="{ 'overdue': isOverdue(item.ngay_tra_du_kien) }">
                {{ item.ngay_tra_du_kien }}
              </span>
            </td>
            <td>
              <span :class="getStatusClass(item)">
                {{ getStatus(item) }}
                <span v-if="isOverdue(item.ngay_tra_du_kien) && item.trang_thai === 'Đang mượn'" class="overdue-warning">
                  (Quá hạn)
                </span>
              </span>
            </td>
            <td>
              <button v-if="item.trang_thai === 'Chờ xác nhận trả'" @click="xacNhanTra(item)">Xác nhận trả</button>
              <span v-else-if="item.trang_thai === 'Đã trả'">Đã trả</span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="borrowList.length === 0">Chưa có phiếu mượn nào.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const activeTab = ref('lookup');
const searchQuery = ref('');
const results = ref([]);
const hasSearched = ref(false);
const router = useRouter();

const borrowList = ref([]);

async function fetchBorrowList() {
  try {
    // Lấy phiếu mượn đang hoạt động
    const resPhieu = await axios.get('http://localhost:5000/api/borrow-tickets');
    // Lấy lịch sử đã trả
    const resTra = await axios.get('http://localhost:5000/api/borrow-returns');
    // Map phiếu mượn: join sang bảng SACH để lấy tên sách
    let borrowPhieu = [];
    for (const item of resPhieu.data.filter(i => i.trang_thai !== 'Đã trả')) {
      for (const sachId of item.sach_muon) {
        try {
          const sachRes = await axios.get(`http://localhost:5000/api/books/${sachId}`);
          borrowPhieu.push({
            ten_sach: sachRes.data.ten_sach,
            ID_nguoi_dung: item.ID_nguoi_dung,
            ngay_muon: item.ngay_muon,
            ngay_tra_du_kien: item.ngay_tra_du_kien,
            trang_thai: item.trang_thai,
            ID_phieu: item.ID_phieu
          });
        } catch {}
      }
    }
    // Map lịch sử đã trả (đã có đủ trường)
    let borrowTra = resTra.data.map(item => ({
      ten_sach: item.ten_sach,
      ID_nguoi_dung: item.ID_nguoi_dung,
      ngay_muon: item.ngay_muon,
      ngay_tra_du_kien: item.ngay_tra_du_kien,
      trang_thai: item.trang_thai,
      ID_phieu: item.ID_phieu
    }));
    borrowList.value = [...borrowPhieu, ...borrowTra];
  } catch (err) {
    borrowList.value = [];
  }
}

watch(activeTab, (tab) => {
  if (tab === 'borrow') fetchBorrowList();
});

let intervalId = null;
onMounted(() => {
  if (activeTab.value === 'borrow') fetchBorrowList();
  intervalId = setInterval(() => {
    if (activeTab.value === 'borrow') fetchBorrowList();
  }, 10000); // 10 giây
});
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

function getStatus(item) {
  const today = new Date();
  const due = new Date(item.ngay_tra_du_kien);
  return today > due ? 'Trễ hạn' : 'Còn hạn';
}
function getStatusClass(item) {
  const today = new Date();
  const due = new Date(item.ngay_tra_du_kien);
  return today > due ? 'late-status' : 'on-status';
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  return today > due;
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = [];
    hasSearched.value = false;
    return;
  }
  hasSearched.value = true;
  try {
    const response = await axios.get(`http://localhost:5000/api/books/search?q=${searchQuery.value}`);
    results.value = response.data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sách:', error);
    results.value = [];
  }
};

const goToDetail = (book) => {
  router.push({ name: 'BookDetail', params: { id: book.ID } });
};

const xacNhanTra = async (item) => {
  try {
    await axios.put(`http://localhost:5000/api/borrow-tickets/${item.ID_phieu}`, {
      trang_thai: 'Đã trả',
      ngay_tra: new Date().toISOString().slice(0,10)
    });
    await axios.post('http://localhost:5000/api/borrow-returns', {
      ...item,
      trang_thai: 'Đã trả',
      ngay_tra: new Date().toISOString().slice(0,10)
    });
    alert('Đã xác nhận trả sách!');
    fetchBorrowList();
  } catch (err) {
    alert('Có lỗi khi xác nhận!');
  }
};
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.search-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #eee;
  padding-bottom: -2px; /* to align with bottom border */
}
.tab-btn {
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #888;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}
.tab-btn.active {
  color: var(--accent-color, #1890ff);
  border-bottom-color: var(--accent-color, #1890ff);
}
.search-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.search-bar {
  position: relative;
}
.search-bar input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.search-bar input:focus {
  border-color: var(--accent-color, #1890ff);
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
}
.search-icon-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  padding: 5px;
}
.search-results {
  margin-top: 10px;
}
.book-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.book-item {
  width: 160px;
  cursor: pointer;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 10px;
  text-align: center;
  transition: box-shadow 0.2s;
}
.book-item:hover {
  box-shadow: 0 4px 16px rgba(24,144,255,0.15);
}
.book-cover {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}
.book-title {
  font-weight: 500;
  color: #333;
  font-size: 15px;
}
.borrow-table-section {
  margin-top: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}
.borrow-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.borrow-table th, .borrow-table td {
  border: 1px solid #eee;
  padding: 0.5rem 0.7rem;
  text-align: left;
}
.borrow-table th {
  background: #f5f5f5;
}
.on-status {
  color: #1890ff;
  font-weight: bold;
}
.late-status {
  color: #dc3545;
  font-weight: bold;
}
.overdue {
  color: #d32f2f;
  font-weight: bold;
}
.overdue-warning {
  color: #d32f2f;
  font-size: 0.9em;
  font-weight: bold;
}
</style> 