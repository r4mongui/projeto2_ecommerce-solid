export interface DadosNotificacaoPedido {
  idPedido: number;
  cliente: string;
  valorTotal: number;
  nomesProdutos: string[];
}

export interface IServicoNotificacao {
  enviarConfirmacaoPedido(dados: DadosNotificacaoPedido): Promise<string | null>;
}
