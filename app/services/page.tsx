'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Define service type based on the database structure
interface Service {
	id: string
	name: string
	description: string
	image_url: string | null
	category_id: string | null
}

interface Category {
	id: string
	name: string
	description: string | null
	slug?: string
}

// Loading fallback component
function LoadingFallback() {
	return (
		<div className='py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]'>
			<div className='text-center'>
				<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5'></div>
				<p className='text-gray-700 font-medium text-lg'>Загрузка услуг...</p>
			</div>
		</div>
	)
}

// Main services component
function ServicesContent() {
	const searchParams = useSearchParams()
	const categoryParam = searchParams.get('category')
	const router = useRouter()

	const [services, setServices] = useState<Service[]>([])
	const [filteredServices, setFilteredServices] = useState<Service[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam)

	// Service image error handling
	const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({})

	const handleImageError = (id: string) => {
		setImgErrors(prev => ({ ...prev, [id]: true }))
	}

	// Fetch services and categories from Supabase
	useEffect(() => {
		async function fetchServicesAndCategories() {
			try {
				setLoading(true)
				console.log('Fetching services from Supabase...')

				// Test Supabase connection first
				console.log('Testing Supabase connection...')
				const { data: testData, error: testError } = await supabase
					.from('services')
					.select('count')
					.limit(1)

				if (testError) {
					console.error('Supabase connection test error:', {
						code: testError.code,
						message: testError.message,
						details: testError.details,
						hint: testError.hint,
					})
				} else {
					console.log('Supabase connection successful, count:', testData)
				}

				// Fetch all categories
				const { data: categoriesData, error: categoriesError } = await supabase
					.from('categories')
					.select('*')

				if (categoriesError) {
					console.error('Supabase categories fetch error:', {
						code: categoriesError.code,
						message: categoriesError.message,
						details: categoriesError.details,
						hint: categoriesError.hint,
					})
					throw categoriesError
				}

				setCategories(categoriesData || [])
				console.log('Categories:', categoriesData)

				// Proceed with services fetch
				const { data, error } = await supabase.from('services').select('*')

				if (error) {
					console.error('Supabase error details:', {
						code: error.code,
						message: error.message,
						details: error.details,
						hint: error.hint,
					})
					throw error
				}

				console.log('Services data received:', data)
				setServices(data || [])

				// Set initial filtered services based on URL parameter
				if (categoryParam) {
					setFilteredServices((data || []).filter(service => service.category_id === categoryParam))
				} else {
					setFilteredServices(data || [])
				}
		} catch (err: unknown) {
			console.error('Error fetching services:', err)
			const error = err as { message?: string }
			if (error.message) {
				setError(`Не удалось загрузить услуги: ${error.message}`)
			} else {
				setError('Не удалось загрузить услуги')
			}
			} finally {
				setLoading(false)
			}
		}

		fetchServicesAndCategories()
	}, [])

	// Filter services when active category changes
	useEffect(() => {
		if (activeCategory) {
			setFilteredServices(services.filter(service => service.category_id === activeCategory))
		} else {
			setFilteredServices(services)
		}
	}, [activeCategory, services])

	// Handle category change
	const handleCategoryChange = (categoryId: string | null) => {
		setActiveCategory(categoryId)

		// Update URL without refreshing the page
		if (categoryId) {
			router.push(`/services?category=${categoryId}`, { scroll: false })
		} else {
			router.push('/services', { scroll: false })
		}
	}

	// Listen for changes in URL query parameters
	useEffect(() => {
		const categoryId = searchParams.get('category')

		// Only update if different from current active category
		if (categoryId !== activeCategory) {
			// Check if category exists in our categories
			if (categoryId && categories.some(cat => cat.id === categoryId)) {
				setActiveCategory(categoryId)
			} else if (!categoryId) {
				setActiveCategory(null)
			}
		}
	}, [searchParams, categories, activeCategory])

	// SVG icons as fallbacks instead of using external files
	const fallbackIcons = {
		service1: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z' />
			</svg>
		),
		service2: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15' />
			</svg>
		),
		service3: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M10.5421 20.0018C6.71886 18.8578 3.86002 15.3071 3.86002 11.11C3.86002 5.8287 8.1387 1.55002 13.42 1.55002C16.8137 1.55002 19.7913 3.37238 21.3657 6.10002M10.5421 20.0018L6.74198 17.2018M10.5421 20.0018L11.02 15.5018M13.42 5.77952C15.7537 5.77952 17.6405 7.66636 17.6405 10.0001C17.6405 12.3337 15.7537 14.2206 13.42 14.2206C11.0863 14.2206 9.19943 12.3337 9.19943 10.0001C9.19943 7.66636 11.0863 5.77952 13.42 5.77952Z' />
				<path d='M18.3594 17.0001C17.9742 17.0001 17.6605 17.3138 17.6605 17.699C17.6605 18.0841 17.9742 18.3978 18.3594 18.3978C18.7445 18.3978 19.0582 18.0841 19.0582 17.699C19.0582 17.3138 18.7445 17.0001 18.3594 17.0001Z' />
				<path d='M18.3594 22.4492C17.9742 22.4492 17.6605 22.7629 17.6605 23.1481C17.6605 23.5332 17.9742 23.8469 18.3594 23.8469C18.7445 23.8469 19.0582 23.5332 19.0582 23.1481C19.0582 22.7629 18.7445 22.4492 18.3594 22.4492Z' />
				<path d='M21.0989 19.7501C20.7138 19.7501 20.4001 20.0638 20.4001 20.449C20.4001 20.8341 20.7138 21.1478 21.0989 21.1478C21.4841 21.1478 21.7978 20.8341 21.7978 20.449C21.7978 20.0638 21.4841 19.7501 21.0989 19.7501Z' />
				<path d='M15.6198 19.7501C15.2346 19.7501 14.9209 20.0638 14.9209 20.449C14.9209 20.8341 15.2346 21.1478 15.6198 21.1478C16.0049 21.1478 16.3186 20.8341 16.3186 20.449C16.3186 20.0638 16.0049 19.7501 15.6198 19.7501Z' />
			</svg>
		),
		service4: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M11 14.9861C11 15.5384 11.4477 15.9861 12 15.9861C12.5523 15.9861 13 15.5384 13 14.9861C13 14.4338 12.5523 13.9861 12 13.9861C11.4477 13.9861 11 14.4338 11 14.9861Z' />
				<path d='M3 20.9998H21M6.5 17.9998H17.5M5.5 8.5V10.3598C5.19057 10.7348 5 11.1992 5 11.7032V14.0118C5 14.8283 5.5 15.9998 7 15.9998H17C18.5 15.9998 19 14.8283 19 14.0118V11.7032C19 11.1992 18.8094 10.7348 18.5 10.3598V8.5C18.5 4.91015 15.5899 2 12 2C8.41015 2 5.5 4.91015 5.5 8.5Z' />
			</svg>
		),
		service5: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='w-24 h-24 text-slate-600'
			>
				<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
			</svg>
		),
	}

	// Get the appropriate fallback icon for a service
	const getFallbackIcon = (index: number) => {
		const iconKeys = Object.keys(fallbackIcons)
		const iconKey = iconKeys[index % iconKeys.length] as keyof typeof fallbackIcons
		return fallbackIcons[iconKey]
	}

	return (
		<div className='bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen'>
			{/* Enhanced header with improved design elements */}
			<div className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70'></div>
				<div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
				<div className='absolute right-0 top-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2'></div>
				<div className='absolute left-0 bottom-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2'></div>
				<div className='absolute left-1/4 top-1/3 w-32 h-32 bg-amber-100/50 rounded-full opacity-30 blur-xl'></div>

				<div className='max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative'>
					<div className='absolute w-24 h-24 bg-amber-100/80 rounded-full blur-2xl -left-10 top-20 opacity-60'></div>
					<div className='absolute w-40 h-40 bg-amber-100/80 rounded-full blur-2xl right-10 top-40 opacity-60'></div>

					<div className='text-center relative'>
						<div className='inline-block mx-auto mb-4'>
							<div className='w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full'></div>
							<div className='w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full'></div>
						</div>
						<h1 className='text-3xl font-bold text-gray-800 sm:text-5xl tracking-tight'>
							<span className='inline-block border-b-2 border-amber-400 pb-2'>Наши услуги</span>
						</h1>
						<p className='mt-7 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed'>
							Полный спектр решений по изготовлению и обслуживанию грузоподъемного оборудования с
							гарантией качества и надежности
						</p>
					</div>
				</div>

				{/* Decorative elements */}
				<div className='absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80'></div>
				<div className='absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent'></div>
			</div>

			{/* Categories filter - using buttons with onClick instead of Links */}
			{categories.length > 0 && !loading && !error && (
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<div className='flex flex-wrap justify-center gap-4'>
						<button
							onClick={() => handleCategoryChange(null)}
							className={`px-4 py-2 rounded-md shadow-md transition-colors ${
								!activeCategory
									? 'bg-amber-500 text-white'
									: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
							}`}
						>
							Все услуги
						</button>

						{categories.map(category => (
							<button
								key={category.id}
								onClick={() => handleCategoryChange(category.id)}
								className={`px-4 py-2 rounded-md shadow-md transition-colors ${
									activeCategory === category.id
										? 'bg-amber-500 text-white'
										: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
								}`}
							>
								{category.name}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Services content */}
			<div className='max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative'>
				<div className='absolute -left-64 top-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl'></div>
				<div className='absolute -right-64 bottom-1/3 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl'></div>

				{loading ? (
					<LoadingFallback />
				) : error ? (
					<div className='text-center py-10'>
						<p className='text-red-500 text-lg'>{error}</p>
					</div>
				) : filteredServices.length === 0 ? (
					<div className='text-center py-20'>
						<p className='text-gray-500 text-xl'>
							{activeCategory ? 'В данной категории нет доступных услуг' : 'Нет доступных услуг'}
						</p>
					</div>
				) : (
					<div className='space-y-24 relative z-10'>
						{filteredServices.map((service, index) => (
							<div
								key={service.id}
								className={`lg:grid lg:grid-cols-12 lg:gap-10 items-center`}
								style={{ scrollMarginTop: '120px' }}
							>
								{index % 2 === 0 ? (
									<>
										<div className='lg:col-span-5 space-y-5'>
											<div className='inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500'>
												{(() => {
													const category = categories.find(c => c.id === service.category_id)
													return category
														? category.name
														: index === 0
														? 'Изготовление'
														: index === 2
														? 'Комплектующие'
														: index === 4
														? 'Техобслуживание'
														: 'Услуги'
												})()}
											</div>
											<h2 className='text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors'>
												{service.name}
												<div className='w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2'></div>
											</h2>
											<p className='text-gray-600 text-base leading-relaxed'>
												{service.description}
											</p>
											<div className='pt-5 flex space-x-3'>
												<Link
													href='/contacts'
													className='inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group'
												>
													<span className='flex items-center justify-center'>
														Получить консультацию
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
																clipRule='evenodd'
															/>
														</svg>
													</span>
												</Link>

												{service.category_id && (
													<button
														onClick={() => handleCategoryChange(service.category_id)}
														className='inline-flex items-center px-6 py-2.5 border border-amber-400 bg-transparent text-amber-600 rounded-md font-medium hover:bg-amber-50 transition-all duration-300 shadow-sm'
													>
														<span className='flex items-center justify-center'>Похожие услуги</span>
													</button>
												)}
											</div>
										</div>
										<div className='mt-10 lg:mt-0 lg:col-span-7'>
											<div className='relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1'>
												{/* Card background with refined gradient border */}
												<div className='absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]'></div>

												{/* Main card body with improved background */}
												<div className='relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]'>
													{imgErrors[`service-${service.id}`] || !service.image_url ? (
														<div className='w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6'>
															{getFallbackIcon(index)}
														</div>
													) : (
														<div className='relative w-full h-80'>
															<div className='absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30'></div>
															<Image
																src={service.image_url}
																alt={service.name}
																fill
																className='object-contain p-8 transform duration-700 ease-out group-hover:scale-105'
																onError={() => handleImageError(`service-${service.id}`)}
															/>
															<div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'></div>
														</div>
													)}
												</div>
											</div>
										</div>
									</>
								) : (
									<>
										<div className='lg:col-span-7 order-1 lg:order-1'>
											<div className='relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group hover:shadow-xl transform hover:-translate-y-1 mt-10 lg:mt-0'>
												{/* Card background with refined gradient border */}
												<div className='absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]'></div>

												{/* Main card body with improved background */}
												<div className='relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02]'>
													{imgErrors[`service-${service.id}`] || !service.image_url ? (
														<div className='w-full h-80 flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] p-6'>
															{getFallbackIcon(index)}
														</div>
													) : (
														<div className='relative w-full h-80'>
															<div className='absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30'></div>
															<Image
																src={service.image_url}
																alt={service.name}
																fill
																className='object-contain p-8 transform duration-700 ease-out group-hover:scale-105'
																onError={() => handleImageError(`service-${service.id}`)}
															/>
															<div className='absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'></div>
														</div>
													)}
												</div>
											</div>
										</div>
										<div className='lg:col-span-5 space-y-5 order-2 lg:order-2'>
											<div className='inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-l-4 border-l-amber-500'>
												{(() => {
													const category = categories.find(c => c.id === service.category_id)
													return category
														? category.name
														: index === 0
														? 'Изготовление'
														: index === 2
														? 'Комплектующие'
														: index === 4
														? 'Техобслуживание'
														: 'Услуги'
												})()}
											</div>
											<h2 className='text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors'>
												{service.name}
												<div className='w-16 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mt-2'></div>
											</h2>
											<p className='text-gray-600 text-base leading-relaxed'>
												{service.description}
											</p>
											<div className='pt-5 flex space-x-3'>
												<Link
													href='/contacts'
													className='inline-flex items-center px-6 py-2.5 border border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 rounded-md text-white font-medium hover:from-amber-700 hover:to-amber-600 transition-all duration-300 shadow-sm group'
												>
													<span className='flex items-center justify-center'>
														Получить консультацию
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-4 w-4 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
																clipRule='evenodd'
															/>
														</svg>
													</span>
												</Link>

												{service.category_id && (
													<button
														onClick={() => handleCategoryChange(service.category_id)}
														className='inline-flex items-center px-6 py-2.5 border border-amber-400 bg-transparent text-amber-600 rounded-md font-medium hover:bg-amber-50 transition-all duration-300 shadow-sm'
													>
														<span className='flex items-center justify-center'>Похожие услуги</span>
													</button>
												)}
											</div>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default function ServicesPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<ServicesContent />
		</Suspense>
	)
}
