// src/services/unidadeService.ts
import { api } from "@/lib/axios";
import { Unidade, Pagina } from "@/types/types";

// Tipo auxiliar para cadastro
type NovaUnidade = Omit<Unidade, "id" | "ativo">;

// POST /unidades
export const cadastrarUnidade = async (
  dados: NovaUnidade
): Promise<Unidade> => {
  const response = await api.post<Unidade>("/unidades", dados);
  return response.data;
};

// GET /unidades
export const listarUnidades = async (): Promise<Unidade[]> => {
    const response = await api.get<Pagina<Unidade>>("/unidades");
    return response.data.content;
  };

  // DELETE /unidades/{id}
export const excluirUnidade = async (id: number): Promise<void> => {
  await api.delete(`/unidades/${id}`);
};

  


