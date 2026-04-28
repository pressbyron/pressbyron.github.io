// ============================================================
// STATE
// ============================================================
let activeJumps = [];
let lastTime = performance.now();
let pendingPrestigeBox = null;
let lastMoney = -1;
let activeStatsIdx = null;
let isWiping = false;

let synergyChainRaw = 0;
let synergyChainLastTime = 0;
const CHAIN_DECAY_MS = 1500;
const CHAIN_MAX = 10;
const CHAIN_AUTO_WEIGHT = 0.3;

let upgradeEffects = { flatIncome: 0, valuePct: 0, speedPct: 0, autoPct: 0, synergyMs: 0, synergyBonus: 0, chainBonus: 0, ghostValue: 0 };

function recomputeUpgradeEffects() {
    upgradeEffects = { flatIncome: 0, valuePct: 0, speedPct: 0, autoPct: 0, synergyMs: 0, synergyBonus: 0, chainBonus: 0, ghostValue: 0 };
    for (const id of boughtUpgrades) {
        const up = SHOP_UPGRADES.find(u => u.id === id);
        if (up) upgradeEffects[up.effect] = (upgradeEffects[up.effect] || 0) + up.value;
    }
}

function buyShopUpgrade(id) {
    if (boughtUpgrades.includes(id)) return;
    const up = SHOP_UPGRADES.find(u => u.id === id);
    if (!up || money < up.cost) return;
    money -= up.cost;
    boughtUpgrades.push(id);
    recomputeUpgradeEffects();
    selectedUpgradeId = null;
    hideSupTip(true);
    const tile = document.querySelector(`.sup-tile[data-id="${id}"]`);
    if (tile) tile.remove();
    saveGame();
}

// ============================================================
// VALUE HELPERS
// ============================================================
function getPrestigeTarget(prestigeLevel) {
    return Math.floor(1000 * Math.pow(1.1, prestigeLevel));
}

function getEvolveCost(idx) {
    return EVOLVE_BASE_COSTS[idx] * Math.pow(50, boxData[idx].evolution || 0);
}

// ============================================================
// GOLDEN FRENZY EVENT
// ============================================================
function getSingleBoxValue(b) {
    if (!b.active) return 0;
    const cardMults = getCardMultipliers(b);
    const talentValueMult = 1 + (talents.globalValue.level * 0.15);
    const prestigeMult = Math.pow(1.5, b.prestige);
    const evolutionMult = Math.pow(8, b.evolution || 0);
    const upgradeValueMult = 1 + upgradeEffects.valuePct / 100;
    return Math.floor((b.inc + talents.baseIncome.level + upgradeEffects.flatIncome) * prestigeMult * evolutionMult * cardMults.value * talentValueMult * upgradeValueMult);
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

    const slotWidth = 80 / numBoxes;
    for(let i=0; i<numBoxes; i++) {
        const container = document.createElement('div');
        container.className = 'golden-frenzy-box-container';
        const slotCenter = 10 + i * slotWidth + slotWidth * 0.5;
        const jitter = (Math.random() - 0.5) * slotWidth * 0.5;
        container.style.left = Math.max(5, Math.min(92, slotCenter + jitter)) + '%';
        container.style.bottom = (10 + Math.random() * 30) + 'px';

        const box = document.createElement('div');
        box.className = 'golden-frenzy-box';

        container.appendChild(box);
        stage.appendChild(container);
        frenzyBoxes.push(box);
    }

    setTimeout(() => {
        let jumpsCount = 0;
        const frenzyInterval = setInterval(() => {
            const totalVal = getTotalBoxValue();
            const rewardPerBox = totalVal > 0 ? Math.max(10, Math.floor(totalVal * 0.10)) : 10;

            frenzyBoxes.forEach((box, i) => {
                const delay = Math.random() * 400;

                setTimeout(() => {
                    if (!box.parentElement) return;

                    const fStartRot = parseFloat(box.dataset.rotation || '0');
                    const fEndRot = fStartRot + 90;
                    box.dataset.rotation = fEndRot;
                    box.style.setProperty('--rot-start', fStartRot + 'deg');
                    box.style.setProperty('--rot-peak', (fStartRot + 45) + 'deg');
                    box.style.setProperty('--rot-end', fEndRot + 'deg');

                    box.classList.add('is-jumping');
                    money += rewardPerBox;

                    const tempWrapper = document.createElement('div');
                    tempWrapper.className = 'box-wrapper';
                    tempWrapper.style.position = 'absolute';
                    tempWrapper.style.left = box.parentElement.style.left;
                    tempWrapper.style.bottom = box.parentElement.style.bottom;
                    tempWrapper.style.width = '40px';
                    tempWrapper.style.height = '40px';
                    tempWrapper.style.zIndex = '0';
                    tempWrapper.style.pointerEvents = 'none';
                    stage.appendChild(tempWrapper);

                    const floatEl = document.createElement('div');
                    floatEl.className = 'float-text';
                    floatEl.style.color = 'var(--high-jump)';
                    floatEl.innerText = `+$${fmt(rewardPerBox)}`;

                    tempWrapper.appendChild(floatEl);

                    setTimeout(() => {
                        box.classList.remove('is-jumping');
                        box.style.transform = `rotate(${fEndRot}deg)`;
                        floatEl.remove();
                        tempWrapper.remove();
                    }, 600);
                }, delay);
            });

            updateUI();

            jumpsCount++;
            if(jumpsCount >= 10) {
                clearInterval(frenzyInterval);
                setTimeout(() => {
                    frenzyBoxes.forEach(b => {
                        if (b.parentElement) {
                            b.style.opacity = '0';
                            spawnParticles(b.parentElement, 'golden');
                            setTimeout(() => b.parentElement.remove(), 1400);
                        }
                    });
                }, 1200);
            }
        }, 1000);
    }, 800);
}

