import { Link } from 'react-router-dom';

export default function Distribution() {
  return (
    <>
      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      <div className="page-container">
        <h1 className="neon-title">DIGITÁLIS DISZTRIBÚCIÓ</h1>
        <p className="page-content">
          Az MMZ ingyenes digitális disztribúciós szolgáltatása segít abban, hogy zenéd világszerte elérhető legyen a legnagyobb streaming platformokon, mint Spotify, Apple Music, YouTube Music és még sok más. Mi vállaljuk:
        </p>
        <ul className="service-list">
          <li>Zene feltöltése és terjesztése a DSP-kre (streaming szolgáltatók).</li>
          <li>0% jutalék – 100% bevétel a tiéd.</li>
          <li>EAN/UPC és ISRC kódok igénylése.</li>
          <li>Statisztikák és riportok a stream-ekről és letöltésekről.</li>
          <li>Technikai támogatás a feltöltéshez és megjelenéshez.</li>
        </ul>
        <p className="page-content">
          Regisztrálj ma, és kezdd el terjeszteni zenédet globálisan!
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/register" className="primary-btn">Regisztráció</Link>
        </div>
      </div>
    </>
  );
}
