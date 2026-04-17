import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetSubscriptionPlans } from '../utils/api';

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

// Tier mapping az API tier értékeiből a megjelenítéshez
const tierMap = {
  ultimate: { label: 'Legenda', key: 'legend' },
  pro: { label: 'Zenész Plusz', key: 'plusz' },
  alap: { label: 'Zenész', key: 'zenesz' },
};

export default function Subscription() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  // Előfizetési csomagok lekérése az API-ból
  useEffect(() => {
    apiGetSubscriptionPlans()
      .then(data => setPlans(data))
      .catch(() => {});
  }, []);

  // Éves csomagok kiszűrése (12 hónap) megjelenítéshez
  const yearlyPlans = plans.filter(p => p.durationMonths === 12);

  // Ár formázás
  const formatPrice = (price) => {
    return price.toLocaleString('hu-HU');
  };

  // Csomag kiválasztásakor az API-ból kapott plan ID-t és árat mentjük
  const selectPlan = (planId, price, tierKey) => {
    localStorage.setItem('selectedPlanId', planId);
    localStorage.setItem('selectedPlan', tierKey);
    localStorage.setItem('planPrice', formatPrice(price));
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

      {/* Package cards – API-ból kapott éves csomagokkal */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', margin: '60px 0' }}>
        {yearlyPlans
          .sort((a, b) => b.price - a.price) // drágábbtól az olcsóbbig
          .map((plan) => {
            const tierInfo = tierMap[plan.tier] || { label: plan.name, key: plan.tier };
            const isRecommended = plan.tier === 'pro';

            return (
              <div
                key={plan.id}
                style={{
                  background: isRecommended ? 'rgba(0,255,239,0.15)' : plan.tier === 'ultimate' ? 'rgba(0,255,239,0.08)' : 'rgba(0,255,239,0.05)',
                  border: isRecommended ? '3px solid #00ffef' : plan.tier === 'ultimate' ? '2px solid #00ffef' : '1px solid rgba(0,255,239,0.4)',
                  borderRadius: '20px',
                  padding: isRecommended ? '40px 30px' : '30px',
                  width: isRecommended ? '360px' : '320px',
                  boxShadow: isRecommended ? '0 0 50px rgba(0,255,239,0.5)' : plan.tier === 'ultimate' ? '0 0 30px rgba(0,255,239,0.3)' : 'none',
                  transform: isRecommended ? 'scale(1.08)' : 'none',
                }}
              >
                <h2 style={isRecommended ? { color: '#fff' } : {}}>
                  {tierInfo.label}{' '}
                  {isRecommended && (
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
                  )}
                </h2>
                <p style={{ fontSize: isRecommended ? '2.8rem' : '2.2rem', margin: '20px 0' }}>
                  {formatPrice(plan.price)} Ft/év
                </p>
                <button
                  className="primary-btn"
                  style={isRecommended ? { background: '#00ffef', color: '#000', fontWeight: 'bold' } : {}}
                  onClick={() => selectPlan(plan.id, plan.price, tierInfo.key)}
                >
                  Választom
                </button>
              </div>
            );
          })}
      </div>

      <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '60px' }}>
        Az előfizetés évente automatikusan megújul. Bármikor lemondható. 100% royalties tied.
      </p>
    </main>
  );
}
