import { Produto } from './IProduto';

export class ProdutoDigital implements Produto {
  readonly tipo = 'digital';

  constructor(
    public readonly id: number,
    public readonly nome: string,
    public readonly preco: number,
  ) {}

  calcularFrete(): number {
    return 0;
  }
}
