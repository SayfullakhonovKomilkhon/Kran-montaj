-- =============================================
-- НАСТРОЙКА ТАБЛИЦЫ ФОТО И STORAGE
-- =============================================

-- 1. Создаём таблицу для хранения метаданных фото
CREATE TABLE IF NOT EXISTS photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Включаем RLS для таблицы photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 3. Политики для таблицы photos

-- Чтение: все могут читать активные фото
CREATE POLICY "photos_select_policy" ON photos
    FOR SELECT USING (true);

-- Вставка: все могут добавлять (для админки)
CREATE POLICY "photos_insert_policy" ON photos
    FOR INSERT WITH CHECK (true);

-- Обновление: все могут обновлять
CREATE POLICY "photos_update_policy" ON photos
    FOR UPDATE USING (true);

-- Удаление: все могут удалять
CREATE POLICY "photos_delete_policy" ON photos
    FOR DELETE USING (true);

-- 4. Создаём storage bucket для фото (если не существует)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products_img', 'products_img', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Политики для storage bucket products_img

-- Удаляем старые политики если есть
DROP POLICY IF EXISTS "products_img_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_img_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_img_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_img_delete_policy" ON storage.objects;

-- Чтение: публичный доступ
CREATE POLICY "products_img_select_policy" ON storage.objects
    FOR SELECT USING (bucket_id = 'products_img');

-- Загрузка: все могут загружать
CREATE POLICY "products_img_insert_policy" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'products_img');

-- Обновление: все могут обновлять
CREATE POLICY "products_img_update_policy" ON storage.objects
    FOR UPDATE USING (bucket_id = 'products_img');

-- Удаление: все могут удалять
CREATE POLICY "products_img_delete_policy" ON storage.objects
    FOR DELETE USING (bucket_id = 'products_img');

-- 6. Индекс для сортировки
CREATE INDEX IF NOT EXISTS idx_photos_sort_order ON photos(sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_is_active ON photos(is_active);

-- 7. Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS photos_updated_at_trigger ON photos;
CREATE TRIGGER photos_updated_at_trigger
    BEFORE UPDATE ON photos
    FOR EACH ROW
    EXECUTE FUNCTION update_photos_updated_at();

-- Готово! Теперь можно загружать фото

