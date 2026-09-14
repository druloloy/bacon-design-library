# Example app

A small Expo app that uses Bacon the way a real app does. Use it to see the components running
together, and as a reference when you build your own screens.

Every import in `src/` comes from `@druloloy/bacon-ui` — never from a file inside the library.

## What's in it

| Screen             | Template              | Shows                                                                                                                                  |
| ------------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard          | `HeroFeedTemplate`    | Balance with the hide/show eye, stat tiles, wallet tiles in all three states, row links, app-switcher button, bottom sheet with delete |
| Add New Budget (1) | `OneQuestionTemplate` | Top bar with NEXT, a question, a text field, category chips                                                                            |
| Add New Budget (2) | `OneQuestionTemplate` | Type-or-tap amount field, period chips, FINISH in the top bar                                                                          |
| Completion         | `CompletionTemplate`  | CLOSE, headline, illustration, one line about what happens next, two row links                                                         |
| Settings           | `NavyStackTemplate`   | Navy screen with grouped panels and buttons                                                                                            |

## Run it

1. **Add the fonts.** Put the four Quicksand files in `assets/fonts/`. See
   [`assets/fonts/README.md`](assets/fonts/README.md).
2. **Build Bacon and start the app**, from the repository root:

   ```bash
   npm install
   npm run build
   cd example
   npm install
   npm start
   ```

The example uses your **local copy** of Bacon (`"@druloloy/bacon-ui": "file:.."`), not the GitHub
release, so it always reflects what's in `src/`. After changing Bacon's source, run `npm run build`
in the repository root to see the change here.

## Run Storybook

```bash
cd example
npm run storybook
```

This generates the story list from the repository's `stories/` folder, then starts the app in
Storybook mode.

## Things worth copying

- **Fonts** — [`App.tsx`](App.tsx) loads the four Quicksand files and passes
  `fontStrategy="named"` to `BaconThemeProvider`.
- **Linking a local library** — [`metro.config.js`](metro.config.js) lets Metro see the library
  folder and makes sure only one copy of React is loaded. You need the same setup to use a local
  checkout of Bacon in your own app.
- **Where logic lives** — routing, draft form state and wallet data stay in the app (`App.tsx`,
  `src/data.ts`). Bacon only decides how things look.
