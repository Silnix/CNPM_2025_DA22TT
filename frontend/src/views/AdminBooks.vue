<template>
  <div class="admin-books">
    <h2>Quản lý Sách</h2>
    <div class="actions">
      <button @click="showAddForm = true">Thêm sách mới</button>
    </div>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <table v-else class="book-table">
      <thead>
        <tr>
          <th>Mã sách</th>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Năm xuất bản</th>
          <th>Ngôn ngữ</th>
          <th>Thể loại</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.ID">
          <td>{{ book.ID }}</td>
          <td>{{ book.ten_sach }}</td>
          <td>{{ book.tac_gia }}</td>
          <td>{{ book.nam_xuat_ban }}</td>
          <td>{{ book.ngon_ngu }}</td>
          <td>{{ book.danh_muc }}</td>
          <td>{{ book.trang_thai }}</td>
          <td>
            <button @click="editBook(book)">Sửa</button>
            <button @click="deleteBook(book.ID)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Form thêm/sửa sách -->
    <div v-if="showAddForm || editingBook" class="modal">
      <div class="modal-content">
        <h3>{{ editingBook ? 'Sửa sách' : 'Thêm sách mới' }}</h3>
        <form @submit.prevent="saveBook" class="two-col-form">
          <div class="form-left">
            <div class="form-group">
              <label>Mã sách</label>
              <input v-model="form.ID" required />
            </div>
            <div class="form-group">
              <label>Tên sách</label>
              <input v-model="form.ten_sach" required />
            </div>
            <div class="form-group">
              <label>Tác giả</label>
              <input v-model="form.tac_gia" required />
            </div>
            <div class="form-group">
              <label>Năm xuất bản</label>
              <input v-model.number="form.nam_xuat_ban" type="number" required />
            </div>
            <div class="form-group">
              <label>Ngôn ngữ</label>
              <input v-model="form.ngon_ngu" required />
            </div>
            <div class="form-group">
              <label>Thể loại</label>
              <input v-model="form.danh_muc" required />
            </div>
            <div class="form-group">
              <label>ID danh mục</label>
              <input v-model="form.ID_danh_muc" required />
            </div>
            <div class="form-group">
              <label>Vị trí</label>
              <input v-model="form.vi_tri" />
            </div>
          </div>
          <div class="form-right">
            <div class="form-group">
              <label>ID người thêm</label>
              <input v-model="form.id_nguoi_them" />
            </div>
            <div class="form-group">
              <label>Ngày thêm</label>
              <input v-model="form.ngay_them" type="date" />
            </div>
            <div class="form-group">
              <label>Link ảnh bìa (URL)</label>
              <input v-model="form.anh_bia" />
            </div>
            <div class="form-group image-preview-group">
              <label>Ảnh bìa hiện tại</label>
              <div class="image-preview">
                <img v-if="form.anh_bia" :src="form.anh_bia" alt="Ảnh bìa sách" />
                <span v-else>Chưa có ảnh</span>
              </div>
            </div>
            <div class="form-group">
              <label>Số lượng</label>
              <input v-model.number="form.so_luong" type="number" required />
            </div>
            <div class="form-actions">
              <button type="submit">Lưu</button>
              <button type="button" @click="closeForm">Hủy</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios'

const books = ref([]);
const loading = ref(false);
const showAddForm = ref(false);
const editingBook = ref(null);
const message = ref('');
const form = ref({
  ID: '',
  ten_sach: '',
  tac_gia: '',
  nam_xuat_ban: '',
  ngon_ngu: '',
  danh_muc: '',
  ID_danh_muc: '',
  vi_tri: '',
  id_nguoi_them: '',
  ngay_them: '',
  anh_bia: '',
  so_luong: ''
});

const fetchBooks = async () => {
  loading.value = true;
  try {
    const res = await api.get('/books')
    books.value = res.data;
  } catch (err) {
    books.value = [];
  } finally {
    loading.value = false;
  }
};

const saveBook = async () => {
  try {
    if (editingBook.value) {
	  await api.put(`/books/${form.value._id}`, form.value)
      message.value = 'Cập nhật sách thành công!';
    } else {
      form.value.ID = 'S' + Date.now();
      await api.post('/books', form.value);
      message.value = 'Thêm sách mới thành công!';
    }
    closeForm();
    fetchBooks();
  } catch (err) {
    message.value = 'Lưu sách thất bại!';
  }
};

const editBook = (book) => {
  editingBook.value = true;
  showAddForm.value = false;
  form.value = { ...book };
};

const deleteBook = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa sách này?')) return;
  try {
    await api.delete(`/books/${id}`);
    message.value = 'Xóa sách thành công!';
    fetchBooks();
  } catch (err) {
    message.value = 'Xóa sách thất bại!';
  }
};

const closeForm = () => {
  showAddForm.value = false;
  editingBook.value = null;
  form.value = {
    ID: '', ten_sach: '', tac_gia: '', nam_xuat_ban: '', ngon_ngu: '', danh_muc: '', ID_danh_muc: '', vi_tri: '', id_nguoi_them: '', ngay_them: '', anh_bia: '', so_luong: ''
  };
};

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.admin-books {
  max-width: 1000px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
}
.actions {
  margin-bottom: 1rem;
}
.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.book-table th, .book-table td {
  border: 1px solid #eee;
  padding: 0.5rem 0.7rem;
  text-align: left;
}
.book-table th {
  background: #f5f5f5;
}
button {
  margin-right: 0.5rem;
  padding: 0.3rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}
button:last-child {
  background: #dc3545;
}
.modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 600px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  margin: 0 auto;
}
.message {
  margin-top: 1rem;
  color: #007bff;
  font-weight: 500;
}
.vertical-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-weight: 500;
  margin-bottom: 2px;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  justify-content: flex-end;
}
.two-col-form {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
}
.form-left, .form-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.image-preview-group {
  align-items: flex-start;
}
.image-preview {
  min-height: 120px;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px dashed #ccc;
  border-radius: 6px;
  padding: 8px;
  background: #fafafa;
}
.image-preview img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 4px;
  object-fit: contain;
}
@media (max-width: 900px) {
  .modal-content {
    min-width: 0;
    max-width: 98vw;
    padding: 1rem;
  }
  .two-col-form {
    flex-direction: column;
    gap: 1.2rem;
  }
}
</style> 