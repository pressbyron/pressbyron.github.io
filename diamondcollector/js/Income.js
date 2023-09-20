var totalIncome = 1;
var hej = 0;
var w;
$(document).ready(function() {
    var canvas = document.getElementById("myCanvas");
    canvas.onselectstart = function() {
        return false;
    }
    w = new Worker('js/IncomeWorker.js');
    w.postMessage(player);
    w.onmessage = function(event) {
        player = event.data;
        updateGUI();
        save();
        //console.log(event.data);
    }

});

function updateIncome(incomeAddition) {
    player.income += incomeAddition;
    w.postMessage(player);
}

function updateGold(goldAddition) {
    player.goldEarned += goldAddition;
    player.goldEarnedTotal += goldAddition;
    player.gold += goldAddition;
    w.postMessage(player);
}

function updatePlayer(player) {
    w.postMessage(player);
}

function numberWithCommas(x) {
    return nFormatter(x, 2);
    //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function nFormatter(num, digits) {
    var si = [{
            value: 1E18,
            symbol: "AB"
        }, {
            value: 1E15,
            symbol: "A"
        }, {
            value: 1E12,
            symbol: "T"
        }, {
            value: 1E9,
            symbol: "B"
        }, {
            value: 1E6,
            symbol: "M"
        }, {
            value: 1E3,
            symbol: "k"
        }],
        i;
    for (i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (Number((num / si[i].value).toFixed(digits))).toFixed(digits).toString().replace(".", ",") + si[i].symbol;
        }
    }
    return num.toString();
}

function fadeOut(canvas, context, text, x, y) {
    var alpha = 1.0, // full opacity

        interval = setInterval(function() {
            canvas.width = canvas.width; // Clears the canvas
            context.fillStyle = "rgba(0, 255, 0, " + alpha + ")";
            context.font = "italic 20pt Arial";
            context.lineWidth = 1;
            // stroke color
            context.strokeStyle = 'black';
            context.strokeText(text,
                x - 10,
                y + 10);

            context.fillText(text,
                x - 10,
                y + 10);
            alpha = alpha - 0.05; // decrease opacity (fade out)
            if (alpha < 0) {
                canvas.width = canvas.width;
                clearInterval(interval);
            }
        }, 10);
}

function mine(evt) {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    fadeOut(canvas, context, "+Ore", x, y);

    for (var j = 0; j < player.pickaxeMultiplier; j++) {
        for (var i = 0; i < player.inventory.length; i++) {
            if (calculateMaterialDrop(player.inventory[i].material)) {
                player.inventory[i].owned++;
                player.inventory[i].earned++;
                player.inventory[i].earnedTotal++;


            }
        }
    }
    updatePlayer(player);
    
}