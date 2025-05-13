import { supabase } from './supabase';

// Services data
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });
    
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  
  return data || [];
}

// Catalog data
export async function getCatalogItems(category?: string) {
  let query = supabase
    .from('catalog')
    .select('*');
    
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching catalog items:', error);
    return [];
  }
  
  return data || [];
}

export async function getCatalogCategories() {
  const { data, error } = await supabase
    .from('catalog')
    .select('category')
    .order('category');
    
  if (error) {
    console.error('Error fetching catalog categories:', error);
    return [];
  }
  
  // Extract unique categories
  const categories = Array.from(new Set(data?.map(item => item.category) || []));
  return categories;
}

export async function getCatalogItem(id: number) {
  const { data, error } = await supabase
    .from('catalog')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching catalog item ${id}:`, error);
    return null;
  }
  
  return data;
}

// General content
export async function getGeneralContent(section?: string, key?: string) {
  let query = supabase
    .from('general_content')
    .select('*');
    
  if (section) {
    query = query.eq('section', section);
  }
  
  if (key) {
    query = query.eq('key', key);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching general content:', error);
    return [];
  }
  
  return data || [];
}

export async function getContentByKey(key: string) {
  const { data, error } = await supabase
    .from('general_content')
    .select('*')
    .eq('key', key)
    .single();
    
  if (error) {
    console.error(`Error fetching content for key ${key}:`, error);
    return null;
  }
  
  return data;
}

// Contact information
export async function getContacts(type?: string) {
  let query = supabase
    .from('contacts')
    .select('*')
    .order('order', { ascending: true });
    
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  
  return data || [];
}

// Helper to check if Supabase connection is working
export async function checkSupabaseConnection() {
  const { data, error } = await supabase
    .from('general_content')
    .select('count(*)', { count: 'exact', head: true });
    
  if (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
  
  return true;
} 