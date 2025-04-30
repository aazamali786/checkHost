import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { LogIn, User, Home, Shield, LogOut } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import { useAuth } from '../../hooks';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

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
      {/* Header Section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 w-full bg-gradient-to-r from-white/90 via-indigo-50/90 to-white/90 px-6 py-4 shadow-lg backdrop-blur-md"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-indigo-100 ring-offset-2"
            >
              <img
                src="/assets/companioncove.jpg"
                alt="Companion Cove Logo"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div>
              <h1 className="bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                Companion Cove
              </h1>
              <p className="text-sm font-medium text-indigo-600/80">
                Your Home Away From Home
              </p>
            </div>
          </motion.div>

          {/* Login Button and Dropdown */}
          <motion.div
            className="relative"
            ref={dropdownRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {!user ? (
              <>
                <motion.button
                  onClick={() => setShowLogin(!showLogin)}
                  className="group relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-50"
                    aria-hidden="true"
                  />
                  <LogIn className="h-4 w-4" />
                  <span className="relative">Login</span>
                </motion.button>

                <motion.div
                  className={`absolute right-0 top-12 w-48 rounded-lg border border-indigo-100 bg-white/95 py-2 shadow-xl shadow-indigo-500/10 backdrop-blur-sm transition-all duration-200 ${
                    showLogin
                      ? 'visible translate-y-0 opacity-100'
                      : 'invisible -translate-y-2 opacity-0'
                  }`}
                  animate={{ y: showLogin ? 0 : -10 }}
                >
                  <Link
                    to="/explore/login"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 transition-colors duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50"
                  >
                    <User className="h-4 w-4" />
                    User Login
                  </Link>
                  <Link
                    to="/explore/property-owner/login"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 transition-colors duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50"
                  >
                    <Home className="h-4 w-4" />
                    Owner Login
                  </Link>
                  <Link
                    to="/explore/admin/login"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 transition-colors duration-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Login
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => setShowLogin(!showLogin)}
                  className="flex items-center gap-3 rounded-full border border-indigo-200 bg-white/80 p-2 pr-4 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md hover:ring-2 hover:ring-indigo-100 hover:ring-offset-1"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.picture}
                      alt={user.name}
                      className="rounded-full"
                    />
                    <AvatarFallback className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-indigo-700">
                      {user.name}
                    </span>
                    <span className="text-xs text-indigo-500">
                      {user.role === 'owner' ? 'Property Owner' : 'User'} #
                      {user._id.slice(-6)}
                    </span>
                  </div>
                </motion.button>

                <motion.div
                  className={`absolute right-0 top-14 w-48 rounded-lg border border-indigo-100 bg-white py-2 shadow-lg transition-all duration-200 ${
                    showLogin ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                >
                  <div className="border-b border-indigo-100 px-4 pb-2">
                    <p className="text-sm font-medium text-indigo-700">
                      {user.name}
                    </p>
                    <p className="text-xs text-indigo-500">{user.email}</p>
                  </div>
                  <Link
                    to="/explore/account"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                  {user.role === 'owner' && (
                    <Link
                      to="/explore/account/places"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                    >
                      <Home className="h-4 w-4" />
                      My Properties
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content with adjusted padding for fixed header */}
      <div className="container mx-auto px-4 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-6 text-5xl font-bold text-gray-800 md:text-6xl">
            Find Your Perfect Stay in Rajasthan
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12 text-xl text-gray-600 md:text-2xl"
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