// ============================================================
// INITIALIZATION & GAME LOOP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    loadGame();
    recomputeUpgradeEffects();

    renderLayout();
    updateUI();
    renderTalents();
    requestAnimationFrame(gameLoop);

    const moneyHeading = document.getElementById('total-money');
    if (moneyHeading && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            document.getElementById('sticky-money-bar')
                ?.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0 }).observe(moneyHeading);
    }

    setInterval(saveGame, 10000);
    setInterval(() => {
        if (typeof gtag === 'function') {
            gtag('event', 'user_engagement', { 'event_category': 'session', 'event_label': 'playing_active' });
        }
    }, 60000);
    window.addEventListener('beforeunload', () => {
        if(!isWiping) saveGame();
    });
}

function gameLoop(currentTime) {
    const dt = currentTime - lastTime;
    lastTime = currentTime;

    const baseFrenzyCooldown = 150000;
    const currentFrenzyCooldown = baseFrenzyCooldown / (1 + talents.frenzyFinder.level * 0.25);

    frenzyTimer += dt;
    if (frenzyTimer >= currentFrenzyCooldown) {
        spawnGoldenRunner();
        frenzyTimer = 0;
    }

    boxData.forEach((b, idx) => {
        if (b.active && !b.evolving && b.auto > 0 && b.autoEnabled !== false) {
            const actualAutoSpeed = b.auto / b.cachedMults.auto / (1 + upgradeEffects.autoPct / 100);
            b.autoProgress += dt / actualAutoSpeed;

            if (b.autoProgress >= 1) {
                const el = b.cachedElements.box;
                if (talents.jumpQueue.level > 0 && el && el.classList.contains('is-jumping')) {
                    b.jumpQueued = true;
                } else {
                    jump(idx, true);
                }
                b.autoProgress %= 1;
            }

            if (b.cachedElements && b.cachedElements.autoFill) {
                b.cachedElements.autoFill.style.width = `${b.autoProgress * 100}%`;
            }
            if (b.cachedElements && b.cachedElements.autoRing) {
                const ring = b.cachedElements.autoRing;
                const fill = b.cachedElements.autoRingFill;
                ring.style.display = '';
                const queued = !!b.jumpQueued;
                ring.classList.toggle('queued', queued);
                if (fill) {
                    const circumference = 47.12; // 2π × 7.5
                    fill.style.strokeDashoffset = queued ? 0 : circumference * (1 - b.autoProgress);
                }
            }
        } else if (b.cachedElements && b.cachedElements.autoRing) {
            b.cachedElements.autoRing.style.display = 'none';
        }
    });

    if (ghostBoxData.active) {
        const interval = getGhostBoxInterval();
        ghostBoxData.progress += dt / interval;
        if (ghostBoxData.progress >= 1) {
            jumpGhost();
            ghostBoxData.progress %= 1;
        }
        const ghostFill = ghostBoxData.collapsed ? document.getElementById('ghost-fill-mini') : document.getElementById('ghost-fill');
        if (ghostFill) ghostFill.style.width = `${ghostBoxData.progress * 100}%`;
    }

    if (synergyChainRaw > 0) {
        const timeSince = Date.now() - synergyChainLastTime;
        if (timeSince > CHAIN_DECAY_MS) {
            const steps = Math.floor(timeSince / CHAIN_DECAY_MS);
            synergyChainRaw = Math.max(0, synergyChainRaw - steps);
            synergyChainLastTime += steps * CHAIN_DECAY_MS;
        }
    }

    updateUI();
    requestAnimationFrame(gameLoop);
}

