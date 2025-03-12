// src/pages/user/ChangePassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'กรุณากรอกรหัสผ่านปัจจุบัน';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'กรุณากรอกรหัสผ่านใหม่';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่านใหม่';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const result = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (result.success) {
        toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Navigate back to profile
        navigate('/user/profile');
      } else {
        if (result.message && result.message.includes('รหัสผ่านปัจจุบันไม่ถูกต้อง')) {
          setErrors({
            ...errors,
            currentPassword: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
          });
          toast.error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        } else {
          toast.error(result.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-teal-700 p-4 flex items-center">
        <Link to="/user/profile" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white text-lg font-medium ml-4">เปลี่ยนรหัสผ่าน</h1>
      </div>

      {/* Form */}
      <div className="p-4 mt-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
              รหัสผ่านปัจจุบัน
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.currentPassword ? 'border-red-500' : ''
              }`}
              id="currentPassword"
              type="password"
              placeholder="รหัสผ่านปัจจุบัน"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              รหัสผ่านใหม่
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.newPassword ? 'border-red-500' : ''
              }`}
              id="newPassword"
              type="password"
              placeholder="รหัสผ่านใหม่"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            {errors.newPassword ? (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              id="confirmPassword"
              type="password"
              placeholder="ยืนยันรหัสผ่านใหม่"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
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
                'เปลี่ยนรหัสผ่าน'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;