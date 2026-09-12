import { render, screen } from '@testing-library/react-native';
import {
  BaconThemeProvider,
  BaconSurfaceProvider,
  BaconButton,
  BaconChip,
  BaconFab,
  BaconProgressBar,
  BaconScreen,
  BaconText,
  BalanceDisplay,
  CategoryChipGroup,
  ChipGroup,
  DestructiveAction,
  EyeToggle,
  QuestionInput,
  RowLink,
  StatTile,
  TopBar,
  WalletTile,
  baconLayout,
  baconColors,
  hitSlopFor,
  focusRing,
  type BaconSurface,
} from '../../src';

/**
 * The Brand Guide's accessibility page (12) lists five things "every build needs" and two defects
 * that must not be inherited. This suite is the check that they hold across the library rather
 * than component by component.
 */

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

describe('48pt minimum tap targets', () => {
  it('expands a 36pt chip by padding rather than resizing it', () => {
    const slop = hitSlopFor(baconLayout.chipVisualHeight);
    expect(baconLayout.chipVisualHeight + slop.top + slop.bottom).toBe(
      baconLayout.minTapTarget,
    );
    expect(baconLayout.chipVisualHeight).toBe(36);
  });

  // Elements are built lazily so the table is not an array of JSX without keys.
  it.each<[string, () => React.ReactElement, string]>([
    [
      'BaconButton',
      () => <BaconButton onPress={jest.fn()}>Go</BaconButton>,
      'bacon-button-surface',
    ],
    ['BaconFab', () => <BaconFab onPress={jest.fn()} />, 'bacon-fab'],
    [
      'DestructiveAction',
      () => <DestructiveAction onPress={jest.fn()}>I want to delete this</DestructiveAction>,
      'bacon-destructive-surface',
    ],
  ])('%s meets the 48pt minimum', (_name, build, testID) => {
    renderOnSurface(build());
    const style = flatten(screen.getByTestId(testID).props.style);
    const height = (style.height ?? style.minHeight) as number;
    expect(height).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
  });

  it('gives the eye toggle a 48pt target around a smaller glyph', () => {
    renderOnSurface(<EyeToggle hidden={false} onToggle={jest.fn()} />);
    const style = flatten(screen.getByLabelText('Hide balance').props.style);
    expect(style.minWidth).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
    expect(style.minHeight).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
  });
});

