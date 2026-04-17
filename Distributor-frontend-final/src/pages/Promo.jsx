import { Link } from 'react-router-dom';

export default function Promo() {
  return (
    <>
      <h1>PROMÓCIÓS LEHETŐSÉGEK</h1>
      <h2 className="promo-content">
        <p><strong>Promóciós támogatás az MMZ Disztribútortól</strong></p>

        <p>
          Az MMZ Disztribútor kiemelten támogatja szerződött előadóinkat a zenei promóció területén.
          Célunk, hogy megjelenéseitek ne csak felkerüljenek a platformokra, hanem <strong>valódi közönséget</strong> is találjanak.
        </p>

        <p>Minden partnerzenészünk számára egyedi segítséget nyújtunk az online promócióban:</p>

        <ul>
          <li>Közösségi médiás kampányok és megjelenések</li>
          <li>Playlist-pitch és editorial támogatás</li>
          <li>Egyéni stratégiai egyeztetések</li>
          <li>Hirdetési tanácsadás és együttműködések</li>
        </ul>

        <p>
          Promócióval kapcsolatos ötleteid, kérdéseid vannak?<br />
          Keress minket bizalommal az alábbi csatornákon:
        </p>

        <div className="contact-links">
          <a href="https://facebook.com/mmzdistro" target="_blank" rel="noopener noreferrer" className="contact-link">
            <i className="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://instagram.com/mmzdistro" target="_blank" rel="noopener noreferrer" className="contact-link">
            <i className="fab fa-instagram"></i> Instagram
          </a>
          <a href="mailto:promo@mmzdistro.com" className="contact-link email-link">
            <i className="fas fa-envelope"></i> E-mail
            <span className="email-tooltip">promo@mmzdistro.com</span>
          </a>
        </div>
      </h2>

      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>
    </>
  );
}
