import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import {
  BaconButton,
  BaconText,
  BalanceDisplay,
  BottomSheet,
  CategoryChipGroup,
  ChipGroup,
  CompletionTemplate,
  DestructiveAction,
  Hero,
  HeroFeedTemplate,
  NavyStackTemplate,
  OneQuestionTemplate,
  Panel,
  PanelGroup,
  QuestionInput,
  QuickAmountInput,
  RowLink,
  SectionHeader,
  SheetAction,
  SheetPrimaryAction,
  StatTileRow,
  TopBar,
  TransactionRow,
  WalletGrid,
  WalletTile,
  baconSpacing,
} from '../src';
import { OnSurface, Stack } from './decorators';

const meta: Meta = {
  title: 'Molecules, Organisms & Templates',
  parameters: {
    notes:
      'Each story below is a piece of the Bacon library exactly as the Brand Guide draws it. ' +
      'Where a component changes with its ground, both grounds are shown.',
  },
};
export default meta;

// -------------------------------------------------------------------------------------------
// Molecules
// -------------------------------------------------------------------------------------------
export const TopBarStates: StoryObj = {
  name: 'TopBar / NEXT, FINISH and CLOSE',
  parameters: { notes: 'The bar holds navigation only — there is no title prop.' },
  render: () => (
    <OnSurface surface="paper" frame>
      <Stack>
        <TopBar
          onBack={() => undefined}
          forwardAction={{ label: 'NEXT', onPress: () => undefined }}
        />
        <TopBar
          onBack={() => undefined}
          forwardAction={{ label: 'FINISH', onPress: () => undefined }}
        />
        <TopBar onClose={() => undefined} />
      </Stack>
    </OnSurface>
  ),
};

export const Question: StoryObj = {
  name: 'QuestionInput / no box, no placeholder-as-label',
  render: function QuestionStory() {
    const [value, setValue] = useState('Budget 1');
    return (
      <OnSurface surface="paper" frame>
        <QuestionInput
          question="What's the name of your new budget account?"
          value={value}
          onChangeText={setValue}
        />
      </OnSurface>
    );
  },
};

export const QuickAmount: StoryObj = {
  name: 'QuickAmountInput / type or tap, always both',
  render: function QuickAmountStory() {
    const [value, setValue] = useState<number | null>(null);
    return (
      <OnSurface surface="paper" frame>
        <QuickAmountInput
          question="How much do you want to add or deduct?"
          value={value}
          onChangeValue={setValue}
          options={[50, 100, 500, 1000]}
        />
      </OnSurface>
    );
  },
};

export const Categories: StoryObj = {
  name: 'CategoryChipGroup / ragged centred rows, emoji not icons',
  render: function CategoriesStory() {
    const [value, setValue] = useState<string | null>('transportation');
    return (
      <OnSurface surface="paper" frame>
        <CategoryChipGroup value={value} onChange={setValue} />
      </OnSurface>
    );
  },
};

export const Periods: StoryObj = {
  name: 'ChipGroup / period switcher',
  render: function PeriodStory() {
    const [value, setValue] = useState<string | null>('weekly');
    return (
      <OnSurface surface="paper" frame>
        <ChipGroup
          label="How often?"
          value={value}
          onChange={setValue}
          options={[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'annually', label: 'Annually' },
          ]}
        />
      </OnSurface>
    );
  },
};

export const Stats: StoryObj = {
  name: 'StatTile / three-up, red at zero, always "remaining"',
  render: () => (
    <OnSurface surface="paper" frame>
      <StatTileRow
        stats={[
          { label: 'Budget 1', percent: 0 },
          { label: 'Budget 2', percent: 50 },
          { label: 'Budget 3', percent: 100 },
        ]}
      />
    </OnSurface>
  ),
};

export const Transactions: StoryObj = {
  name: 'TransactionRow / attributed by handle',
  render: () => (
    <OnSurface surface="paper" frame>
      <Stack>
        <TransactionRow
          title="Groceries"
          handle="ddruu1"
          amount={-110}
          date="January 22, 2024"
        />
        <TransactionRow
          title="Salary"
          handle="partner"
          amount={20000}
          date="January 20, 2024"
        />
      </Stack>
    </OnSurface>
  ),
};

export const Balance: StoryObj = {
  name: 'BalanceDisplay / the eye sits beside the number',
  render: function BalanceStory() {
    const [hidden, setHidden] = useState(false);
    return (
      <OnSurface surface="paper" frame>
        <BalanceDisplay amount={20000} hidden={hidden} onToggleHidden={setHidden} />
      </OnSurface>
    );
  },
};

// -------------------------------------------------------------------------------------------
// Organisms
// -------------------------------------------------------------------------------------------
export const WalletStates: StoryObj = {
  name: 'WalletTile / the three documented states',
  render: () => (
    <OnSurface surface="paper" frame>
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
        <WalletTile
          name="Savings 1"
          category={{ emoji: '🏖️', label: 'Vacation' }}
          amount={10000}
          meta="target 25,000"
          progress={{ percent: 40 }}
          state="prioritySavings"
        />
      </WalletGrid>
    </OnSurface>
  ),
};

export const RowLinks: StoryObj = {
  name: 'RowLink / on paper and on navy',
  render: () => (
    <>
      <OnSurface surface="paper" frame>
        <RowLink
          title="My Savings"
          subtitle="You have {} active wallets"
          emphasis={4}
          onPress={() => undefined}
        />
      </OnSurface>
      <OnSurface surface="navy" frame>
        <RowLink title="My Data" subtitle="Export everything" onPress={() => undefined} />
      </OnSurface>
    </>
  ),
};

