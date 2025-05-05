'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  active: boolean;
  children: ReactNode;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                <Image
                  src="/img/services/logo.svg"
                  alt="КРАН-МОНТАЖ Logo"
                  width={130}
                  height={30}
                  priority
                  className={`transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}
                />
              </Link>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavLink href="/" active={pathname === "/"}>
              Главная
            </NavLink>
            <NavLink href="/services" active={pathname === "/services"}>
              Услуги
            </NavLink>
            <NavLink href="/catalog" active={pathname === "/catalog" || pathname.startsWith("/catalog/")}>
              Каталог
            </NavLink>
            <NavLink href="/contacts" active={pathname === "/contacts"}>
              Контакты
            </NavLink>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 focus:outline-none transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`md:hidden absolute bg-white w-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" active={pathname === "/"}>
            Главная
          </MobileNavLink>
          <MobileNavLink href="/services" active={pathname === "/services"}>
            Услуги
          </MobileNavLink>
          <MobileNavLink href="/catalog" active={pathname === "/catalog" || pathname.startsWith("/catalog/")}>
            Каталог
          </MobileNavLink>
          <MobileNavLink href="/contacts" active={pathname === "/contacts"}>
            Контакты
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

// Desktop navigation link component with animations
const NavLink = ({ href, active, children }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className={`relative px-4 py-2 mx-1 text-sm font-medium transition-all duration-300 ease-in-out group ${
        active 
          ? 'text-orange-500' 
          : 'text-gray-700 hover:text-orange-500'
      }`}
    >
      <span className="relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-105">
        {children}
      </span>
      <span 
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 ease-in-out ${
          active 
            ? 'w-full' 
            : 'w-0 group-hover:w-full'
        }`}
        style={{
          transformOrigin: 'left'
        }}
      />
    </Link>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ href, active, children }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 relative overflow-hidden ${
        active 
          ? 'text-orange-500' 
          : 'text-gray-700 hover:text-orange-500'
      }`}
    >
      <span className="relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-105">
        {children}
      </span>
      <span 
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300 ease-in-out ${
          active 
            ? 'w-full' 
            : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}; 