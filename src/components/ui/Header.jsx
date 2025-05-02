import React, { useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../hooks';
import { useFilters } from '../../context/FilterContext';
import SearchBar from './SearchBar';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import {
  LogIn,
  LogOut,
  User,
  Filter,
  ChevronDown,
  Home,
  Shield,
  Plus,
  Menu,
  X,
} from 'lucide-react';

export const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { filters, updateFilters } = useFilters();
  const { user, logout } = auth;

  const handleScroll = () => {
    const shouldHaveShadow = window.scrollY > 0;
    setHasShadow(shouldHaveShadow);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleFilterChange = (key, value) => {
    updateFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogin(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    if (location.pathname === '/explore') {
      setShowSearchBar(true);
    } else {
      setShowSearchBar(false);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        hasShadow
          ? 'bg-gradient-to-r from-white/95 via-indigo-50/95 to-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-lg'
          : 'bg-gradient-to-r from-white/90 via-indigo-50/90 to-white/90 backdrop-blur-md'
      }`}
    >
      <div className="relative">
        {/* Subtle highlight line at the bottom */}
        <div className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />

        {/* Main header content */}
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-8 lg:px-12">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="overflow-hidden rounded-full ring-2 ring-indigo-100 ring-offset-2 transition-all duration-300 group-hover:ring-indigo-300 group-hover:ring-offset-4">
              <img
                className="h-8 w-8 object-cover transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 md:h-12 md:w-12"
                src="/assets/companioncove.jpg"
                alt="Companion Cove Logo"
              />
            </div>
            <div>
              <span className="hidden bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-lg font-bold text-transparent transition-all duration-300 group-hover:from-indigo-600 group-hover:to-blue-500 sm:text-xl md:block">
                Companion Cove
              </span>
              <span className="hidden text-xs font-medium text-indigo-600/80 transition-opacity duration-300 group-hover:text-indigo-500 sm:text-sm md:block">
                Your Home Away From Home
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-4 rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Search Bar with enhanced styling */}
          {showSearchBar && (
            <div className="mx-4 flex-1 md:mx-8">
              <div className="mx-auto max-w-2xl transition-transform duration-300 hover:scale-[1.01]">
                <SearchBar />
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {showSearchBar && (
              <div className="relative" ref={filterDropdownRef}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md hover:ring-2 hover:ring-indigo-100 hover:ring-offset-1"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className="h-4 w-4" />
                  {Object.values(filters).some((value) => value !== '') && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                      {
                        Object.values(filters).filter((value) => value !== '')
                          .length
                      }
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                <div
                  className={`absolute right-0 top-12 w-72 rounded-lg border border-indigo-100 bg-white p-4 shadow-lg transition-all duration-200 ${
                    showFilters ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                >
                  {/* Location Filter */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-indigo-700">
                      Location
                    </label>
                    <select
                      className="w-full rounded-lg border border-indigo-200 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange('location', e.target.value)
                      }
                    >
                      <option value="">All Locations</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="pune">Pune</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-indigo-700">
                      Price Range
                    </label>
                    <select
                      className="w-full rounded-lg border border-indigo-200 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={filters.priceRange}
                      onChange={(e) =>
                        handleFilterChange('priceRange', e.target.value)
                      }
                    >
                      <option value="">Any Price</option>
                      <option value="0-5000">₹0 - ₹5,000</option>
                      <option value="5000-10000">₹5,000 - ₹10,000</option>
                      <option value="10000-15000">₹10,000 - ₹15,000</option>
                      <option value="15000+">₹15,000+</option>
                    </select>
                  </div>

                  {/* Property Type Filter */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-indigo-700">
                      Property Type
                    </label>
                    <select
                      className="w-full rounded-lg border border-indigo-200 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={filters.propertyType}
                      onChange={(e) =>
                        handleFilterChange('propertyType', e.target.value)
                      }
                    >
                      <option value="">All Types</option>
                      <option value="pg">PG</option>
                      <option value="hostel">Hostel</option>
                      <option value="party-hall">Party Hall</option>
                      <option value="banquet-hall">Banquet Hall</option>
                      <option value="rooftop">Rooftop</option>
                    </select>
                  </div>

                  {/* Capacity Filter */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-indigo-700">
                      Capacity
                    </label>
                    <select
                      className="w-full rounded-lg border border-indigo-200 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={filters.capacity}
                      onChange={(e) =>
                        handleFilterChange('capacity', e.target.value)
                      }
                    >
                      <option value="">Any Capacity</option>
                      <option value="1-2">1-2 Guests</option>
                      <option value="3-4">3-4 Guests</option>
                      <option value="5+">5+ Guests</option>
                    </select>
                  </div>

                  {/* Apply Filters Button */}
                  <button
                    onClick={handleApplyFilters}
                    className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {!user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-md hover:ring-2 hover:ring-indigo-300 hover:ring-offset-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>

                <div
                  className={`absolute right-0 top-12 w-48 rounded-lg border border-indigo-100 bg-white py-2 shadow-lg transition-all duration-200 ${
                    showLogin ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                >
                  <Link
                    to="/explore/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                  >
                    <User className="h-4 w-4" />
                    User Login
                  </Link>
                  <Link
                    to="/explore/property-owner/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                  >
                    <Home className="h-4 w-4" />
                    Owner Login
                  </Link>
                  <Link
                    to="/explore/admin/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Login
                  </Link>
                  <Link
                    to="/explore/super-admin/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                  >
                    <Shield className="h-4 w-4" />
                    Super Admin Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
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
                      {user.role === 'owner'
                        ? 'Property Owner'
                        : user.role === 'admin'
                          ? 'Admin'
                          : user.role === 'superadmin'
                            ? 'Super Admin'
                            : 'User'}
                    </span>
                  </div>
                </button>

                <div
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
                  {user.role === 'owner' ? (
                    <>
                      <Link
                        to="/explore/account/places"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Home className="h-4 w-4" />
                        My Properties
                      </Link>
                      <Link
                        to="/explore/account/places/new"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Plus className="h-4 w-4" />
                        Add New Property
                      </Link>
                      <Link
                        to="/explore/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </>
                  ) : user.role === 'admin' ? (
                    <>
                      <Link
                        to="/explore/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/explore/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </>
                  ) : user.role === 'superadmin' ? (
                    <>
                      <Link
                        to="/explore/super-admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Shield className="h-4 w-4" />
                        Property Owners KYC
                      </Link>
                      <Link
                        to="/explore/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/explore/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        to="/explore/account/bookings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 transition hover:bg-indigo-50"
                      >
                        <Home className="h-4 w-4" />
                        My Bookings
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 top-[72px] z-40 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col space-y-4 p-4">
            {showSearchBar && (
              <div className="w-full">
                <SearchBar />
              </div>
            )}
            {showSearchBar && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex w-full items-center justify-between rounded-lg border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700"
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
            {!user ? (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/explore/login"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  <User className="h-4 w-4" />
                  User Login
                </Link>
                <Link
                  to="/explore/property-owner/login"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  <Home className="h-4 w-4" />
                  Owner Login
                </Link>
                <Link
                  to="/explore/admin/login"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  <Shield className="h-4 w-4" />
                  Admin Login
                </Link>
                <Link
                  to="/explore/super-admin/login"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  <Shield className="h-4 w-4" />
                  Super Admin Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                {user.role === 'owner' ? (
                  <>
                    <Link
                      to="/explore/account/places"
                      className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                    >
                      <Home className="h-4 w-4" />
                      My Properties
                    </Link>
                    <Link
                      to="/explore/account/places/new"
                      className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Property
                    </Link>
                  </>
                ) : user.role === 'admin' ? (
                  <Link
                    to="/explore/admin/dashboard"
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                ) : user.role === 'superadmin' ? (
                  <Link
                    to="/explore/super-admin/dashboard"
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                  >
                    <Shield className="h-4 w-4" />
                    Super Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/explore/account"
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
