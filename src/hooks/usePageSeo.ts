import { useQuery } from "@tanstack/react-query";

export const usePageSeo = (pageSlug: string) => {
  return useQuery({
    queryKey: ["page-seo", pageSlug],
    queryFn: async () => {
      const res = await fetch(`/api/page-seo?page=${encodeURIComponent(pageSlug)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch page SEO");
      }
      const data = await res.json();
      return data;
    },
  });
};
