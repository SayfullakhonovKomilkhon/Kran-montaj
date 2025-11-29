-- ============================================================
-- SQL КОД ДЛЯ АДМИН-ПАНЕЛИ И АВТОРИЗАЦИИ
-- Проект: КРАН-МОНТАЖ
-- ============================================================
-- 
-- ВАЖНО: Выполните этот скрипт ПОСЛЕ supabase-complete-setup.sql
-- 
-- Supabase Auth автоматически создает пользователей в auth.users
-- Этот скрипт добавляет дополнительные таблицы для:
-- - Профилей администраторов
-- - Ролей и разрешений
-- - Логирования действий
-- - Настроек системы
-- ============================================================

-- ============================================================
-- ЧАСТЬ 1: ТАБЛИЦА РОЛЕЙ АДМИНИСТРАТОРОВ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON public.admin_roles;
CREATE TRIGGER update_admin_roles_updated_at
    BEFORE UPDATE ON public.admin_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии
COMMENT ON TABLE public.admin_roles IS 'Роли администраторов системы';
COMMENT ON COLUMN public.admin_roles.name IS 'Название роли (super_admin, admin, editor, viewer)';
COMMENT ON COLUMN public.admin_roles.permissions IS 'JSON массив разрешений';

-- ============================================================
-- ЧАСТЬ 2: ТАБЛИЦА ПРОФИЛЕЙ АДМИНИСТРАТОРОВ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role_id UUID REFERENCES public.admin_roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role_id ON public.admin_profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_is_active ON public.admin_profiles(is_active);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии
COMMENT ON TABLE public.admin_profiles IS 'Профили администраторов (связаны с auth.users)';
COMMENT ON COLUMN public.admin_profiles.id IS 'ID пользователя из auth.users';
COMMENT ON COLUMN public.admin_profiles.role_id IS 'Роль администратора';
COMMENT ON COLUMN public.admin_profiles.login_count IS 'Количество входов в систему';

-- ============================================================
-- ЧАСТЬ 3: ТАБЛИЦА ЛОГИРОВАНИЯ ДЕЙСТВИЙ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON public.admin_activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);

-- Комментарии
COMMENT ON TABLE public.admin_activity_logs IS 'Логи действий администраторов';
COMMENT ON COLUMN public.admin_activity_logs.action IS 'Тип действия: create, update, delete, login, logout';
COMMENT ON COLUMN public.admin_activity_logs.entity_type IS 'Тип сущности: product, service, category и т.д.';

-- ============================================================
-- ЧАСТЬ 4: ТАБЛИЦА СИСТЕМНЫХ НАСТРОЕК
-- ============================================================

CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    value_type TEXT DEFAULT 'string' CHECK (value_type IN ('string', 'number', 'boolean', 'json')),
    category TEXT DEFAULT 'general',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Комментарии
COMMENT ON TABLE public.system_settings IS 'Системные настройки сайта';
COMMENT ON COLUMN public.system_settings.is_public IS 'Доступна ли настройка публично';

-- ============================================================
-- ЧАСТЬ 5: ТАБЛИЦА СЕССИЙ АДМИНИСТРАТОРОВ
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_is_active ON public.admin_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

-- Триггер для автообновления updated_at
DROP TRIGGER IF EXISTS update_admin_sessions_updated_at ON public.admin_sessions;
CREATE TRIGGER update_admin_sessions_updated_at
    BEFORE UPDATE ON public.admin_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- ЧАСТЬ 6: ПРЕДСТАВЛЕНИЯ (VIEWS) ДЛЯ АДМИН-ПАНЕЛИ
-- ============================================================

-- Представление профилей с ролями
CREATE OR REPLACE VIEW public.admin_profiles_with_roles AS
SELECT 
    ap.id,
    ap.email,
    ap.full_name,
    ap.avatar_url,
    ap.phone,
    ap.role_id,
    ap.is_active,
    ap.last_login,
    ap.login_count,
    ap.created_at,
    ap.updated_at,
    ar.name as role_name,
    ar.permissions as role_permissions
