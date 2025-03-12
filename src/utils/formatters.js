// src/utils/formatters.js

/**
 * แปลงวันที่เป็นรูปแบบไทย (วันที่ เดือน พ.ศ.)
 * @param {string} dateString - วันที่ในรูปแบบ ISO หรือรูปแบบที่ JavaScript Date รองรับ
 * @returns {string} วันที่ในรูปแบบไทย
 */
export const formatThaiDate = (dateString) => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
  
    // อาร์เรย์ชื่อเดือนภาษาไทย
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
  
    // แปลงปี พ.ศ.
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const thaiYear = date.getFullYear() + 543;
  
    // สร้างรูปแบบวันที่ "วันที่ เดือน พ.ศ."
    return `${day} ${month} ${thaiYear}`;
  };
  
  /**
   * แปลงเวลารูปแบบ "HH:MM" เป็น "HH.MM"
   * @param {string} timeString - เวลาในรูปแบบ "HH:MM"
   * @returns {string} เวลาในรูปแบบ "HH.MM"
   */
  export const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.replace(":", ".");
  };
  
  /**
   * คำนวณเวลาที่คาดว่าจะเข้าตรวจ (เพิ่ม 10 นาทีจากเวลานัด)
   * @param {Object} booking - ข้อมูลการจอง
   * @returns {string} เวลาที่คาดว่าจะเข้าตรวจในรูปแบบ "HH.MM"
   */
  export const getEstimatedTime = (booking) => {
    // ถ้า API ส่ง estimatedTime มาให้ ใช้ค่านั้นเลย
    if (booking?.estimatedTime) {
      return formatTime(booking.estimatedTime);
    }
  
    // ถ้าไม่มี ให้คำนวณเอง (เพิ่ม 10 นาที)
    if (!booking?.appointmentTime) return "";
  
    const [hours, minutes] = booking.appointmentTime.split(":").map(Number);
    let newMinutes = minutes + 10;
    let newHours = hours;
  
    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
      if (newHours >= 24) {
        newHours -= 24;
      }
    }
  
    const formattedHours = String(newHours).padStart(2, "0");
    const formattedMinutes = String(newMinutes).padStart(2, "0");
  
    return `${formattedHours}.${formattedMinutes}`;
  };
  
  /**
   * แปลงสถานะการจองเป็นข้อความภาษาไทย
   * @param {string} status - สถานะการจอง
   * @returns {string} สถานะเป็นข้อความภาษาไทย
   */
  export const formatStatus = (status) => {
    const statusMap = {
      pending: "รอการยืนยัน",
      confirmed: "ยืนยันแล้ว",
      completed: "เสร็จสิ้น",
      cancelled: "ยกเลิกแล้ว",
      "in-progress": "กำลังดำเนินการ"
    };
    return statusMap[status] || status;
  };
  
  /**
   * รับข้อมูลสถานะการจองและสีที่เกี่ยวข้อง
   * @param {string} status - สถานะการจอง
   * @returns {Object} ข้อมูลสถานะและคลาสสี
   */
  export const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed':
        return { text: 'ยืนยันแล้ว', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { text: 'เสร็จสิ้น', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'ยกเลิกแล้ว', color: 'bg-red-100 text-red-800' };
      case 'in-progress':
        return { text: 'กำลังดำเนินการ', color: 'bg-purple-100 text-purple-800' };
      default:
        return { text: 'ไม่ทราบสถานะ', color: 'bg-gray-100 text-gray-800' };
    }
  };