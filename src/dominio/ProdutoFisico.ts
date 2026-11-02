import { Produto } from './IProduto';

export class ProdutoFisico implements Produto {
  readonly tipo = 'fisico';

  constructor(
    public readonly id: number,
    public readonly nome: string,
    public readonly preco: number,
  ) {}

  calcularFrete(): number {
    return 10;
  }
}
