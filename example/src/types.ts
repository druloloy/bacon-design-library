/** Application types. These belong to the app, not to the design system. */
export type Route = 'dashboard' | 'createName' | 'createAmount' | 'completion' | 'settings';

export interface Budget {
  name: string;
  category: string | null;
  amount: number | null;
  period: string | null;
}

export interface Wallet {
  id: string;
  name: string;
  emoji: string;
  category: string;
  amount: number;
  meta: string;
  percent: number;
  chipValue?: number;
  state?: 'normal' | 'overBudget' | 'prioritySavings';
}
