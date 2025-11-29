'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';

// Define service and category types
interface Service {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5"></div>
        <p className="text-gray-700 font-medium text-lg">Загрузка услуг...</p>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Service image error handling
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  // Function to convert name to slug
  const getSlug = (name: string) => {
    return name.toLowerCase().replaceAll(' ', '-');
  };

  // Fetch category and its services from Supabase
  useEffect(() => {
    async function fetchCategoryAndServices() {
      try {
        setLoading(true);
        
        // First get all product categories to exclude them from services
        const { data: productCategories, error: productError } = await supabase
          .from('products_with_category')
          .select('category_id');
        
        if (productError) {
          console.error('Error fetching product categories:', productError);
          throw productError;
        }
        
        // Extract the category_ids that belong to products
        const productCategoryIds = productCategories?.map(item => item.category_id) || [];
        
        // First fetch all categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
        
        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          throw categoriesError;
        }
        
        if (!categoriesData || categoriesData.length === 0) {
          throw new Error('No categories found');
        }

        // Filter to only include service categories
        const serviceCategories = categoriesData.filter(category => 
          !productCategoryIds.includes(category.id)
        );

        console.log('All categories:', categoriesData);
        console.log('Service categories:', serviceCategories);
        
        // Find the category that matches the slug (compare with slugified name)
        const currentCategory = serviceCategories.find(cat => {
          const categorySlug = cat.slug || getSlug(cat.name);
          return categorySlug === slug;
        });
        
        console.log('Current category slug:', slug);
        console.log('Matched category:', currentCategory);
        
        if (!currentCategory) {
          throw new Error('Category not found');
        }
        
        setCategory(currentCategory);
        
        // Then fetch services for this category by category_id
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('category_id', currentCategory.id);
        
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          throw servicesError;
        }
        
        console.log('Services for category:', servicesData);
        setServices(servicesData || []);
      } catch (err: unknown) {
        console.error('Error:', err);
        const error = err as { message?: string }
        setError(error.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchCategoryAndServices();
    }
  }, [slug]);

  // SVG icons as fallbacks
  const fallbackIcons = {
    service1: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z" />
      </svg>
    ),
    service2: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-slate-600">
        <path d="M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15" />
      </svg>
    ),
  };

  // Get the appropriate fallback icon for a service
  const getFallbackIcon = (index: number) => {
    const iconKeys = Object.keys(fallbackIcons);
    const iconKey = iconKeys[index % iconKeys.length] as keyof typeof fallbackIcons;
    return fallbackIcons[iconKey];
  };

  // If category not found, show error message
  if (!loading && (error === 'Category not found' || !category)) {
    return (
      <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-20 w-20 text-amber-500 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Категория не найдена</h2>
            <p className="text-gray-600 mb-6">Запрашиваемая категория услуг не существует.</p>
            <Link 
              href="/services" 
              className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Вернуться к услугам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen">
      {/* Header section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative">
          <div className="absolute w-24 h-24 bg-amber-100/80 rounded-full blur-2xl -left-10 top-20 opacity-60"></div>
          <div className="absolute w-40 h-40 bg-amber-100/80 rounded-full blur-2xl right-10 top-40 opacity-60"></div>
          
          <div className="text-center relative">
            <div className="inline-block mx-auto mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full"></div>
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 sm:text-5xl tracking-tight">
              <span className="inline-block border-b-2 border-amber-400 pb-2">
                {loading ? 'Загрузка...' : category?.name || 'Категория не найдена'}
              </span>
            </h1>
            {category?.description && (
              <p className="mt-7 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent"></div>
      </div>

      {/* Services content */}
      <div className="max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative">
        <div className="absolute -left-64 top-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-64 bottom-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl"></div>
        
        {loading ? (
          <LoadingFallback />
        ) : error && error !== 'Category not found' ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">В данной категории нет доступных услуг</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="group flex flex-col h-full relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-white"
                data-aos="fade-up"
                data-aos-delay={100 + (index * 100)}
                data-aos-duration="700"
              >
                {/* Card decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/30 via-amber-500 to-amber-400/30 z-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mb-12 -mr-12 z-0"></div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-amber-500/5 rounded-full -mt-8 -ml-8 z-0"></div>
                
                {/* Service image area */}
                <div className="relative w-full h-48 overflow-hidden">
                  {imgErrors[service.id] || !service.image_url ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9]">
                      {getFallbackIcon(index)}
                    </div>
                  ) : (
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                      onError={() => handleImageError(service.id)}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                
                {/* Service content area */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                    {service.name}
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 mb-4 transform transition-all duration-500 group-hover:w-20"></div>
                  <p className="text-gray-600 text-sm mb-5 flex-grow">
                    {service.description}
                  </p>
                  
                  {/* Button/link */}
                  <div className="mt-auto pt-4">
                    <Link 
                      href="/contacts" 
                      className="inline-flex items-center text-amber-600 font-medium text-sm group-hover:text-amber-700 transition-colors"
                    >
                      Подробнее
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Back to all services button */}
        <div className="mt-16 flex justify-center">
          <Link 
            href="/services" 
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Все услуги
          </Link>
        </div>
      </div>
    </div>
  );
} 