ALTER TYPE public.project_status
  ADD VALUE IF NOT EXISTS 'ready_for_handover';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'project_type'
  ) THEN
    CREATE TYPE public.project_type AS ENUM ('land_share', 'apartment');
  END IF;
END $$;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS project_type public.project_type NOT NULL DEFAULT 'apartment';

UPDATE public.projects
SET project_type = 'apartment'
WHERE project_type IS NULL;

ALTER TABLE public.projects
  ALTER COLUMN project_type SET DEFAULT 'apartment',
  ALTER COLUMN project_type SET NOT NULL;