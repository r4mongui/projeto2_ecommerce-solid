# Validação da entrega

Base: https://github.com/r4mongui/projeto1_ecommerce-solid
Commit de origem: 590dd2aeb7813fc74f27227d99c4494aac4070d3

Executado com Node.js 24.13.0 e npm 11.6.2.
Dependências: inversify 7.11.0, reflect-metadata 0.2.2, dotenv 18.0.9 e Prisma 6.19.3.

- Instalação das dependências e geração do Prisma Client: OK.
- TypeScript (npm run build): OK.
- Migrations em SQLite novo e seed: OK.
- Modo test: seis combinações (2 produtos x 3 pagamentos), totais 110/50, singletons, pedidos no array, rota /pedidos e cinco entradas inválidas: OK.
- Conexões externas de socket bloqueadas durante o teste offline; HTTP em loopback permitido.
- Modo dev: mesmas combinações e validações com persistência conferida no SQLite: OK. SMTP substituído via rebind apenas na verificação; envio real Ethereal não verificado.
- Inicialização de src/server.ts com tsx e dist/src/server.js com Node, seguida de POST /orders: OK.
- git diff --check e ausência de APP_ENV/Prisma/Nodemailer em services/controllers: OK.

O npm audit apontou quatro avisos de severidade alta na árvore herdada de dependências (Nodemailer, Prisma/@prisma/config e deepmerge-ts). As versões principais dessas dependências foram preservadas para manter o escopo e a compatibilidade do Projeto 1; atualizações de segurança devem ser avaliadas separadamente.

Nenhuma alteração foi publicada no GitHub. O ZIP não contém node_modules, dist, .env, banco local, logs ou .git.
