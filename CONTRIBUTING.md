# Contributing to Bacon

This guide covers working on Bacon itself: setting up, the day-to-day commands, trying a change in
a real app, the rules a change has to follow, and cutting a release.

If you only want to _use_ Bacon in an app, read [Getting started](docs/getting-started.md) instead.

---

## Set up

```bash
git clone https://github.com/druloloy/bacon-design-library.git
cd bacon-design-library
npm install
```

`npm install` also builds `lib/` (the `prepare` script), so a fresh clone is immediately ready.
Use Node 18 or newer.

## Everyday commands

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm test`           | Runs every test                                                     |
| `npm run test:watch` | Re-runs tests as you edit                                           |
| `npm run lint`       | ESLint, including Bacon's brand rules                               |
| `npm run lint:fix`   | Fixes what ESLint can fix automatically                             |
| `npm run typecheck`  | Strict TypeScript check                                             |
| `npm run format`     | Formats everything with Prettier                                    |
| `npm run build`      | Builds `lib/` — CommonJS, ES modules and type declarations          |
| `npm run verify`     | Lint, typecheck, tests, build, then a check against the built files |

Run `npm run verify` before you push. It's what CI runs.

## Where things live

```
src/
  foundations/   colours, type scale, spacing, radii, shadow, layout — the tokens
  theme/         BaconThemeProvider and the surface model
  atoms/         single-purpose pieces: BaconText, BaconButton, BaconChip…
  molecules/     small interactions: TopBar, QuestionInput, QuickAmountInput…
  organisms/     the main surfaces: WalletTile, RowLink, BottomSheet…
  templates/     the four screen types
  utils/         money formatting, accessibility labels, dev-time checks
  index.ts       the public API — if it isn't exported here, apps can't use it
tests/
  unit/          formatting and tokens
  brand/         rules that protect the brand itself
  components/    component behaviour
  accessibility/ the Brand Guide's accessibility requirements
  integration/   the public API, imported the way an app imports it
