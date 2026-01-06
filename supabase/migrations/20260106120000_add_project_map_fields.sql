-- Add google map embed and coordinates to projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS google_map_embed text,
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;
