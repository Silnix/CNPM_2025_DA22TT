<template>
  <div class="user-home">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo.jpg" alt="Logo" />
        <h1>Thư Viện CELRI</h1>
      </div>
      <div class="menu-section">
        <span class="menu-title">MAIN MENU</span>
        <nav class="nav-menu">
          <router-link to="/user-home" class="menu-item" active-class="active">
            <span class="icon">
              <!-- Home icon -->
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 4l9 5.5M4 10v8a2 2 0 002 2h3m6 0h3a2 2 0 002-2v-8"/><path d="M9 22V12h6v10"/></svg>
            </span>
            Trang chủ
          </router-link>
          <router-link to="/user-search" class="menu-item" active-class="active">
            <span class="icon">
              <!-- Search icon -->
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
            Tìm kiếm
          </router-link>
          <router-link to="/user-book-lookup" class="menu-item" active-class="active">
            <span class="icon">
              <!-- Book icon -->
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 7H20v13H6.5A2.5 2.5 0 014 17.5v-13z"/></svg>
            </span>
            Sách
          </router-link>
        </nav>
      </div>
      <div class="support-section">
        <span class="menu-title">SUPPORT</span>
        <nav class="nav-menu">
          <router-link to="/user-settings" class="menu-item" active-class="active">
            <span class="icon">
              <!-- Settings icon -->
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.5 3.6V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </span>
            Cài đặt
          </router-link>
          <router-link to="/user-support" class="menu-item" active-class="active">
            <span class="icon">
              <!-- Support icon -->
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 10a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M9 21h6"/></svg>
            </span>
            Hỗ trợ
          </router-link>
          <button @click="logout" class="menu-item logout-btn">
            <span class="icon">
              <!-- Logout icon -->
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 21V3"/></svg>
            </span>
            Đăng xuất
          </button>
        </nav>
      </div>
    </aside>
    <main class="main-content">
      <div class="home-top">
        <img src="@/assets/anh_banner_nuatren.png" alt="Banner" class="banner-img" />
      </div>
      <div class="home-bottom">
        <div v-if="loading" class="loading">Đang tải danh sách sách...</div>
        <div v-else>
          <h3 style="margin-bottom: 16px;">Tất cả sách trong thư viện</h3>
          <div class="book-grid">
            <div v-for="book in books" :key="book.ID" class="book-card" @click="goToBookDetail(book.ID)">
              <img :src="book.anh_bia || defaultCover" alt="Bìa sách" class="book-cover" />
              <div class="book-info">
                <div class="book-title">{{ book.ten_sach }}</div>
                <div class="book-author">Tác giả: {{ book.tac_gia }}</div>
                <div class="book-status" :class="{ available: book.trang_thai === 'Có sẵn', unavailable: book.trang_thai !== 'Có sẵn' }">
                  {{ book.trang_thai }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const books = ref([]);
const loading = ref(true);
const defaultCover = 'https://res.cloudinary.com/demo/image/upload/v1690000000/default_book_cover.png';

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/books');
    books.value = res.data;
  } catch (err) {
    books.value = [];
  } finally {
    loading.value = false;
  }
});

const goToBookDetail = (id) => {
  router.push({ name: 'BookDetail', params: { id } });
};

const logout = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.user-home {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 260px;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2rem 1rem 1rem 1rem;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.logo img {
  height: 48px;
}

.logo h1 {
  font-size: 1.3rem;
  color: #007bff;
  margin: 0;
}

.menu-section, .support-section {
  margin-bottom: 2rem;
}
.menu-title {
  display: block;
  font-size: 0.9rem;
  color: #bbb;
  font-weight: bold;
  margin-bottom: 0.7rem;
  margin-left: 0.5rem;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: #333;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-item.active,
.menu-item.router-link-exact-active {
  background-color: #00b4f6;
  color: #fff;
}
.logout-btn {
  color: #dc3545;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  font-size: 1rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}
.logout-btn:hover {
  background: #ffeaea;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0 0 0;
}

.home-top {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.banner-img {
  width: 100%;
  max-width: 100%;
  height: 50vh;
  min-height: 200px;
  max-height: 500px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  display: block;
}

.home-bottom {
  min-height: 300px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 1.1rem;
  color: #333;
  border: 1px dashed #bbb;
  padding: 24px;
  overflow-x: auto;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
}
@media (max-width: 900px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .book-grid {
    grid-template-columns: 1fr;
  }
}
.book-card {
  background: #fafbfc;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 320px;
}
.book-card:hover {
  box-shadow: 0 4px 16px rgba(33,150,243,0.12);
  border: 1.5px solid #2196f3;
}
.book-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #f5f5f5;
}
.book-info {
  text-align: center;
}
.book-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 4px;
  color: #222;
}
.book-author {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 8px;
}
.book-status {
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 4px;
}
.book-status.available {
  color: #2196f3;
}
.book-status.unavailable {
  color: #e74c3c;
}
.loading {
  color: #888;
  font-style: italic;
}
</style>  