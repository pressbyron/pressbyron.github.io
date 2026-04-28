const SAVE_KEY = 'boxSynergySave';
const EVOLVE_BASE_COSTS = [500000, 5000000, 50000000, 500000000];

// effect: valuePct | flatIncome | speedPct | autoPct | synergyMs | synergyBonus | chainBonus | ghostValue
const SHOP_UPGRADES = [
    // sorted ascending by cost — all 100
    { id:'val1',   name:'Sharp Eye',       desc:'+5% global jump value',          cost:50,            effect:'valuePct',   value:5    },
    { id:'flat1',  name:'Muscle Memory',   desc:'+1 flat income per jump',        cost:100,           effect:'flatIncome', value:1    },
    { id:'spd1',   name:'Spring Boots',    desc:'-5% jump duration',              cost:250,           effect:'speedPct',   value:5    },
    { id:'auto1',  name:'First Bot',       desc:'+2% auto-bot speed',             cost:500,           effect:'autoPct',    value:2    },
    { id:'ghost1', name:'Phantom Touch',   desc:'+5% ghost box value',            cost:750,           effect:'ghostValue', value:5    },
    { id:'val2',   name:'Keen Eye',        desc:'+8% global jump value',          cost:1000,          effect:'valuePct',   value:8    },
    { id:'flat2',  name:'Practice Run',    desc:'+1 flat income per jump',        cost:1500,          effect:'flatIncome', value:1    },
    { id:'val3',   name:'Eagle Eye',       desc:'+10% global jump value',         cost:2000,          effect:'valuePct',   value:10   },
    { id:'spd2',   name:'Quick Bounce',    desc:'-5% jump duration',              cost:3000,          effect:'speedPct',   value:5    },
    { id:'syn1',   name:'Rhythm Sense',    desc:'+15ms synergy window',           cost:3500,          effect:'synergyMs',  value:15   },
    { id:'chain1', name:'Chain Link',      desc:'+0.05 chain scale per level',    cost:5000,          effect:'chainBonus', value:0.05 },
    { id:'auto2',  name:'Bot Upgrade',     desc:'+2% auto-bot speed',             cost:6000,          effect:'autoPct',    value:2    },
    { id:'ghost2', name:'Phantom Step',    desc:'+8% ghost box value',            cost:8000,          effect:'ghostValue', value:8    },
    { id:'val4',   name:'Hawk Eye',        desc:'+12% global jump value',         cost:10000,         effect:'valuePct',   value:12   },
    { id:'synB1',  name:'Synergy Spark',   desc:'+0.1x synergy bonus',            cost:12000,         effect:'synergyBonus',value:0.10},
    { id:'flat3',  name:'Trained Hands',   desc:'+2 flat income per jump',        cost:15000,         effect:'flatIncome', value:2    },
    { id:'syn2',   name:'Combo Sense',     desc:'+20ms synergy window',           cost:20000,         effect:'synergyMs',  value:20   },
    { id:'spd3',   name:'Swift Motion',    desc:'-8% jump duration',              cost:25000,         effect:'speedPct',   value:8    },
    { id:'val5',   name:'Value Surge',     desc:'+15% global jump value',         cost:30000,         effect:'valuePct',   value:15   },
    { id:'chain2', name:'Chain Mastery',   desc:'+0.05 chain scale per level',    cost:40000,         effect:'chainBonus', value:0.05 },
    { id:'auto3',  name:'Bot Overdrive',   desc:'+3% auto-bot speed',             cost:50000,         effect:'autoPct',    value:3    },
    { id:'ghost3', name:'Phantom Rush',    desc:'+10% ghost box value',           cost:60000,         effect:'ghostValue', value:10   },
    { id:'val6',   name:'Value Storm',     desc:'+18% global jump value',         cost:75000,         effect:'valuePct',   value:18   },
    { id:'synB2',  name:'Synergy Core',    desc:'+0.1x synergy bonus',            cost:80000,         effect:'synergyBonus',value:0.10},
    { id:'flat4',  name:'Expert Hands',    desc:'+2 flat income per jump',        cost:100000,        effect:'flatIncome', value:2    },
    { id:'syn3',   name:'Deep Timing',     desc:'+25ms synergy window',           cost:120000,        effect:'synergyMs',  value:25   },
    { id:'spd4',   name:'Flash Steps',     desc:'-10% jump duration',             cost:150000,        effect:'speedPct',   value:10   },
    { id:'val7',   name:'Value Tempest',   desc:'+20% global jump value',         cost:200000,        effect:'valuePct',   value:20   },
    { id:'chain3', name:'Chain Forge',     desc:'+0.07 chain scale per level',    cost:250000,        effect:'chainBonus', value:0.07 },
    { id:'auto4',  name:'Quantum Bot',     desc:'+3% auto-bot speed',             cost:300000,        effect:'autoPct',    value:3    },
    { id:'ghost4', name:'Phantom Surge',   desc:'+12% ghost box value',           cost:350000,        effect:'ghostValue', value:12   },
    { id:'synB3',  name:'Synergy Matrix',  desc:'+0.15x synergy bonus',           cost:400000,        effect:'synergyBonus',value:0.15},
    { id:'val8',   name:'Value Hurricane', desc:'+25% global jump value',         cost:500000,        effect:'valuePct',   value:25   },
    { id:'flat5',  name:'Diamond Hands',   desc:'+3 flat income per jump',        cost:600000,        effect:'flatIncome', value:3    },
    { id:'syn4',   name:'Perfect Timing',  desc:'+30ms synergy window',           cost:700000,        effect:'synergyMs',  value:30   },
    { id:'spd5',   name:'Lightning Bounce',desc:'-12% jump duration',             cost:800000,        effect:'speedPct',   value:12   },
    { id:'val9',   name:'Value Monsoon',   desc:'+28% global jump value',         cost:1000000,       effect:'valuePct',   value:28   },
    { id:'chain4', name:'Chain Fusion',    desc:'+0.07 chain scale per level',    cost:1200000,       effect:'chainBonus', value:0.07 },
    { id:'auto5',  name:'Ultra Bot',       desc:'+3% auto-bot speed',             cost:1500000,       effect:'autoPct',    value:3    },
    { id:'ghost5', name:'Phantom Blaze',   desc:'+15% ghost box value',           cost:2000000,       effect:'ghostValue', value:15   },
    { id:'synB4',  name:'Synergy Nexus',   desc:'+0.15x synergy bonus',           cost:2500000,       effect:'synergyBonus',value:0.15},
    { id:'val10',  name:'Value Tornado',   desc:'+30% global jump value',         cost:3000000,       effect:'valuePct',   value:30   },
    { id:'flat6',  name:'Steel Hands',     desc:'+3 flat income per jump',        cost:4000000,       effect:'flatIncome', value:3    },
    { id:'syn5',   name:'Timing Mastery',  desc:'+35ms synergy window',           cost:5000000,       effect:'synergyMs',  value:35   },
    { id:'spd6',   name:'Turbo Bounce',    desc:'-15% jump duration',             cost:6000000,       effect:'speedPct',   value:15   },
    { id:'val11',  name:'Value Cyclone',   desc:'+35% global jump value',         cost:8000000,       effect:'valuePct',   value:35   },
    { id:'chain5', name:'Chain God',       desc:'+0.10 chain scale per level',    cost:10000000,      effect:'chainBonus', value:0.10 },
    { id:'auto6',  name:'Bot Supremacy',   desc:'+3% auto-bot speed',             cost:12000000,      effect:'autoPct',    value:3    },
    { id:'ghost6', name:'Phantom Pulse',   desc:'+18% ghost box value',           cost:15000000,      effect:'ghostValue', value:18   },
    { id:'synB5',  name:'Synergy Omega',   desc:'+0.20x synergy bonus',           cost:20000000,      effect:'synergyBonus',value:0.20},
    { id:'val12',  name:'Value Typhoon',   desc:'+40% global jump value',         cost:25000000,      effect:'valuePct',   value:40   },
    { id:'flat7',  name:'Gold Hands',      desc:'+5 flat income per jump',        cost:30000000,      effect:'flatIncome', value:5    },
    { id:'syn6',   name:'Timing Elite',    desc:'+40ms synergy window',           cost:40000000,      effect:'synergyMs',  value:40   },
    { id:'spd7',   name:'Flash Overdrive', desc:'-18% jump duration',             cost:50000000,      effect:'speedPct',   value:18   },
    { id:'val13',  name:'Value Blizzard',  desc:'+45% global jump value',         cost:60000000,      effect:'valuePct',   value:45   },
    { id:'chain6', name:'Chain Elite',     desc:'+0.10 chain scale per level',    cost:80000000,      effect:'chainBonus', value:0.10 },
    { id:'auto7',  name:'Bot God',         desc:'+3% auto-bot speed',             cost:100000000,     effect:'autoPct',    value:3    },
    { id:'ghost7', name:'Phantom Storm',   desc:'+20% ghost box value',           cost:120000000,     effect:'ghostValue', value:20   },
    { id:'synB6',  name:'Synergy Ascend',  desc:'+0.20x synergy bonus',           cost:150000000,     effect:'synergyBonus',value:0.20},
    { id:'val14',  name:'Value Maelstrom', desc:'+50% global jump value',         cost:200000000,     effect:'valuePct',   value:50   },
    { id:'flat8',  name:'Platinum Hands',  desc:'+5 flat income per jump',        cost:250000000,     effect:'flatIncome', value:5    },
    { id:'syn7',   name:'Timing God',      desc:'+50ms synergy window',           cost:300000000,     effect:'synergyMs',  value:50   },
    { id:'spd8',   name:'Quantum Bounce',  desc:'-20% jump duration',             cost:400000000,     effect:'speedPct',   value:20   },
    { id:'val15',  name:'Value Nova',      desc:'+60% global jump value',         cost:500000000,     effect:'valuePct',   value:60   },
    { id:'chain7', name:'Chain Legend',    desc:'+0.15 chain scale per level',    cost:600000000,     effect:'chainBonus', value:0.15 },
    { id:'auto8',  name:'Bot Legend',      desc:'+3% auto-bot speed',             cost:750000000,     effect:'autoPct',    value:3    },
    { id:'ghost8', name:'Phantom Nova',    desc:'+25% ghost box value',           cost:800000000,     effect:'ghostValue', value:25   },
    { id:'synB7',  name:'Synergy God',     desc:'+0.30x synergy bonus',           cost:1000000000,    effect:'synergyBonus',value:0.30},
    { id:'val16',  name:'Value Supernova', desc:'+70% global jump value',         cost:1200000000,    effect:'valuePct',   value:70   },
    { id:'flat9',  name:'Diamond Core',    desc:'+8 flat income per jump',        cost:1500000000,    effect:'flatIncome', value:8    },
    { id:'syn8',   name:'Perfect Window',  desc:'+60ms synergy window',           cost:2000000000,    effect:'synergyMs',  value:60   },
    { id:'spd9',   name:'Sonic Bounce',    desc:'-22% jump duration',             cost:2500000000,    effect:'speedPct',   value:22   },
    { id:'val17',  name:'Value Quasar',    desc:'+80% global jump value',         cost:3000000000,    effect:'valuePct',   value:80   },
    { id:'chain8', name:'Chain Divine',    desc:'+0.15 chain scale per level',    cost:4000000000,    effect:'chainBonus', value:0.15 },
    { id:'auto9',  name:'Bot Divine',      desc:'+3% auto-bot speed',             cost:5000000000,    effect:'autoPct',    value:3    },
    { id:'ghost9', name:'Phantom Quasar',  desc:'+30% ghost box value',           cost:6000000000,    effect:'ghostValue', value:30   },
    { id:'synB8',  name:'Synergy Divine',  desc:'+0.30x synergy bonus',           cost:8000000000,    effect:'synergyBonus',value:0.30},
    { id:'val18',  name:'Value Pulsar',    desc:'+100% global jump value',        cost:10000000000,   effect:'valuePct',   value:100  },
    { id:'flat10', name:'Legend Hands',    desc:'+8 flat income per jump',        cost:12000000000,   effect:'flatIncome', value:8    },
    { id:'syn9',   name:'Timing Divine',   desc:'+75ms synergy window',           cost:15000000000,   effect:'synergyMs',  value:75   },
    { id:'spd10',  name:'Hyper Bounce',    desc:'-25% jump duration',             cost:20000000000,   effect:'speedPct',   value:25   },
    { id:'val19',  name:'Value Nebula',    desc:'+120% global jump value',        cost:25000000000,   effect:'valuePct',   value:120  },
    { id:'chain9', name:'Chain Cosmic',    desc:'+0.20 chain scale per level',    cost:30000000000,   effect:'chainBonus', value:0.20 },
    { id:'auto10', name:'Bot Cosmic',      desc:'+3% auto-bot speed',             cost:40000000000,   effect:'autoPct',    value:3    },
    { id:'ghost10',name:'Phantom Nebula',  desc:'+40% ghost box value',           cost:50000000000,   effect:'ghostValue', value:40   },
    { id:'synB9',  name:'Synergy Cosmic',  desc:'+0.50x synergy bonus',           cost:60000000000,   effect:'synergyBonus',value:0.50},
    { id:'val20',  name:'Value Galaxy',    desc:'+150% global jump value',        cost:80000000000,   effect:'valuePct',   value:150  },
    { id:'flat11', name:'Legend Core',     desc:'+12 flat income per jump',       cost:100000000000,  effect:'flatIncome', value:12   },
    { id:'syn10',  name:'Timing Cosmic',   desc:'+100ms synergy window',          cost:120000000000,  effect:'synergyMs',  value:100  },
    { id:'spd11',  name:'Warp Bounce',     desc:'-28% jump duration',             cost:150000000000,  effect:'speedPct',   value:28   },
    { id:'val21',  name:'Value Universe',  desc:'+200% global jump value',        cost:200000000000,  effect:'valuePct',   value:200  },
    { id:'synB10', name:'Synergy Universe',desc:'+0.50x synergy bonus',           cost:250000000000,  effect:'synergyBonus',value:0.50},
    { id:'auto11', name:'Bot Universe',    desc:'+15% auto-bot speed',            cost:300000000000,  effect:'autoPct',    value:15   },
    { id:'ghost11',name:'Phantom Galaxy',  desc:'+50% ghost box value',           cost:400000000000,  effect:'ghostValue', value:50   },
    { id:'chain10',name:'Chain Universe',  desc:'+0.20 chain scale per level',    cost:500000000000,  effect:'chainBonus', value:0.20 },
    { id:'flat12', name:'Ultimate Hands',  desc:'+15 flat income per jump',       cost:600000000000,  effect:'flatIncome', value:15   },
    { id:'spd12',  name:'Light Bounce',    desc:'-30% jump duration',             cost:800000000000,  effect:'speedPct',   value:30   },
    { id:'val22',  name:'Value Infinity',  desc:'+250% global jump value',        cost:1000000000000, effect:'valuePct',   value:250  },
    { id:'synB11', name:'Synergy Infinity',desc:'+0.70x synergy bonus',           cost:1200000000000, effect:'synergyBonus',value:0.70},
    { id:'auto12', name:'Bot Infinity',    desc:'+15% auto-bot speed',            cost:1500000000000, effect:'autoPct',    value:15   },
    { id:'ghost12',name:'Phantom Universe',desc:'+60% ghost box value',           cost:2000000000000, effect:'ghostValue', value:60   },
];

