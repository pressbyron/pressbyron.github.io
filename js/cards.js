let cardPackCost = 1000;
let equippingToBox = null;
let isDrawingCard = false;
let pendingDrawnCard = null;
let upgradingCardId = null;
let pendingScrapCardId = null;
let pendingSwitchCardId = null;
let pendingSwitchBoxIndex = null;
let pendingBulkRarity = null;

function getActualCardCost() { 
    return Math.floor(cardPackCost * (1 - (talents.cheapCards.level * 0.10))); 
}

function updateCardPackCost() {
    cardPackCost = 1000;
    for(let i = 0; i < cards.length; i++) {
        cardPackCost = Math.floor(cardPackCost * 1.5);
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
    let roll = Math.random();
    
    // Apply luckyDraw bonus (level * 1% = 0.01)
    const luckBonus = talents.luckyDraw.level * 0.01;
    roll += luckBonus; // Higher roll is better

    let rarity = 'common';
    if (roll > 0.95) rarity = 'epic';
    else if (roll > 0.70) rarity = 'rare';

    // Tvingar första kortet att vara value boost
    let typeObj;
    if (isFirstCard) {
        typeObj = cardTypes.find(c => c.id === 'value');
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
            isDrawingCard = false; // Allow closing the modal now that animation is done
        }
    }, 80);
}

