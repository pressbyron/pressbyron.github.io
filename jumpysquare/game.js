let money = 0;
let activeJumps = [];
let prestigeTokens = 0;
let lastTime = performance.now();
let frenzyTimer = 0;

let cards = [];
let nextCardId = 1;
let cardPackCost = 1000;
let equippingToBox = null;
let pendingPrestigeBox = null;

let isDrawingCard = false;
let pendingDrawnCard = null;

let isWiping = false;
let hasSeenSynergyTutorial = false;
let cardDust = 0;
let upgradingCardId = null;
let pendingScrapCardId = null;
let lastMoney = -1;

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
    frenzyFinder: { name: "Frenzy Finder", desc: "Reduces Golden Frenzy cooldown by 25% per level.", level: 0, maxLevel: 6, baseCost: 2, costMult: 2 }
};

const boxData = [
    { id: 0, active: true,  color: 'var(--accent-0)', name: 'BOX 1', unlockCost: 0, jumps: 0, prestige: 0, equippedCard: null,
        baseInc: 1, inc: 1, baseIncCost: 10, incCost: 10,
        baseDur: 0.6, dur: 0.6, durStep: 0.05, minDur: 0.15, baseDurCost: 100, durCost: 100,
        auto: 0, autoProgress: 0, baseAutoStart: 2000, autoStep: 200, minAuto: 300, baseAutoCost: 50, autoCost: 50,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 1, active: false, color: 'var(--accent-1)', name: 'BOX 2', unlockCost: 5000, jumps: 0, prestige: 0, equippedCard: null,
        baseInc: 25, inc: 25, baseIncCost: 500, incCost: 500,
        baseDur: 0.8, dur: 0.8, durStep: 0.05, minDur: 0.25, baseDurCost: 1000, durCost: 1000,
        auto: 0, autoProgress: 0, baseAutoStart: 3500, autoStep: 300, minAuto: 500, baseAutoCost: 500, autoCost: 500,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 2, active: false, color: 'var(--accent-2)', name: 'BOX 3', unlockCost: 250000, jumps: 0, prestige: 0, equippedCard: null,
        baseInc: 150, inc: 150, baseIncCost: 5000, incCost: 5000,
        baseDur: 1.1, dur: 1.1, durStep: 0.1, minDur: 0.4, baseDurCost: 5000, durCost: 5000,
        auto: 0, autoProgress: 0, baseAutoStart: 5500, autoStep: 400, minAuto: 800, baseAutoCost: 2500, autoCost: 2500,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} },

    { id: 3, active: false, color: 'var(--accent-3)', name: 'BOX 4', unlockCost: 5000000, jumps: 0, prestige: 0, equippedCard: null,
        baseInc: 1000, inc: 1000, baseIncCost: 50000, incCost: 50000,
        baseDur: 1.5, dur: 1.5, durStep: 0.15, minDur: 0.6, baseDurCost: 25000, durCost: 25000,
        auto: 0, autoProgress: 0, baseAutoStart: 8000, autoStep: 600, minAuto: 1500, baseAutoCost: 10000, autoCost: 10000,
        cachedMults: { value: 1, speed: 1, auto: 1, synergyBonus: 0 }, cachedElements: {} }
];

const SAVE_KEY = 'boxSynergySave';

