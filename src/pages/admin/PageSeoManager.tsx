import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const PageSeoManager = () => {
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [ogImage, setOgImage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages, isLoading } = useQuery({
    queryKey: ["page-seo-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_seo").select("*").order("page_slug");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { error } = await supabase.from("page_seo").insert({
        page_slug: formData.get("page_slug") as string,
        page_title: formData.get("page_title") as string,
        meta_title: formData.get("meta_title") as string,
        meta_description: formData.get("meta_description") as string,
        meta_keywords: formData.get("meta_keywords") as string,
        og_image: ogImage || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-seo"] });
      queryClient.invalidateQueries({ queryKey: ["page-seo-admin"] });
      toast({ title: "Page SEO added!" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { error } = await supabase.from("page_seo").update({
        page_slug: formData.get("page_slug") as string,
        page_title: formData.get("page_title") as string,
        meta_title: formData.get("meta_title") as string,
        meta_description: formData.get("meta_description") as string,
        meta_keywords: formData.get("meta_keywords") as string,
        og_image: ogImage || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-seo"] });
      queryClient.invalidateQueries({ queryKey: ["page-seo-admin"] });
      toast({ title: "Page SEO updated!" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("page_seo").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-seo"] });
      queryClient.invalidateQueries({ queryKey: ["page-seo-admin"] });
      toast({ title: "Page SEO deleted!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingPage(null);
    setOgImage("");
  };

  const openEdit = (page: any) => {
    setEditingPage(page);
    setOgImage(page.og_image || "");
    setOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Search className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Page SEO</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingPage(null); setOgImage(""); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Page SEO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Edit Page SEO" : "Add Page SEO"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Page Slug</label>
                  <Input name="page_slug" defaultValue={editingPage?.page_slug || ""} placeholder="home, about, contact" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Page Title</label>
                  <Input name="page_title" defaultValue={editingPage?.page_title || ""} placeholder="Home" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <Input name="meta_title" defaultValue={editingPage?.meta_title || ""} placeholder="Page Title | Site Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <Textarea name="meta_description" defaultValue={editingPage?.meta_description || ""} rows={3} placeholder="Brief description for search engines..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                <Input name="meta_keywords" defaultValue={editingPage?.meta_keywords || ""} placeholder="keyword1, keyword2, keyword3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Image</label>
                <ImageUpload value={ogImage} onChange={setOgImage} folder="seo" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">{editingPage ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Meta Title</TableHead>
            <TableHead>Meta Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages?.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium">{page.page_title}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-xs">{page.meta_title}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-xs">{page.meta_description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(page)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(page.id)}>
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

export default PageSeoManager;
