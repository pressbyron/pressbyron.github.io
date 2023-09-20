var ww = undefined;
var wwQue = 0;
var wwQueMax = 4;
var queItem = null;

var idleWW = undefined;
var queItemIdle = null;

var allCraftables = [
    //MATERIALS
    new Craftable("CopperBar", [new CraftCost("Copper", 250)], 3000, "A material used to craft other stuff! *Requires a furnance to craft*", ["Furnance"], "Materials"),
    new Craftable("IronBar", [new CraftCost("Iron", 250)], 6000, "A material used to craft other stuff! *Requires a furnanace to craft*", ["Furnance"], "Materials"),
    new Craftable("BronzeBar", [new CraftCost("Copper", 250), new CraftCost("Iron", 250)], 6000, "A material used to craft other stuff! *Requires a furnanace to craft*", ["Furnance"], "Materials"),
    new Craftable("BlastingPowder", [new CraftCost("Stone", 10000), new CraftCost("Sulfur", 10000)], 15000, "Used in dynamite-crafting!", [], "Materials"),
    new Craftable("Gear", [new CraftCost("CopperBar", 10), new CraftCost("IronBar", 10)], 7500, "Used in crafting!", [], "Materials"),
    new Craftable("ElectronicChip", [new CraftCost("CopperBar", 25), new CraftCost("Platinum", 100)], 5000, "Used in crafting!", [], "Materials"),
    new Craftable("CheapRing", [new CraftCost("Copper", 250), new CraftCost("Emerald", 25)], 5000, "Your wife deserves better!", [], "Materials"),
    new Craftable("StandardRing", [new CraftCost("Iron", 5000), new CraftCost("Aluminium", 2500), new CraftCost("Emerald", 10000)], 10000, "An OK ring :)", [], "Materials"),
    new Craftable("GoldRing", [new CraftCost("Gold", 10000), new CraftCost("Ruby", 10000)], 25000, "This is a weddingring! <3 *Requires a jewelers kit to craft*", ["JewelersKit"], "Materials"),

    //UTILITIES
    new Craftable("Furnance", [new CraftCost("Stone", 5000)], 25000, "Needed to smelt bars.", [], "Utilities"),
    new Craftable("SuperFurnance", [new CraftCost("Stone", 500000000), new CraftCost("CopperBar", 750)], 25000, "Unlocks the ability to craft 10 materials at a time. *Requires furnance*", ["Furnance"], "Utilities"),
    new Craftable("IdleCrafting", [new CraftCost("Sand", 15000), new CraftCost("Gravel", 6000), new CraftCost("Stone", 4500), new CraftCost("Copper", 3000), new CraftCost("Emerald", 1500)], 25000, "Unlocks the idle-crafting!", [], "Utilities"),
    new Craftable("AutomaticSeller", [new CraftCost("Gear", 100)], 25000, "Enables the automatic selling button on the inventory-screen.", [], "Utilities"),
    new Craftable("CraftqueLv1", [new CraftCost("Aluminium", 2500), new CraftCost("Tin", 2500)], 25000, "Increase your craft que capacity with 10 items.", [], "Utilities"),
    new Craftable("CraftqueLv2", [new CraftCost("Aluminium", 250000), new CraftCost("Tin", 250000)], 25000, "Increase your craft que capacity with 10 items.", [], "Utilities"),
    new Craftable("CraftqueLv3", [new CraftCost("Aluminium", 25000000), new CraftCost("Tin", 25000000)], 25000, "Increase your craft que capacity with 10 items.", [], "Utilities"),
    new Craftable("CraftqueLv4", [new CraftCost("Aluminium", 25000000000), new CraftCost("Tin", 2500000000)], 25000, "Increase your craft que capacity with 10 items.", [], "Utilities"),
    new Craftable("Anvil", [new CraftCost("Stone", 10000000), new CraftCost("Iron", 750000)], 60000, "Used in tool-making.", [], "Utilities"),

    //GEAR
    new Craftable("SandPick", [new CraftCost("Sand", 1000)], 5000, "Not very good for breaking down rock, eh? Still beats punching! +2 Clicking Power.", [], "Gear"),
    new Craftable("CopperPick", [new CraftCost("Copper", 1000)], 5000, "More robust than a sand pick! Clicking Power +8!", [], "Gear"),
    new Craftable("IronPick", [new CraftCost("Iron", 2500), new CraftCost("IronBar", 25)], 5000, "Clicking Power +15!", [], "Gear"),
    new Craftable("GoldPick", [new CraftCost("Gold", 10000)], 5000, "This is a shiny pick, Clicking Power +25!", [], "Gear"),
    new Craftable("DiamondPick", [new CraftCost("Diamond", 2500), new CraftCost("Gold", 10000)], 5000, "Harder than anything else, Clicking Power +50!", [], "Gear"),
    new Craftable("SandDrill", [new CraftCost("Sand", 1000000), new CraftCost("Gear", 10)], 5000, "How does this function!? Clicking Power +65", [], "Gear"),
    new Craftable("CopperDrill", [new CraftCost("Copper", 1000000), new CraftCost("Gear", 25)], 5000, "Drilling like a pro! Clicking Power +75!", [], "Gear"),
    new Craftable("IronDrill", [new CraftCost("Iron", 2500000), new CraftCost("IronBar", 250), new CraftCost("Gear", 50)], 5000, "Bzzzrrrr! Clicking Power +100!", [], "Gear"),
    new Craftable("GoldDrill", [new CraftCost("Gold", 5000000), new CraftCost("Gear", 75)], 5000, "You must be strong, this is heavy! Clicking Power +150!", [], "Gear"),
    new Craftable("DiamondDrill", [new CraftCost("Diamond", 2500000), new CraftCost("Gear", 100)], 5000, "Crushing rock like butter, Clicking Power +300!", [], "Gear"),
    new Craftable("Firework", [new CraftCost("BlastingPowder", 1)], 30000, "A small explosion giving ore equal to 10k manual clicks.", [], "Gear"),
    new Craftable("Dynamite", [new CraftCost("BlastingPowder", 100)], 30000, "This will explode, giving ore equal to 1M manual clicks.", [], "Gear"),
    new Craftable("ExperienceStone", [new CraftCost("Copper", 100000000), new CraftCost("Tin", 350000), new CraftCost("Ruby", 10000000), new CraftCost("Platinum", 500000)], 60000, "Use this to gain a 100k experience boost. *Requires a jewelers kit to craft*", ["JewelersKit"], "Gear"),
    new Craftable("JewelersKit", [new CraftCost("CheapRing", 100), new CraftCost("Gold", 50000)], 100000, "Used to craft high-value jewelry. *Requires a anvil to craft*", ["Anvil"], "Gear"),

    //WORKFORCE

    //UnqualifiedWorker
    new Craftable("QualifiedWorker", [new CraftCost("Sand", 4000), new CraftCost("Gravel", 3500), new CraftCost("Stone", 2500)], 5000, "Your unqualified workers is abit more effective. +0.2 baseCPS.", [], "Workforce"),
    new Craftable("ExpertWorker", [new CraftCost("Sand", 15000), new CraftCost("Gravel", 12000), new CraftCost("Stone", 10000), new CraftCost("Ruby", 1000)], 5000, "Your unqualified workers is abit more effective. +1.8 baseCPS.", [], "Workforce"),
    new Craftable("Godlike", [new CraftCost("Stone", 10000000000), new CraftCost("Gold", 10000)], 5000, "Unqualified workers is now godlike at what they do. +7.0 baseCPS.", [], "Workforce"),
    new Craftable("TheForce", [new CraftCost("Stone", 1000000000000), new CraftCost("Gold", 100000000)], 5000, "Unqualified workers is now using the force. +15.0 baseCPS.", [], "Workforce"),

    //Miner
    new Craftable("MinerPickaxe", [new CraftCost("Sand", 10000), new CraftCost("Gravel", 8000), new CraftCost("Stone", 7000), new CraftCost("Copper", 10000), new CraftCost("Emerald", 150)], 5000, "Your workers get a new pickaxe! +2.5 baseCPS.", [], "Workforce"),
    new Craftable("MinerDrill", [new CraftCost("Tin", 100000), new CraftCost("Gold", 2000), new CraftCost("Diamond", 50)], 5000, "Miners now use drills and not pickaxes! +7.5 baseCPS.", [], "Workforce"),
    new Craftable("MinerExpertise", [new CraftCost("Iron", 100000000000), new CraftCost("Gold", 20000000), new CraftCost("Diamond", 5000)], 5000, "Skill is key! +15.0 baseCPS.", [], "Workforce"),

    //Foreman
    new Craftable("Leadership", [new CraftCost("Emerald", 10000), new CraftCost("Ruby", 5000)], 5000, "Good leadership is key to success! +10.0 baseCPS.", [], "Workforce"),
    new Craftable("SalaryBoost", [new CraftCost("Gold", 5000000)], 5000, "By increasing foremens salary they suddenly work harder! +25.0 baseCPS", [], "Workforce"),
    new Craftable("YellMore", [new CraftCost("Diamond", 10000000000)], 5000, "They yell more to get more done! +40.0 baseCPS", [], "Workforce"),

    //AutomaticDrill
    new Craftable("GoldDrills", [new CraftCost("Gold", 10000)], 5000, "Change the tip of the automatic drills to gold! +30.0 baseCPS.", [], "Workforce"),
    new Craftable("Uptime", [new CraftCost("Ruby", 25000000), new CraftCost("Sapphire", 25000)], 5000, "The uptime of automatic drills increase making them more effective! +50.0 baseCPS.", [], "Workforce"),
    new Craftable("Overclocked", [new CraftCost("Ruby", 2500000000), new CraftCost("Sapphire", 2500000)], 5000, "Overclocking automatic drills works too! +75.0 baseCPS.", [], "Workforce"),
    new Craftable("AlgorithmUpdate", [new CraftCost("Copper", 5000000000000)], 5000, "A new algorithm make the automatic drills find more ore. +100.0 baseCPS", [], "Workforce"),

    //OverclockedDrill
    new Craftable("NewCoolingSystem", [new CraftCost("Aluminium", 5000000)], 5000, "New aluminium heatpipes installed on the overclocked drills! +50.0 baseCPS.", [], "Workforce"),
    new Craftable("DiamondDrills", [new CraftCost("Diamond", 50000000)], 5000, "Change the tip of the overclocked drills to diamond! +75.0 baseCPS.", [], "Workforce"),
    new Craftable("BiggerEngine", [new CraftCost("Iron", 750000000), new CraftCost("Platinum", 50000000), new CraftCost("Diamond", 50000000)], 5000, "Upgrade the engine of the overclocked drill! +90.0 baseCPS.", [], "Workforce"),
    new Craftable("BiggerFueltank", [new CraftCost("Tin", 50000000000), new CraftCost("Aluminium", 5000000000)], 5000, "More fuel for longer shifts! +125.0 baseCPS.", [], "Workforce"),

    //Robot
    new Craftable("NewCpu", [new CraftCost("Platinum", 7500000), new CraftCost("ElectronicChip", 10)], 5000, "A new cpu brings +75.0 baseCPS to the robots.", [], "Workforce"),
    new Craftable("MoreRam", [new CraftCost("Platinum", 75000000), new CraftCost("ElectronicChip", 25)], 5000, "More RobotRAM is always nice. +100.0 baseCPS.", [], "Workforce"),
    new Craftable("BiggerDrills", [new CraftCost("Platinum", 750000000), new CraftCost("ElectronicChip", 50)], 5000, "Bigger drills on the robot is nice. +150.0 baseCPS to the robots.", [], "Workforce"),
    new Craftable("BetterReach", [new CraftCost("Platinum", 750000000000), new CraftCost("ElectronicChip", 100)], 5000, "The robot can now go deeper as the wireless signal is increased. +175.0 baseCPS.", [], "Workforce"),

    //Quarry
    new Craftable("Expanding", [new CraftCost("Stone", 34000000000), new CraftCost("Gold", 999999999), new CraftCost("Dynamite", 5)], 5000, "Expanding the quarry brings +100 baseCPS.", [], "Workforce"),
    new Craftable("ExpandingMore", [new CraftCost("Stone", 100000000000), new CraftCost("Gold", 99999999999), new CraftCost("Dynamite", 10)], 5000, "Expanding the quarry brings +150 baseCPS.", [], "Workforce"),

    //BUILDINGS
    new Craftable("SmallMiningCompany", [new CraftCost("Sand", 5000), new CraftCost("Gravel", 4000), new CraftCost("Stone", 3500), new CraftCost("Copper", 3000), new CraftCost("Emerald", 400)], 5000, "Your company is growing and so are your mine reaching deeper and unlocking new ores!", [], "Buildings"),
    new Craftable("TunnelSupport", [new CraftCost("Stone", 18000), new CraftCost("Iron", 12000), new CraftCost("CopperBar", 100)], 5000, "Building support is critical to run a safe mining company! Unlocks new ores!", [], "Buildings"),
    new Craftable("DiamondDepths", [new CraftCost("Iron", 90000), new CraftCost("IronBar", 89), new CraftCost("CopperBar", 200)], 5000, "You can go deeper and find more ores!", [], "Buildings"),
    new Craftable("LunchResturant", [new CraftCost("Gravel", 500000), new CraftCost("Stone", 500000)], 50000, "Give your workers a place to eat, increasing productivity by 10% (machines are served oil!)", [], "Buildings"),
    new Craftable("Pub", [new CraftCost("Gravel", 7500000), new CraftCost("Aluminium", 500000), new CraftCost("BronzeBar", 150)], 50000, "Give your workers a place to drink, increasing productivity by 10% (machines are served oil!)", [], "Buildings"),
    new Craftable("Cabins", [new CraftCost("Stone", 100000000), new CraftCost("Tin", 10000000), new CraftCost("Gold", 100000)], 50000, "Give your workers a place to sleep, increasing productivity by 25%", [], "Buildings"),
    new Craftable("Garage", [new CraftCost("Stone", 1000000000), new CraftCost("Tin", 100000000), new CraftCost("Gold", 1000000)], 50000, "Somewhere to put things! Increasing productivity by 50%", [], "Buildings"),
];