FROM 
    public.admin_profiles ap
LEFT JOIN 
    public.admin_roles ar ON ap.role_id = ar.id;

-- Представление последних действий
CREATE OR REPLACE VIEW public.recent_admin_activity AS
SELECT 
    al.id,
    al.admin_id,
    al.admin_email,
    al.action,
    al.entity_type,
    al.entity_id,
    al.created_at,
    ap.full_name as admin_name
FROM 
    public.admin_activity_logs al
LEFT JOIN 
    public.admin_profiles ap ON al.admin_id = ap.id
ORDER BY al.created_at DESC
LIMIT 100;

-- ============================================================
-- ЧАСТЬ 7: ФУНКЦИИ ДЛЯ РАБОТЫ С АДМИНИСТРАТОРАМИ
-- ============================================================

-- Функция для автоматического создания профиля админа при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
BEGIN
    -- Получаем ID роли 'admin' по умолчанию
    SELECT id INTO default_role_id FROM public.admin_roles WHERE name = 'admin' LIMIT 1;
    
    -- Создаем профиль администратора
    INSERT INTO public.admin_profiles (id, email, full_name, role_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        default_role_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер на создание нового пользователя в auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_admin_user();

-- Функция для обновления последнего входа
CREATE OR REPLACE FUNCTION public.update_admin_last_login(admin_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.admin_profiles
    SET 
        last_login = NOW(),
        login_count = login_count + 1
    WHERE id = admin_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для логирования действий админа
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_admin_id UUID,
    p_admin_email TEXT,
    p_action TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id TEXT DEFAULT NULL,
    p_old_data JSONB DEFAULT NULL,
    p_new_data JSONB DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.admin_activity_logs (
        admin_id,
        admin_email,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    ) VALUES (
        p_admin_id,
        p_admin_email,
        p_action,
        p_entity_type,
        p_entity_id,
        p_old_data,
        p_new_data,
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для проверки разрешений админа
CREATE OR REPLACE FUNCTION public.check_admin_permission(
    p_admin_id UUID,
    p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_permissions JSONB;
    has_permission BOOLEAN;
BEGIN
    -- Получаем разрешения админа через его роль
    SELECT ar.permissions INTO admin_permissions
    FROM public.admin_profiles ap
    JOIN public.admin_roles ar ON ap.role_id = ar.id
    WHERE ap.id = p_admin_id AND ap.is_active = true;
    
    -- Проверяем наличие разрешения
    IF admin_permissions IS NULL THEN
        RETURN false;
    END IF;
    
    -- Проверяем есть ли 'all' или конкретное разрешение
    has_permission := admin_permissions ? 'all' OR admin_permissions ? p_permission;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения настройки
CREATE OR REPLACE FUNCTION public.get_setting(p_key TEXT)
RETURNS TEXT AS $$
DECLARE
    setting_value TEXT;
BEGIN
    SELECT value INTO setting_value
    FROM public.system_settings
    WHERE key = p_key;
    
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ЧАСТЬ 8: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Включаем RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики
DROP POLICY IF EXISTS "Admin roles read access" ON public.admin_roles;
DROP POLICY IF EXISTS "Admin roles full access" ON public.admin_roles;
DROP POLICY IF EXISTS "Admin profiles read own" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admin profiles full access" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admin logs read access" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Admin logs insert access" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "System settings public read" ON public.system_settings;
DROP POLICY IF EXISTS "System settings admin access" ON public.system_settings;
DROP POLICY IF EXISTS "Admin sessions own access" ON public.admin_sessions;

-- Политики для admin_roles
CREATE POLICY "Admin roles read access" ON public.admin_roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin roles full access" ON public.admin_roles
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles ap
            JOIN public.admin_roles ar ON ap.role_id = ar.id
            WHERE ap.id = auth.uid() AND ar.name = 'super_admin'
        )
    );

-- Политики для admin_profiles
CREATE POLICY "Admin profiles read own" ON public.admin_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin profiles update own" ON public.admin_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin profiles full access" ON public.admin_profiles
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles ap
            JOIN public.admin_roles ar ON ap.role_id = ar.id
            WHERE ap.id = auth.uid() AND ar.name IN ('super_admin', 'admin')
        )
    );