function saveGame() {
    if (isWiping) return;
    const boxProgress = boxData.map(b => ({
        active: b.active, jumps: b.jumps, prestige: b.prestige, equippedCard: b.equippedCard,
        inc: b.inc, incCost: b.incCost, dur: b.dur, durCost: b.durCost,
        auto: b.auto, autoProgress: b.autoProgress, autoCost: b.autoCost
    }));

    const saveData = { money, prestigeTokens, nextCardId, cards, talents, boxProgress, frenzyTimer, hasSeenSynergyTutorial, cardDust };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function loadGame() {
    const saveStr = localStorage.getItem(SAVE_KEY);
    if (saveStr) {
        try {
            const data = JSON.parse(saveStr);
            money = data.money || 0;
            prestigeTokens = data.prestigeTokens || 0;
            nextCardId = data.nextCardId || 1;
            frenzyTimer = data.frenzyTimer || 0;
            hasSeenSynergyTutorial = data.hasSeenSynergyTutorial || false;
            cardDust = data.cardDust || 0;
            if (data.cards) {
                cards = data.cards;
                cards.forEach(c => { if(c.level === undefined) c.level = 0; });
            }

            cardPackCost = 1000;
            for(let i = 0; i < cards.length; i++) {
                cardPackCost = Math.floor(cardPackCost * 1.5);
            }

            if (data.talents) {
                for (let key in data.talents) {
                    if (talents[key]) talents[key].level = data.talents[key].level;
                }
            }

            if (data.boxProgress) {
                data.boxProgress.forEach((savedBox, i) => {
                    if (boxData[i]) {
                        const fieldsToLoad = ['active', 'jumps', 'prestige', 'equippedCard', 'inc', 'incCost', 'dur', 'durCost', 'auto', 'autoProgress', 'autoCost'];
                        fieldsToLoad.forEach(field => {
                            if (savedBox[field] !== undefined) boxData[i][field] = savedBox[field];
                        });
                        boxData[i].autoProgress = 0;
                        updateCachedMultipliers(i);
                    }
                });
            }
        } catch (e) { console.error("Failed to load save", e); }
    } else {
        boxData.forEach((_, i) => updateCachedMultipliers(i));
    }
}

function wipeSave() {
    if(confirm("Are you sure you want to completely wipe your save? This cannot be undone!")) {
        isWiping = true;
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function getPrestigeTarget(prestigeLevel) { return Math.floor(1000 * Math.pow(1.1, prestigeLevel)); }
function getActualCardCost() { return Math.floor(cardPackCost * (1 - (talents.cheapCards.level * 0.10))); }

function toggleModal(id) {
    if(isDrawingCard && id === 'shop-modal') return;

    const modal = document.getElementById(id);
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 200);
    } else {
        modal.style.display = 'flex';
        if(id === 'shop-modal') renderInventory();
        if(id === 'talent-modal') renderTalents();
        setTimeout(() => { modal.classList.add('active'); }, 10);
    }
}

function closeModal(e, id) {
    if(isDrawingCard && id === 'shop-modal') return;
    if (e.target.id === id) toggleModal(id);
}

function openPrestigeModal(idx) {
    pendingPrestigeBox = idx;
    toggleModal('prestige-modal');
}

function confirmPrestige() {
    if(pendingPrestigeBox !== null) {
        prestigeBox(pendingPrestigeBox);
        pendingPrestigeBox = null;
    }
    toggleModal('prestige-modal');
}

function spawnParticles(container, rarity) {
    const color = rarity === 'epic' ? '#d8b4fe' : (rarity === 'rare' ? '#93c5fd' : '#facc15');
    for(let i=0; i<40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.color = color;
        p.style.background = color;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 60 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);

        container.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

function startDrawAnimation() {
    const actualCost = getActualCardCost();
    if (money < actualCost || isDrawingCard) return;

    isDrawingCard = true;
    money -= actualCost;
    cardPackCost = Math.floor(cardPackCost * 1.5);
    updateUI();

    const btn = document.getElementById('draw-card-btn');
    btn.style.display = 'none';

    document.getElementById('card-showcase-container').style.display = 'flex';
    const showcase = document.getElementById('card-showcase');
    document.getElementById('collect-btn').style.display = 'none';
    showcase.innerHTML = '';

    const isFirstCard = (nextCardId === 1);
    const roll = Math.random();

    let rarity = 'common';
    if (roll > 0.95) rarity = 'epic';
    else if (roll > 0.70) rarity = 'rare';

    // Tvingar första kortet att vara auto
    let typeObj;
    if (isFirstCard) {
        typeObj = cardTypes.find(c => c.id === 'auto');
    } else {
        typeObj = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    }

    let value = 0;
    if (typeObj.id === 'value') {
        if (rarity === 'common') value = Math.floor(Math.random() * 30) + 20;
        if (rarity === 'rare') value = Math.floor(Math.random() * 50) + 50;
        if (rarity === 'epic') value = Math.floor(Math.random() * 150) + 100;
    } else if (typeObj.id === 'speed' || typeObj.id === 'auto') {
        if (rarity === 'common') value = Math.floor(Math.random() * 15) + 10;
        if (rarity === 'rare') value = Math.floor(Math.random() * 20) + 25;
        if (rarity === 'epic') value = Math.floor(Math.random() * 35) + 45;
    } else if (typeObj.id === 'synergy') {
        if (rarity === 'common') value = 1;
        if (rarity === 'rare') value = 2;
        if (rarity === 'epic') value = Math.floor(Math.random() * 2) + 3;
    }

    pendingDrawnCard = { id: nextCardId++, rarity, type: typeObj.id, value, typeName: typeObj.name, text: typeObj.format.replace('{val}', value), equippedTo: null, level: 0 };

    let ticks = 0;
    const maxTicks = 16;
    const interval = setInterval(() => {
        ticks++;
        const randRarity = ['common', 'rare', 'epic'][Math.floor(Math.random() * 3)];
        const randVal = Math.floor(Math.random() * 100) + 1;
        const randScale = 0.9 + Math.random() * 0.1;
        const randRot = Math.random() * 6 - 3;

        showcase.innerHTML = `
            <div class="equip-card-item ${randRarity} rolling-card" style="transform: scale(${randScale}) rotate(${randRot}deg);">
                <div class="card-rarity">${randRarity}</div>
                <div class="card-stat">+${randVal}???</div>
            </div>
        `;

        if (ticks >= maxTicks) {
            clearInterval(interval);
            finishDrawAnimation(pendingDrawnCard);
        }
    }, 80);
}

function finishDrawAnimation(newCard) {
    const showcase = document.getElementById('card-showcase');
    showcase.innerHTML = `
        <div class="equip-card-item ${newCard.rarity} rolling-card pop-anim">
            <div class="card-rarity">${newCard.rarity}</div>
            <div class="card-stat">${newCard.text}</div>
            <div class="card-desc">${newCard.typeName}</div>
        </div>
    `;

    if (newCard.rarity === 'rare' || newCard.rarity === 'epic') {
        spawnParticles(showcase, newCard.rarity);
    }

    setTimeout(() => {
        document.getElementById('collect-btn').style.display = 'block';
    }, 600);
}

function collectCard() {
    if(!pendingDrawnCard) return;

    cards.push(pendingDrawnCard);
    showSynergyFeedback(`🃏 Collected ${pendingDrawnCard.rarity.toUpperCase()} card!`, `var(--rarity-${pendingDrawnCard.rarity})`);

    pendingDrawnCard = null;
    isDrawingCard = false;

    document.getElementById('card-showcase-container').style.display = 'none';
    const btn = document.getElementById('draw-card-btn');
    btn.style.display = 'block';

    renderInventory();
    updateUI();
    saveGame();
}

function renderInventory() {
    const grid = document.getElementById('inventory-grid');
    const btn = document.getElementById('draw-card-btn');
    const actualCost = getActualCardCost();

    btn.innerHTML = `Draw Card <span style="color:var(--bg); font-family:var(--font-mono); font-size:1rem; margin-left:5px;">$${actualCost.toLocaleString()}</span>`;

    if (!isDrawingCard) {
        btn.disabled = money < actualCost;
    }

    if (cards.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-dim); grid-column: 1 / -1; text-align: center; padding: 20px;">No cards drawn yet.</p>';
        return;
    }

    grid.innerHTML = '';

    const sortedCards = [...cards].sort((a, b) => {
        const rMap = { 'epic': 3, 'rare': 2, 'common': 1 };
        if(rMap[b.rarity] !== rMap[a.rarity]) return rMap[b.rarity] - rMap[a.rarity];
        return b.value - a.value;
    });

    sortedCards.forEach(c => {
        const el = document.createElement('div');
        el.className = `equip-card-item ${c.rarity}`;
        const eqText = c.equippedTo !== null ? `<div class="equipped-label">Box ${c.equippedTo + 1}</div>` : '';
        const levelText = c.level > 0 ? `<div class="card-level">Lvl ${c.level}</div>` : '';
        
        el.innerHTML = `
            ${eqText}
            ${levelText}
            <div class="card-rarity">${c.rarity}</div>
            <div class="card-stat">${c.text}</div>
            <div class="card-desc">${c.typeName}</div>
            <div class="card-actions">
                <button class="card-action-btn upgrade-btn" onclick="openUpgradeModal(${c.id})">Upgrade</button>
                <button class="card-action-btn scrap-btn" onclick="scrapCard(${c.id})">Scrap</button>
            </div>
        `;
        grid.appendChild(el);
    });
}

function openEquipModal(boxIndex) {
    equippingToBox = boxIndex;
    const boxNameEl = document.getElementById('equip-box-name');
    boxNameEl.innerText = boxData[boxIndex].name;
    boxNameEl.style.color = boxData[boxIndex].color;

    const grid = document.getElementById('equip-grid');
    grid.innerHTML = '';

    const availableCards = cards.filter(c => c.equippedTo === null || c.equippedTo === boxIndex);

    if (availableCards.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-dim); grid-column: 1/-1; text-align:center;">No available cards to equip.</p>';
    } else {
        availableCards.forEach(c => {
            const el = document.createElement('div');
            el.className = `equip-card-item ${c.rarity}`;
            if(c.equippedTo === boxIndex) el.classList.add('equipped-active');

            const levelText = c.level > 0 ? `<div class="card-level">Lvl ${c.level}</div>` : '';

            el.innerHTML = `
                ${c.equippedTo === boxIndex ? '<div class="equipped-label" style="background:var(--money-green); color:#000;">Equipped</div>' : ''}
                ${levelText}
                <div class="card-rarity">${c.rarity}</div>
                <div class="card-stat">${c.text}</div>
                <div class="card-desc">${c.typeName}</div>
            `;
            el.onclick = () => equipCard(c.id, boxIndex);
            grid.appendChild(el);
        });
    }
    toggleModal('equip-modal');
}

