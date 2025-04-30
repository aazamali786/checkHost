import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterContext';
import { Search } from 'lucide-react';

// Rajasthan divisions and their districts
const rajasthanData = {
  'Ajmer Division': ['Ajmer', 'Bhilwara', 'Nagaur', 'Tonk'],
  'Bharatpur Division': ['Bharatpur', 'Dholpur', 'Karauli', 'Sawai Madhopur'],
  'Bikaner Division': ['Bikaner', 'Churu', 'Ganganagar', 'Hanumangarh'],
  'Jaipur Division': ['Jaipur', 'Alwar', 'Jhunjhunu', 'Sikar', 'Dausa'],
  'Jodhpur Division': [
    'Jodhpur',
    'Barmer',
    'Jaisalmer',
    'Jalore',
    'Pali',
    'Sirohi',
  ],
  'Kota Division': ['Kota', 'Baran', 'Bundi', 'Jhalawar'],
  'Udaipur Division': [
    'Udaipur',
    'Banswara',
    'Chittorgarh',
    'Dungarpur',
    'Rajsamand',
    'Pratapgarh',
  ],
};

const SearchBar = ({ isLandingPage }) => {
  const navigate = useNavigate();
  const { filters, updateFilters } = useFilters();
  const [selectedDivision, setSelectedDivision] = useState('');
  const [districtInput, setDistrictInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isValidDistrict, setIsValidDistrict] = useState(false);

  // Sync with filters when component mounts or filters change
  useEffect(() => {
    if (filters.location) {
      // Find the division that contains the location
      const division = Object.entries(rajasthanData).find(([_, districts]) =>
        districts.includes(filters.location),
      )?.[0];

      if (division) {
        setSelectedDivision(division);
        setDistrictInput(filters.location);
      }
    }
  }, [filters.location]);

  useEffect(() => {
    if (selectedDivision && districtInput) {
      const availableDistricts = rajasthanData[selectedDivision] || [];
      const matchingSuggestions = availableDistricts.filter((district) =>
        district.toLowerCase().includes(districtInput.toLowerCase()),
      );
      setSuggestions(matchingSuggestions);
      setIsValidDistrict(
        availableDistricts.some(
          (district) => district.toLowerCase() === districtInput.toLowerCase(),
        ),
      );
    } else {
      setSuggestions([]);
      setIsValidDistrict(false);
    }
  }, [selectedDivision, districtInput]);

  const handleSearch = () => {
    if (isValidDistrict) {
      updateFilters({
        ...filters,
        location: districtInput,
      });
      navigate('/explore');
    }
  };

  const baseClasses = isLandingPage
    ? 'relative flex w-full items-center gap-2 rounded-full border-2 border-indigo-200 bg-white p-3 shadow-lg transition-all duration-300 hover:border-indigo-300 hover:shadow-xl'
    : 'relative flex w-full items-center gap-2 rounded-full border border-indigo-200 bg-white p-2 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md';

  const selectClasses = isLandingPage
    ? 'w-1/3 rounded-l-full border-none bg-transparent px-6 py-3 text-base focus:outline-none focus:ring-0'
    : 'w-1/3 rounded-l-full border-none bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-0';

  const inputClasses = isLandingPage
    ? 'w-full border-none bg-transparent px-6 py-3 text-base focus:outline-none focus:ring-0'
    : 'w-full border-none bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-0';

  const buttonClasses = isLandingPage
    ? `flex items-center gap-2 rounded-full px-8 py-3 text-base font-medium transition-all duration-300 ${
        isValidDistrict
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-gray-100 text-gray-400'
      }`
    : `flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
        isValidDistrict
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-gray-100 text-gray-400'
      }`;

  return (
    <div className={baseClasses}>
      {/* Division Dropdown */}
      <select
        value={selectedDivision}
        onChange={(e) => {
          setSelectedDivision(e.target.value);
          setDistrictInput('');
        }}
        className={selectClasses}
      >
        <option value="">Select Division</option>
        {Object.keys(rajasthanData).map((division) => (
          <option key={division} value={division}>
            {division}
          </option>
        ))}
      </select>

      {/* Vertical Divider */}
      <div className="h-8 w-px bg-indigo-200"></div>

      {/* District Input with Suggestions */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Enter district..."
          value={districtInput}
          onChange={(e) => setDistrictInput(e.target.value)}
          className={inputClasses}
          disabled={!selectedDivision}
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && districtInput && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-indigo-100 bg-white py-2 shadow-lg">
            {suggestions.map((district) => (
              <button
                key={district}
                onClick={() => {
                  setDistrictInput(district);
                  setSuggestions([]);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50"
              >
                {district}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={!isValidDistrict}
        className={buttonClasses}
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </div>
  );
};

export default SearchBar;
