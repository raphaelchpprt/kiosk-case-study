import { parseCSV } from './parsers/CSVParser';
import { buildTree } from './builders/TreeBuilder';
import path from 'path';

const csvPath = path.join(__dirname, '../data/questions.csv');
const questions = parseCSV(csvPath);

const nestedCSVPath = path.join(__dirname, '../data/questions-nested.csv');
//5 levels nested questions
const nestedQuestions = parseCSV(nestedCSVPath);

console.log('Parsed questions:', questions.length);

const tree = buildTree(questions);

console.log('🚀 ~ tree:', tree);
console.log('Built question tree with root nodes:', tree.length);

// structure
console.log('complete strucutre (json):');
console.log(JSON.stringify(tree, null, 2));

// hiérarchie (IDs seulement)
console.log('hierarchy (ids only):');
function printTree(questions: any[], indent = '') {
  questions.forEach((q) => {
    console.log(`${indent}├── ${q.id} (order: ${q.order})`);
    if (q.children && q.children.length > 0) {
      printTree(q.children, indent + '│   ');
    }
  });
}
printTree(tree);
