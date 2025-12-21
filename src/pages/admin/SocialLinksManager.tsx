import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Share2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SocialLinksManager = () => {
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links, isLoading } = useQuery({
    queryKey: ["social-links-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_links").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { error } = await supabase.from("social_links").insert({
        platform: formData.get("platform") as string,
        url: formData.get("url") as string,
        icon: formData.get("icon") as string,
        display_order: parseInt(formData.get("display_order") as string) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links-admin"] });
      toast({ title: "Social link added!" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { error } = await supabase.from("social_links").update({
        platform: formData.get("platform") as string,
        url: formData.get("url") as string,
        icon: formData.get("icon") as string,
        display_order: parseInt(formData.get("display_order") as string) || 0,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links-admin"] });
      toast({ title: "Social link updated!" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links-admin"] });
      toast({ title: "Social link deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("social_links").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      queryClient.invalidateQueries({ queryKey: ["social-links-admin"] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingLink(null);
  };

  const openEdit = (link: any) => {
    setEditingLink(link);
    setOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Share2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Social Links</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLink(null)}>
              <Plus className="w-4 h-4 mr-2" /> Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLink ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <Input name="platform" defaultValue={editingLink?.platform || ""} placeholder="Facebook" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <Input name="url" defaultValue={editingLink?.url || ""} placeholder="https://facebook.com/yourpage" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Icon (Lucide icon name)</label>
                <Input name="icon" defaultValue={editingLink?.icon || ""} placeholder="Facebook, Twitter, Instagram, Linkedin" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <Input type="number" name="display_order" defaultValue={editingLink?.display_order || 0} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">{editingLink ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links?.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">{link.platform}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-xs">{link.url}</TableCell>
              <TableCell>{link.display_order}</TableCell>
              <TableCell>
                <Switch 
                  checked={link.is_active || false} 
                  onCheckedChange={(checked) => toggleMutation.mutate({ id: link.id, is_active: checked })}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(link)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(link.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SocialLinksManager;
