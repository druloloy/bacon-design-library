# Contributing to the Bacon Design System

> "The library's strength is that thirty screens agree with each other. A new colour, radius, or
> weight introduced on one screen is not a local decision — it is a fork of the system. Update the
> tokens and the other twenty-nine, or don't."
> — Bacon Brand & Interface Guide, 13 · Misuse

This document exists to make that sentence operational.

---

## Before you add a component

Answer these. If any answer is uncomfortable, the change probably belongs in the application, not
here.

1. **Does this represent a reusable Bacon pattern**, or is it one screen's layout?
2. **Does an existing component already solve this?** Check the four templates first — the guide
   says a screen that fits none of them usually needs splitting, not a fifth layout.
3. **Can it be built from existing tokens?**
4. Does it introduce **a new colour**? The UI palette is eight values and closed.
5. Does it introduce **a new spacing value**? The scale is 4 · 8 · 12 · 20 · 40. If a gap wants to
   be 16, it is 12 or 20.
6. Does it introduce **a new radius**? There are three: 16 card, 24 hero, full pill.
7. Does it introduce **another shadow level**? There is exactly one shadow, and it belongs to white
   cards on Paper.
8. Does it introduce **a new font size or weight**? Only the documented roles exist, and 600 is
   deliberately absent.
9. Is it **design-system functionality or application functionality**? Business logic, API calls,
   navigation configuration, persistence and domain models belong to the app.

## Where a change belongs

| Concern                                       | Design system | Consuming app |
| --------------------------------------------- | ------------- | ------------- |
| Colour, type, spacing, radii, shadow          | ✅            | ❌            |
| What a wallet tile looks like in each state   | ✅            | ❌            |
| What "over budget" _means_ for a given wallet | ❌            | ✅            |
| Accessibility labels for library controls     | ✅            | ❌            |
| Copy for a specific flow                      | ❌            | ✅            |
| Screen archetypes                             | ✅            | ❌            |
| Which archetype a given screen uses           | ❌            | ✅            |
| Navigation mechanics and routing              | ❌            | ✅            |
| The FAB as a control                          | ✅            | ❌            |
| Where the FAB goes                            | ❌            | ✅            |

## Atomic Design, used deliberately

A component earns its level; it is not placed to satisfy a taxonomy.

- **Atoms** carry a single visual or interaction responsibility. `BaconText` sets type. `BaconChip`
  is one selectable pill.
- **Molecules** combine atoms into one reusable _interaction_. `QuickAmountInput` is a field plus
  its chips, wired together — the guide's "type or tap, always both" in one object.
- **Organisms** are Bacon's primary surfaces: the wallet tile, the row link, the bottom sheet.
- **Templates** are the four documented screen archetypes. There is no separate "patterns" layer:
  the guide names four archetypes and one overlay, and having both a template and a pattern for the
  same five things would be abstraction for its own sake.

Do not make components artificially granular. `BaconMoneyDisplay` does not need a `CurrencyGlyph`
atom underneath it.

## API design

Component APIs must make correct Bacon usage easy and incorrect usage difficult.

```tsx
<WalletTile state="overBudget" />                                   // ✅
<WalletTile backgroundColor="#DE0A26" borderRadius={7} />            // ❌ — and not possible
```

Rules of thumb:

- **Prefer a closed union to a set of style props.** `state`, `variant` and `surface` are unions.
- **Let the surface decide, not the caller.** `BaconButton` is a navy fill on Paper and an
  outline-white pill on Navy without being told. That is why it has two variants and not six.
- **Do not add an escape hatch you would not defend in review.** `BaconText` accepts a `style`
  prop typed to _layout properties only_ — it can move text, never restyle it. That is the shape a
  controlled extension point should take.
- **Make the forbidden thing unrepresentable.** `TopBar` has no `title` prop. `BaconButton` has no
  `danger` variant. `StatTile` has no word other than "remaining". `CompletionTemplate.links` is a
  pair, not an array.

## Test-driven development

Write the behaviour test first. For anything the Brand Guide has an opinion about, also write the
rule test.

```tsx
describe('WalletTile', () => {
  it('renders an over-budget wallet as a red surface', () => {});
  it('never puts muted grey on a coloured tile', () => {});
  it('keeps the minus sign on a negative amount', () => {});
});
```

`tests/brand/` is not ordinary coverage. Those tests exist so that a future contributor cannot
quietly degrade the system — if you are changing one of them, stop and ask whether you are changing
the brand.

## The lint rules are brand rules

`.eslintrc.js` fails the build on:

- a raw hex colour anywhere outside `src/foundations/colors.ts`;
- `fontWeight: '600'`;
- a `fontFamily` set directly instead of through `BaconText`.

They are errors, not warnings, for the reason in the epigraph.

## Before you open a pull request

```bash
npm run verify   # lint, typecheck, tests, build, package verification
```

CI runs the same steps plus a typecheck of the example app against the **built** package, which
catches missing exports and broken declarations that source-level tests never see.

## Versioning

Semantic Versioning, with one Bacon-specific rule:

> **A change to a foundational design token is a breaking change.**

Changing `navy900`, a type role, a spacing value or the radius scale can move every screen in every
consuming app, even though no API signature changed. Release it as MAJOR (or at minimum MINOR with
a prominent CHANGELOG note), never as a patch.

| Change                                         | Bump  |
| ---------------------------------------------- | ----- |
| Token value change                             | MAJOR |
| Removing or renaming a public export           | MAJOR |
| Tightening a prop type                         | MAJOR |
| New component or new optional prop             | MINOR |
| New token added without changing existing ones | MINOR |
| Bug fix with no visual change                  | PATCH |
| Documentation, tests, tooling                  | PATCH |

Every release needs a `## [x.y.z]` heading in `CHANGELOG.md`; the release workflow fails without
one.

## Documenting a component

Every public component carries a doc comment stating:

- its purpose;
- the Brand Guide rule it implements, quoted, with the section number;
- what it deliberately does **not** offer, and why;
- anything that is an engineering decision rather than a brand rule — labelled as such.

That last point matters. The guide is the authority; where it is silent and we had to decide, the
code says so explicitly rather than presenting our choice as a brand rule.
