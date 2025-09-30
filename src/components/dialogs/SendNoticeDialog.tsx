import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface SendNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendNoticeDialog({ open, onOpenChange }: SendNoticeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadTenants();
    }
  }, [open]);

  const loadTenants = async () => {
    const { data } = await supabase
      .from("tenants")
      .select("id, room_number, profiles(full_name)")
      .eq("is_active", true);
    if (data) setTenants(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const recipientId = formData.get("recipient") as string;
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const type = formData.get("type") as string;

    try {
      if (recipientId === "all") {
        // Send to all tenants
        const notifications = tenants.map((tenant) => ({
          recipient_id: tenant.id,
          title,
          message,
          type,
        }));
        const { error } = await supabase.from("notifications").insert(notifications);
        if (error) throw error;
      } else {
        // Send to specific tenant
        const { error } = await supabase.from("notifications").insert({
          recipient_id: recipientId,
          title,
          message,
          type,
        });
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Notice sent successfully",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Notice</DialogTitle>
          <DialogDescription>Send a notification to tenants</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Select name="recipient" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.profiles?.full_name} - Room {tenant.room_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="info">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Notice title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="Notice message..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Notice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
