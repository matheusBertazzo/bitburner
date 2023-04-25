/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0] || "n00dles";
	var securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
	var moneyThreshold = ns.getServerMaxMoney(target) * 0.75;

	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThreshold) {
			// If the server's security level is above our threshold, weaken it
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
			// If the server's money is less than our threshold, grow it
			await ns.grow(target);
		} else {
			// Otherwise, hack it
			await ns.hack(target);
		}
	}
}