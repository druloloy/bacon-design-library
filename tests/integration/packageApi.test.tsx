import { render, screen } from '@testing-library/react-native';

/**
 * The package-consumer test.
 *
 * Everything here imports through the package specifier, exactly as a consuming app would. It
 * catches the class of problem that unit tests never see: a component implemented and tested but
 * never exported, a type exported only from an internal path, or an entry point that resolves to
 * the wrong file.
 */
import {
  BaconThemeProvider,
  BaconScreen,
  BaconText,
  BaconButton,
  BaconChip,
  BaconMoneyDisplay,
  BaconProgressBar,
  BaconFab,
  BaconArrow,
  EyeToggle,
  DestructiveAction,
  QuestionInput,
  QuickAmountInput,
  CategoryChipGroup,
  ChipGroup,
  TopBar,
  SectionHeader,
  StatTile,
  StatTileRow,
  TransactionRow,
  BalanceDisplay,
  WalletTile,
  WalletGrid,
  RowLink,
  BottomSheet,
  SheetPrimaryAction,
  SheetAction,
  Hero,
  Panel,
  PanelGroup,
  HeroFeedTemplate,
  OneQuestionTemplate,
  NavyStackTemplate,
  CompletionTemplate,
  baconTokens,
  baconColors,
  baconTypography,
  baconSpacing,
  baconRadii,
  baconLayout,
  baconIllustrationColors,
  formatMoney,
  formatMoneyChange,
  createBaconTheme,
  useBaconTheme,
  useBaconSurface,
  BACON_BUTTON_VARIANTS,
  BACON_SCREEN_VARIANTS,
  WALLET_TILE_STATES,
  BACON_CATEGORIES,
} from '@druloloy/bacon-ui';
import type {
  BaconTheme,
  BaconSurface,
  BaconTextVariant,
  BaconButtonVariant,
  WalletTileState,
  WalletTileProps,
  RowLinkProps,
  CompletionLink,
  BaconCurrency,
  BaconFontWeight,
} from '@druloloy/bacon-ui';

describe('the public API', () => {
  it('exports every component a consuming app needs', () => {
    const publicComponents = [
      BaconThemeProvider,
      BaconScreen,
      BaconText,
      BaconButton,
      BaconChip,
      BaconMoneyDisplay,
      BaconProgressBar,
      BaconFab,
      BaconArrow,
      EyeToggle,
      DestructiveAction,
      QuestionInput,
      QuickAmountInput,
      CategoryChipGroup,
      ChipGroup,
      TopBar,
      SectionHeader,
      StatTile,
      StatTileRow,
      TransactionRow,
      BalanceDisplay,
      WalletTile,
      WalletGrid,
      RowLink,
      BottomSheet,
      SheetPrimaryAction,
      SheetAction,
      Hero,
      Panel,
      PanelGroup,
      HeroFeedTemplate,
      OneQuestionTemplate,
      NavyStackTemplate,
      CompletionTemplate,
    ];
    for (const component of publicComponents) {
      expect(typeof component).toBe('function');
    }
  });

  it('exports the token set and the formatting utilities', () => {
    expect(baconTokens.colors.navy900).toBe('#132058');
    expect(baconColors.red).toBe('#DE0A26');
    expect(baconTypography.heroMoney.fontSize).toBe(44);
    expect(baconSpacing.screen).toBe(20);
    expect(baconRadii.card).toBe(16);
    expect(baconLayout.minTapTarget).toBe(48);
    expect(formatMoney(20000)).toContain('20,000');
    expect(formatMoneyChange(2000, 50)).toContain('+50');
    expect(typeof createBaconTheme).toBe('function');
    expect(typeof useBaconTheme).toBe('function');
    expect(typeof useBaconSurface).toBe('function');
  });

  it('exports illustration accents separately from the UI palette', () => {
    expect(baconIllustrationColors.violet).toBe('#7B5FF1');
    expect(Object.values(baconColors)).not.toContain(baconIllustrationColors.violet);
  });

  it('exports the closed variant unions as runtime values, so apps can enumerate them', () => {
    expect(BACON_BUTTON_VARIANTS).toEqual(['primary', 'secondary']);
    expect(BACON_SCREEN_VARIANTS).toEqual(['money', 'system']);
    expect(WALLET_TILE_STATES).toEqual(['normal', 'overBudget', 'prioritySavings']);
    expect(BACON_CATEGORIES.length).toBe(8);
  });

  it('exports the types a consuming app needs to write its own props', () => {
    // Compile-time assertions: this test fails at typecheck if any type stops being exported.
    const theme: BaconTheme = createBaconTheme();
    const surface: BaconSurface = 'paper';
    const variant: BaconTextVariant = 'pageTitle';
    const buttonVariant: BaconButtonVariant = 'primary';
    const state: WalletTileState = 'overBudget';
    const weight: BaconFontWeight = '700';
    const currency: BaconCurrency = { symbol: '₱', name: 'pesos', fractionDigits: 2 };
    const wallet: WalletTileProps = { name: 'Budget 1', amount: 0 };
    const row: RowLinkProps = { title: 'My Savings', onPress: () => undefined };
    const link: CompletionLink = { title: 'My Budgets', onPress: () => undefined };

    expect(theme.tokens.colors.navy900).toBe('#132058');
    expect([surface, variant, buttonVariant, state, weight]).toHaveLength(5);
    expect(currency.symbol).toBe('₱');
    expect(wallet.name).toBe('Budget 1');
    expect(row.title).toBe('My Savings');
    expect(link.title).toBe('My Budgets');
  });
});