function Craftable(name, cost, craftTime, description, requirements, category) {
    this.name = name;
    this.cost = cost;
    this.craftTime = craftTime;
    this.description = description;
    this.requirements = requirements;
    this.category = category;
    this.bonusCollected = false;
}

function CraftCost(material, count) {
    this.material = material;
    this.count = count;
}

function abortCrafting() {
    wwQue = 0;
    updateGUI();
}

function craftCraftable(evt) {
    $(this).tooltip('hide')
    $(this).blur();
    var craftable = evt.target.myParam;
    var requirements = craftable.requirements.length;
    var fullfilled = 0;

    for (var i = 0; i < craftable.requirements.length; i++) {
        for (var k = 0; k < player.craftables.length; k++) {
            if (craftable.requirements[i] == player.craftables[k].name) {
                fullfilled++;
            }
        }
    }


    if (wwQue <= wwQueMax) {
        if (fullfilled == requirements) {
            if (typeof(ww) == "undefined") { //If worker is not running start new worker.
                queItem = craftable;
                wwQue++;
                startCraftWorker(craftable);
            } else if (queItem == craftable) { //Add to que.
                wwQue++; //Add one to worker que
            } else {

            }
        }

    }
}

function canAfford(craftable) {
    var affordable = true;
    for (var k = 0; k < craftable.cost.length; k++) {
        for (var i = 0; i < player.inventory.length; i++) {
            if (player.inventory[i].material.name == craftable.cost[k].material &&
                player.inventory[i].owned < craftable.cost[k].count) {
                affordable = false;
                break;
            }
        }
    }
    return affordable;
}

