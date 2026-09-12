import { render, screen, fireEvent } from '@testing-library/react-native';
import { BaconMoneyDisplay } from '../../src/atoms/BaconMoneyDisplay';
import { EyeToggle } from '../../src/atoms/EyeToggle';
import { BaconFab } from '../../src/atoms/BaconFab';
import { DestructiveAction } from '../../src/atoms/DestructiveAction';
import { BaconScreen } from '../../src/atoms/BaconScreen';
import { BaconText } from '../../src/atoms/BaconText';
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

describe('BaconMoneyDisplay', () => {
  it('renders the guide format with a hard space', () => {
    renderOnSurface(<BaconMoneyDisplay amount={20000} />);
    expect(screen.getByText(`₱${HARD_SPACE}20,000`)).toBeOnTheScreen();
  });

  it('renders the hero role at 44 / 700 — money is the headline', () => {
    renderOnSurface(<BaconMoneyDisplay amount={20000} variant="hero" />);
    expect(screen.getByText(`₱${HARD_SPACE}20,000`)).toHaveStyle({
      fontSize: 44,
      fontWeight: '700',
    });
  });

  it('trails a change in Regular weight so the amount stays dominant', () => {
    renderOnSurface(<BaconMoneyDisplay amount={2000} change={50} />);
    expect(screen.getByText('+50')).toHaveStyle({ fontWeight: '400' });
    expect(screen.getByText(`₱${HARD_SPACE}2,000`)).toHaveStyle({ fontWeight: '700' });
  });

  it('keeps the minus sign on a negative balance', () => {
    renderOnSurface(<BaconMoneyDisplay amount={-110} />);
    expect(screen.getByText(`₱${HARD_SPACE}-110`)).toBeOnTheScreen();
  });

  it('masks in place without collapsing the row', () => {
    renderOnSurface(<BaconMoneyDisplay amount={20000} masked />);
    expect(screen.queryByText(`₱${HARD_SPACE}20,000`)).toBeNull();
    expect(screen.getByText(/•/)).toBeOnTheScreen();
  });

  it('does not leak the amount to a screen reader while masked', () => {
    renderOnSurface(<BaconMoneyDisplay amount={20000} masked />);
    expect(screen.queryByLabelText(/20,000/)).toBeNull();
    expect(screen.getByLabelText('Balance hidden')).toBeOnTheScreen();
  });

  it('speaks the amount in words when visible', () => {
    renderOnSurface(<BaconMoneyDisplay amount={-110} />);
    expect(screen.getByLabelText('minus 110 pesos')).toBeOnTheScreen();
  });
});

