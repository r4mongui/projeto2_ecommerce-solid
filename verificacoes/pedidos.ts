import 'reflect-metadata';
import 'dotenv/config';
import assert from 'node:assert/strict';
import net from 'node:net';
import type { IRepositorioPedido } from '../src/repositorios/IRepositorioPedido';
import type { IProvedorEmail } from '../src/provedores/IProvedorEmail';

async function main() {
  // O modo padrão deste comando é test; dev também pode ser verificado explicitamente.
  process.env.APP_ENV ??= 'test';
  const offline = process.env.APP_ENV === 'test';
  const originalConnect = net.Socket.prototype.connect;
  if (offline) {
    net.Socket.prototype.connect = function (this: net.Socket, ...args: any[]): any {
      const first = args[0];
      const host = typeof first === 'object' ? first.host : typeof args[1] === 'string' ? args[1] : undefined;
      if (host && !['127.0.0.1', 'localhost', '::1'].includes(host)) throw new Error('Rede externa bloqueada no teste: ' + host);
      return originalConnect.apply(this, args as any);
    } as typeof originalConnect;
  }
  const { container } = await import('../src/container/container');
  const { TYPES } = await import('../src/container/types');
  const repository = container.get<IRepositorioPedido>(TYPES.OrderRepository);
  const provider = container.get<IProvedorEmail>(TYPES.MailProvider);
  assert.equal(repository, container.get(TYPES.OrderRepository));
  assert.equal(provider, container.get(TYPES.MailProvider));
  assert.equal(container.getAll(TYPES.PaymentMethod).length, 3);
  assert.equal(repository.constructor.name, offline ? 'InMemoryOrderRepository' : 'PrismaOrderRepository');
  assert.equal(provider.constructor.name, offline ? 'ConsoleMailProvider' : 'EtherealMailProvider');
  // Em dev verifica SQLite real; só SMTP é substituído nesta verificação automática.
  if (!offline) await container.rebind(TYPES.MailProvider).then(binding => binding.toConstantValue({ enviarEmail: async () => ({ urlVisualizacao: null }) }));
  const { default: app } = await import('../src/app');
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  try {
    const address = server.address();
    assert(address && typeof address !== 'string');
    const url = 'http://127.0.0.1:' + address.port;
    const base = { customer: 'teste@example.com', items: [{ productId: 1, quantity: 1 }], paymentMethod: 'credit_card', paymentDetails: { cardNumber: '1234567812345678', cvv: '123' } };
    async function post(body: unknown, route = '/orders') {
      const response = await fetch(url + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return { status: response.status, body: await response.json() as any };
    }
    const ids = [];
    for (const paymentMethod of ['credit_card', 'debit_card', 'pix']) {
      for (const [productId, total] of [[1, 110], [2, 50]]) {
        const result = await post({ ...base, paymentMethod, items: [{ productId, quantity: 1 }] });
        assert.equal(result.status, 200, JSON.stringify(result.body));
        assert.equal(result.body.total, total);
        ids.push(result.body.orderId);
        if (!offline) {
          const row = await container.get<any>(TYPES.PrismaClient).pedido.findUniqueOrThrow({ where: { id: result.body.orderId } });
          assert.equal(row.total, total);
          assert.equal(row.situacao, 'confirmado');
          assert.equal(JSON.parse(row.itens)[0].id, productId);
        }
      }
    }
    assert.equal(new Set(ids).size, 6);
    if (offline) assert.equal((repository as any).pedidos.length, 6);
    const legacy = await post({ cliente: base.customer, itens: [{ idProduto: 1, quantidade: 1 }], metodoPagamento: 'pix' }, '/pedidos');
    assert.equal(legacy.status, 200); assert.equal(legacy.body.total, 110);
    for (const body of [
      { ...base, items: [] }, { ...base, items: [{ productId: 1, quantity: 0 }] },
      { ...base, items: [{ productId: 99999, quantity: 1 }] }, { ...base, paymentMethod: 'inexistente' },
      { ...base, paymentDetails: { cardNumber: '1234', cvv: '000' } },
    ]) assert.equal((await post(body)).status, 400);
    console.log('OK: ' + process.env.APP_ENV + ', seis combinações produto/pagamento, singleton, persistência, rota legada e cinco erros.');
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    if (!offline) await (container.get<any>(TYPES.PrismaClient)).$disconnect();
    net.Socket.prototype.connect = originalConnect;
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
