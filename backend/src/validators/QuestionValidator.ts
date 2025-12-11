import { Question } from '../models/Question';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates an array of questions before building the tree
 */
export function validateQuestions(questions: Question[]): ValidationResult {
  const errors: string[] = [];

  // 1. Check that the array is not empty
  if (questions.length === 0) {
    errors.push('No questions found');
    return { valid: false, errors };
  }

  // 2. Check for ID uniqueness
  const ids = questions.map((q) => q.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push(`Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);
  }

  // 3. Create a Set of valid IDs for O(1) lookup
  const validIds = new Set(questions.map((q) => q.id));

  // 4. Validate each question
  questions.forEach((question, index) => {
    // ID required and not empty
    if (!question.id || question.id.trim() === '') {
      errors.push(`Question at index ${index}: ID is required`);
    }

    // Labels required
    if (!question.labelEn && !question.labelFr) {
      errors.push(
        `Question ${question.id}: At least one label (en/fr) is required`
      );
    }

    // Order must be a number
    if (isNaN(question.order)) {
      errors.push(`Question ${question.id}: Invalid order "${question.order}"`);
    }

    // Check that the parent exists (if defined)
    if (
      question.relatedQuestionId &&
      !validIds.has(question.relatedQuestionId)
    ) {
      errors.push(
        `Question ${question.id}: Parent "${question.relatedQuestionId}" does not exist`
      );
    }

    // Validate content type
    const validContentTypes = ['Table', 'number', 'Text', 'enum', ''];
    if (!validContentTypes.includes(question.content)) {
      errors.push(
        `Question ${question.id}: Invalid content type "${question.content}"`
      );
    }

    // If enum type, check that options exist
    if (question.content === 'enum') {
      if (!question.enumOptionsEn && !question.enumOptionsFr) {
        errors.push(`Question ${question.id}: Enum type requires options`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
