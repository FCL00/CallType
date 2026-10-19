import { WordAlignment } from '../types';

/**
 * Normalizes a single token for comparison:
 * Lowercases and strips common surrounding punctuation like commas, periods, quotes,
 * while preserving alphanumeric digits and hyphens (e.g., "CL-88429", "$500").
 */
export function normalizeToken(token: string): string {
  if (!token) return '';
  return token
    .toLowerCase()
    .trim()
    .replace(/^["'([{«<]+/, '')
    .replace(/[!"'?)\]}:;,«>.]+/g, '');
}

/**
 * Tokenizes a string into words while keeping track of their positions.
 */
export function tokenizeText(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  // Split on whitespace and filter empty
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Computes word-level alignment between reference transcript and user typed transcript
 * using dynamic programming sequence alignment (Needleman-Wunsch / Levenshtein distance on tokens).
 */
export function alignTranscripts(referenceText: string, typedText: string): WordAlignment[] {
  const refWords = tokenizeText(referenceText);
  const typedWords = tokenizeText(typedText);

  const n = refWords.length;
  const m = typedWords.length;

  if (n === 0 && m === 0) return [];
  if (n === 0) {
    return typedWords.map((word, idx) => ({
      id: `extra-0-${idx}`,
      type: 'extra',
      typedWord: word,
      typedIndex: idx
    }));
  }
  if (m === 0) {
    return refWords.map((word, idx) => ({
      id: `missing-${idx}-0`,
      type: 'missing',
      originalWord: word,
      refIndex: idx
    }));
  }

  // Cost matrix
  // dp[i][j] stores the minimum edit cost to align refWords[0..i-1] with typedWords[0..j-1]
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i; // all deletions
  for (let j = 0; j <= m; j++) dp[0][j] = j; // all insertions

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const refToken = normalizeToken(refWords[i - 1]);
      const typedToken = normalizeToken(typedWords[j - 1]);

      if (refToken === typedToken) {
        dp[i][j] = dp[i - 1][j - 1]; // Exact match, zero cost
      } else {
        const substituteCost = 1.2; // slight penalty over insert/delete so clear substitutions align nicely
        const matchOrSub = dp[i - 1][j - 1] + substituteCost;
        const deleteRef = dp[i - 1][j] + 1; // missing
        const insertUser = dp[i][j - 1] + 1; // extra
        dp[i][j] = Math.min(matchOrSub, deleteRef, insertUser);
      }
    }
  }

  // Backtrack to find alignment operations
  const alignments: WordAlignment[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const refToken = normalizeToken(refWords[i - 1]);
      const typedToken = normalizeToken(typedWords[j - 1]);
      const currentCost = dp[i][j];

      if (refToken === typedToken && currentCost === dp[i - 1][j - 1]) {
        alignments.unshift({
          id: `match-${i - 1}-${j - 1}`,
          type: 'correct',
          originalWord: refWords[i - 1],
          typedWord: typedWords[j - 1],
          refIndex: i - 1,
          typedIndex: j - 1
        });
        i--;
        j--;
        continue;
      }

      // Check substitution
      const substituteCost = 1.2;
      if (Math.abs(currentCost - (dp[i - 1][j - 1] + substituteCost)) < 0.001) {
        alignments.unshift({
          id: `sub-${i - 1}-${j - 1}`,
          type: 'incorrect',
          originalWord: refWords[i - 1],
          typedWord: typedWords[j - 1],
          refIndex: i - 1,
          typedIndex: j - 1
        });
        i--;
        j--;
        continue;
      }
    }

    if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) {
      // User typed an extra word
      alignments.unshift({
        id: `extra-${i}-${j - 1}`,
        type: 'extra',
        typedWord: typedWords[j - 1],
        typedIndex: j - 1
      });
      j--;
    } else if (i > 0) {
      // User omitted a word (missing)
      alignments.unshift({
        id: `missing-${i - 1}-${j}`,
        type: 'missing',
        originalWord: refWords[i - 1],
        refIndex: i - 1
      });
      i--;
    }
  }

  return alignments;
}