function canAffordMultiple(craftable, count) {
    var affordable = true;
    for (var k = 0; k < craftable.cost.length; k++) {
        for (var i = 0; i < player.inventory.length; i++) {
            if (player.inventory[i].material.name == craftable.cost[k].material &&
                (player.inventory[i].owned * count) < (craftable.cost[k].count * count)) {
                affordable = false;
                break;
            }
        }
    }
    return affordable;
}


function requirementsFullfilled(craftable) {
    var requirements = craftable.requirements.length;
    if (player.craftables.length == 0 && requirements > 0) {
        return false;
    }
    var fullfilled = 0;
    for (var i = 0; i < craftable.requirements.length; i++) {
        for (var k = 0; k < player.craftables.length; k++) {
            if (craftable.requirements[i] == player.craftables[k].name) {
                fullfilled++;
            }
        }
    }
    return fullfilled >= requirements;
}

function startIdleCraftWorker() {
    if ($('#idleCraftStatus').is(":checked")) {
        var count = $('#craft-ores-count :selected').val();
        var craftableName = $('#idleCrafting :selected').text();
        var craftable;
        for (var j = 0; j < allCraftables.length; j++) {
            if (allCraftables[j].name == craftableName) {
                craftable = allCraftables[j];
            }
        }
        if (canAffordMultiple(craftable, count) && requirementsFullfilled(craftable)) {
            for (var k = 0; k < craftable.cost.length; k++) {
                for (var i = 0; i < player.inventory.length; i++) {
                    if (player.inventory[i].material.name == craftable.cost[k].material) {
                        player.inventory[i].owned -= (craftable.cost[k].count * count);
                        updatePlayer(player);
                        if (k == craftable.cost.length - 1) {

                            idleWW = new Worker('js/CraftingWorker.js');
                            craftable.craftTime = craftable.craftTime * 5;
                            idleWW.postMessage(craftable);

                            $("#craftingProgressIdle").animate({
                                width: "100%",
                                ariaValuenow: 100
                            }, craftable.craftTime, "linear", function() {
                                $("#craftingProgressIdle").css('width', 0 + '%').attr('aria-valuenow', 0);
                            });
                            craftable.craftTime = craftable.craftTime / 5;
                        }
                    }
                }

            }

        } else {
            setTimeout("startIdleCraftWorker()", 1000);
        }

        if (idleWW != undefined) {
            idleWW.onmessage = function(event) {
                $("#craftingProgressIdle").stop();
                $("#craftingProgressIdle").css('width', 0 + '%').attr('aria-valuenow', 0);
                for (var j = 0; j < player.inventory.length; j++) {
                    if (player.inventory[j].material.name == event.data.name) {
                        for (var a = 0; a < count; a++) {
                            player.inventory[j].owned++;
                        }
                        idleWW.terminate();
                        idleWW = undefined;
                        break;
                    }
                }
                checkForBonuses();
                updatePlayer(player);

                startIdleCraftWorker();



            }
        }
    } else {
        setTimeout("startIdleCraftWorker()", 1000);
    }
}


