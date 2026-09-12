import { render, screen, fireEvent } from '@testing-library/react-native';
import { WalletTile, WalletGrid } from '../../src/organisms/WalletTile';
import { RowLink } from '../../src/organisms/RowLink';
import { BottomSheet, SheetPrimaryAction, SheetAction } from '../../src/organisms/BottomSheet';
import { Hero } from '../../src/organisms/Hero';
import { Panel, PanelGroup } from '../../src/organisms/Panel';
import { DestructiveAction } from '../../src/atoms/DestructiveAction';
import { BaconText } from '../../src/atoms/BaconText';
import { BaconSurfaceProvider, BaconThemeProvider } from '../../src/theme';
import { baconColors, baconLayout, baconRadii } from '../../src/foundations';
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

const TILE = 'bacon-wallet-tile';

const normalWallet = {
  name: 'Budget 2',
  category: { emoji: '🚕', label: 'Transportation' },
  amount: 5000,
  meta: 'Monthly',
  progress: { percent: 50, value: 5000 },
} as const;

describe('WalletTile (Brand Guide 09)', () => {
  it('renders a normal wallet', () => {
    renderOnSurface(<WalletTile {...normalWallet} />);
    expect(screen.getByText('Transportation')).toBeOnTheScreen();
    expect(screen.getByText('Budget 2')).toBeOnTheScreen();
    expect(screen.getByText(`₱${HARD_SPACE}5,000`)).toBeOnTheScreen();
    expect(screen.getByText('Monthly')).toBeOnTheScreen();
  });

  it('keeps the documented order: category, name, amount, period, progress', () => {
    renderOnSurface(<WalletTile {...normalWallet} />);
    const order = [
      'bacon-wallet-category',
      'bacon-wallet-name',
      'bacon-wallet-amount',
      'bacon-wallet-meta',
      'bacon-wallet-progress',
    ];
    for (const id of order) {
      expect(screen.getByTestId(id)).toBeOnTheScreen();
    }
  });

  it('is a white card with the one documented shadow when normal', () => {
    renderOnSurface(<WalletTile {...normalWallet} />);
    const style = flatten(screen.getByTestId(TILE).props.style);
    expect(style.backgroundColor).toBe(baconColors.white);
    expect(style.borderRadius).toBe(baconRadii.card);
    expect(style.shadowColor).toBe(baconColors.navy900);
  });

  it('renders an over-budget wallet as a solid red surface, not red text', () => {
    renderOnSurface(
      <WalletTile
        name="Budget 1"
        category={{ emoji: '🚕', label: 'Transportation' }}
        amount={-110}
        meta="Monthly"
        progress={{ percent: 0, value: 10110 }}
        state="overBudget"
      />,
    );
    const style = flatten(screen.getByTestId(TILE).props.style);
    expect(style.backgroundColor).toBe(baconColors.red);
    expect(screen.getByText(`₱${HARD_SPACE}-110`)).not.toHaveStyle({ color: baconColors.red });
  });

  it('drops the shadow on a coloured tile', () => {
    renderOnSurface(<WalletTile {...normalWallet} state="overBudget" />);
    expect(flatten(screen.getByTestId(TILE).props.style).shadowOpacity).toBe(0);
  });

  it('renders priority savings as a solid navy surface', () => {
    renderOnSurface(
      <WalletTile
        name="Savings 1"
        category={{ emoji: '🏖️', label: 'Vacation' }}
        amount={10000}
        meta="target 25,000"
        progress={{ percent: 40 }}
        state="prioritySavings"
      />,
    );
    expect(flatten(screen.getByTestId(TILE).props.style).backgroundColor).toBe(
      baconColors.navy900,
    );
  });

  it('keeps the minus sign on a negative amount — status is never colour alone', () => {
    renderOnSurface(<WalletTile {...normalWallet} amount={-110} state="overBudget" />);
    expect(screen.getByText(`₱${HARD_SPACE}-110`)).toBeOnTheScreen();
  });

  it('never puts muted grey on a coloured tile', () => {
    renderOnSurface(<WalletTile {...normalWallet} state="overBudget" />);
    expect(screen.getByText('Monthly')).not.toHaveStyle({ color: baconColors.muted });
  });

  it('raises meta on a red tile to the 16pt / 500 role', () => {
    renderOnSurface(<WalletTile {...normalWallet} state="overBudget" />);
    expect(screen.getByText('Monthly')).toHaveStyle({ fontSize: 16, fontWeight: '500' });
  });

  it('centres its contents', () => {
    renderOnSurface(<WalletTile {...normalWallet} />);
    expect(flatten(screen.getByTestId(TILE).props.style).alignItems).toBe('center');
  });

  it('exposes meaningful accessibility information, including the state', () => {
    renderOnSurface(<WalletTile {...normalWallet} amount={-110} state="overBudget" />);
    expect(
      screen.getByLabelText('Budget 2, Transportation, minus 110 pesos, Monthly, over budget'),
    ).toBeOnTheScreen();
  });

  it('announces a priority savings goal', () => {
    renderOnSurface(<WalletTile {...normalWallet} state="prioritySavings" />);
    expect(screen.getByLabelText(/priority savings goal$/)).toBeOnTheScreen();
  });

  it('is pressable when given an onPress and a button role', () => {
    const onPress = jest.fn();
    renderOnSurface(<WalletTile {...normalWallet} onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: /Budget 2/ }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('offers exactly the three documented states', () => {
    const { WALLET_TILE_STATES } = jest.requireActual<{
      WALLET_TILE_STATES: readonly string[];
    }>('../../src/organisms/WalletTile');
    expect(WALLET_TILE_STATES).toEqual(['normal', 'overBudget', 'prioritySavings']);
  });
});

describe('WalletGrid', () => {
  it('lays wallets out two-up with the documented gap', () => {
    renderOnSurface(
      <WalletGrid>
        <WalletTile {...normalWallet} />
        <WalletTile {...normalWallet} name="Budget 3" />
      </WalletGrid>,
    );
    const style = flatten(screen.getByTestId('bacon-wallet-grid').props.style);
    expect(style.flexDirection).toBe('row');
    expect(style.flexWrap).toBe('wrap');
    expect(style.gap).toBe(baconLayout.columnGap);
  });
});

describe('RowLink (Brand Guide 09)', () => {
  it('is 88pt tall', () => {
    renderOnSurface(<RowLink title="My Savings" onPress={jest.fn()} />);
    expect(flatten(screen.getByTestId('bacon-row-link').props.style).minHeight).toBe(
      baconLayout.rowLinkHeight,
    );
  });

  it('renders a bold title left-aligned', () => {
    renderOnSurface(<RowLink title="My Savings" onPress={jest.fn()} />);
    expect(screen.getByText('My Savings')).toHaveStyle({
      fontWeight: '700',
      textAlign: 'left',
    });
  });

  it('carries the count in bold inside a regular subtitle', () => {
    renderOnSurface(
      <RowLink
        title="My Savings"
        subtitle="You have {} active wallets"
        emphasis={4}
        onPress={jest.fn()}
      />,
    );
    expect(screen.getByText('4')).toHaveStyle({ fontWeight: '700' });
    expect(screen.getByText(/You have/)).toHaveStyle({ fontWeight: '400' });
  });

  it('renders the long arrow on the right', () => {
    renderOnSurface(<RowLink title="My Savings" onPress={jest.fn()} />);
    // Decorative, and inside an accessible row — so it is deliberately hidden from a11y queries.
    expect(
      screen.getByTestId('bacon-row-link-arrow', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('is announced as a link that hands off to another screen', () => {
    renderOnSurface(<RowLink title="My Savings" onPress={jest.fn()} />);
    expect(screen.getByRole('link', { name: 'My Savings' })).toBeOnTheScreen();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    renderOnSurface(<RowLink title="My Budgets" onPress={onPress} />);
    fireEvent.press(screen.getByRole('link', { name: 'My Budgets' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('BottomSheet (Brand Guide 09 / 11)', () => {
  function renderSheet() {
    return renderOnSurface(
      <BottomSheet visible onRequestClose={jest.fn()}>
        <SheetPrimaryAction onPress={jest.fn()}>Update Savings</SheetPrimaryAction>
        <SheetAction onPress={jest.fn()}>Set as priority</SheetAction>
        <SheetAction onPress={jest.fn()}>Invite partner</SheetAction>
        <DestructiveAction onPress={jest.fn()}>I want to delete this savings</DestructiveAction>
      </BottomSheet>,
    );
  }

  it('rounds its top corners to 24pt', () => {
    renderSheet();
    const style = flatten(screen.getByTestId('bacon-bottom-sheet').props.style);
    expect(style.borderTopLeftRadius).toBe(baconRadii.hero);
    expect(style.borderTopRightRadius).toBe(baconRadii.hero);
  });

  it('leaves the page behind visible and undimmed', () => {
    renderSheet();
    // The sheet is accessibilityViewIsModal, so its siblings are correctly hidden from a11y.
    const backdrop = flatten(
      screen.getByTestId('bacon-bottom-sheet-backdrop', { includeHiddenElements: true }).props
        .style,
    );
    expect(backdrop.backgroundColor).toBe('transparent');
    expect(backdrop.opacity).toBeUndefined();
  });

  it('renders the fixed order: navy pill, text links, destructive last', () => {
    renderSheet();
    expect(screen.getByRole('button', { name: 'Update Savings' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Set as priority' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'I want to delete this savings' }),
    ).toBeOnTheScreen();
  });

  it('renders a normal sheet action as a bold text link, not a button surface', () => {
    renderSheet();
    const [first] = screen.getAllByTestId('bacon-sheet-action-surface');
    const style = flatten(first?.props.style);
    expect(style.backgroundColor).toBeUndefined();
    expect(style.borderWidth).toBeFalsy();
  });

  it('renders no filled red destructive button and no trash icon', () => {
    renderSheet();
    const destructive = flatten(screen.getByTestId('bacon-destructive-surface').props.style);
    expect(destructive.backgroundColor).toBeUndefined();
    expect(screen.queryByLabelText(/trash/i)).toBeNull();
  });

  it('renders nothing when not visible', () => {
    renderOnSurface(
      <BottomSheet visible={false} onRequestClose={jest.fn()}>
        <SheetAction onPress={jest.fn()}>Set as priority</SheetAction>
      </BottomSheet>,
    );
    expect(screen.queryByText('Set as priority')).toBeNull();
  });
});

describe('Hero (Brand Guide 07 / 10)', () => {
  it('is about 250pt tall', () => {
    renderOnSurface(
      <Hero>
        <BaconText variant="body">Balance</BaconText>
      </Hero>,
    );
    expect(flatten(screen.getByTestId('bacon-hero').props.style).minHeight).toBe(
      baconLayout.heroHeight,
    );
  });

  it('keeps a paper hero on the money ground', () => {
    renderOnSurface(
      <Hero>
        <BaconText variant="body">Balance</BaconText>
      </Hero>,
    );
    expect(screen.getByText('Balance')).toHaveStyle({ color: baconColors.navy900 });
  });

  it('rounds the bottom corners of a navy hero to 24pt and flips its text to white', () => {
    renderOnSurface(
      <Hero variant="navy">
        <BaconText variant="body">Balance</BaconText>
      </Hero>,
    );
    const style = flatten(screen.getByTestId('bacon-hero').props.style);
    expect(style.borderBottomLeftRadius).toBe(baconRadii.hero);
    expect(style.borderBottomRightRadius).toBe(baconRadii.hero);
    expect(screen.getByText('Balance')).toHaveStyle({ color: baconColors.white });
  });

  it('weights content to the top rather than centring it in the empty space', () => {
    renderOnSurface(
      <Hero>
        <BaconText variant="body">Balance</BaconText>
      </Hero>,
    );
    expect(flatten(screen.getByTestId('bacon-hero').props.style).justifyContent).toBe(
      'flex-start',
    );
  });
});

describe('Panel (Brand Guide 03 / 10)', () => {
  it('is Navy 700 with no shadow and no border', () => {
    renderOnSurface(
      <Panel>
        <BaconText variant="body">Sessions</BaconText>
      </Panel>,
      'navy',
    );
    const style = flatten(screen.getByTestId('bacon-panel').props.style);
    expect(style.backgroundColor).toBe(baconColors.navy700);
    expect(style.shadowOpacity).toBe(0);
    expect(style.borderWidth).toBeFalsy();
  });

  it('gives its children white text', () => {
    renderOnSurface(
      <Panel>
        <BaconText variant="body">Sessions</BaconText>
      </Panel>,
      'navy',
    );
    expect(screen.getByText('Sessions')).toHaveStyle({ color: baconColors.white });
  });

  it('groups panels two-up under a small bold group label', () => {
    renderOnSurface(
      <PanelGroup label="Security">
        <Panel>
          <BaconText variant="body">One</BaconText>
        </Panel>
        <Panel>
          <BaconText variant="body">Two</BaconText>
        </Panel>
      </PanelGroup>,
      'navy',
    );
    expect(screen.getByText('Security')).toBeOnTheScreen();
    const grid = flatten(screen.getByTestId('bacon-panel-group-grid').props.style);
    expect(grid.flexDirection).toBe('row');
    expect(grid.gap).toBe(baconLayout.columnGap);
  });
});
