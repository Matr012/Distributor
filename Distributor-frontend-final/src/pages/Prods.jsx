import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { apiGetArtists } from '../utils/api';
import { FALLBACK_ARTIST, coverToSrc } from '../utils/fallbackImages';

export default function Prods() {
  const [artists, setArtists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    apiGetArtists()
      .then(data => {
        const mapped = data.map(a => {
          const social = [];
          if (a.spotifyUrl) social.push({ type: 'spotify', url: a.spotifyUrl, icon: 'fab fa-spotify' });
          if (a.soundcloudUrl) social.push({ type: 'soundcloud', url: a.soundcloudUrl, icon: 'fab fa-soundcloud' });
          return {
            id: a.id,
            name: a.name,
            desc: a.description || '',
            image: coverToSrc(a.avatar, FALLBACK_ARTIST),
            social,
          };
        });
        setArtists(mapped);
      })
      .catch(() => {});
  }, []);

  const openModal = (artistName) => {
    setSelectedArtist(artistName);
    setFormData({ name: '', email: '', subject: `Booking - ${artistName}`, message: '' });
    setFeedback(null);
    setModalOpen(true);
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    setModalOpen(false);
    setFeedback(null);
    document.body.classList.remove('no-scroll');
  };

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalOpen) closeModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFeedback({ title: 'Hiányzó adatok', message: 'Kérlek töltsd ki az összes mezőt!', success: false });
      return;
    }

    if (!email.includes('@') || email.length < 6) {
      setFeedback({ title: 'Érvénytelen e-mail', message: 'Kérlek adj meg érvényes e-mail címet!', success: false });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const artistFromSubject = subject.split(' - ')[1] || 'ismeretlen';
      setFeedback({
        title: 'Sikeresen elküldve! 🎉',
        message: `Köszönjük az üzenetet!\n\nElőadó: ${artistFromSubject}\nHamarosan felvesszük veled a kapcsolatot.`,
        success: true,
      });

      // Auto-close after 4s on success
      setTimeout(() => {
        closeModal();
      }, 4000);
    }, 3500);
  };

  return (
    <>
      {loading && <LoadingSpinner />}

      <h1>ELŐADÓK</h1>

      <div className="prods-grid">
        {artists.map((artist) => (
          <div className="prod-card" key={artist.name}>
            <div className="prod-avatar">
              <img src={artist.image} alt={artist.name} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_ARTIST; }} />
            </div>
            <h3 className="prod-name">{artist.name}</h3>
            <p className="prod-desc">{artist.desc}</p>
            <div className="prod-social-icons">
              {artist.social.map((s) => (
                <a
                  key={s.type}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-link ${s.type}`}
                  title={s.type === 'spotify' ? 'Spotify' : s.type === 'soundcloud' ? 'SoundCloud' : 'Apple Music'}
                >
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
            <button className="prod-ticket-btn" onClick={() => openModal(artist.name)}>
              Fellépés szervezés/Booking
            </button>
          </div>
        ))}
      </div>

      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      {/* Ticket Modal */}
      <div
        className={`ticket-modal${modalOpen ? ' show' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="ticket-modal-content">
          <span className="close-modal" onClick={closeModal}>&times;</span>

          {feedback && feedback.success ? (
            <>
              <h2>{feedback.title}</h2>
              <p style={{ textAlign: 'center', margin: '1.5rem 0', fontSize: '1.1rem', lineHeight: '1.5', color: '#4ade80', whiteSpace: 'pre-line' }}>
                {feedback.message}
              </p>
            </>
          ) : (
            <>
              <h2>Közvetlen üzenet</h2>

              {feedback && !feedback.success && (
                <p style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.1rem', color: '#f87171' }}>
                  {feedback.message}
                </p>
              )}

              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Név *</label>
                  <input type="text" id="name" name="name" placeholder="A neved" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input type="email" id="email" name="email" placeholder="email@cim.hu" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Tárgy *</label>
                  <input type="text" id="subject" name="subject" placeholder="Pl. Booking - Manuel" required value={formData.subject} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Üzenet *</label>
                  <textarea id="message" name="message" rows="6" placeholder="Írd ide az üzeneted..." required value={formData.message} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="submit-btn">Küldés</button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
