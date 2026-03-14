import { useNavigate } from 'react-router-dom';
import { releases } from '../components/ui/SearchBar';

/**
 * Zenék oldal – Mozaik galéria
 * Az adatok a SearchBar-ból importált releases tömbből jönnek (később: fetch)
 */
export default function Music() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mosaic-gallery">
        {releases.map((release) => (
          <div
            key={release.id}
            className="mosaic-item"
            onClick={() => navigate(`/music/${release.slug}`)}
          >
            <img src={release.image} alt={release.title} />
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
