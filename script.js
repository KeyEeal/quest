"use strict";

const STORAGE_KEYS = {
  badges: "birthdayQuest.badges",
  completedRoutes: "birthdayQuest.completedRoutes",
  secretUnlocked: "birthdayQuest.secretUnlocked",
  secretViewed: "birthdayQuest.secretViewed",
  stageLockouts: "birthdayQuest.stageLockouts",
  resetUnlocked: "birthdayQuest.resetUnlocked"
};

const RESET_PASSWORD = "lingling";
const LOCKOUT_DURATIONS = [
  30 * 60 * 1000,
  60 * 60 * 1000,
  2 * 60 * 60 * 1000,
  12 * 60 * 60 * 1000
];
const LOCKOUT_MESSAGES = {
  ranger: "The forest closes around you. Wait for the trail to reveal itself again.",
  scholar: "The candles dim. The shelf refuses another answer for now.",
  theatre: "The curtain falls. The next cue will not be given yet."
};

const ROUTES = {
  ranger: {
    id: "ranger",
    relic: "The Map",
    name: "Ranger’s Road",
    badge: "Ranger of the Old Road",
    icon: "⌁",
    finalPhrase: "THE ROAD REMEMBERS YOU",
    intro: "You have chosen The Map. The Ranger’s Road opens before you.",
    theme: "Beyond the last lantern, an old road winds through forests, forgotten campfires, and promises that have outlived their makers.",
    routeImage: "ranger-route-bg.png",
    relicImage: "relic-map.png",
    badgeImage: "ranger-badge.png",
    endingTitle: "The Road Knows Your Name",
    endingMessage: "[Placeholder birthday message for the Ranger’s Road ending. Add a warm memory about courage, loyalty, and every road still waiting ahead.]",
    stages: [
      {
        type: "wordle",
        title: "The Forest Word",
        description: "Branches close over the path. Find the five-letter forest word in six attempts.",
        target: "TRAIL",
        reward: "THE",
        image: "stage-ranger-1.png"
      },
      {
        type: "text",
        title: "The Campfire Riddle",
        description: "Beside the embers rests something folded, weathered, and patient.",
        question: "I am folded when forgotten and opened when hope needs direction. What am I?",
        answer: "MAP",
        reward: "ROAD",
        hint: "Travelers use it before they are lost.",
        image: "stage-ranger-2.png"
      },
      {
        type: "simon",
        title: "The Signal Fire",
        description: "Watch the old road signals, then repeat their order without breaking the chain.",
        sequence: ["fire", "lantern", "raven", "fire"],
        signals: [
          { id: "fire", label: "Signal Fire", symbol: "🔥" },
          { id: "lantern", label: "Lantern", symbol: "🏮" },
          { id: "raven", label: "Raven Call", symbol: "◆" },
          { id: "horn", label: "Ranger Horn", symbol: "♬" }
        ],
        reward: "REMEMBERS",
        image: "stage-ranger-3.png"
      },
      {
        type: "text",
        title: "The Hidden Gate",
        description: "Three roads gleam beyond the gate, but only one asks for no applause.",
        question: "Which path does the faithful traveler choose: gold, glory, or quiet?",
        answer: "QUIET",
        reward: "YOU",
        hint: "The answer is not the loudest one.",
        image: "stage-ranger-4.png"
      }
    ]
  },
  scholar: {
    id: "scholar",
    relic: "The Book",
    name: "Scholar’s Library",
    badge: "Keeper of the Hidden Shelf",
    icon: "▤",
    finalPhrase: "WISDOM OPENS HIDDEN DOORS",
    intro: "You have chosen The Book. The Scholar’s Library stirs awake.",
    theme: "Candles bloom between ancient shelves. Every answer moves a hidden mechanism somewhere behind the walls.",
    routeImage: "scholar-route-bg.png",
    relicImage: "relic-book.png",
    badgeImage: "library-badge.png",
    endingTitle: "The Hidden Shelf Opens",
    endingMessage: "[Placeholder birthday message for the Scholar’s Library ending. Add a thoughtful note about curiosity, cleverness, and the worlds opened by a questioning mind.]",
    stages: [
      {
        type: "text",
        title: "The Locked Shelf",
        description: "A small object waits on a lectern, holding more than its size should allow.",
        question: "What object holds a world but fits in your hands?",
        answer: "BOOK",
        reward: "WISDOM",
        hint: "A reader opens it.",
        image: "stage-library-1.png"
      },
      {
        type: "memory",
        title: "The Shelves Remember",
        description: "Turn the library tiles and reunite every matching pair.",
        symbols: [
          { id: "book", label: "Book", symbol: "▤" },
          { id: "key", label: "Key", symbol: "⚿" },
          { id: "candle", label: "Candle", symbol: "♨" },
          { id: "shelf", label: "Shelf", symbol: "▥" },
          { id: "ink", label: "Ink", symbol: "✒" },
          { id: "parchment", label: "Parchment", symbol: "▧" }
        ],
        reward: "OPENS",
        image: "stage-library-2.png"
      },
      {
        type: "text",
        title: "The Margin Note",
        description: "Symbols crowd the margins, concealing a message beneath their pattern.",
        question: "What do you call knowledge hidden beneath symbols?",
        answer: "CODE",
        reward: "HIDDEN",
        hint: "Programmers write it. Puzzle-makers hide it.",
        image: "stage-library-3.png"
      },
      {
        type: "wordle",
        title: "The Final Word",
        description: "The brass key waits for one last five-letter word.",
        target: "DOORS",
        reward: "DOORS",
        image: "stage-library-4.png"
      }
    ]
  },
  theatre: {
    id: "theatre",
    relic: "The Mask",
    name: "Phantom’s Theatre",
    badge: "Voice Behind the Mask",
    icon: "◒",
    finalPhrase: "THE FINAL SONG RISES",
    intro: "You have chosen The Mask. The Phantom’s Theatre draws its curtains.",
    theme: "The chandelier trembles above velvet seats. Somewhere past the curtain, an unseen orchestra waits for its cue.",
    routeImage: "theatre-route-bg.png",
    relicImage: "relic-mask.png",
    badgeImage: "theatre-badge.png",
    endingTitle: "The House Rises",
    endingMessage: "[Placeholder birthday message for the Phantom’s Theatre ending. Add a dramatic, heartfelt note about music, mystery, and having the courage to be heard.]",
    stages: [
      {
        type: "memory",
        title: "The Masked Pairings",
        description: "Turn the theatre tiles and reunite every matching prop.",
        symbols: [
          { id: "mask", label: "Mask", symbol: "◒" },
          { id: "rose", label: "Rose", symbol: "✿" },
          { id: "chandelier", label: "Chandelier", symbol: "✦" },
          { id: "music", label: "Music Note", symbol: "♪" },
          { id: "curtain", label: "Curtain", symbol: "▥" },
          { id: "candle", label: "Candle", symbol: "♨" }
        ],
        reward: "THE",
        image: "stage-theatre-1.png"
      },
      {
        type: "simon",
        title: "The Chandelier Sequence",
        description: "Watch the theatre lights, then repeat their cue from beginning to end.",
        sequence: ["chandelier", "leftBalcony", "stageLamp", "rightBalcony", "chandelier"],
        signals: [
          { id: "chandelier", label: "Chandelier", symbol: "✦" },
          { id: "leftBalcony", label: "Left Balcony", symbol: "◖" },
          { id: "rightBalcony", label: "Right Balcony", symbol: "◗" },
          { id: "stageLamp", label: "Stage Lamp", symbol: "●" }
        ],
        reward: "FINAL",
        image: "stage-theatre-2.png"
      },
      {
        type: "text",
        title: "The Hidden Note",
        description: "A melody moves through the room, present everywhere and held by no one.",
        question: "What fills a room but cannot be held?",
        answer: "MUSIC",
        reward: "SONG",
        hint: "You hear it.",
        image: "stage-theatre-3.png"
      },
      {
        type: "text",
        title: "The Curtain Call",
        description: "The velvet curtain parts for the final time. The silent audience waits.",
        question: "What does the audience give at the end of a great performance?",
        answer: "APPLAUSE",
        reward: "RISES",
        hint: "Hands make this sound.",
        image: "stage-theatre-4.png"
      }
    ]
  }
};

