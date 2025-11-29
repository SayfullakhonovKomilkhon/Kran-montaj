'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// URL видео из Supabase Storage
const SUPABASE_VIDEO_URL = 'https://rgpdolopvlfdiutwlvow.supabase.co/storage/v1/object/public/video/video-header.mp4';

export default function VideoHero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video background */}
      {!videoError && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: -1 }}
        >
          <source src={SUPABASE_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Fallback gradient background while video loads or on error */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`}
        style={{ zIndex: -2 }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 mb-8">
          <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
          <span className="text-amber-200 text-sm font-medium">Более 15 лет на рынке</span>
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          <span className="block">Грузоподъемное</span>
          <span className="block mt-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            оборудование
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Производство, монтаж и сервисное обслуживание кранов любой сложности. 
          Гарантия качества и надежности.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/catalog"
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg overflow-hidden shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center">
              Каталог продукции
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link
            href="/contacts"
            className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            <span className="flex items-center">
              Связаться с нами
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </Link>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
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