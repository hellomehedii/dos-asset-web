import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import React from "react";

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

const statusColors: Record<string, string> = {
  upcoming: "bg-primary text-primary-foreground",
  ongoing: "bg-sky-500 text-white",
  handed_over: "bg-green-500 text-white",
};

const Projects = () => {
  const { status } = useParams();
  const dbStatus = status ? statusMap[status] : undefined;

  // Fetch projects based on status
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", dbStatus],
    queryFn: async () => {
      let query = supabase.from("projects").select("*").order("display_order");
      if (dbStatus) {
        query = query.eq(
          "status",
          dbStatus as "upcoming" | "ongoing" | "handed_over"
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    keepPreviousData: true,
  });

  // Site settings for favicon
  const { data: settings } = useSiteSettings();

  // Dynamic page title & description based on status
  const pageTitle = React.useMemo(() => {
    if (!status) return "All Projects";
    return `${statusLabels[dbStatus || ""] || "All"} Projects`;
  }, [status, dbStatus]);

  const pageDescription = React.useMemo(() => {
    return `Explore our ${pageTitle.toLowerCase()} - premium residential and commercial developments.`;
  }, [pageTitle]);

  return (
    <>
      {/* ================== SEO / HEAD ================== */}
      <Helmet>
        <title>{`${pageTitle} | DADL Projects`}</title>
        <meta name="description" content={pageDescription} />
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <Navbar />

      {/* ================== MAIN ================== */}
      <main className="pt-20">
        {/* ================== HERO ================== */}
        <section className="bg-navy text-white py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {pageTitle}
            </h1>
            <div className="flex gap-4 flex-wrap mb-6">
              {/* Filter Buttons */}
              <Link to="/projects">
                <Button
                  className={
                    !status
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent text-white border border-white/30 hover:bg-white/10"
                  }
                >
                  All
                </Button>
              </Link>

              <Link to="/projects/upcoming">
                <Button
                  className={
                    status === "upcoming"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent text-white border border-white/30 hover:bg-white/10"
                  }
                >
                  Upcoming
                </Button>
              </Link>

              <Link to="/projects/ongoing">
                <Button
                  className={
                    status === "ongoing"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent text-white border border-white/30 hover:bg-white/10"
                  }
                >
                  On Going
                </Button>
              </Link>

              <Link to="/projects/completed">
                <Button
                  className={
                    status === "completed"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent text-white border border-white/30 hover:bg-white/10"
                  }
                >
                  Handed Over
                </Button>
              </Link>
            </div>
            <p className="text-white/80 max-w-2xl">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* ================== PROJECTS LIST ================== */}
        <section className="section-padding">
          <div className="container-custom">
            {isLoading ? (
              <div className="text-center py-12">Loading projects...</div>
            ) : projects?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No projects found
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={
                          project.featured_image ||
                          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop"
                        }
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className={`absolute top-4 left-4 ${
                          statusColors[project.status]
                        }`}
                      >
                        {statusLabels[project.status]}
                      </Badge>
                    </div>

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
                        <Button variant="outline"  className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-3">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
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
