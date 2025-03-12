// src/pages/auth/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('อีเมลไม่ถูกต้อง')
    .required('กรุณากรอกอีเมล'),
  password: Yup.string()
    .required('กรุณากรอกรหัสผ่าน')
});

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        toast.success('เข้าสู่ระบบสำเร็จ');
        if (result.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserType = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isAdmin ? 'เข้าสู่ระบบสำหรับผู้ดูแล' : 'เข้าสู่ระบบ'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {!isAdmin && 'หรือ '}
          {!isAdmin && (
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              ลงทะเบียนบัญชีใหม่
            </Link>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
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
                      autoComplete="current-password"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      จดจำฉัน
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isAdmin
                        ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
                  >
                    {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <button
              type="button"
              onClick={toggleUserType}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isAdmin ? 'เข้าสู่ระบบสำหรับผู้ใช้ทั่วไป' : 'เข้าสู่ระบบสำหรับผู้ดูแลระบบ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;