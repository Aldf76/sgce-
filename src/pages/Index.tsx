// Hook de estado do React
import { useState } from "react";

// Hook do React Query para buscar dados da API de forma reativa e com cache automático
import { useQuery } from "@tanstack/react-query";

// Função que acessa o back-end para listar as unidades cadastradas
import { listarUnidades } from "@/services/unidadeService";

// Cabeçalho padrão do sistema (título e logo centralizado)
import { Header } from "@/components/Header";


// Estrutura de cartões visuais com título, descrição e conteúdo
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Componentes de abas para separar funcionalidades do sistema
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Componentes do sistema que compõem o conteúdo das abas
import { FormularioUnidade } from "@/components/FormularioUnidade";
import { RegistroConsumo } from "@/components/RegistroConsumo";
import { ListaUnidades } from "@/components/ListaUnidades";
import { VisualizacaoConsumo } from "@/components/VisualizacaoConsumo";

// Tipos auxiliares para padronizar os dados
import { Unidade, Consumo } from "@/types/types";

const Index = () => {
  // Busca dados das unidades cadastradas com React Query
  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  // Lista local de consumos registrados temporariamente (sem salvar em banco)
  const [consumos, setConsumos] = useState<Consumo[]>([]);

  // Controla se o formulário está em modo "criar" ou "editar"
  const [modoFormulario, setModoFormulario] = useState<"criar" | "editar">("criar");

  // Guarda a unidade atualmente selecionada para edição
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null);


  const adicionarConsumo = (consumo: Consumo) => {
    // Verifica se já existe registro de consumo para mesma unidade e mesmo mês
    const existeRegistro = consumos.some(
      (c) =>
        c.unidadeId === consumo.unidadeId &&
        c.dataReferencia.substring(0, 7) === consumo.dataReferencia.substring(0, 7)
    );

    if (existeRegistro) {
      alert("Já existe um registro para esta unidade neste mês!");
      return false;
    }

    // Se não houver duplicidade, adiciona o novo registro à lista local
    const novoConsumo = { ...consumo, id: Date.now() };
    setConsumos([...consumos, novoConsumo]);
    return true;
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Header /> {/* Cabeçalho padrão da aplicação */}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs organizam a navegação entre seções funcionais do sistema */}
        <Tabs defaultValue="unidades" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="unidades">Unidades</TabsTrigger>
            <TabsTrigger value="consumo">Registro de Consumo</TabsTrigger>
            <TabsTrigger value="visualizacao">Visualização</TabsTrigger>
          </TabsList>


          <TabsContent value="unidades">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {/* Muda o título conforme o modo de uso do formulário */}
                    {modoFormulario === "editar" ? "Editar Unidade" : "Cadastro de Unidade"}
                  </CardTitle>
                  <CardDescription>
                    {modoFormulario === "editar"
                      ? "Edite os dados da unidade selecionada"
                      : "Adicione uma nova unidade consumidora"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Formulário de criação/edição de unidade */}
                  <FormularioUnidade
                    modo={modoFormulario}
                    unidadeSelecionada={unidadeSelecionada}
                    aoFinalizar={() => {
                      setModoFormulario("criar");
                      setUnidadeSelecionada(null);
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Unidades</CardTitle>
                  <CardDescription>Unidades consumidoras cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Lista de unidades cadastradas, com opção de editar */}
                  <ListaUnidades
                    onEditar={(unidade) => {
                      setUnidadeSelecionada(unidade);
                      setModoFormulario("editar");
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="consumo">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Consumo</CardTitle>
                <CardDescription>Adicione leituras de consumo mensal</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Formulário para registrar consumo mensal de uma unidade */}
                <RegistroConsumo
                  unidades={unidades}
                  onAdicionar={adicionarConsumo}
                />
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="visualizacao">
            <Card>
              <CardHeader>
                <CardTitle>Visualização de Consumos</CardTitle>
                <CardDescription>
                  Veja o histórico de consumo por unidade com gráfico e tabela.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Componente que exibe os dados em formato visual e analítico */}
                <VisualizacaoConsumo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
