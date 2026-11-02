import { ErroAplicacao } from '../erros/ErroAplicacao';
import { ProdutoDigital } from './ProdutoDigital';
import { Produto } from './IProduto';
import { ProdutoFisico } from './ProdutoFisico';

export interface DadosProduto {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
}

export class FabricaProduto {
  static criarProduto(dados: DadosProduto): Produto {
    switch (dados.tipo) {
      case 'fisico':
        return new ProdutoFisico(dados.id, dados.nome, dados.preco);
      case 'digital':
        return new ProdutoDigital(dados.id, dados.nome, dados.preco);
      default:
        throw new ErroAplicacao(`Tipo de produto não suportado: ${dados.tipo}`);
    }
  }
}
