'use client'

import { supabase } from '@/app/lib/supabase'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiEdit2, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi'

interface Category {
	id: string
	name: string
}

export default function CategoriesManagement() {
	const router = useRouter()
	const { user, isLoading: authLoading } = useSupabase()
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [isAddModalOpen, setIsAddModalOpen] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
	})
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	// Session guard - redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/admin/login')
		}
	}, [user, authLoading, router])

	useEffect(() => {
		if (user) {
			fetchCategories()
		}
	}, [user])

	async function fetchCategories() {
		setLoading(true)
		try {
			const { data, error } = await supabase.from('categories').select('*').order('name')

			if (error) throw error
			setCategories(data || [])
		} catch (error) {
			console.error('Error fetching categories:', error)
			setError('Failed to load categories')
		} finally {
			setLoading(false)
		}
	}

	function startEditing(category: Category) {
		setEditingId(category.id)
		setFormData({
			name: category.name,
		})
		setError(null)
		setSuccess(null)
	}

	function openAddModal() {
		setIsAddModalOpen(true)
		setFormData({
			name: '',
		})
		setError(null)
	}

	function cancelEditing() {
		setEditingId(null)
		setIsAddModalOpen(false)
		setFormData({
			name: '',
		})
		setError(null)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	async function saveChanges(id: string) {
		setError(null)
		setSuccess(null)

		try {
			const { error } = await supabase
				.from('categories')
				.update({ name: formData.name })
				.eq('id', id)

			if (error) throw error

			// Update local categories
			const updatedCategories = categories.map(c =>
				c.id === id ? { ...c, name: formData.name } : c
			)
			setCategories(updatedCategories)

			setSuccess('Category updated successfully')
			setEditingId(null)
		} catch (error) {
			console.error('Error saving category:', error)
			setError('Failed to save category')
		}
	}

	async function addCategory() {
		setError(null)

		if (!formData.name.trim()) {
			setError('Category name cannot be empty')
			return
		}

		try {
			const { data, error } = await supabase
				.from('categories')
				.insert([{ name: formData.name.trim() }])
				.select()

			if (error) throw error

			// Update local categories
			setCategories([...categories, ...(data || [])])

			setSuccess('Category added successfully')
			setIsAddModalOpen(false)
			setFormData({
				name: '',
			})
		} catch (error: unknown) {
			console.error('Error adding category:', error)
			const err = error as { code?: string }
			if (err.code === '23505') {
				setError('A category with this name already exists')
			} else {
				setError('Failed to add category')
			}
		}
	}

	async function deleteCategory(id: string) {
		if (
			!confirm(
				'Are you sure you want to delete this category? Products and services associated with this category will lose their category relationship.'
			)
		) {
			return
		}

		try {
			const { error } = await supabase.from('categories').delete().eq('id', id)

			if (error) throw error

			// Update local categories
			setCategories(categories.filter(c => c.id !== id))

			setSuccess('Category deleted successfully')
		} catch (error) {
			console.error('Error deleting category:', error)
			setError('Failed to delete category')
		}
	}

	// Show loading spinner while checking authentication
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

	// Don't render if not authenticated
	if (!user) {
		return null
	}

	return (
		<div className='container mx-auto px-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl md:text-3xl font-bold'>Categories Management</h1>
				<button
					className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center'
					onClick={openAddModal}
				>
					<FiPlus className='mr-2' /> Add Category
				</button>
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
					<div className='animate-pulse text-lg'>Loading categories...</div>
				</div>
			) : categories.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<p className='text-gray-600 mb-4'>
						No categories found. Add your first category to get started.
					</p>
					<button
						className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto'
						onClick={openAddModal}
					>
						<FiPlus className='mr-2' /> Add Category
					</button>
				</div>
			) : (
				<div className='bg-white rounded-lg shadow overflow-hidden'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Name
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{categories.map(category => (
								<tr key={category.id}>
									<td className='px-6 py-4 whitespace-nowrap'>
										{editingId === category.id ? (
											<input
												type='text'
												name='name'
												value={formData.name}
												onChange={handleInputChange}
												className='w-full p-2 border rounded'
												required
											/>
										) : (
											<span className='text-sm font-medium text-gray-900'>{category.name}</span>
										)}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										{editingId === category.id ? (
											<div className='flex justify-end space-x-2'>
												<button
													type='button'
													onClick={cancelEditing}
													className='text-gray-500 hover:text-gray-700'
												>
													Cancel
												</button>
												<button
													type='button'
													onClick={() => saveChanges(category.id)}
													className='text-blue-500 hover:text-blue-700 flex items-center'
												>
													<FiSave className='mr-1' /> Save
												</button>
											</div>
										) : (
											<div className='flex justify-end space-x-2'>
												<button
													onClick={() => startEditing(category)}
													className='text-blue-500 hover:text-blue-700'
												>
													<FiEdit2 className='inline' />
												</button>
												<button
													onClick={() => deleteCategory(category.id)}
													className='text-red-500 hover:text-red-700'
												>
													<FiTrash2 className='inline' />
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Modal for adding new category */}
			{isAddModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
					<div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
						<div className='p-6'>
							<h2 className='text-xl font-bold mb-4'>Add New Category</h2>

							<form className='space-y-4'>
								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
										Category Name
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

								{error && <p className='text-red-500 text-sm'>{error}</p>}

								<div className='flex justify-end space-x-2'>
									<button
										type='button'
										onClick={cancelEditing}
										className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'
									>
										Cancel
									</button>
									<button
										type='button'
										onClick={addCategory}
										className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
									>
										Add Category
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
