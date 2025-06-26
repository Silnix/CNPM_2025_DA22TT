<template>
  <div class="book-lookup">
    <h2>Tra cứu Sách</h2>
    <div class="search-bar">
      <input v-model="searchQuery" @keyup.enter="fetchBooks" placeholder="Nhập từ khóa tên sách, tác giả hoặc thể loại..." />
      <button @click="fetchBooks">Tìm kiếm</button>
    </div>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <div v-else>
      <table class="book-table">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Năm xuất bản</th>
            <th>Ngôn ngữ</th>
            <th>Thể loại</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.ID">
            <td>{{ book.ID }}</td>
            <td>
              <a href="#" @click.prevent="goToDetail(book.ID)">{{ book.ten_sach }}</a>
            </td>
            <td>{{ book.tac_gia }}</td>
            <td>{{ book.nam_xuat_ban }}</td>
            <td>{{ book.ngon_ngu }}</td>
            <td>{{ book.danh_muc }}</td>
            <td>{{ book.trang_thai }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="books.length === 0">Không tìm thấy sách phù hợp.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const books = ref([]);
const searchQuery = ref('');
const loading = ref(false);
const router = useRouter();

const fetchBooks = async () => {
  loading.value = true;
  try {
    let url = 'http://localhost:5000/api/books';
    if (searchQuery.value.trim() !== '') {
      url = `http://localhost:5000/api/books/search?q=${encodeURIComponent(searchQuery.value)}`;
    }
    const res = await axios.get(url);
    books.value = res.data;
  } catch (err) {
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const goToDetail = (id) => {
  router.push({ name: 'BookDetail', params: { id } });
};

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.book-lookup {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.search-bar input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.search-bar button {
  padding: 0.5rem 1.5rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.book-table th, .book-table td {
  border: 1px solid #eee;
  padding: 0.5rem 0.7rem;
  text-align: left;
}
.book-table th {
  background: #f5f5f5;
}
</style> 