function equipCard(cardId, boxIndex) {
    const card = cards.find(c => c.id === cardId);
    const box = boxData[boxIndex];
    if (box.equippedCard) box.equippedCard.equippedTo = null;
    card.equippedTo = boxIndex;
    box.equippedCard = card;

    updateCachedMultipliers(boxIndex);
    toggleModal('equip-modal');
    renderLayout();
    updateUI();
    saveGame();
}

function unequipCurrentBox() {
    if(equippingToBox !== null && boxData[equippingToBox].equippedCard) {
        boxData[equippingToBox].equippedCard.equippedTo = null;
        boxData[equippingToBox].equippedCard = null;
        updateCachedMultipliers(equippingToBox);
    }
    toggleModal('equip-modal');
    renderLayout();
    updateUI();
    saveGame();
}

function updateCachedMultipliers(idx) {
    const b = boxData[idx];
    let m = { value: 1, speed: 1, auto: 1, synergyBonus: 0 };
    if (b.equippedCard) {
        const c = b.equippedCard;
        const lvl = c.level || 0;
        if (c.type === 'value') m.value += (c.value / 100) + (lvl * 0.05);
        if (c.type === 'speed') m.speed += (c.value / 100) + (lvl * 0.05);
        if (c.type === 'auto') m.auto += (c.value / 100) + (lvl * 0.05);
        if (c.type === 'synergy') m.synergyBonus += c.value + (lvl * 0.2);
    }
    b.cachedMults = m;
}

function getCardMultipliers(b) {
    return b.cachedMults;
}

// --- FRENZY EVENT LOGIC ---
function getSingleBoxValue(b) {
    if (!b.active) return 0;
    const cardMults = getCardMultipliers(b);
    const talentValueMult = 1 + (talents.globalValue.level * 0.15);
    const prestigeMult = Math.pow(1.5, b.prestige);
    return Math.floor(b.inc * prestigeMult * cardMults.value * talentValueMult);
}

function getTotalBoxValue() {
    return boxData.reduce((sum, b) => sum + getSingleBoxValue(b), 0);
}

function spawnGoldenRunner() {
    if (document.querySelector('.golden-runner') || document.querySelector('.golden-frenzy-box')) return;

    const runner = document.createElement('div');
    runner.className = 'golden-runner';
    runner.style.top = (20 + Math.random() * 50) + '%';

    runner.onclick = () => catchGoldenRunner(runner);
    document.body.appendChild(runner);

    setTimeout(() => { if (runner.parentElement) runner.remove(); }, 12000);
}

