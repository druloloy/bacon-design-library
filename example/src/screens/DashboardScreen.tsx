import { useMemo, useState } from 'react';
import {
  BalanceDisplay,
  BottomSheet,
  DestructiveAction,
  HeroFeedTemplate,
  RowLink,
  SectionHeader,
  SheetAction,
  SheetPrimaryAction,
  StatTileRow,
  WalletGrid,
  WalletTile,
} from '@druloloy/bacon-ui';
import { WALLETS } from '../data';

/**
 * Archetype 1 — Hero + feed.
 *
 * Everything visual comes from the package. What the app owns is the balance arithmetic, which
 * wallet is open in the sheet, and where each row link goes.
 */
export function DashboardScreen({
  onCreateBudget,
  onOpenSettings,
}: {
  onCreateBudget: () => void;
  onOpenSettings: () => void;
}): React.JSX.Element {
  const [hidden, setHidden] = useState(false);
  const [openWallet, setOpenWallet] = useState<string | null>(null);

  const total = useMemo(() => WALLETS.reduce((sum, wallet) => sum + wallet.amount, 0), []);
  const wallet = WALLETS.find((candidate) => candidate.id === openWallet) ?? null;

  return (
    <>
      <HeroFeedTemplate
        hero={<BalanceDisplay amount={total} hidden={hidden} onToggleHidden={setHidden} />}
        onFabPress={onOpenSettings}
      >
        <SectionHeader>Budget Overview</SectionHeader>
        <StatTileRow
          stats={[
            { label: 'Budget 1', percent: 0 },
            { label: 'Budget 2', percent: 50 },
            { label: 'Budget 3', percent: 100 },
          ]}
        />

        <SectionHeader>Your Wallets</SectionHeader>
        <WalletGrid>
          {WALLETS.map((item) => (
            <WalletTile
              key={item.id}
              name={item.name}
              category={{ emoji: item.emoji, label: item.category }}
              amount={item.amount}
              meta={item.meta}
              progress={{ percent: item.percent, value: item.chipValue }}
              state={item.state}
              onPress={() => setOpenWallet(item.id)}
            />
          ))}
        </WalletGrid>

        <RowLink
          title="My Savings"
          subtitle="You have {} active wallets"
          emphasis={WALLETS.length}
          onPress={onCreateBudget}
        />
        <RowLink
          title="Add a new budget"
          subtitle="Three short steps"
          onPress={onCreateBudget}
        />
      </HeroFeedTemplate>

      <BottomSheet
        visible={wallet !== null}
        onRequestClose={() => setOpenWallet(null)}
        accessibilityLabel={wallet ? `Actions for ${wallet.name}` : 'Actions'}
      >
        <SheetPrimaryAction onPress={() => setOpenWallet(null)}>
          Update Savings
        </SheetPrimaryAction>
        <SheetAction onPress={() => setOpenWallet(null)}>Set as priority</SheetAction>
        <SheetAction onPress={() => setOpenWallet(null)}>Invite partner</SheetAction>
        {/*
          Destructive last, bare red text, first person, and with its own confirmation step —
          the guide's accessibility remedy for red carrying two meanings.
        */}
        <DestructiveAction
          onPress={() => setOpenWallet(null)}
          confirmLabel="Yes, delete this wallet"
        >
          {wallet ? `I want to delete this ${wallet.name}` : 'I want to delete this wallet'}
        </DestructiveAction>
      </BottomSheet>
    </>
  );
}
