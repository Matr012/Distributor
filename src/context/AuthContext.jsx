import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiGetUsers, apiRegister, apiUpdateUser, apiGetMe, decodeJwt } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Előfizetés ellenőrzése a /Login/Me végponton keresztül
  const checkSubscription = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setHasSubscription(false);
      return false;
    }
    try {
      const me = await apiGetMe();
      console.log('🔍 Me API válasz:', me);
      console.log('📦 hasActiveSubscription:', me.hasActiveSubscription);
      setHasSubscription(!!me.hasActiveSubscription);
      return !!me.hasActiveSubscription;
    } catch (err) {
      console.error('❌ Me API hiba:', err);
      setHasSubscription(false);
      return false;
    }
  }, []);

  // Inicializálás – token + cached user betöltése
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const cachedUser = localStorage.getItem('loggedInUser');
      if (token && cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          localStorage.removeItem('loggedInUser');
          localStorage.removeItem('token');
        }
        // Várjuk meg az előfizetés státusz ellenőrzését
        await checkSubscription();
      }
      setLoading(false);
    };
    init();
  }, [checkSubscription]);

  // Login: API hívás → JWT token → user adatok lekérése
  const login = useCallback(async (email, password) => {
    try {
      const token = await apiLogin(email, password);
      localStorage.setItem('token', token);

      // JWT-ből email kinyerése, majd user keresése
      const decoded = decodeJwt(token);
      const tokenEmail = decoded?.sub || email;

      // Felhasználó adatok lekérése az API-ból
      const users = await apiGetUsers();
      const found = users.find(u => u.email === tokenEmail);

      if (found) {
        localStorage.setItem('loggedInUser', JSON.stringify(found));
        setUser(found);
        const hasSub = await checkSubscription();
        return { success: true, user: found, hasSubscription: hasSub };
      }

      // Ha nem találjuk a user-t a listában, minimális adatokkal tároljuk
      const minimalUser = { email: tokenEmail };
      localStorage.setItem('loggedInUser', JSON.stringify(minimalUser));
      setUser(minimalUser);
      const hasSub = await checkSubscription();
      return { success: true, user: minimalUser, hasSubscription: hasSub };
    } catch (err) {
      return { success: false, message: err.message || 'Hibás e-mail cím vagy jelszó!' };
    }
  }, []);

  // Register: API hívás
  const register = useCallback(async (userData) => {
    try {
      const regData = {
        id: 0,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        passwordHash: userData.password,
        profilePic: null,
        isArtist: false,
        verified: false,
        permission: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        albums: [],
        permissionNavigation: null,
        userBillings: [],
        userCards: [],
        userSubscriptions: [],
      };

      const message = await apiRegister(regData);
      return { success: true, message };
    } catch (err) {
      return { success: false, message: err.message || 'Regisztrációs hiba!' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setUser(null);
    setHasSubscription(false);
  }, []);

  const updateUser = useCallback(async (updatedData) => {
    const merged = { ...user, ...updatedData };
    // Próbáljuk frissíteni az API-n is
    try {
      await apiUpdateUser(merged);
    } catch {
      // Ha az API hívás nem sikerül (pl. nincs Admin jog), csak lokálisan mentjük
    }
    localStorage.setItem('loggedInUser', JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  // User adatok újratöltése az API-ból
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const users = await apiGetUsers();
      const fresh = users.find(u => u.id === user.id);
      if (fresh) {
        localStorage.setItem('loggedInUser', JSON.stringify(fresh));
        setUser(fresh);
      }
    } catch {
      // silent fail
    }
  }, [user]);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    hasSubscription,
    checkSubscription,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
