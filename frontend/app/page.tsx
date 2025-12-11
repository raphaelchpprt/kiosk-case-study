'use client';

import { useQuestions } from '@/src/hooks/useQuestions';

export default function Home() {
  const { questions, loading, error } = useQuestions();
  console.log('🚀 ~ Home ~ loading:', loading);
  console.log('🚀 ~ Home ~ questions:', questions);
  console.log('🚀 ~ Home ~ error:', error);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kiosk</h1>
      <p>numb of root questions found {questions.length}</p>
    </div>
  );
}
