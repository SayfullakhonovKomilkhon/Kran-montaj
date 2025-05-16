'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  name: string;
  slug?: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      try {
        // First get all product categories to exclude them from services
        const { data: productCategories, error: productError } = await supabase
          .from('products_with_category')
          .select('category_id');
        
        if (productError) {
          console.error('Error fetching product categories:', productError);
          return;
        }
        
        // Extract the category_ids that belong to products
        const productCategoryIds = productCategories?.map(item => item.category_id) || [];
        
        // Fetch all categories
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        
        // Filter out categories that belong to products
        const serviceCategories = data?.filter(category => 
          !productCategoryIds.includes(category.id)
        ) || [];
        
        setCategories(serviceCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Function to convert name to slug
  const getSlug = (name: string) => {
    return name.toLowerCase().replaceAll(' ', '-');
  };
  
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"></div>
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             backgroundSize: '60px 60px'
           }}>
      </div>
      
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-orange-400 rounded-full opacity-10 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-yellow-400 rounded-full opacity-10 translate-y-1/2"></div>
      
      {/* Main content */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Top section with logo and newsletter */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-16 pb-8 border-b border-orange-500/30">
              {/* Logo */}
              <div className="mb-8 lg:mb-0 transform transition-transform duration-500 hover:scale-105">
                <Link href="/" className="block">
                  <div className="h-14 w-auto bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                    <Image 
                      src="/img/services/logo.svg" 
                      alt="Kran Montaj Servis" 
                      width={160} 
                      height={50}
                      className="h-12 w-auto"
                    />
                  </div>
                </Link>
              </div>
              
              {/* Newsletter subscription */}
              <div className="w-full lg:w-auto">
                <h3 className="text-lg font-semibold mb-3 text-center lg:text-left text-white">Подпишитесь на нашу рассылку</h3>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0">
                  <input 
                    type="email" 
                    placeholder="Ваш email" 
                    className="px-4 py-3 bg-slate-700/70 border border-orange-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg font-medium text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 hover:from-orange-600 hover:to-yellow-600">
                    Подписаться
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              {/* Mobile view - Two columns side by side (Company and Services) */}
              <div className="flex flex-row md:hidden w-full">
                {/* Company column - mobile */}
                <div className="w-1/2 pr-2">
                  <h3 className="text-base font-bold mb-4 pb-1.5 border-b border-orange-500 inline-block text-white">Компания</h3>
                  <nav className="flex flex-col space-y-2.5">
                    <Link href="/" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                      <span className="text-orange-500 mr-1">›</span> Главная
                    </Link>
                    <Link href="/about" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                      <span className="text-orange-500 mr-1">›</span> О компании
                    </Link>
                    <Link href="/services" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                      <span className="text-orange-500 mr-1">›</span> Услуги
                    </Link>
                    <Link href="/projects" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                      <span className="text-orange-500 mr-1">›</span> Проекты
                    </Link>
                    <Link href="/contacts" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                      <span className="text-orange-500 mr-1">›</span> Контакты
                    </Link>
                  </nav>
                </div>
                
                {/* Services column - mobile */}
                <div className="w-1/2 pl-2">
                  <h3 className="text-base font-bold mb-4 pb-1.5 border-b border-orange-500 inline-block text-white">Услуги</h3>
                  <nav className="flex flex-col space-y-2.5">
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <Link 
                          key={index}
                          href={`/services/${category.slug || getSlug(category.name)}`} 
                          className="text-white hover:text-yellow-400 transition-all duration-300 transform hover:translate-x-2 flex items-center group text-sm"
                        >
                          <span className="text-orange-500 mr-1 transition-transform duration-300 group-hover:rotate-90">›</span> {category.name}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link href="/services/installation" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                          <span className="text-orange-500 mr-1">›</span> Монтаж кранов
                        </Link>
                        <Link href="/services/maintenance" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                          <span className="text-orange-500 mr-1">›</span> Техобслуживание
                        </Link>
                        <Link href="/services/repair" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                          <span className="text-orange-500 mr-1">›</span> Ремонт кранов
                        </Link>
                        <Link href="/services/certification" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                          <span className="text-orange-500 mr-1">›</span> Сертификация
                        </Link>
                        <Link href="/services/parts" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center text-sm">
                          <span className="text-orange-500 mr-1">›</span> Запчасти
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </div>
              
              {/* Desktop navigation - first column */}
              <div className="hidden md:block md:col-span-3">
                <h3 className="text-lg font-bold mb-6 pb-2 border-b border-orange-500 inline-block text-white">Компания</h3>
                <nav className="flex flex-col space-y-3">
                  <Link href="/" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                    <span className="text-orange-500 mr-1">›</span> Главная
                  </Link>
                  <Link href="/about" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                    <span className="text-orange-500 mr-1">›</span> О компании
                  </Link>
                  <Link href="/services" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                    <span className="text-orange-500 mr-1">›</span> Услуги
                  </Link>
                  <Link href="/projects" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                    <span className="text-orange-500 mr-1">›</span> Проекты
                  </Link>
                  <Link href="/contacts" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                    <span className="text-orange-500 mr-1">›</span> Контакты
                  </Link>
                </nav>
              </div>
              
              {/* Desktop services - second column */}
              <div className="hidden md:block md:col-span-3">
                <h3 className="text-lg font-bold mb-6 pb-2 border-b border-orange-500 inline-block text-white">Услуги</h3>
                <nav className="flex flex-col space-y-3">
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <Link 
                        key={index}
                        href={`/services/${category.slug || getSlug(category.name)}`} 
                        className="text-white hover:text-yellow-400 transition-all duration-300 transform hover:translate-x-2 flex items-center group"
                      >
                        <span className="text-orange-500 mr-1 transition-transform duration-300 group-hover:rotate-90">›</span> {category.name}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link href="/services/installation" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                        <span className="text-orange-500 mr-1">›</span> Монтаж кранов
                      </Link>
                      <Link href="/services/maintenance" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                        <span className="text-orange-500 mr-1">›</span> Техобслуживание
                      </Link>
                      <Link href="/services/repair" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                        <span className="text-orange-500 mr-1">›</span> Ремонт кранов
                      </Link>
                      <Link href="/services/certification" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                        <span className="text-orange-500 mr-1">›</span> Сертификация
                      </Link>
                      <Link href="/services/parts" className="text-white hover:text-yellow-400 transition-colors duration-300 transform hover:translate-x-1 flex items-center">
                        <span className="text-orange-500 mr-1">›</span> Запчасти
                      </Link>
                    </>
                  )}
                </nav>
              </div>
              
              {/* Contact info - third column */}
              <div className="md:col-span-3">
                <h3 className="text-lg font-bold mb-6 pb-2 border-b border-orange-500 inline-block text-white">Контакты</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white">21 Revolution Street</p>
                      <p className="text-white">Paris, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <a href="tel:+15551234567" className="text-white hover:text-yellow-400 transition-colors">+1 555 123456</a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <a href="mailto:support@company.com" className="text-white hover:text-yellow-400 transition-colors">support@company.com</a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <p className="text-white">(Пн–Сб) с 9:00 до 18:00</p>
                  </div>
                </div>
              </div>
              
              {/* Map - fourth column */}
              <div className="md:col-span-3">
                <h3 className="text-lg font-bold mb-6 pb-2 border-b border-orange-500 inline-block text-white">Наше расположение</h3>
                <div className="rounded-xl overflow-hidden shadow-xl shadow-orange-500/10 transform transition-transform duration-500 hover:scale-[1.02] border border-orange-500/20">
                  <iframe 
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456&amp;source=constructor" 
                    width="100%" 
                    height="200" 
                    frameBorder="0"
                    title="Map"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
            
            {/* Social media links */}
            <div className="mt-16 mb-8 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-6 text-center text-white">Подписывайтесь на нас</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-yellow-500 hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/20 border border-orange-500/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-yellow-500 hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/20 border border-orange-500/20">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-orange-500 hover:bg-gradient-to-br hover:from-orange-500 hover:to-yellow-500 hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/20 border border-orange-500/20">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center pt-8 mt-8 border-t border-orange-500/20">
              <p className="text-gray-400 text-sm">&copy; {currentYear} КРАН-МОНТАЖ. Все права защищены</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 