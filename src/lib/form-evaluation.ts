import {
  ExpectedFieldDefinition,
  FieldEvaluation,
  FormEvaluationResult
} from '../types';

/**
 * Normalizes alphanumeric tokens by stripping hyphens, spaces, and punctuation
 * while preserving core letters and digits.
 */
export function normalizeIdentifier(val: string): string {
  if (!val) return '';
  return val.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Normalizes general text by trimming, lowercasing, and collapsing whitespace.
 */
export function normalizeString(val: string): string {
  if (!val) return '';
  return val.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Extracts meaningful keyword tokens from text (ignoring common stop words).
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'are', 'was', 'were', 'it', 'this', 'that', 'from', 'by', 'as', 'be',
  'have', 'has', 'had', 'do', 'does', 'did', 'would', 'could', 'should', 'my',
  'me', 'her', 'his', 'their', 'our', 'your', 'i', 'we', 'they', 'he', 'she'
]);

export function extractMeaningfulTokens(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s$-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

/**
 * Evaluates a single form field against expected definition deterministically.
 */
export function evaluateSingleField(
  userValue: string | undefined,
  fieldDef: ExpectedFieldDefinition
): FieldEvaluation {
  const rawUser = (userValue || '').trim();
  const rawExpected = fieldDef.expectedValue.trim();

  // 1. Missing check
  if (!rawUser) {
    return {
      fieldKey: fieldDef.key,
      fieldLabel: fieldDef.label,
      userValue: '(Empty)',
      expectedValue: rawExpected,
      status: 'missing',
      score: 0,
      explanation: fieldDef.required
        ? 'Required field was left empty.'
        : 'No entry was recorded.'
    };
  }

  const normUser = normalizeString(rawUser);
  const normExpected = normalizeString(rawExpected);

  // 2. Exact or normalized string match
  if (normUser === normExpected) {
    return {
      fieldKey: fieldDef.key,
      fieldLabel: fieldDef.label,
      userValue: rawUser,
      expectedValue: rawExpected,
      status: 'correct',
      score: 1.0,
      explanation: 'Exact match with customer statement.'
    };
  }

  // 3. Identifier checks (e.g. "CL-88429" vs "cl88429", "88429", "PA-40912")
  const idUser = normalizeIdentifier(rawUser);
  const idExpected = normalizeIdentifier(rawExpected);

  if (idExpected.length >= 4 && (idUser === idExpected || idExpected.includes(idUser) || idUser.includes(idExpected))) {
    // If exact alphanumeric id matches
    if (idUser === idExpected) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'correct',
        score: 1.0,
        explanation: 'Accurate identifier match.'
      };
    }

    // If partial digits or code was captured
    if (idUser.length >= 3) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'partial',
        score: 0.75,
        explanation: `Partially matched identifier (expected ${rawExpected}).`
      };
    }
  }

  // 4. Numeric matching (e.g. "4" vs "4 weekend passes" or "$840" vs "840")
  const userDigits = rawUser.replace(/[^\d]/g, '');
  const expectedDigits = rawExpected.replace(/[^\d]/g, '');
  if (expectedDigits && userDigits === expectedDigits) {
    return {
      fieldKey: fieldDef.key,
      fieldLabel: fieldDef.label,
      userValue: rawUser,
      expectedValue: rawExpected,
      status: 'correct',
      score: 1.0,
      explanation: 'Accurate number/amount verified.'
    };
  }

  // 5. Select dropdowns or categorized fields
  if (fieldDef.type === 'select') {
    // Check if user selection matches or contains expected
    if (
      normExpected.includes(normUser) ||
      normUser.includes(normExpected) ||
      (normExpected.includes('auto') && normUser.includes('auto')) ||
      (normExpected.includes('homeowner') && normUser.includes('homeowner')) ||
      (normExpected.includes('paid') && normUser.includes('paid')) ||
      (normExpected.includes('delivery') && normUser.includes('delivery'))
    ) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'correct',
        score: 1.0,
        explanation: 'Correct category selected.'
      };
    }
  }

  // 6. Name matching (first name, last name, or full name)
  if (fieldDef.key === 'customerName') {
    const userTokens = rawUser.toLowerCase().split(/\s+/);
    const expectedTokens = rawExpected.toLowerCase().split(/\s+/);

    const matches = userTokens.filter((t) => expectedTokens.includes(t));
    if (matches.length === expectedTokens.length) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'correct',
        score: 1.0,
        explanation: 'Full customer name accurately recorded.'
      };
    }
    if (matches.length >= 1) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'partial',
        score: 0.6,
        explanation: `Partially correct name (recorded ${matches.join(' ')}, expected ${rawExpected}).`
      };
    }
  }

  // 7. Free-text / Descriptive fields (keyword analysis)
  const expectedTokens = extractMeaningfulTokens(rawExpected);
  const userTokens = new Set(extractMeaningfulTokens(rawUser));

  if (expectedTokens.length > 0) {
    let matchCount = 0;
    expectedTokens.forEach((token) => {
      // Check exact token or substring
      for (const u of userTokens) {
        if (u === token || u.includes(token) || token.includes(u)) {
          matchCount++;
          break;
        }
      }
    });

    const matchRatio = matchCount / expectedTokens.length;

    if (matchRatio >= 0.5) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'correct',
        score: 1.0,
        explanation: 'Captured key customer details and intent accurately.'
      };
    }

    if (matchRatio >= 0.25 || matchCount >= 2) {
      return {
        fieldKey: fieldDef.key,
        fieldLabel: fieldDef.label,
        userValue: rawUser,
        expectedValue: rawExpected,
        status: 'partial',
        score: 0.5,
        explanation: 'Partially recorded: captured some facts, but missed key context.'
      };
    }
  }

  // 8. Otherwise incorrect
  return {
    fieldKey: fieldDef.key,
    fieldLabel: fieldDef.label,
    userValue: rawUser,
    expectedValue: rawExpected,
    status: 'incorrect',
    score: 0,
    explanation: `Does not match caller details (expected: "${rawExpected}").`
  };
}