const ROUTE_IDS = Object.keys(ROUTES);
const ALL_BADGES = ROUTE_IDS.map((routeId) => ROUTES[routeId].badge);

const app = document.querySelector("#app");
const badgeCount = document.querySelector("#badge-count");
const badgeList = document.querySelector("#badge-list");
const ledgerNote = document.querySelector("#ledger-note");
const homeButton = document.querySelector("#home-button");
const resetButton = document.querySelector("#reset-button");

let state = loadState();
let hadAllBadgesAtLoad = ALL_BADGES.every((badge) => state.badges.includes(badge));
let currentRouteId = null;
let currentStageIndex = 0;
let currentWords = [];
let stageSolved = false;
let activePuzzleCleanup = null;
let activeScreenCleanup = null;
let currentView = "home";
let currentLockoutKey = null;

if (hadAllBadgesAtLoad && !state.secretUnlocked) {
  state.secretUnlocked = true;
}
saveState();

function safeParseArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn(`Could not read ${key}; using an empty list.`, error);
    return [];
  }
}

function safeParseObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch (error) {
    console.warn(`Could not read ${key}; using an empty object.`, error);
    return {};
  }
}

function loadStageLockouts() {
  const stored = safeParseObject(STORAGE_KEYS.stageLockouts);
  return Object.fromEntries(Object.entries(stored).flatMap(([stageKey, entry]) => {
    if (!entry || typeof entry !== "object") return [];
    const failures = Math.max(0, Math.floor(Number(entry.failures) || 0));
    const lockedUntil = Math.max(0, Number(entry.lockedUntil) || 0);
    return failures > 0 ? [[stageKey, { failures, lockedUntil }]] : [];
  }));
}

function emptyState() {
  return {
    badges: [],
    completedRoutes: [],
    secretUnlocked: false,
    secretViewed: false,
    stageLockouts: {},
    resetUnlocked: false
  };
}

function loadState() {
  return {
    badges: safeParseArray(STORAGE_KEYS.badges).filter((badge) => ALL_BADGES.includes(badge)),
    completedRoutes: safeParseArray(STORAGE_KEYS.completedRoutes).filter((routeId) => ROUTE_IDS.includes(routeId)),
    secretUnlocked: localStorage.getItem(STORAGE_KEYS.secretUnlocked) === "true",
    secretViewed: localStorage.getItem(STORAGE_KEYS.secretViewed) === "true",
    stageLockouts: loadStageLockouts(),
    resetUnlocked: localStorage.getItem(STORAGE_KEYS.resetUnlocked) === "true"
      || localStorage.getItem(STORAGE_KEYS.secretViewed) === "true"
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.badges, JSON.stringify(state.badges));
  localStorage.setItem(STORAGE_KEYS.completedRoutes, JSON.stringify(state.completedRoutes));
  localStorage.setItem(STORAGE_KEYS.secretUnlocked, String(state.secretUnlocked));
  localStorage.setItem(STORAGE_KEYS.secretViewed, String(state.secretViewed));
  localStorage.setItem(STORAGE_KEYS.stageLockouts, JSON.stringify(state.stageLockouts));
  localStorage.setItem(STORAGE_KEYS.resetUnlocked, String(state.resetUnlocked));
}

function resetQuest() {
  if (!state.resetUnlocked) {
    const password = window.prompt("Enter the reset password.");
    if (password === null) return;
    if (password !== RESET_PASSWORD) {
      window.alert("Reset rejected.");
      return;
    }
  }

  const confirmed = window.confirm("Reset all badges, completed roads, and secret progress?");
  if (!confirmed) return;

  resetAllProgress();
}

function resetAllProgress() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("birthdayQuest."))
    .forEach((key) => localStorage.removeItem(key));
  state = emptyState();
  saveState();
  hadAllBadgesAtLoad = false;
  resetCurrentRoute();
  updateBadgePanel();
  renderHome();
}

