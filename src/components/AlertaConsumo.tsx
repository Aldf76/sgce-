// Importação dos componentes de tabela personalizados do projeto
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";

// Tipagem do alerta (vem da API) — inclui unidade, data, valores e % de aumento
import { Alerta } from "@/types/types";

// Ícones usados na interface
import { AlertTriangle, Bell } from "lucide-react";

// Props esperadas: lista de alertas de consumo vindos da API
interface AlertaConsumoProps {
  alertas: Alerta[];
}

// Componente que exibe a lista de alertas de consumo por unidade
export function AlertaConsumo({ alertas }: AlertaConsumoProps) {

  // Função utilitária para formatar datas YYYY-MM para MM/YYYY
  const formatarData = (data: string) => {
    const [ano, mes] = data.split('-');
    return `${mes}/${ano}`;
  };

  // Caso não haja nenhum alerta retornado pela API
  if (alertas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Bell className="h-12 w-12 mb-2" />
        <p>Nenhum alerta de consumo registrado</p>
        <p className="text-sm mt-2">
          Os alertas aparecem quando o consumo de uma unidade excede em 20% a média dos últimos 3 meses
        </p>
      </div>
    );
  }

  // Renderização da tabela com os alertas
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidade</TableHead> {/* Nome da unidade com consumo elevado */}
            <TableHead>Data</TableHead> {/* Mês/ano do consumo em excesso */}
            <TableHead>Consumo Atual</TableHead> {/* Valor em kWh no mês em questão */}
            <TableHead>Média Anterior</TableHead> {/* Média dos 3 meses anteriores */}
            <TableHead>Aumento</TableHead> {/* % de aumento com ícone de alerta */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {alertas.map((alerta) => (
            <TableRow key={alerta.id}>
              <TableCell className="font-medium">{alerta.unidadeNome}</TableCell>
              <TableCell>{formatarData(alerta.dataReferencia)}</TableCell>
              <TableCell>{alerta.consumoAtual} kWh</TableCell>
              <TableCell>{alerta.mediaAnterior} kWh</TableCell>
              <TableCell className="text-destructive flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {alerta.percentualAumento}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/*
O componente AlertaConsumo exibe de forma clara e analítica os alertas de consumo elevado, 
com base em um critério técnico pré-definido: variação superior a 20% na média de consumo. 
Ele permite que o usuário identifique padrões de desperdício ou aumento inesperado, 
o que é essencial para a gestão energética e tomada de decisão estratégica.
 A apresentação em tabela facilita a leitura e pode ser usada em dashboards executivos ou operacionais.
*/