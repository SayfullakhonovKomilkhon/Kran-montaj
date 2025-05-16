'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

// Define service type based on the database structure
interface Service {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
}

export default function ServiceSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Service image error handling
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  // Fetch services from Supabase
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        console.log('Fetching services for home page...');
        
        const { data, error } = await supabase
          .from('services')
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

        console.log('Services data received for home page:', data);
        setServices(data || []);
      } catch (err: any) {
        console.error('Error fetching services for home page:', err);
        if (err.message) {
          setError(`Не удалось загрузить услуги: ${err.message}`);
        } else {
          setError('Не удалось загрузить услуги');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
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

  return (
    <div className="py-16 sm:py-20 bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-12 sm:mb-16"
          data-aos="fade-up"
        >
          <div className="inline-block mx-auto mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full"></div>
            <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full"></div>
          </div>
          <h2 
            className="text-2xl sm:text-3xl font-bold text-gray-900 md:text-4xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Услуги
          </h2>
          <p 
            className="mt-4 sm:mt-5 max-w-2xl text-lg sm:text-xl text-gray-600 mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Мы предлагаем полный спектр услуг по изготовлению и обслуживанию грузоподъемного оборудования
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-gray-700 font-medium">Загрузка услуг...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">Нет доступных услуг</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="group flex flex-col items-center relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={100 + (index * 100)}
                data-aos-duration="700"
              >
                {/* Card background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F8FAFC] z-0"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/30 via-amber-500 to-amber-400/30 z-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mb-12 -mr-12 z-0"></div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-amber-500/5 rounded-full -mt-8 -ml-8 z-0"></div>
                
                <div className="z-10 p-8 flex flex-col items-center w-full">
                  <div 
                    className="w-36 h-36 flex items-center justify-center mb-6 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] rounded-full p-4 relative shadow-md"
                    data-aos="zoom-in"
                    data-aos-delay={200 + (index * 100)}
                  >
                    {imgErrors[service.id] || !service.image_url ? (
                      <div className="flex items-center justify-center">
                        {fallbackIcons[index % fallbackIcons.length]}
                      </div>
                    ) : (
                      <div className="relative w-32 h-32 transform transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={service.image_url}
                          alt={service.name}
                          fill
                          className="object-contain"
                          onError={() => handleImageError(service.id)}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 
                      className="font-bold text-lg text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300"
                      data-aos="fade-up"
                      data-aos-delay={250 + (index * 100)}
                    >
                      {service.name}
                    </h3>
                    <div className="w-10 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-3 transform transition-all duration-500 group-hover:w-16"></div>
                    <p 
                      className="text-gray-600 text-sm"
                      data-aos="fade-up"
                      data-aos-delay={300 + (index * 100)}
                    >
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Animated bottom link/button */}
                  <div className="mt-5 w-full relative overflow-hidden">
                    <div className="h-0.5 w-0 bg-gradient-to-r from-amber-400 to-amber-500 group-hover:w-full transition-all duration-500 opacity-70 mx-auto"></div>
                    <Link href="/services" className="block">
                      <div className="flex justify-center mt-3">
                        <span className="text-amber-600 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          Подробнее
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center" data-aos="fade-up" data-aos-delay="400">
          <Link 
            href="/services" 
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 group"
          >
            <span className="flex items-center">
              Все услуги
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
} 