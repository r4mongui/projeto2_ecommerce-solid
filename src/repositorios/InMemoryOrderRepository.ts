import { injectable } from 'inversify';
import type { DadosCriacaoPedido, DadosPedido, IRepositorioPedido } from './IRepositorioPedido';
import type { DadosProduto } from '../dominio/FabricaProduto';
@injectable()
export class InMemoryOrderRepository implements IRepositorioPedido {
  readonly pedidos: DadosPedido[] = [];
  private readonly produtos: DadosProduto[] = [
    { id: 1, nome: 'O Programador Pragmático (Livro Físico)', tipo: 'fisico', preco: 100 },
    { id: 2, nome: 'Código Limpo (Livro Digital)', tipo: 'digital', preco: 50 },
  ];
  async buscarProdutoPorId(id: number): Promise<DadosProduto | null> {
    const produto = this.produtos.find(p => p.id === id);
    return produto ? { ...produto } : null;
  }
  async criarPedido(dados: DadosCriacaoPedido): Promise<DadosPedido> {
    const pedido = { ...dados, id: this.pedidos.length + 1, criadoEm: new Date() };
    this.pedidos.push(pedido);
    return { ...pedido };
  }
}
