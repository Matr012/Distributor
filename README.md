# MMZ Music Distribution Platform

Magyar zenei disztribúciós platform album és track feltöltési lehetőséggel.

## 🛠️ Technológiák

### Backend
- **ASP.NET Core 8.0** - REST API
- **Entity Framework Core** - ORM
- **MySQL** - Adatbázis
- **JWT Authentication** - Felhasználói hitelesítés

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigáció

## 📁 Projekt Struktúra

```
MMZ 0416F/
├── MMZ-master/              # Backend (ASP.NET Core)
│   └── MMZ/
│       ├── Controllers/     # API végpontok
│       ├── Models/          # Adatbázis modellek
│       ├── DTOs/            # Data Transfer Objects
│       └── Program.cs       # Alkalmazás belépési pont
│
└── Distributor-frontend-final/  # Frontend (React)
    └── src/
        ├── pages/           # Oldal komponensek
        ├── components/      # Újrafelhasználható komponensek
        ├── context/         # React Context (pl. AuthContext)
        └── utils/           # Segédfüggvények (API, localStorage)
```

## 🔧 Elvégzett Javítások

### 1. Album Feltöltés Javítások
- ✅ **AlbumDTO** létrehozása base64 cover képek kezeléséhez
- ✅ Foreign key bug javítása: `Album.Id` → `Album.StyleId` a MusicStyle kapcsolathoz
- ✅ Authorization módosítása: Admin-only → minden bejelentkezett felhasználó
- ✅ Cover kép konvertálása base64 stringből byte[] tömbre

### 2. Track Feltöltés Javítások
- ✅ **TrackDTO** létrehozása base64 audio fájlok kezeléséhez
- ✅ `Track.AudioPath` típus változtatása: `string` → `byte[]`
- ✅ Adatbázis séma frissítése: `VARCHAR(512)` → `MEDIUMBLOB`
- ✅ Audio fájl konvertálása base64 stringből byte[] tömbre
- ✅ MySQL `max_allowed_packet` beállítás növelése (64MB)

### 3. Artist Létrehozás Javítások
- ✅ Artist ID visszaadása sikeres létrehozás után
- ✅ Automatikus `CreatedAt` és `UpdatedAt` beállítása

### 4. Általános Fejlesztések
- ✅ Részletes hibakezelés és logging a kontrollerekben
- ✅ DTO pattern implementálása az API biztonságáért
- ✅ Frontend hibakezelés javítása
- ✅ Migration endpoint létrehozása adatbázis frissítéshez

## 🚀 Telepítés és Futtatás

### Backend Indítás

```powershell
cd "MMZ-master/MMZ"
dotnet restore
dotnet run
```

Backend elérhető: `http://localhost:5179`

### Frontend Indítás

```powershell
cd "Distributor-frontend-final"
npm install
npm run dev
```

Frontend elérhető: `http://localhost:5173`

### MySQL Konfiguráció

A `my.ini` fájlban (XAMPP: `C:\xampp\mysql\bin\my.ini`):

```ini
[mysqld]
max_allowed_packet=64M
```

Adatbázis migráció (audio_path oszlop frissítése):
```
POST http://localhost:5179/BackupRestore/MigrateAudioPath
```

## 📝 Adatbázis Séma Változtatások

### tracks tábla
```sql
ALTER TABLE tracks MODIFY COLUMN audio_path MEDIUMBLOB DEFAULT NULL;
```

## 🔐 Authentikáció

JWT Bearer token alapú authentikáció. A felhasználóknak be kell jelentkezniük, hogy album-okat és track-eket tölthessenek fel.

## 📄 API Végpontok

### Artist
- `POST /Artist/NewArtist` - Új előadó létrehozása

### Album
- `POST /Album/NewAlbum` - Új album létrehozása (cover képpel)
- `GET /Album/GetAlbums` - Összes album lekérése

### Track
- `POST /Track/NewTrack` - Új track létrehozása (audio fájllal)
- `GET /Track/GetTracks` - Összes track lekérése

### Auth
- `POST /Login/LoginUser` - Bejelentkezés
- `POST /Registry/RegisterUser` - Regisztráció

## ⚠️ Ismert Problémák

1. **MySQL max_allowed_packet** - Nagy audio fájlok esetén növelni kell
2. **XAMPP indítási problémák** - Ellenőrizni kell a `my.ini` szintaxisát

## 📚 Megjegyzések

- Cover képek: `byte[]` formátumban tárolva (BLOB)
- Audio fájlok: `byte[]` formátumban tárolva (MEDIUMBLOB)
- Frontend-Backend kommunikáció: Base64 encoding

---

**Fejlesztette:** MMZ Team  
**Utolsó frissítés:** 2026. április 16.
