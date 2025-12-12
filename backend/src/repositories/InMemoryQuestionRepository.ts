import { Question } from '../models/Question';
import { IQuestionRepository } from './IQuestionRepository';
import { parseCSV } from '../parsers/CSVParser';
import { buildTree } from '../builders/TreeBuilder';
import { validateQuestions } from '../validators/QuestionValidator';

export class InMemoryQuestionRepository implements IQuestionRepository {
  private questions: Question[] = [];
  private questionTree: Question[] = [];

  constructor(csvPath?: string) {
    this.loadQuestions(csvPath);
  }

  private loadQuestions(csvPath?: string): void {
    this.questions = parseCSV(csvPath);

    // validation
    const validation = validateQuestions(this.questions);
    if (!validation.valid) {
      throw new Error(`Invalid questions: ${validation.errors.join(', ')}`);
    }

    // build tree
    this.questionTree = buildTree(this.questions);

    console.log(`Loaded questions: ${this.questions.length}`);
  }

  async getTree(): Promise<Question[]> {
    return this.questionTree;
  }
}
