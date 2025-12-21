-- Create contact_messages table to store user submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Only admins/editors can view and manage messages
CREATE POLICY "Admins can manage contact messages"
ON public.contact_messages
FOR ALL
USING (is_admin_or_editor(auth.uid()));

-- Add favicon_url to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Update page_seo with additional pages
INSERT INTO public.page_seo (page_slug, page_title, meta_title, meta_description)
VALUES 
  ('projects-upcoming', 'Upcoming Projects', 'Upcoming Projects | Real Estate', 'Discover our upcoming real estate projects'),
  ('projects-ongoing', 'Ongoing Projects', 'Ongoing Projects | Real Estate', 'View our ongoing construction projects'),
  ('projects-handed-over', 'Handed Over Projects', 'Completed Projects | Real Estate', 'Explore our successfully completed projects')
ON CONFLICT (page_slug) DO NOTHING;