function resetCurrentRoute() {
  disposeActivePuzzle();
  currentRouteId = null;
  currentStageIndex = 0;
  currentWords = [];
  stageSolved = false;
  currentLockoutKey = null;
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function imageAsset(filename, alt, extraClass = "") {
  return `<img class="quest-image ${extraClass}" src="assets/images/${filename}" alt="${alt}" loading="lazy">`;
}

function routeClass(routeId) {
  return `route-${routeId}`;
}

function stageLockoutKey(routeId, stageIndex) {
  return `${routeId}-${stageIndex + 1}`;
}

function phraseLockoutKey(routeId) {
  return `${routeId}-phrase`;
}

function activeLockout(stageKey) {
  const lockout = state.stageLockouts[stageKey];
  if (!lockout) return null;
  if (lockout.lockedUntil > Date.now()) return lockout;

  if (lockout.lockedUntil !== 0) {
    lockout.lockedUntil = 0;
    saveState();
  }
  return null;
}

function registerFailure(stageKey) {
  const previousFailures = state.stageLockouts[stageKey]?.failures || 0;
  const failures = previousFailures + 1;
  const durationIndex = Math.min(failures - 1, LOCKOUT_DURATIONS.length - 1);
  const lockout = {
    failures,
    lockedUntil: Date.now() + LOCKOUT_DURATIONS[durationIndex]
  };
  state.stageLockouts[stageKey] = lockout;
  saveState();
  return lockout;
}

function formatLockoutTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function renderLockout(route, stageTitle, stageKey, onExpired) {
  const lockout = activeLockout(stageKey);
  if (!lockout) {
    onExpired();
    return;
  }

  currentView = "lockout";
  currentLockoutKey = stageKey;
  setScreen(`
    <section class="screen parchment content-screen route-screen lockout-screen ${routeClass(route.id)}" aria-labelledby="lockout-title">
      <div class="lockout-content">
        <p class="section-label">${route.name}</p>
        <h2 id="lockout-title">${stageTitle}</h2>
        <p class="lead lockout-message">${LOCKOUT_MESSAGES[route.id]}</p>
        <div class="lockout-timer" role="timer" aria-live="polite">
          <span>Trail reopens in</span>
          <strong id="lockout-countdown">${formatLockoutTime(lockout.lockedUntil - Date.now())}</strong>
        </div>
        <div class="button-row">
          <button class="primary-button" id="lockout-home-button" type="button">Return Home</button>
          <button class="secondary-button" id="lockout-routes-button" type="button">Choose Another Relic</button>
        </div>
      </div>
    </section>
  `);

  const countdown = document.querySelector("#lockout-countdown");
  let countdownTimer = null;
  const updateCountdown = () => {
    const remaining = lockout.lockedUntil - Date.now();
    if (remaining > 0) {
      countdown.textContent = formatLockoutTime(remaining);
      return;
    }

    window.clearInterval(countdownTimer);
    state.stageLockouts[stageKey].lockedUntil = 0;
    saveState();
    currentLockoutKey = null;
    activePuzzleCleanup = null;
    onExpired();
  };

  countdownTimer = window.setInterval(updateCountdown, 1000);
  activePuzzleCleanup = () => window.clearInterval(countdownTimer);
  document.querySelector("#lockout-home-button").addEventListener("click", renderHome);
  document.querySelector("#lockout-routes-button").addEventListener("click", renderLetter);
}

function disposeActivePuzzle() {
  if (typeof activePuzzleCleanup === "function") activePuzzleCleanup();
  activePuzzleCleanup = null;
}

function disposeActiveScreen() {
  if (typeof activeScreenCleanup === "function") activeScreenCleanup();
  activeScreenCleanup = null;
}

function setScreen(markup, { immersive = false } = {}) {
  disposeActivePuzzle();
  disposeActiveScreen();
  document.body.classList.toggle("immersive-stage-active", immersive);
  app.innerHTML = markup;
  if (!immersive) window.scrollTo({ top: 0, behavior: "smooth" });
}

function badgeItemsMarkup() {
  return ROUTE_IDS.map((routeId) => {
    const route = ROUTES[routeId];
    const earned = state.badges.includes(route.badge);
    return `
      <div class="badge-item ${earned ? "earned" : ""}">
        <div class="badge-seal" aria-hidden="true">
          ${earned ? imageAsset(route.badgeImage, "", "ledger-badge-image") : "◇"}
        </div>
        <div>
          <strong>${earned ? route.badge : "Undiscovered badge"}</strong>
          <small>${earned ? "Collected" : route.name}</small>
        </div>
      </div>
    `;
  }).join("");
}

function updateBadgePanel() {
  const count = state.badges.length;
  badgeCount.textContent = `Badges found: ${count} / 3`;
  badgeList.innerHTML = badgeItemsMarkup();

  if (state.secretUnlocked) {
    ledgerNote.textContent = state.secretViewed
      ? "Every road has spoken, and the final letter has been read."
      : "The three seals are glowing. A final door has appeared.";
  } else if (count === 3) {
    ledgerNote.textContent = "Three roads have been walked. Something may change when the world is entered again.";
  } else if (count > 0) {
    ledgerNote.textContent = `${3 - count} ${3 - count === 1 ? "road remains" : "roads remain"}. The ledger will remember.`;
  } else {
    ledgerNote.textContent = "Three relics wait. Choose the road that calls first.";
  }
}

function renderHome() {
  resetCurrentRoute();
  currentView = "home";
  const secretAvailable = state.secretUnlocked && hadAllBadgesAtLoad;
  const primaryLetterLabel = secretAvailable ? "Open the Final Letter" : "Open the Letter";
  const secretCard = secretAvailable
    ? `
      <button class="secret-door-card" id="secret-door-button" type="button">
        ${imageAsset("final-door.png", "A glowing fantasy door surrounded by three awakened seals", "light door-art")}
        <span>
          <strong>A final door has appeared.</strong>
          <span>The three seals answer one another. Enter the door.</span>
        </span>
      </button>
    `
    : "";

  setScreen(`
    <section class="screen parchment home-screen" aria-labelledby="home-title">
      <img class="home-background" src="assets/images/hero-background.png" alt="" aria-hidden="true">
      <div class="home-content">
        <div class="home-sigil" aria-hidden="true">✦</div>
        <h1 id="home-title">The Birthday Quest</h1>
        <p class="lead">A letter has arrived for one reader, one wanderer, one solver of impossible things.</p>
        <div class="button-row">
          <button class="primary-button" id="open-letter-button" type="button">${primaryLetterLabel}</button>
        </div>
        <p class="home-progress">Badges found: ${state.badges.length} / 3</p>
        ${state.resetUnlocked ? '<p class="completion-notice reset-free-note">The old seal is gone. Reset Quest is now free to use.</p>' : ""}
        ${secretCard}
      </div>
    </section>
  `);

  document.querySelector("#open-letter-button").addEventListener(
    "click",
    secretAvailable ? renderSecretEnding : renderLetter
  );
  const secretButton = document.querySelector("#secret-door-button");
  if (secretButton) secretButton.addEventListener("click", renderSecretEnding);
}

function renderLetter() {
  currentView = "letter";
  currentLockoutKey = null;
  const relicCards = ROUTE_IDS.map((routeId) => {
    const route = ROUTES[routeId];
    const completed = state.completedRoutes.includes(routeId);
    return `
      <button class="relic-card ${routeId}" type="button" data-route-id="${routeId}">
        ${imageAsset(route.relicImage, `${route.relic}, the relic for ${route.name}`, "relic-art")}
        <h3>${route.relic}</h3>
        <p>${route.name}</p>
        ${completed ? '<span class="completed-ribbon">Road completed — walk again</span>' : ""}
      </button>
    `;
  }).join("");

  setScreen(`
    <section class="screen parchment content-screen" aria-labelledby="letter-title">
      <div class="letter-layout">
        ${imageAsset("sealed-letter.png", "An aged parchment letter closed with a wax seal", "light letter-art")}
        <div class="letter-copy">
          <p>To the traveler whose birthday has turned another page: three relics have been left upon this table, and each remembers a different road.</p>
          <p>Take the map if old paths call to you. Take the book if questions are your compass. Take the mask if music waits behind the curtain.</p>
          <p>Each road guards four words. Bring them together, speak the phrase they form, and the road will offer its mark.</p>
        </div>
      </div>
      <div class="screen-heading">
        <p class="section-label">Choose a relic</p>
        <h2 id="letter-title">Three roads lie before you</h2>
      </div>
      <div class="relic-grid">${relicCards}</div>
    </section>
  `);

  document.querySelectorAll("[data-route-id]").forEach((card) => {
    card.addEventListener("click", () => startRoute(card.dataset.routeId));
  });
}

function startRoute(routeId) {
  const route = ROUTES[routeId];
  if (!route) return;

  currentRouteId = routeId;
  currentStageIndex = 0;
  currentWords = [];
  stageSolved = false;
  currentView = "route";
  currentLockoutKey = null;

  setScreen(`
    <section class="screen parchment content-screen route-screen ${routeClass(routeId)}" aria-labelledby="route-title">
      <div class="route-intro-layout">
        ${imageAsset(route.routeImage, `${route.name} landscape`, "light route-art")}
        <div class="route-copy">
          <p class="section-label">${route.relic} chosen</p>
          <h2 id="route-title">${route.name}</h2>
          <p class="lead">${route.intro}</p>
          <p>${route.theme}</p>
          <div class="button-row">
            <button class="primary-button" id="begin-trial-button" type="button">Begin Trial</button>
            <button class="secondary-button" id="choose-another-button" type="button">Choose Another Relic</button>
          </div>
        </div>
      </div>
    </section>
  `);

  document.querySelector("#begin-trial-button").addEventListener("click", renderStage);
  document.querySelector("#choose-another-button").addEventListener("click", renderLetter);
}

function puzzleInstructionCopy(type) {
  const instructions = {
    text: "Enter one answer and submit it. Answers ignore capitalization and extra spaces. A wrong submitted answer triggers this stage's lockout.",
    wordle: "Find the five-letter word in six attempts. Green runes are correctly placed, amber runes belong elsewhere, and grey runes are absent. A physical keyboard works on desktop.",
    memory: "Reveal two tiles at a time and reunite every matching pair. Matched tiles remain open until the whole set is complete.",
    simon: "Play the signal sequence, watch its full order, then repeat each signal. Number keys 1 through 4 also select the four signals."
  };
  return instructions[type] || instructions.text;
}

function bindStageChrome() {
  const modalPairs = [
    ["#stage-instructions-button", "#stage-instructions-modal"],
    ["#stage-badges-button", "#stage-badges-modal"]
  ];
  let activeModal = null;

  function closeModal(modal = activeModal) {
    if (!modal) return;
    modal.hidden = true;
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    }
    if (activeModal === modal) activeModal = null;
  }

  function openModal(trigger, modal) {
    if (activeModal) closeModal(activeModal);
    modal.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    activeModal = modal;
    modal.querySelector(".stage-drawer-close").focus();
  }

  modalPairs.forEach(([triggerSelector, modalSelector]) => {
    const trigger = document.querySelector(triggerSelector);
    const modal = document.querySelector(modalSelector);
    trigger.addEventListener("click", () => openModal(trigger, modal));
  });

  document.querySelectorAll("[data-stage-modal-close]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.closest(".stage-modal")));
  });

  const handleEscape = (event) => {
    if (event.key === "Escape" && activeModal) closeModal(activeModal);
  };
  document.addEventListener("keydown", handleEscape);
  document.querySelector("#stage-home-button").addEventListener("click", renderHome);
  document.querySelector("#stage-reset-button").addEventListener("click", resetQuest);

  return () => document.removeEventListener("keydown", handleEscape);
}

