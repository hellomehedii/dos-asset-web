
-- Site settings table for global site configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'DADL',
  site_tagline TEXT DEFAULT 'Real Estate',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#009bfe',
  phone TEXT DEFAULT '+880 1234 567 890',
  email TEXT DEFAULT 'info@dos.com',
  address TEXT DEFAULT 'House 45, Road 12, Sector 7, Uttara, Dhaka 1230',
  google_analytics_id TEXT,
  meta_pixel_id TEXT,
  footer_text TEXT DEFAULT 'Building dreams and creating landmarks since 1998.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Social links table
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Page SEO settings table
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Anyone can view page seo" ON public.page_seo FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (is_admin_or_editor(auth.uid())) WITH CHECK (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admins can manage social links" ON public.social_links FOR ALL USING (is_admin_or_editor(auth.uid())) WITH CHECK (is_admin_or_editor(auth.uid()));
CREATE POLICY "Admins can manage page seo" ON public.page_seo FOR ALL USING (is_admin_or_editor(auth.uid())) WITH CHECK (is_admin_or_editor(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_page_seo_updated_at BEFORE UPDATE ON public.page_seo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (site_name, site_tagline) VALUES ('Horizon', 'Real Estate');

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon, display_order) VALUES
('Facebook', 'https://facebook.com', 'Facebook', 1),
('Twitter', 'https://twitter.com', 'Twitter', 2),
('Instagram', 'https://instagram.com', 'Instagram', 3),
('LinkedIn', 'https://linkedin.com', 'Linkedin', 4);

-- Insert default page SEO
INSERT INTO public.page_seo (page_slug, page_title, meta_title, meta_description) VALUES
('home', 'Home', 'Horizon Real Estate | Premium Property Development in Bangladesh', 'Your trusted partner in premium residential and commercial property development since 1998.'),
('about', 'About Us', 'About Horizon Real Estate', 'Learn about our story, mission, and vision.'),
('projects', 'Projects', 'Our Projects | Horizon Real Estate', 'Explore our portfolio of premium residential and commercial projects.'),
('blog', 'Blog', 'Blog | Horizon Real Estate', 'Latest news and insights from Horizon Real Estate.'),
('contact', 'Contact', 'Contact Us | Horizon Real Estate', 'Get in touch with Horizon Real Estate.');
