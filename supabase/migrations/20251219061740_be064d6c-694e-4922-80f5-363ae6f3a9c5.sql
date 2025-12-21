-- Hero Content table for dynamic hero section
CREATE TABLE public.hero_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text text DEFAULT 'Trusted Since 1998',
  headline text DEFAULT 'Your Trusted Partner in Real Estate Development',
  highlight_text text DEFAULT 'Real Estate',
  subtext text DEFAULT 'We transform visions into exceptional living spaces. Discover our portfolio of premium residential and commercial developments crafted with excellence.',
  primary_button_text text DEFAULT 'Explore Projects',
  primary_button_link text DEFAULT '/projects',
  banner_image text,
  stat_1_value text DEFAULT '25+',
  stat_1_label text DEFAULT 'Years Experience',
  stat_2_value text DEFAULT '150+',
  stat_2_label text DEFAULT 'Projects Completed',
  stat_3_value text DEFAULT '10K+',
  stat_3_label text DEFAULT 'Happy Families',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view hero content"
ON public.hero_content FOR SELECT
USING (true);

CREATE POLICY "Admins and editors can manage hero content"
ON public.hero_content FOR ALL
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

-- About Page Content table
CREATE TABLE public.about_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type text NOT NULL, -- 'our_story', 'mission', 'vision'
  title text NOT NULL,
  content text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view about content"
ON public.about_content FOR SELECT
USING (true);

CREATE POLICY "Admins and editors can manage about content"
ON public.about_content FOR ALL
USING (is_admin_or_editor(auth.uid()))
WITH CHECK (is_admin_or_editor(auth.uid()));

-- Add team_category to management_team for different sections
ALTER TABLE public.management_team 
ADD COLUMN IF NOT EXISTS team_category text DEFAULT 'team',
ADD COLUMN IF NOT EXISTS social_facebook text,
ADD COLUMN IF NOT EXISTS social_linkedin text,
ADD COLUMN IF NOT EXISTS social_twitter text;

-- Triggers for updated_at
CREATE TRIGGER update_hero_content_updated_at
BEFORE UPDATE ON public.hero_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero content
INSERT INTO public.hero_content (id) VALUES (gen_random_uuid());

-- Insert default about content
INSERT INTO public.about_content (section_type, title, content, display_order) VALUES
('our_story', 'Our Story', 'Founded in 1998, Horizon Real Estate has been at the forefront of premium property development in Bangladesh. Our journey began with a simple vision: to create living spaces that combine quality, innovation, and sustainability. Over the years, we have successfully delivered numerous residential and commercial projects that have transformed the urban landscape of Dhaka and beyond.', 1),
('mission', 'Our Mission', 'To deliver exceptional real estate solutions that exceed customer expectations while maintaining the highest standards of quality, integrity, and innovation in every project we undertake.', 2),
('vision', 'Our Vision', 'To be the most trusted and respected real estate developer in Bangladesh, known for creating sustainable communities and iconic landmarks that enhance the quality of life for generations to come.', 3);

-- Update existing team members with categories
UPDATE public.management_team SET team_category = 'board' WHERE display_order <= 2;
UPDATE public.management_team SET team_category = 'senior_management' WHERE display_order > 2;