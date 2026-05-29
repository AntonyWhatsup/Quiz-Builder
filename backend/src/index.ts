import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

interface QuestionInput {
  text: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  options?: string[];
}

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Quiz Builder API is active', version: '1.0.0' });
});

// POST /quizzes – Create a new quiz
app.post('/quizzes', async (req, res) => {
  const { title, questions }: { title: string; questions: QuestionInput[] } = req.body;
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.type === 'CHECKBOX' && q.options ? JSON.stringify(q.options) : null,
          })),
        },
      },
      include: { questions: true },
    });
    res.status(201).json(quiz);
  } catch (error) {
    console.error('POST /quizzes error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// GET /quizzes – List all quizzes
app.get('/quizzes', async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(quizzes);
});

// GET /quizzes/:id – Full details
app.get('/quizzes/:id', async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.id },
    include: { questions: true },
  });
  quiz ? res.json(quiz) : res.status(404).json({ error: 'Quiz not found' });
});

// DELETE /quizzes/:id
app.delete('/quizzes/:id', async (req, res) => {
  try {
    // Remove dependent questions first to avoid foreign key constraint errors
    await prisma.question.deleteMany({ where: { quizId: req.params.id } });
    await prisma.quiz.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('DELETE /quizzes/:id error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
