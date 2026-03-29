// Helyi fallback képek – SVG data URI, nem függ külső szervertől

// A .NET byte[] base64-ként adja vissza JSON-ban – ezt itt alakítjuk data URI-vá
export function coverToSrc(coverPath, fallback) {
  if (!coverPath) return fallback;
  if (typeof coverPath !== 'string') return fallback;
  if (coverPath.startsWith('data:') || coverPath.startsWith('http')) return coverPath;
  return `data:image/jpeg;base64,${coverPath}`;
}

export const FALLBACK_ALBUM = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <rect width="320" height="320" fill="#0d0d1a"/>
  <rect width="320" height="320" fill="none" stroke="#00ffff" stroke-width="2" opacity="0.3"/>
  <circle cx="160" cy="160" r="70" fill="none" stroke="#00ffff" stroke-width="3" opacity="0.5"/>
  <circle cx="160" cy="160" r="18" fill="#00ffff" opacity="0.7"/>
  <circle cx="160" cy="160" r="7" fill="#0d0d1a"/>
  <text x="160" y="264" font-family="Arial,sans-serif" font-size="15" fill="#00ffff" opacity="0.7" text-anchor="middle">NINCS BORÍTÓ</text>
</svg>
`)}`;

export const FALLBACK_ARTIST = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#0d0d1a"/>
  <rect width="300" height="300" fill="none" stroke="#00ffff" stroke-width="2" opacity="0.3"/>
  <circle cx="150" cy="115" r="48" fill="#1a1a2e" stroke="#00ffff" stroke-width="2" opacity="0.6"/>
  <ellipse cx="150" cy="248" rx="72" ry="40" fill="#1a1a2e" stroke="#00ffff" stroke-width="2" opacity="0.6"/>
  <text x="150" y="285" font-family="Arial,sans-serif" font-size="14" fill="#00ffff" opacity="0.7" text-anchor="middle">NINCS KÉP</text>
</svg>
`)}`;

export const FALLBACK_PROFILE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" fill="#0d0d1a" rx="60"/>
  <circle cx="60" cy="45" r="22" fill="#1a1a2e" stroke="#00ffff" stroke-width="1.5" opacity="0.7"/>
  <ellipse cx="60" cy="100" rx="32" ry="18" fill="#1a1a2e" stroke="#00ffff" stroke-width="1.5" opacity="0.7"/>
</svg>
`)}`;
