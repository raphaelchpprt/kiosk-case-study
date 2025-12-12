import { Question } from '@/src/types/question';

/**
 * retourne toutes les questions qui ont un input
 */
export function getAllInputQuestions(questions: Question[]): Question[] {
  const inputs: Question[] = [];

  function traverse(q: Question) {
    // Si c'est un vrai input (pas Table, pas vide)
    if (q.content !== 'Table' && q.content !== '') {
      inputs.push(q);
    }

    // creuse dans les enfants
    if (q.children && q.children.length > 0) {
      q.children.forEach(traverse);
    }
  }

  questions.forEach(traverse);
  return inputs;
}

/**
 * retourne les sections principales (tables racines)
 */
export function getTableSections(questions: Question[]): Question[] {
  return questions.filter((q) => q.content === 'Table' || q.content === '');
}

/**
 * trouve le parent d'une question, pour le breadcrumb et la current section
 */
export function findParent(
  questions: Question[],
  questionId: string
): Question | null {
  for (const q of questions) {
    //les enfants
    if (q.children?.some((child) => child.id === questionId)) {
      return q;
    }

    //
    if (q.children) {
      const found = findParent(q.children, questionId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * renvoie index de la current section pour une question donnée
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
