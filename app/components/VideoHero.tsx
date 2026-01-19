'use client';

import React from 'react';

// URL видео из Supabase Storage
const SUPABASE_VIDEO_URL = 'https://qkvgjrywutnudwcoekmf.supabase.co/storage/v1/object/public/video/video-header.mp4';

export default function VideoHero() {
  return (
    <div className="relative h-screen w-full overflow-hidden -mt-[120px] md:-mt-[130px]">
      {/* Video background - показывается сразу */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: -1 }}
      >
        <source src={SUPABASE_VIDEO_URL} type="video/mp4" />
      </video>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-0"></div>
      
      {/* Stats - positioned near bottom */}
      <div className="absolute bottom-28 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400">15+</p>
            <p className="text-gray-400 text-sm mt-1">Лет опыта</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400">500+</p>
            <p className="text-gray-400 text-sm mt-1">Проектов</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400">250+</p>
            <p className="text-gray-400 text-sm mt-1">Клиентов</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400">24/7</p>
            <p className="text-gray-400 text-sm mt-1">Поддержка</p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center text-white/60 animate-bounce">
          <span className="text-xs mb-2">Листайте вниз</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
} 