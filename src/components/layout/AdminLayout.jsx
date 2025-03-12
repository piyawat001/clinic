// src/components/layout/AdminLayout.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden" role="dialog" aria-modal="true">
          {/* Sidebar Backdrop */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">ปิดเมนู</span>
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-white">Medical Admin</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                <Link
                  to="/admin/dashboard"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    className="mr-4 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
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
                  แดชบอร์ด
                </Link>
                <Link
                  to="/admin/bookings"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive('/admin/bookings')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    className="mr-4 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
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
                  จัดการนัดหมาย
                </Link>
                <Link
                  to="/admin/users"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive('/admin/users')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    className="mr-4 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  จัดการผู้ใช้
                </Link>
                <Link
                  to="/admin/statistics"
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive('/admin/statistics')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    className="mr-4 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  สถิติ
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <div className="flex items-center">
                <div>
                  <div className="bg-indigo-800 rounded-full h-9 w-9 flex items-center justify-center text-white font-semibold">
                    {currentUser?.firstName?.charAt(0) || 'A'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-indigo-200 hover:text-white"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-indigo-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-white">Medical Admin</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  to="/admin/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
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
                  แดชบอร์ด
                </Link>
                <Link
                  to="/admin/bookings"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/bookings')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
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
                  จัดการนัดหมาย
                </Link>
                <Link
                  to="/admin/users"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/users')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  จัดการผู้ใช้
                </Link>
                <Link
                  to="/admin/statistics"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/statistics')
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                >
                  <svg
                    className="mr-3 h-6 w-6 text-indigo-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  สถิติ
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="bg-indigo-800 rounded-full h-9 w-9 flex items-center justify-center text-white font-semibold">
                      {currentUser?.firstName?.charAt(0) || 'A'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-indigo-200 hover:text-white"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">เปิดเมนู</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                {isActive('/admin/dashboard') && 'แดชบอร์ด'}
                {isActive('/admin/bookings') && 'จัดการนัดหมาย'}
                {isActive('/admin/users') && 'จัดการผู้ใช้'}
                {isActive('/admin/statistics') && 'สถิติ'}
              </h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;