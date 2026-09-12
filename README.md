# @bacon/design-system

The single source of truth for Bacon's visual language in React Native.

Bacon is a budgeting and savings app for people who want to feel in control, not audited. This
package holds everything that makes a screen _look and feel like Bacon_ — the tokens, the
typography, the surfaces, the controls, the interaction patterns and the accessibility behaviour.
Consuming apps hold everything else.

> The consuming app answers **"what does this feature do?"**
> The design system answers **"what does Bacon look and feel like?"**

Everything here is derived from the _Bacon Brand & Interface Guide v1.0_, which was itself
reverse-engineered from thirty screens of the product library. Colour values are sampled from the
exported artwork; geometry is measured from the 720 px files and halved to the 360 pt design frame.

---

## The principles

These are not decoration. Each one is enforced somewhere in the code, and the enforcement point is
named beside it.

| Principle                                     | How the package enforces it                                                                           |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Money is the headline**                     | `BaconMoneyDisplay` is the only way to render an amount; `heroMoney` is the largest role in the scale |
| **One decision per screen**                   | `OneQuestionTemplate` has no footer or bottom-CTA slot                                                |
| **Empty space is finished space**             | Templates do not stretch content to fill; the lower third is left alone                               |
| **Ask, don't label**                          | `QuestionInput` requires `question` and has no `label` or `placeholder` prop                          |
| **Light is money, navy is system**            | `BaconScreen` takes `variant="money" \| "system"` and has no `backgroundColor`                        |
| **Status red is a surface**                   | `WalletTile state="overBudget"` and `StatTile` at 0% paint a filled red surface                       |
| **Destructive red is text**                   | `DestructiveAction` is bare red text; `BaconButton` has no `danger` variant at all                    |
| **Light title, Bold question, Regular value** | `pageTitle` (300), `question` (700), `body` (400)                                                     |
| **FINISH lives in the top bar**               | `TopBar.forwardAction.label` is typed `'NEXT' \| 'FINISH'`; there is no `title` prop                  |
| **Type or tap, always both**                  | `QuickAmountInput` wires the chips into the same editable value                                       |
| **Privacy is one tap away**                   | `BalanceDisplay` pairs the amount with `EyeToggle` by construction                                    |
| **No tabs**                                   | The package ships `BaconFab` and no navigator                                                         |
| **No toasts**                                 | The package ships `CompletionTemplate` and no toast or snackbar                                       |
| **No gradients, no decorative third colour**  | Eight UI colours, one shadow, three radii — and lint fails on a raw hex                               |

---

## Installation

```bash
npm install @bacon/design-system
```

### Peer dependencies

| Package                          | Range      | Required? | Why                                                                                                      |
| -------------------------------- | ---------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `react`                          | `>=18.2.0` | yes       | —                                                                                                        |
| `react-native`                   | `>=0.73.0` | yes       | —                                                                                                        |
| `react-native-safe-area-context` | `>=4.8.0`  | optional  | `BaconScreen` and `BottomSheet` use insets. Without it they fall back to zero insets rather than failing |

The package has **no runtime dependencies**. The two glyphs that would normally need
`react-native-svg` — the long arrow and the FAB's 2×2 grid — are drawn from `View`s instead, so no
consumer is forced through a native linking step for decoration.

### Fonts

Quicksand is not bundled. Register it in your app:

```bash
# the four weights Bacon uses — download from Google Fonts (SIL OFL 1.1)
Quicksand-Light.ttf     300
Quicksand-Regular.ttf   400
Quicksand-Medium.ttf    500
Quicksand-Bold.ttf      700
```

Do **not** register `Quicksand-SemiBold`. Weight 600 is deliberately absent — the identity depends
on the gap between Light and Bold, and `BaconFontWeight` makes a 600 a compile error.

With Expo:

```tsx
const [loaded] = useFonts({
  'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
  'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
  'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
  'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
  Quicksand: require('./assets/fonts/Quicksand-Regular.ttf'),
});
```

