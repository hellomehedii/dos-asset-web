import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Ruler, Compass, Building, Home, Bath, Wind } from "lucide-react";

const ProjectDetail = () => {
  const { slug } = useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
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

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center">
          Project not found
        </div>
        <Footer />
      </>
    );
  }

  const statusLabels: Record<string, string> = {
    upcoming: "Upcoming",
    ongoing: "On Going",
    handed_over: "Handed Over",
  };

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  return (
    <>
      <Helmet>
        <title>{`${project.name} | Horizon Real Estate`}</title>
        <meta name="description" content={project.description || `${project.name} - A premium project by Horizon Real Estate located in ${project.location}`} />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        <section className="bg-navy text-white py-12">
          <div className="container-custom">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              project.status === "upcoming" ? "bg-primary/20 text-primary" :
              project.status === "ongoing" ? "bg-accent/20 text-accent" :
              "bg-green-500/20 text-green-400"
            }`}>
              {statusLabels[project.status]}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{project.name}</h1>
            <p className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              {project.location}
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Project Image */}
              <div className="aspect-[3/4] bg-secondary rounded-2xl overflow-hidden">
                {project.featured_image ? (
                  <img 
                    src={project.featured_image} 
                    alt={project.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Project Image
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Project Details</h2>
                
                <div className="space-y-4">
                  {project.land_area && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Ruler className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Land Area</p>
                        <p className="font-medium text-foreground">{project.land_area}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.orientation && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Compass className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Orientation</p>
                        <p className="font-medium text-foreground">{project.orientation}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.plan && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Building className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Plan</p>
                        <p className="font-medium text-foreground">{project.plan}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.num_apartments && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Home className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Number of Apartments</p>
                        <p className="font-medium text-foreground">{project.num_apartments}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.unit_size && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Ruler className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Unit Size</p>
                        <p className="font-medium text-foreground">{project.unit_size}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.room_details && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Home className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Room Details</p>
                        <p className="font-medium text-foreground">{project.room_details}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.toilets && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Bath className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Toilets</p>
                        <p className="font-medium text-foreground">{project.toilets}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.verandas && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Wind className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Verandas</p>
                        <p className="font-medium text-foreground">{project.verandas}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.address && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <MapPin className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium text-foreground">{project.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {project.description && (
                  <div className="mt-8">
                    <h3 className="text-xl font-serif font-bold mb-4 text-foreground">Description</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">Gallery</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((image: string, index: number) => (
                    <div key={index} className="aspect-[4/3] bg-secondary rounded-xl overflow-hidden">
                      <img src={image} alt={`${project.name} gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetail;
