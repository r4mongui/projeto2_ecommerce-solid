import { injectable, inject } from 'inversify';
import { TYPES } from '../container/types';
import { ErroAplicacao } from '../erros/ErroAplicacao';
import { FabricaProduto } from '../dominio/FabricaProduto';
import { DadosPagamento } from '../pagamentos/IMetodoPagamento';
import { IFabricaMetodoPagamento } from '../pagamentos/IFabricaMetodoPagamento';
import { IRepositorioPedido } from '../repositorios/IRepositorioPedido';
import { IServicoNotificacao } from './IServicoNotificacao';

export interface ItemPedidoEntrada {
  idProduto: number;
  quantidade: number;
}

export interface EntradaProcessamentoPedido {
  cliente: string;
  itens: ItemPedidoEntrada[];
  metodoPagamento: string;
  dadosPagamento?: DadosPagamento;
}

export interface ResultadoProcessamentoPedido {
  idPedido: number;
  valorTotal: number;
  visualizacaoEmail: string | null;
}

@injectable()
export class ServicoPedido {
  constructor(
    @inject(TYPES.OrderRepository) private readonly repositorioPedido: IRepositorioPedido,
    @inject(TYPES.PaymentMethodRegistry) private readonly fabricaMetodoPagamento: IFabricaMetodoPagamento,
    @inject(TYPES.NotificationService) private readonly servicoNotificacao: IServicoNotificacao,
  ) {}

  async processar(entrada: EntradaProcessamentoPedido): Promise<ResultadoProcessamentoPedido> {
    this.validarEntrada(entrada);

    let valorTotal = 0;
    const detalhesProdutos: Array<{
      id: number;
      nome: string;
      tipo: string;
      preco: number;
      quantidade: number;
      frete: number;
    }> = [];

    for (const item of entrada.itens) {
      const dadosProduto = await this.repositorioPedido.buscarProdutoPorId(item.idProduto);

      if (!dadosProduto) {
        throw new ErroAplicacao(`Produto ${item.idProduto} não encontrado`);
      }

      const produto = FabricaProduto.criarProduto(dadosProduto);
      const frete = produto.calcularFrete();

      valorTotal += produto.preco * item.quantidade + frete;
      detalhesProdutos.push({
        id: produto.id,
        nome: produto.nome,
        tipo: produto.tipo,
        preco: produto.preco,
        quantidade: item.quantidade,
        frete,
      });
    }

    const metodoPagamento = this.fabricaMetodoPagamento.obter(entrada.metodoPagamento);
    await metodoPagamento.processar(entrada.dadosPagamento ?? {});

    const pedido = await this.repositorioPedido.criarPedido({
      cliente: entrada.cliente,
      itens: JSON.stringify(detalhesProdutos),
      total: valorTotal,
      situacao: 'confirmado',
    });

    const visualizacaoEmail = await this.servicoNotificacao.enviarConfirmacaoPedido({
      idPedido: pedido.id,
      cliente: entrada.cliente,
      valorTotal,
      nomesProdutos: detalhesProdutos.map((produto) => produto.nome),
    });

    return {
      idPedido: pedido.id,
      valorTotal,
      visualizacaoEmail,
    };
  }

  private validarEntrada(entrada: EntradaProcessamentoPedido): void {
    if (!entrada.cliente || typeof entrada.cliente !== 'string') {
      throw new ErroAplicacao('Cliente não informado');
    }

    if (!Array.isArray(entrada.itens) || entrada.itens.length === 0) {
      throw new ErroAplicacao('Carrinho vazio');
    }

    for (const item of entrada.itens) {
      if (!Number.isInteger(item.idProduto) || !Number.isInteger(item.quantidade) || item.quantidade <= 0) {
        throw new ErroAplicacao('Item do pedido inválido');
      }
    }

    if (!entrada.metodoPagamento) {
      throw new ErroAplicacao('Método de pagamento não informado');
    }
  }
}
