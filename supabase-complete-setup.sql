-- ============================================================
-- ПОЛНЫЙ SQL КОД ДЛЯ НАСТРОЙКИ SUPABASE
-- Проект: КРАН-МОНТАЖ - грузоподъемное оборудование
-- ============================================================

-- ============================================================
-- ЧАСТЬ 1: РАСШИРЕНИЯ И НАСТРОЙКИ
-- ============================================================

-- Включаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ЧАСТЬ 2: УДАЛЕНИЕ СУЩЕСТВУЮЩИХ ОБЪЕКТОВ (если нужно пересоздать)
-- ============================================================

-- Раскомментируйте эти строки если нужно пересоздать базу данных
/*
DROP VIEW IF EXISTS public.products_with_category CASCADE;
DROP VIEW IF EXISTS public.services_with_category CASCADE;
DROP TABLE IF EXISTS public.page_content CASCADE;
DROP TABLE IF EXISTS public.general_content CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
*/

-- ============================================================
-- ЧАСТЬ 3: ФУНКЦИЯ ДЛЯ АВТООБНОВЛЕНИЯ UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ЧАСТЬ 4: ТАБЛИЦА КАТЕГОРИЙ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.categories IS 'Категории для услуг и продуктов';
COMMENT ON COLUMN public.categories.id IS 'Уникальный идентификатор категории';
COMMENT ON COLUMN public.categories.name IS 'Название категории';
COMMENT ON COLUMN public.categories.slug IS 'URL-slug категории';
COMMENT ON COLUMN public.categories.description IS 'Описание категории';

-- ============================================================
-- ЧАСТЬ 5: ТАБЛИЦА УСЛУГ (SERVICES)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    "order" INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для services
CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services("order");

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.services IS 'Услуги компании';
COMMENT ON COLUMN public.services.id IS 'Уникальный идентификатор услуги';
COMMENT ON COLUMN public.services.name IS 'Название услуги';
COMMENT ON COLUMN public.services.description IS 'Описание услуги';
COMMENT ON COLUMN public.services.image_url IS 'URL изображения услуги';
COMMENT ON COLUMN public.services.category_id IS 'ID категории услуги';
COMMENT ON COLUMN public.services."order" IS 'Порядок отображения';

-- ============================================================
-- ЧАСТЬ 6: ТАБЛИЦА ПРОДУКТОВ (PRODUCTS/CATALOG)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    characteristics JSONB DEFAULT '{}'::jsonb,
    price TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_title ON public.products(title);
CREATE INDEX IF NOT EXISTS idx_products_characteristics ON public.products USING GIN (characteristics);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.products IS 'Каталог продуктов/оборудования';
COMMENT ON COLUMN public.products.id IS 'Уникальный идентификатор продукта';
COMMENT ON COLUMN public.products.title IS 'Название продукта';
COMMENT ON COLUMN public.products.description IS 'Описание продукта';
COMMENT ON COLUMN public.products.image_url IS 'URL изображения продукта';
COMMENT ON COLUMN public.products.category_id IS 'ID категории продукта';
COMMENT ON COLUMN public.products.characteristics IS 'Технические характеристики (JSON)';
COMMENT ON COLUMN public.products.price IS 'Цена продукта';

-- ============================================================
-- ЧАСТЬ 7: ТАБЛИЦА КОНТАКТОВ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('phone', 'email', 'address', 'hours', 'social', 'telegram', 'whatsapp', 'instagram', 'facebook')),
    value TEXT NOT NULL,
    label TEXT,
    "order" INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для contacts
CREATE INDEX IF NOT EXISTS idx_contacts_type ON public.contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_order ON public.contacts("order");
CREATE INDEX IF NOT EXISTS idx_contacts_is_active ON public.contacts(is_active);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.contacts IS 'Контактная информация компании';
COMMENT ON COLUMN public.contacts.type IS 'Тип контакта: phone, email, address, hours, social и др.';
COMMENT ON COLUMN public.contacts.value IS 'Значение контакта';
COMMENT ON COLUMN public.contacts.label IS 'Подпись/название контакта';
COMMENT ON COLUMN public.contacts."order" IS 'Порядок отображения';
COMMENT ON COLUMN public.contacts.is_active IS 'Активен ли контакт';

