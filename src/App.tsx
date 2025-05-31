import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CivicAuthProvider clientId="8f44da03-88fb-44f3-98e3-764ff4c41b97">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
             <Route path="/tenants" element={<TenantDashboard />} />
            <Route path="/landlords" element={<LandlordDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CivicAuthProvider>
  </QueryClientProvider>
);

export default App;
