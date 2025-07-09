<template>
  <div class="admin-profile">
    <div class="header">
      <h2>Danh sách người dùng (loại: Độc giả)</h2>
      <button @click="fetchUsers" :disabled="loading" class="refresh-btn">
        {{ loading ? 'Đang tải...' : 'Làm mới' }}
      </button>
    </div>
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
          <th>Thao tác</th>
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
          <td>
            <button @click="editUser(user)" class="edit-btn">Sửa</button>
            <button @click="deleteUser(user.ID)" class="delete-btn">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!users.length && !loading">Không có người dùng loại 2 nào.</div>

    <!-- Modal sửa user -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>Sửa thông tin người dùng</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>ID:</label>
            <input v-model="editingUser.ID" disabled />
          </div>
          <div class="form-group">
            <label>Tên đăng nhập:</label>
            <input v-model="editingUser.username" disabled />
          </div>
          <div class="form-group">
            <label>Họ tên:</label>
            <input v-model="editingUser.ho_ten" required />
          </div>
          <div class="form-group">
            <label>Địa chỉ:</label>
            <input v-model="editingUser.dia_chi" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editingUser.email" type="email" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Lưu</button>
            <button type="button" @click="closeEditModal" class="cancel-btn">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const loading = ref(true);
const showEditModal = ref(false);
const editingUser = ref({});

const fetchUsers = async () => {
  loading.value = true;
  try {
    // Sử dụng API riêng để lấy chỉ users loại 2
    const res = await axios.get('http://localhost:5000/api/users/readers');
    console.log('API Response:', res.data); // Debug log
    users.value = res.data.users || [];
    console.log('Users loại 2:', users.value); // Debug log
  } catch (err) {
    console.error('Lỗi khi fetch users:', err);
    users.value = [];
  } finally {
    loading.value = false;
  }
};

const editUser = (user) => {
  editingUser.value = { ...user };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingUser.value = {};
};

const saveUser = async () => {
  try {
    const res = await axios.put(`http://localhost:5000/api/users/${editingUser.value.ID}`, {
      ho_ten: editingUser.value.ho_ten,
      dia_chi: editingUser.value.dia_chi,
      email: editingUser.value.email
    });
    
    alert(res.data.message);
    closeEditModal();
    fetchUsers(); // Refresh danh sách
  } catch (err) {
    alert(err.response?.data?.message || 'Lỗi khi cập nhật người dùng');
  }
};

const deleteUser = async (userId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    return;
  }
  
  try {
    const res = await axios.delete(`http://localhost:5000/api/users/${userId}`);
    alert(res.data.message);
    fetchUsers(); // Refresh danh sách
  } catch (err) {
    alert(err.response?.data?.message || 'Lỗi khi xóa người dùng');
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.admin-profile {
  max-width: 1200px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.profile-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.profile-table th, .profile-table td {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}

.profile-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.edit-btn, .delete-btn {
  padding: 4px 8px;
  margin: 0 2px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background: #28a745;
  color: white;
}

.edit-btn:hover {
  background: #218838;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:disabled {
  background: #f5f5f5;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.save-btn, .cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn {
  background: #28a745;
  color: white;
}

.save-btn:hover {
  background: #218838;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
}
</style> 