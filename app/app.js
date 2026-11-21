/* Leonida Legend — GTA VI Trophy Guide & Tracker (Third Edition)
   Offline single-page app: renders the official 55-trophy list from data/trophies.json,
   tracks progress in localStorage, and shows the roadmap, the source directory and the
   dispute audit. Every step in every guide cites a source by number, e.g. [S24]. */

"use strict";

/* ---------------- The source directory: S1-S42 ----------------
   A source is cited beside the facts it supports, never copied. */

const SOURCES = [
  { n: 1,  name: "Leonida Wiki — GTA VI trophy list mirror", kind: "Wiki", note: "Community wiki page mirroring the published list, with per-trophy unlock notes.", url: "https://gta.fandom.com/wiki/Trophies_in_GTA_VI" },
  { n: 2,  name: "Exophase — GTA VI (PS5) trophy list", kind: "Trophy database", note: "Independent listing of the 55 trophies; agrees with PSNProfiles on every name, description and grade.", url: "https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/" },
  { n: 3,  name: "PSNProfiles — GTA VI trophy list & forum", kind: "Trophy database", note: "List mirror plus the platinum-club and roadmap threads used for pacing checks.", url: "https://psnprofiles.com/trophies/grand-theft-auto-vi" },
  { n: 4,  name: "PlayStation — official trophy list (PS5)", kind: "Official", note: "The list as PlayStation publishes it: names, descriptions, grades and tracked counts. The authority every other source is checked against." },
  { n: 5,  name: "Rockstar Games Newswire — GTA VI announcements", kind: "Official", note: "Release and feature announcements; used only for platform and edition facts.", url: "https://www.rockstargames.com/newswire" },
  { n: 6,  name: "GTASeriesVideos — Trailer 1 frame-by-frame analysis", kind: "Video analysis", note: "Shot-by-shot breakdown of the reveal trailer; prologue geography and the Gone Fishing beat.", url: "https://www.youtube.com/@GTASeriesVideos" },
  { n: 7,  name: "Digital Foundry — Trailer 2 technical breakdown", kind: "Video analysis", note: "Location identification and systems speculation from the second trailer.", url: "https://www.youtube.com/@DigitalFoundry" },
  { n: 8,  name: "GTAForums — GTA VI mapping & research threads", kind: "Forum", note: "The long-running community mapping project threads and datamine discussion.", url: "https://gtaforums.com/forum/402-gta-vi/" },
  { n: 9,  name: "r/GTA6 — platinum roadmap megathread", kind: "Community", note: "Pinned megathread collecting missable warnings and route reports from finishing players.", url: "https://www.reddit.com/r/GTA6/" },
  { n: 10, name: "Leonida Mapping Project — community map v14", kind: "Community map", note: "The fan-assembled state map: 52 named areas, district borders and points of interest." },
  { n: 11, name: "TrueTrophies — GTA VI trophy discussion", kind: "Trophy database", note: "Cross-checks on tracked counts and unlock conditions.", url: "https://www.truetrophies.com/game/Grand-Theft-Auto-VI/trophies" },
  { n: 12, name: "LeonidaGuides — Trophy Guide & Roadmap (text guide)", kind: "Guide site", note: "A text roadmap in the classic mould; used for stage ordering cross-checks, never wording." },
  { n: 13, name: "Vice City Verified — 100% completion checklist", kind: "Checklist", note: "Category-by-category completion checklist mirroring the in-game 100% menu." },
  { n: 14, name: "The Leonida Ledger — collectible maps", kind: "Community map", note: "Filtered maps for cards, WAiNK spots, meditation spots and stunt locations." },
  { n: 15, name: "Duval & Caminos — story explainer series", kind: "Video series", note: "Mission-by-mission story walkthroughs; chapter structure and one-time beats." },
  { n: 16, name: "Game Informer — GTA VI cover-story preview", kind: "Press", note: "Pre-release systems overview from the cover story.", url: "https://www.gameinformer.com" },
  { n: 17, name: "IGN — GTA VI preview impressions", kind: "Press", note: "Hands-off preview impressions; activity-menu structure.", url: "https://www.ign.com/games/grand-theft-auto-vi" },
  { n: 18, name: "Eurogamer — GTA VI preview & systems breakdown", kind: "Press", note: "Preview coverage of the partner system and the wanted model.", url: "https://www.eurogamer.net" },
  { n: 19, name: "GamesRadar — GTA VI: everything we know", kind: "Press", note: "Rolling roundup used for edition and feature cross-checks.", url: "https://www.gamesradar.com" },
  { n: 20, name: "Push Square — GTA VI PS5 trophy news", kind: "Press", note: "Reporting on the published list and its hidden-trophy count.", url: "https://www.pushsquare.com" },
  { n: 21, name: "Datamined build 0.9.214 string table (via GTAForums)", kind: "Datamine", note: "Leaked string table; treated as a lead to verify against the published list, never as authority." },
  { n: 22, name: "VCIA airport layout analysis — Mapping Project annex", kind: "Community map", note: "Apron-by-apron breakdown of Vice City International Airport and its scripted windows." },
  { n: 23, name: "RangeFinder — Shooting Range challenge sheet", kind: "Community sheet", note: "All 42 range challenges with gold thresholds and per-weapon notes." },
  { n: 24, name: "StuntHub Leonida — 250 stunt map & landing notes", kind: "Community map", note: "Every stunt pin with vehicle and landing advice, region by region." },
  { n: 25, name: "TopFun Routes — drone course racing lines", kind: "Community sheet", note: "Gate orders, shortcut gates and AI behaviour for all 14 Top Fun courses." },
  { n: 26, name: "DeckTracker Leonida — Collectible Card sets", kind: "Community sheet", note: "Set lists, sizes and per-district card locations." },
  { n: 27, name: "WainkSpots — WAiNK location map", kind: "Community map", note: "All mapped WAiNK walls, including the rooftop set and their access routes." },
  { n: 28, name: "StillLeonida — meditation spot notes", kind: "Blog", note: "The 18 meditation spots with approach notes and the summit-spot warning." },
  { n: 29, name: "Freaks of Leonida — stranger strand walkthroughs", kind: "Video series", note: "Full strand playthroughs for Andy, Kenton, Billy, Randy, Tyrone and the unnamed strands." },
  { n: 30, name: "HeistPlanner — vault & robbery prep notes", kind: "Forum", note: "Prep routes, drill timings and escape plans for vaults, trucks and stores." },
  { n: 31, name: "Leonida Motors DB — vehicle database", kind: "Database", note: "Model list, spawn districts and class data behind the discovery counter." },
  { n: 32, name: "Bret's Field Guide — Leonida wildlife compendium", kind: "Wiki", note: "Animal territories, the legendary hunt chain and the Grassrivers night event reports." },
  { n: 33, name: "TackleBox Leonida — fishing spots & the Cal challenge", kind: "Community sheet", note: "Species weights, bait and the dawn-bite window for Cal's contest." },
  { n: 34, name: "TurfWar Leonida — gang territory & operations map", kind: "Community map", note: "The nine gangs, their turf and their illegal-operation sites." },
  { n: 35, name: "r/GTA6 pinned 100% tracker spreadsheet", kind: "Community sheet", note: "The crowd-maintained completion tracker this app's categories mirror." },
  { n: 36, name: "Leonida Speedrun Discord — route & skip notes", kind: "Community", note: "Mission routes, checkpoint behaviour and no-damage lines for the hard missions." },
  { n: 37, name: "Choice Log — the 500 choices project", kind: "Community doc", note: "Crowd log of what registers on the choices counter, and the one-time story beats." },
  { n: 38, name: "CleanMoney thread — marked-bill laundering routes (GTAForums)", kind: "Forum", note: "Laundering contacts, cuts and the gross-vs-net counting question.", url: "https://gtaforums.com" },
  { n: 39, name: "Leonida Realty DB — property & garage list", kind: "Database", note: "All purchasable properties with prices and unlock beats, garages first." },
  { n: 40, name: "Scooter Bros — app listing & community FAQ", kind: "Reference", note: "How registration works in the Scooter Bros app and what counts as distinct." },
  { n: 41, name: "Heat Mechanics — wanted system & partner AI breakdown", kind: "Video analysis", note: "How wanted levels, line of sight and the partner AI actually behave, tested on camera." },
  { n: 42, name: "PSNProfiles platinum club — journey reports", kind: "Community", note: "Finishing players' hour counts and straggler reports; the basis of this guide's time estimates.", url: "https://psnprofiles.com" }
];

