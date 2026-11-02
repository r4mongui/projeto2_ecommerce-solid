import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function principal() {
  await prisma.produto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'O Programador Pragmático (Livro Físico)',
      tipo: 'fisico',
      preco: 100.0,
    },
  });

  await prisma.produto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nome: 'Código Limpo (Livro Digital)',
      tipo: 'digital',
      preco: 50.0,
    },
  });

  console.log('Cadastro inicial realizado com sucesso!');
}

principal()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
