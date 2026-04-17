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

function formatPhoneNumber(value) {
  // Csak számok és + jel maradhat
  const cleaned = value.replace(/[^\d+]/g, '');
  
  // Ha nem + jellel kezdődik, ne formázzunk
  if (!cleaned.startsWith('+')) {
    return cleaned;
  }

  // Magyar telefonszám formázás: +36 20 211 5390
  if (cleaned.startsWith('+36')) {
    const digits = cleaned.substring(3); // +36 után
    let formatted = '+36';
    
    if (digits.length > 0) {
      formatted += ' ' + digits.substring(0, 2); // Szolgáltató kód (20, 30, 70 stb.)
    }
    if (digits.length > 2) {
      formatted += ' ' + digits.substring(2, 5); // Első 3 számjegy
    }
    if (digits.length > 5) {
      formatted += ' ' + digits.substring(5, 9); // Utolsó 4 számjegy
    }
    
    return formatted;
  }
  
  // Osztrák telefonszám formázás: +43 XXX XXXXXXX
  if (cleaned.startsWith('+43')) {
    const digits = cleaned.substring(3);
    let formatted = '+43';
    
    if (digits.length > 0) {
      formatted += ' ' + digits.substring(0, 3);
    }
    if (digits.length > 3) {
      formatted += ' ' + digits.substring(3, 10);
    }
    
    return formatted;
  }
  
  // UK telefonszám formázás: +44 XXXX XXXXXX
  if (cleaned.startsWith('+44')) {
    const digits = cleaned.substring(3);
    let formatted = '+44';
    
    if (digits.length > 0) {
      formatted += ' ' + digits.substring(0, 4);
    }
    if (digits.length > 4) {
      formatted += ' ' + digits.substring(4, 10);
    }
    
    return formatted;
  }
  
  // Német telefonszám formázás: +49 XXX XXXXXXXX
  if (cleaned.startsWith('+49')) {
    const digits = cleaned.substring(3);
    let formatted = '+49';
    
    if (digits.length > 0) {
      formatted += ' ' + digits.substring(0, 3);
    }
    if (digits.length > 3) {
      formatted += ' ' + digits.substring(3, 11);
    }
    
    return formatted;
  }
  
  // Alapértelmezett: minden más ország
  return cleaned;
}

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });
  const [redirectAfterModal, setRedirectAfterModal] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const flagCode = getCountryFlag(phone);

  const handleSubmit = async (e) => {
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

    // Regisztráció
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      username: username.trim(),
      phone: phone.trim(),
      password,
    };

    const result = await register(newUser);

    if (!result.success) {
      setModal({ show: true, title: 'Hiba', message: result.message, success: false });
      return;
    }

    // Auto-login after successful registration
    const loginResult = await login(email.trim(), password);
    if (loginResult && loginResult.success === false) {
      setRedirectAfterModal(true);
      setModal({
        show: true,
        title: 'Siker! 🎉',
        message: 'Sikeres regisztráció! Jelentkezz be a fiókodba.',
        success: true,
      });
    } else {
      navigate('/subscription');
    }
  };

  const handleModalClose = () => {
    setModal(prev => ({ ...prev, show: false }));
    if (redirectAfterModal) {
      navigate('/login');
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
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                required
              />
            </div>

            {/* Jelszó mező szem ikonnal */}
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`password-toggle-icon ${showPassword ? "bi bi-eye-slash" : "bi bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
              />
            </div>
            
            {/* Jelszó megerősítés mező szem ikonnal */}
            <div className="password-input-container">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Jelszó megerősítése"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              <i
                className={`password-toggle-icon ${showPasswordConfirm ? "bi bi-eye-slash" : "bi bi-eye"}`}
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                title={showPasswordConfirm ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
              />
            </div>

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
