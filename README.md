# The Birthday Quest

The Birthday Quest is a static, fantasy-themed birthday puzzle website. A visitor chooses one of three relics, clears four riddle gates and four main puzzle stages, assembles a final phrase, and earns a persistent route badge. Collecting all three badges causes a secret final door to appear only after the website is reloaded.

The stages mix reusable puzzle types:

- text riddles
- Wordle-style word puzzles
- memory card matching games
- Simon-style sequence-memory games
- fog-of-war maze trials
- calculus/math answer trials
- logic deduction arrangements
- audio guess trials with a musical cipher fallback
- Mastermind-style theatre cue puzzles

Every main puzzle resolves through the same `completeStage(routeId, stageIndex, rewardFragment)` function. Riddle gates unlock their matching main puzzle but do not award phrase fragments. The route flow remains: solve four main stages, earn four phrase fragments, reconstruct the final phrase, unlock the route ending, and earn its badge.

The project uses only HTML, CSS, and vanilla JavaScript. It has no backend, database, authentication, package manager, dependencies, or build step.

The first route started also presents a one-time Ring acquisition screen. After the Ring is claimed, its clue control is available on riddle gates, main trials, and phrase gates. Ring use is remembered separately for each road; this version displays warning and corrupted states at one and two uses but does not yet lock a route.

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
- `birthdayQuest.stageLockouts` — per-stage failure counts, lockout expiry times, and last-failure timestamps
- `birthdayQuest.resetUnlocked` — whether viewing the secret ending removed the reset password requirement
- `birthdayQuest.ringAcquired` — whether the one-time Ring pickup has been claimed
- `birthdayQuest.ringState` — per-route Ring use counts, timestamps, and reserved route-lock timestamps

Individual route gates, route stages, and collected phrase fragments are held only in memory and restart after a refresh. Earned route endings, badges, lockouts, and reset-secret state persist.

The secret door is intentionally reload-gated. Earning the third badge shows only the third route ending and the hint that something may change when the world is entered again. On a later page load, the script sees that all three badges were already present, marks the secret as unlocked, and shows the final door on the home screen.

## Reset quest progress

Use the visible **Reset Quest** button in the site header or on the secret ending. Before the secret ending has been viewed, reset requires the quest password and then asks for confirmation. Viewing the secret ending permanently removes the password requirement for that progress state. A reset clears all Birthday Quest progress and returns to a clean home screen.

For manual testing, add `?dev=1` to the URL to expose `window.BQ_DEV` in the browser console. The helper object can clear lockouts, reset all progress, unlock gates, lock or unlock a specific gate, unlock badges or the secret, complete the current gate or stage, and display the current state or route progress. Ring helpers include `clearRingState()`, `acquireRing()`, `setRingUses(routeId, uses)`, and `showRingState()`. It is not exposed without `?dev=1` and no cheats are shown in the interface.

## Puzzle types

Puzzle renderers are registered in `script.js`:

```js
const puzzleRenderers = {
  text: renderTextPuzzle,
  wordle: renderWordlePuzzle,
  memory: renderMemoryPuzzle,
  simon: renderSimonPuzzle,
  maze: renderMazePuzzle,
  math: renderMathPuzzle,
  logic: renderLogicPuzzle,
  audioGuess: renderAudioGuessPuzzle,
  mastermind: renderMastermindPuzzle
};
```

The route engine selects the renderer from each stage's `type`. Every renderer calls the shared completion function with the route ID, stage index, and configured reward fragment.

### Text riddles

Text stages define `question`, `answer`, and `ringClue`. Answers are case-insensitive, ignore leading and trailing whitespace, and collapse repeated spaces. Pressing Enter submits the answer. Ring clues remain hidden until the visitor chooses **Use the Ring**.

### Wordle-style puzzles

Wordle stages define a `target`. The puzzle provides six attempts, duplicate-letter-aware correct/present/absent feedback, an onscreen keyboard that can be shown or collapsed, and physical keyboard support. It has no daily mode, sharing feature, external word list, or API. A wrong guess does not lock the stage; after all six guesses fail, the stage uses the normal per-stage lockout.

### Memory matching puzzles

Memory stages define route-themed `symbols`, plus optional `pairCount`, `timeLimitSeconds`, and `mismatchLimit` settings. The default deck uses eight pairs / sixteen cards, duplicates and shuffles those symbols, permits two revealed cards at a time, marks matches, and completes when every pair is found. The timer starts on the first card flip. Timer expiry or too many mismatches uses the normal per-stage lockout.

### Simon-style sequence puzzles

