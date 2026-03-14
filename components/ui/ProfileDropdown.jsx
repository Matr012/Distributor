import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Felhasználó';
  const shortName = fullName.length > 18 ? fullName.split(' ')[0] : fullName;

  return (
    <div className="user-profile" ref={dropdownRef} style={{ display: 'flex' }}>
      <button
        className="profile-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(prev => !prev);
        }}
      >
        <div className="header-default-avatar" id="headerProfileImg">
          {user.profilePic ? (
            <img className="header-profile-img" src={user.profilePic} alt="Profilkép" />
          ) : (
            <i className="bi bi-person-circle"></i>
          )}
        </div>
        <div className="header-name-container">
          <span className="user-name">{shortName}</span>
          <div className="artist-badge-header">
            <span className="artist-label-header">Artist</span>
            <span className="verified-check-header">✔</span>
          </div>
        </div>
      </button>

      <div className={`profile-dropdown${open ? ' active' : ''}`}>
        <Link to="/profile" onClick={() => setOpen(false)}>Profil</Link>
        <div>
          <Link to="/album-upload" onClick={() => setOpen(false)}>Album feltöltés</Link>
        </div>
        <hr />
        <button onClick={() => { logout(); setOpen(false); }}>
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}
