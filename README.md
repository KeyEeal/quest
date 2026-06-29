# The Birthday Quest

The Birthday Quest is a static, fantasy-themed birthday puzzle website. A visitor chooses one of three relics, completes four stages, assembles a final phrase, and earns a persistent route badge. Collecting all three badges causes a secret final door to appear only after the website is reloaded.

The stages mix four reusable puzzle types:

- text riddles
- Wordle-style five-letter puzzles
- memory card matching games
- Simon-style sequence-memory games

Every puzzle resolves through the same `completeStage(routeId, stageIndex, rewardWord)` function. The route flow remains: solve a stage, earn one word, collect four words, enter the final phrase, unlock the route ending, and earn its badge.

The project uses only HTML, CSS, and vanilla JavaScript. It has no backend, database, authentication, package manager, dependencies, or build step.

## Run locally

Either option works:

1. Open `index.html` directly in a browser.
2. Serve the folder with any simple static server, such as VS Code Live Server or `python -m http.server 8000`, then visit `http://localhost:8000`.

All asset paths are relative, so the site also works from a GitHub Pages project subdirectory.

## Deploy on GitHub Pages

1. Create a GitHub repository and add the contents of this folder to the repository root.
2. Push the files to the default branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the default branch and `/ (root)`, then save.
6. Open the Pages URL shown by GitHub after deployment completes.

No build workflow is required.

## Saved progress

`script.js` uses these `localStorage` keys:

- `birthdayQuest.badges` — collected route badge names
- `birthdayQuest.completedRoutes` — completed route IDs
- `birthdayQuest.secretUnlocked` — whether the page-load secret check unlocked the final door
- `birthdayQuest.secretViewed` — whether the visitor opened the true letter

Individual route stages and their collected words are held only in memory and restart after a refresh. Earned route endings and badges persist.

The secret door is intentionally reload-gated. Earning the third badge shows only the third route ending and the hint that something may change when the world is entered again. On a later page load, the script sees that all three badges were already present, marks the secret as unlocked, and shows the final door on the home screen.

## Reset quest progress

Use the visible **Reset Quest** button in the site header or on the secret ending. The browser asks for confirmation, removes all four Birthday Quest storage keys, and returns to a clean home screen.

For manual testing, the same keys can be removed through the browser developer tools under **Application/Storage → Local Storage**.

## Puzzle types

Puzzle renderers are registered in `script.js`:

```js
const puzzleRenderers = {
  text: renderTextPuzzle,
  wordle: renderWordlePuzzle,
  memory: renderMemoryPuzzle,
  simon: renderSimonPuzzle
};
```

The route engine selects the renderer from each stage's `type`. Every renderer calls the shared completion function with the route ID, stage index, and configured reward word.

### Text riddles

Text stages define `question`, `answer`, and `hint`. Answers are case-insensitive, ignore leading and trailing whitespace, and collapse repeated spaces. Pressing Enter submits the answer.

### Wordle-style puzzles

Wordle stages define a five-letter `target`. The puzzle provides six attempts, duplicate-letter-aware correct/present/absent feedback, an onscreen keyboard, and physical keyboard support. It has no daily mode, sharing feature, external word list, or API. After six failed attempts, the answer is shown and **Try Again** resets that stage.

### Memory matching puzzles

Memory stages define route-themed `symbols`. The deck duplicates and shuffles those symbols, permits two revealed cards at a time, marks matches, and completes when every pair is found. Small screens use four pairs; larger screens use up to six pairs. Cards are native buttons and work with mouse, touch, or keyboard.

### Simon-style sequence puzzles

Simon stages define `signals` and a fixed `sequence`. The game flashes the configured signals, then compares the visitor's input one step at a time. A mistake provides feedback and a replay option. Signal buttons also map to number keys 1–4. Playback timing is shortened when reduced motion is requested.

## Edit routes and puzzles

All route content lives in the structured `ROUTES` object near the top of `script.js`. Each route defines its relic, route name, badge, final phrase, introduction, ending copy, image assets, and four stage objects.

Every stage requires:

```js
{
  type: "text", // text, wordle, memory, or simon
  title: "Puzzle title",
  description: "Short instructions or story copy.",
  reward: "WORD",
  image: "stage-illustration.png"
}
```

Then add the fields used by that puzzle type:

- text: `question`, `answer`, `hint`
- wordle: `target`
- memory: `symbols` containing `{ id, label, symbol }` objects
- simon: `signals` containing `{ id, label, symbol }` objects and a `sequence` of matching IDs

Keep each route's four reward words in the same order as its `finalPhrase`.

## Edit final phrases and birthday messages

- Route final phrases are the `finalPhrase` fields in `script.js`.
- The four `reward` values for a route must spell that phrase in order.
- Route birthday messages are the `endingMessage` fields.
- The true birthday letter is in `renderSecretEnding()`.
- Route introduction and letter copy are also in `script.js`.

Phrase checking is case-insensitive, trims surrounding whitespace, and collapses multiple spaces.

## Image assets

- Artwork lives under `assets/images/` and is rendered by `imageAsset()`.
- Route and stage configuration stores filenames relative to that folder.
- Use useful alternative text whenever adding a new rendered image.

Use original or properly licensed artwork only. The memory games intentionally use text/CSS symbols rather than source-project character artwork.

## Third-party attribution

The Wordle-style, memory matching, and Simon sequence mechanics adapt small portions of three MIT-licensed vanilla JavaScript projects. License comments are kept beside the adapted renderer code in `script.js`. Full source links, authors, usage notes, and original MIT notices are in `THIRD_PARTY_NOTICES.md`.

## Licensing

This project is licensed under the MIT License for original project code.

Some puzzle logic may be adapted from third-party MIT-licensed repositories. See `THIRD_PARTY_NOTICES.md` for attribution and original license notices.

The project uses original fantasy/ranger/library/theatre-inspired theming for personal use. It is not official, endorsed, or licensed by any book, film, musical, author, publisher, studio, or rights holder.

## Project structure

```text
birthday-quest/
  index.html
  style.css
  script.js
  README.md
  LICENSE
  THIRD_PARTY_NOTICES.md
  assets/
    images/
      README.md
```
