import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useSiteSettings, useSocialLinks } from "@/hooks/useSiteSettings";

const iconMap: Record<string, any> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
};

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: socialLinks } = useSocialLinks();

  return (
    <footer className="bg-navy text-white">
      {/* Contact Info Bar */}
      <div className="border-b border-white/10">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Address</p>
                <p className="text-white">{settings?.address || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Phone</p>
                <a href={`tel:${settings?.phone?.replace(/\s/g, '')}`} className="text-white hover:text-primary transition-colors">
                  {settings?.phone || "+880 1234 567 890"}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60">Email</p>
                <a href={`mailto:${settings?.email}`} className="text-white hover:text-primary transition-colors">
                  {settings?.email || "info@example.com"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright left, Social right */}
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-8 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} {settings?.site_name || "Horizon"}. All rights reserved.
            </p>
          </div>
          <div className="flex gap-3">
            {socialLinks?.map((social) => {
              const IconComponent = iconMap[social.icon] || Facebook;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;