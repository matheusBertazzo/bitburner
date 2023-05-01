/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		var hosts = JSON.parse(ns.read('hosts-info.db.txt'));
		var selectedHosts = selectHosts(hosts);

		ns.print('========================');
		ns.print('Service started, ramping up ' + selectedHosts.length + ' servers');
		ns.print('========================');

		for (let host of selectedHosts) {
			var securityThreshold = ns.getServerMinSecurityLevel(host.hostname) + 3;
			var moneyThreshold = ns.getServerMaxMoney(host.hostname) * 0.9;

			while (
				ns.getServerSecurityLevel(host.hostname) > securityThreshold
				|| ns.getServerMoneyAvailable(host.hostname) < moneyThreshold
			) {
				if (ns.getServerSecurityLevel(host.hostname) > securityThreshold) {
					ns.print('========================');
					ns.print('Weakening server ' + host.hostname);
					ns.print('Progress: ' + ns.getServerSecurityLevel(host.hostname) + '/' + securityThreshold);
					ns.print('========================');

					await ns.weaken(host.hostname);
					continue;
				}
				ns.print('========================');
				ns.print('Growing server ' + host.hostname);
				ns.print('Progress: ' + ns.getServerMoneyAvailable(host.hostname) + '/' + moneyThreshold);
				ns.print('========================');

				await ns.grow(host.hostname);
			}

			if (ns.fileExists("ramped-up-hosts.db.txt")) {
				var rampedHosts = JSON.parse(ns.read("ramped-up-hosts.db.txt"));
				rampedHosts.push(host.hostname);
				rampedHosts = [...new Set(rampedHosts)];
				ns.write("ramped-up-hosts.db.txt", JSON.stringify(rampedHosts), "w");
			} else {
				ns.write("ramped-up-hosts.db.txt", JSON.stringify([host.hostname]), "w");
			}

		}

		ns.exec('discovery.enrich.js', 'home');
		await ns.sleep(60000);
	}
}

function selectHosts(hosts) {
	hosts = hosts.sort(compareHackChance);
	var selectedHosts = [];

	for (let host of hosts) {
		if (
			host.hostname.includes("pserv")
			|| host.moneyMax == 0
			|| host.hackChance < 0.3
			|| !host.hasAdminRights
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