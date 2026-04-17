import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetAlbums, apiGetArtists, apiGetTracks } from '../utils/api';
import { FALLBACK_ALBUM, coverToSrc } from '../utils/fallbackImages';

function AlbumCard({ album, isAdmin }) {
  const coverSrc = coverToSrc(album.coverPath, FALLBACK_ALBUM);
  const title = album.title?.trim() || 'Ismeretlen album';
  const artist = album.artistName?.trim() || 'Ismeretlen előadó';

  const sortedTracks = album.tracks
    ? [...album.tracks].sort((a, b) => parseInt(a.trackNumber) - parseInt(b.trackNumber))
    : [];

  return (
    <div className="album-card">
      <div className="album-cover-wrapper">
        <img src={coverSrc} className="album-cover-img" alt={`${title} borító`} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_ALBUM; }} />
        <div className="platform-overlay">
          {album.spotifyArtistUrl && (
            <a href={album.spotifyArtistUrl} title="Spotify" className="platform-spotify" target="_blank" rel="noreferrer">
              <i className="bi bi-spotify"></i>
            </a>
          )}
          {album.appleArtistUrl && (
            <a href={album.appleArtistUrl} title="Apple Music" className="platform-apple" target="_blank" rel="noreferrer">
              <i className="bi bi-apple"></i>
            </a>
          )}
          {!album.spotifyArtistUrl && !album.appleArtistUrl && (
            <>
              <a href="#" title="Spotify" className="platform-spotify"><i className="bi bi-spotify"></i></a>
              <a href="#" title="Apple Music" className="platform-apple"><i className="bi bi-apple"></i></a>
            </>
          )}
        </div>
      </div>

      <div className="album-card-info">
        <div className="album-card-title">{title}</div>
        <div className="album-card-artist">{artist}</div>
        {isAdmin && album.status === 'draft' && (
          <div style={{ color: '#f87171', fontWeight: 'bold', fontSize: '0.95rem', marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Elutasítva
          </div>
        )}
        {isAdmin && album.status === 'pending' && (
          <div style={{ color: '#facc15', fontWeight: 'bold', fontSize: '0.95rem', marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Várakozó
          </div>
        )}
        {isAdmin && album.status === 'published' && (
          <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.95rem', marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Elfogadva
          </div>
        )}
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
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [myAlbums, setMyAlbums] = useState([]);

  const isAdmin = user?.permission === 1;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    async function fetchAlbums() {
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

        const currentUserId = user?.id;
        const userAlbums = albums
          .filter(a => isAdmin || a.userId === currentUserId)
          .map(a => ({
            ...a,
            artistName: artistMap[a.artistId] || 'Ismeretlen előadó',
            tracks: tracksByAlbum[a.id] || [],
          }));

        setMyAlbums(userAlbums);
      } catch (err) {
        console.error('Albumok betöltése sikertelen:', err);
      }
    }

    fetchAlbums();
  }, [isLoggedIn, navigate, user, isAdmin]);

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
              <AlbumCard key={index} album={album} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}