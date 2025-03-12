// src/pages/user/PersonalInfo.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const PersonalInfo = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      district: '',
      province: '',
      postalCode: ''
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/users/profile');
        
        // Initialize form with user data
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          address: {
            street: response.data.address?.street || '',
            city: response.data.address?.city || '',
            district: response.data.address?.district || '',
            province: response.data.address?.province || '',
            postalCode: response.data.address?.postalCode || ''
          }
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('อัพเดทข้อมูลส่วนตัวสำเร็จ');
        navigate('/user/profile');
      } else {
        toast.error(result.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-teal-700 p-4 flex items-center">
        <Link to="/user/profile" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white text-lg font-medium ml-4">ข้อมูลส่วนตัว</h1>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              ชื่อ
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="ชื่อ"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              นามสกุล
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="นามสกุล"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              เบอร์โทรศัพท์
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder="เบอร์โทรศัพท์"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              อีเมล
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
              id="email"
              type="email"
              placeholder="อีเมล"
              name="email"
              value={formData.email}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">อีเมลไม่สามารถเปลี่ยนได้</p>
          </div>

          <h3 className="text-lg font-semibold my-4 pb-2 border-b">ที่อยู่</h3>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
              ที่อยู่
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="street"
              type="text"
              placeholder="บ้านเลขที่ ถนน ซอย"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                แขวง/ตำบล
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="city"
                type="text"
                placeholder="แขวง/ตำบล"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">
                เขต/อำเภอ
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="district"
                type="text"
                placeholder="เขต/อำเภอ"
                name="address.district"
                value={formData.address.district}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                จังหวัด
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="province"
                type="text"
                placeholder="จังหวัด"
                name="address.province"
                value={formData.address.province}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                รหัสไปรษณีย์
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="postalCode"
                type="text"
                placeholder="รหัสไปรษณีย์"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                maxLength="5"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                  กำลังบันทึก...
                </span>
              ) : (
                'บันทึกข้อมูล'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;