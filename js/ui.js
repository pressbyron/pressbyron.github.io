// ============================================================
// MODALS
// ============================================================
function toggleModal(id) {
    if(typeof isDrawingCard !== 'undefined' && isDrawingCard && id === 'shop-modal') return;

    const modal = document.getElementById(id);
    if (!modal) return;
    
    if (modal.classList.contains('active')) {
        if (id === 'shop-modal' && typeof pendingDrawnCard !== 'undefined' && pendingDrawnCard) {
            collectCard();
        }
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 200);
    } else {
        modal.style.display = 'flex';
        if(id === 'shop-modal' && typeof renderInventory === 'function') renderInventory();
        if(id === 'talent-modal' && typeof renderTalents === 'function') renderTalents();
        setTimeout(() => { modal.classList.add('active'); }, 10);
    }
}

function closeModal(e, id) {
    if(typeof isDrawingCard !== 'undefined' && isDrawingCard && id === 'shop-modal') return;
    if (e.target.id === id) toggleModal(id);
}

function openPrestigeModal(idx) {
    pendingPrestigeBox = idx;
    toggleModal('prestige-modal');
}

function toggleBoxCollapse(idx) {
    const b = boxData[idx];
    b.collapsed = !b.collapsed;
    renderLayout();
    updateUI();
    saveGame();
}

function toggleGhostCollapse() {
    ghostBoxData.collapsed = !ghostBoxData.collapsed;
    renderLayout();
    updateUI();
    saveGame();
}

function dismissCardTutorial() {
    toggleModal('card-tutorial-modal');
    setTimeout(() => {
        toggleModal('shop-modal');
    }, 300);
}

function confirmPrestige() {
    if(typeof pendingPrestigeBox !== 'undefined' && pendingPrestigeBox !== null) {
        prestigeBox(pendingPrestigeBox);
        pendingPrestigeBox = null;
    }
    toggleModal('prestige-modal');
}

// ============================================================
// PARTICLES & VISUAL FEEDBACK
// ============================================================
function spawnParticles(container, rarity) {
    const palette = rarity === 'epic'
        ? ['#d8b4fe', '#c084fc', '#a855f7', '#e879f9']
        : rarity === 'rare'
        ? ['#93c5fd', '#60a5fa', '#3b82f6', '#38bdf8']
        : ['#facc15', '#fbbf24', '#f59e0b', '#fde047'];

    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const color = palette[Math.floor(Math.random() * palette.length)];
        p.style.background = color;
        p.style.color = color;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 80 + Math.random() * 150;
        p.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);
        p.style.setProperty('--size', `${3 + Math.random() * 10}px`);
        p.style.setProperty('--dur', `${0.55 + Math.random() * 0.55}s`);
        p.style.setProperty('--delay', `${Math.random() * 0.1}s`);

        container.appendChild(p);
        setTimeout(() => p.remove(), 1300);
    }
}

// ============================================================
// LAYOUT  (full DOM rebuild — call only on structural changes)
// ============================================================
function renderTalents() {
    const container = document.getElementById('talent-tree');
    if (!container) return;

    const tokenEl = document.getElementById('modal-tokens');
    if (tokenEl) tokenEl.innerText = prestigeTokens;

    function prereqMet(key) {
        const req = talents[key].requires;
        return !req || talents[req].level > 0;
    }

    function nodeHTML(key) {
        const t = talents[key];
        const cost = getTalentCost(key);
        const isMaxed = t.level >= t.maxLevel;
        const locked = !prereqMet(key);
        const canAfford = !locked && !isMaxed && prestigeTokens >= cost;
        const pips = t.maxLevel <= 1 ? '' :
            `<div class="talent-pips">${Array.from({length: t.maxLevel}, (_, i) =>
                `<div class="pip${i < t.level ? ' filled' : ''}"></div>`).join('')}</div>`;
        return `
            <div class="talent-node${isMaxed ? ' maxed' : ''}${locked ? ' locked' : ''}">
                <div class="talent-title">${t.name}</div>
                <div class="talent-desc">${t.desc}</div>
                ${pips}
                <button class="btn-tactile buy-talent-btn" onclick="buyTalent('${key}')"
                    ${!canAfford ? 'disabled' : ''}>
                    ${isMaxed ? '★ MAXED' : locked ? '🔒 Locked' : `${cost} PT`}
                </button>
            </div>`;
    }

    const fork        = `<div class="tree-fork"><div class="fork-leg"></div><div class="fork-leg"></div></div>`;
    const singleDown  = `<div class="tier-connectors"><div class="tree-down"></div></div>`;
    const singleLeft  = `<div class="tier-connectors"><div class="tree-down"></div><div class="tier-gap"></div></div>`;
    const singleRight = `<div class="tier-connectors"><div class="tier-gap"></div><div class="tree-down"></div></div>`;
    const bothDown    = `<div class="tier-connectors"><div class="tree-down"></div><div class="tree-down"></div></div>`;

    container.innerHTML = `
        <div class="talent-branches">
            <div class="talent-branch">
                <div class="branch-label">Income</div>
                <div class="tier">${nodeHTML('baseIncome')}</div>
                ${singleDown}
                <div class="tier">${nodeHTML('globalValue')}</div>
                ${fork}
                <div class="tier two-col">${nodeHTML('synergy')}${nodeHTML('frenzyFinder')}</div>
                ${singleLeft}
                <div class="tier two-col">${nodeHTML('jumpPrestige')}<div class="tier-gap"></div></div>
                ${singleLeft}
                <div class="tier two-col">${nodeHTML('autoControl')}<div class="tier-gap"></div></div>
            </div>
            <div class="branch-sep"></div>
            <div class="talent-branch">
                <div class="branch-label">Mastery</div>
                <div class="tier">${nodeHTML('highJump')}</div>
                ${fork}
                <div class="tier two-col">${nodeHTML('cheapCards')}${nodeHTML('autoSave')}</div>
                ${bothDown}
                <div class="tier two-col">${nodeHTML('luckyDraw')}${nodeHTML('bonusTokens')}</div>
                ${singleRight}
                <div class="tier two-col"><div class="tier-gap"></div>${nodeHTML('jumpQueue')}</div>
            </div>
        </div>`;
}

