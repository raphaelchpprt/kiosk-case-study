import { InMemoryQuestionRepository } from './repositories/InMemoryQuestionRepository';
import path from 'path';

async function testRepository() {
  console.log('Testing InMemoryQuestionRepository\n');

  const csvPath = path.join(__dirname, '../data/questions.csv');
  const repo = new InMemoryQuestionRepository(csvPath);

  console.log('Test getAll():');
  const all = await repo.getAll();
  console.log(`  → ${all.length} questions`);

  console.log('Test getById() with valid ID:');
  const q1 = await repo.getById(all[0].id);
  console.log(`  → Found: ${q1?.id} - ${q1?.labelEn}`);

  console.log('Test getById() with invalid ID:');
  const notFound = await repo.getById('1873903472');
  console.log(`  → Result: ${notFound}`);

  console.log('Test getTree():');
  const tree = await repo.getTree();
  console.log('🚀 ~ testRepository ~ tree:', tree);
  console.log(`  → ${tree.length} root nodes`);
}

testRepository();
