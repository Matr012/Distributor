import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NoSubscription from '../../pages/NoSubscription';

/**
 * SubscribedRoute – csak aktív előfizetéssel rendelkező felhasználók érhetik el.
 * Ha nincs bejelentkezve → login oldalra.
 * Ha be van jelentkezve de nincs előfizetése → NoSubscription hibaoldal.
 */
export default function SubscribedRoute({ children }) {
  const { isLoggedIn, hasSubscription, loading } = useAuth();

  console.log('🛡️ SubscribedRoute check:', { 
    loading, 
    isLoggedIn, 
    hasSubscription 
  });

  if (loading) {
    console.log('⏳ Still loading...');
    return null;
  }

  if (!isLoggedIn) {
    console.log('❌ Not logged in → redirect to /login');
    return <Navigate to="/login" replace />;
  }

  if (!hasSubscription) {
    console.log('⚠️ No subscription → showing NoSubscription page');
    return <NoSubscription />;
  }

  console.log('✅ All checks passed → rendering children');
  return children;
}
