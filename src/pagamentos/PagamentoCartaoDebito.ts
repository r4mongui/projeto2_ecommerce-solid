import { injectable } from 'inversify';
import { ErroAplicacao } from '../erros/ErroAplicacao';
import registrador from '../utilitarios/registrador';
import { IMetodoPagamento, DadosPagamento } from './IMetodoPagamento';

@injectable()
export class PagamentoCartaoDebito implements IMetodoPagamento {
  readonly nome = 'cartao_debito';

  async processar(detalhes: DadosPagamento): Promise<void> {
    if (!detalhes.numeroCartao) {
      throw new ErroAplicacao('Dados do cartão de débito incompletos');
    }

    registrador.info(`Processando débito final ${detalhes.numeroCartao.slice(-4)}`);
  }
}
