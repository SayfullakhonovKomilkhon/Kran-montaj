'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';

export default function ExperienceSection() {
  // Images for the crane grid
  const craneImages = [
    {
      id: 1,
      title: 'Мостовой кран',
      image: '/img/services/0000259150_xzgmnpcd.jpg',
      description: 'Мостовой кран предназначен для выполнения погрузочно-разгрузочных работ в промышленных помещениях.'
    },
    {
      id: 2,
      title: 'Мостовой кран',
      image: '/img/services/photo_2022-11-07_15-16-02.jpg',
      description: 'Надежная конструкция для перемещения тяжелых грузов на производстве.'
    },
    {
      id: 3,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9236.jpg',
      description: 'Грузоподъемное оборудование для увеличения эффективности производственных процессов.'
    },
    {
      id: 4,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9370.jpg',
      description: 'Высокая производительность и безопасность при погрузочно-разгрузочных работах.'
    },
    {
      id: 5,
      title: 'Мостовой кран',
      image: '/img/services/photo_2022-11-07_15-16-02.jpg',
      description: 'Современное решение для оптимизации рабочих процессов на предприятии.'
    },
    {
      id: 6,
      title: 'Мостовой кран',
      image: '/img/services/IMG_9236.jpg',
      description: 'Техническое оснащение промышленных объектов для выполнения сложных задач.'
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

  // Animation on scroll
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Custom navigation button refs
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section 
      id="experienceSection" 
      className="py-20 relative"
      ref={sectionRef}
      style={{
        position: 'relative',
      }}
    >
      {/* Background overlay with subtle parallax */}
      <div 
        className="absolute inset-0 z-0 bg-fixed" 
        style={{
          backgroundImage: 'url("/img/services/header-background.png")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.85) contrast(1.1)', 
          transform: isVisible ? 'scale(1)' : 'scale(1.05)',
          transition: 'transform 1.2s ease-out, filter 1.2s ease-out',
        }}
      />
      
      {/* Content with semi-transparent overlay for better readability */}
      <div className={`relative z-10 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s ease-out 0.3s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 15 years badge and heading */}
          <div className={`flex flex-col items-center mb-20 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
            <div className="w-28 h-28 relative mb-8 floating">
              <Image
                src="/img/services/15years-garanty.png"
                alt="15 лет гарантии"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-center max-w-3xl mx-auto text-white section-heading">
              15 лет опыта в разработке грузоподъемного оборудования
            </h2>
          </div>

          {/* Crane images slider */}
          <div className={`relative mb-20 ${isVisible ? 'fade-in fade-in-delay-1' : 'opacity-0'}`}>
            <div className="mb-10 relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 30 }
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                pagination={{ 
                  clickable: true,
                  el: '.swiper-pagination',
                  bulletClass: 'inline-block w-3 h-3 rounded-full bg-white/70 mx-1 cursor-pointer transition-all',
                  bulletActiveClass: '!bg-yellow-500 scale-125',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 5,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                speed={800}
                grabCursor={true}
                onSwiper={(swiper) => {
                  // Update navigation when Swiper instance is available
                  setTimeout(() => {
                    if (swiper.navigation && prevRef.current && nextRef.current) {
                      swiper.navigation.prevEl = prevRef.current;
                      swiper.navigation.nextEl = nextRef.current;
                      swiper.navigation.update();
                    }
                  });
                }}
                className="relative slider-container"
              >
                {craneImages.map((crane) => (
                  <SwiperSlide key={crane.id}>
                    <div className="flip-card-container">
                      <div className="flip-card">
                        <div className="flip-card-front">
                          {imgErrors[`crane-${crane.id}`] ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <div className="w-16 h-16 flex items-center justify-center">
                                {craneSvgIcons[(crane.id % 3)]}
                              </div>
                            </div>
                          ) : (
                            <div className="relative w-full h-full overflow-hidden">
                              <Image
                                src={crane.image}
                                alt={crane.title}
                                fill
                                className="object-cover"
                                onError={() => handleImageError(`crane-${crane.id}`)}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <div className="absolute bottom-4 right-4">
                                <div className="crane-label">
                                  {crane.title}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flip-card-back">
                          <h3 className="text-xl font-bold mb-4 text-black">{crane.title}</h3>
                          <p className="text-gray-800">{crane.description}</p>
                          <button className="mt-4 bg-white hover:bg-gray-100 text-black font-bold py-2 px-6 rounded shadow transition-all duration-300">
                            Подробнее
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Custom navigation buttons */}
              <button 
                ref={prevRef} 
                className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 flex items-center justify-center focus:outline-none transition-all"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                ref={nextRef} 
                className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 flex items-center justify-center focus:outline-none transition-all"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            {/* Custom pagination */}
            <div className="swiper-pagination flex justify-center items-center py-2"></div>
          </div>

          {/* Partner logos - NEW IMPLEMENTATION */}
          <div className={`mt-16 mb-6 ${isVisible ? 'fade-in fade-in-delay-2' : 'opacity-0'}`}>
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-10 text-white section-heading">
              Наши партнеры
            </h3>
            
            <div className="logo-scroll">
              <div className="logo-scroll-track">
                {/* First set of logos */}
                {clientLogos.map((client) => (
                  <div key={client.id} className="logo-item">
                    <div className="logo-item-inner">
                      {imgErrors[`client-${client.id}`] ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-700 font-medium">{client.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={client.image}
                          alt={client.name}
                          fill
                          className="object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                          onError={() => handleImageError(`client-${client.id}`)}
                          sizes="(max-width: 640px) 120px, (max-width: 768px) 130px, 140px"
                        />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Second set of logos (duplicate for continuous scroll) */}
                {clientLogos.map((client) => (
                  <div key={`duplicate-${client.id}`} className="logo-item">
                    <div className="logo-item-inner">
                      {imgErrors[`client-${client.id}`] ? (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-700 font-medium">{client.name}</span>
                        </div>
                      ) : (
                        <Image
                          src={client.image}
                          alt={client.name}
                          fill
                          className="object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                          onError={() => handleImageError(`client-${client.id}`)}
                          sizes="(max-width: 640px) 120px, (max-width: 768px) 130px, 140px"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 