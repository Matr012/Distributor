import { useNavigate } from 'react-router-dom';

const features = [
  { label: 'Ár (évi)', legend: '29 990 Ft', plusz: '14 990 Ft', zenesz: '8 990 Ft' },
  { label: 'Korlátlan dal feltöltés', legend: '✓', plusz: '✓', zenesz: '✓' },
  { label: 'Korlátlan dalszöveg feltöltés', legend: '✓', plusz: '✓', zenesz: '✓' },
  { label: 'Ellenőrzött előadó pipa (Spotify)', legend: '✓', plusz: '✓', zenesz: '✓' },
  { label: 'Jogdíjfelosztások létrehozása', legend: '✓', plusz: '✓', zenesz: '✓' },
  { label: 'Mobilalkalmazás hozzáférés', legend: '✓', plusz: '✓', zenesz: '✓' },
  { label: 'Időzített dalszövegek Apple Musicban', legend: '✓', plusz: '✓', zenesz: '—' },
  { label: 'Napi streaming statisztikák', legend: '✓', plusz: '✓', zenesz: '—' },
  { label: 'Tesztelhető kiadási dátum', legend: '✓', plusz: '✓', zenesz: '—' },
  { label: 'Egyedi iTunes árak', legend: '✓', plusz: '✓', zenesz: '—' },
  { label: 'Spotify & Apple Music figyelemmel követés', legend: '✓', plusz: '—', zenesz: '—' },
  { label: '1 TB azonnali fájlmegosztás', legend: '✓', plusz: '✓', zenesz: '—' },
  { label: 'Haladó elemzések és statisztikák', legend: '✓', plusz: '—', zenesz: '—' },
  { label: 'Dal audiójának cseréje', legend: '✓', plusz: '—', zenesz: '—' },
  { label: 'Keresőmotor listafeltöltési lehetőség', legend: '✓', plusz: '—', zenesz: '—' },
];

export default function Subscription() {
  const navigate = useNavigate();

  const selectPlan = (plan) => {
    localStorage.setItem('selectedPlan', plan);
    localStorage.setItem(
      'planPrice',
      plan === 'legend' ? '29 990' : plan === 'plusz' ? '14 990' : '8 990'
    );
    navigate('/payment');
  };

  const thStyle = { padding: '15px', borderBottom: '1px solid #00ffef' };
  const tdLeft = { padding: '12px', borderBottom: '1px solid rgba(0,255,239,0.2)', textAlign: 'left' };
  const tdCenter = { padding: '12px', borderBottom: '1px solid rgba(0,255,239,0.2)', textAlign: 'center' };

  return (
    <main className="page-container" style={{ textAlign: 'center', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 className="neon-title" style={{ margin: '40px 0' }}>Válassz előfizetési csomagot</h1>
      <p style={{ marginBottom: '40px', fontSize: '1.2rem', color: '#ccc' }}>
        Ahhoz, hogy zenédet feltöltsd és terjeszthesd, elő kell fizetned. Válaszd ki a neked megfelelőt!
      </p>

      {/* Comparison table */}
      <div style={{ overflowX: 'auto', margin: '40px 0' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'rgba(0,255,239,0.05)',
            border: '1px solid #00ffef',
            borderRadius: '15px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ background: 'rgba(0,255,239,0.15)' }}>
              <th style={{ ...thStyle, textAlign: 'left' }}>Jellemző</th>
              <th style={{ ...thStyle, background: 'rgba(0,255,239,0.25)' }}>Legenda</th>
              <th style={{ ...thStyle, background: 'rgba(0,255,239,0.1)' }}>Zenész Plusz</th>
              <th style={thStyle}>Zenész</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.label}>
                <td style={tdLeft}>{f.label}</td>
                <td style={tdCenter}>{f.legend}</td>
                <td style={tdCenter}>{f.plusz}</td>
                <td style={tdCenter}>{f.zenesz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Package cards */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', margin: '60px 0' }}>
        {/* Legenda */}
        <div
          style={{
            background: 'rgba(0,255,239,0.08)',
            border: '2px solid #00ffef',
            borderRadius: '20px',
            padding: '30px',
            width: '320px',
            boxShadow: '0 0 30px rgba(0,255,239,0.3)',
          }}
        >
          <h2>Legenda</h2>
          <p style={{ fontSize: '2.2rem', margin: '20px 0' }}>29 990 Ft/év</p>
          <button className="primary-btn" onClick={() => selectPlan('legend')}>
            Választom
          </button>
        </div>

        {/* Zenész Plusz (recommended) */}
        <div
          style={{
            background: 'rgba(0,255,239,0.15)',
            border: '3px solid #00ffef',
            borderRadius: '20px',
            padding: '40px 30px',
            width: '360px',
            boxShadow: '0 0 50px rgba(0,255,239,0.5)',
            transform: 'scale(1.08)',
          }}
        >
          <h2 style={{ color: '#fff' }}>
            Zenész Plusz{' '}
            <span
              style={{
                fontSize: '0.9rem',
                background: '#00ffef',
                color: '#000',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
            >
              Ajánlott
            </span>
          </h2>
          <p style={{ fontSize: '2.8rem', margin: '20px 0' }}>14 990 Ft/év</p>
          <button
            className="primary-btn"
            style={{ background: '#00ffef', color: '#000', fontWeight: 'bold' }}
            onClick={() => selectPlan('plusz')}
          >
            Választom
          </button>
        </div>

        {/* Zenész */}
        <div
          style={{
            background: 'rgba(0,255,239,0.05)',
            border: '1px solid rgba(0,255,239,0.4)',
            borderRadius: '20px',
            padding: '30px',
            width: '320px',
          }}
        >
          <h2>Zenész</h2>
          <p style={{ fontSize: '2.2rem', margin: '20px 0' }}>8 990 Ft/év</p>
          <button className="primary-btn" onClick={() => selectPlan('zenesz')}>
            Választom
          </button>
        </div>
      </div>

      <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '60px' }}>
        Az előfizetés évente automatikusan megújul. Bármikor lemondható. 100% royalties tied.
      </p>
    </main>
  );
}