Android does not reliably apply `fontWeight` to a custom `fontFamily`, so the package resolves a
named family per weight there and a single family on iOS. If your app registers fonts differently,
override it once:

```tsx
<BaconThemeProvider fontStrategy="named" fontFamilyMap={myMap}>
```

---

## Setup

Wrap the app once:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BaconThemeProvider } from '@bacon/design-system';

export default function App() {
  return (
    <SafeAreaProvider>
      <BaconThemeProvider>
        <YourNavigator />
      </BaconThemeProvider>
    </SafeAreaProvider>
  );
}
```

`BaconThemeProvider` takes three optional settings, and nothing else. There is no palette
override, because a palette override is a fork of the brand.

| Prop               | Default                                    | What it is                                                                                   |
| ------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `fontStrategy`     | `'named'` on Android, `'single'` elsewhere | How a weight becomes a `fontFamily`                                                          |
| `fontFamilyMap`    | `Quicksand-Light/Regular/Medium/Bold`      | The registered family names                                                                  |
| `useAccessibleRed` | `false`                                    | Paint filled red surfaces `#C40A22` instead of `#DE0A26`, the guide's second contrast remedy |

---

## Basic usage

```tsx
import {
  BaconScreen,
  BaconText,
  BalanceDisplay,
  WalletGrid,
  WalletTile,
} from '@bacon/design-system';

function Dashboard() {
  const [hidden, setHidden] = useState(false);

  return (
    <BaconScreen variant="money">
      <BalanceDisplay amount={20000} hidden={hidden} onToggleHidden={setHidden} />
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
    </BaconScreen>
  );
}
```

Import from the package name only. Deep imports are not supported and will not resolve:

```tsx
import { WalletTile } from '@bacon/design-system'; // ✅
import WalletTile from '@bacon/design-system/src/organisms/…'; // ❌ blocked by the exports map
```

---

## Components

### Foundations

`baconTokens` · `baconColors` · `baconTypography` · `baconSpacing` · `baconRadii` ·
`baconLayout` · `baconCardShadow` · `baconIllustrationColors` · `baconContrast`

Illustration accents are exported **separately** from the UI palette and are absent from the
theme, so no component can reach them through `useBaconTheme()`. They are art-only, never a status.

### Atoms

| Component           | What it is                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `BaconText`         | The only text primitive. `variant` is required; there is no size, weight, colour or family prop |
| `BaconScreen`       | The semantic ground: `money` → Paper, `system` → Navy                                           |
| `BaconButton`       | A 48 pt pill. Two variants; its appearance is decided by the surface it stands on               |
| `BaconChip`         | 36 pt visually, 48 pt hit area, announced as a radio                                            |
| `BaconMoneyDisplay` | Every amount in the product                                                                     |
| `BaconProgressBar`  | The 20 pt pill with the value chip straddling the fill boundary                                 |
| `EyeToggle`         | Balance masking, with a label that flips with its state                                         |
| `BaconFab`          | The 56 pt navy app switcher — Bacon's only persistent navigation                                |
| `BaconArrow`        | The long arrow, drawn from `View`s                                                              |
| `DestructiveAction` | Bare bold red text, optionally with a confirmation step                                         |

### Molecules

`TopBar` · `SectionHeader` · `QuestionInput` · `QuickAmountInput` · `ChipGroup` ·
`CategoryChipGroup` · `StatTile` / `StatTileRow` · `TransactionRow` · `BalanceDisplay`

### Organisms

`WalletTile` / `WalletGrid` · `RowLink` · `BottomSheet` (+ `SheetPrimaryAction`, `SheetAction`) ·
`Hero` · `Panel` / `PanelGroup`

### Templates — the four documented archetypes

