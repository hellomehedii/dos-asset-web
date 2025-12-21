import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Users } from "lucide-react";

const Overview = () => {
  const { data: projects } = useQuery({
    queryKey: ["projects-count"],
    queryFn: async () => {
      const { count } = await supabase.from("projects").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs-count"],
    queryFn: async () => {
      const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: team } = useQuery({
    queryKey: ["team-count"],
    queryFn: async () => {
      const { count } = await supabase.from("management_team").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    { label: "Projects", value: projects, icon: Building2, color: "text-primary" },
    { label: "Blog Posts", value: blogs, icon: FileText, color: "text-accent" },
    { label: "Team Members", value: team, icon: Users, color: "text-green-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Overview;
