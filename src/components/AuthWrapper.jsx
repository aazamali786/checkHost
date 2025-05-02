import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import { useLocation } from 'react-router-dom';
import AuthModal from './ui/AuthModal';

const AuthWrapper = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only show modal on explore page when user is not logged in
    if (!user && location.pathname === '/explore') {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, location.pathname]);

  return (
    <>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {children}
    </>
  );
};

export default AuthWrapper;
