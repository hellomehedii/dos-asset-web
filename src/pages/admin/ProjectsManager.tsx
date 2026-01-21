import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

const ProjectsManager = () => {
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [featuredImage, setFeaturedImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (project: ProjectInsert) => {
      const { error } = await supabase.from("projects").insert(project);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      toast({ title: "Project created successfully" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...project }: Partial<Project> & { id: string }) => {
      const { error } = await supabase.from("projects").update(project).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      toast({ title: "Project updated successfully" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      toast({ title: "Project deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const project = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as "upcoming" | "ongoing" | "handed_over",
      description: formData.get("description") as string,
      featured_image: featuredImage,
      gallery: galleryImages,
      land_area: formData.get("land_area") as string,
      num_apartments: parseInt(formData.get("num_apartments") as string) || null,
      orientation: formData.get("orientation") as string,
      plan: formData.get("plan") as string,
      unit_size: formData.get("unit_size") as string,
      room_details: formData.get("room_details") as string,
      HandOver: formData.get("HandOver") as string || null,
      verandas: parseInt(formData.get("verandas") as string) || null,
      address: formData.get("address") as string,
      is_featured: formData.get("is_featured") === "true",
      display_order: parseInt(formData.get("display_order") as string) || 0,
      google_map_embed: formData.get("google_map_embed") as string || null,
      latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
      longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
      youtube_video_url: formData.get("youtube_video_url") as string || null,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, ...project });
    } else {
      createMutation.mutate(project);
    }
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setFeaturedImage(project.featured_image || "");
    setGalleryImages((project.gallery as string[]) || []);
    // ensure new fields are captured if present
    // (editingProject will be used to populate inputs when dialog opens)
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingProject(null);
    setFeaturedImage("");
    setGalleryImages([]);
  };

  const addGalleryImage = (url: string) => {
    if (url) setGalleryImages([...galleryImages, url]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={open} onOpenChange={(o) => { if (!o) closeDialog(); else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Project Name *</Label>
                    <Input id="name" name="name" required defaultValue={editingProject?.name || ""} />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" name="slug" required defaultValue={editingProject?.slug || ""} />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" name="location" required defaultValue={editingProject?.location || ""} />
                  </div>
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select name="status" defaultValue={editingProject?.status || "upcoming"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="handed_over">Handed Over</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Property Details</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="land_area">Land Area</Label>
                    <Input id="land_area" name="land_area" placeholder="e.g., 12 Katha" defaultValue={editingProject?.land_area || ""} />
                  </div>
                  <div>
                    <Label htmlFor="num_apartments">Number of Apartments</Label>
                    <Input id="num_apartments" name="num_apartments" type="number" defaultValue={editingProject?.num_apartments || ""} />
                  </div>
                  <div>
                    <Label htmlFor="orientation">Orientation</Label>
                    <Input id="orientation" name="orientation" placeholder="e.g., East Facing" defaultValue={editingProject?.orientation || ""} />
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Input id="plan" name="plan" placeholder="e.g., G+12 Floors" defaultValue={editingProject?.plan || ""} />
                  </div>
                  <div>
                    <Label htmlFor="unit_size">Unit Size</Label>
                    <Input id="unit_size" name="unit_size" placeholder="e.g., 1,800 - 2,500 sqft" defaultValue={editingProject?.unit_size || ""} />
                  </div>
                  <div>
                    <Label htmlFor="room_details">Room Details</Label>
                    <Input id="room_details" name="room_details" placeholder="e.g., 3 Bed, 4 Bed" defaultValue={editingProject?.room_details || ""} />
                  </div>
                  <div>
                    <Label htmlFor="HandOver">Hand Over</Label>
                    <Input id="HandOver" name="HandOver"  defaultValue={editingProject?.HandOver || ""} />
                  </div>
                  <div>
                    <Label htmlFor="verandas">Belcony</Label>
                    <Input id="verandas" name="verandas" type="number" defaultValue={editingProject?.verandas || ""} />
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input id="display_order" name="display_order" type="number" defaultValue={editingProject?.display_order || 0} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" name="address" defaultValue={editingProject?.address || ""} />
                </div>
              </div>

              {/* Map Embed / Coordinates */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Map / Location</h3>
                <div className="grid gap-4 md:grid-cols-1">
                  <div>
                    <Label htmlFor="google_map_embed">Google Map Embed (iframe src or full &lt;iframe&gt;)</Label>
                    <Textarea id="google_map_embed" name="google_map_embed" defaultValue={(editingProject as any)?.google_map_embed || ""} placeholder="https://www.google.com/... or full <iframe>...</iframe>" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" name="latitude" type="number" step="any" defaultValue={(editingProject as any)?.latitude ?? ""} />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" name="longitude" type="number" step="any" defaultValue={(editingProject as any)?.longitude ?? ""} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="youtube_video_url">YouTube Video URL</Label>
                    <Input id="youtube_video_url" name="youtube_video_url" defaultValue={(editingProject as any)?.youtube_video_url || ""} placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID" />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Images</h3>
                <div>
                  <Label>Featured Image</Label>
                  <ImageUpload value={featuredImage} onChange={setFeaturedImage} folder="projects" />
                </div>
                <div>
                  <Label>Gallery Images</Label>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload value="" onChange={addGalleryImage} folder="projects/gallery" />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={editingProject?.description || ""} />
              </div>

              {/* Featured */}
              <div>
                <Label htmlFor="is_featured">Featured on Homepage</Label>
                <Select name="is_featured" defaultValue={editingProject?.is_featured ? "true" : "false"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.featured_image ? (
                      <img src={project.featured_image} alt="" className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell className="capitalize">{project.status.replace("_", " ")}</TableCell>
                  <TableCell>{project.is_featured ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(project)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;