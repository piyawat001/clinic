// src/components/layout/UserLayout.jsx
import { Link, Outlet, useLocation } from 'react-router-dom';

const UserLayout = () => {
  const location = useLocation();
  
  // Check active route for highlighting current tab
  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* เริ่มหน้าเว็บโดยไม่มี header */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-50">
        <div className="flex justify-around">
          <Link
            to="/user"
            className={`flex flex-col items-center py-3 px-1 ${
              isActiveRoute('/user') && 
              !location.pathname.includes('/user/booking') && 
              !location.pathname.includes('/user/profile') && 
              !location.pathname.includes('/user/personal-info') && 
              !location.pathname.includes('/user/change-password') && 
              !location.pathname.includes('/user/booking-history')
                ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1">หน้าหลัก</span>
          </Link>
          <Link
            to="/user/booking"
            className={`flex flex-col items-center py-3 px-1 ${
              isActiveRoute('/user/booking') && !location.pathname.includes('booking-history') 
                ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs mt-1">นัดหมาย</span>
          </Link>
          <Link
            to="/user/profile"
            className={`flex flex-col items-center py-3 px-1 ${
              isActiveRoute('/user/profile') || 
              isActiveRoute('/user/personal-info') || 
              isActiveRoute('/user/change-password') ||
              isActiveRoute('/user/booking-history')
                ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1">โปรไฟล์</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;