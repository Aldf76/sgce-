import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Unidade, Consumo } from "@/types/types";
import { listarUnidades } from "@/services/unidadeService";
import { listarConsumosPorUnidade } from "@/services/consumoService";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function VisualizacaoConsumo() {
  const [unidadeId, setUnidadeId] = useState<string | null>(null);

  const { data: unidades = [], isLoading: carregandoUnidades } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  const { data: consumos = [], isLoading: carregandoConsumos } = useQuery({
    queryKey: ["consumos", unidadeId],
    queryFn: () =>
      unidadeId ? listarConsumosPorUnidade(Number(unidadeId)) : Promise.resolve([]),
    enabled: !!unidadeId,
  });

  const maiorConsumo = consumos.length > 0 ? Math.max(...consumos.map(c => c.consumoKwh)) : 0;
  const mediaUltimos3 = consumos.length >= 3
    ? consumos.slice(-3).reduce((acc, c) => acc + c.consumoKwh, 0) / 3
    : 0;

  const consumoMaisRecente = consumos.length > 0 ? consumos[consumos.length - 1].consumoKwh : 0;
  const percentualAcima = mediaUltimos3 > 0
    ? (((consumoMaisRecente - mediaUltimos3) / mediaUltimos3) * 100).toFixed(1)
    : "0";

  const corTexto =
    +percentualAcima < 10 ? "text-green-600" :
    +percentualAcima < 20 ? "text-yellow-600" :
    "text-red-600";

  const gerarPDF = () => {
    const elemento = document.getElementById("relatorio-consumo");
    if (!elemento) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "relatorio-consumo.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(elemento)
      .save();
  };

  return (
    <div className="space-y-6">
      <Select onValueChange={(valor) => setUnidadeId(valor)}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Selecione uma unidade" />
        </SelectTrigger>
        <SelectContent>
          {unidades.map((unidade) => (
            <SelectItem key={unidade.id} value={unidade.id.toString()}>
              {unidade.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {carregandoConsumos ? (
        <p className="text-muted-foreground">Carregando consumos...</p>
      ) : unidadeId && consumos.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum consumo registrado para esta unidade.
        </p>
      ) : (
        <>
          <motion.div
            key={unidadeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* 🔽 Conteúdo exportável */}
            <div id="relatorio-consumo" className="space-y-6 bg-[#1E2547] p-6 rounded-lg text-white">
              {/* Cabeçalho com logo */}
              <div className="flex items-center justify-between mb-4">
                <img src="/bipbrasil_logo.jpg" alt="Logo BIP Brasil" className="h-10" />
                <h2 className="text-xl font-semibold">Relatório de Consumo Energético</h2>
              </div>

              {/* Tabela */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Mês</TableHead>
                    <TableHead className="text-white">Consumo (kWh)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumos.map((consumo) => (
                    <TableRow key={consumo.id}>
                      <TableCell>{consumo.dataReferencia.split("-").reverse().join("/")}</TableCell>
                      <TableCell>{consumo.consumoKwh}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Insights + Gráfico */}
              {consumos.length >= 3 && (
                <div className="mt-10 space-y-4">
                  <div className="bg-white text-black rounded-xl p-4 border-l-4 border-[#D8282C] shadow-sm">
                    <p className="text-sm mb-1">
                      Média dos últimos 3 meses:{" "}
                      <span className="font-semibold">{mediaUltimos3.toFixed(1)} kWh</span>
                    </p>
                    <p className="text-sm">
                      Mês atual:{" "}
                      <span className="font-semibold">{consumoMaisRecente} kWh</span>{" "}
                      <span className={`ml-2 font-semibold ${corTexto}`}>
                        ({percentualAcima}% acima da média)
                      </span>
                    </p>
                  </div>

                  {/* Gráfico */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Evolução do Consumo (kWh)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={consumos}>
                        <XAxis dataKey="dataReferencia" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="consumoKwh"
                          stroke="#D8282C"
                          fill="#D8282C44"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-sm text-white">
                    🔺 Pico de consumo registrado:{" "}
                    <span className="font-semibold">{maiorConsumo} kWh</span>
                  </p>
                </div>
              )}
            </div>

            {/* Botão PDF */}
            <div className="pt-6">
              <button
                onClick={gerarPDF}
                className="bg-[#D8282C] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Exportar como PDF
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
