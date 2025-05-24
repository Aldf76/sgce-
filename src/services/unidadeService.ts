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

// PUT /unidades
export const editarUnidade = async (
  id: number,
  dados: Omit<Unidade, "ativo"> // inclui "id", exclui "ativo"
): Promise<Unidade> => {
  const payload = { id, ...dados }; // backend exige id no corpo
  const response = await api.put<Unidade>("/unidades", payload);
  return response.data;
};

  


