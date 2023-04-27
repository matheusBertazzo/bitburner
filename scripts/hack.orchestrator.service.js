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
		var threadsPerTarget = Math.floor(maxThreads / rampedServers.length);
		var targetThreadsLeft = threadsPerTarget;
		var serverIndex = 0;

		for (let server of resourceServers) {
			ns.killall(server.hostname);
		}
		log(ns, '==============================');
		log(ns, 'Starting to hack ' + rampedServers.length + ' servers with ' + threadsPerTarget + ' threads each')
		log(ns, '==============================');

		for (let target of rampedServers) {
			var targetThreadsLeft = threadsPerTarget;

			log(ns, 'Starting threads for ' + target);

			while (targetThreadsLeft > 0 && serverIndex < resourceServers.length) {
				var server = resourceServers[serverIndex];
				var server = ns.getServer(server.hostname);
				var availableRam = server.maxRam - server.ramUsed;
				var maxThreadsInThisServer = Math.floor(availableRam / scriptRam);

				if (maxThreadsInThisServer <= 0) {
					log(ns, 'No more threads possible on server ' + serverIndex + ' - ' + server.hostname);
					serverIndex++;
					continue;
				}

				if (maxThreadsInThisServer >= targetThreadsLeft) {
					log(ns, 'Server ' + server.hostname + ' has capacity for all threads. Starting ' + targetThreadsLeft + '.ThreadsLeft: 0');
					ns.exec(
						'hack.target.js',
						server.hostname,
						targetThreadsLeft,
						target
					);
					targetThreadsLeft = 0;
				} else {
					targetThreadsLeft = targetThreadsLeft - maxThreadsInThisServer;
					log(ns, 'Server ' + server.hostname + ' does not have capacity for all threads. Starting ' + maxThreadsInThisServer + '.Threads left: ' + targetThreadsLeft);
					ns.exec(
						'hack.target.js',
						server.hostname,
						maxThreadsInThisServer,
						target
					);

					serverIndex++;
				}
				//await ns.sleep(1000);
			}
		}


		await ns.sleep(1800000);
	}
}

/** @param {NS} ns */
function selectResourceServers(ns, hosts) {
	var selectedHosts = [];
	var reservedPrivateServers = ns.getPurchasedServers().splice(0, 14);

	for (let host of hosts) {
		if (
			!host.hasAdminRights
			|| host.hostname == 'home'
			|| reservedPrivateServers.includes(host.hostname)
		) {
			continue;
		}

		selectedHosts.push(host);
	}

	return selectedHosts;
}

function log(ns, info) {
	ns.write('log.txt', info + '\n', 'a' );
}