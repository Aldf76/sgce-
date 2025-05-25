import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarUnidades } from "@/services/unidadeService";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FormularioUnidade } from "@/components/FormularioUnidade";
import { RegistroConsumo } from "@/components/RegistroConsumo";
import { ListaUnidades } from "@/components/ListaUnidades";
import { Unidade, Consumo } from "@/types/types";
import { VisualizacaoConsumo } from "@/components/VisualizacaoConsumo"; // ✅ NOVO COMPONENTE

const Index = () => {
  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [modoFormulario, setModoFormulario] = useState<"criar" | "editar">("criar");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null);

  const adicionarConsumo = (consumo: Consumo) => {
    const existeRegistro = consumos.some(
      (c) =>
        c.unidadeId === consumo.unidadeId &&
        c.dataReferencia.substring(0, 7) === consumo.dataReferencia.substring(0, 7)
    );

    if (existeRegistro) {
      alert("Já existe um registro para esta unidade neste mês!");
      return false;
    }

    const novoConsumo = { ...consumo, id: Date.now() };
    setConsumos([...consumos, novoConsumo]);
    return true;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#003366]">
        Sistema de Gestão de Consumo de Energia
      </h1>

      <Tabs defaultValue="unidades" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="consumo">Registro de Consumo</TabsTrigger>
          <TabsTrigger value="visualizacao">Visualização</TabsTrigger> {/* ✅ Nova aba */}
        </TabsList>

        <TabsContent value="unidades">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  {modoFormulario === "editar" ? "Editar Unidade" : "Cadastro de Unidade"}
                </CardTitle>
                <CardDescription>
                  {modoFormulario === "editar"
                    ? "Edite os dados da unidade selecionada"
                    : "Adicione uma nova unidade consumidora"}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              <RegistroConsumo
                unidades={unidades}
                onAdicionar={adicionarConsumo}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizacao"> {/* ✅ Substitui 'alertas' */}
          <Card>
            <CardHeader>
              <CardTitle>Visualização de Consumos</CardTitle>
              <CardDescription>
                Veja o histórico de consumo por unidade com gráfico e tabela.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisualizacaoConsumo /> {/* ✅ Novo componente */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
