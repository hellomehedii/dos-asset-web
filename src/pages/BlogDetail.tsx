import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";

const BlogDetail = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
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
        <div className="pt-20 min-h-screen flex items-center justify-center">
          Blog post not found
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.meta_title || post.title} | Horizon Real Estate`}</title>
        <meta name="description" content={post.meta_description || post.excerpt || `Read ${post.title} on Horizon Real Estate blog`} />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        <article>
          {/* Hero */}
          <section className="bg-navy text-white py-20">
            <div className="container-custom max-w-4xl">
              {post.published_at && (
                <p className="flex items-center gap-2 text-white/60 mb-4">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </p>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold">{post.title}</h1>
            </div>
          </section>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="container-custom max-w-4xl -mt-8">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Content */}
          <section className="section-padding">
            <div className="container-custom max-w-4xl">
              <div className="prose prose-lg max-w-none text-foreground">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
                ) : (
                  <p className="text-muted-foreground">No content available</p>
                )}
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
