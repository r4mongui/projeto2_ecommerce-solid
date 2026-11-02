export interface Produto {
  readonly id: number;
  readonly nome: string;
  readonly tipo: string;
  readonly preco: number;

  calcularFrete(): number;
}
