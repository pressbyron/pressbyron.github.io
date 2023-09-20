var allMaterials = [
    new Material("Sand", 0.1, 70, 0, false, true),
    new Material("Gravel", 0.5, 65, 0, false, true),
    new Material("Stone", 1, 50, 0, false, true),
    new Material("Copper", 2, 30, 0, false, true),
    new Material("Tin", 20, 15, 1, false, true),
    new Material("Iron", 45, 10, 1, false, true),
    new Material("Aluminium", 100, 2, 2, false, true),
    new Material("Sulfur", 250, 5, 2, false, true),
    new Material("Gold", 1000, 0.6, 3, false, true),
    new Material("Platinum", 3000, 0.05, 3, false, true),
    new Material("Diamond", 25000, 0.001, 1, false, true),
    new Material("Emerald", 50, 3, 0, false, true),
    new Material("Ruby", 450, 0.5, 1, false, true),
    new Material("Sapphire", 250, 0.03, 3, false, true),
    new Material("CopperBar", 750, 0, 0, false, false),
    new Material("IronBar", 15000, 0, 0, false, false),
    new Material("BronzeBar", 25000, 0, 0, false, false),
    new Material("BlastingPowder", 3000000, 0, 0, false, false),
    new Material("Firework", 750, 0, 0, true, false),
    new Material("Dynamite", 750, 0, 0, true, false),
    new Material("Gear", 160000, 0, 0, false, false),
    new Material("ElectronicChip", 2, 0, 0, false, false),
    new Material("CheapRing", 4000, 0, 0, false, false),
    new Material("StandardRing", 3000000, 0, 0, false, false),
    new Material("GoldRing", 2500000, 0, 0, false, false),
    new Material("ExperienceStone", 750, 0, 0, true, false),
];

function Material(name, value, dropRate, tier, usable, isOre) {
    return {
        name: name,
        value: value,
        dropRate: dropRate,
        tier: tier,
        usable: usable,
        isOre: isOre,
    }
}

function enoughBullets() {
    for (var j = 0; j < player.inventory.length; j++) {
        if (player.inventory[j].material.name == "Bullet" && player.inventory[j].owned > 0) {
            return true;
        }
    }
}


//HERE ALL SPECIAL ITEMS DROP CONDITIONS IS ADDED!
function isSpecialItem(theMaterial) {

    for (var j = 0; j < player.craftables.length; j++) {
        if (player.craftables[j].name == "Gun" && theMaterial.name == "Fur" && enoughBullets()) {
            return true;
        } else {
            return false;
        }
    }
}

function calculateMaterialDrop(theMaterial) {
    if (theMaterial.tier <= player.tier) {
        var n = Math.round(Math.random() * 10000) + 1;
        if (isSpecialItem(theMaterial)) {
            if (n <= 2 * 10) {
                for (var j = 0; j < player.inventory.length; j++) {
                    if (player.inventory[j].material.name == "Bullet") player.inventory[j].owned--;
                }
                return true;

            } else {
                return false;
            }
        } else {

            if (n <= theMaterial.dropRate * 100) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}