function renderStage() {
  const route = ROUTES[currentRouteId];
  if (!route) {
    renderHome();
    return;
  }

  const stage = route.stages[currentStageIndex];
  const lockoutKey = stageLockoutKey(route.id, currentStageIndex);
  if (activeLockout(lockoutKey)) {
    renderLockout(route, stage.title, lockoutKey, renderStage);
    return;
  }

  currentView = "stage";
  currentLockoutKey = null;
  stageSolved = false;
  const puzzleType = stage.type || "text";
  const dots = route.stages.map((_, index) => {
    const status = index < currentStageIndex ? "complete" : index === currentStageIndex ? "current" : "";
    return `<span class="progress-dot ${status}" aria-hidden="true"></span>`;
  }).join("");

  setScreen(`
    <section class="screen stage-experience route-screen ${routeClass(route.id)}" style="--stage-background-image: url('assets/images/${stage.image}');" aria-labelledby="stage-title">
      <header class="stage-hud" aria-label="Current trial controls">
        <div class="stage-hud-route">
          <strong>${route.name}</strong>
          <span>Trial ${currentStageIndex + 1} of 4</span>
        </div>
        <div class="stage-hud-stats" aria-label="Current quest progress">
          <span>Badges: ${state.badges.length} / 3</span>
          <span id="stage-fragment-count">Fragments: ${currentWords.length} / 4</span>
        </div>
        <div class="stage-hud-actions">
          <button class="stage-hud-button" id="stage-instructions-button" type="button" aria-controls="stage-instructions-modal" aria-expanded="false">Instructions</button>
          <button class="stage-hud-button" id="stage-badges-button" type="button" aria-controls="stage-badges-modal" aria-expanded="false">View Badges</button>
          <button class="stage-hud-button" id="stage-home-button" type="button">Home</button>
          <button class="stage-hud-button stage-hud-reset" id="stage-reset-button" type="button">Reset Quest</button>
        </div>
      </header>

      <div class="stage-viewport">
        <aside class="stage-narration">
          <p class="section-label">${puzzleType} trial</p>
          <h1 id="stage-title">${stage.title}</h1>
          <p class="stage-description">${stage.description}</p>
          <p class="stage-route-context">${route.theme}</p>
          <div class="progress-dots" aria-label="Stage ${currentStageIndex + 1} of 4">${dots}</div>
        </aside>

        <article class="stage-puzzle-panel" aria-label="${stage.title} puzzle">
          <div class="stage-panel-heading">
            <span>${route.relic}</span>
            <strong>Trial ${currentStageIndex + 1}</strong>
          </div>
          <div class="puzzle-root" id="puzzle-root"></div>
          <div id="reward-area"></div>
        </article>
      </div>

      <div class="stage-modal" id="stage-instructions-modal" hidden>
        <button class="stage-modal-backdrop" type="button" data-stage-modal-close aria-label="Close instructions"></button>
        <section class="stage-drawer" role="dialog" aria-modal="true" aria-labelledby="stage-instructions-title">
          <button class="stage-drawer-close" type="button" data-stage-modal-close aria-label="Close instructions">×</button>
          <p class="section-label">How this trial works</p>
          <h2 id="stage-instructions-title">Instructions</h2>
          <p>${puzzleInstructionCopy(puzzleType)}</p>
          <p>${stage.description}</p>
        </section>
      </div>

      <div class="stage-modal" id="stage-badges-modal" hidden>
        <button class="stage-modal-backdrop" type="button" data-stage-modal-close aria-label="Close badge ledger"></button>
        <section class="stage-drawer stage-badge-drawer" role="dialog" aria-modal="true" aria-labelledby="stage-badges-title">
          <button class="stage-drawer-close" type="button" data-stage-modal-close aria-label="Close badge ledger">×</button>
          <p class="section-label">Badge Ledger</p>
          <h2 id="stage-badges-title">Collected seals</h2>
          <p class="stage-drawer-count">Badges: ${state.badges.length} / 3</p>
          <div class="stage-badge-list">${badgeItemsMarkup()}</div>
        </section>
      </div>
    </section>
  `, { immersive: true });

  activeScreenCleanup = bindStageChrome();
  const renderer = puzzleRenderers[puzzleType] || renderTextPuzzle;
  activePuzzleCleanup = renderer(route, stage, currentStageIndex) || null;
}

