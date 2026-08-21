-- Add logo_hover_url to site_settings table for logo hover state
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'logo_hover_url'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN logo_hover_url TEXT;
    RAISE NOTICE 'Column logo_hover_url added to site_settings';
  ELSE
    RAISE NOTICE 'Column logo_hover_url already exists in site_settings';
  END IF;
END$$;
