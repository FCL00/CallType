import { Account } from '../types';

export const ACCOUNTS: Account[] = [
  {
    id: 'insurance',
    name: 'Insurance Support',
    title: 'Policy, Claims & Coverage Inquiries',
    description:
      'Practice listening to policyholders navigating auto claims, deductible verification, water damage coverage, and restoration documentation.',
    badge: 'Claims & Underwriting',
    iconName: 'ShieldCheck',
    color: 'emerald',
    accentBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    scenarioCount: 3
  },
  {
    id: 'ticketing',
    name: 'Ticketing & Events',
    title: 'Box Office, Passes & Order Support',
    description:
      'Handle fast-paced inquiries about music festival wristbands, Broadway seat assignments, missing barcode emails, and urgent will-call pickups.',
    badge: 'Live Entertainment',
    iconName: 'Ticket',
    color: 'amber',
    accentBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
    scenarioCount: 3
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Support',
    title: 'Orders, Couriers & Returns',
    description:
      'Transcribe customer calls regarding out-for-delivery packages, damaged high-value electronics, return authorization labels, and instant replacements.',
    badge: 'Retail Operations',
    iconName: 'ShoppingBag',
    color: 'blue',
    accentBg: 'bg-blue-500/10 text-blue-700 border-blue-200',
    scenarioCount: 3
  }
];

export function getAccountById(category: string): Account | undefined {
  return ACCOUNTS.find((acc) => acc.id === category);
}
