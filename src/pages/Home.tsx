// Hook do React Router que permite redirecionar o usuário para outra rota do sistema
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


// Biblioteca de animação para suavizar a entrada dos elementos visuais (cards)
import { motion } from "framer-motion";

// Hooks do React: useEffect pode ser usado para buscar dados; useState armazena as métricas
import { useEffect, useState } from "react";

// Ícones usados nos cards (prontos para uso via biblioteca Lucide)
import { Gauge, Building2, Zap } from "lucide-react";

import { buscarMetricasDashboard } from "@/services/dashboardService";

import { Header } from "@/components/Header";

export function Home() {
  const navigate = useNavigate(); // Permite mudar de página quando o botão "Começar" for clicado

  // estado local para armazenar os dados exibidos na home
  const [metricas, setMetricas] = useState({
    totalUnidades: 0,
    mediaConsumo: 0,
    picoConsumo: 0,
    registros: 0,
  });

  // Hook de efeito que executa uma única vez ao carregar a página (com array de dependência vazio).
  // Ele realiza a requisição para o back-end, por meio da função buscarMetricasDashboard(),
  // e atualiza o estado local com os dados retornados da API.
  // Isso garante que os cards exibidos na página Home reflitam os dados reais do sistema,
  // atualizando automaticamente sempre que a Home for acessada após novas inserções no banco.

  const location = useLocation();

  useEffect(() => {
    async function carregarMetricas() {
      try {
        const dados = await buscarMetricasDashboard();
        console.log("🎯 Dashboard recebido:", dados);

        setMetricas(dados);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
      }
    }

    carregarMetricas();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {" "}
      {/* Fundo claro e altura mínima para ocupar a tela toda */}
      {/* Cabeçalho fixo do sistema (nome institucional do sistema) */}
      <Header/>
      <main className="max-w-6xl mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Título central e explicação da página */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1E2547]">Visão Executiva</h2>
          <p className="text-muted-foreground text-sm">
            Resumo geral do sistema
          </p>
        </div>

        {/* Grade de cartões com animações para indicadores principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white p-6 rounded-xl shadow border-l-4 border-[#D8282C]" // visual limpo com borda vermelha de destaque
            initial={{ opacity: 0, y: 10 }} // começa invisível e ligeiramente deslocado
            animate={{ opacity: 1, y: 0 }} // aparece com leve subida
            transition={{ delay: 0.1 }} // atraso para criar efeito em cadeia
          >
            <div className="flex items-center gap-2 text-[#1E2547]">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">Unidades</span>
            </div>
            <p className="text-2xl font-bold mt-2">{metricas.totalUnidades}</p>{" "}
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
            <p className="text-2xl font-bold mt-2">
              {metricas.mediaConsumo} kWh
            </p>
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
            <p className="text-2xl font-bold mt-2">
              {metricas.picoConsumo} kWh
            </p>
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

        {/* Botão que leva para o sistema completo */}
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
