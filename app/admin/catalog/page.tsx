'use client'

import { supabase } from '@/app/lib/supabase'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiEdit2, FiLink, FiPlus, FiSearch, FiTrash2, FiUpload } from 'react-icons/fi'

interface Category {
	id: string
	name: string
}

interface CatalogItem {
	id: number
	title: string
	description: string
	image_url: string
	category_id: string | null
	category_name?: string
	characteristics: { [key: string]: string }
	price?: string
}

export default function CatalogManagement() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useSupabase()
	const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
	const [loading, setLoading] = useState(true)
	const [editingItem, setEditingItem] = useState<CatalogItem | null>(null)
	const [formData, setFormData] = useState<Omit<CatalogItem, 'id' | 'category_name'>>({
		title: '',
		description: '',
		image_url: '',
		category_id: null,
		characteristics: {},
		price: '',
	})
	const [searchTerm, setSearchTerm] = useState('')
	const [categories, setCategories] = useState<Category[]>([])
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [chars, setChars] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }])
	const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload')
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
			Promise.all([fetchCatalogItems(), fetchCategories()])
		}
	}, [user])

	useEffect(() => {
		if (user && selectedCategoryId !== 'loading') {
			fetchCatalogItems()
		}
	}, [selectedCategoryId, searchTerm])

	async function fetchCategories() {
		try {
			const { data, error } = await supabase.from('categories').select('*').order('name')

			if (error) throw error
			setCategories(data || [])
		} catch (error) {
			console.error('Error fetching categories:', error)
		}
	}

	async function fetchCatalogItems() {
		setLoading(true)
		try {
			// Use the products_with_category view for better data
			let query = supabase.from('products_with_category').select('*')

			if (selectedCategoryId !== 'all') {
				query = query.eq('category_id', selectedCategoryId)
			}

			if (searchTerm) {
				query = query.ilike('title', `%${searchTerm}%`)
			}

			const { data, error } = await query

			if (error) throw error

			setCatalogItems(data || [])
		} catch (error) {
			console.error('Error fetching catalog items:', error)
			setError('Failed to load catalog items')
		} finally {
			setLoading(false)
		}
	}

	function openModal(item: CatalogItem | null = null) {
		if (item) {
			setEditingItem(item)
			setFormData({
				title: item.title,
				description: item.description,
				image_url: item.image_url,
				category_id: item.category_id,
				characteristics: item.characteristics || {},
				price: item.price || '',
			})

			// Store old image path for possible deletion
			if (item.image_url && item.image_url.includes('img/products/')) {
				const urlParts = item.image_url.split('img/products/')
				if (urlParts.length > 1) {
					setOldImagePath(`products/${urlParts[1]}`)
				}
			} else {
				setOldImagePath(null)
			}

			// Determine input type based on image URL
			if (item.image_url && item.image_url.includes('supabase.co')) {
				setImageInputType('upload')
			} else {
				setImageInputType('url')
			}

			// Convert characteristics object to array of key-value pairs for form
			const charPairs = Object.entries(item.characteristics || {}).map(([key, value]) => ({
				key,
				value,
			}))
			setChars(charPairs.length > 0 ? charPairs : [{ key: '', value: '' }])
		} else {
			setEditingItem(null)
			setFormData({
				title: '',
				description: '',
				image_url: '',
				category_id: null,
				characteristics: {},
				price: '',
			})
			setChars([{ key: '', value: '' }])
			setOldImagePath(null)
			setImageInputType('upload')
		}
		setIsModalOpen(true)
	}

	function closeModal() {
		setIsModalOpen(false)
		setEditingItem(null)
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
				[name]: value,
			})
		}
	}

	const handleCharChange = (index: number, field: 'key' | 'value', value: string) => {
		const newChars = [...chars]
		newChars[index][field] = value
		setChars(newChars)
	}

	const addCharField = () => {
		setChars([...chars, { key: '', value: '' }])
	}

	const removeCharField = (index: number) => {
		if (chars.length > 1) {
			const newChars = [...chars]
			newChars.splice(index, 1)
			setChars(newChars)
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
			const filePath = `products/${fileName}`

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

		// Convert chars array to object
		const characteristicsObject = chars.reduce((acc, { key, value }) => {
			if (key.trim()) {
				acc[key.trim()] = value.trim()
			}
			return acc
		}, {} as { [key: string]: string })

		const submitData = {
			...formData,
			characteristics: characteristicsObject,
		}

		try {
			if (editingItem) {
				// If the image has changed and the old one was in Supabase storage, delete it
				if (oldImagePath && formData.image_url !== editingItem.image_url) {
					await deleteOldImage()
				}

				// Update existing item
				const { error } = await supabase
					.from('products')
					.update(submitData)
					.eq('id', editingItem.id)

				if (error) throw error
			} else {
				// Create new item
				const { error } = await supabase.from('products').insert([submitData])

				if (error) throw error
			}

			// Refresh catalog list
			await fetchCatalogItems()
			closeModal()
		} catch (error) {
			console.error('Error saving catalog item:', error)
			setError('Failed to save catalog item')
		}
	}

	async function handleDelete(id: number) {
		if (!confirm('Are you sure you want to delete this catalog item?')) {
			return
		}

		// Find the item to get its image URL
		const itemToDelete = catalogItems.find(item => item.id === id)
		let imagePath = null

		if (itemToDelete?.image_url && itemToDelete.image_url.includes('img/products/')) {
			const urlParts = itemToDelete.image_url.split('img/products/')
			if (urlParts.length > 1) {
				imagePath = `products/${urlParts[1]}`
			}
		}

		try {
			// Delete the record from the database
			const { error } = await supabase.from('products').delete().eq('id', id)

			if (error) throw error

			// If successful and image exists in Supabase, delete it
			if (imagePath) {
				const { error: deleteError } = await supabase.storage.from('img').remove([imagePath])
				if (deleteError) {
					console.error('Error deleting image:', deleteError)
				}
			}

			// Refresh catalog list
			await fetchCatalogItems()
		} catch (error) {
			console.error('Error deleting catalog item:', error)
			setError('Failed to delete catalog item')
		}
	}

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategoryId(e.target.value)
		console.log(e.target.value);

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
				<h1 className='text-2xl md:text-3xl font-bold'>Catalog Management</h1>
				<button
					className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center'
					onClick={() => openModal()}
				>
					<FiPlus className='mr-2' /> Add Item
				</button>
			</div>

			<div className='bg-white p-4 rounded-lg shadow mb-6'>
				<div className='md:flex space-y-4 md:space-y-0 space-x-0 md:space-x-4'>
					<div className='flex-1'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Search catalog items...'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='w-full p-2 pl-10 border rounded'
							/>
							<FiSearch className='absolute left-3 top-3 text-gray-400' />
						</div>
					</div>

					<div className='md:w-1/4'>
						<select
							value={selectedCategoryId}
							onChange={handleCategoryChange}
							className='w-full p-2 border rounded'
						>
							<option value='all'>All Categories</option>
							{categories.map(category => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<button
						onClick={fetchCatalogItems}
						className='bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded'
					>
						Apply Filters
					</button>
				</div>
			</div>

			{loading ? (
				<div className='flex justify-center py-8'>
					<div className='animate-pulse text-lg'>Loading catalog items...</div>
				</div>
			) : catalogItems.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<p className='text-gray-600 mb-4'>
						No catalog items found. Add your first item to get started.
					</p>
					<button
						className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto'
						onClick={() => openModal()}
					>
						<FiPlus className='mr-2' /> Add Item
					</button>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{catalogItems.map(item => (
						<div key={item.id} className='bg-white rounded-lg shadow overflow-hidden'>
							<div className='h-48'>
								{item.image_url ? (
									<img
										src={item.image_url}
										alt={item.title}
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='w-full h-full bg-gray-200 flex items-center justify-center'>
										<p className='text-gray-500'>No image</p>
									</div>
								)}
							</div>
							<div className='p-4'>
								<div className='flex justify-between items-start'>
									<div>
										<h2 className='text-lg font-bold'>{item.title}</h2>
										<p className='text-sm text-gray-500 mb-2'>
											Category: {item.category_name || 'None'}
										</p>
										{item.price && (
											<p className='text-sm font-medium text-gray-800 mb-2'>Price: {item.price}</p>
										)}
										<p className='text-gray-600 mb-2 text-sm line-clamp-3'>{item.description}</p>
									</div>
									<div className='flex space-x-2'>
										<button
											className='p-2 text-blue-500 hover:bg-blue-50 rounded'
											onClick={() => openModal(item)}
										>
											<FiEdit2 />
										</button>
										<button
											className='p-2 text-red-500 hover:bg-red-50 rounded'
											onClick={() => handleDelete(item.id)}
										>
											<FiTrash2 />
										</button>
									</div>
								</div>
								{Object.keys(item.characteristics || {}).length > 0 && (
									<div className='mt-3 pt-3 border-t'>
										<h3 className='text-sm font-semibold mb-1'>Characteristics:</h3>
										<div className='text-xs text-gray-600'>
											{Object.entries(item.characteristics)
												.slice(0, 3)
												.map(([key, value]) => (
													<div key={key} className='flex mb-1'>
														<span className='font-medium mr-1'>{key}:</span>
														<span>{value}</span>
													</div>
												))}
											{Object.keys(item.characteristics).length > 3 && (
												<p className='text-xs text-blue-500'>
													+ {Object.keys(item.characteristics).length - 3} more
												</p>
											)}
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Modal for adding/editing catalog items */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto'>
					<div className='bg-white rounded-lg shadow-lg w-full max-w-2xl my-8'>
						<div className='p-6'>
							<h2 className='text-xl font-bold mb-4'>
								{editingItem ? 'Edit Catalog Item' : 'Add New Catalog Item'}
							</h2>

							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='title'>
											Title
										</label>
										<input
											type='text'
											id='title'
											name='title'
											value={formData.title}
											onChange={handleInputChange}
											className='w-full p-2 border rounded'
											required
										/>
									</div>

									<div>
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
								</div>

								<div>
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
										rows={3}
										required
									/>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='price'>
										Price (optional)
									</label>
									<input
										type='text'
										id='price'
										name='price'
										value={formData.price}
										onChange={handleInputChange}
										className='w-full p-2 border rounded'
									/>
								</div>

								<div>
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

								<div>
									<div className='flex justify-between items-center mb-2'>
										<label className='block text-gray-700 text-sm font-bold'>Characteristics</label>
										<button
											type='button'
											onClick={addCharField}
											className='text-sm text-blue-500 hover:text-blue-700'
										>
											+ Add Characteristic
										</button>
									</div>

									{chars.map((char, index) => (
										<div key={index} className='flex mb-2 space-x-2'>
											<input
												type='text'
												placeholder='Name'
												value={char.key}
												onChange={e => handleCharChange(index, 'key', e.target.value)}
												className='flex-1 p-2 border rounded'
											/>
											<input
												type='text'
												placeholder='Value'
												value={char.value}
												onChange={e => handleCharChange(index, 'value', e.target.value)}
												className='flex-1 p-2 border rounded'
											/>
											{chars.length > 1 && (
												<button
													type='button'
													onClick={() => removeCharField(index)}
													className='p-2 text-red-500 hover:bg-red-50 rounded'
												>
													<FiTrash2 />
												</button>
											)}
										</div>
									))}
								</div>

								{error && <p className='text-red-500 text-sm'>{error}</p>}

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
										{editingItem ? 'Update' : 'Create'}
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
