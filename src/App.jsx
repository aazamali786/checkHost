import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/ui/Layout';
import IndexPage from './pages/IndexPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PropertyOwnerSignupPage from './pages/PropertyOwnerSignupPage';
import PropertyOwnerLoginPage from './pages/PropertyOwnerLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import BookingsPage from './pages/BookingsPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import SingleBookedPlace from './pages/SingleBookedPlace';
import axiosInstance from './utils/axios';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getItemFromLocalStorage } from './utils';
import NotFoundPage from './pages/NotFoundPage';
import AuthWrapper from './components/AuthWrapper';
import { FilterProvider } from './context/FilterContext';

function App() {
  useEffect(() => {
    // set the token on refreshing the website
    axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${getItemFromLocalStorage('token')}`;
  }, []);

  return (
    <FilterProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <PlaceProvider>
            <AuthWrapper>
              <Routes>
                {/* Landing Page Route */}
                <Route path="/" element={<LandingPage />} />

                {/* Main Application Routes */}
                <Route path="/explore" element={<Layout />}>
                  <Route index element={<IndexPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />

                  {/* Property Owner Routes */}
                  <Route path="property-owner">
                    <Route
                      path="register"
                      element={<PropertyOwnerSignupPage />}
                    />
                    <Route path="login" element={<PropertyOwnerLoginPage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="admin">
                    <Route path="login" element={<AdminLoginPage />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                  </Route>

                  {/* User Account Routes */}
                  <Route path="account">
                    <Route index element={<ProfilePage />} />
                    <Route path="places">
                      <Route index element={<PlacesPage />} />
                      <Route path="new" element={<PlacesFormPage />} />
                      <Route path=":id" element={<PlacesFormPage />} />
                    </Route>
                    <Route path="bookings">
                      <Route index element={<BookingsPage />} />
                      <Route path=":id" element={<SingleBookedPlace />} />
                    </Route>
                  </Route>

                  {/* Individual Place Route */}
                  <Route path="place/:id" element={<PlacePage />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </AuthWrapper>
            <ToastContainer autoClose={2000} transition={Slide} />
          </PlaceProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </FilterProvider>
  );
}

export default App;
