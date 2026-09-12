import { CategoryChipGroup, OneQuestionTemplate, QuestionInput } from '@bacon/design-system';
import type { Budget } from '../types';

/**
 * Archetype 2 — One question, step 1 of the create flow.
 *
 * "Creating a budget is three screens… Never collapse them into one form to save taps. The step
 * count is the feature." (Brand Guide 11)
 */
export function CreateBudgetNameScreen({
  draft,
  onChange,
  onBack,
  onNext,
}: {
  draft: Budget;
  onChange: (next: Budget) => void;
  onBack: () => void;
  onNext: () => void;
}): React.JSX.Element {
  const canAdvance = draft.name.trim().length > 0 && draft.category !== null;

  return (
    <OneQuestionTemplate
      title="Add New Budget"
      onBack={onBack}
      forwardAction={{ label: 'NEXT', onPress: onNext, disabled: !canAdvance }}
    >
      <QuestionInput
        question="What's the name of your new budget account?"
        value={draft.name}
        onChangeText={(name) => onChange({ ...draft, name })}
        autoFocus
      />
      <CategoryChipGroup
        value={draft.category}
        onChange={(category) => onChange({ ...draft, category })}
      />
    </OneQuestionTemplate>
  );
}
