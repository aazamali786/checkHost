import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';
import axiosInstance from '../utils/axios';

const SuperAdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded super admin credentials
    const SUPER_ADMIN_EMAIL = 'superadmin@gmail.com';
    const SUPER_ADMIN_PASSWORD = 'aazam@2004';

    if (
      formData.email === SUPER_ADMIN_EMAIL &&
      formData.password === SUPER_ADMIN_PASSWORD
    ) {
      try {
        // Create super admin user object
        const superAdminUser = {
          _id: 'superadmin',
          name: 'Super Admin',
          email: SUPER_ADMIN_EMAIL,
          role: 'superadmin',
        };

        // Store super admin session
        localStorage.setItem('token', 'superadmin-token');
        localStorage.setItem('user', JSON.stringify(superAdminUser));

        // Update auth context
        auth.setUser(superAdminUser);

        // Set the token in axios headers
        axiosInstance.defaults.headers.common['Authorization'] =
          'Bearer superadmin-token';

        toast.success('Super Admin login successful');
        setRedirect('/explore/super-admin/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed');
      }
    } else {
      toast.error('Invalid super admin credentials');
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.role === 'superadmin') {
      setRedirect('/explore/super-admin/dashboard');
    } else {
      setLoading(false);
    }
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-md flex-col items-center justify-center px-4 pt-20">
      <div className="w-full space-y-4 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Super Admin Login</h1>
          <p className="mt-2 text-gray-600">Access the super admin dashboard</p>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Super Admin Email"
              value={formData.email}
              onChange={handleFormData}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Super Admin Password"
              value={formData.password}
              onChange={handleFormData}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button className="primary w-full">Login</button>
        </form>

        <div className="py-2 text-center text-gray-500">
          <Link className="text-black underline" to={'/'}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
