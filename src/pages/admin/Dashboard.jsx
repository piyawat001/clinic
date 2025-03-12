// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
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
          <p className="text-2xl font-bold text-indigo-600">32 คน</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">นัดหมายวันนี้</h3>
          <p className="text-2xl font-bold text-green-600">8 นัด</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium mb-2">รอการยืนยัน</h3>
          <p className="text-2xl font-bold text-yellow-600">3 นัด</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-4">การนัดหมายล่าสุด</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ป่วย</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* ตัวอย่างข้อมูล */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">สมชาย ใจดี</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">07 มี.ค. 2568</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">18:30 น.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    รอการยืนยัน
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">ยืนยัน</button>
                  <button className="text-red-600 hover:text-red-900">ยกเลิก</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">วิชัย สุขสบาย</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">07 มี.ค. 2568</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">19:00 น.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ยืนยันแล้ว
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">โทรแจ้ง</button>
                  <button className="text-red-600 hover:text-red-900">ยกเลิก</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;