'use client';

import { useState } from 'react';
import { Question } from '../types/question';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return { questions, loading, error };
}
