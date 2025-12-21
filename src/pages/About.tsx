import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const { data: teamMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("management_team")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>About Us | Horizon Real Estate</title>
        <meta name="description" content="Learn about Horizon Real Estate - your trusted partner in premium property development since 1998." />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-navy text-white py-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Us</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Building dreams and creating landmarks since 1998. Your trusted partner in premium real estate development.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 1998, Horizon Real Estate has been at the forefront of premium property development in Bangladesh. Our journey began with a simple vision: to create living spaces that combine quality, innovation, and sustainability.
                </p>
                <p className="text-muted-foreground mb-4">
                  Over the years, we have successfully delivered numerous residential and commercial projects that have transformed the urban landscape of Dhaka and beyond.
                </p>
                <p className="text-muted-foreground">
                  Today, we continue to push boundaries and set new standards in real estate development, always keeping our commitment to excellence and customer satisfaction at the heart of everything we do.
                </p>
              </div>
              <div className="bg-secondary rounded-2xl aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">Company Image</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-card rounded-2xl p-8">
                <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">Our Mission</h3>
                <p className="text-muted-foreground">
                  To deliver exceptional real estate solutions that exceed customer expectations while maintaining the highest standards of quality, integrity, and innovation in every project we undertake.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8">
                <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the most trusted and respected real estate developer in Bangladesh, known for creating sustainable communities and iconic landmarks that enhance the quality of life for generations to come.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-3xl font-serif font-bold text-center mb-12 text-foreground">Our Management Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers?.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-secondary overflow-hidden">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Photo
                      </div>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-foreground">{member.name}</h4>
                  <p className="text-primary text-sm">{member.designation}</p>
                  {member.bio && <p className="text-muted-foreground text-sm mt-2">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
