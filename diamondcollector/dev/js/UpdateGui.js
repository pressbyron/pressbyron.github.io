var elTimer = 0;

function updateGUI() {
    elTimer++;
    if (autosell && elTimer >= 60) {
        console.log("SELL!");
        sellSelectedOres();
        elTimer = 0;
    }

    for (var i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i].material.isOre) {
            $("#" + player.inventory[i].material.name + "Earned")
                .text(numberWithCommas(player.inventory[i].earned.toFixed(0)) + " " + player.inventory[i].material.name + " (alltime:" + numberWithCommas(player.inventory[i].earnedTotal.toFixed(0)) + ")");
        }
        if (player.inventory[i].owned >= 1) {
            $("#" + player.inventory[i].material.name + "element").show();
            $("#" + player.inventory[i].material.name + "value").text(numberWithCommas(player.inventory[i].owned.toFixed(0)));
        } else {
            $("#" + player.inventory[i].material.name + "element").hide();
        }

    }

    $("#unusedTalents").text("Availible points:" + player.unusedTalentPoints);
    if (player.unusedTalentPoints > 0) {
        $("#avalibleTalents").text(player.unusedTalentPoints);
    } else {
        $("#avalibleTalents").text("");
    }
    for (var i = 0; i < player.talents.length; i++) {
        if (player.unusedTalentPoints > 0) {
            $("#" + player.talents[i].name + "Button").prop('disabled', false);
        } else {
            $("#" + player.talents[i].name + "Button").prop('disabled', true);
        }


    }

    $("#moneyEarned").text("This game:" + numberWithCommas(player.goldEarned.toFixed(0)) + " (alltime:" + numberWithCommas(player.goldEarnedTotal.toFixed(0)) + ")");

    for (var i = 0; i < player.upgrades.length; i++) {
        $("#" + player.upgrades[i].upgrade.name + "value").text(player.upgrades[i].owned);
        $("#" + player.upgrades[i].upgrade.name + "cost").text(numberWithCommas(calculateUpgradeCost(player.upgrades[i]).toFixed(0)));
    }

    if (elTimer % 10 == 0) {
        for (var i = 0; i < allCraftables.length; i++) {
            if (canAfford(allCraftables[i]) == false) {
                if ($("#" + allCraftables[i].name + "cost").css('opacity') != 0.5) {
                    $("#" + allCraftables[i].name + "cost").css('opacity', '0.5');
                }
            } else {

                $("#" + allCraftables[i].name + "cost").css('opacity', '1');

            }
        };
    }

    for (var i = 0; i < player.craftables.length; i++) {
        $("#" + player.craftables[i].name + "cost").css('opacity', '0.5');
        $("#" + player.craftables[i].name + "CraftElement").addClass("sepia");
        //$("#" + player.craftables[i].name + "cost").prop('disabled', true);
        document.getElementById(player.craftables[i].name + "cost").removeEventListener("click", craftCraftable);
    };


    $("#gold-value").text(numberWithCommas(player.gold.toFixed(0)));

    $("#income-value").text("CpS:" + numberWithCommas((player.income * player.incomeBonus * (1 + ((player.level - 1) * 0.1))).toFixed(1)));
    $("#level-value").text("lvl:" + numberWithCommas(player.level));
    $("#clicking-power").text("CP:" + numberWithCommas(player.pickaxeMultiplier));
    $("#to-next-level-value").text("Next lvl:" + ((player.experience / leftToLevel) * 100).toFixed(2) + "%");

    if (queItem != null) {
        $("#craftQue").text(queItem.name + " (" + wwQue + ") left");
    } else {
        $("#craftQue").text("IDLE");
    }

    $("#currentLevel").text(player.level);
    $("#experienceWorkersOwned").text(numberWithCommas(player.experienceWorkers) + " experience workers.");
    $("#resetValue").text(numberWithCommas(calculateResetValue()) + " experience workers.");

    $("#levelProgress").css('width', (player.experience / leftToLevel) * 100 + '%').attr('aria-valuenow', (player.experience / leftToLevel) * 100);
    $("#levelProgressText").text(numberWithCommas(player.experience.toFixed(0)) + "/" + numberWithCommas(leftToLevel));

    if (player.experience >= leftToLevel) {
        levelUp();
        $("#levelProgress").css('width', 0 + '%').attr('aria-valuenow', 0);
        $("#levelProgressText").text(numberWithCommas(player.experience.toFixed(0)) + "/" + numberWithCommas(leftToLevel));
    }



}

$(".btn-group > .btn").click(function() {
    $(this).addClass("active").siblings().removeClass("active");
});