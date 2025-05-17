'use client'

import { supabase } from '@/app/lib/supabase'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiEdit2, FiImage, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'

interface Category {
	id: number
	name: string
}

interface Service {
	id: number
	name: string
	description: string
	image_url: string | null
	category_id: number | null
	category_name?: string
}

export default function ServicesAdmin() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useSupabase()
	const [services, setServices] = useState<Service[]>([])
	const [allServices, setAllServices] = useState<Service[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingService, setEditingService] = useState<Service | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		image_url: '',
		category_id: '',
	})
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [oldImagePath, setOldImagePath] = useState<string | null>(null)

	useEffect(() => {
		if (!authLoading) {
			if (!user) {
				router.push('/admin/login')
			}
		}
	}, [user, authLoading, router])

	useEffect(() => {
		if (user) {
			Promise.all([fetchAllServices(), fetchCategories()])
		}
	}, [user])

	useEffect(() => {
		if (allServices.length > 0) {
			applyLocalFilters()
		}
	}, [selectedCategoryId, searchTerm, allServices])

	const applyLocalFilters = () => {
		let filteredResults = [...allServices]

		if (selectedCategoryId !== 'all') {
			filteredResults = filteredResults.filter(
				service => service.category_id === selectedCategoryId
			)
		}

		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase()
			filteredResults = filteredResults.filter(
				service =>
					service.name.toLowerCase().includes(searchLower) ||
					service.description.toLowerCase().includes(searchLower)
			)
		}

		setServices(filteredResults)
		setLoading(false)
	}

	async function checkServicesTable() {
		try {
			console.log('Checking services table directly...')
			const { data, error } = await supabase.from('services').select('*, categories(name)')

			if (error) {
				console.error('Error querying services table:', error)
				setError('Error querying services table: ' + error.message)
				return
			}

			console.log('Direct services table query result:', data)
			console.log('Services count:', data?.length || 0)

			if (data && data.length > 0) {
				const transformedData = data.map(item => ({
					id: item.id,
					name: item.name || '',
					description: item.description || '',
					image_url: item.image_url,
					category_id: item.category_id,
					category_name: item.categories?.name || null,
				}))

				console.log('Transformed services data:', transformedData)
				setServices(transformedData)
				setAllServices(transformedData)
				setLoading(false)
				setSuccess('Found ' + transformedData.length + ' services in database')
			} else {
				setError(
					'No services found in the database. Try adding some services using the "Add Service" button.'
				)
			}
		} catch (error) {
			console.error('Exception when checking services table:', error)
			setError('Exception checking services: ' + (error as Error).message)
		}
	}

	async function fetchCategories() {
		try {
			const { data, error } = await supabase.from('categories').select('*').order('name')

			if (error) {
				console.error('Error fetching categories:', error)
				return
			}

			console.log('Fetched categories:', data)
			setCategories(data || [])
		} catch (error) {
			console.error('Exception fetching categories:', error)
		}
	}

	async function fetchAllServices() {
		setLoading(true)
		try {
			console.log('Fetching all services...')

			const { data, error } = await supabase.from('services').select('*, categories(name)')

			if (error) throw error

			console.log('Fetched services data:', data)
			console.log('Services data length:', data?.length || 0)

			const transformedData =
				data?.map(item => ({
					id: item.id,
					name: item.name || '',
					description: item.description || '',
					image_url: item.image_url,
					category_id: item.category_id,
					category_name: item.categories?.name || null,
				})) || []

			setAllServices(transformedData)
			setServices(transformedData)
		} catch (error) {
			console.error('Error fetching services:', error)
			setError('Failed to fetch services: ' + (error as Error).message)
		} finally {
			setLoading(false)
		}
	}

	function openAddModal() {
		setEditingService(null)
		setFormData({
			name: '',
			description: '',
			image_url: '',
			category_id: '',
		})
		setOldImagePath(null)
		setIsModalOpen(true)
		setError(null)
		setSuccess(null)
	}

	function openEditModal(service: Service) {
		setEditingService(service)
		setFormData({
			name: service.name,
			description: service.description,
			image_url: service.image_url || '',
			category_id: service.category_id ? String(service.category_id) : '',
		})

		console.log('Opening edit modal for service:', service)
		console.log('Setting form data:', {
			name: service.name,
			description: service.description,
			image_url: service.image_url || '',
			category_id: service.category_id ? String(service.category_id) : '',
		})

		if (
			service.image_url &&
			typeof service.image_url === 'string' &&
			service.image_url.includes('img/services/')
		) {
			try {
				const urlParts = service.image_url.split('img/services/')
				if (urlParts.length > 1) {
					setOldImagePath(`services/${urlParts[1]}`)
				} else {
					setOldImagePath(null)
				}
			} catch (err) {
				console.error('Error parsing image path:', err)
				setOldImagePath(null)
			}
		} else {
			setOldImagePath(null)
		}

		setIsModalOpen(true)
		setError(null)
		setSuccess(null)
	}

	function closeModal() {
		setIsModalOpen(false)
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || e.target.files.length === 0) {
			return
		}

		setIsUploading(true)
		setError(null)

		try {
			const file = e.target.files[0]
			console.log('Uploading file:', file.name, 'size:', file.size)

			const fileName = `${Date.now()}-${file.name}`
			const filePath = `services/${fileName}`

			console.log('Attempting to upload to path:', filePath)
			const { data, error: uploadError } = await supabase.storage
				.from('img')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: true,
				})

			if (uploadError) {
				console.error('Supabase storage upload error:', uploadError)
				throw uploadError
			}

			console.log('Upload success, data:', data)

			const { data: urlData } = supabase.storage.from('img').getPublicUrl(filePath)

			const publicUrl = urlData?.publicUrl || ''
			console.log('Generated public URL:', publicUrl)

			setFormData({
				...formData,
				image_url: publicUrl,
			})
		} catch (error) {
			console.error('Error uploading image:', error)
			setError('Failed to upload image: ' + (error as Error).message)
		} finally {
			setIsUploading(false)
		}
	}

	async function deleteOldImage() {
		if (!oldImagePath) return true

		try {
			const { error } = await supabase.storage.from('img').remove([oldImagePath])

			if (error) {
				console.error('Error deleting old image:', error)
				return false
			}
			return true
		} catch (error) {
			console.error('Error deleting old image:', error)
			return false
		}
	}

	async function handleDeleteImage() {
		try {
			setError(null)

			if (!formData.image_url) return

			if (formData.image_url.includes('img/services/')) {
				const urlParts = formData.image_url.split('img/services/')
				if (urlParts.length > 1) {
					const imagePath = `services/${urlParts[1]}`

					const { error } = await supabase.storage.from('img').remove([imagePath])

					if (error) {
						console.error('Error deleting image from storage:', error)
						setError('Failed to delete image: ' + error.message)
						return
					}
				}
			}

			setFormData({
				...formData,
				image_url: '',
			})

			setSuccess('Image deleted successfully')
		} catch (error) {
			console.error('Error deleting image:', error)
			setError('Failed to delete image: ' + (error as Error).message)
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		if (!formData.name || !formData.description) {
			setError('Name and description are required')
			return
		}

		try {
			const serviceData = {
				name: formData.name.trim(),
				description: formData.description.trim(),
				image_url: formData.image_url || null,
				category_id: formData.category_id || null,
			}

			console.log('Saving service with data:', serviceData)

			if (editingService) {
				console.log('Updating existing service with ID:', editingService.id)

				const hasChanges =
					serviceData.name !== editingService.name ||
					serviceData.description !== editingService.description ||
					serviceData.image_url !== editingService.image_url ||
					serviceData.category_id !== editingService.category_id

				if (!hasChanges) {
					console.log('No changes detected, skipping update')
					setSuccess('No changes were made')
					closeModal()
					return
				}

				if (oldImagePath && formData.image_url !== editingService.image_url) {
					console.log('Image changed, deleting old image:', oldImagePath)
					await deleteOldImage()
				}

				const { data, error } = await supabase
					.from('services')
					.update(serviceData)
					.eq('id', editingService.id)
					.select('*, categories(name)')

				if (error) {
					console.error('Error updating service:', error)
					throw error
				}

				console.log('Updated service result:', data)
				setSuccess('Service updated successfully')

				await fetchAllServices()
			} else {
				console.log('Inserting new service')

				const { data, error } = await supabase
					.from('services')
					.insert([serviceData])
					.select('*, categories(name)')

				if (error) {
					console.error('Error inserting service:', error)
					throw error
				}

				console.log('Inserted service result:', data)
				setSuccess('Service added successfully')

				await fetchAllServices()
			}

			setIsModalOpen(false)
		} catch (error) {
			console.error('Error saving service:', error)
			setError('Failed to save service: ' + (error as Error).message)
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this service?')) {
			return
		}

		try {
			const serviceToDelete = services.find(s => s.id === id)

			if (
				serviceToDelete?.image_url &&
				typeof serviceToDelete.image_url === 'string' &&
				serviceToDelete.image_url.includes('img/services/')
			) {
				try {
					const urlParts = serviceToDelete.image_url.split('img/services/')
					if (urlParts.length > 1) {
						const imagePath = `services/${urlParts[1]}`
						await supabase.storage.from('img').remove([imagePath])
					}
				} catch (err) {
					console.error('Error parsing or deleting image path:', err)
				}
			}

			const { error } = await supabase.from('services').delete().eq('id', id)

			if (error) throw error
			setSuccess('Service deleted successfully')

			await fetchAllServices()
		} catch (error) {
			console.error('Error deleting service:', error)
			setError('Failed to delete service')
		}
	}

	if (authLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Checking authentication...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className='container mx-auto px-4'>
			<div className='flex flex-col md:flex-row justify-between items-center mb-6'>
				<h1 className='text-2xl md:text-3xl font-bold mb-4 md:mb-0'>Services Management</h1>
				<div className='flex flex-col sm:flex-row w-full md:w-auto gap-4'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Search services...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='pl-10 pr-4 py-2 border rounded-md w-full'
						/>
						<FiSearch className='absolute left-3 top-3 text-gray-400' />
					</div>
					<select
						value={selectedCategoryId === 'all' ? 'all' : selectedCategoryId}
						onChange={e =>
							setSelectedCategoryId(e.target.value === 'all' ? 'all' : Number(e.target.value))
						}
						className='p-2 border rounded-md'
					>
						<option value='all'>All Categories</option>
						{categories.map(category => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
					<button
						onClick={openAddModal}
						className='flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md'
					>
						<FiPlus className='mr-2' /> Add Service
					</button>
				</div>
			</div>

			{error && (
				<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
					{error}
				</div>
			)}

			{success && (
				<div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4'>
					{success}
				</div>
			)}

			{loading ? (
				<div className='flex justify-center py-8'>
					<div className='animate-pulse text-lg'>Loading services...</div>
				</div>
			) : services.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<p className='text-gray-600'>No services found. Try a different search or category.</p>
					<button
						onClick={() => checkServicesTable()}
						className='mt-4 text-blue-600 hover:text-blue-800 underline'
					>
						Diagnose Table Issues
					</button>
				</div>
			) : (
				<div className='overflow-x-auto bg-white rounded-lg shadow'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Image
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Title
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Description
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Category
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{services.map(service => (
								<tr key={service.id}>
									<td className='px-6 py-4 whitespace-nowrap'>
										{service.image_url ? (
											<div className='h-16 w-16 relative'>
												<img
													src={service.image_url}
													alt={service.name}
													className='h-16 w-16 object-cover rounded'
												/>
											</div>
										) : (
											<div className='h-16 w-16 bg-gray-200 rounded flex items-center justify-center'>
												<FiImage className='text-gray-400' />
											</div>
										)}
									</td>
									<td className='px-6 py-4'>
										<div className='text-sm font-medium text-gray-900'>{service.name}</div>
									</td>
									<td className='px-6 py-4'>
										<div className='text-sm text-gray-500 max-w-xs truncate'>
											{service.description}
										</div>
									</td>
									<td className='px-6 py-4'>
										<div className='text-sm text-gray-900'>{service.category_name || 'None'}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										<button
											onClick={() => openEditModal(service)}
											className='text-blue-600 hover:text-blue-900 mr-3'
										>
											<FiEdit2 className='inline mr-1' /> Edit
										</button>
										<button
											onClick={() => handleDelete(service.id)}
											className='text-red-600 hover:text-red-900'
										>
											<FiTrash2 className='inline mr-1' /> Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
					<div className='bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6'>
							<h2 className='text-xl font-bold mb-4'>
								{editingService ? 'Edit Service' : 'Add New Service'}
							</h2>

							<form onSubmit={handleSubmit} className='space-y-4'>
								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
										Title *
									</label>
									<input
										id='name'
										name='name'
										type='text'
										required
										value={formData.name}
										onChange={handleInputChange}
										className='w-full p-2 border rounded'
									/>
								</div>

								<div>
									<label
										className='block text-gray-700 text-sm font-bold mb-2'
										htmlFor='description'
									>
										Description *
									</label>
									<textarea
										id='description'
										name='description'
										required
										value={formData.description}
										onChange={handleInputChange}
										rows={3}
										className='w-full p-2 border rounded'
									/>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='category'>
										Category
									</label>
									<select
										id='category'
										name='category_id'
										value={formData.category_id}
										onChange={handleInputChange}
										className='w-full p-2 border rounded'
									>
										<option value=''>Select a category</option>
										{categories.map(category => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Image</label>
									<div className='flex flex-col md:flex-row gap-4'>
										<div className='flex-1'>
											<div className='flex items-center justify-center px-3 py-3 border-2 border-dashed border-gray-300 rounded-md'>
												<div className='space-y-1 text-center'>
													<div className='flex text-sm text-gray-600'>
														<label
															htmlFor='image-upload'
															className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500'
														>
															<span>Upload a file</span>
															<input
																id='image-upload'
																name='image'
																type='file'
																className='sr-only'
																accept='image/*'
																onChange={handleImageUpload}
																disabled={isUploading}
															/>
														</label>
														<p className='pl-1'>or drag and drop</p>
													</div>
													<p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
												</div>
											</div>
											{isUploading && (
												<div className='mt-2 flex items-center justify-center'>
													<div className='spinner animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500'></div>
													<span className='ml-2 text-sm text-gray-500'>Uploading...</span>
												</div>
											)}
										</div>

										<div className='w-full md:w-1/3'>
											{formData.image_url ? (
												<div className='relative h-40 w-full'>
													<img
														src={formData.image_url}
														alt='Preview'
														className='h-full w-full object-contain border rounded'
													/>
													<button
														type='button'
														onClick={handleDeleteImage}
														className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full'
														title='Delete image'
													>
														<FiTrash2 size={16} />
													</button>
												</div>
											) : (
												<div className='h-40 w-full bg-gray-100 flex items-center justify-center border rounded'>
													<span className='text-gray-400'>No image</span>
												</div>
											)}
										</div>
									</div>
								</div>

								<div className='flex justify-end gap-2 pt-4'>
									<button
										type='button'
										onClick={closeModal}
										className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
									>
										Cancel
									</button>
									<button
										type='submit'
										className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
										disabled={isUploading}
									>
										{editingService ? 'Update Service' : 'Add Service'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
