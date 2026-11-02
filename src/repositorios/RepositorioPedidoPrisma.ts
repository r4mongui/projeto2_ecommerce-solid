import { injectable, inject } from 'inversify';
import { TYPES } from '../container/types';
import type { PrismaClient } from '@prisma/client';
import {
  DadosCriacaoPedido,
  IRepositorioPedido,
  DadosPedido,
} from './IRepositorioPedido';
import { DadosProduto } from '../dominio/FabricaProduto';

@injectable()
export class PrismaOrderRepository implements IRepositorioPedido {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  async buscarProdutoPorId(id: number): Promise<DadosProduto | null> {
    return this.prisma.produto.findUnique({ where: { id } });
  }

  async criarPedido(dados: DadosCriacaoPedido): Promise<DadosPedido> {
    return this.prisma.pedido.create({ data: dados });
  }
}

export { PrismaOrderRepository as RepositorioPedidoPrisma };
