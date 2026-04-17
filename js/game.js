let activeJumps = [];
let lastTime = performance.now();
let pendingPrestigeBox = null;
let lastMoney = -1;

function getPrestigeTarget(prestigeLevel) { return Math.floor(1000 * Math.pow(1.1, prestigeLevel)); }
// --- FRENZY EVENT LOGIC ---

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
        const container = document.createElement('div');
        container.className = 'golden-frenzy-box-container';
        container.style.left = (10 + Math.random() * 80) + '%';
        container.style.bottom = (10 + Math.random() * 30) + 'px';

        const box = document.createElement('div');
        box.className = 'golden-frenzy-box';
        
        container.appendChild(box);
        stage.appendChild(container);
        frenzyBoxes.push(box);
    }

    // Wait for dropIn animation (0.8s) before starting jumps
    setTimeout(() => {
        let jumps = 0;
        const frenzyInterval = setInterval(() => {
            const totalVal = getTotalBoxValue();
            const rewardPerBox = totalVal > 0 ? Math.max(10, Math.floor(totalVal * 0.10)) : 10;

            frenzyBoxes.forEach((box, i) => {
                // Random delay for EVERY jump to keep them offset
                const delay = Math.random() * 400;
                
                setTimeout(() => {
                    if (!box.parentElement) return;
                    
                    // Add is-jumping class which triggers the jumpKey animation
                    box.classList.add('is-jumping');
                    
                    money += rewardPerBox;

                    // Create a temporary wrapper to mimic regular box structure for positioning
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
                    floatEl.innerText = `+$${rewardPerBox.toLocaleString()}`;
                    
                    tempWrapper.appendChild(floatEl);
                    
                    setTimeout(() => {
                        box.classList.remove('is-jumping');
                        floatEl.remove();
                        tempWrapper.remove();
                    }, 600); // Duration matches jump duration
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
                            setTimeout(() => b.parentElement.remove(), 100);
                        }
                    });
                }, 1200);
            }
        }, 1000);
    }, 800);
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
    const baseFrenzyCooldown = 150000; // 2.5 mins
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
        let isAdjacent = Math.abs(idx - tj.idx) === 1;
        
        // Special Case: Box 0 can synergy with Ghost
        if (idx === 0 && tj.idx === 'ghost') {
            const now = Date.now();
            if (now - ghostBoxData.lastSynergyTime >= getGhostBoxSynergyCooldown()) {
                isAdjacent = true;
            }
        }

        if (Math.abs(now - tj.time) < (idx === 0 && tj.idx === 'ghost' ? synergyWindow + 25 : synergyWindow) && isAdjacent) {
            isSynergyFound = true;

            // Give bonus to the PREVIOUS box if it hasn't received a synergy bonus for this jump yet
            if (!tj.hadSynergy) {
                tj.hadSynergy = true;
                
                if (tj.idx === 'ghost') {
                    // Ghost was the first jumper
                    ghostBoxData.lastSynergyTime = Date.now();
                    const synBonus = 2;
                    const extra = Math.floor(tj.amountNoSynergy * (synBonus - 1));
                    money += extra;
                    createFloatingText('ghost', extra, true, false);
                    const gEl = document.getElementById('ghost-box');
                    if (gEl) {
                        gEl.classList.add('synergy-glow');
                        setTimeout(() => gEl.classList.remove('synergy-glow'), 400);
                    }
                } else {
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
    
    // Remove both in case the previous jump had a different type
    el.classList.remove('jump-anim', 'high-jump-anim', 'is-jumping');
    void el.offsetWidth; // Trigger reflow
    
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
        renderLayout();
        updateUI();
        saveGame();
    } else {
        flashError(b.cachedElements.unlockCol);
    }
}

function scrapCard(cardId) {
    return 3000 / (1 + ghostBoxData.levelSpeed * 0.25); // Faster jump
}
function getGhostBoxValueMult() {
    return 0.01 + (ghostBoxData.levelValue * 0.01); // Higher percentage of total
}
function getGhostBoxSynergyCooldown() {
    return 5000 - (ghostBoxData.levelSynergy * 500); // More frequent synergy
}
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
    const btn = document.getElementById(`up-ghost-${type}`);
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
    const amount = Math.max(1, Math.floor(totalVal * getGhostBoxValueMult()));
    money += amount;

    // Visual
    el.classList.remove('jump-anim');
    void el.offsetWidth;
    el.classList.add('jump-anim');

    // Synergy with Box 1
    const now = Date.now();
    let isSynergyFound = false;
    const synergyCooldown = getGhostBoxSynergyCooldown();
    if (now - ghostBoxData.lastSynergyTime >= synergyCooldown) {
        const lastJump = [...activeJumps].reverse().find(tj => tj.idx === 0);
        const synergyWindow = 50 + (talents.synergy.level * 25) + 25; // 25ms extra slack by default for ghost!
        
        if (lastJump && Math.abs(now - lastJump.time) < synergyWindow) {
            ghostBoxData.lastSynergyTime = now;
            isSynergyFound = true;
            
            // Ghost bonus
            const synBonus = 2; // Fixed x2 for ghost
            const extra = amount * (synBonus - 1);
            money += extra;
            
            // Box 1 bonus
            if (!lastJump.hadSynergy) {
                lastJump.hadSynergy = true;
                const b1Mults = getCardMultipliers(boxData[0]);
                const b1SynBonus = (2 + b1Mults.synergyBonus);
                const b1Extra = Math.floor(lastJump.amountNoSynergy * (b1SynBonus - 1));
                money += b1Extra;
                createFloatingText(0, b1Extra, true, false);
                
                const b1El = boxData[0].cachedElements.box;
                if (b1El) {
                    b1El.classList.add('synergy-glow');
                    setTimeout(() => b1El.classList.remove('synergy-glow'), 400);
                }
            }

            el.classList.add('synergy-glow');
            setTimeout(() => el.classList.remove('synergy-glow'), 400);
            showSynergyFeedback("✨ GHOST SYNERGY! ✨", "var(--synergy)");
        }
    }

    createFloatingText('ghost', amount, isSynergyFound, false);

    // Save jump for future synergy (e.g. Box 0 jumping after Ghost)
    activeJumps.push({ time: now, idx: 'ghost', amountNoSynergy: amount, hadSynergy: isSynergyFound });
    if (activeJumps.length > 20) activeJumps.shift();
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