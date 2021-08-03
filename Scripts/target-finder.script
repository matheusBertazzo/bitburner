var possibleHosts = scan("home");
var targetHosts = [];

for (var i = 0; i < possibleHosts.length; i++) {
    var target = possibleHosts[i];
    var targetHackChance = Math.floor(hackChance(target) * 100);
    var maxMoney = (getServerMaxMoney(target) / 1000000).toFixed(2);
    var availableMoney = (getServerMoneyAvailable(target) / 1000000).toFixed(2);

    print("===============");
    print("Server: " + target);
    print("Hack Chance: " + targetHackChance + "%");
    print("Money: " + availableMoney + " M/" + maxMoney + " M");
}