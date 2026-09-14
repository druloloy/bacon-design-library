# Component reference

Every public component, with what it is for, what it deliberately refuses to do, and the Brand
Guide rule behind each. Section numbers refer to the _Bacon Brand & Interface Guide_ v1.0.

Throughout: **invalid use** means the API will not let you do it, or a test will fail if you try.

Everything here is imported from the package:

```tsx
import { WalletTile, BaconButton, formatMoney } from '@druloloy/bacon-ui';
```

New to Bacon? Start with [Getting started](getting-started.md), then use this page to look things
up.

## Contents

- **[Atoms](#atoms)**
  - [`BaconText`](#bacontext)
  - [`BaconScreen`](#baconscreen)
  - [`BaconButton`](#baconbutton)
  - [`BaconChip`](#baconchip)
  - [`BaconMoneyDisplay`](#baconmoneydisplay)
  - [`BaconProgressBar`](#baconprogressbar)
  - [`EyeToggle`](#eyetoggle)
  - [`BaconFab`](#baconfab)
  - [`BaconArrow`](#baconarrow)
  - [`DestructiveAction`](#destructiveaction)
- **[Molecules](#molecules)**
  - [`TopBar`](#topbar)
  - [`QuestionInput`](#questioninput)
  - [`QuickAmountInput`](#quickamountinput)
  - [`ChipGroup` and `CategoryChipGroup`](#chipgroup-and-categorychipgroup)
  - [`StatTile` / `StatTileRow`](#stattile--stattilerow)
  - [`TransactionRow`, `SectionHeader`, `BalanceDisplay`](#transactionrow-sectionheader-balancedisplay)
- **[Organisms](#organisms)**
  - [`WalletTile` / `WalletGrid`](#wallettile--walletgrid)
  - [`RowLink`](#rowlink)
  - [`BottomSheet`, `SheetPrimaryAction`, `SheetAction`](#bottomsheet-sheetprimaryaction-sheetaction)
  - [`Hero`, `Panel`, `PanelGroup`](#hero-panel-panelgroup)
- **[Templates — the four archetypes](#templates--the-four-archetypes)**
- **[Utilities](#utilities)**

---

## Atoms

### `BaconText`

**Purpose.** The only text primitive. Everything written in a Bacon app goes through it.

**Props.** `variant` (required) · `children` · `align` · `tone` · `heading` · `numberOfLines` ·
`accessibilityLabel` · `style` · `allowFontScaling` · `maxFontSizeMultiplier` · `testID`

**Variants.** `pageTitle` · `heroMoney` · `sectionHeading` · `question` · `cardTitle` ·
`walletName` · `label` · `body` · `meta` · `navAction` · `metaOnColor` · `buttonLabel` ·
`progressValue`

**Constraints.** There is no `fontSize`, `fontWeight`, `color` or `fontFamily` prop. Guide 06 —
"Only these roles exist; a new piece of text takes the nearest role rather than a new size."
`style` accepts _layout_ properties only (margins, flex, width): it can move text, never restyle
it.

**Colour** comes from the surface, not the caller. `meta` is muted grey on a light ground; on a
coloured ground it is automatically promoted to the 16pt / 500 role, which is the guide's own
remedy for white-on-red contrast (12).

**`tone`.** `'default' | 'destructive'`. Destructive is the _only_ way to make text red, and it is
the text half of the red doctrine (04). There is deliberately no `error`, `warning` or `danger`
tone.

**Accessibility.** `heading` sets `accessibilityRole="header"`. Dynamic Type is on, capped at 1.6×
— above that the 44pt hero money breaks a 150pt wallet tile.

**Invalid use.** Weight 600 (a compile error, a lint error and a test failure). Setting a family.
Red text for anything but destruction.

```tsx
<BaconText variant="pageTitle">Notifications</BaconText>
<BaconText variant="question">How much will be your budget?</BaconText>
<BaconText variant="meta">target 25,000</BaconText>
```

---

### `BaconScreen`

**Purpose.** The semantic ground for a screen (04).

**Props.** `variant` (required) · `children` · `scroll` · `edgeToEdge` · `footer` · `testID`

**Variants.** `money` → Paper · `system` → Navy

**Constraints.** No `backgroundColor`, and no third variant. Guide 04 — "A screen's background
colour is not a styling choice; it tells the user what kind of screen they are on." This is not a
light/dark theme: both grounds exist at once in the same app.

It applies the 20pt gutter, stops growing at 480pt, and declares the surface for everything below
it — which is how components pick legal colours without being passed any.

**Invalid use.** Choosing navy because it looks premium. Mixing both grounds on one screen.

```tsx
<BaconScreen variant="money" footer={<BaconFab onPress={open} />}>
  …
</BaconScreen>
```

---

### `BaconButton`

**Purpose.** The pill control (08).

**Props.** `children` (a string) · `onPress` · `variant` · `disabled` · `loading` · `fill` ·
`accessibilityHint` · `testID`

**Variants.** `primary` · `secondary` — and that is the whole list.

**Constraints.** 48pt tall, 28pt side padding, Bold label, full pill. Its _appearance_ is decided
by the ground it stands on, not by the caller:

| Ground         | Primary                | Secondary                      |
| -------------- | ---------------------- | ------------------------------ |
| Paper / white  | Navy fill, white label | Navy 1.5pt hairline on nothing |
| Navy           | Outline-white          | Outline-white                  |
| Navy 700 panel | Navy 600 fill          | Outline-white                  |

**Invalid use.** A red button. There is no `danger` variant and no way to add one without editing
the file; a test asserts no variant renders a red fill on any surface, and the build verification
re-checks it against the published declarations. A filled white pill as a CTA — that treatment
belongs to a selected chip. More than two buttons in a row (`fill` splits two evenly).

---

### `BaconChip`

**Purpose.** One selectable pill (08).

**Props.** `label` · `onPress` · `emoji` · `selected` · `disabled` · `accessibilityHint` · `testID`

**Constraints.** 36pt tall **visually**, with the hit area grown to 48pt by `hitSlop` — Guide 12
says "padding, not resizing". Regular weight, hairline border. Selected inverts to a solid fill:
navy on a light ground, the filled white pill on navy.

**Accessibility.** Announced as a `radio`, not a button, so a group reads as one choice. The emoji
is hidden from assistive technology; the chip announces its label.

**Invalid use.** Replacing the emoji with an icon (there is no `icon` prop). Making a chip red.

---

### `BaconMoneyDisplay`

**Purpose.** Every amount in the product (01, 02).

**Props.** `amount` · `change` · `variant` · `masked` · `currency` · `align` · `showSymbol` ·
`testID`

**Variants.** `hero` (44 / 700) · `tile` (24 / 700) · `inline` (20 / 700)

**Constraints.** Currency is a glyph, a **hard space** (U+00A0), then comma grouping. A change
trails in Regular weight so the amount stays dominant. A negative keeps its minus — structurally,
because `formatMoney` has no path that drops it, which is what Guide 12's "status never carried by
colour alone" depends on.

**Accessibility.** Speaks the currency name rather than the glyph, and says "minus". When masked,
the accessible label is replaced, not decorated — a hidden balance must not leak.

```tsx
<BaconMoneyDisplay amount={20000} variant="hero" />   // ₱ 20,000
<BaconMoneyDisplay amount={2000} change={50} />        // ₱ 2,000 +50
<BaconMoneyDisplay amount={-110} />                    // ₱ -110
```

---

### `BaconProgressBar`

**Purpose.** The Bacon progress bar — "the most recognisable detail in the product" (09).

**Props.** `percent` · `value` · `currency` · `accessibilityLabel` · `testID`

**Constraints.** A 20pt pill. The value sits in a chip **on the boundary of the fill**, straddling
it. There is no `labelPosition` prop and no way to move the value above or beside the bar.

| Ground        | Track                      | Fill  | Chip                     |
| ------------- | -------------------------- | ----- | ------------------------ |
| White / paper | `#E7E8EE`                  | Navy  | White chip, navy text    |
| Navy          | 25% white                  | White | White chip, navy text    |
| Red           | **none** — a white outline | White | Bare white text, centred |

The red tile loses its track because a full-width track would read as a bar that is already full
(09). It centres the value because, with no fill, there is no boundary to straddle.

`percent` is clamped rather than rejected; 0 and 100 pin the chip inside the bar.

**Accessibility.** `progressbar` role with a bounded `accessibilityValue`.

---

### `EyeToggle`

**Purpose.** Balance masking (11 — "privacy is a control, not a setting").

**Props.** `hidden` · `onToggle` · `size` · `testID`

**Constraints.** `onToggle` receives the state the control is moving _to_, so callers never invert
it. The glyph may be any size; the tap target stays 48pt.

**Accessibility.** `switch` role, `accessibilityState.checked`, and a label that flips with state
— a user always hears what the next press will do.

---

### `BaconFab`

**Purpose.** The app switcher, and Bacon's only persistent navigation (09).

**Props.** `onPress` · `accessibilityLabel` · `accessibilityHint` · `testID`

**Constraints.** A 56pt navy circle with the 2×2 grid glyph. Money screens only — rendering it on
a coloured ground logs a development warning.

**Invalid use.** A tab bar beside it. The package ships no navigator: navigation _mechanics_ belong
to the consuming app, and Bacon provides the control.

---

### `BaconArrow`

**Purpose.** The long arrow used by `TopBar` and `RowLink` (08, 09).

**Props.** `direction` · `size` · `color` · `testID`

**Engineering decision.** Drawn from `View`s rather than SVG so the package needs no native peer
dependency for two glyphs. Colour defaults to the surface's text colour. Hidden from assistive
technology: it is decoration beside a labelled control.

---

### `DestructiveAction`

**Purpose.** A destructive action (04, 11).

**Props.** `children` (a string) · `onPress` · `confirmLabel` · `disabled` · `testID`

**Constraints.** Bare bold red text. No background, no border, no radius — the surface exists only
to guarantee the 48pt target. Guide 04 — "Destructive red is always bare text: never a button,
never an icon."

Phrase the label in the first person: _I want to delete this budget._

**`confirmLabel`** implements Guide 12's "give destructive actions a confirmation step of their
own": the first press swaps the label, the second fires `onPress`. The copy stays with the app,
because confirmation wording is product language.

**Accessibility.** `button` role with the first-person label, so it is identifiable by form rather
than by colour alone.

---

## Molecules

### `TopBar`

**Purpose.** Screen navigation (08, 11).

**Props.** `onBack` · `forwardAction` · `onClose` · `testID`

**Constraints.** 56pt, transparent, no shadow, and **no title** — there is no `title` prop, because
a title in the top bar is a named misuse (13). Back is always the left arrow, never a word.
Forward is a Bold uppercase word plus a long arrow, top right.

`forwardAction.label` is typed `'NEXT' | 'FINISH'`. Submit, Save and Confirm are compile errors
(02). `onClose` renders `CLOSE ×` for a dismissable screen and suppresses the back arrow.

**Invalid use.** A bottom CTA instead of the top-right action.

```tsx
<TopBar onBack={back} forwardAction={{ label: 'FINISH', onPress: finish }} />
```

---

### `QuestionInput`

**Purpose.** The Bacon input (08).

**Props.** `question` (required) · `value` · `onChangeText` · `keyboardType` · `autoFocus` ·
`maxLength` · `children` · `onSubmitEditing` · `testID`

**Constraints.** A Bold question centred above a centred editable value on a 2pt navy rule. That is
the entire input. There is no `label` prop (Guide 02 — ask, don't label) and no `placeholder` prop
(placeholder-as-label is a pattern Bacon does not use).

**Accessibility.** The question is the field's accessible label.

---

### `QuickAmountInput`

**Purpose.** A numeric field with quick amounts (11 — "type or tap, always both").

**Props.** `question` · `value` · `onChangeValue` · `options` · `currency` · `autoFocus` · `testID`

**Constraints.** Tapping a chip writes into the same value the field edits, and the field stays
editable afterwards. There is no `chipsOnly` or `readOnly` option: the guide forbids both halves of
that. `value` is `number | null`, so an empty field is distinguishable from a deliberate zero.

---

### `ChipGroup` and `CategoryChipGroup`

**Purpose.** A single-choice group (08, 12).

**Props.** `label` · `options` · `value` · `onChange` · `testID`
`CategoryChipGroup` adds `categories` and `question`, defaulting to `BACON_CATEGORIES` and the
guide's own wording.

**Constraints.** Chips wrap into **ragged centred rows**, not a rigid grid — "that irregularity is
part of the look". There is no `columns` prop.

**Accessibility.** The container is a `radiogroup` (not itself an accessibility element, so it does
not swallow the radios inside it); each chip is a `radio`.

**Invalid use.** Replacing the emoji categories with an icon set (13).

---

### `StatTile` / `StatTileRow`

**Purpose.** The three-up statistic tile (09).

**Props.** `label` · `percent` · `testID`; `StatTileRow` takes `stats`.

**Constraints.** The word is **always "remaining"**, never "used", and it is hardcoded — there is
no prop that can change it. Navy at any non-zero percentage, red at zero.

**Accessibility.** The percentage stays visible at zero and the label says "nothing left", so the
state is never carried by the red alone.

---

### `TransactionRow`, `SectionHeader`, `BalanceDisplay`

- **`TransactionRow`** — left-aligned title and attribution, right-aligned date. `handle` renders
  as _Updated by @ddruu1_ (02), keeping the `@`.
- **`SectionHeader`** — the 24 / 700 section role, left-aligned, announced as a header, with room
  for one trailing control.
- **`BalanceDisplay`** — pairs an amount with `EyeToggle`. Pairing them in one component is how
  "the eye sits beside every balance, at all times" (11) stops being something to remember.

---

## Organisms

### `WalletTile` / `WalletGrid`

**Purpose.** The central Bacon surface (09).

**Props.** `name` · `amount` · `category` · `meta` · `progress` · `state` · `onPress` ·
`currency` · `testID`

**States.** `normal` (white + the one shadow) · `overBudget` (solid red) · `prioritySavings`
(solid navy) — and no more.

**Constraints.** The order is fixed and is the component's _structure_, not a prop: emoji +
category, wallet name, amount, period or target, progress. There is no `backgroundColor`,
`textColor` or `borderRadius` prop. Coloured tiles are flat; only the white tile carries a shadow.

**Accessibility.** The label names the wallet, the category, the amount in words, the period, and
the state — "over budget" or "priority savings goal" — so the red or navy surface is never the only
signal.

`WalletGrid` lays tiles out 2-up with the documented 20pt gap; columns stretch to fill rather than
being pinned at 150pt, which keeps the gutter and gap exact up to 480pt.

---

### `RowLink`

**Purpose.** The "go somewhere" affordance (09).

**Props.** `title` · `subtitle` · `emphasis` · `onPress` · `testID`

**Constraints.** 88pt tall. Bold title, regular subtitle, long arrow right. `subtitle` marks the
emphasised value with `{}`:

```tsx
<RowLink title="My Savings" subtitle="You have {} active wallets" emphasis={4} onPress={go} />
```

That renders the count in Bold inside the regular line — Guide 06's "bold used surgically inside
running text to carry the number". A white card on paper, a Navy 700 panel on navy.

**Accessibility.** `link` role: it hands the user to another screen rather than acting here.

---

### `BottomSheet`, `SheetPrimaryAction`, `SheetAction`

**Purpose.** The one overlay in the product (09).

**Props.** `visible` · `onRequestClose` · `children` · `accessibilityLabel` · `testID`

**Constraints.** Top corners 24pt. The page behind stays **visible and undimmed** — there is no
`dim`, `backdropOpacity` or `scrim` prop, and the backdrop is painted transparent rather than left
to a default. A dimmed scrim is the Material pattern Bacon deliberately does not use.

Order is fixed: a navy pill, plain text links, destructive red text last.

**Invalid use.** A trash icon. A filled red destructive button. Turning this into a generic
Material bottom sheet with snap points.

```tsx
<BottomSheet visible={open} onRequestClose={close}>
  <SheetPrimaryAction onPress={update}>Update Savings</SheetPrimaryAction>
  <SheetAction onPress={prioritise}>Set as priority</SheetAction>
  <SheetAction onPress={invite}>Invite partner</SheetAction>
  <DestructiveAction onPress={remove}>I want to delete this savings</DestructiveAction>
</BottomSheet>
```

---

### `Hero`, `Panel`, `PanelGroup`

- **`Hero`** — ≈250pt, content top-weighted, `variant="paper" | "navy"`. The navy hero carries the
  24pt bottom corners.
- **`Panel`** — Navy 700, radius 16, **no shadow and no border**: separation on navy comes from the
  tint step (04).
- **`PanelGroup`** — a small bold group label above 2-up panels, the shape of archetype 3.

---

## Templates — the four archetypes

The guide names four archetypes and one overlay. The package has one template per archetype and no
separate "patterns" layer: a second layer over the same five things would be abstraction for its
own sake.

| Template              | Archetype                           | Structure                                                                        |
| --------------------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| `HeroFeedTemplate`    | 1 (and 1b via `heroVariant="navy"`) | Hero, then sections of tiles and row links, FAB on the bottom edge               |
| `OneQuestionTemplate` | 2                                   | TopBar → Light title → question → input → chips. **No footer slot**              |
| `NavyStackTemplate`   | 3                                   | Navy ground, Light title, grouped 2-up panels                                    |
| `CompletionTemplate`  | 4                                   | CLOSE only, Light headline, illustration, one line of consequence, two row links |

`CompletionTemplate.links` is typed as a **pair**, so "two ways onward" is checked by the compiler.
The package ships no toast or snackbar: "confirmation is a full screen, not a transient
message" (11).

**Invalid use.** A fifth archetype. Guide 10 — "if it cannot be one of them, the flow probably
needs splitting rather than a fifth layout."

---

## Utilities

```ts
formatMoney(20000); // "₱ 20,000"     — glyph, hard space, comma grouping
formatMoney(-110); // "₱ -110"       — the minus is never dropped
formatMoney(5000, { showSymbol: false }); // "5,000"
formatMoneyChange(2000, 50); // "₱ 2,000 +50"
formatTarget(25000); // "target 25,000" — lower case
formatPercent(49.6); // "50%"
formatAttribution('ddruu1'); // "Updated by @ddruu1"
maskMoney(20000); // "₱ ••••••"
moneyAccessibilityLabel(-110); // "minus 110 pesos"
```

Development-time guards for consuming apps, where this repository's lint does not run:
`assertSpacing`, `assertRadius`, `assertUiColor`, `assertMutedUsage`. All are no-ops in production.
