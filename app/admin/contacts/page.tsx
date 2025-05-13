'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { FiEdit2, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';

interface ContactInfo {
  id: number;
  type: string;
  value: string;
  label?: string;
  order?: number;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<ContactInfo, 'id'>>({
    type: '',
    value: '',
    label: '',
    order: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }

  function startEditing(contact: ContactInfo) {
    setEditingId(contact.id);
    setFormData({
      type: contact.type,
      value: contact.value,
      label: contact.label || '',
      order: contact.order || 0,
    });
    setError(null);
    setSuccess(null);
  }

  function openAddModal() {
    setIsAddModalOpen(true);
    setFormData({
      type: '',
      value: '',
      label: '',
      order: contacts.length > 0 ? Math.max(...contacts.map(c => c.order || 0)) + 1 : 1,
    });
    setError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setIsAddModalOpen(false);
    setFormData({
      type: '',
      value: '',
      label: '',
      order: 0,
    });
    setError(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    });
  };

  async function saveChanges(id: number) {
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('contacts')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      
      // Update local contacts
      const updatedContacts = contacts.map(c => 
        c.id === id ? { ...c, ...formData } : c
      );
      setContacts(updatedContacts);
      
      setSuccess('Contact updated successfully');
      setEditingId(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      setError('Failed to save contact');
    }
  }

  async function addContact() {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([formData])
        .select();

      if (error) throw error;
      
      // Update local contacts
      setContacts([...contacts, ...(data || [])]);
      
      setSuccess('Contact added successfully');
      setIsAddModalOpen(false);
      setFormData({
        type: '',
        value: '',
        label: '',
        order: 0,
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact');
    }
  }

  async function deleteContact(id: number) {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local contacts
      setContacts(contacts.filter(c => c.id !== id));
      
      setSuccess('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Failed to delete contact');
    }
  }

  const contactTypeOptions = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'address', label: 'Address' },
    { value: 'hours', label: 'Business Hours' },
    { value: 'social', label: 'Social Media' },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Contacts Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={openAddModal}
        >
          <FiPlus className="mr-2" /> Add Contact
        </button>
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
          <div className="animate-pulse text-lg">Loading contacts...</div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">No contacts found. Add your first contact to get started.</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            onClick={openAddModal}
          >
            <FiPlus className="mr-2" /> Add Contact
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === contact.id ? (
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select Type</option>
                        {contactTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {contactTypeOptions.find(opt => opt.value === contact.type)?.label || contact.type}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === contact.id ? (
                      <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Label (optional)"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{contact.label || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === contact.id ? (
                      <input
                        type="text"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    ) : (
                      <span className="text-sm text-gray-900 whitespace-pre-wrap">{contact.value}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === contact.id ? (
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        min="1"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{contact.order || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === contact.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveChanges(contact.id)}
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => startEditing(contact)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FiEdit2 className="inline" />
                        </button>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="inline" />
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

      {/* Modal for adding new contact */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Type</option>
                    {contactTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Main Office, Support, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
                    Value
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addContact}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 