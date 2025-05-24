import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query";
import { listarUnidades, excluirUnidade } from "@/services/unidadeService";
import { Unidade } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Database } from "lucide-react";

export function ListaUnidades() {
  const queryClient = useQueryClient();

  const { data: unidades, isLoading, isError } = useQuery<Unidade[]>({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });


  // mudanças para estabelecer botão de excluir.
  const { mutate: excluir, isPending: excluindo } = useMutation({
    mutationFn: excluirUnidade,
    onSuccess: () => {
      toast.success("Unidade excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
    },
    onError: () => {
      toast.error("Erro ao excluir unidade.");
    },
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


              <TableCell> {/*adição de table-cell para feature de exclusão*/}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const confirmacao = window.confirm("Tem certeza que deseja excluir esta unidade?");
                  if (confirmacao) {
                    excluir(unidade.id!);
                  }
                }}
                disabled={excluindo}
              >   
                <Trash className="h-4 w-4" />
              </Button>
              </TableCell>





            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
