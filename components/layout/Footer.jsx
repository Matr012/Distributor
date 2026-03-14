import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { isLoggedIn } = useAuth();

  const scrollTop = () => window.scrollTo(0, 0);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-social">
          <a href="#" target="_blank" rel="noreferrer"><i className="bi bi-youtube"></i></a>
          <a href="#" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
          <a href="#" target="_blank" rel="noreferrer"><i className="bi bi-twitter-x"></i></a>
          <a href="#" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
        </div>

        <div className="footer-copyright">
          © 2026 MMZ. Minden jog fenntartva.
        </div>
      </div>

      <div className="footer-columns">
        <div className="footer-column">
          <h4>Hasznos hivatkozások</h4>
          <ul>
            {!isLoggedIn && (
              <>
                <li><Link to="/register" onClick={scrollTop}>Regisztráció</Link></li>
                <li><Link to="/login" onClick={scrollTop}>Bejelentkezés</Link></li>
              </>
            )}
            <li><Link to="/contact" onClick={scrollTop}>Kapcsolat</Link></li>
            <li><Link to="/promo" onClick={scrollTop}>Promóció</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Cég</h4>
          <ul>
            <li><Link to="/aboutus" onClick={scrollTop}>Rólunk</Link></li>
            <li><Link to="/prods" onClick={scrollTop}>Előadók</Link></li>
            <li><Link to="/policy" onClick={scrollTop}>ÁSZF</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Szolgáltatások</h4>
          <ul>
            {isLoggedIn && (
              <>
                <li><Link to="/album-upload" onClick={scrollTop}>Album feltöltés</Link></li>
                <li><Link to="/track-upload" onClick={scrollTop}>Track feltöltés</Link></li>
              </>
            )}
            {!isLoggedIn && (
              <li><Link to="/distribution" onClick={scrollTop}>Digitális disztribúció</Link></li>
            )}
            <li><Link to="/promotion" onClick={scrollTop}>Promóciós támogatás</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <Link to="/policy" onClick={scrollTop}>Adatvédelmi szabályzat</Link>
        <Link to="/policy" onClick={scrollTop}>Sütiszabályzat</Link>
        <Link to="/policy" onClick={scrollTop}>Felhasználási feltételek</Link>
        <Link to="/impresszum" onClick={scrollTop}>Impresszum</Link>
      </div>
    </footer>
  );
}
