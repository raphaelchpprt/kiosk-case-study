import { parseCSV } from './parsers/CSVParser';
import path from 'path';

const csvPath = path.join(__dirname, '../data/questions.csv');
const questions = parseCSV(csvPath);

console.log('Parsed questions:', questions.length);

const withParent = questions.filter((q) => q.relatedQuestionId);
console.log(`Questions with parent: ${withParent.length}`);
