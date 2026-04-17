import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.permission === 1;

  return (
    <nav>
      <ul>
        <li><Link to="/">Kezdőlap</Link></li>
        <li><Link to="/music">Zenék</Link></li>
        <li><Link to="/policy">ÁSZF</Link></li>
        <li><Link to="/promo">Promóció</Link></li>
        <li><Link to="/prods">Előadók</Link></li>
        <li><Link to="/contact">Kapcsolat</Link></li>
        <li><Link to="/aboutus">Rólunk</Link></li>

        {/* Bejelentkezett felhasználóknak */}
        {isLoggedIn && (
          <>
            <li><Link to="/album-upload">ALBUM FELTÖLTÉS</Link></li>
            <li><Link to="/albums-list">Albumok listája</Link></li>
          </>
        )}

        {/* Admin menüpont */}
        {isAdmin && (
          <li><Link to="/admin/albums">Album kezelés</Link></li>
        )}
      </ul>
    </nav>
  );
}
