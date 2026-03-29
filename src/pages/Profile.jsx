import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import { apiGetUserById, apiGetUserBillings, apiGetUserCards, apiGetUserSubscriptions, apiUpdateProfilePic } from '../utils/api';
import { FALLBACK_PROFILE, coverToSrc } from '../utils/fallbackImages';

export default function Profile() {
  const { user, isLoggedIn, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });
  const [billings, setBillings] = useState([]);
  const [cards, setCards] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch user-related data from API
  useEffect(() => {
    if (!user?.id) return;

    // User adatok frissítése az API-ból
    refreshUser();

    // Számlázási adatok
    apiGetUserBillings()
      .then(data => setBillings(data.filter(b => b.userId === user.id)))
      .catch(() => {});

    // Kártyák
    apiGetUserCards()
      .then(data => setCards(data.filter(c => c.userId === user.id)))
      .catch(() => {});

    // Előfizetések
    apiGetUserSubscriptions()
      .then(data => setSubscriptions(data.filter(s => s.userId === user.id)))
      .catch(() => {});
  }, [user?.id]);

  if (!isLoggedIn || !user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Ismeretlen felhasználó';

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        await apiUpdateProfilePic(base64);
        updateUser({ profilePic: base64 });
        setModal({ show: true, title: 'Siker!', message: 'Profilképed sikeresen frissítve!', success: true });
      } catch (err) {
        setModal({ show: true, title: 'Hiba!', message: err.message || 'Nem sikerült frissíteni a profilképet.', success: false });
      }
    };
    reader.readAsDataURL(file);
  };

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  return (
    <>
      {modal.show && (
        <Modal title={modal.title} message={modal.message} isSuccess={modal.success} onClose={closeModal} />
      )}

      <div className="page-container">
        <h1 className="neon-title">PROFIL</h1>

        <div className="profile-header-bar">
          {/* Avatar with upload overlay */}
          <label className="profile-avatar-upload">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handlePicChange}
            />
            <div id="profileAvatar" className={user.profilePic ? '' : 'default-avatar'}>
              {user.profilePic ? (
                <img className="profile-avatar-img" src={coverToSrc(user.profilePic, FALLBACK_PROFILE)} alt="Profilkép" />
              ) : (
                <i className="bi bi-person-circle"></i>
              )}
            </div>
            <div className="profile-avatar-overlay">📸 Kép csere</div>
          </label>

          {/* Name + Artist badge */}
          <div className="profile-name-container">
            <h2 className="profile-header-name">{fullName}</h2>
            {user.isArtist && (
              <div className="artist-badge">
                <span className="artist-label">Artist</span>
                {user.verified && <span className="verified-check">✔</span>}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="profile-header-details">
            <p><strong>E-mail:</strong> <span>{user.email || '-'}</span></p>
            <p><strong>Telefonszám:</strong> <span>{user.phone || '-'}</span></p>
            <p><strong>Felhasználónév:</strong> <span>{user.username || '-'}</span></p>
          </div>
        </div>

        {/* Előfizetések */}
        {subscriptions.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 className="neon-title" style={{ fontSize: '1.5rem' }}>Előfizetések</h2>
            {subscriptions.map(sub => (
              <div key={sub.id} style={{ background: 'rgba(0,255,239,0.05)', border: '1px solid rgba(0,255,239,0.3)', borderRadius: '10px', padding: '15px', marginBottom: '10px' }}>
                <p><strong>Státusz:</strong> {sub.status}</p>
                <p><strong>Ár:</strong> {sub.priceAtPurchase} Ft</p>
                <p><strong>Kezdés:</strong> {new Date(sub.startDate).toLocaleDateString('hu-HU')}</p>
                {sub.expiryDate && <p><strong>Lejárat:</strong> {new Date(sub.expiryDate).toLocaleDateString('hu-HU')}</p>}
                <p><strong>Auto megújítás:</strong> {sub.autoRenew ? 'Igen' : 'Nem'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Számlázási adatok */}
        {billings.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 className="neon-title" style={{ fontSize: '1.5rem' }}>Számlázási adatok</h2>
            {billings.map(b => (
              <div key={b.id} style={{ background: 'rgba(0,255,239,0.05)', border: '1px solid rgba(0,255,239,0.3)', borderRadius: '10px', padding: '15px', marginBottom: '10px' }}>
                <p><strong>Név:</strong> {b.billingName}</p>
                <p><strong>Cím:</strong> {b.billingZip} {b.billingCity}, {b.billingAddress}</p>
                <p><strong>Ország:</strong> {b.billingCountry}</p>
              </div>
            ))}
          </div>
        )}

        {/* Kártyák */}
        {cards.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 className="neon-title" style={{ fontSize: '1.5rem' }}>Regisztrált kártyák</h2>
            {cards.map(c => (
              <div key={c.id} style={{ background: 'rgba(0,255,239,0.05)', border: '1px solid rgba(0,255,239,0.3)', borderRadius: '10px', padding: '15px', marginBottom: '10px' }}>
                <p><strong>Tulajdonos:</strong> {c.cardHolderName}</p>
                <p><strong>Kártya vége:</strong> **** {c.cardLast4}</p>
                <p><strong>Lejárat:</strong> {c.cardExpMonth}/{c.cardExpYear}</p>
                {c.isPrimary && <p style={{ color: '#00ffef' }}>★ Elsődleges kártya</p>}
              </div>
            ))}
          </div>
        )}

        <div className="profile-actions" style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/album-upload" className="primary-btn">Album feltöltés indítása</Link>
        </div>
      </div>
    </>
  );
}
