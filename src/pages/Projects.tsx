import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, ArrowRight, Search, X } from "lucide-react";
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
  const [locationQuery, setLocationQuery] = React.useState("");

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

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];

    const normalizedQuery = locationQuery.trim().toLowerCase();

    if (!normalizedQuery) return projects;

    return projects.filter((project) =>
      (project.location || "").toLowerCase().includes(normalizedQuery)
    );
  }, [projects, locationQuery]);

  return (
    <>
      {/* ================== SEO / HEAD ================== */}
      <Helmet>
        <title>{`${pageTitle}`}</title>
        <meta name="description" content={pageDescription} />
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <Navbar />

      {/* ================== MAIN ================== */}
      <main className="pt-36">
        {/* ================== HERO ================== */}
        <section className="relative overflow-hidden bg-[#071827] text-white py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),transparent_30%)]" />
          <div className="container-custom relative">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                Premium living
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                {pageTitle}
              </h1>
            </div>

            <div className="flex gap-3 flex-wrap mb-6">
              {/* Filter Buttons */}
              <Link to="/projects">
                <Button
                  className={
                    !status
                      ? "rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                      : "rounded-full border border-white/15 bg-white/5 px-5 text-white/80 hover:bg-white/10 hover:text-white"
                  }
                >
                  All
                </Button>
              </Link>

              <Link to="/projects/upcoming">
                <Button
                  className={
                    status === "upcoming"
                      ? "rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                      : "rounded-full border border-white/15 bg-white/5 px-5 text-white/80 hover:bg-white/10 hover:text-white"
                  }
                >
                  Upcoming
                </Button>
              </Link>

              <Link to="/projects/ongoing">
                <Button
                  className={
                    status === "ongoing"
                      ? "rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                      : "rounded-full border border-white/15 bg-white/5 px-5 text-white/80 hover:bg-white/10 hover:text-white"
                  }
                >
                  On Going
                </Button>
              </Link>

              <Link to="/projects/completed">
                <Button
                  className={
                    status === "completed"
                      ? "rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                      : "rounded-full border border-white/15 bg-white/5 px-5 text-white/80 hover:bg-white/10 hover:text-white"
                  }
                >
                  Handed Over
                </Button>
              </Link>
            </div>
            <p className="max-w-2xl text-base text-white/75 md:text-lg">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* ================== PROJECTS LIST ================== */}
        <section className="section-padding pt-8">
          <div className="container-custom">
            <div className="mb-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder="Search by project location..."
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
                  aria-label="Search projects by location"
                />
                {locationQuery && (
                  <button
                    type="button"
                    onClick={() => setLocationQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {isLoading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/40 text-base text-muted-foreground">
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-secondary/40 text-center text-base text-muted-foreground">
                <p className="text-lg font-medium text-foreground">No projects found</p>
                <p className="mt-2 text-sm">
                  Try another location or clear the search.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]"
                  >
                    <div className="relative aspect-[4/4.6] overflow-hidden bg-slate-100">
                      <img
                        src={
                          project.featured_image ||
                          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop"
                        }
                        alt={project.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        style={{ imageRendering: "auto" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <Badge
                        className={`absolute left-4 top-4 ${
                          statusColors[project.status]
                        } rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]`}
                      >
                        {statusLabels[project.status]}
                      </Badge>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-serif font-bold uppercase tracking-[0.08em] text-foreground md:text-[1.35rem]">
                          {project.name}
                        </h3>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          {project.location}
                        </p>
                      </div>

                      <div className="mt-7 flex justify-center">
                        <Link to={`/project/${project.slug}`} className="w-full">
                          <Button
                            variant="outline"
                            className="w-full justify-center gap-2 rounded-full border-primary/30 bg-primary/5 text-primary transition-all hover:bg-primary hover:text-white"
                          >
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
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
