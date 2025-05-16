import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterContext';
import { useAuth } from '../../../hooks';
import { Search } from 'lucide-react';

// Rajasthan divisions and their districts
const rajasthanData = {
  'Ajmer Division': ['Ajmer', 'Beawar', 'Bhilwara', 'Nagaur', 'Tonk', 'Nagaur'],
  'Bharatpur Division': [
    'Bharatpur',
    'Dholpur',
    'Karauli',
    'Sawai Madhopur',
    'Deeg',
  ],
  'Bikaner Division': ['Bikaner', 'Churu', 'Ganganagar', 'Hanumangarh'],
  'Jaipur Division': [
    'Jaipur',
    'Alwar',
    'Jhunjhunu',
    'Sikar',
    'Dausa',
    'Khairthal-Tijara',
    'Kotputli-Behror',
  ],
  'Jodhpur Division': [
    'Jodhpur',
    'Barmer',
    'Jaisalmer',
    'Jalore',
    'Pali',
    'Sirohi',
    'Phalodi',
    'Balotra'
  ],
  'Kota Division': ['Kota', 'Baran', 'Bundi', 'Jhalawar'],
  'Udaipur Division': [
    'Udaipur',
    'Banswara',
    'Chittorgarh',
    'Dungarpur',
    'Rajsamand',
    'Salumbar',
    'Pratapgarh',
  ],
};

const SearchBar = ({ isLandingPage }) => {
  const navigate = useNavigate();
  const { filters, updateFilters } = useFilters();
  const { user } = useAuth();
  const [selectedDivision, setSelectedDivision] = useState('');
  const [districtInput, setDistrictInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isValidDistrict, setIsValidDistrict] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        // Reset suggestions when filters change
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      // Reset all states when filters.location is empty
      setSelectedDivision('');
      setDistrictInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filters.location]);

  useEffect(() => {
    if (selectedDivision && districtInput) {
      const availableDistricts = rajasthanData[selectedDivision] || [];
      const matchingSuggestions = availableDistricts.filter((district) =>
        district.toLowerCase().includes(districtInput.toLowerCase()),
      );
      setSuggestions(matchingSuggestions);
      setShowSuggestions(matchingSuggestions.length > 0);
      setIsValidDistrict(
        availableDistricts.some(
          (district) => district.toLowerCase() === districtInput.toLowerCase(),
        ),
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsValidDistrict(false);
    }
  }, [selectedDivision, districtInput]);

  const handleDistrictSelect = (district) => {
    setDistrictInput(district);
    setSuggestions([]);
    setShowSuggestions(false);
    document.querySelector('input[type="text"]')?.focus();
  };

  const handleInputChange = (e) => {
    setDistrictInput(e.target.value);
    if (e.target.value === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow click events to fire first
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSearch = () => {
    if (isValidDistrict) {
      setSuggestions([]);
      setShowSuggestions(false);
      updateFilters({
        ...filters,
        location: districtInput,
      });

      // Only check authentication when not on landing page
      if (!isLandingPage && !user) {
        navigate('/explore/login');
        return;
      }

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
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={inputClasses}
          disabled={!selectedDivision}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && districtInput && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setShowSuggestions(false);
                setSuggestions([]);
              }}
            />
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-indigo-100 bg-white py-2 shadow-lg">
              {suggestions.map((district) => (
                <button
                  key={district}
                  onClick={() => handleDistrictSelect(district)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                >
                  {district}
                </button>
              ))}
            </div>
          </>
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
