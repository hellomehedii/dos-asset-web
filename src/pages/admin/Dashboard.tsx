import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  Users, 
  LogOut, 
  LayoutDashboard,
  Menu,
  Settings,
  Share2,
  Search,
  MessageSquare
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: LayoutDashboard, label: "Hero Section", path: "/admin/hero" },
  { icon: FileText, label: "About Page", path: "/admin/about" },
  { icon: Building2, label: "Projects", path: "/admin/projects" },
  { icon: FileText, label: "Blog Posts", path: "/admin/blogs" },
  { icon: MessageSquare, label: "Contact Messages", path: "/admin/messages" },
  { icon: Users, label: "Team", path: "/admin/team" },
  { icon: Search, label: "Page SEO", path: "/admin/seo" },
  { icon: Settings, label: "Site Settings", path: "/admin/settings" },
  { icon: Share2, label: "Social Links", path: "/admin/social" },
];

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const NavContent = () => (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary text-foreground"
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <span className="font-semibold">CMS Dashboard</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="py-4">
              <NavContent />
              <div className="mt-8 pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r p-4">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="font-semibold text-lg">CMS Dashboard</span>
          </div>
          <NavContent />
          <div className="mt-auto pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2 px-4">{user.email}</p>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
