/** @param {NS} ns */
export async function main(ns) {
	var servers = ns.getPurchasedServers();
	
	var ramValues = servers
		.map(server => ns.getServer(server))
		.map(server => server.maxRam);
	
	var targetRam = Math.max(... ramValues);	

	for(let server of servers){		
		var serverInfo = ns.getServer(server);
		if(serverInfo.maxRam < targetRam){	
			ns.print('Started upgrade process for ' + server + ' (to ' + targetRam + 'GB of RAM)');

			while (ns.getPlayer().money < ns.getPurchasedServerUpgradeCost(serverInfo.hostname, targetRam)) {
				ns.print('Current money: ' + ns.getPlayer().money);
				ns.print('Cost of next upgrade for ' + serverInfo.hostname + ': ' + ns.getPurchasedServerUpgradeCost(serverInfo.hostname, targetRam));
				await ns.sleep(60000);
			}

			ns.upgradePurchasedServer(serverInfo.hostname, targetRam);
			ns.print('Server ' + server + ' upgraded to ' + targetRam + 'GB of RAM');
		}
	}
}