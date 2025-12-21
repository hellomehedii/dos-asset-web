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
        <title>{`${seo?.meta_title || seo?.page_title || "Home"} | ${settings?.site_name || "Horizon"}`}</title>
        {seo?.meta_description ? (
          <meta name="description" content={seo.meta_description} />
        ) : (
          <meta name="description" content="Horizon Real Estate - Your trusted partner in premium residential and commercial property development since 1998. Explore our portfolio of quality projects in Dhaka and beyond." />
        )}
        {seo?.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}
        <link rel="canonical" href={window.location.origin} />
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
