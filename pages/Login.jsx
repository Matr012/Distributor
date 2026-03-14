import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FaqSection from '../components/ui/FaqSection';
import Modal from '../components/ui/Modal';
import googleLogo from '../assets/images/google logo asd.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });
  const [redirectAfterModal, setRedirectAfterModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setModal({
        show: true,
        title: 'Hiányzó adat',
        message: 'Add meg az e-mail címet és a jelszót!',
        success: false,
      });
      return;
    }

    const result = login(email.trim(), password);

    if (result.success) {
      setRedirectAfterModal(true);
      setModal({
        show: true,
        title: 'Sikeres bejelentkezés! 👋',
        message: 'Üdvözlünk újra!\nMost már be vagy jelentkezve.\n\nÁtirányítunk a kezdőlapra...',
        success: true,
      });
    } else {
      setModal({
        show: true,
        title: 'Bejelentkezés sikertelen',
        message: 'Helytelen e-mail vagy jelszó.\nKérlek próbáld újra!',
        success: false,
      });
    }
  };

  const handleModalClose = () => {
    setModal(prev => ({ ...prev, show: false }));
    if (redirectAfterModal) {
      navigate('/');
    }
  };

  return (
    <div className="auth-main">
      <div className="auth-container-flex">
        {/* Bal oldal: Bejelentkezés */}
        <div className="modern-auth-box">
          <h1>Üdvözöljük!</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn">Bejelentkezés</button>
          </form>

          <div className="or-separator">vagy</div>

          <a
            href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
            target="_blank"
            rel="noreferrer"
            className="social-btn google-btn"
          >
            <img src={googleLogo} alt="Google" className="social-icon" />
            Bejelentkezés Google használatával
          </a>

          <a
            href="https://account.apple.com/sign-in?localang=en_US"
            target="_blank"
            rel="noreferrer"
            className="social-btn apple-btn"
          >
            <i className="bi bi-apple"></i>
            Bejelentkezés Apple használatával
          </a>

          <p className="auth-bottom-link">
            Nincs még fiókja? <Link to="/register">Regisztráció</Link>
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
