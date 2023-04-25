/** @param {NS} ns */
export async function main(ns) {
	var hosts = JSON.parse(ns.read('hosts-info.db.txt'));
	var hackCommands = createHackCommands(ns);

	var maxNumberOfHackeablePorts = getMaximumNumberOfHackeablePorts(ns);
	var eligibleHosts = getEligibleHosts(ns, hosts, maxNumberOfHackeablePorts);

	for (var i = 0; i < eligibleHosts.length; i++) {
		var target = eligibleHosts[i];
		ns.print('Rooting ' + target.hostname + ' - ' + target.numOpenPortsRequired + ' ports required');
		rootTheirAss(hackCommands, target);
	}
}

function rootTheirAss(hackCommands, target) {
  for (var i = target.numOpenPortsRequired; i > -1; i--) {
    hackCommands[i](target.hostname);
  }
}

function createHackCommands(ns) {
  var nukeDelegate = function (target) { ns.nuke(target); };
  var sshDelegate = function (target) { ns.brutessh(target); };
  var ftpDelegate = function (target) { ns.ftpcrack(target); };
  var smtpDelegate = function (target) { ns.relaysmtp(target); };
  var httpDelegate = function (target) { ns.httpworm(target); };
  var sqliDelegate = function (target) { ns.sqlinject(target); };

  return [nukeDelegate, sshDelegate, ftpDelegate, smtpDelegate, httpDelegate, sqliDelegate];
}

function getMaximumNumberOfHackeablePorts(ns) {
  var numberOfPorts = 0;

  if (ns.fileExists('BruteSSH.exe')) { numberOfPorts++; }
  if (ns.fileExists('FTPCrack.exe')) { numberOfPorts++; }
  if (ns.fileExists('relaySMTP.exe')) { numberOfPorts++; }
  if (ns.fileExists('HTTPWorm.exe')) { numberOfPorts++; }
  if (ns.fileExists('SQLInject.exe')) { numberOfPorts++; }

  return numberOfPorts;
}

function getEligibleHosts(ns, hosts, maxNumberOfHackeablePorts) {
  var result = [];

  ns.print('Finding eligible hosts...');

  for (var i = 0; i < hosts.length; i++) {
    var host = hosts[i];

    if (!host.hasAdminRights && maxNumberOfHackeablePorts >= host.numOpenPortsRequired) {
      result.push(host);
    }
  }

  ns.print('Rooting ' + result.length + ' hosts, ' + maxNumberOfHackeablePorts + ' maximum hackable ports');

  return result;
}