import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import { AuthPage } from "@/components/auth/AuthPage";
import { TenantRegistration } from "@/components/tenant/TenantRegistration";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { LandlordDashboard } from "@/components/landlord/LandlordDashboard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setUserRole(data?.role || null);
      }
      setRoleLoading(false);
    }
    fetchRole();
  }, [user]);

  if (loading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === "landlord" ? "/landlord" : "/tenant"} replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/tenant-register" element={<TenantRegistration onBack={() => {}} onComplete={() => {}} />} />
          <Route
            path="/tenant"
            element={
              <ProtectedRoute role="tenant">
                <TenantDashboard onLogout={() => supabase.auth.signOut()} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord"
            element={
              <ProtectedRoute role="landlord">
                <LandlordDashboard onLogout={() => supabase.auth.signOut()} />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
