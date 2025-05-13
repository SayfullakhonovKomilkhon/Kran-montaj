'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

interface CatalogItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  specifications: { [key: string]: string };
  price?: string;
}

export default function CatalogManagement() {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [formData, setFormData] = useState<Omit<CatalogItem, 'id'>>({
    title: '',
    description: '',
    image_url: '',
    category: '',
    specifications: {},
    price: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  useEffect(() => {
    fetchCatalogItems();
  }, []);

  async function fetchCatalogItems() {
    setLoading(true);
    try {
      let query = supabase.from('catalog').select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      setCatalogItems(data || []);
      
      // Extract unique categories
      if (data) {
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      setError('Failed to load catalog items');
    } finally {
      setLoading(false);
    }
  }

  function openModal(item: CatalogItem | null = null) {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        category: item.category,
        specifications: item.specifications || {},
        price: item.price || '',
      });
      
      // Convert specifications object to array of key-value pairs for form
      const specPairs = Object.entries(item.specifications || {}).map(([key, value]) => ({ key, value }));
      setSpecs(specPairs.length > 0 ? specPairs : [{ key: '', value: '' }]);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '',
        specifications: {},
        price: '',
      });
      setSpecs([{ key: '', value: '' }]);
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
    setError(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    if (specs.length > 1) {
      const newSpecs = [...specs];
      newSpecs.splice(index, 1);
      setSpecs(newSpecs);
    }
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setFormData({
        ...formData,
        image_url: data.publicUrl,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Convert specs array to object
    const specificationsObject = specs.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as { [key: string]: string });

    const submitData = {
      ...formData,
      specifications: specificationsObject,
    };

    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('catalog')
          .update(submitData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('catalog')
          .insert([submitData]);

        if (error) throw error;
      }

      // Refresh catalog list
      await fetchCatalogItems();
      closeModal();
    } catch (error) {
      console.error('Error saving catalog item:', error);
      setError('Failed to save catalog item');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this catalog item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('catalog')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh catalog list
      await fetchCatalogItems();
    } catch (error) {
      console.error('Error deleting catalog item:', error);
      setError('Failed to delete catalog item');
    }
  }

  const handleSearch = () => {
    fetchCatalogItems();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    fetchCatalogItems();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Catalog Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => openModal()}
        >
          <FiPlus className="mr-2" /> Add Item
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="md:flex space-y-4 md:space-y-0 space-x-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search catalog items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="md:w-1/4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSearch}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Loading catalog items...</div>
        </div>
      ) : catalogItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">No catalog items found. Add your first item to get started.</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            onClick={() => openModal()}
          >
            <FiPlus className="mr-2" /> Add Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                    {item.price && (
                      <p className="text-sm font-medium text-gray-800 mb-2">Price: {item.price}</p>
                    )}
                    <p className="text-gray-600 mb-2 text-sm line-clamp-3">{item.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                      onClick={() => openModal(item)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                {Object.keys(item.specifications || {}).length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h3 className="text-sm font-semibold mb-1">Specifications:</h3>
                    <div className="text-xs text-gray-600">
                      {Object.entries(item.specifications).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex mb-1">
                          <span className="font-medium mr-1">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                      {Object.keys(item.specifications).length > 3 && (
                        <p className="text-xs text-blue-500">+ {Object.keys(item.specifications).length - 3} more</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding/editing catalog items */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl my-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingItem ? 'Edit Catalog Item' : 'Add New Catalog Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price (optional)
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageUpload}
                      className="border p-2 w-full rounded"
                      accept="image/*"
                    />
                  </div>
                  {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 text-sm font-bold">
                      Specifications
                    </label>
                    <button
                      type="button"
                      onClick={addSpecField}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      + Add Specification
                    </button>
                  </div>
                  
                  {specs.map((spec, index) => (
                    <div key={index} className="flex mb-2 space-x-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                      {specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isUploading}
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 