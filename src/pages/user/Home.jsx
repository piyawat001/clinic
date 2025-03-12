// src/pages/user/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const Home = () => {
  const { currentUser } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/bookings');
        setBookingData(response.data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        toast.error('ไม่สามารถโหลดข้อมูลการจองได้');
      } finally {
        setIsLoading(false);
      }
      const userInfoFromStorage = localStorage.getItem('userInfo');
      if (!currentUser && userInfoFromStorage) {
        try {
          const parsedUser = JSON.parse(userInfoFromStorage);
          // ทำอะไรกับข้อมูลผู้ใช้ตามต้องการ เช่น อัพเดต state ในคอมโพเนนต์
          console.log('User info from localStorage:', parsedUser);
        } catch (error) {
          console.error('Error parsing user info from localStorage:', error);
        }
      }
    };
    
    fetchBookingData();
  }, [currentUser]);
  
  return (
    <div className="bg-green-50 min-h-screen pb-16">
      {/* Welcome Message - ใช้ currentUser */}
      {currentUser && (
        <div className="bg-white px-4 py-2 shadow-sm">
          <p className="text-sm text-gray-600">
            สวัสดี, คุณ{currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
      )}
      
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="relative">
          <img 
            src="/banner.jpg" 
            alt="คลินิกนายแพทย์สุทธิลักษณ์ ปะไล" 
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">โทรทันที</button>
            <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Line OA</button>
          </div>
        </div>
      </div>
      
      {/* Main Title */}
      <div className="text-center my-6">
        <h1 className="text-xl font-bold text-gray-800">คลินิกนายแพทย์สุทธิลักษณ์</h1>
        <p className="text-gray-600 mt-2">บริการทางการแพทย์ออนไลน์</p>
      </div>
      
      {/* Book Appointment Button */}
      <div className="mx-4 mb-6">
        <Link 
          to="/user/booking" 
          className="block w-full bg-green-800 text-white text-center py-3 rounded-md font-medium hover:bg-green-700 transition"
        >
          จองนัดหมายออนไลน์
        </Link>
      </div>
      
      {/* Booking Information */}
      <div className="mx-4 mb-6">
        <div className="bg-white rounded-lg p-4">
          <h2 className="font-medium text-gray-700 mb-3">ข้อมูลการจอง</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : bookingData && bookingData.length > 0 ? (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>07 กุมภาพันธ์ 2568</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-100">
                <div>
                  <span className="text-gray-600">ลำดับ</span>
                  <p className="font-medium">2</p>
                </div>
                <div>
                  <span className="text-gray-600">เวลาที่ท่านจอง</span>
                  <p className="font-medium">18.30</p>
                </div>
                <div>
                  <span className="text-gray-600">เวลาที่คาดว่าจะเข้าตรวจ</span>
                  <p className="font-medium">18.40</p>
                </div>
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm self-center">
                  ดูรายละเอียด
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <img src="/download-icon.svg" alt="ดาวน์โหลด" className="w-10 h-10" />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">ไม่พบข้อมูลการจอง</p>
          )}
        </div>
      </div>
      
      {/* Services */}
      <div className="mx-4 mb-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-medium text-gray-700 mb-3">บริการของคลินิกรักษาโรคทั่วไปพร้อมให้บริการ</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ตรวจรักษาโรคทั่วไป</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ออกใบรับรองแพทย์</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>วางแผนครอบครัว(คุมกำเนิด)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ตรวจสุขภาพและความดันโลหิตสูง</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ตรวจสุขภาพประจำปี</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ฉีดวัคซีน เช็นเลือด ตีตัน</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ฉีดวัคซีน</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ฉีดยา</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>ผ่าฝา</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-800 mr-2">•</span>
              <span>บริการแพทย์ทั่วไป</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* About Clinic */}
      <div className="mx-4 mb-6">
        <h2 className="text-center font-medium text-gray-800 mb-4">เกี่ยวกับ</h2>
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-center font-medium text-gray-800 mb-2">เกี่ยวกับคลินิกนายแพทย์สุทธิลักษณ์</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            ที่ คลินิกนายแพทย์สุทธิลักษณ์ 
            เราไม่ได้เป็นเพียงคลินิกทั่วไปที่ห่วงเวลาคนไข้มาตรวจ 
            แต่เราเอาใจดูแลคุณทุกขั้น ทุกข้อสงสัย 
            เราพร้อมดูแลสุขภาพของคุณด้วยดีที่สุดด้วยความอบอุ่น
          </p>
          <p className="text-center text-green-600 font-medium">
            "สุขภาพที่ดีไม่ได้เริ่มจากอาคาร หรือราคาแต่เริ่มเมื่อแพทย์เข้าใจ แต่เป็นสิ่งที่จับต้องได้"
          </p>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">แพทย์...คนละใจกับนายทุนรักษา</p>
            <div className="flex items-start mb-2">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">ดูแลสุขภาพแท้จริงไม่ ไม่บังคับ หายคุณภาพ ของคุณ</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">ยาราคาถูกลง เทียบเท่อง โดยรองรัฐ โบดรองรัฐ โดยรองรัฐ ระบะยาฟูกแล้ว แคะเวชภัณฑ์ สุขภาพฟรีของได้โดยคุณค่า</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-red-500 font-bold">
              คลินิกเล็นนายแพทย์ คุยเรื่องสุขภาพเด็กร่วมอัน <br />
              อย่างเต็มคุณภาพ บริการเหมือนคลินิกของตนเอง
            </p>
            <p className="text-lg text-red-600 font-bold mt-2">ปรับราพรี่ไม่มีทั้งรัฐนะ!!</p>
          </div>
        </div>
      </div>
      
      {/* Contact */}
      <div className="mx-4 mb-20">
        <h2 className="text-center font-medium text-gray-800 mb-4">ติดต่อเรา</h2>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-start mb-4">
            <svg className="w-6 h-6 text-green-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">ที่อยู่: 189 ถนนมะโนรมย์ ต.ปะโค อ.เมือง จ.หนองคาย</p>
          </div>
          
          <div className="mb-4">
            <img 
              src="/map.jpg" 
              alt="แผนที่คลินิก" 
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex items-start mb-4">
            <svg className="w-6 h-6 text-green-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium">เวลาทำการ:</p>
              <p className="text-sm">จันทร์ - พุธ: 16:30 - 21:00 น.</p>
              <p className="text-sm">เสาร์ - อาทิตย์: 09:00 - 21:00 น.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-700 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-sm">โทร: 083-2419429</p>
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <a href="#" className="text-blue-600">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
              </svg>
            </a>
            <a href="#" className="text-green-500">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 10.6C22 14.6 16.6 19.1 12 22C7.3 19.1 2 14.6 2 10.6C2 6.6 6.5 3.3 12 3.3C17.5 3.3 22 6.5 22 10.6Z" />
                <path fill="white" d="M13.5 14.2H10.5V13.1H11.8V10.4H10.5V9.3H13V13.1H13.5V14.2ZM13.4 8.7H11.6V7.6H13.4V8.7Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom Navigation */}
      <div className="fixed right-4 bottom-20">
        <Link 
          to="#top" 
          className="bg-green-500 text-white p-3 rounded-full shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Home;