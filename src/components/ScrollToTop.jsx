import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Minden route-váltásnál felgörgeti az oldalt a legtetejére.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
