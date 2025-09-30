import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 992,
    isDesktop: window.innerWidth >= 992,
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 992,
        isDesktop: width >= 992,
        width,
        height
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Verificar tamaño inicial
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default useScreenSize;