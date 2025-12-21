import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePageSeo = (pageSlug: string) => {
  return useQuery({
    queryKey: ["page-seo", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .eq("page_slug", pageSlug)
        .single();
      if (error) throw error;
      return data;
    },
  });
};
