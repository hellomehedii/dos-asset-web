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
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const { data: settings } = useSiteSettings();
  const location = useLocation();

  const isHome = location.pathname === "/";

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setMobileDropdown(null);
  }, [location.pathname]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

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
    []
  );

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const useTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        useTransparent
          ? "bg-transparent border-b border-border/20"
          : "bg-background/90 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} className="h-10" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
            )}

            {settings?.show_brand_text && (
              <div className="leading-tight">
                <div
                  className={`text-xl font-bold ${
                    useTransparent ? "text-background" : "text-foreground"
                  }`}
                >
                  {settings.site_name}
                </div>
                <div
                  className={`text-xs uppercase ${
                    useTransparent
                      ? "text-background/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {settings.site_tagline}
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.path || "#"}
                  className={`flex items-center gap-1 font-medium ${
                    isActive(link.path)
                      ? "text-primary"
                      : useTransparent
                      ? "text-background/80 hover:text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>

                <AnimatePresence>
                  {link.dropdown && openDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 pt-3"
                    >
                      <div className="bg-popover border rounded-xl shadow-lg min-w-[220px]">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-4 py-3 text-sm ${
                              isActive(item.path)
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:bg-secondary"
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex gap-4">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {settings.phone}
              </a>
            )}
            <Link to="/contact">
              <Button className="btn-hero-primary">Contact</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background z-50 shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <button
                      className="w-full flex justify-between py-3 font-medium"
                      onClick={() =>
                        link.dropdown
                          ? setMobileDropdown(
                              mobileDropdown === link.name ? null : link.name
                            )
                          : setIsMobileMenuOpen(false)
                      }
                    >
                      {link.name}
                      {link.dropdown && (
                        <ChevronDown
                          className={`transition-transform ${
                            mobileDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {link.dropdown && mobileDropdown === link.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 space-y-1"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="block py-2 text-sm text-muted-foreground"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full mt-4 btn-hero-primary">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