function completeStage(routeId, stageIndex, rewardWord) {
  const route = ROUTES[routeId];
  const stage = route?.stages[stageIndex];
  if (
    stageSolved ||
    routeId !== currentRouteId ||
    stageIndex !== currentStageIndex ||
    !stage ||
    stage.reward !== rewardWord
  ) return;

  stageSolved = true;
  if (!currentWords.includes(rewardWord)) currentWords.push(rewardWord);
  disposeActivePuzzle();

  const fragmentCount = document.querySelector("#stage-fragment-count");
  if (fragmentCount) fragmentCount.textContent = `Fragments: ${currentWords.length} / 4`;

  const puzzleRoot = document.querySelector("#puzzle-root");
  if (puzzleRoot) {
    puzzleRoot.classList.add("puzzle-solved");
    puzzleRoot.querySelectorAll("button, input").forEach((control) => {
      control.disabled = true;
    });
  }

  document.querySelector("#reward-area").innerHTML = `
    <div class="reward-reveal" role="status">
      <span>Word unlocked</span>
      <strong>${rewardWord}</strong>
    </div>
    <div class="form-actions">
      <button class="primary-button" id="continue-button" type="button">${stageIndex === 3 ? "Approach the Phrase Gate" : "Continue"}</button>
    </div>
  `;
  document.querySelector("#continue-button").addEventListener("click", continueRoute);
}

const puzzleRenderers = {
  text: renderTextPuzzle,
  wordle: renderWordlePuzzle,
  memory: renderMemoryPuzzle,
  simon: renderSimonPuzzle
};

function renderTextPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  root.innerHTML = `
    <div class="question-block"><p>${stage.question}</p></div>
    <form class="answer-form" id="stage-form">
      <label class="input-label" for="stage-answer">Your answer</label>
      <input class="answer-input" id="stage-answer" name="answer" type="text" autocomplete="off" required>
      <div class="form-actions">
        <button class="primary-button" type="submit">Submit Answer</button>
        <button class="hint-button" id="hint-button" type="button">Show Hint</button>
      </div>
    </form>
    <p class="feedback" id="stage-feedback" aria-live="polite"></p>
  `;

  const form = root.querySelector("#stage-form");
  const input = root.querySelector("#stage-answer");
  const feedback = root.querySelector("#stage-feedback");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (normalizeAnswer(input.value) === normalizeAnswer(stage.answer)) {
      feedback.className = "feedback success";
      feedback.textContent = "The answer is true. A word appears in the light.";
      completeStage(route.id, stageIndex, stage.reward);
      return;
    }

    const lockoutKey = stageLockoutKey(route.id, stageIndex);
    registerFailure(lockoutKey);
    renderLockout(route, stage.title, lockoutKey, renderStage);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    form.requestSubmit();
  });

  root.querySelector("#hint-button").addEventListener("click", () => {
    feedback.className = "feedback";
    feedback.textContent = `Hint: ${stage.hint}`;
  });
  if (!window.matchMedia("(max-width: 640px)").matches) input.focus();
}

