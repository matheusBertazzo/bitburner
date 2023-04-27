/** @param {NS} ns */
export async function main(ns) {
	let targetProperty = ns.args[0] || "level";
	let amountOfNodes = ns.hacknet.numNodes();

	let lastUpgradedNodeIndex = 0;

	while (true) {
		while (ns.getPlayer().money > getUpgradeCost(ns, targetProperty, lastUpgradedNodeIndex)) {
			upgradeNode(ns, targetProperty, lastUpgradedNodeIndex);
			lastUpgradedNodeIndex++;

			if (lastUpgradedNodeIndex >= amountOfNodes) {
				lastUpgradedNodeIndex = 0;
			}
		}

		await ns.sleep(5000);
	}
}

function getUpgradeCost(ns, targetProperty, nodeIndex){
	if(targetProperty == "level"){
		return ns.hacknet.getLevelUpgradeCost(nodeIndex, 1);
	} else if (targetProperty == "ram") {
		return ns.hacknet.getRamUpgradeCost(nodeIndex, 1);
	} else {
		return ns.hacknet.getCoreUpgradeCost(nodeIndex, 1);
	}
}

/** @param {NS} ns */
function upgradeNode(ns, targetProperty, nodeIndex) {
	if(targetProperty == "level"){
		ns.hacknet.upgradeLevel(nodeIndex, 1);
	} else if (targetProperty == "ram") {
		ns.hacknet.upgradeRam(nodeIndex, 1);
	} else {
		ns.hacknet.upgradeCore(nodeIndex, 1);
	}
}