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

    <div class="shift-table-wrapper">
      <table class="shift-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Ca Sáng</th>
            <th>Ca Chiều</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in shifts" :key="row.day">
            <td>{{ row.day }}</td>
            <td @click="editCell(idx, 'morning')">
              <template v-if="editing.row === idx && editing.col === 'morning'">
                <input v-model="editValue" @blur="saveEdit(idx, 'morning')" @keyup.enter="saveEdit(idx, 'morning')" />
              </template>
              <template v-else>
                {{ row.morning }}
              </template>
            </td>
            <td @click="editCell(idx, 'afternoon')">
              <template v-if="editing.row === idx && editing.col === 'afternoon'">
                <input v-model="editValue" @blur="saveEdit(idx, 'afternoon')" @keyup.enter="saveEdit(idx, 'afternoon')" />
              </template>
              <template v-else>
                {{ row.afternoon }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const shifts = ref([
  { day: 'Thứ 2', morning: 'Long', afternoon: 'Phúc' },
  { day: 'Thứ 3', morning: 'Khoa', afternoon: 'Phúc' },
  { day: 'Thứ 4', morning: 'Phúc', afternoon: 'Khoa' },
  { day: 'Thứ 5', morning: 'Long', afternoon: 'Khoa' },
  { day: 'Thứ 6', morning: 'Khoa', afternoon: 'Long' },
  { day: 'Thứ 7', morning: 'Long', afternoon: 'Phúc' },
  { day: 'Chủ nhật', morning: 'Phúc', afternoon: 'Long' },
]);

const editing = ref({ row: null, col: null });
const editValue = ref('');

function editCell(rowIdx, col) {
  editing.value = { row: rowIdx, col };
  editValue.value = shifts.value[rowIdx][col];
}

function saveEdit(rowIdx, col) {
  if (editValue.value.trim() !== '') {
    shifts.value[rowIdx][col] = editValue.value.trim();
  }
  editing.value = { row: null, col: null };
}
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

.shift-table-wrapper {
  margin-top: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  padding: 20px;
}

.shift-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
}

.shift-table th, .shift-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  text-align: center;
}

.shift-table th {
  background: #f5f5f5;
  font-weight: 700;
}

.shift-table td {
  cursor: pointer;
  min-width: 120px;
}

.shift-table input {
  width: 100%;
  font-size: 18px;
  padding: 6px 8px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
}
</style> 