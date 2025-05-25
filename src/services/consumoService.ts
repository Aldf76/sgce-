import { api } from "@/lib/axios";
import { Consumo, ConsumoDTO } from "@/types/types";

// POST /consumos
export async function registrarConsumo(consumo: ConsumoDTO): Promise<Consumo> {
  const response = await api.post<Consumo>("/consumos", consumo);
  return response.data;
}

// GET /consumos?unidadeId=X
export async function listarConsumosPorUnidade(unidadeId: number): Promise<Consumo[]> {
  const response = await api.get<Consumo[]>("/consumos", {
    params: { unidadeId },
  });
  return response.data;
}
