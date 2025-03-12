// src/pages/auth/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('กรุณากรอกชื่อ'),
  lastName: Yup.string()
    .required('กรุณากรอกนามสกุล'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'หมายเลขโทรศัพท์ไม่ถูกต้อง')
    .required('กรุณากรอกเบอร์โทรศัพท์'),
  email: Yup.string()
    .email('อีเมลไม่ถูกต้อง')
    .required('กรุณากรอกอีเมล'),
  password: Yup.string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .required('กรุณากรอกรหัสผ่าน'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'รหัสผ่านไม่ตรงกัน')
    .required('กรุณายืนยันรหัสผ่าน')
});

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      navigate('/user');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword: _confirmPassword, ...userData } = values;
      
      const result = await register(userData);
      if (result.success) {
        toast.success('ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ');
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลงทะเบียน');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ลงทะเบียนบัญชีใหม่
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          หรือ{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            เข้าสู่ระบบด้วยบัญชีที่มีอยู่แล้ว
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phone: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      ชื่อ
                    </label>
                    <div className="mt-1">
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.firstName && touched.firstName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      นามสกุล
                    </label>
                    <div className="mt-1">
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.lastName && touched.lastName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    เบอร์โทรศัพท์
                  </label>
                  <div className="mt-1">
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phone && touched.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    อีเมล
                  </label>
                  <div className="mt-1">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    รหัสผ่าน
                  </label>
                  <div className="mt-1">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    ยืนยันรหัสผ่าน
                  </label>
                  <div className="mt-1">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;