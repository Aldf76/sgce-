import { useForm } from "react-hook-form";
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
import { Consumo, Unidade } from "@/types/types";
import { registrarConsumo } from "@/services/consumoService.ts";

interface RegistroConsumoProps {
  unidades: Unidade[];
  refetchConsumos?: () => void;
  onAdicionar?: (consumo: Consumo) => boolean;
}

export function RegistroConsumo({
  unidades,
  refetchConsumos,
  onAdicionar,
}: RegistroConsumoProps) {
  const form = useForm({
    defaultValues: {
      unidadeId: "",
      dataReferencia: "",
      consumoKwh: "",
    },
  });

  const handleSubmit = async (data: any) => {
    if (!data.unidadeId) {
      toast.error("Selecione uma unidade");
      return;
    }

    if (!data.dataReferencia) {
      toast.error("Informe a data de referência");
      return;
    }

    const kwh = parseFloat(data.consumoKwh);
    if (isNaN(kwh) || kwh <= 0) {
      toast.error("Informe um valor de consumo válido");
      return;
    }

    try {
      const consumoBase = {
        unidadeId: Number(data.unidadeId),
        dataReferencia: data.dataReferencia,
        consumoKwh: kwh,
      };

      const consumoRegistrado = await registrarConsumo(consumoBase);

      const sucesso = onAdicionar?.(consumoRegistrado);
      if (sucesso === false) return;

      toast.success("Consumo registrado com sucesso!");
      form.reset();
      refetchConsumos?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.erro || "Erro ao registrar consumo.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        <FormField
          control={form.control}
          name="unidadeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Unidade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade.id} value={String(unidade.id)}>
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
              <FormLabel className="text-sm font-semibold">Data de Referência</FormLabel>
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
              <FormLabel className="text-sm font-semibold">Consumo (kWh)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 250.5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#D8282C] text-white hover:bg-[#b91d23]"
          disabled={unidades.length === 0}
        >
          Registrar Consumo
        </Button>

        {unidades.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            ⚠️ Cadastre uma unidade primeiro para registrar consumo
          </p>
        )}
      </form>
    </Form>
  );
}
