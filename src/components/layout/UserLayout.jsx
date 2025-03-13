// src/components/layout/UserLayout.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import socket from '../../socket'; // สร้างไฟล์นี้แยกต่างหาก

const UserLayout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [notification, setNotification] = useState(null);
  
  // ลงทะเบียนและรับการแจ้งเตือนจาก Socket.IO
  useEffect(() => {
    if (currentUser && currentUser._id) {
      // ลงทะเบียน socket กับ user ID เมื่อ login
      socket.emit('register_user', currentUser._id);
      
      // รับการแจ้งเตือนเมื่อถูกเรียกคิว
      socket.on('queue_called', (data) => {
        console.log('Queue called notification received:', data);
        
        // แสดงการแจ้งเตือน
        setNotification(data);
        
        // แสดง toast notification
        toast.info(data.message, {
          position: "top-center",
          autoClose: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // เล่นเสียงแจ้งเตือน (ถ้ามีไฟล์เสียง)
        try {
          const audio = new Audio('/notification.mp3');
          audio.play();
        } catch (error) {
          console.error('Error playing notification sound:', error);
        }
      });
    }
    
    // ทำความสะอาด listener เมื่อ component unmount
    return () => {
      socket.off('queue_called');
    };
  }, [currentUser]);
  
  // Check active route for highlighting current tab
  const isActiveRoute = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* แสดงการแจ้งเตือนเมื่อถูกเรียกคิว */}
      {notification && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-full max-w-sm z-50 animate-bounce">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <div className="font-bold">ถึงคิวของคุณแล้ว</div>
                <div className="text-sm">กรุณาเข้าพบแพทย์</div>
              </div>
            </div>
            <button onClick={() => setNotification(null)} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* เริ่มหน้าเว็บโดยไม่มี header */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-40">
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