import { Question } from '../models/Question';

export function buildTree(questions: Question[]): Question[] {
  if (questions.length === 0) {
    return [];
  }

  const questionMap = new Map<string, Question>();

  questions.forEach((q) => {
    questionMap.set(q.id, { ...q, children: [] });
  });

  const roots: Question[] = [];

  // build relations parent-enfant
  questions.forEach((question) => {
    const current = questionMap.get(question.id)!;

    // No parent => root node
    if (!question.relatedQuestionId) {
      roots.push(current);
    } else {
      // else, add it to the parent's children
      const parent = questionMap.get(question.relatedQuestionId);
      if (parent) {
        parent.children!.push(current);
      } else {
        // parent not found
        console.warn(
          `⚠️ Parent ${question.relatedQuestionId} not found for question ${question.id}`
        );
        // treat as root
        roots.push(current);
      }
    }
  });

  sortChildren(roots);

  return roots;
}

// helper func that sorts children of each question by order with recursion
function sortChildren(questions: Question[]): void {
  questions.sort((a, b) => a.order - b.order);

  questions.forEach((q) => {
    if (q.children && q.children.length > 0) {
      sortChildren(q.children);
    }
  });
}
