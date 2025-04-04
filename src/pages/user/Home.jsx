// src/pages/user/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../config/axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import downArrow from "../../assets/down-arrow.png";
import upArrow from "../../assets/up-arrow.png";
// Import the modal component
import BookingDetailsModal from "../../components/common/BookingDetailsModal";
// นำเข้าฟังก์ชันจัดรูปแบบจากไฟล์ utility
import {
  formatThaiDate,
  formatTime,
  getEstimatedTime,
} from "../../utils/formatters";

const Home = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //const navigate = useNavigate();

  // สถานะสำหรับ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // สถานะสำหรับ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // อัพเดตรายการเมื่อมีการยกเลิกการจอง
  const handleCancelSuccess = (cancelledBookingId) => {
    // กรองรายการที่ยกเลิกออกจากหน้าจอทันที
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === cancelledBookingId
          ? { ...booking, status: "cancelled" }
          : booking
      )
    );
  };

  // เปิด Modal และแสดงรายละเอียดการจอง
  const handleViewBookingDetails = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/bookings");

        // ตรวจสอบข้อมูลที่ได้รับจาก API
        if (response.data && Array.isArray(response.data)) {
          // จัดเรียงตามวันที่นัดหมาย (วันที่ใกล้ที่สุดก่อน)
          const sortedBookings = response.data.sort((a, b) => {
            // เรียงตามวันที่ก่อน
            const dateA = new Date(a.appointmentDate);
            const dateB = new Date(b.appointmentDate);

            if (dateA.getTime() !== dateB.getTime()) {
              return dateA - dateB; // วันที่ใกล้ที่สุดก่อน
            }

            // ถ้าวันที่เท่ากัน เรียงตามเวลา
            const [hoursA, minutesA] = a.appointmentTime.split(":").map(Number);
            const [hoursB, minutesB] = b.appointmentTime.split(":").map(Number);

            const timeA = hoursA * 60 + minutesA;
            const timeB = hoursB * 60 + minutesB;

            return timeA - timeB; // เวลาที่เร็วกว่าก่อน
          });

          // ตรวจสอบและแสดงให้แน่ใจว่ามีค่า queueNumber
          const processedBookings = sortedBookings.map((booking, index) => {
            // ถ้าไม่มี queueNumber ให้ใช้ตำแหน่งใน array + 1
            if (!booking.queueNumber) {
              booking.queueNumber = index + 1;
            }

            return booking;
          });

          console.log("Processed bookings:", processedBookings);
          setBookings(processedBookings);
        } else {
          setBookings([]);
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("ไม่สามารถโหลดข้อมูลการจองได้");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchBookingData();
    } else {
      setIsLoading(false);
      setBookings([]);
    }
  }, [currentUser]);

  // กรองรายการที่ไม่ได้ถูกยกเลิก
  const activeBookings = bookings.filter(
    (booking) => booking.status !== "cancelled"
  );

  // คำนวณข้อมูลสำหรับ pagination
  const totalPages = Math.ceil(activeBookings.length / itemsPerPage);

  // คำนวณ index เริ่มต้นและสิ้นสุดของข้อมูลในหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // ข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const currentItems = activeBookings.slice(indexOfFirstItem, indexOfLastItem);

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ฟังก์ชันสำหรับไปหน้าถัดไป
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ฟังก์ชันสำหรับไปหน้าก่อนหน้า
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen pb-16">
      {/* Header ที่แก้ไขแล้ว (ไม่มี Hamburger Menu) */}
      <header className="bg-white shadow-sm sticky top-0 z-50"></header>

      {/* Welcome Message with Profile Link */}
      {currentUser && (
        <div className="bg-white px-4 py-3 shadow-sm mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            สวัสดี, คุณ{currentUser.firstName} {currentUser.lastName}
          </p>
          <Link to="/user/profile" className="flex items-center text-green-700">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-1">
              <span className="text-green-700 font-medium">
                {currentUser.firstName
                  ? currentUser.firstName.charAt(0).toUpperCase()
                  : "ค"}
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="relative">
          <img
            src="/src/assets/firstimg.png"
            alt="คลินิกนายแพทย์สุทธิลักษณ์ ปะไล"
            className="w-full rounded-lg"
          />
        </div>
      </div>
      {/* Main Title */}
      <div className="text-center my-6">
        <h1 className="text-xl font-bold text-gray-800">
          คลินิกนายแพทย์สุทธิลักษณ์
        </h1>
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
          ) : activeBookings.length > 0 ? (
            <div>
              {/* แสดงรายการในหน้าปัจจุบัน */}
              {currentItems.map((booking, index) => {
                // คำนวณลำดับตามตำแหน่งในหน้าปัจจุบัน
                const itemNumber = indexOfFirstItem + index + 1;

                return (
                  <div
                    key={booking._id || index}
                    className={
                      index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""
                    }
                  >
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{formatThaiDate(booking.appointmentDate)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100">
                      <div>
                        <span className="text-gray-600">ลำดับ</span>
                        <p className="font-medium">{itemNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">เวลาที่ท่านจอง</span>
                        <p className="font-medium">
                          {formatTime(booking.appointmentTime)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          เวลาที่คาดว่าจะเข้าตรวจ
                        </span>
                        <p className="font-medium">
                          {getEstimatedTime(booking)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewBookingDetails(booking._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm self-center"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    &laquo; ก่อนหน้า
                  </button>

                  <div className="flex space-x-1">
                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === number + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    ถัดไป &raquo;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">ไม่พบข้อมูลการจอง</p>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="mx-4 mb-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-medium text-gray-700 mb-3">
            บริการของคลินิกรักษาโรคทั่วไปพร้อมให้บริการ
          </h2>
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
        <h2 className="text-center font-medium text-gray-800 mb-4">
          เกี่ยวกับ
        </h2>
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-center font-medium text-gray-800 mb-2">
            เกี่ยวกับคลินิกนายแพทย์สุทธิลักษณ์
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            ที่ คลินิกนายแพทย์สุทธิลักษณ์
            เราไม่ได้เป็นแค่คลินิกแต่เป็นที่พึ่งของทุกคนในชุมชน
            ไม่ว่าคุณจะเป็นใคร ทำอาชีพอะไร
            เราพร้อมดูแลสุขภาพของคุณด้วยหัวใจที่เต็มไปด้วยด้วยความห่วงใย
          </p>
          <p className="text-center text-green-600 font-medium">
            "สุขภาพที่ดีไม่ใช่เรื่องของคนรวยหรือคนไกลตัว แต่เป็นสิทธิ์ของทุกคน"
          </p>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2 text-center">
              มาที่นี่...คุณจะได้รับมากกว่าการรักษา
            </p>
            <div className="flex items-start mb-2">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm">
                การดูแลจากแพทย์ที่ใส่ใจ ไม่เร่งรีบ ฟังทุกปัญหาของคุณ
              </p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm">
                บรรยากาศอบอุ่น เป็นกันเอง ไม่ต้องกลัว ไม่ต้องเกร็ง
              </p>
              <p className="text-sm">
                {" "}
                ค่ารักษาย่อมเยา เพราะเรารู้ว่า สุขภาพดีต้องเข้าถึงได้ทุกคน
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-red-500 font-bold">
              คลินิกใกล้บ้านของคุณ ที่พร้อมดูแลด้วยหัวใจเสมอ <br />
              อย่ารอให้ป่วยหนัก มาปรึกษาคลินิกหมอใกล้บ้าน
            </p>
            <p className="text-lg text-red-600 font-bold mt-2">
              ปรึกษาฟรีไม่มีค่าใช้จ่าย!!
            </p>
          </div>
        </div>
      </div>
      {/* Contact */}
      <div className="mx-4 mb-20">
        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-center font-medium text-gray-800 mb-6 text-xl">
            ติดต่อเรา
          </h2>

          <div className="flex items-start mb-4">
            <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
              <svg
                className="w-6 h-6 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm">
                ที่อยู่: 189 ถนนมะโนรมย์ ต.ปะโค อ.เมือง จ.หนองคาย
              </p>
            </div>
          </div>

          {/* Google Map แบบมีขอบ */}
          <div className="mb-5 rounded-lg overflow-hidden border-2 border-white shadow-md">
            <a
              href="https://maps.app.goo.gl/4HpfxTfiUFpE5zmV9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/src/assets/map.png"
                alt="แผนที่คลินิก"
                className="w-full h-44 object-cover"
              />
            </a>
          </div>

          <div className="flex items-start mb-4">
            <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
              <svg
                className="w-6 h-6 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">เวลาทำการ:</p>
              <p className="text-sm">จันทร์ - ศุกร์: 16:30 - 21:00 น.</p>
              <p className="text-sm">เสาร์ - อาทิตย์: 09:00 - 21:00 น.</p>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
              <svg
                className="w-6 h-6 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <p className="text-sm">โทร: 083-2419429</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.facebook.com/suttilakclinic?mibextid=wwXIfr&rdid=6FbHeDf50YpWsL4C&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EGuH3rc3m%2F%3Fmibextid%3DwwXIfr#"
              className="bg-blue-600 text-white rounded-full p-3 shadow-md"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
              </svg>
            </a>
            <a
              href="https://line.me/R/ti/p/@175ppdyn"
              className="bg-green-500 text-white rounded-full p-3 shadow-md inline-flex items-center justify-center"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <img
                  src="/src/assets/line.png"
                  alt="LINE"
                  className="w-10 h-10 object-contain"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
      {/* Fixed Bottom Navigation */}
      <div className="fixed right-4 bottom-20 space-y-3">
        <Link
          to="#top"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={upArrow} alt="เลื่อนขึ้นบน" className="w-6 h-6" />
        </Link>

        <Link
          to="#bottom"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          <img src={downArrow} alt="เลื่อนลงล่าง" className="w-6 h-6" />
        </Link>
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

export default Home;
