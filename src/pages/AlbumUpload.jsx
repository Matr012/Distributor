import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import { apiGetMusicStyles } from '../utils/api';
import { setUploadData } from '../utils/uploadStore';

const spotifyRegex = /^https:\/\/open\.spotify\.com\/artist\/[a-zA-Z0-9]+(\?.*)?$/;
const appleRegex = /^https:\/\/music\.apple\.com\/[a-z]{2}\/artist\/.+\/[0-9]+(\?.*)?$/;

export default function AlbumUpload() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true });
  const [musicStyles, setMusicStyles] = useState([]);

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

  const [coverFile, setCoverFile] = useState(null);
  const [coverBase64, setCoverBase64] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  // Zenei stílusok lekérése az API-ból
  useEffect(() => {
    apiGetMusicStyles()
      .then(data => setMusicStyles(data))
      .catch(() => setErrorText('Nem sikerült betölteni a zenei stílusokat. Ellenőrizd, hogy a szerver fut-e.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleCoverFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorText('Csak képfájlokat lehet feltölteni!');
      return;
    }
    setCoverFile(file);
    setFieldErrors((prev) => ({ ...prev, cover: false }));
    setErrorText('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setCoverPreview(dataUrl);
      // raw base64 kinyerése (data:image/...;base64, prefix nélkül)
      const base64 = dataUrl.split(',')[1];
      setCoverBase64(base64);
    };
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

    if (!coverBase64) {
      errors.cover = true;
    }

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
      // Stílus ID megkeresése
      const matchedStyle = musicStyles.find(s => s.genreName === form.genre);
      const styleId = matchedStyle ? matchedStyle.id : null;

      // Album összes adatát elmentjük, hogy a TrackUpload oldalon felhasználhassuk
      const albumData = {
        ean: form.ean.trim(),
        albumCodeRequest: form.albumCodeRequest,
        artist: form.artist.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        originalReleaseDate: form.originalReleaseDate || null,
        digitalReleaseDate: form.digitalReleaseDate || null,
        genre: form.genre,
        styleId: styleId,
        distribution: form.distribution,
        spotifyUrl: form.spotifyUrl.trim(),
        appleMusicUrl: form.appleMusicUrl.trim(),
        coverBase64: coverBase64,
      };
      setUploadData('tempAlbumData', albumData);
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
              {musicStyles.map(style => (
                <option key={style.id} value={style.genreName}>{style.genreName}</option>
              ))}
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

          {/* Right column — Cover file */}
          <div className="form-right">
            <div className="cover-upload">
              <label>Borítókép *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFile}
                style={fieldErrors.cover ? { borderColor: '#ff3366' } : {}}
              />
              {errorText && <p className="error-text">{errorText}</p>}
              {coverPreview && (
                <img
                  id="previewImage"
                  src={coverPreview}
                  alt="Borító előnézet"
                  style={{ display: 'block', marginTop: '15px', maxWidth: '100%' }}
                />
              )}
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
