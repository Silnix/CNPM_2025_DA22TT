<template>
  <div>
    <h2>Danh sách phản hồi của người dùng</h2>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <table v-else class="support-table">
      <thead>
        <tr>
          <th>Tiêu đề</th>
          <th>Nội dung</th>
          <th>Ngày gửi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in supports" :key="item._id">
          <td>{{ item.title }}</td>
          <td>{{ item.content }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="!supports.length && !loading">Chưa có phản hồi nào.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios'

const supports = ref([]);
const loading = ref(true);

const fetchSupports = async () => {
  loading.value = true;
  try {
    const res = await api.get('/support');
    supports.value = res.data;
  } catch (err) {
    supports.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN');
};

onMounted(fetchSupports);
</script>

<style scoped>
.support-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.support-table th, .support-table td {
  border: 1px solid #eee;
  padding: 0.5rem 0.7rem;
  text-align: left;
}
.support-table th {
  background: #f5f5f5;
}
</style> 