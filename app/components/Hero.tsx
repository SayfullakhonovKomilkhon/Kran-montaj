'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 mt-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-900 opacity-75"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          КРАН-МОНТАЖ
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-gray-300">
          15 лет опыта в разработке грузоподъемного оборудования
        </p>
        <div className="mt-10">
          <Link
            href="/services"
            className="inline-block bg-blue-600 py-3 px-8 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-700"
          >
            Наши услуги
          </Link>
          <Link
            href="/contacts"
            className="inline-block ml-4 bg-white py-3 px-8 border border-transparent rounded-md text-base font-medium text-blue-600 hover:bg-gray-100"
          >
            Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  );
} 