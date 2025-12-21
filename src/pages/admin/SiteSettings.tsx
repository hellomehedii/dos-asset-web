import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Save, Settings } from "lucide-react";

const SiteSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (error) throw error;
      return data;
    },
  });

  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logo_url || "");
      setFaviconUrl((settings as any).favicon_url || "");
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const updates = {
        site_name: formData.get("site_name") as string,
        site_tagline: formData.get("site_tagline") as string,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        footer_text: formData.get("footer_text") as string,
        google_analytics_id: formData.get("google_analytics_id") as string,
        meta_pixel_id: formData.get("meta_pixel_id") as string,
      };
      const { error } = await supabase.from("site_settings").update(updates).eq("id", settings?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings-admin"] });
      toast({ title: "Settings saved!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h2 className="font-semibold text-foreground">Branding</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Site Logo</label>
              <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="branding" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Favicon</label>
              <ImageUpload value={faviconUrl} onChange={setFaviconUrl} folder="branding" />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 32x32 or 64x64 PNG</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
              <Input name="site_name" defaultValue={settings?.site_name} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tagline</label>
              <Input name="site_tagline" defaultValue={settings?.site_tagline || ""} />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h2 className="font-semibold text-foreground">Contact Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <Input name="phone" defaultValue={settings?.phone || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input name="email" type="email" defaultValue={settings?.email || ""} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Address</label>
            <Textarea name="address" defaultValue={settings?.address || ""} rows={2} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Footer Text</label>
            <Textarea name="footer_text" defaultValue={settings?.footer_text || ""} rows={2} />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h2 className="font-semibold text-foreground">Analytics & Tracking</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Google Analytics ID</label>
              <Input name="google_analytics_id" placeholder="G-XXXXXXXXXX" defaultValue={settings?.google_analytics_id || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Meta Pixel ID</label>
              <Input name="meta_pixel_id" placeholder="123456789012345" defaultValue={settings?.meta_pixel_id || ""} />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={updateMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
};

export default SiteSettings;