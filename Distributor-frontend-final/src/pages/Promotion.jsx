import { Link } from 'react-router-dom';

export default function Promotion() {
  return (
    <>
      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      <div className="page-container">
        <h1 className="neon-title">PROMÓCIÓS TÁMOGATÁS</h1>
        <p className="page-content">
          Az MMZ partnerként támogatja előadóink promócióját, hogy zenéjük igazi közönséget találjon. Szolgáltatásaink:
        </p>
        <ul className="service-list">
          <li>Közösségi média kampányok (Facebook, Instagram, TikTok).</li>
          <li>Playlist pitch és editorial ajánlások (Spotify, Apple Music).</li>
          <li>Egyedi stratégiai tanácsadás megjelenésekhez.</li>
          <li>Hirdetési támogatás és együttműködések influencerekkel.</li>
          <li>Ingyenes promóciós eszközök (pl. banner sablonok, social post tippek).</li>
        </ul>
        <p className="page-content">
          Keress minket e-mailben (promo@mmz.com) egyedi ajánlatért!
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/contact" className="primary-btn">Kapcsolatfelvétel</Link>
        </div>
      </div>
    </>
  );
}
