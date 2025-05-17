'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabase } from '../providers/supabase-provider'
import Link from 'next/link'
import { FiBox, FiFileText, FiList, FiPackage, FiPhone, FiSettings, FiLayout } from 'react-icons/fi'

interface ContentStats {
	services: number
	catalog: number
	generalContent: number
	contacts: number
}

interface AdminUserInfo {
	email: string
	full_name?: string
	last_login?: string
}

export default function AdminDashboard() {
	const { user, isLoading } = useSupabase()
	const router = useRouter()
	const [adminUser, setAdminUser] = useState<AdminUserInfo | null>(null)
	const [stats, setStats] = useState<ContentStats>({
		services: 0,
		catalog: 0,
		generalContent: 0,
		contacts: 0,
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!isLoading && !user) {
			router.push('/admin/login')
		}
	}, [user, isLoading, router])

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			try {
				// Fetch admin user details
				if (user) {
					const { data: userData, error: userError } = await supabase
						.from('users')
						.select('email, full_name, last_login')
						.eq('email', user.email)
						.single()

					if (!userError && userData) {
						setAdminUser(userData)
					}
				}

				// Count items in each content table
				const [servicesResponse, catalogResponse, generalResponse, contactsResponse] =
					await Promise.all([
						supabase.from('services').select('id', { count: 'exact', head: true }),
						supabase.from('catalog').select('id', { count: 'exact', head: true }),
						supabase.from('general_content').select('id', { count: 'exact', head: true }),
						supabase.from('contacts').select('id', { count: 'exact', head: true }),
					])

				setStats({
					services: servicesResponse.count || 0,
					catalog: catalogResponse.count || 0,
					generalContent: generalResponse.count || 0,
					contacts: contactsResponse.count || 0,
				})
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [user])

	const formatDateTime = (dateStr?: string) => {
		if (!dateStr) return 'Никогда'
		try {
			return format(new Date(dateStr), 'dd MMMM yyyy, HH:mm', { locale: ru })
		} catch (e) {
			return dateStr
		}
	}

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
	]

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
