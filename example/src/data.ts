import type { Wallet } from './types';

/**
 * Domain data lives in the app. The design system has no idea what a budget is — it knows what a
 * wallet tile looks like.
 */
export const WALLETS: Wallet[] = [
  {
    id: 'budget-2',
    name: 'Budget 2',
    emoji: '\u{1F695}',
    category: 'Transportation',
    amount: 5000,
    meta: 'Monthly',
    percent: 50,
    chipValue: 5000,
  },
  {
    id: 'budget-1',
    name: 'Budget 1',
    emoji: '\u{1F695}',
    category: 'Transportation',
    amount: -110,
    meta: 'Monthly',
    percent: 0,
    chipValue: 10110,
    state: 'overBudget',
  },
  {
    id: 'savings-1',
    name: 'Savings 1',
    emoji: '\u{1F3D6}\uFE0F',
    category: 'Vacation',
    amount: 10000,
    meta: 'target 25,000',
    percent: 40,
    state: 'prioritySavings',
  },
  {
    id: 'savings-2',
    name: 'Savings 2',
    emoji: '\u{1F3E0}',
    category: 'Home',
    amount: 2000,
    meta: 'target 50,000',
    percent: 4,
    chipValue: 2000,
  },
];

export const PERIODS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'annually', label: 'Annually' },
];

export const QUICK_AMOUNTS = [50, 100, 500, 1000];
