# Architecture

Why Bacon is shaped the way it is. Read this when an API seems stricter than you expected — the
reason is usually below.

Each decision is labelled **Brand Guide requirement** (the guide said so), **Architectural
decision** (we chose, and the guide was silent), or **Engineering detail** (a React Native reality,
not a design one).

---

## 1 · The load-bearing idea: surfaces, not themes

**Brand Guide requirement (04).** "A screen's background colour is not a styling choice — it tells
the user what kind of screen they are on."

**Architectural decision.** The guide's most important rule is also the one most likely to be
broken by someone adding a screen. So rather than pass colours down as props, the package models
the _ground a component is standing on_:

```
paper ─ money screens          white ─ cards on paper
navy  ─ system screens         panel ─ Navy 700 panels on navy
red   ─ the over-budget tile
```

`BaconSurfaceProvider` declares it; `useBaconSurface()` reads it. Every surface knows its own
background, text colour, meta colour, track colour and divider.

This one mechanism does a surprising amount of work:

- **`BaconButton` needs only two variants.** It is a navy fill on Paper, an outline-white pill on
  Navy, and a Navy 600 fill inside a Navy 700 panel — without any screen knowing the rule.
- **Muted grey can never land on a coloured surface.** `meta` resolves from the surface, and no
  coloured surface returns muted. The guide's correction is enforced by construction rather than
  by review.
- **The 14pt meta role is auto-promoted to 16pt / 500 on colour** — the guide's own remedy for
  white-on-red contrast — inside `BaconText`, where no caller can forget it.
- **The progress bar changes correctly on each ground**: navy fill on a track, white fill on navy,
  and a white outline with no track on red.

This is deliberately **not** a light/dark theme. There is no colour-scheme switch anywhere, because
both grounds exist at once in the same app and which one a screen gets is a product decision.

## 2 · Making the forbidden unrepresentable

**Architectural decision.** Where the guide forbids something, the first choice is to make it
impossible to express, the second is to make lint fail, and the third is to make a test fail. Most
rules get at least two.

| Forbidden                          | How                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Weight 600                         | `BaconFontWeight` excludes it (compile) · lint rule (build) · brand test (CI)                                           |
| A filled red button                | No `danger` variant exists (compile) · tests on every surface · build verification re-checks the published declarations |
| A title in the top bar             | No `title` prop (compile)                                                                                               |
| Submit / Save / Confirm            | `BaconForwardLabel = 'NEXT' \| 'FINISH'` (compile)                                                                      |
| "used" instead of "remaining"      | The word is hardcoded in `StatTile` (compile)                                                                           |
| More or fewer than two ways onward | `CompletionTemplate.links` is a **tuple** (compile)                                                                     |
| A raw hex colour                   | `no-restricted-syntax` lint rule (build)                                                                                |
| A dimmed bottom-sheet scrim        | No scrim prop; backdrop painted transparent (compile + test)                                                            |
| A fourth wallet state              | `WalletTileState` is a closed union (compile)                                                                           |

## 3 · Controlled extension, not escape hatches

**Architectural decision.** A design system that lets developers override every colour, radius,
font and spacing value is not enforcing anything. But a system with no give at all gets forked.

The compromise: extension points are typed down to what is safe.

- `BaconText.style` accepts **layout** properties only — margins, flex, width. It can move text,
  never restyle it.
- `BaconThemeProvider` accepts exactly three settings, and all three are platform or accessibility
  concerns (`fontStrategy`, `fontFamilyMap`, `useAccessibleRed`). There is no palette override.
- `CategoryChipGroup.categories` can be extended with product categories — but `ChipOption` has
  `emoji` and no `icon`, so the extension cannot become an icon set.
- `currency` is pluggable (`BaconCurrency`), because the formatting _rules_ are the brand and the
  symbol is not.

## 4 · Atomic Design, applied rather than performed

**Architectural decision.** Components sit at the level they earn.

| Level    | What qualifies                                 | Example                                                    |
| -------- | ---------------------------------------------- | ---------------------------------------------------------- |
| Atom     | One visual or interaction responsibility       | `BaconChip` — one selectable pill                          |
| Molecule | Atoms combined into one reusable _interaction_ | `QuickAmountInput` — a field and its chips, wired together |
| Organism | A primary Bacon surface                        | `WalletTile`, `BottomSheet`                                |
| Template | A documented screen archetype                  | `OneQuestionTemplate`                                      |

**Two deliberate departures from a textbook Atomic Design tree:**

1. **No separate `patterns/` layer.** Atomic Design setups often keep both screen _templates_ and
   higher-level _patterns_. For Bacon those would be the same five things twice: the guide names
   _four archetypes and one overlay_. One template per archetype, with the overlay (`BottomSheet`)
   as an organism, is the honest mapping. A second layer would be abstraction for its own sake, and
   the two would drift apart.

2. **Archetypes 1 and 1b are one template.** The guide itself calls 1b "the same archetype, navy
   hero", so `HeroFeedTemplate` takes `heroVariant` rather than there being a second component.

**`BaconScreen` is filed under atoms**, which is arguable. It has a single visual responsibility —
paint the semantic ground, apply the gutter, declare the surface — and every template composes it.
Putting it in `templates/` would have made the templates depend on a sibling.

## 5 · What belongs where

