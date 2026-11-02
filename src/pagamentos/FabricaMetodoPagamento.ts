import { injectable, multiInject } from 'inversify';
import { TYPES } from '../container/types';
import { ErroAplicacao } from '../erros/ErroAplicacao';
import { IMetodoPagamento } from './IMetodoPagamento';
import { IFabricaMetodoPagamento } from './IFabricaMetodoPagamento';

@injectable()
export class PaymentMethodRegistry implements IFabricaMetodoPagamento {
  private readonly metodos = new Map<string, IMetodoPagamento>();

  constructor(@multiInject(TYPES.PaymentMethod) metodosPagamento: IMetodoPagamento[]) {
    metodosPagamento.forEach((metodo) => this.metodos.set(metodo.nome, metodo));
  }

  obter(nomeMetodo: string): IMetodoPagamento {
    const metodoPagamento = this.metodos.get(nomeMetodo);

    if (!metodoPagamento) {
      throw new ErroAplicacao('Método de pagamento não suportado');
    }

    return metodoPagamento;
  }
}

export { PaymentMethodRegistry as FabricaMetodoPagamento };
