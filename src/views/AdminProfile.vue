<template>
  <div class="admin-profile">
    <h2>Danh sách người dùng (loại: Độc giả)</h2>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <table v-else class="profile-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên đăng nhập</th>
          <th>Họ tên</th>
          <th>Địa chỉ</th>
          <th>Email</th>
          <th>Loại tài khoản</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.ID">
          <td>{{ user.ID }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.ho_ten }}</td>
          <td>{{ user.dia_chi }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.loai == 1 ? 'Quản trị viên' : 'Độc giả' }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="!users.length && !loading">Không có người dùng loại 2 nào.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:5000/api/users');
    users.value = res.data.filter(u => u.loai == 2);
  } catch (err) {
    users.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.admin-profile {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}
.profile-table {
  width: 100%;
  border-collapse: collapse;
}
.profile-table th, .profile-table td {
  text-align: left;
  padding: 8px 12px;
}
.profile-table th {
  background: #f5f5f5;
}
</style> 