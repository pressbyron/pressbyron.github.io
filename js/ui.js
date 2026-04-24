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

function renderTalents() {
    const grid = document.getElementById('talent-grid'); 
    if (!grid) return;
    grid.innerHTML = '';
    
    for (const [key, t] of Object.entries(talents)) {
        const cost = getTalentCost(key); 
        const isMaxed = t.level >= t.maxLevel;
        const card = document.createElement('div'); 
        card.className = `talent-card ${isMaxed ? 'maxed' : ''}`;
        card.innerHTML = `
            <div class="talent-title">${t.name}</div>
            <div class="talent-level">Lvl ${t.level} / ${t.maxLevel}</div>
            <div class="talent-desc">${t.desc}</div>
            <button class="btn-tactile buy-talent-btn" onclick="buyTalent('${key}')" ${prestigeTokens < cost || isMaxed ? 'disabled' : ''}>
                ${isMaxed ? 'MAXED OUT' : `Upgrade (${cost} PT)`}
            </button>
        `;
        grid.appendChild(card);
    }
    const tokenEl = document.getElementById('modal-tokens');
    if (tokenEl) tokenEl.innerText = prestigeTokens;
}

function renderLayout() {
    const stage = document.getElementById('stage');
    const upgrades = document.getElementById('upgrades-container');
    if (!stage || !upgrades) return;

    const existingWrappers = stage.querySelectorAll('.box-wrapper');
    existingWrappers.forEach(w => w.remove());

    upgrades.innerHTML = '';
    lastMoney = -1;

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
                <div style="color:var(--money-green); font-size:1.2rem; font-family:var(--font-mono); font-weight:bold;">$${ghostBoxData.unlockCost.toLocaleString()}</div>
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
            <div id="ghost-ups" style="display:${ghostBoxData.collapsed ? 'none' : 'flex'}; flex-direction:column; margin-top:5px;">
                <button id="up-ghost-value" class="btn-tactile up-btn" onclick="buyGhostUp('value')">
                    <div>Ghost Value</div>
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
                <div id="ups-${idx}" style="display:${b.collapsed ? 'none' : 'flex'}; flex-direction:column; margin-top:5px;">
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
            b.cachedElements.upDurCost = document.getElementById(`up-dur-cost-${idx}`);
            b.cachedElements.upAutoBtn = document.getElementById(`up-auto-${idx}`);
            b.cachedElements.upAutoCost = document.getElementById(`up-auto-cost-${idx}`);
            b.cachedElements.autoFill = b.collapsed ? document.getElementById(`auto-fill-mini-${idx}`) : document.getElementById(`auto-fill-${idx}`);
            b.cachedElements.autoToggleBtn = document.getElementById(`auto-toggle-${idx}`);
            b.cachedElements.autoToggleLabel = document.getElementById(`auto-toggle-label-${idx}`);
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

function createFloatingText(idx, amount, isSynergy, isHighJump) {
    const wrapper = idx === 'ghost' ? document.getElementById('wrapper-ghost') : document.getElementById(`wrapper-${idx}`);
    if (!wrapper) return;

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

function openStats(idx) {
    activeStatsIdx = idx;
    const b = boxData[idx];
    const statsBoxName = document.getElementById('stats-box-name');
    if (statsBoxName) {
        statsBoxName.innerText = `${b.name} Statistics`;
        statsBoxName.style.color = b.color;
    }
    
    const totalLifetimeIncome = boxData.reduce((sum, box) => sum + (box.totalIncome || 0), 0);
    const percent = totalLifetimeIncome > 0 ? ((b.totalIncome / totalLifetimeIncome) * 100).toFixed(1) : 0;

    const statsContent = document.getElementById('stats-content');
    if (statsContent) {
        statsContent.innerHTML = `
            <div class="stat-row"><span>Total Jumps</span><strong id="stat-jumps">${b.jumps.toLocaleString()}</strong></div>
            <div class="stat-row"><span>Times Prestiged</span><strong id="stat-prestige">${b.prestige.toLocaleString()}</strong></div>
            <div class="stat-row"><span>Total Income</span><strong style="color:var(--money-green)">$<span id="stat-income">${(b.totalIncome || 0).toLocaleString()}</span></strong></div>
            <div class="stat-row"><span>Income Share</span><strong id="stat-percent">${percent}%</strong></div>
            <div class="stat-row"><span>Best Single Jump</span><strong style="color:var(--synergy)">$<span id="stat-best">${(b.bestJump || 0).toLocaleString()}</span></strong></div>
        `;
    }
    
    toggleModal('stats-modal');
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
    
    const talentBtn = document.querySelector('.talent-btn');
    if (talentBtn) {
        if (prestigeTokens > 0) talentBtn.classList.add('can-afford');
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
            btn.innerHTML = `Draw Card <span style="color:var(--bg); font-family:var(--font-mono); font-size:1rem; margin-left:5px;">$${displayCost.toLocaleString()}</span>`;
        }
    }
    
    const upgradeModal = document.getElementById('upgrade-modal');
    if (upgradeModal && upgradeModal.classList.contains('active') && typeof upgradingCardId !== 'undefined' && upgradingCardId !== null) {
        const card = cards.find(c => c.id === upgradingCardId);
        if (card) {
            const cost = typeof getUpgradeCost === 'function' ? getUpgradeCost(card) : 0;
            const btn = document.getElementById('confirm-upgrade-btn');
            if (btn) btn.disabled = cardDust < cost;
        }
    }

    const statsModal = document.getElementById('stats-modal');
    if (statsModal && statsModal.classList.contains('active') && activeStatsIdx !== null) {
        const b = boxData[activeStatsIdx];
        const totalLifetimeIncome = boxData.reduce((sum, box) => sum + (box.totalIncome || 0), 0);
        const percent = totalLifetimeIncome > 0 ? ((b.totalIncome / totalLifetimeIncome) * 100).toFixed(1) : 0;
        
        const statJumps = document.getElementById('stat-jumps');
        const statPrestige = document.getElementById('stat-prestige');
        const statIncome = document.getElementById('stat-income');
        const statPercent = document.getElementById('stat-percent');
        const statBest = document.getElementById('stat-best');

        if (statJumps) statJumps.innerText = b.jumps.toLocaleString();
        if (statPrestige) statPrestige.innerText = b.prestige.toLocaleString();
        if (statIncome) statIncome.innerText = (b.totalIncome || 0).toLocaleString();
        if (statPercent) statPercent.innerText = percent + '%';
        if (statBest) statBest.innerText = (b.bestJump || 0).toLocaleString();
    }

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
            if (costGhostSpeed) costGhostSpeed.innerHTML = `$${cost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${(getGhostBoxInterval()/1000).toFixed(1)}s</span>`;
        }
        const upValue = document.getElementById('up-ghost-value');
        if (upValue) {
            const cost = getGhostUpCost('value');
            if (money < cost) upValue.classList.add('disabled-btn');
            else upValue.classList.remove('disabled-btn');
            const costGhostValue = document.getElementById('cost-ghost-value');
            if (costGhostValue) costGhostValue.innerHTML = `$${cost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${(getGhostBoxValueMult()*100).toFixed(0)}%</span>`;
        }
        const upSync = document.getElementById('up-ghost-synergy');
        if (upSync) {
            const cost = getGhostUpCost('synergy');
            if (money < cost) upSync.classList.add('disabled-btn');
            else upSync.classList.remove('disabled-btn');
            const costGhostSynergy = document.getElementById('cost-ghost-synergy');
            if (costGhostSynergy) costGhostSynergy.innerHTML = `$${cost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${(getGhostBoxSynergyCooldown()/1000).toFixed(1)}s</span>`;
        }
    }

    // Chain bar
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
                ? `×${(1 + chainLevel * 0.25).toFixed(2)}`
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
            if (b.prestige >= 10) {
                if (!ce.jumpContainer.classList.contains('prestige-ready')) {
                    ce.jumpContainer.className = "jumps-counter prestige-ready";
                    ce.jumpContainer.onclick = () => evolveBox(i);
                }
                if (ce.jumpText && ce.jumpText.innerHTML !== `EVOLVE`) {
                    ce.jumpText.innerHTML = `EVOLVE`;
                }
                if (ce.jumpFill) ce.jumpFill.style.width = "0%";
            } 
            else if (b.jumps >= targetJumps) {
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

        if (moneyChanged) {
            const cardMults = b.cachedMults;
            const talentValueMult = 1 + (talents.globalValue.level * 0.15);
            const prestigeMult = Math.pow(1.5, b.prestige);

            if (ce.upIncBtn) {
                if (money < b.incCost) ce.upIncBtn.classList.add('disabled-btn');
                else ce.upIncBtn.classList.remove('disabled-btn');
                
                const evolutionMult = Math.pow(25, b.evolution || 0);
                const currentTotalValue = Math.floor(b.inc * prestigeMult * evolutionMult * cardMults.value * talentValueMult);
                const upgradeIncrease = Math.floor(b.baseInc * prestigeMult * evolutionMult * cardMults.value * talentValueMult);
                
                if (ce.upIncTitle) ce.upIncTitle.innerText = `Value (+$${currentTotalValue.toLocaleString()})`;
                if (ce.upIncCost) ce.upIncCost.innerHTML = `$${b.incCost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| +$${upgradeIncrease.toLocaleString()}</span>`;
            }

            if (ce.upDurBtn) {
                const isMaxDur = b.dur <= b.minDur;
                if (money < b.durCost || isMaxDur) ce.upDurBtn.classList.add('disabled-btn');
                else ce.upDurBtn.classList.remove('disabled-btn');
                
                const displayDur = b.dur / cardMults.speed;
                if (ce.upDurCost) {
                    if (isMaxDur && cardMults.speed === 1) ce.upDurCost.innerText = 'MAX SPEED';
                    else ce.upDurCost.innerHTML = `$${b.durCost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${displayDur.toFixed(2)}s</span>`;
                }
            }

            if (ce.upAutoBtn) {
                const isMaxAuto = b.auto > 0 && b.auto <= b.minAuto;
                if (money < b.autoCost || isMaxAuto) ce.upAutoBtn.classList.add('disabled-btn');
                else ce.upAutoBtn.classList.remove('disabled-btn');

                const displayAuto = b.auto / cardMults.auto;
                if (ce.upAutoCost) {
                    if (isMaxAuto && cardMults.auto === 1) ce.upAutoCost.innerText = 'MAX SPEED';
                    else ce.upAutoCost.innerHTML = `$${b.autoCost.toLocaleString()} <span style="color:var(--text-dim); font-size:0.7rem;">| ${b.auto === 0 ? 'OFF' : (displayAuto/1000).toFixed(2)+'s'}</span>`;
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
