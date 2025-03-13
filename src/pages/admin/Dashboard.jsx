// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  // State สำหรับเก็บข้อมูลสถิติ
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    todayBookings: 0,
    pendingBookings: 0,
    successBookings: 0,
    cancelledBookings: 0,
    totalBookings: 0
  });
  
  // State สำหรับเก็บข้อมูลการนัดหมายล่าสุด
  const [recentBookings, setRecentBookings] = useState([]);
  
  // State สำหรับ loading
  const [loading, setLoading] = useState(true);
  
  // ดึงข้อมูลสถิติและการนัดหมายล่าสุดเมื่อหน้าโหลด
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ดึงข้อมูลสถิติ
        const statsResponse = await axios.get('/admin/statistics');
        setStatistics(statsResponse.data);
        
        // ดึงข้อมูลการนัดหมายล่าสุด (เรียงตามวันที่ล่าสุด, จำกัด 10 รายการ)
        const bookingsResponse = await axios.get('/admin/bookings');
        
        // จัดเรียงข้อมูลตามวันที่ล่าสุดและเวลา
        const sortedBookings = bookingsResponse.data.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
          return dateA - dateB;
        });
        
        // เก็บเฉพาะ 10 รายการล่าสุด
        setRecentBookings(sortedBookings.slice(0, 10));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // ฟังก์ชันสำหรับการอัพเดทสถานะการนัดหมาย
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`/admin/bookings/${bookingId}`, { status: newStatus });
      
      // อัพเดทข้อมูลใน state โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
      setRecentBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      toast.success('อัพเดทสถานะสำเร็จ');
      
      // อัพเดทสถิติด้วย
      const statsResponse = await axios.get('/admin/statistics');
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('ไม่สามารถอัพเดทสถานะได้');
    }
  };
  
  // ฟังก์ชันสำหรับการเรียกคิวผู้ป่วย
  const handleCallUser = async (bookingId) => {
    try {
      const now = new Date();
      await axios.put(`/admin/bookings/${bookingId}/call`, { 
        callTime: now.toISOString() // แปลงเป็น ISO string
      });
      
      // อัพเดทข้อมูลใน state โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
      setRecentBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'success', callTime: now } 
            : booking
        )
      );
      
      toast.success('เรียกผู้ป่วยสำเร็จ');
      
      // อัพเดทสถิติด้วย
      const statsResponse = await axios.get('/admin/statistics');
      setStatistics(statsResponse.data);
    } catch (error) {
      console.error('Error calling user:', error);
      toast.error('ไม่สามารถเรียกผู้ป่วยได้');
      // ลอง log รายละเอียดข้อผิดพลาดเพิ่มเติม
      console.error('Error details:', error.response?.data);
    }
  };
  
  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  };
  
  // แสดง component สำหรับ loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // กำหนด CSS class สำหรับแสดงสถานะต่างๆ
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // กำหนดข้อความสำหรับแสดงสถานะต่างๆ
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'รอการยืนยัน';
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'in-progress':
        return 'กำลังรักษา';
      case 'completed':
        return 'เสร็จสิ้น';
      case 'cancelled':
        return 'ยกเลิก';
      case 'success':
        return 'สำเร็จ';
      default:
        return status;
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">หน้าแดชบอร์ดผู้ดูแลระบบ</h1>
      
      {currentUser && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium mb-2">ยินดีต้อนรับ</h2>
          <p className="text-gray-600">
            สวัสดี, {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">จำนวนผู้ใช้ทั้งหมด</h3>
          <p className="text-2xl font-bold text-indigo-600">{statistics.totalUsers} คน</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">นัดหมายวันนี้</h3>
          <p className="text-2xl font-bold text-green-600">{statistics.todayBookings} นัด</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">รอการยืนยัน</h3>
          <p className="text-2xl font-bold text-yellow-600">{statistics.pendingBookings} นัด</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">การนัดหมายทั้งหมด</h3>
          <p className="text-2xl font-bold text-indigo-600">{statistics.totalBookings} นัด</p>
          <Link to="/admin/bookings" className="text-sm text-indigo-500 hover:text-indigo-700 mt-2 inline-block">
            ดูทั้งหมด →
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">การนัดหมายสำเร็จ</h3>
          <p className="text-2xl font-bold text-green-600">{statistics.successBookings} นัด</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">รอการยืนยัน</h3>
          <p className="text-2xl font-bold text-yellow-600">{statistics.pendingBookings} นัด</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">ยกเลิก</h3>
          <p className="text-2xl font-bold text-red-600">{statistics.cancelledBookings} นัด</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">การนัดหมายล่าสุด</h2>
          <Link to="/admin/bookings" className="text-sm text-indigo-500 hover:text-indigo-700">
            ดูทั้งหมด →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ป่วย</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อาการ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{booking.user?.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatThaiDate(booking.appointmentDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{booking.appointmentTime} น.</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-[150px]" title={booking.initialSymptoms}>
                        {booking.initialSymptoms}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            ยืนยัน
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            ยกเลิก
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <>
                          <button 
                            onClick={() => handleCallUser(booking._id)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            เรียกคิว
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            ยกเลิก
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'in-progress' && (
                        <button 
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          เสร็จสิ้น
                        </button>
                      )}
                      
                      {(booking.status === 'completed' || booking.status === 'success') && (
                        <Link 
                          to={`/admin/bookings/${booking._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          ดูรายละเอียด
                        </Link>
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <span className="text-gray-400">ยกเลิกแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    ไม่พบข้อมูลการนัดหมาย
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;