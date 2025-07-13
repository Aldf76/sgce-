// Hook do React Query que busca os dados da API de forma reativa e com cache
import { useQuery } from "@tanstack/react-query";

// Função que acessa o back-end e retorna a lista de unidades cadastradas
import { listarUnidades } from "@/services/unidadeService";

// Componente de formulário para registrar consumo mensal de uma unidade
import { RegistroConsumo } from "@/components/RegistroConsumo";

// Componente visual que mostra “esqueleto” de carregamento (efeito loading)
import { Skeleton } from "@/components/ui/skeleton";

export function PaginaRegistroConsumo() {
  // Realiza a requisição para buscar as unidades cadastradas
  // Também controla os estados de carregamento (isLoading) e erro (isError)
  const {
    data: unidades,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["unidades"], // identificador único dessa requisição
    queryFn: listarUnidades, // função que realiza o fetch
  });

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-10 px-4">
      {/* Container centralizado com fundo branco e sombras */}
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#1E2547] mb-6 text-center">
          Registro de Consumo
        </h1>

        {/* Se estiver carregando, mostra placeholders para evitar tela vazia */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {/* Se ocorrer erro na requisição, mostra mensagem amigável */}
        {isError && (
          <p className="text-red-600 text-center">
            Erro ao carregar unidades. Tente novamente.
          </p>
        )}

        {/* Se os dados foram carregados com sucesso e há unidades disponíveis,
            exibe o formulário para registrar consumo */}
        {unidades && unidades.length > 0 && (
          <RegistroConsumo unidades={unidades} refetchConsumos={refetch} />
        )}
      </div>
    </div>
  );
}
