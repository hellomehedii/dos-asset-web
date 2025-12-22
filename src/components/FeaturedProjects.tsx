import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  upcoming: "bg-primary text-primary-foreground",
  ongoing: "bg-sky-500 text-white",
  handed_over: "bg-green-500 text-white",
};

const statusLabels: Record<string, string> = {
  upcoming: "Upcoming",
  ongoing: "On Going",
  handed_over: "Handed Over",
};

const FeaturedProjects = () => {
  const { data: projects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-serif font-bold">
            Featured Projects
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Explore our collection of premium residential and commercial
            developments designed to exceed expectations.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[3/4]">
                <img
                  src={
                    project.featured_image ||
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop"
                  }
                  alt={project.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                <Badge
                  className={`absolute top-4 left-4 ${statusColors[project.status]}`}
                >
                  {statusLabels[project.status]}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    {project.name}
                  </h3>
                  <p className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {project.location}
                  </p>
                </div>

                <Link to={`/project/${project.slug}`}>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-3"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/projects">
            <Button className="btn-primary">
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
