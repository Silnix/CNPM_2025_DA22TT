  <template>
  <div class="admin-stats">
    <div class="header">
      <h2>Thống kê hệ thống</h2>
      <button @click="refreshStats" :disabled="loading" class="refresh-btn">
        {{ loading ? 'Đang tải...' : 'Làm mới' }}
      </button>
    </div>

    <!-- Thống kê tổng quan -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ overview.totalUsers || 0 }}</h3>
          <p>Độc giả</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>{{ overview.totalBooks || 0 }}</h3>
          <p>Sách</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📖</div>
        <div class="stat-content">
          <h3>{{ overview.totalBorrows || 0 }}</h3>
          <p>Lượt mượn</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📂</div>
        <div class="stat-content">
          <h3>{{ overview.totalCategories || 0 }}</h3>
          <p>Danh mục</p>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="charts-container">
      <!-- Biểu đồ đăng ký theo tháng -->
      <div class="chart-card">
        <h3>Đăng ký độc giả theo tháng ({{ currentYear }})</h3>
        <div class="chart-wrapper">
          <canvas ref="registrationChart"></canvas>
        </div>
      </div>

      <!-- Biểu đồ mượn sách theo tháng -->
      <div class="chart-card">
        <h3>Lượt mượn sách theo tháng ({{ currentYear }})</h3>
        <div class="chart-wrapper">
          <canvas ref="borrowChart"></canvas>
        </div>
      </div>

      <!-- Biểu đồ sách theo danh mục -->
      <div class="chart-card">
        <h3>Phân bố sách theo danh mục</h3>
        <div class="chart-wrapper">
          <canvas ref="categoryChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '@/api/axios'
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const loading = ref(false);
const overview = ref({});
const registrationData = ref([]);
const borrowData = ref([]);
const categoryData = ref([]);
const currentYear = new Date().getFullYear();

// Chart references
const registrationChart = ref(null);
const borrowChart = ref(null);
const categoryChart = ref(null);

// Chart instances
let registrationChartInstance = null;
let borrowChartInstance = null;
let categoryChartInstance = null;

const refreshStats = async () => {
  loading.value = true;
  try {
    // Lấy thống kê tổng quan
    const overviewRes = await api.get('/stats/overview');
    overview.value = overviewRes.data;

    // Lấy thống kê đăng ký
    const registrationRes = await api.get('/stats/registrations');
    registrationData.value = registrationRes.data;

    // Lấy thống kê mượn sách
    const borrowRes = await api.get('/stats/borrows');
    borrowData.value = borrowRes.data;

    // Lấy thống kê sách theo danh mục
    const categoryRes = await api.get('/stats/books-by-category');
    categoryData.value = categoryRes.data;

    // Vẽ lại biểu đồ
    await nextTick();
    createCharts();
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
  } finally {
    loading.value = false;
  }
};

const createCharts = () => {
  // Biểu đồ đăng ký (Line Chart)
  if (registrationChartInstance) {
    registrationChartInstance.destroy();
  }
  
  registrationChartInstance = new Chart(registrationChart.value, {
    type: 'line',
    data: {
      labels: registrationData.value.map(item => item.monthName),
      datasets: [{
        label: 'Số lượng đăng ký',
        data: registrationData.value.map(item => item.count),
        borderColor: '#6C82BE',
        backgroundColor: 'rgba(108, 130, 190, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

  // Biểu đồ mượn sách (Bar Chart)
  if (borrowChartInstance) {
    borrowChartInstance.destroy();
  }
  
  borrowChartInstance = new Chart(borrowChart.value, {
    type: 'bar',
    data: {
      labels: borrowData.value.map(item => item.monthName),
      datasets: [{
        label: 'Lượt mượn',
        data: borrowData.value.map(item => item.count),
        backgroundColor: '#28a745',
        borderColor: '#218838',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

  // Biểu đồ danh mục (Doughnut Chart)
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }
  
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ];
  
  categoryChartInstance = new Chart(categoryChart.value, {
    type: 'doughnut',
    data: {
      labels: categoryData.value.map(item => item.category),
      datasets: [{
        data: categoryData.value.map(item => item.count),
        backgroundColor: colors.slice(0, categoryData.value.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
};

onMounted(() => {
  refreshStats();
});
</script>

<style scoped>
.admin-stats {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: #333;
  margin: 0;
}

.refresh-btn {
  padding: 8px 16px;
  background: #6C82BE;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a6fa8;
}

.refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #333;
  font-weight: 700;
}

.stat-content p {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart-card h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
  
  .stat-content h3 {
    font-size: 1.5rem;
  }
}
</style> 