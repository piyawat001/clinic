// src/pages/user/BookingHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
// นำเข้า BookingDetailsModal component
import BookingDetailsModal from '../../components/common/BookingDetailsModal';
// นำเข้าฟังก์ชันจัดรูปแบบจากไฟล์ utility
import { formatThaiDate, formatTime, getStatusInfo } from '../../utils/formatters';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'
  
  // State สำหรับ modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/bookings');
        
        if (response.data && Array.isArray(response.data)) {
          // Sort bookings by date (newest first)
          const sortedBookings = response.data.sort((a, b) => {
            return new Date(b.appointmentDate) - new Date(a.appointmentDate);
          });
          
          setBookings(sortedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('ไม่สามารถโหลดข้อมูลการจองได้');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status !== 'cancelled' && bookingDate >= today;
    if (activeTab === 'past') return booking.status !== 'cancelled' && bookingDate < today;
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    
    return true;
  });

  // อัพเดตรายการเมื่อมีการยกเลิกการจอง
  const handleCancelSuccess = (cancelledBookingId) => {
    // กรองรายการที่ยกเลิกออกจากหน้าจอทันที
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking._id === cancelledBookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
  };

  // เปิด Modal แสดงรายละเอียดการจอง
  const handleViewBookingDetails = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-green-50 pb-6">
      {/* Header */}
      <div className="bg-teal-700 p-4 flex items-center">
        <Link to="/user/profile" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white text-lg font-medium ml-4">ประวัติการจอง</h1>
      </div>

      {/* Tab navigation */}
      <div className="bg-white p-2 shadow-sm">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeTab === 'all'
                ? 'font-medium text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-600'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'font-medium text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-600'
            }`}
          >
            กำลังจะมาถึง
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeTab === 'past'
                ? 'font-medium text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-600'
            }`}
          >
            ที่ผ่านมา
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeTab === 'cancelled'
                ? 'font-medium text-teal-700 border-b-2 border-teal-700'
                : 'text-gray-600'
            }`}
          >
            ยกเลิก
          </button>
        </div>
      </div>

      {/* Booking list */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center my-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">ไม่พบข้อมูลการจอง</h3>
            <p className="text-gray-600 mb-4">ยังไม่มีประวัติการจองในหมวดหมู่นี้</p>
            <Link 
              to="/user/booking" 
              className="inline-block bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition"
            >
              จองคิวใหม่
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          วันที่: {formatThaiDate(booking.appointmentDate)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          เวลา: {formatTime(booking.appointmentTime)} น.
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm text-gray-600">อาการเบื้องต้น:</h4>
                      <p className="text-gray-800">
                        {booking.initialSymptoms || booking.symptoms || 'ไม่ได้ระบุ'}
                      </p>
                    </div>
                    
                    {booking.adminNotes && (
                      <div className="mb-3">
                        <h4 className="text-sm text-gray-600">บันทึกจากแพทย์:</h4>
                        <p className="text-gray-800">{booking.adminNotes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleViewBookingDetails(booking._id)}
                        className="text-blue-600 text-sm font-medium"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Component */}
      <BookingDetailsModal
        bookingId={selectedBookingId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancelSuccess={handleCancelSuccess}
      />
    </div>
  );
};

export default BookingHistory;