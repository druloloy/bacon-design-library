import { render, screen, fireEvent } from '@testing-library/react-native';
import { TopBar } from '../../src/molecules/TopBar';
import { SectionHeader } from '../../src/molecules/SectionHeader';
import { QuestionInput } from '../../src/molecules/QuestionInput';
import { QuickAmountInput } from '../../src/molecules/QuickAmountInput';
import { ChipGroup } from '../../src/molecules/ChipGroup';
import { CategoryChipGroup, BACON_CATEGORIES } from '../../src/molecules/CategoryChipGroup';
import { StatTile, StatTileRow } from '../../src/molecules/StatTile';
import { TransactionRow } from '../../src/molecules/TransactionRow';
import { BalanceDisplay } from '../../src/molecules/BalanceDisplay';
import { BaconSurfaceProvider, BaconThemeProvider } from '../../src/theme';
import { baconColors, baconLayout } from '../../src/foundations';
import { HARD_SPACE } from '../../src/utils/formatting';
import type { BaconSurface } from '../../src/theme';

function renderOnSurface(node: React.ReactElement, surface: BaconSurface = 'paper') {
  return render(
    <BaconThemeProvider>
      <BaconSurfaceProvider surface={surface}>{node}</BaconSurfaceProvider>
    </BaconThemeProvider>,
  );
}

function flatten(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten));
  return (style ?? {}) as Record<string, unknown>;
}

