'use client';

import { useState, Suspense, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Define interfaces for catalog items
interface Specification {
  name: string;
  value: string;
}

interface CatalogItemDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  specifications: Specification[];
  image: string;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-14 md:w-14 border-t-2 border-b-2 border-amber-600 mb-4"></div>
        <p className="text-gray-700 font-medium text-base md:text-lg">Загрузка товара...</p>
      </div>
    </div>
  );
}

function CatalogItemContent() {
  const params = useParams();
  const id = params.id as string;
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile for conditional rendering
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleImageError = () => {
    setImageError(true);
  };

  // This would typically come from a database or API
  const catalogItems: CatalogItemDetail[] = [
    {
      id: '1',
      title: 'Козловой кран',
      description: 'Промышленный козловой кран повышенной грузоподъемности для работы в сложных условиях. Надежная конструкция с усиленными компонентами обеспечивает долгий срок службы.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      specifications: [
        { name: 'Грузоподъемность', value: '5-50 тонн' },
        { name: 'Пролет', value: '12-32 м' },
        { name: 'Высота подъема', value: 'до 16 м' },
        { name: 'Температурный режим', value: '-40°C до +40°C' },
      ],
      image: '/img/services/warranty-card1.png',
    },
    {
      id: '2',
      title: 'Козловой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      specifications: [
        { name: 'Грузоподъемность', value: '5-50 тонн' },
        { name: 'Пролет', value: '12-32 м' },
        { name: 'Высота подъема', value: 'до 16 м' },
        { name: 'Температурный режим', value: '-40°C до +40°C' },
      ],
      image: '/img/services/warranty-card1.png',
    },
    {
      id: '3',
      title: 'Козловой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      specifications: [
        { name: 'Грузоподъемность', value: '5-50 тонн' },
        { name: 'Пролет', value: '12-32 м' },
        { name: 'Высота подъема', value: 'до 16 м' },
        { name: 'Температурный режим', value: '-40°C до +40°C' },
      ],
      image: '/img/services/warranty-card1.png',
    },
    {
      id: '4',
      title: 'Мостовой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      specifications: [
        { name: 'Грузоподъемность', value: '3-32 тонн' },
        { name: 'Пролет', value: '10-28 м' },
        { name: 'Высота подъема', value: 'до 12 м' },
        { name: 'Температурный режим', value: '-40°C до +40°C' },
      ],
      image: '/img/services/warranty-card1.png',
    },
    {
      id: '5',
      title: 'Мостовой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      specifications: [
        { name: 'Грузоподъемность', value: '3-32 тонн' },
        { name: 'Пролет', value: '10-28 м' },
        { name: 'Высота подъема', value: 'до 12 м' },
        { name: 'Температурный режим', value: '-40°C до +40°C' },
      ],
      image: '/img/services/warranty-card1.png',
    },
    {
      id: '6',
      title: 'Мостовой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      specifications: [
        { name: 'Грузоподъемность', value: '3-32 тонн' },
        { name: 'Пролет', value: '10-28 м' },
        { name: 'Высота подъема', value: 'до 12 м' },
        { name: 'Температурный режим', value: '-40°C до +40°C' },
      ],
      image: '/img/services/warranty-card1.png',
    },
  ];

  const item = catalogItems.find(item => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] px-4">
        <div className="text-center" data-aos="fade-up" data-aos-duration="800">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Товар не найден</h1>
          <p className="mt-4 text-gray-600">
            Вернуться в <Link href="/catalog" className="text-amber-600 hover:text-amber-700 transition-colors border-b border-amber-300 hover:border-amber-500">каталог</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen">
      {/* Enhanced header with subtle design elements */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="absolute right-0 top-0 w-64 md:w-96 h-64 md:h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-64 md:w-96 h-64 md:h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2"></div>
        
        {/* Breadcrumb navigation - improved for mobile */}
        <div className="max-w-7xl mx-auto pt-6 md:pt-8 pb-3 md:pb-4 px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex overflow-x-auto no-scrollbar py-1" aria-label="Breadcrumb" data-aos="fade-right" data-aos-duration="800">
            <ol className="flex items-center space-x-3 md:space-x-4 whitespace-nowrap">
              <li>
                <div>
                  <Link href="/" className="text-xs md:text-sm text-gray-500 hover:text-amber-600 transition-colors">
                    Главная
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/catalog" className="ml-3 text-xs md:text-sm text-gray-500 hover:text-amber-600 transition-colors">
                    Каталог
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-xs md:text-sm font-medium text-amber-600 truncate max-w-[150px] md:max-w-xs">
                    {item.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pb-16 md:pb-24 sm:px-6 lg:px-8">
        <div className="absolute -left-64 top-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-64 bottom-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        
        {/* Main content grid - optimized for mobile first */}
        <div className="relative z-10 md:grid md:grid-cols-12 md:gap-8 pt-4 md:pt-8 lg:pt-12">
          {/* Product image column - full width on mobile */}
          <div className="md:col-span-5" data-aos="fade-up" data-aos-duration="1000">
            <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl">
              {/* Card background with refined gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
              
              {/* Main card body with improved background */}
              <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                <div className="relative w-full aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                  
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-20 w-20 md:h-24 md:w-24 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="relative w-full h-full transform duration-700 ease-out group-hover:scale-105">
                      <Image 
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-6 md:p-8"
                        onError={handleImageError}
                        loading="eager"
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                      />
                    </div>
                  )}
                  
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                </div>
                
                {/* Image caption */}
                <div className="p-3 md:p-4 text-center bg-gradient-to-r from-amber-50 to-amber-100/50">
                  <p className="text-xs md:text-sm text-amber-800 font-medium">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product details column - positioned below image on mobile */}
          <div className="mt-8 md:mt-0 md:col-span-7" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            <div className="inline-flex items-center px-3 py-1.5 rounded-md text-xs md:text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500 mb-3 md:mb-4">
              Каталог
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              {item.title}
              <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2 md:mt-3"></div>
            </h1>
            
            <div className="mt-5 md:mt-7" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {item.fullDescription}
              </p>
            </div>

            {/* Technical specifications - improved spacing for mobile */}
            <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-gray-200/50" data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Технические характеристики
              </h2>

              <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                {item.specifications.map((spec, index) => (
                  <div 
                    key={index} 
                    className="flex items-start"
                    data-aos="fade-up" 
                    data-aos-duration="600" 
                    data-aos-delay={450 + (index * 100)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-3.5 md:w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm md:text-base text-gray-700 font-medium">{spec.name}: <span className="text-gray-600 font-normal">{spec.value}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to action - wider button on mobile for easier tapping */}
            <div className="mt-8 md:mt-10 pt-4 md:pt-6" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Link 
                  href="/contacts" 
                  className="flex justify-center w-full md:w-auto md:inline-flex items-center px-6 md:px-8 py-3.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Получить консультацию
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-4.5 md:w-4.5 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
            
            {/* Return to catalog link - improved tap target for mobile */}
            <div className="mt-8 md:mt-10 flex justify-center md:justify-start" data-aos="fade-up" data-aos-duration="800" data-aos-delay="700">
              <Link 
                href="/catalog" 
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-4.5 md:w-4.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </div>
        
        {/* Related products section - adjusted for mobile */}
        <div className="relative z-10 mt-16 md:mt-24" data-aos="fade-up" data-aos-duration="800" data-aos-delay="800">
          <div className="relative inline-block">
            <div className="absolute left-1/2 top-0 w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent transform -translate-x-1/2 -translate-y-10 md:-translate-y-12"></div>
            <div className="absolute left-1/2 top-0 w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent transform -translate-x-1/2 -translate-y-6 md:-translate-y-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add no-scrollbar utility class for breadcrumbs
function addGlobalStyles() {
  // Only run in browser
  if (typeof window !== 'undefined') {
    // Add styles if they don't exist yet
    if (!document.getElementById('custom-global-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-global-styles';
      style.innerHTML = `
        @media (max-width: 767px) {
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Export the wrapped component with Suspense
export default function CatalogItemPage() {
  useEffect(() => {
    addGlobalStyles();
  }, []);
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CatalogItemContent />
    </Suspense>
  );
} 