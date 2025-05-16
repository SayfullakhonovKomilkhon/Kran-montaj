'use client'

import { supabase } from '@/app/lib/supabase'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiEdit2, FiLink, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi'

interface Category {
	id: string
	name: string
}

interface Service {
	id: string
	name: string
	description: string
	image_url: string
	category_id: string | null
	category_name?: string
}

export default function ServicesManagement() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useSupabase()
	const [services, setServices] = useState<Service[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [editingService, setEditingService] = useState<Service | null>(null)
	const [formData, setFormData] = useState<Omit<Service, 'id' | 'category_name'>>({
		name: '',
		description: '',
		image_url: '',
		category_id: null,
	})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all')
	const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload')
	const [oldImagePath, setOldImagePath] = useState<string | null>(null)

	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/admin/login')
		}
	}, [user, authLoading, router])

	useEffect(() => {
		if (user) {
			Promise.all([fetchServices(), fetchCategories()])
		}
	}, [user])

	useEffect(() => {
		if (user && selectedCategoryId !== 'loading') {
			fetchServices()
		}
	}, [selectedCategoryId])

	async function fetchCategories() {
		try {
			const { data, error } = await supabase.from('categories').select('*').order('name')

			if (error) throw error
			setCategories(data || [])
		} catch (error) {
			console.error('Error fetching categories:', error)
		}
	}

	async function fetchServices() {
		setLoading(true)
		try {
			// Use the services_with_category view for better data
			let query = supabase.from('services_with_category').select('*')

			if (selectedCategoryId !== 'all') {
				query = query.eq('category_id', selectedCategoryId)
			}

			const { data, error } = await query.order('name')

			if (error) throw error
			setServices(data || [])
		} catch (error) {
			console.error('Error fetching services:', error)
			setError('Failed to load services')
		} finally {
			setLoading(false)
		}
	}

	function openModal(service: Service | null = null) {
		if (service) {
			setEditingService(service)
			setFormData({
				name: service.name,
				description: service.description,
				image_url: service.image_url,
				category_id: service.category_id,
			})

			// Store old image path for possible deletion
			if (service.image_url && service.image_url.includes('img/services/')) {
				const urlParts = service.image_url.split('img/services/')
				if (urlParts.length > 1) {
					setOldImagePath(`services/${urlParts[1]}`)
				}
			} else {
				setOldImagePath(null)
			}

			// Determine input type based on image URL
			if (service.image_url && service.image_url.includes('supabase.co')) {
				setImageInputType('upload')
			} else {
				setImageInputType('url')
			}
		} else {
			setEditingService(null)
			setFormData({
				name: '',
				description: '',
				image_url: '',
				category_id: null,
			})
			setOldImagePath(null)
			setImageInputType('upload')
		}
		setIsModalOpen(true)
	}

	function closeModal() {
		setIsModalOpen(false)
		setEditingService(null)
		setError(null)
		setOldImagePath(null)
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		// Handle category_id as a special case
		if (name === 'category_id') {
			setFormData({
				...formData,
				[name]: value === '' ? null : value,
			})
		} else if (name === 'image_url' && imageInputType === 'url') {
			setFormData({
				...formData,
				image_url: value,
			})
		} else {
			setFormData({
				...formData,
				[name]: name === 'order' ? parseInt(value) || 0 : value,
			})
		}
	}

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || e.target.files.length === 0) {
			return
		}

		setIsUploading(true)
		try {
			const file = e.target.files[0]
			const fileExt = file.name.split('.').pop()
			const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
			const filePath = `services/${fileName}`

			const { error: uploadError } = await supabase.storage.from('img').upload(filePath, file)

			if (uploadError) throw uploadError

			const { data } = supabase.storage.from('img').getPublicUrl(filePath)

			setFormData({
				...formData,
				image_url: data.publicUrl,
			})
		} catch (error) {
			console.error('Error uploading image:', error)
			setError('Failed to upload image')
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

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)

		if (!formData.name.trim()) {
			setError('Service name is required')
			return
		}

		try {
			if (editingService) {
				// If the image has changed and the old one was in Supabase storage, delete it
				if (oldImagePath && formData.image_url !== editingService.image_url) {
					await deleteOldImage()
				}

				// Update existing service
				const { error } = await supabase
					.from('services')
					.update({
						name: formData.name,
						description: formData.description,
						image_url: formData.image_url,
						category_id: formData.category_id,
					})
					.eq('id', editingService.id)

				if (error) throw error
			} else {
				// Create new service
				const { error } = await supabase.from('services').insert([
					{
						name: formData.name,
						description: formData.description,
						image_url: formData.image_url,
						category_id: formData.category_id,
					},
				])

				if (error) throw error
			}

			// Refresh services list
			await fetchServices()
			closeModal()
		} catch (error: any) {
			console.error('Error saving service:', error)
			if (error.code === '23505') {
				setError('A service with this name already exists')
			} else {
				setError('Failed to save service')
			}
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this service?')) {
			return
		}

		// Find the service to get its image URL
		const serviceToDelete = services.find(s => s.id === id)
		let imagePath = null

		if (serviceToDelete?.image_url && serviceToDelete.image_url.includes('img/services/')) {
			const urlParts = serviceToDelete.image_url.split('img/services/')
			if (urlParts.length > 1) {
				imagePath = `services/${urlParts[1]}`
			}
		}

		try {
			// Delete the record from the database
			const { error } = await supabase.from('services').delete().eq('id', id)
			if (error) throw error

			// If successful and image exists in Supabase, delete it
			if (imagePath) {
				const { error: deleteError } = await supabase.storage.from('img').remove([imagePath])
				if (deleteError) {
					console.error('Error deleting image:', deleteError)
				}
			}

			// Refresh services list
			await fetchServices()
		} catch (error) {
			console.error('Error deleting service:', error)
			setError('Failed to delete service')
		}
	}

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategoryId(e.target.value)
	}

	const handleImageInputTypeChange = (type: 'upload' | 'url') => {
		setImageInputType(type)
		// Clear the image_url when switching input types
		if (type === 'upload' && !formData.image_url.includes('supabase.co')) {
			setFormData({
				...formData,
				image_url: '',
			})
		}
	}

	if (authLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Проверка авторизации...</p>
				</div>
			</div>
		)
	}

	if (!user) {
		return null
	}

	return (
		<div className='container mx-auto px-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl md:text-3xl font-bold'>Services Management</h1>
				<button
					className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center'
					onClick={() => openModal()}
				>
					<FiPlus className='mr-2' /> Add Service
				</button>
			</div>

			{/* Category filter */}
			<div className='bg-white p-4 rounded-lg shadow mb-6'>
				<div className='flex items-center'>
					<label className='text-sm font-medium text-gray-700 mr-3'>Filter by Category:</label>
					<select
						value={selectedCategoryId}
						onChange={handleCategoryChange}
						className='w-64 p-2 border rounded'
					>
						<option value='all'>All Categories</option>
						{categories.map(category => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>

			{error && (
				<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
					{error}
				</div>
			)}

			{loading ? (
				<div className='flex justify-center py-8'>
					<div className='animate-pulse text-lg'>Loading services...</div>
				</div>
			) : services.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<p className='text-gray-600 mb-4'>
						No services found. Add your first service to get started.
					</p>
					<button
						className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto'
						onClick={() => openModal()}
					>
						<FiPlus className='mr-2' /> Add Service
					</button>
				</div>
			) : (
				<div className='grid grid-cols-1 gap-6'>
					{services.map(service => (
						<div key={service.id} className='bg-white rounded-lg shadow overflow-hidden'>
							<div className='md:flex'>
								<div className='md:w-1/3 h-48 md:h-auto'>
									{service.image_url ? (
										<img
											src={service.image_url}
											alt={service.name}
											className='w-full h-full object-cover'
										/>
									) : (
										<div className='w-full h-full bg-gray-200 flex items-center justify-center'>
											<p className='text-gray-500'>No image</p>
										</div>
									)}
								</div>
								<div className='p-6 md:w-2/3'>
									<div className='flex justify-between items-start'>
										<div>
											<h2 className='text-xl font-bold mb-2'>{service.name}</h2>
											<p className='text-sm text-gray-500 mb-2'>
												Category: {service.category_name || 'None'}
											</p>
											<p className='text-gray-600 mb-4'>{service.description}</p>
										</div>
										<div className='flex space-x-2'>
											<button
												className='p-2 text-blue-500 hover:bg-blue-50 rounded'
												onClick={() => openModal(service)}
											>
												<FiEdit2 />
											</button>
											<button
												className='p-2 text-red-500 hover:bg-red-50 rounded'
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
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
					<div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
						<div className='p-6'>
							<h2 className='text-xl font-bold mb-4'>
								{editingService ? 'Edit Service' : 'Add New Service'}
							</h2>

							<form onSubmit={handleSubmit}>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
										Name
									</label>
									<input
										type='text'
										id='name'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										className='w-full p-2 border rounded'
										required
									/>
								</div>

								<div className='mb-4'>
									<label
										className='block text-gray-700 text-sm font-bold mb-2'
										htmlFor='category_id'
									>
										Category
									</label>
									<select
										id='category_id'
										name='category_id'
										value={formData.category_id || ''}
										onChange={handleInputChange}
										className='w-full p-2 border rounded'
									>
										<option value=''>No Category</option>
										{categories.map(category => (
											<option key={category.id} value={category.id}>
												{category.name}
											</option>
										))}
									</select>
								</div>

								<div className='mb-4'>
									<label
										className='block text-gray-700 text-sm font-bold mb-2'
										htmlFor='description'
									>
										Description
									</label>
									<textarea
										id='description'
										name='description'
										value={formData.description}
										onChange={handleInputChange}
										className='w-full p-2 border rounded'
										rows={4}
									/>
								</div>

								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Image</label>

									<div className='flex mb-3 border rounded overflow-hidden'>
										<button
											type='button'
											className={`flex-1 py-2 px-4 flex items-center justify-center ${
												imageInputType === 'upload'
													? 'bg-blue-500 text-white'
													: 'bg-gray-200 text-gray-700'
											}`}
											onClick={() => handleImageInputTypeChange('upload')}
										>
											<FiUpload className='mr-2' /> Upload
										</button>
										<button
											type='button'
											className={`flex-1 py-2 px-4 flex items-center justify-center ${
												imageInputType === 'url'
													? 'bg-blue-500 text-white'
													: 'bg-gray-200 text-gray-700'
											}`}
											onClick={() => handleImageInputTypeChange('url')}
										>
											<FiLink className='mr-2' /> URL
										</button>
									</div>

									{imageInputType === 'upload' ? (
										<div>
											{formData.image_url && (
												<div className='mb-2'>
													<img
														src={formData.image_url}
														alt='Preview'
														className='w-40 h-40 object-cover rounded'
													/>
													<button
														type='button'
														onClick={() => {
															if (oldImagePath) {
																deleteOldImage()
															}
															setFormData({
																...formData,
																image_url: '',
															})
															setOldImagePath(null)
														}}
														className='mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center'
													>
														<FiTrash2 className='mr-1' /> Delete Image
													</button>
												</div>
											)}
											<input
												type='file'
												id='image'
												onChange={handleImageUpload}
												className='border p-2 w-full rounded'
												accept='image/*'
											/>
											{isUploading && <p className='text-sm text-gray-500 mt-1'>Uploading...</p>}
										</div>
									) : (
										<div>
											<input
												type='text'
												id='image_url'
												name='image_url'
												placeholder='https://example.com/image.jpg'
												value={formData.image_url}
												onChange={handleInputChange}
												className='w-full p-2 border rounded'
											/>
											{formData.image_url && (
												<div className='mt-2'>
													<img
														src={formData.image_url}
														alt='Preview'
														className='w-40 h-40 object-cover rounded'
														onError={e => {
															const target = e.target as HTMLImageElement
															target.src = 'https://via.placeholder.com/150?text=Invalid+URL'
														}}
													/>
													<button
														type='button'
														onClick={() => {
															setFormData({
																...formData,
																image_url: '',
															})
														}}
														className='mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center'
													>
														<FiTrash2 className='mr-1' /> Delete Image
													</button>
												</div>
											)}
										</div>
									)}
								</div>

								{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

								<div className='flex justify-end space-x-2'>
									<button
										type='button'
										onClick={closeModal}
										className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'
									>
										Cancel
									</button>
									<button
										type='submit'
										className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
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
	)
}
