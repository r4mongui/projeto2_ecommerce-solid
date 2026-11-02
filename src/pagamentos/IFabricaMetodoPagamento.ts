import { IMetodoPagamento } from './IMetodoPagamento';

export interface IFabricaMetodoPagamento {
  obter(nomeMetodo: string): IMetodoPagamento;
}
