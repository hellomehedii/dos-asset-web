import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
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

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center px-4 pt-36">
          Loading...
        </div>

        <Footer />
      </>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!post) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center px-4 pt-36 text-center">
          Blog post not found
        </div>

        <Footer />
      </>
    );
  }

  /* ================= SEO ================= */
  const pageTitle = post.meta_title || post.title;

  const pageDescription =
    post.meta_description ||
    post.excerpt ||
    `Read ${post.title}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>

        <meta
          name="description"
          content={pageDescription}
        />

        <meta property="og:type" content="article" />

        <meta
          property="og:title"
          content={pageTitle}
        />

        <meta
          property="og:description"
          content={pageDescription}
        />

        {post.featured_image && (
          <meta
            property="og:image"
            content={post.featured_image}
          />
        )}

        {settings?.favicon_url && (
          <link
            rel="icon"
            href={settings.favicon_url}
          />
        )}
      </Helmet>

      <Navbar />

      <main className="bg-[#f7f9fc] pt-20 text-[#172033] md:pt-32">
        <article>

          {/* ================= HERO ================= */}
          <header className="relative overflow-hidden bg-[#102235] text-white">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(36,167,228,0.2),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(255,255,255,0.06),transparent_30%)]" />

            <div className="container-custom relative mx-auto w-full px-4 py-10 sm:px-6 md:py-16 lg:px-0">

              {/* Back Button */}
              <Link
                to="/blog"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:mb-10"
              >
                <ArrowLeft
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />

                Back to Journal
              </Link>

              <div className="max-w-4xl">

                {/* Date */}
                {post.published_at && (
                  <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-medium text-white/65">
                    <Calendar
                      className="h-4 w-4 shrink-0 text-[#62d0ff]"
                      aria-hidden="true"
                    />

                    <span>
                      {format(
                        new Date(post.published_at),
                        "MMMM d, yyyy"
                      )}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="max-w-4xl font-bangla text-3xl font-semibold leading-[1.3] tracking-normal text-white sm:text-4xl md:text-6xl lg:text-7xl">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {/* {post.excerpt && (
                  <p className="mt-5 max-w-3xl font-bangla text-base leading-7 text-white/70 sm:mt-7 sm:text-lg sm:leading-8 md:text-xl">
                    {post.excerpt}
                  </p>
                )} */}

              </div>
            </div>
          </header>

          {/* ================= BLOG CONTENT ================= */}
          <section className="container-custom mx-auto w-full px-4 py-4 sm:px-6 md:py-8 lg:px-0">

            <div className="mx-auto w-full border border-[#62d0ff] bg-white px-4 py-7 shadow-lg sm:px-8 sm:py-10 md:px-10 md:py-14 lg:px-12 lg:py-16">

              <div className="blog-content ql-editor !h-auto !min-h-0 !w-full !p-0 text-base">

                {post.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        post.content
                      ),
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    No content available
                  </p>
                )}

              </div>
            </div>
          </section>

        </article>
      </main>

      {/* Add readable paragraph separation and keep embedded media within the article. */}
      <style>{`
        .blog-content p:not(:last-child) {
          margin-bottom: 0.75em;
        }

        .blog-content img,
        .blog-content iframe,
        .blog-content video {
          max-width: 100%;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default BlogDetail;