/**
 * Evaluates an entire submitted category documentation form.
 */
export function evaluateDocumentationForm(
  formData: Record<string, string>,
  fieldDefinitions: ExpectedFieldDefinition[],
  elapsedSeconds: number
): FormEvaluationResult {
  const fields = fieldDefinitions.map((fieldDef) => {
    return evaluateSingleField(formData[fieldDef.key], fieldDef);
  });

  const totalFields = fields.length;
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;
  let missingCount = 0;
  let totalScoreSum = 0;

  let totalCharsTyped = 0;

  fields.forEach((f) => {
    totalScoreSum += f.score;
    if (f.status === 'correct') correctCount++;
    else if (f.status === 'partial') partialCount++;
    else if (f.status === 'incorrect') incorrectCount++;
    else if (f.status === 'missing') missingCount++;

    if (formData[f.fieldKey]) {
      totalCharsTyped += formData[f.fieldKey].length;
    }
  });

  const overallAccuracy =
    totalFields > 0
      ? Math.max(0, Math.min(100, Math.round((totalScoreSum / totalFields) * 100)))
      : 0;

  const effectiveDurationSec = Math.max(1, elapsedSeconds);
  const minutes = effectiveDurationSec / 60;
  const typingWpm =
    totalCharsTyped > 0 && effectiveDurationSec >= 2
      ? Math.round((totalCharsTyped / 5 / minutes) * 10) / 10
      : 0;

  return {
    overallAccuracy,
    totalFields,
    correctCount,
    partialCount,
    incorrectCount,
    missingCount,
    fields,
    completionTimeSec: Math.round(effectiveDurationSec),
    charactersTyped: totalCharsTyped,
    typingWpm
  };
}