-- ============================================================
-- ЧАСТЬ 8: ТАБЛИЦА ОБЩЕГО КОНТЕНТА
-- ============================================================

CREATE TABLE IF NOT EXISTS public.general_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    section TEXT NOT NULL,
    title TEXT,
    text TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для general_content
CREATE INDEX IF NOT EXISTS idx_general_content_key ON public.general_content(key);
CREATE INDEX IF NOT EXISTS idx_general_content_section ON public.general_content(section);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_general_content_updated_at ON public.general_content;
CREATE TRIGGER update_general_content_updated_at
    BEFORE UPDATE ON public.general_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.general_content IS 'Общий контент сайта (тексты, изображения)';
COMMENT ON COLUMN public.general_content.key IS 'Уникальный ключ контента';
COMMENT ON COLUMN public.general_content.section IS 'Секция/раздел сайта';
COMMENT ON COLUMN public.general_content.title IS 'Заголовок';
COMMENT ON COLUMN public.general_content.text IS 'Текстовое содержимое';
COMMENT ON COLUMN public.general_content.image_url IS 'URL изображения';
COMMENT ON COLUMN public.general_content.metadata IS 'Дополнительные данные (JSON)';

-- ============================================================
-- ЧАСТЬ 9: ТАБЛИЦА КОНТЕНТА СТРАНИЦ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    title TEXT,
    content TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page, section)
);

-- Индексы для page_content
CREATE INDEX IF NOT EXISTS idx_page_content_page ON public.page_content(page);
CREATE INDEX IF NOT EXISTS idx_page_content_section ON public.page_content(section);
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON public.page_content(page, section);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_page_content_updated_at ON public.page_content;
CREATE TRIGGER update_page_content_updated_at
    BEFORE UPDATE ON public.page_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.page_content IS 'Контент конкретных страниц и секций';
COMMENT ON COLUMN public.page_content.page IS 'Имя страницы (home, about, catalog, services, contacts)';
COMMENT ON COLUMN public.page_content.section IS 'Секция на странице (hero, features, cta и т.д.)';
COMMENT ON COLUMN public.page_content.title IS 'Заголовок секции';
COMMENT ON COLUMN public.page_content.content IS 'Основной контент секции';
COMMENT ON COLUMN public.page_content.image_url IS 'URL изображения секции';
COMMENT ON COLUMN public.page_content.metadata IS 'Дополнительные данные (JSON)';

-- ============================================================
-- ЧАСТЬ 10: ТАБЛИЦА О КОМПАНИИ (ABOUT)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_key TEXT NOT NULL UNIQUE,
    title TEXT,
    content TEXT,
    image_url TEXT,
    icon TEXT,
    "order" INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для about_content
CREATE INDEX IF NOT EXISTS idx_about_content_block_key ON public.about_content(block_key);
CREATE INDEX IF NOT EXISTS idx_about_content_order ON public.about_content("order");
CREATE INDEX IF NOT EXISTS idx_about_content_is_active ON public.about_content(is_active);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_about_content_updated_at ON public.about_content;
CREATE TRIGGER update_about_content_updated_at
    BEFORE UPDATE ON public.about_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.about_content IS 'Контент страницы "О компании"';
COMMENT ON COLUMN public.about_content.block_key IS 'Уникальный ключ блока (company_info, mission, values, stats и т.д.)';
COMMENT ON COLUMN public.about_content.title IS 'Заголовок блока';
COMMENT ON COLUMN public.about_content.content IS 'Содержимое блока';
COMMENT ON COLUMN public.about_content.image_url IS 'URL изображения';
COMMENT ON COLUMN public.about_content.icon IS 'Название иконки';
COMMENT ON COLUMN public.about_content."order" IS 'Порядок отображения';

