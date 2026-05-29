require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Seeded Sample Quiz',
        questions: {
          create: [
            { text: 'Is water wet?', type: 'BOOLEAN' },
            { text: 'Your name', type: 'INPUT' },
            { text: 'Choose colors', type: 'CHECKBOX', options: JSON.stringify(['Red', 'Green', 'Blue']) }
          ]
        }
      },
      include: { questions: true }
    });
    console.log('Seed created:', quiz.id);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
