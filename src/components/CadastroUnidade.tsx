import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cadastrarUnidade } from "@/services/unidadeService";
import { Unidade } from "@/types/types";

// Tipagem específica para o formulário (minúsculas)
type FormData = {
  nome: string;
  cidade: string;
  tipo: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL";
};

export function CadastroUnidade() {
  const form = useForm<FormData>({
    defaultValues: {
      nome: "",
      cidade: "",
      tipo: "RESIDENCIAL",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: cadastrarUnidade,
    onSuccess: () => {
      toast.success("Unidade cadastrada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao cadastrar unidade.");
    },
  });

  const handleSubmit = (data: FormData) => {
    if (!data.nome || !data.cidade || !data.tipo) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    const payload: Omit<Unidade, "id"> = {
      nome: data.nome,
      cidade: data.cidade,
      tipo: data.tipo.toUpperCase() as Unidade["tipo"], // Ex: "residencial" -> "RESIDENCIAL"
    };

    mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Unidade</FormLabel>
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
              <FormLabel>Cidade</FormLabel>
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
              <FormLabel>Tipo de Unidade</FormLabel>
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Cadastrando..." : "Cadastrar Unidade"}
        </Button>
      </form>
    </Form>
  );
}
