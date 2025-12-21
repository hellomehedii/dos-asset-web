import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Keeps the frontend in sync when backend content is edited outside the UI.
 * It listens to DB changes and invalidates React Query caches.
 */
const RealtimeInvalidation = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-invalidation")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["site-settings"] });
          queryClient.invalidateQueries({ queryKey: ["site-settings-admin"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_content" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["hero-content"] });
          queryClient.invalidateQueries({ queryKey: ["hero-content-admin"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "management_team" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["team-members"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["team-members-all"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["admin-team"], exact: false });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["projects"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["project"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["featured-projects"], exact: false });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blog_posts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["blog-posts"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["latest-blogs"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["blog-post"], exact: false });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "about_content" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["about"], exact: false });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "social_links" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["social-links"], exact: false });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "page_seo" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["page-seo"], exact: false });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return null;
};

export default RealtimeInvalidation;
