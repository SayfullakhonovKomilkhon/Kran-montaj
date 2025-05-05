'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function CatalogSection() {
  const catalogItems = [
    {
      id: 1,
      title: 'Козловой кран',
      description: 'Козловые краны для промышленных предприятий различной грузоподъемности',
      image: '/img/services/catalog-img-1.png',
      fallbackIcon: '/img/services/crane2.svg',
    },
    {
      id: 2,
      title: 'Мостовой кран',
      description: 'Мостовые краны (однобалочные, двухбалочные, опорные, подвесные) для различных задач',
      image: '/img/services/catalog-img-1.png',
      fallbackIcon: '/img/services/crane1.svg',
    },
    {
      id: 3,
      title: 'Комплектующие',
      description: 'Запасные части и комплектующие для кранового оборудования, включая тали и электротельферы',
      image: '/img/services/catalog-img-1.png',
      fallbackIcon: '/img/services/components.svg',
    },
  ];

  // Handle image loading errors
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: number) => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {catalogItems.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={150 * (index + 1)}
              data-aos-duration="700"
            >
              <div 
                className="mb-5 flex justify-center h-48 bg-gray-50 rounded-lg p-4"
                data-aos="zoom-in"
                data-aos-delay={200 * (index + 1)}
              >
                {imgErrors[item.id] ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={item.fallbackIcon}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    width={220}
                    height={220}
                    className="object-contain w-full h-full"
                    onError={() => handleImageError(item.id)}
                  />
                )}
              </div>
              
              <div>
                <h3 
                  className="font-bold text-lg text-gray-900 mb-2"
                  data-aos="fade-up"
                  data-aos-delay={250 * (index + 1)}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-gray-600 text-sm mb-4"
                  data-aos="fade-up"
                  data-aos-delay={300 * (index + 1)}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div 
          className="flex justify-center mt-10 relative z-10"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <a 
            href="/catalog" 
            className="inline-flex items-center justify-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors"
          >
            Подробнее
          </a>
        </div>
      </div>
    </div>
  );
} 