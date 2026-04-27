# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack & Constraints

Vanilla HTML5, CSS3, and JavaScript only — no build system, no package manager, no test framework. The game runs directly from `index.html` in a browser. Development is done by opening the file locally or serving it via any static server (e.g., `python3 -m http.server`).

Google Fonts may be loaded via CDN. No other external libraries.

## Running & Developing

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Dev cheats are active only on `localhost` / `127.0.0.1`:
- `M` — +$100,000
- `J` — max jumps on all active boxes (enables prestige)
- `T` — +10 Prestige Tokens
- `G` — spawn Golden Frenzy runner

## Feature → Code Location

Use this table first when the user describes a feature. The section headers in each JS file (e.g. `// === JUMP MECHANICS ===`) let you jump straight there with grep.

| Feature | Primary file | Key functions / vars |
|---|---|---|
| Box jump income | `game.js` § JUMP MECHANICS | `jump()` |
| Synergy detection | `game.js` § JUMP MECHANICS | `jump()` synergy block, `activeJumps[]` |
| Chain mechanic | `game.js` § JUMP MECHANICS + `ui.js` § PER-FRAME UPDATE | `synergyChainRaw`, chain bar block in `updateUI()` |
| Auto-bot loop | `game.js` § INITIALIZATION & GAME LOOP | `gameLoop()` auto section |
| Auto-bot on/off toggle | `game.js` § TALENTS | `toggleAutoBot()` |
| Prestige | `game.js` § PRESTIGE & EVOLUTION | `prestigeBox()` |
| Evolution | `game.js` § PRESTIGE & EVOLUTION | `evolveBox()` |
| Talents | `game.js` § TALENTS | `buyTalent()`, `getTalentCost()` |
| Box upgrades (value/speed/auto) | `game.js` § BOX UPGRADES | `buyUp()` |
| Golden Frenzy event | `game.js` § GOLDEN FRENZY EVENT | `spawnGoldenRunner()`, `catchGoldenRunner()` |
| Ghost Box (jump + upgrades) | `game.js` § GHOST BOX | `jumpGhost()`, `unlockGhostBox()`, `buyGhostUp()` |
| Ghost Box (UI display) | `ui.js` § PER-FRAME UPDATE → ghost box | ghost block in `updateUI()` |
| Ghost Box (DOM layout) | `ui.js` § LAYOUT | ghost section in `renderLayout()` |
| Card shop (draw / flip / collect) | `cards.js` | `startDrawAnimation()`, `showCardFlip()`, `collectCard()` |
| Card inventory (craft / scrap / equip) | `cards.js` | `renderInventory()`, `craftCard()`, `equipCard()` |
| Card multipliers | `cards.js` | `updateCachedMultipliers()` |
| DOM full rebuild | `ui.js` § LAYOUT | `renderLayout()` |
| Per-frame DOM update | `ui.js` § PER-FRAME UPDATE | `updateUI()` |
| Save / Load | `storage.js` | `saveGame()`, `loadGame()` |
| Balance numbers | `constants.js` | `boxData[]`, `talents{}` |
| Ghost Box balance helpers | `game.js` § GHOST BOX | `getGhostBoxInterval()`, `getGhostBoxValueMult()`, etc. |

## Architecture

### Script load order (matters — no module system)

1. `js/constants.js` — static data (`boxData`, `ghostBoxData`, `talents`, `cardTypes`, `SAVE_KEY`)
2. `js/storage.js` — runtime vars (`money`, `prestigeTokens`, `cards`, etc.) + save/load
3. `js/game.js` — game loop, jump, prestige/evolve, frenzy, ghost box, talents
4. `js/ui.js` — `renderLayout()`, `updateUI()`, modals, particles, floating text
5. `js/cards.js` — card draw, equip, upgrade, scrap; `updateCachedMultipliers()`
6. `js/ads.js` — ad integration

### Section structure of the large files

**game.js** sections (grep for `// ===`):
1. STATE — runtime vars, chain state
2. VALUE HELPERS — `getPrestigeTarget`, `getSingleBoxValue`, `getTotalBoxValue`
3. GOLDEN FRENZY EVENT — `spawnGoldenRunner`, `catchGoldenRunner`
4. INITIALIZATION & GAME LOOP — `init`, `gameLoop`
5. TALENTS & AUTO-BOT TOGGLE — `buyTalent`, `toggleAutoBot`
6. JUMP MECHANICS — `jump` (synergy, chain, income, animation)
7. PRESTIGE & EVOLUTION — `prestigeBox`, `evolveBox`
8. BOX UPGRADES & UNLOCK — `buyUp`, `unlockBox`
9. GHOST BOX — `getGhostBoxInterval`, `jumpGhost`, `unlockGhostBox`, `buyGhostUp`

