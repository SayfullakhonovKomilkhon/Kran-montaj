'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import { supabase } from '@/app/lib/supabase';
import { FiEdit2, FiSave, FiUpload } from 'react-icons/fi';

interface ContentItem {
  id: number;
  key: string;
  section: string;
  title?: string;
  text?: string;
  image_url?: string;
}

export default function GeneralContentManagement() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSupabase();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ContentItem>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchContent();
  }, [selectedSection]);

  async function fetchContent() {
    setLoading(true);
    try {
      let query = supabase.from('general_content').select('*');

      if (selectedSection !== 'all') {
        query = query.eq('section', selectedSection);
      }

      const { data, error } = await query;

      if (error) throw error;

      setContent(data || []);

      // Extract unique sections
      if (data) {
        const uniqueSections = Array.from(new Set(data.map(item => item.section)));
        setSections(uniqueSections);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item: ContentItem) {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      text: item.text,
      image_url: item.image_url,
    });
    setError(null);
    setSuccess(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setFormData({});
    setError(null);
    setSuccess(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, item: ContentItem) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `general/${item.section}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);

      setFormData({
        ...formData,
        image_url: data.publicUrl,
      });

      // Automatically save after uploading
      const { error } = await supabase
        .from('general_content')
        .update({ image_url: data.publicUrl })
        .eq('id', item.id);

      if (error) throw error;

      // Update local content
      const updatedContent = content.map(c =>
        c.id === item.id ? { ...c, image_url: data.publicUrl } : c
      );
      setContent(updatedContent);

      setSuccess('Image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }

  async function saveChanges(item: ContentItem) {
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('general_content')
        .update(formData)
        .eq('id', item.id);

      if (error) throw error;

      // Update local content
      const updatedContent = content.map(c =>
        c.id === item.id ? { ...c, ...formData } : c
      );
      setContent(updatedContent);

      setSuccess('Content updated successfully');
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content');
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">General Content Management</h1>
      </div>

      <div className="mb-6">
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full md:w-auto p-2 border rounded"
        >
          <option value="all">All Sections</option>
          {sections.map((section) => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Loading content...</div>
        </div>
      ) : content.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No content found in the selected section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {content.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg font-bold">{item.key}</h2>
                <p className="text-sm text-gray-500">Section: {item.section}</p>
              </div>
              <div className="p-6">
                {editingId === item.id ? (
                  <form className="space-y-4">
                    {(item.title !== undefined) && (
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`title-${item.id}`}>
                          Title
                        </label>
                        <input
                          id={`title-${item.id}`}
                          name="title"
                          type="text"
                          value={formData.title || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}

                    {(item.text !== undefined) && (
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`text-${item.id}`}>
                          Text
                        </label>
                        <textarea
                          id={`text-${item.id}`}
                          name="text"
                          value={formData.text || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded"
                          rows={4}
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveChanges(item)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                      >
                        <FiSave className="mr-2" /> Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {item.title && (
                      <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-700 mb-1">Title:</h3>
                        <p>{item.title}</p>
                      </div>
                    )}

                    {item.text && (
                      <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-700 mb-1">Text:</h3>
                        <p className="whitespace-pre-wrap">{item.text}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-end">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                        onClick={() => startEditing(item)}
                      >
                        <FiEdit2 className="mr-2" /> Edit Content
                      </button>
                    </div>
                  </div>
                )}

                {/* Image section - always shown */}
                {item.image_url !== undefined && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Image:</h3>
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                      <div className="w-full md:w-1/3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.key}
                            className="w-full h-auto max-h-64 object-contain border rounded"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 border rounded flex items-center justify-center">
                            <p className="text-gray-500">No image</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={`image-${item.id}`}
                          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 border cursor-pointer inline-flex items-center"
                        >
                          <FiUpload className="mr-2" />
                          {isUploading ? 'Uploading...' : 'Upload New Image'}
                          <input
                            id={`image-${item.id}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, item)}
                            accept="image/*"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
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