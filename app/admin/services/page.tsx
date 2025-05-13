'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface Service {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order: number;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    order: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  }

  function openModal(service: Service | null = null) {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        image_url: service.image_url,
        order: service.order,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        order: services.length > 0 ? Math.max(...services.map(s => s.order)) + 1 : 1,
      });
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingService(null);
    setError(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    });
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
      const filePath = `services/${fileName}`;

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

    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([formData]);

        if (error) throw error;
      }

      // Refresh services list
      await fetchServices();
      closeModal();
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh services list
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service');
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Services Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => openModal()}
        >
          <FiPlus className="mr-2" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Loading services...</div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">No services found. Add your first service to get started.</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            onClick={() => openModal()}
          >
            <FiPlus className="mr-2" /> Add Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{service.title}</h2>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <p className="text-sm text-gray-500">Order: {service.order}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                        onClick={() => openModal(service)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        onClick={() => handleDelete(service.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding/editing services */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
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
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="mb-4">
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
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
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
                    {editingService ? 'Update' : 'Create'}
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