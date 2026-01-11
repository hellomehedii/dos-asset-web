import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutIntro from "@/components/AboutIntro";
import WhyChooseUs from "@/components/WhyChooseUs";
import LatestBlogs from "@/components/LatestBlogs";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePageSeo } from "@/hooks/usePageSeo";

const Index = () => {
const { data: settings } = useSiteSettings();
const { data: seo } = usePageSeo("/");

// Document title (NO site name)
const documentTitle =
  seo?.meta_title ||
  seo?.page_title ||
  "DOS ASSET DEVELOPMENT"; // optional fallback

return (
  <>
    <Helmet>
      {/* Document title */}
      <title>{documentTitle}</title>

      {/* Meta Description */}
      {seo?.meta_description && (
        <meta name="description" content={seo.meta_description} />
      )}

      {/* Meta Keywords */}
      {seo?.meta_keywords && (
        <meta name="keywords" content={seo.meta_keywords} />
      )}

      {/* Open Graph */}
      <meta
        property="og:title"
        content={seo?.meta_title || seo?.page_title || "DOS ASSET DEVELOPMENT"}
      />

      {seo?.meta_description && (
        <meta property="og:description" content={seo.meta_description} />
      )}

      {/* Favicon */}
      {settings?.favicon_url && (
        <link rel="icon" href={settings.favicon_url} />
      )}
    </Helmet>

      <main>
        <Navbar />
        <Hero />
        <FeaturedProjects />
        <AboutIntro />
        <WhyChooseUs />
        <LatestBlogs />
        <Footer />
      </main>
    </>
  );
};

export default Index;
