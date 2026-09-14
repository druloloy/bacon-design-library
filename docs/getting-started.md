# Getting started with Bacon

This guide takes you from an existing React Native app to working Bacon screens: a dashboard, a
two-step form, a confirmation screen, and a settings screen. It assumes you know React Native. You
don't need to have read the Brand Guide — the components already follow it.

| Name                       | What it is                                          |
| -------------------------- | --------------------------------------------------- |
| **Bacon**                  | The design library                                  |
| **`@druloloy/bacon-ui`**   | The package name — what you install and import from |
| **`bacon-design-library`** | The GitHub repository it lives in                   |

---

## 1. Install

Bacon is not published to npm. Install it straight from GitHub, pinned to a release tag.

With npm:

```bash
npm install github:druloloy/bacon-design-library#v1.0.0
```

With yarn:

```bash
yarn add github:druloloy/bacon-design-library#v1.0.0
```

Either command adds this line to your `package.json`:

```json
"@druloloy/bacon-ui": "github:druloloy/bacon-design-library#v1.0.0"
```

**The first install takes a minute or two.** Your package manager clones the repository, installs
Bacon's build tools, and compiles the library. You don't run a build yourself.

**Pin to a tag, not a branch.** `#main` works, but your lockfile records whichever commit `main`
pointed to on the day you installed, so two teammates installing a week apart can end up with
different code. A tag is explicit. Available versions are on the
[releases page](https://github.com/druloloy/bacon-design-library/releases).

### Peer dependencies

Bacon uses the `react` and `react-native` your app already has (React 18.2+, React Native 0.73+).
It also uses safe-area insets, so install the safe-area library if you don't have it:

```bash
npx expo install react-native-safe-area-context
```

or, in a bare React Native app:

```bash
yarn add react-native-safe-area-context
```

Without it, Bacon still works, but screens and the bottom sheet ignore notches and home indicators.

---

## 2. Add the font

Bacon is set entirely in **Quicksand**, in four weights. Download it from
[Google Fonts](https://fonts.google.com/specimen/Quicksand) and copy these four files into your app,
for example into `assets/fonts/`:

```
Quicksand-Light.ttf
Quicksand-Regular.ttf
Quicksand-Medium.ttf
Quicksand-Bold.ttf
```

Skip SemiBold. Bacon deliberately doesn't use it.

In an Expo app, load them before rendering:

```tsx
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
  'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
  'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
  'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
});
```

In a bare React Native app, link the files the way your project already links assets. The only
requirement is that the four family names match the ones above exactly.

---

## 3. Wrap your app

Put two providers at the root, once:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BaconThemeProvider } from '@druloloy/bacon-ui';

export default function App() {
  const [fontsLoaded] = useFonts({/* the four Quicksand files, as above */});
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <BaconThemeProvider fontStrategy="named">
        <YourNavigation />
      </BaconThemeProvider>
    </SafeAreaProvider>
  );
}
```

`fontStrategy="named"` tells Bacon to ask for `Quicksand-Bold`, `Quicksand-Light` and so on by
name. That matches how the fonts were registered above, on both iOS and Android.

That's all the setup. Everything below is ordinary React Native code.

---

## 4. The one idea to know first

**A screen's background tells the user where they are.**

- **Money screens** — anything that shows or changes money — have a light background.
- **System screens** — settings, security, notifications — have a navy background.

You never pick colours in Bacon. You pick the kind of screen, and every component on it adapts: a
button is a navy pill on a money screen and a white outline on a system screen, without you telling
it.

Bacon gives you a template for each kind of screen. The next four sections build one of each.

---

## 5. A money screen: the dashboard

`HeroFeedTemplate` gives you the light background, the balance area at the top, the 20pt page
margins, and the round app-switcher button at the bottom.

```tsx
import { useState } from 'react';
import {
  BalanceDisplay,
  HeroFeedTemplate,
  RowLink,
  SectionHeader,
  StatTileRow,
  WalletGrid,
  WalletTile,
} from '@druloloy/bacon-ui';

