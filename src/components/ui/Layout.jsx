import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { Header } from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Show auth modal only on IndexPage (when path is /explore) when user is not logged in
    if (
      location.pathname === '/explore' &&
      !user &&
      !location.pathname.includes('/login') &&
      !location.pathname.includes('/register')
    ) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [location.pathname, user]);

  return (
    <>
      <Header />
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col">
        <Outlet />
      </div>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Layout;
