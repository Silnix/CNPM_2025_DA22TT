<template>
  <div class="user-search">
    <h2>Tìm kiếm Sách Nâng Cao</h2>
    <div class="search-bar" style="position:relative;">
      <input v-model="searchQuery" @input="onInput" @keyup.enter="fetchBooks" placeholder="Từ khóa tên sách hoặc tác giả..." @focus="showSuggestions = true" @blur="hideSuggestions" />
      <ul v-if="showSuggestions && suggestions.length" class="suggestion-list">
        <li v-for="(item, idx) in suggestions" :key="idx" @mousedown.prevent="selectSuggestion(item)">{{ item }}</li>
      </ul>
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
// Gợi ý autocomplete
const suggestions = ref([]);
const showSuggestions = ref(false);

const onInput = async () => {
  const query = searchQuery.value.trim();
  if (!query) {
    suggestions.value = [];
    return;
  }
  try {
    // Gọi API search để lấy gợi ý động
    const res = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    // Lấy tên sách và tác giả, loại trùng lặp, giới hạn 8 gợi ý
    const allNames = res.data.map(b => b.ten_sach).concat(res.data.map(b => b.tac_gia));
    suggestions.value = Array.from(new Set(allNames)).filter(Boolean).slice(0, 8);
  } catch (err) {
    suggestions.value = [];
  }
};

const selectSuggestion = (item) => {
  searchQuery.value = item;
  showSuggestions.value = false;
  fetchBooks();
};

const hideSuggestions = () => {
  setTimeout(() => { showSuggestions.value = false; }, 150);
};

const fetchBooks = async () => {
  loading.value = true;
  try {
    let url = '/books';
    if (searchQuery.value.trim() !== '') {
      url = `/books/search?q=${encodeURIComponent(searchQuery.value)}`;
    }
    const res = await api.get(url);
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