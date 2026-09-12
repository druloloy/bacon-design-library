# Changelog

All notable changes to `@bacon/design-system` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) with one Bacon-specific rule:

> **A change to a foundational design token is a breaking change.**
>
> Tokens are a published API. Changing `navy900`, a type role, a spacing value or a radius can move
> every screen in every consuming app even though no function signature changed. Such a change
> ships as MAJOR, never as a patch, and is listed under **Changed — tokens** below so a consumer
> can see at a glance whether an upgrade will move pixels.

## [Unreleased]

Nothing yet.

## [1.0.0] — 2026-09-13

The first release. Derived in full from the _Bacon Brand & Interface Guide_ v1.0.

### Added — foundations

- The eight-colour UI palette, sampled from the exported artwork, plus the two navy surfaces used
  on a navy ground.
- Illustration accents (`#7B5FF1`, `#E3E3FF`, `#55D087`) exported **separately** from the UI
  palette and deliberately absent from the theme, so they can never become a UI status.
- `baconRedAccessible` (`#C40A22`), the guide's second remedy for white-on-red contrast, available
  through `BaconThemeProvider useAccessibleRed`.
- The complete type scale — ten documented roles plus `metaOnColor`, `buttonLabel` and
  `progressValue`, each reusing a documented size.
- The 4 · 8 · 12 · 20 · 40 spacing scale, the three radii, the one shadow, and the measured frame
  geometry.
- `BaconThemeProvider` and the surface model (`paper`, `white`, `navy`, `panel`, `red`), which is
  how components resolve legal colours without being told.

### Added — components

- Atoms: `BaconText`, `BaconScreen`, `BaconButton`, `BaconChip`, `BaconMoneyDisplay`,
  `BaconProgressBar`, `EyeToggle`, `BaconFab`, `BaconArrow`, `DestructiveAction`.
- Molecules: `TopBar`, `SectionHeader`, `QuestionInput`, `QuickAmountInput`, `ChipGroup`,
  `CategoryChipGroup`, `StatTile`, `StatTileRow`, `TransactionRow`, `BalanceDisplay`.
- Organisms: `WalletTile`, `WalletGrid`, `RowLink`, `BottomSheet` (with `SheetPrimaryAction` and
  `SheetAction`), `Hero`, `Panel`, `PanelGroup`.
- Templates for the four documented archetypes: `HeroFeedTemplate` (which also covers archetype 1b
  via `heroVariant="navy"`), `OneQuestionTemplate`, `NavyStackTemplate`, `CompletionTemplate`.
- Money formatting: `formatMoney`, `formatMoneyChange`, `formatChange`, `formatTarget`,
  `formatPercent`, `formatHandle`, `formatAttribution`, `maskMoney`, `moneyAccessibilityLabel`.

### Added — the Brand Guide's corrections

These are fixes to defects the guide names in the existing library, not new features:

- Meta text on a coloured surface is **automatically promoted** from 14pt muted to the 16pt / 500
  role, so muted grey can never appear on navy or red and white-on-red never falls below the size
  the guide requires.
- Status red and destructive red are separated **by form**: status is a filled surface
  (`WalletTile state="overBudget"`, `StatTile` at 0%), destruction is bare text
  (`DestructiveAction`). `BaconButton` has no red path at all.
- `DestructiveAction` supports a confirmation step of its own via `confirmLabel`.
- Chips keep their 36pt visual height and grow their hit area to 48pt with `hitSlop` — padding,
  not resizing.
- Chips are announced as a radio group rather than a list of buttons.
- Status is never carried by colour alone: negative amounts keep the minus sign, zero stat tiles
  keep their `0%`, and both are spoken to a screen reader.

### Added — tooling

- Strict TypeScript, ESLint with three brand rules (no raw hex, no weight 600, no direct
  `fontFamily`), Prettier.
- 239 tests across unit, brand-rule, component, accessibility and package-API suites.
- `npm run verify:package`, which typechecks a miniature consuming app against the **built**
  declarations.
- CI (lint, typecheck, format, five test suites, coverage, build, package verification, plus an
  example-app typecheck against the built package) and a release workflow that refuses to publish
  when the tag, `package.json` version and this changelog disagree.
- Storybook stories for the foundations, every significant component, and all four archetypes.
- An example Expo app that consumes the package through its public API only.

### Notes for consumers

- Quicksand is **not bundled**. Register the four weights — 300, 400, 500, 700 — in your app. Do
  not register 600: it is not part of the Bacon type system.
- `react-native-safe-area-context` is an optional peer dependency. Without it, insets resolve to
  zero rather than failing.
- The package has no runtime dependencies. The long arrow and the FAB glyph are drawn from `View`s
  rather than SVG, so no consumer is forced through a native linking step for decoration.

[Unreleased]: https://github.com/bacon/bacon-design-system/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bacon/bacon-design-system/releases/tag/v1.0.0
