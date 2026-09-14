import { ChipGroup, OneQuestionTemplate, QuickAmountInput } from '@druloloy/bacon-ui';
import { PERIODS, QUICK_AMOUNTS } from '../data';
import type { Budget } from '../types';

/**
 * Archetype 2 — One question, step 2. FINISH lives in the top bar, never in a bottom button.
 */
export function CreateBudgetAmountScreen({
  draft,
  onChange,
  onBack,
  onFinish,
}: {
  draft: Budget;
  onChange: (next: Budget) => void;
  onBack: () => void;
  onFinish: () => void;
}): React.JSX.Element {
  const canFinish = draft.amount !== null && draft.amount > 0 && draft.period !== null;

  return (
    <OneQuestionTemplate
      title="Add New Budget"
      onBack={onBack}
      forwardAction={{ label: 'FINISH', onPress: onFinish, disabled: !canFinish }}
    >
      <QuickAmountInput
        question="How much will be your budget?"
        value={draft.amount}
        onChangeValue={(amount) => onChange({ ...draft, amount })}
        options={QUICK_AMOUNTS}
        autoFocus
      />
      <ChipGroup
        label="How often does it reset?"
        options={PERIODS}
        value={draft.period}
        onChange={(period) => onChange({ ...draft, period })}
      />
    </OneQuestionTemplate>
  );
}
