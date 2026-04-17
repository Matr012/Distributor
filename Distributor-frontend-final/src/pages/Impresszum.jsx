import { Link } from 'react-router-dom';

export default function Impresszum() {
  return (
    <>
      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      <div className="page-container">
        <h1 className="neon-title">IMPRESSZUM</h1>
        <p className="page-content">
          <strong>Cégnév:</strong> MMZ Disztribúciós Kft.<br />
          <strong>Székhely:</strong> Budapest, 1051, Vörösmarty tér 1.<br />
          <strong>Cégjegyzékszám:</strong> 01-09-123456<br />
          <strong>Adószám:</strong> 12345678-2-41<br />
          <strong>Kapcsolat:</strong> info@mmz.com | +36 1 234 5678<br />
          <strong>Tárhelyszolgáltató:</strong> Example Hosting Kft., Budapest<br />
          <br />
          Az MMZ weboldal üzemeltetője a fenti cég. Minden jog fenntartva.
        </p>
      </div>
    </>
  );
}
