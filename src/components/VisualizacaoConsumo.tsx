import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Unidade, Consumo } from "@/types/types";
import { listarUnidades } from "@/services/unidadeService";
import { listarConsumosPorUnidade } from "@/services/consumoService";
import html2pdf from "html2pdf.js";
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

  // 🔽 Função para gerar PDF do conteúdo com ID "relatorio-consumo"
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
          {/* 🔽 Aqui começa o conteúdo que será exportado para PDF */}
          <div id="relatorio-consumo" className="space-y-6">

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Consumo (kWh)</TableHead>
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

            {consumos.length >= 3 && (
              <div className="mt-10 space-y-4">
                {/* Insight visual */}
                <div className="bg-muted rounded-xl p-4 border-l-4 border-primary shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">
                    Média dos últimos 3 meses:{" "}
                    <span className="text-black font-semibold">{mediaUltimos3.toFixed(1)} kWh</span>
                  </p>
                  <p className="text-sm">
                    Mês atual:{" "}
                    <span className="font-semibold text-black">{consumoMaisRecente} kWh</span>{" "}
                    <span className={`ml-2 font-semibold ${corTexto}`}>
                      ({percentualAcima}% acima da média)
                    </span>
                  </p>
                </div>

                {/* Gráfico com área preenchida */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Evolução do Consumo (kWh)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={consumos}>
                      <XAxis dataKey="dataReferencia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="consumoKwh"
                        stroke="#4f46e5"
                        fill="#c7d2fe"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Badge do pico de consumo */}
                <p className="text-sm text-muted-foreground">
                  🔺 Pico de consumo registrado:{" "}
                  <span className="text-primary font-semibold">{maiorConsumo} kWh</span>
                </p>
              </div>
            )}
          </div>

          {/* 🔘 Botão de exportar PDF */}
          <div className="pt-6">
            <button
              onClick={gerarPDF}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Exportar como PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