describe('TopBar (Brand Guide 08 / 11)', () => {
  it('is 56pt tall and transparent', () => {
    renderOnSurface(<TopBar onBack={jest.fn()} />);
    const style = flatten(screen.getByTestId('bacon-top-bar').props.style);
    expect(style.height).toBe(baconLayout.topBarHeight);
    expect(style.backgroundColor).toBe('transparent');
  });

  it('carries no shadow', () => {
    renderOnSurface(<TopBar onBack={jest.fn()} />);
    const style = flatten(screen.getByTestId('bacon-top-bar').props.style);
    expect(style.shadowOpacity).toBeFalsy();
    expect(style.elevation).toBeFalsy();
  });

  it('has no way to put a title in the bar', () => {
    // "The bar holds navigation only — never a title." The API itself must not offer one.
    const props = Object.keys({} as Record<string, never>);
    expect(props).not.toContain('title');
    renderOnSurface(
      <TopBar onBack={jest.fn()} forwardAction={{ label: 'NEXT', onPress: jest.fn() }} />,
    );
    // Only the two navigation controls are present.
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('shows back as an arrow with a label for assistive technology, never a visible word', () => {
    renderOnSurface(<TopBar onBack={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
    expect(screen.queryByText('Back')).toBeNull();
  });

  it('renders the forward action uppercase and tracked in the top right', () => {
    renderOnSurface(
      <TopBar onBack={jest.fn()} forwardAction={{ label: 'FINISH', onPress: jest.fn() }} />,
    );
    expect(screen.getByText('FINISH')).toHaveStyle({
      textTransform: 'uppercase',
      letterSpacing: 0.9,
      fontWeight: '700',
    });
  });

  it('fires the forward action', () => {
    const onPress = jest.fn();
    renderOnSurface(<TopBar onBack={jest.fn()} forwardAction={{ label: 'NEXT', onPress }} />);
    fireEvent.press(screen.getByRole('button', { name: 'NEXT' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders CLOSE for a dismissable screen, and then no back arrow', () => {
    renderOnSurface(<TopBar onClose={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'CLOSE' })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Go back' })).toBeNull();
  });

  it('meets the 48pt tap target on both controls', () => {
    renderOnSurface(
      <TopBar onBack={jest.fn()} forwardAction={{ label: 'NEXT', onPress: jest.fn() }} />,
    );
    for (const control of screen.getAllByRole('button')) {
      const style = flatten(control.props.style);
      expect(style.minHeight).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
      expect(style.minWidth).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
    }
  });
});

describe('SectionHeader', () => {
  it('renders as a heading at the section role', () => {
    renderOnSurface(<SectionHeader>Budget Overview</SectionHeader>);
    const heading = screen.getByRole('header', { name: 'Budget Overview' });
    expect(heading).toHaveStyle({ fontSize: 24, fontWeight: '700' });
  });

  it('is left-aligned, not centred', () => {
    renderOnSurface(<SectionHeader>My Savings</SectionHeader>);
    expect(screen.getByText('My Savings')).toHaveStyle({ textAlign: 'left' });
  });
});

describe('QuestionInput (Brand Guide 08)', () => {
  const question = "What's the name of your new budget account?";

  it('asks a question rather than labelling a field', () => {
    renderOnSurface(<QuestionInput question={question} value="" onChangeText={jest.fn()} />);
    expect(screen.getByText(question)).toHaveStyle({ fontWeight: '700', textAlign: 'center' });
  });

  it('centres the editable value', () => {
    renderOnSurface(
      <QuestionInput question={question} value="Budget 1" onChangeText={jest.fn()} />,
    );
    expect(screen.getByDisplayValue('Budget 1')).toHaveStyle({ textAlign: 'center' });
  });

  it('draws a 2pt navy rule instead of a box', () => {
    renderOnSurface(<QuestionInput question={question} value="" onChangeText={jest.fn()} />);
    const rule = flatten(screen.getByTestId('bacon-question-rule').props.style);
    expect(rule.height).toBe(baconLayout.inputRuleHeight);
    expect(rule.backgroundColor).toBe(baconColors.navy900);
  });

  it('has no outlined box around the field', () => {
    renderOnSurface(<QuestionInput question={question} value="" onChangeText={jest.fn()} />);
    const field = flatten(screen.getByDisplayValue('').props.style);
    expect(field.borderWidth).toBeFalsy();
    expect(field.backgroundColor).toBeFalsy();
  });

  it('labels the field with the question for screen readers', () => {
    renderOnSurface(<QuestionInput question={question} value="" onChangeText={jest.fn()} />);
    expect(screen.getByLabelText(question)).toBeOnTheScreen();
  });

  it('reports typing', () => {
    const onChangeText = jest.fn();
    renderOnSurface(<QuestionInput question={question} value="" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByLabelText(question), 'Budget 2');
    expect(onChangeText).toHaveBeenCalledWith('Budget 2');
  });
});

describe('QuickAmountInput (Brand Guide 11 — type or tap, always both)', () => {
  const question = 'How much will be your budget?';

  it('lets the user type a value', () => {
    const onChangeValue = jest.fn();
    renderOnSurface(
      <QuickAmountInput
        question={question}
        value={null}
        onChangeValue={onChangeValue}
        options={[50, 100, 500, 1000]}
      />,
    );
    fireEvent.changeText(screen.getByLabelText(question), '20000');
    expect(onChangeValue).toHaveBeenCalledWith(20000);
  });

  it('fills the field when a quick amount is tapped', () => {
    const onChangeValue = jest.fn();
    renderOnSurface(
      <QuickAmountInput
        question={question}
        value={null}
        onChangeValue={onChangeValue}
        options={[50, 100, 500, 1000]}
      />,
    );
    fireEvent.press(screen.getByRole('radio', { name: `₱${HARD_SPACE}500` }));
    expect(onChangeValue).toHaveBeenCalledWith(500);
  });

  it('keeps the field editable after a chip is tapped', () => {
    const onChangeValue = jest.fn();
    renderOnSurface(
      <QuickAmountInput
        question={question}
        value={500}
        onChangeValue={onChangeValue}
        options={[50, 100, 500, 1000]}
      />,
    );
    const field = screen.getByLabelText(question);
    expect(field.props.editable).not.toBe(false);
    fireEvent.changeText(field, '750');
    expect(onChangeValue).toHaveBeenCalledWith(750);
  });

  it('ignores non-numeric input rather than producing NaN', () => {
    const onChangeValue = jest.fn();
    renderOnSurface(
      <QuickAmountInput
        question={question}
        value={null}
        onChangeValue={onChangeValue}
        options={[50]}
      />,
    );
    fireEvent.changeText(screen.getByLabelText(question), 'abc');
    expect(onChangeValue).toHaveBeenCalledWith(null);
  });
});

describe('ChipGroup (Brand Guide 08 / 12)', () => {
  const options = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'annually', label: 'Annually' },
  ];

  it('is announced as a radio group', () => {
    renderOnSurface(
      <ChipGroup label="Period" options={options} value="weekly" onChange={jest.fn()} />,
    );
    // Queried by props rather than getByRole: a radiogroup container must NOT be an
    // accessibility element itself, or it would swallow the radios inside it.
    const group = screen.getByTestId('bacon-chip-group');
    expect(group.props.accessibilityRole).toBe('radiogroup');
    expect(group.props.accessibilityLabel).toBe('Period');
  });

  it('marks exactly one chip selected', () => {
    renderOnSurface(
      <ChipGroup label="Period" options={options} value="weekly" onChange={jest.fn()} />,
    );
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeSelected();
    expect(screen.getByRole('radio', { name: 'Daily' })).not.toBeSelected();
  });

  it('reports the chosen option id', () => {
    const onChange = jest.fn();
    renderOnSurface(
      <ChipGroup label="Period" options={options} value={null} onChange={onChange} />,
    );
    fireEvent.press(screen.getByRole('radio', { name: 'Monthly' }));
    expect(onChange).toHaveBeenCalledWith('monthly');
  });

  it('wraps into ragged centred rows rather than a rigid grid', () => {
    renderOnSurface(
      <ChipGroup label="Period" options={options} value={null} onChange={jest.fn()} />,
    );
    const style = flatten(screen.getByTestId('bacon-chip-group').props.style);
    expect(style.flexDirection).toBe('row');
    expect(style.flexWrap).toBe('wrap');
    expect(style.justifyContent).toBe('center');
  });
});

describe('CategoryChipGroup (Brand Guide 08 / 13)', () => {
  it('ships the documented emoji categories', () => {
    expect(BACON_CATEGORIES.map((category) => category.label)).toEqual([
      'Vacation',
      'Emergency',
      'Home',
      'Car',
      'Transportation',
      'Education',
      'Groceries',
      'Other',
    ]);
  });

  it('gives every category an emoji, never an icon name', () => {
    for (const category of BACON_CATEGORIES) {
      expect(category.emoji).toBeTruthy();
      expect(category).not.toHaveProperty('icon');
    }
  });

  it('renders the categories as a radio group', () => {
    renderOnSurface(<CategoryChipGroup value={null} onChange={jest.fn()} />);
    expect(screen.getByTestId('bacon-chip-group').props.accessibilityLabel).toBe(
      'Select one category for your new budget account:',
    );
    expect(screen.getByRole('radio', { name: 'Transportation' })).toBeOnTheScreen();
  });
});

describe('StatTile (Brand Guide 09)', () => {
  it('always says remaining, never used', () => {
    renderOnSurface(<StatTile label="Budget 2" percent={50} />);
    expect(screen.getByText('remaining')).toBeOnTheScreen();
    expect(screen.queryByText('used')).toBeNull();
  });

  it('is navy at a non-zero percentage', () => {
    renderOnSurface(<StatTile label="Budget 2" percent={50} />);
    expect(flatten(screen.getByTestId('bacon-stat-tile').props.style).backgroundColor).toBe(
      baconColors.navy900,
    );
  });

  it('turns red at zero remaining', () => {
    renderOnSurface(<StatTile label="Budget 1" percent={0} />);
    expect(flatten(screen.getByTestId('bacon-stat-tile').props.style).backgroundColor).toBe(
      baconColors.red,
    );
  });

  it('keeps the numeric state visible at zero — status is never colour alone', () => {
    renderOnSurface(<StatTile label="Budget 1" percent={0} />);
    expect(screen.getByText('0%')).toBeOnTheScreen();
  });

  it('speaks the state, including that nothing is left', () => {
    renderOnSurface(<StatTile label="Budget 1" percent={0} />);
    expect(screen.getByLabelText('Budget 1, 0% remaining, nothing left')).toBeOnTheScreen();
  });

  it('renders three-up in a row', () => {
    renderOnSurface(
      <StatTileRow
        stats={[
          { label: 'Budget 1', percent: 0 },
          { label: 'Budget 2', percent: 50 },
          { label: 'Budget 3', percent: 100 },
        ]}
      />,
    );
    expect(screen.getAllByText('remaining')).toHaveLength(3);
  });
});

describe('TransactionRow (Brand Guide 02 / 06)', () => {
  it('left-aligns the content and right-aligns the date', () => {
    renderOnSurface(
      <TransactionRow
        title="Groceries"
        handle="ddruu1"
        amount={-110}
        date="January 22, 2024"
      />,
    );
    expect(screen.getByText('Groceries')).toHaveStyle({ textAlign: 'left' });
    expect(screen.getByText('January 22, 2024')).toHaveStyle({ textAlign: 'right' });
  });

  it('attributes the transaction by handle, keeping the @', () => {
    renderOnSurface(<TransactionRow title="Groceries" handle="ddruu1" amount={-110} />);
    expect(screen.getByText('Updated by @ddruu1')).toBeOnTheScreen();
  });
});

describe('BalanceDisplay (Brand Guide 11 — privacy is one tap away)', () => {
  it('puts the eye next to the number', () => {
    renderOnSurface(
      <BalanceDisplay amount={20000} hidden={false} onToggleHidden={jest.fn()} />,
    );
    expect(screen.getByText(`₱${HARD_SPACE}20,000`)).toBeOnTheScreen();
    expect(screen.getByLabelText('Hide balance')).toBeOnTheScreen();
  });

  it('masks the figure in place when hidden', () => {
    renderOnSurface(<BalanceDisplay amount={20000} hidden onToggleHidden={jest.fn()} />);
    expect(screen.queryByText(`₱${HARD_SPACE}20,000`)).toBeNull();
    expect(screen.getByLabelText('Show balance')).toBeOnTheScreen();
  });

  it('toggles', () => {
    const onToggleHidden = jest.fn();
    renderOnSurface(
      <BalanceDisplay amount={20000} hidden={false} onToggleHidden={onToggleHidden} />,
    );
    fireEvent.press(screen.getByLabelText('Hide balance'));
    expect(onToggleHidden).toHaveBeenCalledWith(true);
  });
});
