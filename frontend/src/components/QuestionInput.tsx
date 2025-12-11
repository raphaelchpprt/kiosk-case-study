'use client';
import { Question } from '@/src/types/question';
import { TextInput, NumberInput, Select, Textarea } from '@mantine/core';

interface QuestionInputProps {
  question: Question;
  value: string | number;
}
export function QuestionInput({ question, value }: QuestionInputProps) {
  //je prends le label en anglais pour le mvp
  const label = question.labelEn;

  switch (question.content) {
    case 'Text':
      return <TextInput label={label} value={value} />;
    case 'number':
      return <NumberInput label={label} value={value} />;
    case 'enum':
      return <TextInput label={label} value={value} />;
    default:
      return null;
  }
}
