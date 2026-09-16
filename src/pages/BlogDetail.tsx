import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import "react-quill-new/dist/quill.snow.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const decodedSlug = slug ? decodeURIComponent(slug) : "";
  const legacySlug = decodedSlug.replace(/-/g, " ");

  /* ================= BLOG POST ================= */
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", decodedSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .in("slug", [decodedSlug, legacySlug])
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!decodedSlug,
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

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-36 min-h-screen flex items-center justify-center">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="pt-36 min-h-screen flex items-center justify-center">
          Blog post not found
        </div>
        <Footer />
      </>
    );
  }

  /* ================= SEO VALUES ================= */
  const pageTitle = post.meta_title || post.title;

  const fullTitle = pageTitle;

  const pageDescription =
    post.meta_description ||
    post.excerpt ||
    `Read ${post.title}`;

  const readingTime = Math.max(
    1,
    Math.ceil(
      (post.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length / 200,
    ),
  );

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image} />
        )}

        {/* Favicon */}
        {settings?.favicon_url && (
          <link rel="icon" href={settings.favicon_url} />
        )}
      </Helmet>

      <Navbar />

      <main className="bg-[#f7f9fc] pt-20 text-[#172033] md:pt-32">
        <article>
          <header className="relative overflow-hidden bg-[#102235] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(36,167,228,0.2),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(255,255,255,0.06),transparent_30%)]" />
            <div className="container-custom relative max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
              <Link
                to="/blog"
                className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Journal
              </Link>

              <div className="max-w-4xl">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#62d0ff]">
                  DADL Journal
                </p>
                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-white/65">
                  {post.published_at && (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#62d0ff]" aria-hidden="true" />
                      {format(new Date(post.published_at), "MMMM d, yyyy")}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#62d0ff]" aria-hidden="true" />
                    {readingTime} min read
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-serif font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </header>

          <section className="container-custom max-w-6xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
            <div className="mx-auto max-w-3xl  ">
              <div className="blog-content ql-editor !h-auto !min-h-0 !w-full !p-0 text-base text-slate-700 md:text-lg">
                {post.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground">No content available</p>
                )}
              </div>
            </div>
          </section>
        </article>
      </main>

      <style>{`
        .blog-content.ql-editor {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          font-family: inherit;
          line-height: 1.75;
        }

        .blog-content.ql-editor p,
        .blog-content.ql-editor ol,
        .blog-content.ql-editor ul,
        .blog-content.ql-editor blockquote,
        .blog-content.ql-editor pre {
          margin-bottom: 0.3rem;
        }

        .blog-content.ql-editor h1,
        .blog-content.ql-editor h2,
        .blog-content.ql-editor h3,
        .blog-content.ql-editor h4,
        .blog-content.ql-editor h5,
        .blog-content.ql-editor h6 {
          color: #172033;
          font-family: inherit;
          font-weight: 700;
          line-height: 1.25;
          margin: 2rem 0 1rem;
        }

        .blog-content.ql-editor h1 { font-size: 2rem; }
        .blog-content.ql-editor h2 { font-size: 1.75rem; }
        .blog-content.ql-editor h3 { font-size: 1.5rem; }
        .blog-content.ql-editor a { color: #167bb5; text-decoration: underline; }
        .blog-content.ql-editor blockquote {
          border-left: 4px solid #24a7e4;
          color: #526174;
          padding-left: 1rem;
        }
        .blog-content.ql-editor img {
          height: auto;
          max-width: 100%;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default BlogDetail;
