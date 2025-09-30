import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Phone, Mail, Home, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TenantRegistrationProps {
  onBack: () => void;
  onComplete: () => void;
}

export function TenantRegistration({ onBack, onComplete }: TenantRegistrationProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [tenantData, setTenantData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    roomNumber: ""
  });
  
  const [guarantorData, setGuarantorData] = useState({
    guarantorName: "",
    guarantorPhone: ""
  });

  const handleTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleGuarantorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tenantData.email,
        password: tenantData.password,
        options: {
          data: {
            full_name: tenantData.fullName,
            phone: tenantData.phoneNumber,
            role: "tenant",
          },
          emailRedirectTo: `${window.location.origin}/tenant`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");

      // Create tenant record
      const { error: tenantError } = await supabase.from("tenants").insert({
        user_id: authData.user.id,
        room_number: tenantData.roomNumber,
        guarantor_name: guarantorData.guarantorName,
        guarantor_phone: guarantorData.guarantorPhone,
      });

      if (tenantError) throw tenantError;

      toast({
        title: "Success",
        description: "Registration successful! Please login.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
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
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={tenantData.fullName}
                    onChange={(e) => setTenantData({...tenantData, fullName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
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
                  <Label htmlFor="email">Email Address *</Label>
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
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={tenantData.password}
                    onChange={(e) => setTenantData({...tenantData, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number *</Label>
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
                  <Label htmlFor="guarantorName">Guarantor's Full Name *</Label>
                  <Input
                    id="guarantorName"
                    placeholder="Enter guarantor's full name"
                    value={guarantorData.guarantorName}
                    onChange={(e) => setGuarantorData({...guarantorData, guarantorName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guarantorPhone">Guarantor's Phone Number *</Label>
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
                    variant="premium" 
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
      </div>
    </div>
  );
}
