import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusMap: Record<string, string> = {
  upcoming: "upcoming",
  ongoing: "ongoing",
  completed: "handed_over",
};

const statusLabels: Record<string, string> = {
  upcoming: "Upcoming",
  ongoing: "On Going",
  handed_over: "Handed Over",
};

const Projects = () => {
  const { status } = useParams();
  const dbStatus = status ? statusMap[status] : undefined;

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", dbStatus],
    queryFn: async () => {
      let query = supabase.from("projects").select("*").order("display_order");
      if (dbStatus) {
        query = query.eq("status", dbStatus as "upcoming" | "ongoing" | "handed_over");
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const pageTitle = status 
    ? `${statusLabels[dbStatus || ""] || "All"} Projects` 
    : "All Projects";

  return (
    <>
      <Helmet>
        <title>{pageTitle} | Horizon Real Estate</title>
        <meta name="description" content={`Explore our ${pageTitle.toLowerCase()} - premium residential and commercial developments.`} />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        <section className="bg-navy text-white py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{pageTitle}</h1>
            <div className="flex gap-4 flex-wrap">
              <Link to="/projects">
                <Button variant={!status ? "default" : "outline"} className={!status ? "" : "text-white border-white/30 hover:bg-white/10"}>
                  All
                </Button>
              </Link>
              <Link to="/projects/upcoming">
                <Button variant={status === "upcoming" ? "default" : "outline"} className={status === "upcoming" ? "" : "text-white border-white/30 hover:bg-white/10"}>
                  Upcoming
                </Button>
              </Link>
              <Link to="/projects/ongoing">
                <Button variant={status === "ongoing" ? "default" : "outline"} className={status === "ongoing" ? "" : "text-white border-white/30 hover:bg-white/10"}>
                  On Going
                </Button>
              </Link>
              <Link to="/projects/completed">
                <Button variant={status === "completed" ? "default" : "outline"} className={status === "completed" ? "" : "text-white border-white/30 hover:bg-white/10"}>
                  Handed Over
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            {isLoading ? (
              <div className="text-center py-12">Loading projects...</div>
            ) : projects?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No projects found</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects?.map((project) => (
                  <Link key={project.id} to={`/project/${project.slug}`} className="card-project group">
                    <div className="aspect-[4/3] bg-secondary overflow-hidden">
                      {project.featured_image ? (
                        <img 
                          src={project.featured_image} 
                          alt={project.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Project Image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        project.status === "upcoming" ? "bg-primary/10 text-primary" :
                        project.status === "ongoing" ? "bg-accent/10 text-accent" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {statusLabels[project.status]}
                      </span>
                      <h3 className="text-xl font-serif font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        {project.location}
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

export default Projects;