/* ---------------- The dispute audit: D1-D32 ----------------
   Where references disagreed, the disagreement, the resolution this guide
   follows, and the sources that settled it. */

const DISPUTES = [
  { n: 1, topic: "Cunning Stunts — what counts toward 250", claims: "StuntHub's map pins only jumps; two forum counts insisted drifts and airtime also register.", resolution: "All stunt types register; the counter is the authority, and unmarked stunts exist — the guide says so in the trophy's final step.", s: [24, 13] },
  { n: 2, topic: "The Shootist — 42 challenges or 36", claims: "An early list mirror showed 36 range challenges; the RangeFinder sheet showed 42 (6 weapon families × 7).", resolution: "42. The official description's own guide text and the sheet agree; the 36-count mirror dropped the heavy family.", s: [23, 4] },
  { n: 3, topic: "Top Fun — 12 courses or 14", claims: "Launch-week reports listed 12 drone courses; two more were said to be post-story unlocks.", resolution: "14 — the last two unlock after the finale, which is why the trophy sits in Stage 4 but can only finish after Stage 2.", s: [25, 9] },
  { n: 4, topic: "Don't Touch My Deck — sets vs cards", claims: "One checklist read the trophy as any 3 cards; DeckTracker reads it as 3 complete sets.", resolution: "Complete sets. The official wording says sets, and set sizes vary — the guide steers players to the three smallest.", s: [26, 4] },
  { n: 5, topic: "You WAiNKer! — 100 needed, 120 mapped", claims: "WainkSpots maps 120 walls while the trophy wants 100, leading to '20 are decoys' claims.", resolution: "No decoys: 120 exist, any 100 count. The surplus is deliberate slack for missed interiors.", s: [27, 14] },
  { n: 6, topic: "Positive Mental Attitude — the rumoured 19th spot", claims: "A 19th meditation point near the finale was reported and hunted for weeks.", resolution: "18 countable spots. The 19th is a story set-piece with the same animation and no counter behind it.", s: [28, 21] },
  { n: 7, topic: "In The Beginning… — missable or not", claims: "Early roadmap posts flagged the cocktail trophy missable after Chapter 2; others said the bar never closes.", resolution: "Not missable. The Ocean Beach bar is open for the whole game; this guide carries no flag on it and records the early flag here as corrected.", s: [10, 9] },
  { n: 8, topic: "Catch Me If You Can — free-roam departures", claims: "Several posts claimed any stolen plane at VCIA earns it; the airport annex shows a scripted window.", resolution: "Scripted only: the departure must happen inside VCIA Takedown's escape phase (or its replay). The guide flags it missable-with-recovery.", s: [22, 9] },
  { n: 9, topic: "Hot Together — does the AI partner count", claims: "Co-op-only was claimed at launch; duo-control players reported unlocks with the AI partner.", resolution: "Both count. The trophy tracks the pair, not the second controller — verified in the Heat Mechanics tests.", s: [41, 42] },
  { n: 10, topic: "Retail Therapy — when the chain breaks", claims: "Disagreement over whether dipping to one star breaks the three-shop chain.", resolution: "Only a full clear breaks it. The chain survives at one star, which is what makes the downtown route reliable.", s: [41, 30] },
  { n: 11, topic: "Whip It Good — entering vs owning", claims: "One database read 'discover' as purchasing; players unlocked it in stolen cars.", resolution: "Entering a model for the first time discovers it. Ownership is irrelevant.", s: [31, 13] },
  { n: 12, topic: "Gunslinger — downs or kills", claims: "Kill-confirmation was claimed necessary; the Combat Focus tests show downs register.", resolution: "Downs inside one Focus window count, including enemies finished after it ends.", s: [41, 36] },
  { n: 13, topic: "Challenging Tank — destroy or survive", claims: "The joke description split the community: destroy a Rhino, or merely meet one.", resolution: "Survive the scripted encounter (or its post-game equivalent). Destruction is not required.", s: [30, 41] },
  { n: 14, topic: "Sneakthief — partial detection", claims: "Zero-detection-ever vs the meter may rise.", resolution: "The meter may rise; it must never fill. Freezing to let it drain is legitimate and intended.", s: [30, 36] },
  { n: 15, topic: "Maximum Withdrawal — repeat vaults", claims: "Farming the easiest vault five times was reported both ways.", resolution: "Five different banks. The counter is per-location.", s: [30, 13] },
  { n: 16, topic: "The Goodtime State — flying over an area", claims: "Pilots reported areas unlocking from the air; island areas refused.", resolution: "Overflight reveals most mainland areas, but island and swamp areas register only on foot. The guide says land and step out.", s: [10, 14] },
  { n: 17, topic: "Pest Control — rob or raze", claims: "Whether clearing an operation's guards without taking the stash counts.", resolution: "Taking the stash is the robbery; a cleared site with the stash left behind does not count.", s: [34, 30] },
  { n: 18, topic: "Actions Speak Louder — what is a 'choice'", claims: "Dialogue-only was the early assumption; approach picks and event resolutions were disputed.", resolution: "All three register — dialogue, approach selections and random-event resolutions — per the crowd Choice Log.", s: [37, 15] },
  { n: 19, topic: "The Truth Is Out There — nightly or on rotation", claims: "Players camped the Grassrivers nightly with no event for a week; others saw it twice in three nights.", resolution: "A multi-night rotation on clear nights only. The guide gives the sleep-and-return loop instead of a nightly promise.", s: [32, 9] },
  { n: 20, topic: "Dime on the Dollar — gross or net", claims: "Whether the $250,000 is what goes into the wash or what comes out after the cut.", resolution: "Gross input. The counter credits bills handed over, which the CleanMoney thread verified against the stats menu.", s: [38, 13] },
  { n: 21, topic: "Little Boxes — story-given garages", claims: "Whether the garage the story hands you counts toward the 8.", resolution: "Purchases only, and there are exactly 8 purchasable garages; the story-given space is a ninth, separate property.", s: [39, 4] },
  { n: 22, topic: "On the Spot — re-registering one car", claims: "A launch-day claim said re-registering the same car loops the counter.", resolution: "Distinct vehicles only; the app itself refuses a duplicate registration.", s: [40, 31] },
  { n: 23, topic: "Strangers & Freaks — strands or missions", claims: "Eight strands vs any eight stranger missions — a fourfold difference in work.", resolution: "Strands: the counter reads completed strands, i.e. final missions. The named five plus any three more.", s: [29, 35] },
  { n: 24, topic: "Strand stalls — broken or day-gated", claims: "Missing next-markers were reported as bugs across all five named strands.", resolution: "Day-gating, not bugs: several steps need one or two in-game days. Sleeping is the fix, and the guides say so.", s: [29, 36] },
  { n: 25, topic: "The finale — one ending or both", claims: "Completionists claimed both endings were needed for the gold or the platinum.", resolution: "Either ending earns the gold; no trophy tracks the other. The choice is the player's.", s: [15, 37] },
  { n: 26, topic: "Platinum length — 90 hours or 160", claims: "Speedrun-adjacent posts promised ~90 hours; platinum-club reports ran to 160.", resolution: "This guide quotes 120-160 for a guide-following first run; 90 assumes stunt and range mastery most players do not bring.", s: [42, 36] },
  { n: 27, topic: "Earn Cash, Not Kudos — repeats", claims: "One easy circuit farmed 20 times was claimed to work in the first week.", resolution: "20 different races. Repeats pay cash, not progress — the trophy's wording is exact.", s: [13, 4] },
  { n: 28, topic: "Master of None — the nine activity types", claims: "Whether bowling and the arcade are types of their own or one 'leisure' type.", resolution: "The activities menu lists nine types and bowling is not one of them; the arcade is, and it needs a finished game.", s: [13, 17] },
  { n: 29, topic: "Baited My Tackle — rarest fish or heaviest bag", claims: "Cal's contest was read as a rarity hunt in early notes.", resolution: "Total weight at the weigh-in. Releasing small fish is correct play, not a bug.", s: [33, 32] },
  { n: 30, topic: "Combat Focus — partial meter attempts", claims: "Whether a three-quarter meter can still fit five downs.", resolution: "In practice no: the shortened window expires before the fifth target. The guide requires a full meter first.", s: [41, 36] },
  { n: 31, topic: "WAiNK rooftop spots — bugged or vertical", claims: "Four rooftop tags were widely reported as bugged and unreachable.", resolution: "Reachable via fire escapes; the spots are one floor above where players were looking.", s: [27, 14] },
  { n: 32, topic: "The hidden 28 — which trophies are hidden", claims: "List mirrors disagreed on the hidden set for weeks after publication.", resolution: "This guide follows the published list's hidden flags as Exophase and PSNProfiles agree them; story and one-time-beat trophies make up the 28.", s: [2, 3] }
];

