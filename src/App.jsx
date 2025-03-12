// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserHome from './pages/user/Home'; // อย่าลืม import หน้า Home ที่คุณสร้าง

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Protected Routes Components
import UserRoute from './components/common/UserRoute';



function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Protected Routes */}
          <Route element={<UserRoute />}>
            <Route path="/user" element={<UserHome />} />
            {/* เพิ่มเส้นทางอื่นๆ สำหรับผู้ใช้ */}
          </Route>
          
          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* เพิ่มเส้นทางอื่นๆ สำหรับผู้ดูแลระบบ */}
          </Route>
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;