// ============================================================
// SHOP UPGRADES ROW
// ============================================================
let selectedUpgradeId = null;

const UP_ICONS  = { valuePct:'$', flatIncome:'+', speedPct:'⚡', autoPct:'⟳', synergyMs:'◎', synergyBonus:'✦', chainBonus:'⛓', ghostValue:'👻' };
const UP_COLORS = { valuePct:'#4ade80', flatIncome:'#fbbf24', speedPct:'#60a5fa', autoPct:'#a78bfa', synergyMs:'#fb923c', synergyBonus:'#f472b6', chainBonus:'#06b6d4', ghostValue:'#94a3b8' };

function upValStr(up) {
    if (up.effect === 'flatIncome') return `+${up.value}`;
    if (up.effect === 'synergyMs')  return `+${up.value}ms`;
    if (up.effect === 'synergyBonus' || up.effect === 'chainBonus') return `+${up.value}x`;
    return `+${up.value}%`;
}

function showSupTip(id, tileEl) {
    const tooltip = document.getElementById('sup-tooltip');
    const up = SHOP_UPGRADES.find(u => u.id === id);
    if (!tooltip || !up) return;
    const color = UP_COLORS[up.effect] || '#94a3b8';
    const canAfford = money >= up.cost;
    const isSelected = selectedUpgradeId === id;
    tooltip.innerHTML = `
        <strong style="color:${color}">${up.name}</strong>
        <span class="sup-tt-desc">${up.desc}</span>
        <span class="sup-tt-cost" style="color:${canAfford ? '#4ade80' : '#ef4444'}">$${fmt(up.cost)}</span>
        ${isSelected ? `<span class="sup-tt-hint">${canAfford ? '↑ tap again to buy' : '↑ not enough money'}</span>` : ''}`;
    tooltip.style.display = 'flex';
    const rect = tileEl.getBoundingClientRect();
    const tw = 170, th = tooltip.offsetHeight || 80;
    let top = rect.top - th - 10;
    if (top < 8) top = rect.bottom + 10;
    let left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    tooltip.style.top  = top + 'px';
    tooltip.style.left = left + 'px';
}

