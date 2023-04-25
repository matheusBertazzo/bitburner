/** @param {NS} ns */
export async function main(ns) {
	let script = "early-hack-template.js";
	let target = ns.args[0];

	let purchasedServers = ns.getPurchasedServers();

	let server;

	let ram = ns.getServerMaxRam("pserv-0");
	ram = ram * 2;
	while (ram < Math.pow(2, 20)) {
		ns.print("Starting upgrading ram to: " + ram + "GB")

		for (server of purchasedServers) {
			// Wait until we have money available to purchase next upgrade
			while (ns.getServerMoneyAvailable("home") < ns.getPurchasedServerUpgradeCost(server, ram)) {
				ns.print("Current money: " + ns.getServerMoneyAvailable("home") + "  |  Cost of next upgrade: " + ns.getPurchasedServerUpgradeCost(server, ram));
				await ns.sleep(60000);
			}

			ns.upgradePurchasedServer(server, ram);

			// Kill and re-run scripts on the new upgraded server
			ns.killall(server);
			ns.scp(script, server);
			ns.exec(script, server, getMaxThreads(ns, server, script), target);
		}

		ram = ram * 2;
	}
}

function getMaxThreads(ns, server, script) {
	var serverMaxRam = ns.getServerMaxRam(server);
	var scriptRam = ns.getScriptRam(script);
	return Math.trunc(serverMaxRam / scriptRam);
}