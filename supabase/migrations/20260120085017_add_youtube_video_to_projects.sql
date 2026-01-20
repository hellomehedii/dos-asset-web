-- Add youtube video URL to projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS youtube_video_url text;