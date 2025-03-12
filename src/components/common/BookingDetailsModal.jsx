// src/components/BookingDetailsModal.jsx
import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import {
  formatThaiDate,
  formatTime,
  formatStatus,
  getEstimatedTime,
} from "../../utils/formatters";

const BookingDetailsModal = ({
  bookingId,
  isOpen,
  onClose,
  onCancelSuccess,
}) => {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // ฟังก์ชันยกเลิกการจอง
  const handleCancelBooking = async () => {
    if (!booking || !booking._id) return;

    try {
      setIsCancelling(true);
      await axios.put(`/bookings/${booking._id}/cancel`, {
        reason: cancelReason || "ผู้ใช้ยกเลิก",
      });

      setIsCancelling(false);
      setShowCancelConfirm(false);

      // อัพเดตสถานะการจองในข้อมูลปัจจุบัน
      setBooking({
        ...booking,
        status: "cancelled",
        cancelReason: cancelReason || "ผู้ใช้ยกเลิก",
      });

      toast.success("ยกเลิกการจองเรียบร้อยแล้ว");

      // แจ้งให้คอมโพเนนต์แม่ทราบว่ามีการยกเลิกสำเร็จ
      if (onCancelSuccess) {
        onCancelSuccess(booking._id);
      }
    } catch (error) {
      setIsCancelling(false);
      console.error("Error cancelling booking:", error);

      // แสดงข้อความผิดพลาดที่มาจาก API (ถ้ามี)
      const errorMessage =
        error.response?.data?.message ||
        "ไม่สามารถยกเลิกการจองได้ กรุณาลองใหม่อีกครั้ง";
      toast.error(errorMessage);
    }
  };

  // ดึงข้อมูลการจองเมื่อ Modal เปิด
  useEffect(() => {
    if (isOpen && bookingId) {
      const fetchBookingDetails = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/bookings/${bookingId}`);
          setBooking(response.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
          toast.error("ไม่สามารถดึงข้อมูลการจองได้");
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookingDetails();
    }
  }, [isOpen, bookingId]);

  // ถ้า Modal ไม่เปิด ไม่ต้องแสดงอะไร
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-medium text-gray-800">
            รายละเอียดการจอง
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="ปิด"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : booking ? (
            <div className="space-y-4">
              {/* วันที่และเวลา */}
              <div className="bg-green-50 p-3 rounded-md">
                <h3 className="font-medium text-green-800 mb-2">
                  วันและเวลาที่จอง
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">วันที่</p>
                    <p className="font-medium">
                      {formatThaiDate(booking.appointmentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เวลา</p>
                    <p className="font-medium">
                      {formatTime(booking.appointmentTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* สถานะการจอง */}
              <div className="bg-blue-50 p-3 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">สถานะการจอง</h3>
                <div className="flex space-x-2 items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-500"
                        : booking.status === "pending"
                        ? "bg-yellow-500"
                        : booking.status === "completed"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span>{formatStatus(booking.status)}</span>
                </div>
              </div>

              {/* ข้อมูลการตรวจ */}
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">
                  ข้อมูลการตรวจ
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">คิวที่</p>
                    <p className="font-medium">
                      {booking.queueNumber || "รอการยืนยัน"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      เวลาที่คาดว่าจะเข้าตรวจ
                    </p>
                    <p className="font-medium">{getEstimatedTime(booking)}</p>
                  </div>
                </div>
              </div>

              {/* อาการเบื้องต้น */}
              {booking.initialSymptoms && (
                <div className="bg-purple-50 p-3 rounded-md">
                  <h3 className="font-medium text-purple-800 mb-2">
                    อาการเบื้องต้น
                  </h3>
                  <p className="text-gray-700">{booking.initialSymptoms}</p>
                </div>
              )}

              {/* อาการเบื้องต้นอีกรูปแบบหนึ่ง (ใช้ชื่อที่แตกต่างกัน) */}
              {booking.symptoms && !booking.initialSymptoms && (
                <div className="bg-purple-50 p-3 rounded-md">
                  <h3 className="font-medium text-purple-800 mb-2">
                    อาการเบื้องต้น
                  </h3>
                  <p className="text-gray-700">{booking.symptoms}</p>
                </div>
              )}

              {/* บันทึกจากแพทย์ */}
              {booking.adminNotes && (
                <div className="bg-yellow-50 p-3 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-2">
                    บันทึกจากแพทย์
                  </h3>
                  <p className="text-gray-700">{booking.adminNotes}</p>
                </div>
              )}

              {/* หมายเหตุ */}
              {booking.notes && (
                <div className="bg-yellow-50 p-3 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-2">หมายเหตุ</h3>
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              )}

              {/* ปุ่มยกเลิกการจอง */}
              {(booking.status === "pending" ||
                booking.status === "confirmed") && (
                <div className="pt-4 border-t border-gray-200">
                  {!showCancelConfirm ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                    >
                      ยกเลิกการจอง
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700 font-medium">
                        ยืนยันการยกเลิกการจอง?
                      </p>
                      <textarea
                        placeholder="เหตุผลในการยกเลิก (ไม่บังคับ)"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition text-sm"
                          disabled={isCancelling}
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={handleCancelBooking}
                          className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition text-sm flex justify-center items-center"
                          disabled={isCancelling}
                        >
                          {isCancelling ? (
                            <>
                              <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                              กำลังยกเลิก...
                            </>
                          ) : (
                            "ยืนยันการยกเลิก"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ปุ่มปิด Modal ด้านล่าง - สำหรับมือถือ */}
              <div className="mt-6 pb-2">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  ปิด
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">ไม่พบข้อมูลการจอง</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
