import { Question } from '@/src/types/question';

/**
 * return all questions that have an input
 */
export function getAllInputQuestions(questions: Question[]): Question[] {
  const inputs: Question[] = [];

  function traverse(q: Question) {
    if (q.content !== 'Table' && q.content !== '') {
      inputs.push(q);
    }

    if (q.children && q.children.length > 0) {
      q.children.forEach(traverse);
    }
  }

  questions.forEach(traverse);
  return inputs;
}

/**
 * return main sections (table roots)
 */
export function getTableSections(questions: Question[]): Question[] {
  return questions.filter((q) => q.content === 'Table' || q.content === '');
}

/**
 * find the question's parent (for breadcrumb and current section)
 */
export function findParent(
  questions: Question[],
  questionId: string
): Question | null {
  for (const q of questions) {
    if (q.children?.some((child) => child.id === questionId)) {
      return q;
    }

    if (q.children) {
      const found = findParent(q.children, questionId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * return current section index for a given question
 */
export function getCurrentSectionIndex(
  questions: Question[],
  questionId: string
): number {
  const sections = getTableSections(questions);
  const parent = findParent(questions, questionId);

  if (!parent) return 0;

  return sections.findIndex((s) => s.id === parent.id);
}
