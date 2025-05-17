-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Categories for services
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Basic services offered
CREATE TABLE IF NOT EXISTS public.services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES public.categories(id),
  order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a view for services joined with category info
CREATE OR REPLACE VIEW public.services_with_category AS
SELECT 
  s.id,
  s.title,
  s.description,
  s.image_url,
  s.category_id,
  s.order,
  s.created_at,
  s.updated_at,
  c.name as category_name
FROM 
  public.services s
LEFT JOIN 
  public.categories c ON s.category_id = c.id;

-- Sample services data
INSERT INTO public.services (title, description, category_id, order)
VALUES
  ('Монтаж башенных кранов', 'Профессиональный монтаж башенных кранов любой сложности.', 1, 1),
  ('Техническое обслуживание', 'Регулярное обслуживание для поддержания работоспособности оборудования.', 2, 2),
  ('Ремонт мостовых кранов', 'Качественный ремонт мостовых и козловых кранов с гарантией.', 3, 3)
ON CONFLICT DO NOTHING;

-- Catalog items/products
CREATE TABLE IF NOT EXISTS public.catalog (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES public.categories(id),
  specifications JSONB DEFAULT '{}'::jsonb,
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a view for products joined with category info
CREATE OR REPLACE VIEW public.products_with_category AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.image_url,
  p.category_id,
  p.specifications,
  p.price,
  p.created_at,
  p.updated_at,
  c.name as category_name
FROM 
  public.catalog p
LEFT JOIN 
  public.categories c ON p.category_id = c.id;

-- Page content for section headers and content
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page, section)
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

-- Insert sample categories
INSERT INTO public.categories (name, slug, description)
VALUES 
  ('Монтаж кранов', 'installation', 'Профессиональный монтаж грузоподъемного оборудования с соблюдением всех норм безопасности'),
  ('Техобслуживание', 'maintenance', 'Регулярное обслуживание и профилактика для увеличения срока службы оборудования'),
  ('Ремонт кранов', 'repair', 'Оперативный ремонт всех видов грузоподъемного оборудования с гарантией качества'),
  ('Сертификация', 'certification', 'Полный комплекс услуг по сертификации и экспертизе грузоподъемного оборудования'),
  ('Запчасти', 'parts', 'Оригинальные запчасти и комплектующие для всех типов кранов и подъемников')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample general content
INSERT INTO public.general_content (key, section, title, text, image_url)
VALUES 
  ('home_hero', 'home', 'Грузоподъемное оборудование', 'Надежные решения для вашего бизнеса', NULL),
  ('about_company', 'about', 'О компании', 'КРАН-МОНТАЖ - ведущая компания в области грузоподъемного оборудования...', NULL),
  ('contact_info', 'contacts', 'Наши контакты', 'Свяжитесь с нами для получения консультации', NULL)
ON CONFLICT (key) DO NOTHING;

-- Insert sample page content
INSERT INTO public.page_content (page, section, title, content)
VALUES 
  ('home', 'hero', 'Crane Installation Experts', 'Professional crane installation services with safety and quality'),
  ('home', 'services', 'Our Services', 'We offer a wide range of crane-related services'),
  ('home', 'catalog', 'Our Products', 'View our catalog of crane equipment and parts'),
  ('catalog', 'hero', 'Product Catalog', 'Browse our selection of high-quality crane parts and equipment'),
  ('services', 'hero', 'Our Services', 'Professional crane services for all your needs'),
  ('about', 'hero', 'About Us', 'Learn more about our company and our expertise')
ON CONFLICT (page, section) DO NOTHING;

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
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON public.services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.catalog  
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.general_content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.contacts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.page_content
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

CREATE POLICY "Allow read access to anonymous users" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow read access to anonymous users" ON public.page_content
  FOR SELECT USING (true); 