export function DashboardScreen({ navigation }) {
  const [balanceHidden, setBalanceHidden] = useState(false);

  return (
    <HeroFeedTemplate
      hero={
        <BalanceDisplay
          amount={20000}
          hidden={balanceHidden}
          onToggleHidden={setBalanceHidden}
        />
      }
      onFabPress={() => navigation.navigate('AppSwitcher')}
    >
      <SectionHeader>Budget Overview</SectionHeader>
      <StatTileRow
        stats={[
          { label: 'Groceries', percent: 0 },
          { label: 'Transport', percent: 50 },
          { label: 'Fun', percent: 100 },
        ]}
      />

      <WalletGrid>
        <WalletTile
          name="Transport"
          category={{ emoji: '🚕', label: 'Transportation' }}
          amount={5000}
          meta="Monthly"
          progress={{ percent: 50, value: 5000 }}
          onPress={() => navigation.navigate('Wallet', { id: 'transport' })}
        />
        <WalletTile
          name="Groceries"
          category={{ emoji: '🛒', label: 'Groceries' }}
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
        onPress={() => navigation.navigate('Savings')}
      />
    </HeroFeedTemplate>
  );
}
```

Things to notice:

- **`BalanceDisplay`** shows the amount with its hide/show eye beside it. Pass the state in; Bacon
  doesn't store it.
- **`WalletTile state`** is `'normal'`, `'overBudget'` (turns the tile solid red) or
  `'prioritySavings'` (solid navy). There are no colour props.
- **`RowLink subtitle`** uses `{}` to mark where `emphasis` goes, so the number is set in bold.
- **Amounts are plain numbers.** Bacon formats them as `₱ 20,000` and keeps the minus sign on
  negatives.

---

## 6. A form: one question per screen

Bacon forms ask one thing per screen, and the "next" button lives in the top-right corner rather
than at the bottom. `OneQuestionTemplate` sets that up.

**Step 1 — name and category:**

```tsx
import { CategoryChipGroup, OneQuestionTemplate, QuestionInput } from '@druloloy/bacon-ui';

export function NewBudgetNameScreen({ draft, setDraft, navigation }) {
  return (
    <OneQuestionTemplate
      title="Add New Budget"
      onBack={() => navigation.goBack()}
      forwardAction={{
        label: 'NEXT',
        onPress: () => navigation.navigate('NewBudgetAmount'),
        disabled: !draft.name || !draft.category,
      }}
    >
      <QuestionInput
        question="What's the name of your new budget account?"
        value={draft.name}
        onChangeText={(name) => setDraft({ ...draft, name })}
      />
      <CategoryChipGroup
        value={draft.category}
        onChange={(category) => setDraft({ ...draft, category })}
      />
    </OneQuestionTemplate>
  );
}
```

**Step 2 — amount and period:**

```tsx
import { ChipGroup, OneQuestionTemplate, QuickAmountInput } from '@druloloy/bacon-ui';

export function NewBudgetAmountScreen({ draft, setDraft, navigation }) {
  return (
    <OneQuestionTemplate
      title="Add New Budget"
      onBack={() => navigation.goBack()}
      forwardAction={{
        label: 'FINISH',
        onPress: () => navigation.navigate('BudgetCreated'),
        disabled: !draft.amount || !draft.period,
      }}
    >
      <QuickAmountInput
        question="How much will be your budget?"
        value={draft.amount}
        onChangeValue={(amount) => setDraft({ ...draft, amount })}
        options={[50, 100, 500, 1000]}
      />
      <ChipGroup
        label="How often does it reset?"
        value={draft.period}
        onChange={(period) => setDraft({ ...draft, period })}
        options={[
          { id: 'weekly', label: 'Weekly' },
          { id: 'monthly', label: 'Monthly' },
        ]}
      />
    </OneQuestionTemplate>
  );
}
```

Things to notice:

- **`forwardAction.label`** is `'NEXT'` for a middle step and `'FINISH'` for the last one.
  TypeScript rejects anything else, such as `'SUBMIT'` or `'SAVE'`.
- **`QuestionInput`** takes a question, not a label. Write it the way you'd ask a person.
- **`QuickAmountInput`** lets people type an amount _or_ tap a preset. Tapping fills the field, and
  the field stays editable. `value` is `null` when the field is empty.
- **There's no bottom button** and no slot for one.

---

## 7. A confirmation screen

After a flow finishes, Bacon shows a full screen instead of a toast: what now exists, one line about
what happens next, and two ways to continue.

```tsx
import { CompletionTemplate } from '@druloloy/bacon-ui';

export function BudgetCreatedScreen({ draft, navigation }) {
  return (
    <CompletionTemplate
      headline={`You have created ${draft.name}!`}
      consequence="Your budget resets on the 1st of every month."
      links={[
        { title: 'My Budgets', onPress: () => navigation.navigate('Budgets') },
        { title: 'Add another', onPress: () => navigation.navigate('NewBudgetName') },
      ]}
      onClose={() => navigation.popToTop()}
    />
  );
}
```

`links` must have exactly two entries; TypeScript enforces it. You can also pass an `illustration`.

---

## 8. A system screen: settings

`NavyStackTemplate` gives you the navy background and a stack of grouped panels.

```tsx
import {
  BaconButton,
  BaconText,
  NavyStackTemplate,
  Panel,
  PanelGroup,
} from '@druloloy/bacon-ui';

