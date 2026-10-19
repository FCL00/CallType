import { VoiceOption } from '../types';

export const VOICE_OPTIONS: VoiceOption[] = [
  // Insurance
  {
    id: 'voice-insurance-calm-female',
    name: 'Eleanor Vance',
    accountCategory: 'insurance',
    gender: 'female',
    tone: 'Calm and professional',
    speakingStyle: 'Clear, steady, and moderately paced',
    accent: 'American English (Standard)',
    description:
      'Articulate caller detailing auto accident circumstances, policy identifiers, and repair shop authorization terms.',
    avatarInitials: 'EV',
    avatarBg: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'voice-insurance-concerned-male',
    name: 'David Miller',
    accountCategory: 'insurance',
    gender: 'male',
    tone: 'Concerned but polite',
    speakingStyle: 'Natural conversational pacing with emotional gravity',
    accent: 'American English (Midwestern)',
    description:
      'Homeowner reporting sudden plumbing disaster, mitigation team dispatch, and seeking coverage verification under emergency repairs.',
    avatarInitials: 'DM',
    avatarBg: 'bg-teal-100 text-teal-800'
  },

  // Ticketing
  {
    id: 'voice-ticketing-energetic-male',
    name: 'Jordan Brooks',
    accountCategory: 'ticketing',
    gender: 'male',
    tone: 'Excited and energetic',
    speakingStyle: 'Fast and conversational with upbeat cadence',
    accent: 'American English (West Coast)',
    description:
      'High-tempo festival attendee verifying high-value multi-day pass barcodes and requesting urgent mobile wallet resend.',
    avatarInitials: 'JB',
    avatarBg: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'voice-ticketing-frustrated-female',
    name: 'Patricia Hayes',
    accountCategory: 'ticketing',
    gender: 'female',
    tone: 'Frustrated but respectful',
    speakingStyle: 'Natural pacing with crisp emphasis on important deadlines and seat codes',
    accent: 'American English (East Coast)',
    description:
      'Urgent caller missing theater orchestra passes ahead of tomorrow night curtain time, requiring immediate will-call coordination.',
    avatarInitials: 'PH',
    avatarBg: 'bg-rose-100 text-rose-800'
  },

  // E-commerce
  {
    id: 'voice-ecommerce-friendly-female',
    name: 'Sarah Jenkins',
    accountCategory: 'ecommerce',
    gender: 'female',
    tone: 'Friendly and relaxed',
    speakingStyle: 'Clear and conversational with pleasant cadence',
    accent: 'American English (Standard)',
    description:
      'Courteous shopper tracking kitchen appliance delivery window after witnessing delivery courier pass without drop-off.',
    avatarInitials: 'SJ',
    avatarBg: 'bg-sky-100 text-sky-800'
  },
  {
    id: 'voice-ecommerce-impatient-male',
    name: 'Marcus Reid',
    accountCategory: 'ecommerce',
    gender: 'male',
    tone: 'Impatient but polite',
    speakingStyle: 'Faster delivery with natural pauses and firm operational requirements',
    accent: 'American English (Urban)',
    description:
      'Time-sensitive professional reporting crushed monitor shipment and requesting instant replacement before returning damaged goods.',
    avatarInitials: 'MR',
    avatarBg: 'bg-indigo-100 text-indigo-800'
  }
];

export function getVoiceById(id: string): VoiceOption | undefined {
  return VOICE_OPTIONS.find((v) => v.id === id);
}

export function getVoicesByCategory(category: string): VoiceOption[] {
  return VOICE_OPTIONS.filter((v) => v.accountCategory === category);
}
