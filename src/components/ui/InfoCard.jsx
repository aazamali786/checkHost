import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import PlaceImg from './PlaceImg';

const PropertyTypeBadge = ({ type }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'pg':
        return 'bg-blue-100 text-blue-800';
      case 'hostel':
        return 'bg-green-100 text-green-800';
      case 'party-hall':
        return 'bg-purple-100 text-purple-800';
      case 'banquet-hall':
        return 'bg-yellow-100 text-yellow-800';
      case 'rooftop':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getTypeColor(type)}`}
    >
      {type
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}
    </span>
  );
};

const InfoCard = ({ place, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation from Link
    if (!window.confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/explore/places/${place._id}`);
      toast.success('Place deleted successfully');
      if (onDelete) {
        onDelete(place._id);
      }
    } catch (error) {
      console.error('Error deleting place:', error);
      toast.error(error.response?.data?.message || 'Failed to delete place');
    }
  };

  return (
    <Link
      to={`/explore/place/${place._id}`}
      className="my-3 flex cursor-pointer flex-col gap-4 rounded-2xl bg-gray-100 p-4 transition-all hover:bg-gray-300 md:flex-row"
      key={place._id}
    >
      <div className="flex w-full shrink-0 bg-gray-300 sm:h-32 sm:w-32 ">
        <PlaceImg place={place} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-medium md:text-xl">{place.title}</h2>
              <PropertyTypeBadge type={place.propertyType || 'pg'} />
            </div>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
          <p className="mt-1 line-clamp-3 text-sm text-gray-600">
            {place.description}
          </p>
          <div className="mt-auto flex items-center gap-2">
            <span className="font-medium">₹{place.price}</span>
            <span className="text-gray-600">
              {place.propertyType === 'pg' || place.propertyType === 'hostel'
                ? 'per month'
                : 'per day'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InfoCard;
