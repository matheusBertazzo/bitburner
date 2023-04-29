/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	var securityThreshold = ns.getServerMinSecurityLevel(target) + 3;
	var moneyThreshold = ns.getServerMaxMoney(target) * 0.9;

	while (true) {
		while (
			ns.getServerSecurityLevel(target) > securityThreshold
			|| ns.getServerMoneyAvailable(target) < moneyThreshold
		) {
			if (ns.getServerSecurityLevel(target) > securityThreshold) {
				ns.print('========================');
				ns.print('Weakening server ' + target);
				ns.print('Progress: ' + ns.getServerSecurityLevel(target) + '/' + securityThreshold);
				ns.print('========================');
				await ns.weaken(target);
				continue;
			}

			ns.print('========================');
			ns.print('Growing server ' + target);
			ns.print('Progress: ' + ns.getServerMoneyAvailable(target) + '/' + moneyThreshold);
			ns.print('========================');
			await ns.grow(target);
		}

		await ns.sleep(1000);
	}

}