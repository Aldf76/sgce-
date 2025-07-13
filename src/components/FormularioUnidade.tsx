// Importação do hook de formulários reativos
import { useForm } from "react-hook-form";

// React Query para mutações (POST/PUT) e gerenciamento de cache
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Componentes de formulário personalizados da UI
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner"; // Notificações de feedback ao usuário
import { cadastrarUnidade, editarUnidade } from "@/services/unidadeService"; // Serviços da API
import { Unidade } from "@/types/types";
import { useEffect } from "react";

// Tipagem dos dados do formulário
type FormData = {
  nome: string;
  cidade: string;
  tipo: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL";
};

// Props esperadas: modo (criar/editar), unidade a ser editada, e callback pós-envio
type Props = {
  modo: "criar" | "editar";
  unidadeSelecionada?: Unidade | null;
  aoFinalizar?: () => void; // callback chamado após sucesso ou cancelamento
};

// Componente principal para cadastro ou edição de unidade
export function FormularioUnidade({ modo, unidadeSelecionada, aoFinalizar }: Props) {
  const queryClient = useQueryClient(); // Gerenciador de cache de queries

  // Hook de controle do formulário
  const form = useForm<FormData>({
    defaultValues: {
      nome: "",
      cidade: "",
      tipo: "RESIDENCIAL",
    },
  });

  // Preenche os campos automaticamente ao entrar em modo de edição
  useEffect(() => {
    if (modo === "editar" && unidadeSelecionada) {
      form.reset({
        nome: unidadeSelecionada.nome,
        cidade: unidadeSelecionada.cidade,
        tipo: unidadeSelecionada.tipo,
      });
    } else {
      form.reset(); // Limpa tudo se mudar para modo de criação
    }
  }, [modo, unidadeSelecionada, form]);

  // Modo dinâmico: usa POST (cadastrar) ou PUT (editar)
  const mutation = useMutation({
    mutationFn: async (dados: FormData) => {
      if (modo === "criar") {
        return await cadastrarUnidade(dados);
      } else {
        if (!unidadeSelecionada?.id) throw new Error("ID da unidade não definido.");
        return await editarUnidade(unidadeSelecionada.id, dados);
      }
    },
    onSuccess: () => {
      toast.success(
        modo === "criar" ? "Unidade cadastrada com sucesso!" : "Unidade editada com sucesso!"
      );
      queryClient.invalidateQueries({ queryKey: ["unidades"] }); // Atualiza a lista após edição
      form.reset(); // Limpa os campos
      aoFinalizar?.(); // Finaliza o modo de edição ou retorna ao modo de criação
    },
    onError: () => {
      toast.error(
        modo === "criar" ? "Erro ao cadastrar unidade." : "Erro ao editar unidade."
      );
    },
  });

  // Handler de envio do formulário
  const handleSubmit = (data: FormData) => {
    // Validação básica (extra ao react-hook-form)
    if (!data.nome || !data.cidade || !data.tipo) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    mutation.mutate(data); // Dispara a mutação (API)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Campo: Nome da Unidade */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Nome da Unidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Filial São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Cidade */}
        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Tipo de Unidade (Select com 3 opções) */}
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Tipo de Unidade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RESIDENCIAL">Residencial</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                  <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botões principais (Cadastrar/Editar e Cancelar) */}
        <div className="flex justify-between gap-2">
          <Button
            type="submit"
            className="w-full bg-[#D8282C] text-white hover:bg-[#b91d23]"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? modo === "criar"
                ? "Cadastrando..."
                : "Salvando alterações..."
              : modo === "criar"
              ? "Cadastrar Unidade"
              : "Salvar Alterações"}
          </Button>

          {/* Botão de cancelar (visível apenas em modo de edição) */}
          {modo === "editar" && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={aoFinalizar}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}


/*
O componente FormularioUnidade gerencia a entrada e edição de dados das unidades consumidoras. 
Ele atua como um formulário dinâmico e reutilizável, adaptando-se ao modo "criar" ou "editar", com preenchimento automático de campos, integração direta com a API e feedback visual para o usuário. 
Ele é essencial para o fluxo CRUD de unidades no SGCE, garantindo consistência e usabilidade no gerenciamento dos dados principais do sistema.
*/