-- Политики для admin_activity_logs
CREATE POLICY "Admin logs read access" ON public.admin_activity_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin logs insert access" ON public.admin_activity_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Политики для system_settings
CREATE POLICY "System settings public read" ON public.system_settings
    FOR SELECT USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "System settings admin access" ON public.system_settings
    FOR ALL USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles ap
            JOIN public.admin_roles ar ON ap.role_id = ar.id
            WHERE ap.id = auth.uid() AND ar.name IN ('super_admin', 'admin')
        )
    );

-- Политики для admin_sessions
CREATE POLICY "Admin sessions own access" ON public.admin_sessions
    FOR ALL USING (admin_id = auth.uid());

-- ============================================================
-- ЧАСТЬ 9: НАЧАЛЬНЫЕ ДАННЫЕ - РОЛИ
-- ============================================================

INSERT INTO public.admin_roles (name, description, permissions) VALUES 
    (
        'super_admin',
        'Супер-администратор с полным доступом ко всем функциям',
        '["all"]'::jsonb
    ),
    (
        'admin',
        'Администратор с доступом к управлению контентом',
        '["products.read", "products.create", "products.update", "products.delete", "services.read", "services.create", "services.update", "services.delete", "categories.read", "categories.create", "categories.update", "categories.delete", "contacts.read", "contacts.create", "contacts.update", "contacts.delete", "content.read", "content.create", "content.update", "content.delete", "logs.read"]'::jsonb
    ),
    (
        'editor',
        'Редактор с доступом к редактированию контента',
        '["products.read", "products.create", "products.update", "services.read", "services.create", "services.update", "categories.read", "contacts.read", "content.read", "content.update"]'::jsonb
    ),
    (
        'viewer',
        'Просмотрщик только с правами чтения',
        '["products.read", "services.read", "categories.read", "contacts.read", "content.read"]'::jsonb
    )
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 10: НАЧАЛЬНЫЕ ДАННЫЕ - СИСТЕМНЫЕ НАСТРОЙКИ
-- ============================================================

INSERT INTO public.system_settings (key, value, value_type, category, description, is_public) VALUES 
    ('site_name', 'КРАН-МОНТАЖ', 'string', 'general', 'Название сайта', true),
    ('site_description', 'Грузоподъемное оборудование - производство, монтаж, сервис', 'string', 'general', 'Описание сайта', true),
    ('contact_email', 'info@kran-montaj.uz', 'string', 'contacts', 'Основной email для связи', true),
    ('contact_phone', '+998 71 123 45 67', 'string', 'contacts', 'Основной телефон', true),
    ('telegram_bot_token', '', 'string', 'telegram', 'Токен Telegram бота', false),
    ('telegram_chat_id', '', 'string', 'telegram', 'ID чата для уведомлений', false),
    ('maintenance_mode', 'false', 'boolean', 'system', 'Режим обслуживания', false),
    ('items_per_page', '12', 'number', 'display', 'Количество элементов на странице', false),
    ('enable_notifications', 'true', 'boolean', 'notifications', 'Включить уведомления', false),
    ('analytics_enabled', 'false', 'boolean', 'analytics', 'Включить аналитику', false)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================
-- ЧАСТЬ 11: СОЗДАНИЕ ПЕРВОГО СУПЕР-АДМИНИСТРАТОРА
-- ============================================================

-- ВАЖНО: После регистрации пользователя через Supabase Dashboard (Authentication -> Users -> Add user),
-- выполните следующий запрос, заменив EMAIL_АДРЕС на email созданного пользователя:

/*
-- Обновить роль пользователя на super_admin
UPDATE public.admin_profiles
SET role_id = (SELECT id FROM public.admin_roles WHERE name = 'super_admin')
WHERE email = 'ВАШ_EMAIL@example.com';
*/

