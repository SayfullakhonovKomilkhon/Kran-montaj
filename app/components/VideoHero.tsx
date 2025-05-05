'use client';

import React from 'react';

export default function VideoHero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center -mt-[100px]">
      {/* Video background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/video/Презентация KMS.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Content */}
      
    </div>
  );
} 