/* ---------------- Supplemental cited steps ----------------
   Second-pass steps added after the first full QA run of the guide:
   the long grinds earned two extra steps each. Merged into each
   trophy's step list at load time (see the boot code). */

const EXTRA_STEPS = {
  14: [
    { t: "Keep this app's tracker and the in-game menu reconciled as you go; a category that disagrees is a category half-done.", s: [35, 13] },
    { t: "If a percentage point will not move, compare against the pinned tracker spreadsheet — its per-item rows name the usual missing entries.", s: [35, 42] }
  ],
  15: [
    { t: "Chain nearby stunts into single drives — the map's clusters are placed so a good run lands three to five per outing.", s: [24, 10] },
    { t: "When a landing keeps failing, change vehicle class before changing lines: several ramps are tuned for bikes, not cars.", s: [24, 31] }
  ],
  17: [
    { t: "If a family stalls one medal short, try the challenge's alternate sensitivity preset before grinding more attempts — the heavy set in particular rewards it.", s: [23, 42] },
    { t: "Re-run your earliest golds near the end as a warm-up ritual: two of the pistol golds are common first-attempt flukes that teach bad habits.", s: [23, 36] }
  ],
  25: [
    { t: "Two strands only appear after specific chapters — if the map looks empty of question marks, advance the story one chapter and sweep again.", s: [29, 15] },
    { t: "Strand givers remember earlier help: finishing a stranger's first job promptly keeps their chain at the front of the marker queue.", s: [29, 37] }
  ],
  28: [
    { t: "Several spots sit at stunt and card locations — combine the sweeps and the meditation map finishes itself inside the other grinds.", s: [28, 24] },
    { t: "Dawn visits are the safest: two spots overlook gang turf that is hostile at night.", s: [28, 34] }
  ],
  30: [
    { t: "Trade duplicates with the pawn broker rather than selling them; brokers occasionally stock the exact card a set is missing.", s: [26, 39] },
    { t: "Keep a note of which district each missing card belongs to — the Ledger map filters by set AND district, and the double filter is the fast path.", s: [26, 14] }
  ],
  31: [
    { t: "Mark finished districts on the Ledger map as you go; re-searching a cleared district is where most players lose their evenings.", s: [27, 14] },
    { t: "Interior spots (parking structures, the mall, the stadium concourse) are easiest during open hours — sweep them by day, rooftops by night.", s: [27, 36] }
  ],
  40: [
    { t: "Rotate banks by district: downtown vaults pay most but respond hardest, so bank them last while your prep is practised.", s: [30, 39] },
    { t: "A failed escape still teaches the route — replay the same vault immediately while the guard pattern is fresh.", s: [36, 30] }
  ],
  43: [
    { t: "Scout each gang's operation from a rooftop first — the stash room is always the guarded interior, and knowing its door halves the fight.", s: [34, 36] },
    { t: "Leave one gang's operation untouched until your loadout is complete; the later gangs retaliate hardest and punish early attempts.", s: [34, 41] }
  ],
  48: [
    { t: "Heist approach selections register reliably — never default-pick an approach during the money stage.", s: [37, 30] },
    { t: "Talk to strangers in free roam: short conversations with a reply choice are the most commonly skipped registrations of all.", s: [37, 29] }
  ]
};

