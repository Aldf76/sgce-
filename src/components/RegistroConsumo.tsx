
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Consumo, Unidade } from "@/types/types";

interface RegistroConsumoProps {
  unidades: Unidade[];
  onAdicionar: (consumo: Consumo) => boolean;
}

export function RegistroConsumo({ unidades, onAdicionar }: RegistroConsumoProps) {
  const form = useForm({
    defaultValues: {
      unidadeId: "",
      dataReferencia: "",
      consumoKwh: "",
    },
  });

  const handleSubmit = (data: Omit<Consumo, "id">) => {
    // Validação simples
    if (!data.unidadeId) {
      toast.error("Selecione uma unidade");
      return;
    }
    if (!data.dataReferencia) {
      toast.error("Selecione uma data de referência");
      return;
    }
    if (!data.consumoKwh || isNaN(parseFloat(data.consumoKwh)) || parseFloat(data.consumoKwh) <= 0) {
      toast.error("Informe um consumo válido");
      return;
    }

    const sucesso = onAdicionar(data as Consumo);
    if (sucesso) {
      toast.success("Consumo registrado com sucesso!");
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="unidadeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id}>
                      {unidade.nome} ({unidade.cidade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataReferencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mês de Referência</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consumoKwh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consumo (kWh)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 320.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={unidades.length === 0}
        >
          Registrar Consumo
        </Button>
        
        {unidades.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Cadastre uma unidade primeiro para registrar consumo
          </p>
        )}
      </form>
    </Form>
  );
}
