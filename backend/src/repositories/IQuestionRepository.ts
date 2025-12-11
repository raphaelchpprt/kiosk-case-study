import { Question } from '../models/Question';

export interface IQuestionRepository {
  getAll(): Promise<Question[]>;
  getById(id: string): Promise<Question | null>;
  getTree(): Promise<Question[]>;
}
