function dynamicCreation() {
    for (var i = 0; i < player.inventory.length; i++) {
        var item = player.inventory[i];
        if (item.material.isOre == true) {
            //ADD checkbuttons for selling materials.


            $('#sell-ores')
                .append($("<option></option>")
                    .attr("value", item.material.name)
                    .text(item.material.name));
            /*
            var label = document.createElement("label");
            label.className = "checkbox-inline white";
            var input = document.createElement("input");
            input.type = "checkbox";
            input.value = item.material.name;
            label.appendChild(input);
            label.appendChild(document.createTextNode(item.material.name));
            document.getElementById("sell-ores").appendChild(label);
            document.getElementById("sell-ores").appendChild(input);
            */
        }

        //ADD PICTURES AND SELL

        var div = document.createElement("div");
        div.id = item.material.name + "element";
        div.title = "Value: " + numberWithCommas(item.material.value);
        div.setAttribute("data-toggle", "tooltip");

        var materialName = document.createElement("p");
        materialName.className = "text-center title";
        materialName.innerHTML = item.material.name;
        var image = document.createElement("img");
        image.className = "img-responsive inventory-img";
        image.src = "images/" + item.material.name + ".png";
        image.width = 100;
        image.height = 100;
        var value = document.createElement("p");
        value.id = item.material.name + "value";
        value.innerHTML = item.owned;
        value.className = "text-center";

        var buttonDiv = document.createElement("div");
        buttonDiv.className = "text-center";
        var button = document.createElement("button");
        button.className = "btn btn-xs btn-primary";
        if (item.material.usable) {
            button.innerHTML = "Use";
            button.addEventListener('click', useItem, false);
        } else {
            button.innerHTML = "Sell";
            button.addEventListener('click', sellItem, false);
        }
        button.myParam = item.material;
        buttonDiv.appendChild(button);

        div.appendChild(materialName);
        div.appendChild(image);
        div.appendChild(value);
        div.appendChild(buttonDiv);
        div.className = "inventory material padded-left";
        $("#row1").append(div);
    }

    for (var i = 0; i < player.inventory.length; i++) {
        var item = player.inventory[i];
        var div = document.createElement("div");
        if (item.material.isOre) {
            div.id = item.material.name + "Earned";

            var materialName = document.createElement("p");
            materialName.className = "craftText font-bold";
            materialName.innerHTML = "You have mined: " + item.earned + " " + item.material.name;
            div.appendChild(materialName);
        }
        $("#row5").append(div);
    }

    for (var i = 0; i < player.upgrades.length; i++) {
        var item = player.upgrades[i];
        var div = document.createElement("div");
        div.id = item.upgrade.name + "Tooltip";
        div.title = "CPS: " + item.upgrade.cps;
        div.setAttribute("data-toggle", "tooltip");

        var upgradeName = document.createElement("p");
        upgradeName.className = "text-center title";
        upgradeName.innerHTML = item.upgrade.name.replace(/([A-Z])/g, ' $1').trim();

        var image = document.createElement("img");
        image.className = "img-responsive inventory-img";
        image.src = "images/" + item.upgrade.name + ".png";
        image.width = 100;
        image.height = 100;


        var value = document.createElement("p");
        value.id = item.upgrade.name + "value";
        value.innerHTML = item.owned;
        value.className = "text-center";

        var buttonDiv = document.createElement("div");
        buttonDiv.className = "text-center";
        var button = document.createElement("button");
        button.className = "btn btn-primary btn-sm";
        button.id = item.upgrade.name + "cost";
        button.innerHTML = item.upgrade.cost + "$";
        button.addEventListener('click', buyUpgrade, false);
        button.myParam = item.upgrade;
        buttonDiv.appendChild(button);
        var button2 = document.createElement("button");
        button2.className = "btn btn-success btn-sm";
        button2.id = item.upgrade.name + "evolve";
        button2.innerHTML = "";
        button2.title = "Double the CPS of this upgrade!"
        button2.setAttribute("data-toggle", "tooltip");
        button2.addEventListener('click', evolveUpgrade, false);
        button2.myParam = item.upgrade;
        buttonDiv.appendChild(button2);

        div.appendChild(upgradeName);
        div.appendChild(image);
        div.appendChild(value);
        div.appendChild(buttonDiv);
        div.className = "inventory material padded-left upgrade";
        $("#row2").append(div);
        $("#" + player.upgrades[i].upgrade.name + "evolve").hide();
    }

    var category = null;
    for (var j = 0; j < allCraftables.length; j++) {

        if (allCraftables[j].category == "Materials") {
            $('#idleCrafting')
                .append($("<option></option>")
                    .attr("value", allCraftables[j].name)
                    .text(allCraftables[j].name));
        }

        if (category != allCraftables[j].category) {
            category = allCraftables[j].category;
            var headingDiv = document.createElement("div");
            var heading = document.createElement("h2");
            heading.innerHTML = category;
            headingDiv.appendChild(heading);
            headingDiv.className = "craftHeading clearFloat";
            $("#row3").append(headingDiv);
        }

        var item = allCraftables[j];
        var div = document.createElement("span");
        div.id = item.name + "CraftElement";

        var buttonDiv = document.createElement("span");
        buttonDiv.className = "";
        var button = document.createElement("button");
        button.className = "button";
        button.id = item.name + "cost";
        button.style.background = "url(images/" + item.name + "Slot.png) no-repeat";

        //button.innerHTML = item.name.replace(/([A-Z])/g, ' $1').trim();

        //if (item.name.endsWith("Bar")) {
        button.title = item.name.replace(/([A-Z])/g, ' $1').trim() + "<p margin='margin: 0px;'>\"" + item.description + "\"</p>" + "<hr style='margin: 0px;'>";
        button.title += "<p>Crafttime:" + item.craftTime / 1000 + "/s</p>";
        for (var k = 0; k < item.cost.length; k++) {
            button.title += numberWithCommas(item.cost[k].count) + "(" + item.cost[k].material + ") ";
        }
        button.setAttribute("data-toggle", "tooltip");
        //}

        button.addEventListener('click', craftCraftable, false);
        button.myParam = item;
        buttonDiv.appendChild(button);
        /*
        div.appendChild(upgradeName);
        div.appendChild(value);*/
        div.appendChild(buttonDiv);
        div.className = "";
        $("#row3").append(div);

    }

    for (var i = 0; i < upgradeAchivements.length; i++) {
        var item = upgradeAchivements[i];
        var div = document.createElement("span");
        div.id = item.name + "Achivement";

        var buttonDiv = document.createElement("span");
        buttonDiv.className = "";
        var button = document.createElement("button");
        button.className = "button";
        button.id = item.name + "Achiv";
        button.style.background = "url(images/default.png) no-repeat";

        button.innerHTML = "?";
        button.title = "You have not collected this achivement yet...";
        button.setAttribute("data-toggle", "tooltip");
        buttonDiv.appendChild(button);
        div.appendChild(buttonDiv);
        div.className = "";
        $("#row4").append(div);

    }

    for (var i = 0; i < moneyAchivements.length; i++) {
        var item = moneyAchivements[i];
        var div = document.createElement("span");
        div.id = item.name + "Achivement";

        var buttonDiv = document.createElement("span");
        buttonDiv.className = "";
        var button = document.createElement("button");
        button.className = "button";
        button.id = item.name + "Achiv";
        button.style.background = "url(images/default.png) no-repeat";

        button.innerHTML = "?";
        button.title = "You have not collected this achivement yet...";
        button.setAttribute("data-toggle", "tooltip");
        buttonDiv.appendChild(button);
        div.appendChild(buttonDiv);
        div.className = "";
        $("#row4").append(div);
    }

    for (var i = 0; i < allTalents.length; i++) {
        var talent = allTalents[i];
        var div = document.createElement("div");
        div.id = talent.name + "Talent";
        div.title = talent.description;
        div.setAttribute("data-toggle", "tooltip");

        var talentName = document.createElement("p");
        talentName.className = "text-center";
        talentName.innerHTML = talent.name;
        var image = document.createElement("img");
        image.className = "img-responsive inventory-img";
        image.src = "images/" + talent.name + ".png";
        image.width = 100;
        image.height = 100;
        var value = document.createElement("p");
        value.id = talent.name + "Points";
        if (player.talents[i] != null) {
            value.innerHTML = player.talents[i].points;
        } else {
            value.innerHTML = 0;
        }
        value.className = "text-center";

        var buttonDiv = document.createElement("div");
        buttonDiv.className = "text-center";
        var button = document.createElement("button");
        button.id = talent.name + "Button";
        button.className = "btn btn-xs btn-primary";
        button.innerHTML = "Learn";
        button.addEventListener('click', addTalent, false);
        button.disabled = true;
        button.myParam = talent.name;
        buttonDiv.appendChild(button);

        div.appendChild(talentName);
        div.appendChild(image);
        div.appendChild(value);
        div.appendChild(buttonDiv);
        div.className = "inventory material padded-left";
        $("#talents").append(div);

    }


    $('[data-toggle="tooltip"]').tooltip({
        html: true
    });

    startIdleCraftWorker();
    calculateLeftToLevel();

    setTimeout(function() {
        $('#loading').fadeOut();
    }, 1500);


}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};