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

const AboutManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["about-content-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: { id: string; title: string; content: string; image_url: string }) => {
      const { error } = await supabase
        .from("about_content")
        .update({ title: item.title, content: item.content, image_url: item.image_url })
        .eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
      queryClient.invalidateQueries({ queryKey: ["about-content-admin"] });
      toast({ title: "Content updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating content", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const sections = [
    { type: "our_story", label: "Our Story" },
    { type: "mission", label: "Our Mission" },
    { type: "vision", label: "Our Vision" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">About Page Manager</h1>
      
      <div className="space-y-8">
        {sections.map((section) => {
          const content = aboutContent?.find(c => c.section_type === section.type);
          if (!content) return null;

          return (
            <AboutSectionForm
              key={section.type}
              section={section}
              content={content}
              onSave={(data) => updateMutation.mutate({ ...data, id: content.id })}
              isPending={updateMutation.isPending}
            />
          );
        })}
      </div>
    </div>
  );
};

const AboutSectionForm = ({ 
  section, 
  content, 
  onSave, 
  isPending 
}: { 
  section: { type: string; label: string }; 
  content: any; 
  onSave: (data: { title: string; content: string; image_url: string }) => void;
  isPending: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: content.title || "",
    content: content.content || "",
    image_url: content.image_url || "",
  });

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">{section.label}</h2>
      
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <Label>Content</Label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <Label>Image</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
          />
        </div>

        <Button 
          onClick={() => onSave(formData)} 
          disabled={isPending}
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Save {section.label}
        </Button>
      </div>
    </div>
  );
};

export default AboutManager;
