<template>
  <div>
    <h2>Danh sách Quản trị viên (loại 1)</h2>
    <table v-if="users.length" class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Email</th>
          <th>Loại</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.ID">
          <td>{{ user.ID }}</td>
          <td>{{ user.ho_ten }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.loai }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>Không có quản trị viên nào.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const users = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('/users');
    users.value = res.data.filter(u => u.loai === '1' || u.loai === 1);
  } catch (err) {
    users.value = [];
  }
});
</script>

<style scoped>
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}
.admin-table th, .admin-table td {
  border: 1px solid #eee;
  padding: 0.5rem 0.8rem;
  text-align: left;
}
.admin-table th {
  background: #f5f5f5;
}
</style> 