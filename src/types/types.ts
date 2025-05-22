
// Interface para unidade consumidora
export interface Unidade {
  id: string;
  nome: string;
  cidade: string;
  tipo: 'residencial' | 'comercial' | 'industrial';
}

// Interface para registro de consumo
export interface Consumo {
  id: string;
  unidadeId: string;
  dataReferencia: string; // formato YYYY-MM-DD
  consumoKwh: string; // armazenado como string, mas convertido para número quando necessário
}

// Interface para alertas de consumo
export interface Alerta {
  id: string;
  unidadeId: string;
  unidadeNome: string;
  consumoAtual: string;
  mediaAnterior: string;
  percentualAumento: string;
  dataReferencia: string;
}
