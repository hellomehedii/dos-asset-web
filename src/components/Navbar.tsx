import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { motion, AnimatePresence } from "framer-motion";

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const navLinks = useMemo(
    () => [
      { name: "Home", path: "/" },
      {
        name: "About Us",
        dropdown: [
          { name: "Our Story", path: "/about/story" },
          { name: "Management", path: "/about/management" },
        ],
      },
      {
        name: "Projects",
        dropdown: [
          { name: "Upcoming", path: "/projects/upcoming" },
          { name: "On Going", path: "/projects/ongoing" },
          { name: "Handed Over", path: "/projects/completed" },
        ],
      },
      { name: "Blogs", path: "/blog" },
    ],
    [],
  );

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const useTransparent = isHome && !isScrolled;

  const headerClass = useTransparent
    ? "bg-transparent border-b border-border/20"
    : "bg-background/90 backdrop-blur-md ";

  const brandTextClass = useTransparent ? "text-background" : "text-foreground";
  const mutedBrandTextClass = useTransparent
    ? "text-background/80"
    : "text-muted-foreground";

const linkBaseClass = "text-gray-900 hover:text-[#00B2FF] transition-colors";

  const handleMobileDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClass}`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20 lg:h-32">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={
                    isScrolled && settings?.logo_hover_url
                      ? settings.logo_hover_url
                      : settings.logo_url
                  }
                  alt={settings.site_name || "Site logo"}
                  className="h-20 w-auto transition-all duration-500"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            {settings?.show_brand_text && (
              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xl font-serif font-bold ${brandTextClass}`}
                >
                  {settings?.site_name || "DADL"}
                </span>
                <span
                  className={`text-xs tracking-wider uppercase ${mutedBrandTextClass}`}
                >
                  {settings?.site_tagline || "Real Estate"}
                </span>
              </div>
            )}
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
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 pt-2 min-w-[220px]"
                  >
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
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
      <div className="hidden lg:flex items-center gap-5">
  

  <Link to="/contact">
    <Button
      className="
        group relative overflow-visible
        rounded-full
        bg-[#19a7e4]
        px-6 py-3
        text-sm font-semibold text-white
        transition-all duration-300
        hover:bg-[#19a7e4]
      "
      style={{
        background: "linear-gradient(135deg, #0B2A5B 0%, #0F3A7D 100%)",
      }}
    >
      {/* Animated conic-gradient border with moving light streak */}
      <span
        className="
          absolute -inset-[2px]
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-[#1677FF]
          to-[#67E8F9]
          animate-border-glow
          -z-10
          opacity-100
          group-hover:opacity-100
        "
        style={{
          background: "conic-gradient(from 0deg, transparent, #1677FF, #38B6FF, #67E8F9, #EAF6FF, #38B6FF, #1677FF, transparent)",
          backgroundSize: "200% 200%",
        }}
      />
      
      {/* Soft outer glow */}
      <span
        className="
          absolute -inset-[3px]
          rounded-full
          bg-blue-500/20
          blur-sm
          -z-10
          group-hover:bg-blue-400/30
          transition-all duration-300
        "
      />
      
      {/* Dark background layer to keep center dark blue */}
      <span
        className="
          absolute inset-0
          rounded-full
          bg-[#0b5b36]
          -z-10
        "
      />

      {/* Animated shine on hover */}
      <span
        className="
          absolute inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent via-white/20 to-transparent
          transition-transform duration-700
          group-hover:translate-x-full
          rounded-full
        "
      />

      <span className="relative z-10 flex items-center gap-2">
        CONTACT US

        <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          →
        </span>
      </span>
    </Button>
  </Link>
</div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md transition-colors text-[#273235] hover:bg-[#0099ff]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#273235]" />
            ) : (
              <Menu className="w-6 h-6 text-[#273235]" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border overflow-hidden"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <button
                        onClick={() => handleMobileDropdown(link.name)}
                        className={`w-full text-left flex justify-between items-center px-4 py-3 transition-colors ${
                          isActive(link.path)
                            ? "text-primary bg-secondary"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {link.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${openDropdown === link.name ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 transition-colors ${
                          isActive(link.path)
                            ? "text-primary bg-secondary"
                            : "text-foreground hover:bg-secondary"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}

                    {/* Dropdown submenu */}
                    {link.dropdown && (
                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-6 overflow-hidden"
                          >
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}

                <div className="px-4 pt-4 border-t border-border">
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full btn-hero-primary">Contact</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
