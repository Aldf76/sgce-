
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Unidade } from "@/types/types";
import { Database } from "lucide-react";

interface ListaUnidadesProps {
  unidades: Unidade[];
}

export function ListaUnidades({ unidades }: ListaUnidadesProps) {
  if (unidades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Database className="h-12 w-12 mb-2" />
        <p>Nenhuma unidade cadastrada</p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unidades.map((unidade) => (
            <TableRow key={unidade.id}>
              <TableCell className="font-medium">{unidade.nome}</TableCell>
              <TableCell>{unidade.cidade}</TableCell>
              <TableCell className="capitalize">{unidade.tipo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
