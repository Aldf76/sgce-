import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cadastrarUnidade, editarUnidade } from "@/services/unidadeService";
import { Unidade } from "@/types/types";
import { useEffect } from "react";

// Tipagem do formulário
type FormData = {
  nome: string;
  cidade: string;
  tipo: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL";
};

type Props = {
  modo: "criar" | "editar";
  unidadeSelecionada?: Unidade | null;
  aoFinalizar?: () => void;
};

export function FormularioUnidade({ modo, unidadeSelecionada, aoFinalizar }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: {
      nome: "",
      cidade: "",
      tipo: "RESIDENCIAL",
    },
  });

  // Preenche os dados se for modo edição
  useEffect(() => {
    if (modo === "editar" && unidadeSelecionada) {
      form.reset({
        nome: unidadeSelecionada.nome,
        cidade: unidadeSelecionada.cidade,
        tipo: unidadeSelecionada.tipo,
      });
    } else {
      form.reset(); // limpa para modo criar
    }
  }, [modo, unidadeSelecionada, form]);

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
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      form.reset();
      aoFinalizar?.(); // volta ao modo "criar"
    },
    onError: () => {
      toast.error(
        modo === "criar" ? "Erro ao cadastrar unidade." : "Erro ao editar unidade."
      );
    },
  });

  const handleSubmit = (data: FormData) => {
    if (!data.nome || !data.cidade || !data.tipo) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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

        {/* Botões */}
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
