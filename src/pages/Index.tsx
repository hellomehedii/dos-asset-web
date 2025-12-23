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

  return (
    <>
      <Helmet>
        {/* Page title only from Page SEO */}
        {seo?.page_title && <title>{seo.page_title}</title>}

        {/* Meta from Page SEO */}
        {seo?.meta_description && (
          <meta name="description" content={seo.meta_description} />
        )}

        {seo?.meta_keywords && (
          <meta name="keywords" content={seo.meta_keywords} />
        )}

        {/* Favicon from Site Settings */}
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
