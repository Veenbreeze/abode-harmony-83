import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, DollarSign, Bell, Settings, FileText, CheckCircle, 
  X, LogOut, UserPlus, Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AddTenantDialog } from "@/components/dialogs/AddTenantDialog";
import { SendNoticeDialog } from "@/components/dialogs/SendNoticeDialog";
import { useToast } from "@/hooks/use-toast";

interface LandlordDashboardProps {
  onLogout: () => void;
}

export function LandlordDashboard({ onLogout }: LandlordDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [tenants, setTenants] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [addTenantOpen, setAddTenantOpen] = useState(false);
  const [sendNoticeOpen, setSendNoticeOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    // Load all tenants
    const { data: tenantsData } = await supabase
      .from("tenants")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });
    setTenants(tenantsData || []);

    // Load all receipts
    const { data: receiptsData } = await supabase
      .from("receipts")
      .select("*, tenants(room_number, profiles(full_name))")
      .order("created_at", { ascending: false });
    setReceipts(receiptsData || []);

    // Load all requests
    const { data: requestsData } = await supabase
      .from("requests")
      .select("*, tenants(room_number, profiles(full_name))")
      .order("created_at", { ascending: false });
    setRequests(requestsData || []);
  };

  const verifyReceipt = async (receiptId: string) => {
    const { error } = await supabase
      .from("receipts")
      .update({ status: "verified", verified_at: new Date().toISOString() })
      .eq("id", receiptId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Receipt verified successfully",
      });
      loadData();
    }
  };

  const rejectReceipt = async (receiptId: string) => {
    const { error } = await supabase
      .from("receipts")
      .update({ status: "rejected" })
      .eq("id", receiptId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Receipt rejected",
      });
      loadData();
    }
  };

  const approveRequest = async (requestId: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ status: "approved", responded_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Request approved",
      });
      loadData();
    }
  };

  const rejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ status: "rejected", responded_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Request rejected",
      });
      loadData();
    }
  };

  const stats = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.is_active).length,
    pendingReceipts: receipts.filter(r => r.status === "pending").length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    totalRevenue: tenants.reduce((sum, t) => sum + parseFloat(t.paid_amount), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Landlord Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your rental properties</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.activeTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pendingReceipts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pendingRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">${stats.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Button 
            variant="premium" 
            size="lg" 
            className="h-auto p-4"
            onClick={() => setAddTenantOpen(true)}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Tenant
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-auto p-4"
            onClick={() => setSendNoticeOpen(true)}
          >
            <Send className="h-5 w-5 mr-2" />
            Send Notice to Tenants
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-card">
            <TabsTrigger value="overview">
              <Users className="h-4 w-4 mr-2" />
              Tenants
            </TabsTrigger>
            <TabsTrigger value="receipts">
              <DollarSign className="h-4 w-4 mr-2" />
              Receipts
            </TabsTrigger>
            <TabsTrigger value="requests">
              <FileText className="h-4 w-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tenants</CardTitle>
                <CardDescription>Manage your tenants and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenants.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No tenants yet</p>
                  ) : (
                    tenants.map((tenant) => (
                      <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">{tenant.profiles?.full_name}</p>
                              <p className="text-sm text-muted-foreground">Room {tenant.room_number}</p>
                            </div>
                            <Badge variant={tenant.is_active ? "default" : "secondary"}>
                              {tenant.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Email: {tenant.profiles?.email}</p>
                            <p>Phone: {tenant.profiles?.phone}</p>
                            <p>Monthly Rent: ${tenant.monthly_rent} | Paid: ${tenant.paid_amount} / ${tenant.total_contract_amount}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Verification</CardTitle>
                <CardDescription>Review and verify tenant payment receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receipts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No receipts submitted yet</p>
                  ) : (
                    receipts.map((receipt) => (
                      <div key={receipt.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">{receipt.tenants?.profiles?.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Room {receipt.tenants?.room_number} • {receipt.payment_month}
                            </p>
                          </div>
                          <Badge variant={
                            receipt.status === "verified" ? "default" :
                            receipt.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {receipt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">Amount: <span className="font-bold">${receipt.amount}</span></p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {new Date(receipt.created_at).toLocaleDateString()}
                            </p>
                            <a 
                              href={receipt.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View Receipt
                            </a>
                          </div>
                          {receipt.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => verifyReceipt(receipt.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectReceipt(receipt.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Requests</CardTitle>
                <CardDescription>Review and respond to tenant requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No requests submitted yet</p>
                  ) : (
                    requests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium">{request.tenants?.profiles?.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Room {request.tenants?.room_number} • {request.request_type.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                          <Badge variant={
                            request.status === "approved" ? "default" :
                            request.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{request.message}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Submitted: {new Date(request.created_at).toLocaleString()}
                        </p>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => approveRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectRequest(request.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Settings</CardTitle>
                <CardDescription>Configure your rental property defaults</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Property settings coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddTenantDialog
        open={addTenantOpen}
        onOpenChange={(open) => {
          setAddTenantOpen(open);
          if (!open) loadData();
        }}
      />

      <SendNoticeDialog
        open={sendNoticeOpen}
        onOpenChange={(open) => {
          setSendNoticeOpen(open);
          if (!open) loadData();
        }}
      />
    </div>
  );
}
