'use client'

import { supabase } from '@/app/lib/supabase'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUpload } from 'react-icons/fi'
import Image from 'next/image'

interface Product {
  id: number
  title: string
  description: string
  image_url: string
  price: string
  category_id?: string | null
  category_name?: string
  specifications?: any
}

export default function ProductsAdmin() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useSupabase()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: '',
    description: '',
    image_url: '',
    price: '',
    category_id: null,
  })
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      Promise.all([fetchProducts(), fetchCategories()])
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProducts()
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

  async function fetchProducts() {
    setLoading(true)
    try {
      let query = supabase.from('products_with_category').select('*')

      if (selectedCategoryId !== 'all') {
        query = query.eq('category_id', selectedCategoryId)
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  function openEditModal(product: Product) {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      image_url: product.image_url,
      price: product.price || '',
      category_id: product.category_id,
    })

    // Store old image path for possible deletion
    if (product.image_url && product.image_url.includes('img/products/')) {
      const urlParts = product.image_url.split('img/products/')
      if (urlParts.length > 1) {
        setOldImagePath(`products/${urlParts[1]}`)
      }
    } else {
      setOldImagePath(null)
    }

    setIsModalOpen(true)
  }

  function openAddModal() {
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      image_url: '',
      price: '',
      category_id: null,
    })
    setOldImagePath(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProduct(null)
    setError(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
    if (name === 'category_id') {
      setFormData({
        ...formData,
        [name]: value === '' ? null : value,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const file = e.target.files[0]
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `products/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('img')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('img')
        .getPublicUrl(filePath)

      setFormData({
        ...formData,
        image_url: urlData.publicUrl,
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

    if (!formData.title || !formData.description) {
      setError('Title and description are required')
      return
    }

    try {
      if (editingProduct) {
        // If image URL has changed and old one was in Supabase storage, delete it
        if (oldImagePath && formData.image_url !== editingProduct.image_url) {
          await deleteOldImage()
        }

        const { error: updateError } = await supabase
          .from('catalog')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            price: formData.price,
            category_id: formData.category_id,
          })
          .eq('id', editingProduct.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('catalog')
          .insert([
            {
              title: formData.title,
              description: formData.description,
              image_url: formData.image_url,
              price: formData.price,
              category_id: formData.category_id,
            },
          ])

        if (insertError) throw insertError
      }

      await fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
      setError('Failed to save product')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const productToDelete = products.find(p => p.id === id)
      
      // Delete image from storage if it's stored in Supabase
      if (productToDelete?.image_url && productToDelete.image_url.includes('img/products/')) {
        const urlParts = productToDelete.image_url.split('img/products/')
        if (urlParts.length > 1) {
          const imagePath = `products/${urlParts[1]}`
          await supabase.storage.from('img').remove([imagePath])
        }
      }

      const { error } = await supabase.from('catalog').delete().eq('id', id)

      if (error) throw error

      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product')
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Products Management</h1>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <FiPlus className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Loading products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image_url ? (
                      <div className="h-16 w-16 relative">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.price || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{product.category_name || 'Uncategorized'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FiEdit2 className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for adding/editing products */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. $99.99"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-center px-3 py-3 border-2 border-dashed border-gray-300 rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="image-upload"
                                name="image"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                      {isUploading && (
                        <div className="mt-2 flex items-center justify-center">
                          <div className="spinner animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                          <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-1/3">
                      {formData.image_url ? (
                        <div className="relative h-40 w-full">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="h-full w-full object-contain border rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-full bg-gray-100 flex items-center justify-center border rounded">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isUploading}
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
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