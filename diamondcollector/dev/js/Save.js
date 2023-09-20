var timer = 0;
var adTimer = 0;
var googleTimer = 0;

function save() {
    timer++;
    googleTimer++;
    adTimer++;
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

    if(adTimer == 100){ // 900000
        adTimer = 0;

         swal({
                title: "Bonus stuff!",
                text: "Do you want to view a ad to get a craft-speed bonus for 5minutes?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Yes please!",
                closeOnConfirm: true,
            },
            function() {
                adTimer = 0;
                $('#adModal').modal('show');
            });
    }
}

function saveHard(playerToSave) {
    var playerr = JSON.stringify(playerToSave);
    localStorage.setItem("player", playerr);
    location.reload();
}