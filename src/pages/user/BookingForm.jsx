// src/pages/user/BookingForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const BookingForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // สร้าง state สำหรับเก็บข้อมูลการจอง
  const [bookingData, setBookingData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    appointmentDate: '',
    appointmentTime: '',
    initialSymptoms: ''
  });
  
  // สร้าง state สำหรับ validation
  const [errors, setErrors] = useState({});
  
  // สร้าง state สำหรับควบคุมการแสดงโมดัลเลือกเวลา
  const [showTimeModal, setShowTimeModal] = useState(false);
  
  // กำหนดขอบเขตของวันที่สามารถเลือกได้
  const today = new Date();
  const minDate = today.toISOString().split('T')[0]; // วันนี้ในรูปแบบ YYYY-MM-DD
  
  // รายการอาการให้เลือก
  const symptoms = [
    'ตรวจรักษาโรคทั่วไป',
    'ปรึกษาแพทย์ทั่วไป',
    'ออกใบรับรองแพทย์',
    'วางแผนครอบครัว(การคุมกำเนิด)',
    'ตรวจเบาหวานและความดันโลหิตสูง',
    'ตรวจสุขภาพประจำปี',
    'ล้างแผล เย็บแผล ตัดไหม',
    'อัลตร้าซาวด์',
    'ฉีดยา',
    'พ่นยา',
    'อื่นๆ'
  ];

  // ดึงข้อมูลช่วงเวลาว่างเมื่อวันที่เปลี่ยนแปลง
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!bookingData.appointmentDate) {
        setAvailableSlots([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/bookings/available-slots/${bookingData.appointmentDate}`);
        setAvailableSlots(response.data.availableSlots || []);
        
        // ถ้าไม่มีช่วงเวลาว่าง แสดงข้อความแจ้งเตือน
        if (response.data.message && !response.data.available) {
          toast.info(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        toast.error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลช่วงเวลาว่างได้');
        setAvailableSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [bookingData.appointmentDate]);
  
  // จัดการการเปลี่ยนแปลงของข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // กรณีเลือก "อื่นๆ" ในอาการ
    if (name === 'symptom' && value === 'อื่นๆ') {
      setBookingData(prev => ({
        ...prev,
        initialSymptoms: '', // รีเซ็ตข้อมูลอาการอื่นๆ
        [name]: value
      }));
    } else if (name === 'symptom' && value !== 'อื่นๆ') {
      setBookingData(prev => ({
        ...prev,
        initialSymptoms: value,
        [name]: value
      }));
    } else if (name === 'otherSymptom') {
      setBookingData(prev => ({
        ...prev,
        initialSymptoms: value
      }));
    } else if (name === 'date') {
      // เมื่อวันที่เปลี่ยน ให้รีเซ็ตเวลาที่เลือก
      setBookingData(prev => ({
        ...prev,
        appointmentDate: value,
        appointmentTime: ''
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // ล้าง error เมื่อมีการแก้ไข
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // เลือกเวลานัดหมาย
  const handleSelectTime = (time) => {
    setBookingData(prev => ({ 
      ...prev, 
      appointmentTime: time
    }));
    setShowTimeModal(false);
  };
  
  // ตรวจสอบความถูกต้องของข้อมูล
  const validateForm = () => {
    const newErrors = {};
    
    // ตรวจสอบชื่อ
    if (!bookingData.firstName.trim()) {
      newErrors.firstName = 'กรุณากรอกชื่อ';
    }
    
    // ตรวจสอบนามสกุล
    if (!bookingData.lastName.trim()) {
      newErrors.lastName = 'กรุณากรอกนามสกุล';
    }
    
    // ตรวจสอบเบอร์โทร
    if (!bookingData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^\d{10}$/.test(bookingData.phone.trim())) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)';
    }
    
    // ตรวจสอบวันที่
    if (!bookingData.appointmentDate) {
      newErrors.appointmentDate = 'กรุณาเลือกวันที่';
    }
    
    // ตรวจสอบเวลา
    if (!bookingData.appointmentTime) {
      newErrors.appointmentTime = 'กรุณาเลือกเวลา';
    }
    
    // ตรวจสอบอาการ
    if (!bookingData.initialSymptoms.trim()) {
      newErrors.symptom = 'กรุณาเลือกหรือระบุอาการเบื้องต้น';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // ส่งข้อมูลการจอง
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของข้อมูล
    if (!validateForm()) {
      // หากข้อมูลไม่ถูกต้อง จะไม่ดำเนินการต่อ
      return;
    }
    
    // เตรียมข้อมูลสำหรับส่งไปยังเซิร์ฟเวอร์
    const bookingPayload = {
      appointmentDate: bookingData.appointmentDate,
      appointmentTime: bookingData.appointmentTime,
      initialSymptoms: bookingData.initialSymptoms
    };
    
    setIsSubmitting(true);
    
    try {
      // ส่งข้อมูลไปยัง API
      await axios.post('/bookings', bookingPayload);
      
      toast.success('จองนัดหมายสำเร็จ');
      
      // Redirect กลับไปหน้า Home หรือหน้าแสดงรายละเอียดการจอง
      navigate('/user');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการจองนัดหมาย');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-green-50 min-h-screen pb-16 pt-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-center text-green-800 mb-6">จองนัดหมาย</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อ */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={bookingData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder="กรอกชื่อ"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          {/* นามสกุล */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={bookingData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder="กรอกนามสกุล"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          {/* เบอร์โทร */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={bookingData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
              placeholder="เช่น 0812345678"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          {/* วันที่ */}
          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
              วันที่ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="date"
              value={bookingData.appointmentDate}
              onChange={handleChange}
              min={minDate}
              className={`w-full px-3 py-2 border ${errors.appointmentDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
            )}
          </div>
          
          {/* เวลา - แสดงเป็น Modal คล้ายกับในภาพ */}
          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
              เวลา <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              disabled={!bookingData.appointmentDate || isLoading}
              onClick={() => setShowTimeModal(true)}
              className={`w-full px-3 py-2 border ${errors.appointmentTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${!bookingData.appointmentDate ? 'bg-gray-100' : 'bg-white'} text-left`}
            >
              {isLoading ? 'กำลังโหลดข้อมูล...' : bookingData.appointmentTime ? `${bookingData.appointmentTime} น.` : 'เลือกเวลา'}
            </button>
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
            )}
            {bookingData.appointmentDate && availableSlots.length === 0 && !isLoading && (
              <p className="mt-1 text-sm text-amber-600">ไม่มีเวลาว่างในวันที่เลือก</p>
            )}
          </div>
          
          {/* โมดัลเลือกเวลา */}
          {showTimeModal && bookingData.appointmentDate && (
            <div className="fixed inset-0 z-50 overflow-auto bg-white bg-opacity-95 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-center text-xl font-semibold text-gray-800">นัดหมาย:คลินิกนายแพทย์สุทธิลักษณ์</h2>
              </div>
              
              <div className="flex-1 flex flex-col items-center p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-6">เลือกเวลา</h3>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleSelectTime(time)}
                      className="py-3 text-center rounded-md bg-blue-800 text-white hover:bg-blue-700"
                    >
                      {time}
                    </button>
                  ))}
                  
                  {availableSlots.length === 0 && !isLoading && (
                    <p className="col-span-2 text-center text-red-500">ไม่มีเวลาว่างในวันนี้</p>
                  )}
                  
                  {isLoading && (
                    <p className="col-span-2 text-center">กำลังโหลดข้อมูล...</p>
                  )}
                </div>
                
                <div className="w-full max-w-md space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (bookingData.appointmentTime) {
                        setShowTimeModal(false);
                      }
                    }}
                    className="w-full py-3 bg-blue-800 text-white rounded-md font-medium"
                  >
                    ยืนยันการเลือกเวลา
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowTimeModal(false)}
                    className="w-full py-3 bg-gray-300 text-gray-700 rounded-md font-medium"
                  >
                    ย้อนกลับ
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* อาการเบื้องต้น */}
          <div>
            <label htmlFor="symptom" className="block text-sm font-medium text-gray-700 mb-1">
              อาการเบื้องต้น <span className="text-red-500">*</span>
            </label>
            <select
              id="symptom"
              name="symptom"
              value={bookingData.symptom || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.symptom ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
            >
              <option value="">เลือกอาการเบื้องต้น</option>
              {symptoms.map((symptom) => (
                <option key={symptom} value={symptom}>
                  {symptom}
                </option>
              ))}
            </select>
            {errors.symptom && (
              <p className="mt-1 text-sm text-red-600">{errors.symptom}</p>
            )}
          </div>
          
          {/* อาการอื่นๆ (แสดงเมื่อเลือก "อื่นๆ") */}
          {bookingData.symptom === 'อื่นๆ' && (
            <div>
              <label htmlFor="otherSymptom" className="block text-sm font-medium text-gray-700 mb-1">
                โปรดระบุอาการ <span className="text-red-500">*</span>
              </label>
              <textarea
                id="otherSymptom"
                name="otherSymptom"
                value={bookingData.initialSymptoms}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border ${errors.otherSymptom ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="กรุณาระบุอาการของท่าน"
              />
              {errors.otherSymptom && (
                <p className="mt-1 text-sm text-red-600">{errors.otherSymptom}</p>
              )}
            </div>
          )}
          
          {/* ปุ่มส่งข้อมูล */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการจอง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;