function catchGoldenRunner(runnerEl) {
    spawnParticles(document.body, 'golden');
    const rect = runnerEl.getBoundingClientRect();

    const particles = document.querySelectorAll('.particle:not([style*="top"])');
    particles.forEach(p => {
        p.style.top = rect.top + 'px';
        p.style.left = rect.left + 'px';
    });

    runnerEl.remove();
    showSynergyFeedback("🌟 GOLDEN FRENZY! 🌟", "var(--high-jump)");

    const stage = document.getElementById('stage');
    const numBoxes = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const frenzyBoxes = [];

    for(let i=0; i<numBoxes; i++) {
        const box = document.createElement('div');
        box.className = 'golden-frenzy-box';
        box.style.left = (10 + Math.random() * 80) + '%';
        box.style.bottom = (10 + Math.random() * 30) + 'px';
        box.style.setProperty('--duration', '1s');

        stage.appendChild(box);
        frenzyBoxes.push(box);
    }

    let jumps = 0;
    const frenzyInterval = setInterval(() => {
        const totalVal = getTotalBoxValue();
        const rewardPerBox = totalVal > 0 ? Math.max(10, Math.floor(totalVal * 0.10)) : 10;

        frenzyBoxes.forEach((box, i) => {
            // Random delay for EVERY jump to keep them offset
            const delay = Math.random() * 400;
            
            setTimeout(() => {
                if (!box.parentElement) return; // Cleanup check
                
                box.classList.remove('jump-anim');
                void box.offsetWidth;
                box.classList.add('jump-anim');

                money += rewardPerBox;

                // Create a temporary wrapper to mimic regular box structure for positioning
                const tempWrapper = document.createElement('div');
                tempWrapper.className = 'box-wrapper';
                tempWrapper.style.position = 'absolute';
                tempWrapper.style.left = box.style.left;
                tempWrapper.style.bottom = box.style.bottom;
                tempWrapper.style.width = '40px';
                tempWrapper.style.height = '40px';
                tempWrapper.style.zIndex = '0';
                tempWrapper.style.pointerEvents = 'none';
                stage.appendChild(tempWrapper);

                const floatEl = document.createElement('div');
                floatEl.className = 'float-text';
                floatEl.style.color = 'var(--high-jump)';
                floatEl.innerText = `+$${rewardPerBox.toLocaleString()}`;
                
                tempWrapper.appendChild(floatEl);
                setTimeout(() => {
                    floatEl.remove();
                    tempWrapper.remove();
                }, 800);
            }, delay);
        });

        updateUI();

        jumps++;
        if(jumps >= 10) {
            clearInterval(frenzyInterval);
            setTimeout(() => {
                frenzyBoxes.forEach(b => {
                    if (b.parentElement) {
                        spawnParticles(b.parentElement, 'golden');
                        b.remove();
                    }
                });
            }, 1200); // Wait for the longest possible delayed jump
        }
    }, 1000);
}
// ---------------------------------

function init() {
    loadGame();

    renderLayout();
    updateUI();
    renderTalents();
    requestAnimationFrame(gameLoop);

    setInterval(saveGame, 10000);
    window.addEventListener('beforeunload', () => {
        if(!isWiping) saveGame();
    });
}

function gameLoop(currentTime) {
    const dt = currentTime - lastTime;
    lastTime = currentTime;

    // Frenzy Spawner Logic
    const baseFrenzyCooldown = 300000; // 5 mins
    const currentFrenzyCooldown = baseFrenzyCooldown / (1 + talents.frenzyFinder.level * 0.25);
    
    frenzyTimer += dt;
    if (frenzyTimer >= currentFrenzyCooldown) {
        spawnGoldenRunner();
        frenzyTimer = 0;
    }

    boxData.forEach((b, idx) => {
        if (b.active && b.auto > 0) {
            const actualAutoSpeed = b.auto / b.cachedMults.auto;
            b.autoProgress += dt / actualAutoSpeed;

            if (b.autoProgress >= 1) {
                jump(idx);
                b.autoProgress %= 1;
            }

            if (b.cachedElements && b.cachedElements.autoFill) {
                b.cachedElements.autoFill.style.width = `${b.autoProgress * 100}%`;
            }
        }
    });

    updateUI();

    requestAnimationFrame(gameLoop);
}

function getTalentCost(key) { return Math.floor(talents[key].baseCost * Math.pow(talents[key].costMult, talents[key].level)); }

function buyTalent(key) {
    const t = talents[key]; const cost = getTalentCost(key);
    if (prestigeTokens >= cost && t.level < t.maxLevel) {
        prestigeTokens -= cost;
        t.level += 1;
        renderTalents();
        updateUI();
        saveGame();
    }
}

function renderTalents() {
    const grid = document.getElementById('talent-grid'); grid.innerHTML = '';
    for (const [key, t] of Object.entries(talents)) {
        const cost = getTalentCost(key); const isMaxed = t.level >= t.maxLevel;
        const card = document.createElement('div'); card.className = `talent-card ${isMaxed ? 'maxed' : ''}`;
        card.innerHTML = `<div class="talent-title">${t.name}</div><div class="talent-level">Lvl ${t.level} / ${t.maxLevel}</div><div class="talent-desc">${t.desc}</div><button class="btn-tactile buy-talent-btn" onclick="buyTalent('${key}')" ${prestigeTokens < cost || isMaxed ? 'disabled' : ''}>${isMaxed ? 'MAXED OUT' : `Upgrade (${cost} PT)`}</button>`;
        grid.appendChild(card);
    }
    document.getElementById('modal-tokens').innerText = prestigeTokens;
}

