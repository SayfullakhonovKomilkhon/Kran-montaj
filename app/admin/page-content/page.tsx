'use client'

import { supabase } from '@/app/lib/supabase'
import { useSupabase } from '@/app/providers/supabase-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiEdit2, FiPlus, FiSave, FiX, FiTrash2 } from 'react-icons/fi'

interface PageContent {
  id: string
  page: string
  section: string
  title: string | null
  content: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export default function PageContentAdmin() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useSupabase()
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState<string[]>([])
  const [selectedPage, setSelectedPage] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<PageContent>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPageContentData, setNewPageContentData] = useState({
    page: '',
    section: '',
    title: '',
    content: '',
    image_url: '',
  })
  const [isUploading, setIsUploading] = useState(false)
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
      fetchPageContent()
    }
  }, [user, selectedPage])

  async function fetchPageContent() {
    setLoading(true)
    try {
      let query = supabase.from('page_content').select('*')

      if (selectedPage !== 'all') {
        query = query.eq('page', selectedPage)
      }

      const { data, error } = await query.order('page', { ascending: true }).order('section')

      if (error) throw error

      setPageContent(data || [])

      // Extract unique pages
      if (data && data.length > 0) {
        const uniquePages = Array.from(new Set(data.map(item => item.page)))
        setPages(uniquePages)
      }
    } catch (error) {
      console.error('Error fetching page content:', error)
      setError('Failed to load page content')
    } finally {
      setLoading(false)
    }
  }

  function startEditing(item: PageContent) {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url,
    })
    
    // Store old image path for possible deletion
    if (item.image_url && item.image_url.includes('img/page-content/')) {
      const urlParts = item.image_url.split('img/page-content/')
      if (urlParts.length > 1) {
        setOldImagePath(`page-content/${urlParts[1]}`)
      }
    } else {
      setOldImagePath(null)
    }
    
    setError(null)
    setSuccess(null)
  }

  function cancelEditing() {
    setEditingId(null)
    setFormData({})
    setError(null)
    setSuccess(null)
    setOldImagePath(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNewContentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPageContentData({
      ...newPageContentData,
      [name]: value,
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isNewContent: boolean = false) {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const file = e.target.files[0]
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `page-content/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('img')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('img')
        .getPublicUrl(filePath)

      if (isNewContent) {
        setNewPageContentData({
          ...newPageContentData,
          image_url: urlData.publicUrl,
        })
      } else {
        setFormData({
          ...formData,
          image_url: urlData.publicUrl,
        })
      }
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

  async function saveChanges(item: PageContent) {
    setError(null)
    setSuccess(null)

    try {
      // If image URL has changed and old one was in Supabase storage, delete it
      if (oldImagePath && formData.image_url !== item.image_url) {
        await deleteOldImage()
      }
      
      const { error } = await supabase
        .from('page_content')
        .update({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)

      if (error) throw error

      // Update local content
      const updatedContent = pageContent.map(c =>
        c.id === item.id ? { ...c, ...formData, updated_at: new Date().toISOString() } : c
      )
      setPageContent(updatedContent)

      setSuccess('Content updated successfully')
      setEditingId(null)
      setFormData({})
      setOldImagePath(null)
    } catch (error) {
      console.error('Error saving content:', error)
      setError('Failed to save content')
    }
  }

  function openAddModal() {
    setNewPageContentData({
      page: '',
      section: '',
      title: '',
      content: '',
      image_url: '',
    })
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  function closeModal() {
    setIsModalOpen(false)
    setError(null)
  }

  async function addNewPageContent(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!newPageContentData.page || !newPageContentData.section) {
      setError('Page and section are required')
      return
    }

    try {
      const { error } = await supabase
        .from('page_content')
        .insert([
          {
            page: newPageContentData.page,
            section: newPageContentData.section,
            title: newPageContentData.title || null,
            content: newPageContentData.content || null,
            image_url: newPageContentData.image_url || null,
          },
        ])
        .select()

      if (error) throw error

      await fetchPageContent()
      setSuccess('New content added successfully')
      setIsModalOpen(false)
    } catch (error: unknown) {
      console.error('Error adding new content:', error)
      const err = error as { message?: string }
      if (err.message?.includes('duplicate key value violates unique constraint')) {
        setError('A content with this page and section already exists')
      } else {
        setError('Failed to add new content')
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this content?')) {
      return
    }

    try {
      const contentToDelete = pageContent.find(p => p.id === id)
      
      // Delete image from storage if it's stored in Supabase
      if (contentToDelete?.image_url && contentToDelete.image_url.includes('img/page-content/')) {
        const urlParts = contentToDelete.image_url.split('img/page-content/')
        if (urlParts.length > 1) {
          const imagePath = `page-content/${urlParts[1]}`
          await supabase.storage.from('img').remove([imagePath])
        }
      }
      
      const { error } = await supabase.from('page_content').delete().eq('id', id)

      if (error) throw error

      // Update local state
      setPageContent(pageContent.filter(item => item.id !== id))
      setSuccess('Content deleted successfully')
    } catch (error) {
      console.error('Error deleting content:', error)
      setError('Failed to delete content')
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
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Page Content Management</h1>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Pages</option>
            {pages.map((page) => (
              <option key={page} value={page}>{page}</option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <FiPlus className="mr-2" /> Add Content
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-lg">Loading content...</div>
        </div>
      ) : pageContent.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No content found. Try selecting a different page or add new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pageContent.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{item.section}</h2>
                  <p className="text-sm text-gray-500">Page: {item.page}</p>
                </div>
                <div className="flex space-x-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={() => saveChanges(item)}
                        className="text-green-600 hover:text-green-900 p-2"
                        title="Save changes"
                      >
                        <FiSave />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-600 hover:text-gray-900 p-2"
                        title="Cancel editing"
                      >
                        <FiX />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(item)}
                        className="text-blue-600 hover:text-blue-900 p-2"
                        title="Edit content"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                        title="Delete content"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-6">
                {editingId === item.id ? (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`title-${item.id}`}>
                        Title
                      </label>
                      <input
                        id={`title-${item.id}`}
                        name="title"
                        type="text"
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`content-${item.id}`}>
                        Content
                      </label>
                      <textarea
                        id={`content-${item.id}`}
                        name="content"
                        value={formData.content || ''}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full p-2 border rounded"
                      />
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
                                  htmlFor={`image-upload-${item.id}`}
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id={`image-upload-${item.id}`}
                                    name="image"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e)}
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
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Title</h3>
                      <p className="text-gray-900">{item.title || <span className="text-gray-400 italic">No title</span>}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Content</h3>
                      <p className="text-gray-900 whitespace-pre-line">{item.content || <span className="text-gray-400 italic">No content</span>}</p>
                    </div>
                    {item.image_url && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Image</h3>
                        <div className="mt-1 max-w-xs">
                          <img 
                            src={item.image_url} 
                            alt={item.title || item.section} 
                            className="rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding new page content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Page Content</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={addNewPageContent} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="page">
                    Page *
                  </label>
                  <input
                    id="page"
                    name="page"
                    type="text"
                    required
                    value={newPageContentData.page}
                    onChange={handleNewContentInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. home, about, catalog"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="section">
                    Section *
                  </label>
                  <input
                    id="section"
                    name="section"
                    type="text"
                    required
                    value={newPageContentData.section}
                    onChange={handleNewContentInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. hero, services, footer"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={newPageContentData.title}
                    onChange={handleNewContentInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Section title"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={newPageContentData.content}
                    onChange={handleNewContentInputChange}
                    rows={4}
                    className="w-full p-2 border rounded"
                    placeholder="Section content"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-center px-3 py-3 border-2 border-dashed border-gray-300 rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="new-image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="new-image-upload"
                                name="image"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true)}
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
                    
                    {newPageContentData.image_url && (
                      <div className="w-full">
                        <div className="relative h-40 w-full">
                          <img
                            src={newPageContentData.image_url}
                            alt="Preview"
                            className="h-full w-full object-contain border rounded"
                          />
                        </div>
                      </div>
                    )}
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
                    Add Content
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