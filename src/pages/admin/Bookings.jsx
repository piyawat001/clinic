// src/pages/admin/Bookings.jsx
import { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const Bookings = () => {
  // State สำหรับเก็บข้อมูลการนัดหมาย
  const [bookings, setBookings] = useState([]);
  
  // State สำหรับ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const bookingsPerPage = 10;
  
  // State สำหรับ loading
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ filter
  const [filters, setFilters] = useState({
    date: '',
    status: ''
  });
  
  // State สำหรับ modal รายละเอียดการนัดหมาย
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  
  // ดึงข้อมูลการนัดหมายเมื่อหน้าโหลดหรือเมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchBookings();
  }, [currentPage, filters]);
  
  // ฟังก์ชันสำหรับดึงข้อมูลการนัดหมาย
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // สร้าง query params
      let queryParams = new URLSearchParams();
      
      if (filters.date) {
        queryParams.append('date', filters.date);
      }
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      const response = await axios.get(`/admin/bookings?${queryParams.toString()}`);
      
      // คำนวณจำนวนหน้าทั้งหมด
      const totalItems = response.data.length;
      const calculatedTotalPages = Math.ceil(totalItems / bookingsPerPage);
      setTotalPages(calculatedTotalPages || 1);
      
      // ปรับหน้าปัจจุบันถ้ามากกว่าจำนวนหน้าทั้งหมด
      if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(1);
      }
      
      // จัดเรียงข้อมูลตามวันที่และเวลา
      const sortedBookings = response.data.sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
        return dateA - dateB;
      });
      
      // แบ่งหน้า
      const indexOfLastBooking = currentPage * bookingsPerPage;
      const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
      const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
      
      setBookings(currentBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('ไม่สามารถโหลดข้อมูลการนัดหมายได้');
      setLoading(false);
    }
  };
  
  // ฟังก์ชันสำหรับการอัพเดทสถานะการนัดหมาย
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`/admin/bookings/${bookingId}`, { status: newStatus });
      
      // อัพเดทข้อมูลใน state โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      toast.success('อัพเดทสถานะสำเร็จ');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('ไม่สามารถอัพเดทสถานะได้');
    }
  };
  
  // ฟังก์ชันสำหรับการเรียกคิวผู้ป่วย
  const handleCallUser = async (bookingId) => {
    try {
      const now = new Date();
      await axios.put(`/admin/bookings/${bookingId}/call`, { callTime: now });
      
      // อัพเดทข้อมูลใน state โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'success', callTime: now } 
            : booking
        )
      );
      
      toast.success('เรียกผู้ป่วยสำเร็จ');
    } catch (error) {
      console.error('Error calling user:', error);
      toast.error('ไม่สามารถเรียกผู้ป่วยได้');
    }
  };
  
  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลง filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // รีเซ็ตหน้าเป็นหน้าแรกเมื่อ filter เปลี่ยน
  };
  
  // ฟังก์ชันสำหรับแสดง modal รายละเอียดการนัดหมาย
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.adminNotes || '');
    setShowModal(true);
  };
  
  // ฟังก์ชันสำหรับบันทึกบันทึกของแพทย์
  const handleSaveNotes = async () => {
    try {
      await axios.put(`/admin/bookings/${selectedBooking._id}`, {
        adminNotes
      });
      
      // อัพเดทข้อมูลใน state โดยไม่ต้องโหลดข้อมูลใหม่ทั้งหมด
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === selectedBooking._id 
            ? { ...booking, adminNotes } 
            : booking
        )
      );
      
      setShowModal(false);
      toast.success('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
    }
  };
  
  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  };
  
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
      <h1 className="text-2xl font-bold mb-6">จัดการการนัดหมาย</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              วันที่
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              สถานะ
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="pending">รอการยืนยัน</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="in-progress">กำลังรักษา</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
              <option value="success">สำเร็จ</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ date: '', status: '' });
                setCurrentPage(1);
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              รีเซ็ตตัวกรอง
            </button>
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
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
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
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
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            รายละเอียด
                          </button>
                          
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      แสดง <span className="font-medium">{(currentPage - 1) * bookingsPerPage + 1}</span> ถึง{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * bookingsPerPage, bookings.length * totalPages)}
                      </span>{' '}
                      จากทั้งหมด{' '}
                      <span className="font-medium">{bookings.length * totalPages}</span> รายการ
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                          currentPage === 1
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === index + 1
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                          currentPage === totalPages
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal for booking details */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full">
            <div className="px-6 py-4 bg-indigo-700 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">รายละเอียดการนัดหมาย</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">ชื่อผู้ป่วย</p>
                  <p className="text-lg font-semibold">{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                  <p className="text-lg font-semibold">{selectedBooking.user?.phone || '-'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">วันที่นัดหมาย</p>
                  <p className="text-lg font-semibold">{formatThaiDate(selectedBooking.appointmentDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">เวลานัดหมาย</p>
                  <p className="text-lg font-semibold">{selectedBooking.appointmentTime} น.</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">อีเมล</p>
                  <p className="text-lg font-semibold">{selectedBooking.user?.email || '-'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">สถานะ</p>
                  <p className="mt-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedBooking.status)}`}>
                      {getStatusText(selectedBooking.status)}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-1">อาการเบื้องต้น</p>
                <p className="text-base p-3 bg-gray-50 rounded">{selectedBooking.initialSymptoms}</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  บันทึกของแพทย์
                </label>
                <textarea
                  id="adminNotes"
                  rows="4"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="บันทึกข้อมูลเพิ่มเติม..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;