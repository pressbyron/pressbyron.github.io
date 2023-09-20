function checkForBonuses() {
    for (var i = 0; i < player.craftables.length; i++) {
        var item = player.craftables[i];

        //Find better ores

        if (item.name == "SmallMiningCompany" && !item.bonusCollected) {
            player.tier++;
            item.bonusCollected = true;
        }

        if (item.name == "TunnelSupport" && !item.bonusCollected) {
            player.tier++;
            item.bonusCollected = true;
        }
        if (item.name == "DiamondDepths" && !item.bonusCollected) {
            player.tier++;
            item.bonusCollected = true;
        }

        if (item.name == "SuperFurnance" && !item.bonusCollected) {
            $("#craft-ores-count")
                .html('<option value="1">x1</option><option value="10">x10</option>')
                .selectpicker('refresh');
            item.bonusCollected = true;
        }

        //Pickaxe "manual click" upgrades
        if (item.name == "SandPick" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 2;
            item.bonusCollected = true;
        }

        if (item.name == "CopperPick" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 8;
            item.bonusCollected = true;
        }
        if (item.name == "IronPick" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 15;
            item.bonusCollected = true;
        }
        if (item.name == "GoldPick" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 25;
            item.bonusCollected = true;
        }
        if (item.name == "DiamondPick" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 50;
            item.bonusCollected = true;
        }

        if (item.name == "SandDrill" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 65;
            item.bonusCollected = true;
        }

        if (item.name == "CopperDrill" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 75;
            item.bonusCollected = true;
        }

        if (item.name == "IronDrill" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 100;
            item.bonusCollected = true;
        }

        if (item.name == "GoldDrill" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 150;
            item.bonusCollected = true;
        }

        if (item.name == "DiamondDrill" && !item.bonusCollected) {
            player.pickaxeMultiplier = player.pickaxeMultiplier + 300;
            item.bonusCollected = true;
        }


        //Income bonus things
        if (item.name == "LunchResturant" && !item.bonusCollected) {
            player.incomeBonus = player.incomeBonus + 0.1;
            item.bonusCollected = true;
        }

        if (item.name == "Pub" && !item.bonusCollected) {
            player.incomeBonus = player.incomeBonus + 0.1;
            item.bonusCollected = true;
        }

        if (item.name == "Cabins" && !item.bonusCollected) {
            player.incomeBonus = player.incomeBonus + 0.25;
            item.bonusCollected = true;
        }

        if (item.name == "Garage" && !item.bonusCollected) {
            player.incomeBonus = player.incomeBonus + 0.5;
            item.bonusCollected = true;
        }




        //Automatic seller
        if (item.name == "AutomaticSeller" && !item.bonusCollected) {
            $("#automaticSeller").attr('disabled', false);
            item.bonusCollected = true;
        }


        //craftque
        if (item.name == "CraftqueLv1" && !item.bonusCollected) {
            wwQueMax += 10;
            item.bonusCollected = true;
        }

        if (item.name == "CraftqueLv2" && !item.bonusCollected) {
            wwQueMax += 10;
            item.bonusCollected = true;
        }

        if (item.name == "CraftqueLv3" && !item.bonusCollected) {
            wwQueMax += 10;
            item.bonusCollected = true;
        }

        if (item.name == "CraftqueLv4" && !item.bonusCollected) {
            wwQueMax += 10;
            item.bonusCollected = true;
        }

        if (item.name == "IdleCrafting" && !item.bonusCollected) {
            $("#idleCraftStatus").attr("disabled", false);
            item.bonusCollected = true;
        }

        //upgrade BaseCPS upgrades

        if (item.name == "QualifiedWorker" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "UnqualifiedWorker") {
                    increaseBaseCps(player.upgrades[j].upgrade, 0.2);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "ExpertWorker" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "UnqualifiedWorker") {
                    increaseBaseCps(player.upgrades[j].upgrade, 1.8);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "Godlike" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "UnqualifiedWorker") {
                    increaseBaseCps(player.upgrades[j].upgrade, 7);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "TheForce" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "UnqualifiedWorker") {
                    increaseBaseCps(player.upgrades[j].upgrade, 15);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "MinerPickaxe" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Miner") {
                    increaseBaseCps(player.upgrades[j].upgrade, 2.5);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "MinerDrill" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Miner") {
                    increaseBaseCps(player.upgrades[j].upgrade, 7.5);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "MinerExpertise" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Miner") {
                    increaseBaseCps(player.upgrades[j].upgrade, 15);
                    item.bonusCollected = true;
                    break;
                }
            }
        }



        if (item.name == "Leadership" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Foreman") {
                    increaseBaseCps(player.upgrades[j].upgrade, 10);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "SalaryBoost" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Foreman") {
                    increaseBaseCps(player.upgrades[j].upgrade, 25);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "YellMore" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Foreman") {
                    increaseBaseCps(player.upgrades[j].upgrade, 40);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "GoldDrills" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "AutomaticDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 30);
                    item.bonusCollected = true;
                    break;
                }
            }
        }



        if (item.name == "Uptime" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "AutomaticDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 50);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "OverClocked" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "AutomaticDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 75);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "AlgorithmUpdate" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "AutomaticDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 100);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "NewCoolingSystem" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "OverclockedDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 50);
                    item.bonusCollected = true;
                    break;
                }
            }
        }



        if (item.name == "DiamondDrills" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "OverclockedDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 75);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "BiggerEngine" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "OverclockedDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 90);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "BiggerFueltank" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "OverclockedDrill") {
                    increaseBaseCps(player.upgrades[j].upgrade, 125);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "NewCPU" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Robot") {
                    increaseBaseCps(player.upgrades[j].upgrade, 75);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "MoreRam" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Robot") {
                    increaseBaseCps(player.upgrades[j].upgrade, 100);
                    item.bonusCollected = true;
                    break;
                }
            }
        }
        if (item.name == "BiggerDrills" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Robot") {
                    increaseBaseCps(player.upgrades[j].upgrade, 150);
                    item.bonusCollected = true;
                    break;
                }
            }
        }
        if (item.name == "BetterReach" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Robot") {
                    increaseBaseCps(player.upgrades[j].upgrade, 175);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "Expanding" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Quarry") {
                    increaseBaseCps(player.upgrades[j].upgrade, 100);
                    item.bonusCollected = true;
                    break;
                }
            }
        }

        if (item.name == "ExpandingMore" && !item.bonusCollected) {
            for (var j = 0; j < player.upgrades.length; j++) {
                if (player.upgrades[j].upgrade.name == "Quarry") {
                    increaseBaseCps(player.upgrades[j].upgrade, 150);
                    item.bonusCollected = true;
                    break;
                }
            }
        }



        /*
		if(player.craftables[i].name == "Mining cart and tracks"){
			for(var j = 0; j < player.upgrades.length ; j++){
    			player.upgrades[i].upgrade.baseCPS = player.upgrades[i].upgrade.baseCPS * 1.10;
    		}
    	}
    	*/

    }
}