import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutIntro from "@/components/AboutIntro";
import WhyChooseUs from "@/components/WhyChooseUs";
import LatestBlogs from "@/components/LatestBlogs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Horizon Real Estate | Premium Property Development in Bangladesh</title>
        <meta
          name="description"
          content="Horizon Real Estate - Your trusted partner in premium residential and commercial property development since 1998. Explore our portfolio of quality projects in Dhaka and beyond."
        />
        <meta
          name="keywords"
          content="real estate, property, Dhaka, Bangladesh, luxury apartments, residential, commercial, Horizon"
        />
        <link rel="canonical" href="https://horizonrealestate.com" />
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
