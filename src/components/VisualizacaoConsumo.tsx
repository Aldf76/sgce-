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
  // Hook para armazenar o ID da unidade selecionada para filtragem de consumo
  const [unidadeId, setUnidadeId] = useState<string | null>(null);

  // Busca todas as unidades cadastradas no sistema (aparece no dropdown)
  const { data: unidades = [], isLoading: carregandoUnidades } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  // Busca os consumos vinculados à unidade selecionada
  const { data: consumos = [], isLoading: carregandoConsumos } = useQuery({
    queryKey: ["consumos", unidadeId], // chave dinâmica para cache do consumo por unidade
    queryFn: () =>
      unidadeId
        ? listarConsumosPorUnidade(Number(unidadeId))
        : Promise.resolve([]),
    enabled: !!unidadeId, // só executa quando uma unidade estiver selecionada
  });

  // Cálculo do maior consumo registrado na lista (usado para exibir o pico)
  const maiorConsumo =
    consumos.length > 0 ? Math.max(...consumos.map((c) => c.consumoKwh)) : 0;

  // Calcula a média dos últimos 3 meses (para comparação com o mês atual)
  const mediaUltimos3 =
    consumos.length >= 3
      ? consumos.slice(-3).reduce((acc, c) => acc + c.consumoKwh, 0) / 3
      : 0;

  // Consumo do mês mais recente (último item da lista)
  const consumoMaisRecente =
    consumos.length > 0 ? consumos[consumos.length - 1].consumoKwh : 0;

  // Cálculo percentual de aumento em relação à média
  const percentualAcima =
    mediaUltimos3 > 0
      ? (((consumoMaisRecente - mediaUltimos3) / mediaUltimos3) * 100).toFixed(
          1
        )
      : "0";

  // Define cor do texto conforme o percentual calculado
  const corTexto =
    +percentualAcima < 10
      ? "text-green-600"
      : +percentualAcima < 20
      ? "text-yellow-600"
      : "text-red-600";

  // Função para gerar e exportar o relatório como PDF (usando html2pdf.js)
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
      {/* Dropdown que permite selecionar uma unidade cadastrada para visualizar seus consumos */}
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

      {/* Caso ainda esteja carregando os consumos da unidade selecionada */}
      {carregandoConsumos ? (
        <p className="text-muted-foreground">Carregando consumos...</p>
      ) : // Caso uma unidade esteja selecionada, mas ela não tenha nenhum consumo registrado
      unidadeId && consumos.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum consumo registrado para esta unidade.
        </p>
      ) : (
        // Quando há dados suficientes de consumo para exibir
        <>
          <motion.div
            key={unidadeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Área exportável como PDF – contém tabela, insights e gráfico */}
            <div
              id="relatorio-consumo"
              className="space-y-6 bg-[#1E2547] p-6 rounded-lg text-white"
            >
              {/* Cabeçalho com logo institucional e título do relatório */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Relatório de Consumo Energético
                </h2>
              </div>

              {/* Tabela listando os consumos por mês */}
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
                      <TableCell>
                        {consumo.dataReferencia.split("-").reverse().join("/")}
                      </TableCell>
                      <TableCell>{consumo.consumoKwh}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Informações analíticas exibidas somente se há pelo menos 3 consumos */}
              {consumos.length >= 3 && (
                <div className="mt-10 space-y-4">
                  {/* Bloco com insights comparativos do mês atual e média */}
                  <div className="bg-white text-black rounded-xl p-4 border-l-4 border-[#D8282C] shadow-sm">
                    <p className="text-sm mb-1">
                      Média dos últimos 3 meses:{" "}
                      <span className="font-semibold">
                        {mediaUltimos3.toFixed(1)} kWh
                      </span>
                    </p>
                    <p className="text-sm">
                      Mês atual:{" "}
                      <span className="font-semibold">
                        {consumoMaisRecente} kWh
                      </span>{" "}
                      <span className={`ml-2 font-semibold ${corTexto}`}>
                        ({percentualAcima}% acima da média)
                      </span>
                    </p>
                  </div>

                  {/* Gráfico de área com a evolução do consumo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      Evolução do Consumo (kWh)
                    </h3>
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

                  {/* Exibe o maior consumo registrado na série */}
                  <p className="text-sm text-white">
                    🔺 Pico de consumo registrado:{" "}
                    <span className="font-semibold">{maiorConsumo} kWh</span>
                  </p>
                </div>
              )}
            </div>

            {/* Botão para exportar o relatório em PDF */}
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

/*
A página VisualizacaoConsumo.tsx é responsável por reunir e apresentar, de forma clara e visual, todos os registros de consumo energético vinculados a uma unidade específica.
 Ela permite que o usuário escolha uma unidade previamente cadastrada e, a partir disso, exibe os dados mensais de consumo em tabela, mostra comparações com a média dos últimos meses e renderiza um gráfico com a evolução desses consumos.
  Também oferece a opção de exportar essas informações em PDF para fins de análise ou documentação. Em resumo, este componente cumpre o papel de transformar os dados brutos registrados no sistema em informações úteis e compreensíveis,
   ajudando o usuário a acompanhar e interpretar o comportamento de consumo de energia de cada unidade ao longo do tempo.
*/
