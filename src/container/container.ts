import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from './types';
import { ControladorPedido as OrderController } from '../controladores/ControladorPedido';
import { ServicoPedido } from '../servicos/ServicoPedido';
import { ServicoNotificacao } from '../servicos/ServicoNotificacao';
import { RepositorioPedidoPrisma as PrismaOrderRepository } from '../repositorios/RepositorioPedidoPrisma';
import { InMemoryOrderRepository } from '../repositorios/InMemoryOrderRepository';
import { ProvedorEmailEthereal as EtherealMailProvider } from '../provedores/ProvedorEmailEthereal';
import { ConsoleMailProvider } from '../provedores/ConsoleMailProvider';
import { FabricaMetodoPagamento as PaymentMethodRegistry } from '../pagamentos/FabricaMetodoPagamento';
import { PagamentoCartaoCredito } from '../pagamentos/PagamentoCartaoCredito';
import { PagamentoCartaoDebito } from '../pagamentos/PagamentoCartaoDebito';
import { PagamentoPix } from '../pagamentos/PagamentoPix';
export const container = new Container();
const environment = process.env.APP_ENV ?? 'dev';
if (environment !== 'dev' && environment !== 'test') throw new Error('APP_ENV deve ser dev ou test');
if (environment === 'test') {
  container.bind(TYPES.OrderRepository).to(InMemoryOrderRepository).inSingletonScope();
  container.bind(TYPES.MailProvider).to(ConsoleMailProvider).inSingletonScope();
} else {
  container.bind(TYPES.PrismaClient).toDynamicValue(() => new PrismaClient()).inSingletonScope();
  container.bind(TYPES.OrderRepository).to(PrismaOrderRepository).inSingletonScope();
  container.bind(TYPES.MailProvider).to(EtherealMailProvider).inSingletonScope();
}
container.bind(TYPES.PaymentMethod).to(PagamentoCartaoCredito);
container.bind(TYPES.PaymentMethod).to(PagamentoCartaoDebito);
container.bind(TYPES.PaymentMethod).to(PagamentoPix);
container.bind(TYPES.PaymentMethodRegistry).to(PaymentMethodRegistry);
container.bind(TYPES.NotificationService).to(ServicoNotificacao);
container.bind(TYPES.OrderService).to(ServicoPedido);
container.bind(TYPES.OrderController).to(OrderController);
