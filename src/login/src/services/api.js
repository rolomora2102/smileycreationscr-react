import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://smileycreationscr.com/api' : 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;