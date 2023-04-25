/** @param {NS} ns */
export async function main(ns) {
	let amountOfNodes = ns.hacknet.numNodes();

	let lastUpgradedNodeIndex = 0;

	while (true) {
		while (ns.getPlayer().money > ns.hacknet.getLevelUpgradeCost(lastUpgradedNodeIndex, 1)) {
			ns.hacknet.upgradeLevel(lastUpgradedNodeIndex, 1);
			lastUpgradedNodeIndex++;

			if (lastUpgradedNodeIndex >= amountOfNodes) {
				lastUpgradedNodeIndex = 0;
			}
		}
		
		await ns.sleep(5000);
	}
}