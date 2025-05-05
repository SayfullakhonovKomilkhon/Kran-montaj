'use client';

import { useState, Suspense } from 'react';
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
    <div className="py-12 pt-8 bg-white flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Загрузка товара...</p>
      </div>
    </div>
  );
}

function CatalogItemContent() {
  const params = useParams();
  const id = params.id as string;
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  // This would typically come from a database or API
  const catalogItems: CatalogItemDetail[] = [
    {
      id: '1',
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Товар не найден</h1>
          <p className="mt-4 text-gray-500">
            Вернуться в <Link href="/catalog" className="text-orange-500 hover:text-orange-600 transition-colors">каталог</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-start">
            <div className="rounded-lg overflow-hidden bg-gray-50 p-4 shadow-sm">
              <div className="relative h-64 sm:h-96">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-24 w-24 text-gray-400" 
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
                  <Image 
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                    onError={handleImageError}
                    loading="eager"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 lg:mt-0 lg:max-w-lg">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{item.title}</h1>
            
            <div className="mt-6">
              <h3 className="sr-only">Описание</h3>
              <div className="text-base text-gray-700">
                <p>{item.fullDescription}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900">Технические характеристики</h2>

              <div className="mt-4">
                <ul className="space-y-4">
                  {item.specifications.map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        <span className="font-medium text-gray-900">{spec.name}:</span> {spec.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="rounded-md shadow">
                <Link 
                  href="/contacts" 
                  className="flex w-full items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors md:py-4 md:text-lg md:px-10"
                >
                  Получить консультацию
                </Link>
              </div>
              <div className="mt-4 text-center">
                <Link 
                  href="/catalog" 
                  className="text-base font-medium text-orange-500 hover:text-orange-600 transition-colors"
                >
                  ← Вернуться в каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the wrapped component with Suspense
export default function CatalogItemPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CatalogItemContent />
    </Suspense>
  );
} 