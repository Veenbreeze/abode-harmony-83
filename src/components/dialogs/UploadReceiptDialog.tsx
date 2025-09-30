import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface UploadReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  userId: string;
}

export function UploadReceiptDialog({ open, onOpenChange, tenantId, userId }: UploadReceiptDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("receipt") as File;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentMonth = formData.get("payment-month") as string;
    const paymentDate = formData.get("payment-date") as string;

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a receipt file",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from("receipts")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      // Save receipt record
      const { error: dbError } = await supabase.from("receipts").insert({
        tenant_id: tenantId,
        file_url: publicUrl,
        file_name: file.name,
        amount,
        payment_month: paymentMonth,
        payment_date: paymentDate,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Receipt uploaded successfully",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Payment Receipt</DialogTitle>
          <DialogDescription>Upload proof of your rent payment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt File</Label>
              <Input id="receipt" name="receipt" type="file" accept="image/*,application/pdf" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Paid</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                placeholder="1200.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-month">Payment Month</Label>
              <Input
                id="payment-month"
                name="payment-month"
                type="text"
                required
                placeholder="September 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Input id="payment-date" name="payment-date" type="date" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Receipt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
