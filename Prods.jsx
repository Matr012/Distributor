import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Artist images
import manuelImg from '../assets/images/MANUEL SPOTIFY KEP.jpg';
import mehringerImg from '../assets/images/MEHRINGER SPOTIFY KEP.jpg';
import gyurisImg from '../assets/images/gyuris kep spotify.jpg';
import marioImg from '../assets/images/mario kep spotify.jpg';
import akcMisiImg from '../assets/images/akc misi spotify kep.jpg';
import matroImg from '../assets/images/matro spotify kep.jpg';
import brunoImg from '../assets/images/brunoxspacc spotify kep.jpg';

const artists = [
  {
    name: 'Manuel',
    desc: 'POP - TRAP',
    image: manuelImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/1O4dvMoyQSIClCii6DSai8?si=-pzUIVwOQICVLtPouG2Qhw', icon: 'fab fa-spotify' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/manuel/1486563086?l=hu', icon: 'bi bi-apple' },
    ],
  },
  {
    name: 'Mehringer',
    desc: 'POP - ALTERNATÍV ROCK',
    image: mehringerImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/2onsfuh37zW0OHB3lFa3t1?si=iGTnFx-NQZmF4joDbLOKhQ', icon: 'fab fa-spotify' },
      { type: 'soundcloud', url: 'https://soundcloud.com/mehringer', icon: 'fab fa-soundcloud' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/mehringer/1635950625?l=hu', icon: 'bi bi-apple' },
    ],
  },
  {
    name: 'gyuris',
    desc: 'TRAP',
    image: gyurisImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/19w3KViMCX0eq1UjNic2W9?si=03ym6eNXQrSDji2dDdGrYA', icon: 'fab fa-spotify' },
      { type: 'soundcloud', url: 'https://soundcloud.com/gyuris', icon: 'fab fa-soundcloud' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/gyuris/1353570324?l=hu', icon: 'bi bi-apple' },
    ],
  },
  {
    name: 'Mario',
    desc: 'R & B',
    image: marioImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/0Qld3F5Dr62sYbuivSzEMw?si=OtaRZJBmT8q3SaNzG06rKw', icon: 'fab fa-spotify' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/m%C3%A1ri%C3%B3/479718071?l=hu', icon: 'bi bi-apple' },
    ],
  },
  {
    name: 'AKC Misi',
    desc: 'TRAP',
    image: akcMisiImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/4pWRro00gdnq90CwBmSCtv?si=3Ah6F8xIQ5SmPHZRKuemKQ', icon: 'fab fa-spotify' },
      { type: 'soundcloud', url: 'https://soundcloud.com/akc-misi', icon: 'fab fa-soundcloud' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/akc-misi/1438391242?l=hu', icon: 'bi bi-apple' },
    ],
  },
  {
    name: 'matro',
    desc: 'R & B - TRAP',
    image: matroImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/2CSvDdxgY0AaBzvxbLLhcK?si=N6nM1GH7SZi0Er26DyX4Zw', icon: 'fab fa-spotify' },
      { type: 'soundcloud', url: 'https://soundcloud.com/user-59601331', icon: 'fab fa-soundcloud' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/matr0/1668596247?l=hu', icon: 'bi bi-apple' },
    ],
  },
  {
    name: 'Bruno X Spacc',
    desc: 'TRAP - POP - AFRO',
    image: brunoImg,
    social: [
      { type: 'spotify', url: 'https://open.spotify.com/artist/5ALUgNuS421MZrrrAhM9Bv?si=u4FCFq5BR7KgDhnU0JpN8Q', icon: 'fab fa-spotify' },
      { type: 'apple-music', url: 'https://music.apple.com/hu/artist/bruno-x-spacc/1519148459?l=hu', icon: 'bi bi-apple' },
    ],
  },
];

export default function Prods() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { title, message, success }
  const formRef = useRef(null);

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
              <img src={artist.image} alt={artist.name} />
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