Simon stages define `signals` and configurable `rounds`, each with its own `sequence`, `replays`, and optional `reverseInput`. The game flashes each round, lets the visitor use allowed replays, then compares input one step at a time. A single wrong signal uses the normal per-stage lockout. Signal buttons also map to number keys, and playback becomes faster on later rounds while still respecting reduced-motion settings.

### Advanced final puzzles

Maze stages generate a vanilla JavaScript 15x15 or 18x18 maze, limit visibility with fog of war, place trail marks and traps, and complete only after the required marks are collected and the gate is reached. Trap placement protects and validates at least one safe route through all required marks and then to the gate. Trap hits return the player to the latest checkpoint; the third trap hit, or a premature gate attempt, uses the normal per-stage lockout.

Math stages show a configured problem and accepted final answers. The current Scholar calculus trial accepts `224` and `224.0`.

Logic stages define books, keys, shelves, clues, and a single configured solution. A submitted complete but wrong arrangement uses the normal per-stage lockout.

Audio guess stages look for a configured local audio file and show controls only if it loads. No copyrighted soundtrack audio is bundled. If the file is missing, the puzzle falls back to the configured musical cipher answer.

Mastermind stages define selectable cue symbols, a hidden sequence, and a guess limit. Each guess reports exact-position matches and wrong-position matches. Running out of guesses uses the normal per-stage lockout.

## Edit routes and puzzles

All route content lives in the structured `ROUTES` object near the top of `script.js`. Each route defines its relic, route name, badge, final phrase, introduction, ending copy, image assets, four riddle gate objects, and four stage objects.

Every riddle gate requires:

```js
{
  routeId: "ranger",
  gateIndex: 1,
  title: "Gate title",
  difficulty: "Medium",
  flavorText: "Route-specific setup copy.",
  question: "Riddle question?",
  acceptedAnswers: ["answer", "accepted variant"],
  preferredAnswer: "ANSWER",
  ringClue: "A helpful clue that does not reveal the answer.",
  feedback: "Optional success feedback.",
  lockoutKey: "ranger-gate-1"
}
```

Riddle gate lockout keys are stored in `birthdayQuest.stageLockouts` alongside main-stage and phrase-gate lockouts.

Every stage requires:

```js
{
  type: "text", // text, wordle, memory, simon, maze, math, logic, audioGuess, or mastermind
  title: "Puzzle title",
  description: "Short instructions or story copy.",
  ringClue: "A helpful clue that does not solve the puzzle.",
  rewardFragment: "TWO OR THREE WORDS",
  image: "stage-illustration.png"
}
```

Then add the fields used by that puzzle type:

- text: `question`, `answer`
- wordle: `target`
- memory: `symbols` containing `{ id, label, symbol }` objects, plus optional `pairCount`, `timeLimitSeconds`, and `mismatchLimit`
- simon: `signals` containing `{ id, label, symbol }` objects and `rounds` containing per-round `sequence` arrays and replay settings

Keep each route's four reward fragments in the same order as its `finalPhrase`.

## Edit final phrases and birthday messages

- Route final phrases are the `finalPhrase` fields in `script.js`.
- The four `rewardFragment` values for a route must spell that phrase in order.
- Route birthday messages are the `endingMessage` fields.
- The true birthday letter is in `renderSecretEnding()`.
- Route introduction and letter copy are also in `script.js`.

Phrase checking is case-insensitive, trims surrounding whitespace, and collapses multiple spaces.

## Image assets

- Artwork lives under `assets/images/` and is rendered by `imageAsset()`.
- Route and stage configuration stores filenames relative to that folder.
- Use useful alternative text whenever adding a new rendered image.

Use original or properly licensed artwork only. The memory games intentionally use text/CSS symbols rather than source-project character artwork.

### Asset credits

Ring image: “Lord of the Rings, the one ring” photo by erik_stein via Good Free Photos.  
License: CC0 / Public Domain.  
Attribution is appreciated by the source but not required.  
Source page: https://www.goodfreephotos.com/other-photos/lord-of-the-rings-the-one-ring.jpg.php

## Third-party attribution

The Wordle-style, memory matching, and Simon sequence mechanics adapt small portions of three MIT-licensed vanilla JavaScript projects. License comments are kept beside the adapted renderer code in `script.js`. Full source links, authors, usage notes, and original MIT notices are in `THIRD_PARTY_NOTICES.md`.

The maze generator is original project code. The `codebox/mazes` repository was checked for a clear MIT license before implementation, but its maze code was not copied or adapted.

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
    audio/
      README.md
    images/
      README.md
```
