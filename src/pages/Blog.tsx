import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>Blog | Horizon Real Estate</title>
        <meta name="description" content="Latest news, insights, and updates from Horizon Real Estate." />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        <section className="bg-navy text-white py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Blog</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Stay updated with the latest news, insights, and tips from the real estate industry.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            {isLoading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No blog posts yet</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="card-project group">
                    <div className="aspect-video bg-secondary overflow-hidden">
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Blog Image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {post.published_at && (
                        <p className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.published_at), "MMM d, yyyy")}
                        </p>
                      )}
                      <h3 className="text-xl font-serif font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
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
