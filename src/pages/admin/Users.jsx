// src/pages/admin/Users.jsx
import { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const Users = () => {
  // State สำหรับเก็บข้อมูลผู้ใช้
  const [users, setUsers] = useState([]);
  
  // State สำหรับ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;
  
  // State สำหรับ loading
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // State สำหรับ modal รายละเอียดผู้ใช้
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // ดึงข้อมูลผู้ใช้เมื่อหน้าโหลด
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      
      // คำนวณจำนวนหน้าทั้งหมด
      const calculatedTotalPages = Math.ceil(response.data.length / usersPerPage);
      setTotalPages(calculatedTotalPages || 1);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      setLoading(false);
    }
  };
  
  // ฟังก์ชันสำหรับการค้นหา
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery))
      );
      setFilteredUsers(filtered);
    }
    
    // รีเซ็ตหน้าเป็นหน้าแรกเมื่อค้นหา
    setCurrentPage(1);
    
    // คำนวณจำนวนหน้าทั้งหมดใหม่
    const calculatedTotalPages = Math.ceil(filteredUsers.length / usersPerPage);
    setTotalPages(calculatedTotalPages || 1);
  }, [searchQuery, users]);
  
  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // ฟังก์ชันสำหรับแสดง modal รายละเอียดผู้ใช้
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  
  // ฟังก์ชันสำหรับแปลง role เป็นภาษาไทย
  const translateRole = (role) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'user':
        return 'ผู้ใช้ทั่วไป';
      default:
        return role;
    }
  };
  
  // ฟังก์ชันสำหรับแสดงวันที่ในรูปแบบไทย
  const formatThaiDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  };
  
  // แบ่งหน้า
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // แสดง component สำหรับ loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้งาน</h1>
      
      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาผู้ใช้งาน..."
              className="w-full px-4 py-2 pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลงทะเบียน</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-800 font-semibold">{user.firstName.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {translateRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatThaiDate(user.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        รายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchQuery ? 'ไม่พบผู้ใช้ที่ต้องการค้นหา' : 'ไม่พบข้อมูลผู้ใช้'}
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
                  แสดง <span className="font-medium">{indexOfFirstUser + 1}</span> ถึง{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{' '}
                  จากทั้งหมด{' '}
                  <span className="font-medium">{filteredUsers.length}</span> รายการ
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
      </div>
      
      {/* Modal for user details */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 bg-indigo-700 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">รายละเอียดผู้ใช้งาน</h3>
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
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-800 font-bold">
                  {selectedUser.firstName.charAt(0)}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <span className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedUser.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {translateRole(selectedUser.role)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
                  <p className="text-lg">{selectedUser.phone || '-'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">วันที่ลงทะเบียน</p>
                  <p className="text-lg">{formatThaiDate(selectedUser.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">อัพเดทล่าสุด</p>
                  <p className="text-lg">{formatThaiDate(selectedUser.updatedAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">ไอดีผู้ใช้</p>
                  <p className="text-lg truncate">{selectedUser._id}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium mb-4">ประวัติการนัดหมาย</h3>
                <p className="text-gray-500 text-sm">
                  [ข้อมูลประวัติการนัดหมายจะแสดงที่นี่เมื่อเชื่อมต่อกับข้อมูลจริง]
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;