**ui.js** sections (grep for `// ===`):
1. MODALS — `toggleModal`, `closeModal`, prestige confirm, box collapse
2. PARTICLES & VISUAL FEEDBACK — `spawnParticles`
3. LAYOUT — `renderTalents`, `renderLayout` (expensive full rebuild)
4. FLOATING TEXT & SYNERGY FEEDBACK — `createFloatingText`, `showSynergyFeedback`, `flashError`
5. STATS MODAL — `openStats`
6. PER-FRAME UPDATE — `updateUI` with subsections: money/tokens → shop modal → upgrade modal → stats modal → ghost box → chain bar → per-box loop

### Global state

All game state lives in module-level `let` vars:

- `money`, `prestigeTokens`, `cardDust`, `cards`, `frenzyTimer` — `storage.js`
- `boxData[]` — 4-element array in `constants.js`; each entry holds all per-box state including `cachedMults` and `cachedElements`
- `ghostBoxData` — single object for the Ghost Box (in `constants.js`)
- `talents` — object in `constants.js`, each entry has `level` / `maxLevel` / `baseCost` / `costMult`
- `synergyChainRaw`, `synergyChainLastTime` — chain mechanic state in `game.js`

### DOM caching pattern

`renderLayout()` fully reconstructs the stage and upgrade panels, then populates `b.cachedElements` and `ghostBoxData.cachedElements` with DOM references. All `updateUI()` calls touch only these cached refs — never `getElementById`/`querySelector` again. **Any new element that `updateUI()` needs must be added to `cachedElements` inside `renderLayout()`.**

### `renderLayout()` vs `updateUI()`

- `renderLayout()` — expensive full rebuild; call only on structural changes (box unlock, prestige, collapse toggle, card equip)
- `updateUI()` — lightweight per-frame diff; `lastMoney` dirty flag skips upgrade-button text when money hasn't changed

### Value calculation pipeline

```
amountEarned = floor(b.inc × prestigeMult × evolutionMult × synergyMultiplier × cardMults.value × talentValueMult)
```

- `prestigeMult` = `1.5 ^ b.prestige`
- `evolutionMult` = `25 ^ b.evolution`
- `cardMults` — pre-cached in `b.cachedMults` by `updateCachedMultipliers(idx)` in `cards.js`; call after any card change
- `talentValueMult` = `1 + talents.globalValue.level × 0.15`

### Synergy & Chain

`activeJumps` is a rolling buffer (max 20 entries). When `jump(idx)` fires it finds adjacent-box jumps within `synergyWindow` ms (base 50ms, +25ms per `talents.synergy` level). A match awards `(2 + cardMults.synergyBonus) × chainMult` to the triggering box. Each synergy increments `synergyChainRaw` (+1.0 manual, +0.3 auto); it decays to 0 after `CHAIN_DECAY_MS` (1500ms) of inactivity.

Ghost Box synergy with Box 1 uses the same buffer but has a separate `lastSynergyTime` cooldown (`getGhostBoxSynergyCooldown()`).

### Prestige & Evolution

Prestige target for level `p`: `floor(1000 × 1.1^p)`. Confirming prestige resets `inc`, `incCost`, `dur`, `durCost` (and auto unless `talents.autoSave`), awards +1 Prestige Token. At 10 prestiges, the box can **Evolve** (resets prestige to 0, increments `b.evolution`, ×25 income multiplier).

### Cards

Rarity: common / rare / epic. Type: value / speed / auto / synergy. One card equipped per box via `b.cachedMults`. Always call `updateCachedMultipliers(idx)` after any card change. Card pack cost starts at $1,000, ×1.5 per card owned; `talents.cheapCards` discounts displayed cost.

### Persistence

`saveGame()` serialises all state to `localStorage` key `boxSynergySave`. Auto-save every 10 seconds and on `beforeunload`. `wipeSave()` sets `isWiping = true` then removes the key and reloads.

### Known tech debt

`getGhostBoxInterval()`, `getGhostBoxValueMult()`, `getGhostBoxSynergyCooldown()`, and `getGhostUpCost()` are defined in both `constants.js` and `game.js`. The `game.js` versions load last and take precedence; the `constants.js` copies are dead code.

## Style Rules

- CSS variables in `:root` in `css/style.css`. Always use them for colors; maintain "Deep Dark Blue" aesthetic.
- JS: `camelCase`. CSS classes: `kebab-case`.
- Keep `gameLoop` lean — no allocations, DOM queries, or layout-triggering ops inside it.

## Token-Efficiency Practices

- Grep for section headers (`// === FEATURE`) to jump to the right spot before reading.
- Use Edit (surgical replace) rather than rewriting entire files.
- Only read the section relevant to the task — for jump bugs read the JUMP MECHANICS section; for ghost box UI read the ghost block in `updateUI()`; for balance numbers read `constants.js`.
