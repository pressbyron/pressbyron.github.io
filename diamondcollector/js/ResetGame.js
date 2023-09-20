function calculateResetValue() {
    return Math.floor(player.gold / 1000000000);
}

function resetGame() {
    swal({
            title: "Are you sure?",
            text: "You will loose all gained experience this level!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, reset please!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                var ownedWorkers = player.experienceWorkers;
                var workersToAdd = calculateResetValue();
                var level = player.level;
                var oldPlayer = player;
                player = new Player();
                player.goldEarnedTotal = oldPlayer.goldEarnedTotal;
                addAllMaterialsToInventory();
                for (var i = 0; i < player.inventory.length; i++) {
                    player.inventory[i].earnedTotal = oldPlayer.inventory[i].earnedTotal;
                }
                player.level = level;
                player.experienceWorkers = ownedWorkers + workersToAdd;
                ga('send', 'event', 'Reset', 'Soft');
                updateGUI();
                saveHard(player);
            } else {
                swal("Cancelled", "You can always come back later :)", "error");
            }
        });
}

function resetGameHard() {
    swal({
            title: "Are you sure?",
            text: "You will loose ALL progress!!!!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, reset please!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                player = new Player();
                ga('send', 'event', 'Reset', 'Hard');
                saveHard(player);
                location.reload();
            } else {
                swal("Cancelled", "Phu, that was close :)", "error");
            }
        });

}