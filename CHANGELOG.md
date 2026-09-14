# Changelog

Every notable change to Bacon (`@druloloy/bacon-ui`), newest first.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) with one addition:

> **Changing a design token is a breaking change.**
>
> Changing `navy900`, a type role, a spacing value or a radius can move things on every screen of
> every app, even though no function signature changed. Those changes ship as a major version and
> are listed under **Changed — tokens**, so you can see at a glance whether an update will move
> pixels.

To update an app, change the tag in its `package.json` — for example
`git+https://github.com/druloloy/bacon-design-library.git#v1.0.0` → `#v1.1.0` — and reinstall.

## [Unreleased]

Nothing yet.

## [1.0.0] — 2026-09-14

The first release, built from the _Bacon Brand & Interface Guide_ v1.0.

### Installing

- Bacon installs from GitHub, not npm:
  `yarn add git+https://github.com/druloloy/bacon-design-library.git#v1.0.0`. The package name is
  `@druloloy/bacon-ui`.
- The library compiles during install (the `prepare` script), so there's no build step in your app.
- Install with the full `git+https://` URL. Yarn Classic fetches the `github:` shorthand as a tarball
  and skips the build.
- The package is marked `private`, so it can't be published to npm by accident.

### Added — foundations

- The eight-colour palette, sampled from the Bacon artwork, including the two navy shades used on
  navy screens.
- Illustration colours (`#7B5FF1`, `#E3E3FF`, `#55D087`), exported separately from the palette and
  kept out of the theme, so they can never be used as a status colour.
- `baconRedAccessible` (`#C40A22`), a darker red for small white text, turned on with
  `<BaconThemeProvider useAccessibleRed>`.
- The type scale: the Brand Guide's ten roles, plus `metaOnColor`, `buttonLabel` and
  `progressValue`, each reusing a documented size.
- The 4 · 8 · 12 · 20 · 40 spacing scale, the three radii, the single shadow, and the layout
  measurements.
- `BaconThemeProvider` and the surface model (`paper`, `white`, `navy`, `panel`, `red`), which lets
  components pick the right colours for the screen they're on.

### Added — components

- **Atoms:** `BaconText`, `BaconScreen`, `BaconButton`, `BaconChip`, `BaconMoneyDisplay`,
  `BaconProgressBar`, `EyeToggle`, `BaconFab`, `BaconArrow`, `DestructiveAction`.
- **Molecules:** `TopBar`, `SectionHeader`, `QuestionInput`, `QuickAmountInput`, `ChipGroup`,
  `CategoryChipGroup`, `StatTile`, `StatTileRow`, `TransactionRow`, `BalanceDisplay`.
- **Organisms:** `WalletTile`, `WalletGrid`, `RowLink`, `BottomSheet` (with `SheetPrimaryAction`
  and `SheetAction`), `Hero`, `Panel`, `PanelGroup`.
- **Templates:** `HeroFeedTemplate` (use `heroVariant="navy"` for a navy hero),
  `OneQuestionTemplate`, `NavyStackTemplate`, `CompletionTemplate`.
- **Formatting:** `formatMoney`, `formatMoneyChange`, `formatChange`, `formatTarget`,
  `formatPercent`, `formatHandle`, `formatAttribution`, `maskMoney`, `moneyAccessibilityLabel`.

### Added — fixes to problems the Brand Guide identifies

- Small grey text on a coloured tile is automatically raised to 16pt / 500 and switched to white,
  so it stays readable on red and navy.
- Red has two meanings, now told apart by shape: over budget is a filled red surface
  (`WalletTile state="overBudget"`, `StatTile` at 0%), and delete is red text
  (`DestructiveAction`). `BaconButton` can't be red.
- `DestructiveAction` can ask for confirmation first, with `confirmLabel`.
- Chips stay 36pt tall but have a 48pt tap area.
- Chip groups are announced to screen readers as a single choice (a radio group).
- Status never relies on colour alone: negative amounts keep their minus sign, a zero stat tile
  keeps its `0%`, and both are read aloud.

### Added — tooling

- Strict TypeScript; ESLint with three brand rules (no raw hex colours, no weight 600, no direct
  `fontFamily`); Prettier.
- 239 tests across unit, brand-rule, component, accessibility and public-API suites.
- `npm run verify:package`, which typechecks a small app against the built type declarations.
- CI that runs every check, typechecks the example app, and installs Bacon from GitHub with both npm
  and yarn: it confirms the install builds the library and ships nothing extra, then reinstalls from
  the lockfile the way an app's own CI would.
- A release workflow that turns a `v*` tag into a GitHub Release, and refuses when the tag,
  `package.json` version and changelog disagree.
- Storybook stories for the tokens, every component and all four templates.
- An example Expo app that uses Bacon only through its public API.

### Notes for apps

- **Fonts aren't bundled.** Add Quicksand in four weights (Light, Regular, Medium, Bold) and pass
  `fontStrategy="named"` to `BaconThemeProvider`. Don't add SemiBold.
- **`react-native-safe-area-context` is optional.** Without it, Bacon ignores notches instead of
  failing.
- **No runtime dependencies.** The arrow and app-switcher icons are drawn with plain views, so
  there's no `react-native-svg` to install or link.

[Unreleased]: https://github.com/druloloy/bacon-design-library/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/druloloy/bacon-design-library/releases/tag/v1.0.0