| Concern                                     | Design system | Consuming app |
| ------------------------------------------- | ------------- | ------------- |
| Colour, type, spacing, radii, elevation     | ✅            |               |
| Component appearance and states             | ✅            |               |
| Accessibility behaviour of library controls | ✅            |               |
| Screen archetypes                           | ✅            |               |
| The FAB as a control                        | ✅            |               |
| Money formatting rules                      | ✅            |               |
| Business logic, API calls, persistence      |               | ✅            |
| Domain models — what a "budget" is          |               | ✅            |
| Navigation configuration and routing        |               | ✅            |
| Which archetype a screen uses               |               | ✅            |
| Copy for a specific flow                    |               | ✅            |
| Where the FAB goes, and what it opens       |               | ✅            |
| Font files and font registration            |               | ✅            |

The example app is the demonstration: it holds the routing, the draft-budget state and the wallet
data, and imports every visual decision.

## 6 · Package architecture

**Engineering detail.**

- **One public entry point.** `src/index.ts` is the entire API. The `exports` map has no wildcard,
  so `@druloloy/bacon-ui/src/organisms/WalletTile` does not resolve — deep imports are blocked,
  not merely discouraged.
- **Installed from GitHub, not npm.** Apps depend on
  `git+https://github.com/druloloy/bacon-design-library.git#<tag>`. The package is `private`, so it can't be published by
  accident, and a release is a git tag plus a GitHub Release.
- **Built during install.** `lib/` is not committed. The `prepare` script runs
  `react-native-builder-bob` when an app installs Bacon from GitHub: npm and Yarn Classic both
  install a git dependency's dev dependencies and run its `prepare` script before packing it. Yarn Classic only does this for a git URL: it resolves
  the `github:` shorthand to a tarball and never runs `prepare`, which is why the docs give the full
  `git+https://` URL. That
  keeps build output out of the repository and guarantees it matches the tagged source.
- **`react-native-builder-bob`** produces CommonJS, ES modules and type declarations. The
  `react-native` and `source` fields point at `src`, so Metro can read the TypeScript directly, and
  everything else reads `lib`.
- **No runtime dependencies.** `react` and `react-native` are peers;
  `react-native-safe-area-context` is an _optional_ peer, loaded through a guarded lazy require
  that degrades to zero insets rather than failing an app that does not have it.
- **No `react-native-svg`.** The long arrow and the FAB glyph are drawn from `View`s. Forcing every
  consumer through a native linking step for two pieces of decoration is a poor trade.
- **`sideEffects: false`** so bundlers can tree-shake.
- **Duplicate React is guarded in the example app's Metro config**, which is where a linked library
  usually breaks — and it surfaces as "invalid hook call", not as a resolution error.

## 7 · Verification architecture

**Architectural decision.** Three layers, each catching what the one below cannot.

1. **`tests/brand/`** — asserts the _system_, not the code: eight colours, five spacing values,
   three radii, one shadow, no weight 600. A failure here means someone forked the brand.
2. **`tests/components/` and `tests/accessibility/`** — behaviour and the documented visual states,
   including every accessibility rule the guide lists.
3. **`tests/integration/` and `npm run verify:package`** — the public API, imported the way a
   consumer imports it, and then a miniature consuming app typechecked against the **built
   declarations**. That last step catches the class of bug unit tests never see: a component
   implemented and tested but never exported, or a broken entry point.

CI adds two checks on top:

- **The example app** installs and typechecks against the built library.
- **Installs from GitHub** installs the pushed commit into an empty app with npm and with yarn —
  exactly the way a real app gets Bacon. `scripts/check-installed-package.sh` confirms the install
  built `lib/`, shipped no repository-only folders and no nested React, then an app typechecks
  against what landed in `node_modules`. Finally it reinstalls from the lockfile, as an app's own CI
  would.

## 8 · Platform realities

**Engineering detail**, none of it a brand rule:

- **Font weights.** Android does not reliably apply `fontWeight` to a custom `fontFamily`; only the
  registered family name resolves. So the default strategy is named families on Android and a
  single family elsewhere. The single-family strategy only works when the platform groups all four
  weights under one family name. Expo's `useFonts` registers each file under its own name instead,
  which is why the docs tell apps to pass `fontStrategy="named"`.
- **Shadows.** Android's `elevation` cannot reproduce a coloured, offset, 6%-opacity shadow.
  `elevation: 2` is the closest match; iOS uses the exact spec.
- **Safe areas** come from the optional peer dependency, with a zero fallback.
- **Dynamic Type** is capped at 1.6× — the largest multiplier at which every documented layout
  still holds on the 360pt frame.
- **The progress chip is positioned with a measured width**, not a percentage transform, because
  percentage `translateX` is not available on React Native 0.73.
- **The fluid layout stretches columns rather than scaling every measurement.** The gutter stays
  20pt and the gap stays 20pt from 360pt up to 480pt.

## 9 · Performance

**Engineering detail.** Style objects are computed in `useMemo` keyed on the surface and the
variant, and static styles use `StyleSheet.create`. No component allocates an inline style object
per render on a hot path, and `WalletGrid` and `PanelGroup` are plain flex layouts, so they compose
with `FlatList`/`FlashList` without wrappers.

Deliberately _not_ done: wrapping `WalletTile` and `TransactionRow` in `React.memo`. Memoisation
only pays off when the caller's props are stable, which is the app's decision — and a memo boundary
that never hits is pure overhead plus a changed component identity.
