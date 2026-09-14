/**
 * A miniature consuming app, compiled against the BUILT declaration files.
 *
 * This file is never bundled or run. Its job is to fail `tsc` if the published types are
 * incomplete or wrong — a component exported from source but missing from the build, a type that
 * only resolves through an internal path, or a declaration that no longer matches the source.
 *
 * Note the import specifier: the package name, never a path inside it.
 */
import {
  BaconThemeProvider,
  BaconScreen,
  BaconText,
  BaconButton,
  BaconMoneyDisplay,
  BaconProgressBar,
  BalanceDisplay,
  WalletTile,
  WalletGrid,
  RowLink,
  StatTileRow,
  BottomSheet,
  SheetPrimaryAction,
  SheetAction,
  DestructiveAction,
  QuickAmountInput,
  CategoryChipGroup,
  TopBar,
  BaconFab,
  EyeToggle,
  HeroFeedTemplate,
  OneQuestionTemplate,
  CompletionTemplate,
  NavyStackTemplate,
  Panel,
  PanelGroup,
  formatMoney,
  baconTokens,
  type BaconTheme,
  type WalletTileState,
  type BaconTextVariant,
  type CompletionLink,
} from '@druloloy/bacon-ui';

const theme: BaconTheme | null = null;
const state: WalletTileState = 'prioritySavings';
const variant: BaconTextVariant = 'heroMoney';
const link: CompletionLink = { title: 'My Savings', onPress: () => undefined };
const money: string = formatMoney(20000);
const navy: string = baconTokens.colors.navy900;

export function Dashboard(): React.JSX.Element {
  return (
    <BaconThemeProvider>
      <HeroFeedTemplate
        hero={<BalanceDisplay amount={20000} hidden={false} onToggleHidden={() => undefined} />}
        onFabPress={() => undefined}
      >
        <StatTileRow stats={[{ label: 'Budget 1', percent: 0 }]} />
        <WalletGrid>
          <WalletTile name="Savings 1" amount={10000} state={state} />
        </WalletGrid>
        <RowLink
          title="My Savings"
          subtitle="You have {} wallets"
          emphasis={4}
          onPress={() => undefined}
        />
        <BaconText variant={variant}>{money}</BaconText>
        <BaconProgressBar percent={50} value={5000} />
      </HeroFeedTemplate>
    </BaconThemeProvider>
  );
}

export function CreateBudget(): React.JSX.Element {
  return (
    <OneQuestionTemplate
      title="Add New Budget"
      onBack={() => undefined}
      forwardAction={{ label: 'FINISH', onPress: () => undefined }}
    >
      <QuickAmountInput
        question="How much will be your budget?"
        value={null}
        onChangeValue={() => undefined}
        options={[50, 100, 500, 1000]}
      />
      <CategoryChipGroup value={null} onChange={() => undefined} />
    </OneQuestionTemplate>
  );
}

export function Settings(): React.JSX.Element {
  return (
    <NavyStackTemplate title="Settings">
      <PanelGroup label="Security">
        <Panel>
          <BaconButton onPress={() => undefined}>Update Password</BaconButton>
        </Panel>
      </PanelGroup>
    </NavyStackTemplate>
  );
}

export function Done(): React.JSX.Element {
  return (
    <CompletionTemplate
      headline="You have created a new savings account!"
      consequence="Fill your account before August 8, 2025."
      links={[link, { title: 'Back to Dashboard', onPress: () => undefined }]}
      onClose={() => undefined}
    />
  );
}

export function Sheet(): React.JSX.Element {
  return (
    <BaconScreen variant="money" footer={<BaconFab onPress={() => undefined} />}>
      <TopBar onClose={() => undefined} />
      <EyeToggle hidden onToggle={() => undefined} />
      <BaconMoneyDisplay amount={-110} />
      <BottomSheet visible onRequestClose={() => undefined}>
        <SheetPrimaryAction onPress={() => undefined}>Update Savings</SheetPrimaryAction>
        <SheetAction onPress={() => undefined}>Invite partner</SheetAction>
        <DestructiveAction onPress={() => undefined} confirmLabel="Yes, delete it">
          I want to delete this savings
        </DestructiveAction>
      </BottomSheet>
    </BaconScreen>
  );
}

// Referenced so `noUnusedLocals` keeps the type assertions above meaningful.
export const smoke = { theme, navy };
