/** @param {NS} ns */
export async function main(ns) {
	while (ns.getPlayer().money > ns.hacknet.getPurchaseNodeCost()) {
		ns.hacknet.purchaseNode();
	}
}