import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Ruler,
  Compass,
  Building,
  Home,
  Handshake,
  Landmark,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

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

  // Modal state hooks must be declared unconditionally before any early returns
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showDetailsInModal, setShowDetailsInModal] = useState(false);

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

  const gallery = Array.isArray(project?.gallery) ? project.gallery : [];
  const galleryFiltered = (gallery || []).filter(
    (img) => typeof img === "string" && img.trim() !== ""
  ) as string[];

  const getMapEmbedSrc = () => {
    // Prefer explicit embed field
    const embed = (project as any).google_map_embed;
    if (embed && typeof embed === "string") {
      // If it's a full iframe string, try to extract src
      const iframeMatch = embed.match(/src=\"([^\"]+)\"/i);
      if (iframeMatch) return iframeMatch[1];
      // If it's a bare URL, use it directly
      if (embed.startsWith("http")) return embed;
    }

    // Fallback to latitude/longitude
    const lat = (project as any).latitude;
    const lng = (project as any).longitude;
    if (lat || lng) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }

    return null;
  };

  return (
    <>
      <Helmet>
        <title>{`${project.name} | DADL`}</title>
        <meta
          name="description"
          content={
            project.description ||
            `${project.name} - A premium project by DADL located in ${project.location}`
          }
        />
        {/* SEO / Social tags */}
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : ""}
        />
        <meta property="og:title" content={`${project.name} | DADL`} />
        <meta
          property="og:description"
          content={
            project.description ||
            `${project.name} - A premium project by DADL located in ${project.location}`
          }
        />
        {project.featured_image && (
          <meta property="og:image" content={project.featured_image} />
        )}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        {project.featured_image && (
          <meta name="twitter:image" content={project.featured_image} />
        )}
      </Helmet>

      <Navbar />

      <main className="pt-20">
        <section className="bg-navy text-white py-12">
          <div className="container-custom">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                project.status === "upcoming"
                  ? "bg-primary/20 text-primary"
                  : project.status === "ongoing"
                  ? "bg-accent/20 text-accent"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {statusLabels[project.status]}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {project.name}
            </h1>
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
                <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">
                  Project Details
                </h2>

                <div className="space-y-4">
                  {project.land_area && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Ruler className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Land Area
                        </p>
                        <p className="font-medium text-foreground">
                          {project.land_area}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.orientation && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Compass className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Orientation
                        </p>
                        <p className="font-medium text-foreground">
                          {project.orientation}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.plan && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Building className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Plan</p>
                        <p className="font-medium text-foreground">
                          {project.plan}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.num_apartments && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Home className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Number of Apartments
                        </p>
                        <p className="font-medium text-foreground">
                          {project.num_apartments}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.unit_size && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Ruler className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Unit Size
                        </p>
                        <p className="font-medium text-foreground">
                          {project.unit_size}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.room_details && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Home className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Room Details
                        </p>
                        <p className="font-medium text-foreground">
                          {project.room_details}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.verandas && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Landmark className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Belcony</p>
                        <p className="font-medium text-foreground">
                          {project.verandas}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.HandOver && (
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                      <Handshake className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Hand Over
                        </p>
                        <p className="font-medium text-foreground">
                          {project.HandOver}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              
              </div>
                {project.description && (
                  <div className="mt-8">
                    <h3 className="text-xl font-serif font-bold mb-4 text-foreground">
                      Description
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>
                )}
            </div>

            {/* Gallery */}
            {Array.isArray(gallery) && gallery.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">
                  Gallery
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryFiltered.map((image, index) => (
                    <div
                      key={index}
                      className="bg-secondary rounded-xl overflow-hidden p-2 flex items-center justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(String(image));
                          setCurrentIndex(index);
                          setModalOpen(true);
                          setShowDetailsInModal(false);
                        }}
                        className="w-full"
                      >
                        <img
                          src={String(image)} // Explicitly cast 'image' to string
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-auto object-contain rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Embed */}
            {(() => {
              const mapSrc = getMapEmbedSrc();
              if (!mapSrc) return null;
              return (
                <div className="mt-12">
                  <h2 className="text-2xl font-serif font-bold mb-4 text-foreground">
                    Project Google Map Location
                  </h2>
                  <div className="rounded-xl overflow-hidden bg-secondary">
                    <iframe
                      title={`map-${project.slug}`}
                      src={mapSrc}
                      width="100%"
                      height="450"
                      loading="lazy"
                      className="border-0 w-full h-[450px]"
                      referrerPolicy="no-referrer-when-downgrade"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                    />
                  </div>
                </div>
              );
            })()}

            {/* Image Modal */}
            <Dialog
              open={modalOpen}
              onOpenChange={(open) => {
                setModalOpen(open);
                if (!open) {
                  setSelectedImage(null);
                  setCurrentIndex(null);
                }
              }}
            >
              <DialogContent className="p-0 bg-transparent">
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div className="relative bg-black rounded-xl p-4 max-w-[95vw] max-h-[95vh]">
                    <DialogClose className="absolute top-3 right-3 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-50">
                      <X className="w-5 h-5" />
                    </DialogClose>

                    {/* Prev/Next buttons */}
                    {galleryFiltered.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (currentIndex === null) return;
                            const next =
                              (currentIndex - 1 + galleryFiltered.length) %
                              galleryFiltered.length;
                            setCurrentIndex(next);
                            setSelectedImage(galleryFiltered[next]);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-40"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (currentIndex === null) return;
                            const next =
                              (currentIndex + 1) % galleryFiltered.length;
                            setCurrentIndex(next);
                            setSelectedImage(galleryFiltered[next]);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-40"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    <div className="flex items-center justify-center">
                      {galleryFiltered.length > 0 ? (
                        <img
                          src={galleryFiltered[currentIndex ?? 0]}
                          alt={`Gallery image ${currentIndex ?? 0 + 1}`}
                          className="block mx-auto object-contain"
                          style={{ maxWidth: "90vw", maxHeight: "80vh" }}
                        />
                      ) : (
                        <div className="text-white">No image</div>
                      )}
                    </div>

                    {/* Thumbnails strip */}
                    {galleryFiltered.length > 1 && (
                      <div className="mt-4 flex items-center justify-center">
                        <div className="flex gap-2 overflow-x-auto">
                          {galleryFiltered.map((thumb, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setCurrentIndex(i);
                                setSelectedImage(thumb);
                              }}
                              className={`rounded-md overflow-hidden border-2 ${
                                i === currentIndex
                                  ? "border-primary"
                                  : "border-transparent"
                              }`}
                            >
                              <img
                                src={thumb}
                                alt={`thumb-${i}`}
                                className="w-20 h-12 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetail;
