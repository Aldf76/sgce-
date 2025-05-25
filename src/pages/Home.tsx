import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Gauge, Building2, Zap } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  // Simulação de métricas (integração real virá depois)
  const [metricas, setMetricas] = useState({
    totalUnidades: 7,
    mediaConsumo: 2130,
    picoConsumo: 340,
    registros: 42,
  });

  useEffect(() => {
    // Aqui entrará fetch/axios com dados reais
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* Header institucional */}
      <header className="bg-[#1E2547] text-white py-4 px-6 flex items-center gap-4 shadow">
        <img src="/bipbrasil_logo.jpg" alt="Logo BIP" className="h-10 w-auto" />
        <h1 className="text-xl font-semibold">Sistema de Gestão de Consumo Energético</h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">

        {/* Título e subtítulo */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1E2547]">Visão Executiva</h2>
          <p className="text-muted-foreground text-sm">Resumo geral do sistema</p>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white p-6 rounded-xl shadow border-l-4 border-[#D8282C]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-[#1E2547]">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">Unidades</span>
            </div>
            <p className="text-2xl font-bold mt-2">{metricas.totalUnidades}</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow border-l-4 border-[#D8282C]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-[#1E2547]">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Média Consumo</span>
            </div>
            <p className="text-2xl font-bold mt-2">{metricas.mediaConsumo} kWh</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow border-l-4 border-[#D8282C]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-[#1E2547]">
              <Gauge className="w-5 h-5" />
              <span className="text-sm font-medium">Pico Consumo</span>
            </div>
            <p className="text-2xl font-bold mt-2">{metricas.picoConsumo} kWh</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow border-l-4 border-[#D8282C]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-[#1E2547]">
              <span className="text-sm font-medium">Registros</span>
            </div>
            <p className="text-2xl font-bold mt-2">{metricas.registros}</p>
          </motion.div>
        </div>

        {/* Botão de entrada */}
        <div className="text-center">
          <button
            onClick={() => navigate("/sistema")}
            className="bg-[#D8282C] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#b91d23] transition"
          >
            Começar
          </button>
        </div>
      </main>
    </div>
  );
}
