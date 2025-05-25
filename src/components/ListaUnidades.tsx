import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarUnidades, excluirUnidade } from "@/services/unidadeService";
import { Unidade } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash, Pencil } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Database } from "lucide-react";

type Props = {
  onEditar: (unidade: Unidade) => void;
};

export function ListaUnidades({ onEditar }: Props) {
  const queryClient = useQueryClient();

  const { data: unidades, isLoading, isError } = useQuery<Unidade[]>({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

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
        <AlertDescription>
          Não foi possível carregar as unidades.
        </AlertDescription>
      </Alert>
    );
  }

  if (!unidades || unidades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Database className="h-12 w-12 mb-2" />
        <p className="text-center">Nenhuma unidade cadastrada até o momento.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-auto border border-gray-200 rounded-md shadow-sm">
      <Table>
        <TableHeader className="bg-[#1E2547] text-white">
          <TableRow>
            <TableHead className="text-white">Nome</TableHead>
            <TableHead className="text-white">Cidade</TableHead>
            <TableHead className="text-white">Tipo</TableHead>
            <TableHead className="text-white text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unidades.map((unidade) => (
            <TableRow
              key={unidade.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <TableCell className="font-medium">{unidade.nome}</TableCell>
              <TableCell>{unidade.cidade}</TableCell>
              <TableCell className="capitalize">{unidade.tipo}</TableCell>
              <TableCell className="space-x-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditar(unidade)}
                  className="text-[#1E2547] hover:bg-[#1E2547]/10"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const confirmacao = window.confirm("Deseja excluir esta unidade?");
                    if (confirmacao) excluir(unidade.id!);
                  }}
                  className="text-[#D8282C] hover:bg-[#D8282C]/10"
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
