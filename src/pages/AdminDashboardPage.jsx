import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';
import { Mail, User } from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlaces: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pendingPlaces, setPendingPlaces] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/stats');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingPlaces = async () => {
      try {
        const { data } = await axiosInstance.get('/explore/places/pending');
        if (data.success) {
          setPendingPlaces(data.places);
        }
      } catch (error) {
        console.error('Error fetching pending places:', error);
      }
    };

    fetchStats();
    fetchPendingPlaces();
  }, []);

  const handleActivate = async (placeId) => {
    try {
      const { data } = await axiosInstance.put(`/places/activate/${placeId}`);
      if (data.success) {
        toast.success(data.message);
        setPendingPlaces(
          pendingPlaces.filter((place) => place._id !== placeId),
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate place');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Total Properties</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalPlaces}</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalBookings}</p>
        </div>
      </div>

      {/* Pending Properties Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Pending Properties</h2>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            {pendingPlaces.length} Pending
          </span>
        </div>

        {pendingPlaces.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingPlaces.map((place) => (
              <div
                key={place._id}
                className="relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
              >
                <PlaceCard place={place} />
                <div className="p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{place.owner?.name}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{place.owner?.email}</span>
                  </div>
                  <button
                    onClick={() => handleActivate(place._id)}
                    className="w-full rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                  >
                    Activate Property
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              No Pending Properties
            </h3>
            <p className="text-gray-600">
              All properties have been reviewed and activated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
