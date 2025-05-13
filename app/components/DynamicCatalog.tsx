'use client';

import { useState, useEffect } from 'react';
import { getCatalogItems, getCatalogCategories } from '@/app/lib/data';

interface CatalogItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  specifications: { [key: string]: string };
  price?: string;
}

interface DynamicCatalogProps {
  className?: string;
  initialCategory?: string;
  showFilters?: boolean;
  maxItems?: number;
  itemClassName?: string;
  imageClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function DynamicCatalog({
  className = '',
  initialCategory = '',
  showFilters = true,
  maxItems = 0,
  itemClassName = 'bg-white rounded-lg shadow overflow-hidden',
  imageClassName = 'h-48 w-full object-cover',
  titleClassName = 'text-xl font-bold mb-2',
  descriptionClassName = 'text-gray-600 text-sm',
}: DynamicCatalogProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [itemsData, categoriesData] = await Promise.all([
          getCatalogItems(),
          getCatalogCategories()
        ]);
        
        setItems(itemsData);
        setCategories(categoriesData);
        
        // Apply initial filtering
        if (initialCategory && initialCategory !== 'all') {
          setFilteredItems(itemsData.filter(item => item.category === initialCategory));
        } else {
          setFilteredItems(itemsData);
        }
      } catch (err) {
        console.error('Error loading catalog:', err);
        setError('Failed to load catalog');
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [initialCategory]);

  // Filter items when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    } else {
      setFilteredItems(items);
    }
  }, [selectedCategory, items]);

  // Limit items if maxItems is specified
  const displayItems = maxItems > 0 ? filteredItems.slice(0, maxItems) : filteredItems;

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${itemClassName} animate-pulse`}>
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
        <p className="text-red-500">Error loading catalog. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showFilters && categories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === '' || selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {displayItems.length === 0 ? (
        <p className="text-gray-500">No items available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div key={item.id} className={itemClassName}>
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className={imageClassName}
                />
              ) : (
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <p className="text-gray-400">No image</p>
                </div>
              )}
              <div className="p-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full mb-2">
                  {item.category}
                </span>
                <h3 className={titleClassName}>{item.title}</h3>
                <p className={descriptionClassName}>{item.description}</p>
                
                {item.price && (
                  <p className="mt-2 text-sm font-medium">Price: {item.price}</p>
                )}
                
                {Object.keys(item.specifications || {}).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-semibold mb-1">Specifications:</h4>
                    <div className="text-xs text-gray-600">
                      {Object.entries(item.specifications).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex mb-1">
                          <span className="font-medium mr-1">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                      {Object.keys(item.specifications).length > 3 && (
                        <p className="text-xs text-blue-500 cursor-pointer">
                          + {Object.keys(item.specifications).length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 