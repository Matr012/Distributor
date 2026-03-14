import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorField, setErrorField] = useState('');

  const [selectedPlan] = useState(() => localStorage.getItem('selectedPlan') || 'plusz');
  const [planPrice] = useState(() => localStorage.getItem('planPrice') || '14 990');

  const planName =
    selectedPlan === 'legend' ? 'Legenda csomag' : selectedPlan === 'plusz' ? 'Zenész Plusz csomag' : 'Zenész csomag';

  const [form, setForm] = useState({
    cardName: '',
    cardType: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    country: 'Hungary',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Auto-format card number (space every 4 digits)
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '');
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Auto-format expiry (MM/YY)
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
    setErrorField('');
  };

  const handleSubmit = () => {
    const { cardName, cardType, cardNumber, expiry, cvc, country } = form;
    const numOnly = cardNumber.replace(/\s/g, '');

    if (!cardName.trim() || cardName.trim().length < 3) {
      setErrorMsg('Kérlek add meg a kártyatulajdonos nevét (legalább 3 karakter)!');
      setErrorField('cardName');
      return;
    }
    if (!cardType) {
      setErrorMsg('Válaszd ki a kártya típusát!');
      setErrorField('cardType');
      return;
    }
    if (numOnly.length !== 16 || !/^\d{16}$/.test(numOnly)) {
      setErrorMsg('A kártyaszámnak pontosan 16 számjegyűnek kell lennie!');
      setErrorField('cardNumber');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setErrorMsg('Érvénytelen lejárat dátum formátum (HH/YY)!');
      setErrorField('expiry');
      return;
    }
    if (!/^\d{3}$/.test(cvc)) {
      setErrorMsg('A CVC kódjának pontosan 3 számjegyűnek kell lennie!');
      setErrorField('cvc');
      return;
    }
    if (!country) {
      setErrorMsg('Válaszd ki az országot!');
      setErrorField('country');
      return;
    }

    // All valid — simulate payment
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('subscriptionActive', 'true');
      localStorage.removeItem('selectedPlan');
      localStorage.removeItem('planPrice');
      setModalOpen(true);
    }, 3000);
  };

  const closeAndRedirect = () => {
    setModalOpen(false);
    navigate('/');
  };

  // ESC close modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && modalOpen) closeAndRedirect();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [modalOpen]);

  const inputStyle = {
    width: '100%',
    padding: '14px',
    background: '#111',
    border: '1px solid rgba(0,255,239,0.53)',
    borderRadius: '8px',
    color: '#00ffef',
    fontSize: '1.1rem',
    boxSizing: 'border-box',
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#ff3366',
    boxShadow: '0 0 10px rgba(255,51,102,0.4)',
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '1.1rem' };

  return (
    <>
      {loading && <LoadingSpinner />}

      <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <h1 className="neon-title" style={{ textAlign: 'center', margin: '40px 0', fontSize: '2.8rem', letterSpacing: '4px' }}>
          Fizetési mód hozzáadása
        </h1>

        <p style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '50px' }}>Kártyás feltöltéssel</p>

        {/* Selected plan box */}
        <div
          style={{
            background: 'rgba(0,255,239,0.08)',
            border: '2px solid #00ffef',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '50px',
            boxShadow: '0 0 30px rgba(0,255,239,0.25)',
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.6rem' }}>Kiválasztott csomag</h2>
          <p style={{ fontSize: '1.3rem', margin: '10px 0' }}>{planName}</p>
          <p style={{ fontSize: '1.3rem', margin: '10px 0' }}>Ár: {planPrice} Ft/év</p>
        </div>

        <h2 style={{ textAlign: 'center', margin: '40px 0 30px', fontSize: '2rem', letterSpacing: '2px' }}>
          Bankkártyás fizetés
        </h2>

        <div
          style={{
            background: 'rgba(0,255,239,0.05)',
            border: '1px solid rgba(0,255,239,0.4)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 0 25px rgba(0,255,239,0.15)',
          }}
        >
          {errorMsg && (
            <p style={{ color: '#ff3366', fontSize: '1.1rem', margin: '15px 0', textAlign: 'center' }}>{errorMsg}</p>
          )}

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Kártyatulajdonos neve *</label>
            <input
              type="text"
              name="cardName"
              placeholder="Kovács János"
              value={form.cardName}
              onChange={handleChange}
              style={errorField === 'cardName' ? errorInputStyle : inputStyle}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Kártya típusa *</label>
            <select
              name="cardType"
              value={form.cardType}
              onChange={handleChange}
              style={errorField === 'cardType' ? errorInputStyle : inputStyle}
            >
              <option value="">Válassz típust...</option>
              <option>MasterCard</option>
              <option>Visa</option>
              <option>American Express</option>
            </select>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Kártyaszám *</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 1234 1234 1234"
              maxLength="19"
              value={form.cardNumber}
              onChange={handleChange}
              style={errorField === 'cardNumber' ? errorInputStyle : inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>Lejárat dátuma (HH/ÉÉ) *</label>
              <input
                type="text"
                name="expiry"
                placeholder="12/28"
                maxLength="5"
                value={form.expiry}
                onChange={handleChange}
                style={errorField === 'expiry' ? errorInputStyle : inputStyle}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={labelStyle}>CVC *</label>
              <input
                type="text"
                name="cvc"
                placeholder="123"
                maxLength="3"
                value={form.cvc}
                onChange={handleChange}
                style={errorField === 'cvc' ? errorInputStyle : inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Ország / régió *</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              style={errorField === 'country' ? errorInputStyle : inputStyle}
            >
              <option value="">Válassz országot...</option>
              <option value="Hungary">Magyarország</option>
              <option value="Austria">Ausztria</option>
              <option value="Germany">Németország</option>
              <option value="UK">Egyesült Királyság</option>
            </select>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#aaa', margin: '40px 0 30px', textAlign: 'center' }}>
            Biztonságos fizetés. Az adatok titkosítva kerülnek feldolgozásra.
          </p>

          <button className="primary-btn" style={{ width: '100%' }} onClick={handleSubmit}>
            Csatlakozás
          </button>
        </div>
      </main>

      {/* Success Modal */}
      {modalOpen && (
        <div
          className="payment-modal show"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeAndRedirect(); }}
        >
          <div
            style={{
              background: '#0d1b2a',
              border: '2px solid #00ffef',
              borderRadius: '12px',
              padding: '2.5rem',
              width: '90%',
              maxWidth: '520px',
              boxShadow: '0 0 50px rgba(0,255,239,0.4)',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                fontSize: '2.5rem',
                color: '#00ffef',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onClick={closeAndRedirect}
            >
              &times;
            </span>
            <h2 style={{ color: '#00ffef', margin: '0 0 1.8rem 0', fontSize: '1.8rem' }}>
              Sikeres előfizetés! 🎉
            </h2>
            <p style={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Gratulálunk! Az előfizetésed aktiválásra került.
              <br />
              Mostantól teljes mértékben használhatod az MMZ-t!
            </p>
            <button
              style={{
                width: '100%',
                padding: '1rem',
                background: '#00ffef',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={closeAndRedirect}
            >
              Rendben
            </button>
          </div>
        </div>
      )}
    </>
  );
}
