import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';

/**
 * Layout footer nélkül – azoknál az oldalaknál, ahol a footer ütközne a tartalommal
 */
export default function LayoutNoFooter() {
  return (
    <>
      <Header />
      <div className="wrapper">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
