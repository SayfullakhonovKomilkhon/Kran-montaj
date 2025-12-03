'use client';

import Image from 'next/image';
import Link from 'next/link';

// Статические данные услуг
const services = [
  {
    id: 1,
    title: 'Изготовление мостовых (однобалочных, двухбалочных, опорных, подвесных)',
    image: '/img/services/services-card1.png',
  },
  {
    id: 2,
    title: 'Изготовление козловых кранов',
    image: '/img/services/services-card2.png',
  },
  {
    id: 3,
    title: 'Изготовление мостовых (однобалочных, двухбалочных, опорных, подвесных)',
    image: '/img/services/services-card3.png',
  },
  {
    id: 4,
    title: 'Поставка электротельферов, троллейных, кабельных соединений, ручных талей, различных запасных частей к электротельферам и крановому оборудованию',
    image: '/img/services/services-card4.png',
  },
  {
    id: 5,
    title: 'Ремонт, монтаж и демонтаж мостовых (однобалочных, двухбалочных, опорных, подвесных) козловых кранов',
    image: '/img/services/services-card5.png',
  },
  {
    id: 6,
    title: 'Техническое и сервисное обслуживание мостовых, козловых кранов',
    image: '/img/services/services-card6.png',
  },
];

export default function ServiceSection() {
  return (
    <div className="py-16 sm:py-20 bg-[#E8EEF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay={100 + (index * 100)}
            >
              {/* Circular image with number */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
                {/* Blue circle background */}
                <div className="absolute inset-0 bg-[#4A7AB0] rounded-full flex items-center justify-center overflow-hidden">
                  {/* Large number in background */}
                  <span className="absolute text-[120px] sm:text-[140px] font-bold text-[#5A8AC0] opacity-60 select-none leading-none">
                    {service.id}
                  </span>
                  {/* Crane image */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={160}
                      height={160}
                      className="object-contain drop-shadow-lg"
                      style={{ maxWidth: '85%', maxHeight: '85%' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Service title */}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xs">
                {service.title}
              </p>
            </div>
          ))}
        </div>

        {/* View All Button */}
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
