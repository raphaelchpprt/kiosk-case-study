export interface Answer {
  questionId: string;
  value: string | number;
}

export interface AnswerCollection {
  [questionId: string]: string | number;
}
