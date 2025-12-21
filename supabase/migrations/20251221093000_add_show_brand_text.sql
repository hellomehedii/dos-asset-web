-- Add flag to control whether site name/tagline are displayed
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS show_brand_text BOOLEAN DEFAULT false;

-- Ensure existing row has a defined value
UPDATE public.site_settings SET show_brand_text = false WHERE show_brand_text IS NULL;
