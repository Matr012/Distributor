import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * GuestRoute – csak NEM bejelentkezett felhasználók érhetik el.
 * Ha be van jelentkezve → átirányít az előfizetés oldalra.
 */
/**
 * GuestRoute – csak NEM bejelentkezett felhasználók érhetik el.
 * Ha be van jelentkezve:
 *   - VAN előfizetés → főoldalra (/)
 *   - NINCS előfizetés → subscription oldalra
 */
export default function GuestRoute({ children }) {
  const { isLoggedIn, hasSubscription, loading } = useAuth();

  console.log('🚪 GuestRoute check:', { loading, isLoggedIn, hasSubscription });

  if (loading) {
    console.log('⏳ Loading...');
    return null;
  }

  if (isLoggedIn) {
    const targetPath = hasSubscription ? '/' : '/subscription';
    console.log(`⚠️ Already logged in → redirect to ${targetPath}`);
    return <Navigate to={targetPath} replace />;
  }

  console.log('✅ Guest access granted');
  return children;
}