-- ============================================================
-- ЧАСТЬ 11: ТАБЛИЦА СТАТИСТИКИ КОМПАНИИ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.company_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT,
    "order" INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для company_stats
CREATE INDEX IF NOT EXISTS idx_company_stats_stat_key ON public.company_stats(stat_key);
CREATE INDEX IF NOT EXISTS idx_company_stats_order ON public.company_stats("order");

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_company_stats_updated_at ON public.company_stats;
CREATE TRIGGER update_company_stats_updated_at
    BEFORE UPDATE ON public.company_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии к таблице
COMMENT ON TABLE public.company_stats IS 'Статистика компании (опыт, проекты, клиенты)';
COMMENT ON COLUMN public.company_stats.stat_key IS 'Ключ статистики (experience, projects, clients, employees)';
COMMENT ON COLUMN public.company_stats.label IS 'Подпись статистики';
COMMENT ON COLUMN public.company_stats.value IS 'Значение статистики';

-- ============================================================
-- ЧАСТЬ 12: ПРЕДСТАВЛЕНИЯ (VIEWS)
-- ============================================================

-- View для продуктов с информацией о категории
CREATE OR REPLACE VIEW public.products_with_category AS
SELECT 
    p.id,
    p.title,
    p.description,
    p.image_url,
    p.category_id,
    p.characteristics,
    p.price,
    p.created_at,
    p.updated_at,
    c.name as category_name,
    c.slug as category_slug
FROM 
    public.products p
LEFT JOIN 
    public.categories c ON p.category_id = c.id
ORDER BY p.created_at DESC;

-- View для услуг с информацией о категории
CREATE OR REPLACE VIEW public.services_with_category AS
SELECT 
    s.id,
    s.name,
    s.description,
    s.image_url,
    s.category_id,
    s."order",
    s.created_at,
    s.updated_at,
    c.name as category_name,
    c.slug as category_slug
FROM 
    public.services s
LEFT JOIN 
    public.categories c ON s.category_id = c.id
ORDER BY s."order" ASC, s.created_at DESC;

-- Комментарии к представлениям
COMMENT ON VIEW public.products_with_category IS 'Продукты с информацией о категории';
COMMENT ON VIEW public.services_with_category IS 'Услуги с информацией о категории';

-- ============================================================
-- ЧАСТЬ 13: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Включаем RLS для всех таблиц
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_stats ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ЧАСТЬ 14: ПОЛИТИКИ ДОСТУПА
-- ============================================================

-- Удаляем существующие политики (если есть)
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.services;
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.products;
DROP POLICY IF EXISTS "Allow public read access" ON public.contacts;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.contacts;
DROP POLICY IF EXISTS "Allow public read access" ON public.general_content;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.general_content;
DROP POLICY IF EXISTS "Allow public read access" ON public.page_content;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.page_content;
DROP POLICY IF EXISTS "Allow public read access" ON public.about_content;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.about_content;
DROP POLICY IF EXISTS "Allow public read access" ON public.company_stats;
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.company_stats;

-- Политики для categories
CREATE POLICY "Allow public read access" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для services
CREATE POLICY "Allow public read access" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access" ON public.services
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для products
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для contacts
CREATE POLICY "Allow public read access" ON public.contacts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON public.contacts
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для general_content
CREATE POLICY "Allow public read access" ON public.general_content
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access" ON public.general_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для page_content
CREATE POLICY "Allow public read access" ON public.page_content
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access" ON public.page_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для about_content
CREATE POLICY "Allow public read access" ON public.about_content
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON public.about_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Политики для company_stats
CREATE POLICY "Allow public read access" ON public.company_stats
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON public.company_stats
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- ЧАСТЬ 15: НАЧАЛЬНЫЕ ДАННЫЕ - КАТЕГОРИИ
-- ============================================================

