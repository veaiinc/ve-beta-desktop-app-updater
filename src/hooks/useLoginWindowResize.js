import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LOGIN_WIDTH = 481;
const DEFAULT_WIDTH = 1366;
const DEFAULT_HEIGHT = 768;

const useLoginWindowResize = () => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    // Define login routes (unauthenticated routes)
    const loginRoutes = [
      '/',
      '/verify-user',
      '/onboarding',
      '/user/verify-oauth-user',
      '/early-access',
    ];

    // Also check for referral routes
    const isReferralRoute = currentPath.startsWith('/referral/');
    const isCurrentlyOnLogin = loginRoutes.includes(currentPath) || isReferralRoute;
    const wasPreviouslyOnLogin = loginRoutes.includes(previousPath) || previousPath.startsWith('/referral/');

    // Check if window resize API is available
    if (!window?.electronApi?.resizeMainWindow) {
      previousPathRef.current = currentPath;
      return;
    }

        // CASE 1: Navigating TO login page → Smooth resize to 481px (logout animation)
        if (isCurrentlyOnLogin && !wasPreviouslyOnLogin) {
          // Get screen dimensions for centering
          const screenWidth = window.screen.width;
          const screenHeight = window.screen.height;
          
          // Pre-calculate target position for smoother animation
          const targetX = Math.round((screenWidth - LOGIN_WIDTH) / 2);
          const targetY = Math.round((screenHeight - DEFAULT_HEIGHT) / 2);
          
          window.electronApi.resizeMainWindow({
            dimensions: { 
              width: LOGIN_WIDTH, 
              height: DEFAULT_HEIGHT,
              x: targetX, // Center horizontally
              y: targetY // Center vertically
            },
            animate: true, // Smooth animation when logging out
            duration: 500, // Slightly faster than login for snappier logout feel
            easing: 'easeInOutSmooth', // Same smooth easing curve
          });
        }

    // CASE 2: Navigating FROM login page to authenticated route → Smooth resize to default
    if (!isCurrentlyOnLogin && wasPreviouslyOnLogin) {
      // Add a small delay to allow page to load first, then start smooth animation
      setTimeout(() => {
        // Get screen dimensions for centering
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        // Pre-calculate target position for smoother animation
        const targetX = Math.round((screenWidth - DEFAULT_WIDTH) / 2);
        const targetY = Math.round((screenHeight - DEFAULT_HEIGHT) / 2);
        
        window.electronApi.resizeMainWindow({
          dimensions: { 
            width: DEFAULT_WIDTH, 
            height: DEFAULT_HEIGHT,
            x: targetX, // Center horizontally
            y: targetY // Center vertically
          },
          animate: true,
          duration: 600, // Longer duration for ultra-smooth animation
          easing: 'easeInOutSmooth', // Custom ultra-smooth easing curve
        });
      }, 80); // Optimized delay for perfect timing
    }

    // Update the previous path reference
    previousPathRef.current = currentPath;
  }, [location.pathname]);
};

export default useLoginWindowResize;