/*
  Wordle-style puzzle logic adapted from:
  https://github.com/gauravbehere/wordle

  Original project license: MIT.
  Original copyright: Copyright (c) 2022 Gaurav.

  Modified for Birthday Quest by Jurgen, 2026.
  See THIRD_PARTY_NOTICES.md for full license notice.
*/
function renderWordlePuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const target = stage.target.toUpperCase();
  const maxAttempts = 6;
  const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  let attempt = 0;
  let guess = "";
  let finished = false;

  function boardMarkup() {
    return Array.from({ length: maxAttempts }, (_, rowIndex) => `
      <div class="wordle-row" data-wordle-row="${rowIndex}" aria-label="Guess ${rowIndex + 1}">
        ${Array.from({ length: target.length }, (_, columnIndex) =>
          `<span class="wordle-tile" data-wordle-cell="${rowIndex}-${columnIndex}"></span>`
        ).join("")}
      </div>
    `).join("");
  }

  function keyboardMarkup() {
    return keyboardRows.map((letters, rowIndex) => `
      <div class="wordle-key-row">
        ${rowIndex === 2 ? '<button class="wordle-key wordle-key-wide" type="button" data-wordle-key="ENTER" aria-label="Submit guess">Enter</button>' : ""}
        ${[...letters].map((letter) => `<button class="wordle-key" type="button" data-wordle-key="${letter}" aria-label="Letter ${letter}">${letter}</button>`).join("")}
        ${rowIndex === 2 ? '<button class="wordle-key wordle-key-wide" type="button" data-wordle-key="BACKSPACE" aria-label="Delete last letter">⌫</button>' : ""}
      </div>
    `).join("");
  }

  function resetGame() {
    attempt = 0;
    guess = "";
    finished = false;
    const showKeyboardByDefault = window.matchMedia("(max-width: 640px)").matches;
    root.innerHTML = `
      <div class="wordle-instructions">
        <span><i class="legend-correct"></i> right place</span>
        <span><i class="legend-present"></i> wrong place</span>
        <span><i class="legend-absent"></i> not in word</span>
      </div>
      <div class="wordle-board" role="grid" aria-label="Six guesses for a ${target.length}-letter word">${boardMarkup()}</div>
      <p class="feedback wordle-feedback" id="wordle-feedback" aria-live="polite">Type or use the runic keyboard.</p>
      <div class="wordle-keyboard-toggle-row">
        <button class="secondary-button wordle-keyboard-toggle" id="wordle-keyboard-toggle" type="button" aria-controls="wordle-keyboard" aria-expanded="${showKeyboardByDefault ? "true" : "false"}">${showKeyboardByDefault ? "Hide Runic Keyboard" : "Show Runic Keyboard"}</button>
      </div>
      <div class="wordle-keyboard" id="wordle-keyboard" ${showKeyboardByDefault ? "" : "hidden"} aria-label="Word puzzle keyboard">${keyboardMarkup()}</div>
      <div class="wordle-retry" id="wordle-retry"></div>
    `;
    root.querySelectorAll("[data-wordle-key]").forEach((button) => {
      button.addEventListener("click", () => handleKey(button.dataset.wordleKey));
    });
    const keyboard = root.querySelector("#wordle-keyboard");
    const keyboardToggle = root.querySelector("#wordle-keyboard-toggle");
    keyboardToggle.addEventListener("click", () => {
      const willShow = keyboard.hidden;
      keyboard.hidden = !willShow;
      keyboardToggle.setAttribute("aria-expanded", String(willShow));
      keyboardToggle.textContent = willShow ? "Hide Runic Keyboard" : "Show Runic Keyboard";
    });
  }

  function renderGuess() {
    for (let columnIndex = 0; columnIndex < target.length; columnIndex += 1) {
      const cell = root.querySelector(`[data-wordle-cell="${attempt}-${columnIndex}"]`);
      cell.textContent = guess[columnIndex] || "";
      cell.classList.toggle("filled", Boolean(guess[columnIndex]));
    }
  }

  function setKeyboardState(letter, result) {
    const key = root.querySelector(`[data-wordle-key="${letter}"]`);
    if (!key) return;
    const rank = { absent: 1, present: 2, correct: 3 };
    const current = key.dataset.state;
    if (!current || rank[result] > rank[current]) {
      key.dataset.state = result;
    }
  }

  function evaluateGuess(value) {
    const result = Array(target.length).fill("absent");
    const remaining = {};

    [...target].forEach((letter, index) => {
      if (value[index] === letter) {
        result[index] = "correct";
      } else {
        remaining[letter] = (remaining[letter] || 0) + 1;
      }
    });

    [...value].forEach((letter, index) => {
      if (result[index] === "correct") return;
      if (remaining[letter] > 0) {
        result[index] = "present";
        remaining[letter] -= 1;
      }
    });
    return result;
  }

  function submitGuess() {
    const feedback = root.querySelector("#wordle-feedback");
    if (guess.length !== target.length) {
      feedback.className = "feedback error wordle-feedback shake";
      feedback.textContent = `The word needs ${target.length} letters.`;
      window.setTimeout(() => feedback.classList.remove("shake"), 320);
      return;
    }

    const result = evaluateGuess(guess);
    result.forEach((stateName, index) => {
      const cell = root.querySelector(`[data-wordle-cell="${attempt}-${index}"]`);
      cell.dataset.state = stateName;
      setKeyboardState(guess[index], stateName);
    });

    if (guess === target) {
      finished = true;
      feedback.className = "feedback success wordle-feedback";
      feedback.textContent = "The forest word is true.";
      completeStage(route.id, stageIndex, stage.reward);
      return;
    }

    attempt += 1;
    guess = "";
    if (attempt >= maxAttempts) {
      finished = true;
      feedback.className = "feedback error wordle-feedback";
      feedback.textContent = `The word was ${target}. The trail will let you try again.`;
      root.querySelector("#wordle-retry").innerHTML = '<button class="secondary-button" id="retry-wordle" type="button">Try Again</button>';
      root.querySelector("#retry-wordle").addEventListener("click", resetGame);
    } else {
      feedback.className = "feedback wordle-feedback";
      feedback.textContent = `${maxAttempts - attempt} ${maxAttempts - attempt === 1 ? "attempt" : "attempts"} remain.`;
    }
  }

  function handleKey(key) {
    if (finished) return;
    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE") {
      guess = guess.slice(0, -1);
      renderGuess();
    } else if (/^[A-Z]$/.test(key) && guess.length < target.length) {
      guess += key;
      renderGuess();
    }
  }

  function handlePhysicalKey(event) {
    if (document.querySelector(".stage-modal:not([hidden])")) return;
    if (event.target?.matches?.("input, textarea, select, [contenteditable='true']")) return;
    if (event.target instanceof HTMLButtonElement && (event.key === "Enter" || event.key === " ")) return;

    if (/^[a-zA-Z]$/.test(event.key)) {
      handleKey(event.key.toUpperCase());
    } else if (event.key === "Enter" || event.key === "Backspace") {
      event.preventDefault();
      handleKey(event.key.toUpperCase());
    }
  }

  resetGame();
  document.addEventListener("keydown", handlePhysicalKey);
  return () => document.removeEventListener("keydown", handlePhysicalKey);
}

/*
  Memory card puzzle logic adapted from:
  https://github.com/taniarascia/memory

  Original project license: MIT.
  Original copyright: Copyright (c) 2018 Tania Rascia.

  Modified for Birthday Quest by Jurgen, 2026.
  See THIRD_PARTY_NOTICES.md for full license notice.
*/
function renderMemoryPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const pairCount = window.matchMedia("(max-width: 640px)").matches ? 4 : Math.min(6, stage.symbols.length);
  const selectedSymbols = stage.symbols.slice(0, pairCount);
  const cards = shuffleCards(selectedSymbols.flatMap((item) => [
    { ...item, cardId: `${item.id}-a` },
    { ...item, cardId: `${item.id}-b` }
  ]));
  let firstIndex = null;
  let secondIndex = null;
  let matchedPairs = 0;
  let locked = false;
  let flipTimer = null;

  root.innerHTML = `
    <p class="puzzle-instructions">Find all ${pairCount} matching pairs. Cards may be selected with the mouse, touch, or keyboard.</p>
    <div class="memory-grid" style="--memory-columns: ${pairCount <= 4 ? 4 : 4}" aria-label="Memory matching board">
      ${cards.map((card, index) => `
        <button class="memory-card" type="button" data-memory-index="${index}" aria-label="Hidden card ${index + 1}">
          <span class="memory-card-inner">
            <span class="memory-card-back" aria-hidden="true">✦</span>
            <span class="memory-card-front" aria-hidden="true"><b>${card.symbol}</b><small>${card.label}</small></span>
          </span>
        </button>
      `).join("")}
    </div>
    <p class="feedback memory-feedback" id="memory-feedback" aria-live="polite">Pairs found: 0 / ${pairCount}</p>
  `;

  const buttons = [...root.querySelectorAll("[data-memory-index]")];

  function setCardOpen(index, isOpen, isMatched = false) {
    const button = buttons[index];
    const card = cards[index];
    button.classList.toggle("is-open", isOpen);
    button.classList.toggle("is-matched", isMatched);
    button.setAttribute("aria-label", isOpen || isMatched ? `${card.label}${isMatched ? ", matched" : ", revealed"}` : `Hidden card ${index + 1}`);
    if (isMatched) button.disabled = true;
  }

  function chooseCard(index) {
    if (locked || index === firstIndex || buttons[index].classList.contains("is-matched")) return;
    setCardOpen(index, true);

    if (firstIndex === null) {
      firstIndex = index;
      return;
    }

    secondIndex = index;
    locked = true;
    const feedback = root.querySelector("#memory-feedback");

    if (cards[firstIndex].id === cards[secondIndex].id) {
      setCardOpen(firstIndex, true, true);
      setCardOpen(secondIndex, true, true);
      matchedPairs += 1;
      firstIndex = null;
      secondIndex = null;
      locked = false;
      feedback.className = "feedback success memory-feedback";
      feedback.textContent = `Pairs found: ${matchedPairs} / ${pairCount}`;
      if (matchedPairs === pairCount) {
        feedback.textContent = "Every pair remembers its place.";
        completeStage(route.id, stageIndex, stage.reward);
      }
      return;
    }

    feedback.className = "feedback memory-feedback";
    feedback.textContent = "Those symbols do not answer one another. Try again.";
    flipTimer = window.setTimeout(() => {
      setCardOpen(firstIndex, false);
      setCardOpen(secondIndex, false);
      firstIndex = null;
      secondIndex = null;
      locked = false;
    }, 760);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => chooseCard(Number(button.dataset.memoryIndex)));
  });

  return () => {
    if (flipTimer) window.clearTimeout(flipTimer);
  };
}

