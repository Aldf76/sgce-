
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Unidade } from "@/types/types";

interface CadastroUnidadeProps {
  onAdicionar: (unidade: Unidade) => void;
}

export function CadastroUnidade({ onAdicionar }: CadastroUnidadeProps) {
  const form = useForm({
    defaultValues: {
      nome: "",
      cidade: "",
      tipo: "" as "residencial" | "comercial" | "industrial",
    },
  });

  const handleSubmit = (data: Omit<Unidade, "id">) => {
    // Validação simples
    if (!data.nome || !data.cidade || !data.tipo) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    onAdicionar(data as Unidade);
    toast.success("Unidade cadastrada com sucesso!");
    form.reset();
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
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Cadastrar Unidade</Button>
      </form>
    </Form>
  );
}
