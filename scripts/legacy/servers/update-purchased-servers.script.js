var script = args[0] || 'hack-target.script';
var scriptTarget = args[1] || 'n00dles';
var servers = getPurchasedServers();
var scriptRAM = 2.40;

for (var i = 0; i < servers.length; i++){
    var server = servers[i];
    var maxRam = getServerMaxRam(server);
    var maxPossibleInstances = Math.floor(maxRam / scriptRAM);
    
    killall(server);
    scp(script, server);
    exec(script, server, maxPossibleInstances, scriptTarget);
}