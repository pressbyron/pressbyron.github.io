var started = false;
var craftTime = 0;
var craftable;
var incomeTimer = 1000;

onmessage = function(event) {
    craftable = event.data;

    if (!started) {
        craft(craftable);
        started = true;
    } else {

    }
    //postMessage(player);

}

function craft() {
    if (craftTime < craftable.craftTime) {
        craftTime += incomeTimer;
        setTimeout("craft()", incomeTimer);
    } else {
        postMessage(craftable);
    }

}