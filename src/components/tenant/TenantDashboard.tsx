import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, FileText, Upload, Bell, Calendar, DollarSign, Clock,
  CheckCircle, AlertCircle, LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UploadReceiptDialog } from "@/components/dialogs/UploadReceiptDialog";
import { RequestDialog } from "@/components/dialogs/RequestDialog";

interface TenantDashboardProps {
  onLogout: () => void;
}

export function TenantDashboard({ onLogout }: TenantDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [tenantData, setTenantData] = useState<any>(null);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [requestDialog, setRequestDialog] = useState<{open: boolean, type: "extension" | "move_out" | "maintenance", title: string, description: string}>({
    open: false,
    type: "extension",
    title: "",
    description: ""
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    // Load tenant data
    const { data: tenant } = await supabase
      .from("tenants")
      .select("*, profiles(*)")
      .eq("user_id", user?.id)
      .single();
    setTenantData(tenant);

    if (tenant) {
      // Load receipts
      const { data: receiptsData } = await supabase
        .from("receipts")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });
      setReceipts(receiptsData || []);

      // Load requests
      const { data: requestsData } = await supabase
        .from("requests")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false });
      setRequests(requestsData || []);
    }

    // Load notifications
    const { data: notificationsData } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", user?.id)
      .order("created_at", { ascending: false });
    setNotifications(notificationsData || []);
  };

  if (!tenantData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const progressPercentage = (tenantData.paid_amount / tenantData.total_contract_amount) * 100;
  const monthsCompleted = Math.floor(tenantData.paid_amount / tenantData.monthly_rent);
  const remainingMonths = tenantData.contract_duration_months - monthsCompleted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tenant Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {tenantData.profiles?.full_name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-card">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{tenantData.profiles?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Number</p>
                    <p className="font-medium">{tenantData.room_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{tenantData.profiles?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{tenantData.profiles?.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-success" />
                    Payment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Paid Amount</span>
                      <span className="font-medium">${tenantData.paid_amount}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total: ${tenantData.total_contract_amount}</span>
                      <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="text-2xl font-bold text-success">${tenantData.monthly_rent}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Stay Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="text-xl font-bold">{tenantData.contract_duration_months} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-xl font-bold text-primary">{remainingMonths} months</p>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center">
                    {tenantData.is_active ? "Active Tenant" : "Inactive"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your rental activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button 
                    variant="premium" 
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Upload className="h-6 w-6" />
                    Upload Receipt
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => setRequestDialog({
                      open: true,
                      type: "extension",
                      title: "Request Payment Extension",
                      description: "Request additional time to pay rent"
                    })}
                  >
                    <Clock className="h-6 w-6" />
                    Request Extension
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => setRequestDialog({
                      open: true,
                      type: "move_out",
                      title: "Move-out Request",
                      description: "Submit a request to move out"
                    })}
                  >
                    <FileText className="h-6 w-6" />
                    Move-out Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track all your rent payments and their verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receipts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No receipts uploaded yet</p>
                  ) : (
                    receipts.map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            receipt.status === 'verified' ? 'bg-success/10' :
                            receipt.status === 'rejected' ? 'bg-destructive/10' : 'bg-warning/10'
                          }`}>
                            {receipt.status === 'verified' ? 
                              <CheckCircle className="h-4 w-4 text-success" /> :
                              <Clock className="h-4 w-4 text-warning" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{receipt.payment_month}</p>
                            <p className="text-sm text-muted-foreground">Uploaded {new Date(receipt.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${receipt.amount}</p>
                          <Badge variant={receipt.status === 'verified' ? 'default' : 'secondary'}>
                            {receipt.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>Track your submitted requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No requests submitted yet</p>
                  ) : (
                    requests.map((request) => (
                      <div key={request.id} className={`p-4 border rounded-lg ${
                        request.status === 'approved' ? 'bg-success/5 border-success/20' :
                        request.status === 'rejected' ? 'bg-destructive/5 border-destructive/20' :
                        'bg-warning/5 border-warning/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium capitalize">{request.request_type.replace('_', ' ')}</p>
                          <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.message}</p>
                        {request.landlord_response && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p className="text-sm font-medium">Landlord Response:</p>
                            <p className="text-sm">{request.landlord_response}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Stay updated with important messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border rounded-lg ${
                        notification.type === 'success' ? 'bg-success/5 border-success/20' :
                        notification.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                        'bg-primary/5 border-primary/20'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-1 rounded-full mt-1 ${
                            notification.type === 'success' ? 'bg-success/20' :
                            notification.type === 'warning' ? 'bg-warning/20' :
                            'bg-primary/20'
                          }`}>
                            {notification.type === 'success' ? 
                              <CheckCircle className="h-3 w-3 text-success" /> :
                              notification.type === 'warning' ?
                              <AlertCircle className="h-3 w-3 text-warning" /> :
                              <Bell className="h-3 w-3 text-primary" />
                            }
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UploadReceiptDialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) loadData();
        }}
        tenantId={tenantData.id}
        userId={user?.id || ""}
      />

      <RequestDialog
        open={requestDialog.open}
        onOpenChange={(open) => {
          setRequestDialog({ ...requestDialog, open });
          if (!open) loadData();
        }}
        tenantId={tenantData.id}
        requestType={requestDialog.type}
        title={requestDialog.title}
        description={requestDialog.description}
      />
    </div>
  );
}
