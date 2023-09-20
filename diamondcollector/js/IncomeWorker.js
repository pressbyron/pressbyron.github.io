var player;
var started = false;
var clicksNextTick = 0;

var incomeTimer = 100;

onmessage = function(event) {
    player = event.data;
    if (!started) {
        addIncome();
        started = true;
    } else {
        postMessage(player);
    }
    //postMessage(player);

}

function addIncome() {
    for (var i = 0; i < player.upgrades.length; i++) {
        clicksNextTick = clicksNextTick + (player.upgrades[i].owned * player.upgrades[i].upgrade.cps) *
            (1 + (player.level * 0.1)) * player.incomeBonus / (1000 / incomeTimer);
        if (clicksNextTick > 1) {
            var rest = clicksNextTick - Math.floor(clicksNextTick);
            var timesToMine = Math.floor(clicksNextTick);
            clicksNextTick = 0 + rest;
            mine(timesToMine);
        }
    }
    //console.log(player.experience);
    player.experience += player.experienceWorkers / (1000 / incomeTimer);
    postMessage(player);
    setTimeout("addIncome()", incomeTimer);
}

function mine(times) {
    for (var j = 0; j < player.inventory.length; j++) {
        if (player.inventory[j].material.tier <= player.tier && player.inventory[j].material.dropRate > 0) {
            player.inventory[j].owned += ((player.inventory[j].material.dropRate * (1 + player.droprateBonus)) / 100) * times;
            player.inventory[j].earned += ((player.inventory[j].material.dropRate * (1 + player.droprateBonus)) / 100) * times;
            player.inventory[j].earnedTotal += ((player.inventory[j].material.dropRate * (1 + player.droprateBonus)) / 100) * times;
        }
    }

    /*
    for (var i = 0; i < times; i++) {
        for (var j = 0; j < player.inventory.length; j++) {
            if (calculateMaterialDrop(player.inventory[j].material)) {
                player.inventory[j].owned++;
                player.inventory[j].earned++;
            }
        }
    }*/
}

function calculateMaterialDrop(theMaterial) {
    if (theMaterial.tier <= player.tier) {
        var n = Math.round(Math.random() * 10000) + 1;
        if (n <= theMaterial.dropRate * 100) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}