function shuffleCards(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

/*
  Simon sequence puzzle logic adapted from:
  https://github.com/JoseNoriegaa/simon-game-js

  Original project license: MIT.
  Original copyright: Copyright (c) 2019 Jose Noriega.

  Modified for Birthday Quest by Jurgen, 2026.
  See THIRD_PARTY_NOTICES.md for full license notice.
*/
function renderSimonPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flashDuration = reducedMotion ? 100 : 380;
  const gapDuration = reducedMotion ? 70 : 180;
  let acceptingInput = false;
  let playerIndex = 0;
  let disposed = false;
  const pendingDelays = new Set();

  root.innerHTML = `
    <p class="puzzle-instructions">Play the sequence, then repeat each signal in the same order. Number keys 1–4 also work.</p>
    <div class="simon-grid" aria-label="Sequence signals">
      ${stage.signals.map((signal, index) => `
        <button class="simon-signal" type="button" data-signal-id="${signal.id}" data-signal-index="${index}" disabled aria-label="${index + 1}: ${signal.label}">
          <span aria-hidden="true">${signal.symbol}</span>
          <strong>${signal.label}</strong>
          <small>Key ${index + 1}</small>
        </button>
      `).join("")}
    </div>
    <div class="form-actions simon-actions">
      <button class="primary-button" id="play-sequence" type="button">Play Sequence</button>
      <button class="secondary-button" id="retry-sequence" type="button" hidden>Retry Sequence</button>
    </div>
    <p class="feedback simon-feedback" id="simon-feedback" aria-live="polite">The signals are waiting.</p>
  `;

  const signalButtons = [...root.querySelectorAll("[data-signal-id]")];
  const playButton = root.querySelector("#play-sequence");
  const retryButton = root.querySelector("#retry-sequence");
  const feedback = root.querySelector("#simon-feedback");

  function delay(milliseconds) {
    return new Promise((resolve) => {
      const entry = { timer: null, resolve };
      entry.timer = window.setTimeout(() => {
        pendingDelays.delete(entry);
        resolve(!disposed);
      }, milliseconds);
      pendingDelays.add(entry);
    });
  }

  function setSignalsEnabled(enabled) {
    signalButtons.forEach((button) => {
      button.disabled = !enabled;
    });
  }

  async function flashSignal(signalId) {
    const button = root.querySelector(`[data-signal-id="${signalId}"]`);
    if (!button || disposed) return false;
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    if (!await delay(flashDuration)) return false;
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
    return delay(gapDuration);
  }

  async function playSequence() {
    acceptingInput = false;
    playerIndex = 0;
    setSignalsEnabled(false);
    playButton.disabled = true;
    retryButton.hidden = true;
    feedback.className = "feedback simon-feedback";
    feedback.textContent = `Watch carefully: ${stage.sequence.length} signals.`;
    if (!await delay(reducedMotion ? 120 : 420)) return;

    for (const signalId of stage.sequence) {
      if (!await flashSignal(signalId)) return;
    }

    if (disposed) return;
    acceptingInput = true;
    setSignalsEnabled(true);
    feedback.textContent = "Your turn. Repeat the full sequence.";
    signalButtons[0].focus();
  }

  function failSequence() {
    acceptingInput = false;
    setSignalsEnabled(false);
    feedback.className = "feedback error simon-feedback shake";
    feedback.textContent = "That signal broke the chain. Replay it and try again.";
    retryButton.hidden = false;
    window.setTimeout(() => feedback.classList.remove("shake"), 320);
  }

  function chooseSignal(signalId) {
    if (!acceptingInput) return;
    void flashSignal(signalId);
    if (signalId !== stage.sequence[playerIndex]) {
      failSequence();
      return;
    }

    playerIndex += 1;
    feedback.className = "feedback success simon-feedback";
    feedback.textContent = `${playerIndex} / ${stage.sequence.length} signals remembered.`;
    if (playerIndex === stage.sequence.length) {
      acceptingInput = false;
      setSignalsEnabled(false);
      feedback.textContent = "The whole sequence answers you.";
      completeStage(route.id, stageIndex, stage.reward);
    }
  }

  function handleNumberKey(event) {
    if (!acceptingInput || !/^[1-4]$/.test(event.key)) return;
    const signal = stage.signals[Number(event.key) - 1];
    if (signal) chooseSignal(signal.id);
  }

  signalButtons.forEach((button) => {
    button.addEventListener("click", () => chooseSignal(button.dataset.signalId));
  });
  playButton.addEventListener("click", playSequence);
  retryButton.addEventListener("click", playSequence);
  document.addEventListener("keydown", handleNumberKey);

  return () => {
    disposed = true;
    document.removeEventListener("keydown", handleNumberKey);
    signalButtons.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
    pendingDelays.forEach((entry) => {
      window.clearTimeout(entry.timer);
      entry.resolve(false);
    });
    pendingDelays.clear();
  };
}

function continueRoute() {
  if (currentStageIndex < 3) {
    currentStageIndex += 1;
    renderStage();
  } else {
    renderPhraseGate();
  }
}

function renderPhraseGate() {
  const route = ROUTES[currentRouteId];
  if (!route) {
    renderHome();
    return;
  }

  const lockoutKey = phraseLockoutKey(route.id);
  if (activeLockout(lockoutKey)) {
    renderLockout(route, "The Phrase Gate", lockoutKey, renderPhraseGate);
    return;
  }

  currentView = "phrase";
  currentLockoutKey = null;
  const wordTokens = currentWords.map((word) => `<span class="word-token">${word}</span>`).join("");
  setScreen(`
    <section class="screen parchment phrase-screen route-screen ${routeClass(route.id)}" aria-labelledby="phrase-title">
      <div class="phrase-content">
        <p class="section-label">The phrase gate</p>
        <h2 id="phrase-title">Four words. One answer.</h2>
        <p class="lead">The words you recovered are carved into the gate. Speak them as one complete phrase.</p>
        <div class="word-row" aria-label="Collected words">${wordTokens}</div>
        <form class="answer-form" id="phrase-form">
          <label class="input-label" for="phrase-answer">Enter the full phrase</label>
          <input class="answer-input" id="phrase-answer" name="phrase" type="text" autocomplete="off" required>
          <div class="form-actions">
            <button class="primary-button" type="submit">Open the Gate</button>
          </div>
        </form>
        <p class="feedback" id="phrase-feedback" aria-live="polite"></p>
      </div>
    </section>
  `);

  document.querySelector("#phrase-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = normalizeAnswer(document.querySelector("#phrase-answer").value);
    const feedback = document.querySelector("#phrase-feedback");
    if (value === normalizeAnswer(route.finalPhrase)) {
      completeRoute();
    } else {
      registerFailure(lockoutKey);
      renderLockout(route, "The Phrase Gate", lockoutKey, renderPhraseGate);
    }
  });
  document.querySelector("#phrase-answer").focus();
}

