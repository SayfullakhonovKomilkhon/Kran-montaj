'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheck, FaUsers, FaClock, FaTools, FaAward, FaMedal, FaCertificate } from 'react-icons/fa';

export default function AboutPage() {
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

  // Image error handling
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  // Company data
  const companyData = {
    founded: 2008,
    experience: new Date().getFullYear() - 2008,
    projects: 500,
    clients: 250,
    employees: 80
  };
  
  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen">
      {/* Header section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2"></div>
        <div className="absolute left-1/4 top-1/3 w-32 h-32 bg-amber-100/50 rounded-full opacity-30 blur-xl"></div>
        
        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative">
          <div className="absolute w-24 h-24 bg-amber-100/80 rounded-full blur-2xl -left-10 top-20 opacity-60"></div>
          <div className="absolute w-40 h-40 bg-amber-100/80 rounded-full blur-2xl right-10 top-40 opacity-60"></div>
          
          <div className="text-center relative">
            <div className="inline-block mx-auto mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full"></div>
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 sm:text-5xl tracking-tight">
              <span className="inline-block border-b-2 border-amber-400 pb-2">О компании</span>
            </h1>
            <p className="mt-7 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
              КРАН-МОНТАЖ — ведущая компания в сфере изготовления и обслуживания грузоподъемного оборудования с {companyData.experience}-летним опытом работы
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative" ref={sectionRef}>
        <div className="absolute -left-64 top-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-64 bottom-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        
        <div className="space-y-20 relative z-10">
          {/* About us section */}
          <div className={`lg:grid lg:grid-cols-12 lg:gap-10 items-center ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'} transition-all duration-1000 ease-out`}>
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                О нас
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Кто мы
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Компания КРАН-МОНТАЖ основана в 2008 году и специализируется на производстве, монтаже и сервисном обслуживании кранового оборудования. За {companyData.experience} лет работы мы накопили богатый опыт и экспертизу в сфере грузоподъемного оборудования.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Наша команда состоит из высококвалифицированных специалистов, инженеров и технических экспертов, которые обеспечивают высокое качество всех выполняемых работ. Мы гордимся тем, что предоставляем полный спектр услуг: от проектирования и изготовления до установки и постгарантийного обслуживания грузоподъемного оборудования.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Компания КРАН-МОНТАЖ сегодня — это надежный партнер для предприятий различных отраслей промышленности, строительства и логистики.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-6">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                
                <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                  {imgErrors['about1'] ? (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                      <FaUsers className="w-24 h-24 text-slate-600" />
                    </div>
                  ) : (
                    <div className="relative w-full h-80">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                      <Image 
                        src="/img/services/0000259150_xzgmnpcd.jpg" 
                        alt="О компании КРАН-МОНТАЖ"
                        fill
                        className="object-cover rounded-lg p-0 transform duration-700 ease-out group-hover:scale-105"
                        onError={() => handleImageError('about1')}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats/counter section */}
          <div className={`${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'} transition-all duration-1000 ease-out delay-300`}>
            <div className="bg-white rounded-xl shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-amber-200/10"></div>
              <div className="absolute right-0 top-0 w-96 h-96 bg-amber-50/30 rounded-full opacity-40 blur-3xl -translate-y-1/2"></div>
              
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-12">
                <div className="text-center space-y-2">
                  <FaClock className="w-10 h-10 mx-auto text-amber-500" />
                  <p className="text-3xl font-bold text-gray-800">{companyData.experience}</p>
                  <p className="text-sm text-gray-600 font-medium">Лет опыта</p>
                </div>
                
                <div className="text-center space-y-2">
                  <FaTools className="w-10 h-10 mx-auto text-amber-500" />
                  <p className="text-3xl font-bold text-gray-800">{companyData.projects}+</p>
                  <p className="text-sm text-gray-600 font-medium">Завершенных проектов</p>
                </div>
                
                <div className="text-center space-y-2">
                  <FaUsers className="w-10 h-10 mx-auto text-amber-500" />
                  <p className="text-3xl font-bold text-gray-800">{companyData.clients}+</p>
                  <p className="text-sm text-gray-600 font-medium">Довольных клиентов</p>
                </div>
                
                <div className="text-center space-y-2">
                  <FaAward className="w-10 h-10 mx-auto text-amber-500" />
                  <p className="text-3xl font-bold text-gray-800">{companyData.employees}</p>
                  <p className="text-sm text-gray-600 font-medium">Специалистов</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission section */}
          <div className={`${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'} transition-all duration-1000 ease-out delay-500`}>
            <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center">
              <div className="lg:col-span-7 lg:order-2 space-y-6">
                <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500">
                  Миссия
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Наши ценности и приоритеты
                  <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2"></div>
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Наша миссия — обеспечивать клиентов надежным и эффективным грузоподъемным оборудованием, которое повышает безопасность и производительность их работы. Мы стремимся к постоянному совершенствованию и внедрению инновационных технологий.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 rounded-full bg-amber-100 p-1.5">
                      <FaCheck className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Качество</h3>
                      <p className="text-gray-600">Мы используем только высококачественные материалы и комплектующие, обеспечивая долговечность и надежность оборудования.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 rounded-full bg-amber-100 p-1.5">
                      <FaCheck className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Безопасность</h3>
                      <p className="text-gray-600">Безопасность оборудования — наш главный приоритет. Все наши изделия соответствуют самым строгим стандартам безопасности.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 rounded-full bg-amber-100 p-1.5">
                      <FaCheck className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Индивидуальный подход</h3>
                      <p className="text-gray-600">Мы учитываем все требования и особенности производства наших заказчиков, предлагая оптимальные решения.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 lg:mt-0 lg:col-span-5 lg:order-1">
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]"></div>
                  
                  <div className="relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]">
                    {imgErrors['about2'] ? (
                      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6">
                        <FaMedal className="w-24 h-24 text-slate-600" />
                      </div>
                    ) : (
                      <div className="relative w-full h-96">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30"></div>
                        <Image 
                          src="/img/services/IMG_9370.jpg" 
                          alt="Ценности и приоритеты КРАН-МОНТАЖ"
                          fill
                          className="object-cover rounded-lg p-0 transform duration-700 ease-out group-hover:scale-105"
                          onError={() => handleImageError('about2')}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advantages section */}
          <div className={`${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'} transition-all duration-1000 ease-out delay-700`}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500 mb-4">
                Преимущества
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Почему выбирают нас
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <FaCertificate className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Профессионализм</h3>
                  <p className="text-gray-600 text-center">
                    Наша команда состоит из опытных специалистов с многолетним стажем работы в области грузоподъемного оборудования.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <FaAward className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Комплексный подход</h3>
                  <p className="text-gray-600 text-center">
                    Мы предоставляем полный спектр услуг от проектирования и производства до монтажа и сервисного обслуживания.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <FaTools className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-3">Техническая поддержка</h3>
                  <p className="text-gray-600 text-center">
                    Мы обеспечиваем оперативное сервисное обслуживание и техническую поддержку на протяжении всего срока эксплуатации оборудования.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA section */}
          <div className={`${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'} transition-all duration-1000 ease-out delay-900`}>
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/40 blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/40 blur-3xl"></div>
              </div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Нужна консультация?
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto mb-8">
                  Свяжитесь с нами, чтобы получить подробную информацию о наших услугах и продукции. Наши специалисты готовы ответить на все ваши вопросы.
                </p>
                <Link 
                  href="/contacts" 
                  className="inline-flex items-center px-6 py-3 border border-white/80 bg-white text-amber-600 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    Связаться с нами
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 