function renderLayout() {
    const stage = document.getElementById('stage');
    const upgrades = document.getElementById('upgrades-container');

    // Rensa bara vanliga box-wrappers när vi uppdaterar layouten (inte frenzy-boxar om de snurrar)
    const existingWrappers = stage.querySelectorAll('.box-wrapper');
    existingWrappers.forEach(w => w.remove());

    upgrades.innerHTML = '';

    boxData.forEach((b, idx) => {
        if (b.active) {
            const wrapper = document.createElement('div');
            wrapper.className = 'box-wrapper';
            wrapper.id = `wrapper-${idx}`;
            wrapper.innerHTML = `<div class="box" id="box-${idx}" style="background:${b.color}" onclick="jump(${idx})"></div>`;
            stage.appendChild(wrapper);

            const col = document.createElement('div');
            col.className = 'upgrade-col';
            col.style.borderTopColor = b.color;
            const badgeHtml = b.prestige > 0 ? `<div class="prestige-badge">P${b.prestige}</div>` : '';

            let cardBadgeHtml = `<div class="card-badge" onclick="openEquipModal(${idx})">+ Card</div>`;
            if(b.equippedCard) {
                const c = b.equippedCard;
                let shortText = "";
                if(c.type === 'value') shortText = `+${c.value}% Val`;
                if(c.type === 'speed') shortText = `+${c.value}% Spd`;
                if(c.type === 'auto') shortText = `+${c.value}% Auto`;
                if(c.type === 'synergy') shortText = `+${c.value}x Syn`;

                cardBadgeHtml = `<div class="card-badge filled ${c.rarity}" onclick="openEquipModal(${idx})">${shortText}</div>`;
            }

            b.cachedElements = {}; // Clear cache when layout changes

            col.innerHTML = `
                ${cardBadgeHtml}
                <div class="col-header" style="color:${b.color}">
                    ${b.name} ${badgeHtml}
                </div>
                <div id="jump-count-${idx}" class="jumps-counter">
                    <div class="jumps-counter-fill" id="jump-fill-${idx}"></div>
                    <div class="jumps-counter-text" id="jump-text-${idx}">Jumps: 0 / 1,000</div>
                </div>
                <div id="ups-${idx}" style="display:flex; flex-direction:column; margin-top:5px;">
                    <button id="up-inc-${idx}" class="btn-tactile up-btn" onclick="buyUp(${idx},'inc')">
                        <div id="up-inc-title-${idx}">Value</div>
                        <div id="up-inc-cost-${idx}">$0</div>
                    </button>
                    <button id="up-dur-${idx}" class="btn-tactile up-btn" onclick="buyUp(${idx},'dur')">
                        <div id="up-dur-title-${idx}">Jump Speed</div>
                        <div id="up-dur-cost-${idx}">$0</div>
                    </button>
                    <button id="up-auto-${idx}" class="btn-tactile up-btn up-btn-auto" onclick="buyUp(${idx},'auto')">
                        <div class="auto-fill" id="auto-fill-${idx}"></div>
                        <div class="up-btn-content">
                            <div id="up-auto-title-${idx}">Auto-Bot</div>
                            <div id="up-auto-cost-${idx}">OFF</div>
                        </div>
                    </button>
                </div>
            `;
            upgrades.appendChild(col);
            
            // Cache elements
            b.cachedElements.box = document.getElementById(`box-${idx}`);
            b.cachedElements.jumpContainer = document.getElementById(`jump-count-${idx}`);
            b.cachedElements.jumpFill = document.getElementById(`jump-fill-${idx}`);
            b.cachedElements.jumpText = document.getElementById(`jump-text-${idx}`);
            b.cachedElements.upIncBtn = document.getElementById(`up-inc-${idx}`);
            b.cachedElements.upIncTitle = document.getElementById(`up-inc-title-${idx}`);
            b.cachedElements.upIncCost = document.getElementById(`up-inc-cost-${idx}`);
            b.cachedElements.upDurBtn = document.getElementById(`up-dur-${idx}`);
            b.cachedElements.upDurCost = document.getElementById(`up-dur-cost-${idx}`);
            b.cachedElements.upAutoBtn = document.getElementById(`up-auto-${idx}`);
            b.cachedElements.upAutoCost = document.getElementById(`up-auto-cost-${idx}`);
            b.cachedElements.autoFill = document.getElementById(`auto-fill-${idx}`);
            b.cachedElements.wrapper = document.getElementById(`wrapper-${idx}`);
        } else {
            const prevBox = boxData[idx-1];
            if (prevBox && prevBox.active) {
                const unlockCol = document.createElement('div');
                unlockCol.className = 'upgrade-col unlock-col';
                unlockCol.id = `unlock-col-${idx}`;
                unlockCol.innerHTML = `
                    <div class="unlock-fill" id="unlock-fill-${idx}"></div>
                    <div class="unlock-text">
                        <div style="text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:5px;">Unlock ${b.name}</div>
                        <div id="unlock-cost-${idx}" style="color:var(--money-green); font-size:1.2rem; font-family:var(--font-mono); font-weight:bold;">$${b.unlockCost.toLocaleString()}</div>
                    </div>
                `;
                unlockCol.onclick = () => unlockBox(idx);
                upgrades.appendChild(unlockCol);
                
                b.cachedElements.unlockCol = unlockCol;
                b.cachedElements.unlockFill = document.getElementById(`unlock-fill-${idx}`);
            }
        }

    });
}

