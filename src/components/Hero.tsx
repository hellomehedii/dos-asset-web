import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import { motion } from "framer-motion";
import { fadeUpVariants, staggerContainer } from "@/lib/animations";

const CountUpValue = ({ value }: { value: string }) => {
  const match = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);

  const target = match ? Number(match[1].replace(/,/g, "")) : null;

  const suffix = match?.[2] || "";

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === null) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setCount(target);
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    let animationFrame = 0;

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(target * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  if (target === null) {
    return <>{value}</>;
  }

  const decimalPlaces = match?.[1].split(".")[1]?.length || 0;

  return (
    <>
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
      {suffix}
    </>
  );
};

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
    {
      value: heroContent?.stat_1_value || "25+",
      label: heroContent?.stat_1_label || "Years Experience",
    },
    {
      value: heroContent?.stat_2_value || "150+",
      label: heroContent?.stat_2_label || "Projects Completed",
    },
    {
      value: heroContent?.stat_3_value || "10K+",
      label: heroContent?.stat_3_label || "Happy Families",
    },
  ];

  const bannerImage = heroContent?.banner_image || heroBg;

  const headline =
    heroContent?.headline || "Your Trusted Partner in Property Development";

  const highlightText =
    heroContent?.highlight_text ||
    "Your Trusted Partner in Property Development";

  const headlineParts = headline.split(highlightText);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* =====================================
          BACKGROUND IMAGE
      ===================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}
      />

      {/* =====================================
          VERY LIGHT OVERLAY
      ===================================== */}
      <div className="absolute inset-0 bg-white/5" />

      {/* =====================================
          WHITE MOVING CLOUDS
      ===================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-cloud hero-cloud-3" />
        <div className="hero-cloud hero-cloud-4" />
      </div>
      {/* =====================================
          CONTENT
      ===================================== */}
      <div className="w-full relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="max-w-3xl"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* =====================================
                BADGE
            ===================================== */}
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-8"
            >
              <span className="text-accent font-medium">
                {heroContent?.badge_text || "Trusted Since 2023"}
              </span>
            </motion.div>

            {/* =====================================
                HEADLINE
            ===================================== */}
            <motion.h1
              variants={fadeUpVariants}
              className="uppercase text-xl md:text-5xl lg:text-5xl font-bold bg-gradient-to-r from-[#2c3538] via-[#191f20] to-[#007ea8]  bg-clip-text text-transparent leading-tight mb-6"
            >
              {headlineParts[0]} <br></br>
              <span className="bg-gradient-to-r from-[#4cbae9] via-[#2a8fe2] to-[#24bdff] bg-clip-text text-transparent">
                {highlightText}
              </span>
              {headlineParts[1] || ""}
            </motion.h1>

            {/* =====================================
                SUBTEXT
            ===================================== */}
            <motion.p
              variants={fadeUpVariants}
              className="text-base md:text-lg text-dark/80 mb-10 max-w-2xl"
            >
              {heroContent?.subtext ||
                "We transform visions into exceptional living spaces. Transparency and Trust Our Commitment | Customer Satisfaction Our Highest Goal"}
            </motion.p>

            {/* =====================================
                CTA BUTTON
            ===================================== */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Link to={heroContent?.primary_button_link || "/projects"}>
                <Button
                  className="bg-gradient-to-r from-[#4cbae9] via-[#4cbae9] to-[#19a7e4]
             text-white font-semibold
             hover:scale-105 hover:shadow-xl
             hover:shadow-[#2a8fe2]/30
             transition-all duration-300"
                >
                  {heroContent?.primary_button_text || "Explore Projects"}
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </motion.div>

            {/* =====================================
                STATS
            ===================================== */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap gap-8 md:gap-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div
                    className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#4cbae9] via-[#2a8fe2] to-[#24bdff] 
 bg-clip-text text-transparent mb-1 mb-1"
                  >
                    <CountUpValue value={stat.value} />
                  </div>

                  <div className="text-dark/70 text-base md:text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
