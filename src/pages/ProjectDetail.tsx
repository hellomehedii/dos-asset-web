import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
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
  ArrowLeft,
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
        <div className="pt-32 min-h-screen flex items-center justify-center">
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
        <div className="pt-32 min-h-screen flex items-center justify-center">
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
    if (lat && lng) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (apiKey) {
        return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=15`;
      } else {
        // Use OpenStreetMap as fallback since Google Maps may be blocked
        const delta = 0.01; // Approximate for zoom 15
        const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
      }
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

      <main className="pt-32">
        <section className="relative overflow-hidden bg-[#071827] text-white py-12 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),transparent_30%)]" />
          <div className="container-custom relative px-4 md:px-0">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
              {project.name}
            </h1>
            <p className="flex items-center gap-2 text-sm sm:text-base text-white/80">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              {project.location}
            </p>
          </div>
        </section>

        <section className="section-padding pt-10 px-4 md:px-0">
          <div className="container-custom">
            <Link
              to="/projects"
              className="group mb-8 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-border bg-secondary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-all duration-300 hover:-translate-x-1 hover:border-primary/40 hover:bg-secondary/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 whitespace-nowrap"
            >
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-1 ring-border transition-colors group-hover:bg-primary/5 group-hover:text-primary flex-shrink-0">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">Back to Projects</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Project Image */}
              <div className="aspect-[3/4] sm:aspect-[4/5] bg-secondary rounded-xl sm:rounded-2xl overflow-hidden">
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
                <h2 className="text-xl sm:text-2xl font-serif font-bold mb-6 text-foreground">
                  Project Details
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {project.land_area && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Land Area
                        </p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.land_area}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.orientation && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Orientation
                        </p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.orientation}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.plan && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Building className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Plan</p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.plan}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.num_apartments && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Number of Apartments
                        </p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.num_apartments}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.unit_size && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Unit Size
                        </p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.unit_size}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.room_details && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Home className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Room Details
                        </p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.room_details}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.verandas && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Belcony</p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.verandas}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.HandOver && (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary rounded-lg sm:rounded-xl">
                      <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Hand Over
                        </p>
                        <p className="text-sm sm:font-medium text-foreground truncate">
                          {project.HandOver}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className="mt-12 lg:mt-16">
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 text-foreground">
                  Description
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Gallery */}
            {Array.isArray(gallery) && gallery.length > 0 && (
              <div className="mt-12 lg:mt-16">
                <h2 className="text-lg sm:text-2xl font-serif font-bold mb-6 sm:mb-8 text-foreground">
                  Gallery
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {galleryFiltered.map((image, index) => (
                    <div
                      key={index}
                      className="bg-secondary rounded-lg sm:rounded-xl overflow-hidden p-1 sm:p-2 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
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
                          src={String(image)}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-auto object-contain rounded-md"
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
                <div className="mt-12 lg:mt-16">
                  <h2 className="text-lg sm:text-2xl font-serif font-bold mb-4 text-foreground">
                    Project Google Map Location
                  </h2>
                  <div className="rounded-lg sm:rounded-xl overflow-hidden bg-secondary">
                    <iframe
                      title={`map-${project.slug}`}
                      src={mapSrc}
                      width="100%"
                      height="450"
                      loading="lazy"
                      className="border-0 w-full h-[450px]"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              );
            })()}

            {/* YouTube Video */}
            {(() => {
              const youtubeUrl = (project as any).youtube_video_url;
              if (!youtubeUrl) return null;

              // Extract video ID from YouTube URL
              const getYouTubeVideoId = (url: string) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);
                return match && match[2].length === 11 ? match[2] : null;
              };

              const videoId = getYouTubeVideoId(youtubeUrl);
              if (!videoId) return null;

              return (
                <div className="mt-12 lg:mt-16">
                  <h2 className="text-lg sm:text-2xl font-serif font-bold mb-4 text-foreground">
                    Project Video
                  </h2>
                  <div className="rounded-lg sm:rounded-xl overflow-hidden bg-secondary">
                    <iframe
                      title={`youtube-video-${project.slug}`}
                      src={`https://www.youtube.com/embed/${videoId}`}
                      width="100%"
                      height="650"
                      loading="lazy"
                      className="border-0 w-full h-[650px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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