function jump(idx) {
    const b = boxData[idx];
    const el = document.getElementById(`box-${idx}`);
    if (!el || el.classList.contains('is-jumping')) return;

    const now = Date.now();
    const cardMults = getCardMultipliers(b);
    const talentValueMult = 1 + (talents.globalValue.level * 0.15);
    const prestigeMult = Math.pow(1.5, b.prestige);

    let multiplier = 1;
    let isSynergyFound = false;

    const synergyWindow = 50 + (talents.synergy.level * 25);

    // Mutual Synergy logic: check previous jumps for adjacency and timing
    activeJumps.forEach(tj => {
        if (Math.abs(now - tj.time) < synergyWindow && Math.abs(idx - tj.idx) === 1) {
            isSynergyFound = true;

            // Give bonus to the PREVIOUS box if it hasn't received a synergy bonus for this jump yet
            if (!tj.hadSynergy) {
                tj.hadSynergy = true;
                const prevBox = boxData[tj.idx];
                const prevCardMults = getCardMultipliers(prevBox);
                const prevSynergyBonus = (2 + prevCardMults.synergyBonus);

                const extraAmount = Math.floor(tj.amountNoSynergy * (prevSynergyBonus - 1));
                money += extraAmount;
                createFloatingText(tj.idx, extraAmount, true, false);

                const prevEl = document.getElementById(`box-${tj.idx}`);
                if (prevEl) {
                    prevEl.classList.add('synergy-glow');
                    setTimeout(() => prevEl.classList.remove('synergy-glow'), 400);
                }
            }
        }
    });

    if (isSynergyFound) {
        multiplier *= (2 + cardMults.synergyBonus);
        showSynergyFeedback(`✨ SYNERGY! x${2+cardMults.synergyBonus} BONUS ✨`, "var(--synergy)");
        el.classList.add('synergy-glow');
        setTimeout(() => el.classList.remove('synergy-glow'), 400);

        if (!hasSeenSynergyTutorial) {
            hasSeenSynergyTutorial = true;
            setTimeout(() => {
                toggleModal('tutorial-modal');
                saveGame();
            }, 1000);
        }
    }

    let isHighJump = false;
    if (talents.highJump.level > 0) {
        const chance = talents.highJump.level * 0.05;
        if (Math.random() < chance) {
            isHighJump = true;
            multiplier *= 2;
        }
    }

    const amountEarned = Math.floor(b.inc * prestigeMult * multiplier * cardMults.value * talentValueMult);
    money += amountEarned;

    // Save this jump so future jumps can synergy with it
    const amountNoSynergy = Math.floor(b.inc * prestigeMult * (isHighJump ? 2 : 1) * cardMults.value * talentValueMult);
    activeJumps.push({ time: now, idx: idx, amountNoSynergy: amountNoSynergy, hadSynergy: isSynergyFound });
    if (activeJumps.length > 20) activeJumps.shift();

    const targetJumps = getPrestigeTarget(b.prestige);
    if (b.jumps < targetJumps) b.jumps += 1;

    const animClass = isHighJump ? 'high-jump-anim' : 'jump-anim';
    const actualJumpSpeed = b.dur / cardMults.speed;

    el.style.setProperty('--duration', actualJumpSpeed + 's');
    el.classList.remove('jump-anim', 'high-jump-anim', 'is-jumping');
    void el.offsetWidth;
    el.classList.add(animClass, 'is-jumping');

    createFloatingText(idx, amountEarned, isSynergyFound, isHighJump);

    setTimeout(() => {
        el.classList.remove(animClass, 'is-jumping');
    }, actualJumpSpeed * 1000);
}

function prestigeBox(idx) {
    const b = boxData[idx];
    const targetJumps = getPrestigeTarget(b.prestige);

    if (b.jumps >= targetJumps) {
        b.prestige += 1;
        b.jumps = 0;
        prestigeTokens += 1;

        b.inc = b.baseInc;
        b.incCost = b.baseIncCost;
        b.dur = b.baseDur;
        b.durCost = b.baseDurCost;

        if (talents.autoSave.level === 0) {
            b.auto = 0;
            b.autoProgress = 0;
            b.autoCost = b.baseAutoCost;
        }

        updateCachedMultipliers(idx);
        showSynergyFeedback(`🌟 ${b.name} PRESTIGED! +1 PT 🌟`, b.color);
        renderLayout();
        updateUI();
        saveGame();

        if(document.getElementById('talent-modal').classList.contains('active')) renderTalents();
    }
}

function createFloatingText(idx, amount, isSynergy, isHighJump) {
    const wrapper = document.getElementById(`wrapper-${idx}`);
    if (!wrapper) return;

    // If it's a synergy addition, try to update the most recent text for this box
    const existing = wrapper.lastElementChild;
    const isRecent = existing && (Date.now() - parseInt(existing.dataset.time || 0) < 500);

    if (isSynergy && isRecent && !isHighJump) {
        const prevAmount = parseInt(existing.dataset.amount || 0);
        const newTotal = prevAmount + amount;
        
        existing.dataset.amount = newTotal;
        existing.innerText = `+$${newTotal.toLocaleString()}`;
        existing.style.color = 'var(--synergy)';
        existing.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5), 0 2px 4px rgba(0,0,0,0.8)';
        return;
    }

    const floatEl = document.createElement('div');
    floatEl.className = 'float-text';
    floatEl.dataset.amount = amount;
    floatEl.dataset.time = Date.now();

    let text = `+$${amount.toLocaleString()}`;
    if (isHighJump) text += " ⭐";

    floatEl.innerText = text;

    if (isHighJump) {
        floatEl.style.color = 'var(--high-jump)';
        floatEl.style.textShadow = '0 0 10px rgba(250, 204, 21, 0.5), 0 2px 4px rgba(0,0,0,0.8)';
    } else if (isSynergy) {
        floatEl.style.color = 'var(--synergy)';
        floatEl.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5), 0 2px 4px rgba(0,0,0,0.8)';
    } else {
        floatEl.style.color = 'var(--money-green)';
    }

    const randomX = Math.floor(Math.random() * 40) - 20;
    floatEl.style.left = `calc(50% - 20px + ${randomX}px)`;

    wrapper.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 1400);
}

function showSynergyFeedback(text, color) {
    const msg = document.getElementById('synergy-msg');
    msg.innerText = text;
    msg.style.color = color;
    setTimeout(() => { msg.innerText = ""; msg.style.color = "var(--synergy)"; }, 1500);
}

