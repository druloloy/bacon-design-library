import { ChipGroup, type ChipOption } from './ChipGroup';

/**
 * The Bacon category system.
 *
 * BRAND GUIDE REQUIREMENT (13 — Misuse): "An icon set replacing the category emoji" is listed as
 * a way the system gets broken. Categories are emoji, and `ChipOption` has no `icon` field for a
 * well-meaning contributor to reach for.
 */
export const BACON_CATEGORIES: readonly ChipOption[] = [
  { id: 'vacation', label: 'Vacation', emoji: '\u{1F3D6}\uFE0F' },
  { id: 'emergency', label: 'Emergency', emoji: '\u{1F6A8}' },
  { id: 'home', label: 'Home', emoji: '\u{1F3E0}' },
  { id: 'car', label: 'Car', emoji: '\u{1F697}' },
  { id: 'transportation', label: 'Transportation', emoji: '\u{1F695}' },
  { id: 'education', label: 'Education', emoji: '\u{1F393}' },
  { id: 'groceries', label: 'Groceries', emoji: '\u{1F6D2}' },
  { id: 'other', label: 'Other', emoji: '\u{1F937}' },
] as const;

/** The guide's own wording for the category step (Brand Guide 02). */
export const CATEGORY_QUESTION = 'Select one category for your new budget account:';

export interface CategoryChipGroupProps {
  value: string | null;
  onChange: (id: string) => void;
  /** Override the category list only to add product categories, never to replace emoji with icons. */
  categories?: readonly ChipOption[];
  /** Override the question when the flow is about savings rather than a budget. */
  question?: string;
  testID?: string;
}

export function CategoryChipGroup({
  value,
  onChange,
  categories = BACON_CATEGORIES,
  question = CATEGORY_QUESTION,
  testID,
}: CategoryChipGroupProps): React.JSX.Element {
  return (
    <ChipGroup
      label={question}
      options={categories}
      value={value}
      onChange={onChange}
      testID={testID}
    />
  );
}
