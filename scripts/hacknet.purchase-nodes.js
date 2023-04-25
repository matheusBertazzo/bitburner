/** @param {NS} ns */
export async function main(ns) {
	while (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) {
		let newNodeIndex = ns.hacknet.purchaseNode();
		amountOfNodes++;
		let node = ns.hacknet.getNodeStats(newNodeIndex);
	}
}