// src/config/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response && response.status === 401) {
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
    } else if (response) {
      // Handle other errors
      const message = response.data?.message || 'เกิดข้อผิดพลาด';
      toast.error(message);
    } else {
      // Network error
      toast.error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
    
    return Promise.reject(error);
  }
);

export default instance;