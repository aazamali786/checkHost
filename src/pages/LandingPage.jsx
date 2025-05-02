import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { LogIn, User, Home, Shield, LogOut, Plus } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import { useAuth } from '../../hooks';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import Header from '@/components/ui/Header';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogin(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Use the main Header component */}
      <Header />

      {/* Main Content with adjusted padding for fixed header */}
      <div className="container mx-auto px-4 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-6 text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl">
            Find Your Perfect Stay in Rajasthan
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12 text-lg text-gray-600 sm:text-xl md:text-2xl"
          >
            Discover affordable PGs, hostels, and rental spaces for students and
            professionals
          </motion.p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto max-w-2xl"
          >
            <SearchBar isLandingPage={true} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {[
            {
              title: 'PG & Hostels',
              description:
                'Comfortable and affordable accommodations with all essential amenities',
              icon: '🏠',
            },
            {
              title: 'Instant Move-In',
              description:
                'Quick and hassle-free move-in process with minimal documentation',
              icon: '🔑',
            },
            {
              title: 'Banquet Halls & Rooftops',
              description:
                'Perfect venues for events, gatherings, and celebrations',
              icon: '🎉',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 rounded-xl bg-white p-8 shadow-lg"
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Low Security Deposit
                </h3>
                <p className="text-gray-600">
                  Minimal security deposit with flexible payment options
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Instant Move-In</h3>
                <p className="text-gray-600">
                  Quick booking and same-day move-in facility available
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🛋️</div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Fully Furnished</h3>
                <p className="text-gray-600">
                  Ready-to-move-in spaces with all essential furniture
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Safe & Secure</h3>
                <p className="text-gray-600">
                  24/7 security and CCTV surveillance for your peace of mind
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 rounded-xl bg-indigo-50 p-8 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            Looking for Something Specific?
          </h2>
          <p className="mb-6 text-xl text-gray-600">
            We have options for everyone:
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              'Student PGs',
              'Working Professional Hostels',
              'Family Banquet Halls',
              'Party Rooftops',
              'Short-term Stays',
              'Female/Male Specific PGs',
            ].map((type) => (
              <motion.div
                key={type}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg bg-white p-3 shadow-sm"
              >
                <p className="font-medium text-gray-800">{type}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 text-center"
        >
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            Available Amenities
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              'WiFi',
              'Food Service',
              'Laundry',
              'Power Backup',
              'AC Rooms',
              'Study Area',
              'Common Room',
              'Housekeeping',
            ].map((amenity) => (
              <motion.div
                key={amenity}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg bg-gray-100 p-4 shadow-md"
              >
                <p className="font-semibold text-gray-800">{amenity}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Districts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 rounded-xl bg-white p-8 shadow-lg"
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Available in all districts of Rajasthan
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              { name: 'Jaipur', division: 'Jaipur Division' },
              { name: 'Jodhpur', division: 'Jodhpur Division' },
              { name: 'Udaipur', division: 'Udaipur Division' },
              { name: 'Kota', division: 'Kota Division' },
              { name: 'Bikaner', division: 'Bikaner Division' },
              { name: 'Ajmer', division: 'Ajmer Division' },
              { name: 'Bharatpur', division: 'Bharatpur Division' },
              { name: 'Alwar', division: 'Jaipur Division' },
              { name: 'Sikar', division: 'Jaipur Division' },
              { name: 'Bhilwara', division: 'Ajmer Division' },
              { name: 'Sri Ganganagar', division: 'Bikaner Division' },
              { name: 'Chittorgarh', division: 'Udaipur Division' },
              { name: 'Jhunjhunu', division: 'Jaipur Division' },
              { name: 'Pali', division: 'Jodhpur Division' },
              { name: 'Tonk', division: 'Ajmer Division' },
            ].map((district) => (
              <motion.div
                key={district.name}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
              >
                <div className="mb-2 text-lg font-semibold text-gray-800">
                  {district.name}
                </div>
                <div className="text-sm text-gray-500">{district.division}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600">And many more !!!</p>
            <Link
              to="/explore"
              className="mt-4 inline-block rounded-full bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              Explore All Locations
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
