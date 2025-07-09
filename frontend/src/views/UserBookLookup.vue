<template>
  <div class="book-lookup">
    <div class="borrowed-section">
      <h2>Sách bạn đã mượn</h2>
      <table class="book-table">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Ngày mượn</th>
            <th>Ngày trả dự kiến</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in borrowedBooks" :key="book.ID_phieu">
            <td>{{ book.ID }}</td>
            <td>{{ book.ten_sach }}</td>
            <td>{{ book.tac_gia }}</td>
            <td>{{ book.ngay_muon }}</td>
            <td>
              <span :class="{ 'overdue': isOverdue(book.ngay_tra_du_kien) }">
                {{ book.ngay_tra_du_kien }}
              </span>
            </td>
            <td>
              <span :class="{ 'overdue': isOverdue(book.ngay_tra_du_kien) }">
                {{ book.trang_thai }}
                <span v-if="isOverdue(book.ngay_tra_du_kien) && book.trang_thai === 'Đang mượn'" class="overdue-warning">
                  (Quá hạn)
                </span>
              </span>
            </td>
            <td>
              <button v-if="book.trang_thai === 'Đang mượn'" @click="traSach(book)">Trả sách</button>
              <span v-else-if="book.trang_thai === 'Chờ xác nhận trả'">Đang chờ xác nhận</span>
              <span v-else>Đã trả</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="borrowedBooks.length === 0">Bạn chưa mượn cuốn sách nào.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const borrowedBooks = ref([]);

const fetchBorrowedBooks = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user && user.ID ? user.ID : null;
  if (!userId) {
    borrowedBooks.value = [];
    return;
  }
  try {
    // Lấy tất cả phiếu mượn của user
    const res = await axios.get(`http://localhost:5000/api/borrow-tickets/user/${userId}`);
    const tickets = res.data;

    // Gom tất cả ID sách đã mượn
    let allBookIds = [];
    tickets.forEach(ticket => {
      allBookIds = allBookIds.concat(ticket.sach_muon);
    });
    // Loại bỏ trùng lặp
    allBookIds = [...new Set(allBookIds)];

    // Lấy thông tin chi tiết các sách (gọi tuần tự nếu chưa có API nhiều ID)
    const booksMap = {};
    for (const id of allBookIds) {
      try {
        const bookRes = await axios.get(`http://localhost:5000/api/books/${id}`);
        booksMap[id] = bookRes.data;
      } catch {}
    }

    // Map dữ liệu để hiển thị từng cuốn sách đã mượn
    borrowedBooks.value = [];
    tickets.forEach(ticket => {
      ticket.sach_muon.forEach(sachId => {
        const sach = booksMap[sachId] || {};
        borrowedBooks.value.push({
          ID: sach.ID || sachId,
          ten_sach: sach.ten_sach || '',
          tac_gia: sach.tac_gia || '',
          ngay_muon: ticket.ngay_muon,
          ngay_tra_du_kien: ticket.ngay_tra_du_kien,
          trang_thai: ticket.trang_thai,
          ID_phieu: ticket.ID_phieu
        });
      });
    });
  } catch (err) {
    borrowedBooks.value = [];
  }
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  return today > due;
};

const traSach = async (book) => {
  try {
    await axios.put(`http://localhost:5000/api/borrow-tickets/${book.ID_phieu}`, {
      trang_thai: 'Chờ xác nhận trả',
      ngay_tra: new Date().toISOString().slice(0,10)
    });
    alert('Yêu cầu trả sách đã gửi, vui lòng chờ admin xác nhận!');
    fetchBorrowedBooks();
  } catch (err) {
    alert('Có lỗi khi gửi yêu cầu trả sách!');
  }
};

onMounted(() => {
  fetchBorrowedBooks();
});
</script>

<style scoped>
.book-lookup {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 2rem;
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
.borrowed-section {
  margin-top: 2.5rem;
}
.overdue {
  color: #d32f2f;
  font-weight: bold;
}
.overdue-warning {
  color: #d32f2f;
  font-size: 0.9em;
  font-weight: bold;
}
</style> 