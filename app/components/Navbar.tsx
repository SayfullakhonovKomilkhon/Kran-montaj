'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

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
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className={`w-full bg-gray-800 text-white text-sm transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-center justify-center md:justify-start mb-2 md:mb-0">
              <FaMapMarkerAlt className="mr-2" />
              <span>E5 Nirman Nagar E DCM Ajmer road Jaipur 302019</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <Link 
                href="tel:+919667522922" 
                className="flex items-center px-3 py-1 bg-yellow-500 text-black hover:bg-yellow-400 transition-colors duration-300 rounded-sm"
              >
                <FaPhone className="mr-2" />
                <span>+99899 827 91 59</span>
              </Link>
              
              <Link 
                href="mailto:biz@bigboymachines.com" 
                className="flex items-center px-3 py-1 bg-green-500 text-black hover:bg-green-400 transition-colors duration-300 rounded-sm"
              >
                <FaEnvelope className="mr-2" />
                <span>biz@bigboymachines.com</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navbar */}
      <nav 
        className={`w-full transition-all duration-300 ease-in-out 
                    ${scrolled ? 'bg-yellow-500 shadow-lg py-2' : 'bg-yellow-500 py-3'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/img/services/logo.svg"
                  alt="КРАН-МОНТАЖ Logo"
                  width={scrolled ? 110 : 130}
                  height={scrolled ? 25 : 30}
                  priority
                  className="transition-all duration-300 ease-in-out"
                />
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-2">
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
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-600 transition-colors duration-300"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div 
          id="mobile-menu"
          className={`md:hidden absolute bg-yellow-500 w-full shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform origin-top
                      ${isOpen ? 'max-h-screen opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/" active={pathname === "/"} onClick={() => setIsOpen(false)}>
              Главная
            </MobileNavLink>
            <MobileNavLink href="/services" active={pathname === "/services"} onClick={() => setIsOpen(false)}>
              Услуги
            </MobileNavLink>
            <MobileNavLink href="/catalog" active={pathname === "/catalog" || pathname.startsWith("/catalog/")} onClick={() => setIsOpen(false)}>
              Каталог
            </MobileNavLink>
            <MobileNavLink href="/contacts" active={pathname === "/contacts"} onClick={() => setIsOpen(false)}>
              Контакты
            </MobileNavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface CustomNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

// Desktop navigation link component
const NavLink = ({ href, active, children, onClick }: CustomNavLinkProps) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ease-in-out group rounded-md
                  ${active ? 'text-gray-800' : 'text-gray-800 hover:text-gray-600'}`}
    >
      {children}
      <span 
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gray-800 transition-all duration-300 ease-in-out group-hover:w-3/4
                    ${active ? 'w-3/4' : 'w-0'}`}
      />
    </Link>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ href, active, children, onClick }: CustomNavLinkProps) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300
                  ${active ? 'bg-yellow-600 text-white' : 'text-gray-800 hover:bg-yellow-600 hover:text-white'}`}
    >
      {children}
    </Link>
  );
}; 