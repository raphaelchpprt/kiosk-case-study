import { InMemoryQuestionRepository } from './repositories/InMemoryQuestionRepository';
import { QuestionService } from './services/QuestionService';
import path from 'path';

async function testService() {
  console.log('testing QuestionService');

  const csvPath = path.join(__dirname, '../data/questions.csv');
  const repo = new InMemoryQuestionRepository(csvPath);
  const service = new QuestionService(repo);

  console.log('test getQuestionTree():');
  const tree = await service.getQuestionTree();
  console.log(`  → ${tree.length} root nodes`);
}

testService();
