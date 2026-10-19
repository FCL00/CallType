import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateTranscription, calculateLiveMetrics } from '../lib/scoring';
import { alignTranscripts, normalizeToken, tokenizeText } from '../lib/transcript-comparison';
import {
  evaluateDocumentationForm,
  evaluateSingleField,
  normalizeIdentifier
} from '../lib/form-evaluation';
import {
  SCENARIOS,
  INSURANCE_FIELDS,
  TICKETING_FIELDS,
  ECOMMERCE_FIELDS
} from '../data/scenarios';
import { ACCOUNTS } from '../data/accounts';
import { VOICE_OPTIONS } from '../data/voice-options';
import {
  loadSessionsFromStorage,
  saveSessionsToStorage,
  clearCallTypeSessionData
} from '../lib/session-storage';
import { PracticeSessionRecord, ExpectedFieldDefinition } from '../types';
import fs from 'fs';
import path from 'path';

describe('Transcript Comparison & Tokenization', () => {
  it('normalizes tokens by removing edge punctuation and lowercasing', () => {
    expect(normalizeToken('Hello,')).toBe('hello');
    expect(normalizeToken('"CL-88429"')).toBe('cl-88429');
    expect(normalizeToken('$500.')).toBe('$500');
    expect(normalizeToken('(morning!)')).toBe('morning');
  });

  it('tokenizes text correctly', () => {
    const text = '  Checking   claim CL-88429 today.  ';
    expect(tokenizeText(text)).toEqual(['Checking', 'claim', 'CL-88429', 'today.']);
  });

  it('identifies exact matches as correct', () => {
    const ref = 'Hello my name is Eleanor Vance';
    const user = 'Hello my name is Eleanor Vance';
    const alignments = alignTranscripts(ref, user);

    expect(alignments.every((a) => a.type === 'correct')).toBe(true);
    expect(alignments.length).toBe(6);
  });

  it('identifies substituted, missing, and extra words', () => {
    const ref = 'Hello my name is Eleanor Vance';
    const user = 'Hi my name Eleanor extra Vance';
    const alignments = alignTranscripts(ref, user);

    const correct = alignments.filter((a) => a.type === 'correct');
    const incorrect = alignments.filter((a) => a.type === 'incorrect');
    const missing = alignments.filter((a) => a.type === 'missing');
    const extra = alignments.filter((a) => a.type === 'extra');

    expect(correct.length).toBeGreaterThan(0);
    expect(alignments.some((a) => a.type === 'incorrect' || a.type === 'extra')).toBe(true);
    expect(missing.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Interactive CRM Form Evaluation', () => {
  const insuranceScenario = SCENARIOS.find((s) => s.category === 'insurance')!;

  it('has exact required schemas for each category', () => {
    // Insurance: 10 fields
    expect(INSURANCE_FIELDS.length).toBe(10);
    const insKeys = INSURANCE_FIELDS.map((f) => f.key);
    expect(insKeys).toContain('customerName');
    expect(insKeys).toContain('policyNumber');
    expect(insKeys).toContain('claimReferenceNumber');
    expect(insKeys).toContain('insuranceType');
    expect(insKeys).toContain('dateOfIncident');
    expect(insKeys).toContain('reasonForCalling');
    expect(insKeys).toContain('customerConcern');
    expect(insKeys).toContain('actionRequired');
    expect(insKeys).toContain('callSummary');
    expect(insKeys).toContain('additionalNotes');

    // Ticketing: 11 fields
    expect(TICKETING_FIELDS.length).toBe(11);
    const tickKeys = TICKETING_FIELDS.map((f) => f.key);
    expect(tickKeys).toContain('orderReferenceNumber');
    expect(tickKeys).toContain('eventName');
    expect(tickKeys).toContain('eventDate');
    expect(tickKeys).toContain('numberOfTickets');
    expect(tickKeys).toContain('seatingSection');
    expect(tickKeys).toContain('paymentStatus');
    expect(tickKeys).toContain('issueReported');
    expect(tickKeys).toContain('resolutionRequired');

    // E-commerce: 10 fields
    expect(ECOMMERCE_FIELDS.length).toBe(10);
    const ecomKeys = ECOMMERCE_FIELDS.map((f) => f.key);
    expect(ecomKeys).toContain('orderNumber');
    expect(ecomKeys).toContain('productName');
    expect(ecomKeys).toContain('purchaseDate');
    expect(ecomKeys).toContain('trackingNumber');
    expect(ecomKeys).toContain('deliveryStatus');
    expect(ecomKeys).toContain('customerConcern');
    expect(ecomKeys).toContain('requestedResolution');
  });

  it('evaluates a completely accurate form submission as 100% correct', () => {
    const perfectForm = { ...insuranceScenario.expectedForm };
    const result = evaluateDocumentationForm(
      perfectForm,
      insuranceScenario.fieldDefinitions,
      45
    );

    expect(result.overallAccuracy).toBe(100);
    expect(result.correctCount).toBe(insuranceScenario.fieldDefinitions.length);
    expect(result.incorrectCount).toBe(0);
    expect(result.missingCount).toBe(0);
    expect(result.typingWpm).toBeGreaterThan(0);
  });

  it('handles identifier normalization for alphanumeric codes', () => {
    const fieldDef: ExpectedFieldDefinition = {
      key: 'claimReferenceNumber',
      label: 'Claim Reference Number',
      expectedValue: 'CL-88429',
      required: true
    };

    // User types lowercase without hyphen
    const eval1 = evaluateSingleField('cl88429', fieldDef);
    expect(eval1.status).toBe('correct');
    expect(eval1.score).toBe(1.0);

    // User types just the main digits
    const eval2 = evaluateSingleField('88429', fieldDef);
    expect(eval2.status).toBe('partial');
    expect(eval2.score).toBeGreaterThan(0.5);
  });

  it('accurately identifies empty fields as missing with 0 score', () => {
    const fieldDef: ExpectedFieldDefinition = {
      key: 'policyNumber',
      label: 'Policy Number',
      expectedValue: 'PA-40912',
      required: true
    };

    const emptyEval = evaluateSingleField('', fieldDef);
    expect(emptyEval.status).toBe('missing');
    expect(emptyEval.score).toBe(0);
  });

  it('evaluates partially correct keyword descriptions', () => {
    const fieldDef: ExpectedFieldDefinition = {
      key: 'customerConcern',
      label: "Customer's Concern",
      expectedValue:
        'Verify whether $500 deductible applies before authorizing repair shop bumper replacement',
      required: true,
      type: 'textarea'
    };

    // User entered some key words (deductible, bumper) but missed others
    const partialEval = evaluateSingleField(
      'Wants to know about her deductible for the bumper',
      fieldDef
    );
    expect(['correct', 'partial']).toContain(partialEval.status);
    expect(partialEval.score).toBeGreaterThan(0);
  });

  it('identifies incorrect entries with zero score and feedback', () => {
    const fieldDef: ExpectedFieldDefinition = {
      key: 'policyNumber',
      label: 'Policy Number',
      expectedValue: 'PA-40912',
      required: true
    };

    const badEval = evaluateSingleField('XYZ-99999', fieldDef);
    expect(badEval.status).toBe('incorrect');
    expect(badEval.score).toBe(0);
    expect(badEval.explanation).toContain('expected: "PA-40912"');
  });

  it('every scenario includes complete expected form data matching its schema', () => {
    for (const sc of SCENARIOS) {
      expect(Object.keys(sc.expectedForm).length).toBeGreaterThanOrEqual(10);
      expect(sc.fieldDefinitions.length).toBeGreaterThanOrEqual(10);

      // Verify each field in fieldDefinitions has an expectedValue
      for (const f of sc.fieldDefinitions) {
        expect(f.expectedValue.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('Typing Scoring & WPM Calculations', () => {
  const sampleRef =
    'Hello, my name is Eleanor Vance, and I am calling to check on the status of my auto insurance claim.';

  it('calculates 100% accuracy for a perfect transcription', () => {
    const duration = 60; // 60 seconds = 1 minute
    const result = evaluateTranscription({
      referenceTranscript: sampleRef,
      userTranscription: sampleRef,
      durationSeconds: duration
    });

    expect(result.accuracy).toBe(100);
    expect(result.totalErrors).toBe(0);
    expect(result.correctWordsCount).toBe(result.referenceWordCount);
    expect(result.grossWpm).toBeGreaterThan(0);
    expect(result.netWpm).toBe(result.grossWpm);
  });

  it('handles empty submissions gracefully without errors', () => {
    const result = evaluateTranscription({
      referenceTranscript: sampleRef,
      userTranscription: '',
      durationSeconds: 30
    });

    expect(result.grossWpm).toBe(0);
    expect(result.netWpm).toBe(0);
    expect(result.accuracy).toBe(0);
    expect(result.correctWordsCount).toBe(0);
    expect(result.charactersTyped).toBe(0);
    expect(result.missingWordsCount).toBe(result.referenceWordCount);
  });

  it('handles very short sessions (< 2 seconds) gracefully without dividing by zero', () => {
    const result = evaluateTranscription({
      referenceTranscript: sampleRef,
      userTranscription: 'Hello',
      durationSeconds: 1
    });

    expect(result.grossWpm).toBe(0);
    expect(result.netWpm).toBe(0);
    expect(result.sessionDurationSec).toBe(1);
  });

  it('correctly deducts errors for Net WPM', () => {
    const textWithErrors = 'Hello my wrong name is someone totally wrong';
    const result = evaluateTranscription({
      referenceTranscript: sampleRef,
      userTranscription: textWithErrors,
      durationSeconds: 60
    });

    expect(result.grossWpm).toBeGreaterThan(0);
    expect(result.netWpm).toBeLessThanOrEqual(result.grossWpm);
    expect(result.totalErrors).toBeGreaterThan(0);
  });

  it('calculates live metrics during practice session', () => {
    const live = calculateLiveMetrics('Hello my name is', 10, sampleRef);
    expect(live.charactersTyped).toBe(16);
    expect(live.wordsTyped).toBe(4);
    expect(live.liveWpm).toBeGreaterThan(0);
    expect(live.liveAccuracy).toBeGreaterThan(50);
  });
});

describe('Audio Scenarios & Prerecorded Content Integrity', () => {
  it('has exactly 3 account categories', () => {
    expect(ACCOUNTS.length).toBe(3);
    const ids = ACCOUNTS.map((a) => a.id);
    expect(ids).toContain('insurance');
    expect(ids).toContain('ticketing');
    expect(ids).toContain('ecommerce');
  });

  it('each category contains at least two distinct voices', () => {
    for (const acc of ACCOUNTS) {
      const categoryVoices = VOICE_OPTIONS.filter((v) => v.accountCategory === acc.id);
      expect(categoryVoices.length).toBeGreaterThanOrEqual(2);

      const genders = categoryVoices.map((v) => v.gender);
      expect(genders).toContain('female');
      expect(genders).toContain('male');
    }
  });

  it('every scenario has a non-empty transcript and references a valid static audio file', () => {
    expect(SCENARIOS.length).toBe(6);

    for (const scenario of SCENARIOS) {
      expect(scenario.transcript.trim().length).toBeGreaterThan(20);
      expect(scenario.customerName.length).toBeGreaterThan(2);
      expect(scenario.keyDetails.length).toBeGreaterThan(0);

      const relativeAudioPath = scenario.audioUrl.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), 'public', relativeAudioPath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const stats = fs.statSync(fullPath);
      expect(stats.size).toBeGreaterThan(10000);
    }
  });
});

describe('Temporary Session Storage & Cleanup', () => {
  beforeEach(() => {
    clearCallTypeSessionData();
  });

  it('saves and retrieves temporary sessions in storage', () => {
    const sampleRecord: PracticeSessionRecord = {
      id: 'test-session-1',
      scenarioId: 'insurance-calm-female-01',
      scenarioTitle: 'Auto Claim Status',
      category: 'insurance',
      voiceName: 'Eleanor Vance',
      difficulty: 'beginner',
      mode: 'form',
      formEvaluation: {
        overallAccuracy: 95,
        totalFields: 10,
        correctCount: 9,
        partialCount: 1,
        incorrectCount: 0,
        missingCount: 0,
        fields: [],
        completionTimeSec: 35,
        charactersTyped: 180,
        typingWpm: 61
      },
      timestamp: Date.now()
    };

    saveSessionsToStorage([sampleRecord]);
    const loaded = loadSessionsFromStorage();
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('test-session-1');
  });

  it('centralized cleanup clears CallType session keys without affecting unrelated keys', () => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('other_app_key', 'keep_this_intact');
      saveSessionsToStorage([
        {
          id: 'temp-session',
          scenarioId: 'test',
          scenarioTitle: 'Test',
          category: 'insurance',
          voiceName: 'Test',
          difficulty: 'beginner',
          mode: 'form',
          timestamp: Date.now()
        }
      ]);

      clearCallTypeSessionData();

      expect(loadSessionsFromStorage()).toEqual([]);
      expect(window.sessionStorage.getItem('other_app_key')).toBe('keep_this_intact');
    }
  });
});
