import { Shield, Eye, Clock, Award, Users, Leaf } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "We use premium materials and follow strict quality standards in every project.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Clear communication and honest dealings throughout your investment journey.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We honor our commitments with on-time project completion, every time.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized for excellence in design and construction across the industry.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Skilled architects, engineers, and professionals dedicated to your vision.",
  },
  {
    icon: Leaf,
    title: "Sustainable Design",
    description: "Eco-friendly construction practices for a greener tomorrow.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-navy text-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">
            Our Commitment
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-3 mb-4">
            Why Choose <span className="text-accent">DADL ?</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We go beyond building structures – we create lasting relationships
            built on trust, quality, and excellence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
