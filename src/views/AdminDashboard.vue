<template>
  <div class="dashboard-content">
    <div class="welcome-banner">
      <div class="banner-text">
        <h2>CHÀO MỪNG QUẢN TRỊ VIÊN ĐẾN</h2>
        <p>Hệ thống quản lý thư viện</p>
      </div>
      <div class="banner-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="dashboard-grid">
        <div class="widget-placeholder-1">
          <img src="@/assets/anh_banner_nuatren.png" alt="Banner sach">
        </div>
        <div class="widget-placeholder-2">
          <p>BANNER QUẢNG CÁO</p>
        </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dashboard-content {
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
    background: #FFF8DC;
    font-size: 20px;
    font-weight: 700;
    color: #C8A464;
}
</style> 