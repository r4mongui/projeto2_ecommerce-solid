# E-commerce SOLID — Projeto 2

Evolução do [Projeto 1](https://github.com/r4mongui/projeto1_ecommerce-solid), com InversifyJS 7 e injeção explícita por Symbols. As regras de produto físico/digital, validações e pagamentos foram preservadas.

## Como rodar

Use Node.js 20.19+ ou 22.12+ e npm. Instalar dependências requer internet; depois disso o modo test executa offline.

### Preparação

```bash
npm install
```

Copie `.env.example` para `.env` (PowerShell: `Copy-Item .env.example .env`; CMD: `copy .env.example .env`; Bash: `cp .env.example .env`).

### Modo dev

No `.env`, use `APP_ENV=dev` e `PORT=3000`:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run build
npm run dev
```

Usa SQLite local via PrismaOrderRepository e EtherealMailProvider. Enviar e-mail exige internet/SMTP e retorna uma URL de visualização. As formas de pagamento são simulações locais, sem cobrança real.

### Modo test (offline)

Altere somente `APP_ENV=test` no mesmo `.env`:

```bash
npm run dev
```

Usa ConsoleMailProvider e InMemoryOrderRepository. O catálogo inclui os produtos 1 e 2; pedidos ficam em um array e são perdidos ao reiniciar. Não precisa migrar/popular banco nem conectar a SMTP. O e-mail aparece no terminal e `emailPreview` é `null`.

Para executar o JavaScript compilado em qualquer modo:

```bash
npm run build
npm start
```

## Testar a API

A API atende `POST http://localhost:3000/orders`. Abrir a raiz no navegador faz GET e retorna Cannot GET /.

No PowerShell:

```powershell
$pedido = @{
  customer = 'teste@example.com'
  items = @(@{ productId = 1; quantity = 1 })
  paymentMethod = 'credit_card'
  paymentDetails = @{ cardNumber = '1234567812345678'; cvv = '123' }
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri http://localhost:3000/orders -ContentType 'application/json' -Body $pedido
```

No CMD:

```bat
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d "{\"customer\":\"teste@example.com\",\"items\":[{\"productId\":1,\"quantity\":1}],\"paymentMethod\":\"credit_card\",\"paymentDetails\":{\"cardNumber\":\"1234567812345678\",\"cvv\":\"123\"}}"
```

Produto 1: R$ 100 + R$ 10 de frete = **R$ 110** para uma unidade. Produto 2: **R$ 50**, sem frete. Pagamentos: `credit_card`, `debit_card` e `pix`. Crédito exige cardNumber/cvv, débito exige cardNumber e Pix aceita paymentDetails vazio. CVV 000 simula recusa.

A rota original `POST /pedidos` continua aceitando `cliente`, `itens[{idProduto, quantidade}]`, `metodoPagamento` (cartao_credito/cartao_debito/pix) e `dadosPagamento.numeroCartao`.

## Injeção de dependências

- `src/server.ts` carrega reflect-metadata e dotenv/config antes da aplicação.
- `src/container/types.ts` define os Symbols.
- `src/container/container.ts` é o único ponto de composição: escolhe APP_ENV, importa implementações e registra dependências. As classes OrderController, PaymentMethodRegistry, PrismaOrderRepository e EtherealMailProvider mantêm aliases em português para compatibilidade com o Projeto 1.
- Classes registradas têm @injectable(); parâmetros recebem @inject(TYPES.X), inclusive o serviço concreto do controller. O registro de pagamentos recebe @multiInject(TYPES.PaymentMethod).
- Repositório, provider e cliente Prisma têm escopo singleton. O Prisma só é instanciado em dev.
- `src/app.ts` resolve o controller e registra as rotas, sem montar services/repositórios.
- Services e controllers não escolhem ambiente nem importam infraestrutura concreta. A fábrica de produtos do domínio mantém as regras de frete do Projeto 1.

## Verificações

```bash
npm run build
npm test
```

Sem APP_ENV definido, npm test usa test. Se houver `.env`, seu APP_ENV será respeitado. Para garantir offline no PowerShell: `$env:APP_ENV='test'; npm test`. No CMD: `set APP_ENV=test` e depois `npm test`.

A verificação cobre os dois produtos com os três pagamentos, IDs distintos, singletons, persistência em memória, compatibilidade /pedidos e cinco entradas inválidas. Em test, conexões externas de socket são bloqueadas pela verificação. Em dev, verifica SQLite real, substituindo apenas SMTP por um provider de teste via rebind no container; não testa a entrega real ao Ethereal. Os pedidos de teste em dev ficam no banco local.

Aliases dos comandos do Projeto 1 continuam disponíveis: desenvolver, verificar, prisma:gerar, prisma:migrar, prisma:popular e testar.

## Entrega

O ZIP inclui código, migrations, package-lock.json e .env.example; não inclui node_modules, dist, banco, logs, .env nem histórico Git. Publique o conteúdo em um repositório público pessoal para entregar pelo AVA.
