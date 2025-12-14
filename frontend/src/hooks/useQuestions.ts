'use client';

import { useState } from 'react';
import { Question, ApiResponse } from '../types/question';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDefaultQuestions = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/questions/tree`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Question[]> = await response.json();

      if (result.success && result.data) {
        setQuestions(result.data);
        setError(null);
        return true;
      } else {
        throw new Error(result.error || 'Failed to fetch questions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadCSV = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/questions/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Question[]> = await response.json();

      if (result.success && result.data) {
        setQuestions(result.data);
        setError(null);
        return true;
      } else {
        throw new Error(result.error || 'Failed to upload CSV');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { questions, loading, error, loadDefaultQuestions, uploadCSV };
}
