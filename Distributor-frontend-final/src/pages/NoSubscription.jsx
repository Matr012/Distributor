import { useNavigate } from 'react-router-dom';

/**
 * NoSubscription – hibaoldal, ha a felhasználónak nincs aktív előfizetése.
 * Bármely védett oldalra lépve ez jelenik meg.
 */
export default function NoSubscription() {
  const navigate = useNavigate();

  return (
    <main
      className="page-container"
      style={{
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
        padding: '80px 20px',
      }}
    >
      <h1 className="neon-title" style={{ marginBottom: '30px', fontSize: '2.2rem' }}>
        Nincs aktív előfizetésed!
      </h1>

      <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '15px', lineHeight: '1.7' }}>
        Az MMZ egy fizetős zenei terjesztési platform.
        <br />
        Az oldal funkcióinak eléréséhez aktív előfizetés szükséges.
      </p>

      <p style={{ fontSize: '1rem', color: '#888', marginBottom: '40px' }}>
        Válassz egy előfizetési csomagot, hogy hozzáférj az összes funkcióhoz!
      </p>

      <button
        onClick={() => navigate('/subscription')}
        className="primary-btn"
        style={{
          fontSize: '1.1rem',
          padding: '14px 40px',
          cursor: 'pointer',
        }}
      >
        Előfizetés választása
      </button>
    </main>
  );
}
