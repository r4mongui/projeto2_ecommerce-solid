export interface DadosPagamento {
  numeroCartao?: string;
  cvv?: string;
  chavePix?: string;
  [key: string]: unknown;
}

export interface IMetodoPagamento {
  readonly nome: string;
  processar(detalhes: DadosPagamento): Promise<void>;
}
