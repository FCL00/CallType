export type AccountCategory = 'insurance' | 'ticketing' | 'ecommerce';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type PracticeMode = 'full' | 'live' | 'form';

export interface Account {
  id: AccountCategory;
  name: string;
  title: string;
  description: string;
  badge: string;
  iconName: 'ShieldCheck' | 'Ticket' | 'ShoppingBag';
  color: string;
  accentBg: string;
  scenarioCount: number;
}

export interface VoiceOption {
  id: string;
  name: string;
  accountCategory: AccountCategory;
  gender: 'female' | 'male';
  tone: string;
  speakingStyle: string;
  accent: string;
  description: string;
  avatarInitials: string;
  avatarBg: string;
}

// Category-specific structured forms
export interface InsuranceFormData {
  customerName: string;
  policyNumber: string;
  claimReferenceNumber: string;
  insuranceType: string;
  dateOfIncident: string;
  reasonForCalling: string;
  customerConcern: string;
  actionRequired: string;
  callSummary: string;
  additionalNotes: string;
}

export interface TicketingFormData {
  customerName: string;
  orderReferenceNumber: string;
  eventName: string;
  eventDate: string;
  numberOfTickets: string;
  seatingSection: string;
  paymentStatus: string;
  reasonForCalling: string;
  issueReported: string;
  resolutionRequired: string;
  additionalNotes: string;
}

export interface EcommerceFormData {
  customerName: string;
  orderNumber: string;
  productName: string;
  purchaseDate: string;
  trackingNumber: string;
  deliveryStatus: string;
  reasonForCalling: string;
  customerConcern: string;
  requestedResolution: string;
  additionalNotes: string;
}

export type AnyCategoryFormData =
  | InsuranceFormData
  | TicketingFormData
  | EcommerceFormData;

export interface ExpectedFieldDefinition {
  key: string;
  label: string;
  expectedValue: string;
  required?: boolean;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: string[];
  keywords?: string[]; // key concepts for semantic/partial matching
  synonyms?: string[]; // alternative accepted phrases/formats
  hint?: string;
}

export interface Scenario {
  id: string;
  category: AccountCategory;
  voiceOptionId: string;
  title: string;
  difficulty: DifficultyLevel;
  durationEstimate: string;
  audioUrl: string;
  transcript: string;
  customerName: string;
  scenarioSummary: string;
  keyDetails: string[];
  expectedForm: Record<string, string>;
  fieldDefinitions: ExpectedFieldDefinition[];
}

export type FieldEvaluationStatus = 'correct' | 'partial' | 'incorrect' | 'missing';

export interface FieldEvaluation {
  fieldKey: string;
  fieldLabel: string;
  userValue: string;
  expectedValue: string;
  status: FieldEvaluationStatus;
  score: number; // 1 for correct, 0.5 for partial, 0 for incorrect/missing
  explanation: string;
}

export interface FormEvaluationResult {
  overallAccuracy: number; // percentage 0-100
  totalFields: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
  missingCount: number;
  fields: FieldEvaluation[];
  completionTimeSec: number;
  charactersTyped: number;
  typingWpm: number;
}

export type WordAlignmentType = 'correct' | 'incorrect' | 'missing' | 'extra';

export interface WordAlignment {
  id: string;
  type: WordAlignmentType;
  originalWord?: string;
  typedWord?: string;
  refIndex?: number;
  typedIndex?: number;
}

export interface ScoringResult {
  grossWpm: number;
  netWpm: number;
  accuracy: number; // percentage 0-100
  totalErrors: number;
  correctWordsCount: number;
  incorrectWordsCount: number;
  missingWordsCount: number;
  extraWordsCount: number;
  charactersTyped: number;
  referenceWordCount: number;
  typedWordCount: number;
  sessionDurationSec: number;
  wordAlignments: WordAlignment[];
}

export interface PracticeSessionRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  category: AccountCategory;
  voiceName: string;
  difficulty: DifficultyLevel;
  mode: PracticeMode;
  typedText?: string;
  score?: ScoringResult;
  formData?: Record<string, string>;
  formEvaluation?: FormEvaluationResult;
  timestamp: number;
}
