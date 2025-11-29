'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define product type based on the Supabase database structure
interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price: number | null;
}

export default function CatalogSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log('Fetching products for home page...');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(3);

        if (error) {
          console.error('Supabase error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('Products data received for home page:', data);
        setProducts(data || []);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // SVG fallback icons
  const fallbackIcons = [
    <svg key="crane1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-gray-400">
      <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z" />
    </svg>,
    <svg key="crane2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-gray-400">
      <path d="M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15" />
    </svg>,
    <svg key="crane3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-gray-400">
      <path d="M10.5421 20.0018C6.71886 18.8578 3.86002 15.3071 3.86002 11.11C3.86002 5.8287 8.1387 1.55002 13.42 1.55002C16.8137 1.55002 19.7913 3.37238 21.3657 6.10002M10.5421 20.0018L6.74198 17.2018M10.5421 20.0018L11.02 15.5018M13.42 5.77952C15.7537 5.77952 17.6405 7.66636 17.6405 10.0001C17.6405 12.3337 15.7537 14.2206 13.42 14.2206C11.0863 14.2206 9.19943 12.3337 9.19943 10.0001C9.19943 7.66636 11.0863 5.77952 13.42 5.77952Z" />
    </svg>
  ];

  // Handle image loading errors
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="py-12 sm:py-16 bg-white relative">
      {/* Background crane image positioned on the right */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full z-0 opacity-40 pointer-events-none hidden md:block"
        style={{
          backgroundImage: 'url(/img/services/catalog-background.png)',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
        data-aos="fade-left"
        data-aos-duration="1000"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          className="text-center mb-10 sm:mb-16 relative z-10"
          data-aos="fade-up"
        >
          <h2 
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 md:text-4xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Каталог
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-700 font-medium">Загрузка продуктов...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">Нет доступных продуктов</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={150 * (index + 1)}
                data-aos-duration="700"
              >
                <div 
                  className="mb-5 flex justify-center h-48 bg-gray-50 rounded-lg p-4 relative"
                  data-aos="zoom-in"
                  data-aos-delay={200 * (index + 1)}
                >
                  {imgErrors[product.id] || !product.image_url ? (
                    <div className="flex items-center justify-center w-full h-full">
                      {fallbackIcons[index % fallbackIcons.length]}
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-contain"
                        onError={() => handleImageError(product.id)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 
                    className="font-bold text-lg text-gray-900 mb-2"
                    data-aos="fade-up"
                    data-aos-delay={250 * (index + 1)}
                  >
                    {product.title}
                  </h3>
                  <p 
                    className="text-gray-600 text-sm mb-4"
                    data-aos="fade-up"
                    data-aos-delay={300 * (index + 1)}
                  >
                    {product.description}
                  </p>
                  {product.price && (
                    <p 
                      className="text-amber-600 font-semibold text-sm"
                      data-aos="fade-up"
                      data-aos-delay={350 * (index + 1)}
                    >
                      <span>от {product.price.toLocaleString()} сум</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div 
          className="flex justify-center mt-10 relative z-10"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Link 
            href="/catalog" 
            className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
} 