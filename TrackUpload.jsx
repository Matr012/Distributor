import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';

export default function TrackUpload() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const audioInputRef = useRef(null);

  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true, callback: null });
  const [audioFileName, setAudioFileName] = useState('');
  const [audioError, setAudioError] = useState('');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const lastTrackNumber = parseInt(localStorage.getItem('lastTrackNumber') || '0', 10);
  const initialTrackNum = lastTrackNumber > 0 && lastTrackNumber < 20 ? String(lastTrackNumber + 1) : '1';

  const [form, setForm] = useState({
    trackNumber: initialTrackNum,
    title: '',
    subtitle: '',
    isrcRequest: '',
    originalReleaseDate: '',
    contributors: '',
    genre: '',
    explicitLyrics: '',
    composers: '',
    lyricists: '',
  });

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Date year validation
    if (name === 'originalReleaseDate' && value) {
      const match = value.match(/^(\d{4})-/);
      if (match) {
        const year = parseInt(match[1], 10);
        if (year < 1900 || year > 2099) {
          setFormError('Az év 1900 és 2099 között kell legyen!');
          setTimeout(() => setFormError(''), 3000);
          return;
        }
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleAudioClick = () => audioInputRef.current?.click();

  const handleAudioChange = (e) => {
    setAudioError('');
    setAudioFileName('');
    setFieldErrors((prev) => ({ ...prev, audio: false }));

    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    if (!allowedTypes.includes(file.type)) {
      setAudioError('Hibás fájlformátum! Csak MP3 vagy WAV engedélyezett.');
      e.target.value = '';
      return;
    }

    setAudioFileName(`✔ Feltöltve: ${file.name}`);
  };

  const validate = () => {
    const errors = {};
    setFormError('');

    if (!form.title.trim()) errors.title = true;
    if (!form.isrcRequest) errors.isrcRequest = true;
    if (!form.genre) errors.genre = true;
    if (!form.explicitLyrics) errors.explicitLyrics = true;
    if (!form.composers.trim()) errors.composers = true;
    if (!audioInputRef.current?.files?.length) errors.audio = true;

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError('Töltsd ki az összes *-os mezőt és töltsd fel az audio fájlt!');
      return false;
    }
    return true;
  };

  const saveTrack = () => {
    if (!validate()) return false;

    const trackData = {
      trackNumber: form.trackNumber,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      isrcRequest: form.isrcRequest,
      originalReleaseDate: form.originalReleaseDate,
      genre: form.genre,
      explicitLyrics: form.explicitLyrics,
      composers: form.composers.trim(),
      lyricists: form.lyricists.trim(),
      contributors: form.contributors.trim(),
      audioFileName: audioInputRef.current?.files[0]?.name || '',
    };

    const tracks = JSON.parse(localStorage.getItem('tempAlbumTracks') || '[]');
    tracks.push(trackData);
    localStorage.setItem('tempAlbumTracks', JSON.stringify(tracks));
    localStorage.setItem('lastTrackNumber', trackData.trackNumber);

    return true;
  };

  const handleSave = () => {
    if (!saveTrack()) return;

    const tracks = JSON.parse(localStorage.getItem('tempAlbumTracks') || '[]');
    if (tracks.length === 0) {
      setFormError('Legalább 1 track-et fel kell tölteni!');
      return;
    }

    // Finalize album
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const uploaderEmail = loggedInUser?.email || 'anonymous';
    const artist = (localStorage.getItem('tempAlbumArtist') || '').trim() || 'Ismeretlen előadó';
    const title = (localStorage.getItem('tempAlbumTitle') || '').trim() || 'Ismeretlen album';
    const cover = localStorage.getItem('tempAlbumCover');

    const newAlbum = {
      artist,
      title,
      cover,
      uploaderEmail,
      tracks,
      uploadDate: new Date().toISOString(),
    };

    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    albums.push(newAlbum);
    localStorage.setItem('albums', JSON.stringify(albums));

    // Cleanup
    localStorage.removeItem('tempAlbumArtist');
    localStorage.removeItem('tempAlbumTitle');
    localStorage.removeItem('tempAlbumCover');
    localStorage.removeItem('tempAlbumTracks');
    localStorage.removeItem('lastTrackNumber');

    setModal({
      show: true,
      title: 'Sikerült!',
      message: `Album sikeresen mentve ${tracks.length} track-kel!`,
      success: true,
      callback: () => navigate('/albums-list'),
    });
  };

  const handleSaveAndNew = () => {
    if (!saveTrack()) return;

    const tracks = JSON.parse(localStorage.getItem('tempAlbumTracks') || '[]');
    setModal({
      show: true,
      title: 'Track mentve!',
      message: `Összesen ${tracks.length} track feltöltve.`,
      success: true,
      callback: () => {
        // Reset form for new track
        const nextNum = parseInt(form.trackNumber, 10) + 1;
        setForm({
          trackNumber: String(nextNum > 20 ? 20 : nextNum),
          title: '',
          subtitle: '',
          isrcRequest: '',
          originalReleaseDate: '',
          contributors: '',
          genre: '',
          explicitLyrics: '',
          composers: '',
          lyricists: '',
        });
        setAudioFileName('');
        setAudioError('');
        setFormError('');
        setFieldErrors({});
        if (audioInputRef.current) audioInputRef.current.value = '';
      },
    });
  };

  const handleBack = () => {
    const tracks = JSON.parse(localStorage.getItem('tempAlbumTracks') || '[]');
    if (tracks.length > 0) {
      setModal({
        show: true,
        title: 'Figyelmeztetés',
        message: 'Biztosan vissza akarsz menni? A feltöltött track-ek elvesznek, ha nem mented el az albumot!',
        success: false,
        callback: () => navigate(-1),
      });
    } else {
      navigate(-1);
    }
  };

  const closeModal = () => {
    const cb = modal.callback;
    setModal((prev) => ({ ...prev, show: false, callback: null }));
    if (cb) cb();
  };

  const errBorder = (field) => (fieldErrors[field] ? { borderColor: '#ff3366' } : {});

  return (
    <>
      {modal.show && (
        <Modal title={modal.title} message={modal.message} isSuccess={modal.success} onClose={closeModal} />
      )}

      <div className="back-to-home">
        <a href="#" onClick={(e) => { e.preventDefault(); handleBack(); }}>← Vissza</a>
      </div>

      <div className="page-container">
        <h1 className="neon-title">TRACK FELTÖLTÉS</h1>

        <form className="album-form" onSubmit={(e) => e.preventDefault()}>
          {/* Left column */}
          <div className="form-left">
            <label>Sorszám *</label>
            <select name="trackNumber" value={form.trackNumber} onChange={handleChange}>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
              ))}
            </select>

            <label>Track címe *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} style={errBorder('title')} />

            <label>Track alcíme</label>
            <input type="text" name="subtitle" value={form.subtitle} onChange={handleChange} />

            <label>ISRC kód igénylés *</label>
            <select name="isrcRequest" value={form.isrcRequest} onChange={handleChange} style={errBorder('isrcRequest')}>
              <option value="">Válassz</option>
              <option>Igen</option>
              <option>Nem</option>
            </select>

            <label>Eredeti megjelenés dátuma</label>
            <input type="date" name="originalReleaseDate" min="1900-01-01" max="2099-12-31" value={form.originalReleaseDate} onChange={handleChange} />

            <label>Zenekari közreműködők</label>
            <textarea rows="3" name="contributors" value={form.contributors} onChange={handleChange} />
          </div>

          {/* Middle column */}
          <div className="form-left">
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

            <label>Szókimondó szöveg *</label>
            <select name="explicitLyrics" value={form.explicitLyrics} onChange={handleChange} style={errBorder('explicitLyrics')}>
              <option value="">Válassz</option>
              <option>Van</option>
              <option>Nincs</option>
            </select>

            <label>Zeneszerzők *</label>
            <input type="text" name="composers" value={form.composers} onChange={handleChange} style={errBorder('composers')} />

            <label>Szövegírók</label>
            <textarea rows="3" name="lyricists" value={form.lyricists} onChange={handleChange} />
          </div>

          {/* Right column — Audio */}
          <div className="form-right">
            <label>Track feltöltése</label>
            <input type="file" ref={audioInputRef} accept=".mp3,.wav" hidden onChange={handleAudioChange} />
            <div id="audioBox" onClick={handleAudioClick} style={fieldErrors.audio ? { borderColor: '#ff3366' } : {}}>
              🎵 MP3 / WAV feltöltése
              {audioFileName && <div style={{ marginTop: 10, fontSize: 14 }}>{audioFileName}</div>}
            </div>
            {audioError && <p className="error-text">{audioError}</p>}
          </div>
        </form>

        {/* Action buttons */}
        <div className="form-actions">
          <button type="button" onClick={handleSave}>MENTÉS</button>
          <button type="button" onClick={handleSaveAndNew}>MENTÉS + ÚJ TRACK</button>
        </div>

        {formError && <p className="error-text" style={{ textAlign: 'center', marginTop: 20 }}>{formError}</p>}
      </div>
    </>
  );
}
