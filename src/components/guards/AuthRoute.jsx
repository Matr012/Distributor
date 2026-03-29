import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AuthRoute – csak bejelentkezett felhasználók érhetik el (előfizetéstől függetlenül).
 * Használat: előfizetés + fizetés oldalakhoz.
 */
export default function AuthRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
