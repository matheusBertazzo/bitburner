/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		var hosts = JSON.parse(ns.read('hosts-info.db.txt'));
		var selectedHosts = selectHosts(ns, hosts);		

		for (let host of selectedHosts) {
			var securityThreshold = ns.getServerMinSecurityLevel(host.hostname) + 3;
			var moneyThreshold = ns.getServerMaxMoney(host.hostname) * 0.9;
			
			if (ns.getServerSecurityLevel(host.hostname) > securityThreshold) {
				await ns.weaken(host.hostname);
			} else if (ns.getServerMoneyAvailable(host.hostname) < moneyThreshold) {
				await ns.grow(host.hostname);
			} else {
				if(ns.fileExists('ramped-up-hosts.db.txt')){
					var rampedHosts = JSON.parse(ns.read('ramped-up-hosts.db.txt'));
					rampedHosts.push(host.hostname);
					ns.write('ramped-up-hosts.db.txt', JSON.stringify(rampedHosts), 'w');
				} else {
					ns.write('ramped-up-hosts.db.txt', JSON.stringify([host.hostname]), 'w');
				}

				continue;
			}
		}

		await ns.sleep(60000);
	}
}

/** @param {NS} ns */
function selectHosts(ns, hosts) {
	hosts = hosts.sort(compareHackChance);
	var selectedHosts = [];
	var privateServers = ns.getPurchasedServers();

	for (let host of hosts) {
		if (
			privateServers.includes(host)
			|| host.moneyMax == 0
			|| host.hackChance < 0.3
		) {
			continue;
		}

		selectedHosts.push(host);
	}

	return selectedHosts;
}

function compareHackChance(a, b) {
	return b.hackChance - a.hackChance;
}