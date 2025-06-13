import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantSettingsPage from "./pages/tenant/SettingsPage";
import LandlordSettingsPage from "./pages/landlord/SettingsPage";
import PropertyDetails from "./pages/PropertyDetails";
import MyApplications from "./pages/MyApplications";
import ApplicationsPage from "./pages/ApplicationPage";
import { WalletProvider } from "@/contexts/WalletContext";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
    <QueryClientProvider client={queryClient}>
    <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/tenants" element={<TenantDashboard />} />
              <Route path="/landlords" element={<LandlordDashboard />} />
              <Route path="/tenant/settings" element={<TenantSettingsPage />} />
              <Route path="/landlord/settings" element={<LandlordSettingsPage />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/my-applications/:id?" element={<MyApplications />} />
              <Route path="/landlord/applications" element={<ApplicationsPage />} />


            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