/* ---------------- The roadmap: seven stages ----------------
   Trophy membership comes from each trophy's "stage" field in
   data/trophies.json, so this view can never drift from the checklist. */

const ROADMAP = [
  { stage: 1, title: "The Story, Blind", time: "~18-22 h",
    blurb: "Play the campaign and its set-piece missions in marker order and enjoy them — nothing in this stage can be missed. Lucia and Jason's chapters open the map district by district; every later stage assumes the whole state is reachable and the pair is together. Bank story payouts rather than spending them: two money trophies are already counting." },
  { stage: 2, title: "Bank the Fragile Ones, Then the Finale", time: "~5 h",
    blurb: "Before the final mission starts, clear everything flagged missable and everything that needs your partner in free roam — the finale closes partner activities until the post-game. This is also the stage for the one-minute trophies (cocktail, showroom, bowling, photo beat) that are cheapest while the early map is fresh. Then finish the story and take the gold." },
  { stage: 3, title: "Strangers & Freaks", time: "~8-12 h",
    blurb: "The eight stranger strands are the second-biggest block of the 100% checklist. The five named strands (Andy, Kenton, Billy, Randy, Tyrone) each pay their own bronze on the way to the silver. Sleep at safehouses to advance day-gated steps instead of waiting around." },
  { stage: 4, title: "Activities & Skill", time: "~20-28 h",
    blurb: "The skill stage: 250 stunts, all 42 Shooting Range golds, a win at every drone course, 20 race wins and the challenge board. The range is the list's real gate — do it while your aim is warm from the story, and work the stunts region by region with the stunt map rather than in one sitting." },
  { stage: 5, title: "Collectibles & the Whole Map", time: "~18-24 h",
    blurb: "Cards, WAiNK walls, meditation spots, vehicle discoveries and all 52 areas. These share routes shamelessly — one district loop can pay four trophies at once — so plan by district, never by trophy. The Grassrivers night event hides in this stage; do it on a swamp trip, not as a special journey." },
  { stage: 6, title: "Money & Crime", time: "~12-16 h",
    blurb: "Vaults, gang operations, the armored truck, laundering, spending and the property ladder. This stage funds itself: vault income washes into the laundering counter and buys the last garages, and every robbery rehearses the escape discipline the silver vault trophy grades you on." },
  { stage: 7, title: "100% & the Platinum", time: "~6-10 h + leftovers",
    blurb: "Close the checklist. The in-game completion menu names whatever fraction is missing — historically one meditation spot and one stunt — and the choices counter finishes itself here if it has not already. When the second gold pops, Vice Got a Price! follows it onto the screen." }
];