| Template              | Archetype                                          |
| --------------------- | -------------------------------------------------- |
| `HeroFeedTemplate`    | 1 · Hero + feed (pass `heroVariant="navy"` for 1b) |
| `OneQuestionTemplate` | 2 · One question                                   |
| `NavyStackTemplate`   | 3 · Navy stack                                     |
| `CompletionTemplate`  | 4 · Completion                                     |

`BottomSheet` is the one overlay, not a fifth archetype.

### Utilities

`formatMoney` · `formatMoneyChange` · `formatChange` · `formatTarget` · `formatPercent` ·
`formatHandle` · `formatAttribution` · `maskMoney` · `moneyAccessibilityLabel`

```ts
formatMoney(20000); // "₱ 20,000"   (with a hard space)
formatMoneyChange(2000, 50); // "₱ 2,000 +50"
formatMoney(-110); // "₱ -110"     (the minus is never dropped)
```

---

## Accessibility

The guide's accessibility page lists five things "every build needs" and two defects that must not
be inherited. All seven are implemented here rather than left to application developers, and
`tests/accessibility` is the check that they hold.

- **48 pt minimum targets.** Chips stay 36 pt tall and grow their _hit area_ with `hitSlop` —
  "padding, not resizing".
- **Real labels** on the eye toggle, the FAB and every chip.
- **Chips are a radio group**, not a list of buttons.
- **A visible focus ring**: `focusRing(onNavy)` gives 2 pt navy, or 2 pt white on a navy screen.
- **Status is never carried by colour alone.** A red tile keeps its minus sign; a zero stat tile
  keeps its `0%`; both say so to a screen reader.
- **Muted grey is never used below 14 pt, and never on a coloured surface.** A 14 pt `meta` role
  asked for on a navy or red ground is _automatically_ promoted to the 16 pt / 500 role — the
  guide's own remedy, applied by construction rather than by memory.
- **Destructive actions are identifiable by form**, not just colour, and can require their own
  confirmation step via `confirmLabel`.

Dynamic Type is honoured and capped at 1.6×, the largest multiplier at which every documented
layout still holds on the 360 pt frame.

---

## Development

```bash
npm install

npm run lint          # ESLint, including the brand rules
npm run typecheck     # tsc --noEmit, strict
npm test              # the whole suite
npm run test:coverage # with coverage
npm run build         # commonjs + module + declarations, via builder-bob
npm run verify        # everything CI runs, in order
```

### Tests

| Folder                | What it protects                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `tests/unit`          | Formatting and token behaviour                                                                             |
| `tests/brand`         | **The brand itself** — no weight 600, no filled red button, five spacing values, one shadow, eight colours |
| `tests/components`    | Component behaviour and the documented visual states                                                       |
| `tests/accessibility` | The Brand Guide's accessibility page, end to end                                                           |
| `tests/integration`   | The public API, imported the way a consuming app imports it                                                |

A failure in `tests/brand` means someone has forked the Bacon system, not that a component broke.

### Storybook

The stories live in `stories/`, beside the components they document. Storybook itself lives in the
example app, so the published package carries no Storybook dependency:

```bash
cd example && npm install && npm run storybook
```

### The example app

```bash
npm run build
cd example && npm install && npm start
```

It renders a dashboard, both steps of the create-budget flow, a completion screen and a settings
screen — every import through the package's public API. See [`example/README.md`](example/README.md).

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before adding a component. The short version, from the
guide itself:

> The library's strength is that thirty screens agree with each other. A new colour, radius, or
> weight introduced on one screen is not a local decision — it is a fork of the system. Update the
> tokens and the other twenty-nine, or don't.

## Versioning

Semantic Versioning. **A change to a foundational design token is a breaking change**, because it
can move every screen in every consuming app. See [CHANGELOG.md](CHANGELOG.md).

## Compliance

[`docs/brand-compliance.md`](docs/brand-compliance.md) audits this implementation against every
rule in the Brand Guide, with a PASS / PARTIAL / FAIL verdict and the evidence for each.

## Licence

MIT. Quicksand is licensed separately under the SIL Open Font License 1.1.
