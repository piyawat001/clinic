// src/components/common/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../layout/AdminLayout';

const AdminRoute = () => {
  const { currentUser, loading, isAdmin } = useAuth();

  // Show loading spinner if still checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated or not admin
  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes wrapped in admin layout if authenticated and admin
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRoute;