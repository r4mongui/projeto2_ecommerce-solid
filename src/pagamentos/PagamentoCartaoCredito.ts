import { injectable } from 'inversify';
import { ErroAplicacao } from '../erros/ErroAplicacao';
import registrador from '../utilitarios/registrador';
import { IMetodoPagamento, DadosPagamento } from './IMetodoPagamento';

@injectable()
export class PagamentoCartaoCredito implements IMetodoPagamento {
  readonly nome = 'cartao_credito';

  async processar(detalhes: DadosPagamento): Promise<void> {
    if (!detalhes.numeroCartao || !detalhes.cvv) {
      throw new ErroAplicacao('Dados do cartão de crédito incompletos');
    }

    if (detalhes.cvv === '000') {
      throw new ErroAplicacao('Cartão recusado');
    }

    registrador.info(`Processando cartão final ${detalhes.numeroCartao.slice(-4)}`);
  }
}
