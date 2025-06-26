<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
        <span>CELRI</span>
      </div>
      <nav class="main-menu">
        <p class="menu-label">MAIN MENU</p>
        <ul>
          <li>
            <router-link to="/admin/dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Trang chủ</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/search">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Tìm kiếm</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/books">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v2H6.5A2.5 2.5 0 0 1 4 4.5z"/></svg>
              <span>Sách</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Hồ sơ</span>
            </router-link>
          </li>
           <li>
            <router-link to="/admin/stats">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M9 20v-4M15 20v-2M6 20v-8M18 20v-5M3 12a9 9 0 0 1 18 0Z"/></svg>
              <span>Thống kê</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="separator"></div>
      <nav class="support-menu">
        <p class="menu-label">SUPPORT</p>
        <ul>
          <li>
            <router-link to="/admin/settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Cài đặt</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/support">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/><path d="M12 12a4 4 0 0 0-4 4v1"/><circle cx="12" cy="10" r="1"/></svg>
              <span>Hỗ trợ</span>
            </router-link>
          </li>
          <li>
            <a href="#" @click.prevent="logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>Đăng xuất</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    <div class="main-content">
      <header class="top-header">
        <div class="header-title">PHẦN MỀM QUẢN LÝ THƯ VIỆN</div>
        <div class="user-menu">
          <span id="current-time">{{ currentTime }}</span>
        </div>
      </header>
      <main class="content-area">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTime = ref('');

let timer;

const updateTime = () => {
  const now = new Date();
  const options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true
  };
  currentTime.value = now.toLocaleString('vi-VN', options);
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const logout = () => {
  // Logic to clear user session/token
  console.log('User logged out');
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Roboto:wght@400;500;700&display=swap');

:root {
  --sidebar-bg: #FFFFFF;
  --main-bg: #F7F8FC;
  --text-color: #555;
  --text-light: #888;
  --accent-color: #1890ff;
  --active-menu-bg: #E6F7FF;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--main-bg);
  font-family: 'Roboto', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: var(--sidebar-bg);
  box-shadow: 2px 0 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 25px;
  margin-bottom: 30px;
}

.logo {
  width: 45px;
  height: 45px;
  margin-right: 15px;
}

.sidebar-header span {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.menu-label {
  color: var(--text-light);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 0 25px;
  margin: 20px 0 10px 0;
}

.main-menu ul, .support-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-menu ul li a, .support-menu ul li a {
  display: flex;
  align-items: center;
  padding: 14px 25px;
  color: var(--text-color) !important;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 4px 15px;
  border-radius: 8px;
  background: none;
}

.main-menu ul li a svg, .support-menu ul li a svg {
  margin-right: 15px;
  width: 20px;
  height: 20px;
  color: var(--text-light);
  transition: color 0.3s ease;
}

.main-menu ul li .router-link-exact-active, .support-menu ul li .router-link-exact-active {
  background: var(--active-menu-bg);
  color: var(--accent-color) !important;
}
.main-menu ul li .router-link-exact-active svg, .support-menu ul li .router-link-exact-active svg {
  color: var(--accent-color);
}

.main-menu ul li a:hover, .support-menu ul li a:hover,
.main-menu ul li a span, .support-menu ul li a span {
  color: var(--accent-color) !important;
}

.separator {
  border-bottom: 1px solid #F0F0F0;
  margin: 20px 25px;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-header {
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #EAEAEA;
}

.header-title {
  font-weight: 700;
  color: #444;
  font-size: 16px;
}

.content-area {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
}

.welcome-banner {
  background: #4A90E2;
  border-radius: 12px;
  padding: 30px 40px;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(135deg, #5DA0F2 0%, #4A90E2 100%);
  border-radius: 12px;
  z-index: 1;
}

.banner-text {
  position: relative;
  z-index: 2;
}

.banner-text h2 {
  font-family: 'Merriweather', serif;
  font-size: 30px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.banner-text p {
  font-family: 'Merriweather', serif;
  font-size: 20px;
  margin: 0;
  opacity: 0.9;
  font-weight: normal;
}

.banner-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
}

.shape-1 {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: -50px;
  right: 15%;
}

.shape-2 {
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 50px solid rgba(255, 255, 255, 0.15);
    top: 20%;
    right: 5%;
    transform: rotate(-30deg);
}

.shape-3 {
    width: 60px;
    height: 60px;
    top: 55%;
    right: 25%;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.shape-4 {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    top: 70%;
    right: 10%;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.widget-placeholder-1, .widget-placeholder-2 {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.widget-placeholder-1 img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.widget-placeholder-2 {
    background: #FFF8DC; /* Cornsilk for placeholder */
    font-size: 20px;
    font-weight: 700;
    color: #C8A464;
}

#current-time {
  background-color: #f0f4f8;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style> 