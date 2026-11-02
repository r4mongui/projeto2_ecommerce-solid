import { injectable } from 'inversify';
import registrador from '../utilitarios/registrador';
import { IMetodoPagamento, DadosPagamento } from './IMetodoPagamento';

@injectable()
export class PagamentoPix implements IMetodoPagamento {
  readonly nome = 'pix';

  async processar(detalhes: DadosPagamento): Promise<void> {
    const descricao = detalhes.chavePix ? ` para a chave ${detalhes.chavePix}` : '';
    registrador.info(`Processando pagamento via Pix${descricao}`);
  }
}
