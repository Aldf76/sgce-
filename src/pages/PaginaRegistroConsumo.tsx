// src/pages/PaginaRegistroConsumo.tsx

import { useQuery } from "@tanstack/react-query";
import { listarUnidades } from "@/services/unidadeService";
import { RegistroConsumo } from "@/components/RegistroConsumo";
import { Skeleton } from "@/components/ui/skeleton";

export function PaginaRegistroConsumo() {
  const {
    data: unidades,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Registro de Consumo</h1>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-red-500">Erro ao carregar unidades. Tente novamente.</p>
      )}

      {unidades && unidades.length > 0 && (
        <RegistroConsumo unidades={unidades} refetchConsumos={refetch} />
      )}
    </div>
  );
}
