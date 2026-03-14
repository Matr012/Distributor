import { Link } from 'react-router-dom';

import zetenImg from '../assets/images/zetenysumegvarifoto.jpg';
import mateImg from '../assets/images/pallmatekep.jpg';
import milanImg from '../assets/images/bastyurmilankep.jpg';

const founders = [
  { name: 'Sümegi Zétény', image: zetenImg, instagram: 'https://www.instagram.com/_zeady_/' },
  { name: 'Páll Máté', image: mateImg, instagram: 'https://www.instagram.com/matr0_/' },
  { name: 'Bastyúr Milán', image: milanImg, instagram: 'https://www.instagram.com/b.milaann_/' },
];

export default function AboutUs() {
  return (
    <main className="about-main">
      <h1>Rólunk – MMZ Disztribútor</h1>

      <div className="about-text">
        <p className="lead">
          Az MMZ Disztribútor egy magyar disztribúciós szolgáltató, amely immár 1 éve segíti a hazai zenészeket abban,
          hogy zenéjük eljusson a hallgatókhoz a digitális platformokon.
        </p>

        <p>
          A csapatot Páll Máté, Bastyúr Milán és Sümegi Zétény alapította azzal a céllal, hogy egy olyan alternatívát
          hozzunk létre, amely valódi támogatást nyújt a tehetséges magyar előadóknak – különösen a fiatal, feltörekvő
          zenészek számára.
        </p>

        <p>
          Küldetésünk, hogy bevonzzuk és támogassuk azokat az alkotókat, akik hisznek a zenéjükben, de még nem
          rendelkeznek a szükséges háttérrel a megjelenések és a promóció terén.
        </p>

        <p className="closing">Hiszünk abban, hogy a tehetség számít, nem a pénz.</p>
      </div>

      {/* Alapítók */}
      <section className="team-section">
        <h2>Alapítók</h2>
        <div className="team-grid">
          {founders.map((f) => (
            <a key={f.name} href={f.instagram} target="_blank" rel="noopener noreferrer" className="team-member">
              <div className="team-avatar-wrapper">
                <img src={f.image} alt={f.name} className="team-avatar" />
              </div>
              <span>{f.name}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="back-to-home">
        <Link to="/">← Vissza</Link>
      </div>
    </main>
  );
}
