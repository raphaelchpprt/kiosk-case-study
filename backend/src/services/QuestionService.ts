import { Question } from '../models/Question';
import { IQuestionRepository } from '../repositories/IQuestionRepository';

export class QuestionService {
  constructor(private repository: IQuestionRepository) {}

  //flat list of questions for maybe search or other uses
  async getAllQuestions(): Promise<Question[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      console.error('Error fetching all questions:', error);
      throw new Error('Failed to fetch questions');
    }
  }

  async getQuestionById(id: string): Promise<Question | null> {
    if (!id || id.trim() === '') {
      throw new Error('Question ID is required');
    }

    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error);
      throw new Error(`Failed to fetch question with ID: ${id}`);
    }
  }

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
