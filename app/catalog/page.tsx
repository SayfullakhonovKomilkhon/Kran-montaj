'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Define interface for catalog items
interface Product {
	id: string
	title: string
	description: string
	image_url: string | null
	price: number | null
	category_id?: string | null
	category_name?: string
}

interface Category {
	id: string
	name: string
}

// Loading fallback component
function LoadingFallback() {
	return (
		<div className='py-12 pt-8 bg-[#F5F7FA] flex justify-center items-center min-h-[50vh]'>
			<div className='text-center'>
				<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5'></div>
				<p className='text-gray-700 font-medium text-lg'>Загрузка каталога...</p>
			</div>
		</div>
	)
}

// Catalog item component with error handling
function CatalogItem({ item }: { item: Product }) {
	const [imageError, setImageError] = useState(false)
	const [isHovered, setIsHovered] = useState(false)

	const handleImageError = () => {
		setImageError(true)
	}

	return (
		<div
			className='group relative flex flex-col overflow-hidden h-[480px] perspective-1000'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Card background with refined gradient border */}
			<div className='absolute inset-0 bg-gradient-to-br from-amber-300/30 via-transparent to-amber-400/30 rounded-lg z-0 transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]'></div>

			{/* Main card body with improved background */}
			<div className='relative flex flex-col h-full z-10 bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0] rounded-lg m-[1px] border border-amber-100 transform transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]'>
				{/* Enhanced corner accent */}
				<div className='absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-[#D1DBE7] to-[#C9D6E7] transform rotate-45 translate-x-12 -translate-y-12 z-0'></div>
				<div className='absolute top-0 right-0 h-10 w-10 bg-amber-400/15 rounded-full blur-xl transform translate-x-3 translate-y-3 z-0'></div>

				{/* Image container with improved reveal effect */}
				<div className='h-64 relative overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/90 via-[#EDF2F7]/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

					{imageError || !item.image_url ? (
						<div className='w-full h-full flex items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-[#E2E8F0]'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-20 w-20 text-amber-400/50'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
						</div>
					) : (
						<div className='relative w-full h-full transform duration-700 ease-out group-hover:scale-105'>
							<div className='absolute inset-0 bg-gradient-to-t from-[#E2E8F0]/50 to-transparent opacity-30'></div>
							<Image
								src={item.image_url}
								alt={item.title}
								fill
								className='object-contain p-6'
								onError={handleImageError}
								loading='lazy'
								sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
							/>
							<div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent'></div>
						</div>
					)}
				</div>

				{/* Content with improved styling */}
				<div className='flex-1 p-7 flex flex-col relative z-10'>
					<div className='absolute left-7 top-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-y-1 transition-all duration-500 group-hover:w-24'></div>

					<div className='flex-1'>
						<h3 className='text-xl font-medium text-gray-700 group-hover:text-amber-700 transition-colors'>
							<Link
								href={`/catalog/${item.id}`}
								className='block transform transition-all duration-500 group-hover:translate-x-1'
							>
								{item.title}
								<span className='absolute -left-3 top-1.5 w-0 h-5 bg-amber-400/20 transform transition-all duration-500 group-hover:w-1'></span>
							</Link>
						</h3>
						{item.category_name && (
							<p className='text-sm text-amber-500 mt-1'>{item.category_name}</p>
						)}
						<p className='mt-4 text-sm text-gray-500 line-clamp-3 transition-all duration-500 group-hover:text-gray-600'>
							{item.description}
						</p>
						{item.price && (
							<p className='mt-3 text-amber-600 font-semibold'>
								от {item.price.toLocaleString()} сум
							</p>
						)}
					</div>

					{/* Improved button with animated border */}
					<div className='mt-7 relative'>
						<div className='absolute inset-0 bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-amber-500/40 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
						<Link
							href={`/catalog/${item.id}`}
							className='relative block text-center py-3.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 overflow-hidden group-hover:from-amber-600 group-hover:to-amber-500 group-hover:text-white z-10 shadow-sm'
						>
							<span className='relative z-10 flex items-center justify-center'>
								Подробнее
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4.5 w-4.5 ml-2 transform transition-transform duration-500 group-hover:translate-x-1.5'
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
							<span className='absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-700 group-hover:w-full'></span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

// Main catalog content component
function CatalogContent() {
	const searchParams = useSearchParams()
	const categoryParam = searchParams.get('category')
	const router = useRouter()

	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam)
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

	// Fetch data on initial load
	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true)

				// Fetch all products from the products_with_category view
				const { data: productsData, error: productsError } = await supabase
					.from('products_with_category')
					.select('*')

				if (productsError) {
					console.error('Error fetching products:', productsError)
					throw productsError
				}

				// Set the products
				setProducts(productsData || [])

				// Extract unique categories from the products data
				const uniqueCategories = Array.from(
					new Set(
						productsData
							?.filter(p => p.category_id && p.category_name)
							.map(p => JSON.stringify({ id: p.category_id, name: p.category_name }))
					)
				).map(c => JSON.parse(c))

				setCategories(uniqueCategories)

				// Set initial filtered products based on URL parameter
				if (categoryParam) {
					setFilteredProducts(
						productsData?.filter(product => product.category_id === categoryParam) || []
					)
				} else {
					setFilteredProducts(productsData || [])
				}
			} catch (err) {
				console.error('Error:', err)
				setError('Failed to load products')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	// Filter products when active category changes
	useEffect(() => {
		if (activeCategory) {
			setFilteredProducts(products.filter(product => product.category_id === activeCategory))
		} else {
			setFilteredProducts(products)
		}
	}, [activeCategory, products])

	// Handle category change
	const handleCategoryChange = (categoryId: string | null) => {
		setActiveCategory(categoryId)

		// Update URL without refreshing the page
		if (categoryId) {
			router.push(`/catalog?category=${categoryId}`, { scroll: false })
		} else {
			router.push('/catalog', { scroll: false })
		}
	}

	return (
		<div className='bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen overflow-hidden'>
			{/* Enhanced header with improved design elements */}
			<div className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70'></div>
				<div className="absolute inset-0 bg-[url('/img/services/catalog-background.png')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
				<div className='absolute right-0 top-0 w-64 md:w-96 h-64 md:h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2'></div>
				<div className='absolute left-0 bottom-0 w-64 md:w-96 h-64 md:h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/2'></div>
				<div className='absolute left-1/4 top-1/3 w-32 h-32 bg-amber-100/50 rounded-full opacity-30 blur-xl'></div>

				<div className='max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 relative'>
					<div className='absolute w-24 h-24 bg-amber-100/80 rounded-full blur-2xl -left-10 top-20 opacity-60'></div>
					<div className='absolute w-40 h-40 bg-amber-100/80 rounded-full blur-2xl right-10 top-40 opacity-60'></div>

					<div className='text-center relative'>
						<div className='inline-block mx-auto mb-4' data-aos='fade-up' data-aos-duration='800'>
							<div className='w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full'></div>
							<div className='w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full'></div>
						</div>
						<h1
							className='text-3xl font-bold text-gray-800 sm:text-5xl tracking-tight'
							data-aos='fade-up'
							data-aos-delay='100'
						>
							<span className='inline-block border-b-2 border-amber-400 pb-2'>
								Каталог продукции
							</span>
						</h1>
						<p
							className='mt-7 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed'
							data-aos='fade-up'
							data-aos-delay='200'
						>
							Ознакомьтесь с нашей премиальной линейкой грузоподъемного оборудования, разработанного
							для решения самых сложных промышленных задач
						</p>
					</div>
				</div>

				{/* Decorative elements */}
				<div className='absolute left-0 bottom-0 w-full h-8 bg-gradient-to-b from-transparent to-[#EFF6FF]/80'></div>
				<div className='absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent'></div>
			</div>

			{/* Product Category Filter - using buttons with onClick instead of Links */}
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
							Все продукты
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

			{/* Enhanced catalog grid with improved styling */}
			<div className='max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-4 relative overflow-hidden'>
				{/* Adjust decorative elements to prevent overflow on smaller screens */}
				<div className='absolute sm:-left-32 md:-left-64 top-1/3 w-64 md:w-96 h-64 md:h-96 bg-amber-100/20 rounded-full blur-3xl'></div>
				<div className='absolute sm:-right-32 md:-right-64 bottom-1/3 w-64 md:w-96 h-64 md:h-96 bg-amber-100/20 rounded-full blur-3xl'></div>

				{loading ? (
					<div className='flex justify-center items-center py-16'>
						<div className='text-center'>
							<div className='inline-block animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-amber-600 mb-5'></div>
							<p className='text-gray-700 font-medium text-lg'>Загрузка продуктов...</p>
						</div>
					</div>
				) : error ? (
					<div className='text-center py-10'>
						<p className='text-red-500 text-lg'>{error}</p>
					</div>
				) : filteredProducts.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-xl'>
							{activeCategory
								? 'В данной категории нет доступных продуктов'
								: 'Нет доступных продуктов'}
						</p>
					</div>
				) : (
					<div className='grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3 relative z-10'>
						{filteredProducts.map((item, index) => (
							<div
								key={item.id}
								data-aos='fade-up'
								data-aos-delay={150 * (index + 1)}
								data-aos-duration='800'
							>
								<CatalogItem item={item} />
							</div>
						))}
					</div>
				)}

				{/* Enhanced footer with improved styling */}
				<div className='mt-24 text-center relative' data-aos='fade-up' data-aos-delay='300'>
					<div className='relative inline-block'>
						<div className='absolute left-1/2 top-0 w-32 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent transform -translate-x-1/2 -translate-y-12'></div>
						<div className='absolute left-1/2 top-0 w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent transform -translate-x-1/2 -translate-y-8'></div>
					</div>
					<p className='text-gray-500 text-sm'>
						Представлены не все модели. Для получения полной информации, пожалуйста, свяжитесь с
						нашими специалистами.
					</p>
				</div>
			</div>
		</div>
	)
}

export default function CatalogPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<CatalogContent />
		</Suspense>
	)
}
