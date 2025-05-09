'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5"></div>
        <p className="text-gray-700 font-medium text-lg">Загрузка услуг...</p>
      </div>
    </div>
  );
}

// Main services component
function ServicesContent() {
  // Service image error handling
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  // SVG icons as fallbacks instead of using external files
  const fallbackIcons = {
    service1: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z" />
      </svg>
    ),
    service2: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15" />
      </svg>
    ),
    service3: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M10.5421 20.0018C6.71886 18.8578 3.86002 15.3071 3.86002 11.11C3.86002 5.8287 8.1387 1.55002 13.42 1.55002C16.8137 1.55002 19.7913 3.37238 21.3657 6.10002M10.5421 20.0018L6.74198 17.2018M10.5421 20.0018L11.02 15.5018M13.42 5.77952C15.7537 5.77952 17.6405 7.66636 17.6405 10.0001C17.6405 12.3337 15.7537 14.2206 13.42 14.2206C11.0863 14.2206 9.19943 12.3337 9.19943 10.0001C9.19943 7.66636 11.0863 5.77952 13.42 5.77952Z" />
        <path d="M18.3594 17.0001C17.9742 17.0001 17.6605 17.3138 17.6605 17.699C17.6605 18.0841 17.9742 18.3978 18.3594 18.3978C18.7445 18.3978 19.0582 18.0841 19.0582 17.699C19.0582 17.3138 18.7445 17.0001 18.3594 17.0001Z" />
        <path d="M18.3594 22.4492C17.9742 22.4492 17.6605 22.7629 17.6605 23.1481C17.6605 23.5332 17.9742 23.8469 18.3594 23.8469C18.7445 23.8469 19.0582 23.5332 19.0582 23.1481C19.0582 22.7629 18.7445 22.4492 18.3594 22.4492Z" />
        <path d="M21.0989 19.7501C20.7138 19.7501 20.4001 20.0638 20.4001 20.449C20.4001 20.8341 20.7138 21.1478 21.0989 21.1478C21.4841 21.1478 21.7978 20.8341 21.7978 20.449C21.7978 20.0638 21.4841 19.7501 21.0989 19.7501Z" />
        <path d="M15.6198 19.7501C15.2346 19.7501 14.9209 20.0638 14.9209 20.449C14.9209 20.8341 15.2346 21.1478 15.6198 21.1478C16.0049 21.1478 16.3186 20.8341 16.3186 20.449C16.3186 20.0638 16.0049 19.7501 15.6198 19.7501Z" />
      </svg>
    ),
    service4: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861C13 14.4338 12.5523 13.9861 12 13.9861C11.4477 13.9861 11 14.4338 11 14.9861Z" />
        <path d="M3 20.9998H21M6.5 17.9998H17.5M5.5 8.5V10.3598C5.19057 10.7348 5 11.1992 5 11.7032V14.0118C5 14.8283 5.5 15.9998 7 15.9998H17C18.5 15.9998 19 14.8283 19 14.0118V11.7032C19 11.1992 18.8094 10.7348 18.5 10.3598V8.5C18.5 4.91015 15.5899 2 12 2C8.41015 2 5.5 4.91015 5.5 8.5Z" />
      </svg>
    ),
    service5: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  };

  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen">
      {/* Enhanced header with improved design elements */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2"></div>
        <div className="absolute left-1/4 top-1/3 w-32 h-32 bg-amber-100/50 rounded-full opacity-30 blur-xl"></div>
        
        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative">
          <div className="absolute w-24 h-24 bg-amber-100/80 rounded-full blur-2xl -left-10 top-20 opacity-60"></div>
          <div className="absolute w-40 h-40 bg-amber-100/80 rounded-full blur-2xl right-10 top-40 opacity-60"></div>
          
          <div className="text-center relative">
            <div className="inline-block mx-auto mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full"></div>
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 sm:text-5xl tracking-tight">
              <span className="inline-block border-b-2 border-amber-400 pb-2">Наши услуги</span>
            </h1>
            <p className="mt-7 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
              Полный спектр решений по изготовлению и обслуживанию грузоподъемного оборудования с гарантией качества и надежности
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      {/* Services content */}
      <div className="max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative">
        <div className="absolute -left-64 top-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-64 bottom-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        
        <div className="space-y-24 relative z-10">
          {/* Service 1 - Enhanced with refined styling */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center" style={{ scrollMarginTop: '120px' }}>
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                Изготовление
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Мостовые краны
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Изготовление мостовых (однобалочных, двухбалочных, опорных, подвесных) кранов различной грузоподъемности и конфигурации под ваши требования.
              </p>
              <div className="pt-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Link 
                  href="/contacts" 
                  className="relative inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group z-10"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Получить консультацию
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-7">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                {/* Card background with refined gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                
                {/* Main card body with improved background */}
                <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                  {imgErrors['service1'] ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      {fallbackIcons.service1}
                    </div>
                  ) : (
                    <div className="relative w-full h-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                      <Image 
                        src="/img/services/services-card1.png" 
                        alt="Изготовление мостовых кранов"
                        fill
                        className="object-contain p-8 transform duration-700 ease-out group-hover:scale-105"
                        onError={() => handleImageError('service1')}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Service 2 - Enhanced with refined styling */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center" style={{ scrollMarginTop: '120px' }}>
            <div className="lg:col-span-7 lg:order-2">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                {/* Card background with refined gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                
                {/* Main card body with improved background */}
                <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                  {imgErrors['service2'] ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      {fallbackIcons.service2}
                    </div>
                  ) : (
                    <div className="relative w-full h-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                      <Image 
                        src="/img/services/services-card2.png" 
                        alt="Изготовление козловых кранов"
                        fill
                        className="object-contain p-8 transform duration-700 ease-out group-hover:scale-105"
                        onError={() => handleImageError('service2')}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-5 lg:order-1 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                Изготовление
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Козловые краны
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Изготовление козловых кранов разных типов и грузоподъемности для решения различных промышленных задач и специфических условий эксплуатации.
              </p>
              <div className="pt-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Link 
                  href="/contacts" 
                  className="relative inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group z-10"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Получить консультацию
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 3 - Enhanced with refined styling */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center" style={{ scrollMarginTop: '120px' }}>
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                Комплектующие
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Поставка комплектующих
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Поставка электротельферов, троллейных, кабельных соединений, ручных талей, различных запасных частей к электротельферам и крановому оборудованию.
              </p>
              <div className="pt-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Link 
                  href="/contacts" 
                  className="relative inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group z-10"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Получить консультацию
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-7">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                {/* Card background with refined gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                
                {/* Main card body with improved background */}
                <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                  {imgErrors['service3'] ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      {fallbackIcons.service3}
                    </div>
                  ) : (
                    <div className="relative w-full h-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                      <Image 
                        src="/img/services/services-card4.png" 
                        alt="Поставка комплектующих"
                        fill
                        className="object-contain p-8 transform duration-700 ease-out group-hover:scale-105"
                        onError={() => handleImageError('service3')}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Service 4 - Enhanced with refined styling */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center" style={{ scrollMarginTop: '120px' }}>
            <div className="lg:col-span-7 lg:order-2">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                {/* Card background with refined gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                
                {/* Main card body with improved background */}
                <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                  {imgErrors['service4'] ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      {fallbackIcons.service4}
                    </div>
                  ) : (
                    <div className="relative w-full h-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                      <Image 
                        src="/img/services/services-card5.png" 
                        alt="Ремонт и монтаж"
                        fill
                        className="object-contain p-8 transform duration-700 ease-out group-hover:scale-105"
                        onError={() => handleImageError('service4')}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-5 lg:order-1 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                Обслуживание
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Ремонт и монтаж
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Ремонт, монтаж и демонтаж мостовых (однобалочных, двухбалочных, опорных, подвесных) козловых кранов различной сложности.
              </p>
              <div className="pt-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Link 
                  href="/contacts" 
                  className="relative inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group z-10"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Получить консультацию
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 5 - Enhanced with refined styling */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center" style={{ scrollMarginTop: '120px' }}>
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                Техобслуживание
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Техническое обслуживание
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Регулярное техническое и сервисное обслуживание мостовых и козловых кранов для обеспечения бесперебойной работы и продления срока службы оборудования.
              </p>
              <div className="pt-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Link 
                  href="/contacts" 
                  className="relative inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group z-10"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Получить консультацию
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-7">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                {/* Card background with refined gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                
                {/* Main card body with improved background */}
                <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                  {imgErrors['service5'] ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      {fallbackIcons.service5}
                    </div>
                  ) : (
                    <div className="relative w-full h-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                      <Image 
                        src="/img/services/services-card6.png" 
                        alt="Техническое обслуживание"
                        fill
                        className="object-contain p-8 transform duration-700 ease-out group-hover:scale-105"
                        onError={() => handleImageError('service5')}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action section */}
        <div className="mt-24 mb-8 relative">
          {/* Background decorations */}
          <div className="absolute -left-64 bottom-1/2 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -right-64 bottom-1/2 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 bg-gradient-to-b from-[#2C3E50] to-[#1A2B49] rounded-xl overflow-hidden shadow-xl mx-4 sm:mx-12 lg:mx-24">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-48 -mt-48 opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -ml-40 -mb-40 opacity-70"></div>
            
            <div className="relative px-6 py-12 sm:py-16 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Нужна консультация эксперта?</h3>
                <p className="mt-4 text-gray-300 text-base sm:text-lg">
                  Оставьте заявку и наши специалисты свяжутся с вами в ближайшее время для обсуждения вашего проекта.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/contacts" className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  Связаться с нами
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ServicesContent />
    </Suspense>
  );
} 