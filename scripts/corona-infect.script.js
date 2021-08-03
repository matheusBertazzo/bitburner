var possibleHosts = scan("home");
var targetScript = "self-hack.script";

for (var i = 0; i < possibleHosts.length; i++) {
    var target = possibleHosts[i];
    print('Conecting to target: ' + target);

    if (hasRootAccess(target)) {
        killall(target);
        var maxRam = getServerMaxRam(target);
        var usedRam = getServerUsedRam(target);
        var maxPossibleInstances = Math.floor((maxRam - usedRam) / 2.45);
        print('--------------------');
        print('Target: ' + target);
        print('maxRam: ' + maxRam);
        print('usedRam: ' + usedRam);
        print('maxPossibleInstances: ' + maxPossibleInstances);
        scp(targetScript, target);
        exec(targetScript, target, maxPossibleInstances);
    }
}