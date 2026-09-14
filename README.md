# Bacon

The React Native design library for the Bacon app: colours, type, components and screen templates,
built to the _Bacon Brand & Interface Guide_.

```tsx
import { WalletTile } from '@druloloy/bacon-ui';
```

**[Getting started](docs/getting-started.md)** · [Components](docs/components.md) ·
[Example app](example) · [Changelog](CHANGELOG.md)

---

## Install

Bacon isn't published to npm. Install it from GitHub, pinned to a release:

```bash
yarn add git+https://github.com/druloloy/bacon-design-library.git#v1.0.0
```

```bash
npm install git+https://github.com/druloloy/bacon-design-library.git#v1.0.0
```

It installs as **`@druloloy/bacon-ui`**. The first install compiles the library, so give it a minute
or two.

Use the full `git+https://` URL exactly as shown. Yarn Classic treats the shorter `github:` form as a
plain download and skips the compile step.

Bacon needs React 18.2+ and React Native 0.73+, which your app already has. Also add:

```bash
yarn add react-native-safe-area-context
```

and the Quicksand font, as described in
[Getting started → Add the font](docs/getting-started.md#2-add-the-font).

## Set up

Wrap your app once:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BaconThemeProvider } from '@druloloy/bacon-ui';

export default function App() {
  return (
    <SafeAreaProvider>
      <BaconThemeProvider fontStrategy="named">
        <YourNavigation />
      </BaconThemeProvider>
    </SafeAreaProvider>
  );
}
```

## Use

```tsx
import { useState } from 'react';
import { BalanceDisplay, HeroFeedTemplate, WalletGrid, WalletTile } from '@druloloy/bacon-ui';

export function Dashboard() {
  const [hidden, setHidden] = useState(false);

  return (
    <HeroFeedTemplate
      hero={<BalanceDisplay amount={20000} hidden={hidden} onToggleHidden={setHidden} />}
    >
      <WalletGrid>
        <WalletTile
          name="Transport"
          category={{ emoji: '🚕', label: 'Transportation' }}
          amount={5000}
          meta="Monthly"
          progress={{ percent: 50, value: 5000 }}
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
    </HeroFeedTemplate>
  );
}
```

The [getting started guide](docs/getting-started.md) builds a dashboard, a two-step form, a
confirmation screen and a settings screen, one step at a time.

## How Bacon works

Four ideas explain almost every API decision:

1. **Every screen is either a money screen or a system screen.** Money screens (anything that shows
   or changes money) are light. System screens (settings, security, notifications) are navy. You
   pick the template, and every component on it adapts. You never pass colours.
2. **Text has roles, not styles.** `<BaconText variant="question">` has no size, weight or colour
   props.
3. **Red means one of two things.** A red _surface_ means over budget
   (`<WalletTile state="overBudget">`). Red _text_ means delete (`<DestructiveAction>`). There is no
   red button.
4. **Forms ask one question per screen** and move forward from the top bar, with `NEXT` or `FINISH`.

When the API won't let you do something, it's almost always one of these, on purpose. The reasoning
is in [docs/architecture.md](docs/architecture.md).

## What's included

| For                  | Components                                                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Whole screens        | `HeroFeedTemplate` · `OneQuestionTemplate` · `NavyStackTemplate` · `CompletionTemplate` · `BaconScreen`                                        |
| Showing money        | `BalanceDisplay` · `BaconMoneyDisplay` · `WalletTile` · `WalletGrid` · `StatTile` · `StatTileRow` · `BaconProgressBar` · `TransactionRow`      |
| Asking for input     | `QuestionInput` · `QuickAmountInput` · `ChipGroup` · `CategoryChipGroup` · `BaconChip`                                                         |
| Actions & navigation | `BaconButton` · `TopBar` · `RowLink` · `BaconFab` · `BottomSheet` · `SheetPrimaryAction` · `SheetAction` · `DestructiveAction` · `EyeToggle`   |
| Text & layout        | `BaconText` · `SectionHeader` · `Hero` · `Panel` · `PanelGroup` · `BaconArrow`                                                                 |
| Theme & tokens       | `BaconThemeProvider` · `useBaconTheme` · `useBaconSurface` · `baconTokens` · `baconColors` · `baconSpacing` · `baconRadii` · `baconTypography` |
| Formatting           | `formatMoney` · `formatMoneyChange` · `formatTarget` · `formatPercent` · `maskMoney`                                                           |

Every component, with its props and examples: [docs/components.md](docs/components.md).

## Theme options

`BaconThemeProvider` takes three optional props:

| Prop               | Default                                              | Set it when                                                                                            |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `fontStrategy`     | `'named'` on Android, `'single'` on iOS              | You registered Quicksand as four named files, as in the guide and the usual Expo setup. Use `'named'`. |
| `fontFamilyMap`    | `Quicksand-Light` · `-Regular` · `-Medium` · `-Bold` | Your font files are registered under different names.                                                  |
| `useAccessibleRed` | `false`                                              | You need a darker red (`#C40A22`) behind small white text.                                             |

## Updating

Read the [changelog](CHANGELOG.md) first — a **Changed — tokens** section means things will move on
screen. Then change the tag in your `package.json` (`#v1.0.0` → `#v1.1.0`) and run `yarn` or
`npm install`.

## Working on Bacon

```bash
git clone https://github.com/druloloy/bacon-design-library.git
cd bacon-design-library
npm install      # installs the dev tools and builds lib/
npm run verify   # lint, typecheck, tests and build: the same checks CI runs
```

Running the example app and Storybook, trying a change inside your own app, and cutting a release
are all covered in [CONTRIBUTING.md](CONTRIBUTING.md).

## Documentation

| Document                                     | Read it to                                                |
| -------------------------------------------- | --------------------------------------------------------- |
| [Getting started](docs/getting-started.md)   | Install Bacon and build your first screens                |
| [Components](docs/components.md)             | Look up a component's props, variants and limits          |
| [Architecture](docs/architecture.md)         | Understand why the API is shaped the way it is            |
| [Brand compliance](docs/brand-compliance.md) | See how each Brand Guide rule is enforced, and what isn't |
| [Changelog](CHANGELOG.md)                    | Find out what changed in each release                     |
| [Contributing](CONTRIBUTING.md)              | Develop, test and release Bacon                           |

## Licence

MIT. Quicksand is licensed separately under the SIL Open Font License 1.1.