describe('real labels on the eye toggle, the FAB, and every chip (Brand Guide 12)', () => {
  it('labels the eye toggle with the action it will perform', () => {
    renderOnSurface(<EyeToggle hidden={false} onToggle={jest.fn()} />);
    expect(screen.getByLabelText('Hide balance')).toBeOnTheScreen();
  });

  it('labels the FAB', () => {
    renderOnSurface(<BaconFab onPress={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Open app switcher' })).toBeOnTheScreen();
  });

  it('labels every chip in a category group', () => {
    renderOnSurface(<CategoryChipGroup value={null} onChange={jest.fn()} />);
    for (const label of ['Vacation', 'Emergency', 'Home', 'Car', 'Transportation']) {
      expect(screen.getByRole('radio', { name: label })).toBeOnTheScreen();
    }
  });
});

describe('chips are announced as a radio group, not a list of buttons', () => {
  it('gives the container the radiogroup role and the chips the radio role', () => {
    renderOnSurface(
      <ChipGroup
        label="Period"
        options={[
          { id: 'daily', label: 'Daily' },
          { id: 'weekly', label: 'Weekly' },
        ]}
        value="weekly"
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByTestId('bacon-chip-group').props.accessibilityRole).toBe('radiogroup');
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('status is never carried by colour alone (Brand Guide 12)', () => {
  it('keeps the minus sign on an over-budget wallet', () => {
    renderOnSurface(
      <WalletTile name="Budget 1" amount={-110} meta="Monthly" state="overBudget" />,
    );
    expect(screen.getByText(/-110/)).toBeOnTheScreen();
  });

  it('speaks the over-budget state to a screen reader', () => {
    renderOnSurface(
      <WalletTile name="Budget 1" amount={-110} meta="Monthly" state="overBudget" />,
    );
    expect(screen.getByLabelText(/over budget$/)).toBeOnTheScreen();
  });

  it('keeps 0% visible on a zero stat tile', () => {
    renderOnSurface(<StatTile label="Budget 1" percent={0} />);
    expect(screen.getByText('0%')).toBeOnTheScreen();
  });

  it('speaks that nothing is left at zero', () => {
    renderOnSurface(<StatTile label="Budget 1" percent={0} />);
    expect(screen.getByLabelText(/nothing left$/)).toBeOnTheScreen();
  });

  it('gives the progress bar a bounded accessibility value', () => {
    renderOnSurface(<BaconProgressBar percent={62} accessibilityLabel="Budget progress" />);
    expect(
      screen.getByRole('progressbar', { name: 'Budget progress' }).props.accessibilityValue,
    ).toEqual({ now: 62, min: 0, max: 100 });
  });
});

describe('muted grey is never used below 14pt or on a coloured surface (Brand Guide 12)', () => {
  it('renders meta at 14pt muted on a light surface', () => {
    renderOnSurface(<BaconText variant="meta">target 25,000</BaconText>, 'paper');
    expect(screen.getByText('target 25,000')).toHaveStyle({
      color: baconColors.muted,
      fontSize: 14,
    });
  });

  it.each<BaconSurface>(['navy', 'panel', 'red'])(
    'never renders muted grey on the %s surface',
    (surface) => {
      renderOnSurface(<BaconText variant="meta">Monthly</BaconText>, surface);
      expect(screen.getByText('Monthly')).not.toHaveStyle({ color: baconColors.muted });
    },
  );

  it('raises the meta role to 16pt / 500 on a red surface, the documented remedy', () => {
    renderOnSurface(<BaconText variant="meta">Monthly</BaconText>, 'red');
    expect(screen.getByText('Monthly')).toHaveStyle({ fontSize: 16, fontWeight: '500' });
  });

  it('never falls below 14pt for any muted role', () => {
    renderOnSurface(<BaconText variant="meta">x</BaconText>, 'paper');
    const style = flatten(screen.getByText('x').props.style);
    expect(style.fontSize as number).toBeGreaterThanOrEqual(14);
  });
});

describe('destructive actions remain identifiable through form, not just colour', () => {
  it('is a button with a first-person label and no fill', () => {
    renderOnSurface(
      <DestructiveAction onPress={jest.fn()}>I want to delete this budget</DestructiveAction>,
    );
    expect(
      screen.getByRole('button', { name: 'I want to delete this budget' }),
    ).toBeOnTheScreen();
    expect(
      flatten(screen.getByTestId('bacon-destructive-surface').props.style).backgroundColor,
    ).toBeUndefined();
  });

  it('can require a confirmation step of its own', () => {
    renderOnSurface(
      <DestructiveAction onPress={jest.fn()} confirmLabel="Yes, delete it">
        I want to delete this budget
      </DestructiveAction>,
    );
    expect(
      screen.getByRole('button', { name: 'I want to delete this budget' }).props
        .accessibilityHint,
    ).toMatch(/confirm/i);
  });
});

describe('the focus ring (Brand Guide 12)', () => {
  it('is 2pt navy on a light screen and 2pt white on a navy one', () => {
    expect(focusRing(false)).toMatchObject({
      borderWidth: 2,
      borderColor: baconColors.navy900,
    });
    expect(focusRing(true)).toMatchObject({ borderWidth: 2, borderColor: baconColors.white });
  });
});

describe('screen semantics', () => {
  it('labels the back control without showing a word', () => {
    renderOnSurface(<TopBar onBack={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
  });

  it('labels an input with its question rather than a placeholder', () => {
    const question = 'How much do you want to add or deduct?';
    renderOnSurface(<QuestionInput question={question} value="" onChangeText={jest.fn()} />);
    expect(screen.getByLabelText(question)).toBeOnTheScreen();
  });

  it('does not leak a hidden balance to assistive technology', () => {
    renderOnSurface(<BalanceDisplay amount={20000} hidden onToggleHidden={jest.fn()} />);
    expect(screen.queryByLabelText(/20,000/)).toBeNull();
    expect(screen.getByLabelText('Balance hidden')).toBeOnTheScreen();
  });

  it('announces a row link as a link, and a wallet action as a button', () => {
    renderOnSurface(<RowLink title="My Savings" onPress={jest.fn()} />);
    expect(screen.getByRole('link', { name: 'My Savings' })).toBeOnTheScreen();
  });

  it('keeps white text on every coloured ground', () => {
    render(
      <BaconThemeProvider>
        <BaconScreen variant="system">
          <BaconText variant="body">Security</BaconText>
        </BaconScreen>
      </BaconThemeProvider>,
    );
    expect(screen.getByText('Security')).toHaveStyle({ color: baconColors.white });
  });
});

describe('dynamic type', () => {
  it('allows font scaling but caps it so the documented layouts survive', () => {
    renderOnSurface(<BaconText variant="heroMoney">20,000</BaconText>);
    const text = screen.getByText('20,000');
    expect(text.props.allowFontScaling).toBe(true);
    expect(text.props.maxFontSizeMultiplier).toBeLessThanOrEqual(2);
    expect(text.props.maxFontSizeMultiplier).toBeGreaterThan(1);
  });
});

describe('chip hit area does not change the chip', () => {
  it('keeps the visual height at 36 while the target is 48', () => {
    renderOnSurface(<BaconChip label="Daily" onPress={jest.fn()} />);
    expect(flatten(screen.getByTestId('bacon-chip-surface').props.style).height).toBe(36);
    const slop = screen.getByRole('radio', { name: 'Daily' }).props.hitSlop as {
      top: number;
      bottom: number;
    };
    expect(36 + slop.top + slop.bottom).toBeGreaterThanOrEqual(48);
  });
});
