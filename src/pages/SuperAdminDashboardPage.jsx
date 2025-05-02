import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, CheckCircle2, XCircle, Eye } from 'lucide-react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../../hooks';
import Spinner from '../components/ui/Spinner';

const SuperAdminDashboardPage = () => {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and is a super admin
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.role === 'superadmin') {
      fetchOwners();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOwners = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      // Set the token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;

      const response = await axiosInstance.get('/explore/user/owners');
      if (response.data.success) {
        setOwners(response.data.owners);
      } else {
        toast.error(response.data.message || 'Failed to fetch property owners');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error(
        error.response?.data?.message || 'Failed to fetch property owners',
      );
      setLoading(false);
    }
  };

  const handleVerify = async (ownerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Set the token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;

      const response = await axiosInstance.put(
        `/explore/user/verify-owner/${ownerId}`,
        {},
      );
      if (response.data.success) {
        toast.success(response.data.message || 'Owner verified successfully');
        fetchOwners(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to verify owner');
      }
    } catch (error) {
      console.error('Error verifying owner:', error);
      toast.error(error.response?.data?.message || 'Failed to verify owner');
    }
  };

  const handleUnverify = async (ownerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Set the token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;

      const response = await axiosInstance.put(
        `/explore/user/unverify-owner/${ownerId}`,
        {},
      );
      if (response.data.success) {
        toast.success(response.data.message || 'Owner unverified successfully');
        fetchOwners(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to unverify owner');
      }
    } catch (error) {
      console.error('Error unverifying owner:', error);
      toast.error(error.response?.data?.message || 'Failed to unverify owner');
    }
  };

  const handleViewDetails = (owner) => {
    setSelectedOwner(owner);
  };

  // Update the authentication check
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (!storedUser || storedUser.role !== 'superadmin') {
    return <Navigate to="/explore/super-admin/login" />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Property Owners KYC</h1>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Property Owners
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {owners.map((owner) => (
                  <tr key={owner._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              owner.picture || 'https://via.placeholder.com/40'
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            {owner.name}
                            {owner.isVerified && (
                              <CheckCircle2 className="ml-1 h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {owner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {owner.phone || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {owner.address || 'N/A'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          owner.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {owner.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(owner)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {!owner.isVerified ? (
                          <button
                            onClick={() => handleVerify(owner._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnverify(owner._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Owner Details Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Owner Details</h3>
              <button
                onClick={() => setSelectedOwner(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1">{selectedOwner.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1">{selectedOwner.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <p className="mt-1">{selectedOwner.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="mt-1">{selectedOwner.address || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1">
                  {selectedOwner.isVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboardPage;