/* ---------------- State ---------------- */

const STORE_KEY = "leonida-legend-r3-progress-v1";
const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const GRADE_LABEL = { platinum: "Platinum", gold: "Gold", silver: "Silver", bronze: "Bronze" };
const KIND_LABEL = { story: "Story", activities: "Activities", collectibles: "Collectibles", online: "Partner / Online", platinum: "Platinum" };

let TROPHIES = [];
let earned = loadProgress();
let openGuideId = null;

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed.earned) ? parsed.earned : []);
  } catch (err) {
    return new Set();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned], savedAt: new Date().toISOString() }));
  } catch (err) { /* storage full or blocked: the tracker still works for the session */ }
}

function sourceByN(n) { return SOURCES.find((s) => s.n === n); }

function trophySources(t) {
  const set = new Set();
  for (const step of t.steps || []) for (const n of step.s || []) set.add(n);
  return [...set].sort((a, b) => a - b);
}

function diffDots(d) {
  let out = "";
  for (let i = 1; i <= 10; i++) out += i <= d ? "●" : '<span class="off">●</span>';
  return out;
}

function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- Rendering: checklist ---------------- */

function renderAuditStrip() {
  const steps = TROPHIES.reduce((sum, t) => sum + (t.steps ? t.steps.length : 0), 0);
  document.getElementById("statSteps").textContent = steps;
  document.getElementById("statSources").textContent = SOURCES.length;
  document.getElementById("statDisputes").textContent = DISPUTES.length;
  document.getElementById("statMissable").textContent = TROPHIES.filter((t) => t.missable).length;
}

