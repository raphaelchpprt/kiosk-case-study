import { InMemoryQuestionRepository } from './repositories/InMemoryQuestionRepository';
import { QuestionService } from './services/QuestionService';
import path from 'path';

async function testService() {
  console.log('🧪 Testing QuestionService\n');

  const csvPath = path.join(__dirname, '../data/questions.csv');
  const repo = new InMemoryQuestionRepository(csvPath);
  const service = new QuestionService(repo);

  console.log('📋 Test getAllQuestions():');
  const all = await service.getAllQuestions();
  console.log(`  → ${all.length} questions`);

  console.log('\n🌳 Test getQuestionTree():');
  const tree = await service.getQuestionTree();
  console.log(`  → ${tree.length} root nodes`);

  console.log('\n🔍 Test getQuestionById() with valid ID:');
  const q1 = await service.getQuestionById(all[0].id);
  console.log(`  → Found: ${q1?.id} - ${q1?.labelEn}`);

  console.log('\n❌ Test getQuestionById() with invalid ID:');
  const notFound = await service.getQuestionById('INVALID');
  console.log(`  → Result: ${notFound}`);

  console.log('\n⚠️  Test getQuestionById() with empty ID:');
  try {
    await service.getQuestionById('');
  } catch (error) {
    console.log(
      `  → Error caught: ${error instanceof Error ? error.message : error}`
    );
  }
}

testService();
