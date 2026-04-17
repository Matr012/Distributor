import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LayoutNoFooter from './components/layout/LayoutNoFooter';
import ScrollToTop from './components/ScrollToTop';
import GuestRoute from './components/guards/GuestRoute';
import AuthRoute from './components/guards/AuthRoute';
import SubscribedRoute from './components/guards/SubscribedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Music from './pages/Music';
import MusicDetail from './pages/MusicDetail';
import Contact from './pages/Contact';
import Prods from './pages/Prods';
import Profile from './pages/Profile';
import Promo from './pages/Promo';
import AboutUs from './pages/AboutUs';
import Policy from './pages/Policy';
import Subscription from './pages/Subscription';
import Payment from './pages/Payment';
import AlbumUpload from './pages/AlbumUpload';
import TrackUpload from './pages/TrackUpload';
import AlbumsList from './pages/AlbumsList';
import Distribution from './pages/Distribution';
import Promotion from './pages/Promotion';
import Impresszum from './pages/Impresszum';
import AdminAlbums from './pages/AdminAlbums';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Auth oldalak – csak vendégeknek (nem bejelentkezett) */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Előfizetés + fizetés – bejelentkezve, de előfizetés nélkül is elérhető */}
            <Route path="/subscription" element={<AuthRoute><Subscription /></AuthRoute>} />
            <Route path="/payment" element={<AuthRoute><Payment /></AuthRoute>} />

            {/* Védett oldalak – csak aktív előfizetéssel */}
            <Route path="/" element={<SubscribedRoute><Home /></SubscribedRoute>} />
            <Route path="/music" element={<SubscribedRoute><Music /></SubscribedRoute>} />
            <Route path="/music/:slug" element={<SubscribedRoute><MusicDetail /></SubscribedRoute>} />
            <Route path="/policy" element={<SubscribedRoute><Policy /></SubscribedRoute>} />
            <Route path="/promo" element={<SubscribedRoute><Promo /></SubscribedRoute>} />
            {/* Nyilvános oldalak – mindenki számára elérhetők */}
            <Route path="/prods" element={<Prods />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aboutus" element={<SubscribedRoute><AboutUs /></SubscribedRoute>} />
            <Route path="/distribution" element={<SubscribedRoute><Distribution /></SubscribedRoute>} />
            <Route path="/promotion" element={<SubscribedRoute><Promotion /></SubscribedRoute>} />
            <Route path="/impresszum" element={<SubscribedRoute><Impresszum /></SubscribedRoute>} />
            <Route path="/profile" element={<SubscribedRoute><Profile /></SubscribedRoute>} />
            <Route path="/album-upload" element={<SubscribedRoute><AlbumUpload /></SubscribedRoute>} />
            <Route path="/track-upload" element={<SubscribedRoute><TrackUpload /></SubscribedRoute>} />
            <Route path="/admin/albums" element={<SubscribedRoute><AdminAlbums /></SubscribedRoute>} />

            {/* 404 */}
            <Route path="*" element={<h1 className="neon-title" style={{ textAlign: 'center' }}>404 - Az oldal nem található</h1>} />
          </Route>

          {/* Footer nélküli layout */}
          <Route element={<LayoutNoFooter />}>
            <Route path="/albums-list" element={<SubscribedRoute><AlbumsList /></SubscribedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