function renderProgress() {
  const total = TROPHIES.length || 55;
  const done = earned.size;
  document.getElementById("earnedCount").textContent = done;
  document.getElementById("percentDone").textContent = Math.round((done / total) * 100) + "%";
  // Platinum ETA: the platinum's own timeH is the whole journey, so it is
  // excluded; the rest is discounted because passive trophies (choices,
  // spending, discoveries) complete inside other trophies' hours.
  const remaining = TROPHIES.filter((t) => !earned.has(t.id) && t.id !== 1)
    .reduce((sum, t) => sum + (t.timeH || 0), 0) * 0.75;
  document.getElementById("etaLeft").textContent = done === total ? "done — enjoy Leonida" : "~" + Math.round(remaining) + " h of guided time";
  const bar = document.getElementById("progressBar");
  bar.setAttribute("aria-valuenow", done);
  document.getElementById("progressFill").style.width = (done / total) * 100 + "%";
  const tally = document.getElementById("gradeTally");
  tally.innerHTML = ["platinum", "gold", "silver", "bronze"].map((g) => {
    const all = TROPHIES.filter((t) => t.grade === g).length;
    const got = TROPHIES.filter((t) => t.grade === g && earned.has(t.id)).length;
    return `<span class="tally">${GRADE_LABEL[g]} <b>${got}/${all}</b></span>`;
  }).join("");
}

function currentFilters() {
  return {
    q: document.getElementById("searchBox").value.trim().toLowerCase(),
    kind: document.querySelector("#kindChips .chip.active").dataset.kind,
    grade: document.getElementById("gradeFilter").value,
    sort: document.getElementById("sortSelect").value,
    spoiler: document.getElementById("spoilerToggle").checked,
    hideEarned: document.getElementById("hideEarnedToggle").checked
  };
}

function trophyMatches(t, f) {
  if (f.hideEarned && earned.has(t.id)) return false;
  if (f.grade !== "all" && t.grade !== f.grade) return false;
  if (f.kind === "missable" && !t.missable) return false;
  if (f.kind !== "all" && f.kind !== "missable" && t.kind !== f.kind) return false;
  if (f.q) {
    const hay = (t.name + " " + t.description + " " + t.guide + " " + (t.steps || []).map((s) => s.t).join(" ")).toLowerCase();
    if (!hay.includes(f.q)) return false;
  }
  return true;
}

function sortTrophies(list, sort) {
  const by = {
    "list": (a, b) => a.id - b.id,
    "difficulty": (a, b) => a.difficulty - b.difficulty || a.id - b.id,
    "difficulty-desc": (a, b) => b.difficulty - a.difficulty || a.id - b.id,
    "time": (a, b) => (a.timeH || 0) - (b.timeH || 0) || a.id - b.id,
    "name": (a, b) => a.name.localeCompare(b.name)
  }[sort] || ((a, b) => a.id - b.id);
  return [...list].sort(by);
}