function completeRoute() {
  const route = ROUTES[currentRouteId];
  if (!route) return;

  if (!state.badges.includes(route.badge)) state.badges.push(route.badge);
  if (!state.completedRoutes.includes(route.id)) state.completedRoutes.push(route.id);

  // Intentionally do not unlock the secret here. The page-load check above is
  // the only path that changes secretUnlocked after all three badges exist.
  saveState();
  updateBadgePanel();
  renderRouteEnding(route.id);
}

function renderRouteEnding(routeId) {
  const route = ROUTES[routeId];
  const allBadgesNow = ALL_BADGES.every((badge) => state.badges.includes(badge));
  currentView = "route-ending";
  currentLockoutKey = null;

  setScreen(`
    <section class="screen parchment content-screen route-screen ${routeClass(route.id)}" aria-labelledby="ending-title">
      <div class="ending-layout">
        <div class="ending-badge">
          ${imageAsset(route.badgeImage, route.badge, "light ending-art")}
          <span>Badge earned</span>
          <strong>${route.badge}</strong>
        </div>
        <div class="ending-copy">
          <p class="section-label">Road complete</p>
          <h2 id="ending-title">${route.endingTitle}</h2>
          <p>${route.endingMessage}</p>
          <p><strong>Badge earned:</strong> ${route.badge}</p>
          <p><strong>Badges found:</strong> ${state.badges.length} / 3</p>
          ${allBadgesNow && !state.secretUnlocked ? '<p class="completion-notice">Three roads have been walked. Something may change when the world is entered again.</p>' : ""}
          <div class="button-row">
            <button class="primary-button" id="another-road-button" type="button">Walk Another Road</button>
            <button class="secondary-button" id="ending-home-button" type="button">Return Home</button>
          </div>
        </div>
      </div>
    </section>
  `);

  document.querySelector("#another-road-button").addEventListener("click", renderLetter);
  document.querySelector("#ending-home-button").addEventListener("click", renderHome);
}

function renderSecretEnding() {
  if (!state.secretUnlocked || !hadAllBadgesAtLoad) {
    renderHome();
    return;
  }

  state.secretViewed = true;
  state.resetUnlocked = true;
  saveState();
  updateBadgePanel();
  currentView = "secret-ending";
  currentLockoutKey = null;

  const badges = ALL_BADGES.map((badge) => `<span>${badge}</span>`).join("");
  setScreen(`
    <section class="screen parchment content-screen secret-screen" aria-labelledby="secret-title">
      <div class="secret-layout">
        <div class="secret-art-stack">
          ${imageAsset("final-door.png", "The final glowing door at the end of every road", "light final-door-art")}
          ${imageAsset("secret-badge.png", "The Finder of Every Road badge", "light secret-badge-art")}
        </div>
        <div class="secret-copy">
          <p class="section-label">Every seal is awake</p>
          <h2 class="secret-title" id="secret-title">The True Birthday Letter</h2>
          <p>[Placeholder heartfelt birthday letter. Replace this with the final personal message that brings together the courage of the Ranger’s Road, the wisdom of the Scholar’s Library, and the music of the Phantom’s Theatre.]</p>
          <p>[Placeholder closing paragraph: a warm wish for the year ahead, written directly to the birthday traveler.]</p>
          <div class="secret-badges" aria-label="All collected badges">${badges}</div>
          <span class="final-title">Finder of Every Road</span>
          <p class="completion-notice">The old seal is gone. Reset Quest is now free to use.</p>
          <div class="button-row">
            <button class="primary-button" id="secret-home-button" type="button">Return Home</button>
            <button class="secondary-button" id="secret-reset-button" type="button">Reset Quest</button>
          </div>
        </div>
      </div>
    </section>
  `);

  document.querySelector("#secret-home-button").addEventListener("click", renderHome);
  document.querySelector("#secret-reset-button").addEventListener("click", resetQuest);
}

homeButton.addEventListener("click", renderHome);
resetButton.addEventListener("click", resetQuest);

function installDevHelpers() {
  if (new URLSearchParams(window.location.search).get("dev") !== "1") {
    delete window.BQ_DEV;
    return;
  }

  window.BQ_DEV = {
    clearLockouts() {
      state.stageLockouts = {};
      saveState();
      if (currentView === "lockout") {
        const wasPhraseGate = currentLockoutKey?.endsWith("-phrase");
        currentLockoutKey = null;
        if (wasPhraseGate) renderPhraseGate();
        else renderStage();
      }
      return true;
    },
    resetAll() {
      resetAllProgress();
      return true;
    },
    unlockAllBadges() {
      state.badges = [...ALL_BADGES];
      state.completedRoutes = [...ROUTE_IDS];
      saveState();
      updateBadgePanel();
      renderHome();
      return [...state.badges];
    },
    unlockSecret() {
      state.badges = [...ALL_BADGES];
      state.completedRoutes = [...ROUTE_IDS];
      state.secretUnlocked = true;
      hadAllBadgesAtLoad = true;
      saveState();
      updateBadgePanel();
      renderHome();
      return true;
    },
    completeCurrentStage() {
      const route = ROUTES[currentRouteId];
      if (!route) return false;

      if (currentView === "phrase" || currentLockoutKey === phraseLockoutKey(route.id)) {
        delete state.stageLockouts[phraseLockoutKey(route.id)];
        saveState();
        completeRoute();
        return true;
      }

      const stage = route.stages[currentStageIndex];
      if (!stage) return false;
      delete state.stageLockouts[stageLockoutKey(route.id, currentStageIndex)];
      saveState();
      if (currentView !== "stage") renderStage();
      completeStage(route.id, currentStageIndex, stage.reward);
      return true;
    },
    showState() {
      const snapshot = JSON.parse(JSON.stringify({
        ...state,
        currentRouteId,
        currentStageIndex,
        currentWords,
        currentView
      }));
      console.log("Birthday Quest state", snapshot);
      return snapshot;
    }
  };
}

updateBadgePanel();
renderHome();
installDevHelpers();
