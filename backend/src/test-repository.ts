import { InMemoryQuestionRepository } from './repositories/InMemoryQuestionRepository';
import path from 'path';

async function testRepository() {
  console.log('Testing InMemoryQuestionRepository\n');

  const csvPath = path.join(__dirname, '../data/questions.csv');
  const repo = new InMemoryQuestionRepository(csvPath);

  console.log('Test getTree():');
  const tree = await repo.getTree();
  console.log('🚀 ~ testRepository ~ tree:', tree);
  console.log(`  → ${tree.length} root nodes`);
}

testRepository();
