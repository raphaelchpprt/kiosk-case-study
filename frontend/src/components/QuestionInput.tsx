'use client';
import { Question } from '@/src/types/question';

interface QuestionInputProps {
  question: Question;
  value: string | number;
}
export function QuestionInput({ question, value }: QuestionInputProps) {
  switch (question.content) {
    case 'Text':
      return null;
    case 'number':
      return null;
    case 'enum':
      return null;
    case 'Table':
      return null;
    default:
      return null;
  }
}
