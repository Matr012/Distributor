# MMZ Weboldal Selenium Tesztek

## 📋 Követelmények

- Python 3.7+
- Chrome böngésző
- Frontend futnia kell: `http://localhost:5174`
- Backend futnia kell: `http://localhost:5179`

## 🚀 Telepítés

1. Telepítsd a Selenium package-et:
```bash
pip install -r test_requirements.txt
```

VAGY egyszerűen:
```bash
pip install selenium
```

## ▶️ Futtatás

```bash
python test_mmz_website.py
```

## 📝 Mit tesztel?

1. **Főoldal betöltése** - Ellenőrzi hogy a weboldal elérhető
2. **Navigáció** - Teszteli a login oldalra navigálást
3. **Login form** - Ellenőrzi hogy minden form elem megjelenik
4. **Bejelentkezés** - Teszteli a bejelentkezési folyamatot
5. **Nyilvános oldal** - Kapcsolat oldal elérhető bejelentkezés nélkül
6. **Telefonszám formázás** - Regisztrációnál automatikus formázás

## 🎯 Várható kimenet

```
🚀 MMZ WEBOLDAL SELENIUM TESZTEK
============================================================

🧪 Teszt 1: Főoldal betöltése...
✅ Főoldal sikeresen betöltődött

🧪 Teszt 2: Navigáció a bejelentkezési oldalra...
✅ Sikeres navigáció a login oldalra

...

📊 TESZT EREDMÉNYEK
============================================================
✅ SIKERES - Főoldal betöltése
✅ SIKERES - Navigáció login-ra
✅ SIKERES - Login form elemek
✅ SIKERES - Bejelentkezés kísérlet
✅ SIKERES - Kapcsolat oldal nyilvános
✅ SIKERES - Telefonszám formázás

🎯 Összesen: 6/6 teszt sikeres (100%)
```

## 🛠️ Hibakeresés

Ha nem működik:
- Ellenőrizd hogy a frontend és backend fut
- Győződj meg róla hogy Chrome telepítve van
- Próbáld újratelepíteni a Selenium-ot: `pip install --upgrade selenium`
