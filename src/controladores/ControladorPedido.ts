import { injectable, inject } from 'inversify';
import { TYPES } from '../container/types';
import { Request, Response } from 'express';
import { ErroAplicacao } from '../erros/ErroAplicacao';
import registrador from '../utilitarios/registrador';
import type { ServicoPedido } from '../servicos/ServicoPedido';

@injectable()
export class OrderController {
  constructor(@inject(TYPES.OrderService) private readonly servicoPedido: ServicoPedido) {}

  processOrder = async (req: Request, res: Response) => {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body ?? {};
      const resultado = await this.servicoPedido.processar({
        cliente: customer,
        itens: Array.isArray(items) ? items.map(item => ({ idProduto: item.productId, quantidade: item.quantity })) : items,
        metodoPagamento: ({ credit_card: 'cartao_credito', debit_card: 'cartao_debito', pix: 'pix' } as Record<string, string>)[paymentMethod] ?? paymentMethod,
        dadosPagamento: { ...paymentDetails, numeroCartao: paymentDetails?.cardNumber },
      });
      return res.json({ message: 'Pedido processado com sucesso', orderId: resultado.idPedido, total: resultado.valorTotal, emailPreview: resultado.visualizacaoEmail });
    } catch (erro: unknown) {
      if (erro instanceof ErroAplicacao) return res.status(erro.codigoStatus).json({ error: erro.message });
      registrador.error(erro instanceof Error ? erro.message : 'Erro desconhecido');
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
  processarPedido = async (requisicao: Request, resposta: Response) => {
    try {
      const resultado = await this.servicoPedido.processar(requisicao.body);

      return resposta.json({
        mensagem: 'Pedido processado com sucesso',
        idPedido: resultado.idPedido,
        total: resultado.valorTotal,
        visualizacaoEmail: resultado.visualizacaoEmail,
      });
    } catch (erro: unknown) {
      if (erro instanceof ErroAplicacao) {
        registrador.warn(`Falha ao processar pedido: ${erro.message}`);
        return resposta.status(erro.codigoStatus).json({ erro: erro.message });
      }

      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      registrador.error(`Erro ao processar pedido: ${mensagem}`);
      return resposta.status(500).json({ erro: 'Erro interno' });
    }
  };
}

export { OrderController as ControladorPedido };
