'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-white flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Загрузка услуг...</p>
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-gray-400">
        <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z" />
      </svg>
    ),
    service2: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-gray-400">
        <path d="M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15" />
      </svg>
    ),
    service3: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-gray-400">
        <path d="M10.5421 20.0018C6.71886 18.8578 3.86002 15.3071 3.86002 11.11C3.86002 5.8287 8.1387 1.55002 13.42 1.55002C16.8137 1.55002 19.7913 3.37238 21.3657 6.10002M10.5421 20.0018L6.74198 17.2018M10.5421 20.0018L11.02 15.5018M13.42 5.77952C15.7537 5.77952 17.6405 7.66636 17.6405 10.0001C17.6405 12.3337 15.7537 14.2206 13.42 14.2206C11.0863 14.2206 9.19943 12.3337 9.19943 10.0001C9.19943 7.66636 11.0863 5.77952 13.42 5.77952Z" />
        <path d="M18.3594 17.0001C17.9742 17.0001 17.6605 17.3138 17.6605 17.699C17.6605 18.0841 17.9742 18.3978 18.3594 18.3978C18.7445 18.3978 19.0582 18.0841 19.0582 17.699C19.0582 17.3138 18.7445 17.0001 18.3594 17.0001Z" />
        <path d="M18.3594 22.4492C17.9742 22.4492 17.6605 22.7629 17.6605 23.1481C17.6605 23.5332 17.9742 23.8469 18.3594 23.8469C18.7445 23.8469 19.0582 23.5332 19.0582 23.1481C19.0582 22.7629 18.7445 22.4492 18.3594 22.4492Z" />
        <path d="M21.0989 19.7501C20.7138 19.7501 20.4001 20.0638 20.4001 20.449C20.4001 20.8341 20.7138 21.1478 21.0989 21.1478C21.4841 21.1478 21.7978 20.8341 21.7978 20.449C21.7978 20.0638 21.4841 19.7501 21.0989 19.7501Z" />
        <path d="M15.6198 19.7501C15.2346 19.7501 14.9209 20.0638 14.9209 20.449C14.9209 20.8341 15.2346 21.1478 15.6198 21.1478C16.0049 21.1478 16.3186 20.8341 16.3186 20.449C16.3186 20.0638 16.0049 19.7501 15.6198 19.7501Z" />
      </svg>
    ),
    service4: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-gray-400">
        <path d="M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861C13 14.4338 12.5523 13.9861 12 13.9861C11.4477 13.9861 11 14.4338 11 14.9861Z" />
        <path d="M3 20.9998H21M6.5 17.9998H17.5M5.5 8.5V10.3598C5.19057 10.7348 5 11.1992 5 11.7032V14.0118C5 14.8283 5.5 15.9998 7 15.9998H17C18.5 15.9998 19 14.8283 19 14.0118V11.7032C19 11.1992 18.8094 10.7348 18.5 10.3598V8.5C18.5 4.91015 15.5899 2 12 2C8.41015 2 5.5 4.91015 5.5 8.5Z" />
      </svg>
    ),
    service5: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-gray-400">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  };

  return (
    <div className="py-10 pt-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center" id="services-top" style={{ scrollMarginTop: '120px' }}>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Услуги
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Полный спектр услуг по изготовлению и обслуживанию грузоподъемного оборудования
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-16">
            {/* Service 1 */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8" style={{ scrollMarginTop: '120px' }}>
              <div className="lg:col-span-5">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Изготовление мостовых кранов
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Изготовление мостовых (однобалочных, двухбалочных, опорных, подвесных) кранов различной грузоподъемности и конфигурации
                </p>
                <div className="mt-6">
                  <Link href="/contacts" className="text-base font-medium text-blue-600 hover:text-blue-500">
                    Получить консультацию →
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:col-span-7">
                <div className="bg-gray-100 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  {imgErrors['service1'] ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      {fallbackIcons.service1}
                    </div>
                  ) : (
                    <div className="relative w-full h-64">
                      <Image 
                        src="/img/services/services-card1.png" 
                        alt="Изготовление мостовых кранов"
                        fill
                        className="object-contain p-4"
                        onError={() => handleImageError('service1')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center" style={{ scrollMarginTop: '120px' }}>
              <div className="lg:col-span-7">
                <div className="bg-gray-100 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  {imgErrors['service2'] ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      {fallbackIcons.service2}
                    </div>
                  ) : (
                    <div className="relative w-full h-64">
                      <Image 
                        src="/img/services/services-card2.png" 
                        alt="Изготовление козловых кранов"
                        fill
                        className="object-contain p-4"
                        onError={() => handleImageError('service2')}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:col-span-5">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Изготовление козловых кранов
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Изготовление козловых кранов разных типов и грузоподъемности для решения различных промышленных задач
                </p>
                <div className="mt-6">
                  <Link href="/contacts" className="text-base font-medium text-blue-600 hover:text-blue-500">
                    Получить консультацию →
                  </Link>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8" style={{ scrollMarginTop: '120px' }}>
              <div className="lg:col-span-5">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Поставка комплектующих
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Поставка электротельферов, троллейных, кабельных соединений, ручных талей, различных запасных частей к электротельферам и крановому оборудованию
                </p>
                <div className="mt-6">
                  <Link href="/contacts" className="text-base font-medium text-blue-600 hover:text-blue-500">
                    Получить консультацию →
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:col-span-7">
                <div className="bg-gray-100 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  {imgErrors['service3'] ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      {fallbackIcons.service3}
                    </div>
                  ) : (
                    <div className="relative w-full h-64">
                      <Image 
                        src="/img/services/services-card4.png" 
                        alt="Поставка комплектующих"
                        fill
                        className="object-contain p-4"
                        onError={() => handleImageError('service3')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center" style={{ scrollMarginTop: '120px' }}>
              <div className="lg:col-span-7">
                <div className="bg-gray-100 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  {imgErrors['service4'] ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      {fallbackIcons.service4}
                    </div>
                  ) : (
                    <div className="relative w-full h-64">
                      <Image 
                        src="/img/services/services-card5.png" 
                        alt="Ремонт и монтаж"
                        fill
                        className="object-contain p-4"
                        onError={() => handleImageError('service4')}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:col-span-5">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Ремонт и монтаж
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Ремонт, монтаж и демонтаж мостовых (однобалочных, двухбалочных, опорных, подвесных) козловых кранов
                </p>
                <div className="mt-6">
                  <Link href="/contacts" className="text-base font-medium text-blue-600 hover:text-blue-500">
                    Получить консультацию →
                  </Link>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8" style={{ scrollMarginTop: '120px' }}>
              <div className="lg:col-span-5">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Техническое обслуживание
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Техническое и сервисное обслуживание мостовых, козловых кранов. Регулярное обслуживание для обеспечения безопасности и долговечности оборудования.
                </p>
                <div className="mt-6">
                  <Link href="/contacts" className="text-base font-medium text-blue-600 hover:text-blue-500">
                    Получить консультацию →
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:col-span-7">
                <div className="bg-gray-100 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  {imgErrors['service5'] ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      {fallbackIcons.service5}
                    </div>
                  ) : (
                    <div className="relative w-full h-64">
                      <Image 
                        src="/img/services/services-card6.png" 
                        alt="Техническое обслуживание"
                        fill
                        className="object-contain p-4"
                        onError={() => handleImageError('service5')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for error handling
export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ServicesContent />
    </Suspense>
  );
} 