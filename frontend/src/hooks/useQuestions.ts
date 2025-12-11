'use client';

import { useState, useEffect } from 'react';
import { Question, ApiResponse } from '../types/question';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/questions/tree`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse<Question[]> = await response.json();

        if (result.success && result.data) {
          setQuestions(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch questions');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);
  return { questions, loading, error };
}
