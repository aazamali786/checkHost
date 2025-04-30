import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import AuthModal from './ui/AuthModal';

const AuthWrapper = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Show modal whenever user is not logged in
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user]);

  return (
    <>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {children}
    </>
  );
};

export default AuthWrapper;
