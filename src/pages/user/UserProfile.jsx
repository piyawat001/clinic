// src/pages/user/UserProfile.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('ออกจากระบบสำเร็จ');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  // Get first character of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'ศ';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-teal-700 to-teal-200">
      {/* Header with back button and logo */}
      <div className="bg-teal-700 p-4 flex items-center relative">
        <Link to="/user" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="bg-white p-2 rounded-lg">
            <img src="/src/assets/firstimg.png" alt="Logo" className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Profile info */}
      <div className="flex flex-col items-center py-6">
        <div className="bg-blue-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
          <span className="text-2xl font-semibold">
            {getInitial(currentUser?.firstName)}
          </span>
        </div>
        <h2 className="text-xl font-medium text-gray-800">
          {currentUser?.firstName} {currentUser?.lastName}
        </h2>
        <p className="text-gray-500">{currentUser?.email}</p>
      </div>

      {/* Profile options */}
      <div className="flex-1 bg-white rounded-t-3xl overflow-hidden">
        <div className="p-4 text-gray-500 border-b border-gray-200">
          การตั้งค่าบัญชี
        </div>

        {/* Booking history */}
        <Link to="/user/booking-history" className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>ประวัติการจองของฉัน</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Personal info */}
        <Link to="/user/personal-info" className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span>ข้อมูลส่วนตัว</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Change password */}
        <Link to="/user/change-password" className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <span>เปลี่ยนรหัสผ่าน</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-4 text-red-500"
        >
          <div className="p-2 rounded-full bg-red-100 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;