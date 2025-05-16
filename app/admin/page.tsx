'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabase } from '../providers/supabase-provider'

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

export default function AdminRootPage() {
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
		if (!isLoading) {
			if (user) {
				// If authenticated, redirect to dashboard
				router.push('/admin/dashboard')
			} else {
				// If not authenticated, redirect to login
				router.push('/admin/login')
			}
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

	// Show loading while checking
	return (
		<div className='flex h-screen items-center justify-center bg-gray-50'>
			<div className='text-center'>
				<div
					className='animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full'
					role='status'
					aria-label='loading'
				>
					<span className='sr-only'>Loading...</span>
				</div>
				<p className='mt-4 text-gray-600'>Перенаправление...</p>
			</div>
		</div>
	)
}