function finishDrawAnimation(newCard, isBoosted = false) {
    const showcase = document.getElementById('card-showcase');
    showcase.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div class="equip-card-item ${newCard.rarity} rolling-card pop-anim">
                <div class="card-rarity">${newCard.rarity}</div>
                <div class="card-stat">${newCard.text}</div>
                <div class="card-desc">${newCard.typeName}</div>
            </div>
            <!--
            <div style="display: flex; gap: 10px; width: 100%; max-width: 250px; margin-top: 15px;">
                <button id="boost-btn" class="btn-tactile draw-btn ${isBoosted ? 'disabled-btn' : ''}" style="background:var(--synergy); color:white; border:none; flex: 1; margin:0; font-size: 0.6rem; padding: 8px 4px; box-shadow: 0 4px 0 #0e7490;" onclick="boostCurrentCard()" ${isBoosted ? 'disabled' : ''}>
                    ${isBoosted ? 'Boosted!' : 'Watch Ad (+10-45%)'}
                </button>
                <button id="collect-btn" class="btn-tactile draw-btn" style="background:var(--money-green); color:black; border:none; flex: 1; margin:0; font-size: 0.6rem; padding: 8px 4px; box-shadow: 0 4px 0 #15803d;" onclick="collectCard()">
                    Collect
                </button>
            </div>
            -->
            <div style="display: flex; gap: 10px; width: 100%; max-width: 250px; margin-top: 15px;">
                <button id="collect-btn" class="btn-tactile draw-btn" style="background:var(--money-green); color:black; border:none; flex: 1; margin:0; font-size: 0.8rem; padding: 10px 4px; box-shadow: 0 4px 0 #15803d;" onclick="collectCard()">
                    Collect
                </button>
            </div>        </div>
    `;

    if (newCard.rarity === 'rare' || newCard.rarity === 'epic') {
        spawnParticles(showcase, newCard.rarity);
    }
}

function boostCurrentCard() {
    if (!pendingDrawnCard) return;
    
    // Disable boost button immediately upon click
    const btn = document.getElementById('boost-btn');
    if (btn) {
        if (btn.classList.contains('disabled-btn')) return; 
        btn.classList.add('disabled-btn');
        btn.disabled = true;
        btn.innerText = "Watching Ad...";
    }
    
    // Animate boost text on the card itself
    let ticks = 0;
    const interval = setInterval(() => {
        ticks++;
        const randVal = Math.floor(pendingDrawnCard.value * (1 + (Math.random() * 0.5)));
        const statEl = document.querySelector('.card-stat');
        if (statEl) statEl.innerText = "+" + randVal + (pendingDrawnCard.type === 'value' ? '%' : (pendingDrawnCard.type === 'synergy' ? 'x' : '%'));
        
        if (ticks >= 15) clearInterval(interval);
    }, 100);

    loadAndShowAd(() => {
        clearInterval(interval);
        // Boost between 10% and 45% (1.10x to 1.45x)
        const boostMultiplier = 1 + (Math.floor(Math.random() * 36) + 10) / 100;
        
        // Ensure new value is at least slightly higher than original
        pendingDrawnCard.value = Math.max(pendingDrawnCard.value + 0.01, pendingDrawnCard.value * boostMultiplier);
        
        // Round to 2 decimals for display consistency, or keep as integer for others
        if (pendingDrawnCard.type === 'synergy') {
            pendingDrawnCard.value = parseFloat(pendingDrawnCard.value.toFixed(2));
        } else {
            pendingDrawnCard.value = Math.floor(pendingDrawnCard.value);
        }
        
        pendingDrawnCard.text = cardTypes.find(c => c.id === pendingDrawnCard.type).format.replace('{val}', pendingDrawnCard.value);
        
        // Refresh display with boosted state
        finishDrawAnimation(pendingDrawnCard, true);
        showSynergyFeedback(`✨ BOOSTED! ✨`, "var(--synergy)");
    });
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
        return rMap[b.rarity] - rMap[a.rarity];
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
    const box = boxData[boxIndex];
    
    // If clicking the same card that's already equipped, just close
    if (box.equippedCard && box.equippedCard.id === cardId) {
        toggleModal('equip-modal');
        return;
    }

    // If box already has a card, ask for confirmation
    if (box.equippedCard) {
        pendingSwitchCardId = cardId;
        pendingSwitchBoxIndex = boxIndex;
        toggleModal('switch-confirm-modal');
        return;
    }

    // No card equipped, proceed normally
    applyEquip(cardId, boxIndex);
}

function applyEquip(cardId, boxIndex) {
    const card = cards.find(c => c.id === cardId);
    const box = boxData[boxIndex];
    if (!card || !box) return;

    // 1. If this card was already equipped somewhere else, clear that box
    if (card.equippedTo !== null) {
        boxData[card.equippedTo].equippedCard = null;
        updateCachedMultipliers(card.equippedTo);
    }

    // 2. If this box already had a card, clear that card's equippedTo
    if (box.equippedCard) {
        box.equippedCard.equippedTo = null;
    }

    // 3. Apply new link
    card.equippedTo = boxIndex;
    box.equippedCard = card;

    updateCachedMultipliers(boxIndex);
    if (document.getElementById('equip-modal').classList.contains('active')) {
        toggleModal('equip-modal');
    }
    renderLayout();
    updateUI();
    saveGame();
}

function confirmSwitch() {
    if (pendingSwitchCardId !== null && pendingSwitchBoxIndex !== null) {
        applyEquip(pendingSwitchCardId, pendingSwitchBoxIndex);
        pendingSwitchCardId = null;
        pendingSwitchBoxIndex = null;
    }
    toggleModal('switch-confirm-modal');
}

function unequipCurrentBox() {
    if(equippingToBox !== null) {
        const box = boxData[equippingToBox];
        if (box.equippedCard) {
            box.equippedCard.equippedTo = null;
            box.equippedCard = null;
            updateCachedMultipliers(equippingToBox);
        }
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
        if (c.type === 'value') m.value += (c.value / 100) + (lvl * 0.15); // Increased from 0.05
        if (c.type === 'speed') m.speed += (c.value / 100) + (lvl * 0.10); // Increased from 0.05
        if (c.type === 'auto') m.auto += (c.value / 100) + (lvl * 0.10); // Increased from 0.05
        if (c.type === 'synergy') m.synergyBonus += c.value + (lvl * 0.5); // Increased from 0.2
    }
    b.cachedMults = m;
}

function getCardMultipliers(b) {
    return b.cachedMults;
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
    
    let bonusText = "+15% Bonus";
    if (card.type === 'synergy') bonusText = "+0.5x Bonus";
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
    
    // Update the card text
    const baseVal = card.value; // Keep track of base if needed, or recalculate from scratch
    // Note: card.value isn't actually being updated by level in the current structure, 
    // it's just stored as a static value. Let's update the text based on card type and level.
    const typeObj = cardTypes.find(c => c.id === card.type);
    
    // Calculate new stat based on card type logic (simplified)
    let bonus = 0;
    if (card.type === 'value') bonus = 0.15;
    else if (card.type === 'speed' || card.type === 'auto') bonus = 0.10;
    else if (card.type === 'synergy') bonus = 0.5;
    
    const newVal = card.type === 'synergy' 
        ? parseFloat((card.value + bonus).toFixed(2)) 
        : Math.floor(card.value * (1 + bonus));
    
    card.value = newVal;
    card.text = typeObj.format.replace('{val}', card.value);

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

function openBulkScrapModal(rarity) {
    const targets = cards.filter(c => c.rarity === rarity && c.equippedTo === null);
    
    document.getElementById('bulk-rarity-text').innerText = rarity.toUpperCase();
    
    if (targets.length === 0) {
        document.getElementById('bulk-scrap-warning').innerText = `You have no unequipped ${rarity.toUpperCase()} cards to scrap.`;
        document.getElementById('bulk-scrap-confirm-btn').style.display = 'none';
        toggleModal('bulk-scrap-modal');
        return;
    }

    pendingBulkRarity = rarity;
    const dustGain = targets.length * (rarity === 'epic' ? 100 : (rarity === 'rare' ? 30 : 10));
    
    document.getElementById('bulk-scrap-warning').innerHTML = `You are about to scrap <strong>${targets.length}</strong> ${rarity.toUpperCase()} cards for <span style="color:var(--synergy);">✨ ${dustGain} Dust</span>.`;
    document.getElementById('bulk-scrap-confirm-btn').style.display = 'block';
    
    toggleModal('bulk-scrap-modal');
}

function confirmBulkScrap() {
    if (!pendingBulkRarity) return;
    
    const targets = cards.filter(c => c.rarity === pendingBulkRarity && c.equippedTo === null);
    const dustGain = targets.length * (pendingBulkRarity === 'epic' ? 100 : (pendingBulkRarity === 'rare' ? 30 : 10));
    
    cardDust += dustGain;
    cards = cards.filter(c => !(c.rarity === pendingBulkRarity && c.equippedTo === null));
    
    showSynergyFeedback(`✨ Scrapped ${targets.length} cards for +${dustGain} Dust!`, "var(--synergy)");
    
    pendingBulkRarity = null;
    toggleModal('bulk-scrap-modal');
    renderInventory();
    renderLayout();
    updateUI();
    saveGame();
}
