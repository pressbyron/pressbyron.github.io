$(document).ready(function {
    for (var i = 0; i < player.materials; i++) {
        var element = document.createElement("P");
        element.text = "player.materials[i]";
        $("#tabs-1").add(element);
    }
});