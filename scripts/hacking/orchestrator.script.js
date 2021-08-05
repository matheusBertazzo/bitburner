var targetScript = args[0] || "hack-target.script";
var targetMachine = args[1] || 'n00dles';
var possibleHosts = JSON.parse(read('hosts-info.db.txt'));
var scriptRAM = getScriptRam(targetScript);

for (var i = 0; i < possibleHosts.length; i++) {
  var target = possibleHosts[i];

  if (target.hasRootAccess) {

    if (target.maxRAM == 0) { continue; }

    var maxPossibleThreads = Math.floor(target.maxRAM / scriptRAM);

    print('Executing ' + targetScript + ' targetting ' + targetMachine + ' on host ' + target.hostName + ' using ' + maxPossibleThreads + ' threads');

    killall(target.hostName);
    exec(targetScript, target.hostName, maxPossibleThreads, targetMachine);
  }
}