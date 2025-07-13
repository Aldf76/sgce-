// React Query para chamadas assíncronas (GET, DELETE) e controle de cache
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Funções do serviço que se comunicam com a API
import { listarUnidades, excluirUnidade } from "@/services/unidadeService";

// Tipagem da entidade Unidade
import { Unidade } from "@/types/types";

// Componentes de tabela da UI
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";

// Skeletons para estado de carregamento visual
import { Skeleton } from "@/components/ui/skeleton";

// Botões e ícones
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Biblioteca para feedbacks rápidos ao usuário
import { Trash, Pencil } from "lucide-react"; // Ícones de ação
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Database } from "lucide-react"; // Ícone exibido quando não há dados

// Props esperadas do componente: função que será chamada ao clicar no botão de editar
type Props = {
  onEditar: (unidade: Unidade) => void;
};

// Componente principal que renderiza a lista de unidades
export function ListaUnidades({ onEditar }: Props) {
  const queryClient = useQueryClient(); // Responsável por gerenciar cache de dados

  // Hook para buscar as unidades com React Query
  const { data: unidades, isLoading, isError } = useQuery<Unidade[]>({
    queryKey: ["unidades"], // Chave usada para cache e invalidação
    queryFn: listarUnidades, // Função que busca as unidades na API
  });

  // Hook para exclusão de unidade
  const { mutate: excluir, isPending: excluindo } = useMutation({
    mutationFn: excluirUnidade, // Função que chama o endpoint DELETE
    onSuccess: () => {
      toast.success("Unidade excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["unidades"] }); // Refaz a busca após exclusão
    },
    onError: () => {
      toast.error("Erro ao excluir unidade.");
    },
  });

  // Exibição enquanto dados estão sendo carregados
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  // Exibição se houver erro na chamada da API
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

  // Exibição se não houver nenhuma unidade cadastrada
  if (!unidades || unidades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Database className="h-12 w-12 mb-2" />
        <p className="text-center">Nenhuma unidade cadastrada até o momento.</p>
      </div>
    );
  }

  // Renderização principal da tabela com as unidades
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
              {/* Nome da unidade */}
              <TableCell className="font-medium">{unidade.nome}</TableCell>

              {/* Cidade da unidade */}
              <TableCell>{unidade.cidade}</TableCell>

              {/* Tipo de unidade (residencial, comercial...) */}
              <TableCell className="capitalize">{unidade.tipo}</TableCell>

              {/* Botões de ação: editar e excluir */}
              <TableCell className="space-x-2 text-center">
                {/* Botão de edição: chama função recebida como prop */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditar(unidade)}
                  className="text-[#1E2547] hover:bg-[#1E2547]/10"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                {/* Botão de exclusão com confirmação via window.confirm */}
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


/*
Este componente ListaUnidades é responsável por exibir todas as unidades cadastradas no sistema de forma visual e interativa. 
Ele se comunica diretamente com a API para listar, excluir e atualizar dados em tempo real, garantindo uma experiência fluida.
 Também oferece ações de manutenção, como edição e exclusão de forma intuitiva, e dá feedback imediato ao usuário sobre o sucesso ou erro das operações.
  É uma parte fundamental da administração de unidades consumidoras no SGCE.
*/