function load() {
    var loaded = localStorage.getItem("player");

    if (loaded != null) {
        var loadedPlayer = JSON.parse(loaded);
        if (loadedPlayer.gold != "NaN") {
            player.gold = loadedPlayer.gold;
        }
        player.experience = 0;
        player.experienceWorkers = 0;
        player.level = 0;
        player.goldEarnedTotal = 0;

        if (loadedPlayer.goldEarned != null) {
            player.goldEarned = loadedPlayer.goldEarned;
            player.goldEarnedTotal = loadedPlayer.goldEarnedTotal;
        }

        if (loadedPlayer.level != null) {
            player.level = loadedPlayer.level;
        }

        if (loadedPlayer.experience != null) {
            player.experience = loadedPlayer.experience;
        }

        if (loadedPlayer.experienceWorkers != null) {
            player.experienceWorkers = loadedPlayer.experienceWorkers;
        }

        if (loadedPlayer.talents != null && loadedPlayer.talents != 0) {
            var counter = 0;
            for (var i = 0; i < loadedPlayer.talents.length; i++) {
                counter += loadedPlayer.talents[i].points;
            }
            player.unusedTalentPoints = player.level - counter;
            player.talents = loadedPlayer.talents;
        } else {
            player.unusedTalentPoints = player.level;
        }

        calculateLeftToLevel();


        for (var i = 0; i < loadedPlayer.inventory.length; i++) {
            for (var j = 0; j < player.inventory.length; j++) {
                if (player.inventory[j].material.name == loadedPlayer.inventory[i].material.name) {
                    if (loadedPlayer.inventory[i].earned != null) {
                        player.inventory[j].earned = loadedPlayer.inventory[i].earned;
                    } else {}
                }
            }
        }

        for (var i = 0; i < loadedPlayer.inventory.length; i++) {
            for (var j = 0; j < player.inventory.length; j++) {
                if (player.inventory[j].material.name == loadedPlayer.inventory[i].material.name) {
                    if (loadedPlayer.inventory[i].earnedTotal != null) {
                        player.inventory[j].earnedTotal = loadedPlayer.inventory[i].earnedTotal;
                    } else {
                        player.inventory[j].earnedTotal = 0;
                    }
                }
            }
        }



        for (var i = 0; i < loadedPlayer.inventory.length; i++) {
            for (var j = 0; j < player.inventory.length; j++) {
                if (player.inventory[j].material.name == loadedPlayer.inventory[i].material.name) {
                    player.inventory[j].owned = loadedPlayer.inventory[i].owned;
                }
            }
        }
        for (var i = 0; i < loadedPlayer.upgrades.length; i++) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == loadedPlayer.upgrades[i].upgrade.name) {
                    player.upgrades[j].owned = loadedPlayer.upgrades[i].owned;
                    if (loadedPlayer.upgrades[i].upgrade.level != null) {
                        player.upgrades[j].upgrade.level = loadedPlayer.upgrades[i].upgrade.level;
                        player.upgrades[j].upgrade.cps = player.upgrades[j].upgrade.baseCPS * loadedPlayer.upgrades[i].upgrade.level;

                    } else {
                        player.upgrades[j].level = 1;
                    }
                }
            }
        }

        player.craftables = loadedPlayer.craftables;
        for (var i = 0; i < player.craftables.length; i++) {
            player.craftables[i].bonusCollected = false;
        }

        checkForBonuses();

        player.income = 0;
        for (var i = 0; i < player.upgrades.length; i++) {
            player.income += player.upgrades[i].upgrade.cps * player.upgrades[i].owned;

        }



        //console.log("player:" + player);
        //console.log("LOADED" + c.substring(name.length, c.length));
    } else {
        swal({
                title: "Look, fresh blood!",
                text: "Do you want too see a small tutorial to learn the basics of the game?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Yes please!",
                closeOnConfirm: true,
            },
            function() {
                $('#tutorialModal').modal('show');
            });
    }


}