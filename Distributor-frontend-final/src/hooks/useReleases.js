import { useState, useEffect } from 'react';
import { apiGetAlbums, apiGetArtists, apiGetMusicStyles } from '../utils/api';
import { FALLBACK_ALBUM, coverToSrc } from '../utils/fallbackImages';

let cachedReleases = null;
let fetchPromise = null;

function buildSlug(title) {
  return title
    .toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
    .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchReleases() {
  let albums, artists, styles;
  try {
    [albums, artists, styles] = await Promise.all([
      apiGetAlbums(),
      apiGetArtists(),
      apiGetMusicStyles(),
    ]);
  } catch {
    return [];
  }

  const artistMap = {};
  artists.forEach(a => { artistMap[a.id] = a; });

  const styleMap = {};
  styles.forEach(s => { styleMap[s.id] = s.genreName; });

  // Csak published albumok jelenjenek meg a nyilvános oldalon
  const publishedAlbums = albums.filter(a => a.status === 'published');

  return publishedAlbums.map(album => {
    const artist = artistMap[album.artistId];
    const year = album.createdAt ? new Date(album.createdAt).getFullYear().toString() : '';
    return {
      id: String(album.id),
      title: album.title || 'Ismeretlen album',
      artist: artist?.name || 'Ismeretlen előadó',
      image: coverToSrc(album.coverPath, FALLBACK_ALBUM),
      slug: buildSlug(album.title || 'album-' + album.id),
      spotify: album.spotifyArtistUrl || '',
      apple: album.appleArtistUrl || '',
      genre: styleMap[album.styleId] || '',
      year,
      status: album.status,
    };
  });
}

export default function useReleases() {
  const [releases, setReleases] = useState(cachedReleases || []);
  const [loading, setLoading] = useState(!cachedReleases);

  useEffect(() => {
    if (cachedReleases) {
      setReleases(cachedReleases);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetchReleases()
        .then(data => {
          cachedReleases = data;
          return data;
        })
        .catch(() => []);
    }

    fetchPromise.then(data => {
      setReleases(data);
      setLoading(false);
    });
  }, []);

  return { releases, loading };
}
