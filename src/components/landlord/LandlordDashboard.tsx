import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  DollarSign, 
  Bell, 
  Settings, 
  FileText, 
  CheckCircle, 
  X, 
  Eye,
  LogOut,
  Search,
  Filter,
  Building2
} from "lucide-react";

// Types
interface LandlordDashboardProps {
  onLogout: () => void;
  onQuickAction: (action: string) => void;
}

interface Tenant {
  id: number;
  name: string;
  room: string;
  email: string;
  phone: string;
  rent: number;
  status: "active" | "pending";
  lastPayment: string;
  receiptsUploaded: number;
  pendingReceipts: number;
}

interface Notification {
  id: number;
  tenant: string;
  type: "receipt" | "request" | "moveout";
  message: string;
  time: string;
  status: "pending" | "approved" | "rejected";
}

interface Stats {
  totalTenants: number;
  activeLeases: number;
  pendingReceipts: number;
  notifications: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

interface TenantSearchInputProps {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TenantSearchInput: React.FC<TenantSearchInputProps> = ({ searchTerm, onChange }) => (
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search tenants by name or room number..."
      value={searchTerm}
      onChange={onChange}
      className="pl-10"
    />
  </div>
);

interface LandlordDashboardProps {
  onLogout: () => void;
}

export function LandlordDashboard({ onLogout, onQuickAction }: LandlordDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Placeholders for API data
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTenants: 0,
    activeLeases: 0,
    pendingReceipts: 0,
    notifications: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    // TODO: Fetch tenants, notifications, and stats from Django backend
    // fetch("/api/landlord/tenants").then(res => res.json()).then(setTenants);
    // fetch("/api/landlord/notifications").then(res => res.json()).then(setNotifications);
    // fetch("/api/landlord/stats").then(res => res.json()).then(setStats);
  }, []);

  // Filter tenants
  const filteredTenants = tenants.filter((tenant: Tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Notification actions (just update state)
  const handleApprove = (id: number) => {
    setNotifications(notifications =>
      notifications.map(n => n.id === id ? { ...n, status: "approved" } : n)
    );
  };
  const handleReject = (id: number) => {
    setNotifications(notifications =>
      notifications.map(n => n.id === id ? { ...n, status: "rejected" } : n)
    );
  };

  // Settings state
  const [settings, setSettings] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    propertyName: "",
    defaultRent: "",
    paymentDue: ""
  });
  const [settingsMessage, setSettingsMessage] = useState<string>("");

  // Settings actions
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.id]: e.target.value });
  };
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage("Settings saved successfully!");
    setTimeout(() => setSettingsMessage(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Landlord Portal</h1>
              <p className="text-sm text-muted-foreground">Property Management Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-card">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tenants
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {stats.notifications > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {stats.notifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tenants</p>
                      <p className="text-3xl font-bold text-primary">{stats.totalTenants}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-success">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-success/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Receipts</p>
                      <p className="text-3xl font-bold text-warning">{stats.pendingReceipts}</p>
                    </div>
                    <FileText className="h-8 w-8 text-warning/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                      <p className="text-3xl font-bold text-primary">{stats.occupancyRate}%</p>
                    </div>
                    <Building2 className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Tenant Activity</CardTitle>
                  <CardDescription>Latest updates from your tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="p-2 rounded-full bg-primary/10">
                          {notification.type === 'receipt' ? <FileText className="h-4 w-4 text-primary" /> :
                           notification.type === 'request' ? <Bell className="h-4 w-4 text-warning" /> :
                           <CheckCircle className="h-4 w-4 text-success" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{notification.tenant}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <Badge variant={notification.status === 'approved' ? 'default' : 'secondary'}>
                          {notification.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your property efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="premium"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => onQuickAction("review-receipts")}
                    >
                      <FileText className="h-6 w-6" />
                      Review Receipts
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => onQuickAction("send-notice")}
                    >
                      <Bell className="h-6 w-6" />
                      Send Notice
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => onQuickAction("add-tenant")}
                    >
                      <Users className="h-6 w-6" />
                      Add Tenant
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => onQuickAction("property-settings")}
                    >
                      <Settings className="h-6 w-6" />
                      Property Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tenants Tab */}
          <TabsContent value="tenants" className="space-y-6">
            {/* Search and Filter */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <TenantSearchInput searchTerm={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tenants List */}
            <div className="grid gap-6">
              {filteredTenants.map((tenant) => (
                <Card key={tenant.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{tenant.name}</h3>
                          <p className="text-muted-foreground">Room {tenant.room}</p>
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{tenant.email}</span>
                            <span>{tenant.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Monthly Rent</p>
                          <p className="text-xl font-bold text-success">${tenant.rent}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Last Payment</p>
                          <p className="font-medium">{tenant.lastPayment}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Receipts</p>
                          <div className="flex gap-2">
                            <Badge variant="default">{tenant.receiptsUploaded} Verified</Badge>
                            {tenant.pendingReceipts > 0 && (
                              <Badge variant="secondary">{tenant.pendingReceipts} Pending</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                            {tenant.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
              }
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>Review and respond to tenant requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          {notification.type === 'receipt' ? <FileText className="h-4 w-4 text-primary" /> :
                           notification.type === 'request' ? <Bell className="h-4 w-4 text-warning" /> :
                           <CheckCircle className="h-4 w-4 text-success" />}
                        </div>
                        <div>
                          <p className="font-medium">{notification.tenant}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          notification.status === 'approved' ? 'default' :
                          notification.status === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {notification.status}
                        </Badge>
                        {notification.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="success" onClick={() => handleApprove(notification.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(notification.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your login credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={settings.username} onChange={handleSettingsChange} placeholder="Enter new username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input id="password" type="password" value={settings.password} onChange={handleSettingsChange} placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" value={settings.confirmPassword} onChange={handleSettingsChange} placeholder="Confirm new password" />
                    </div>
                    <Button variant="premium" className="w-full" type="submit">
                      Update Credentials
                    </Button>
                    {settingsMessage && <p className="text-success text-center mt-2">{settingsMessage}</p>}
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Property Settings</CardTitle>
                  <CardDescription>Configure property management preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyName">Property Name</Label>
                      <Input id="propertyName" value={settings.propertyName} onChange={handleSettingsChange} placeholder="Enter property name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultRent">Default Monthly Rent</Label>
                      <Input id="defaultRent" type="number" value={settings.defaultRent} onChange={handleSettingsChange} placeholder="Enter default rent amount" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDue">Payment Due Date</Label>
                      <Input id="paymentDue" type="number" min="1" max="31" value={settings.paymentDue} onChange={handleSettingsChange} placeholder="Day of month (1-31)" />
                    </div>
                    <Button variant="outline" className="w-full" type="submit">
                      Save Settings
                    </Button>
                    {settingsMessage && <p className="text-success text-center mt-2">{settingsMessage}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}