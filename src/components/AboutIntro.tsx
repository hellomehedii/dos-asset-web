import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutIntro = () => {
  const highlights = [
    "Over 25 years of industry experience",
    "150+ successful projects delivered",
    "Premium quality construction standards",
    "Customer-centric approach",
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative animate-fade-up">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop"
                alt="Luxury Property"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-2xl shadow-xl max-w-xs hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">25+</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Years of Trust</p>
                  <p className="text-sm text-muted-foreground">Building Dreams</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">
              About Horizon
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mt-3 mb-6">
              Building Dreams, Creating <span className="text-primary">Landmarks</span>
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Since 1998, Horizon Real Estate has been at the forefront of premium
              property development in Bangladesh. We combine innovative design with
              exceptional craftsmanship to create spaces that inspire and endure.
            </p>
            <p className="text-muted-foreground mb-8">
              Our commitment to quality, transparency, and timely delivery has earned
              us the trust of thousands of families and investors across the nation.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button className="btn-primary">
              Learn Our Story
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
