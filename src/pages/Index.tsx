import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { TenantRegistration } from "@/components/tenant/TenantRegistration";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { LandlordDashboard } from "@/components/landlord/LandlordDashboard";

type AppState = 'landing' | 'tenant-registration' | 'tenant-dashboard' | 'landlord-dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');

  const handleRoleSelect = (role: 'tenant' | 'landlord') => {
    if (role === 'tenant') {
      setAppState('tenant-registration');
    } else {
      setAppState('landlord-dashboard');
    }
  };

  const handleRegistrationComplete = () => {
    setAppState('tenant-dashboard');
  };

  const handleBackToHome = () => {
    setAppState('landing');
  };

  switch (appState) {
    case 'tenant-registration':
      return (
        <TenantRegistration 
          onBack={handleBackToHome}
          onComplete={handleRegistrationComplete}
        />
      );
    case 'tenant-dashboard':
      return <TenantDashboard onLogout={handleBackToHome} />;
    case 'landlord-dashboard':
      return <LandlordDashboard onLogout={handleBackToHome} />;
    default:
      return <LandingPage onRoleSelect={handleRoleSelect} />;
  }
};

export default Index;
