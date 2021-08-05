var targetScript = args[0] || "hack-target.script";
var possibleHosts = JSON.parse(read('hosts-info.db.txt'));

for (var i = 0; i < possibleHosts.length; i++) {
    var target = possibleHosts[i];
    
    if (target.hasRootAccess) {
        print('Infecting ' + target.hostName + ' with ' + targetScript);
        scp(targetScript, target.hostName);        
    }
}