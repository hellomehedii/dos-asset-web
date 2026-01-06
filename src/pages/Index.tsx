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
  const { data: seo } = usePageSeo("home");

  // Document title preference:
  // 1. use `meta_title` (explicit SEO title)
  // 2. if missing, compose `page_title | site_name` when `page_title` exists
  // 3. fall back to site name or default
  const documentTitle =
    seo?.meta_title ||
    (seo?.page_title ? `${seo.page_title} | ${settings?.site_name || "DADL Real Estate"}` : settings?.site_name || "DADL Real Estate");

  return (
    <>
      <Helmet>
        {/* Document title (for browser tab / search engines) */}
        <title>{documentTitle}</title>

        {/* Prefer explicit SEO meta fields when available */}
        {seo?.meta_description ? (
          <meta name="description" content={seo.meta_description} />
        ) : (
          settings?.site_tagline && <meta name="description" content={settings.site_tagline} />
        )}

        {seo?.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}

        {/* Open Graph */}
        <meta
          property="og:title"
          content={seo?.meta_title || (seo?.page_title ? `${seo.page_title} | ${settings?.site_name || "DADL Real Estate"}` : settings?.site_name || "DADL Real Estate")}
        />
        {seo?.meta_description && <meta property="og:description" content={seo.meta_description} />}

        {/* Favicon from Site Settings */}
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}
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