stories/         Storybook stories
example/         an Expo app that uses Bacon
scripts/         the check that runs against the built package
docs/            the documentation
```

## See your change on screen

### In the example app and Storybook

```bash
npm run build
cd example
npm install
npm start           # the example screens
npm run storybook   # the component catalogue
```

The example app links to your local copy of Bacon, so run `npm run build` again after changing
`src/`. It needs the Quicksand font files first; see
[`example/assets/fonts/README.md`](example/assets/fonts/README.md).

### Inside your own app

The most reliable way is to push a branch and install that exact commit. It goes through the same
install path a release does:

```bash
git push origin my-change
git rev-parse HEAD          # copy the commit hash
```

Then, in your app:

```bash
yarn add github:druloloy/bacon-design-library#<commit-hash>
```

Installing by commit hash rather than branch name means you always know exactly which version of
your change the app is running. Push again, install the new hash.

For a faster edit-and-reload loop you can point your app at a local folder instead, but React Native
needs extra setup for that: Metro has to watch the folder, and it must not load a second copy of
React (which shows up as an "Invalid hook call" error). [`example/metro.config.js`](example/metro.config.js)
shows the configuration that handles both.

---

## Before you add a component

Answer these first. If an answer is uncomfortable, the change probably belongs in the app, not in
Bacon.

1. **Is it a reusable Bacon pattern**, or one screen's layout?
2. **Does something already do this?** Check the four templates first. A screen that fits none of
   them usually needs splitting, not a fifth template.
3. **Can it be built from the existing tokens?**
4. **Does it need a new colour?** The palette is eight colours, and closed.
5. **Does it need a new spacing value?** The scale is 4 · 8 · 12 · 20 · 40. If a gap wants to be 16,
   it's 12 or 20.
6. **Does it need a new radius?** There are three: 16 for cards, 24 for heroes and sheets, and fully
   rounded pills.
7. **Does it need another shadow?** There's exactly one, for white cards on a light screen.
8. **Does it need a new text size or weight?** Only the documented roles exist, and weight 600 is
   deliberately missing.
9. **Is it design, or app logic?** API calls, navigation, persistence and data models belong to the
   app.

A new colour, radius or weight added for one screen isn't a small change: it splits Bacon into two
systems. Change the tokens everywhere, or don't change them.

## Where a change belongs

| Concern                                       | Bacon | The app |
| --------------------------------------------- | ----- | ------- |
| Colour, type, spacing, radii, shadow          | ✅    |         |
| What a wallet tile looks like in each state   | ✅    |         |
| What "over budget" _means_ for a given wallet |       | ✅      |
| Accessibility labels on Bacon's controls      | ✅    |         |
| The words on a specific screen                |       | ✅      |
| The four screen templates                     | ✅    |         |
| Which template a given screen uses            |       | ✅      |
| Navigation and routing                        |       | ✅      |
| The round app-switcher button                 | ✅    |         |
| What that button opens                        |       | ✅      |

## Designing an API

Make the right thing easy and the wrong thing impossible:

```tsx
<WalletTile state="overBudget" />                         // ✅
<WalletTile backgroundColor="#DE0A26" borderRadius={7} /> // ❌ not possible, on purpose
```

- **Prefer a fixed set of options to style props.** `state`, `variant` and `surface` are unions.
- **Let the screen decide the look.** `BaconButton` reads whether it's on a light or navy screen and
  styles itself. That's why it has two variants instead of six.
- **Keep escape hatches narrow.** `BaconText` accepts a `style` prop, but only for layout —
  margins, flex, width. It can move text; it can't restyle it.
- **Make forbidden things impossible to write.** `TopBar` has no `title` prop. `BaconButton` has
  no `danger` variant. `CompletionTemplate.links` must be exactly two items.

## Tests

Write the behaviour test first. If the Brand Guide has an opinion about the behaviour, add a test
for that rule too:

```tsx
describe('WalletTile', () => {
  it('renders an over-budget wallet as a red surface', () => {});
  it('never puts grey text on a coloured tile', () => {});
  it('keeps the minus sign on a negative amount', () => {});
});
```

Tests in `tests/brand/` are different from the rest. They don't check that code works; they check
that the brand still holds — eight colours, five spacing values, one shadow, no weight 600. If you
find yourself changing one, stop and ask whether you're changing the brand.

## Lint rules that protect the brand

ESLint fails the build on:

- a hex colour anywhere outside `src/foundations/colors.ts`;
- `fontWeight: '600'`;
- setting `fontFamily` directly instead of using `BaconText`.

## What CI checks

| Job                          | What it proves                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Lint, typecheck, test, build | Everything in `npm run verify`, plus formatting and coverage                                             |
| Example app                  | The example app typechecks against the built library                                                     |
| Installs from GitHub         | Installing the pushed commit with npm and with yarn builds the library, and an app typechecks against it |

---

## Releasing

Bacon is released as a git tag and a GitHub Release. It's never published to npm; apps install it
by tag.

1. **Pick the version** using the table below.
2. **Set `version`** in `package.json`.
3. **Update `CHANGELOG.md`.** Move the notes from `[Unreleased]` into a new
   `## [1.1.0] — YYYY-MM-DD` section, and update the comparison links at the bottom.
4. **Commit, push to `main`, and wait for CI to pass.**
5. **Tag the release and push the tag:**

   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

Pushing the tag runs the release workflow. It re-runs every check, confirms the tag,
`package.json` version and changelog all agree, and creates the GitHub Release with that version's
changelog notes. Apps then update by changing their tag.

**Never move or delete a tag once it's pushed.** Apps pinned to it expect it to always mean the same
code.

### Choosing a version

Bacon follows Semantic Versioning, with one addition: **changing a design token is a breaking
change.** Changing a colour, type size, spacing value or radius can move things on every screen of
every app, even though no function signature changed.

| Change                                    | Version bump |
| ----------------------------------------- | ------------ |
| A token's value changes                   | Major        |
| A public export is removed or renamed     | Major        |
| A prop's type gets stricter               | Major        |
| New component or new optional prop        | Minor        |
| New token, with existing tokens unchanged | Minor        |
| Bug fix with no visual change             | Patch        |
| Docs, tests or tooling only               | Patch        |

List token changes under a **Changed — tokens** heading in the changelog, so anyone updating sees
at a glance that pixels will move.

## Documenting a component

Every exported component has a doc comment that says:

- what it's for;
- which Brand Guide rule it implements, quoted, with the section number;
- what it deliberately doesn't offer, and why;
- which choices were engineering decisions rather than brand rules, labelled as such.

The Brand Guide is the authority. Where it's silent and we had to decide, the code says so, rather
than presenting our choice as a brand rule.

Add the component to [`docs/components.md`](docs/components.md) and, if it's something apps will
reach for, to the table in the [README](README.md#whats-included).
