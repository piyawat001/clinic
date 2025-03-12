// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Home from './pages/user/Home';
import UserLayout from './components/layout/UserLayout';
import BookingForm from './pages/user/BookingForm';

// User Profile Pages
import UserProfile from './pages/user/UserProfile';
import PersonalInfo from './pages/user/PersonalInfo';
import ChangePassword from './pages/user/ChangePassword';
import BookingHistory from './pages/user/BookingHistory';

// Protected Routes Components
import UserRoute from './components/common/UserRoute';
import AdminRoute from './components/common/AdminRoute';

// Admin Pages - อาจยังใช้ placeholder ชั่วคราว
const AdminDashboard = () => <div className="p-4">หน้าแดชบอร์ดผู้ดูแลระบบ - กำลังพัฒนา</div>;

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
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="booking" element={<BookingForm />} />
              
              {/* Profile Routes */}
              <Route path="profile" element={<UserProfile />} />
              <Route path="personal-info" element={<PersonalInfo />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="booking-history" element={<BookingHistory />} />
            </Route>
            <Route path="/" element={<Navigate to="/user" replace />} />
          </Route>
          
          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;