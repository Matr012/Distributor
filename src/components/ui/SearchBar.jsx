import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useReleases from '../../hooks/useReleases';

export default function SearchBar() {
  const { releases } = useReleases();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query.length >= 2
    ? releases.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="search-bar" ref={containerRef}>
      <span className="search-icon"></span>
      <input
        type="text"
        placeholder="Keresés..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
      />
      {showDropdown && filtered.length > 0 && (
        <div className="search-dropdown" style={{ display: 'block' }}>
          {filtered.map((release) => (
            <div
              key={release.id}
              className="search-dropdown-item"
              onClick={() => {
                navigate(`/music/${release.slug}`);
                setQuery('');
                setShowDropdown(false);
              }}
            >
              <img src={release.image} alt={release.title} />
              <div className="item-info">
                <div className="single-line-text">
                  <span className="artist-name">{release.artist}</span> – {release.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
