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
    <div className="min-h-screen bg-[#f4f6f9] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#1E2547] mb-6 text-center">
          Registro de Consumo
        </h1>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {isError && (
          <p className="text-red-600 text-center">
            Erro ao carregar unidades. Tente novamente.
          </p>
        )}

        {unidades && unidades.length > 0 && (
          <RegistroConsumo unidades={unidades} refetchConsumos={refetch} />
        )}
      </div>
    </div>
  );
}
