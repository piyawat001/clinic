// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ส่วนของผู้ดูแลระบบ
import Dashboard from "./pages/admin/Dashboard";
import Bookings from "./pages/admin/Bookings";
import Users from "./pages/admin/Users";
import Statistics from "./pages/admin/Statistics";

// User Pages
import Home from "./pages/user/Home";
import UserLayout from "./components/layout/UserLayout";
import BookingForm from "./pages/user/BookingForm";

// User Profile Pages
import UserProfile from "./pages/user/UserProfile";
import PersonalInfo from "./pages/user/PersonalInfo";
import ChangePassword from "./pages/user/ChangePassword";
import BookingHistory from "./pages/user/BookingHistory";

// Protected Routes Components
import UserRoute from "./components/common/UserRoute";
import AdminRoute from "./components/common/AdminRoute";

import ArticlesPage from "./pages/user/ArticlesPage";
import ArticleDetail from "./pages/user/ArticleDetail";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* หน้าสำหรับผู้ดูแลระบบ */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<Users />} />
            <Route path="statistics" element={<Statistics />} />
            <Route index element={<Navigate to="/admin/dashboard" />} />
          </Route>

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
              
              {/* Articles Routes - เพิ่มตรงนี้ */}
              <Route path="articles" element={<ArticlesPage />} />
              
            </Route>
            <Route path="/" element={<Navigate to="/user" replace />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;