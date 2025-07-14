// src/AppRoutes.tsx
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PaginaRegistroConsumo } from "./pages/PaginaRegistroConsumo";
import { Home } from "./pages/Home"; // ✅ Importação da Home

export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/sistema" element={<Index />} />
      <Route path="/registro-consumo" element={<PaginaRegistroConsumo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
