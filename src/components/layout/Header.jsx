import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../ui/SearchBar';
import ProfileDropdown from '../ui/ProfileDropdown';

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header>
      <div className="logo">
        <Link to="/">MMZ</Link>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-right">
        {/* Nem bejelentkezett állapot */}
        {!isLoggedIn && (
          <div className="auth-links">
            <Link to="/login" className="login-btn">Bejelentkezés</Link>
            <span className="divider">|</span>
            <Link to="/register" className="login-btn">Regisztráció</Link>
          </div>
        )}

        {/* Bejelentkezett állapot */}
        {isLoggedIn && <ProfileDropdown />}
      </div>
    </header>
  );
}
