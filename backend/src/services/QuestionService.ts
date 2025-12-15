import { Question } from '../models/Question';
import { IQuestionRepository } from '../repositories/IQuestionRepository';
import { parseCSV } from '../parsers/CSVParser';
import { buildTree } from '../builders/TreeBuilder';
import { validateQuestions } from '../validators/QuestionValidator';

export class QuestionService {
  constructor(private repository: IQuestionRepository) {}

  //to get hierarchy of questions
  async getQuestionTree(): Promise<Question[]> {
    try {
      return await this.repository.getTree();
    } catch (error) {
      console.error('Error fetching question tree:', error);
      throw new Error('Failed to fetch question tree');
    }
  }

  //returns a question tree after validation
  async processUploadedDataFile(
    buffer: Buffer,
    mimeType: string
  ): Promise<Question[]> {
    try {
      let questions: Question[];

      switch (mimeType) {
        case 'text/csv':
          questions = parseCSV(buffer);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      const validation = validateQuestions(questions);

      if (!validation.valid) {
        throw new Error(`Invalid file: ${validation.errors.join(' | ')}`);
      }

      const tree = buildTree(questions);

      return tree;
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to process uploaded file');
    }
  }
}
