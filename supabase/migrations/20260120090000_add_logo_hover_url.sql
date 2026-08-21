-- Add logo_hover_url to site_settings for hover state image
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_hover_url TEXT;
