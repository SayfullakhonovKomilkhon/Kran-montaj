'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#dce4fc] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Left Column - Logo, Navigation, Hours, Social */}
          <div className="space-y-6 md:pr-8">
            {/* Logo */}
            <div className="mb-6">
              <Link href="/">
                <Image 
                  src="/img/services/logo.svg" 
                  alt="Kran Montaj Servis" 
                  width={120} 
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            
            {/* Navigation */}
            <div className="text-gray-700">
              <nav className="flex flex-wrap gap-x-4">
                <Link href="/" className="hover:text-orange-500 transition-colors">Главная</Link>
                <Link href="/blog" className="hover:text-orange-500 transition-colors">Услуги</Link>
                <Link href="/pricing" className="hover:text-orange-500 transition-colors">Каталог</Link>
                <Link href="/about" className="hover:text-orange-500 transition-colors">Контакты</Link>
              </nav>
            </div>
            
            {/* Working Hours */}
            <div className="text-gray-700">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                (Пн–Сб) с 9:00 до 18:00
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10 text-orange-500 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10 text-orange-500 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" />
                </svg>
              </a>
              <a href="#" className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10 text-orange-500 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10 text-orange-500 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Center Column - Contact Info */}
          <div className="pt-6 md:pt-0 md:px-8 space-y-6">
            <h3 className="font-medium text-gray-900 text-lg mb-4">Контактная информация</h3>
            
            {/* Address */}
            <div className="flex items-start space-x-3">
              <div className="bg-white rounded-full p-2 flex items-center justify-center flex-shrink-0 w-10 h-10 text-orange-500 shadow-sm">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700">21 Revolution Street</p>
                <p className="text-gray-700">Paris, France</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2 flex items-center justify-center flex-shrink-0 w-10 h-10 text-orange-500 shadow-sm">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <p className="text-gray-700">+1 555 123456</p>
            </div>
            
            {/* Email */}
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2 flex items-center justify-center flex-shrink-0 w-10 h-10 text-orange-500 shadow-sm">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <a href="mailto:support@company.com" className="text-gray-700 hover:text-orange-500 transition-colors">support@company.com</a>
            </div>
          </div>
          
          {/* Right Column - Map */}
          <div className="pt-6 md:pt-0 md:pl-8">
            <h3 className="font-medium text-gray-900 text-lg mb-4">Наше расположение</h3>
            <div className="w-full md:w-[300px] h-48 rounded-lg overflow-hidden bg-white shadow-md">
              {/* Placeholder for Yandex map */}
              <iframe 
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A123456&amp;source=constructor" 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Map"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* Copyright & Policy Links */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            <Image 
              src="/logo.svg" 
              alt="Kran Montaj Servis" 
              width={80} 
              height={30}
              className="h-6 w-auto"
            />
          </div>
          
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} Kran Montaj Servis. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 