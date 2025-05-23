import { useQuery } from "@tanstack/react-query";
import { listarUnidades } from "@/services/unidadeService";
import { Unidade } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Database } from "lucide-react";

export function ListaUnidades() {
  const { data: unidades, isLoading, isError } = useQuery<Unidade[]>({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>Não foi possível carregar as unidades.</AlertDescription>
      </Alert>
    );
  }

  if (!unidades || unidades.length === 0) {
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
