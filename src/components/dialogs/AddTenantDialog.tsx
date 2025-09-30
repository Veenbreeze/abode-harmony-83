import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface AddTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTenantDialog({ open, onOpenChange }: AddTenantDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full-name") as string;
    const phone = formData.get("phone") as string;
    const roomNumber = formData.get("room-number") as string;
    const monthlyRent = parseFloat(formData.get("monthly-rent") as string);
    const contractMonths = parseInt(formData.get("contract-months") as string);
    const guarantorName = formData.get("guarantor-name") as string;
    const guarantorPhone = formData.get("guarantor-phone") as string;

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: "tenant",
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Create tenant record
      const { error: tenantError } = await supabase.from("tenants").insert({
        user_id: authData.user.id,
        room_number: roomNumber,
        monthly_rent: monthlyRent,
        total_contract_amount: monthlyRent * contractMonths,
        contract_duration_months: contractMonths,
        guarantor_name: guarantorName,
        guarantor_phone: guarantorPhone,
      });

      if (tenantError) throw tenantError;

      toast({
        title: "Success",
        description: "Tenant added successfully",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
          <DialogDescription>Register a new tenant in the system</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" name="full-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" minLength={6} required />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input id="room-number" name="room-number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-rent">Monthly Rent ($)</Label>
                <Input id="monthly-rent" name="monthly-rent" type="number" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-months">Contract (Months)</Label>
                <Input id="contract-months" name="contract-months" type="number" defaultValue={12} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guarantor-name">Guarantor Name</Label>
                <Input id="guarantor-name" name="guarantor-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guarantor-phone">Guarantor Phone</Label>
                <Input id="guarantor-phone" name="guarantor-phone" type="tel" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <UserPlus className="h-4 w-4 mr-2" />
              {isSubmitting ? "Adding..." : "Add Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
