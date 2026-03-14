import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';

export default function Profile() {
  const { user, isLoggedIn, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Ismeretlen felhasználó';

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      updateUser({ profilePic: base64 });
      setModal({ show: true, title: 'Siker!', message: 'Profilképed sikeresen frissítve!', success: true });
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
                <img className="profile-avatar-img" src={user.profilePic} alt="Profilkép" />
              ) : (
                <i className="bi bi-person-circle"></i>
              )}
            </div>
            <div className="profile-avatar-overlay">📸 Kép csere</div>
          </label>

          {/* Name + Artist badge */}
          <div className="profile-name-container">
            <h2 className="profile-header-name">{fullName}</h2>
            <div className="artist-badge">
              <span className="artist-label">Artist</span>
              <span className="verified-check">✔</span>
            </div>
          </div>

          {/* Details */}
          <div className="profile-header-details">
            <p><strong>E-mail:</strong> <span>{user.email || '-'}</span></p>
            <p><strong>Telefonszám:</strong> <span>{user.phone || '-'}</span></p>
          </div>
        </div>

        <div className="profile-actions" style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/album-upload" className="primary-btn">Album feltöltés indítása</Link>
        </div>
      </div>
    </>
  );
}
