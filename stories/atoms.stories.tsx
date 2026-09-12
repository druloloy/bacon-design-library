import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { useState } from 'react';
import {
  BaconButton,
  BaconChip,
  BaconFab,
  BaconMoneyDisplay,
  BaconProgressBar,
  BaconText,
  DestructiveAction,
  EyeToggle,
  baconSpacing,
  baconTypography,
  type BaconTextVariant,
} from '../src';
import { OnSurface, Stack } from './decorators';

// -------------------------------------------------------------------------------------------
// BaconText
// -------------------------------------------------------------------------------------------
const textMeta: Meta<typeof BaconText> = {
  title: 'Atoms/BaconText',
  component: BaconText,
  parameters: {
    notes:
      'Brand Guide 06 — only these roles exist. A new piece of text takes the nearest role ' +
      'rather than a new size. There is no fontSize, fontWeight, color or fontFamily prop.',
  },
};
export default textMeta;

const SAMPLES: Record<BaconTextVariant, string> = {
  pageTitle: 'Notifications',
  heroMoney: '₱ 20,000',
  sectionHeading: 'Budget Overview',
  question: 'What do you want to do?',
  cardTitle: 'My Savings',
  walletName: 'Savings 1',
  label: 'Transportation',
  body: 'You have 4 active accounts',
  meta: 'target 25,000 · January 22, 2024',
  metaOnColor: 'Monthly',
  navAction: 'Finish',
  buttonLabel: 'Create an Account',
  progressValue: '5,000',
};

export const TheWholeScale: StoryObj = {
  name: 'The whole scale, on paper',
  render: () => (
    <OnSurface surface="paper">
      <Stack>
        {(Object.keys(baconTypography) as BaconTextVariant[]).map((variant) => (
          <BaconText key={variant} variant={variant} align="left">
            {SAMPLES[variant]}
          </BaconText>
        ))}
      </Stack>
    </OnSurface>
  ),
};

export const TheSignature: StoryObj = {
  name: 'The signature: Light title, Bold question, Regular value',
  render: () => (
    <OnSurface surface="paper">
      <BaconText variant="pageTitle">Add New Budget</BaconText>
      <BaconText variant="question">How much will be your budget?</BaconText>
      <BaconText variant="body" align="center">
        20,000
      </BaconText>
    </OnSurface>
  ),
};

export const OnNavy: StoryObj = {
  name: 'The same roles on a navy ground',
  render: () => (
    <OnSurface surface="navy">
      <Stack>
        <BaconText variant="pageTitle">Settings</BaconText>
        <BaconText variant="body" align="left">
          Your account is protected
        </BaconText>
        <BaconText variant="meta" align="left">
          Muted grey is never used here — this is the 16pt / 500 role
        </BaconText>
      </Stack>
    </OnSurface>
  ),
};

export const MetaOnRed: StoryObj = {
  name: 'Accessibility: meta on red is raised, never muted',
  parameters: {
    notes:
      'Brand Guide 12 — white on #DE0A26 is ~4.6:1. A 14pt meta role asked for on a red ground ' +
      'is promoted to 16pt / 500 automatically.',
  },
  render: () => (
    <OnSurface surface="red">
      <BaconText variant="heroMoney">₱ -110</BaconText>
      <BaconText variant="meta" align="center">
        Monthly
      </BaconText>
    </OnSurface>
  ),
};

// -------------------------------------------------------------------------------------------
// BaconButton
// -------------------------------------------------------------------------------------------
export const ButtonsOnPaper: StoryObj = {
  name: 'BaconButton / on paper',
  render: () => (
    <OnSurface surface="paper">
      <View style={{ flexDirection: 'row', gap: baconSpacing.md }}>
        <BaconButton onPress={() => undefined} fill>
          Create an Account
        </BaconButton>
        <BaconButton variant="secondary" onPress={() => undefined} fill>
          I already have one
        </BaconButton>
      </View>
    </OnSurface>
  ),
};

export const ButtonsOnNavy: StoryObj = {
  name: 'BaconButton / on navy — outline-white is the button',
  render: () => (
    <OnSurface surface="navy">
      <BaconButton onPress={() => undefined}>Update Password</BaconButton>
    </OnSurface>
  ),
};

export const ButtonsInPanel: StoryObj = {
  name: 'BaconButton / inside a Navy 700 panel — Navy 600 fill',
  render: () => (
    <OnSurface surface="panel">
      <BaconButton onPress={() => undefined}>View All Sessions</BaconButton>
    </OnSurface>
  ),
};

export const ButtonStates: StoryObj = {
  name: 'BaconButton / disabled and loading',
  render: () => (
    <OnSurface surface="paper">
      <Stack>
        <BaconButton onPress={() => undefined} disabled>
          Next
        </BaconButton>
        <BaconButton onPress={() => undefined} loading>
          Finish
        </BaconButton>
      </Stack>
    </OnSurface>
  ),
};

