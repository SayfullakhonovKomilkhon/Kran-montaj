'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSupabase } from '../providers/supabase-provider'
import Link from 'next/link'
import { FiBox, FiFileText, FiList, FiPackage, FiPhone, FiSettings, FiLayout, FiVideo } from 'react-icons/fi'

export default function AdminDashboard() {
	const { user, isLoading } = useSupabase()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !user) {
			router.push('/admin/login')
		}
	}, [user, isLoading, router])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Проверка авторизации...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	const adminLinks = [
		{
			title: 'Категории',
			description: 'Управление категориями для услуг и продуктов',
			icon: <FiList className="h-8 w-8 text-blue-500" />,
			href: '/admin/categories',
		},
		{
			title: 'Услуги',
			description: 'Добавление и редактирование услуг компании',
			icon: <FiSettings className="h-8 w-8 text-blue-500" />,
			href: '/admin/services',
		},
		{
			title: 'Продукты',
			description: 'Управление продуктами компании с возможностью загрузки изображений',
			icon: <FiPackage className="h-8 w-8 text-blue-500" />,
			href: '/admin/products',
		},
		{
			title: 'Каталог',
			description: 'Управление элементами каталога с детальными характеристиками',
			icon: <FiBox className="h-8 w-8 text-blue-500" />,
			href: '/admin/catalog',
		},
		{
			title: 'Контент страниц',
			description: 'Редактирование заголовков и содержимого разделов страниц',
			icon: <FiLayout className="h-8 w-8 text-blue-500" />,
			href: '/admin/page-content',
		},
		{
			title: 'Общий контент',
			description: 'Управление общим контентом сайта',
			icon: <FiFileText className="h-8 w-8 text-blue-500" />,
			href: '/admin/general',
		},
		{
			title: 'Контакты',
			description: 'Редактирование контактной информации',
			icon: <FiPhone className="h-8 w-8 text-blue-500" />,
			href: '/admin/contacts',
		},
		{
			title: 'Видео',
			description: 'Управление видео для страницы "Наши работы"',
			icon: <FiVideo className="h-8 w-8 text-amber-500" />,
			href: '/admin/videos',
		},
	]

	return (
		<div className="container mx-auto px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Панель управления</h1>
				<p className="text-gray-600">
					Добро пожаловать в административную панель сайта. Выберите раздел для управления.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{adminLinks.map((link) => (
					<Link 
						key={link.href} 
						href={link.href}
						className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
					>
						<div className="mb-4">{link.icon}</div>
						<h2 className="text-xl font-semibold mb-2">{link.title}</h2>
						<p className="text-gray-600">{link.description}</p>
					</Link>
				))}
			</div>
		</div>
	)
}
