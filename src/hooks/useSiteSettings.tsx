import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string | null;
  logo_url: string | null;
  favicon_url?: string | null;
  show_brand_text?: boolean | null;
  primary_color: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  google_analytics_id: string | null;
  meta_pixel_id: string | null;
  footer_text: string | null;
} 

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number | null;
  is_active: boolean | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data as SiteSettings;
    },
  });
};

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as SocialLink[];
    },
  });
};
