'use client';

import { useState, useEffect } from 'react';
import { getServices } from '@/app/lib/data';

interface Service {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order: number;
}

interface DynamicServicesProps {
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  cardClassName?: string;
  imageClassName?: string;
}

export default function DynamicServices({
  className = '',
  titleClassName = 'text-xl font-bold mb-2',
  descriptionClassName = 'text-gray-600',
  cardClassName = 'bg-white rounded-lg shadow overflow-hidden',
  imageClassName = 'h-48 w-full object-cover',
}: DynamicServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${cardClassName} animate-pulse`}>
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className={className}>
        <p className="text-red-500">Error loading services. Please try again later.</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className={className}>
        <p className="text-gray-500">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className={cardClassName}>
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.title}
                className={imageClassName}
              />
            ) : (
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                <p className="text-gray-400">No image</p>
              </div>
            )}
            <div className="p-4">
              <h3 className={titleClassName}>{service.title}</h3>
              <p className={descriptionClassName}>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 