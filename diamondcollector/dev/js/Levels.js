var leftToLevel;

function calculateLevelValue() {
    return Math.floor((1000 * Math.pow(1.15, player.level))).toFixed(0);
}

function calculateLeftToLevel() {
    leftToLevel = Math.floor((1000 * Math.pow(1.15, player.level + 1))).toFixed(0);
}

function levelUp() {
    $.notify("Level up!", {
        position: "top center"
    });
    player.level++;
    player.unusedTalentPoints++;
    calculateLeftToLevel();
    player.experience = 0;
    updatePlayer(player);
    updateGUI();
}