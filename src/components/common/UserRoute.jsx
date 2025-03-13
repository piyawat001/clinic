// src/components/common/UserRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import UserLayout from '../layout/UserLayout';

const UserRoute = () => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  // Add debug log to check user info
  console.log("UserRoute check:", { currentUser, isAdmin, userRole: currentUser?.role, userIsAdmin: currentUser?.isAdmin });

  // Show loading spinner if still checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect admin users to admin dashboard
  // เพิ่มการตรวจสอบเพื่อป้องกันผู้ดูแลเข้าถึงหน้าผู้ใช้ทั่วไป
  if (isAdmin || currentUser.isAdmin || currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Render child routes wrapped in user layout if authenticated and not admin
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
};

export default UserRoute;