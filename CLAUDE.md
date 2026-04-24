# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack & Constraints

Vanilla HTML5, CSS3, and JavaScript only — no build system, no package manager, no test framework. The game runs directly from `index.html` in a browser. Development is done by opening the file locally or serving it via any static server (e.g., `python3 -m http.server`).

Google Fonts may be loaded via CDN. No other external libraries.

## Running & Developing

Open `index.html` directly in a browser, or serve statically:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Dev cheats are active only on `localhost` / `127.0.0.1`:
- `M` — +$100,000
- `J` — max jumps on all active boxes (enables prestige)
- `T` — +10 Prestige Tokens
- `G` — spawn Golden Frenzy runner

## Architecture

### Script load order (matters — no module system)

`index.html` loads scripts in this order, and they share a single global scope:

1. `js/constants.js` — static data and global state definitions (`boxData`, `ghostBoxData`, `talents`, `cardTypes`, `SAVE_KEY`)
2. `js/storage.js` — global runtime vars (`money`, `prestigeTokens`, `cards`, etc.) + `saveGame()` / `loadGame()` / `wipeSave()`
3. `js/game.js` — game loop, `jump()`, prestige/evolve logic, frenzy event
4. `js/ui.js` — `renderLayout()`, `updateUI()`, modals, floating text, particles
5. `js/cards.js` — card draw, equip, upgrade, scrap; `updateCachedMultipliers()`
6. `js/ads.js` — ad integration

### Global state

All game state lives in module-level `let` vars, not in a class or store:

- `money`, `prestigeTokens`, `cardDust`, `cards`, `frenzyTimer`, `hasSeenSynergyTutorial`, `hasSeenCardTutorial` — defined in `storage.js`
- `boxData[]` — 4-element array defined in `constants.js`; each entry holds all per-box state
- `ghostBoxData` — single object for the unlockable Ghost Box
- `talents` — object keyed by talent name, each with `level` / `maxLevel` / `baseCost` / `costMult`

### DOM caching pattern

`renderLayout()` (in `ui.js`) fully reconstructs the stage and upgrade panels, then immediately populates `b.cachedElements` and `ghostBoxData.cachedElements` with references to the freshly created DOM nodes. All subsequent `updateUI()` calls (which run every animation frame) touch only the cached references — never `getElementById` or `querySelector` again. **Any new DOM element that `updateUI()` reads must be added to `cachedElements` inside `renderLayout()`.**

### `renderLayout()` vs `updateUI()`

- `renderLayout()` — expensive full rebuild; call only when the set of visible boxes/columns changes (unlock, prestige, collapse toggle, card equip)
- `updateUI()` — lightweight per-frame diff; uses `lastMoney` as a dirty flag to skip upgrade-button text updates when money hasn't changed

### Value calculation pipeline

For a single box jump, the income formula is:

```
amountEarned = floor(b.inc × prestigeMult × evolutionMult × synergyMultiplier × cardMults.value × talentValueMult)
```

- `prestigeMult` = `1.5 ^ b.prestige`
- `evolutionMult` = `25 ^ b.evolution`
- `cardMults` — pre-cached in `b.cachedMults` by `updateCachedMultipliers(idx)` (in `cards.js`); call this whenever a card is equipped/unequipped/upgraded
- `talentValueMult` = `1 + talents.globalValue.level × 0.15`

### Synergy system

`activeJumps` is a rolling buffer (max 20 entries) of recent jumps with timestamps. When `jump(idx)` fires it searches this buffer for adjacent-index jumps within `synergyWindow` ms (base 50ms, +25ms per `talents.synergy` level). A synergy awards `2 + cardMults.synergyBonus` multiplier to the triggering box and a retroactive bonus to the earlier box.

Ghost Box synergy with Box 1 works the same way but has a separate `lastSynergyTime` cooldown (starts at 5000ms, reduced by `talents.synergy`).

### Prestige & Evolution

Each box has an independent jump counter. The prestige target for prestige level `p` is `floor(1000 × 1.1^p)`. Hitting the target shows "PRESTIGE READY"; confirming resets `inc`, `incCost`, `dur`, `durCost` (and auto unless `talents.autoSave` is purchased), and awards +1 Prestige Token. At 10 prestiges the box can **Evolve** (resets prestige to 0, increments `b.evolution`, multiplies income by 25×).

### Cards

Cards have `rarity` (common/rare/epic), `type` (value/speed/auto/synergy), `value` (numeric stat), and `level` (upgradeable with Dust). One card can be equipped per box. The bonus is applied only through `b.cachedMults`; always call `updateCachedMultipliers(idx)` after any card change. Scrapping a card yields Dust (10/30/100 by rarity).

Card pack cost starts at $1,000 and multiplies by 1.5× per card owned; `talents.cheapCards` discounts the displayed cost (not the base cost).

### Persistence

`saveGame()` (in `storage.js`) serialises all state to `localStorage` key `boxSynergySave`. Auto-save runs every 10 seconds and on `beforeunload`. `wipeSave()` removes the key and reloads the page; it sets `isWiping = true` first to prevent the beforeunload handler from re-saving.

## Style Rules

- CSS variables are defined in `:root` in `css/style.css`. Always use them for colors; maintain the "Deep Dark Blue" aesthetic.
- JavaScript: `camelCase`. CSS classes: `kebab-case`.
- Keep `gameLoop` lean — avoid allocations, DOM queries, or layout-triggering operations inside it.

## Token-Efficiency Practices

- Target specific functions with `grep` before reading whole files.
- Use Edit (surgical replace) rather than rewriting entire files — the JS files are large.
- Only read the file(s) relevant to the task: a synergy bug lives in `game.js`; a card UI bug in `cards.js` or `ui.js`; balance numbers in `constants.js`.
- State one-sentence plan before editing; verify no syntax errors after.
