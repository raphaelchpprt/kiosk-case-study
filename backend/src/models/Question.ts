export type QuestionType = 'Table' | 'number' | 'Text' | 'enum' | '';
export interface Question {
  id: string;
  labelEn: string;
  labelFr: string;
  content: QuestionType;
  order: number;
  relatedQuestionId?: string;
  unit?: string;
  enumOptionsEn?: string[];
  enumOptionsFr?: string[];
  children?: Question[];
}
