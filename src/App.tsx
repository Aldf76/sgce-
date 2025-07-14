import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PaginaRegistroConsumo } from "./pages/PaginaRegistroConsumo";
import { Home } from "./pages/Home"; // ✅ Importação da Home
import { AppRoutes } from "./AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AppRoutes/>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
