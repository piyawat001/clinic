// src/pages/admin/Statistics.jsx
import { useState, useEffect } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";

const Statistics = () => {
  // State สำหรับเก็บข้อมูลสถิติ
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    successBookings: 0,
    cancelledBookings: 0,
    todayBookings: 0,
    totalUsers: 0,
  });

  // State สำหรับ loading
  const [loading, setLoading] = useState(true);

  // State สำหรับเก็บข้อมูลจำนวนการนัดหมายในแต่ละวัน (สำหรับกราฟแท่ง)
  const [bookingsByDay, setBookingsByDay] = useState([]);

  // State สำหรับเก็บข้อมูลจำนวนการนัดหมายแยกตามสถานะ (สำหรับกราฟวงกลม)
  const [bookingsByStatus, setBookingsByStatus] = useState([]);

  // ดึงข้อมูลสถิติเมื่อหน้าโหลด
  useEffect(() => {
    fetchStatistics();
    fetchBookingsByDay();
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลสถิติ
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/statistics");
      setStatistics(response.data);

      // สร้างข้อมูลสำหรับกราฟวงกลม
      setBookingsByStatus([
        {
          name: "รอการยืนยัน",
          value: response.data.pendingBookings,
          color: "#FBBF24",
        },
        {
          name: "สำเร็จ",
          value: response.data.successBookings,
          color: "#34D399",
        },
        {
          name: "ยกเลิก",
          value: response.data.cancelledBookings,
          color: "#F87171",
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("ไม่สามารถโหลดข้อมูลสถิติได้");
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจำนวนการนัดหมายในแต่ละวัน (สมมุติข้อมูล)
  const fetchBookingsByDay = async () => {
    try {
      // สร้างข้อมูลทดสอบสำหรับกราฟแท่ง (7 วันล่าสุด)
      const days = [];
      const data = [];

      // สร้างวันที่ย้อนหลัง 7 วัน
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toLocaleDateString("th-TH", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        days.push(formattedDate);

        // สร้างข้อมูลจำลอง
        const bookingsCount = Math.floor(Math.random() * 10) + 1; // สุ่มตัวเลข 1-10
        data.push(bookingsCount);
      }

      setBookingsByDay({ days, data });
    } catch (error) {
      console.error("Error fetching bookings by day:", error);
    }
  };

  // ฟังก์ชันสำหรับแสดงกราฟแท่ง
  const renderBarChart = () => {
    if (!bookingsByDay.days || !bookingsByDay.data) return null;

    const maxValue = Math.max(...bookingsByDay.data);
    const barHeight = 200; // ความสูงสูงสุดของกราฟแท่ง

    return (
      <div className="mt-4">
        <div className="flex items-end justify-between h-52 space-x-1">
          {bookingsByDay.data.map((value, index) => {
            const height = (value / maxValue) * barHeight;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs mb-1">{value}</div>
                <div
                  className="bg-indigo-500 rounded-t w-12"
                  style={{ height: `${height}px` }}
                ></div>
                <div className="text-xs mt-1 w-14 text-center">
                  {bookingsByDay.days[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ฟังก์ชันสำหรับแสดงกราฟวงกลม
  const renderPieChart = () => {
    if (!bookingsByStatus.length) return null;

    const total = bookingsByStatus.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-center py-8">ไม่มีข้อมูล</div>;

    let startAngle = 0;

    return (
      <div className="flex justify-center mt-4">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100">
            {bookingsByStatus.map((status, index) => {
              const percentage = (status.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = startAngle + angle;

              // คำนวณพิกัด SVG arc
              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

              // สร้าง arc path
              const largeArcFlag = angle > 180 ? 1 : 0;
              const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              startAngle = endAngle;

              return (
                <path
                  key={index}
                  d={path}
                  fill={status.color}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {total}
          </div>
        </div>
      </div>
    );
  };

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
      <h1 className="text-2xl font-bold mb-6">สถิติการจอง</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">จำนวนผู้ใช้</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {statistics.totalUsers}
          </p>
          <p className="text-xs text-gray-500 mt-1">ผู้ใช้ทั้งหมดในระบบ</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">
            การนัดหมายทั้งหมด
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {statistics.totalBookings}
          </p>
          <p className="text-xs text-gray-500 mt-1">จำนวนการนัดหมายทั้งหมด</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">นัดหมายวันนี้</h3>
          <p className="text-2xl font-bold text-green-600">
            {statistics.todayBookings}
          </p>
          <p className="text-xs text-gray-500 mt-1">การนัดหมายในวันนี้</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">รอการยืนยัน</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {statistics.pendingBookings}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            รอการยืนยันจากเจ้าหน้าที่
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">สำเร็จ</h3>
          <p className="text-2xl font-bold text-green-600">
            {statistics.successBookings}
          </p>
          <p className="text-xs text-gray-500 mt-1">การนัดหมายที่สำเร็จ</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">ยกเลิก</h3>
          <p className="text-2xl font-bold text-red-600">
            {statistics.cancelledBookings}
          </p>
          <p className="text-xs text-gray-500 mt-1">การนัดหมายที่ถูกยกเลิก</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">
            จำนวนการนัดหมายในแต่ละวัน
          </h2>
          {renderBarChart()}
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">สถานะการนัดหมาย</h2>
          {renderPieChart()}

          <div className="flex flex-col mt-4 space-y-2">
            {bookingsByStatus.map((status, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: status.color }}
                ></div>
                <span className="text-sm">
                  {status.name}: {status.value} (
                  {Math.round(
                    (status.value / statistics.totalBookings) * 100
                  ) || 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white shadow rounded-lg p-4 mt-6">
        <h2 className="text-lg font-medium mb-4">ข้อมูลเพิ่มเติม</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              อัตราความสำเร็จ
            </h3>
            <p className="text-lg font-bold">
              {statistics.totalBookings > 0
                ? Math.round(
                    (statistics.successBookings / statistics.totalBookings) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-xs text-gray-500">เทียบกับการนัดหมายทั้งหมด</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              อัตราการยกเลิก
            </h3>
            <p className="text-lg font-bold">
              {statistics.totalBookings > 0
                ? Math.round(
                    (statistics.cancelledBookings / statistics.totalBookings) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-xs text-gray-500">เทียบกับการนัดหมายทั้งหมด</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              อัตรารอยืนยัน
            </h3>
            <p className="text-lg font-bold">
              {statistics.totalBookings > 0
                ? Math.round(
                    (statistics.pendingBookings / statistics.totalBookings) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-xs text-gray-500">เทียบกับการนัดหมายทั้งหมด</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
