import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import { apiGetMusicStyles, apiCreateArtist, apiCreateAlbum, apiCreateTrack } from '../utils/api';
import { getUploadData, removeUploadData } from '../utils/uploadStore';

export default function TrackUpload() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true, callback: null });
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [musicStyles, setMusicStyles] = useState([]);
  const [saving, setSaving] = useState(false);

  const [savedTracks, setSavedTracks] = useState([]);

  const [form, setForm] = useState({
    trackNumber: '1',
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

  const [audioBase64, setAudioBase64] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    apiGetMusicStyles()
      .then(data => setMusicStyles(data))
      .catch(() => setFormError('Nem sikerült betölteni a zenei stílusokat. Ellenőrizd, hogy a szerver fut-e.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleAudioFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAudioFileName(file.name);
    setFieldErrors((prev) => ({ ...prev, audio: false }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      setAudioBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errors = {};
    setFormError('');

    if (!form.title.trim()) errors.title = true;
    if (!form.isrcRequest) errors.isrcRequest = true;
    if (!form.genre) errors.genre = true;
    if (!form.explicitLyrics) errors.explicitLyrics = true;
    if (!form.composers.trim()) errors.composers = true;
    if (!audioBase64) errors.audio = true;

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError('Töltsd ki az összes *-os mezőt és tölts fel egy audio fájlt!');
      return false;
    }
    return true;
  };

  const saveTrack = () => {
    if (!validate()) return false;

    // Zenei stílus ID megkeresése
    const matchedStyle = musicStyles.find(s => s.genreName === form.genre);
    const styleId = matchedStyle ? matchedStyle.id : null;

    const trackData = {
      trackNumber: parseInt(form.trackNumber, 10),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      isrcRequest: form.isrcRequest,
      originalReleaseDate: form.originalReleaseDate || null,
      genre: form.genre,
      styleId: styleId,
      explicitLyrics: form.explicitLyrics,
      composers: form.composers.trim(),
      lyricists: form.lyricists.trim(),
      contributors: form.contributors.trim(),
      audioBase64: audioBase64,
    };

    return trackData;
  };

  const handleSave = async () => {
    if (saving) return;

    // Aktuális track mentése
    const newTrack = saveTrack();
    if (!newTrack) return;

    const tracks = [...savedTracks, newTrack];

    // Album adatok visszaolvasása
    const albumData = getUploadData('tempAlbumData');
    if (!albumData) {
      setFormError('Hiba: hiányzó album adatok. Menj vissza az album feltöltés oldalra!');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      // 1. Előadó létrehozása
      const artistId = await apiCreateArtist({
        name: albumData.artist,
        spotifyUrl: albumData.spotifyUrl || null,
      });

      // 2. Album létrehozása
      const albumId = await apiCreateAlbum({
        userId: user?.id || 0,
        artistId: artistId || null,
        eanUpc: albumData.ean || null,
        codeRequest: albumData.albumCodeRequest || null,
        title: albumData.title,
        subtitle: albumData.subtitle || null,
        originalReleaseDate: albumData.originalReleaseDate || null,
        digitalReleaseDate: albumData.digitalReleaseDate || null,
        redistribution: albumData.distribution || null,
        spotifyArtistUrl: albumData.spotifyUrl || null,
        appleArtistUrl: albumData.appleMusicUrl || null,
        coverPath: albumData.coverBase64 || null,
        status: 'pending',
        styleId: albumData.styleId || 0,
      });

      // 3. Minden track létrehozása
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        const trackStyleId = t.styleId || albumData.styleId || null;

        await apiCreateTrack({
          albumId: albumId,
          trackNumber: t.trackNumber,
          title: t.title,
          subtitle: t.subtitle || null,
          isrcRequest: t.isrcRequest || null,
          originalReleaseDate: t.originalReleaseDate || null,
          collaborators: t.contributors || null,
          explicitLyrics: t.explicitLyrics || null,
          composers: t.composers || null,
          lyricists: t.lyricists || null,
          audioPath: t.audioBase64 || null,
          styleId: trackStyleId,
        });
      }

      // ✅ Sikeres – cleanup
      removeUploadData('tempAlbumData');

      setSaving(false);
      setModal({
        show: true,
        title: 'Sikerült!',
        message: `Album sikeresen feltöltve ${tracks.length} track-kel!`,
        success: true,
        callback: () => navigate('/albums-list'),
      });
    } catch (err) {
      setSaving(false);
      setFormError(err.message || 'Hiba történt a feltöltés során.');
    }
  };

  const handleSaveAndNew = () => {
    const newTrack = saveTrack();
    if (!newTrack) return;

    setSavedTracks(prev => [...prev, newTrack]);
    const updatedTracks = [...savedTracks, newTrack];
    setModal({
      show: true,
      title: 'Track mentve!',
      message: `Összesen ${updatedTracks.length} track feltöltve.`,
      success: true,
      callback: () => {
        // Reset form for new track
        const nextNum = parseInt(form.trackNumber, 10) + 1;
        setForm(prev => ({
          ...prev,
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
        }));
        setAudioBase64(null);
        setAudioFileName('');
        setFormError('');
        setFieldErrors({});
      },
    });
  };

  const handleBack = () => {
    if (savedTracks.length > 0) {
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
              {musicStyles.map(style => (
                <option key={style.id} value={style.genreName}>{style.genreName}</option>
              ))}
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

          {/* Right column — Audio file */}
          <div className="form-right">
            <div className="cover-upload">
              <label>Audio fájl *</label>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.flac,.aac,.ogg,.m4a"
                onChange={handleAudioFile}
                style={fieldErrors.audio ? { borderColor: '#ff3366' } : {}}
              />
              {audioFileName && (
                <p style={{ color: '#00f6ff', marginTop: '10px', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                  ✓ {audioFileName}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Action buttons */}
        <div className="form-actions">
          <button type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'FELTÖLTÉS...' : 'MENTÉS'}
          </button>
          <button type="button" onClick={handleSaveAndNew} disabled={saving}>MENTÉS + ÚJ TRACK</button>
        </div>

        {formError && <p className="error-text" style={{ textAlign: 'center', marginTop: 20 }}>{formError}</p>}
      </div>
    </>
  );
}
