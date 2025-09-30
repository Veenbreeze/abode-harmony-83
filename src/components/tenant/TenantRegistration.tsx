import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, User, Phone, Mail, Home, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TenantRegistrationProps {
  onBack: () => void;
  onComplete: () => void;
  onBackToLogin: () => void;
  onBackToHome: () => void;
}

interface TenantData {
  fullName: string; 
  phoneNumber: string;
  email: string;
  roomNumber: string;
}

interface GuarantorData {
  guarantorName: string;
  guarantorPhone: string;
}

export function TenantRegistration({ onBack, onComplete, onBackToLogin, onBackToHome }: TenantRegistrationProps) {
  const [step, setStep] = useState(1);
  const [tenantData, setTenantData] = useState<TenantData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    roomNumber: ""
  });
  const [guarantorData, setGuarantorData] = useState<GuarantorData>({
    guarantorName: "",
    guarantorPhone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantData.fullName || !tenantData.phoneNumber || !tenantData.email || !tenantData.roomNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
  };

  const handleGuarantorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guarantorData.guarantorName || !guarantorData.guarantorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all guarantor details.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Registration Successful!",
      description: "Your tenant registration has been completed successfully."
    });
    
    setIsLoading(false);
    onComplete();
  };

  // Fix: Implement navigation to landing page using the provided prop
  function onbacktolandingpage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    onBackToHome();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Tenant Registration</h1>
            <p className="text-muted-foreground">Join our rental management system</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              <User className="h-5 w-5" />
            </div>
            <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}>
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card className="shadow-elevated">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Please provide your personal details to register as a tenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTenantSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={tenantData.fullName}
                    onChange={(e) => setTenantData({...tenantData, fullName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={tenantData.phoneNumber}
                    onChange={(e) => setTenantData({...tenantData, phoneNumber: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={tenantData.email}
                    onChange={(e) => setTenantData({...tenantData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Room Number *
                  </Label>
                  <Input
                    id="roomNumber"
                    placeholder="Enter your room number"
                    value={tenantData.roomNumber}
                    onChange={(e) => setTenantData({...tenantData, roomNumber: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" variant="premium" size="lg">
                  Continue to Guarantor Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Guarantor Information */}
        {step === 2 && (
          <Card className="shadow-elevated">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Guarantor Information
              </CardTitle>
              <CardDescription>
                Please provide your guarantor's details for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tenant Summary */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Your Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Name: {tenantData.fullName}</div>
                  <div>Room: {tenantData.roomNumber}</div>
                  <div>Phone: {tenantData.phoneNumber}</div>
                  <div>Email: {tenantData.email}</div>
                </div>
              </div>

              <form onSubmit={handleGuarantorSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="guarantorName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Guarantor's Full Name *
                  </Label>
                  <Input
                    id="guarantorName"
                    placeholder="Enter guarantor's full name"
                    value={guarantorData.guarantorName}
                    onChange={(e) => setGuarantorData({...guarantorData, guarantorName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guarantorPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Guarantor's Phone Number *
                  </Label>
                  <Input
                    id="guarantorPhone"
                    type="tel"
                    placeholder="Enter guarantor's phone number"
                    value={guarantorData.guarantorPhone}
                    onChange={(e) => setGuarantorData({...guarantorData, guarantorPhone: e.target.value})}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="success" 
                    size="lg"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Login and Back to Home Buttons */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={onBackToLogin}
            className="w-full max-w-xs mx-auto mb-4"
          >
            Login (Already have an account?)
          </Button>
          <Button 
            variant="ghost" 
            onClick={onbacktolandingpage}
            className="w-full max-w-xs mx-auto"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}