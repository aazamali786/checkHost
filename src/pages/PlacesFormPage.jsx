import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

import AccountNav from '@/components/ui/AccountNav';
import Perks from '@/components/ui/Perks';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';

const PROPERTY_TYPES = [
  'pg',
  'hostel',
  'party-hall',
  'banquet-hall',
  'rooftop',
];

const PlacesFormPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState(PROPERTY_TYPES);

  // Redirect if user is not logged in or is not an owner
  if (!user) {
    return <Navigate to="/explore/login" />;
  }

  if (user.role !== 'owner') {
    toast.error('Only property owners can add places');
    return <Navigate to="/explore" />;
  }

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    perks: [],
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 1,
    price: 500,
    propertyType: 'pg',
  });

  const {
    title,
    address,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    propertyType,
  } = formData;

  useEffect(() => {
    // Fetch property types
    const fetchPropertyTypes = async () => {
      try {
        const { data } = await axiosInstance.get(
          '/explore/places/property-types',
        );
        if (data.success && data.propertyTypes.length > 0) {
          setPropertyTypes(data.propertyTypes);
        }
      } catch (error) {
        console.error('Error fetching property types:', error);
      }
    };
    fetchPropertyTypes();
  }, []);

  const isValidPlaceData = () => {
    if (title.trim() === '') {
      toast.error("Title can't be empty!");
      return false;
    } else if (address.trim() === '') {
      toast.error("Address can't be empty!");
      return false;
    } else if (addedPhotos.length < 5) {
      toast.error('Upload at least 5 photos!');
      return false;
    } else if (description.trim() === '') {
      toast.error("Description can't be empty!");
      return false;
    } else if (maxGuests < 1) {
      toast.error('At least one guest is required!');
      return false;
    } else if (maxGuests > 100) {
      toast.error("Max. guests can't be greater than 100");
      return false;
    } else if (!propertyType) {
      toast.error('Property type must be selected!');
      return false;
    }

    return true;
  };

  const handleFormData = (e) => {
    const { name, value, type } = e.target;
    // If the input is not a checkbox, update 'formData' directly
    if (type !== 'checkbox') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // If type is checkbox (perks)
    if (type === 'checkbox') {
      const currentPerks = [...perks];
      let updatedPerks = [];

      // Check if the perk is already in perks array
      if (currentPerks.includes(name)) {
        updatedPerks = currentPerks.filter((perk) => perk !== name);
      } else {
        updatedPerks = [...currentPerks, name];
      }
      setFormData({ ...formData, perks: updatedPerks });
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axiosInstance.get(`/explore/places/${id}`).then((response) => {
      const { place } = response.data;
      // update the state of formData
      for (let key in formData) {
        if (place.hasOwnProperty(key)) {
          setFormData((prev) => ({
            ...prev,
            [key]: place[key],
          }));
        }
      }

      // update photos state separately
      setAddedPhotos([...place.photos]);

      setLoading(false);
    });
  }, [id]);

  const preInput = (header, description) => {
    return (
      <>
        <h2 className="mt-4 text-2xl">{header}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const formDataIsValid = isValidPlaceData();
    // console.log(isValidPlaceData());
    const placeData = { ...formData, addedPhotos };

    // Make API call only if formData is valid
    if (formDataIsValid) {
      if (id) {
        // update existing place
        const { data } = await axiosInstance.put(
          '/explore/places/update-place',
          {
            id,
            ...placeData,
          },
        );
      } else {
        // new place
        const { data } = await axiosInstance.post(
          '/explore/places/add-places',
          placeData,
        );
      }
      setRedirect(true);
    }
  };

  const renderGuestsAndPriceSection = () => {
    if (propertyType === 'pg' || propertyType === 'hostel') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="-mb-1 mt-2">Max number of guests</h3>
            <input
              type="number"
              name="maxGuests"
              value={maxGuests}
              onChange={handleFormData}
            />
          </div>
          <div>
            <h3 className="-mb-1 mt-2">Price per month</h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
            />
          </div>
        </div>
      );
    }

    return (
      <>
        {preInput(
          'Check in&out times, max guests and price',
          'add check in and out times, remember to have some time window for cleaning between guests',
        )}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div>
            <h3 className="-mb-1 mt-2">Check in time</h3>
            <input
              type="text"
              name="checkIn"
              value={checkIn}
              onChange={handleFormData}
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="-mb-1 mt-2">Check out time</h3>
            <input
              type="text"
              name="checkOut"
              value={checkOut}
              onChange={handleFormData}
              placeholder="11:00"
            />
          </div>
          <div>
            <h3 className="-mb-1 mt-2">Max number of guests</h3>
            <input
              type="number"
              name="maxGuests"
              value={maxGuests}
              onChange={handleFormData}
            />
          </div>
          <div>
            <h3 className="-mb-1 mt-2">Price per day</h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
            />
          </div>
        </div>
      </>
    );
  };

  if (redirect) {
    return <Navigate to={'/explore/account/places'} />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          'Title',
          'title for your place. Should be short and catchy as in advertisement',
        )}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="title, for example: My lovely apt"
        />

        {preInput('Property Type', 'select the type of property')}
        <select
          name="propertyType"
          value={propertyType}
          onChange={handleFormData}
          className="w-full rounded-2xl border p-2"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </option>
          ))}
        </select>

        {preInput('Address', 'address to this place')}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="address"
        />

        {preInput('Photos', 'more = better')}
        <PhotosUploader
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
        />

        {preInput('Description', 'discription of the place')}
        <textarea
          value={description}
          name="description"
          onChange={handleFormData}
        />

        {preInput('Perks', ' select all the perks of your place')}
        <Perks selected={perks} handleFormData={handleFormData} />

        {preInput('Extra info', 'house rules, etc ')}
        <textarea
          value={extraInfo}
          name="extraInfo"
          onChange={handleFormData}
        />

        {renderGuestsAndPriceSection()}

        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