function hideSupTip(force) {
    if (!force && selectedUpgradeId) return;
    const tooltip = document.getElementById('sup-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

function renderShopUpgrades() {
    const row = document.getElementById('shop-upgrades-row');
    if (!row) return;
    row.innerHTML = '';
    for (const up of SHOP_UPGRADES) {
        if (boughtUpgrades.includes(up.id)) continue;
        const affordable = money >= up.cost;
        const selected   = selectedUpgradeId === up.id;
        const color      = UP_COLORS[up.effect] || '#94a3b8';
        const tile = document.createElement('div');
        tile.className = 'sup-tile' + (affordable ? ' affordable' : '') + (selected ? ' selected' : '');
        tile.dataset.id = up.id;
        tile.style.setProperty('--tile-color', color);
        tile.setAttribute('onmouseenter', `showSupTip('${up.id}', this)`);
        tile.setAttribute('onmouseleave', `hideSupTip(false)`);
        tile.setAttribute('onclick', `handleSupClick('${up.id}', this)`);
        tile.innerHTML = `<div class="sup-icon">${UP_ICONS[up.effect] || '?'}</div><div class="sup-val">${upValStr(up)}</div>`;
        row.appendChild(tile);
    }
}

function handleSupClick(id, tileEl) {
    if (boughtUpgrades.includes(id)) return;
    if (window.matchMedia('(hover: hover)').matches) {
        buyShopUpgrade(id);
        return;
    }
    // touch: first tap = show tooltip, second tap = buy
    if (selectedUpgradeId === id) {
        buyShopUpgrade(id);
        return;
    }
    selectedUpgradeId = id;
    document.querySelectorAll('.sup-tile').forEach(t => t.classList.toggle('selected', t.dataset.id === id));
    showSupTip(id, tileEl);
}

function renderLayout() {
    const stage = document.getElementById('stage');
    const upgrades = document.getElementById('upgrades-container');
    if (!stage || !upgrades) return;

    const existingWrappers = stage.querySelectorAll('.box-wrapper');
    existingWrappers.forEach(w => w.remove());

    upgrades.innerHTML = '';
    lastMoney = -1;
    renderShopUpgrades();

    if (ghostBoxData.active) {
        const ghostWrapper = document.createElement('div');
        ghostWrapper.className = 'box-wrapper';
        ghostWrapper.id = 'wrapper-ghost';
        ghostWrapper.innerHTML = `<div class="box ghost-box active" id="ghost-box"></div>`;
        stage.appendChild(ghostWrapper);
    }

    const ghostCol = document.createElement('div');
    ghostCol.className = 'upgrade-col';
    ghostCol.style.borderTopColor = '#64748b';
    
    ghostBoxData.cachedElements = {};
    
    if (!ghostBoxData.active) {
        ghostCol.className = 'upgrade-col unlock-col';
        ghostCol.id = 'ghost-unlock-col';
        ghostCol.innerHTML = `
            <div class="unlock-fill" id="ghost-unlock-fill"></div>
            <div class="unlock-text">
                <div style="text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:5px;">Unlock Ghost Box</div>
                <div style="color:var(--money-green); font-size:1.2rem; font-family:var(--font-mono); font-weight:bold;">$${fmt(ghostBoxData.unlockCost)}</div>
            </div>
        `;
        ghostCol.onclick = () => unlockGhostBox();
    } else {
        ghostCol.innerHTML = `
            <div class="col-header" style="color:#64748b">
                <button class="collapse-toggle" onclick="toggleGhostCollapse()" style="margin-right: 8px;">${ghostBoxData.collapsed ? '▼' : '▲'}</button>
                <span style="flex:1;">Ghost Box</span>
            </div>
            <div class="jumps-counter">
                <div class="jumps-counter-fill" id="ghost-sync-fill" style="background:var(--synergy); opacity:0.2;"></div>
                <div class="jumps-counter-text" id="ghost-sync-text">Synergy: Cooldown</div>
            </div>
            <div id="ghost-ups" style="display:${ghostBoxData.collapsed ? 'none' : 'flex'}; flex-direction:column; margin-top:2px;">
                <button id="up-ghost-value" class="btn-tactile up-btn" onclick="buyGhostUp('value')">
                    <div id="title-ghost-value">Ghost Value</div>
                    <div id="cost-ghost-value">$0</div>
                </button>
                <button id="up-ghost-synergy" class="btn-tactile up-btn" onclick="buyGhostUp('synergy')">
                    <div>Ghost Sync</div>
                    <div id="cost-ghost-synergy">$0</div>
                </button>
                <button id="up-ghost-speed" class="btn-tactile up-btn up-btn-auto" onclick="buyGhostUp('speed')">
                    <div class="auto-fill" id="ghost-fill"></div>
                    <div class="up-btn-content">
                        <div>Ghost Speed</div>
                        <div id="cost-ghost-speed">$0</div>
                    </div>
                </button>
            </div>
            ${ghostBoxData.collapsed ? `
                <div class="mini-auto-container">
                    <div class="auto-fill" id="ghost-fill-mini"></div>
                </div>
            ` : ''}
            <div style="text-align:center;">
                <button onclick="openStats('ghost')" style="background:none; border:none; color:var(--text-dim); font-size:0.6rem; cursor:pointer; font-family:var(--font-ui); font-weight:800; text-transform:uppercase; letter-spacing:1px; padding:2px 4px; opacity:0.4;">Stats</button>
            </div>
        `;
    }
    upgrades.appendChild(ghostCol);

    if (!ghostBoxData.active) {
        ghostBoxData.cachedElements.unlockCol = ghostCol;
        ghostBoxData.cachedElements.unlockFill = document.getElementById('ghost-unlock-fill');
    }

    boxData.forEach((b, idx) => {
        if (b.active) {
            const wrapper = document.createElement('div');
            wrapper.className = 'box-wrapper';
            wrapper.id = `wrapper-${idx}`;
            
            const evolutionClass = b.evolution ? `evolution-${b.evolution}` : '';
            wrapper.innerHTML = `
                <div class="box box-${idx} ${evolutionClass}" id="box-${idx}" onclick="jump(${idx})">
                    <img src="images/face_${String.fromCharCode(97 + idx)}.png" class="box-face">
                </div>
                <svg class="auto-ring ring-${idx}" id="auto-ring-${idx}" viewBox="0 0 20 20" style="display:none">
                    <circle class="auto-ring-bg" cx="10" cy="10" r="7.5"/>
                    <circle class="auto-ring-fill" id="auto-ring-fill-${idx}" cx="10" cy="10" r="7.5"/>
                </svg>
            `;
            stage.appendChild(wrapper);

            const col = document.createElement('div');
            col.className = 'upgrade-col';
            col.style.borderTopColor = b.color;
            const badgeHtml = b.prestige > 0 ? `<div class="prestige-badge">P${b.prestige}</div>` : '';
            const evolutionBadgeHtml = b.evolution > 0 ? `<div class="prestige-badge" style="background:var(--accent-1); margin-left:4px;">E${b.evolution}</div>` : '';

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

            b.cachedElements = {};

            col.innerHTML = `
                ${cardBadgeHtml}
                <div class="col-header" style="color:${b.color}">
                    <button class="collapse-toggle" onclick="toggleBoxCollapse(${idx})" style="margin-right: 8px;">${b.collapsed ? '▼' : '▲'}</button>
                    <span style="flex:1;">${b.name} ${badgeHtml}${evolutionBadgeHtml}</span>
                </div>
                <div id="jump-count-${idx}" class="jumps-counter">
                    <div class="jumps-counter-fill" id="jump-fill-${idx}"></div>
                    <div class="jumps-counter-text" id="jump-text-${idx}">Jumps: 0 / 1,000</div>
                </div>
                <div id="ups-${idx}" style="display:${b.collapsed ? 'none' : 'flex'}; flex-direction:column; margin-top:2px;">
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
                        <div id="auto-toggle-${idx}" class="auto-toggle-pill" onclick="event.stopPropagation(); toggleAutoBot(${idx})" style="display:none;">
                            <span id="auto-toggle-label-${idx}">ON</span>
                        </div>
                    </button>
                </div>
                ${b.collapsed ? `
                    <div class="mini-auto-container">
                        <div class="auto-fill" id="auto-fill-mini-${idx}"></div>
                    </div>
                ` : ''}
                <button id="up-evolve-${idx}" class="btn-tactile up-btn up-btn-evolve" onclick="evolveBox(${idx})">
                    <div class="evolve-fill" id="evolve-fill-${idx}"></div>
                    <div class="up-btn-content">
                        <div id="up-evolve-title-${idx}">Evolve 💠${b.evolution > 0 ? ` (E${b.evolution}→E${b.evolution+1})` : ''}</div>
                        <div id="up-evolve-cost-${idx}">$0</div>
                    </div>
                </button>
                <div style="text-align:center;">
                    <button onclick="openStats(${idx})" style="background:none; border:none; color:var(--text-dim); font-size:0.6rem; cursor:pointer; font-family:var(--font-ui); font-weight:800; text-transform:uppercase; letter-spacing:1px; padding:2px 4px; opacity:0.4;">Stats</button>
                </div>
            `;
            upgrades.appendChild(col);
            
            b.cachedElements.box = document.getElementById(`box-${idx}`);
            b.cachedElements.jumpContainer = document.getElementById(`jump-count-${idx}`);
            b.cachedElements.jumpFill = document.getElementById(`jump-fill-${idx}`);
            b.cachedElements.jumpText = document.getElementById(`jump-text-${idx}`);
            b.cachedElements.upIncBtn = document.getElementById(`up-inc-${idx}`);
            b.cachedElements.upIncTitle = document.getElementById(`up-inc-title-${idx}`);
            b.cachedElements.upIncCost = document.getElementById(`up-inc-cost-${idx}`);
            b.cachedElements.upDurBtn = document.getElementById(`up-dur-${idx}`);
            b.cachedElements.upDurTitle = document.getElementById(`up-dur-title-${idx}`);
            b.cachedElements.upDurCost = document.getElementById(`up-dur-cost-${idx}`);
            b.cachedElements.upAutoBtn = document.getElementById(`up-auto-${idx}`);
            b.cachedElements.upAutoTitle = document.getElementById(`up-auto-title-${idx}`);
            b.cachedElements.upAutoCost = document.getElementById(`up-auto-cost-${idx}`);
            b.cachedElements.autoFill = b.collapsed ? document.getElementById(`auto-fill-mini-${idx}`) : document.getElementById(`auto-fill-${idx}`);
            b.cachedElements.autoToggleBtn = document.getElementById(`auto-toggle-${idx}`);
            b.cachedElements.autoToggleLabel = document.getElementById(`auto-toggle-label-${idx}`);
            b.cachedElements.wrapper = document.getElementById(`wrapper-${idx}`);
            b.cachedElements.autoRing = document.getElementById(`auto-ring-${idx}`);
            b.cachedElements.autoRingFill = document.getElementById(`auto-ring-fill-${idx}`);
            b.cachedElements.upEvolveBtn = document.getElementById(`up-evolve-${idx}`);
            b.cachedElements.upEvolveTitle = document.getElementById(`up-evolve-title-${idx}`);
            b.cachedElements.upEvolveCost = document.getElementById(`up-evolve-cost-${idx}`);
            b.cachedElements.upEvolveFill = document.getElementById(`evolve-fill-${idx}`);
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
                        <div id="unlock-cost-${idx}" style="color:var(--money-green); font-size:1.2rem; font-family:var(--font-mono); font-weight:bold;">$${fmt(b.unlockCost)}</div>
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

// ============================================================
// FLOATING TEXT & SYNERGY FEEDBACK
// ============================================================
function createFloatingText(idx, amount, isSynergy, isHighJump) {
    const wrapper = idx === 'ghost' ? document.getElementById('wrapper-ghost') : document.getElementById(`wrapper-${idx}`);
    if (!wrapper) return;

    const existing = wrapper.lastElementChild;
    const isRecent = existing && (Date.now() - parseInt(existing.dataset.time || 0) < 500);

    if (isSynergy && isRecent && !isHighJump) {
        const prevAmount = parseInt(existing.dataset.amount || 0);
        const newTotal = prevAmount + amount;
        
        existing.dataset.amount = newTotal;
        existing.innerText = `+$${fmt(newTotal)}`;
        existing.style.color = 'var(--synergy)';
        existing.style.textShadow = '0 0 10px rgba(34, 211, 238, 0.5), 0 2px 4px rgba(0,0,0,0.8)';
        return;
    }

    const floatEl = document.createElement('div');
    floatEl.className = 'float-text';
    floatEl.dataset.amount = amount;
    floatEl.dataset.time = Date.now();

    let text = `+$${fmt(amount)}`;
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
    if (!msg) return;
    msg.innerText = text;
    msg.style.color = color;
    setTimeout(() => { msg.innerText = ""; msg.style.color = "var(--synergy)"; }, 1500);
}

function flashError(el) {
    if (!el) return;
    el.classList.remove('error-flash');
    void el.offsetWidth; 
    el.classList.add('error-flash');
    setTimeout(() => el.classList.remove('error-flash'), 400);
}

// ============================================================
// STATS MODAL
// ============================================================
function openStats(idx) {
    activeStatsIdx = idx;
    const isGhost = idx === 'ghost';
    const b = isGhost ? ghostBoxData : boxData[idx];
    const statsBoxName = document.getElementById('stats-box-name');
    if (statsBoxName) {
        statsBoxName.innerText = isGhost ? 'Ghost Box Statistics' : `${b.name} Statistics`;
        statsBoxName.style.color = isGhost ? '#64748b' : b.color;
    }

    const totalLifetimeIncome = boxData.reduce((sum, box) => sum + (box.totalIncome || 0), 0) + (ghostBoxData.totalIncome || 0);
    const myIncome = b.totalIncome || 0;
    const percent = totalLifetimeIncome > 0 ? ((myIncome / totalLifetimeIncome) * 100).toFixed(1) : 0;

    const statsContent = document.getElementById('stats-content');
    if (statsContent) {
        const jumpsVal = isGhost ? (b.totalJumps || 0) : (b.lifetimeJumps || 0);
        const prestigeRow = isGhost ? '' : `<div class="stat-row"><span>Times Prestiged</span><strong id="stat-prestige">${b.prestige.toLocaleString()}</strong></div>`;
        statsContent.innerHTML = `
            <div class="stat-row"><span>Total Jumps</span><strong id="stat-jumps">${jumpsVal.toLocaleString()}</strong></div>
            ${prestigeRow}
            <div class="stat-row"><span>Total Income</span><strong style="color:var(--money-green)">$<span id="stat-income">${fmt(myIncome)}</span></strong></div>
            <div class="stat-row"><span>Income Share</span><strong id="stat-percent">${percent}%</strong></div>
            <div class="stat-row"><span>Best Single Jump</span><strong style="color:var(--synergy)">$<span id="stat-best">${fmt(b.bestJump || 0)}</span></strong></div>
        `;
    }

    toggleModal('stats-modal');
}

// ============================================================
// PER-FRAME UPDATE  (runs every rAF — touch only cached elements)
// Subsections: money/tokens → shop modal → upgrade modal →
//              stats modal → ghost box → chain bar → per-box loop
// ============================================================
function updateUI() {
    const moneyFloor = Math.floor(money);
    const moneyChanged = moneyFloor !== lastMoney;
    
    if (moneyChanged) {
        const moneyStr = fmt(moneyFloor);
        const totalMoneyEl = document.getElementById('total-money');
        if (totalMoneyEl) totalMoneyEl.innerText = "$" + moneyStr;

        const shopMoney = document.getElementById('shop-money-display');
        if (shopMoney) shopMoney.innerText = "$" + moneyStr;

        const stickyText = document.getElementById('sticky-money-text');
        if (stickyText) stickyText.innerText = "$" + moneyStr;
        lastMoney = moneyFloor;

        document.querySelectorAll('.sup-tile').forEach(tile => {
            const up = SHOP_UPGRADES.find(u => u.id === tile.dataset.id);
            if (up) tile.classList.toggle('affordable', money >= up.cost);
        });
    }
    
    const btnTokensEl = document.getElementById('btn-tokens');
    if (btnTokensEl) btnTokensEl.innerText = prestigeTokens;
    
    const talentBtn = document.querySelector('.talent-btn');
    if (talentBtn) {
        const anyAffordable = Object.keys(talents).some(key => {
            const t = talents[key];
            const req = t.requires;
            const prereqOk = !req || talents[req].level > 0;
            return prereqOk && t.level < t.maxLevel && prestigeTokens >= getTalentCost(key);
        });
        if (anyAffordable) talentBtn.classList.add('can-afford');
        else talentBtn.classList.remove('can-afford');
    }
    
    const cardShopFill = document.getElementById('card-shop-fill');
    if (cardShopFill) {
        const cost = typeof getActualCardCost === 'function' ? getActualCardCost() : 1000;
        const pct = Math.min(100, (money / cost) * 100);
        cardShopFill.style.width = `${pct}%`;
        
        if (money >= cost && typeof hasSeenCardTutorial !== 'undefined' && !hasSeenCardTutorial) {
            hasSeenCardTutorial = true;
            setTimeout(() => {
                toggleModal('card-tutorial-modal');
                saveGame();
            }, 500);
        }
    }
    
    const dustDisplay = document.getElementById('card-dust-display');
    if (dustDisplay) dustDisplay.innerText = cardDust;

    // --- shop modal ---
    const shopModal = document.getElementById('shop-modal');
    if (shopModal && shopModal.classList.contains('active')) {
        const btn = document.getElementById('card-action-btn');
        const actualCost = typeof getActualCardCost === 'function' ? getActualCardCost() : 0;
        if (btn && typeof isDrawingCard !== 'undefined' && !isDrawingCard && typeof pendingDrawnCard !== 'undefined' && !pendingDrawnCard) {
            const targetedType = typeof selectedTargetType !== 'undefined' ? selectedTargetType : null;
            const displayCost = targetedType ? actualCost * 3 : actualCost;
            const canAfford = money >= displayCost;
            btn.disabled = !canAfford;
            if (!canAfford) btn.classList.add('disabled-btn'); else btn.classList.remove('disabled-btn');
            btn.innerHTML = `Draw Card <span style="color:var(--bg); font-family:var(--font-mono); font-size:1rem; margin-left:5px;">$${fmt(displayCost)}</span>`;
        }
    }
    
    // --- upgrade modal ---
    const upgradeModal = document.getElementById('upgrade-modal');
    if (upgradeModal && upgradeModal.classList.contains('active') && typeof upgradingCardId !== 'undefined' && upgradingCardId !== null) {
        const card = cards.find(c => c.id === upgradingCardId);
        if (card) {
            const cost = typeof getUpgradeCost === 'function' ? getUpgradeCost(card) : 0;
            const btn = document.getElementById('confirm-upgrade-btn');
            if (btn) btn.disabled = cardDust < cost;
        }
    }

    // --- stats modal ---
    const statsModal = document.getElementById('stats-modal');
    if (statsModal && statsModal.classList.contains('active') && activeStatsIdx !== null) {
        const isGhost = activeStatsIdx === 'ghost';
        const b = isGhost ? ghostBoxData : boxData[activeStatsIdx];
        const totalLifetimeIncome = boxData.reduce((sum, box) => sum + (box.totalIncome || 0), 0) + (ghostBoxData.totalIncome || 0);
        const myIncome = b.totalIncome || 0;
        const percent = totalLifetimeIncome > 0 ? ((myIncome / totalLifetimeIncome) * 100).toFixed(1) : 0;

        const statJumps = document.getElementById('stat-jumps');
        const statPrestige = document.getElementById('stat-prestige');
        const statIncome = document.getElementById('stat-income');
        const statPercent = document.getElementById('stat-percent');
        const statBest = document.getElementById('stat-best');

        const jumpsVal = isGhost ? (b.totalJumps || 0) : (b.lifetimeJumps || 0);
        if (statJumps) statJumps.innerText = jumpsVal.toLocaleString();
        if (statPrestige && !isGhost) statPrestige.innerText = b.prestige.toLocaleString();
        if (statIncome) statIncome.innerText = fmt(myIncome);
        if (statPercent) statPercent.innerText = percent + '%';
        if (statBest) statBest.innerText = fmt(b.bestJump || 0);
    }

    // --- ghost box ---
    if (!ghostBoxData.active) {
        const ce = ghostBoxData.cachedElements;
        if (ce && ce.unlockCol) {
            const pct = Math.min(100, (money / ghostBoxData.unlockCost) * 100);
            if (ce.unlockFill) ce.unlockFill.style.width = `${pct}%`;
            
            if (money >= ghostBoxData.unlockCost) {
                ce.unlockCol.classList.add('unlock-ready');
            } else {
                ce.unlockCol.classList.remove('unlock-ready');
            }
        }
    } else {
        const syncFill = document.getElementById('ghost-sync-fill');
        const syncText = document.getElementById('ghost-sync-text');
        if (syncFill && syncText) {
            const now = Date.now();
            const cooldown = getGhostBoxSynergyCooldown();
            const elapsed = now - ghostBoxData.lastSynergyTime;
            const pct = Math.min(100, (elapsed / cooldown) * 100);
            syncFill.style.width = `${pct}%`;
            syncText.innerText = pct >= 100 ? "SYNERGY READY" : "Synergy: Cooldown";
            
            const gEl = document.getElementById('ghost-box');
            if (gEl) {
                if (pct >= 100) gEl.classList.add('synergy-ready');
                else gEl.classList.remove('synergy-ready');
            }
        }

        const upSpeed = document.getElementById('up-ghost-speed');
        if (upSpeed) {
            const cost = getGhostUpCost('speed');
            if (money < cost) upSpeed.classList.add('disabled-btn');
            else upSpeed.classList.remove('disabled-btn');
            const costGhostSpeed = document.getElementById('cost-ghost-speed');
            if (costGhostSpeed) costGhostSpeed.innerHTML = `$${fmt(cost)} <span style="color:var(--text-dim); font-size:0.7rem;">| ${(getGhostBoxInterval()/1000).toFixed(1)}s</span>`;
        }
        const upValue = document.getElementById('up-ghost-value');
        if (upValue) {
            const cost = getGhostUpCost('value');
            if (money < cost) upValue.classList.add('disabled-btn');
            else upValue.classList.remove('disabled-btn');
            const ghostUpgradeMult = 1 + upgradeEffects.ghostValue / 100;
            const effectivePct = (getGhostBoxValueMult() * ghostUpgradeMult * 100).toFixed(0);
            const deltaPct = (0.10 * ghostUpgradeMult * 100).toFixed(0);
            const titleGhostValue = document.getElementById('title-ghost-value');
            if (titleGhostValue) titleGhostValue.innerText = `Ghost Value (${effectivePct}%)`;
            const costGhostValue = document.getElementById('cost-ghost-value');
            if (costGhostValue) costGhostValue.innerHTML = `$${fmt(cost)} <span style="color:#60a5fa; font-size:0.7rem;">+${deltaPct}%</span>`;
        }
        const upSync = document.getElementById('up-ghost-synergy');
        if (upSync) {
            const isMaxSync = ghostBoxData.levelSynergy >= GHOST_SYNERGY_MAX_LEVEL;
            const cost = getGhostUpCost('synergy');
            if (isMaxSync || money < cost) upSync.classList.add('disabled-btn');
            else upSync.classList.remove('disabled-btn');
            const costGhostSynergy = document.getElementById('cost-ghost-synergy');
            if (costGhostSynergy) costGhostSynergy.innerHTML = isMaxSync
                ? `MAX SYNC`
                : `$${fmt(cost)} <span style="color:var(--text-dim); font-size:0.7rem;">| ${(getGhostBoxSynergyCooldown()/1000).toFixed(1)}s</span>`;
        }
    }

    // --- chain bar ---
    const chainFill = document.getElementById('chain-bar-fill');
    const chainDecay = document.getElementById('chain-bar-decay');
    const chainLabel = document.getElementById('chain-bar-label');
    const chainContainer = document.getElementById('chain-bar-container');
    if (chainFill && chainDecay && chainContainer) {
        const chainNow = Date.now();
        const chainLevel = Math.floor(synergyChainRaw);
        const chainPct = Math.min(synergyChainRaw / CHAIN_MAX, 1) * 100;
        const timeLeft = synergyChainRaw > 0
            ? Math.max(0, 1 - (chainNow - synergyChainLastTime) / CHAIN_DECAY_MS)
            : 0;
        chainFill.style.height = chainPct + '%';
        chainDecay.style.height = (timeLeft * chainPct) + '%';
        if (chainLabel) {
            chainLabel.textContent = chainLevel >= 1
                ? `×${(1 + chainLevel * (0.25 + upgradeEffects.chainBonus)).toFixed(2)}`
                : '⛓';
        }
        let chainColor, chainGlow;
        if (chainLevel >= 9)      { chainColor = '#ca8a04'; chainGlow = '#facc15'; }
        else if (chainLevel >= 6) { chainColor = '#c2410c'; chainGlow = '#f97316'; }
        else if (chainLevel >= 3) { chainColor = '#7c3aed'; chainGlow = '#c084fc'; }
        else                      { chainColor = '#1d4ed8'; chainGlow = '#60a5fa'; }
        chainContainer.style.setProperty('--chain-color', chainColor);
        chainContainer.style.setProperty('--chain-glow', chainGlow);
    }

    // --- per-box loop (jumps counter, upgrade buttons, auto-toggle) ---
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
                if (ce.jumpText && ce.jumpText.innerHTML !== `PRESTIGE READY`) {
                    ce.jumpText.innerHTML = `PRESTIGE READY`;
                }
                if (ce.jumpFill) ce.jumpFill.style.width = "0%";
            } else {
                if (ce.jumpContainer.classList.contains('prestige-ready')) {
                    ce.jumpContainer.className = "jumps-counter";
                    ce.jumpContainer.onclick = null;
                }
                const displayJumps = Math.floor(b.jumps);
                const newText = `Jumps: ${displayJumps.toLocaleString()} / ${targetJumps.toLocaleString()}`;
                if (ce.jumpText && ce.jumpText.innerText !== newText) {
                    ce.jumpText.innerText = newText;
                }
                if (ce.jumpFill) {
                    const pct = Math.min(100, (displayJumps / targetJumps) * 100);
                    ce.jumpFill.style.width = `${pct}%`;
                }
            }
        }

        if (moneyChanged) {
            const cardMults = b.cachedMults;
            const talentValueMult = 1 + (talents.globalValue.level * 0.15);
            const prestigeMult = Math.pow(1.5, b.prestige);

            if (ce.upIncBtn) {
                if (money < b.incCost) ce.upIncBtn.classList.add('disabled-btn');
                else ce.upIncBtn.classList.remove('disabled-btn');

                const evolutionMult = Math.pow(8, b.evolution || 0);
                const baseIncBonus = talents.baseIncome.level;
                const upgradeValueMult = 1 + upgradeEffects.valuePct / 100;
                const currentTotalValue = Math.floor((b.inc + baseIncBonus + upgradeEffects.flatIncome) * prestigeMult * evolutionMult * cardMults.value * talentValueMult * upgradeValueMult);
                const upgradeIncrease = Math.floor(b.baseInc * prestigeMult * evolutionMult * cardMults.value * talentValueMult * upgradeValueMult);

                if (ce.upIncTitle) ce.upIncTitle.innerText = `Value ($${fmt(currentTotalValue)})`;
                if (ce.upIncCost) ce.upIncCost.innerHTML = `$${fmt(b.incCost)} <span style="color:#60a5fa; font-size:0.7rem;">+$${fmt(upgradeIncrease)}</span>`;
            }

            if (ce.upDurBtn) {
                const isMaxDur = b.dur <= b.minDur;
                if (money < b.durCost || isMaxDur) ce.upDurBtn.classList.add('disabled-btn');
                else ce.upDurBtn.classList.remove('disabled-btn');

                const speedMult = cardMults.speed * (1 + upgradeEffects.speedPct / 100);
                const displayDur = b.dur / speedMult;
                if (ce.upDurTitle) ce.upDurTitle.innerText = `Jump Speed (${displayDur.toFixed(2)}s)`;
                if (ce.upDurCost) {
                    if (isMaxDur) ce.upDurCost.innerText = 'MAX SPEED';
                    else ce.upDurCost.innerHTML = `$${fmt(b.durCost)} <span style="color:#60a5fa; font-size:0.7rem;">-${(b.durStep / speedMult).toFixed(2)}s</span>`;
                }
            }

            if (ce.upAutoBtn) {
                const isMaxAuto = b.auto > 0 && b.auto <= b.minAuto;
                if (money < b.autoCost || isMaxAuto) ce.upAutoBtn.classList.add('disabled-btn');
                else ce.upAutoBtn.classList.remove('disabled-btn');

                const autoMult = cardMults.auto * (1 + upgradeEffects.autoPct / 100);
                const displayAuto = b.auto > 0 ? b.auto / autoMult : 0;
                const autoLabel = b.auto === 0 ? 'OFF' : `${(displayAuto / 1000).toFixed(2)}s`;
                if (ce.upAutoTitle) ce.upAutoTitle.innerText = `Auto-Bot (${autoLabel})`;
                if (ce.upAutoCost) {
                    if (isMaxAuto) ce.upAutoCost.innerText = 'MAX SPEED';
                    else if (b.auto === 0) ce.upAutoCost.innerHTML = `$${fmt(b.autoCost)} <span style="color:#60a5fa; font-size:0.7rem;">→ ${(b.baseAutoStart / autoMult / 1000).toFixed(2)}s</span>`;
                    else ce.upAutoCost.innerHTML = `$${fmt(b.autoCost)} <span style="color:#60a5fa; font-size:0.7rem;">-${(b.autoStep / autoMult / 1000).toFixed(2)}s</span>`;
                }
            }

            if (ce.upEvolveBtn) {
                const evolveCost = getEvolveCost(i);
                const canEvolve = money >= evolveCost;
                if (canEvolve) ce.upEvolveBtn.classList.remove('disabled-btn');
                else ce.upEvolveBtn.classList.add('disabled-btn');
                if (ce.upEvolveCost) ce.upEvolveCost.innerText = `$${fmt(evolveCost)}`;
                if (ce.upEvolveFill) {
                    const pct = Math.min(100, (money / evolveCost) * 100);
                    ce.upEvolveFill.style.width = `${pct}%`;
                }
            }

        }

        if (ce.autoToggleBtn) {
            const showToggle = talents.autoControl.level > 0 && b.auto > 0;
            ce.autoToggleBtn.style.display = showToggle ? '' : 'none';
            if (showToggle && ce.autoToggleLabel) {
                const on = b.autoEnabled !== false;
                ce.autoToggleBtn.style.background = on ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)';
                ce.autoToggleBtn.style.borderColor = on ? '#16a34a' : 'var(--border)';
                ce.autoToggleLabel.textContent = on ? 'ON' : 'OFF';
                ce.autoToggleLabel.style.color = on ? '#4ade80' : 'var(--text-dim)';
            }
        }
    });
}
