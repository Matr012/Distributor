import { useParams, useNavigate } from 'react-router-dom';
import useReleases from '../hooks/useReleases';
import { FALLBACK_ALBUM } from '../utils/fallbackImages';

/**
 * Zenei részletek oldal – egy közös komponens az összes zenéhez
 * A slug paraméter alapján keressük ki a megfelelő adatot
 * Az adatokat az API-ból szerzi be a useReleases hook
 */
export default function MusicDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { releases } = useReleases();

  const release = releases.find(r => r.slug === slug);

  if (!release) {
    return (
      <div className="album-main">
        <h1 className="album-title">A zene nem található</h1>
        <div className="back-to-home">
          <a href="/music" onClick={(e) => { e.preventDefault(); navigate('/music'); }}>← Vissza</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="album-main">
        <img src={release.image} alt={release.title} className="album-cover" onError={e => { e.target.onerror = null; e.target.src = FALLBACK_ALBUM; }} />
        <h1 className="album-title">{release.title}</h1>
        <h2 className="album-artist">{release.artist}</h2>
        <p className="album-genre-year">{release.genre} - {release.year}</p>

        {(release.spotify || release.apple) && (
          <div className="album-streaming-links">
            {release.spotify && (
              <a href={release.spotify} target="_blank" rel="noreferrer">
                <i className="bi bi-spotify"></i>
              </a>
            )}
            {release.apple && (
              <a href={release.apple} target="_blank" rel="noreferrer">
                <i className="bi bi-apple"></i>
              </a>
            )}
          </div>
        )}
      </div>

      <div className="back-to-home">
        <a href="/music" onClick={(e) => { e.preventDefault(); navigate('/music'); }}>← Vissza</a>
      </div>
    </>
  );
}
