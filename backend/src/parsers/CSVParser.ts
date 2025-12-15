import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { Question, QuestionType } from '../models/Question';

interface CSVRow {
  ID: string;
  'question label en': string;
  'question label fr': string;
  content: string;
  'relatedQuestion ID': string;
  order: string;
  unit: string;
  'enum en': string;
  'enum fr': string;
}

/**
 * Returns an array of Questions parsed from a CSV file or buffer
 */
export function parseCSV(input?: string | Buffer): Question[] {
  try {
    let fileContent: string | Buffer;

    if (Buffer.isBuffer(input)) {
      fileContent = input;
    } else {
      const filePath =
        input || path.join(__dirname, '../../data/questions.csv');

      if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found at: ${filePath}`);
      }

      fileContent = fs.readFileSync(filePath, 'utf-8');
    }

    const records = parse(fileContent, {
      delimiter: ';',
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as CSVRow[];

    const questions: Question[] = records.map(rowToQuestion);

    return questions;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse CSV: ${error.message}`);
    }
    throw error;
  }
}

function rowToQuestion(row: CSVRow): Question {
  return {
    id: row['ID'],
    labelEn: row['question label en'] || '',
    labelFr: row['question label fr'] || '',
    content: (row['content'] || '') as QuestionType,
    order: parseInt(row['order']) || 0,
    relatedQuestionId: row['relatedQuestion ID'] || undefined,
    unit: row['unit'] || undefined,
    enumOptionsEn: parseEnumOptions(row['enum en']),
    enumOptionsFr: parseEnumOptions(row['enum fr']),
  };
}

function parseEnumOptions(enumString?: string): string[] | undefined {
  if (!enumString) return undefined;

  return enumString
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
