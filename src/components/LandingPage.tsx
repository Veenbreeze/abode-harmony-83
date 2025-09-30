import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, FileText, Clock, CheckCircle } from "lucide-react";
import heroImage from "@/assets/pexels-pixabay-164558.jpg";

interface LandingPageProps {
  onRoleSelect: (role: 'tenant' | 'landlord') => void;
}

export function LandingPage({ onRoleSelect }: LandingPageProps) {
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord' | null>(null);

  const features = [
    {
      icon: Users,
      title: "Tenant Management",
      description: "Complete tenant registration with guarantor details and verification"
    },
    {
      icon: FileText,
      title: "Receipt Tracking",
      description: "Upload and verify rent payment receipts with automatic processing"
    },
    {
      icon: Clock,
      title: "Request System",
      description: "Handle move-out requests and payment extensions seamlessly"
    },
    {
      icon: Shield,
      title: "Secure Dashboard",
      description: "Protected access with role-based permissions for landlords and tenants"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">RentManager Pro</h1>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            Professional Rental Management
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Complete Rental Solution
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Manage Your
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> Rental Properties </span>
                  with Ease
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Streamline tenant management, track payments, handle requests, and maintain complete records all in one professional platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => setSelectedRole('tenant')}
                  className="text-lg"
                >
                  I'm a Tenant
                </Button>
                <Button 
                  variant="premium" 
                  size="lg"
                  onClick={() => setSelectedRole('landlord')}
                  className="text-lg"
                >
                  I'm a Landlord
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Mobile Friendly</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src={heroImage} 
                  alt="Modern rental house management" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Manage Rentals
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From tenant registration to payment tracking, our platform handles every aspect of rental management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-elevated transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-elevated">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Continue as {selectedRole === 'tenant' ? 'Tenant' : 'Landlord'}
              </CardTitle>
              <CardDescription>
                You'll be redirected to the {selectedRole} portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => onRoleSelect(selectedRole)}
                className="w-full"
                variant="premium"
                size="lg"
              >
                Continue to {selectedRole === 'tenant' ? 'Tenant' : 'Landlord'} Portal
              </Button>
              <Button 
                onClick={() => setSelectedRole(null)}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}