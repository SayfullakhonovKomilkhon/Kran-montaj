-- ============================================
-- SQL для создания таблицы видео
-- Выполните в Supabase Dashboard → SQL Editor
-- ============================================

-- Create videos table for storing video metadata
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  filename VARCHAR(500) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on videos" ON videos
  FOR SELECT USING (true);

-- Allow authenticated users full access  
CREATE POLICY "Allow authenticated full access on videos" ON videos
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_videos_sort ON videos(sort_order, created_at DESC);

-- Insert existing videos (update filenames to match your actual files)
INSERT INTO videos (title, filename, description, sort_order) VALUES
  ('Проект 1', '0u9dq5fzmlad_1748104138382.mp4', 'Видео выполненного проекта', 1),
  ('Проект 2', 'fa108d7pstu_1748104211093.mp4', 'Видео выполненного проекта', 2),
  ('Проект 3', 'fgvgtlomy0i_1748021981959.mp4', 'Видео выполненного проекта', 3),
  ('Проект 4', 'n9pmlarbaei_1748163383916.mp4', 'Видео выполненного проекта', 4),
  ('Проект 5', 'nditr12vkc_1748104194023.mp4', 'Видео выполненного проекта', 5)
ON CONFLICT DO NOTHING;