function fmt(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(3).replace(/\.?0+$/, '') + 'T';
    if (n >= 1e9)  return (n / 1e9).toFixed(3).replace(/\.?0+$/, '') + 'B';
    if (n >= 1e6)  return (n / 1e6).toFixed(3).replace(/\.?0+$/, '') + 'M';
    return n.toLocaleString();
}

const cardTypes = [
    { id: 'value', name: 'Value Boost', format: '+{val}% Value' },
    { id: 'speed', name: 'Jump Speed', format: '+{val}% Man Spd' },
    { id: 'auto', name: 'Auto-Bot', format: '+{val}% Auto Spd' },
    { id: 'synergy', name: 'Synergy Core', format: '+{val}x Syn Bonus' }
];

const talents = {
    baseIncome:   { name: "Jump Starter",      desc: "+1 flat base income per jump per level. Scales with prestige and evolution.",            level: 0, maxLevel: 10, baseCost: 1, costMult: 1.3, requires: null },
    highJump:     { name: "High Jump Crit",    desc: "+5% chance per level for a box to jump extra high, earning x2 value.",                   level: 0, maxLevel: 3,  baseCost: 1, costMult: 2,   requires: null },
    globalValue:  { name: "Value Inflation",   desc: "+15% global Box Value per level.",                                                       level: 0, maxLevel: 10, baseCost: 1, costMult: 1.3, requires: 'baseIncome' },
    synergy:       { name: "Wider Synergy",     desc: "Increases Synergy window by +25ms per level.",                                           level: 0, maxLevel: 3,  baseCost: 1, costMult: 2,   requires: 'globalValue' },
    frenzyFinder:  { name: "Frenzy Finder",    desc: "Reduces Golden Frenzy cooldown by 25% per level.",                                       level: 0, maxLevel: 6,  baseCost: 2, costMult: 2,   requires: 'globalValue' },
    jumpPrestige:  { name: "Power Stride",     desc: "Each jump counts +20% more toward prestige per level. ×3.0 at max (level 10).",          level: 0, maxLevel: 10, baseCost: 2, costMult: 1.4, requires: 'synergy' },
    autoControl:   { name: "Manual Override",  desc: "Unlocks an On/Off toggle for each box's Auto-Bot so you can manage synergies manually.", level: 0, maxLevel: 1,  baseCost: 3, costMult: 1,   requires: 'jumpPrestige' },
    cheapCards:   { name: "Card Shark",        desc: "-10% Card Shop pack costs per level.",                                                   level: 0, maxLevel: 5,  baseCost: 1, costMult: 1.5, requires: 'highJump' },
    autoSave:     { name: "Persistent Bots",   desc: "Auto-Bots survive Prestige resets.",                                                     level: 0, maxLevel: 1,  baseCost: 3, costMult: 1,   requires: 'highJump' },
    luckyDraw:    { name: "Lucky Draw",        desc: "+1% chance per level to draw Rare/Epic cards.",                                          level: 0, maxLevel: 7,  baseCost: 2, costMult: 2,   requires: 'cheapCards' },
    bonusTokens:  { name: "Prestige Bonus",    desc: "+1 Prestige Token awarded per prestige per level.",                                      level: 0, maxLevel: 3,  baseCost: 2, costMult: 2,   requires: 'autoSave' },
    jumpQueue:    { name: "Jump Buffer",       desc: "If the Auto-Bot fires while a box is mid-jump, it queues and fires instantly on landing.", level: 0, maxLevel: 1,  baseCost: 5, costMult: 1,   requires: 'bonusTokens' },
};

