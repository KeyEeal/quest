"use strict";

const STORAGE_KEYS = {
  badges: "birthdayQuest.badges",
  completedRoutes: "birthdayQuest.completedRoutes",
  secretUnlocked: "birthdayQuest.secretUnlocked",
  secretViewed: "birthdayQuest.secretViewed",
  stageLockouts: "birthdayQuest.stageLockouts",
  resetUnlocked: "birthdayQuest.resetUnlocked",
  ringAcquired: "birthdayQuest.ringAcquired",
  ringState: "birthdayQuest.ringState",
  routeProgress: "birthdayQuest.routeProgress",
  routeLives: "birthdayQuest.routeLives",
  timeoutDifficulty: "birthdayQuest.timeoutDifficulty"
};

const RESET_PASSWORD = "lingling";
const TIMEOUT_DIFFICULTIES = ["easy", "hard"];
const LOCKOUT_DURATIONS = {
  easy: [
    1 * 60 * 1000,
    2 * 60 * 1000,
    5 * 60 * 1000,
    30 * 60 * 1000,
    60 * 60 * 1000
  ],
  hard: [
    30 * 60 * 1000,
    60 * 60 * 1000,
    2 * 60 * 60 * 1000,
    12 * 60 * 60 * 1000
  ]
};
const LOCKOUT_FAILURE_RESET_MS = 12 * 60 * 60 * 1000;
const RING_MAX_USES = 2;
const RING_HIDE_DURATION_MS = 60 * 60 * 1000;
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
    finalPhrase: "THE OLD ROAD REMEMBERS THOSE WHO WALK WITH QUIET COURAGE",
    intro: "You have chosen The Map. The Ranger’s Road opens before you, warm as a cottage window and old as a mountain trail.",
    theme: "Beyond the last lantern, an old road winds through forests, shared campfires, and the quiet courage that turns small travelers toward great quests.",
    routeImage: "ranger-route-bg.png",
    relicImage: "relic-map.png",
    badgeImage: "ranger-badge.png",
    endingTitle: "The Road Knows Your Name",
    endingMessage: "The old road knows the worth of steady feet and loyal company. Somewhere ahead, a small table is warm with lamplight, and every mountain trail seems less lonely because you walked it with quiet courage.",
    phraseGate: {
      ringClue: "The fragments already contain every word. Listen for a sentence that begins with a place, remembers its travelers, and ends with the courage they carry."
    },
    gates: [
      {
        routeId: "ranger",
        gateIndex: 1,
        title: "The First Track",
        difficulty: "Medium",
        flavorText: "Before the road trusts your boots, the hidden school asks whether you can read what others step past.",
        question: "I am not magic, though frightened men call me so. I leave no fire, speak no spell, and yet I show where the hidden passed. A Ranger trusts me before he trusts a road. What am I?",
        acceptedAnswers: ["track", "tracks", "trail sign", "sign"],
        preferredAnswer: "TRACK",
        ringClue: "Do not look for magic. Look for what passed and failed to hide itself.",
        feedback: "The mark in the earth answers you. The first trial is open.",
        lockoutKey: "ranger-gate-1"
      },
      {
        routeId: "ranger",
        gateIndex: 2,
        title: "The Quiet Drill",
        difficulty: "Medium-high",
        flavorText: "A yard hidden behind pines remembers every fall, every correction, and every skill that later looks impossible.",
        question: "I make hard things look sudden, but I am built from bruises no crowd applauds. When danger arrives, people call it instinct; before danger, I was repetition. What am I?",
        acceptedAnswers: ["training", "practice", "hidden training", "drill", "drills"],
        preferredAnswer: "TRAINING",
        ringClue: "The answer is what turns repetition and bruises into instinct long before anyone is watching.",
        feedback: "The unseen lessons settle into place. The second trial is open.",
        lockoutKey: "ranger-gate-2"
      },
      {
        routeId: "ranger",
        gateIndex: 3,
        title: "The Borrowed Shadow",
        difficulty: "High",
        flavorText: "The forest does not hide the careless. It lends cover only to those patient enough to move with it.",
        question: "I cross a camp without waking ash, borrow darkness without becoming it, and make skill look like a vanishing trick. I am not invisibility. What am I?",
        acceptedAnswers: ["stealth", "silence", "quiet step", "moving silently", "silent movement"],
        preferredAnswer: "STEALTH",
        ringClue: "This is a practiced way of moving unseen, not a spell that makes someone vanish.",
        feedback: "Your answer passes without a sound. The third trial is open.",
        lockoutKey: "ranger-gate-3"
      },
      {
        routeId: "ranger",
        gateIndex: 4,
        title: "The Warning Before Steel",
        difficulty: "Extremely high",
        flavorText: "The kingdom survives because someone reads danger while it is still only bent grass, cold ash, and a wrong silence.",
        question: "I am a battle won before trumpets know there is a war. I ride ahead of fear, turn gates before blades arrive, and protect the kingdom by being believed in time. What am I?",
        acceptedAnswers: ["warning", "early warning", "scouting", "intelligence", "report", "ranger report"],
        preferredAnswer: "EARLY WARNING",
        ringClue: "The kingdom is saved by knowledge that arrives before the enemy does.",
        feedback: "The road hears the warning in time. The final trial is open.",
        lockoutKey: "ranger-gate-4"
      }
    ],
    stages: [
      {
        type: "wordle",
        title: "The Forest Word",
        description: "Branches close over the path. Find the ranger-lore camouflage word in six attempts.",
        target: "MOTTLED",
        rewardFragment: "THE OLD ROAD",
        ringClue: "Camouflage often breaks a surface into uneven patches of light and dark; the hidden word describes that appearance.",
        image: "stage-ranger-1.png"
      },
      {
        type: "text",
        title: "The Campfire Riddle",
        description: "Beside the embers rests something folded, weathered, and patient.",
        question: "I am folded when forgotten and opened when hope needs direction. What am I?",
        answer: "MAP",
        rewardFragment: "REMEMBERS THOSE",
        hint: "Travelers use it before they are lost.",
        ringClue: "It can be folded small, yet it preserves roads and directions for the traveler who opens it.",
        image: "stage-ranger-2.png"
      },
      {
        type: "simon",
        title: "The Signal Fire",
        description: "Watch the old road signals, then repeat their order without breaking the chain.",
        rounds: [
          { sequence: ["cloak", "fire", "compass", "raven", "horn"], replays: 2 },
          { sequence: ["star", "bow", "lantern", "cloak", "horn", "raven"], replays: 2 },
          { sequence: ["compass", "raven", "fire", "star", "cloak", "bow", "lantern"], replays: 2 },
          { sequence: ["horn", "cloak", "lantern", "compass", "raven", "fire", "star", "bow"], replays: 2 }
        ],
        signals: [
          { id: "fire", label: "Fire", symbol: "🔥" },
          { id: "lantern", label: "Lantern", symbol: "🏮" },
          { id: "raven", label: "Raven", symbol: "◆" },
          { id: "horn", label: "Horn", symbol: "♬" },
          { id: "bow", label: "Bow", symbol: "⌁" },
          { id: "cloak", label: "Cloak", symbol: "◒" },
          { id: "compass", label: "Compass", symbol: "✣" },
          { id: "star", label: "Star", symbol: "✦" }
        ],
        rewardFragment: "WHO WALK WITH",
        ringClue: "Give each signal a short spoken name while it flashes; the names can hold the order when the lights go dark.",
        image: "stage-ranger-3.png"
      },
      {
        type: "maze",
        title: "The Hidden Gate",
        difficulty: "very hard",
        description: "A living hedge-maze hides the final gate. Gather three trail marks before the old lock will open.",
        width: 15,
        height: 15,
        trailMarksRequired: 3,
        trapCount: 12,
        visibilityRadius: 2,
        rewardFragment: "QUIET COURAGE",
        ringClue: "The final gate is not the first objective. Secure every trail mark, and treat each checkpoint as a new beginning.",
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
    finalPhrase: "WISDOM OPENS THE HIDDEN DOORS THAT PATIENCE LEARNS TO FIND",
    intro: "You have chosen The Book. The Scholar’s Library stirs awake, all amber candles, deep scholarship, and patient ancient lore.",
    theme: "Candles bloom between ancient shelves. Every answer moves a hidden mechanism, and every margin whispers of doors that open only for patience.",
    routeImage: "scholar-route-bg.png",
    relicImage: "relic-book.png",
    badgeImage: "library-badge.png",
    endingTitle: "The Hidden Shelf Opens",
    endingMessage: "The hidden shelf opens for the patient mind. Its candlelit pages remember every careful question, every brave guess, and the deep scholarship that turns locked doors into invitations.",
    phraseGate: {
      ringClue: "Build a sentence in which wisdom acts first, hidden doors are opened, and patience learns how to find them."
    },
    gates: [
      {
        routeId: "scholar",
        gateIndex: 1,
        title: "The Catalog Candle",
        difficulty: "Medium",
        flavorText: "The first shelf does not ask for brilliance. It asks whether you know how knowledge is found before it is understood.",
        question: "I hold no story of my own, yet I point to thousands. I am the patient map of a library, the quiet finger that says where to begin. What am I?",
        acceptedAnswers: ["index", "catalog", "catalogue", "card catalog", "library catalog", "library catalogue"],
        preferredAnswer: "INDEX",
        ringClue: "It does not contain the books' knowledge; it tells a reader where that knowledge waits.",
        feedback: "The catalog drawer slides open. The first trial is unlocked.",
        lockoutKey: "scholar-gate-1"
      },
      {
        routeId: "scholar",
        gateIndex: 2,
        title: "The Slow Key",
        difficulty: "Medium-high",
        flavorText: "A hidden shelf rarely opens for the first tug. The library favors hands that can wait and minds that can return.",
        question: "I have no teeth, but I open difficult books. I have no flame, but I keep candles burning long enough for answers to arrive. What am I?",
        acceptedAnswers: ["patience", "being patient", "patient study", "study"],
        preferredAnswer: "PATIENCE",
        ringClue: "The key is a quality of the reader: the willingness to wait, return, and keep reading.",
        feedback: "The latch yields to the slower key. The second trial is unlocked.",
        lockoutKey: "scholar-gate-2"
      },
      {
        routeId: "scholar",
        gateIndex: 3,
        title: "The Margin Within",
        difficulty: "High",
        flavorText: "Some lore is not hidden by locks. It is hidden by speed, waiting between sentences for a careful reader.",
        question: "I am not the ink, not the page, and not the voice reading aloud. I appear only when a mind holds many lines together long enough for the deeper shape to form. What am I?",
        acceptedAnswers: ["meaning", "understanding", "context", "interpretation", "insight"],
        preferredAnswer: "MEANING",
        ringClue: "Several lines held together become more than ink; seek the deeper idea they form in the reader.",
        feedback: "The margin gives up its second message. The third trial is unlocked.",
        lockoutKey: "scholar-gate-3"
      },
      {
        routeId: "scholar",
        gateIndex: 4,
        title: "The Door That Asks Back",
        difficulty: "Extremely high",
        flavorText: "At the deepest shelf, the puzzle is no longer a lock. It is a question that changes the reader.",
        question: "I grow when I am questioned, shrink when I am claimed too quickly, and open doors only after knowledge has become judgment. What am I?",
        acceptedAnswers: ["wisdom", "understanding", "discernment", "judgment", "judgement"],
        preferredAnswer: "WISDOM",
        ringClue: "Knowledge becomes this only when questions, experience, and judgment teach it how to be used.",
        feedback: "The oldest door accepts the answer. The final trial is unlocked.",
        lockoutKey: "scholar-gate-4"
      }
    ],
    stages: [
      {
        type: "text",
        title: "The Locked Shelf",
        description: "A small object waits on a lectern, holding more than its size should allow.",
        question: "What object holds a world but fits in your hands?",
        answer: "BOOK",
        rewardFragment: "WISDOM OPENS THE",
        hint: "A reader opens it.",
        ringClue: "It is small enough to hold, but its pages can contain a world no room could hold.",
        image: "stage-library-1.png"
      },
      {
        type: "memory",
        title: "The Shelves Remember",
        description: "Turn the library tiles and reunite every matching pair.",
        pairCount: 8,
        timeLimitSeconds: 90,
        mismatchLimit: 10,
        symbols: [
          { id: "book", label: "Book", symbol: "▤" },
          { id: "key", label: "Key", symbol: "⚿" },
          { id: "candle", label: "Candle", symbol: "♨" },
          { id: "shelf", label: "Shelf", symbol: "▥" },
          { id: "ink", label: "Ink", symbol: "✒" },
          { id: "parchment", label: "Parchment", symbol: "▧" },
          { id: "quill", label: "Quill", symbol: "✑" },
          { id: "scroll", label: "Scroll", symbol: "⌁" }
        ],
        rewardFragment: "HIDDEN DOORS THAT",
        ringClue: "Remember positions as well as symbols. Clearing one area at a time reduces how much the whole shelf asks you to hold.",
        image: "stage-library-2.png"
      },
      {
        type: "math",
        title: "The Calculus of the Hidden Shelf",
        description: "A theorem is carved into the shelf rail. Use it carefully and the next latch will answer.",
        problem: "Evaluate d/dx [ &int; from 1 to x<sup>2</sup> of (t<sup>3</sup> - 2t) dt ] at x = 2.",
        guidance: [
          "Use the Fundamental Theorem of Calculus.",
          "Apply the chain rule after replacing the upper limit."
        ],
        acceptedAnswers: ["224", "224.0"],
        rewardFragment: "PATIENCE LEARNS",
        ringClue: "Differentiate the integral by evaluating its integrand at the upper limit, then multiply by the derivative of that upper limit.",
        image: "stage-library-3.png"
      },
      {
        type: "logic",
        title: "The Book, the Key, and the Hidden Shelf",
        description: "Four books, four keys, and four shelves must be arranged before the hidden shelf will move.",
        books: [
          { id: "stars", label: "Book of Stars" },
          { id: "roads", label: "Book of Roads" },
          { id: "masks", label: "Book of Masks" },
          { id: "embers", label: "Book of Embers" }
        ],
        keys: [
          { id: "silver", label: "Silver Key" },
          { id: "brass", label: "Brass Key" },
          { id: "iron", label: "Iron Key" },
          { id: "black", label: "Black Key" }
        ],
        shelves: [
          { id: "north", label: "North Shelf" },
          { id: "candle", label: "Candle Shelf" },
          { id: "hidden", label: "Hidden Shelf" },
          { id: "high", label: "High Shelf" }
        ],
        clues: [
          "The Book of Stars belongs on the Hidden Shelf.",
          "The Silver Key is kept with the book on the Hidden Shelf.",
          "The Book of Roads uses the Brass Key.",
          "The Brass Key opens the North Shelf.",
          "The Book of Embers uses the Iron Key.",
          "The Book of Masks is not on the North Shelf or the High Shelf.",
          "The Black Key opens the Candle Shelf.",
          "The Book of Masks uses neither the Silver Key nor the Iron Key."
        ],
        solution: {
          stars: { key: "silver", shelf: "hidden" },
          roads: { key: "brass", shelf: "north" },
          masks: { key: "black", shelf: "candle" },
          embers: { key: "iron", shelf: "high" }
        },
        rewardFragment: "TO FIND",
        ringClue: "Begin with the book whose shelf and key are both named directly, then follow the linked road and brass clues before using elimination.",
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
    finalPhrase: "THE FINAL SONG RISES WHEN THE MASK YIELDS TO THE HEART",
    intro: "You have chosen The Mask. The Phantom’s Theatre draws its curtains with velvet mystery and a candlelit hush.",
    theme: "The chandelier trembles above velvet seats. Somewhere past the curtain, a hidden cue waits for a brave heart to step into the song.",
    routeImage: "theatre-route-bg.png",
    relicImage: "relic-mask.png",
    badgeImage: "theatre-badge.png",
    endingTitle: "The House Rises",
    endingMessage: "The theatre keeps its mystery, but the mask has softened. From velvet dark to chandelier light, the house rises for the heart that dares to sing without hiding.",
    phraseGate: {
      ringClue: "The sentence begins with the final song rising, then names the moment when a mask gives way to something more honest."
    },
    gates: [
      {
        routeId: "theatre",
        gateIndex: 1,
        title: "The Face That Hides",
        difficulty: "Medium",
        flavorText: "The first door beneath the opera house does not creak. It waits behind a smile that is also a disguise.",
        question: "I show a face by hiding one. I can frighten a balcony, protect a secret, or turn a person into a rumor. What am I?",
        acceptedAnswers: ["mask", "a mask", "the mask"],
        preferredAnswer: "MASK",
        ringClue: "It creates a visible face by covering the real one beneath it.",
        feedback: "The painted face tilts aside. The first trial is unlocked.",
        lockoutKey: "theatre-gate-1"
      },
      {
        routeId: "theatre",
        gateIndex: 2,
        title: "The Hanging Star",
        difficulty: "Medium-high",
        flavorText: "Above the seats, glass and gold listen for the cue that makes every whisper look upward.",
        question: "I am a star indoors, held by chain instead of sky. When I tremble, the house holds its breath and every secret looks up. What am I?",
        acceptedAnswers: ["chandelier", "the chandelier", "a chandelier"],
        preferredAnswer: "CHANDELIER",
        ringClue: "Look above the audience for an indoor constellation suspended from a chain.",
        feedback: "The hanging star steadies. The second trial is unlocked.",
        lockoutKey: "theatre-gate-2"
      },
      {
        routeId: "theatre",
        gateIndex: 3,
        title: "The Human Underneath",
        difficulty: "High",
        flavorText: "The ghost story is loudest where no one has looked kindly enough for the person beneath it.",
        question: "They call me a ghost when fear tells the story, but I still need breath, shelter, and a name. What is the truer answer beneath the legend?",
        acceptedAnswers: ["person", "a person", "human", "a human", "man", "a man", "hidden person"],
        preferredAnswer: "PERSON",
        ringClue: "Strip away the fearful legend and name the living being who still needs breath, shelter, and kindness.",
        feedback: "The legend thins, and someone human is heard. The third trial is unlocked.",
        lockoutKey: "theatre-gate-3"
      },
      {
        routeId: "theatre",
        gateIndex: 4,
        title: "The Unmasked Sound",
        difficulty: "Extremely high",
        flavorText: "Past the last curtain, the mystery is not solved by fear. It is solved by hearing what was hiding inside the music.",
        question: "I am heard before I am trusted, feared before I am known, and freed when the mask stops speaking for the heart. What am I?",
        acceptedAnswers: ["voice", "the voice", "hidden voice", "singer", "the singer", "heart"],
        preferredAnswer: "VOICE",
        ringClue: "The answer is carried on breath and becomes free when it is heard without the disguise speaking for it.",
        feedback: "The hidden sound steps into the light. The final trial is unlocked.",
        lockoutKey: "theatre-gate-4"
      }
    ],
    stages: [
      {
        type: "memory",
        title: "The Masked Pairings",
        description: "Turn the theatre tiles and reunite every matching prop.",
        pairCount: 8,
        timeLimitSeconds: 120,
        mismatchLimit: 10,
        symbols: [
          { id: "mask", label: "Mask", symbol: "◒" },
          { id: "rose", label: "Rose", symbol: "✿" },
          { id: "chandelier", label: "Chandelier", symbol: "✦" },
          { id: "music", label: "Music Note", symbol: "♪" },
          { id: "curtain", label: "Curtain", symbol: "▥" },
          { id: "candle", label: "Candle", symbol: "♨" },
          { id: "mirror", label: "Mirror", symbol: "◇" },
          { id: "violin", label: "Violin", symbol: "𝄞" }
        ],
        rewardFragment: "THE FINAL SONG",
        ringClue: "Hold the location of each prop in mind and clear the board in small regions instead of chasing single symbols everywhere.",
        image: "stage-theatre-1.png"
      },
      {
        type: "simon",
        title: "The Chandelier Sequence",
        description: "Watch the theatre lights, then repeat their cue from beginning to end.",
        rounds: [
          { sequence: ["mask", "chandelier", "rose", "violin", "curtain"], replays: 2 },
          { sequence: ["stageLamp", "rightBalcony", "mask", "rose", "leftBalcony", "violin"], replays: 2 },
          { sequence: ["curtain", "violin", "chandelier", "leftBalcony", "rose", "stageLamp", "mask"], replays: 2 },
          { sequence: ["rightBalcony", "mask", "stageLamp", "curtain", "chandelier", "rose", "violin", "leftBalcony"], replays: 1 },
          { sequence: ["rose", "curtain", "leftBalcony", "violin", "mask", "rightBalcony", "chandelier", "stageLamp"], replays: 1, reverseInput: true }
        ],
        signals: [
          { id: "chandelier", label: "Chandelier", symbol: "✦" },
          { id: "leftBalcony", label: "Left Balcony", symbol: "◖" },
          { id: "rightBalcony", label: "Right Balcony", symbol: "◗" },
          { id: "stageLamp", label: "Stage Lamp", symbol: "●" },
          { id: "mask", label: "Mask", symbol: "◒" },
          { id: "violin", label: "Violin", symbol: "𝄞" },
          { id: "rose", label: "Rose", symbol: "✿" },
          { id: "curtain", label: "Curtain", symbol: "▥" }
        ],
        rewardFragment: "RISES WHEN THE",
        ringClue: "Name each light as it flashes. The last rehearsal changes the direction of the answer, so watch its cue before responding.",
        image: "stage-theatre-2.png"
      },
      {
        type: "audioGuess",
        title: "The Hidden Note",
        description: "A covered music stand waits in the theatre dark. If no legal audio has been provided, the stand reveals a cipher instead.",
        audioSrc: "assets/audio/phantom-placeholder.mp3",
        acceptedAnswers: ["music"],
        fallbackAnswer: "MUSIC",
        fallbackCipher: "2-5-14-5-1-20-8 / 20-8-5 / 13-1-19-11 / 20-8-5 / 8-9-4-4-5-14 / 14-15-20-5 / 9-19 / 13-21-19-9-3",
        rewardFragment: "MASK YIELDS TO",
        ringClue: "When the music is absent, treat each number as a letter's position in the alphabet.",
        image: "stage-theatre-3.png"
      },
      {
        type: "mastermind",
        title: "The Final Cue",
        description: "The stage manager has hidden a six-part final cue among six convincing decoys. Read each rehearsal note and call the sequence before the curtain falls.",
        symbols: [
          { id: "spotlight", label: "Spotlight", symbol: "Spotlight" },
          { id: "mask", label: "Mask", symbol: "Mask" },
          { id: "bell", label: "Bell", symbol: "Bell" },
          { id: "mirror", label: "Mirror", symbol: "Mirror" },
          { id: "rose", label: "Rose", symbol: "Rose" },
          { id: "trapdoor", label: "Trapdoor", symbol: "Trapdoor" },
          { id: "music", label: "Music", symbol: "Music" },
          { id: "chandelier", label: "Chandelier", symbol: "Chandelier" },
          { id: "script", label: "Script", symbol: "Script" },
          { id: "candle", label: "Candle", symbol: "Candle" },
          { id: "violin", label: "Violin", symbol: "Violin" },
          { id: "curtain", label: "Curtain", symbol: "Curtain" }
        ],
        correctSequence: ["mirror", "curtain", "trapdoor", "mask", "violin", "chandelier"],
        maxGuesses: 8,
        rewardFragment: "THE HEART",
        ringClue: "Track the total of placed and misplaced cues to identify which six belong before spending guesses on their exact order.",
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
const difficultyButton = document.querySelector("#difficulty-button");

let state = loadState();
let hadAllBadgesAtLoad = ALL_BADGES.every((badge) => state.badges.includes(badge));
let currentRouteId = null;
let currentStageIndex = 0;
let routeProgress = loadRouteProgress();
let currentFragments = [];
let stageSolved = false;
let activePuzzleCleanup = null;
let activeScreenCleanup = null;
let currentView = "home";
let currentLockoutKey = null;
let pendingLifeMessage = null;

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

function getTimeoutDifficulty() {
  const value = localStorage.getItem(STORAGE_KEYS.timeoutDifficulty);
  return TIMEOUT_DIFFICULTIES.includes(value) ? value : null;
}

function setTimeoutDifficulty(value) {
  if (!TIMEOUT_DIFFICULTIES.includes(value)) return false;
  localStorage.setItem(STORAGE_KEYS.timeoutDifficulty, value);
  synchronizeRouteLivesForDifficulty();
  updateDifficultyButtonVisibility();
  return value;
}

function clearTimeoutDifficulty() {
  localStorage.removeItem(STORAGE_KEYS.timeoutDifficulty);
  updateDifficultyButtonVisibility();
  return true;
}

function getLockoutDurationForFailure(failureCount) {
  const difficulty = getTimeoutDifficulty() || "hard";
  const ladder = LOCKOUT_DURATIONS[difficulty];
  const durationIndex = Math.min(Math.max(1, Math.floor(Number(failureCount) || 1)) - 1, ladder.length - 1);
  return ladder[durationIndex];
}

function getMaxLivesForDifficulty(difficulty = getTimeoutDifficulty()) {
  return difficulty === "easy" ? 2 : 3;
}

function loadStageLockouts() {
  const stored = safeParseObject(STORAGE_KEYS.stageLockouts);
  return Object.fromEntries(Object.entries(stored).flatMap(([stageKey, entry]) => {
    if (!entry || typeof entry !== "object") return [];
    const failures = Math.max(0, Math.floor(Number(entry.failures) || 0));
    const lockedUntil = Math.max(0, Number(entry.lockedUntil) || 0);
    const lastFailureAt = Math.max(0, Number(entry.lastFailureAt) || 0);
    return failures > 0 ? [[stageKey, { failures, lockedUntil, lastFailureAt }]] : [];
  }));
}

function emptyRouteLives(maxLives = getMaxLivesForDifficulty()) {
  return {
    maxLives,
    ...Object.fromEntries(ROUTE_IDS.map((routeId) => [routeId, maxLives]))
  };
}

function normalizeRouteLives(value) {
  const storedMaxLives = Math.floor(Number(value?.maxLives));
  const hasStoredMaxLives = storedMaxLives === 2 || storedMaxLives === 3;
  const selectedDifficulty = getTimeoutDifficulty();
  const maxLives = selectedDifficulty
    ? getMaxLivesForDifficulty(selectedDifficulty)
    : (hasStoredMaxLives ? storedMaxLives : getMaxLivesForDifficulty());
  const normalized = emptyRouteLives(maxLives);
  ROUTE_IDS.forEach((routeId) => {
    const storedLives = Math.floor(Number(value?.[routeId]));
    if (Number.isFinite(storedLives)) {
      const livesLost = hasStoredMaxLives ? Math.max(0, storedMaxLives - storedLives) : 0;
      normalized[routeId] = hasStoredMaxLives
        ? Math.max(0, maxLives - livesLost)
        : Math.min(maxLives, Math.max(0, storedLives));
    }
  });
  return normalized;
}

function synchronizeRouteLivesForDifficulty() {
  if (!state?.routeLives) return null;
  state.routeLives = normalizeRouteLives(state.routeLives);
  localStorage.setItem(STORAGE_KEYS.routeLives, JSON.stringify(state.routeLives));
  ROUTE_IDS.forEach(updateRouteLivesDisplays);
  return JSON.parse(JSON.stringify(state.routeLives));
}

function initializeRouteLivesForDifficulty(difficulty) {
  const maxLives = getMaxLivesForDifficulty(difficulty);
  state.routeLives = emptyRouteLives(maxLives);
  saveState();
  ROUTE_IDS.forEach(updateRouteLivesDisplays);
  return JSON.parse(JSON.stringify(state.routeLives));
}

function emptyRingState() {
  return {
    acquired: false,
    routes: Object.fromEntries(ROUTE_IDS.map((routeId) => [routeId, {
      uses: 0,
      lockedUntil: 0,
      lastUsedAt: null
    }]))
  };
}

function normalizeRingState(value, acquired = false) {
  const normalized = emptyRingState();
  normalized.acquired = Boolean(acquired || value?.acquired);
  ROUTE_IDS.forEach((routeId) => {
    const storedRoute = value?.routes?.[routeId];
    normalized.routes[routeId] = {
      uses: Math.min(RING_MAX_USES, Math.max(0, Math.floor(Number(storedRoute?.uses) || 0))),
      lockedUntil: Math.max(0, Number(storedRoute?.lockedUntil) || 0),
      lastUsedAt: storedRoute?.lastUsedAt == null ? null : Math.max(0, Number(storedRoute.lastUsedAt) || 0)
    };
  });
  return normalized;
}

function emptyState() {
  return {
    badges: [],
    completedRoutes: [],
    secretUnlocked: false,
    secretViewed: false,
    stageLockouts: {},
    routeLives: emptyRouteLives(),
    resetUnlocked: false,
    ringAcquired: false,
    ringState: emptyRingState()
  };
}

function loadState() {
  const ringAcquired = localStorage.getItem(STORAGE_KEYS.ringAcquired) === "true";
  return {
    badges: safeParseArray(STORAGE_KEYS.badges).filter((badge) => ALL_BADGES.includes(badge)),
    completedRoutes: safeParseArray(STORAGE_KEYS.completedRoutes).filter((routeId) => ROUTE_IDS.includes(routeId)),
    secretUnlocked: localStorage.getItem(STORAGE_KEYS.secretUnlocked) === "true",
    secretViewed: localStorage.getItem(STORAGE_KEYS.secretViewed) === "true",
    stageLockouts: loadStageLockouts(),
    routeLives: normalizeRouteLives(safeParseObject(STORAGE_KEYS.routeLives)),
    resetUnlocked: localStorage.getItem(STORAGE_KEYS.resetUnlocked) === "true"
      || localStorage.getItem(STORAGE_KEYS.secretViewed) === "true",
    ringAcquired,
    ringState: normalizeRingState(safeParseObject(STORAGE_KEYS.ringState), ringAcquired)
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.badges, JSON.stringify(state.badges));
  localStorage.setItem(STORAGE_KEYS.completedRoutes, JSON.stringify(state.completedRoutes));
  localStorage.setItem(STORAGE_KEYS.secretUnlocked, String(state.secretUnlocked));
  localStorage.setItem(STORAGE_KEYS.secretViewed, String(state.secretViewed));
  localStorage.setItem(STORAGE_KEYS.stageLockouts, JSON.stringify(state.stageLockouts));
  localStorage.setItem(STORAGE_KEYS.routeLives, JSON.stringify(state.routeLives));
  localStorage.setItem(STORAGE_KEYS.resetUnlocked, String(state.resetUnlocked));
  localStorage.setItem(STORAGE_KEYS.ringAcquired, String(state.ringAcquired));
  localStorage.setItem(STORAGE_KEYS.ringState, JSON.stringify(state.ringState));
  saveRouteProgress();
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
  routeProgress = {};
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
  currentFragments = [];
  stageSolved = false;
  currentLockoutKey = null;
  pendingLifeMessage = null;
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function imageAsset(filename, alt, extraClass = "") {
  return `<img class="quest-image ${extraClass}" src="assets/images/${filename}" alt="${alt}" loading="lazy">`;
}

function getRingRouteState(routeId) {
  if (!ROUTES[routeId]) return null;
  state.ringState = normalizeRingState(state.ringState, state.ringAcquired);
  return state.ringState.routes[routeId];
}

function getRouteLives(routeId) {
  if (!ROUTES[routeId]) return 0;
  state.routeLives = normalizeRouteLives(state.routeLives);
  return state.routeLives[routeId];
}

function getRouteMaxLives() {
  state.routeLives = normalizeRouteLives(state.routeLives);
  return state.routeLives.maxLives;
}

function routeLivesText(routeId) {
  return `Lives: ${getRouteLives(routeId)} / ${getRouteMaxLives()}`;
}

function routeLivesMarkup(routeId, extraClass = "") {
  const lives = getRouteLives(routeId);
  const maxLives = getRouteMaxLives();
  const hearts = `${"♥".repeat(lives)}${"♡".repeat(maxLives - lives)}`;
  return `
    <div class="route-lives-meter ${extraClass}" data-route-lives-route="${routeId}" aria-label="${routeLivesText(routeId)}">
      <span>Route lives</span>
      <strong data-route-lives-label>${hearts} ${lives} / ${maxLives}</strong>
    </div>
  `;
}

function updateRouteLivesDisplays(routeId) {
  const lives = getRouteLives(routeId);
  const maxLives = getRouteMaxLives();
  const hearts = `${"♥".repeat(lives)}${"♡".repeat(maxLives - lives)}`;
  document.querySelectorAll(`[data-route-lives-route="${routeId}"]`).forEach((meter) => {
    meter.setAttribute("aria-label", routeLivesText(routeId));
    const label = meter.querySelector("[data-route-lives-label]");
    if (label) label.textContent = `${hearts} ${lives} / ${maxLives}`;
  });
}

function resetRouteAfterTimeout(routeId) {
  if (!ROUTES[routeId]) return false;
  state.routeLives = normalizeRouteLives(state.routeLives);
  const maxLives = getRouteMaxLives();
  state.routeLives[routeId] = maxLives;
  const routeState = getRingRouteState(routeId);
  if (routeState) {
    routeState.uses = 0;
    routeState.lockedUntil = 0;
    routeState.lastUsedAt = null;
  }
  saveState();
  updateRouteLivesDisplays(routeId);
  updateRingDisplays(routeId);
  return true;
}

function clearRingState() {
  state.ringAcquired = false;
  state.ringState = emptyRingState();
  saveState();
  return JSON.parse(JSON.stringify(state.ringState));
}

function acquireRing() {
  state.ringAcquired = true;
  state.ringState = normalizeRingState(state.ringState, true);
  state.ringState.acquired = true;
  saveState();
  return true;
}

function setRingUses(routeId, uses) {
  const routeState = getRingRouteState(routeId);
  if (!routeState) return false;
  routeState.uses = Math.min(RING_MAX_USES, Math.max(0, Math.floor(Number(uses) || 0)));
  routeState.lockedUntil = 0;
  routeState.lastUsedAt = routeState.uses > 0 ? Date.now() : null;
  saveState();
  updateRingDisplays(routeId);
  return routeState.uses;
}

function releaseRingRouteLockout(routeId) {
  const routeState = getRingRouteState(routeId);
  if (!routeState) return false;
  routeState.uses = 0;
  routeState.lockedUntil = 0;
  routeState.lastUsedAt = null;
  state.routeLives = normalizeRouteLives(state.routeLives);
  const maxLives = getRouteMaxLives();
  state.routeLives[routeId] = maxLives;
  saveState();
  updateRouteLivesDisplays(routeId);
  updateRingDisplays(routeId);
  return true;
}

function activeRingRouteLockout(routeId) {
  const routeState = getRingRouteState(routeId);
  if (!routeState) return null;
  if (routeState.lockedUntil > Date.now()) return routeState;
  if (routeState.lockedUntil > 0) releaseRingRouteLockout(routeId);
  return null;
}

function registerRingUse(routeId) {
  activeRingRouteLockout(routeId);
  const routeState = getRingRouteState(routeId);
  if (!routeState) return null;

  const usedAt = Date.now();
  if (routeState.uses < RING_MAX_USES) routeState.uses += 1;
  routeState.lastUsedAt = usedAt;
  routeState.lockedUntil = routeState.uses >= RING_MAX_USES
    ? usedAt + RING_HIDE_DURATION_MS
    : 0;
  if (routeState.lockedUntil > usedAt) {
    state.routeLives = normalizeRouteLives(state.routeLives);
    const maxLives = getRouteMaxLives();
    state.routeLives[routeId] = maxLives;
  }
  saveState();
  return routeState;
}

function ringStatusText(routeId) {
  const routeState = getRingRouteState(routeId);
  const uses = routeState?.uses || 0;
  if (routeState?.lockedUntil > Date.now()) return "Ring: hiding from Sauron";
  if (uses >= 2) return "Ring: 2 / 2 - this road is sealed";
  if (uses === 1) return "Ring: 1 / 2 - one more use forces an hour in hiding";
  return "Ring: 0 / 2";
}

function ringMeterMarkup(routeId, extraClass = "") {
  const uses = getRingRouteState(routeId)?.uses || 0;
  return `
    <div class="ring-meter ring-state-${uses} ${extraClass}" data-ring-meter-route="${routeId}" aria-label="${ringStatusText(routeId)}">
      <img src="assets/images/ring.png" alt="" aria-hidden="true">
      <span data-ring-meter-label>${ringStatusText(routeId)}</span>
      <span class="ring-meter-track" aria-hidden="true"><i data-ring-meter-fill style="width: ${uses * 50}%"></i></span>
    </div>
  `;
}

function ringHintButtonMarkup(extraClass = "") {
  return `
    <button class="stage-hud-button ring-hint-button ${extraClass}" id="ring-hint-button" type="button">
      <img src="assets/images/ring.png" alt="" aria-hidden="true">
      <span>Use the Ring</span>
    </button>
  `;
}

function updateRingDisplays(routeId) {
  const routeState = getRingRouteState(routeId);
  if (!routeState) return;
  document.querySelectorAll(`[data-ring-meter-route="${routeId}"]`).forEach((meter) => {
    meter.classList.remove("ring-state-0", "ring-state-1", "ring-state-2");
    meter.classList.add(`ring-state-${routeState.uses}`);
    meter.setAttribute("aria-label", ringStatusText(routeId));
    const label = meter.querySelector("[data-ring-meter-label]");
    const fill = meter.querySelector("[data-ring-meter-fill]");
    if (label) label.textContent = ringStatusText(routeId);
    if (fill) fill.style.width = `${routeState.uses * 50}%`;
  });
}

function bindRingHint(routeId, ringClue) {
  const button = document.querySelector("#ring-hint-button");
  const clueArea = document.querySelector("#ring-clue-area");
  if (!button || !clueArea || !ringClue) return;

  button.addEventListener("click", () => {
    if (button.disabled) return;
    const routeState = registerRingUse(routeId);
    if (!routeState) return;

    updateRingDisplays(routeId);
    button.disabled = true;
    button.setAttribute("aria-pressed", "true");

    if (routeState.lockedUntil > Date.now()) {
      renderRingHidingScreen(routeId, ringClue);
      return;
    }

    clueArea.hidden = false;
    clueArea.innerHTML = `
      <span>Ring clue</span>
      <p>${ringClue}</p>
      <small>The Ring answers, but Sauron may sense the wearer. One more use on this path will force you into hiding for one hour.</small>
    `;
  });
}

function ringClueForCurrentStep(routeId) {
  const route = ROUTES[routeId];
  const step = nextRouteStep(routeId);
  if (!route || !step) return "";
  if (step.type === "gate") return route.gates?.[step.index]?.ringClue || "";
  if (step.type === "stage") return route.stages?.[step.index]?.ringClue || "";
  return route.phraseGate?.ringClue || "";
}

function renderRingHidingScreen(routeId, ringClue = "") {
  const route = ROUTES[routeId];
  const lockout = activeRingRouteLockout(routeId);
  if (!route) {
    renderHome();
    return;
  }
  if (!lockout) {
    startRoute(routeId);
    return;
  }

  const answer = ringClue || ringClueForCurrentStep(routeId);
  currentRouteId = routeId;
  currentView = "ring-hiding";
  currentLockoutKey = `${routeId}-ring`;
  setScreen(`
    <section class="screen ring-hiding-screen route-screen ${routeClass(route.id)}" style="--ring-route-background: url('assets/images/${route.routeImage}');" aria-labelledby="ring-hiding-title">
      <div class="ring-hiding-card">
        <div class="ring-hiding-art" aria-hidden="true">
          <img src="assets/images/ring.png" alt="">
        </div>
        <div class="ring-hiding-copy">
          <p class="section-label">The Ring answers</p>
          ${answer ? `<div class="ring-hiding-answer"><span>The answer it gave</span><p>${answer}</p></div>` : ""}
          <h1 id="ring-hiding-title">You must go into hiding.</h1>
          <p>Using the Ring has made you more exposed, especially here where power and danger gather. The Ring draws the attention of Sauron and his servants, and Sauron may now sense the wearer.</p>
          <p>Hide until the corruption decreases. This path alone is sealed for one hour; the other paths remain open. Your ${getRouteMaxLives()} route lives will be restored when the path is safe again.</p>
          <div class="lockout-timer ring-hiding-timer" role="timer" aria-live="polite">
            <span>Safe to return in</span>
            <strong id="ring-hiding-countdown">${formatLockoutTime(lockout.lockedUntil - Date.now())}</strong>
          </div>
          <div class="button-row">
            <button class="primary-button" id="ring-hiding-home-button" type="button">Return Home</button>
            <button class="secondary-button" id="ring-hiding-routes-button" type="button">Choose Another Relic</button>
          </div>
        </div>
      </div>
    </section>
  `, { immersive: true });

  const countdown = document.querySelector("#ring-hiding-countdown");
  let countdownTimer = null;
  const updateCountdown = () => {
    const remaining = lockout.lockedUntil - Date.now();
    if (remaining > 0) {
      countdown.textContent = formatLockoutTime(remaining);
      return;
    }

    window.clearInterval(countdownTimer);
    activeScreenCleanup = null;
    currentLockoutKey = null;
    releaseRingRouteLockout(routeId);
    startRoute(routeId);
  };

  countdownTimer = window.setInterval(updateCountdown, 1000);
  activeScreenCleanup = () => window.clearInterval(countdownTimer);
  document.querySelector("#ring-hiding-home-button").addEventListener("click", renderHome);
  document.querySelector("#ring-hiding-routes-button").addEventListener("click", renderLetter);
}

function showRingHidingScreenIfLocked(routeId, ringClue = "") {
  if (!activeRingRouteLockout(routeId)) return false;
  renderRingHidingScreen(routeId, ringClue);
  return true;
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

function gateLockoutKey(routeId, gateIndex) {
  const gate = ROUTES[routeId]?.gates?.[gateIndex];
  return gate?.lockoutKey || `${routeId}-gate-${gateIndex + 1}`;
}

function normalizeProgressArray(values, length) {
  const normalized = Array.isArray(values) ? values : [];
  for (let index = 0; index < length; index += 1) {
    normalized[index] = Boolean(normalized[index]);
  }
  normalized.length = length;
  return normalized;
}

function createRouteProgressEntry(route) {
  const stageCount = route?.stages?.length || 4;
  const gateCount = route?.gates?.length || stageCount;
  return {
    gatesCompleted: Array(gateCount).fill(false),
    stagesCompleted: Array(stageCount).fill(false),
    fragments: Array(stageCount).fill(null)
  };
}

function normalizeRouteProgressEntry(route, value) {
  const progress = value && typeof value === "object"
    ? value
    : createRouteProgressEntry(route);
  const stageCount = route?.stages?.length || 4;
  const gateCount = route?.gates?.length || stageCount;
  const storedStages = Array.isArray(progress.stagesCompleted) ? [...progress.stagesCompleted] : [];
  const storedGates = Array.isArray(progress.gatesCompleted) ? [...progress.gatesCompleted] : [];
  const stagesCompleted = normalizeProgressArray(storedStages, stageCount);

  return {
    gatesCompleted: normalizeProgressArray(storedGates, gateCount),
    stagesCompleted,
    fragments: Array.from({ length: stageCount }, (_, index) => (
      stagesCompleted[index] ? route.stages[index].rewardFragment : null
    ))
  };
}

function loadRouteProgress() {
  const stored = safeParseObject(STORAGE_KEYS.routeProgress);
  return Object.fromEntries(ROUTE_IDS.flatMap((routeId) => {
    const entry = stored[routeId];
    if (!entry || typeof entry !== "object") return [];
    return [[routeId, normalizeRouteProgressEntry(ROUTES[routeId], entry)]];
  }));
}

function saveRouteProgress() {
  localStorage.setItem(STORAGE_KEYS.routeProgress, JSON.stringify(routeProgress));
}

function updateRouteProgress(routeId, updater) {
  const progress = getRouteProgress(routeId);
  if (!progress || typeof updater !== "function") return progress;
  updater(progress);
  routeProgress[routeId] = normalizeRouteProgressEntry(ROUTES[routeId], progress);
  saveRouteProgress();
  return routeProgress[routeId];
}

function getRouteProgress(routeId) {
  const route = ROUTES[routeId];
  if (!route) return null;

  const progress = normalizeRouteProgressEntry(route, routeProgress[routeId]);
  routeProgress[routeId] = progress;
  return progress;
}

function resetRouteProgress(routeId) {
  const route = ROUTES[routeId];
  if (!route) return null;
  routeProgress[routeId] = createRouteProgressEntry(route);
  saveRouteProgress();
  return routeProgress[routeId];
}

function completedCount(items) {
  return items.filter(Boolean).length;
}

function gateIsUnlocked(progress, gateIndex) {
  return Boolean(progress?.gatesCompleted?.[gateIndex] || gateIndex === 0 || progress?.stagesCompleted?.[gateIndex - 1]);
}

function stageIsUnlocked(progress, stageIndex) {
  return Boolean(progress?.gatesCompleted?.[stageIndex]);
}

function phraseGateIsUnlocked(progress) {
  return Boolean(
    progress &&
    progress.stagesCompleted.every(Boolean) &&
    progress.fragments.filter(Boolean).length >= 4
  );
}

function nextRouteStep(routeId) {
  const route = ROUTES[routeId];
  const progress = getRouteProgress(routeId);
  if (!route || !progress) return null;

  for (let index = 0; index < route.stages.length; index += 1) {
    if (!progress.gatesCompleted[index]) return { type: "gate", index };
    if (!progress.stagesCompleted[index]) return { type: "stage", index };
  }
  return { type: "phrase", index: route.stages.length };
}

function renderCurrentRouteStep() {
  if (showRingHidingScreenIfLocked(currentRouteId)) return;
  const step = nextRouteStep(currentRouteId);
  if (!step) {
    renderHome();
    return;
  }

  currentStageIndex = Math.min(step.index, 3);
  if (step.type === "gate") renderRiddleGate();
  else if (step.type === "stage") renderStage();
  else renderPhraseGate();
}

function gateInstructionMarkup() {
  const maxLives = getRouteMaxLives();
  const finalLifeWord = maxLives === 2 ? "second" : "third";
  return instructionMarkup([
    { label: "Objective", copy: "Solve the riddle gate to unlock the next main trial." },
    { label: "Lives", copy: `Each wrong answer costs one of this route's ${maxLives} lives. The ${finalLifeWord} mistake starts this gate's timeout; other routes remain playable.` },
    { label: "Reward", copy: "The gate itself awards no phrase fragment. The main trial after this gate awards the fragment." }
  ]);
}

function gateBriefingMarkup(route, gate, gateIndex) {
  const rows = [
    { label: "Gate", value: `${gate.gateIndex} of ${route.gates.length}` },
    { label: "Difficulty", value: gate.difficulty },
    { label: "Unlocks", value: `Main Trial ${gateIndex + 1}` },
    { label: "Failure", value: "Wrong answer locks only this gate." }
  ];

  return `
    <div class="stage-briefing" aria-label="${route.name} riddle gate briefing">
      ${rows.map((row) => `
        <div class="stage-briefing-item">
          <span>${row.label}</span>
          <strong>${row.value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function routeMapMarkup(route) {
  const progress = getRouteProgress(route.id);
  if (!progress) return "";

  const steps = [];
  route.stages.forEach((stage, index) => {
    const gate = route.gates[index];
    const gateComplete = progress.gatesCompleted[index];
    const gateLocked = !gateIsUnlocked(progress, index);
    steps.push({
      type: "gate",
      index,
      label: `Gate ${index + 1}`,
      title: gate?.title || `Riddle Gate ${index + 1}`,
      state: gateComplete ? "Solved" : gateLocked ? "Locked" : "Open",
      locked: gateLocked && !gateComplete,
      complete: gateComplete,
      current: currentView === "gate" && currentStageIndex === index
    });

    const stageComplete = progress.stagesCompleted[index];
    const stageLocked = !stageIsUnlocked(progress, index);
    steps.push({
      type: "stage",
      index,
      label: `Trial ${index + 1}`,
      title: stage.title,
      state: stageComplete ? "Fragment earned" : stageLocked ? "Locked" : "Open",
      locked: stageLocked && !stageComplete,
      complete: stageComplete,
      current: currentView === "stage" && currentStageIndex === index
    });
  });

  steps.push({
    type: "phrase",
    index: route.stages.length,
    label: "Phrase",
    title: "The Phrase Gate",
    state: phraseGateIsUnlocked(progress) ? "Open" : "Locked",
    locked: !phraseGateIsUnlocked(progress),
    complete: state.completedRoutes.includes(route.id),
    current: currentView === "phrase"
  });

  return `
    <div class="route-map-list" id="route-map-steps" aria-label="${route.name} route navigation">
      ${steps.map((step) => {
        const classes = [
          "route-map-step",
          step.current ? "current" : "",
          step.complete ? "complete" : "",
          step.locked ? "locked" : ""
        ].filter(Boolean).join(" ");
        const disabled = step.locked ? "disabled aria-disabled=\"true\"" : "";
        const current = step.current ? "aria-current=\"step\"" : "";
        return `
          <button class="${classes}" type="button" data-route-step="${step.type}" data-route-step-index="${step.index}" ${disabled} ${current}>
            <span>${step.label}</span>
            <strong>${step.title}</strong>
            <small>${step.state}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function routeMapModalMarkup(route) {
  return `
    <div class="stage-modal" id="stage-route-map-modal" hidden>
      <button class="stage-modal-backdrop" type="button" data-stage-modal-close aria-label="Close route map"></button>
      <section class="stage-drawer stage-route-map-drawer" role="dialog" aria-modal="true" aria-labelledby="stage-route-map-title">
        <button class="stage-drawer-close" type="button" data-stage-modal-close aria-label="Close route map">×</button>
        <p class="section-label">Route map</p>
        <h2 id="stage-route-map-title">Gates and trials</h2>
        <p class="stage-route-map-copy">Open steps can be revisited. Locked steps wait for the gate or trial before them.</p>
        ${routeMapMarkup(route)}
      </section>
    </div>
  `;
}

function bindRouteStepButtons(scope = document) {
  scope.querySelectorAll("[data-route-step]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateRouteStep(button.dataset.routeStep, Number(button.dataset.routeStepIndex));
    });
  });
}

function refreshRouteMapNavigation() {
  const route = ROUTES[currentRouteId];
  const container = document.querySelector("#route-map-steps");
  if (!route || !container) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = routeMapMarkup(route);
  const freshMap = wrapper.firstElementChild;
  container.replaceWith(freshMap);
  bindRouteStepButtons(freshMap);
}

function navigateRouteStep(type, index) {
  const route = ROUTES[currentRouteId];
  const progress = getRouteProgress(currentRouteId);
  if (!route || !progress) return false;

  if (type === "gate") {
    if (!gateIsUnlocked(progress, index) && !progress.gatesCompleted[index]) return false;
    currentStageIndex = index;
    renderRiddleGate();
    return true;
  }

  if (type === "stage") {
    if (!stageIsUnlocked(progress, index)) return false;
    currentStageIndex = index;
    renderStage();
    return true;
  }

  if (type === "phrase" && phraseGateIsUnlocked(progress)) {
    renderPhraseGate();
    return true;
  }

  return false;
}

function routeProgressSnapshot() {
  const snapshot = Object.fromEntries(
    ROUTE_IDS.map((routeId) => [routeId, getRouteProgress(routeId)])
  );
  return JSON.parse(JSON.stringify(snapshot));
}

function earnedFragmentCount() {
  return currentFragments.filter(Boolean).length;
}

function shuffleOutOfOrder(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  if (
    shuffled.length > 1 &&
    shuffled.every((item, index) => item === items[index])
  ) {
    shuffled.push(shuffled.shift());
  }
  return shuffled;
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
  const previous = state.stageLockouts[stageKey] || {};
  const now = Date.now();
  const lastFailureAt = Math.max(0, Number(previous.lastFailureAt) || 0);
  const previousFailures = lastFailureAt && now - lastFailureAt < LOCKOUT_FAILURE_RESET_MS
    ? previous.failures || 0
    : 0;
  const failures = previousFailures + 1;
  const lockout = {
    failures,
    lockedUntil: now + getLockoutDurationForFailure(failures),
    lastFailureAt: now
  };
  state.stageLockouts[stageKey] = lockout;
  saveState();
  return lockout;
}

function registerRouteMistake(routeId, stageKey) {
  if (!ROUTES[routeId]) return { timedOut: false, livesRemaining: 0, lockout: null };
  state.routeLives = normalizeRouteLives(state.routeLives);
  const livesRemaining = Math.max(0, state.routeLives[routeId] - 1);

  if (livesRemaining > 0) {
    state.routeLives[routeId] = livesRemaining;
    saveState();
    updateRouteLivesDisplays(routeId);
    return { timedOut: false, livesRemaining, lockout: null };
  }

  resetRouteAfterTimeout(routeId);
  const lockout = registerFailure(stageKey);
  return { timedOut: true, livesRemaining: 0, lockout };
}

function routeMistakeMessage(livesRemaining) {
  const lifeWord = livesRemaining === 1 ? "life" : "lives";
  return `Mistake recorded. ${livesRemaining} route ${lifeWord} remaining before a timeout.`;
}

function applyPendingLifeMessage(routeId) {
  if (!pendingLifeMessage || pendingLifeMessage.routeId !== routeId) return;
  const feedback = document.querySelector("#stage-feedback-zone .feedback, #puzzle-root .feedback");
  if (feedback) {
    feedback.className = `${feedback.className} error`.trim();
    feedback.textContent = pendingLifeMessage.message;
  }
  pendingLifeMessage = null;
}

function failStage(route, stageIndex) {
  const lockoutKey = stageLockoutKey(route.id, stageIndex);
  const mistake = registerRouteMistake(route.id, lockoutKey);
  if (mistake.timedOut) {
    renderLockout(route, route.stages[stageIndex]?.title || "Trial", lockoutKey, renderStage);
    return;
  }

  pendingLifeMessage = {
    routeId: route.id,
    message: routeMistakeMessage(mistake.livesRemaining)
  };
  renderStage();
}

function getWordleTarget(stage) {
  return String(stage.target || "QUEST").toUpperCase().replace(/[^A-Z]/g, "") || "QUEST";
}

function getMemorySettings(stage) {
  const symbols = Array.isArray(stage.symbols) ? stage.symbols : [];
  const pairCount = Math.min(
    Math.max(1, Math.floor(Number(stage.pairCount) || 8)),
    symbols.length
  );
  return {
    pairCount,
    timeLimitSeconds: Math.max(10, Math.floor(Number(stage.timeLimitSeconds) || 90)),
    mismatchLimit: Math.max(0, Math.floor(Number(stage.mismatchLimit) || 10)),
    symbols: symbols.slice(0, pairCount)
  };
}

function getSimonRounds(stage) {
  const sourceRounds = Array.isArray(stage.rounds) && stage.rounds.length
    ? stage.rounds
    : [{ sequence: Array.isArray(stage.sequence) ? stage.sequence : [], replays: stage.replays ?? 1 }];
  const signalIds = new Set((Array.isArray(stage.signals) ? stage.signals : []).map((signal) => signal.id));
  const finalRoundIndex = sourceRounds.length - 1;

  return sourceRounds.map((round, index) => {
    const roundConfig = Array.isArray(round) ? { sequence: round } : round;
    const fallbackReplays = Array.isArray(stage.replaysPerRound)
      ? stage.replaysPerRound[index]
      : stage.replays ?? 1;
    const replays = Math.max(0, Math.floor(Number(roundConfig.replays ?? fallbackReplays) || 0));
    const sequence = (Array.isArray(roundConfig.sequence) ? roundConfig.sequence : [])
      .filter((signalId) => signalIds.has(signalId));

    return {
      sequence,
      replays,
      reverseInput: Boolean(roundConfig.reverseInput || (stage.finalRoundReverse && index === finalRoundIndex))
    };
  }).filter((round) => round.sequence.length > 0);
}

function getMazeSettings(stage) {
  const configuredSize = Math.floor(Number(stage.size) || 15);
  const legacySize = configuredSize >= 18 ? 18 : 15;
  const width = Math.min(18, Math.max(9, Math.floor(Number(stage.width) || legacySize)));
  const height = Math.min(18, Math.max(9, Math.floor(Number(stage.height) || legacySize)));
  return {
    width,
    height,
    trailMarksRequired: Math.min(5, Math.max(1, Math.floor(Number(stage.trailMarksRequired) || 3))),
    trapCount: Math.min(width * height - 8, Math.max(3, Math.floor(Number(stage.trapCount) || 10))),
    visibilityRadius: Math.min(4, Math.max(1, Math.floor(Number(stage.visibilityRadius) || 2)))
  };
}

function cellKey(x, y) {
  return `${x},${y}`;
}

function normalizeMathAnswer(value) {
  return value.trim().replace(/\s+/g, "").replace(/\.0+$/, "");
}

function getLogicSettings(stage) {
  return {
    books: Array.isArray(stage.books) ? stage.books : [],
    keys: Array.isArray(stage.keys) ? stage.keys : [],
    shelves: Array.isArray(stage.shelves) ? stage.shelves : [],
    clues: Array.isArray(stage.clues) ? stage.clues : [],
    solution: stage.solution && typeof stage.solution === "object" ? stage.solution : {}
  };
}

function getMastermindSettings(stage) {
  const symbols = Array.isArray(stage.symbols) ? stage.symbols : [];
  const correctSequence = Array.isArray(stage.correctSequence)
    ? stage.correctSequence.filter((symbolId) => symbols.some((symbol) => symbol.id === symbolId))
    : [];
  return {
    symbols,
    correctSequence,
    maxGuesses: Math.max(1, Math.floor(Number(stage.maxGuesses) || 8))
  };
}

function itemLabel(items, id) {
  return items.find((item) => item.id === id)?.label || id;
}

function formatPuzzleSeconds(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
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

  resetRouteAfterTimeout(route.id);
  currentView = "lockout";
  currentLockoutKey = stageKey;
  setScreen(`
    <section class="screen parchment content-screen route-screen lockout-screen ${routeClass(route.id)}" aria-labelledby="lockout-title">
      <div class="lockout-content">
        <p class="section-label">${route.name}</p>
        <h2 id="lockout-title">${stageTitle}</h2>
        <p class="lead lockout-message">${LOCKOUT_MESSAGES[route.id]}</p>
        <p class="lockout-reset-note">Your route lives have reset to ${getRouteMaxLives()} / ${getRouteMaxLives()}, and this route's Ring corruption has cleared.</p>
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
  updateDifficultyButtonVisibility();
  if (!immersive) window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateDifficultyButtonVisibility() {
  if (!difficultyButton) return;
  difficultyButton.hidden = currentView !== "letter" || !getTimeoutDifficulty();
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

function showRefreshHintPopup() {
  document.querySelector("#refresh-hint-popup")?.remove();
  const popup = document.createElement("div");
  popup.className = "refresh-hint-popup";
  popup.id = "refresh-hint-popup";
  popup.innerHTML = `
    <button class="refresh-hint-backdrop" type="button" aria-label="Close refresh hint"></button>
    <section class="refresh-hint-card" role="dialog" aria-modal="true" aria-labelledby="refresh-hint-title">
      <p class="section-label">Three badges collected</p>
      <h2 id="refresh-hint-title">The world has changed.</h2>
      <p>All three seals are awake. The final door only appears when the world is entered again.</p>
      <p><strong>Refresh the page, then look carefully at the home screen.</strong></p>
      <div class="button-row">
        <button class="primary-button" id="refresh-hint-now-button" type="button">Refresh Now</button>
        <button class="secondary-button" id="refresh-hint-close-button" type="button">Not Yet</button>
      </div>
    </section>
  `;
  app.append(popup);

  const closePopup = () => popup.remove();
  popup.querySelector(".refresh-hint-backdrop").addEventListener("click", closePopup);
  popup.querySelector("#refresh-hint-close-button").addEventListener("click", closePopup);
  popup.querySelector("#refresh-hint-now-button").addEventListener("click", () => window.location.reload());
  popup.querySelector("#refresh-hint-now-button").focus();
}

function difficultyLabel(value) {
  return value === "easy" ? "Easy" : "Hard";
}

function showDifficultyConfirmation(value) {
  document.querySelector("#difficulty-confirmation")?.remove();
  const confirmation = document.createElement("div");
  confirmation.className = "difficulty-confirmation";
  confirmation.id = "difficulty-confirmation";
  confirmation.setAttribute("role", "status");
  confirmation.setAttribute("aria-live", "polite");
  confirmation.innerHTML = `
    <strong>Difficulty changed to ${difficultyLabel(value)}.</strong>
    <span>Route life limits are now ${getMaxLivesForDifficulty(value)}; lives already lost were preserved.<br>Existing active lockouts have not been changed. Future timeout-triggering failures will use the ${difficultyLabel(value)} timeout ladder.</span>
  `;
  document.body.append(confirmation);
  window.setTimeout(() => confirmation.remove(), 5200);
}

function showTimeoutDifficultyPopup({ initial = false } = {}) {
  document.querySelector("#difficulty-popup")?.remove();
  const currentDifficulty = getTimeoutDifficulty();
  const popup = document.createElement("div");
  popup.className = "difficulty-popup";
  popup.id = "difficulty-popup";
  popup.innerHTML = `
    ${initial
      ? '<div class="difficulty-popup-backdrop" aria-hidden="true"></div>'
      : '<button class="difficulty-popup-backdrop" type="button" aria-label="Close difficulty window"></button>'}
    <section class="difficulty-card" role="dialog" aria-modal="true" aria-labelledby="difficulty-title">
      <p class="section-label">Timeout settings</p>
      <h2 id="difficulty-title">Choose Your Timeout Difficulty</h2>
      ${initial ? `
        <p>Before the roads begin, choose how harsh the lockouts should be.</p>
        <p>Easy is better for a smoother birthday quest with shorter waiting times.<br>Hard keeps the original punishment system.</p>
      ` : `
        <p class="difficulty-current">Current difficulty: <strong>${difficultyLabel(currentDifficulty || "hard")}</strong></p>
        <div class="difficulty-warning">
          <strong>Changing difficulty updates future timeout durations and each road's life limit.</strong>
          <p>It will not remove, shorten, or change any lockouts that are already active.</p>
          <p>Lives already lost are preserved. Progress, badges, fragments, Ring state, and completed routes are not reset.</p>
        </div>
      `}
      <div class="difficulty-options" aria-label="Timeout difficulty options">
        <button class="difficulty-option ${currentDifficulty === "easy" ? "is-current" : ""}" type="button" data-timeout-difficulty="easy">
          <span class="difficulty-option-heading"><strong>Easy</strong>${currentDifficulty === "easy" ? "<small>Current</small>" : ""}</span>
          ${initial ? `
            <span>Shorter lockouts</span>
            <span>Each road has 2 lives</span>
            <span>Better for smoother play with less waiting</span>
          ` : `
            <span>Future lockouts use the Easy timeout ladder:</span>
            <span>1 minute, 2 minutes, 5 minutes, 30 minutes, then 1 hour</span>
          `}
        </button>
        <button class="difficulty-option ${currentDifficulty === "hard" ? "is-current" : ""}" type="button" data-timeout-difficulty="hard">
          <span class="difficulty-option-heading"><strong>Hard</strong>${currentDifficulty === "hard" ? "<small>Current</small>" : ""}</span>
          ${initial ? `
            <span>Original lockouts</span>
            <span>Each road has 3 lives</span>
            <span>Better if you want the quest to feel stricter</span>
          ` : `
            <span>Future lockouts use the Hard timeout ladder:</span>
            <span>30 minutes, 1 hour, 2 hours, then 12 hours</span>
          `}
        </button>
      </div>
      ${initial ? "" : '<div class="button-row"><button class="secondary-button" id="difficulty-cancel-button" type="button">Keep Current Difficulty</button></div>'}
    </section>
  `;
  document.body.append(popup);

  const closePopup = () => {
    document.removeEventListener("keydown", handleKeydown);
    popup.remove();
  };
  const handleKeydown = (event) => {
    if (!initial && event.key === "Escape") closePopup();
  };

  popup.querySelectorAll("[data-timeout-difficulty]").forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.timeoutDifficulty;
      if (!setTimeoutDifficulty(value)) return;
      if (initial) initializeRouteLivesForDifficulty(value);
      closePopup();
      if (!initial) showDifficultyConfirmation(value);
    });
  });

  if (!initial) {
    popup.querySelector(".difficulty-popup-backdrop").addEventListener("click", closePopup);
    popup.querySelector("#difficulty-cancel-button").addEventListener("click", closePopup);
  }
  document.addEventListener("keydown", handleKeydown);
  popup.querySelector("[data-timeout-difficulty]").focus();
}

function showWelcomePopup() {
  document.querySelector("#welcome-popup")?.remove();
  const popup = document.createElement("div");
  popup.className = "welcome-popup";
  popup.id = "welcome-popup";
  popup.innerHTML = `
    <button class="welcome-popup-backdrop" type="button" aria-label="Close welcome message"></button>
    <section class="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <p class="section-label">Welcome, traveler</p>
      <h2 id="welcome-title">Three roads. One birthday quest.</h2>
      <p>This is a fantasy puzzle adventure made for one very particular birthday traveler.</p>
      <ol class="welcome-steps">
        <li>Choose the Ranger, Scholar, or Theatre path.</li>
        <li>Solve its riddles and trials to earn a badge.</li>
        <li>Collect all three badges to reveal the final message.</li>
      </ol>
      <p class="welcome-note">Your progress is saved on this device, so you can leave and continue later.</p>
      <div class="button-row">
        <button class="primary-button" id="welcome-begin-button" type="button">Begin the Quest</button>
      </div>
    </section>
  `;
  app.append(popup);

  const closePopup = () => {
    popup.remove();
    if (!getTimeoutDifficulty()) showTimeoutDifficultyPopup({ initial: true });
  };
  popup.querySelector(".welcome-popup-backdrop").addEventListener("click", closePopup);
  popup.querySelector("#welcome-begin-button").addEventListener("click", closePopup);
  popup.querySelector("#welcome-begin-button").focus();
}

function unlockAllBadgesWithPassword() {
  const password = window.prompt("Enter the badge unlock password.");
  if (password === null) return false;
  if (password !== RESET_PASSWORD) {
    window.alert("Badge unlock rejected.");
    return false;
  }

  state.badges = [...ALL_BADGES];
  state.completedRoutes = [...ROUTE_IDS];
  saveState();
  updateBadgePanel();
  renderHome();
  showRefreshHintPopup();
  return true;
}

function renderHome() {
  resetCurrentRoute();
  currentView = "home";
  const secretAvailable = state.secretUnlocked && hadAllBadgesAtLoad;
  const allBadgesCollected = ALL_BADGES.every((badge) => state.badges.includes(badge));
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
          ${!allBadgesCollected ? '<button class="secondary-button" id="badge-shortcut-button" type="button">Unlock All Badges</button>' : ""}
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
  const badgeShortcutButton = document.querySelector("#badge-shortcut-button");
  if (badgeShortcutButton) badgeShortcutButton.addEventListener("click", unlockAllBadgesWithPassword);
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
          <p>But be warned: this is not a road for the empty-stomached.</p>
          <p>A sensible hobbit would have packed breakfast, second breakfast, elevenses, lunch, tea, dinner, and supper before attempting even the first riddle. You have been given no such mercy.</p>
          <p>Each road begins with riddle gates and guards four main-trial phrase fragments. Gather the fragments, arrange the full saying, and the road will offer its mark.</p>
          <p>The map will not hand its secrets to those who mistake quiet skill for magic. Rangers walk unseen, not because they cast spells, but because they have trained to notice what others miss. Their work is done before danger reaches the kingdom.</p>
          <p>The book remembers those who wrestle with questions instead of running from them. Some doors open only for patience. Some answers are hidden because they are worth the search.</p>
          <p>The mask waits where the theatre whispers of a ghost. But not every haunting is a monster, and not every mask tells the whole story. Sometimes the shadow beneath the opera house is only a man who was never truly seen.</p>
          <p>And somewhere beyond these relics are older roads still: a crown refused before it is accepted, an immortal life surrendered for love, a burden carried farther than strength should allow, and a friendship that keeps walking when the mountain is still far away.</p>
          <p>Choose carefully.</p>
          <p>The road you take will test you.</p>
          <p>The road you finish will remember you.</p>
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
  if (showRingHidingScreenIfLocked(routeId)) return;
  if (!routeProgress[routeId] || state.completedRoutes.includes(routeId)) {
    resetRouteProgress(routeId);
  }
  const progress = getRouteProgress(routeId);
  const nextStep = nextRouteStep(routeId);
  const completedSteps = completedCount(progress.gatesCompleted) + completedCount(progress.stagesCompleted);
  const totalSteps = progress.gatesCompleted.length + progress.stagesCompleted.length;
  currentStageIndex = Math.min(nextStep?.index || 0, 3);
  currentFragments = progress.fragments;
  stageSolved = false;
  currentView = "route";
  currentLockoutKey = null;
  if (!state.ringAcquired) {
    renderRingAcquisition(routeId);
    return;
  }
  const startLabel = nextStep?.type === "stage"
    ? `Enter Trial ${nextStep.index + 1}`
    : nextStep?.type === "phrase"
      ? "Approach the Phrase Gate"
      : `Begin Gate ${currentStageIndex + 1}`;

  setScreen(`
    <section class="screen parchment content-screen route-screen ${routeClass(routeId)}" aria-labelledby="route-title">
      <div class="route-intro-layout">
        ${imageAsset(route.routeImage, `${route.name} landscape`, "light route-art")}
        <div class="route-copy">
          <p class="section-label">${route.relic} chosen</p>
          <h2 id="route-title">${route.name}</h2>
          <p class="lead">${route.intro}</p>
          <p>${route.theme}</p>
          <div class="route-progress-summary" role="status" aria-label="Saved route progress">
            <span>Progress saved on this device</span>
            <strong>${completedSteps} of ${totalSteps} path steps complete</strong>
          </div>
          <div class="button-row">
            <button class="primary-button" id="begin-trial-button" type="button">${startLabel}</button>
            <button class="secondary-button" id="choose-another-button" type="button">Choose Another Relic</button>
          </div>
        </div>
      </div>
    </section>
  `);

  document.querySelector("#begin-trial-button").addEventListener("click", renderCurrentRouteStep);
  document.querySelector("#choose-another-button").addEventListener("click", renderLetter);
}

function renderRingAcquisition(routeId) {
  const route = ROUTES[routeId];
  if (!route) {
    renderHome();
    return;
  }

  currentView = "ring-acquisition";
  setScreen(`
    <section class="screen ring-acquisition-screen ${routeClass(route.id)}" style="--ring-route-background: url('assets/images/${route.routeImage}');" aria-labelledby="ring-acquisition-title">
      <div class="ring-acquisition-art">
        ${imageAsset("ring.png", "A golden Ring waiting to be claimed", "ring-pickup-image")}
      </div>
      <div class="ring-acquisition-copy">
        <p class="section-label">A choice before the road</p>
        <h1 id="ring-acquisition-title">You have found a Ring.</h1>
        <p>It offers help freely, but never without cost.</p>
        <p>Use it once on a road, and the road grows darker.<br>Use it twice on the same road, and Sauron may sense you. You must hide for one hour before that road is safe again.</p>
        <p>It will not solve the quest for you.<br>It will only ask what you are willing to trade for certainty.</p>
        <div class="button-row">
          <button class="primary-button" id="claim-ring-button" type="button">Continue</button>
          <button class="secondary-button" id="ring-return-button" type="button">Choose Another Relic</button>
        </div>
      </div>
    </section>
  `, { immersive: true });

  document.querySelector("#claim-ring-button").addEventListener("click", () => {
    acquireRing();
    startRoute(routeId);
  });
  document.querySelector("#ring-return-button").addEventListener("click", renderLetter);
}

function instructionMarkup(rows) {
  const instructionRows = [
    ...rows,
    {
      label: "The Ring",
      copy: "The Ring can reveal a clue for this trial. Each road remembers how often you use it. The second use on the same road reveals its clue, then seals only that road for one hour while you hide from Sauron. The other roads remain open."
    }
  ];
  return `
    <div class="stage-instruction-list">
      ${instructionRows.map((row) => `
        <div>
          <strong>${row.label}</strong>
          <p>${row.copy}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function puzzleInstructionMarkup(type, stage) {
  const rewardCopy = "Solving this trial reveals one phrase fragment here, then Continue carries that fragment into the route phrase.";
  const maxLives = getRouteMaxLives();
  const finalLifeWord = maxLives === 2 ? "second" : "third";
  const lockoutCopy = `A failed run costs one of this route's ${maxLives} lives. The ${finalLifeWord} route-life loss starts this stage's timeout. The timeout resets all ${maxLives} lives and clears Ring corruption on this route.`;

  if (type === "wordle") {
    const targetLength = getWordleTarget(stage).length;
    return instructionMarkup([
      { label: "Objective", copy: `Find the ${targetLength}-letter hidden word in six guesses.` },
      { label: "Controls", copy: "Use the physical keyboard, or open and collapse the Runic Keyboard for on-screen input." },
      { label: "Failure", copy: "Wrong guesses give tile feedback; the stage fails only after all six guesses are spent without solving." },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  if (type === "memory") {
    const settings = getMemorySettings(stage);
    return instructionMarkup([
      { label: "Objective", copy: `Match all ${settings.pairCount} themed pairs before the timer empties.` },
      { label: "Controls", copy: "Select two cards at a time with mouse, touch, or keyboard. The timer starts with the first card flip." },
      { label: "Failure", copy: `The stage fails if ${formatPuzzleSeconds(settings.timeLimitSeconds)} expires or if more than ${settings.mismatchLimit} mismatches are made.` },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  if (type === "simon") {
    const rounds = getSimonRounds(stage);
    const maxSignals = Array.isArray(stage.signals) ? stage.signals.length : 0;
    const replaySummary = rounds.map((round, index) => `R${index + 1}: ${round.replays}`).join(", ");
    const rows = [
      { label: "Objective", copy: `Clear ${rounds.length} sequence rounds using ${maxSignals} themed signals.` },
      { label: "Memory", copy: "Watch the full sequence, then repeat it in the exact order. Each round gets longer, and the cues deliberately avoid an obvious visual order." },
      { label: "Controls", copy: `Start each round, use the limited replays (${replaySummary}), then answer with buttons or number keys 1-${maxSignals}.` },
      { label: "Failure", copy: `One wrong signal fails the trial and uses the normal route-life and ${difficultyLabel(getTimeoutDifficulty() || "hard")} timeout rules. Opening these instructions or using an allowed replay never counts as a failure.` },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ];
    if (rounds.some((round) => round.reverseInput)) {
      rows.splice(3, 0, { label: "Final cue", copy: "The final cue must be answered in reverse." });
    }
    return instructionMarkup(rows);
  }

  if (type === "maze") {
    const settings = getMazeSettings(stage);
    return instructionMarkup([
      { label: "Objective", copy: `Move through the ${settings.width}-column by ${settings.height}-row maze, collect ${settings.trailMarksRequired} trail marks, then reach the gate.` },
      { label: "Controls", copy: "Use arrow keys or WASD on a keyboard. On touch screens, use the four direction buttons below the maze." },
      { label: "Symbols", copy: "Trail markers look like green maze cells marked M. Your position is P, checkpoints are C, the sealed gate is X, the open gate is G, and traps are ! when visible." },
      { label: "Failure", copy: "A trap sends you back to the latest checkpoint. Three trap hits fail the trial. Reaching the gate before every trail mark is collected also fails the trial." },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  if (type === "math") {
    return instructionMarkup([
      { label: "Objective", copy: "Evaluate the calculus expression and submit the final numeric value." },
      { label: "Controls", copy: "Use the Fundamental Theorem of Calculus, then apply the chain rule. Type the answer and submit it." },
      { label: "Failure", copy: "A wrong submitted final answer fails this trial." },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  if (type === "logic") {
    const settings = getLogicSettings(stage);
    return instructionMarkup([
      { label: "Objective", copy: `Use the clues to match ${settings.books.length} books with ${settings.keys.length} keys and ${settings.shelves.length} shelves.` },
      { label: "Controls", copy: "Choose one key and one shelf for every book, using each key and shelf once, then submit the arrangement." },
      { label: "Failure", copy: "An incorrect completed arrangement fails this trial." },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  if (type === "audioGuess") {
    return instructionMarkup([
      { label: "Objective", copy: "Name the hidden note or song. If no legal audio file is present, solve the musical cipher instead." },
      { label: "Controls", copy: "Use the audio controls when a provided file loads, or decode the fallback note cipher and type the answer." },
      { label: "Failure", copy: "A wrong submitted guess fails this trial." },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  if (type === "mastermind") {
    const settings = getMastermindSettings(stage);
    const decoyCount = Math.max(0, settings.symbols.length - settings.correctSequence.length);
    return instructionMarkup([
      { label: "Objective", copy: `Find the ${settings.correctSequence.length}-cue theatre sequence from ${settings.symbols.length} available cues before ${settings.maxGuesses} guesses are used. ${decoyCount} cues do not belong in the answer.` },
      { label: "Controls", copy: "Choose a different cue in each slot and submit. Feedback tells how many cues are correct in place and how many belong elsewhere; a score of zero also helps eliminate decoys." },
      { label: "Failure", copy: "Running out of guesses fails this trial." },
      { label: "Lockout", copy: lockoutCopy },
      { label: "Reward", copy: rewardCopy }
    ]);
  }

  return instructionMarkup([
    { label: "Objective", copy: "Answer the riddle in the field." },
    { label: "Controls", copy: "Type your answer and submit it. Capitalization and extra spaces do not matter." },
    { label: "Failure", copy: "A wrong submitted answer fails this trial." },
    { label: "Lockout", copy: lockoutCopy },
    { label: "Reward", copy: rewardCopy }
  ]);
}

function puzzleTypeLabel(type) {
  const labels = {
    audioGuess: "Audio cipher",
    math: "Calculus",
    maze: "Maze",
    memory: "Memory",
    mastermind: "Cue order",
    simon: "Sequence",
    text: "Riddle",
    wordle: "Word"
  };
  return labels[type] || "Puzzle";
}

function stageDifficultyLabel(stage, stageIndex) {
  if (stage.difficulty) return stage.difficulty;
  return ["Opening", "Rising", "Demanding", "Final"][stageIndex] || "Trial";
}

function stageObjectiveSummary(type, stage) {
  if (type === "wordle") return `Find the ${getWordleTarget(stage).length}-letter word in six guesses.`;
  if (type === "memory") {
    const settings = getMemorySettings(stage);
    return `Match ${settings.pairCount} pairs before ${formatPuzzleSeconds(settings.timeLimitSeconds)} expires.`;
  }
  if (type === "simon") {
    const rounds = getSimonRounds(stage);
    const firstLength = rounds[0]?.sequence.length || 0;
    const finalLength = rounds[rounds.length - 1]?.sequence.length || 0;
    return `Clear ${rounds.length} signal rounds, growing from ${firstLength} to ${finalLength} cues.`;
  }
  if (type === "maze") {
    const settings = getMazeSettings(stage);
    return `Collect ${settings.trailMarksRequired} trail marks, then reach the gate.`;
  }
  if (type === "math") return "Evaluate the shelf theorem and submit the final value.";
  if (type === "logic") {
    const settings = getLogicSettings(stage);
    return `Arrange ${settings.books.length} books, keys, and shelves.`;
  }
  if (type === "audioGuess") return "Name the hidden note, or solve the fallback cipher.";
  if (type === "mastermind") {
    const settings = getMastermindSettings(stage);
    return `Find the ${settings.correctSequence.length}-cue order in ${settings.maxGuesses} guesses.`;
  }
  return "Answer the prompt and claim the fragment.";
}

function stageFailureSummary(type, stage) {
  if (type === "wordle") return "Lockout only after all six guesses miss.";
  if (type === "memory") {
    const settings = getMemorySettings(stage);
    return `${formatPuzzleSeconds(settings.timeLimitSeconds)} timer or more than ${settings.mismatchLimit} mismatches.`;
  }
  if (type === "simon") return "One wrong signal fails the trial and costs one route life.";
  if (type === "maze") return "Third trap hit, or reaching the sealed gate early.";
  if (type === "mastermind") return `Running out of ${getMastermindSettings(stage).maxGuesses} guesses.`;
  if (type === "logic") return "A complete but wrong arrangement.";
  return "A wrong submitted answer.";
}

function stageBriefingMarkup(route, stage, stageIndex, type) {
  const rows = [
    { label: "Objective", value: stageObjectiveSummary(type, stage) },
    { label: "Difficulty", value: stageDifficultyLabel(stage, stageIndex) },
    { label: "Fragment", value: `Reward ${earnedFragmentCount() + 1} of 4` },
    { label: "Failure", value: stageFailureSummary(type, stage) }
  ];

  return `
    <div class="stage-briefing" aria-label="${route.name} trial briefing">
      ${rows.map((row) => `
        <div class="stage-briefing-item">
          <span>${row.label}</span>
          <strong>${row.value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function relocateStageSurfaceContent() {
  const root = document.querySelector("#puzzle-root");
  const sideNotes = document.querySelector("#stage-side-notes");
  const meters = document.querySelector("#stage-meter-zone");
  const feedbackZone = document.querySelector("#stage-feedback-zone");
  if (!root || !sideNotes || !meters || !feedbackZone) return;

  root.querySelectorAll(".puzzle-instructions, .wordle-instructions, .math-guidance, .maze-collection-card").forEach((element) => {
    element.classList.add("stage-side-note");
    sideNotes.appendChild(element);
  });

  root.querySelectorAll(".memory-status, .simon-status, .maze-status, .mastermind-status").forEach((element) => {
    element.classList.add("stage-strip-meters");
    meters.appendChild(element);
  });

  let movedFeedback = false;
  root.querySelectorAll(".feedback:not(.wordle-feedback)").forEach((element) => {
    element.classList.add("stage-strip-feedback");
    feedbackZone.appendChild(element);
    movedFeedback = true;
  });
  if (movedFeedback) feedbackZone.querySelector(".stage-default-feedback")?.remove();
}

function bindStageSurfaceRelocator() {
  relocateStageSurfaceContent();
  const root = document.querySelector("#puzzle-root");
  if (!root || typeof MutationObserver === "undefined") return null;

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      relocateStageSurfaceContent();
    });
  });
  observer.observe(root, { childList: true, subtree: true });
  return () => observer.disconnect();
}

function combineCleanups(...cleanups) {
  const activeCleanups = cleanups.filter((cleanup) => typeof cleanup === "function");
  if (!activeCleanups.length) return null;
  return () => activeCleanups.forEach((cleanup) => cleanup());
}

function bindStageChrome() {
  const modalPairs = [
    ["#stage-instructions-button", "#stage-instructions-modal"],
    ["#stage-route-map-button", "#stage-route-map-modal"],
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
    if (modal.id === "stage-route-map-modal") refreshRouteMapNavigation();
    modal.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    activeModal = modal;
    modal.querySelector(".stage-drawer-close").focus();
  }

  modalPairs.forEach(([triggerSelector, modalSelector]) => {
    const trigger = document.querySelector(triggerSelector);
    const modal = document.querySelector(modalSelector);
    if (!trigger || !modal) return;
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
  bindRouteStepButtons();

  return () => document.removeEventListener("keydown", handleEscape);
}

function gateAnswerMatches(gate, value) {
  const answer = normalizeAnswer(value);
  return (gate.acceptedAnswers || []).some((acceptedAnswer) => {
    return answer === normalizeAnswer(acceptedAnswer);
  });
}

function completeGate(routeId, gateIndex) {
  const route = ROUTES[routeId];
  const gate = route?.gates?.[gateIndex];
  let progress = getRouteProgress(routeId);
  if (
    stageSolved ||
    routeId !== currentRouteId ||
    gateIndex !== currentStageIndex ||
    !gate ||
    !progress
  ) return;

  stageSolved = true;
  progress = updateRouteProgress(routeId, (updatedProgress) => {
    updatedProgress.gatesCompleted[gateIndex] = true;
  });
  disposeActivePuzzle();

  const gateCount = document.querySelector("#stage-gate-count");
  if (gateCount) gateCount.textContent = `Gates: ${completedCount(progress.gatesCompleted)} / 4`;

  const puzzleRoot = document.querySelector("#puzzle-root");
  if (puzzleRoot) {
    puzzleRoot.classList.add("puzzle-solved");
    puzzleRoot.querySelectorAll("button, input").forEach((control) => {
      control.disabled = true;
    });
  }

  const feedback = document.querySelector("#gate-feedback");
  if (feedback) {
    feedback.className = "feedback success";
    feedback.textContent = gate.feedback || `Correct. ${gate.preferredAnswer} opens the way.`;
  }

  const stage = route.stages[gateIndex];
  document.querySelector("#reward-area").innerHTML = `
    <div class="reward-reveal gate-reward" role="status">
      <span>Gate opened</span>
      <strong>Main Trial ${gateIndex + 1}</strong>
    </div>
    <div class="form-actions">
      <button class="primary-button" id="gate-continue-button" type="button">Enter ${stage?.title || `Trial ${gateIndex + 1}`}</button>
    </div>
  `;
  refreshRouteMapNavigation();
  document.querySelector("#gate-continue-button").addEventListener("click", renderStage);
}

function renderRiddleGate() {
  const route = ROUTES[currentRouteId];
  if (!route) {
    renderHome();
    return;
  }

  const gate = route.gates?.[currentStageIndex];
  if (!gate) {
    renderStage();
    return;
  }

  const progress = getRouteProgress(route.id);
  currentFragments = progress.fragments;
  if (!gateIsUnlocked(progress, currentStageIndex) && !progress.gatesCompleted[currentStageIndex]) {
    renderCurrentRouteStep();
    return;
  }

  const lockoutKey = gateLockoutKey(route.id, currentStageIndex);
  if (activeLockout(lockoutKey)) {
    renderLockout(route, gate.title, lockoutKey, renderRiddleGate);
    return;
  }

  currentView = "gate";
  currentLockoutKey = null;
  stageSolved = false;
  const stage = route.stages[currentStageIndex];
  const gateSolved = progress.gatesCompleted[currentStageIndex];
  const dots = route.gates.map((_, index) => {
    const status = index === currentStageIndex ? "current" : progress.gatesCompleted[index] ? "complete" : "";
    return `<span class="progress-dot ${status}" aria-hidden="true"></span>`;
  }).join("");
  const gateControls = gateSolved
    ? `
      <div class="riddle-gate-open">
        <p class="feedback success" id="gate-feedback">${gate.feedback || "This riddle gate is already open."}</p>
        <div class="form-actions">
          <button class="primary-button" id="gate-continue-button" type="button">Enter ${stage?.title || `Trial ${currentStageIndex + 1}`}</button>
        </div>
      </div>
    `
    : `
      <form class="answer-form riddle-gate-form" id="gate-form">
        <label class="input-label" for="gate-answer">Your answer</label>
        <input class="answer-input" id="gate-answer" name="answer" type="text" autocomplete="off" required>
        <div class="form-actions">
          <button class="primary-button" type="submit">Submit Answer</button>
        </div>
      </form>
      <p class="feedback" id="gate-feedback" aria-live="polite"></p>
    `;

  setScreen(`
    <section class="screen stage-experience route-screen ${routeClass(route.id)}" style="--stage-background-image: url('assets/images/${stage?.image || route.routeImage}');" aria-labelledby="gate-title">
      <header class="stage-hud" aria-label="Current riddle gate controls">
        <div class="stage-hud-route">
          <strong>${route.name}</strong>
          <span>Gate ${gate.gateIndex} of 4</span>
        </div>
        <div class="stage-hud-stats" aria-label="Current quest progress">
          <span>Difficulty: ${gate.difficulty}</span>
          <span id="stage-gate-count">Gates: ${completedCount(progress.gatesCompleted)} / 4</span>
          <span>Fragments: ${earnedFragmentCount()} / 4</span>
          ${routeLivesMarkup(route.id, "route-lives-hud")}
          ${ringMeterMarkup(route.id, "ring-meter-hud")}
        </div>
        <div class="stage-hud-actions">
          ${ringHintButtonMarkup()}
          <button class="stage-hud-button" id="stage-instructions-button" type="button" aria-controls="stage-instructions-modal" aria-expanded="false">Instructions</button>
          <button class="stage-hud-button" id="stage-route-map-button" type="button" aria-controls="stage-route-map-modal" aria-expanded="false">Route Map</button>
          <button class="stage-hud-button" id="stage-badges-button" type="button" aria-controls="stage-badges-modal" aria-expanded="false">Badges</button>
          <button class="stage-hud-button" id="stage-home-button" type="button">Home</button>
          <button class="stage-hud-button stage-hud-reset" id="stage-reset-button" type="button">Reset Quest</button>
        </div>
      </header>

      <div class="stage-viewport">
        <aside class="stage-narration">
          <p class="section-label">Riddle gate</p>
          <h1 id="gate-title">${gate.title}</h1>
          <p class="stage-description">${gate.flavorText}</p>
          <p class="stage-route-context">${route.theme}</p>
          ${gateBriefingMarkup(route, gate, currentStageIndex)}
          <div class="stage-side-notes" id="stage-side-notes" aria-label="Gate side notes"></div>
          <div class="progress-dots" aria-label="Gate ${gate.gateIndex} of 4">${dots}</div>
        </aside>

        <main class="stage-puzzle-zone" aria-label="${gate.title} riddle area">
          <article class="stage-puzzle-panel riddle-gate-panel" aria-label="${gate.title} riddle">
            <div class="stage-panel-heading">
              <span>${route.relic}</span>
              <strong>${gate.difficulty}</strong>
            </div>
            <div class="puzzle-root riddle-gate-root" id="puzzle-root">
              <div class="question-block riddle-question"><p>${gate.question}</p></div>
              ${gateControls}
            </div>
          </article>
        </main>
      </div>

      <div class="ring-clue-reveal" id="ring-clue-area" aria-live="polite" hidden></div>

      <footer class="stage-status-strip" aria-label="Riddle gate status">
        <div class="stage-meter-zone" id="stage-meter-zone" aria-label="Gate meters"></div>
        <div class="stage-feedback-zone" id="stage-feedback-zone" aria-live="polite">
          <p class="stage-default-feedback">${gateSolved ? "The gate is open." : "The gate is waiting for an answer."}</p>
        </div>
        <div class="stage-reward-zone" id="reward-area"></div>
      </footer>

      <div class="stage-modal" id="stage-instructions-modal" hidden>
        <button class="stage-modal-backdrop" type="button" data-stage-modal-close aria-label="Close instructions"></button>
        <section class="stage-drawer" role="dialog" aria-modal="true" aria-labelledby="stage-instructions-title">
          <button class="stage-drawer-close" type="button" data-stage-modal-close aria-label="Close instructions">×</button>
          <p class="section-label">How this gate works</p>
          <h2 id="stage-instructions-title">Instructions</h2>
          ${gateInstructionMarkup()}
          <p>${gate.flavorText}</p>
        </section>
      </div>

      ${routeMapModalMarkup(route)}

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
  activePuzzleCleanup = bindStageSurfaceRelocator();
  bindRingHint(route.id, gate.ringClue);

  const continueButton = document.querySelector("#gate-continue-button");
  if (continueButton) continueButton.addEventListener("click", renderStage);

  const form = document.querySelector("#gate-form");
  if (form) {
    const input = document.querySelector("#gate-answer");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (gateAnswerMatches(gate, input.value)) {
        completeGate(route.id, currentStageIndex);
      } else {
        const mistake = registerRouteMistake(route.id, lockoutKey);
        if (mistake.timedOut) {
          renderLockout(route, gate.title, lockoutKey, renderRiddleGate);
          return;
        }
        const feedback = document.querySelector("#gate-feedback");
        feedback.className = "feedback error";
        feedback.textContent = routeMistakeMessage(mistake.livesRemaining);
        input.select();
      }
    });
    input.focus();
  }
}

function renderStage() {
  const route = ROUTES[currentRouteId];
  if (!route) {
    renderHome();
    return;
  }

  const stage = route.stages[currentStageIndex];
  const progress = getRouteProgress(route.id);
  if (!stage) {
    renderPhraseGate();
    return;
  }
  currentFragments = progress.fragments;
  if (!stageIsUnlocked(progress, currentStageIndex)) {
    renderRiddleGate();
    return;
  }

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
    const status = index === currentStageIndex ? "current" : progress.stagesCompleted[index] ? "complete" : "";
    return `<span class="progress-dot ${status}" aria-hidden="true"></span>`;
  }).join("");

  setScreen(`
    <section class="screen stage-experience route-screen ${routeClass(route.id)} puzzle-${puzzleType}" style="--stage-background-image: url('assets/images/${stage.image}');" aria-labelledby="stage-title">
      <header class="stage-hud" aria-label="Current trial controls">
        <div class="stage-hud-route">
          <strong>${route.name}</strong>
          <span>Trial ${currentStageIndex + 1} of 4</span>
        </div>
        <div class="stage-hud-stats" aria-label="Current quest progress">
          <span>Badges: ${state.badges.length} / 3</span>
          <span>Gates: ${completedCount(progress.gatesCompleted)} / 4</span>
          <span id="stage-fragment-count">Fragments: ${earnedFragmentCount()} / 4</span>
          ${routeLivesMarkup(route.id, "route-lives-hud")}
          ${ringMeterMarkup(route.id, "ring-meter-hud")}
        </div>
        <div class="stage-hud-actions">
          ${ringHintButtonMarkup()}
          <button class="stage-hud-button" id="stage-instructions-button" type="button" aria-controls="stage-instructions-modal" aria-expanded="false">Instructions</button>
          <button class="stage-hud-button" id="stage-route-map-button" type="button" aria-controls="stage-route-map-modal" aria-expanded="false">Route Map</button>
          <button class="stage-hud-button" id="stage-badges-button" type="button" aria-controls="stage-badges-modal" aria-expanded="false">Badges</button>
          <button class="stage-hud-button" id="stage-home-button" type="button">Home</button>
          <button class="stage-hud-button stage-hud-reset" id="stage-reset-button" type="button">Reset Quest</button>
        </div>
      </header>

      <div class="stage-viewport">
        <aside class="stage-narration">
          <p class="section-label">${puzzleTypeLabel(puzzleType)} trial</p>
          <h1 id="stage-title">${stage.title}</h1>
          <p class="stage-description">${stage.description}</p>
          <p class="stage-route-context">${route.theme}</p>
          ${stageBriefingMarkup(route, stage, currentStageIndex, puzzleType)}
          <div class="stage-side-notes" id="stage-side-notes" aria-label="Trial side notes"></div>
          <div class="progress-dots" aria-label="Stage ${currentStageIndex + 1} of 4">${dots}</div>
        </aside>

        <main class="stage-puzzle-zone" aria-label="${stage.title} puzzle area">
          <article class="stage-puzzle-panel" aria-label="${stage.title} puzzle">
            <div class="stage-panel-heading">
              <span>${route.relic}</span>
              <strong>Trial ${currentStageIndex + 1}</strong>
            </div>
            <div class="puzzle-root" id="puzzle-root"></div>
          </article>
        </main>
      </div>

      <div class="ring-clue-reveal" id="ring-clue-area" aria-live="polite" hidden></div>

      <footer class="stage-status-strip" aria-label="Trial status">
        <div class="stage-meter-zone" id="stage-meter-zone" aria-label="Puzzle meters"></div>
        <div class="stage-feedback-zone" id="stage-feedback-zone" aria-live="polite">
          <p class="stage-default-feedback">The trial is ready.</p>
        </div>
        <div class="stage-reward-zone" id="reward-area"></div>
      </footer>

      <div class="stage-modal" id="stage-instructions-modal" hidden>
        <button class="stage-modal-backdrop" type="button" data-stage-modal-close aria-label="Close instructions"></button>
        <section class="stage-drawer" role="dialog" aria-modal="true" aria-labelledby="stage-instructions-title">
          <button class="stage-drawer-close" type="button" data-stage-modal-close aria-label="Close instructions">×</button>
          <p class="section-label">How this trial works</p>
          <h2 id="stage-instructions-title">Instructions</h2>
          ${puzzleInstructionMarkup(puzzleType, stage)}
          <p>${stage.description}</p>
        </section>
      </div>

      ${routeMapModalMarkup(route)}

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
  const rendererCleanup = renderer(route, stage, currentStageIndex) || null;
  activePuzzleCleanup = combineCleanups(bindStageSurfaceRelocator(), rendererCleanup);
  bindRingHint(route.id, stage.ringClue);
  applyPendingLifeMessage(route.id);
}

function completeStage(routeId, stageIndex, rewardFragment) {
  const route = ROUTES[routeId];
  const stage = route?.stages[stageIndex];
  const stageFragment = stage?.rewardFragment;
  if (
    stageSolved ||
    routeId !== currentRouteId ||
    stageIndex !== currentStageIndex ||
    !stage ||
    !stageFragment ||
    (rewardFragment && stageFragment !== rewardFragment)
  ) return;

  stageSolved = true;
  const progress = updateRouteProgress(routeId, (updatedProgress) => {
    updatedProgress.stagesCompleted[stageIndex] = true;
    updatedProgress.fragments[stageIndex] = stageFragment;
  });
  currentFragments = progress.fragments;
  disposeActivePuzzle();

  const fragmentCount = document.querySelector("#stage-fragment-count");
  if (fragmentCount) fragmentCount.textContent = `Fragments: ${earnedFragmentCount()} / 4`;

  const puzzleRoot = document.querySelector("#puzzle-root");
  if (puzzleRoot) {
    puzzleRoot.classList.add("puzzle-solved");
    puzzleRoot.querySelectorAll("button, input").forEach((control) => {
      control.disabled = true;
    });
  }

  document.querySelector("#reward-area").innerHTML = `
    <div class="reward-reveal" role="status">
      <span>Fragment unlocked</span>
      <strong>${stageFragment}</strong>
    </div>
    <div class="form-actions">
      <button class="primary-button" id="continue-button" type="button">${stageIndex === 3 ? "Approach the Phrase Gate" : `Continue to Gate ${stageIndex + 2}`}</button>
    </div>
  `;
  refreshRouteMapNavigation();
  document.querySelector("#continue-button").addEventListener("click", continueRoute);
}

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

function renderTextPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  root.innerHTML = `
    <div class="question-block"><p>${stage.question}</p></div>
    <form class="answer-form" id="stage-form">
      <label class="input-label" for="stage-answer">Your answer</label>
      <input class="answer-input" id="stage-answer" name="answer" type="text" autocomplete="off" required>
      <div class="form-actions">
        <button class="primary-button" type="submit">Submit Answer</button>
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
      feedback.textContent = "The answer is true. A fragment appears in the light.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    failStage(route, stageIndex);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    form.requestSubmit();
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
  const target = getWordleTarget(stage);
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
    const showKeyboardByDefault = false;
    root.innerHTML = `
      <div class="wordle-instructions">
        <span><i class="legend-correct"></i> right place</span>
        <span><i class="legend-present"></i> wrong place</span>
        <span><i class="legend-absent"></i> not in word</span>
      </div>
      <div class="wordle-board" style="--wordle-length: ${target.length}" role="grid" aria-label="Six guesses for a ${target.length}-letter word">${boardMarkup()}</div>
      <div class="wordle-keyboard-toggle-row">
        <button class="secondary-button wordle-keyboard-toggle" id="wordle-keyboard-toggle" type="button" aria-controls="wordle-keyboard" aria-expanded="${showKeyboardByDefault ? "true" : "false"}">${showKeyboardByDefault ? "Collapse Runic Keyboard" : "Show Runic Keyboard"}</button>
      </div>
      <p class="feedback wordle-feedback" id="wordle-feedback" aria-live="polite">Type or use the runic keyboard.</p>
      <div class="wordle-keyboard" id="wordle-keyboard" ${showKeyboardByDefault ? "" : "hidden"} aria-label="Word puzzle keyboard">
        <div class="wordle-keyboard-topline">
          <span>Runic Keyboard</span>
          <button class="wordle-keyboard-close" id="wordle-keyboard-close" type="button" aria-label="Close runic keyboard">&times;</button>
        </div>
        ${keyboardMarkup()}
      </div>
      <div class="wordle-retry" id="wordle-retry"></div>
    `;
    root.querySelectorAll("[data-wordle-key]").forEach((button) => {
      button.addEventListener("click", () => handleKey(button.dataset.wordleKey));
    });
    const keyboard = root.querySelector("#wordle-keyboard");
    const keyboardToggle = root.querySelector("#wordle-keyboard-toggle");
    const keyboardClose = root.querySelector("#wordle-keyboard-close");
    function setKeyboardVisible(willShow, focusToggle = false) {
      keyboard.hidden = !willShow;
      keyboardToggle.setAttribute("aria-expanded", String(willShow));
      keyboardToggle.textContent = willShow ? "Hide Runic Keyboard" : "Show Runic Keyboard";
      if (focusToggle) keyboardToggle.focus({ preventScroll: true });
    }
    keyboardToggle.addEventListener("click", () => setKeyboardVisible(keyboard.hidden));
    keyboardClose.addEventListener("click", () => setKeyboardVisible(false, true));
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
      feedback.textContent = "The forest word is true. A fragment warms in your hand.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    attempt += 1;
    guess = "";
    if (attempt >= maxAttempts) {
      finished = true;
      feedback.className = "feedback error wordle-feedback";
      feedback.textContent = `The word was ${target}. The trail closes for now.`;
      failStage(route, stageIndex);
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
  const settings = getMemorySettings(stage);
  const cards = shuffleCards(settings.symbols.flatMap((item) => [
    { ...item, cardId: `${item.id}-a` },
    { ...item, cardId: `${item.id}-b` }
  ]));
  let firstIndex = null;
  let secondIndex = null;
  let matchedPairs = 0;
  let mismatches = 0;
  let remainingSeconds = settings.timeLimitSeconds;
  let timerStarted = false;
  let failed = false;
  let locked = false;
  let flipTimer = null;
  let countdownTimer = null;

  root.innerHTML = `
    <div class="memory-status" aria-label="Memory puzzle status">
      <span>Time <strong id="memory-time">${formatPuzzleSeconds(remainingSeconds)}</strong></span>
      <span>Matches <strong id="memory-matches">0 / ${settings.pairCount}</strong></span>
      <span>Mismatches <strong id="memory-mismatches">0 / ${settings.mismatchLimit}</strong></span>
    </div>
    <p class="puzzle-instructions">Find all ${settings.pairCount} matching pairs. The timer starts when the first card turns.</p>
    <div class="memory-grid" style="--memory-columns: 4" aria-label="Memory matching board">
      ${cards.map((card, index) => `
        <button class="memory-card" type="button" data-memory-index="${index}" aria-label="Hidden card ${index + 1}">
          <span class="memory-card-inner">
            <span class="memory-card-back" aria-hidden="true">✦</span>
            <span class="memory-card-front" aria-hidden="true"><b>${card.symbol}</b><small>${card.label}</small></span>
          </span>
        </button>
      `).join("")}
    </div>
    <p class="feedback memory-feedback" id="memory-feedback" aria-live="polite">Choose your first card when ready.</p>
  `;

  const buttons = [...root.querySelectorAll("[data-memory-index]")];
  const timerOutput = root.querySelector("#memory-time");
  const matchesOutput = root.querySelector("#memory-matches");
  const mismatchesOutput = root.querySelector("#memory-mismatches");
  const feedback = root.querySelector("#memory-feedback");

  function updateStatus() {
    timerOutput.textContent = formatPuzzleSeconds(remainingSeconds);
    matchesOutput.textContent = `${matchedPairs} / ${settings.pairCount}`;
    mismatchesOutput.textContent = `${mismatches} / ${settings.mismatchLimit}`;
  }

  function stopCountdown() {
    if (countdownTimer) window.clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function triggerFailure(message) {
    if (failed) return;
    failed = true;
    locked = true;
    stopCountdown();
    if (flipTimer) window.clearTimeout(flipTimer);
    feedback.className = "feedback error memory-feedback";
    feedback.textContent = message;
    failStage(route, stageIndex);
  }

  function tickCountdown() {
    remainingSeconds -= 1;
    updateStatus();
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateStatus();
      triggerFailure("The shelf forgets before every pair is found.");
    }
  }

  function startCountdown() {
    if (timerStarted) return;
    timerStarted = true;
    feedback.className = "feedback memory-feedback";
    feedback.textContent = "The timer has started.";
    countdownTimer = window.setInterval(tickCountdown, 1000);
  }

  function setCardOpen(index, isOpen, isMatched = false) {
    const button = buttons[index];
    const card = cards[index];
    button.classList.toggle("is-open", isOpen);
    button.classList.toggle("is-matched", isMatched);
    button.setAttribute("aria-label", isOpen || isMatched ? `${card.label}${isMatched ? ", matched" : ", revealed"}` : `Hidden card ${index + 1}`);
    if (isMatched) button.disabled = true;
  }

  function chooseCard(index) {
    if (failed || locked || index === firstIndex || buttons[index].classList.contains("is-matched")) return;
    startCountdown();
    setCardOpen(index, true);

    if (firstIndex === null) {
      firstIndex = index;
      return;
    }

    secondIndex = index;
    locked = true;

    if (cards[firstIndex].id === cards[secondIndex].id) {
      setCardOpen(firstIndex, true, true);
      setCardOpen(secondIndex, true, true);
      matchedPairs += 1;
      firstIndex = null;
      secondIndex = null;
      locked = false;
      feedback.className = "feedback success memory-feedback";
      feedback.textContent = `Pairs found: ${matchedPairs} / ${settings.pairCount}`;
      updateStatus();
      if (matchedPairs === settings.pairCount) {
        stopCountdown();
        feedback.textContent = "Every pair remembers its place.";
        completeStage(route.id, stageIndex, stage.rewardFragment);
      }
      return;
    }

    mismatches += 1;
    updateStatus();
    if (mismatches > settings.mismatchLimit) {
      triggerFailure("Too many mismatched pairings wake the lock.");
      return;
    }

    feedback.className = "feedback memory-feedback";
    feedback.textContent = mismatches === settings.mismatchLimit
      ? "That mismatch is the last safe one."
      : "Those symbols do not answer one another. Try again.";
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
    stopCountdown();
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
  const rounds = getSimonRounds(stage);
  const signalCount = Array.isArray(stage.signals) ? stage.signals.length : 0;
  const playbackBaseMs = Math.max(180, Math.floor(Number(stage.playbackBaseMs) || 420));
  const playbackStepMs = Math.max(0, Math.floor(Number(stage.playbackStepMs) || 45));
  const playbackMinMs = Math.max(120, Math.floor(Number(stage.playbackMinMs) || 210));
  let currentRoundIndex = 0;
  let acceptingInput = false;
  let playerIndex = 0;
  let hasPlayedRound = false;
  let playbackActive = false;
  let replaysUsed = 0;
  let disposed = false;
  const pendingDelays = new Set();

  if (!rounds.length || !signalCount) {
    root.innerHTML = '<p class="feedback error">This sequence trial is missing its signals.</p>';
    return null;
  }

  root.innerHTML = `
    <div class="simon-status" aria-label="Sequence puzzle status">
      <span><strong id="simon-round">Round 1 of ${rounds.length} — ${rounds[0].sequence.length} cues</strong></span>
      <span>Progress <strong id="simon-steps">0 / ${rounds[0].sequence.length}</strong></span>
      <span><strong id="simon-replays">Replays left: ${rounds[0].replays}</strong></span>
    </div>
    <div class="simon-twist-hint" id="simon-twist-hint" role="note" hidden>
      <strong>Final rehearsal</strong>
      <span>The final cue must be answered in reverse.</span>
    </div>
    <p class="puzzle-instructions">Watch the full sequence, then repeat it exactly. Every round grows longer and avoids an obvious button order. Replays are limited. Number keys 1–${signalCount} also work.</p>
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
      <button class="primary-button" id="play-sequence" type="button">Start Round</button>
      <button class="secondary-button" id="replay-sequence" type="button" hidden>Replay Cue</button>
    </div>
    <p class="feedback simon-feedback" id="simon-feedback" aria-live="polite">Round 1 is waiting — ${rounds[0].sequence.length} cues.</p>
  `;

  const signalButtons = [...root.querySelectorAll("[data-signal-id]")];
  const playButton = root.querySelector("#play-sequence");
  const replayButton = root.querySelector("#replay-sequence");
  const roundOutput = root.querySelector("#simon-round");
  const stepsOutput = root.querySelector("#simon-steps");
  const replaysOutput = root.querySelector("#simon-replays");
  const feedback = root.querySelector("#simon-feedback");
  const twistHint = root.querySelector("#simon-twist-hint");

  function currentRound() {
    return rounds[currentRoundIndex];
  }

  function expectedSequence() {
    const round = currentRound();
    return round.reverseInput ? [...round.sequence].reverse() : round.sequence;
  }

  function roundFlashDuration() {
    const duration = Math.max(playbackMinMs, playbackBaseMs - (currentRoundIndex * playbackStepMs));
    return reducedMotion ? Math.max(80, Math.round(duration * 0.38)) : duration;
  }

  function roundGapDuration() {
    const gap = Math.round(roundFlashDuration() * 0.48);
    return reducedMotion ? Math.max(45, Math.round(gap * 0.55)) : gap;
  }

  function updateSimonStatus() {
    const round = currentRound();
    roundOutput.textContent = `Round ${currentRoundIndex + 1} of ${rounds.length} — ${round.sequence.length} cues`;
    stepsOutput.textContent = `${playerIndex} / ${expectedSequence().length}`;
    replaysOutput.textContent = `Replays left: ${Math.max(0, round.replays - replaysUsed)}`;
  }

  function updatePlaybackControls() {
    const round = currentRound();
    const remainingReplays = Math.max(0, round.replays - replaysUsed);
    twistHint.hidden = !round.reverseInput;
    playButton.hidden = hasPlayedRound;
    playButton.disabled = playbackActive;
    playButton.textContent = round.reverseInput ? "Start Final Rehearsal" : "Start Round";
    replayButton.hidden = !hasPlayedRound || round.replays <= 0;
    replayButton.disabled = playbackActive || remainingReplays <= 0;
    replayButton.textContent = `Replay Cue (${remainingReplays} left)`;
  }

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

  async function flashSignal(signalId, flashDuration = roundFlashDuration(), gapDuration = roundGapDuration()) {
    const button = root.querySelector(`[data-signal-id="${signalId}"]`);
    if (!button || disposed) return false;
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    if (!await delay(flashDuration)) return false;
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
    return delay(gapDuration);
  }

  async function playCurrentRound({ replay = false } = {}) {
    const round = currentRound();
    if (!round || playbackActive || disposed) return;
    if (replay) {
      if (!hasPlayedRound || replaysUsed >= round.replays) return;
      replaysUsed += 1;
    } else {
      hasPlayedRound = true;
      replaysUsed = 0;
    }

    acceptingInput = false;
    playerIndex = 0;
    playbackActive = true;
    setSignalsEnabled(false);
    updateSimonStatus();
    updatePlaybackControls();
    feedback.className = "feedback simon-feedback";
    feedback.textContent = round.reverseInput
      ? `Watch the final rehearsal: ${round.sequence.length} signals. The ending matters more than usual.`
      : `Watch round ${currentRoundIndex + 1}: ${round.sequence.length} signals.`;
    if (!await delay(reducedMotion ? 120 : 420)) return;

    for (const signalId of round.sequence) {
      if (!await flashSignal(signalId)) return;
    }

    if (disposed) return;
    playbackActive = false;
    acceptingInput = true;
    setSignalsEnabled(true);
    updateSimonStatus();
    updatePlaybackControls();
    feedback.textContent = round.reverseInput
      ? "The Phantom's final bow begins where the light-show ended. Let that ending guide each step."
      : "Your turn. Repeat this round in order.";
    signalButtons[0]?.focus();
  }

  function failSequence() {
    acceptingInput = false;
    setSignalsEnabled(false);
    feedback.className = "feedback error simon-feedback shake";
    feedback.textContent = "That signal broke the chain.";
    window.setTimeout(() => feedback.classList.remove("shake"), 320);
    failStage(route, stageIndex);
  }

  function chooseSignal(signalId) {
    if (!acceptingInput) return;
    const expected = expectedSequence();
    void flashSignal(signalId, Math.max(90, roundFlashDuration() * 0.55), Math.max(40, roundGapDuration() * 0.35));
    if (signalId !== expected[playerIndex]) {
      failSequence();
      return;
    }

    playerIndex += 1;
    updateSimonStatus();
    feedback.className = "feedback success simon-feedback";
    feedback.textContent = `${playerIndex} / ${expected.length} signals remembered.`;
    if (playerIndex !== expected.length) return;

    acceptingInput = false;
    setSignalsEnabled(false);
    if (currentRoundIndex === rounds.length - 1) {
      feedback.textContent = "The whole sequence answers you.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    currentRoundIndex += 1;
    playerIndex = 0;
    hasPlayedRound = false;
    replaysUsed = 0;
    updateSimonStatus();
    updatePlaybackControls();
    feedback.textContent = currentRound().reverseInput
      ? `Round ${currentRoundIndex} is clear. The final rehearsal turns the cue upon itself; watch how it ends.`
      : `Round ${currentRoundIndex} is clear. Round ${currentRoundIndex + 1} is ready.`;
    playButton.focus();
  }

  function handleNumberKey(event) {
    if (document.querySelector(".stage-modal:not([hidden])")) return;
    if (event.target?.matches?.("input, textarea, select, [contenteditable='true']")) return;
    if (!acceptingInput || !/^[1-9]$/.test(event.key)) return;
    const signal = stage.signals[Number(event.key) - 1];
    if (!signal || Number(event.key) > signalCount) return;
    event.preventDefault();
    if (signal) chooseSignal(signal.id);
  }

  signalButtons.forEach((button) => {
    button.addEventListener("click", () => chooseSignal(button.dataset.signalId));
  });
  playButton.addEventListener("click", () => playCurrentRound());
  replayButton.addEventListener("click", () => playCurrentRound({ replay: true }));
  document.addEventListener("keydown", handleNumberKey);
  updateSimonStatus();
  updatePlaybackControls();

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

function renderMazePuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const settings = getMazeSettings(stage);
  const directions = {
    n: { dx: 0, dy: -1, opposite: "s", label: "north" },
    e: { dx: 1, dy: 0, opposite: "w", label: "east" },
    s: { dx: 0, dy: 1, opposite: "n", label: "south" },
    w: { dx: -1, dy: 0, opposite: "e", label: "west" }
  };
  const keyboardDirections = {
    ArrowUp: "n",
    ArrowRight: "e",
    ArrowDown: "s",
    ArrowLeft: "w",
    w: "n",
    W: "n",
    d: "e",
    D: "e",
    s: "s",
    S: "s",
    a: "w",
    A: "w"
  };
  const width = settings.width;
  const height = settings.height;
  const spacingScale = Math.min(width, height);
  const start = { x: 0, y: 0 };
  const exit = { x: width - 1, y: height - 1 };
  const exitKey = cellKey(exit.x, exit.y);
  let player = { ...start };
  let failed = false;
  const seenCells = new Set();
  const collectedMarks = new Set();

  function createCells() {
    return Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => ({
        x,
        y,
        visited: false,
        walls: { n: true, e: true, s: true, w: true }
      }))
    );
  }

  function shuffled(items) {
    return shuffleCards(items);
  }

  function validNeighbor(x, y, direction) {
    const nextX = x + directions[direction].dx;
    const nextY = y + directions[direction].dy;
    if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) return null;
    return { x: nextX, y: nextY, direction };
  }

  function buildMaze() {
    const cells = createCells();
    const stack = [cells[0][0]];
    cells[0][0].visited = true;

    while (stack.length) {
      const current = stack[stack.length - 1];
      const neighbors = Object.keys(directions)
        .map((direction) => validNeighbor(current.x, current.y, direction))
        .filter((neighbor) => neighbor && !cells[neighbor.y][neighbor.x].visited);

      if (!neighbors.length) {
        stack.pop();
        continue;
      }

      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const nextCell = cells[next.y][next.x];
      current.walls[next.direction] = false;
      nextCell.walls[directions[next.direction].opposite] = false;
      nextCell.visited = true;
      stack.push(nextCell);
    }

    cells.flat().forEach((cell) => {
      delete cell.visited;
    });
    return cells;
  }

  function openNeighbors(cells, position, blockedKeys = new Set()) {
    const cell = cells[position.y][position.x];
    return Object.entries(directions)
      .filter(([direction]) => !cell.walls[direction])
      .map(([direction, offset]) => ({ x: position.x + offset.dx, y: position.y + offset.dy }))
      .filter((next) => !blockedKeys.has(cellKey(next.x, next.y)));
  }

  function pathBetween(cells, from, to, blockedKeys = new Set()) {
    const queue = [{ ...from }];
    const previous = new Map([[cellKey(from.x, from.y), null]]);

    while (queue.length) {
      const current = queue.shift();
      if (current.x === to.x && current.y === to.y) break;
      openNeighbors(cells, current, blockedKeys).forEach((next) => {
        const key = cellKey(next.x, next.y);
        if (previous.has(key)) return;
        previous.set(key, current);
        queue.push(next);
      });
    }

    const targetKey = cellKey(to.x, to.y);
    if (!previous.has(targetKey)) return [];

    const path = [];
    let cursor = { ...to };
    while (cursor) {
      path.push(cursor);
      cursor = previous.get(cellKey(cursor.x, cursor.y));
    }
    return path.reverse();
  }

  function distancesFrom(cells, from, blockedKeys = new Set()) {
    const distances = new Map([[cellKey(from.x, from.y), 0]]);
    const queue = [{ ...from }];
    while (queue.length) {
      const current = queue.shift();
      const distance = distances.get(cellKey(current.x, current.y));
      openNeighbors(cells, current, blockedKeys).forEach((next) => {
        const key = cellKey(next.x, next.y);
        if (distances.has(key)) return;
        distances.set(key, distance + 1);
        queue.push(next);
      });
    }
    return distances;
  }

  function buildOpenFallbackMaze() {
    const cells = createCells();
    cells.flat().forEach((cell) => {
      if (cell.x < width - 1) {
        cell.walls.e = false;
        cells[cell.y][cell.x + 1].walls.w = false;
      }
      if (cell.y < height - 1) {
        cell.walls.s = false;
        cells[cell.y + 1][cell.x].walls.n = false;
      }
      delete cell.visited;
    });
    return cells;
  }

  function chooseMarkCells(cells) {
    const startSideDistances = distancesFrom(cells, start, new Set([exitKey]));
    const startSideCandidates = [...startSideDistances.entries()]
      .filter(([key]) => key !== startKey && key !== exitKey)
      .map(([key, distance]) => {
        const [x, y] = key.split(",").map(Number);
        return { x, y, key, distance };
      })
      .sort((a, b) => b.distance - a.distance);
    const distantCandidates = startSideCandidates.filter((candidate) => candidate.distance > Math.floor(spacingScale / 2));
    const candidates = distantCandidates.length >= settings.trailMarksRequired
      ? distantCandidates
      : startSideCandidates;
    const marks = [];

    candidates.forEach((candidate) => {
      const farEnough = marks.every((mark) => Math.abs(mark.x - candidate.x) + Math.abs(mark.y - candidate.y) >= Math.floor(spacingScale / 3));
      if (marks.length < settings.trailMarksRequired && farEnough) marks.push(candidate);
    });
    candidates.forEach((candidate) => {
      if (marks.length >= settings.trailMarksRequired) return;
      if (!marks.some((mark) => mark.key === candidate.key)) marks.push(candidate);
    });
    return marks;
  }

  function requiredPathThroughMarks(cells, marks, blockedKeys = new Set()) {
    const path = [];
    let cursor = start;

    for (const mark of marks) {
      const markPath = pathBetween(cells, cursor, mark, new Set([...blockedKeys, exitKey]));
      if (!markPath.length) return [];
      path.push(...markPath.slice(path.length ? 1 : 0));
      cursor = mark;
    }

    const exitPath = pathBetween(cells, cursor, exit, blockedKeys);
    if (!exitPath.length) return [];
    path.push(...exitPath.slice(path.length ? 1 : 0));
    return path;
  }

  function hasSafeRequiredPath(cells, marks, traps) {
    return requiredPathThroughMarks(cells, marks, traps).length > 0;
  }

  function buildMazePlan(cells, { allowTraps = true } = {}) {
    const markCells = chooseMarkCells(cells);
    if (markCells.length < settings.trailMarksRequired) return null;

    const requiredPath = requiredPathThroughMarks(cells, markCells);
    if (!requiredPath.length) return null;

    const markKeys = new Set(markCells.map((mark) => mark.key));
    const protectedKeys = new Set(requiredPath.map((cell) => cellKey(cell.x, cell.y)));
    const distances = distancesFrom(cells, start);
    const trapKeys = allowTraps
      ? new Set(shuffled(cells.flat()
        .map((cell) => ({ ...cell, key: cellKey(cell.x, cell.y), distance: distances.get(cellKey(cell.x, cell.y)) || 0 }))
        .filter((cell) =>
          cell.key !== startKey &&
          cell.key !== exitKey &&
          !markKeys.has(cell.key) &&
          !protectedKeys.has(cell.key) &&
          cell.distance > 3
        ))
        .slice(0, settings.trapCount)
        .map((cell) => cell.key))
      : new Set();

    if (!hasSafeRequiredPath(cells, markCells, trapKeys)) return null;

    const checkpointCell = requiredPath[Math.max(1, Math.floor(requiredPath.length / 2))] || start;
    return {
      maze: cells,
      markCells,
      markKeys,
      trapKeys,
      checkpointCell,
      checkpointKey: cellKey(checkpointCell.x, checkpointCell.y)
    };
  }

  function generateMazePlan() {
    const maxAttempts = 32;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const plan = buildMazePlan(buildMaze(), { allowTraps: true });
      if (plan) return plan;
    }

    return buildMazePlan(buildMaze(), { allowTraps: false })
      || buildMazePlan(buildOpenFallbackMaze(), { allowTraps: false });
  }

  const startKey = cellKey(start.x, start.y);
  const plan = generateMazePlan();
  if (!plan) {
    root.innerHTML = '<p class="feedback error">The maze could not prepare a fair path. Return to this trial and try again.</p>';
    return null;
  }
  const maze = plan.maze;
  const markKeys = plan.markKeys;
  const trapKeys = plan.trapKeys;
  const checkpointCell = plan.checkpointCell;
  const checkpointKey = plan.checkpointKey;
  const maxTrapHits = 3;
  let trapHits = 0;
  let latestCheckpoint = { ...start };

  root.innerHTML = `
    <div class="maze-status" aria-label="Maze status">
      <span>Markers found <strong id="maze-marks">0 / ${settings.trailMarksRequired}</strong></span>
      <span>Gate <strong id="maze-gate">Sealed</strong></span>
      <span>Trap hits <strong id="maze-traps">0 / ${maxTrapHits}</strong></span>
      <span>View <strong>${settings.visibilityRadius} steps</strong></span>
    </div>
    <div class="maze-collection-card" aria-label="Maze symbol key">
      <span>Trail markers to collect <strong>${settings.trailMarksRequired}</strong></span>
      <span><i class="maze-symbol maze-symbol-mark">M</i> Marker</span>
      <span><i class="maze-symbol maze-symbol-player">P</i> You</span>
      <span><i class="maze-symbol maze-symbol-gate">G</i> Gate</span>
      <span><i class="maze-symbol maze-symbol-checkpoint">C</i> Checkpoint</span>
      <span><i class="maze-symbol maze-symbol-trap">!</i> Trap</span>
    </div>
    <p class="puzzle-instructions">Collect every green M trail marker before stepping onto the final gate. Traps return you to the latest checkpoint; the third trap hit locks this trial.</p>
    <div class="maze-board" style="--maze-width: ${width}; --maze-height: ${height}" role="grid" aria-label="Foggy maze board, ${width} columns by ${height} rows">
      ${maze.flat().map((cell) => `
        <div class="maze-cell ${Object.entries(cell.walls).filter(([, hasWall]) => hasWall).map(([direction]) => `wall-${direction}`).join(" ")}" data-maze-cell="${cellKey(cell.x, cell.y)}" role="gridcell"></div>
      `).join("")}
    </div>
    <div class="maze-controls" aria-label="Maze direction controls">
      <button class="maze-control maze-control-up" type="button" data-maze-move="n" aria-label="Move north">N</button>
      <button class="maze-control" type="button" data-maze-move="w" aria-label="Move west">W</button>
      <button class="maze-control" type="button" data-maze-move="s" aria-label="Move south">S</button>
      <button class="maze-control" type="button" data-maze-move="e" aria-label="Move east">E</button>
    </div>
    <p class="feedback maze-feedback" id="maze-feedback" aria-live="polite">The gate waits beyond the fog.</p>
  `;

  const markOutput = root.querySelector("#maze-marks");
  const gateOutput = root.querySelector("#maze-gate");
  const trapOutput = root.querySelector("#maze-traps");
  const feedback = root.querySelector("#maze-feedback");
  const cellElements = new Map([...root.querySelectorAll("[data-maze-cell]")].map((cell) => [cell.dataset.mazeCell, cell]));

  function isVisible(cell) {
    return Math.abs(cell.x - player.x) + Math.abs(cell.y - player.y) <= settings.visibilityRadius;
  }

  function renderMazeView(message, tone = "") {
    maze.flat().forEach((cell) => {
      const key = cellKey(cell.x, cell.y);
      const element = cellElements.get(key);
      const visible = isVisible(cell);
      if (visible) seenCells.add(key);
      element.classList.toggle("is-visible", visible);
      element.classList.toggle("is-seen", seenCells.has(key));
      element.classList.toggle("is-current", key === cellKey(player.x, player.y));
      element.classList.toggle("is-mark", visible && markKeys.has(key) && !collectedMarks.has(key));
      element.classList.toggle("is-trap", visible && trapKeys.has(key));
      element.classList.toggle("is-exit", visible && key === exitKey);
      element.classList.toggle("is-checkpoint", visible && key === checkpointKey);
      element.textContent = "";

      if (key === cellKey(player.x, player.y)) element.textContent = "P";
      else if (visible && markKeys.has(key) && !collectedMarks.has(key)) element.textContent = "M";
      else if (visible && key === exitKey) element.textContent = collectedMarks.size >= settings.trailMarksRequired ? "G" : "X";
      else if (visible && trapKeys.has(key)) element.textContent = "!";
      else if (visible && key === checkpointKey) element.textContent = "C";
      element.setAttribute("aria-label", visible ? `Maze cell ${cell.x + 1}, ${cell.y + 1}${element.textContent ? `, ${element.textContent}` : ""}` : "Unseen maze cell");
    });

    markOutput.textContent = `${collectedMarks.size} / ${settings.trailMarksRequired}`;
    gateOutput.textContent = collectedMarks.size >= settings.trailMarksRequired ? "Open" : "Sealed";
    trapOutput.textContent = `${trapHits} / ${maxTrapHits}`;
    if (message) {
      feedback.className = `feedback maze-feedback ${tone}`.trim();
      feedback.textContent = message;
    }
  }

  function failMaze(message) {
    if (failed) return;
    failed = true;
    feedback.className = "feedback error maze-feedback";
    feedback.textContent = message;
    failStage(route, stageIndex);
  }

  function triggerTrap() {
    trapHits += 1;
    if (trapHits >= maxTrapHits) {
      renderMazeView("The third snare closes the old road for now.", "error");
      failMaze("The third snare closes the old road for now.");
      return;
    }

    const checkpointName = cellKey(latestCheckpoint.x, latestCheckpoint.y) === startKey ? "start" : "checkpoint";
    player = { ...latestCheckpoint };
    renderMazeView(`A hidden snare snaps shut. Trap ${trapHits} of ${maxTrapHits}; you return to the ${checkpointName}.`, "error");
  }

  function move(direction) {
    if (failed || stageSolved) return;
    const current = maze[player.y][player.x];
    if (current.walls[direction]) {
      renderMazeView("A hedge wall blocks that way.");
      return;
    }

    const offset = directions[direction];
    player = { x: player.x + offset.dx, y: player.y + offset.dy };
    const key = cellKey(player.x, player.y);

    if (trapKeys.has(key)) {
      triggerTrap();
      return;
    }

    if (key === checkpointKey) {
      latestCheckpoint = { ...checkpointCell };
    }

    if (markKeys.has(key) && !collectedMarks.has(key)) {
      collectedMarks.add(key);
      renderMazeView(key === checkpointKey
        ? "A checkpoint stone records this trail mark."
        : "A trail mark glows and joins your map.", "success");
      return;
    }

    if (key === exitKey) {
      if (collectedMarks.size < settings.trailMarksRequired) {
        renderMazeView("The gate rejects an unfinished path.", "error");
        failMaze("The gate rejects an unfinished path.");
        return;
      }
      renderMazeView("The hidden gate opens.", "success");
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    if (key === checkpointKey) {
      renderMazeView("A checkpoint stone records the path.", "success");
      return;
    }

    renderMazeView(`You move ${directions[direction].label}.`);
  }

  function handleMazeKey(event) {
    if (document.querySelector(".stage-modal:not([hidden])")) return;
    if (event.target?.matches?.("input, textarea, select, [contenteditable='true']")) return;
    const direction = keyboardDirections[event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction);
  }

  root.querySelectorAll("[data-maze-move]").forEach((button) => {
    button.addEventListener("click", () => move(button.dataset.mazeMove));
  });
  document.addEventListener("keydown", handleMazeKey);
  renderMazeView();

  return () => document.removeEventListener("keydown", handleMazeKey);
}

function renderMathPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const acceptedAnswers = (Array.isArray(stage.acceptedAnswers) ? stage.acceptedAnswers : ["224"])
    .map(normalizeMathAnswer);
  root.innerHTML = `
    <div class="question-block math-problem">
      <p>${stage.problem}</p>
    </div>
    <ul class="math-guidance">
      ${(Array.isArray(stage.guidance) ? stage.guidance : []).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <form class="answer-form" id="math-form">
      <label class="input-label" for="math-answer">Final value</label>
      <input class="answer-input" id="math-answer" name="answer" type="text" inputmode="decimal" autocomplete="off" required>
      <div class="form-actions">
        <button class="primary-button" type="submit">Submit Value</button>
      </div>
    </form>
    <p class="feedback" id="math-feedback" aria-live="polite"></p>
  `;

  const input = root.querySelector("#math-answer");
  const feedback = root.querySelector("#math-feedback");
  root.querySelector("#math-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (acceptedAnswers.includes(normalizeMathAnswer(input.value))) {
      feedback.className = "feedback success";
      feedback.textContent = "The derivative unlocks the shelf.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    failStage(route, stageIndex);
  });
  if (!window.matchMedia("(max-width: 640px)").matches) input.focus();
}

function renderLogicPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const settings = getLogicSettings(stage);
  if (!settings.books.length || !settings.keys.length || !settings.shelves.length) {
    root.innerHTML = '<p class="feedback error">This deduction puzzle is missing its books, keys, or shelves.</p>';
    return null;
  }

  function selectOptions(items, placeholder) {
    return `
      <option value="">${placeholder}</option>
      ${items.map((item) => `<option value="${item.id}">${item.label}</option>`).join("")}
    `;
  }

  root.innerHTML = `
    <div class="logic-clues">
      <h3>Clues</h3>
      <ol>
        ${settings.clues.map((clue) => `<li>${clue}</li>`).join("")}
      </ol>
    </div>
    <form class="logic-form" id="logic-form">
      <div class="logic-grid" role="group" aria-label="Book key and shelf arrangement">
        <div class="logic-grid-heading">Book</div>
        <div class="logic-grid-heading">Key</div>
        <div class="logic-grid-heading">Shelf</div>
        ${settings.books.map((book) => `
          <label class="logic-book" for="logic-key-${book.id}">${book.label}</label>
          <select class="logic-select" id="logic-key-${book.id}" data-book-id="${book.id}" data-logic-field="key" required>
            ${selectOptions(settings.keys, "Choose key")}
          </select>
          <select class="logic-select" id="logic-shelf-${book.id}" data-book-id="${book.id}" data-logic-field="shelf" required>
            ${selectOptions(settings.shelves, "Choose shelf")}
          </select>
        `).join("")}
      </div>
      <div class="form-actions">
        <button class="primary-button" type="submit">Submit Arrangement</button>
      </div>
    </form>
    <p class="feedback" id="logic-feedback" aria-live="polite">Each key and shelf is used once.</p>
  `;

  const feedback = root.querySelector("#logic-feedback");
  root.querySelector("#logic-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const arrangement = {};
    const selectedKeys = [];
    const selectedShelves = [];

    settings.books.forEach((book) => {
      const key = root.querySelector(`[data-book-id="${book.id}"][data-logic-field="key"]`).value;
      const shelf = root.querySelector(`[data-book-id="${book.id}"][data-logic-field="shelf"]`).value;
      arrangement[book.id] = { key, shelf };
      if (key) selectedKeys.push(key);
      if (shelf) selectedShelves.push(shelf);
    });

    if (
      selectedKeys.length !== settings.books.length ||
      selectedShelves.length !== settings.books.length
    ) {
      feedback.className = "feedback error";
      feedback.textContent = "Complete every book row before submitting.";
      return;
    }

    const uniqueKeys = new Set(selectedKeys);
    const uniqueShelves = new Set(selectedShelves);
    if (uniqueKeys.size !== settings.books.length || uniqueShelves.size !== settings.books.length) {
      failStage(route, stageIndex);
      return;
    }

    const solved = settings.books.every((book) => {
      const expected = settings.solution[book.id];
      return expected &&
        arrangement[book.id].key === expected.key &&
        arrangement[book.id].shelf === expected.shelf;
    });

    if (solved) {
      feedback.className = "feedback success";
      feedback.textContent = "The books, keys, and shelves align.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    failStage(route, stageIndex);
  });
}

function renderAudioGuessPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const acceptedAnswers = (Array.isArray(stage.acceptedAnswers) ? stage.acceptedAnswers : [])
    .map(normalizeAnswer);
  const fallbackAnswer = normalizeAnswer(stage.fallbackAnswer || "MUSIC");
  let usingAudio = false;
  let disposed = false;
  let fallbackTimer = null;
  const audio = new Audio();

  root.innerHTML = `
    <div class="audio-panel" id="audio-panel">
      <p class="feedback" id="audio-status" aria-live="polite">Checking for a provided audio clue...</p>
    </div>
    <div class="audio-fallback" id="audio-fallback" hidden>
      <div class="question-block">
        <p>The stand holds a theatre cipher: <strong>${stage.fallbackCipher || "2-5-14-5-1-20-8 / 20-8-5 / 13-1-19-11 / 20-8-5 / 8-9-4-4-5-14 / 14-15-20-5 / 9-19 / 13-21-19-9-3"}</strong></p>
        <p>Use A1Z26, to name the hidden note.</p>
      </div>
    </div>
    <form class="answer-form" id="audio-guess-form">
      <label class="input-label" for="audio-guess-answer">Song or cipher answer</label>
      <input class="answer-input" id="audio-guess-answer" name="answer" type="text" autocomplete="off" required>
      <div class="form-actions">
        <button class="primary-button" type="submit">Submit Guess</button>
      </div>
    </form>
    <p class="feedback" id="audio-feedback" aria-live="polite"></p>
  `;

  const panel = root.querySelector("#audio-panel");
  const fallback = root.querySelector("#audio-fallback");
  const status = root.querySelector("#audio-status");
  const feedback = root.querySelector("#audio-feedback");
  const input = root.querySelector("#audio-guess-answer");

  function showFallback() {
    if (disposed || usingAudio) return;
    status.className = "feedback";
    status.textContent = "The musical cipher is active.";
    fallback.hidden = false;
  }

  function showAudio() {
    if (disposed || usingAudio) return;
    usingAudio = true;
    window.clearTimeout(fallbackTimer);
    status.className = "feedback success";
    status.textContent = "A provided audio clue loaded. Play it, then submit the title or hidden word.";
    fallback.hidden = true;
    panel.innerHTML = `
      <p class="puzzle-instructions">A provided audio clue loaded. Play it, then submit the title or hidden word.</p>
      <audio class="audio-player" controls src="${stage.audioSrc}"></audio>
    `;
  }

  function handleAudioError() {
    window.clearTimeout(fallbackTimer);
    showFallback();
  }

  audio.preload = "metadata";
  audio.addEventListener("loadedmetadata", showAudio, { once: true });
  audio.addEventListener("canplaythrough", showAudio, { once: true });
  audio.addEventListener("error", handleAudioError, { once: true });
  fallbackTimer = window.setTimeout(showFallback, 1300);
  if (stage.audioSrc) {
    audio.src = stage.audioSrc;
    audio.load();
  } else {
    showFallback();
  }

  root.querySelector("#audio-guess-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = normalizeAnswer(input.value);
    const correct = usingAudio
      ? acceptedAnswers.includes(answer)
      : answer === fallbackAnswer;

    if (correct) {
      feedback.className = "feedback success";
      feedback.textContent = "The hidden note answers from the dark.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    failStage(route, stageIndex);
  });

  if (!window.matchMedia("(max-width: 640px)").matches) input.focus();
  return () => {
    disposed = true;
    window.clearTimeout(fallbackTimer);
    audio.removeAttribute("src");
    audio.load();
  };
}

function renderMastermindPuzzle(route, stage, stageIndex) {
  const root = document.querySelector("#puzzle-root");
  const settings = getMastermindSettings(stage);
  const sequenceLength = settings.correctSequence.length;
  const guesses = [];

  if (!settings.symbols.length || !sequenceLength) {
    root.innerHTML = '<p class="feedback error">This cue puzzle is missing its symbols or hidden sequence.</p>';
    return null;
  }

  function symbolOptions() {
    return `
      <option value="">Choose cue</option>
      ${settings.symbols.map((symbol) => `<option value="${symbol.id}">${symbol.label}</option>`).join("")}
    `;
  }

  function scoreGuess(guess) {
    let exact = 0;
    const remainingCorrect = {};
    const remainingGuess = {};

    guess.forEach((symbolId, index) => {
      if (symbolId === settings.correctSequence[index]) {
        exact += 1;
        return;
      }
      remainingCorrect[settings.correctSequence[index]] = (remainingCorrect[settings.correctSequence[index]] || 0) + 1;
      remainingGuess[symbolId] = (remainingGuess[symbolId] || 0) + 1;
    });

    const misplaced = Object.entries(remainingGuess)
      .reduce((total, [symbolId, count]) => total + Math.min(count, remainingCorrect[symbolId] || 0), 0);
    return { exact, misplaced };
  }

  function renderHistory() {
    const history = root.querySelector("#mastermind-history");
    history.innerHTML = guesses.length
      ? guesses.map((entry, index) => `
        <div class="mastermind-history-row">
          <span>${index + 1}</span>
          <strong>${entry.guess.map((symbolId) => itemLabel(settings.symbols, symbolId)).join(" / ")}</strong>
          <span>${entry.exact} placed, ${entry.misplaced} elsewhere</span>
        </div>
      `).join("")
      : '<p class="puzzle-instructions">No cues have been called yet.</p>';
  }

  root.innerHTML = `
    <div class="mastermind-status" aria-label="Mastermind status">
      <span>Guesses <strong id="mastermind-count">0 / ${settings.maxGuesses}</strong></span>
      <span>Slots <strong>${sequenceLength}</strong></span>
      <span>Cue pool <strong>${settings.symbols.length}</strong></span>
    </div>
    <form class="mastermind-form" id="mastermind-form">
      <div class="mastermind-selects" aria-label="Cue order guess">
        ${Array.from({ length: sequenceLength }, (_, index) => `
          <label>
            <span>Cue ${index + 1}</span>
            <select class="mastermind-select" data-mastermind-slot="${index}" required>${symbolOptions()}</select>
          </label>
        `).join("")}
      </div>
      <div class="form-actions">
        <button class="primary-button" type="submit">Call Cue</button>
        <button class="secondary-button" id="mastermind-clear" type="button">Clear</button>
      </div>
    </form>
    <p class="feedback mastermind-feedback" id="mastermind-feedback" aria-live="polite">Use each cue at most once in a guess.</p>
    <div class="mastermind-history" id="mastermind-history" aria-label="Cue guess history"></div>
  `;

  const countOutput = root.querySelector("#mastermind-count");
  const feedback = root.querySelector("#mastermind-feedback");
  const selects = [...root.querySelectorAll("[data-mastermind-slot]")];

  function resetSelects() {
    selects.forEach((select) => {
      select.value = "";
    });
  }

  function updateCount() {
    countOutput.textContent = `${guesses.length} / ${settings.maxGuesses}`;
  }

  root.querySelector("#mastermind-clear").addEventListener("click", resetSelects);
  root.querySelector("#mastermind-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const guess = selects.map((select) => select.value);
    if (guess.some((symbolId) => !symbolId)) {
      feedback.className = "feedback error mastermind-feedback";
      feedback.textContent = "Choose a cue for every slot before calling it.";
      return;
    }

    if (new Set(guess).size !== guess.length) {
      feedback.className = "feedback error mastermind-feedback";
      feedback.textContent = "Use each stage cue at most once.";
      return;
    }

    const score = scoreGuess(guess);
    if (score.exact === sequenceLength) {
      feedback.className = "feedback success mastermind-feedback";
      feedback.textContent = "The final cue order is true.";
      completeStage(route.id, stageIndex, stage.rewardFragment);
      return;
    }

    guesses.push({ guess, ...score });
    updateCount();
    renderHistory();

    if (guesses.length >= settings.maxGuesses) {
      feedback.className = "feedback error mastermind-feedback";
      feedback.textContent = `All ${settings.maxGuesses} rehearsals fail. The curtain falls.`;
      failStage(route, stageIndex);
      return;
    }

    feedback.className = "feedback mastermind-feedback";
    feedback.textContent = `${score.exact} correct in place, ${score.misplaced} correct but in the wrong position.`;
    resetSelects();
  });

  updateCount();
  renderHistory();
}

function continueRoute() {
  if (currentStageIndex < 3) {
    currentStageIndex += 1;
    renderRiddleGate();
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

  const progress = getRouteProgress(route.id);
  currentFragments = progress.fragments;
  if (!phraseGateIsUnlocked(progress)) {
    renderCurrentRouteStep();
    return;
  }

  const lockoutKey = phraseLockoutKey(route.id);
  if (activeLockout(lockoutKey)) {
    renderLockout(route, "The Phrase Gate", lockoutKey, renderPhraseGate);
    return;
  }

  currentView = "phrase";
  currentLockoutKey = null;
  const shuffledFragments = shuffleOutOfOrder(currentFragments.filter(Boolean));
  const fragmentTokens = shuffledFragments
    .map((fragment) => `<span class="word-token phrase-fragment-token">${fragment}</span>`)
    .join("");
  setScreen(`
    <section class="screen parchment phrase-screen route-screen ${routeClass(route.id)}" aria-labelledby="phrase-title">
      <div class="phrase-content">
        <p class="section-label">The phrase gate</p>
        <h2 id="phrase-title">Four fragments. One full phrase.</h2>
        <p class="lead">Each trial gave you a phrase fragment. The fragments below are not shown in final order.</p>
        <p class="phrase-guidance">Reconstruct the full phrase to claim this road’s badge. Each wrong submission costs one route life; the ${getRouteMaxLives() === 2 ? "second" : "third"} starts this phrase gate's timeout.</p>
        ${routeLivesMarkup(route.id, "route-lives-phrase")}
        ${ringMeterMarkup(route.id, "ring-meter-phrase")}
        <div class="word-row phrase-fragment-row" aria-label="Shuffled earned phrase fragments">${fragmentTokens}</div>
        <form class="answer-form" id="phrase-form">
          <label class="input-label" for="phrase-answer">Enter the full phrase</label>
          <input class="answer-input" id="phrase-answer" name="phrase" type="text" autocomplete="off" required>
          <div class="form-actions">
            <button class="primary-button" type="submit">Open the Gate</button>
            ${ringHintButtonMarkup("phrase-ring-button")}
          </div>
        </form>
        <div class="ring-clue-reveal ring-clue-inline" id="ring-clue-area" aria-live="polite" hidden></div>
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
      const mistake = registerRouteMistake(route.id, lockoutKey);
      if (mistake.timedOut) {
        renderLockout(route, "The Phrase Gate", lockoutKey, renderPhraseGate);
        return;
      }
      feedback.className = "feedback error";
      feedback.textContent = routeMistakeMessage(mistake.livesRemaining);
      document.querySelector("#phrase-answer").select();
    }
  });
  bindRingHint(route.id, route.phraseGate?.ringClue);
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
  if (allBadgesNow && !hadAllBadgesAtLoad) showRefreshHintPopup();
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
  const letterParagraphs = [
    "Nuwa,",
    "If you are reading this, then somehow you survived the roads, the riddles, the shelves, the shadows, the stage, the Ring, and whatever unreasonable puzzle nonsense I decided to put between you and a birthday message.",
    "Honestly, bru, that already feels accurate.",
    "I wanted this to feel like something made for you, not just something made about you. A road for the reader, the puzzle-solver, the movie watcher, the overthinker, the man who would probably inspect every corner of the page because “there might be another ending.” And if you did exactly that, then yes, I am engooding myself, because I knew you would.",
    "There is something very Ranger-like about the way you move through things. Not loud. Not obvious. Not trying to look magical. But sharp. Careful. Observant. The kind of person who sees tracks where other people only see dirt. The kind of person who understands that skill can look like mystery to people who never saw the training behind it. Rangers are misunderstood because people do not know what they do in the dark, before the danger reaches the kingdom. I think there is something beautiful in that. Quiet work. Hidden discipline. A calling that does not need a crowd to be real.",
    "And then, of course, there is the road.",
    "I could not make something for you without thinking of small people carrying impossible things. Of friendship that keeps walking even when the mountain is far, the burden is heavy, and the person carrying it does not always know how tired they are. Sam and Frodo’s friendship is one of those stories that deepends me, because it is not friendship when things are easy. It is friendship when someone stays. When someone says, “I can’t carry it for you, but I can carry you.” That kind of loyalty is rare. That kind of heart is rare.",
    "I am thankful I get to call you my friend.",
    "Not just because you are smart, although you are annoyingly smart. Not just because you like puzzles, books, movies, fantasy, and all these beautifully dramatic things. But because having you as a friend has been one of those quiet gifts that makes the road better. Some people are only fun to know when the day is light. But some people make you look forward to the road ahead. You are one of those people.",
    "I hope this next chapter of your life is good to you. I hope your studies sharpen you without draining you. I hope the things you are working toward begin to open like hidden doors. I hope you keep becoming the kind of man who can carry responsibility without losing warmth, intelligence without losing humility, and ambition without losing heart.",
    "There is a future version of you waiting somewhere ahead on the road. Wiser. Stronger. More disciplined. Maybe still hungry enough for second breakfast, because obviously some things should never change. I hope you meet that version of yourself with courage. Not loud courage. Not dramatic courage. The quiet kind. The kind that keeps walking.",
    "And because no quest is complete without a little theatre: I hope you also remember that the mask is never the whole story. The world can be quick to misunderstand what it cannot see. But the right people will learn to see beneath the mask, beneath the performance, beneath the jokes, beneath the silence. They will see the person there. And they will be glad they did.",
    "So happy birthday, bru.",
    "May your road be long in the best way.",
    "May your shelves never run out of stories.",
    "May your stage always have one more song.",
    "May your future be full of doors worth opening.",
    "And may our friendship keep walking, even when the path gets strange.",
    "I am grateful for you.",
    "I am proud of you.",
    "And I am very glad you exist.",
    "Happy birthday."
  ];
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
          <div class="secret-letter-body">${letterParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
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
difficultyButton.addEventListener("click", () => showTimeoutDifficultyPopup({ initial: false }));

function installDevHelpers() {
  if (new URLSearchParams(window.location.search).get("dev") !== "1") {
    delete window.BQ_DEV;
    return;
  }

  window.BQ_DEV = {
    setTimeoutDifficulty: (value) => setTimeoutDifficulty(value),
    getTimeoutDifficulty: () => getTimeoutDifficulty(),
    clearTimeoutDifficulty: () => clearTimeoutDifficulty(),
    showRouteLives() {
      const routeLives = normalizeRouteLives(state.routeLives);
      const snapshot = {
        maxLives: routeLives.maxLives,
        ...Object.fromEntries(ROUTE_IDS.map((routeId) => [routeId, routeLives[routeId]]))
      };
      console.log("Birthday Quest route lives", snapshot);
      return snapshot;
    },
    clearRingState: () => {
      const snapshot = clearRingState();
      if (currentRouteId) updateRingDisplays(currentRouteId);
      return snapshot;
    },
    acquireRing: () => acquireRing(),
    setRingUses: (routeId = currentRouteId, uses = 0) => setRingUses(routeId, uses),
    showRingState() {
      const snapshot = JSON.parse(JSON.stringify({
        acquired: state.ringAcquired,
        ...state.ringState
      }));
      console.log("Birthday Quest Ring state", snapshot);
      return snapshot;
    },
    clearLockouts() {
      state.stageLockouts = {};
      saveState();
      if (currentView === "lockout") {
        const wasPhraseGate = currentLockoutKey?.endsWith("-phrase");
        const wasRiddleGate = currentLockoutKey?.includes("-gate-");
        currentLockoutKey = null;
        if (wasPhraseGate) renderPhraseGate();
        else if (wasRiddleGate) renderRiddleGate();
        else renderStage();
      }
      return true;
    },
    unlockAllGates(routeId = currentRouteId) {
      const route = ROUTES[routeId];
      if (!route) return false;

      const progress = getRouteProgress(routeId);
      progress.gatesCompleted = progress.gatesCompleted.map(() => true);
      route.gates.forEach((_, index) => {
        delete state.stageLockouts[gateLockoutKey(routeId, index)];
      });
      saveState();
      if (currentRouteId === routeId && (currentView === "gate" || currentView === "lockout")) {
        renderCurrentRouteStep();
      }
      return [...progress.gatesCompleted];
    },
    lockGate(routeId = currentRouteId, gateIndex = currentStageIndex + 1) {
      const route = ROUTES[routeId];
      const index = Math.floor(Number(gateIndex)) - 1;
      if (!route || !route.gates[index]) return false;

      const progress = getRouteProgress(routeId);
      progress.gatesCompleted[index] = false;
      const lockout = registerFailure(gateLockoutKey(routeId, index));
      if (currentRouteId === routeId && currentStageIndex === index) {
        renderRiddleGate();
      }
      return { key: gateLockoutKey(routeId, index), ...lockout };
    },
    unlockGate(routeId = currentRouteId, gateIndex = currentStageIndex + 1) {
      const route = ROUTES[routeId];
      const index = Math.floor(Number(gateIndex)) - 1;
      if (!route || !route.gates[index]) return false;

      const progress = getRouteProgress(routeId);
      progress.gatesCompleted[index] = true;
      delete state.stageLockouts[gateLockoutKey(routeId, index)];
      saveState();
      if (currentRouteId === routeId && currentStageIndex === index && (currentView === "gate" || currentView === "lockout")) {
        renderRiddleGate();
      }
      return [...progress.gatesCompleted];
    },
    showRouteProgress() {
      const snapshot = routeProgressSnapshot();
      console.log("Birthday Quest route progress", snapshot);
      return snapshot;
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
      if (currentView === "gate" || currentLockoutKey === gateLockoutKey(route.id, currentStageIndex)) {
        delete state.stageLockouts[gateLockoutKey(route.id, currentStageIndex)];
        saveState();
        if (currentView !== "gate") renderRiddleGate();
        completeGate(route.id, currentStageIndex);
        return true;
      }
      delete state.stageLockouts[stageLockoutKey(route.id, currentStageIndex)];
      saveState();
      if (currentView !== "stage") renderStage();
      completeStage(route.id, currentStageIndex, stage.rewardFragment);
      return true;
    },
    showState() {
      const snapshot = JSON.parse(JSON.stringify({
        ...state,
        currentRouteId,
        currentStageIndex,
        routeProgress,
        currentFragments,
        currentWords: currentFragments,
        currentView
      }));
      console.log("Birthday Quest state", snapshot);
      return snapshot;
    }
  };
}

updateBadgePanel();
renderHome();
showWelcomePopup();
installDevHelpers();
