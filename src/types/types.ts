
// Interface para unidade consumidora
export interface Unidade {
  id?: number;
  nome: string;
  cidade: string;
  tipo: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL";
  ativo?: boolean;
}

// Interface para tipar os dados do back-end
export interface Pagina<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}



// Interface para registro de consumo
export interface Consumo {
  id: number;
  unidadeId: number;
  dataReferencia: string;
  consumoKwh: number;
  nomeUnidade: string;
  cidade: string;
}

export interface ConsumoDTO {
  unidadeId: number;
  dataReferencia: string;
  consumoKwh: number;
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
