'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from '../providers/supabase-provider';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ContentStats {
  services: number;
  catalog: number;
  generalContent: number;
  contacts: number;
}

interface AdminUserInfo {
  email: string;
  full_name?: string;
  last_login?: string;
}

export default function AdminDashboard() {
  const { user } = useSupabase();
  const [adminUser, setAdminUser] = useState<AdminUserInfo | null>(null);
  const [stats, setStats] = useState<ContentStats>({
    services: 0,
    catalog: 0,
    generalContent: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch admin user details
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, full_name, last_login')
            .eq('email', user.email)
            .single();
          
          if (!userError && userData) {
            setAdminUser(userData);
          }
        }

        // Count items in each content table
        const [servicesResponse, catalogResponse, generalResponse, contactsResponse] = await Promise.all([
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('catalog').select('id', { count: 'exact', head: true }),
          supabase.from('general_content').select('id', { count: 'exact', head: true }),
          supabase.from('contacts').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          services: servicesResponse.count || 0,
          catalog: catalogResponse.count || 0,
          generalContent: generalResponse.count || 0,
          contacts: contactsResponse.count || 0,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'Никогда';
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch (e) {
      return dateStr;
    }
  };

  const dashboardItems = [
    {
      title: 'Услуги',
      count: stats.services,
      link: '/admin/services',
      description: 'Управление услугами',
      color: 'bg-blue-500',
    },
    {
      title: 'Каталог',
      count: stats.catalog,
      link: '/admin/catalog',
      description: 'Редактирование каталога',
      color: 'bg-green-500',
    },
    {
      title: 'Контент',
      count: stats.generalContent,
      link: '/admin/general',
      description: 'Обновление текста и изображений',
      color: 'bg-purple-500',
    },
    {
      title: 'Контакты',
      count: stats.contacts,
      link: '/admin/contacts',
      description: 'Управление контактами',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Панель администратора</h1>
      
      <div className="mb-6">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold">
            Добро пожаловать, {adminUser?.full_name || adminUser?.email || user?.email}
          </h2>
          <p className="text-gray-600">Последний вход: {formatDateTime(adminUser?.last_login)}</p>
          <p className="text-gray-600 mt-2">Используйте эту панель для управления содержимым сайта.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Загрузка данных...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item) => (
            <Link
              href={item.link}
              key={item.title}
              className="block transition duration-200 transform hover:scale-105"
            >
              <div className="rounded-lg shadow-md overflow-hidden">
                <div className={`${item.color} h-2`}></div>
                <div className="p-5 bg-white">
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <div className="text-3xl font-bold mb-1">{item.count}</div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Последние обновления</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">Здесь будут отображаться недавние изменения содержимого.</p>
        </div>
      </div>
    </div>
  );
} 