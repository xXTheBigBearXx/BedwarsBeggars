const Mineflayer = require("mineflayer");
const config = require("./config/minecraft.json");
const regex = require("./regex.js");

const mc = Mineflayer.createBot(config);
mc.settings.viewDistance = "tiny";

var whereami = "";

function get2BwLob1(t) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (whereami != "bedwarslobby1") {
                if (/bedwarslobby\d{1,3}/gi.test(whereami)) {
                    console.log("Attempting to switch to bedwars lobby 1...");
                    mc.chat("/swaplobby 1");
                } else {
                    console.log("Sending to any bedwars lobby...");
                    mc.chat("/l bw");
                }
            }
        }, t);
    });
}

function antiAFK(t) {
    return new Promise(function (resolve) {
        setTimeout(async function () {
            console.log("Moving forward...");
            mc.setControlState("forward", true);
            new Promise(function (resolve) {
                setTimeout(function () {
                    mc.setControlState("forward", false);
                    console.log("Executing /stuck...");
                    mc.chat("/stuck");
                    antiAFK(30000);
                }, 500);
            });
        }, t);
    });
}

antiAFK(30000);

mc.on("login", () => {
    mc.chat("/whereami");
});

mc.on("messagestr", async (msg) => {
    var beggar = false;

    if (msg.startsWith("You are currently ") && (msg.includes("in limbo") || msg.includes("connected to server "))) {
        let waiSplt = msg.split(" ");
        whereami = waiSplt[waiSplt.length - 1];
        console.log("Currently in \x1b[33m" + whereami);
        await get2BwLob1(1000);
    }

    if (msg.startsWith("You were kicked while joining that server!")) {
        await get2BwLob1(500);
    }

    regex.forEach((pattern) => {
        if (pattern.test(msg)) beggar = true;
    });

    if (beggar) {
        console.log("\x1b[31mBEGGAR > \x1b[0m" + msg);
    } else {
        console.log("\x1b[32mIngame > \x1b[0m" + msg);
    }

});