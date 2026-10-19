import { ScoringResult } from '../types';
import { alignTranscripts, tokenizeText } from './transcript-comparison';

export interface ScoringOptions {
  referenceTranscript: string;
  userTranscription: string;
  durationSeconds: number;
}

/**
 * Calculates typing performance metrics deterministically:
 * - Gross WPM = (characters typed / 5) / (duration in minutes)
 * - Net WPM = max(0, ((characters typed / 5) - uncorrected errors) / (duration in minutes))
 * - Word Accuracy % = (correct words / total reference words) * 100
 * - Detailed error breakdown (incorrect, missing, extra words)
 */
export function evaluateTranscription(options: ScoringOptions): ScoringResult {
  const { referenceTranscript, userTranscription, durationSeconds } = options;

  const rawTyped = userTranscription || '';
  const charactersTyped = rawTyped.length;
  const typedWordTokens = tokenizeText(rawTyped);
  const refWordTokens = tokenizeText(referenceTranscript || '');

  const referenceWordCount = refWordTokens.length;
  const typedWordCount = typedWordTokens.length;

  // Defensive duration: at least 1 second to avoid division by zero
  const effectiveDurationSec = Math.max(1, durationSeconds);
  const durationMinutes = effectiveDurationSec / 60;

  // Compute word alignment
  const wordAlignments = alignTranscripts(referenceTranscript, rawTyped);

  let correctWordsCount = 0;
  let incorrectWordsCount = 0;
  let missingWordsCount = 0;
  let extraWordsCount = 0;

  for (const item of wordAlignments) {
    if (item.type === 'correct') correctWordsCount++;
    else if (item.type === 'incorrect') incorrectWordsCount++;
    else if (item.type === 'missing') missingWordsCount++;
    else if (item.type === 'extra') extraWordsCount++;
  }

  const totalErrors = incorrectWordsCount + missingWordsCount + extraWordsCount;

  // Guard against very short sessions or empty typed inputs
  let grossWpm = 0;
  let netWpm = 0;

  if (charactersTyped > 0 && effectiveDurationSec >= 2) {
    // 5 keystrokes per standard word
    const standardWords = charactersTyped / 5;
    grossWpm = Math.round((standardWords / durationMinutes) * 10) / 10;

    // Error penalty adjustment for Net WPM
    // Standard formula: Net WPM = ( (chars / 5) - uncorrected errors ) / minutes
    const errorAdjustedWords = Math.max(0, standardWords - totalErrors);
    netWpm = Math.round((errorAdjustedWords / durationMinutes) * 10) / 10;
  }

  // Accuracy calculation based on reference words
  let accuracy = 0;
  if (referenceWordCount > 0) {
    // Percentage of reference words accurately transcribed
    const rawAccuracy = (correctWordsCount / referenceWordCount) * 100;
    accuracy = Math.max(0, Math.min(100, Math.round(rawAccuracy * 10) / 10));
  } else if (typedWordCount === 0) {
    accuracy = 100;
  }

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalErrors,
    correctWordsCount,
    incorrectWordsCount,
    missingWordsCount,
    extraWordsCount,
    charactersTyped,
    referenceWordCount,
    typedWordCount,
    sessionDurationSec: Math.round(effectiveDurationSec),
    wordAlignments
  };
}

/**
 * Calculates live typing stats during active typing
 */
export function calculateLiveMetrics(
  typedText: string,
  elapsedSec: number,
  referenceTranscript: string
) {
  const charactersTyped = typedText.length;
  const effectiveSec = Math.max(1, elapsedSec);
  const minutes = effectiveSec / 60;

  let liveWpm = 0;
  if (charactersTyped > 0 && effectiveSec >= 2) {
    liveWpm = Math.round((charactersTyped / 5 / minutes) * 10) / 10;
  }

  const refTokens = tokenizeText(referenceTranscript);
  const typedTokens = tokenizeText(typedText);

  let matched = 0;
  const minLen = Math.min(refTokens.length, typedTokens.length);
  for (let i = 0; i < minLen; i++) {
    const r = refTokens[i].toLowerCase().replace(/[^\w]/g, '');
    const t = typedTokens[i].toLowerCase().replace(/[^\w]/g, '');
    if (r === t) matched++;
  }

  const liveAccuracy =
    typedTokens.length > 0
      ? Math.round((matched / typedTokens.length) * 100)
      : 100;

  return {
    liveWpm,
    liveAccuracy,
    wordsTyped: typedTokens.length,
    charactersTyped
  };
}
