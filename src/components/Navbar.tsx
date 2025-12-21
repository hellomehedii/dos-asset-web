import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const navLinks = useMemo(
    () => [
      { name: "Home", path: "/" },
      {
        name: "About Us",
        path: "/about",
        dropdown: [
          { name: "Our Story", path: "/about/story" },
          { name: "Management", path: "/about/management" },
        ],
      },
      {
        name: "Projects",
        path: "/projects",
        dropdown: [
          { name: "Upcoming", path: "/projects/upcoming" },
          { name: "On Going", path: "/projects/ongoing" },
          { name: "Handed Over", path: "/projects/completed" },
        ],
      },
    ],
    []
  );

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const useTransparent = isHome && !isScrolled;

  const headerClass = useTransparent
    ? "bg-transparent border-b border-border/20"
    : "bg-background/90 backdrop-blur-md border-b border-border";

  const brandTextClass = useTransparent ? "text-background" : "text-foreground";
  const mutedBrandTextClass = useTransparent
    ? "text-background/80"
    : "text-muted-foreground";

  const linkBaseClass = useTransparent
    ? "text-background/80 hover:text-background"
    : "text-muted-foreground hover:text-foreground";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.site_name || "Site logo"}
                className="h-10 w-auto"
                loading="eager"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            {settings?.show_brand_text ? (
              <div className="flex flex-col leading-tight">
                <span className={`text-xl font-serif font-bold ${brandTextClass}`}>
                  {settings?.site_name || "Horizon"}
                </span>
                <span className={`text-xs tracking-wider uppercase ${mutedBrandTextClass}`}>
                  {settings?.site_tagline || "Real Estate"}
                </span>
              </div>
            ) : null}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 py-2 font-medium transition-colors ${
                    isActive(link.path) ? "text-primary" : linkBaseClass
                  }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                {link.dropdown && openDropdown === link.name && (
                  <div className="absolute top-full left-0 pt-2 min-w-[220px] animate-fade-in">
                    <div className="rounded-xl shadow-lg border border-border bg-popover overflow-hidden">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-4 py-3 text-sm transition-colors ${
                            isActive(item.path)
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className={`flex items-center gap-2 transition-colors ${
                  useTransparent ? "text-background/90 hover:text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">{settings.phone}</span>
              </a>
            )}
            <Link to="/contact">
              <Button className="btn-hero-primary text-sm py-2 px-5">Contact Us</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${
              useTransparent ? "text-background hover:bg-background/10" : "text-foreground hover:bg-secondary"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
            <div className="py-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 transition-colors ${
                      isActive(link.path)
                        ? "text-primary bg-secondary"
                        : "text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-6 pb-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive(item.path)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-4 pt-4 border-t border-border">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full btn-hero-primary">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

