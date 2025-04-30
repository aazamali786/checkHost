import React from 'react';
import { Link } from 'react-router-dom';
import PropertyTags from './PropertyTags';

const PlaceCard = ({ place }) => {
  const { _id: placeId, photos, address, title, price, propertyType } = place;
  return (
    <Link
      to={`/explore/place/${placeId}`}
      className="m-4 flex flex-col md:m-2 xl:m-0"
    >
      <div className="card flex flex-col gap-2 p-3">
        {photos?.[0] && (
          <div className="overflow-hidden rounded-xl">
            <img
              src={`${photos?.[0]}`}
              className="h-[200px] w-full object-cover transition-transform duration-300 hover:scale-110"
              alt={title}
            />
          </div>
        )}
        <div className="space-y-1">
          <h2 className="truncate font-bold">{address}</h2>
          <h3 className="truncate text-sm text-gray-500">{title}</h3>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-semibold">₹{price}</span>
          <span className="ml-1 text-gray-500">per month</span>
        </div>
        <div className="mt-1">
          <PropertyTags propertyType={propertyType} price={price} />
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
