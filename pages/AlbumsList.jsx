import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AlbumCard({ album }) {
  const coverSrc =
    album.cover && album.cover.startsWith('data:')
      ? album.cover
      : 'https://via.placeholder.com/320x320/000000/00ffff?text=No+Cover';

  const title = album.title?.trim() || 'Ismeretlen album';
  const artist = album.artist?.trim() || 'Ismeretlen előadó';

  const sortedTracks = album.tracks
    ? [...album.tracks].sort((a, b) => parseInt(a.trackNumber) - parseInt(b.trackNumber))
    : [];

  return (
    <div className="album-card">
      <div className="album-cover-wrapper">
        <img src={coverSrc} className="album-cover-img" alt={`${title} borító`} />
        <div className="platform-overlay">
          <a href="#" title="Spotify" className="platform-spotify">
            <i className="bi bi-spotify"></i>
          </a>
          <a href="#" title="Apple Music" className="platform-apple">
            <i className="bi bi-apple"></i>
          </a>
        </div>
      </div>

      <div className="album-card-info">
        <div className="album-card-title">{title}</div>
        <div className="album-card-artist">{artist}</div>
      </div>

      {sortedTracks.length > 0 && (
        <div className="track-list-tooltip">
          <h3>Track lista</h3>
          {sortedTracks.map((track, i) => (
            <div key={i} className="track-item">
              {track.trackNumber || '?'}. {track.title?.trim() || 'Név nélküli track'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AlbumsList() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [myAlbums, setMyAlbums] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const currentUserEmail = loggedInUser?.email || null;
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    setMyAlbums(albums.filter((a) => a.uploaderEmail === currentUserEmail));
  }, [isLoggedIn, navigate]);

  return (
    <>
      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>

      <div className="page-container albums-page">
        <h1 className="neon-title">ALBUMOK LISTÁJA</h1>

        {myAlbums.length === 0 ? (
          <p className="no-albums">Nincs még feltöltött album.</p>
        ) : (
          <div className="albums-grid">
            {myAlbums.map((album, index) => (
              <AlbumCard key={index} album={album} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
