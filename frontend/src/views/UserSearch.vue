<template>
  <div class="user-search">
    <h2>Tìm kiếm Sách Nâng Cao</h2>
    <div class="search-bar">
      <input v-model="searchQuery" @keyup.enter="fetchBooks" placeholder="Từ khóa tên sách hoặc tác giả..." />
      <select v-model="selectedCategory">
        <option value="">-- Thể loại --</option>
        <option v-for="cat in categories" :key="cat.ID_danh_muc" :value="cat.ten_danh_muc">{{ cat.ten_danh_muc }}</option>
      </select>
      <select v-model="selectedStatus">
        <option value="">-- Trạng thái --</option>
        <option value="Có sẵn">Có sẵn</option>
        <option value="Đang mượn">Đang mượn</option>
      </select>
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
          <tr v-for="book in filteredBooks" :key="book.ID">
            <td>{{ book.ID }}</td>
            <td>
              <router-link :to="`/book/${book.ID}`">{{ book.ten_sach }}</router-link>
            </td>
            <td>{{ book.tac_gia }}</td>
            <td>{{ book.nam_xuat_ban }}</td>
            <td>{{ book.ngon_ngu }}</td>
            <td>{{ book.danh_muc }}</td>
            <td>
              <span :style="{color: book.so_luong > 0 ? 'green' : 'red'}">
                {{ book.so_luong > 0 ? 'Có sẵn' : 'Đang mượn/hết sách' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredBooks.length === 0">Không tìm thấy sách phù hợp.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios';

const books = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const loading = ref(false);

const fetchBooks = async () => {
  loading.value = true;
  try {
    let url = import.meta.env.VITE_API_BASE_URL + '/books';
    if (searchQuery.value.trim() !== '') {
	  url = `${import.meta.env.VITE_API_BASE_URL}/books/search?q=${encodeURIComponent(searchQuery.value)}`;
	}

    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/books`);
    books.value = res.data;
  } catch (err) {
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data;
  } catch (err) {
    categories.value = [];
  }
};

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchCategory = selectedCategory.value ? book.danh_muc === selectedCategory.value : true;
    const matchStatus = selectedStatus.value ? book.trang_thai === selectedStatus.value : true;
    return matchCategory && matchStatus;
  });
});

onMounted(() => {
  fetchBooks();
  fetchCategories();
});
</script>

<style scoped>
.user-search {
  max-width: 950px;
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
.search-bar input, .search-bar select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.search-bar input {
  flex: 2;
}
.search-bar select {
  flex: 1;
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