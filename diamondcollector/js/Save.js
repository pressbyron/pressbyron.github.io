var timer = 0;
var googleTimer = 0;

function save() {
    timer++;
    googleTimer++;
    if (timer == 10) {
        checkForAchivements();
        timer = 0;
        var playerr = JSON.stringify(player);
        localStorage.setItem("player", playerr);

    }
    if (googleTimer == 600) {
        ga('send', 'event', 'Played', '1minute');
        googleTimer = 0;
    }
}

function saveHard(playerToSave) {
    var playerr = JSON.stringify(playerToSave);
    localStorage.setItem("player", playerr);
    location.reload();
}