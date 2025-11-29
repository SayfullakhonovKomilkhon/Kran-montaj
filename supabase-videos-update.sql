-- Update videos table to support multiple video types
-- Run this in Supabase SQL Editor

-- Add new columns if they don't exist
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'file';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS youtube_id VARCHAR(50);

-- Update existing records to have video_type = 'file'
UPDATE videos SET video_type = 'file' WHERE video_type IS NULL;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_video_type ON videos(video_type);
CREATE INDEX IF NOT EXISTS idx_videos_is_active ON videos(is_active);

-- Comments for documentation
COMMENT ON COLUMN videos.video_type IS 'Type of video: file (uploaded), url (external link), youtube (YouTube embed)';
COMMENT ON COLUMN videos.video_url IS 'External video URL for type=url';
COMMENT ON COLUMN videos.youtube_id IS 'YouTube video ID for type=youtube';




