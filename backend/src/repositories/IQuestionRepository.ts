import { Question } from '../models/Question';

export interface IQuestionRepository {
  getTree(): Promise<Question[]>;
}
