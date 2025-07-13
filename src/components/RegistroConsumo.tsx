// Importações principais: bibliotecas de formulário, componentes de UI, e serviços da API
import { useForm } from "react-hook-form";
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
import { toast } from "sonner"; // Sistema de notificação usado para feedback ao usuário
import { Consumo, Unidade } from "@/types/types"; // Tipagens do sistema
import { registrarConsumo } from "@/services/consumoService.ts"; // Função que chama a API de registro
import axios from "axios";

// Props recebidas pelo componente: lista de unidades disponíveis, função opcional para recarregar dados ou adicionar consumo na lista
interface RegistroConsumoProps {
  unidades: Unidade[];
  refetchConsumos?: () => void;
  onAdicionar?: (consumo: Consumo) => boolean;
}

// Tipo do formulário usado pelo react-hook-form
type FormularioConsumoData = {
  unidadeId: string;
  dataReferencia: string;
  consumoKwh: string;
};

// Componente principal de registro de consumo
export function RegistroConsumo({
  unidades,
  refetchConsumos,
  onAdicionar,
}: RegistroConsumoProps) {
  
  // Hook para controlar o estado do formulário
  const form = useForm<FormularioConsumoData>({
    defaultValues: {
      unidadeId: "",
      dataReferencia: "",
      consumoKwh: "",
    },
  });

  // Função executada no envio do formulário
  const handleSubmit = async (data: FormularioConsumoData) => {
    // Validações básicas no front-end para garantir dados obrigatórios
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
      // Monta objeto com os dados formatados corretamente para envio à API
      const consumoBase = {
        unidadeId: Number(data.unidadeId),
        dataReferencia: data.dataReferencia,
        consumoKwh: kwh,
      };

      // Chamada à API para registrar consumo
      const consumoRegistrado = await registrarConsumo(consumoBase);

      // Se houver função externa para adicionar na lista (ex: tabela da página), ela é chamada aqui
      const sucesso = onAdicionar?.(consumoRegistrado);
      if (sucesso === false) return;

      // Feedback visual ao usuário de sucesso
      toast.success("Consumo registrado com sucesso!");

      // Limpa os campos do formulário após o envio
      form.reset();

      // Se for necessário recarregar os consumos (ex: gráfico atualizado), faz a chamada aqui
      refetchConsumos?.();

      // (Sugestão futura) Aqui pode ser inserida a chamada para buscar alertas da API e exibir se necessário

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Se a API retornou erro de validação ou regra de negócio, mostra mensagem amigável
        const msg = error.response?.data?.erro;
        if (msg) {
          toast.error(msg);
          return;
        }
      }
      // Caso genérico de erro desconhecido
      toast.error("Erro ao registrar consumo.");
    }
  }

  // Renderização do formulário
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >

        {/* Campo para seleção da unidade consumidora */}
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

        {/* Campo para seleção da data de referência do consumo */}
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

        {/* Campo numérico para entrada do consumo em kWh */}
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

        {/* Botão de envio do formulário com cores institucionais (vermelho BIP) */}
        <Button
          type="submit"
          className="w-full bg-[#D8282C] text-white hover:bg-[#b91d23]"
          disabled={unidades.length === 0}
        >
          Registrar Consumo
        </Button>

        {/* Mensagem de aviso se não houver nenhuma unidade cadastrada */}
        {unidades.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            ⚠️ Cadastre uma unidade primeiro para registrar consumo
          </p>
        )}
      </form>
    </Form>
  );
}


// ⚠️ IMPORTANTE: O bloco de retorno do componente React deve ficar fora da função handleSubmit.
// Antes, o JSX do formulário estava por engano sendo retornado dentro do handleSubmit (que é apenas o manipulador de envio).
// Isso impedia o React de renderizar qualquer coisa na tela.
// Ao mover o return do JSX para o corpo principal do componente, o formulário voltou a ser exibido corretamente.

//==========================================================================================================================//

/*
Este componente é responsável por registrar novos consumos energéticos por unidade, sendo o principal ponto de entrada de dados do sistema. 
Ele garante que o consumo seja vinculado corretamente a uma unidade existente, com validação de dados no front-end, feedback visual ao usuário e integração direta com a API. 
Além disso, serve de gatilho para atualizações posteriores de visualização (gráficos e tabelas) e poderá futuramente iniciar alertas automáticos baseados no padrão de consumo.
*/
