import { useEffect, useRef } from 'react';
import { FALLBACK_ALBUM } from '../../utils/fallbackImages';

/**
 * Infinite scroll slideshow – pontosan az eredeti HTML logika React-ben
 * Az elemeket klónozzuk a smooth infinite scrollhoz, mint az eredeti JS:
 * items.forEach(item => { const clone = item.cloneNode(true); track.appendChild(clone); });
 */
export default function Slideshow({ items }) {
  const trackRef = useRef(null);

  // Klónozzuk az elemeket az infinite scroll-hoz
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Töröljük a korábbi klónokat (ha hot reload történik)
    const originals = track.querySelectorAll('.slideshow-item:not(.clone)');
    track.querySelectorAll('.clone').forEach(c => c.remove());

    // Klónozzuk az összes elemet
    originals.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
  }, [items]);

  return (
    <div className="slideshow-container">
      <div className="slideshow-track" ref={trackRef}>
        {items.map((item, idx) => (
          <div className="slideshow-item" key={idx}>
            <img src={item.image} alt={item.title} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_ALBUM; }} />
            <div className="slideshow-overlay"></div>
            <div className="slideshow-caption">
              <div className="caption-title">{item.title}</div>
              <div className="caption-artist">{item.artist}</div>
              {(item.spotify || item.apple) && (
                <div className="streaming-links">
                  {item.spotify && (
                    <a href={item.spotify} target="_blank" rel="noreferrer">
                      <i className="bi bi-spotify"></i>
                    </a>
                  )}
                  {item.apple && (
                    <a href={item.apple} target="_blank" rel="noreferrer">
                      <i className="bi bi-apple"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
