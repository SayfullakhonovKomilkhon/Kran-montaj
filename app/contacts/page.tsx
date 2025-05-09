'use client';

import { Suspense } from 'react';
import ContactSection from '../components/ContactSection';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5"></div>
        <p className="text-gray-700 font-medium text-lg">Загрузка контактов...</p>
      </div>
    </div>
  );
}

// Main content component
function ContactContent() {
  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen">
      {/* Enhanced header with improved design elements */}
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
              <span className="inline-block border-b-2 border-amber-400 pb-2">Связаться с нами</span>
            </h1>
            <p className="mt-7 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
              Оставьте заявку и наши специалисты свяжутся с вами в ближайшее время для обсуждения вашего проекта
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative">
        <div className="absolute -left-64 top-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-64 bottom-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContactContent />
    </Suspense>
  );
} 