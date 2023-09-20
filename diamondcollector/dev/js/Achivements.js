var upgradeAchivements = [
    new Achivement("UnqualifiedWorkerI", "Cheap labor!", "UnqualifiedWorker", 10),
    new Achivement("UnqualifiedWorkerII", "They are running around like crazy.", "UnqualifiedWorker", 25),
    new Achivement("UnqualifiedWorkerIII", "Please make sure everyone is wearing a helmet.", "UnqualifiedWorker", 75),
    new Achivement("UnqualifiedWorkerIV", "This place is crowded :o", "UnqualifiedWorker", 150),

    new Achivement("MinerI", "A proper work-force.", "Miner", 10),
    new Achivement("MinerII", "Miners paradise.", "Miner", 25),
    new Achivement("MinerIII", "So many but yet so effective.", "Miner", 75),
    new Achivement("MinerIV", "A human co-ordination perfection.", "Miner", 150),

    new Achivement("ForemanI", "Finally someone to point and yell.", "Foreman", 10),
    new Achivement("ForemanII", "No rest, no slack, WORK!", "Foreman", 25),
    new Achivement("ForemanIII", "Lurking in every corner of the mine.", "Foreman", 75),
    new Achivement("ForemanIV", "Such leadership, much work, pretty diamonds.", "Foreman", 150),

    new Achivement("AutomaticDrillI", "Automation is here!", "AutomaticDrill", 10),
    new Achivement("AutomaticDrillII", "Why do we even have humans?", "AutomaticDrill", 25),
    new Achivement("AutomaticDrillIII", "The fuel is free, right?", "AutomaticDrill", 75),
    new Achivement("AutomaticDrillIV", "Crushing rock as never before!", "AutomaticDrill", 150),

    new Achivement("OverclockedDrillI", "Changing one setting increases the production of the drills?!", "OverclockedDrill", 10),
    new Achivement("OverclockedDrillII", "Machinery is amazing.", "OverclockedDrill", 25),
    new Achivement("OverclockedDrillIII", "*crunch* *crunch*", "OverclockedDrill", 75),
    new Achivement("OverclockedDrillIV", "Computers + drills = amazing.", "OverclockedDrill", 150),

    new Achivement("RobotI", "A metall human?", "Robot", 10),
    new Achivement("RobotII", "Smart, fast and effective.", "Robot", 25),
    new Achivement("RobotIII", "The company is running itself.", "Robot", 75),
    new Achivement("RobotIV", "Blip blop :)", "Robot", 150),

    new Achivement("QuarryI", "Digging up ore faster than you think!", "Quarry", 10),
    new Achivement("QuarryII", "So much dirt, everywhere!", "Quarry", 25),
    new Achivement("QuarryIII", "You are crazy!", "Quarry", 75),
    new Achivement("QuarryIV", "Is this achivement possible?! :)", "Quarry", 150),

    new Achivement("SpaceSettlementI", "Space is a cool place!", "SpaceSettlement", 10),
    new Achivement("SpaceSettlementII", "Have you met the aliens?", "SpaceSettlement", 25),
    new Achivement("SpaceSettlementIII", "Soon space is as damaged as earth...", "SpaceSettlement", 75),
    new Achivement("SpaceSettlementIV", "What is next?", "SpaceSettlement", 150),
]

var moneyAchivements = [
    new Achivement("CashI", "Letters instead of numbers, what is this sorcery?", null, 1000),
    new Achivement("CashII", "Money generates money!", null, 100000),
    new Achivement("CashIII", "Millionare!", null, 1000000),
    new Achivement("CashIV", "$$$", null, 100000000),
    new Achivement("CashV", "So... much... money!", null, 1000000000),
    new Achivement("CashVI", "How about a reset?", null, 10000000000),
    new Achivement("CashVII", "This is insane!", null, 100000000000),
    new Achivement("CashVIII", "Thank god for short-numbers.", null, 1000000000000),
    new Achivement("CashIX", "Keep going, champ!", null, 10000000000000),
    new Achivement("CashX", "Soon you can own the world!", null, 100000000000000),
    new Achivement("CashXI", "How far can you get?", null, 1000000000000000),
    new Achivement("CashXII", "Money money money, it's so funny...", null, 10000000000000000),
]

function Achivement(name, description, upgrade, amount, collected) {
    return {
        name: name,
        description: description,
        upgrade: upgrade,
        amount: amount,
        collected: false,
    }
}

function checkForAchivements() {
    $('#incomeBonus').html("Total bonus to CPS: " + ((player.incomeBonus - 1) * 100).toFixed(0) + "%");
    for (var i = 0; i < moneyAchivements.length; i++) {
        if (player.gold >= moneyAchivements[i].amount && moneyAchivements[i].collected == false) {
            $('#' + moneyAchivements[i].name + 'Achiv').html("Collected!");
            $("#" + moneyAchivements[i].name + 'Achiv').tooltip('hide')
                .attr('data-original-title', '<p class="text-small">' + ' earned:' + numberWithCommas(moneyAchivements[i].amount) + '<br>"' + moneyAchivements[i].description + '"</p>')
                .tooltip('fixTitle');
            moneyAchivements[i].collected = true;
            player.incomeBonus += 0.01;
            $('#incomeBonus').html("Total bonus to CPS: " + ((player.incomeBonus - 1) * 100).toFixed(0) + "%");
            updatePlayer(player);
        }
    }
    for (var i = 0; i < upgradeAchivements.length; i++) {
        for (var j = 0; j < player.upgrades.length; j++) {
            if (player.upgrades[j].upgrade.name == upgradeAchivements[i].upgrade && player.upgrades[j].owned >= upgradeAchivements[i].amount && upgradeAchivements[i].collected == false) {
                //$('#' + upgradeAchivements[i].name + 'Achiv').css('background', 'url(Achivement.png) no-repeat');
                $('#' + upgradeAchivements[i].name + 'Achiv').html("Collected!");
                $("#" + upgradeAchivements[i].name + 'Achiv').tooltip('hide')
                    .attr('data-original-title', '<p class="text-small">' + upgradeAchivements[i].upgrade + ' owned:' + upgradeAchivements[i].amount + '<br>"' + upgradeAchivements[i].description + '"</p>')
                    .tooltip('fixTitle');
                upgradeAchivements[i].collected = true;
                player.incomeBonus += 0.01;
                $('#incomeBonus').html("Total bonus to CPS: " + ((player.incomeBonus - 1) * 100).toFixed(0) + "%");
                updatePlayer(player);
            }
        }
    }


}