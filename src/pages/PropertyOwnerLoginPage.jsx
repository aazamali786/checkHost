import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '../../hooks';

const PropertyOwnerLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await auth.login(formData);
    if (response.success) {
      toast.success(response.message);
      setRedirect('/explore/account/places');
    } else {
      toast.error(response.message);
    }
  };

  const handleGoogleLogin = async (credential) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      toast.success(response.message);
      setRedirect('/explore/account/places');
    } else {
      toast.error(response.message);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-md flex-col items-center justify-center px-4 pt-20">
      <div className="w-full space-y-4 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login as Property Owner</h1>
          <p className="mt-2 text-gray-600">
            Access your property owner account
          </p>
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
              placeholder="your@email.com"
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
              placeholder="password"
              value={formData.password}
              onChange={handleFormData}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button className="primary w-full">Login</button>
        </form>

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="h-0 w-1/2 border-[1px]"></div>
          <p className="small -mt-1">or</p>
          <div className="h-0 w-1/2 border-[1px]"></div>
        </div>

        {/* Google login button */}
        <div className="flex h-[50px] justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            text="continue_with"
            width="350"
          />
        </div>

        <div className="py-2 text-center text-gray-500">
          Don't have an account yet?{' '}
          <Link
            className="text-black underline"
            to={'/explore/property-owner/register'}
          >
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerLoginPage;
