/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		var hosts = JSON.parse(ns.read('hosts-info.db.txt'));
		var rampedServers = JSON.parse(ns.read('ramped-up-hosts.db.txt'));
		var resourceServers = selectResourceServers(ns, hosts);

		var availableRam = resourceServers
			.map(server => server.maxRam)
			.reduce((prev, next) => prev + next);

		var scriptRam = ns.getScriptRam('hack.target.js');
		var maxThreads = Math.floor(availableRam / scriptRam);
		var maxThreadsPerTarget = Math.floor(maxThreads / rampedServers.length);
		var serverIndex = 0;

		for (let server of resourceServers) {
			ns.killall(server.hostname);
		}

		log(ns, '==============================');
		log(ns, 'Starting to hack ' + rampedServers.length + ' servers with a max of ' + maxThreadsPerTarget + ' threads each')
		log(ns, '==============================');

		for (let target of rampedServers) {
			var targetHackThreadsLeft = getIdealHackThreadsForTarget(ns, target, maxThreadsPerTarget);

			log(ns, 'Starting threads for ' + target);

			while (targetHackThreadsLeft > 0 && serverIndex < resourceServers.length) {
				var server = resourceServers[serverIndex];
				var server = ns.getServer(server.hostname);
				var availableRam = server.maxRam - server.ramUsed;
				var maxThreadsInThisServer = Math.floor(availableRam / scriptRam);

				if (maxThreadsInThisServer <= 0) {
					log(ns, 'No more threads possible on server ' + serverIndex + ' - ' + server.hostname);
					serverIndex++;
					continue;
				}

				if (maxThreadsInThisServer >= targetHackThreadsLeft) {
					log(ns, 'Server ' + server.hostname + ' has capacity for all threads. Starting ' + targetHackThreadsLeft + '.ThreadsLeft: 0');
					ns.exec(
						'hack.target.js',
						server.hostname,
						targetHackThreadsLeft,
						target
					);
					targetHackThreadsLeft = 0;
				} else {
					targetHackThreadsLeft = targetHackThreadsLeft - maxThreadsInThisServer;
					log(ns, 'Server ' + server.hostname + ' does not have capacity for all threads. Starting ' + maxThreadsInThisServer + '.Threads left: ' + targetHackThreadsLeft);
					ns.exec(
						'hack.target.js',
						server.hostname,
						maxThreadsInThisServer,
						target
					);

					serverIndex++;
				}				
			}
		}


		await ns.sleep(1800000);
	}
}

/** @param {NS} ns */
function getIdealHackThreadsForTarget(ns, targetHostname, maxThreadsPerTarget) {
	var hackChanceForTarget = ns.hackAnalyzeChance(targetHostname);

	if (hackChanceForTarget > 0.9) {
		return Math.min(10, maxThreadsPerTarget);
	} else if (hackChanceForTarget > 0.8) {
		return Math.min(20, maxThreadsPerTarget);
	}

	return Math.min(30, maxThreadsPerTarget);
}

/** @param {NS} ns */
function selectResourceServers(ns, hosts) {
	var selectedHosts = [];
	var privateServers = ns.getPurchasedServers();
	
	for (let host of hosts) {
		if (
			!host.hasAdminRights 
			|| host.hostname == 'home' 
			|| privateServers.includes(host.hostname)
		) {
			continue;
		}

		selectedHosts.push(host);
	}

	return selectedHosts;
}

/** @param {NS} ns */
function log(ns, info) {
	var date = new Date();
	var info = '[' + date.toISOString() + '] ' + info + '\n'
	ns.write('/logs/hack.orchestrator.service.log.txt', info, 'a');
}