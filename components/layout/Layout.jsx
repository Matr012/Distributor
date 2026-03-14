import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Fő layout – Header + Navbar (bal) + Main (jobb) + Footer
 * Pontosan az eredeti HTML szerkezet: header → div.wrapper → (nav + main) → footer
 */
export default function Layout() {
  return (
    <>
      <Header />
      <div className="wrapper">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
