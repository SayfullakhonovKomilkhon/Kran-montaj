'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Handle chunk loading errors
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      // Check if it's a chunk loading error
      if (source && source.includes('chunks') && message && message.toString().includes('ChunkLoadError')) {
        console.error('Detected chunk loading error:', message);
        
        // Clear cache and reload the page
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName);
            });
          });
        }
        
        // Clear local storage related to Next.js
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('next-')) {
            localStorage.removeItem(key);
          }
        });
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        return true; // Prevent default error handling
      }
      
      // Call the original error handler for other errors
      if (originalOnError) {
        return originalOnError.call(window, message, source, lineno, colno, error);
      }
      
      return false;
    };
    
    // Clean up the error handler when the component unmounts
    return () => {
      window.onerror = originalOnError;
    };
  }, []);

  return <>{children}</>;
} 