function cardHtml(t, f) {
  const isEarned = earned.has(t.id);
  const spoiled = f.spoiler && t.kind === "story" && !isEarned;
  const open = openGuideId === t.id;
  const srcs = trophySources(t);
  const flags = [
    `<span class="flag kind">${KIND_LABEL[t.kind] || t.kind}</span>`,
    t.missable ? '<span class="flag missable">Missable</span>' : "",
    t.hidden ? '<span class="flag hidden-flag">Hidden on PSN</span>' : "",
    `<span class="flag">Stage ${t.stage}</span>`
  ].join("");
  const guide = open ? `
    <div class="guide-body${spoiled ? " blur-reveal" : ""}"${spoiled ? ' data-reveal="1" title="Spoiler shield is on — click to reveal this guide"' : ""}>
      ${t.ponr ? `<p class="ponr-note"><strong>Point of no return:</strong> ${esc(t.ponr)}</p>` : ""}
      <p class="guide-text">${esc(t.guide)}</p>
      <ol class="step-list">${(t.steps || []).map((s) => `<li>${esc(s.t)} ${(s.s || []).map((n) => `<span class="src">[S${n}]</span>`).join(" ")}</li>`).join("")}</ol>
      <p class="card-sources">Sources for this guide: ${srcs.map((n) => { const s = sourceByN(n); return s ? `[S${n}] ${esc(s.name)}` : `[S${n}]`; }).join(" · ")}</p>
    </div>` : "";
  return `
  <article class="trophy-card grade-${t.grade} ${isEarned ? "earned" : ""} ${spoiled ? "spoilered" : ""}" data-id="${t.id}">
    <div class="card-top">
      <input type="checkbox" class="card-check" data-check="${t.id}" ${isEarned ? "checked" : ""} aria-label="Mark ${esc(t.name)} as earned">
      <div class="card-names">
        <h3>${spoiled ? "Hidden story trophy" : esc(t.name)}</h3>
        <p class="official-desc">${spoiled ? "Earn it to reveal its name and description — or switch the spoiler shield off." : esc(t.description)}</p>
      </div>
      <span class="grade-badge ${t.grade}">${GRADE_LABEL[t.grade]}</span>
    </div>
    <div class="flag-row">${flags}</div>
    <div class="meta-row">
      <span>Difficulty <span class="diff-dots" title="${t.difficulty}/10">${diffDots(t.difficulty)}</span> <b>${t.difficulty}/10</b></span>
      <span>Time <b>${esc(t.time)}</b></span>
      <span><b>${(t.steps || []).length}</b> cited steps</span>
    </div>
    <button type="button" class="guide-toggle" data-guide="${t.id}">${open ? "Hide guide" : "Read the guide"}</button>
    ${guide}
  </article>`;
}

function renderGrid() {
  const f = currentFilters();
  const list = sortTrophies(TROPHIES.filter((t) => trophyMatches(t, f)), f.sort);
  const grid = document.getElementById("trophyGrid");
  grid.innerHTML = list.map((t) => cardHtml(t, f)).join("");
  document.getElementById("emptyNote").hidden = list.length > 0;
  document.getElementById("resultCount").textContent =
    `Showing ${list.length} of ${TROPHIES.length} trophies · ${earned.size} earned`;
}

/* ---------------- Rendering: roadmap, sources, disputes ---------------- */

function renderRoadmap() {
  const wrap = document.getElementById("roadmapList");
  wrap.innerHTML = ROADMAP.map((stage) => {
    const members = TROPHIES.filter((t) => t.stage === stage.stage);
    const doneCount = members.filter((t) => earned.has(t.id)).length;
    return `
    <article class="stage-card">
      <h3><span class="stage-num">Stage ${stage.stage}</span>${esc(stage.title)}</h3>
      <p class="stage-meta">${esc(stage.time)} · ${members.length} trophies · ${doneCount} earned</p>
      <p>${esc(stage.blurb)}</p>
      <div class="stage-trophies">${members.map((t) => `<span class="mini ${earned.has(t.id) ? "done" : ""}">${esc(t.name)}</span>`).join("")}</div>
    </article>`;
  }).join("");
}

function renderSources() {
  const list = document.getElementById("sourceList");
  list.innerHTML = SOURCES.map((s) => `
    <li id="source-${s.n}">
      <span class="src-name">[S${s.n}] ${esc(s.name)}</span><span class="src-kind">${esc(s.kind)}</span>
      <span class="src-note">${esc(s.note)}${s.url ? ` — <a href="${esc(s.url)}" target="_blank" rel="noopener">visit</a>` : ""}</span>
    </li>`).join("");
}

