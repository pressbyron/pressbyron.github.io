const SAVE_KEY = 'boxSynergySave';

const cardTypes = [
    { id: 'value', name: 'Value Boost', format: '+{val}% Value' },
    { id: 'speed', name: 'Jump Speed', format: '+{val}% Man Spd' },
    { id: 'auto', name: 'Auto-Bot', format: '+{val}% Auto Spd' },
    { id: 'synergy', name: 'Synergy Core', format: '+{val}x Syn Bonus' }
];

const talents = {
    synergy: { name: "Wider Synergy", desc: "Increases Synergy window by +25ms per level.", level: 0, maxLevel: 3, baseCost: 1, costMult: 2 },
    autoSave: { name: "Persistent Bots", desc: "Auto-Bots survive Prestige resets.", level: 0, maxLevel: 1, baseCost: 3, costMult: 1 },
    highJump: { name: "High Jump Crit", desc: "+5% chance per level for a box to jump extra high, earning x2 value.", level: 0, maxLevel: 3, baseCost: 1, costMult: 2 },
    globalValue: { name: "Value Inflation", desc: "+15% global Box Value per level.", level: 0, maxLevel: 10, baseCost: 1, costMult: 1.3 },
    cheapCards: { name: "Card Shark", desc: "-10% Card Shop pack costs per level.", level: 0, maxLevel: 5, baseCost: 1, costMult: 1.5 },
    luckyDraw: { name: "Lucky Draw", desc: "+1% chance per level to draw Rare/Epic cards.", level: 0, maxLevel: 7, baseCost: 2, costMult: 2 },
    frenzyFinder: { name: "Frenzy Finder", desc: "Reduces Golden Frenzy cooldown by 25% per level.", level: 0, maxLevel: 6, baseCost: 2, costMult: 2 }
};

const boxData = [
    { id: 0, active: true,  color: 'var(--accent-0)', name: 'BOX 1', unlockCost: 0, jumps: 0, prestige: 0, equippedCard: null, collapsed: false,
        baseInc: 1, inc: 1, baseIncCost: 10, incCost: 10,
        baseDur: 0.6, dur: 0.6, durStep: 0.05, minDur: 0.15, baseDurCost: 100, durCost: 100,
        auto: 0, autoProgress: 0, baseAutoStart: 2000, autoStep: 200, minAuto: 300, baseAutoCost: 50, autoCost: 50,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 1, active: false, color: 'var(--accent-1)', name: 'BOX 2', unlockCost: 5000, jumps: 0, prestige: 0, equippedCard: null, collapsed: false,
        baseInc: 25, inc: 25, baseIncCost: 500, incCost: 500,
        baseDur: 0.8, dur: 0.8, durStep: 0.05, minDur: 0.25, baseDurCost: 1000, durCost: 1000,
        auto: 0, autoProgress: 0, baseAutoStart: 3500, autoStep: 300, minAuto: 500, baseAutoCost: 500, autoCost: 500,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 2, active: false, color: 'var(--accent-2)', name: 'BOX 3', unlockCost: 250000, jumps: 0, prestige: 0, equippedCard: null, collapsed: false,
        baseInc: 150, inc: 150, baseIncCost: 5000, incCost: 5000,
        baseDur: 1.1, dur: 1.1, durStep: 0.1, minDur: 0.4, baseDurCost: 5000, durCost: 5000,
        auto: 0, autoProgress: 0, baseAutoStart: 5500, autoStep: 400, minAuto: 800, baseAutoCost: 2500, autoCost: 2500,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 3, active: false, color: 'var(--accent-3)', name: 'BOX 4', unlockCost: 5000000, jumps: 0, prestige: 0, equippedCard: null, collapsed: false,
        baseInc: 1000, inc: 1000, baseIncCost: 50000, incCost: 50000,
        baseDur: 1.5, dur: 1.5, durStep: 0.15, minDur: 0.6, baseDurCost: 25000, durCost: 25000,
        auto: 0, autoProgress: 0, baseAutoStart: 8000, autoStep: 600, minAuto: 1500, baseAutoCost: 10000, autoCost: 10000,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} }
];

let ghostBoxData = {
    active: false,
    unlockCost: 1000,
    levelSpeed: 0,
    levelValue: 0,
    levelSynergy: 0,
    progress: 0,
    lastSynergyTime: 0,
    collapsed: false,
    cachedElements: {}
};
