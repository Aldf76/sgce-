
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alerta } from "@/types/types";
import { AlertTriangle, Bell } from "lucide-react";

interface AlertaConsumoProps {
  alertas: Alerta[];
}

export function AlertaConsumo({ alertas }: AlertaConsumoProps) {
  // Formatação da data para exibição (MM/YYYY)
  const formatarData = (data: string) => {
    const [ano, mes] = data.split('-');
    return `${mes}/${ano}`;
  };

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

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidade</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Consumo Atual</TableHead>
            <TableHead>Média Anterior</TableHead>
            <TableHead>Aumento</TableHead>
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
