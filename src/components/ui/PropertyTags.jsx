import React from 'react';

const PropertyTags = ({ propertyType, price }) => {
  const formatPropertyType = (type) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPriceTag = (price) => {
    if (price < 1000) return { text: 'Budget', icon: '💰' };
    if (price < 3000) return { text: 'Mid-Range', icon: '💎' };
    return { text: 'Premium', icon: '👑' };
  };

  const getPropertyTypeIcon = (type) => {
    const icons = {
      pg: '🛏️',
      hostel: '🏨',
      'party-hall': '🎉',
      'banquet-hall': '🎊',
      rooftop: '🌆',
    };
    return icons[type] || '🏠';
  };

  const tagStyles = {
    propertyType:
      'bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-700 border border-blue-200',
    price:
      'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-emerald-700 border border-emerald-200',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {propertyType && (
        <span
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:shadow-md ${tagStyles.propertyType}`}
        >
          <span className="text-base">{getPropertyTypeIcon(propertyType)}</span>
          {formatPropertyType(propertyType)}
        </span>
      )}
      {price && (
        <span
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:shadow-md ${tagStyles.price}`}
        >
          <span className="text-base">{getPriceTag(price).icon}</span>
          {getPriceTag(price).text}
        </span>
      )}
    </div>
  );
};

export default PropertyTags;
