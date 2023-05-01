/** @param {NS} ns */
export async function main(ns) {

	var hosts = JSON.parse(ns.read('hosts-info.db.txt'));
	var selectedHosts = selectHosts(hosts);
	var rampedUpHosts = [];

	for (let host of selectedHosts) {
		var securityThreshold = ns.getServerMinSecurityLevel(host.hostname) + 3;
		var moneyThreshold = ns.getServerMaxMoney(host.hostname) * 0.9;
		if (
			ns.getServerSecurityLevel(host.hostname) <= securityThreshold
			|| ns.getServerMoneyAvailable(host.hostname) > moneyThreshold
		) {
			rampedUpHosts.push(host.hostname);
		}
	}
	
	ns.write("ramped-up-hosts.db.txt", JSON.stringify(rampedUpHosts), "w");
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