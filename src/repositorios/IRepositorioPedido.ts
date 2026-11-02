import { DadosProduto } from '../dominio/FabricaProduto';

export interface DadosCriacaoPedido {
  cliente: string;
  itens: string;
  total: number;
  situacao: string;
}

export interface DadosPedido extends DadosCriacaoPedido {
  id: number;
  criadoEm: Date;
}

export interface IRepositorioPedido {
  buscarProdutoPorId(id: number): Promise<DadosProduto | null>;
  criarPedido(dados: DadosCriacaoPedido): Promise<DadosPedido>;
}
