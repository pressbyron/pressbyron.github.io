var firstLoad = true;

var allTalents = [
    new Talent("Droprate", "Increases the droprate by 50% of all ores.", 0.5, "droprate"),
    new Talent("UpgradeBoost", "Boosts production of all upgrades by 50%.", 0.5, "upgradeBoost"),
    new Talent("Clicker", "Increases the clickingpower of manual clicks by 25, so one click is worth 25 clicks.", 25, "clickingPower"),
    //new Talent("Crafter", "Crafttimes are reduced.", 5, "crafttimes"),
];

function checkForTalentBonuses(talentIn) {
    if (firstLoad) {
        for (var i = 0; i < player.talents.length; i++) {
            for (var j = 0; j < allTalents.length; j++) {
                if (player.talents[i].name == allTalents[j].name && player.talents[i].points > 0) {
                    var multiplier;
                    if (firstLoad) {
                        multiplier = player.talents[i].points;
                    } else {
                        multiplier = 1;
                    }
                    var talent = allTalents[j];
                    switch (talent.type) {
                        case "droprate":
                            player.droprateBonus += talent.bonusAmount * multiplier;
                            break;

                        case "upgradeBoost":
                            player.incomeBonus += talent.bonusAmount * multiplier;
                            break;

                        case "clickingPower":
                            player.pickaxeMultiplier += talent.bonusAmount * multiplier;
                            break;

                        case "crafttimes":
                            player.crafttimeBonus += talent.bonusAmount * multiplier;
                            break;
                    }
                }
            }
        }
    } else {
        var t;
        for (var i = 0; i < allTalents.length; i++) {
            if (allTalents[i].name == talentIn.name) {
                t = allTalents[i];
            }
        }
        switch (t.type) {
            case "droprate":
                player.droprateBonus += t.bonusAmount;
                break;

            case "upgradeBoost":
                player.incomeBonus += t.bonusAmount;
                break;

            case "clickingPower":
                player.pickaxeMultiplier += t.bonusAmount;
                break;

            case "crafttimes":
                player.crafttimeBonus += t.bonusAmount;
                break;
        }
    }
    firstLoad = false;
}

function Talent(name, description, bonusAmount, type) {
    return {
        name: name,
        description: description,
        bonusAmount: bonusAmount,
        type: type,
    }
}

function addAllTalentsToPlayer() {
    for (var i = 0; i < allTalents.length; i++) {
        player.talents.push(new PlayerTalent(allTalents[i].name, 0));
    }
}

function PlayerTalent(name, points) {
    return {
        name: name,
        points: points,
    }
}

function addTalent(evt) {
    var name = evt.target.myParam;
    var talent;

    for (var i = 0; i < player.talents.length; i++) {
        if (player.talents[i].name == name) {
            talent = player.talents[i];
            player.talents[i].points++;
            player.unusedTalentPoints--;
            updatePlayer(player);
            $("#" + name + "Points").text(talent.points);

        }


    }
    checkForTalentBonuses(talent);
    updatePlayer(player);
    $('#incomeBonus').html("Total bonus to CPS: " + ((player.incomeBonus - 1) * 100).toFixed(0) + "%");


}