function buyUp(idx, type) {
    const b = boxData[idx];
    if (type === 'inc' && money >= b.incCost) {
        money -= b.incCost;
        b.inc += b.baseInc;
        b.incCost = Math.round(b.incCost * 1.6);
    } else if (type === 'dur' && money >= b.durCost && b.dur > b.minDur) {
        money -= b.durCost;
        b.dur = Math.max(b.minDur, b.dur - b.durStep);
        b.durCost = Math.round(b.durCost * 2.5);
    } else if (type === 'auto' && money >= b.autoCost && (b.auto === 0 || b.auto > b.minAuto)) {
        money -= b.autoCost;
        if (b.auto === 0) {
            b.auto = b.baseAutoStart;
            b.autoProgress = 0;
        } else {
            b.auto = Math.max(b.minAuto, b.auto - b.autoStep);
        }
        b.autoCost = Math.round(b.autoCost * 2.2);
    }
    updateUI();
}

function unlockBox(idx) {
    const b = boxData[idx];
    if (money >= b.unlockCost) {
        money -= b.unlockCost;
        b.active = true;
        renderLayout();
        updateUI();
        saveGame();
    }
}

function scrapCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    pendingScrapCardId = cardId;
    const preview = document.getElementById('scrap-card-preview');
    const levelText = card.level > 0 ? `<div class="card-level">Lvl ${card.level}</div>` : '';
    
    preview.innerHTML = `
        <div class="equip-card-item ${card.rarity}" style="margin-bottom:0; width:180px;">
            ${levelText}
            <div class="card-rarity">${card.rarity}</div>
            <div class="card-stat">${card.text}</div>
            <div class="card-desc">${card.typeName}</div>
        </div>
    `;

    let dustGain = 10;
    if (card.rarity === 'rare') dustGain = 30;
    if (card.rarity === 'epic') dustGain = 100;

    let warning = `Scrap this ${card.rarity.toUpperCase()} card for <span style="color:var(--synergy);">✨ ${dustGain} Dust</span>?`;
    if (card.equippedTo !== null) {
        warning = `<span style="color:var(--accent-1); display:block; margin-bottom:5px;">⚠️ THIS CARD IS EQUIPPED!</span> ${warning}`;
    }
    
    document.getElementById('scrap-warning-text').innerHTML = warning;
    toggleModal('scrap-confirm-modal');
}

function confirmScrap() {
    if (pendingScrapCardId === null) return;
    const cardIdx = cards.findIndex(c => c.id === pendingScrapCardId);
    if (cardIdx === -1) return;

    const card = cards[cardIdx];
    if (card.equippedTo !== null) {
        boxData[card.equippedTo].equippedCard = null;
    }

    let dustGain = 10;
    if (card.rarity === 'rare') dustGain = 30;
    if (card.rarity === 'epic') dustGain = 100;

    cardDust += dustGain;
    cards.splice(cardIdx, 1);
    
    showSynergyFeedback(`✨ Scrapped for +${dustGain} Dust!`, "var(--synergy)");
    
    pendingScrapCardId = null;
    toggleModal('scrap-confirm-modal');
    renderInventory();
    renderLayout();
    updateUI();
    saveGame();
}

function getUpgradeCost(card) {
    const rMap = { 'epic': 10, 'rare': 3, 'common': 1 };
    const mult = rMap[card.rarity] || 1;
    return Math.floor(25 * Math.pow(1.5, card.level) * mult);
}

function openUpgradeModal(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    upgradingCardId = cardId;
    const preview = document.getElementById('upgrade-card-preview');
    const levelText = card.level > 0 ? `<div class="card-level">Lvl ${card.level}</div>` : '';
    
    preview.innerHTML = `
        <div class="equip-card-item ${card.rarity}" style="margin-bottom:0; width:180px;">
            ${levelText}
            <div class="card-rarity">${card.rarity}</div>
            <div class="card-stat">${card.text}</div>
            <div class="card-desc">${card.typeName}</div>
        </div>
    `;

    const cost = getUpgradeCost(card);
    document.getElementById('upgrade-dust-cost').innerText = cost;
    document.getElementById('upgrade-cost-text').innerText = `Cost: ${cost} Dust`;
    
    let bonusText = "+5% Bonus";
    if (card.type === 'synergy') bonusText = "+0.2x Bonus";
    document.getElementById('upgrade-info').innerText = `Next Level: Lvl ${card.level + 1} (${bonusText})`;

    const btn = document.getElementById('confirm-upgrade-btn');
    btn.disabled = cardDust < cost;

    toggleModal('upgrade-modal');
}

function confirmUpgrade() {
    if (upgradingCardId === null) return;
    const card = cards.find(c => c.id === upgradingCardId);
    if (!card) return;

    const cost = getUpgradeCost(card);
    if (cardDust < cost) return;

    cardDust -= cost;
    card.level += 1;

    if (card.equippedTo !== null) {
        updateCachedMultipliers(card.equippedTo);
    }

    showSynergyFeedback(`🚀 Card Upgraded to Lvl ${card.level}!`, "var(--synergy)");
    
    toggleModal('upgrade-modal');
    renderInventory();
    renderLayout();
    updateUI();
    saveGame();
}

