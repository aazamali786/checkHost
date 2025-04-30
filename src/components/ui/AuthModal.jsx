import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowLeft, User, Home, Shield } from 'lucide-react';
import { UserContext } from '@/providers/UserProvider';

const AuthModal = ({ onClose }) => {
  const [showUserType, setShowUserType] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    if (isSignup) {
      navigate(`/explore/register?role=${role}`);
    } else {
      if (role === 'user') {
        navigate('/explore/login');
      } else if (role === 'owner') {
        navigate('/explore/property-owner/login');
      } else if (role === 'admin') {
        navigate('/explore/admin/login');
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {!showUserType ? (
          <>
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">
                Welcome to Companion Cove
              </h2>
              <p className="mb-6 text-gray-600">
                Join our community to discover amazing places to stay
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsSignup(true);
                  setShowUserType(true);
                }}
                className="block w-full rounded-lg bg-primary p-3 text-center text-white transition hover:bg-primary/90"
              >
                Create an account
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSignup(false);
                  setShowUserType(true);
                }}
                className="block w-full rounded-lg border border-gray-300 p-3 text-center text-gray-700 transition hover:bg-gray-50"
              >
                Sign in
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowUserType(false)}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold">
                {isSignup ? 'Choose Account Type' : 'Choose Login Type'}
              </h2>
              <p className="mb-6 text-gray-600">
                {isSignup
                  ? 'Select the type of account you want to create'
                  : 'Select how you want to sign in'}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection('user')}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-300 p-4 text-left transition hover:border-primary hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {isSignup ? 'Register as User' : 'Login as User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isSignup
                      ? 'Find and book amazing places to stay'
                      : 'Access your user account'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection('owner')}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-300 p-4 text-left transition hover:border-primary hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {isSignup
                      ? 'Register as Property Owner'
                      : 'Login as Property Owner'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isSignup
                      ? 'List and manage your properties'
                      : 'Access your property owner account'}
                  </p>
                </div>
              </button>

              {!isSignup && (
                <button
                  onClick={() => handleRoleSelection('admin')}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-300 p-4 text-left transition hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Login as Admin</h3>
                    <p className="text-sm text-gray-600">
                      Access the admin dashboard
                    </p>
                  </div>
                </button>
              )}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
