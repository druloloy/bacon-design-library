# Example consumer app

A small Expo app whose only job is to prove `@bacon/design-system` works through its public API.

Every import in `src/` comes from `@bacon/design-system`. None reaches into `@bacon/design-system/src/...`
— if one did, the package's `exports` map would refuse to resolve it.

## Screens

| Screen             | Archetype        | What it demonstrates                                                                                        |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Dashboard          | 1 · Hero + feed  | Money hero, balance, eye toggle, wallet tiles in all three states, stat tiles, row links, FAB, bottom sheet |
| Add New Budget (1) | 2 · One question | TopBar with NEXT, Light title, question, text input, category chips                                         |
| Add New Budget (2) | 2 · One question | Quick-amount input (type _or_ tap), period chips, FINISH in the bar                                         |
| Completion         | 4 · Completion   | CLOSE, Light headline, illustration, one line of consequence, two row links                                 |
| Settings           | 3 · Navy stack   | Navy ground, grouped 2-up panels, Navy 600 controls                                                         |

## Running it

```bash
# from the repository root
npm install
npm run build

cd example
npm install
npm start
```

## Running Storybook

```bash
cd example
npm run storybook
```

Storybook renders the stories from the package's `stories/` folder. It lives here rather than in
the library so the published package carries no Storybook dependency.

## Fonts

Put the four Quicksand weights in `assets/fonts/` — see the README there.
