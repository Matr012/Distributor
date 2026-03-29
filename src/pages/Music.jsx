import { useNavigate } from 'react-router-dom';
import useReleases from '../hooks/useReleases';
import { FALLBACK_ALBUM } from '../utils/fallbackImages';

/**
 * Zenék oldal – Mozaik galéria
 * Az adatok a useReleases hook-ból jönnek (API fetch)
 */
export default function Music() {
  const navigate = useNavigate();
  const { releases } = useReleases();

  return (
    <>
      <div className="mosaic-gallery">
        {releases.map((release) => (
          <div
            key={release.id}
            className="mosaic-item"
            onClick={() => navigate(`/music/${release.slug}`)}
          >
            <img src={release.image} alt={release.title} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_ALBUM; }} />
            <div className="item-title">{release.title}</div>
            <div className="item-creator">{release.artist}</div>
          </div>
        ))}
      </div>

      <div className="back-to-home">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>← Vissza</a>
      </div>
    </>
  );
}
