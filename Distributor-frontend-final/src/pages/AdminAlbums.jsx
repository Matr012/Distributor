import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetAlbums, apiGetArtists, apiGetTracks, apiUpdateAlbumStatus } from '../utils/api';
import { FALLBACK_ALBUM, coverToSrc } from '../utils/fallbackImages';
import Modal from '../components/ui/Modal';

export default function AdminAlbums() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [pendingAlbums, setPendingAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, title: '', message: '', success: true, callback: null });
  const [confirm, setConfirm] = useState({ show: false, albumId: null, action: null, albumTitle: '' });

  const isAdmin = user?.permission === 1;

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); return; }
    fetchPendingAlbums();
  }, [isLoggedIn, isAdmin, navigate]);

  async function fetchPendingAlbums() {
    setLoading(true);
    try {
      const [albums, artists, tracks] = await Promise.all([
        apiGetAlbums(),
        apiGetArtists(),
        apiGetTracks(),
      ]);

      const artistMap = {};
      artists.forEach(a => { artistMap[a.id] = a.name; });

      const tracksByAlbum = {};
      tracks.forEach(t => {
        if (!tracksByAlbum[t.albumId]) tracksByAlbum[t.albumId] = [];
        tracksByAlbum[t.albumId].push(t);
      });

      const pending = albums
        .filter(a => a.status === 'pending')
        .map(a => ({
          ...a,
          artistName: artistMap[a.artistId] || 'Ismeretlen előadó',
          tracks: tracksByAlbum[a.id] || [],
        }));

      setPendingAlbums(pending);
    } catch (err) {
      console.error('Pending albumok betöltése sikertelen:', err);
    }
    setLoading(false);
  }

  function openConfirm(albumId, action, albumTitle) {
    setConfirm({ show: true, albumId, action, albumTitle });
  }

  async function handleConfirm() {
    const { albumId, action } = confirm;
    const newStatus = action === 'approve' ? 'published' : 'draft';
    setConfirm({ show: false, albumId: null, action: null, albumTitle: '' });

    try {
      await apiUpdateAlbumStatus(albumId, newStatus);
      setPendingAlbums(prev => prev.filter(a => a.id !== albumId));
      setModal({
        show: true,
        title: action === 'approve' ? 'Elfogadva!' : 'Elutasítva!',
        message: action === 'approve'
          ? 'Az album sikeresen publikálva lett.'
          : 'Az album visszakerült draft státuszba.',
        success: action === 'approve',
        callback: null,
      });
    } catch (err) {
      setModal({
        show: true,
        title: 'Hiba!',
        message: err.message || 'Nem sikerült frissíteni a státuszt.',
        success: false,
        callback: null,
      });
    }
  }

  function closeModal() {
    const cb = modal.callback;
    setModal(prev => ({ ...prev, show: false, callback: null }));
    if (cb) cb();
  }

  const sortedTracks = (tracks) =>
    [...tracks].sort((a, b) => parseInt(a.trackNumber) - parseInt(b.trackNumber));

  return (
    <>
      {modal.show && (
        <Modal title={modal.title} message={modal.message} isSuccess={modal.success} onClose={closeModal} />
      )}

      {/* Confirmation modal */}
      {confirm.show && (
        <div
          className="auth-modal"
          style={{ display: 'flex' }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirm({ show: false, albumId: null, action: null, albumTitle: '' }); }}
        >
          <div className="auth-modal-content" style={{ maxWidth: 480 }}>
            <span
              className="modal-close"
              onClick={() => setConfirm({ show: false, albumId: null, action: null, albumTitle: '' })}
            >
              ×
            </span>
            <h2 style={{ color: confirm.action === 'approve' ? '#4ade80' : '#f87171' }}>
              {confirm.action === 'approve' ? 'Album elfogadása' : 'Album elutasítása'}
            </h2>
            <p style={{ margin: '20px 0', fontSize: '1.1rem' }}>
              Biztosan {confirm.action === 'approve' ? 'elfogadod' : 'elutasítod'} a(z){' '}
              <strong style={{ color: '#00ffef' }}>{confirm.albumTitle}</strong> albumot?
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              <button
                className="primary-btn"
                style={{
                  background: confirm.action === 'approve' ? '#16a34a' : '#dc2626',
                  minWidth: 120,
                }}
                onClick={handleConfirm}
              >
                {confirm.action === 'approve' ? 'Elfogadom' : 'Elutasítom'}
              </button>
              <button
                className="primary-btn"
                style={{ background: '#333', minWidth: 120 }}
                onClick={() => setConfirm({ show: false, albumId: null, action: null, albumTitle: '' })}
              >
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      <div className="page-container albums-page">
        <h1 className="neon-title">ALBUM KEZELÉS</h1>
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '1.1rem', marginBottom: 30 }}>
          Várakozó (pending) albumok jóváhagyása vagy elutasítása
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00ffef', fontSize: '1.2rem' }}>Betöltés...</p>
        ) : pendingAlbums.length === 0 ? (
          <p className="no-albums" style={{ textAlign: 'center', fontSize: '1.2rem' }}>
            Nincs jóváhagyásra váró album.
          </p>
        ) : (
          <div className="admin-albums-list">
            {pendingAlbums.map((album) => {
              const coverSrc = coverToSrc(album.coverPath, FALLBACK_ALBUM);
              const title = album.title?.trim() || 'Ismeretlen album';
              const artist = album.artistName?.trim() || 'Ismeretlen előadó';
              const tracks = sortedTracks(album.tracks || []);

              return (
                <div key={album.id} className="admin-album-row">
                  <img
                    src={coverSrc}
                    alt={`${title} borító`}
                    className="admin-album-cover"
                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_ALBUM; }}
                  />

                  <div className="admin-album-info">
                    <div className="admin-album-title">{title}</div>
                    <div className="admin-album-artist">{artist}</div>
                    {tracks.length > 0 && (
                      <div className="admin-album-tracks">
                        {tracks.map((t, i) => (
                          <span key={i} className="admin-track-chip">
                            {t.trackNumber}. {t.title?.trim() || '?'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-album-actions">
                    <button
                      className="admin-btn approve-btn"
                      title="Elfogadás"
                      onClick={() => openConfirm(album.id, 'approve', title)}
                    >
                      ✔
                    </button>
                    <button
                      className="admin-btn reject-btn"
                      title="Elutasítás"
                      onClick={() => openConfirm(album.id, 'reject', title)}
                    >
                      ✘
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
