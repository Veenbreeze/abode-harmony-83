/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import { TenantDashboard } from "@/components/tenant/TenantDashboard";
import { LandlordDashboard } from "@/components/landlord/LandlordDashboard";
import { TenantRegistration } from "@/components/tenant/TenantRegistration";
import { LandingPage } from "./components/LandingPage";
// Import actual quick action pages
import UploadReceipt from "@/pages/tenant/UploadReceipt";
import RequestExtension from "@/pages/tenant/RequestExtension";
import MoveoutRequest from "@/pages/tenant/MoveoutRequest";
import ReportMaintenance from "@/pages/tenant/ReportMaintenance";
import ReviewReceipts from "@/pages/landlord/ReviewReceipts";
import SendNotice from "@/pages/landlord/SendNotice";
import AddTenant from "@/pages/landlord/AddTenant";
import PropertySettings from "@/pages/landlord/PropertySettings";

const App = () => {
  const [page, setPage] = useState<
    | "landing"
    | "tenant-registration"
    | "tenant-dashboard"
    | "landlord-dashboard"
    | "upload-receipt"
    | "request-extension"
    | "moveout-request"
    | "report-maintenance"
    | "review-receipts"
    | "send-notice"
    | "add-tenant"
    | "property-settings"
  >("landing");

  // Landlord quick actions navigation
  const handleLandlordAction = (action: string) => {
    if (action === "review-receipts") setPage("review-receipts");
    else if (action === "send-notice") setPage("send-notice");
    else if (action === "add-tenant") setPage("add-tenant");
    else if (action === "property-settings") setPage("property-settings");
  };

  // Tenant quick actions navigation
  const handleTenantAction = (action: string) => {
    if (action === "upload-receipt") setPage("upload-receipt");
    else if (action === "request-extension") setPage("request-extension");
    else if (action === "moveout-request") setPage("moveout-request");
    else if (action === "report-maintenance") setPage("report-maintenance");
  };

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <div>
          {page === "landing" && (
            <LandingPage
              onRoleSelect={role => {
                if (role === "tenant") setPage("tenant-registration");
                else setPage("landlord-dashboard");
              }}
            />
          )}
          {page === "tenant-registration" && (
            <TenantRegistration
              onComplete={() => setPage("tenant-dashboard")}
              onBackToLogin={() => setPage("tenant-registration")}
              onBack={() => setPage("landing")}
              onBackToHome={() => setPage("landing")}
            />
          )}
          {page === "tenant-dashboard" && (
            <TenantDashboard
              onLogout={() => setPage("landing")}
              onQuickAction={handleTenantAction}
            />
          )}
          {page === "landlord-dashboard" && (
            <LandlordDashboard
              onLogout={() => setPage("landing")}
              onQuickAction={handleLandlordAction}
            />
          )}
          {/* Tenant quick actions */}
          {page === "upload-receipt" && (
            <UploadReceipt onBackToDashboard={() => setPage("tenant-dashboard")} />
          )}
          {page === "request-extension" && (
            <RequestExtension onBackToDashboard={() => setPage("tenant-dashboard")} />
          )}
          {page === "moveout-request" && (
            <MoveoutRequest onBackToDashboard={() => setPage("tenant-dashboard")} />
          )}
          {page === "report-maintenance" && (
            <ReportMaintenance onBackToDashboard={() => setPage("tenant-dashboard")} />
          )}
          {/* Landlord quick actions */}
          {page === "review-receipts" && (
            <ReviewReceipts onBackToDashboard={() => setPage("landlord-dashboard")} />
          )}
          {page === "send-notice" && (
            <SendNotice onBackToDashboard={() => setPage("landlord-dashboard")} />
          )}
          {page === "add-tenant" && (
            <AddTenant onBackToDashboard={() => setPage("landlord-dashboard")} />
          )}
          {page === "property-settings" && (
            <PropertySettings onBackToDashboard={() => setPage("landlord-dashboard")} />
          )}
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
