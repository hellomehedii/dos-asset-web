import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactCTA = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="bg-primary rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-primary-foreground">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">
                Contact Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-3 mb-6">
                Ready to Find Your <span className="text-accent">Dream Home?</span>
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Let our experts guide you through the process. Contact us today
                for a personalized consultation.
              </p>

              <div className="space-y-4">
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/70">Call Us</p>
                    <p className="font-semibold">+880 1234 567 890</p>
                  </div>
                </a>

                <a
                  href="mailto:info@dos.com"
                  className="flex items-center gap-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/70">Email Us</p>
                    <p className="font-semibold">info@dos.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-primary-foreground/90">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/70">Visit Us</p>
                    <p className="font-semibold">House 45, Road 12, Sector 7, Uttara, Dhaka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                Request a Consultation
              </h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>
                <Button type="submit" className="w-full btn-primary">
                  Send Message
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
