import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  /* ================= SEO ================= */
  const { data: seo, isLoading } = useQuery({
    queryKey: ["page-seo", "contact"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_seo")
        .select(
          "page_title, meta_title, meta_description, og_image"
        )
        .eq("page_slug", "contact")
        .single();
      return data;
    },
  });

  const pageTitle = seo?.meta_title || seo?.page_title || "Contact Us";
  const pageDescription =
    seo?.meta_description ||
    "Get in touch with us. We're here to help with all your property needs.";
  const canonicalUrl = window.location.href;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert(formData);
      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you shortly.",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* ================= HERO ================= */}
        <section className="bg-primary text-white py-14 md:py-20">
          <div className="container-custom px-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {seo?.page_title || "Contact Us"}
            </h1>
            <p className="text-base md:text-xl text-white/80 max-w-2xl">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="section-padding">
          <div className="container-custom px-4">
            <div className="grid gap-10 lg:grid-cols-2">
              {/* ================= INFO ================= */}
              <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin,
                      title: "Office Address",
                      value: settings?.address || "Dhaka, Bangladesh",
                    },
                    {
                      icon: Phone,
                      title: "Phone",
                      value: settings?.phone || "+880",
                      link: `tel:${settings?.phone}`,
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      value: settings?.email || "info@example.com",
                      link: `mailto:${settings?.email}`,
                    },
                    {
                      icon: Clock,
                      title: "Working Hours",
                      value: "Saturday – Thursday : 10 AM – 6 PM",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-muted-foreground hover:text-primary"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* MAP */}
               <div className="w-full aspect-video rounded-xl overflow-hidden border border-border">
  <iframe
    src="https://www.openstreetmap.org/export/embed.html?bbox=90.25876270771024,23.80690442623615,90.27876270771024,23.82690442623615&layer=mapnik&marker=23.81690442623615,90.26876270771024"
    className="w-full h-full"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>

              </div>

              {/* ================= FORM ================= */}
              <div
                className="
                bg-white dark:bg-stone-950
                rounded-xl
                p-5 sm:p-6 md:p-8
                border border-primary/30
                dark:border-primary-400
                shadow-lg md:shadow-xl
              "
              >
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />

                  <Textarea
                    placeholder="Your message..."
                    rows={17}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <Button className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
