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
import { AlertaConsumo } from "@/components/AlertaConsumo";
import { FormularioUnidade } from "@/components/FormularioUnidade";
import { RegistroConsumo } from "@/components/RegistroConsumo";
import { ListaUnidades } from "@/components/ListaUnidades";
import { Unidade, Consumo, Alerta } from "@/types/types";

const Index = () => {
  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades"],
    queryFn: listarUnidades,
  });

  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);

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

    const novoConsumo = { ...consumo, id: Date.now() }; // ✅
    setConsumos([...consumos, novoConsumo]);
    calcularAlertas([...consumos, novoConsumo]);
    return true;
  };

  const calcularAlertas = (registrosConsumo: Consumo[]) => {
    const novosAlertas: Alerta[] = [];
    const unidadesMap = new Map();

    registrosConsumo.forEach((consumo) => {
      if (!unidadesMap.has(consumo.unidadeId)) {
        unidadesMap.set(consumo.unidadeId, []);
      }
      unidadesMap.get(consumo.unidadeId).push({
        ...consumo,
        dataReferencia: new Date(consumo.dataReferencia),
      });
    });

    unidadesMap.forEach((consumosUnidade, unidadeId) => {
      const consumosOrdenados = consumosUnidade.sort(
        (a: any, b: any) => b.dataReferencia.getTime() - a.dataReferencia.getTime()
      );

      if (consumosOrdenados.length >= 4) {
        const ultimoConsumo = consumosOrdenados[0];
        const somaTresAnteriores = consumosOrdenados
          .slice(1, 4)
          .reduce((acc: number, c: any) => acc + parseFloat(c.consumoKwh), 0);

        const mediaTresAnteriores = somaTresAnteriores / 3;

        if (parseFloat(ultimoConsumo.consumoKwh) > mediaTresAnteriores * 1.2) {
          const unidade = unidades.find((u) => u.id === unidadeId);
          novosAlertas.push({
            id: Date.now().toString(),
            unidadeId,
            unidadeNome: unidade?.nome || "Unidade desconhecida",
            consumoAtual: ultimoConsumo.consumoKwh,
            mediaAnterior: mediaTresAnteriores.toFixed(2),
            percentualAumento: (
              ((parseFloat(ultimoConsumo.consumoKwh) / mediaTresAnteriores - 1) * 100)
            ).toFixed(2),
            dataReferencia: ultimoConsumo.dataReferencia.toISOString().split("T")[0],
          });
        }
      }
    });

    setAlertas(novosAlertas);
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
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
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

        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Consumo</CardTitle>
              <CardDescription>
                Unidades com consumo 20% acima da média dos últimos 3 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertaConsumo alertas={alertas} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
