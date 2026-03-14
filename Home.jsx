import Slideshow from '../components/home/Slideshow';

// Képek importálása – később fetch-ből jön
import orgona from '../assets/images/Orgona.jpg';
import eden from '../assets/images/ÉDEN.jpg';
import gyogyito from '../assets/images/gyógyító.png';
import hoangyal from '../assets/images/hóangyal.png';
import kimaradas from '../assets/images/Kimaradás.jpg';
import vigyazz from '../assets/images/Vigyázz_magadra.jpg';
import glamour from '../assets/images/GLAMOUR KÉSZ.png';
import djv from '../assets/images/djv.jpg';

// Slideshow adatok – később API/fetch-ből jön
const slideshowItems = [
  {
    title: 'Orgonabokor (Album)',
    artist: 'Manuel',
    image: orgona,
    spotify: 'https://open.spotify.com/track/6PfQxSKdb1T71Y6rotJ5a9?si=6640903e482442a9',
    apple: 'https://music.apple.com/hu/album/orgonabokor/1795742501?l=hu',
  },
  {
    title: 'ÉDEN',
    artist: 'Mehringer',
    image: eden,
    spotify: 'https://open.spotify.com/track/37rab2ZEkXwsPboXTZxHBf?si=4523c77e314b4141',
    apple: 'https://music.apple.com/hu/album/%C3%A9den-single/1853879430?l=hu',
  },
  {
    title: 'gyógyító frekvenciák (Album)',
    artist: 'gyuris',
    image: gyogyito,
    spotify: 'https://open.spotify.com/prerelease/2LF2wBcsARv7v5zUEuKkIZ?si=7671d6d48efa44dd',
    apple: 'https://music.apple.com/hu/album/cyan-single/1862743735?l=hu',
  },
  {
    title: 'hóangyal',
    artist: 'gyuris',
    image: hoangyal,
    spotify: 'https://open.spotify.com/album/1x7cbY0aFqC5UEiJizAscJ?si=NwqJHTvESdyebZkggvAGlw',
    apple: 'https://music.apple.com/hu/album/h%C3%B3angyal-single/1858886516?l=hu',
  },
  {
    title: 'Kimaradás',
    artist: 'Mario',
    image: kimaradas,
    spotify: 'https://open.spotify.com/track/6ij2MtTi05Tpghcvp4i64m?si=bcdf96c784b0410e',
    apple: 'https://music.apple.com/hu/album/kimarad%C3%A1s-single/1828260599?l=hu',
  },
  {
    title: 'Vigyázz magadra, jó szórakozást',
    artist: 'AKC Misi',
    image: vigyazz,
    spotify: 'https://open.spotify.com/album/1fBB3D2EqSYKXvuCePwI5S?si=qC8iybZ4QdKdp_IXIh9kkA',
    apple: 'https://music.apple.com/hu/album/vigy%C3%A1zz-magadra-j%C3%B3-sz%C3%B3rakoz%C3%A1st/1862121130?l=hu',
  },
  {
    title: 'GLAMOUR (Album) Coming Soon...',
    artist: 'matro',
    image: glamour,
    spotify: '',
    apple: '',
  },
  {
    title: 'DJV',
    artist: 'Bruno X Spacc',
    image: djv,
    spotify: 'https://open.spotify.com/track/2rCQ3zEmyjiXuBlXms3mc4?si=20261d26767a45a2',
    apple: 'https://music.apple.com/hu/album/djv-single/1811164701?l=hu',
  },
];

export default function Home() {
  return (
    <>
      <p className="page-title">JELENLEG NÉPSZERŰ ZENÉK/ALBUMOK</p>
      <Slideshow items={slideshowItems} />
    </>
  );
}
