import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Required fields check
    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setModal({ show: true, title: 'Hiba', message: 'Kérlek töltsd ki az összes kötelező mezőt!', success: false });
      return;
    }

    // Email format check
    if (!email.includes('@') || !email.includes('.')) {
      setModal({ show: true, title: 'Hiba', message: 'Érvénytelen e-mail cím formátum!', success: false });
      return;
    }

    // Show spinner, simulate sending
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModal({
        show: true,
        title: 'Köszönjük!',
        message: 'Az üzenetedet megkaptuk!\n\nHamarosan felvesszük veled a kapcsolatot.',
        success: true,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3500);
  };

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  return (
    <>
      {loading && <LoadingSpinner />}
      {modal.show && (
        <Modal title={modal.title} message={modal.message} isSuccess={modal.success} onClose={closeModal} />
      )}

      <h1>KAPCSOLAT</h1>

      <div className="contact-container">
        {/* Bal oldal – info + linkek */}
        <div className="contact-info">
          <h2>Írj nekünk bármilyen kérdésben</h2>
          <p>
            Disztribúció, promóció, együttműködés, technikai probléma vagy csak egy köszönet – szívesen válaszolunk!
          </p>

          <div className="contact-links">
            <a href="https://facebook.com/mmzdistro" target="_blank" rel="noopener noreferrer" className="contact-link">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
            <a href="https://instagram.com/mmzdistro" target="_blank" rel="noopener noreferrer" className="contact-link">
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a href="mailto:info@mmzdistro.com" className="contact-link email-link">
              <i className="fas fa-envelope"></i> E-mail
              <span className="email-tooltip">info@mmzdistro.com</span>
            </a>
            <a href="mailto:promo@mmzdistro.com" className="contact-link email-link">
              <i className="fas fa-bullhorn"></i> Promo
              <span className="email-tooltip">promo@mmzdistro.com</span>
            </a>
            <a href="mailto:legal@mmzdistro.com" className="contact-link email-link">
              <i className="fas fa-gavel"></i> Jogi
              <span className="email-tooltip">legal@mmzdistro.com</span>
            </a>
          </div>
        </div>

        {/* Jobb oldal – űrlap */}
        <div className="contact-form-box">
          <h2>Közvetlen üzenet</h2>
          <form ref={formRef} onSubmit={handleSubmit}>
            <label>Név *</label>
            <input type="text" name="name" required placeholder="A neved" value={formData.name} onChange={handleChange} />

            <label>E-mail *</label>
            <input type="email" name="email" required placeholder="email@cim.hu" value={formData.email} onChange={handleChange} />

            <label>Tárgy *</label>
            <input type="text" name="subject" required placeholder="Pl. Disztribúció, kérdés..." value={formData.subject} onChange={handleChange} />

            <label>Üzenet *</label>
            <textarea name="message" rows="10" required placeholder="Írd ide az üzeneted..." value={formData.message} onChange={handleChange}></textarea>

            <button type="submit">Küldés</button>
          </form>
        </div>
      </div>

      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>
    </>
  );
}
