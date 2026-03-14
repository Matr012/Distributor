import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';

const spotifyRegex = /^https:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9]+(\?.*)?$/;
const appleRegex = /^https:\/\/music\.apple\.com\/[a-z]{2}\/artist\/.+\/[0-9]+(\?.*)?$/;

export default function AlbumUpload() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const coverInputRef = useRef(null);
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });

  const [form, setForm] = useState({
    ean: '',
    albumCodeRequest: '',
    artist: '',
    title: '',
    subtitle: '',
    originalReleaseDate: '',
    digitalReleaseDate: '',
    genre: '',
    distribution: '',
    spotifyUrl: '',
    appleMusicUrl: '',
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));

    // Save temp data for track upload page
    if (name === 'artist') localStorage.setItem('tempAlbumArtist', value);
    if (name === 'title') localStorage.setItem('tempAlbumTitle', value);
  };

  const handleCoverClick = () => coverInputRef.current?.click();

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setErrorText('');
    setCoverPreview(null);
    localStorage.removeItem('tempAlbumCover');

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorText('Csak képfájl tölthető fel!');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 1500 || img.height !== 1500) {
          setErrorText(`A borító PONTOSAN 1500x1500 pixel kell legyen! (Feltöltött kép: ${img.width}x${img.height} pixel)`);
          setCoverPreview(null);
          localStorage.removeItem('tempAlbumCover');
          return;
        }
        setCoverPreview(event.target.result);
        localStorage.setItem('tempAlbumCover', event.target.result);
      };
      img.onerror = () => setErrorText('Hiba történt a kép betöltése során!');
      img.src = event.target.result;
    };
    reader.onerror = () => setErrorText('Hiba történt a fájl olvasása során!');
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errors = {};
    const msgs = [];

    if (!form.albumCodeRequest) errors.albumCodeRequest = true;
    if (form.albumCodeRequest !== 'igen' && !form.ean.trim()) errors.ean = true;
    if (!form.artist.trim()) errors.artist = true;
    if (!form.title.trim()) errors.title = true;
    if (!form.genre) errors.genre = true;
    if (!form.distribution) errors.distribution = true;

    if (!form.spotifyUrl.trim()) {
      errors.spotifyUrl = true;
    } else if (!spotifyRegex.test(form.spotifyUrl.trim())) {
      errors.spotifyUrl = true;
      msgs.push('Spotify URL: csak előadói profil link elfogadott (https://open.spotify.com/artist/...)');
    }

    if (!form.appleMusicUrl.trim()) {
      errors.appleMusicUrl = true;
    } else if (!appleRegex.test(form.appleMusicUrl.trim())) {
      errors.appleMusicUrl = true;
      msgs.push('Apple Music URL: csak előadói profil link elfogadott (https://music.apple.com/xx/artist/...)');
    }

    if (!coverPreview && !localStorage.getItem('tempAlbumCover')) {
      errors.cover = true;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorText(msgs.length > 0 ? msgs.join(' | ') : 'Töltsd ki az összes *-os mezőt!');
      return false;
    }

    setErrorText('');
    return true;
  };

  const handleTrackUpload = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate('/track-upload');
    }
  };

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  const errBorder = (field) => (fieldErrors[field] ? { borderColor: '#ff3366' } : {});

  return (
    <>
      {modal.show && (
        <Modal title={modal.title} message={modal.message} isSuccess={modal.success} onClose={closeModal} />
      )}

      <div className="back-to-home">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }}>← Vissza</a>
      </div>

      <div className="page-container">
        <h1 className="neon-title">ALBUM FELTÖLTÉS</h1>

        <form className="album-form" onSubmit={(e) => e.preventDefault()}>
          {/* Left column */}
          <div className="form-left">
            <label>EAN / UPC kód</label>
            <input type="text" name="ean" placeholder="EAN / UPC" value={form.ean} onChange={handleChange} style={errBorder('ean')} />

            <label>Albumkód igénylés *</label>
            <select name="albumCodeRequest" value={form.albumCodeRequest} onChange={handleChange} style={errBorder('albumCodeRequest')}>
              <option value="">Válassz</option>
              <option value="igen">Igen</option>
              <option value="nem">Nem</option>
            </select>

            <label>Zenekar / Előadó neve *</label>
            <input type="text" name="artist" placeholder="Zenekar / Előadó neve" value={form.artist} onChange={handleChange} style={errBorder('artist')} />

            <label>Album címe *</label>
            <input type="text" name="title" placeholder="Album címe" value={form.title} onChange={handleChange} style={errBorder('title')} />

            <label>Album alcíme</label>
            <input type="text" name="subtitle" placeholder="Album alcíme" value={form.subtitle} onChange={handleChange} />

            <label>Eredeti megjelenés dátuma</label>
            <input type="date" name="originalReleaseDate" min="1900-01-01" max="2099-12-31" value={form.originalReleaseDate} onChange={handleChange} />

            <label>Digitális megjelenés dátuma</label>
            <input type="datetime-local" name="digitalReleaseDate" min="2000-01-01T00:00" max="2099-12-31T23:59" value={form.digitalReleaseDate} onChange={handleChange} />

            <label>Stílus *</label>
            <select name="genre" value={form.genre} onChange={handleChange} style={errBorder('genre')}>
              <option value="">Válassz</option>
              <option>Trap</option>
              <option>Rap</option>
              <option>Pop</option>
              <option>Pop-Punk</option>
              <option>R&B</option>
              <option>Rock</option>
              <option>Electronic</option>
            </select>

            <label>Továbbterjesztés *</label>
            <select name="distribution" value={form.distribution} onChange={handleChange} style={errBorder('distribution')}>
              <option value="">Válassz</option>
              <option>Igen</option>
              <option>Nem</option>
            </select>

            <label>Spotify Artist URL *</label>
            <input type="url" name="spotifyUrl" placeholder="https://open.spotify.com/artist/..." value={form.spotifyUrl} onChange={handleChange} style={errBorder('spotifyUrl')} />

            <label>Apple Music Artist URL *</label>
            <input type="url" name="appleMusicUrl" placeholder="https://music.apple.com/..." value={form.appleMusicUrl} onChange={handleChange} style={errBorder('appleMusicUrl')} />
          </div>

          {/* Right column — Cover */}
          <div className="form-right">
            <div className="cover-upload">
              <input type="file" ref={coverInputRef} accept="image/*" hidden onChange={handleCoverChange} />
              <div className="cover-box" onClick={handleCoverClick} style={fieldErrors.cover ? { borderColor: '#ff3366' } : {}}>
                <span>📤 Borító feltöltése</span>
              </div>
              {errorText && <p className="error-text">{errorText}</p>}
              {coverPreview && <img id="previewImage" src={coverPreview} alt="Borító előnézet" style={{ display: 'block' }} />}
            </div>
          </div>
        </form>

        <div className="track-upload-wrapper">
          <button className="track-upload-btn" onClick={handleTrackUpload}>
            TRACK FELTÖLTÉSE
          </button>
        </div>
      </div>
    </>
  );
}
