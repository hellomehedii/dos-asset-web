import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const HeroManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: heroContent, isLoading } = useQuery({
    queryKey: ["hero-content-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    badge_text: "",
    headline: "",
    highlight_text: "",
    subtext: "",
    primary_button_text: "",
    primary_button_link: "",
    banner_image: "",
    stat_1_value: "",
    stat_1_label: "",
    stat_2_value: "",
    stat_2_label: "",
    stat_3_value: "",
    stat_3_label: "",
  });

  // Update form when data loads
  useState(() => {
    if (heroContent) {
      setFormData({
        badge_text: heroContent.badge_text || "",
        headline: heroContent.headline || "",
        highlight_text: heroContent.highlight_text || "",
        subtext: heroContent.subtext || "",
        primary_button_text: heroContent.primary_button_text || "",
        primary_button_link: heroContent.primary_button_link || "",
        banner_image: heroContent.banner_image || "",
        stat_1_value: heroContent.stat_1_value || "",
        stat_1_label: heroContent.stat_1_label || "",
        stat_2_value: heroContent.stat_2_value || "",
        stat_2_label: heroContent.stat_2_label || "",
        stat_3_value: heroContent.stat_3_value || "",
        stat_3_label: heroContent.stat_3_label || "",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("hero_content")
        .update(data)
        .eq("id", heroContent?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
      queryClient.invalidateQueries({ queryKey: ["hero-content-admin"] });
      toast({ title: "Hero content updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating hero content", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  // Initialize form with data
  if (heroContent && !formData.badge_text && heroContent.badge_text) {
    setFormData({
      badge_text: heroContent.badge_text || "",
      headline: heroContent.headline || "",
      highlight_text: heroContent.highlight_text || "",
      subtext: heroContent.subtext || "",
      primary_button_text: heroContent.primary_button_text || "",
      primary_button_link: heroContent.primary_button_link || "",
      banner_image: heroContent.banner_image || "",
      stat_1_value: heroContent.stat_1_value || "",
      stat_1_label: heroContent.stat_1_label || "",
      stat_2_value: heroContent.stat_2_value || "",
      stat_2_label: heroContent.stat_2_label || "",
      stat_3_value: heroContent.stat_3_value || "",
      stat_3_label: heroContent.stat_3_label || "",
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hero Section Manager</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label>Banner Image</Label>
          <ImageUpload
            value={formData.banner_image}
            onChange={(url) => setFormData({ ...formData, banner_image: url })}
          />
        </div>

        <div>
          <Label>Badge Text</Label>
          <Input
            value={formData.badge_text}
            onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
            placeholder="Trusted Since 1998"
          />
        </div>

        <div>
          <Label>Headline</Label>
          <Input
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            placeholder="Your Trusted Partner in Real Estate Development"
          />
        </div>

        <div>
          <Label>Highlight Text (colored part of headline)</Label>
          <Input
            value={formData.highlight_text}
            onChange={(e) => setFormData({ ...formData, highlight_text: e.target.value })}
            placeholder="Real Estate"
          />
        </div>

        <div>
          <Label>Subtext</Label>
          <Textarea
            value={formData.subtext}
            onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
            placeholder="We transform visions into exceptional living spaces..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Button Text</Label>
            <Input
              value={formData.primary_button_text}
              onChange={(e) => setFormData({ ...formData, primary_button_text: e.target.value })}
              placeholder="Explore Projects"
            />
          </div>
          <div>
            <Label>Primary Button Link</Label>
            <Input
              value={formData.primary_button_link}
              onChange={(e) => setFormData({ ...formData, primary_button_link: e.target.value })}
              placeholder="/projects"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stat 1 Value</Label>
              <Input
                value={formData.stat_1_value}
                onChange={(e) => setFormData({ ...formData, stat_1_value: e.target.value })}
                placeholder="25+"
              />
            </div>
            <div>
              <Label>Stat 1 Label</Label>
              <Input
                value={formData.stat_1_label}
                onChange={(e) => setFormData({ ...formData, stat_1_label: e.target.value })}
                placeholder="Years Experience"
              />
            </div>
            <div>
              <Label>Stat 2 Value</Label>
              <Input
                value={formData.stat_2_value}
                onChange={(e) => setFormData({ ...formData, stat_2_value: e.target.value })}
                placeholder="150+"
              />
            </div>
            <div>
              <Label>Stat 2 Label</Label>
              <Input
                value={formData.stat_2_label}
                onChange={(e) => setFormData({ ...formData, stat_2_label: e.target.value })}
                placeholder="Projects Completed"
              />
            </div>
            <div>
              <Label>Stat 3 Value</Label>
              <Input
                value={formData.stat_3_value}
                onChange={(e) => setFormData({ ...formData, stat_3_value: e.target.value })}
                placeholder="10K+"
              />
            </div>
            <div>
              <Label>Stat 3 Label</Label>
              <Input
                value={formData.stat_3_label}
                onChange={(e) => setFormData({ ...formData, stat_3_label: e.target.value })}
                placeholder="Happy Families"
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={updateMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default HeroManager;
