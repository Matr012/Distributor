import Slideshow from '../components/home/Slideshow';
import useReleases from '../hooks/useReleases';

export default function Home() {
  const { releases, loading } = useReleases();

  const slideshowItems = releases.map(r => ({
    title: r.title,
    artist: r.artist,
    image: r.image,
    spotify: r.spotify,
    apple: r.apple,
  }));

  return (
    <>
      <p className="page-title">JELENLEG NÉPSZERŰ ZENÉK/ALBUMOK</p>
      {slideshowItems.length > 0 ? (
        <Slideshow items={slideshowItems} />
      ) : (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
          {loading ? 'Betöltés...' : 'Nem sikerült betölteni a zenéket. Ellenőrizd, hogy fut-e a szerver.'}
        </p>
      )}
    </>
  );
}