// -------------------------------------------------------------------------------------------
// BaconChip
// -------------------------------------------------------------------------------------------
export const Chips: StoryObj = {
  name: 'BaconChip / selected and unselected',
  parameters: {
    notes:
      '36pt tall visually, 48pt hit area via hitSlop — "padding, not resizing" (Brand Guide 12).',
  },
  render: function ChipsStory() {
    const [selected, setSelected] = useState('transportation');
    return (
      <OnSurface surface="paper">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: baconSpacing.md }}>
          <BaconChip
            label="Transportation"
            emoji="🚕"
            selected={selected === 'transportation'}
            onPress={() => setSelected('transportation')}
          />
          <BaconChip
            label="Groceries"
            emoji="🛒"
            selected={selected === 'groceries'}
            onPress={() => setSelected('groceries')}
          />
          <BaconChip label="Disabled" disabled onPress={() => undefined} />
        </View>
      </OnSurface>
    );
  },
};

export const ChipsOnNavy: StoryObj = {
  name: 'BaconChip / on navy — selected is the filled white pill',
  render: () => (
    <OnSurface surface="navy">
      <View style={{ flexDirection: 'row', gap: baconSpacing.md }}>
        <BaconChip label="System" selected onPress={() => undefined} />
        <BaconChip label="Light" onPress={() => undefined} />
      </View>
    </OnSurface>
  ),
};

// -------------------------------------------------------------------------------------------
// BaconMoneyDisplay
// -------------------------------------------------------------------------------------------
export const Money: StoryObj = {
  name: 'BaconMoneyDisplay / the documented formats',
  render: () => (
    <OnSurface surface="paper">
      <Stack>
        <BaconMoneyDisplay amount={20000} variant="hero" />
        <BaconMoneyDisplay amount={2000} change={50} variant="tile" />
        <BaconMoneyDisplay amount={-110} variant="tile" />
        <BaconMoneyDisplay amount={0} variant="inline" />
        <BaconMoneyDisplay amount={20000} variant="hero" masked />
      </Stack>
    </OnSurface>
  ),
};

// -------------------------------------------------------------------------------------------
// BaconProgressBar
// -------------------------------------------------------------------------------------------
export const Progress: StoryObj = {
  name: 'BaconProgressBar / the boundary chip',
  parameters: {
    notes:
      'Brand Guide 09 — "the most recognisable detail in the product". The value straddles the ' +
      'fill boundary; it is never a label above or beside the bar.',
  },
  render: () => (
    <OnSurface surface="white">
      <Stack>
        <BaconProgressBar percent={0} value={10110} />
        <BaconProgressBar percent={25} value={2500} />
        <BaconProgressBar percent={62} value={5000} />
        <BaconProgressBar percent={100} value={25000} />
        <BaconProgressBar percent={40} />
      </Stack>
    </OnSurface>
  ),
};

export const ProgressOnRed: StoryObj = {
  name: 'BaconProgressBar / on red — the track becomes a white outline',
  render: () => (
    <OnSurface surface="red">
      <BaconProgressBar percent={0} value={10110} />
    </OnSurface>
  ),
};

export const ProgressOnNavy: StoryObj = {
  name: 'BaconProgressBar / on navy — the fill turns white',
  render: () => (
    <OnSurface surface="navy">
      <BaconProgressBar percent={40} />
    </OnSurface>
  ),
};

// -------------------------------------------------------------------------------------------
// EyeToggle, BaconFab, DestructiveAction
// -------------------------------------------------------------------------------------------
export const Eye: StoryObj = {
  name: 'EyeToggle / privacy is always one tap away',
  render: function EyeStory() {
    const [hidden, setHidden] = useState(false);
    return (
      <OnSurface surface="paper">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: baconSpacing.md }}>
          <BaconMoneyDisplay amount={20000} variant="hero" masked={hidden} />
          <EyeToggle hidden={hidden} onToggle={setHidden} />
        </View>
      </OnSurface>
    );
  },
};

export const Fab: StoryObj = {
  name: 'BaconFab / the only persistent navigation',
  parameters: { notes: 'Money screens only. Bacon has no tab bar (Brand Guide 09 / 13).' },
  render: () => (
    <OnSurface surface="paper">
      <BaconFab onPress={() => undefined} />
    </OnSurface>
  ),
};

export const Destructive: StoryObj = {
  name: 'DestructiveAction / bare red text, never a filled button',
  parameters: {
    notes:
      'Brand Guide 04 — "Status red is always a filled surface. Destructive red is always bare ' +
      'text." BaconButton has no danger variant, so this is the only red control in the system.',
  },
  render: () => (
    <OnSurface surface="white">
      <Stack>
        <DestructiveAction onPress={() => undefined}>
          I want to delete this budget
        </DestructiveAction>
        <DestructiveAction onPress={() => undefined} confirmLabel="Yes, delete this budget">
          I want to delete this savings
        </DestructiveAction>
      </Stack>
    </OnSurface>
  ),
};
