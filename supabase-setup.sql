-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Basic services offered
CREATE TABLE IF NOT EXISTS public.services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Catalog items/products
CREATE TABLE IF NOT EXISTS public.catalog (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  specifications JSONB DEFAULT '{}'::jsonb,
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- General content for website (text, images, etc.)
CREATE TABLE IF NOT EXISTS public.general_content (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL,
  title TEXT,
  text TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact information
CREATE TABLE IF NOT EXISTS public.contacts (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert admin user
INSERT INTO public.users (email, password)
VALUES ('admin@example.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- Insert sample general content
INSERT INTO public.general_content (key, section, title, text, image_url)
VALUES 
  ('home_hero', 'home', 'Грузоподъемное оборудование', 'Надежные решения для вашего бизнеса', NULL),
  ('about_company', 'about', 'О компании', 'КРАН-МОНТАЖ - ведущая компания в области грузоподъемного оборудования...', NULL),
  ('contact_info', 'contacts', 'Наши контакты', 'Свяжитесь с нами для получения консультации', NULL)
ON CONFLICT (key) DO NOTHING;

-- Create storage bucket for images
-- Note: This needs to be done in the Supabase dashboard or via API
-- The following is just a reminder:
-- 1. Create 'images' bucket in Supabase Storage
-- 2. Set public access policies for the bucket

-- Grant appropriate permissions
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON public.services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.catalog  
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.general_content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for anonymous users (read-only)
CREATE POLICY "Allow read access to anonymous users" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to anonymous users" ON public.catalog
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to anonymous users" ON public.general_content
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to anonymous users" ON public.contacts
  FOR SELECT USING (true); 