import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const LatestBlogs = () => {
  const { data: blogs } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Our Blog
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-3 mb-4">
            Latest News
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest trends, tips, and updates from the
            real estate industry.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs?.map((blog, index) => (
            <article
              key={blog.id}
              className="card-project group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={blog.featured_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta - Only date, no author */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{blog.published_at ? format(new Date(blog.published_at), "MMM d, yyyy") : "Draft"}</span>
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                <Link to={`/blog/${blog.slug}`}>
                  <Button variant="link" className="p-0 h-auto text-primary group/btn">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button className="btn-primary">
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;
