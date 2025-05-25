import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PaginaRegistroConsumo } from "./pages/PaginaRegistroConsumo";
import { Home } from "./pages/Home"; // ✅ Importação da Home

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Home executiva como página inicial */}
          <Route path="/" element={<Home />} />

          {/* ✅ Tela com tabs padrão do projeto agora em /sistema */}
          <Route path="/sistema" element={<Index />} />

          {/* Página avulsa de consumo */}
          <Route path="/registro-consumo" element={<PaginaRegistroConsumo />} />

          {/* Página de erro 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
