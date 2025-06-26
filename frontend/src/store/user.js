import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(username, password) {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      this.token = res.data.token;
      localStorage.setItem('token', res.data.token);
    },
    async register(username, password) {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});
