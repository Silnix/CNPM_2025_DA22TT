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
        <!-- Phần dưới: Sự kiện, sách nổi bật, thông báo, ... (bạn tự bổ sung nội dung ở đây) -->
        <p>Phần dưới: Sự kiện, sách nổi bật, thông báo, ...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userName = ref('');

onMounted(() => {
  // Lấy thông tin user từ localStorage hoặc Vuex store
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  userName.value = userInfo.name || 'Người dùng';
});

const logout = () => {
  // Xóa thông tin đăng nhập
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  // Chuyển về trang đăng nhập
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
  background: #e9ecef;
  border-radius: 16px;
  margin-bottom: 1rem;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  display: block;
  object-fit: cover;
}

.home-bottom {
  min-height: 300px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #333;
  border: 1px dashed #bbb;
}
</style>  