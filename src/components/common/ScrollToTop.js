import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that handles scrolling to top when the route changes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth animation when route changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop; 