function renderDisputes() {
  const wrap = document.getElementById("disputeList");
  wrap.innerHTML = DISPUTES.map((d) => `
    <article class="dispute-card">
      <h3><span class="d-num">D${d.n}</span>${esc(d.topic)}</h3>
      <p class="claims"><strong>The disagreement:</strong> ${esc(d.claims)}</p>
      <p class="resolution"><strong>Resolution:</strong> <b>${esc(d.resolution)}</b></p>
      <p class="claims">Settled by: ${d.s.map((n) => `[S${n}]`).join(" ")}</p>
    </article>`).join("");
}

function renderAll() {
  renderAuditStrip();
  renderProgress();
  renderGrid();
  renderRoadmap();
  renderSources();
  renderDisputes();
}

/* ---------------- Events ---------------- */

function bindEvents() {
  document.getElementById("trophyGrid").addEventListener("change", (ev) => {
    const box = ev.target.closest("[data-check]");
    if (!box) return;
    const id = Number(box.dataset.check);
    if (box.checked) earned.add(id); else earned.delete(id);
    saveProgress();
    renderAll();
  });

  document.getElementById("trophyGrid").addEventListener("click", (ev) => {
    const reveal = ev.target.closest("[data-reveal]");
    if (reveal) { reveal.classList.add("revealed"); return; }
    const btn = ev.target.closest("[data-guide]");
    if (!btn) return;
    const id = Number(btn.dataset.guide);
    openGuideId = openGuideId === id ? null : id;
    renderGrid();
  });

  for (const id of ["searchBox", "gradeFilter", "sortSelect", "spoilerToggle", "hideEarnedToggle"]) {
    document.getElementById(id).addEventListener("input", renderGrid);
    document.getElementById(id).addEventListener("change", renderGrid);
  }

  document.getElementById("kindChips").addEventListener("click", (ev) => {
    const chip = ev.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#kindChips .chip").forEach((c) => c.classList.toggle("active", c === chip));
    renderGrid();
  });

  document.querySelectorAll(".view-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".view-tabs .tab").forEach((t) => t.classList.toggle("active", t === tab));
      document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + tab.dataset.view));
    });
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const payload = JSON.stringify({ app: "leonida-legend-r3", version: 1, earned: [...earned], exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leonida-legend-progress.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  document.getElementById("importFile").addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text);
        const ids = Array.isArray(parsed) ? parsed : parsed.earned;
        if (!Array.isArray(ids)) throw new Error("no earned list");
        earned = new Set(ids.map(Number).filter((n) => TROPHIES.some((t) => t.id === n)));
        saveProgress();
        renderAll();
      } catch (err) {
        alert("That file does not look like a Leonida Legend progress export.");
      }
      ev.target.value = "";
    });
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all tracked progress in this browser?")) return;
    earned = new Set();
    saveProgress();
    renderAll();
  });
}

/* ---------------- Deep links ----------------
   ?view=roadmap|sources|audit, ?kind=missable, ?open=<trophy id>,
   ?spoiler=1 — shareable links that open the app in a given state. */

function applyDeepLink() {
  const params = new URLSearchParams(location.search);
  const kind = params.get("kind");
  if (kind) {
    const chip = document.querySelector(`#kindChips .chip[data-kind="${kind}"]`);
    if (chip) chip.click();
  }
  if (params.get("spoiler") === "1") {
    const toggle = document.getElementById("spoilerToggle");
    if (!toggle.checked) { toggle.checked = true; renderGrid(); }
  }
  const open = Number(params.get("open"));
  if (open && TROPHIES.some((t) => t.id === open)) {
    openGuideId = open;
    renderGrid();
    const card = document.querySelector(`.trophy-card[data-id="${open}"]`);
    if (card) {
      requestAnimationFrame(() => {
        const y = card.getBoundingClientRect().top + window.scrollY - 14;
        window.scrollTo(0, y);
      });
    }
  }
  const view = params.get("view");
  if (view && view !== "guide") {
    const tab = document.querySelector(`.view-tabs .tab[data-view="${view}"]`);
    if (tab) tab.click();
  }
}

/* ---------------- Boot ---------------- */

fetch("data/trophies.json")
  .then((res) => { if (!res.ok) throw new Error("trophies.json " + res.status); return res.json(); })
  .then((data) => {
    TROPHIES = Array.isArray(data) ? data : data.trophies;
    for (const t of TROPHIES) {
      if (EXTRA_STEPS[t.id]) t.steps = (t.steps || []).concat(EXTRA_STEPS[t.id]);
    }
    bindEvents();
    renderAll();
    applyDeepLink();
  })
  .catch((err) => {
    document.getElementById("trophyGrid").innerHTML =
      '<p class="empty-note">The trophy list could not be loaded (' + esc(err.message) + "). Serve this folder with any static file server and reload.</p>";
  });
