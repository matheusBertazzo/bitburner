/** @param {NS} ns */
export async function main(ns) {
	let purchasedServers = ns.getPurchasedServers();
	let ram = ns.getServerMaxRam('pserv') * 2;
	let waitTimeInSeconds = ns.args[0] || 0;
	
	while (ram < Math.pow(2, 20)) {
		for (let server of purchasedServers) {
			ns.print('Started upgrade process for ' + server + ' (to ' + ram + 'GB of RAM)');
			// Wait until we have money available to purchase next upgrade
			while (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerUpgradeCost(server, ram)) {
				ns.print('Current money: ' + ns.getServerMoneyAvailable('home'));
				ns.print('Cost of next upgrade: ' + ns.getPurchasedServerUpgradeCost(server, ram));
				await ns.sleep(60000);
			}

			ns.upgradePurchasedServer(server, ram);
			ns.print('Server ' + server + ' upgraded to ' + ram + 'GB of RAM');
		}

		ram = ram * 2;

		ns.print('Waiting '+ waitTimeInSeconds +' seconds before triggering upgrades again');
		await ns.sleep(waitTimeInSeconds * 1000);
	}
}