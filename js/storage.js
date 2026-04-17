let money = 0;
let prestigeTokens = 0;
let nextCardId = 1;
let cardDust = 0;
let cards = [];
let frenzyTimer = 0;
let hasSeenSynergyTutorial = false;
let hasSeenCardTutorial = false;
let isWiping = false;

function saveGame() {
    if (isWiping) return;
    const boxProgress = boxData.map(b => ({
        active: b.active, jumps: b.jumps, prestige: b.prestige, equippedCard: b.equippedCard,
        inc: b.inc, incCost: b.incCost, dur: b.dur, durCost: b.durCost,
        auto: b.auto, autoProgress: b.autoProgress, autoCost: b.autoCost,
        collapsed: b.collapsed
    }));

    const saveData = { money, prestigeTokens, nextCardId, cards, talents, boxProgress, frenzyTimer, hasSeenSynergyTutorial, hasSeenCardTutorial, cardDust, ghostBoxData: { ...ghostBoxData } };
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
            hasSeenCardTutorial = data.hasSeenCardTutorial || false;
            cardDust = data.cardDust || 0;
            if (data.ghostBoxData) {
                ghostBoxData = { ...ghostBoxData, ...data.ghostBoxData };
            }
            if (data.cards) {
                cards = data.cards;
                cards.forEach(c => { if(c.level === undefined) c.level = 0; });
            }

            // cardPackCost calculation logic remains accessible to shop code
            updateCardPackCost();

            if (data.talents) {
                for (let key in data.talents) {
                    if (talents[key]) talents[key].level = data.talents[key].level;
                }
            }

            if (data.boxProgress) {
                data.boxProgress.forEach((savedBox, i) => {
                    if (boxData[i]) {
                        const fieldsToLoad = ['active', 'jumps', 'prestige', 'inc', 'incCost', 'dur', 'durCost', 'auto', 'autoProgress', 'autoCost', 'collapsed'];
                        fieldsToLoad.forEach(field => {
                            if (savedBox[field] !== undefined) boxData[i][field] = savedBox[field];
                        });
                        
                        // Re-link equipped card to the actual object in the global cards array
                        if (savedBox.equippedCard) {
                            const actualCard = cards.find(c => c.id === savedBox.equippedCard.id);
                            if (actualCard) {
                                boxData[i].equippedCard = actualCard;
                                actualCard.equippedTo = i;
                            } else {
                                boxData[i].equippedCard = null;
                            }
                        } else {
                            boxData[i].equippedCard = null;
                        }

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

function updateCardPackCost() {
    cardPackCost = 1000;
    for(let i = 0; i < cards.length; i++) {
        cardPackCost = Math.floor(cardPackCost * 1.5);
    }
}

function wipeSave() {
    if(confirm("Are you sure you want to completely wipe your save? This cannot be undone!")) {
        isWiping = true;
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}