export function SettingsScreen({ navigation }) {
  return (
    <NavyStackTemplate title="Settings" onBack={() => navigation.goBack()}>
      <PanelGroup label="Security">
        <Panel>
          <BaconText variant="label">Sessions</BaconText>
          <BaconButton onPress={() => navigation.navigate('Sessions')}>View All</BaconButton>
        </Panel>
        <Panel>
          <BaconText variant="label">Password</BaconText>
          <BaconButton onPress={() => navigation.navigate('Password')}>Update</BaconButton>
        </Panel>
      </PanelGroup>
    </NavyStackTemplate>
  );
}
```

The text is white and the buttons are styled for navy automatically — the same `BaconButton` you'd
use on a money screen.

---

## 9. Actions and deleting

Tapping a wallet usually opens a bottom sheet. The main action comes first, then plain actions, and
delete comes last as red text.

```tsx
import {
  BottomSheet,
  DestructiveAction,
  SheetAction,
  SheetPrimaryAction,
} from '@druloloy/bacon-ui';

<BottomSheet visible={sheetOpen} onRequestClose={() => setSheetOpen(false)}>
  <SheetPrimaryAction onPress={editWallet}>Update Savings</SheetPrimaryAction>
  <SheetAction onPress={setPriority}>Set as priority</SheetAction>
  <SheetAction onPress={invitePartner}>Invite partner</SheetAction>
  <DestructiveAction onPress={deleteWallet} confirmLabel="Yes, delete it">
    I want to delete this savings
  </DestructiveAction>
</BottomSheet>;
```

- **`DestructiveAction`** is the only way to show delete. There is no red button in Bacon.
- **`confirmLabel`** makes the first tap ask for confirmation and the second tap delete.
- **Write delete in the first person:** "I want to delete this savings".
- **The screen behind the sheet stays visible**, and isn't dimmed.

---

## 10. Text

Use `BaconText` for any text a template doesn't already render. Pick what the text _is_, and Bacon
picks the size, weight and colour:

```tsx
<BaconText variant="pageTitle">Notifications</BaconText>
<BaconText variant="question">What do you want to do?</BaconText>
<BaconText variant="body">You have 4 active accounts</BaconText>
<BaconText variant="meta">target 25,000</BaconText>
```

There are no `fontSize`, `fontWeight` or `color` props. If text needs to look different, it's a
different variant. The full list is in the [component reference](components.md#bacontext).

---

## Updating Bacon

1. Check the [CHANGELOG](../CHANGELOG.md) for the new version. Look for a **Changed — tokens**
   section: a token change can move things on every screen.
2. Change the tag in your `package.json`, for example `#v1.0.0` → `#v1.1.0`.
3. Run `npm install` or `yarn`.

---

## Troubleshooting

**TypeScript can't find `@druloloy/bacon-ui`, or `node_modules/@druloloy/bacon-ui/lib` is missing.**
The library is compiled during install, and that step didn't run. Check that your project doesn't
disable install scripts (`ignore-scripts=true` in `.npmrc` or `.yarnrc`, or an `--ignore-scripts`
flag), then delete `node_modules/@druloloy/bacon-ui` and install again.

**Text shows in the system font.**
Quicksand isn't loaded, or the names don't match. Register the four files under exactly
`Quicksand-Light`, `Quicksand-Regular`, `Quicksand-Medium` and `Quicksand-Bold`, wait for them to load
before rendering, and pass `fontStrategy="named"` to `BaconThemeProvider`.

**Bold and light text look the same.**
Same cause. Each weight is its own font file, and each must be registered under its own name.

**TypeScript rejects `label: 'SUBMIT'` on `TopBar` or a template.**
Intentional. Forward actions are `'NEXT'` or `'FINISH'`.

**TypeScript rejects a `title` prop on `TopBar`.**
Intentional. The page title goes in the template's `title` prop, below the top bar.

**A console warning says `BaconFab` is on a coloured surface.**
The round app-switcher button belongs on money screens only. Remove it from the system screen.

---

## Where to go next

- [Component reference](components.md) — every component, its props, and what it deliberately
  won't do.
- [Architecture](architecture.md) — why Bacon is built the way it is.
- [Brand compliance](brand-compliance.md) — how each Brand Guide rule is enforced.
- The [example app](../example) — all of the above running together.