describe('EyeToggle', () => {
  it('exposes a real accessible label, not a bare icon', () => {
    renderOnSurface(<EyeToggle hidden={false} onToggle={jest.fn()} />);
    expect(screen.getByLabelText('Hide balance')).toBeOnTheScreen();
  });

  it('changes its label with its state', () => {
    renderOnSurface(<EyeToggle hidden onToggle={jest.fn()} />);
    expect(screen.getByLabelText('Show balance')).toBeOnTheScreen();
  });

  it('reports its state to assistive technology', () => {
    renderOnSurface(<EyeToggle hidden onToggle={jest.fn()} />);
    expect(screen.getByLabelText('Show balance')).toBeChecked();
  });

  it('reports the next state deterministically on toggle', () => {
    const onToggle = jest.fn();
    renderOnSurface(<EyeToggle hidden={false} onToggle={onToggle} />);
    fireEvent.press(screen.getByLabelText('Hide balance'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('meets the 48pt tap target', () => {
    renderOnSurface(<EyeToggle hidden={false} onToggle={jest.fn()} />);
    const style = flatten(screen.getByLabelText('Hide balance').props.style);
    expect(style.minWidth).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
    expect(style.minHeight).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
  });
});

describe('BaconFab', () => {
  it('is a 56pt navy circle', () => {
    renderOnSurface(<BaconFab onPress={jest.fn()} />);
    const style = flatten(screen.getByTestId('bacon-fab').props.style);
    expect(style.width).toBe(baconLayout.fabSize);
    expect(style.height).toBe(baconLayout.fabSize);
    expect(style.backgroundColor).toBe(baconColors.navy900);
    expect(style.borderRadius).toBeGreaterThanOrEqual(baconLayout.fabSize / 2);
  });

  it('draws the 2x2 grid glyph as four squares', () => {
    renderOnSurface(<BaconFab onPress={jest.fn()} />);
    expect(screen.getAllByTestId('bacon-fab-glyph-cell')).toHaveLength(4);
  });

  it('carries a real accessible label and a button role', () => {
    renderOnSurface(<BaconFab onPress={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Open app switcher' })).toBeOnTheScreen();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    renderOnSurface(<BaconFab onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Open app switcher' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('DestructiveAction (Brand Guide 04 / 11)', () => {
  it('renders as bare bold red text, never a filled button', () => {
    renderOnSurface(
      <DestructiveAction onPress={jest.fn()}>I want to delete this budget</DestructiveAction>,
    );
    const label = screen.getByText('I want to delete this budget');
    expect(label).toHaveStyle({ color: baconColors.red, fontWeight: '700' });
    const surfaceStyle = flatten(screen.getByTestId('bacon-destructive-surface').props.style);
    expect(surfaceStyle.backgroundColor).toBeUndefined();
    expect(surfaceStyle.borderWidth).toBeFalsy();
  });

  it('is identifiable by form as well as colour — it is a button with a first-person label', () => {
    renderOnSurface(
      <DestructiveAction onPress={jest.fn()}>I want to delete this savings</DestructiveAction>,
    );
    expect(
      screen.getByRole('button', { name: 'I want to delete this savings' }),
    ).toBeOnTheScreen();
  });

  it('meets the 48pt tap target', () => {
    renderOnSurface(
      <DestructiveAction onPress={jest.fn()}>I want to delete this budget</DestructiveAction>,
    );
    const style = flatten(screen.getByTestId('bacon-destructive-surface').props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(baconLayout.minTapTarget);
  });

  it('fires immediately when no confirmation step is configured', () => {
    const onPress = jest.fn();
    renderOnSurface(<DestructiveAction onPress={onPress}>Delete</DestructiveAction>);
    fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('takes a confirmation step of its own when one is given', () => {
    const onPress = jest.fn();
    renderOnSurface(
      <DestructiveAction onPress={onPress} confirmLabel="Yes, delete it">
        I want to delete this budget
      </DestructiveAction>,
    );
    fireEvent.press(screen.getByRole('button', { name: 'I want to delete this budget' }));
    expect(onPress).not.toHaveBeenCalled();
    fireEvent.press(screen.getByRole('button', { name: 'Yes, delete it' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('BaconScreen (Brand Guide 04)', () => {
  it('paints Paper for a money screen', () => {
    render(
      <BaconThemeProvider>
        <BaconScreen variant="money">
          <BaconText variant="body">Dashboard</BaconText>
        </BaconScreen>
      </BaconThemeProvider>,
    );
    expect(flatten(screen.getByTestId('bacon-screen').props.style).backgroundColor).toBe(
      baconColors.paper,
    );
  });

  it('paints Navy for a system screen', () => {
    render(
      <BaconThemeProvider>
        <BaconScreen variant="system">
          <BaconText variant="body">Settings</BaconText>
        </BaconScreen>
      </BaconThemeProvider>,
    );
    expect(flatten(screen.getByTestId('bacon-screen').props.style).backgroundColor).toBe(
      baconColors.navy900,
    );
  });

  it('propagates its ground so children pick legal colours without being told', () => {
    render(
      <BaconThemeProvider>
        <BaconScreen variant="system">
          <BaconText variant="body">Security</BaconText>
        </BaconScreen>
      </BaconThemeProvider>,
    );
    expect(screen.getByText('Security')).toHaveStyle({ color: baconColors.white });
  });

  it('applies the 20pt gutter on both sides', () => {
    render(
      <BaconThemeProvider>
        <BaconScreen variant="money">
          <BaconText variant="body">Dashboard</BaconText>
        </BaconScreen>
      </BaconThemeProvider>,
    );
    expect(
      flatten(screen.getByTestId('bacon-screen-content').props.style).paddingHorizontal,
    ).toBe(baconLayout.gutter);
  });

  it('stops growing at the documented maximum content width', () => {
    render(
      <BaconThemeProvider>
        <BaconScreen variant="money">
          <BaconText variant="body">Dashboard</BaconText>
        </BaconScreen>
      </BaconThemeProvider>,
    );
    expect(flatten(screen.getByTestId('bacon-screen-content').props.style).maxWidth).toBe(
      baconLayout.maxContentWidth,
    );
  });

  it('offers exactly two variants — background is semantic, not a styling choice', () => {
    const { BACON_SCREEN_VARIANTS } = jest.requireActual<{
      BACON_SCREEN_VARIANTS: readonly string[];
    }>('../../src/atoms/BaconScreen');
    expect(BACON_SCREEN_VARIANTS).toEqual(['money', 'system']);
  });
});