export const Sheet: StoryObj = {
  name: 'BottomSheet / undimmed, destructive last',
  parameters: {
    notes:
      'The page behind stays visible and undimmed (Brand Guide 09). There is no scrim prop — a ' +
      'dimmed backdrop is the Material pattern Bacon deliberately does not use.',
  },
  render: function SheetStory() {
    const [visible, setVisible] = useState(true);
    return (
      <OnSurface surface="paper" frame>
        <BaconButton onPress={() => setVisible(true)}>Open the sheet</BaconButton>
        <BottomSheet visible={visible} onRequestClose={() => setVisible(false)}>
          <SheetPrimaryAction onPress={() => undefined}>Update Savings</SheetPrimaryAction>
          <SheetAction onPress={() => undefined}>Set as priority</SheetAction>
          <SheetAction onPress={() => undefined}>Invite partner</SheetAction>
          <DestructiveAction onPress={() => undefined}>
            I want to delete this savings
          </DestructiveAction>
        </BottomSheet>
      </OnSurface>
    );
  },
};

export const Panels: StoryObj = {
  name: 'Panel / Navy 700, flat, 2-up under a group label',
  render: () => (
    <OnSurface surface="navy" frame>
      <PanelGroup label="Security">
        <Panel>
          <BaconText variant="label" align="left">
            Sessions
          </BaconText>
          <BaconButton onPress={() => undefined}>View All</BaconButton>
        </Panel>
        <Panel>
          <BaconText variant="label" align="left">
            Password
          </BaconText>
          <BaconButton onPress={() => undefined}>Update</BaconButton>
        </Panel>
      </PanelGroup>
    </OnSurface>
  ),
};

export const Heroes: StoryObj = {
  name: 'Hero / paper and navy',
  render: () => (
    <View style={{ gap: baconSpacing.screen }}>
      <OnSurface surface="paper" frame>
        <Hero>
          <BalanceDisplay amount={20000} hidden={false} onToggleHidden={() => undefined} />
        </Hero>
      </OnSurface>
      <OnSurface surface="paper" frame>
        <Hero variant="navy">
          <BalanceDisplay amount={10000} hidden={false} onToggleHidden={() => undefined} />
        </Hero>
      </OnSurface>
    </View>
  ),
};

// -------------------------------------------------------------------------------------------
// Templates — the four documented archetypes
// -------------------------------------------------------------------------------------------
export const ArchetypeHeroFeed: StoryObj = {
  name: 'Template / 1 · Hero + feed',
  render: function HeroFeedStory() {
    const [hidden, setHidden] = useState(false);
    return (
      <View style={{ height: 800, width: 360 }}>
        <HeroFeedTemplate
          hero={<BalanceDisplay amount={20000} hidden={hidden} onToggleHidden={setHidden} />}
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
      </View>
    );
  },
};

export const ArchetypeOneQuestion: StoryObj = {
  name: 'Template / 2 · One question',
  render: function OneQuestionStory() {
    const [name, setName] = useState('Budget 1');
    const [category, setCategory] = useState<string | null>('transportation');
    return (
      <View style={{ height: 800, width: 360 }}>
        <OneQuestionTemplate
          title="Add New Budget"
          onBack={() => undefined}
          forwardAction={{ label: 'NEXT', onPress: () => undefined }}
        >
          <QuestionInput
            question="What's the name of your new budget account?"
            value={name}
            onChangeText={setName}
          />
          <CategoryChipGroup value={category} onChange={setCategory} />
        </OneQuestionTemplate>
      </View>
    );
  },
};

export const ArchetypeNavyStack: StoryObj = {
  name: 'Template / 3 · Navy stack',
  render: () => (
    <View style={{ height: 800, width: 360 }}>
      <NavyStackTemplate title="Settings" onBack={() => undefined}>
        <PanelGroup label="Security">
          <Panel>
            <BaconText variant="label" align="left">
              Sessions
            </BaconText>
            <BaconButton onPress={() => undefined}>View All</BaconButton>
          </Panel>
          <Panel>
            <BaconText variant="label" align="left">
              Password
            </BaconText>
            <BaconButton onPress={() => undefined}>Update</BaconButton>
          </Panel>
        </PanelGroup>
        <PanelGroup label="Customization">
          <Panel>
            <BaconText variant="label" align="left">
              Currency
            </BaconText>
          </Panel>
          <Panel>
            <BaconText variant="label" align="left">
              Categories
            </BaconText>
          </Panel>
        </PanelGroup>
      </NavyStackTemplate>
    </View>
  ),
};

export const ArchetypeCompletion: StoryObj = {
  name: 'Template / 4 · Completion',
  parameters: {
    notes:
      'Consequence, not congratulation, and two ways onward. `links` is typed as a pair, so ' +
      '"two row links out" is checked by the compiler. Bacon ships no toast for this reason.',
  },
  render: () => (
    <View style={{ height: 800, width: 360 }}>
      <CompletionTemplate
        headline="You have created a new savings account!"
        consequence="Fill your account before August 8, 2025."
        links={[
          {
            title: 'My Savings',
            subtitle: 'You have {} active wallets',
            emphasis: 4,
            onPress: () => undefined,
          },
          { title: 'Back to Dashboard', onPress: () => undefined },
        ]}
        onClose={() => undefined}
      />
    </View>
  ),
};
