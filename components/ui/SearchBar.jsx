import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Később fetch-ből jön – egyelőre statikus adat (ugyanaz mint search.js-ben volt)
import orgona from '../../assets/images/Orgona.jpg';
import eden from '../../assets/images/ÉDEN.jpg';
import gyogyito from '../../assets/images/gyógyító.png';
import hoangyal from '../../assets/images/hóangyal.png';
import kimaradas from '../../assets/images/Kimaradás.jpg';
import vigyazz from '../../assets/images/Vigyázz_magadra.jpg';
import glamour from '../../assets/images/GLAMOUR.jpg';
import djv from '../../assets/images/djv.jpg';

const releases = [
  { id: 'orgonabokor', title: 'Orgonabokor (Album)', artist: 'Manuel', image: orgona, slug: 'orgonabokor', spotify: 'https://open.spotify.com/track/6PfQxSKdb1T71Y6rotJ5a9?si=6640903e482442a9', apple: 'https://music.apple.com/hu/album/orgonabokor/1795742501?l=hu', genre: 'POP', year: '2025' },
  { id: 'eden', title: 'ÉDEN', artist: 'Mehringer', image: eden, slug: 'eden', spotify: 'https://open.spotify.com/track/37rab2ZEkXwsPboXTZxHBf?si=4523c77e314b4141', apple: 'https://music.apple.com/hu/album/%C3%A9den-single/1853879430?l=hu', genre: 'POP - ALTERNATÍV ROCK', year: '2025' },
  { id: 'gyogyito-frekvenciak', title: 'gyógyító frekvenciák (Album)', artist: 'gyuris', image: gyogyito, slug: 'gyogyito-frekvenciak', spotify: 'https://open.spotify.com/prerelease/2LF2wBcsARv7v5zUEuKkIZ?si=7671d6d48efa44dd', apple: 'https://music.apple.com/hu/album/cyan-single/1862743735?l=hu', genre: 'TRAP', year: '2025' },
  { id: 'hoangyal', title: 'hóangyal', artist: 'gyuris', image: hoangyal, slug: 'hoangyal', spotify: 'https://open.spotify.com/album/1x7cbY0aFqC5UEiJizAscJ?si=NwqJHTvESdyebZkggvAGlw', apple: 'https://music.apple.com/hu/album/h%C3%B3angyal-single/1858886516?l=hu', genre: 'TRAP', year: '2025' },
  { id: 'kimaradas', title: 'Kimaradás', artist: 'Mario', image: kimaradas, slug: 'kimaradas', spotify: 'https://open.spotify.com/track/6ij2MtTi05Tpghcvp4i64m?si=bcdf96c784b0410e', apple: 'https://music.apple.com/hu/album/kimarad%C3%A1s-single/1828260599?l=hu', genre: 'POP', year: '2025' },
  { id: 'vigyazz-magadra', title: 'Vigyázz magadra, jó szórakozást', artist: 'AKC Misi', image: vigyazz, slug: 'vigyazz-magadra', spotify: 'https://open.spotify.com/album/1fBB3D2EqSYKXvuCePwI5S?si=qC8iybZ4QdKdp_IXIh9kkA', apple: 'https://music.apple.com/hu/album/vigy%C3%A1zz-magadra-j%C3%B3-sz%C3%B3rakoz%C3%A1st/1862121130?l=hu', genre: 'TRAP', year: '2025' },
  { id: 'glamour', title: 'GLAMOUR (Album)', artist: 'matro', image: glamour, slug: 'glamour', spotify: '', apple: '', genre: 'R&B - TRAP', year: '2025' },
  { id: 'djv', title: 'DJV', artist: 'Bruno X Spacc', image: djv, slug: 'djv', spotify: 'https://open.spotify.com/track/2rCQ3zEmyjiXuBlXms3mc4?si=20261d26767a45a2', apple: 'https://music.apple.com/hu/album/djv-single/1811164701?l=hu', genre: 'TRAP - POP - AFRO', year: '2025' },
];

export { releases };

export default function SearchBar() {
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
