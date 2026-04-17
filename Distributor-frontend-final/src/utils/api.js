// ── API konfiguráció és segédfüggvények ──

const BASE_URL = 'http://localhost:5179';

// ── SHA-256 hash (Web Crypto API) ──
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Általános fetch wrapper ──
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}/${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error('A szerver nem elérhető. Kérlek indítsd el a backend szervert!');
  }

  return res;
}

// ── Login ──
// Backend: POST Login/Login { hash: SHA256(password), email }
// Backend double-hashes: SHA256(hash) and checks against DB
export async function apiLogin(email, password) {
  const hash = await sha256(password);
  const res = await request('Login/Login', {
    method: 'POST',
    body: JSON.stringify({ hash, email }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Hibás bejelentkezési adatok.');
  }

  const token = await res.text();
  return token;
}

// ── Registry ──
// Backend: POST Registry/NewRegistry (User object)
// Backend hashes passwordHash once more before saving
export async function apiRegister(userData) {
  const hash = await sha256(userData.passwordHash);
  const res = await request('Registry/NewRegistry', {
    method: 'POST',
    body: JSON.stringify({ ...userData, passwordHash: hash }),
  });

  if (!res.ok) {
    const raw = await res.text();
    let msg = raw || 'Regisztrációs hiba.';
    // Ha JSON validációs hiba jött vissza, olvashatóbb üzenetet adunk
    try {
      const json = JSON.parse(raw);
      if (json.errors) {
        msg = Object.values(json.errors).flat().join(' ');
      } else if (json.title) {
        msg = json.title;
      }
    } catch {
      // nem JSON, marad a nyers szöveg
    }
    throw new Error(msg);
  }

  return await res.text();
}

// ── Login/Me – aktuális bejelentkezett felhasználó + előfizetés státusz ──
export async function apiGetMe() {
  const res = await request('Login/Me');
  if (!res.ok) throw new Error('Nem sikerült lekérni a felhasználó adatait.');
  return res.json();
}

// ── Users ──
export async function apiGetUsers() {
  const res = await request('User/Users');
  if (!res.ok) throw new Error('Nem sikerült lekérni a felhasználókat.');
  return res.json();
}

export async function apiGetUserById(id) {
  const res = await request(`User/UserById?id=${id}`);
  if (!res.ok) throw new Error('Felhasználó nem található.');
  return res.json();
}

export async function apiUpdateUser(user) {
  const res = await request('User/ModifyUser', {
    method: 'PUT',
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni a felhasználót.');
  return res.text();
}

export async function apiUpdateProfilePic(base64) {
  const res = await request('User/UpdateProfilePic', {
    method: 'PATCH',
    body: JSON.stringify(base64),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni a profilképet.');
  return res.text();
}

export async function apiDeleteUser(id) {
  const res = await request(`User/DelUser?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni a felhasználót.');
  return res.text();
}

// ── Albums ──
export async function apiGetAlbums() {
  const res = await request('Album/Albums');
  if (!res.ok) throw new Error('Nem sikerült lekérni az albumokat.');
  return res.json();
}

export async function apiGetAlbumById(id) {
  const res = await request(`Album/AlbumById?id=${id}`);
  if (!res.ok) throw new Error('Album nem található.');
  return res.json();
}

export async function apiDeleteAlbum(id) {
  const res = await request(`Album/DelAlbum?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni az albumot.');
  return res.text();
}

export async function apiCreateAlbum(album) {
  const res = await request('Album/NewAlbum', {
    method: 'POST',
    body: JSON.stringify(album),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Nem sikerült létrehozni az albumot.');
  }
  // Returns the new album ID
  const text = await res.text();
  return parseInt(text, 10);
}

export async function apiUpdateAlbum(album) {
  const res = await request('Album/ModifyAlbum', {
    method: 'PUT',
    body: JSON.stringify(album),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni az albumot.');
  return res.text();
}


export async function apiUpdateAlbumStatus(id, status) {
  const res = await request(`Album/UpdateStatus?id=${id}&status=${status}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni az album státuszát.');
  return res.text();
}




// ── Artists ──
export async function apiGetArtists() {
  const res = await request('Artist/Artists');
  if (!res.ok) throw new Error('Nem sikerült lekérni az előadókat.');
  return res.json();
}

export async function apiGetArtistById(id) {
  const res = await request(`Artist/ArtistById?id=${id}`);
  if (!res.ok) throw new Error('Előadó nem található.');
  return res.json();
}

export async function apiCreateArtist(artist) {
  const res = await request('Artist/NewArtist', {
    method: 'POST',
    body: JSON.stringify(artist),
  });
  if (!res.ok) throw new Error('Nem sikerült létrehozni az előadót.');
  const text = await res.text();
  return parseInt(text, 10); // returns artist ID
}

export async function apiUpdateArtist(artist) {
  const res = await request('Artist/ModifyArtist', {
    method: 'PUT',
    body: JSON.stringify(artist),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni az előadót.');
  return res.text();
}

export async function apiDeleteArtist(id) {
  const res = await request(`Artist/DelArtist?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni az előadót.');
  return res.text();
}

// ── Tracks ──
export async function apiGetTracks() {
  const res = await request('Track/Tracks');
  if (!res.ok) throw new Error('Nem sikerült lekérni a számokat.');
  return res.json();
}

export async function apiGetTrackById(id) {
  const res = await request(`Track/TrackById?id=${id}`);
  if (!res.ok) throw new Error('Szám nem található.');
  return res.json();
}

export async function apiCreateTrack(track) {
  const res = await request('Track/NewTrack', {
    method: 'POST',
    body: JSON.stringify(track),
  });
  if (!res.ok) throw new Error('Nem sikerült létrehozni a számot.');
  return res.text();
}

export async function apiUpdateTrack(track) {
  const res = await request('Track/ModifyTrack', {
    method: 'PUT',
    body: JSON.stringify(track),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni a számot.');
  return res.text();
}

export async function apiDeleteTrack(id) {
  const res = await request(`Track/DelTrack?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni a számot.');
  return res.text();
}

// ── Music Styles ──
export async function apiGetMusicStyles() {
  const res = await request('MusicStyles/MusicStyles');
  if (!res.ok) throw new Error('Nem sikerült lekérni a zenei stílusokat.');
  return res.json();
}

// ── Card Types ──
export async function apiGetCardTypes() {
  const res = await request('CardType/CardTypes');
  if (!res.ok) throw new Error('Nem sikerült lekérni a kártyatípusokat.');
  return res.json();
}

// ── Subscription Plans ──
export async function apiGetSubscriptionPlans() {
  const res = await request('SubscriptionPlan/SubscriptionPlans');
  if (!res.ok) throw new Error('Nem sikerült lekérni az előfizetési csomagokat.');
  return res.json();
}

// ── User Billing ──
export async function apiGetUserBillings() {
  const res = await request('UserBilling/UserBillings');
  if (!res.ok) throw new Error('Nem sikerült lekérni a számlázási adatokat.');
  return res.json();
}

export async function apiGetUserBillingById(id) {
  const res = await request(`UserBilling/UserBillingById?id=${id}`);
  if (!res.ok) throw new Error('Számlázási adat nem található.');
  return res.json();
}

export async function apiCreateUserBilling(billing) {
  const res = await request('UserBilling/NewUserBilling', {
    method: 'POST',
    body: JSON.stringify(billing),
  });
  if (!res.ok) throw new Error('Nem sikerült létrehozni a számlázási adatot.');
  return res.text();
}

export async function apiUpdateUserBilling(billing) {
  const res = await request('UserBilling/ModifyUserBilling', {
    method: 'PUT',
    body: JSON.stringify(billing),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni a számlázási adatot.');
  return res.text();
}

export async function apiDeleteUserBilling(id) {
  const res = await request(`UserBilling/DelUserBilling?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni a számlázási adatot.');
  return res.text();
}

// ── User Cards ──
export async function apiGetUserCards() {
  const res = await request('UserCard/UserCards');
  if (!res.ok) throw new Error('Nem sikerült lekérni a kártyákat.');
  return res.json();
}

export async function apiGetUserCardById(id) {
  const res = await request(`UserCard/UserCardById?id=${id}`);
  if (!res.ok) throw new Error('Kártya nem található.');
  return res.json();
}

export async function apiCreateUserCard(card) {
  const res = await request('UserCard/NewUserCard', {
    method: 'POST',
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error('Nem sikerült létrehozni a kártyát.');
  return res.text();
}

export async function apiUpdateUserCard(card) {
  const res = await request('UserCard/ModifyUserCard', {
    method: 'PUT',
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni a kártyát.');
  return res.text();
}

export async function apiDeleteUserCard(id) {
  const res = await request(`UserCard/DelUserCard?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni a kártyát.');
  return res.text();
}

// ── User Subscriptions ──
export async function apiGetUserSubscriptions() {
  const res = await request('UserSubscription/UserSubscriptions');
  if (!res.ok) throw new Error('Nem sikerült lekérni az előfizetéseket.');
  return res.json();
}

export async function apiGetUserSubscriptionById(id) {
  const res = await request(`UserSubscription/UserSubscriptionById?id=${id}`);
  if (!res.ok) throw new Error('Előfizetés nem található.');
  return res.json();
}

export async function apiCreateUserSubscription(sub) {
  const res = await request('UserSubscription/NewUserSubscription', {
    method: 'POST',
    body: JSON.stringify(sub),
  });
  if (!res.ok) throw new Error('Nem sikerült létrehozni az előfizetést.');
  return res.text();
}

export async function apiUpdateUserSubscription(sub) {
  const res = await request('UserSubscription/ModifyUserSubscription', {
    method: 'PUT',
    body: JSON.stringify(sub),
  });
  if (!res.ok) throw new Error('Nem sikerült frissíteni az előfizetést.');
  return res.text();
}

export async function apiDeleteUserSubscription(id) {
  const res = await request(`UserSubscription/DelUserSubscription?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Nem sikerült törölni az előfizetést.');
  return res.text();
}

// ── JWT Token dekódolás ──
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}
