import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const Blog = () => {
  /* ================= SEO ================= */
  const { data: seo } = useQuery({
    queryKey: ["page-seo", "blog"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("title, description")
        .eq("page_slug", "blog")
        .single();
      return data;
    },
  });

  /* ================= SETTINGS ================= */
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

  /* ================= FALLBACK TEXT ================= */
  const pageTitle =
    seo?.title || "Blog";

  const pageDescription =
    seo?.description ||
    "Latest articles, updates and insights.";

  return (
    <>
      {/* ========= SEO ========= */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {settings?.favicon_url && (
          <link rel="icon" href={settings.favicon_url} />
        )}
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* ========= HERO ========= */}
        <section className="bg-navy text-white py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {pageTitle}
            </h1>

            <p className="text-xl text-white/80 max-w-2xl">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* ========= BLOG LIST ========= */}
        <section className="section-padding">
          <div className="container-custom">
            {isLoading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No blog posts found
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="card-project group"
                  >
                    <div className="aspect-video bg-secondary overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {post.published_at && (
                        <p className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                          <Calendar className="w-4 h-4" />
                          {format(
                            new Date(post.published_at),
                            "MMM d, yyyy"
                          )}
                        </p>
                      )}

                      <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <p className="flex items-center gap-2 text-primary font-medium mt-4 text-sm">
                        Read More <ArrowRight className="w-4 h-4" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
