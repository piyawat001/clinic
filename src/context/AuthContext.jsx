// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          // Set auth header for all subsequent requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Fetch user profile
          getUserProfile();
        } else {
          // Token expired
          localStorage.removeItem('token');
          setCurrentUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setCurrentUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const getUserProfile = async () => {
    try {
      const response = await axios.get('/users/profile');
      
      // เพิ่มบรรทัดนี้เพื่อเก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      setCurrentUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user profile
      const profileResponse = await axios.get('/users/profile');
      
      // เพิ่มบรรทัดนี้เพื่อเก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem('userInfo', JSON.stringify(profileResponse.data));
      
      setCurrentUser(profileResponse.data);
      
      // Determine if user is admin
      const isAdmin = profileResponse.data.role === 'admin';
      
      return { 
        success: true,
        isAdmin
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // เพิ่มบรรทัดนี้
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/users/profile', profileData);
      setCurrentUser(prev => ({ ...prev, ...response.data }));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์'
      };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await axios.put('/users/change-password', passwordData);
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};