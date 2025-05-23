
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertaConsumo } from "@/components/AlertaConsumo";
import { CadastroUnidade } from "@/components/CadastroUnidade";
import { RegistroConsumo } from "@/components/RegistroConsumo";
import { ListaUnidades } from "@/components/ListaUnidades";
import { Unidade, Consumo, Alerta } from "@/types/types";

const Index = () => {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  const adicionarUnidade = (unidade: Unidade) => {
    // Gera um ID único para a unidade
    const novaUnidade = { ...unidade, id: Date.now().toString() };
    setUnidades([...unidades, novaUnidade]);
  };

  const adicionarConsumo = (consumo: Consumo) => {
    // Verifica se já existe um registro para a mesma unidade e data
    const existeRegistro = consumos.some(
      (c) => 
        c.unidadeId === consumo.unidadeId && 
        c.dataReferencia.substring(0, 7) === consumo.dataReferencia.substring(0, 7)
    );

    if (existeRegistro) {
      alert("Já existe um registro para esta unidade neste mês!");
      return false;
    }

    const novoConsumo = { ...consumo, id: Date.now().toString() };
    setConsumos([...consumos, novoConsumo]);

    // Recalcula alertas depois de registrar um novo consumo
    calcularAlertas([...consumos, novoConsumo]);
    return true;
  };

  // Função para calcular alertas de consumo (mais de 20% acima da média dos últimos 3 meses)
  const calcularAlertas = (registrosConsumo: Consumo[]) => {
    const novosAlertas: Alerta[] = [];
    const unidadesMap = new Map();
    
    // Organiza os consumos por unidade
    registrosConsumo.forEach(consumo => {
      if (!unidadesMap.has(consumo.unidadeId)) {
        unidadesMap.set(consumo.unidadeId, []);
      }
      unidadesMap.get(consumo.unidadeId).push({
        ...consumo,
        dataReferencia: new Date(consumo.dataReferencia)
      });
    });
    
    // Para cada unidade, verifica se o último registro excede a média dos 3 últimos
    unidadesMap.forEach((consumosUnidade, unidadeId) => {
      // Organiza consumos por data (decrescente)
      const consumosOrdenados = consumosUnidade.sort((a: any, b: any) => 
        b.dataReferencia.getTime() - a.dataReferencia.getTime()
      );
      
      // Se houver pelo menos 4 registros (1 atual + 3 históricos)
      if (consumosOrdenados.length >= 4) {
        const ultimoConsumo = consumosOrdenados[0];
        
        // Calcula média dos 3 meses anteriores
        const somaTresAnteriores = consumosOrdenados
          .slice(1, 4)
          .reduce((acc: number, c: any) => acc + parseFloat(c.consumoKwh), 0);
        
        const mediaTresAnteriores = somaTresAnteriores / 3;
        
        // Se último consumo for maior que 20% da média, cria alerta
        if (parseFloat(ultimoConsumo.consumoKwh) > mediaTresAnteriores * 1.2) {
          const unidade = unidades.find(u => u.id === unidadeId);
          novosAlertas.push({
            id: Date.now().toString(),
            unidadeId,
            unidadeNome: unidade?.nome || "Unidade desconhecida",
            consumoAtual: ultimoConsumo.consumoKwh,
            mediaAnterior: mediaTresAnteriores.toFixed(2),
            percentualAumento: (((parseFloat(ultimoConsumo.consumoKwh) / mediaTresAnteriores) - 1) * 100).toFixed(2),
            dataReferencia: ultimoConsumo.dataReferencia.toISOString().split('T')[0]
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
                <CardTitle>Cadastro de Unidade</CardTitle>
                <CardDescription>Adicione uma nova unidade consumidora</CardDescription>
              </CardHeader>
              <CardContent>
                <CadastroUnidade onAdicionar={adicionarUnidade} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lista de Unidades</CardTitle>
                <CardDescription>Unidades consumidoras cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <ListaUnidades unidades={unidades} />
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
              <RegistroConsumo unidades={unidades} onAdicionar={adicionarConsumo} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Consumo</CardTitle>
              <CardDescription>Unidades com consumo 20% acima da média dos últimos 3 meses</CardDescription>
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
