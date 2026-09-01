import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import ledImage from "@/assets/led.jpg";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visiblePostCount, setVisiblePostCount] = useState(6);

  /* ================= PAGE SEO ================= */
  const { data: seo } = useQuery({
    queryKey: ["page-seo", "blog"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("page_title, meta_title, meta_description, og_image")
        .eq("page_slug", "blog")
        .single();

      return data;
    },
  });

  /* ================= SITE SETTINGS ================= */
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("favicon_url")
        .single();
      return data;
    },
  });

  /* ================= BLOG POSTS ================= */
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      return data;
    },
  });

  /* ================= FALLBACK ================= */
  const pageTitle =
    seo?.meta_title || seo?.page_title || "Blog";

  const pageDescription =
    seo?.meta_description || "Latest articles, updates and insights.";

  const categories = [
    "All",
    "Buying",
    "Selling",
    "Investment",
    "Market Insights",
    "Guides",
    "Property Tips",
  ];

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedCategory = activeCategory.toLowerCase();

    return (posts || []).filter((post) => {
      const searchableText = `${post.title} ${post.excerpt || ""}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory =
        activeCategory === "All" || searchableText.includes(normalizedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, posts, searchTerm]);

  useEffect(() => {
    setVisiblePostCount(6);
  }, [activeCategory, searchTerm]);

  const visiblePosts = filteredPosts.slice(0, visiblePostCount);
  const hasMorePosts = visiblePostCount < filteredPosts.length;

  const featuredPost = posts?.[0];
  const featuredHref = featuredPost ? `/blog/${featuredPost.slug}` : "/blog";
  const featuredImage =
    featuredPost?.featured_image ||
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=85";

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* OG */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {seo?.og_image && (
          <meta property="og:image" content={seo.og_image} />
        )}

        {/* FAVICON */}
        {settings?.favicon_url && (
          <link rel="icon" href={settings.favicon_url} />
        )}
      </Helmet>

      <Navbar />

      <main className="bg-[#f8fafc] pt-28 text-[#0e1b35] md:pt-36">
        <section className="relative overflow-hidden md:pt-20">
          <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-0">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.9fr]">
              <div className="max-w-xl pt-4 md:pt-10">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#2667d9]">
                  Insights for better living
                </p>
                <h1 className="mb-8 max-w-lg text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
                  <span className="bg-gradient-to-r from-[#2c3538] via-[#191f20] to-[#007ea8] bg-clip-text text-transparent">
                    The DADL
                  </span>{" "}
                  <span className="bg-gradient-to-r from-[#4cbae9] via-[#2a8fe2] to-[#4cbae9] bg-clip-text text-transparent">
                    Journal
                  </span>
                </h1>
                <p className="mb-10 max-w-md text-base leading-7 text-slate-500 md:text-lg">
                  {pageDescription}
                </p>
                <label className="flex h-16 max-w-[560px] items-center gap-4 rounded-2xl border border-[#dce5f2] bg-white px-5 shadow-[0_14px_35px_rgba(24,55,100,0.06)] focus-within:border-[#2667d9] focus-within:ring-4 focus-within:ring-[#2667d9]/10">
                  <span className="sr-only">Search articles</span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search articles..."
                    className="min-w-0 flex-1 bg-transparent text-base text-[#0e1b35] outline-none placeholder:text-slate-400"
                  />
                  <Search className="h-5 w-5 shrink-0 text-[#2667d9]" aria-hidden="true" />
                </label>
              </div>

              <div className="relative hidden min-h-[370px] lg:block">
                <div className="absolute right-0 top-0 aspect-[1.2] w-full max-w-[620px] overflow-hidden rounded-bl-[110px] rounded-tl-[110px] shadow-[0_24px_60px_rgba(23,51,89,0.12)]">
                  <img
                    src={ledImage}
                    alt="Contemporary apartment building surrounded by greenery"
                    className="h-full w-full object-cover object-[center_10%]"
                  />
                </div>
              </div>
            </div>

            <Link
              to={featuredHref}
              className="group mt-12 grid overflow-hidden rounded-[22px] bg-white shadow-[0_18px_55px_rgba(24,55,100,0.09)] transition-shadow duration-300 hover:shadow-[0_22px_65px_rgba(24,55,100,0.15)] md:mt-20 lg:grid-cols-[1.05fr_1fr]"
            >
             

             
            </Link>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container-custom px-4 sm:px-6 lg:px-0">
            <div className="flex gap-3 overflow-x-auto border-b border-[#e3eaf3] pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "border-[#2a8fe2] bg-gradient-to-r from-[#4cbae9] via-[#2a8fe2] to-[#4cbae9] text-white shadow-[0_7px_18px_rgba(42,143,226,0.2)]"
                      : "border-[#cbdcf2] bg-white text-[#2a8fe2] hover:border-[#2a8fe2] hover:bg-[#f1f8ff]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-12">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No articles match your search.
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-[18px] bg-white shadow-[0_12px_35px_rgba(24,55,100,0.06)] transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(24,55,100,0.12)]"
                  >
                    <div className="relative aspect-[1.45] overflow-hidden bg-slate-100">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-7">
                      {post.published_at && (
                        <p className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="h-4 w-4 text-[#4cbae9]" />
                          {format(
                            new Date(post.published_at),
                            "MMM d, yyyy"
                          )}
                        </p>
                      )}

                      <h3 className="mb-2 font-serif text-xl font-bold text-[#0e1b35] transition-colors group-hover:text-[#4cbae9]">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                          {post.excerpt}
                        </p>
                      )}

                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#4cbae9]">
                        Read More <ArrowRight className="w-4 h-4" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {hasMorePosts && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisiblePostCount((count) => count + 3)}
                  className="inline-flex items-center gap-3 rounded-xl border border-[#4cbae9] bg-white px-7 py-3.5 text-sm font-semibold text-[#4cbae9] transition-all hover:-translate-y-0.5 hover:bg-[#4cbae9] hover:text-white hover:shadow-[0_10px_24px_rgba(38,103,217,0.2)]"
                >
                  More Articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
