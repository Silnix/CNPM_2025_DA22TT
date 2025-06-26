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
    
    <div class="search-results">
      <p v-if="!results.length && hasSearched">Không tìm thấy kết quả nào.</p>
      <div v-else class="book-list">
        <div v-for="book in results" :key="book._id" class="book-item" @click="goToDetail(book)">
          <img :src="book.anh_bia || require('@/assets/logo.jpg')" alt="Ảnh bìa" class="book-cover" />
          <div class="book-title">{{ book.ten_sach }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const activeTab = ref('lookup');
const searchQuery = ref('');
const results = ref([]);
const hasSearched = ref(false);
const router = useRouter();

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
</style> 