function startCraftWorker(craftable) {
    if (canAfford(craftable)) {
        for (var k = 0; k < craftable.cost.length; k++) {
            for (var i = 0; i < player.inventory.length; i++) {
                if (player.inventory[i].material.name == craftable.cost[k].material) {
                    player.inventory[i].owned -= craftable.cost[k].count;
                    updatePlayer(player);
                    if (k == craftable.cost.length - 1) {
                        ww = new Worker('js/CraftingWorker.js');
                        ww.postMessage(craftable);
                        $("#craftingProgress").animate({
                            width: "100%",
                            ariaValuenow: 100
                        }, craftable.craftTime, "linear", function() {
                            $("#craftingProgress").css('width', 0 + '%').attr('aria-valuenow', 0);
                        });
                    }
                }
            }

        }

    } else {
        wwQue = 0;
        queItem = null;
    }

    ww.onmessage = function(event) {
        wwQue--; //decrease worker que!
        console.log("QUE" + wwQue);

        for (var j = 0; j < player.inventory.length; j++) {
            if (player.inventory[j].material.name == event.data.name) {
                player.inventory[j].owned++;
                ww.terminate();
                ww = undefined;
            }
        }
        if (ww != undefined) {
            player.craftables.push(event.data);
            ww.terminate();
            ww = undefined;
        }
        checkForBonuses();
        updatePlayer(player);
        if (wwQue > 0 && event.data.category == "Materials") {
            startCraftWorker(event.data);
        } else {
            queItem = null;
            wwQue = 0;
        }


    }


}