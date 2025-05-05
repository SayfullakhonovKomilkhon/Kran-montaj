'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Only initialize AOS in the browser environment
    if (typeof window !== 'undefined') {
      // Try to initialize AOS
      try {
        AOS.init({
          once: true,          // animation plays only once
          duration: 700,       // global duration
          easing: 'ease-in-out',
          offset: 50,          // offset (in px) from the original trigger point
          delay: 0,            // global delay for all animations
          anchorPlacement: 'top-bottom', // which anchor triggers animation
        });
      } catch (error) {
        console.error('Error initializing AOS:', error);
      }
    }
  }, []);

  return <>{children}</>;
} 