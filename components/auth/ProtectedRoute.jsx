import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Védett útvonal – bejelentkezés nélkül átirányít a login oldalra
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // vagy spinner

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
