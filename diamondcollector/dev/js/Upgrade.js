var allUpgrades = [
    new Upgrade("UnqualifiedWorker", 0.3, 100),
    new Upgrade("Miner", 5, 10000),
    new Upgrade("Foreman", 25, 325000),
    new Upgrade("AutomaticDrill", 70, 5000000),
    new Upgrade("OverclockedDrill", 200, 100000000),
    new Upgrade("Robot", 750, 5000000000),
    new Upgrade("Quarry", 5000, 500000000000),
    new Upgrade("SpaceSettlement", 20000, 500000000000000),
];

function Upgrade(name, baseCPS, cost) {
    this.name = name;
    this.baseCPS = baseCPS;
    this.cps = baseCPS;
    this.cost = cost;
    this.level = 1;
}

function calculateUpgradeCost(theUpgrade) {
    return (theUpgrade.upgrade.cost * Math.pow(1.15, theUpgrade.owned));
}

function increaseBaseCps(upgrade, amount) {
    upgrade.baseCPS += amount;
    upgrade.cps = (upgrade.baseCPS * upgrade.level).toFixed(1);
    reCalculateIncome();
    $("#" + upgrade.name + "Tooltip").tooltip('hide')
        .attr('data-original-title', "CPS: " + upgrade.cps)
        .tooltip('fixTitle');
}

function evolveUpgrade(evt) {
    var theUpgrade = evt.target.myParam;
    for (var i = 0; i < player.upgrades.length; i++) {
        if (theUpgrade.name == player.upgrades[i].upgrade.name && player.gold >= calculateEvolveCost(player.upgrades[i].upgrade)) {
            player.gold -= calculateEvolveCost(player.upgrades[i].upgrade);
            player.upgrades[i].upgrade.level++;
            player.upgrades[i].upgrade.cps = (player.upgrades[i].upgrade.baseCPS * player.upgrades[i].upgrade.level).toFixed(1);
            $("#" + player.upgrades[i].upgrade.name + "Tooltip").tooltip('hide')
                .attr('data-original-title', "CPS: " + player.upgrades[i].upgrade.cps)
                .tooltip('fixTitle');
            if (player.upgrades[i].owned >= player.upgrades[i].upgrade.level * 25) {
                $("#" + player.upgrades[i].upgrade.name + "evolve").show();
                if ((player.upgrades[i].owned % 25 == 0 && player.upgrades[i].owned != 0) || player.upgrades[i].owned > 25 * player.upgrades[i].upgrade.level) {
                    $("#" + player.upgrades[i].upgrade.name + "evolve").html(numberWithCommas(calculateEvolveCost(player.upgrades[i].upgrade)));
                } else {
                    $("#" + player.upgrades[i].upgrade.name + "evolve").hide();
                }
            } else {
                $("#" + player.upgrades[i].upgrade.name + "evolve").hide();
            }
        }
        reCalculateIncome();
        updatePlayer(player);

    }
}

function reCalculateIncome() {
    var newIncome = 0;
    for (var i = 0; i < player.upgrades.length; i++) {
        newIncome += player.upgrades[i].owned * (player.upgrades[i].upgrade.baseCPS * player.upgrades[i].upgrade.level);
    }
    player.income = newIncome;
    if (w != undefined) {
        updatePlayer(player);
    }
}

function calculateEvolveCost(theUpgrade) {
    return ((theUpgrade.cost * 5) * Math.pow(1.15, theUpgrade.level * 25)).toFixed(0);
}