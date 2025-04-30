import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded admin credentials
    const ADMIN_EMAIL = 'aazamali2903@gmail.com';
    const ADMIN_PASSWORD = 'aazam@2004';

    if (
      formData.email === ADMIN_EMAIL &&
      formData.password === ADMIN_PASSWORD
    ) {
      // Create admin user object
      const adminUser = {
        _id: 'admin',
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
      };

      // Store admin session
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('user', JSON.stringify(adminUser));

      // Update auth context
      auth.setUser(adminUser);

      toast.success('Admin login successful');
      setRedirect('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  if (redirect) {
    return <Navigate to={`/explore${redirect}`} />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl">Admin Login</h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleFormData}
          />
          <input
            name="password"
            type="password"
            placeholder="Admin Password"
            value={formData.password}
            onChange={handleFormData}
          />
          <button className="primary my-4">Login</button>
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

export default AdminLoginPage;