function updateUI() {
    const moneyFloor = Math.floor(money);
    const moneyChanged = moneyFloor !== lastMoney;
    
    if (moneyChanged) {
        const moneyStr = moneyFloor.toLocaleString();
        const totalMoneyEl = document.getElementById('total-money');
        if (totalMoneyEl) totalMoneyEl.innerText = "$" + moneyStr;
        
        const shopMoney = document.getElementById('shop-money-display');
        if (shopMoney) shopMoney.innerText = "$" + moneyStr;
        lastMoney = moneyFloor;
    }
    
    const btnTokensEl = document.getElementById('btn-tokens');
    if (btnTokensEl) btnTokensEl.innerText = prestigeTokens;
    
    const dustDisplay = document.getElementById('card-dust-display');
    if (dustDisplay) dustDisplay.innerText = cardDust;

    // Shop modal specific update
    const shopModal = document.getElementById('shop-modal');
    if (shopModal && shopModal.classList.contains('active')) {
        const btn = document.getElementById('draw-card-btn');
        const actualCost = getActualCardCost();
        if (btn && !isDrawingCard) {
            btn.disabled = money < actualCost;
            btn.innerHTML = `Draw Card <span style="color:var(--bg); font-family:var(--font-mono); font-size:1rem; margin-left:5px;">$${actualCost.toLocaleString()}</span>`;
        }
    }
    
    // Upgrade modal specific update
    const upgradeModal = document.getElementById('upgrade-modal');
    if (upgradeModal && upgradeModal.classList.contains('active') && upgradingCardId !== null) {
        const card = cards.find(c => c.id === upgradingCardId);
        if (card) {
            const cost = getUpgradeCost(card);
            const btn = document.getElementById('confirm-upgrade-btn');
            if (btn) btn.disabled = cardDust < cost;
        }
    }

    boxData.forEach((b, i) => {
        const ce = b.cachedElements;
        if (!ce) return;

        if (!b.active) {
            if (ce.unlockCol) {
                const pct = Math.min(100, (money / b.unlockCost) * 100);
                if (ce.unlockFill) ce.unlockFill.style.width = `${pct}%`;
                
                if (money >= b.unlockCost) {
                    ce.unlockCol.classList.add('unlock-ready');
                } else {
                    ce.unlockCol.classList.remove('unlock-ready');
                }
            }
            return;
        }

        const targetJumps = getPrestigeTarget(b.prestige);

        if (ce.jumpContainer) {
            if (b.jumps >= targetJumps) {
                if (!ce.jumpContainer.classList.contains('prestige-ready')) {
                    ce.jumpContainer.className = "jumps-counter prestige-ready";
                    ce.jumpContainer.onclick = () => openPrestigeModal(i);
                }
                if (ce.jumpText && ce.jumpText.innerHTML !== `🌟 PRESTIGE READY! 🌟`) {
                    ce.jumpText.innerHTML = `🌟 PRESTIGE READY! 🌟`;
                }
                if (ce.jumpFill) ce.jumpFill.style.width = "0%";
            } else {
                if (ce.jumpContainer.classList.contains('prestige-ready')) {
                    ce.jumpContainer.className = "jumps-counter";
                    ce.jumpContainer.onclick = null;
                }
                const newText = `Jumps: ${b.jumps.toLocaleString()} / ${targetJumps.toLocaleString()}`;
                if (ce.jumpText && ce.jumpText.innerText !== newText) {
                    ce.jumpText.innerText = newText;
                }
                if (ce.jumpFill) {
                    const pct = Math.min(100, (b.jumps / targetJumps) * 100);
                    ce.jumpFill.style.width = `${pct}%`;
                }
            }
        }

        // Only update buttons and texts if money changed or once per frame
        if (moneyChanged) {
            const cardMults = b.cachedMults;
            const talentValueMult = 1 + (talents.globalValue.level * 0.15);
            const prestigeMult = Math.pow(1.5, b.prestige);

            // Inc button
            if (ce.upIncBtn) {
                ce.upIncBtn.disabled = money < b.incCost;
                const currentTotalValue = Math.floor(b.inc * prestigeMult * cardMults.value * talentValueMult);
                const upgradeIncrease = Math.floor(b.baseInc * prestigeMult * cardMults.value * talentValueMult);
                
                if (ce.upIncTitle) ce.upIncTitle.innerText = `Value (+$${currentTotalValue.toLocaleString()})`;
                if (ce.upIncCost) ce.upIncCost.innerHTML = `$${b.incCost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| +$${upgradeIncrease.toLocaleString()}</span>`;
            }

            // Dur button
            if (ce.upDurBtn) {
                const isMaxDur = b.dur <= b.minDur;
                ce.upDurBtn.disabled = (money < b.durCost || isMaxDur);
                const displayDur = b.dur / cardMults.speed;
                if (ce.upDurCost) {
                    if (isMaxDur && cardMults.speed === 1) ce.upDurCost.innerText = 'MAX SPEED';
                    else ce.upDurCost.innerHTML = `$${b.durCost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${displayDur.toFixed(2)}s</span>`;
                }
            }

            // Auto button
            if (ce.upAutoBtn) {
                const isMaxAuto = b.auto > 0 && b.auto <= b.minAuto;
                ce.upAutoBtn.disabled = (money < b.autoCost || isMaxAuto);
                const displayAuto = b.auto / cardMults.auto;
                if (ce.upAutoCost) {
                    if (isMaxAuto && cardMults.auto === 1) ce.upAutoCost.innerText = 'MAX SPEED';
                    else ce.upAutoCost.innerHTML = `$${b.autoCost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${b.auto === 0 ? 'OFF' : (displayAuto/1000).toFixed(2)+'s'}</span>`;
                }
            }
        }
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'm' || event.key === 'M') {
        money += 100000;
        updateUI();
        showSynergyFeedback("🛠️ DEV CHEAT: +$100,000 🛠️", "#ef4444");
    }
    if (event.key === 'j' || event.key === 'J') {
        boxData.forEach(b => { if (b.active) b.jumps = getPrestigeTarget(b.prestige); });
        updateUI();
        showSynergyFeedback("🛠️ DEV CHEAT: Max Jumps 🛠️", "#ef4444");
    }
    if (event.key === 't' || event.key === 'T') {
        prestigeTokens += 10;
        updateUI();
        if(document.getElementById('talent-modal').classList.contains('active')) renderTalents();
        showSynergyFeedback("🛠️ DEV CHEAT: +10 PT 🛠️", "var(--token-gold)");
    }
    if (event.key === 'g' || event.key === 'G') {
        spawnGoldenRunner();
        showSynergyFeedback("🛠️ DEV CHEAT: Golden Frenzy 🛠️", "var(--high-jump)");
    }
});

init();