'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define interface for catalog items
interface CatalogItemType {
  id: number;
  title: string;
  description: string;
  image: string;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-white flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Загрузка каталога...</p>
      </div>
    </div>
  );
}

// Catalog item component with error handling
function CatalogItem({ item }: { item: CatalogItemType }) {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-50 group-hover:opacity-90 transition-opacity sm:h-64 relative">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-400" 
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
            className="object-contain p-4"
            onError={handleImageError}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-gray-900">
            <Link href={`/catalog/${item.id}`}>{item.title}</Link>
          </h3>
          <p className="mt-3 text-base text-gray-500">{item.description}</p>
        </div>
        <div className="mt-6">
          <Link
            href={`/catalog/${item.id}`}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main catalog content component
function CatalogContent() {
  const catalogItems = [
    {
      id: 1,
      title: 'Козловой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      image: '/img/services/warranty-card1.png',
    },
    {
      id: 2,
      title: 'Козловой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      image: '/img/services/warranty-card1.png',
    },
    {
      id: 3,
      title: 'Козловой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      image: '/img/services/warranty-card1.png',
    },
    {
      id: 4,
      title: 'Мостовой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      image: '/img/services/warranty-card1.png',
    },
    {
      id: 5,
      title: 'Мостовой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      image: '/img/services/warranty-card1.png',
    },
    {
      id: 6,
      title: 'Мостовой кран',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis',
      image: '/img/services/warranty-card1.png',
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Каталог продукции
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
            Ознакомьтесь с нашей продукцией высочайшего качества
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {catalogItems.map((item) => (
            <CatalogItem key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Не нашли то, что искали? <Link href="/contacts" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">Свяжитесь с нами</Link> для получения дополнительной информации.
          </p>
        </div>
      </div>
    </div>
  );
}

// Export the wrapped component with Suspense
export default function CatalogPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CatalogContent />
    </Suspense>
  );
} 