INSERT INTO public.categories (name, slug, description) VALUES 
    ('Монтаж кранов', 'installation', 'Профессиональный монтаж грузоподъемного оборудования с соблюдением всех норм безопасности'),
    ('Техобслуживание', 'maintenance', 'Регулярное обслуживание и профилактика для увеличения срока службы оборудования'),
    ('Ремонт кранов', 'repair', 'Оперативный ремонт всех видов грузоподъемного оборудования с гарантией качества'),
    ('Сертификация', 'certification', 'Полный комплекс услуг по сертификации и экспертизе грузоподъемного оборудования'),
    ('Запчасти', 'parts', 'Оригинальные запчасти и комплектующие для всех типов кранов и подъемников'),
    ('Мостовые краны', 'bridge-cranes', 'Мостовые и подвесные краны различной грузоподъемности'),
    ('Козловые краны', 'gantry-cranes', 'Козловые и полукозловые краны'),
    ('Башенные краны', 'tower-cranes', 'Башенные краны для строительства'),
    ('Тали и тельферы', 'hoists', 'Электрические и ручные тали, тельферы')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 16: НАЧАЛЬНЫЕ ДАННЫЕ - УСЛУГИ
-- ============================================================

INSERT INTO public.services (name, description, category_id, "order") VALUES 
    (
        'Монтаж башенных кранов',
        'Профессиональный монтаж башенных кранов любой сложности с соблюдением всех норм безопасности. Наши специалисты имеют многолетний опыт работы и необходимые сертификаты.',
        (SELECT id FROM public.categories WHERE slug = 'tower-cranes'),
        1
    ),
    (
        'Монтаж мостовых кранов',
        'Установка мостовых и подвесных кранов на производственных объектах. Полный цикл работ от проектирования до пуско-наладки.',
        (SELECT id FROM public.categories WHERE slug = 'bridge-cranes'),
        2
    ),
    (
        'Техническое обслуживание кранов',
        'Регулярное техническое обслуживание для поддержания работоспособности оборудования. Профилактика поломок и увеличение срока службы.',
        (SELECT id FROM public.categories WHERE slug = 'maintenance'),
        3
    ),
    (
        'Ремонт грузоподъемного оборудования',
        'Качественный ремонт мостовых, козловых и башенных кранов с гарантией. Диагностика, замена узлов и агрегатов.',
        (SELECT id FROM public.categories WHERE slug = 'repair'),
        4
    ),
    (
        'Сертификация и экспертиза',
        'Полный комплекс услуг по сертификации грузоподъемного оборудования. Техническое освидетельствование и экспертиза промышленной безопасности.',
        (SELECT id FROM public.categories WHERE slug = 'certification'),
        5
    ),
    (
        'Поставка запчастей',
        'Поставка оригинальных запчастей и комплектующих для всех типов кранов. Быстрая доставка по всей стране.',
        (SELECT id FROM public.categories WHERE slug = 'parts'),
        6
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- ЧАСТЬ 17: НАЧАЛЬНЫЕ ДАННЫЕ - ПРОДУКТЫ (КАТАЛОГ)
-- ============================================================

INSERT INTO public.products (title, description, category_id, characteristics, price) VALUES 
    (
        'Мостовой кран 5 тонн',
        'Электрический мостовой кран грузоподъемностью 5 тонн. Предназначен для механизации погрузочно-разгрузочных работ на складах, производственных цехах и ремонтных мастерских.',
        (SELECT id FROM public.categories WHERE slug = 'bridge-cranes'),
        '{"Грузоподъемность": "5 тонн", "Пролет": "от 4.5 до 28.5 м", "Высота подъема": "до 12 м", "Скорость подъема": "8 м/мин", "Скорость передвижения тележки": "20 м/мин", "Скорость передвижения крана": "32 м/мин"}'::jsonb,
        'от 850 000'
    ),
    (
        'Мостовой кран 10 тонн',
        'Мощный мостовой кран для тяжелых производственных задач. Идеально подходит для машиностроительных заводов, металлургических предприятий.',
        (SELECT id FROM public.categories WHERE slug = 'bridge-cranes'),
        '{"Грузоподъемность": "10 тонн", "Пролет": "от 10.5 до 34.5 м", "Высота подъема": "до 16 м", "Скорость подъема": "6.3 м/мин", "Управление": "кабина или пульт ДУ"}'::jsonb,
        'от 1 250 000'
    ),
    (
        'Козловой кран 12.5 тонн',
        'Козловой кран для работы на открытых площадках. Применяется для погрузки/разгрузки контейнеров, металлопроката и строительных материалов.',
        (SELECT id FROM public.categories WHERE slug = 'gantry-cranes'),
        '{"Грузоподъемность": "12.5 тонн", "Пролет": "от 12 до 32 м", "Высота подъема": "до 9 м", "Вылет консоли": "до 7 м", "Напряжение": "380 В"}'::jsonb,
        'от 2 100 000'
    ),
    (
        'Электрическая таль 2 тонны',
        'Компактная электрическая таль для использования в качестве самостоятельного подъемного механизма или механизма подъема мостового крана.',
        (SELECT id FROM public.categories WHERE slug = 'hoists'),
        '{"Грузоподъемность": "2 тонны", "Высота подъема": "6/9/12 м", "Скорость подъема": "8 м/мин", "Напряжение": "380 В", "Режим работы": "М5"}'::jsonb,
        'от 125 000'
    ),
    (
        'Электрическая таль 5 тонн',
        'Надежная электрическая таль повышенной грузоподъемности. Оснащена частотным преобразователем для плавного пуска и точного позиционирования.',
        (SELECT id FROM public.categories WHERE slug = 'hoists'),
        '{"Грузоподъемность": "5 тонн", "Высота подъема": "до 30 м", "Скорость подъема": "5 м/мин", "Класс защиты": "IP54", "Режим работы": "М6"}'::jsonb,
        'от 285 000'
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- ЧАСТЬ 18: НАЧАЛЬНЫЕ ДАННЫЕ - КОНТАКТЫ
-- ============================================================

INSERT INTO public.contacts (type, value, label, "order", is_active) VALUES 
    ('phone', '+998 71 123 45 67', 'Основной телефон', 1, true),
    ('phone', '+998 90 123 45 67', 'Мобильный', 2, true),
    ('email', 'info@kran-montaj.uz', 'Основной email', 3, true),
    ('email', 'sales@kran-montaj.uz', 'Отдел продаж', 4, true),
    ('address', 'г. Ташкент, ул. Мустакиллик, 100', 'Офис', 5, true),
    ('hours', 'Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 14:00', 'Режим работы', 6, true),
    ('telegram', '@kranmontaj', 'Telegram', 7, true),
    ('instagram', '@kranmontaj.uz', 'Instagram', 8, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ЧАСТЬ 19: НАЧАЛЬНЫЕ ДАННЫЕ - ОБЩИЙ КОНТЕНТ
-- ============================================================

INSERT INTO public.general_content (key, section, title, text, image_url) VALUES 
    (
        'home_hero',
        'home',
        'Грузоподъемное оборудование',
        'КРАН-МОНТАЖ - ваш надежный партнер в сфере грузоподъемного оборудования. Мы предлагаем полный спектр услуг от проектирования до сервисного обслуживания.',
        NULL
    ),
    (
        'home_about',
        'home',
        'О компании',
        'Более 15 лет опыта в производстве и обслуживании кранового оборудования. Собственное производство и склад запчастей.',
        NULL
    ),
    (
        'about_company',
        'about',
        'О компании КРАН-МОНТАЖ',
        'Компания КРАН-МОНТАЖ основана в 2008 году и специализируется на производстве, монтаже и сервисном обслуживании кранового оборудования. За годы работы мы накопили богатый опыт и экспертизу в сфере грузоподъемного оборудования.',
        NULL
    ),
    (
        'about_mission',
        'about',
        'Наша миссия',
        'Обеспечивать клиентов надежным и эффективным грузоподъемным оборудованием, которое повышает безопасность и производительность их работы.',
        NULL
    ),
    (
        'contact_info',
        'contacts',
        'Свяжитесь с нами',
        'Наши специалисты готовы ответить на все ваши вопросы и помочь подобрать оптимальное решение для вашего бизнеса.',
        NULL
    )
ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    text = EXCLUDED.text,
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 20: НАЧАЛЬНЫЕ ДАННЫЕ - КОНТЕНТ СТРАНИЦ
-- ============================================================

INSERT INTO public.page_content (page, section, title, content) VALUES 
    ('home', 'hero', 'Грузоподъемное оборудование', 'Профессиональное производство, монтаж и обслуживание кранов'),
    ('home', 'services', 'Наши услуги', 'Полный спектр услуг в сфере грузоподъемного оборудования'),
    ('home', 'catalog', 'Каталог продукции', 'Широкий ассортимент кранов и подъемного оборудования'),
    ('home', 'about', 'О компании', 'Более 15 лет опыта работы в отрасли'),
    ('catalog', 'hero', 'Каталог продукции', 'Ознакомьтесь с нашей премиальной линейкой грузоподъемного оборудования'),
    ('services', 'hero', 'Наши услуги', 'Полный спектр решений по изготовлению и обслуживанию грузоподъемного оборудования'),
    ('about', 'hero', 'О компании', 'КРАН-МОНТАЖ - ведущая компания в сфере грузоподъемного оборудования'),
    ('contacts', 'hero', 'Контакты', 'Свяжитесь с нами для получения консультации')
ON CONFLICT (page, section) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 21: НАЧАЛЬНЫЕ ДАННЫЕ - О КОМПАНИИ
-- ============================================================

INSERT INTO public.about_content (block_key, title, content, icon, "order", is_active) VALUES 
    (
        'company_intro',
        'Кто мы',
        'Компания КРАН-МОНТАЖ основана в 2008 году и специализируется на производстве, монтаже и сервисном обслуживании кранового оборудования. За годы работы мы накопили богатый опыт и экспертизу в сфере грузоподъемного оборудования.',
        'building',
        1,
        true
    ),
    (
        'mission',
        'Наша миссия',
        'Обеспечивать клиентов надежным и эффективным грузоподъемным оборудованием, которое повышает безопасность и производительность их работы. Мы стремимся к постоянному совершенствованию и внедрению инновационных технологий.',
        'target',
        2,
        true
    ),
    (
        'quality',
        'Качество',
        'Мы используем только высококачественные материалы и комплектующие, обеспечивая долговечность и надежность оборудования.',
        'check-circle',
        3,
        true
    ),
    (
        'safety',
        'Безопасность',
        'Безопасность оборудования — наш главный приоритет. Все наши изделия соответствуют самым строгим стандартам безопасности.',
        'shield',
        4,
        true
    ),
    (
        'individual_approach',
        'Индивидуальный подход',
        'Мы учитываем все требования и особенности производства наших заказчиков, предлагая оптимальные решения.',
        'users',
        5,
        true
    )
ON CONFLICT (block_key) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 22: НАЧАЛЬНЫЕ ДАННЫЕ - СТАТИСТИКА КОМПАНИИ
-- ============================================================

INSERT INTO public.company_stats (stat_key, label, value, icon, "order", is_active) VALUES 
    ('experience', 'Лет опыта', '17', 'clock', 1, true),
    ('projects', 'Завершенных проектов', '500+', 'tools', 2, true),
    ('clients', 'Довольных клиентов', '250+', 'users', 3, true),
    ('employees', 'Специалистов', '80', 'award', 4, true)
ON CONFLICT (stat_key) DO UPDATE SET
    label = EXCLUDED.label,
    value = EXCLUDED.value,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 23: НАСТРОЙКА STORAGE (ХРАНИЛИЩЕ ФАЙЛОВ)
-- ============================================================

-- ВАЖНО: Эту часть нужно выполнить через Supabase Dashboard или API,
-- так как SQL не позволяет создавать Storage buckets напрямую.
-- 
-- Инструкция:
-- 1. Перейдите в Supabase Dashboard -> Storage
-- 2. Создайте bucket с именем "img"
-- 3. Сделайте его публичным (Public bucket)
-- 4. Создайте следующие папки внутри bucket:
--    - products
--    - services
--    - page-content
--    - general
-- 5. Настройте политики доступа:

-- Примечание: Следующие команды для storage policies
-- нужно выполнить после создания bucket

/*
-- Политика для чтения изображений всеми пользователями
CREATE POLICY "Public Access to Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'img');

-- Политика для загрузки изображений только авторизованными пользователями
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'img' AND auth.role() = 'authenticated');

-- Политика для обновления изображений только авторизованными пользователями
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'img' AND auth.role() = 'authenticated');

-- Политика для удаления изображений только авторизованными пользователями
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'img' AND auth.role() = 'authenticated');
*/

-- ============================================================
-- ЧАСТЬ 24: ПОЛЕЗНЫЕ ФУНКЦИИ
-- ============================================================

-- Функция для генерации slug из текста
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Функция для автоматической генерации slug при создании категории
CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := public.generate_slug(NEW.name);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматической генерации slug
DROP TRIGGER IF EXISTS auto_generate_category_slug ON public.categories;
CREATE TRIGGER auto_generate_category_slug
    BEFORE INSERT OR UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_slug();

-- ============================================================
-- ЧАСТЬ 25: ПРОВЕРКА УСТАНОВКИ
-- ============================================================

-- Проверка созданных таблиц
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('categories', 'services', 'products', 'contacts', 'general_content', 'page_content', 'about_content', 'company_stats');
    
    IF table_count = 8 THEN
        RAISE NOTICE '✅ Все 8 таблиц успешно созданы';
    ELSE
        RAISE WARNING '⚠️ Создано только % из 8 таблиц', table_count;
    END IF;
END $$;

-- Проверка созданных представлений
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count
    FROM information_schema.views 
    WHERE table_schema = 'public' 
    AND table_name IN ('products_with_category', 'services_with_category');
    
    IF view_count = 2 THEN
        RAISE NOTICE '✅ Все 2 представления успешно созданы';
    ELSE
        RAISE WARNING '⚠️ Создано только % из 2 представлений', view_count;
    END IF;
END $$;

-- Вывод информации о созданных данных
DO $$
DECLARE
    cat_count INTEGER;
    srv_count INTEGER;
    prod_count INTEGER;
    cont_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO cat_count FROM public.categories;
    SELECT COUNT(*) INTO srv_count FROM public.services;
    SELECT COUNT(*) INTO prod_count FROM public.products;
    SELECT COUNT(*) INTO cont_count FROM public.contacts;
    
    RAISE NOTICE '📊 Статистика начальных данных:';
    RAISE NOTICE '   - Категории: %', cat_count;
    RAISE NOTICE '   - Услуги: %', srv_count;
    RAISE NOTICE '   - Продукты: %', prod_count;
    RAISE NOTICE '   - Контакты: %', cont_count;
END $$;

-- ============================================================
-- ЗАВЕРШЕНИЕ
-- ============================================================

-- Выводим финальное сообщение
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '✅ УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Следующие шаги:';
    RAISE NOTICE '1. Создайте Storage bucket "img" в Supabase Dashboard';
    RAISE NOTICE '2. Настройте политики доступа для Storage';
    RAISE NOTICE '3. Создайте пользователя-администратора через Supabase Auth';
    RAISE NOTICE '4. Проверьте работу приложения';
    RAISE NOTICE '';
END $$;

