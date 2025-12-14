import { Question } from '../models/Question';
import { IQuestionRepository } from '../repositories/IQuestionRepository';
import { parseCSV } from '../parsers/CSVParser';
import { buildTree } from '../builders/TreeBuilder';

export class QuestionService {
  constructor(private repository: IQuestionRepository) {}

  //get hierarchy of questions
  async getQuestionTree(): Promise<Question[]> {
    try {
      return await this.repository.getTree();
    } catch (error) {
      console.error('Error fetching question tree:', error);
      throw new Error('Failed to fetch question tree');
    }
  }

  //process uploaded CSV buffer into a question tree
  async processUploadedCSV(buffer: Buffer): Promise<Question[]> {
    try {
      const questions = parseCSV(buffer);

      const tree = buildTree(questions);

      return tree;
    } catch (error) {
      console.error('Error processing uploaded CSV:', error);
      throw new Error('Failed to process uploaded CSV');
    }
  }
}
