import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";


const OurStory = () => {
  /* ================= PAGE SEO ================= */
  const { data: seo, isLoading: seoLoading } = useQuery({
    queryKey: ["page-seo", "our-story"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("page_title, meta_title, meta_description, og_image")
        .eq("page_slug", "our-story")
        .single();
      return data;
    },
  });

  /* ================= SITE SETTINGS ================= */
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("favicon_url")
        .single();
      return data;
    },
  });

  /* ================= ABOUT CONTENT ================= */
  const { data: aboutContent } = useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const ourStory = aboutContent?.find((c: any) => c.section_type === "our_story");
  const mission = aboutContent?.find((c: any) => c.section_type === "mission");
  const vision = aboutContent?.find((c: any) => c.section_type === "vision");

  /* ================= LOADING STATE ================= */
  if (seoLoading || settingsLoading) return <div>Loading...</div>;

  /* ================= DYNAMIC PAGE TITLE & DESCRIPTION ================= */
  const pageTitle = seo?.meta_title || seo?.page_title; // fallback removed
  const pageDescription = seo?.meta_description;       // fallback removed

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <Helmet>
        {pageTitle && <title>{pageTitle}</title>}
        {pageDescription && <meta name="description" content={pageDescription} />}

        {/* OG */}
        {pageTitle && <meta property="og:title" content={pageTitle} />}
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        {seo?.og_image && <meta property="og:image" content={seo.og_image} />}

        {/* FAVICON */}
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-navy text-white py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {seo?.page_title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Building dreams and creating landmarks since 1998.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">
                  {ourStory?.title}
                </h2>

                <div className="text-muted-foreground space-y-4">
                  {ourStory?.content?.split("\n").map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="bg-secondary rounded-2xl aspect-video overflow-hidden">
                {ourStory?.image_url ? (
                  <img
                    src={ourStory.image_url}
                    alt="Our Story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Company Image
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="text-3xl font-serif font-bold text-center mb-12 text-foreground">
              Mission & Vision
            </h2>

            {/* Mission */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="bg-card rounded-2xl aspect-video overflow-hidden">
                {mission?.image_url ? (
                  <img
                    src={mission.image_url}
                    alt="Our Mission"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/10">
                    Mission Image
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">
                  {mission?.title}
                </h3>
                <p className="text-muted-foreground">{mission?.content}</p>
              </div>
            </div>

            {/* Vision */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">
                  {vision?.title}
                </h3>
                <p className="text-muted-foreground">{vision?.content}</p>
              </div>

              <div className="bg-card rounded-2xl aspect-video overflow-hidden">
                {vision?.image_url ? (
                  <img
                    src={vision.image_url}
                    alt="Our Vision"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-accent/10">
                    Vision Image
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default OurStory;