// ============================================================
// TALENTS & AUTO-BOT TOGGLE
// ============================================================
function getTalentCost(key) {
    return Math.floor(talents[key].baseCost * Math.pow(talents[key].costMult, talents[key].level));
}

function buyTalent(key) {
    const t = talents[key];
    const cost = getTalentCost(key);
    if (t.requires && talents[t.requires].level < 1) return;
    if (prestigeTokens >= cost && t.level < t.maxLevel) {
        prestigeTokens -= cost;
        t.level += 1;
        renderTalents();
        updateUI();
        saveGame();
    }
}

function toggleAutoBot(idx) {
    const b = boxData[idx];
    b.autoEnabled = !b.autoEnabled;
    if (!b.autoEnabled) b.autoProgress = 0;
    saveGame();
}

// ============================================================
// JUMP MECHANICS  (synergy detection, chain, income, animation)
// ============================================================
function jump(idx, isAuto) {
    const b = boxData[idx];
    if (b.evolving) return;
    const el = document.getElementById(`box-${idx}`);
    if (!el || el.classList.contains('is-jumping')) return;

    const now = Date.now();
    const cardMults = getCardMultipliers(b);
    const talentValueMult = 1 + (talents.globalValue.level * 0.15);
    const prestigeMult = Math.pow(1.5, b.prestige);
    const evolutionMult = Math.pow(8, b.evolution || 0);

    let multiplier = 1;
    let isSynergyFound = false;

    const tightWindow = 50 + (talents.synergy.level * 25) + upgradeEffects.synergyMs;
    const relaxedWindow = 200 + (talents.synergy.level * 50) + upgradeEffects.synergyMs;

    activeJumps.forEach(tj => {
        let isAdjacent = Math.abs(idx - tj.idx) === 1;

        if (idx === 0 && tj.idx === 'ghost') {
            if (now - ghostBoxData.lastSynergyTime >= getGhostBoxSynergyCooldown()) {
                isAdjacent = true;
            }
        }

        const bothAuto = isAuto && tj.isAuto;
        const baseWindow = bothAuto ? tightWindow : relaxedWindow;
        const effectiveWindow = (idx === 0 && tj.idx === 'ghost') ? baseWindow + 25 : baseWindow;

        if (Math.abs(now - tj.time) < effectiveWindow && isAdjacent) {
            isSynergyFound = true;

            if (!tj.hadSynergy) {
                tj.hadSynergy = true;

                if (tj.idx === 'ghost') {
                    ghostBoxData.lastSynergyTime = Date.now();
                    const synBonus = 2 + upgradeEffects.synergyBonus;
                    const extra = Math.floor(tj.amountNoSynergy * (synBonus - 1));
                    money += extra;
                    
                    createFloatingText('ghost', extra, true, false);
                    const gEl = document.getElementById('ghost-box');
                    if (gEl) {
                        gEl.style.setProperty('--glow-color', 'var(--synergy)');
                        gEl.classList.add('synergy-glow');
                        setTimeout(() => gEl.classList.remove('synergy-glow'), 550);
                    }
                } else {
                    const prevBox = boxData[tj.idx];
                    const prevCardMults = getCardMultipliers(prevBox);
                    const prevSynergyBonus = (2 + prevCardMults.synergyBonus + upgradeEffects.synergyBonus);

                    const extraAmount = Math.floor(tj.amountNoSynergy * (prevSynergyBonus - 1));
                    money += extraAmount;
                    
                    prevBox.totalIncome = (prevBox.totalIncome || 0) + extraAmount;
                    if (extraAmount > (prevBox.bestJump || 0)) prevBox.bestJump = extraAmount;

                    createFloatingText(tj.idx, extraAmount, true, false);

                    const prevEl = document.getElementById(`box-${tj.idx}`);
                    if (prevEl) {
                        prevEl.style.setProperty('--glow-color', prevBox.color);
                        prevEl.classList.add('synergy-glow');
                        setTimeout(() => prevEl.classList.remove('synergy-glow'), 550);
                    }
                }
            }
        }
    });

    if (isSynergyFound) {
        synergyChainRaw = Math.min(CHAIN_MAX, synergyChainRaw + (isAuto ? CHAIN_AUTO_WEIGHT : 1.0));
        synergyChainLastTime = now;
        const chainLevel = Math.floor(synergyChainRaw);
        const chainMult = 1 + chainLevel * (0.25 + upgradeEffects.chainBonus);
        multiplier *= (2 + cardMults.synergyBonus + upgradeEffects.synergyBonus) * chainMult;
        showSynergyFeedback(`✨ SYNERGY! x${(2+cardMults.synergyBonus+upgradeEffects.synergyBonus).toFixed(1)} BONUS ✨`, "var(--synergy)");
        el.style.setProperty('--glow-color', b.color);
        el.classList.add('synergy-glow');
        setTimeout(() => el.classList.remove('synergy-glow'), 550);

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

    const upgradeValueMult = 1 + upgradeEffects.valuePct / 100;
    const amountEarned = Math.floor((b.inc + talents.baseIncome.level + upgradeEffects.flatIncome) * prestigeMult * evolutionMult * multiplier * cardMults.value * talentValueMult * upgradeValueMult);
    money += amountEarned;

    b.totalIncome = (b.totalIncome || 0) + amountEarned;
    if (amountEarned > (b.bestJump || 0)) b.bestJump = amountEarned;
    b.lifetimeJumps = (b.lifetimeJumps || 0) + 1;

    const amountNoSynergy = Math.floor((b.inc + talents.baseIncome.level + upgradeEffects.flatIncome) * prestigeMult * evolutionMult * (isHighJump ? 2 : 1) * cardMults.value * talentValueMult * upgradeValueMult);
    activeJumps.push({ time: now, idx: idx, amountNoSynergy: amountNoSynergy, hadSynergy: isSynergyFound, isAuto: !!isAuto });
    if (activeJumps.length > 50) activeJumps.shift();

    const targetJumps = getPrestigeTarget(b.prestige);
    const jumpProgress = 1 + talents.jumpPrestige.level * 0.2;
    if (b.jumps < targetJumps) b.jumps = Math.min(targetJumps, b.jumps + jumpProgress);

    const animClass = isHighJump ? 'high-jump-anim' : 'jump-anim';
    const actualJumpSpeed = b.dur / cardMults.speed / (1 + upgradeEffects.speedPct / 100);
    const startRot = b.rotation || 0;
    const endRot = startRot + (isHighJump ? 180 : 90);
    
    el.style.setProperty('--duration', actualJumpSpeed + 's');
    el.style.setProperty('--rot-start', `${startRot}deg`);
    el.style.setProperty('--rot-peak', `${(startRot + endRot) / 2}deg`);
    el.style.setProperty('--rot-end', `${endRot}deg`);
    
    b.rotation = endRot;

    el.classList.remove('jump-anim', 'high-jump-anim', 'is-jumping');
    void el.offsetWidth;
    el.classList.add(animClass, 'is-jumping');

    createFloatingText(idx, amountEarned, isSynergyFound, isHighJump);

    setTimeout(() => {
        el.classList.remove(animClass, 'is-jumping');
        el.style.transform = `rotate(${endRot}deg)`;
        if (b.jumpQueued) {
            b.jumpQueued = false;
            jump(idx, true);
        }
    }, actualJumpSpeed * 1000);
}

// ============================================================
// PRESTIGE & EVOLUTION
// ============================================================
function prestigeBox(idx) {
    const b = boxData[idx];
    const targetJumps = getPrestigeTarget(b.prestige);

    if (b.jumps >= targetJumps) {
        b.prestige += 1;
        b.jumps = 0;
        prestigeTokens += 1 + talents.bonusTokens.level;

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
        
        if (typeof gtag === 'function') {
            gtag('event', 'prestige', { 'box_name': b.name, 'prestige_level': b.prestige });
        }

        renderLayout();
        updateUI();
        saveGame();

        if(document.getElementById('talent-modal').classList.contains('active')) renderTalents();
    }
}

function evolveBox(idx) {
    const b = boxData[idx];
    const cost = getEvolveCost(idx);
    if (money < cost) return;

    money -= cost;

    const el = document.getElementById(`box-${idx}`);
    if (el) {
        b.evolving = true;
        b.autoProgress = 0;
        el.classList.add('evolve-anim');
        showSynergyFeedback(`💠 ${b.name} IS EVOLVING... 💠`, "var(--accent-1)");

        setTimeout(() => {
            b.evolving = false;
            b.evolution = (b.evolution || 0) + 1;
            b.prestige = 0;
            b.jumps = 0;
            prestigeTokens += 2;

            b.inc = b.baseInc;
            b.incCost = b.baseIncCost;
            b.dur = b.baseDur;
            b.durCost = Math.round(b.baseDurCost * Math.pow(5, b.evolution));
            b.auto = 0;
            b.autoProgress = 0;
            b.autoCost = Math.round(b.baseAutoCost * Math.pow(5, b.evolution));

            updateCachedMultipliers(idx);
            showSynergyFeedback(`💠 ${b.name} EVOLVED TO E${b.evolution}! 💠`, "var(--accent-1)");

            renderLayout();
            updateUI();
            saveGame();

            const newBoxEl = document.getElementById(`box-${idx}`);
            if (newBoxEl) spawnParticles(newBoxEl.parentElement, 'epic');
        }, 1500);
    } else {
        b.evolution = (b.evolution || 0) + 1;
        b.prestige = 0;
        b.jumps = 0;
        prestigeTokens += 2;
        b.inc = b.baseInc;
        b.incCost = b.baseIncCost;
        b.dur = b.baseDur;
        b.durCost = Math.round(b.baseDurCost * Math.pow(5, b.evolution));
        b.auto = 0;
        b.autoProgress = 0;
        b.autoCost = Math.round(b.baseAutoCost * Math.pow(5, b.evolution));
        updateCachedMultipliers(idx);
        showSynergyFeedback(`💠 ${b.name} EVOLVED TO E${b.evolution}! 💠`, "var(--accent-1)");
        renderLayout();
        updateUI();
        saveGame();
    }
}

// ============================================================
// BOX UPGRADES & UNLOCK
// ============================================================
function buyUp(idx, type) {
    const b = boxData[idx];
    const btn = type === 'inc' ? b.cachedElements.upIncBtn : (type === 'dur' ? b.cachedElements.upDurBtn : b.cachedElements.upAutoBtn);

    if (type === 'inc') {
        if (money >= b.incCost) {
            money -= b.incCost;
            b.inc += b.baseInc;
            b.incCost = Math.round(b.incCost * 1.6);
        } else {
            flashError(btn);
        }
    } else if (type === 'dur') {
        const isMaxDur = b.dur <= b.minDur;
        if (money >= b.durCost && !isMaxDur) {
            money -= b.durCost;
            b.dur = Math.max(b.minDur, b.dur - b.durStep);
            b.durCost = Math.round(b.durCost * 2.5);
        } else {
            flashError(btn);
        }
    } else if (type === 'auto') {
        const isMaxAuto = b.auto > 0 && b.auto <= b.minAuto;
        if (money >= b.autoCost && !isMaxAuto) {
            money -= b.autoCost;
            if (b.auto === 0) {
                b.auto = b.baseAutoStart;
                b.autoProgress = 0;
            } else {
                b.auto = Math.max(b.minAuto, b.auto - b.autoStep);
            }
            b.autoCost = Math.round(b.autoCost * 2.2);
        } else {
            flashError(btn);
        }
    }
    updateUI();
}

function unlockBox(idx) {
    const b = boxData[idx];
    if (money >= b.unlockCost) {
        money -= b.unlockCost;
        b.active = true;
        
        if (typeof gtag === 'function') {
            gtag('event', 'unlock_box', { 'box_name': b.name });
        }

        renderLayout();
        updateUI();
        saveGame();
    } else {
        flashError(b.cachedElements.unlockCol);
    }
}


// ============================================================
// GHOST BOX  (helpers, unlock, upgrades, jump)
// Note: getGhostBoxInterval / getGhostBoxValueMult / getGhostBoxSynergyCooldown
// also exist in constants.js — game.js versions take precedence (loaded later).
// ============================================================
function getGhostBoxInterval() {
    return Math.max(200, 3000 / (1 + ghostBoxData.levelSpeed * 0.25));
}
function getGhostBoxValueMult() {
    return 0.1 + (ghostBoxData.levelValue * 0.10);
}
function getGhostBoxSynergyCooldown() {
    return Math.max(500, 5000 - (ghostBoxData.levelSynergy * 500));
}
const GHOST_SYNERGY_MAX_LEVEL = 9;
function getGhostUpCost(type) {
    const levels = { 'speed': ghostBoxData.levelSpeed, 'value': ghostBoxData.levelValue, 'synergy': ghostBoxData.levelSynergy };
    const base = type === 'value' ? 500 : 300;
    return Math.floor(base * Math.pow(2, levels[type]));
}

function unlockGhostBox() {
    if (money >= ghostBoxData.unlockCost) {
        money -= ghostBoxData.unlockCost;
        ghostBoxData.active = true;
        renderLayout();
        updateUI();
        saveGame();
    } else {
        flashError(ghostBoxData.cachedElements.unlockCol);
    }
}

function buyGhostUp(type) {
    const cost = getGhostUpCost(type);
    const btn = ghostBoxData.cachedElements[`up${type.charAt(0).toUpperCase() + type.slice(1)}`];

    if (type === 'synergy' && ghostBoxData.levelSynergy >= GHOST_SYNERGY_MAX_LEVEL) {
        flashError(btn);
        return;
    }
    if (money >= cost) {
        money -= cost;
        if (type === 'speed') ghostBoxData.levelSpeed++;
        if (type === 'value') ghostBoxData.levelValue++;
        if (type === 'synergy') ghostBoxData.levelSynergy++;
        updateUI();
        saveGame();
    } else {
        flashError(btn);
    }
}

function jumpGhost() {
    const el = document.getElementById('ghost-box');
    if (!el) return;

    const totalVal = getTotalBoxValue();
    const ghostMult = getGhostBoxValueMult() * (1 + upgradeEffects.ghostValue / 100);
    const amount = Math.max(1, Math.floor(totalVal * ghostMult));
    money += amount;
    ghostBoxData.totalIncome = (ghostBoxData.totalIncome || 0) + amount;
    ghostBoxData.totalJumps = (ghostBoxData.totalJumps || 0) + 1;
    if (amount > (ghostBoxData.bestJump || 0)) ghostBoxData.bestJump = amount;

    const ghostStartRot = ghostBoxData.rotation || 0;
    const ghostEndRot = ghostStartRot + 90;
    ghostBoxData.rotation = ghostEndRot;
    el.style.setProperty('--duration', '0.45s');
    el.style.setProperty('--rot-start', ghostStartRot + 'deg');
    el.style.setProperty('--rot-peak', (ghostStartRot + 45) + 'deg');
    el.style.setProperty('--rot-end', ghostEndRot + 'deg');

    el.classList.remove('jump-anim');
    void el.offsetWidth;
    el.classList.add('jump-anim');
    setTimeout(() => { el.classList.remove('jump-anim'); el.style.transform = `rotate(${ghostEndRot}deg)`; }, 450);

    const now = Date.now();
    let isSynergyFound = false;
    const synergyCooldown = getGhostBoxSynergyCooldown();
    if (now - ghostBoxData.lastSynergyTime >= synergyCooldown) {
        const lastJump = [...activeJumps].reverse().find(tj => tj.idx === 0);
        const tightWindow = 50 + (talents.synergy.level * 25) + upgradeEffects.synergyMs + 25;
        const relaxedWindow = 200 + (talents.synergy.level * 50) + upgradeEffects.synergyMs + 100;
        const synergyWindow = (lastJump && !lastJump.isAuto) ? relaxedWindow : tightWindow;

        if (lastJump && Math.abs(now - lastJump.time) < synergyWindow) {
            ghostBoxData.lastSynergyTime = now;
            isSynergyFound = true;

            const synBonus = 2 + upgradeEffects.synergyBonus;
            const extra = Math.floor(amount * (synBonus - 1));
            money += extra;
            ghostBoxData.totalIncome = (ghostBoxData.totalIncome || 0) + extra;
            if (amount + extra > ghostBoxData.bestJump) ghostBoxData.bestJump = amount + extra;

            if (!lastJump.hadSynergy) {
                lastJump.hadSynergy = true;
                const b1Mults = getCardMultipliers(boxData[0]);
                const b1SynBonus = (2 + b1Mults.synergyBonus);
                const b1Extra = Math.floor(lastJump.amountNoSynergy * (b1SynBonus - 1));
                money += b1Extra;
                
                boxData[0].totalIncome = (boxData[0].totalIncome || 0) + b1Extra;
                if (b1Extra > (boxData[0].bestJump || 0)) boxData[0].bestJump = b1Extra;

                createFloatingText(0, b1Extra, true, false);

                const b1El = boxData[0].cachedElements.box;
                if (b1El) {
                    b1El.style.setProperty('--glow-color', boxData[0].color);
                    b1El.classList.add('synergy-glow');
                    setTimeout(() => b1El.classList.remove('synergy-glow'), 550);
                }
            }

            synergyChainRaw = Math.min(CHAIN_MAX, synergyChainRaw + CHAIN_AUTO_WEIGHT);
            synergyChainLastTime = now;
            el.style.setProperty('--glow-color', 'var(--synergy)');
            el.classList.add('synergy-glow');
            setTimeout(() => el.classList.remove('synergy-glow'), 550);
            showSynergyFeedback("✨ GHOST SYNERGY! ✨", "var(--synergy)");
        }
    }

    createFloatingText('ghost', amount, isSynergyFound, false);
    activeJumps.push({ time: now, idx: 'ghost', amountNoSynergy: amount, hadSynergy: isSynergyFound, isAuto: true });
    if (activeJumps.length > 50) activeJumps.shift();
}

document.addEventListener('keydown', function(event) {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;

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
