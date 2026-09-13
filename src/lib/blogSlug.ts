export const normalizeBlogSlug = (slug: string) =>
  slug
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const blogHref = (slug: string) => `/blog/${normalizeBlogSlug(slug)}`;