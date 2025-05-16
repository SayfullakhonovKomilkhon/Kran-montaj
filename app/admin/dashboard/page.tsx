'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/providers/supabase-provider';
import {
  FiHome, FiFileText, FiImage, FiList, FiLogOut,
  FiSave, FiUpload, FiPlus, FiTrash2, FiEdit
} from 'react-icons/fi';
import { supabase } from '@/app/lib/supabase';

// Define types for our data
interface ContentSection {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Image {
  id: string;
  url: string;
  description: string;
  filename: string;
  created_at: string;
}

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Main dashboard interface with tabs
export default function AdminDashboard() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useSupabase();
  const [activeTab, setActiveTab] = useState('content');
  const [isLoading, setIsLoading] = useState(true);

  // Session guard - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/admin/login');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <FiLogOut className="mr-2" />
            Выйти
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="bg-white shadow mb-6 rounded-lg overflow-hidden">
          <nav className="flex border-b">
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('content')}
            >
              <FiFileText className="mr-2" />
              Тексты и содержимое
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('images')}
            >
              <FiImage className="mr-2" />
              Изображения
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${
                activeTab === 'catalog' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('catalog')}
            >
              <FiList className="mr-2" />
              Каталог
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'content' && <ContentEditor />}
          {activeTab === 'images' && <ImageUploader />}
          {activeTab === 'catalog' && <CatalogManager />}
        </div>
      </main>
    </div>
  );
}

// Component for editing website text content
function ContentEditor() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('content_sections').select('*');

      if (error) throw error;

      if (data) {
        setSections(data as ContentSection[]);
      }
    } catch (error) {
      console.error('Error fetching content sections:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEditSection = (section: ContentSection) => {
    setCurrentSection(section);
    setFormData({
      title: section.title,
      content: section.content,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSection) return;

    try {
      const { error } = await supabase
        .from('content_sections')
        .update({
          title: formData.title,
          content: formData.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentSection.id);

      if (error) throw error;

      // Refresh the sections list
      fetchSections();

      // Clear form
      setCurrentSection(null);
      setFormData({ title: '', content: '' });

      alert('Раздел успешно обновлен!');
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Ошибка при обновлении раздела');
    }
  };

  const handleAddNewSection = () => {
    setCurrentSection(null);
    setFormData({ title: '', content: '' });
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('content_sections')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      // Refresh the sections list
      fetchSections();

      // Clear form
      setFormData({ title: '', content: '' });

      alert('Новый раздел успешно создан!');
    } catch (error) {
      console.error('Error creating section:', error);
      alert('Ошибка при создании раздела');
    }
  };

  if (loading) {
    return <div>Загрузка разделов...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Управление контентом сайта</h2>
        <button
          onClick={handleAddNewSection}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          <FiPlus className="mr-2" />
          Новый раздел
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Разделы сайта</h3>
          {sections.length === 0 ? (
            <p className="text-sm text-gray-500">Нет доступных разделов</p>
          ) : (
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id} className="border-b border-gray-200 pb-2">
                  <button
                    onClick={() => handleEditSection(section)}
                    className="w-full text-left flex items-center justify-between hover:text-blue-600"
                  >
                    <span>{section.title}</span>
                    <FiEdit className="text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-4">
            {currentSection ? `Редактирование: ${currentSection.title}` : 'Создать новый раздел'}
          </h3>

          <form onSubmit={currentSection ? handleSaveSection : handleCreateSection}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Содержимое
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <FiSave className="mr-2" />
                {currentSection ? 'Сохранить изменения' : 'Создать раздел'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Component for uploading and managing images
function ImageUploader() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setImages(data as Image[]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Пожалуйста, выберите файл');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const filename = `${Date.now()}-${imageFile.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filename, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('images')
        .getPublicUrl(filename);

      const publicUrl = urlData.publicUrl;

      // Save image metadata to database
      const { error: dbError } = await supabase
        .from('images')
        .insert([
          {
            url: publicUrl,
            description: imageDescription,
            filename,
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) throw dbError;

      // Reset form and refresh image list
      setImageFile(null);
      setImageDescription('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      fetchImages();

      alert('Изображение успешно загружено!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: Image) => {
    if (!confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }

    try {
      setLoading(true);

      // Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([image.filename]);

      if (storageError) throw storageError;

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      // Refresh image list
      fetchImages();

      alert('Изображение успешно удалено!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Ошибка при удалении изображения');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !uploading) {
    return <div>Загрузка изображений...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Управление изображениями</h2>

      {/* Upload Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="font-medium text-gray-700 mb-4">Загрузить новое изображение</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Файл изображения
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <input
              type="text"
              id="description"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Опишите изображение (не обязательно)"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiUpload className="mr-2" />
              {uploading ? 'Загрузка...' : 'Загрузить изображение'}
            </button>
          </div>
        </form>
      </div>

      {/* Images Gallery */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Галерея изображений</h3>

        {images.length === 0 ? (
          <p className="text-gray-500">Нет загруженных изображений</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.description || 'Uploaded image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {image.description || 'Без описания'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {new Date(image.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Component for managing catalog items
function CatalogManager() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState<CatalogItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data) {
        setItems(data as CatalogItem[]);
      }
    } catch (error) {
      console.error('Error fetching catalog items:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditItem = (item: CatalogItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price || '',
      image_url: item.image_url || '',
    });
  };

  const handleAddNewItem = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentItem) {
        // Update existing item
        const { error } = await supabase
          .from('catalog_items')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            image_url: formData.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentItem.id);

        if (error) throw error;

        alert('Товар успешно обновлен!');
      } else {
        // Create new item
        const { error } = await supabase
          .from('catalog_items')
          .insert([
            {
              name: formData.name,
              description: formData.description,
              price: formData.price,
              image_url: formData.image_url,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (error) throw error;

        alert('Новый товар успешно создан!');
      }

      // Refresh items and clear form
      fetchItems();
      setCurrentItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
      });
    } catch (error) {
      console.error('Error saving catalog item:', error);
      alert('Ошибка при сохранении товара');
    }
  };

  const handleDeleteItem = async (item: CatalogItem) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('catalog_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      fetchItems();

      if (currentItem && currentItem.id === item.id) {
        setCurrentItem(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          image_url: '',
        });
      }

      alert('Товар успешно удален!');
    } catch (error) {
      console.error('Error deleting catalog item:', error);
      alert('Ошибка при удалении товара');
    }
  };

  if (loading) {
    return <div>Загрузка каталога...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Управление каталогом товаров</h2>
        <button
          onClick={handleAddNewItem}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          <FiPlus className="mr-2" />
          Добавить товар
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Список товаров</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Каталог пуст</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="border-b border-gray-200 pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-left hover:text-blue-600 flex-grow"
                    >
                      <span>{item.name}</span>
                      {item.price && (
                        <span className="text-sm text-gray-500 ml-2">{item.price}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-4">
            {currentItem ? `Редактирование: ${currentItem.name}` : 'Новый товар'}
          </h3>

          <form onSubmit={handleSaveItem} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Название товара
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Цена
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="например: 1200₽"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL изображения
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <FiSave className="mr-2" />
                {currentItem ? 'Сохранить изменения' : 'Создать товар'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}