import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import RealtimeInvalidation from "@/components/RealtimeInvalidation";
import WhatsappButton from "@/components/WhatsappButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import OurStory from "./pages/about/OurStory";
import Management from "./pages/about/Management";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Dashboard from "./pages/admin/Dashboard";
import Overview from "./pages/admin/Overview";
import ProjectsManager from "./pages/admin/ProjectsManager";
import BlogsManager from "./pages/admin/BlogsManager";
import TeamManager from "./pages/admin/TeamManager";
import SiteSettings from "./pages/admin/SiteSettings";
import SocialLinksManager from "./pages/admin/SocialLinksManager";
import PageSeoManager from "./pages/admin/PageSeoManager";
import HeroManager from "./pages/admin/HeroManager";
import AboutManager from "./pages/admin/AboutManager";
import ContactMessagesManager from "./pages/admin/ContactMessagesManager";

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
  const showWhatsappButton = !location.pathname.startsWith("/admin"); // admin not showing whatsapp button

  return (
    <>
      <Toaster />
      <Sonner />
      <RealtimeInvalidation />
      {showWhatsappButton && <WhatsappButton />}
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
