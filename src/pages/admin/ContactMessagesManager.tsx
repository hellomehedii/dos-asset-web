import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, MailOpen, MessageSquare, Eye } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ContactMessagesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast({ title: "Message deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;
  const [openMsg, setOpenMsg] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);

  const openMessage = (msg: any) => {
    setSelectedMsg(msg);
    setOpenMsg(true);
    if (!msg.is_read) {
      markReadMutation.mutate({ id: msg.id, is_read: true });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : messages?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages?.map((msg) => (
                <TableRow key={msg.id} className={!msg.is_read ? "bg-primary/5" : ""}>
                  <TableCell>
                    <button
                      onClick={() => markReadMutation.mutate({ id: msg.id, is_read: !msg.is_read })}
                      className="p-1 hover:bg-muted rounded"
                      title={msg.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.is_read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a>
                  </TableCell>
                  <TableCell>{msg.subject || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">{msg.message}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(msg.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openMessage(msg)} title="View message">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(msg.id)}
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

      <Dialog open={openMsg} onOpenChange={setOpenMsg}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMsg && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{selectedMsg.name} &lt;{selectedMsg.email}&gt;</p>
                <p className="text-sm text-muted-foreground">{selectedMsg.subject || "-"}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap">{selectedMsg.message}</p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-muted-foreground">Received: {format(new Date(selectedMsg.created_at), "PPP p")}</p>
                <div className="flex gap-2">
                  <Button onClick={() => { markReadMutation.mutate({ id: selectedMsg.id, is_read: !selectedMsg.is_read }); setOpenMsg(false); }}>
                    {selectedMsg.is_read ? "Mark as Unread" : "Mark as Read"}
                  </Button>
                  <Button variant="destructive" onClick={() => { deleteMutation.mutate(selectedMsg.id); setOpenMsg(false); }}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessagesManager;