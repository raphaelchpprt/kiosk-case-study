import { parseCSV } from './parsers/CSVParser';
import { validateQuestions } from './validators/QuestionValidator';
import path from 'path';

const csvPath = path.join(__dirname, '../data/questions.csv');
// test with invalid data
const invalidCsvPath = path.join(__dirname, '../data/questions-invalid.csv');

const questions = parseCSV(csvPath);

console.log('numb of questions to validate', questions.length);

const result = validateQuestions(questions);

if (result.valid) {
  console.log('Success! No validation errors');
} else {
  console.log('❌ Validation errors found:\n');
  result.errors.forEach((err) => console.log('  -', err));
}

console.log('Numb of errors:', result.errors.length);
