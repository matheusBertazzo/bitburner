var hosts = JSON.parse(read('hosts-info.db.txt'));
var hackCommands = createHackCommands();

var maxNumberOfHackeablePorts = getMaximumNumberOfHackeablePorts();
var eligibleHosts = getEligibleHosts(hosts, maxNumberOfHackeablePorts);

for (var i = 0; i < eligibleHosts.length; i++) {
  var target = eligibleHosts[i];
  print('Rooting ' + target.hostName + ' - ' + target.numberOfPortsRequired + ' ports required');     
  rootTheirAss(target);  
}

function rootTheirAss(target) {
  for (var i = target.numberOfPortsRequired; i > -1; i--) {
    hackCommands[i](target.hostName);
  }
}

function createHackCommands() {
  var nukeDelegate = function (target) { nuke(target); };
  var sshDelegate = function (target) { brutessh(target); };
  var ftpDelegate = function (target) { ftpcrack(target); };
  var smtpDelegate = function (target) { relaysmtp(target); };
  var httpDelegate = function (target) { httpworm(target); };
  var sqliDelegate = function (target) { sqlinject(target); };

  return [nukeDelegate, sshDelegate, ftpDelegate, smtpDelegate, httpDelegate, sqliDelegate];
}

function getMaximumNumberOfHackeablePorts() {
  var numberOfPorts = 0;

  if (fileExists('BruteSSH.exe')) { numberOfPorts++; }
  if (fileExists('FTPCrack.exe')) { numberOfPorts++; }
  if (fileExists('relaySMTP.exe')) { numberOfPorts++; }
  if (fileExists('HTTPWorm.exe')) { numberOfPorts++; }
  if (fileExists('SQLInject.exe')) { numberOfPorts++; }

  return numberOfPorts;
}

function getEligibleHosts(hosts, maxNumberOfHackeablePorts) {
  var result = [];

  print('Finding eligible hosts...');

  for (var i = 0; i < hosts.length; i++) {
    var host = hosts[i];

    if (!host.hasRootAccess && maxNumberOfHackeablePorts >= host.numberOfPortsRequired) {
      result.push(host);
    }
  }

  print('Rooting ' + result.length + ' hosts, ' + maxNumberOfHackeablePorts + ' maximum hackable ports');

  return result;
}
