import { Question } from '../models/Question';
import { IQuestionRepository } from '../repositories/IQuestionRepository';

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
}
