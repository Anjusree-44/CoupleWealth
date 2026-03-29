import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CoupleProvider, useCouple } from "@/context/CoupleContext";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import GoalPlanner from "./pages/GoalPlanner";
import LifeEvents from "./pages/LifeEvents";
import TaxOptimizer from "./pages/TaxOptimizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isOnboarded } = useCouple();
  return (
    <Routes>
      <Route path="/" element={isOnboarded ? <Navigate to="/dashboard" /> : <Onboarding />} />
      <Route path="/dashboard" element={isOnboarded ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/goals" element={isOnboarded ? <GoalPlanner /> : <Navigate to="/" />} />
      <Route path="/life-events" element={isOnboarded ? <LifeEvents /> : <Navigate to="/" />} />
      <Route path="/tax" element={isOnboarded ? <TaxOptimizer /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CoupleProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CoupleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