const boxData = [
    { id: 0, active: true,  color: 'var(--accent-0)', name: 'BOX 1', unlockCost: 0, jumps: 0, lifetimeJumps: 0, prestige: 0, evolution: 0, totalIncome: 0, bestJump: 0, equippedCard: null, collapsed: false, autoEnabled: true,
        baseInc: 1, inc: 1, baseIncCost: 10, incCost: 10,
        baseDur: 0.6, dur: 0.6, durStep: 0.05, minDur: 0.15, baseDurCost: 100, durCost: 100,
        auto: 0, autoProgress: 0, baseAutoStart: 2000, autoStep: 200, minAuto: 300, baseAutoCost: 50, autoCost: 50,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 1, active: false, color: 'var(--accent-1)', name: 'BOX 2', unlockCost: 5000, jumps: 0, lifetimeJumps: 0, prestige: 0, evolution: 0, totalIncome: 0, bestJump: 0, equippedCard: null, collapsed: false, autoEnabled: true,
        baseInc: 25, inc: 25, baseIncCost: 500, incCost: 500,
        baseDur: 0.8, dur: 0.8, durStep: 0.05, minDur: 0.25, baseDurCost: 1000, durCost: 1000,
        auto: 0, autoProgress: 0, baseAutoStart: 3500, autoStep: 300, minAuto: 500, baseAutoCost: 500, autoCost: 500,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 2, active: false, color: 'var(--accent-2)', name: 'BOX 3', unlockCost: 250000, jumps: 0, lifetimeJumps: 0, prestige: 0, evolution: 0, totalIncome: 0, bestJump: 0, equippedCard: null, collapsed: false, autoEnabled: true,
        baseInc: 150, inc: 150, baseIncCost: 5000, incCost: 5000,
        baseDur: 1.1, dur: 1.1, durStep: 0.1, minDur: 0.4, baseDurCost: 5000, durCost: 5000,
        auto: 0, autoProgress: 0, baseAutoStart: 5500, autoStep: 400, minAuto: 800, baseAutoCost: 2500, autoCost: 2500,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 3, active: false, color: 'var(--accent-3)', name: 'BOX 4', unlockCost: 5000000, jumps: 0, lifetimeJumps: 0, prestige: 0, evolution: 0, totalIncome: 0, bestJump: 0, equippedCard: null, collapsed: false, autoEnabled: true,
        baseInc: 1000, inc: 1000, baseIncCost: 50000, incCost: 50000,
        baseDur: 1.5, dur: 1.5, durStep: 0.15, minDur: 0.6, baseDurCost: 25000, durCost: 25000,
        auto: 0, autoProgress: 0, baseAutoStart: 8000, autoStep: 600, minAuto: 1500, baseAutoCost: 10000, autoCost: 10000,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} }
];

let ghostBoxData = {
    active: false,
    unlockCost: 1500,
    levelSpeed: 0,
    levelValue: 0,
    levelSynergy: 0,
    progress: 0,
    lastSynergyTime: 0,
    collapsed: false,
    totalIncome: 0,
    bestJump: 0,
    totalJumps: 0,
    cachedElements: {}
};

function getGhostBoxInterval() {
    return 3000 / (1 + ghostBoxData.levelSpeed * 0.25);
}

function getGhostBoxValueMult() {
    return 0.05 + (ghostBoxData.levelValue * 0.025);
}

function getGhostBoxSynergyCooldown() {
    return 5000 - (ghostBoxData.levelSynergy * 500);
}

function getGhostUpCost(type) {
    const levels = { 'speed': ghostBoxData.levelSpeed, 'value': ghostBoxData.levelValue, 'synergy': ghostBoxData.levelSynergy };
    const base = type === 'value' ? 500 : 300;
    return Math.floor(base * Math.pow(2, levels[type] || 0));
}
