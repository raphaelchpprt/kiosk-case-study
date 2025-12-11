import express from 'express';
import cors from 'cors';
import path from 'path';
import { InMemoryQuestionRepository } from './repositories/InMemoryQuestionRepository';
import { QuestionService } from './services/QuestionService';
import { createQuestionRoutes } from './routes/questions.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// dependencies
const csvPath = path.join(__dirname, '../data/questions.csv');
const repository = new InMemoryQuestionRepository(csvPath);
const service = new QuestionService(repository);

// Routes
app.use('/api/questions', createQuestionRoutes(service));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API: http://localhost:${PORT}/api/questions/tree`);
});
