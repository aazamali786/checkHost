import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';
import PropertyTags from '@/components/ui/PropertyTags';

const PlacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return '';
    }

    setLoading(true);

    const getPlace = async () => {
      const { data } = await axiosInstance.get(`/explore/places/${id}`);
      setPlace(data.place);
      setLoading(false);
    };
    getPlace();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/explore/places/${id}`);
      toast.success('Place deleted successfully');
      navigate('/explore');
    } catch (error) {
      console.error('Error deleting place:', error);
      toast.error(error.response?.data?.message || 'Failed to delete place');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!place) {
    return;
  }

  const isOwner = user && place.owner === user.id;

  return (
    <div className="mt-4 overflow-x-hidden px-8 pt-20 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">{place.title}</h1>
          <div className="mt-2">
            <PropertyTags
              propertyType={place.propertyType}
              price={place.price}
              maxGuests={place.maxGuests}
            />
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete Place
          </button>
        )}
      </div>

      <AddressLink placeAddress={place.address} />
      <PlaceGallery place={place} />

      <div className="mb-8 mt-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div className="">
          <div className="my-4 ">
            <h2 className="text-2xl font-semibold">Description</h2>
            {place.description}
          </div>
          Max number of guests: {place.maxGuests}
          <PerksWidget perks={place?.perks} />
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="-mx-8 border-t bg-white px-8 py-8">
        <div>
          <h2 className="mt-4 text-2xl font-semibold">Extra Info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm leading-5 text-gray-700">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
