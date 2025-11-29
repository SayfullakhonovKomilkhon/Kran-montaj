-- ============================================================
-- НАСТРОЙКА SUPABASE STORAGE
-- Этот файл содержит SQL для настройки Storage policies
-- ============================================================

-- ВАЖНО: Перед выполнением этого скрипта:
-- 1. Создайте bucket "img" через Supabase Dashboard (Storage -> New Bucket)
-- 2. Установите Public = true при создании bucket
-- 3. Затем выполните этот SQL

-- ============================================================
-- ПОЛИТИКИ ДОСТУПА К ХРАНИЛИЩУ
-- ============================================================

-- Удаляем существующие политики если они есть
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;

-- 1. Публичный доступ на чтение всех файлов в bucket "img"
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'img');

-- 2. Авторизованные пользователи могут загружать файлы
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'img' 
    AND auth.role() = 'authenticated'
);

-- 3. Авторизованные пользователи могут обновлять файлы
CREATE POLICY "Authenticated Update Access"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'img' 
    AND auth.role() = 'authenticated'
);

-- 4. Авторизованные пользователи могут удалять файлы
CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'img' 
    AND auth.role() = 'authenticated'
);

-- ============================================================
-- АЛЬТЕРНАТИВНЫЙ ВАРИАНТ: Более детальные политики
-- ============================================================

/*
-- Если нужно ограничить типы файлов и размеры, используйте следующие политики:

-- Политика для загрузки только изображений (jpg, png, gif, webp)
CREATE POLICY "Upload images only"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'img' 
    AND auth.role() = 'authenticated'
    AND (
        storage.extension(name) = 'jpg' OR
        storage.extension(name) = 'jpeg' OR
        storage.extension(name) = 'png' OR
        storage.extension(name) = 'gif' OR
        storage.extension(name) = 'webp' OR
        storage.extension(name) = 'svg'
    )
);

-- Политика ограничения по папкам
-- Разрешаем загрузку только в определенные папки
CREATE POLICY "Upload to specific folders"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'img' 
    AND auth.role() = 'authenticated'
    AND (
        name LIKE 'products/%' OR
        name LIKE 'services/%' OR
        name LIKE 'page-content/%' OR
        name LIKE 'general/%' OR
        name LIKE 'about/%'
    )
);
*/

-- ============================================================
-- ПРОВЕРКА НАСТРОЕК
-- ============================================================

-- Проверяем созданные политики
SELECT 
    policyname,
    tablename,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- ============================================================
-- РЕКОМЕНДУЕМАЯ СТРУКТУРА ПАПОК В BUCKET "img"
-- ============================================================

/*
img/
├── products/           # Изображения продуктов (каталог)
│   ├── product-1.jpg
│   └── product-2.png
├── services/           # Изображения услуг
│   ├── service-1.jpg
│   └── service-2.png
├── page-content/       # Изображения для контента страниц
│   ├── hero-bg.jpg
│   └── about-image.png
├── general/            # Общие изображения сайта
│   ├── logo.svg
│   └── favicon.ico
└── about/              # Изображения для страницы "О компании"
    ├── team.jpg
    └── office.jpg
*/

-- ============================================================
-- ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПУБЛИЧНОГО URL ФАЙЛА
-- ============================================================

-- Эта функция поможет получить публичный URL файла
-- (Замените YOUR_PROJECT_REF на ID вашего проекта)
/*
CREATE OR REPLACE FUNCTION public.get_image_url(file_path TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/img/' || file_path;
END;
$$ LANGUAGE plpgsql;

-- Пример использования:
-- SELECT get_image_url('products/crane-1.jpg');
-- Вернет: https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/img/products/crane-1.jpg
*/

RAISE NOTICE '✅ Настройка Storage политик завершена!';

