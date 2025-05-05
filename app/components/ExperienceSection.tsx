'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ExperienceSection() {
  // Images for the crane grid
  const craneImages = [
    {
      id: 1,
      title: 'Мостовой кран',
      image: '/img/services/0000259150_xzgmnpcd.jpg'
    },
    {
      id: 2,
      title: 'Мостовой кран',
      image: '/img/services/photo_2022-11-07_15-16-02.jpg'
    },
    {
      id: 3,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9236.jpg'
    },
    {
      id: 4,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9370.jpg'
    },
    {
      id: 5,
      title: 'Мостовой кран',
      image: '/img/services/photo_2022-11-07_15-16-02.jpg'
    },
    {
      id: 6,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9236.jpg'
    }
  ];

  // Logos for the client grid
  const clientLogos = [
    {
      id: 1,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 2,
      name: 'Procab',
      image: '/img/services/procab.png'
    },
    {
      id: 3,
      name: 'Basalt',
      image: '/img/services/Basalt_арматура.png'
    },
    {
      id: 4,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    },
    {
      id: 5,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 6,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    },
    {
      id: 7,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 8,
      name: 'Procab',
      image: '/img/services/procab.png'
    },
    {
      id: 9,
      name: 'Basalt',
      image: '/img/services/Basalt_арматура.png'
    },
    {
      id: 10,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    },
    {
      id: 11,
      name: 'Knauf',
      image: '/img/services/knauf.png'
    },
    {
      id: 12,
      name: 'Binokor',
      image: '/img/services/binokor.png'
    }
  ];

  // Crane SVG fallback icons
  const craneSvgIcons = [
    <svg key="crane1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gray-400">
      <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z" />
    </svg>,
    <svg key="crane2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gray-400">
      <path d="M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15" />
    </svg>,
    <svg key="crane3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gray-400">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ];

  // Handle image loading errors
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 15 years badge and heading */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-24 h-24 relative mb-6">
            <Image
              src="/img/services/15years-garanty.png"
              alt="15 лет гарантии"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center max-w-3xl mx-auto text-black">
            15 лет опыта в разработке грузоподъемного оборудования
          </h2>
        </div>

        {/* Grid of crane images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {craneImages.map((crane) => (
            <div key={crane.id} className="relative overflow-hidden rounded-xl shadow-md aspect-[4/3] bg-white">
              {imgErrors[`crane-${crane.id}`] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-16 h-16 flex items-center justify-center">
                    {craneSvgIcons[(crane.id % 3)]}
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={crane.image}
                    alt={crane.title}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(`crane-${crane.id}`)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="absolute bottom-4 right-4">
                <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-medium text-sm">
                  {crane.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-10">
          {clientLogos.map((client) => (
            <div key={client.id} className="flex items-center justify-center h-16 bg-white p-2 rounded-lg">
              {imgErrors[`client-${client.id}`] ? (
                <div className="flex items-center justify-center">
                  <span className="text-gray-700 font-medium">{client.name}</span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={client.image}
                    alt={client.name}
                    fill
                    className="object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                    onError={() => handleImageError(`client-${client.id}`)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 