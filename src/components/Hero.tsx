import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "@/lib/animations";

const Hero = () => {
  const { data: heroContent } = useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { value: heroContent?.stat_1_value || "25+", label: heroContent?.stat_1_label || "Years Experience" },
    { value: heroContent?.stat_2_value || "150+", label: heroContent?.stat_2_label || "Projects Completed" },
    { value: heroContent?.stat_3_value || "10K+", label: heroContent?.stat_3_label || "Happy Families" },
  ];

  const bannerImage = heroContent?.banner_image || heroBg;

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image - Full width */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50" />

      {/* Content - Full width container */}
      <div className="w-full relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-3xl" variants={staggerContainer} initial="hidden" animate="show">
            {/* Badge */}
            <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-8">
              <span className="text-accent font-medium">{heroContent?.badge_text || "Trusted Since 1998"}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUpVariants} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              {heroContent?.headline?.split(heroContent?.highlight_text || "Real Estate")[0]}
              <span className="text-accent">{heroContent?.highlight_text || "Real Estate"}</span>
              {heroContent?.headline?.split(heroContent?.highlight_text || "Real Estate")[1] || " Development"}
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl">
              {heroContent?.subtext || "We transform visions into exceptional living spaces. Discover our portfolio of premium residential and commercial developments crafted with excellence."}
            </motion.p>

            {/* CTA Button - Only Explore Projects */}
            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to={heroContent?.primary_button_link || "/projects"}>
                <Button className="btn-hero-primary">
                  {heroContent?.primary_button_text || "Explore Projects"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-8 md:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
