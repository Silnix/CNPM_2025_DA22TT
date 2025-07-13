import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '@/views/Register.vue';
import UserHome from '@/views/UserHome.vue';
import UserSupport from '../views/UserSupport.vue';
import AdminHome from '../views/AdminHome.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AdminSearch from '../views/AdminSearch.vue';
import AdminBooks from '../views/AdminBooks.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Redirect đến trang login khi vào đường dẫn gốc
  { path: '/login', component: Login }, // Trang đăng nhập
  { path: '/register', component: Register }, // Trang đăng ký
  { path: '/user-home', component: UserHome }, // Trang chủ người dùng
  { path: '/user-search', component: () => import('@/views/UserSearch.vue') },
  { path: '/user-book-lookup', component: () => import('@/views/UserBookLookup.vue') },
  { path: '/user-borrow-request', component: () => import('@/views/UserBorrowRequest.vue') },
  { path: '/user-support', component: UserSupport },
  { path: '/user-settings', component: () => import('../views/UserSettings.vue') },
  { path: '/test', component: { template: '<div>Test Page</div>' } },
  {
    path: '/admin',
    component: AdminHome,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'search', name: 'AdminSearch', component: AdminSearch },
      { path: 'books', name: 'AdminBooks', component: AdminBooks },
      { path: 'profile', name: 'AdminProfile', component: () => import('@/views/AdminProfile.vue') },
      { path: 'stats', name: 'AdminStats', component: () => import('@/views/AdminStats.vue') },
      { path: 'settings', name: 'AdminSettings', component: () => import('@/views/AdminSettings.vue') },
      { path: 'support', name: 'AdminSupport', component: () => import('@/views/AdminSupport.vue') },
    ]
  },
  { 
    path: '/admin-home', 
    redirect: '/admin/dashboard' 
  },
  { path: '/book/:id', name: 'BookDetail', component: () => import('@/views/BookDetail.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
