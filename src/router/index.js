import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '@/views/Register.vue';


const routes = [
  { path: '/', redirect: '/login' }, // Redirect đến trang login khi vào đường dẫn gốc
  { path: '/login', component: Login }, // Trang đăng nhập
  { path: '/register', component: Register }, // Trang đăng ký
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
