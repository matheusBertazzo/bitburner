var possibleHosts = JSON.parse(read('hosts-info.db.txt'));
var targetScript = "hack-target.script";

for (var i = 0; i < possibleHosts.length; i++) {
    var target = possibleHosts[i];
    
    if (target.hasRootAccess) {
        tprint('Conecting to target: ' + target.hostName);
        var maxRam = target.maxRAM;
        var maxPossibleInstances = Math.floor(maxRam / 2.45);
        if(target.hostName == 'home' || target.maxRAM == 0){
            continue;       
        }
        killall(target.hostName);
        scp(targetScript, target.hostName);
        exec(targetScript, target.hostName, maxPossibleInstances);
    }
}