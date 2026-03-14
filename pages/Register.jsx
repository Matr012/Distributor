import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FaqSection from '../components/ui/FaqSection';
import Modal from '../components/ui/Modal';
import googleLogo from '../assets/images/google logo asd.png';

// Zászló kódok telefonszám előhívóhoz
const countryCodes = {
  '+36': 'hu',
  '+43': 'at',
  '+44': 'gb',
  '+49': 'de',
};

function getCountryFlag(phone) {
  for (const prefix in countryCodes) {
    if (phone.startsWith(prefix)) {
      return countryCodes[prefix];
    }
  }
  return null;
}

function isValidPhone(phone) {
  const clean = phone.replace(/[\s-]/g, '');
  if (clean.startsWith('+36') && clean.length === 12) return true;
  if (clean.startsWith('+43') && clean.length >= 12 && clean.length <= 15) return true;
  if (clean.startsWith('+44') && clean.length === 13) return true;
  if (clean.startsWith('+49') && clean.length >= 12 && clean.length <= 14) return true;
  return false;
}

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });
  const [redirectAfterModal, setRedirectAfterModal] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const flagCode = getCountryFlag(phone);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Jelszó egyezés
    if (password !== passwordConfirm) {
      setModal({ show: true, title: 'Hiba', message: 'A jelszavak nem egyeznek meg!', success: false });
      return;
    }

    // Telefonszám validáció
    if (!isValidPhone(phone)) {
      setModal({ show: true, title: 'Hiba', message: 'Érvénytelen telefonszám formátum!', success: false });
      return;
    }

    // E-mail duplikáció ellenőrzés
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (registeredUsers.some(u => u.email === email.trim())) {
      setModal({ show: true, title: 'Hiba', message: 'Ez az e-mail már foglalt!', success: false });
      return;
    }

    // Regisztráció
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      username: username.trim(),
      phone: phone.trim(),
      password,
    };

    const result = register(newUser);

    if (!result.success) {
      setModal({ show: true, title: 'Hiba', message: result.message, success: false });
      return;
    }

    // Automatikus bejelentkezés regisztráció után
    login(newUser.email, newUser.password);

    setRedirectAfterModal(true);
    setModal({
      show: true,
      title: 'Siker! 🎉',
      message: 'Köszönjük a regisztrációt!\nMost már be vagy jelentkezve.\n\nKövetkező lépés: válaszd ki az előfizetési csomagodat!',
      success: true,
    });
  };

  const handleModalClose = () => {
    setModal(prev => ({ ...prev, show: false }));
    if (redirectAfterModal) {
      navigate('/subscription');
    }
  };

  return (
    <div className="auth-main">
      <div className="auth-container-flex">
        {/* Bal oldal: Regisztrációs form */}
        <div className="modern-auth-box">
          <h1>Zenészek, regisztráljatok még ma!</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Vezetéknév"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Keresztnév"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Felhasználónév"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* Telefonszám mező zászlóval */}
            <div className="phone-input-container">
              {flagCode && (
                <span
                  className={`flag-icon flag-icon-${flagCode}`}
                  id="countryFlag"
                  style={{ display: 'block' }}
                ></span>
              )}
              {!flagCode && (
                <span className="flag-icon" id="countryFlag" style={{ display: 'none' }}></span>
              )}
              <input
                type="tel"
                placeholder="Telefonszám (pl. +36 30 123 4567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Jelszó megerősítése"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />

            <button type="submit" className="primary-btn">Regisztráció</button>
          </form>

          <div className="or-separator">vagy</div>

          <a
            href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
            target="_blank"
            rel="noreferrer"
            className="social-btn google-btn"
          >
            <img src={googleLogo} alt="Google" className="social-icon" />
            Regisztráció Google használatával
          </a>

          <a
            href="https://account.apple.com/sign-in?localang=en_US"
            target="_blank"
            rel="noreferrer"
            className="social-btn apple-btn"
          >
            <i className="bi bi-apple"></i>
            Regisztráció Apple használatával
          </a>

          <p className="auth-bottom-link">
            Már rendelkezik felhasználói profillal? Kérjük jelentkezzen be!{' '}
            <Link to="/login">Bejelentkezés</Link>
          </p>
        </div>

        {/* Jobb oldal: GYIK */}
        <FaqSection />
      </div>

      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        success={modal.success}
        onClose={handleModalClose}
      />
    </div>
  );
}