-- Альтернативно, можно создать профиль вручную, если триггер не сработал:
/*
INSERT INTO public.admin_profiles (id, email, full_name, role_id, is_active)
SELECT 
    u.id,
    u.email,
    'Администратор',
    (SELECT id FROM public.admin_roles WHERE name = 'super_admin'),
    true
FROM auth.users u
WHERE u.email = 'ВАШ_EMAIL@example.com'
ON CONFLICT (id) DO UPDATE SET
    role_id = (SELECT id FROM public.admin_roles WHERE name = 'super_admin'),
    updated_at = NOW();
*/

-- ============================================================
-- ЧАСТЬ 12: ФУНКЦИЯ ДЛЯ ОЧИСТКИ СТАРЫХ ЛОГОВ
-- ============================================================

-- Функция для удаления логов старше указанного количества дней
CREATE OR REPLACE FUNCTION public.cleanup_old_logs(days_to_keep INT DEFAULT 90)
RETURNS INT AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.admin_activity_logs
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для деактивации неактивных сессий
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INT AS $$
DECLARE
    deactivated_count INT;
BEGIN
    UPDATE public.admin_sessions
    SET is_active = false
    WHERE is_active = true AND expires_at < NOW();
    
    GET DIAGNOSTICS deactivated_count = ROW_COUNT;
    
    RETURN deactivated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ЧАСТЬ 13: ПРОВЕРКА УСТАНОВКИ
-- ============================================================

DO $$
DECLARE
    roles_count INT;
    settings_count INT;
BEGIN
    SELECT COUNT(*) INTO roles_count FROM public.admin_roles;
    SELECT COUNT(*) INTO settings_count FROM public.system_settings;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '✅ НАСТРОЙКА АДМИН-ПАНЕЛИ ЗАВЕРШЕНА!';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Статистика:';
    RAISE NOTICE '   - Роли администраторов: %', roles_count;
    RAISE NOTICE '   - Системные настройки: %', settings_count;
    RAISE NOTICE '';
    RAISE NOTICE '📋 Следующие шаги:';
    RAISE NOTICE '1. Создайте пользователя в Supabase Dashboard:';
    RAISE NOTICE '   Authentication -> Users -> Add user';
    RAISE NOTICE '';
    RAISE NOTICE '2. После создания пользователя, назначьте ему роль super_admin:';
    RAISE NOTICE '   UPDATE public.admin_profiles';
    RAISE NOTICE '   SET role_id = (SELECT id FROM public.admin_roles WHERE name = ''super_admin'')';
    RAISE NOTICE '   WHERE email = ''ВАШ_EMAIL@example.com'';';
    RAISE NOTICE '';
    RAISE NOTICE '3. Войдите в админ-панель: /admin/login';
    RAISE NOTICE '';
END $$;

-- ============================================================
-- ЧАСТЬ 14: ПОЛЕЗНЫЕ ЗАПРОСЫ ДЛЯ АДМИНИСТРИРОВАНИЯ
-- ============================================================

/*
-- Посмотреть всех администраторов с ролями
SELECT * FROM public.admin_profiles_with_roles;

-- Посмотреть последние действия
SELECT * FROM public.recent_admin_activity;

-- Посмотреть все роли
SELECT * FROM public.admin_roles;

-- Посмотреть системные настройки
SELECT * FROM public.system_settings ORDER BY category, key;

-- Обновить настройку
UPDATE public.system_settings SET value = 'новое значение' WHERE key = 'ключ_настройки';

-- Добавить нового администратора с определенной ролью
INSERT INTO public.admin_profiles (id, email, full_name, role_id)
SELECT 
    u.id,
    u.email,
    'Имя Администратора',
    (SELECT id FROM public.admin_roles WHERE name = 'admin')
FROM auth.users u
WHERE u.email = 'email@example.com';

-- Деактивировать администратора
UPDATE public.admin_profiles SET is_active = false WHERE email = 'email@example.com';

-- Очистить старые логи (старше 90 дней)
SELECT public.cleanup_old_logs(90);

-- Очистить просроченные сессии
SELECT public.cleanup_expired_sessions();
*/

