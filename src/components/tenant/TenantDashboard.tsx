/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  FileText, 
  Upload, 
  Bell, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  LogOut
} from "lucide-react";

interface TenantDashboardProps {
  onLogout: () => void;
  onQuickAction: (action: string) => void;
}

export function TenantDashboard({ onLogout, onQuickAction }: TenantDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  // Provide mock data so dashboard loads
  const [tenantInfo, setTenantInfo] = useState<any>({
    name: "John Doe",
    roomNumber: "A101",
    email: "john@example.com",
    phone: "123-456-7890",
    paidAmount: 3600,
    totalAmount: 4800,
    monthlyRent: 1200,
    stayDuration: "12 months",
    remainingStay: "4 months"
  });
  const [paymentHistory, setPaymentHistory] = useState<any[]>([
    { month: "September 2024", amount: 1200, status: "verified", date: "2024-09-01" },
    { month: "August 2024", amount: 1200, status: "verified", date: "2024-08-01" },
    { month: "July 2024", amount: 1200, status: "pending", date: "2024-07-01" },
    { month: "June 2024", amount: 1200, status: "verified", date: "2024-06-01" },
  ]);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, message: "Your July payment receipt is under review", type: "info", date: "2 hours ago" },
    { id: 2, message: "Rent due reminder for October 2024", type: "warning", date: "1 day ago" },
    { id: 3, message: "Your move-out request has been approved", type: "success", date: "3 days ago" },
  ]);

  const progressPercentage = tenantInfo && tenantInfo.totalAmount
    ? (tenantInfo.paidAmount / tenantInfo.totalAmount) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tenant Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {tenantInfo.name}</p>
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Personal Info Card */}
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
                    <p className="font-medium">{tenantInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Number</p>
                    <p className="font-medium">{tenantInfo.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{tenantInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{tenantInfo.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Progress Card */}
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
                      <span className="font-medium">${tenantInfo.paidAmount}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total: ${tenantInfo.totalAmount}</span>
                      <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Monthly Rent</p>
                    <p className="text-2xl font-bold text-success">${tenantInfo.monthlyRent}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Stay Duration Card */}
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
                    <p className="text-xl font-bold">{tenantInfo.stayDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-xl font-bold text-primary">{tenantInfo.remainingStay}</p>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center">
                    Active Tenant
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
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
                    onClick={() => onQuickAction("upload-receipt")}
                  >
                    <Upload className="h-6 w-6" />
                    Upload Receipt
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => onQuickAction("request-extension")}
                  >
                    <Clock className="h-6 w-6" />
                    Request Extension
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => onQuickAction("moveout-request")}
                  >
                    <FileText className="h-6 w-6" />
                    Move-out Request
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => onQuickAction("report-maintenance")}
                  >
                    <AlertCircle className="h-6 w-6" />
                    Report Maintenance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track all your rent payments and their verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          payment.status === 'verified' ? 'bg-success/10' : 'bg-warning/10'
                        }`}>
                          {payment.status === 'verified' ? 
                            <CheckCircle className="h-4 w-4 text-success" /> :
                            <Clock className="h-4 w-4 text-warning" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{payment.month}</p>
                          <p className="text-sm text-muted-foreground">Paid on {payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${payment.amount}</p>
                        <Badge variant={payment.status === 'verified' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Submit New Request</CardTitle>
                  <CardDescription>Send requests to your landlord</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Request Payment Extension
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Move-out Request
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Maintenance Issue
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Request History</CardTitle>
                  <CardDescription>Track your submitted requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                      <div>
                        <p className="font-medium">Move-out Request</p>
                        <p className="text-sm text-muted-foreground">Submitted 3 days ago</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <div>
                        <p className="font-medium">Payment Extension</p>
                        <p className="text-sm text-muted-foreground">Submitted 1 week ago</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Stay updated with important messages from your landlord</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
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
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground">{notification.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}