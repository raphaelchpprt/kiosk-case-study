'use client';

import { Question } from '@/src/types/question';
import { TextInput, NumberInput, Select } from '@mantine/core';

interface QuestionInputProps {
  question: Question;
  value: string | number;
  onChange: (value: string | number) => void;
  onSubmit: () => void;
}

export function QuestionInput({
  question,
  value,
  onChange,
  onSubmit,
}: QuestionInputProps) {
  console.log('🚀 ~ value:', value);
  switch (question.content) {
    case 'Text':
      return (
        <TextInput
          key={question.id}
          value={typeof value === 'string' ? value : ''}
          size="lg"
          placeholder="Enter text"
          onChange={(e) => onChange(e.currentTarget.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit?.();
            }
          }}
        />
      );
    case 'number':
      return (
        <NumberInput
          key={question.id}
          value={typeof value === 'number' ? value : undefined}
          onChange={(val) => onChange(val || 0)}
          size="lg"
          rightSection={question.unit}
          placeholder="Enter a number"
          min={0}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit?.();
            }
          }}
        />
      );
    case 'enum':
      const options =
        question.enumOptionsEn?.map((opt) => ({
          value: opt,
          label: opt,
        })) || [];

      return (
        <Select
          key={question.id}
          value={typeof value === 'string' ? value : null}
          onChange={(val) => onChange(val || '')}
          data={options}
          placeholder="Select an option"
          searchable
          clearable
          size="lg"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit?.();
            }
          }}
        />
      );
    default:
      return null;
  }
}
