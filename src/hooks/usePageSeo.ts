import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePageSeo = (pageSlug: string) => {
  // Normalize root path: support both 'home' and '/' as stored slugs.
  const normalized = String(pageSlug || "");
  const slugCandidates: string[] = [];
  if (normalized === "/" || normalized === "" ) {
    slugCandidates.push("home", "/");
  } else {
    // strip leading slashes
    slugCandidates.push(normalized.replace(/^\/+/, ""));
  }

  return useQuery({
    queryKey: ["page-seo", normalized],
    queryFn: async () => {
      // Try to find a matching page_seo using any of the candidate slugs
      const { data, error } = await supabase
        .from("page_seo")
        .select("page_title, meta_title, meta_description, meta_keywords, og_image")
        .in("page_slug", slugCandidates)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    },
  });
};
