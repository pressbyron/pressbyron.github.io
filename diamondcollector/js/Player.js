var player = new Player();
var autosell = false;

function Player() {
    this.droprateBonus = 0;
    this.upgradeBonus = 0;
    this.crafttimeBonus = 0;

    this.gold = 0;
    this.goldEarned = 0;
    this.goldEarnedTotal = 0;
    this.income = 0;
    this.level = 0;
    this.experience = 0;
    this.experienceWorkers = 0;
    this.unusedTalentPoints = 1;
    this.tier = 0;
    this.pickaxeMultiplier = 2;
    this.incomeBonus = 1;
    this.gameVersion = 1;
    this.inventory = [];
    this.craftables = [];
    this.achivements = [];
    this.upgrades = [];
    this.talents = [];

}

function Item(material, owned) {
    this.material = material;
    this.owned = owned;
    this.earned = 0;
    this.earnedTotal = 0;
}

function UpgradeItem(upgrade, owned) {
    this.upgrade = upgrade;
    this.owned = owned;
}

function addAllMaterialsToInventory() {
    for (var i = 0; i < allMaterials.length; i++) {
        player.inventory.push(new Item(allMaterials[i], 0, 0));
    }
}

function addAllUpgradesToPlayer() {
    for (var i = 0; i < allUpgrades.length; i++) {
        player.upgrades.push(new UpgradeItem(allUpgrades[i], 0));
    }
}

function sellItem(evt) {
    var theItem = evt.target.myParam;
    for (var i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i].material.name == theItem.name && player.inventory[i].owned > 0) {
            var goldToAdd = player.inventory[i].owned * theItem.value;
            player.inventory[i].owned = 0;
            updateGold(goldToAdd);

        }
    }
}

function autoSell() {
    console.log("autosell!");
    if (autosell == false) {
        autosell = true;
        $("#automaticSellerSpan").addClass("glyphicon-refresh-animate");
    } else {
        autosell = false;
        $("#automaticSellerSpan").removeClass("glyphicon-refresh-animate");
    }
}

function useItem(evt) {
    var theItem = evt.target.myParam;

    for (var i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i].material.name == theItem.name && player.inventory[i].owned > 0) {
            if (theItem.name == "Dynamite") {
                for (var j = 0; j < player.inventory.length; j++) {
                    if (player.inventory[j].material.tier <= player.tier) {
                        player.inventory[j].owned += (player.inventory[j].material.dropRate / 100) * 1000000;
                        player.inventory[j].earned += (player.inventory[j].material.dropRate / 100) * 1000000;
                    }
                }
                player.inventory[i].owned--;
                updatePlayer(player);
            }

            if (theItem.name == "Firework") {
                for (var j = 0; j < player.inventory.length; j++) {
                    if (player.inventory[j].material.tier <= player.tier) {
                        player.inventory[j].owned += (player.inventory[j].material.dropRate / 100) * 10000;
                        player.inventory[j].earned += (player.inventory[j].material.dropRate / 100) * 10000;
                    }
                }
                player.inventory[i].owned--;
                updatePlayer(player);
            }

            if (theItem.name == "ExperienceStone") {
                player.experience += 100000;
                player.inventory[i].owned--;
                updatePlayer(player);
            }
        }
    }
}

function sellSelectedOres() {
    var count = $('#sell-ores-count :selected').val();
    var goldToAdd = 0;
    $('#sell-ores :selected').each(function(i, selected) {
        for (var i = 0; i < player.inventory.length; i++) {
            if ($(selected).text() == player.inventory[i].material.name && player.inventory[i].owned >= 1) {
                if (count == 0) {
                    goldToAdd += player.inventory[i].owned * player.inventory[i].material.value;
                    player.inventory[i].owned = 0;
                } else {
                    if (player.inventory[i].owned < count) {
                        goldToAdd += player.inventory[i].owned * player.inventory[i].material.value;
                    } else {
                        goldToAdd += count * player.inventory[i].material.value;
                    }
                    player.inventory[i].owned -= count;
                }
                if (player.inventory[i].owned < 0) {
                    player.inventory[i].owned = 0;
                }

            }
        }
        updatePlayer(player);

    });
    updateGold(goldToAdd);
}

/*
document.getElementById("sell-ores").addEventListener("submit", function(event) {
    event.preventDefault()
    var x = document.getElementById("sell-ores").elements.length;
    for (var i = 0; i < x; i++) {
        var itemName = document.getElementById("sell-ores").elements[i].value;
        var y = document.getElementById("sell-ores").elements[i].checked;
        for (var j = 0; j < player.inventory.length; j++) {
            if (player.inventory[j].material.name == itemName && player.inventory[j].owned > 0 && y) {
                var goldToAdd = player.inventory[j].owned * player.inventory[j].material.value;
                player.inventory[j].owned = 0;
                updateGold(goldToAdd);

            }
        }
    }
});

*/

function buyUpgrade(evt) {
    $(this).tooltip('hide')
    $(this).blur();
    var theUpgrade = evt.target.myParam;
    for (var i = 0; i < player.upgrades.length; i++) {
        var upgrade = player.upgrades[i];
        var cost = calculateUpgradeCost(player.upgrades[i]);
        if (upgrade.upgrade.name == theUpgrade.name) {
            if (player.gold >= cost) {
                player.gold -= cost;
                player.upgrades[i].owned++;
                player.income += upgrade.upgrade.baseCPS;
                if (player.upgrades[i].owned >= upgrade.upgrade.level * 25) {
                    $("#" + player.upgrades[i].upgrade.name + "evolve").show();
                    if ((player.upgrades[i].owned % 25 == 0 && player.upgrades[i].owned != 0) || player.upgrades[i].owned > 25 * player.upgrades[i].upgrade.level) {
                        $("#" + player.upgrades[i].upgrade.name + "evolve").html(numberWithCommas(calculateEvolveCost(player.upgrades[i].upgrade)));
                    } else {
                        $("#" + player.upgrades[i].upgrade.name + "evolve").hide();
                    }
                } else {
                    $("#" + player.upgrades[i].upgrade.name + "evolve").hide();
                }
                updatePlayer(player);
                checkForAchivements();
            }
        }
    }
}

$(document).ready(function() {
    addAllMaterialsToInventory();
    addAllUpgradesToPlayer();
    addAllTalentsToPlayer();
    load();
    dynamicCreation();
    checkForTalentBonuses(null);

    $("#mine-btn").click(function() {
        mine();
        //updateGUI();
    });
});