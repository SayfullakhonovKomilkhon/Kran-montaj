'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ServiceSection() {
  const services = [
    {
      id: 1,
      title: 'Изготовление мостовых кранов',
      description: 'Изготовление мостовых (однобалочных, двухбалочных, опорных, подвесных)',
      image: '/img/services/services-card1.png',
      fallbackIcon: '/img/services/crane1.svg',
      scale: 'scale-100',
    },
    {
      id: 2,
      title: 'Изготовление козловых кранов',
      description: 'Изготовление козловых кранов разных типов и грузоподъемности',
      image: '/img/services/services-card2.png',
      fallbackIcon: '/img/services/crane2.svg',
      scale: 'scale-100',
    },
    {
      id: 3,
      title: 'Изготовление мостовых кранов',
      description: 'Изготовление мостовых (однобалочных, двухбалочных, опорных, подвесных)',
      image: '/img/services/services-card3.png',
      fallbackIcon: '/img/services/crane3.svg',
      scale: 'scale-100',
    },
    {
      id: 4,
      title: 'Поставка комплектующих',
      description: 'Поставка электротельферов, троллейных, кабельных соединений, ручных талей, различных запасных частей к электротельферам и крановому оборудованию',
      image: '/img/services/services-card4.png',
      fallbackIcon: '/img/services/components.svg',
      scale: 'scale-100',
    },
    {
      id: 5,
      title: 'Ремонт и монтаж',
      description: 'Ремонт, монтаж и демонтаж мостовых (однобалочных, двухбалочных, опорных, подвесных) козловых кранов',
      image: '/img/services/services-card5.png',
      fallbackIcon: '/img/services/repair.svg',
      scale: 'scale-100',
    },
    {
      id: 6,
      title: 'Техническое обслуживание',
      description: 'Техническое и сервисное обслуживание мостовых, козловых кранов',
      image: '/img/services/services-card6.png',
      fallbackIcon: '/img/services/service.svg',
      scale: 'scale-100',
    },
  ];

  // Handle image loading errors
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: number) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="py-12 sm:py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-10 sm:mb-16"
          data-aos="fade-up"
        >
          <h2 
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 md:text-4xl"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Услуги
          </h2>
          <p 
            className="mt-3 sm:mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Мы предлагаем полный спектр услуг по изготовлению и обслуживанию грузоподъемного оборудования
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
              data-aos-duration="700"
            >
              <div 
                className="w-36 h-36 flex items-center justify-center mb-6 bg-blue-50 rounded-full p-4"
                data-aos="zoom-in"
                data-aos-delay={200 + (index * 100)}
              >
                {imgErrors[service.id] ? (
                  <img
                    src={service.fallbackIcon}
                    alt={service.title}
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                ) : (
                  <img
                    src={service.image}
                    alt={service.title}
                    width={144}
                    height={144}
                    className={`object-contain ${service.scale}`}
                    onError={() => handleImageError(service.id)}
                  />
                )}
              </div>
              
              <div className="text-center">
                <h3 
                  className="font-bold text-lg text-gray-900 mb-2"
                  data-aos="fade-up"
                  data-aos-delay={250 + (index * 100)}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-gray-600 text-sm"
                  data-aos="fade-up"
                  data-aos-delay={300 + (index * 100)}
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 