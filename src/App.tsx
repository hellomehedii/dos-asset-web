import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import RealtimeInvalidation from "@/components/RealtimeInvalidation";
import WhatsappButton from "@/components/WhatsappButton";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants, pageTransition } from "./lib/animations";
import React, { Suspense, lazy, useEffect } from "react";
import LazyLoadingIcon from "@/components/ui/lazy-loading-icon";
import { initGoogleAnalytics, gaPageview, initFacebookPixel, fbPageview } from "./lib/analytics";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// ===================== Lazy Loaded Pages =====================
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const OurStory = lazy(() => import("./pages/about/OurStory"));
const Management = lazy(() => import("./pages/about/Management"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Contact = lazy(() => import("./pages/Contact"));

// ===================== Lazy Loaded Admin Pages =====================
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Overview = lazy(() => import("./pages/admin/Overview"));
const ProjectsManager = lazy(() => import("./pages/admin/ProjectsManager"));
const BlogsManager = lazy(() => import("./pages/admin/BlogsManager"));
const TeamManager = lazy(() => import("./pages/admin/TeamManager"));
const SiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const SocialLinksManager = lazy(() => import("./pages/admin/SocialLinksManager"));
const PageSeoManager = lazy(() => import("./pages/admin/PageSeoManager"));
const HeroManager = lazy(() => import("./pages/admin/HeroManager"));
const AboutManager = lazy(() => import("./pages/admin/AboutManager"));
const ContactMessagesManager = lazy(() => import("./pages/admin/ContactMessagesManager"));

// =============================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 0,
    },
  },
});

const AppWrapper = () => {
  const location = useLocation();
  const showWhatsappButton = !location.pathname.startsWith("/admin");
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const GA_ID = settings?.google_analytics_id;
    const FB_ID = settings?.meta_pixel_id;
    if (GA_ID) initGoogleAnalytics(GA_ID);
    if (FB_ID) initFacebookPixel(FB_ID);
    // initial pageview
    if (GA_ID) gaPageview(window.location.pathname + window.location.search);
    if (FB_ID) fbPageview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    const GA_ID = settings?.google_analytics_id;
    const FB_ID = settings?.meta_pixel_id;
    if (GA_ID) gaPageview(location.pathname + location.search);
    if (FB_ID) fbPageview();
  }, [location, settings]);

  return (
    <>
      <Toaster />
      <Sonner />
      <RealtimeInvalidation />
      {showWhatsappButton && <WhatsappButton />}

      <Suspense
        fallback={
          <div className="py-20">
            <LazyLoadingIcon size={72} className="mx-auto" durationMs={1400} />
          </div>
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about/story" element={<OurStory />} />
          <Route path="/about/management" element={<Management />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:status" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="blogs" element={<BlogsManager />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="social" element={<SocialLinksManager />} />
            <Route path="seo" element={<PageSeoManager />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="messages" element={<ContactMessagesManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