describe('a consuming app can compose a screen from the package alone', () => {
  it('renders a money screen without reaching into internal paths', () => {
    render(
      <BaconThemeProvider>
        <HeroFeedTemplate
          hero={
            <BalanceDisplay amount={20000} hidden={false} onToggleHidden={() => undefined} />
          }
          onFabPress={() => undefined}
        >
          <SectionHeader>Budget Overview</SectionHeader>
          <StatTileRow
            stats={[
              { label: 'Budget 1', percent: 0 },
              { label: 'Budget 2', percent: 50 },
              { label: 'Budget 3', percent: 100 },
            ]}
          />
          <WalletGrid>
            <WalletTile
              name="Budget 2"
              category={{ emoji: '🚕', label: 'Transportation' }}
              amount={5000}
              meta="Monthly"
              progress={{ percent: 50, value: 5000 }}
            />
            <WalletTile
              name="Budget 1"
              category={{ emoji: '🚕', label: 'Transportation' }}
              amount={-110}
              meta="Monthly"
              progress={{ percent: 0, value: 10110 }}
              state="overBudget"
            />
          </WalletGrid>
          <RowLink
            title="My Savings"
            subtitle="You have {} active wallets"
            emphasis={4}
            onPress={() => undefined}
          />
        </HeroFeedTemplate>
      </BaconThemeProvider>,
    );

    expect(screen.getByText('Budget Overview')).toBeOnTheScreen();
    expect(screen.getByText('My Savings')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Open app switcher' })).toBeOnTheScreen();
  });

  it('renders a one-question step without reaching into internal paths', () => {
    render(
      <BaconThemeProvider>
        <OneQuestionTemplate
          title="Add New Budget"
          onBack={() => undefined}
          forwardAction={{ label: 'NEXT', onPress: () => undefined }}
        >
          <QuestionInput
            question="What's the name of your new budget account?"
            value="Budget 1"
            onChangeText={() => undefined}
          />
          <CategoryChipGroup value="transportation" onChange={() => undefined} />
        </OneQuestionTemplate>
      </BaconThemeProvider>,
    );

    expect(screen.getByText('Add New Budget')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'NEXT' })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Transportation' })).toBeSelected();
  });

  it('renders a system screen without reaching into internal paths', () => {
    render(
      <BaconThemeProvider>
        <NavyStackTemplate title="Settings" onBack={() => undefined}>
          <PanelGroup label="Security">
            <Panel>
              <BaconText variant="label">Sessions</BaconText>
              <BaconButton onPress={() => undefined}>View All Sessions</BaconButton>
            </Panel>
            <Panel>
              <BaconText variant="label">Password</BaconText>
              <BaconButton onPress={() => undefined}>Update Password</BaconButton>
            </Panel>
          </PanelGroup>
        </NavyStackTemplate>
      </BaconThemeProvider>,
    );

    expect(screen.getByText('Settings')).toBeOnTheScreen();
    expect(screen.getByText('Sessions')).toBeOnTheScreen();
  });

  it('renders a completion screen with exactly two ways onward', () => {
    render(
      <BaconThemeProvider>
        <CompletionTemplate
          headline="You have created a new savings account!"
          consequence="Fill your account before August 8, 2025."
          links={[
            { title: 'My Savings', onPress: () => undefined },
            { title: 'Back to Dashboard', onPress: () => undefined },
          ]}
          onClose={() => undefined}
        />
      </BaconThemeProvider>,
    );

    expect(screen.getByText('You have created a new savings account!')).toBeOnTheScreen();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'CLOSE' })).toBeOnTheScreen();
  });

  it('renders the bottom sheet overlay, destructive action last', () => {
    render(
      <BaconThemeProvider>
        <BottomSheet visible onRequestClose={() => undefined}>
          <SheetPrimaryAction onPress={() => undefined}>Update Savings</SheetPrimaryAction>
          <SheetAction onPress={() => undefined}>Set as priority</SheetAction>
          <SheetAction onPress={() => undefined}>Invite partner</SheetAction>
          <DestructiveAction onPress={() => undefined}>
            I want to delete this savings
          </DestructiveAction>
        </BottomSheet>
      </BaconThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Update Savings' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'I want to delete this savings' }),
    ).toBeOnTheScreen();
  });
});
